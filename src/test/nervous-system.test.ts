/**
 * nervous-system.test.ts — Gate test for Nervous System v1
 *
 * Phase Gate (pass/fail):
 * 1. DETERMINISTIC: Same input → same event ID + same seed
 * 2. IDEMPOTENT: Same event ID published twice → stored only once
 * 3. REPLAYABLE: Client reconnects → replays missed events from cursor
 *
 * These are the non-negotiable properties of the spine.
 * If any of these fail, the gate does not pass.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createInMemoryBus } from '../lib/events/bus';
import { makeEventId, seedFromId, fnv1a32 } from '../lib/events/id';
import { createReplaySession } from '../lib/events/replay';
import { createNexusClient } from '../lib/events/client';
import { validateEvent } from '../lib/events/validation';
import type {
  NexusEvent,
  TribunalVerdictPayload,
  AtlasMarkerPayload,
  IndexEntryPayload,
  NewsBroadcastPayload,
} from '../types/sacred-flow';

// ── Helpers ──

function makeTribunalEvent(
  topic: string,
  timestamp: string,
  bus?: ReturnType<typeof createInMemoryBus>,
): NexusEvent<TribunalVerdictPayload> {
  const payload: TribunalVerdictPayload = {
    topic,
    judges: ['zeta-9', 'kronos', 'nanobanana'],
    verdict: 'approved',
    reasoning: 'Evidence supports action',
    flowTarget: 'atlas',
  };

  const id = makeEventId('tribunal.verdict', 'tribunal', timestamp, payload);

  return {
    id,
    type: 'tribunal.verdict',
    createdAt: timestamp,
    source: 'tribunal',
    geo: { lat: 48.8566, lon: 2.3522 },
    severity: 0.8,
    payload,
    confidence: 0.92,
    seed: seedFromId(id),
    version: 1,
  };
}

// ── Gate Tests ──

describe('Nervous System v1 — Phase Gate', () => {
  let bus: ReturnType<typeof createInMemoryBus>;

  beforeEach(() => {
    bus = createInMemoryBus();
  });

  // ════════════════════════════════════════════════════
  // GATE 1: DETERMINISTIC
  // ════════════════════════════════════════════════════

  describe('GATE 1: Deterministic', () => {
    it('same input produces the same event ID — always', () => {
      const ts = '2026-03-17T12:00:00.000Z';
      const event1 = makeTribunalEvent('Climate Policy', ts);
      const event2 = makeTribunalEvent('Climate Policy', ts);

      expect(event1.id).toBe(event2.id);
    });

    it('same event ID produces the same visual seed — always', () => {
      const ts = '2026-03-17T12:00:00.000Z';
      const event1 = makeTribunalEvent('Climate Policy', ts);
      const event2 = makeTribunalEvent('Climate Policy', ts);

      expect(event1.seed).toBe(event2.seed);
      expect(event1.seed).toBeTypeOf('number');
      expect(event1.seed).toBeGreaterThan(0);
    });

    it('different input produces different event IDs', () => {
      const ts = '2026-03-17T12:00:00.000Z';
      const event1 = makeTribunalEvent('Climate Policy', ts);
      const event2 = makeTribunalEvent('Trade War', ts);

      expect(event1.id).not.toBe(event2.id);
      expect(event1.seed).not.toBe(event2.seed);
    });

    it('fnv1a32 is stable across calls', () => {
      const input = 'tribunal.verdict|tribunal|2026-03-17T12:00:00.000Z';
      const hash1 = fnv1a32(input);
      const hash2 = fnv1a32(input);

      expect(hash1).toBe(hash2);
      expect(hash1).toBeTypeOf('number');
    });

    it('two Atlas clients seeing the same event get identical id/geo/seed', () => {
      const ts = '2026-03-17T12:00:00.000Z';
      const event = makeTribunalEvent('Climate Policy', ts);
      bus.publish(event as NexusEvent);

      // Client 1 gets the event
      const fromBus1 = bus.getById(event.id);
      // Client 2 gets the event
      const fromBus2 = bus.getById(event.id);

      expect(fromBus1).toBeDefined();
      expect(fromBus2).toBeDefined();
      expect(fromBus1!.id).toBe(fromBus2!.id);
      expect(fromBus1!.geo).toEqual(fromBus2!.geo);
      expect(fromBus1!.seed).toBe(fromBus2!.seed);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 2: IDEMPOTENT
  // ════════════════════════════════════════════════════

  describe('GATE 2: Idempotent', () => {
    it('publishing the same event twice → stored only once', () => {
      const event = makeTribunalEvent('Climate Policy', '2026-03-17T12:00:00.000Z');

      const first = bus.publish(event as NexusEvent);
      const second = bus.publish(event as NexusEvent);

      expect(first).toBe(true);
      expect(second).toBe(false);
      expect(bus.size()).toBe(1);
    });

    it('subscriber is NOT notified on duplicate publish', () => {
      const received: NexusEvent[] = [];
      bus.subscribe({}, (e) => received.push(e));

      const event = makeTribunalEvent('Climate Policy', '2026-03-17T12:00:00.000Z');

      bus.publish(event as NexusEvent);
      bus.publish(event as NexusEvent); // duplicate
      bus.publish(event as NexusEvent); // duplicate

      expect(received).toHaveLength(1);
    });

    it('events with different content but same structure get unique IDs', () => {
      const e1 = makeTribunalEvent('Topic A', '2026-03-17T12:00:00.000Z');
      const e2 = makeTribunalEvent('Topic B', '2026-03-17T12:00:00.000Z');

      bus.publish(e1 as NexusEvent);
      bus.publish(e2 as NexusEvent);

      expect(bus.size()).toBe(2);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 3: REPLAYABLE
  // ════════════════════════════════════════════════════

  describe('GATE 3: Replayable', () => {
    it('replay from beginning returns all events in order', () => {
      const e1 = makeTribunalEvent('Event 1', '2026-03-17T12:00:00.000Z');
      const e2 = makeTribunalEvent('Event 2', '2026-03-17T12:01:00.000Z');
      const e3 = makeTribunalEvent('Event 3', '2026-03-17T12:02:00.000Z');

      bus.publish(e1 as NexusEvent);
      bus.publish(e2 as NexusEvent);
      bus.publish(e3 as NexusEvent);

      const replayed = bus.replay({ limit: 100 });

      expect(replayed).toHaveLength(3);
      expect(replayed[0].id).toBe(e1.id);
      expect(replayed[1].id).toBe(e2.id);
      expect(replayed[2].id).toBe(e3.id);
    });

    it('replay with afterId cursor returns only events after that ID', () => {
      const e1 = makeTribunalEvent('Event 1', '2026-03-17T12:00:00.000Z');
      const e2 = makeTribunalEvent('Event 2', '2026-03-17T12:01:00.000Z');
      const e3 = makeTribunalEvent('Event 3', '2026-03-17T12:02:00.000Z');

      bus.publish(e1 as NexusEvent);
      bus.publish(e2 as NexusEvent);
      bus.publish(e3 as NexusEvent);

      const replayed = bus.replay({ afterId: e1.id, limit: 100 });

      expect(replayed).toHaveLength(2);
      expect(replayed[0].id).toBe(e2.id);
      expect(replayed[1].id).toBe(e3.id);
    });

    it('replay with since timestamp returns events from that point', () => {
      const e1 = makeTribunalEvent('Event 1', '2026-03-17T12:00:00.000Z');
      const e2 = makeTribunalEvent('Event 2', '2026-03-17T12:01:00.000Z');
      const e3 = makeTribunalEvent('Event 3', '2026-03-17T12:02:00.000Z');

      bus.publish(e1 as NexusEvent);
      bus.publish(e2 as NexusEvent);
      bus.publish(e3 as NexusEvent);

      const replayed = bus.replay({ since: '2026-03-17T12:01:00.000Z', limit: 100 });

      expect(replayed).toHaveLength(2);
      expect(replayed[0].id).toBe(e2.id);
      expect(replayed[1].id).toBe(e3.id);
    });

    it('ReplaySession tracks cursor across multiple fetchNext calls', () => {
      const e1 = makeTribunalEvent('Event 1', '2026-03-17T12:00:00.000Z');
      const e2 = makeTribunalEvent('Event 2', '2026-03-17T12:01:00.000Z');
      const e3 = makeTribunalEvent('Event 3', '2026-03-17T12:02:00.000Z');

      bus.publish(e1 as NexusEvent);
      bus.publish(e2 as NexusEvent);
      bus.publish(e3 as NexusEvent);

      const session = createReplaySession(bus);

      // First fetch: get 2 events
      const batch1 = session.fetchNext(2);
      expect(batch1).toHaveLength(2);
      expect(session.getCursor()).toBe(e2.id);

      // Second fetch: get remaining
      const batch2 = session.fetchNext(2);
      expect(batch2).toHaveLength(1);
      expect(batch2[0].id).toBe(e3.id);
      expect(session.getCursor()).toBe(e3.id);

      // Third fetch: nothing left
      const batch3 = session.fetchNext(2);
      expect(batch3).toHaveLength(0);
    });

    it('client reconnect scenario: subscribe late, replay missed events', () => {
      // Tribunal emits 3 events before Atlas connects
      const e1 = makeTribunalEvent('Event 1', '2026-03-17T12:00:00.000Z');
      const e2 = makeTribunalEvent('Event 2', '2026-03-17T12:01:00.000Z');
      const e3 = makeTribunalEvent('Event 3', '2026-03-17T12:02:00.000Z');

      bus.publish(e1 as NexusEvent);
      bus.publish(e2 as NexusEvent);
      bus.publish(e3 as NexusEvent);

      // Atlas connects late — replays everything
      const atlas = createNexusClient({
        organ: 'atlas',
        types: ['tribunal.verdict'],
        bus,
      });

      const replaySession = atlas.replay();
      const missed = replaySession.fetchNext(100);

      expect(missed).toHaveLength(3);
      expect(missed[0].id).toBe(e1.id);
      expect(missed[2].id).toBe(e3.id);

      // Then subscribes for live events
      const live: NexusEvent[] = [];
      atlas.subscribe((e) => live.push(e));

      // New event arrives
      const e4 = makeTribunalEvent('Event 4', '2026-03-17T12:03:00.000Z');
      bus.publish(e4 as NexusEvent);

      expect(live).toHaveLength(1);
      expect(live[0].id).toBe(e4.id);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 4: VALIDATION (ingress protection)
  // ════════════════════════════════════════════════════

  describe('GATE 4: Validation', () => {
    it('rejects events with missing required fields', () => {
      const result = validateEvent({ id: '', type: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('rejects events with out-of-range severity', () => {
      const event = makeTribunalEvent('Test', '2026-03-17T12:00:00.000Z');
      const bad = { ...event, severity: 1.5 };
      const result = validateEvent(bad);
      expect(result.valid).toBe(false);
    });

    it('accepts valid events', () => {
      const event = makeTribunalEvent('Test', '2026-03-17T12:00:00.000Z');
      const result = validateEvent(event);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('bus rejects invalid events at ingress', () => {
      const bad = { id: 'bad', type: 'invalid', source: 'fake' } as unknown as NexusEvent;
      const accepted = bus.publish(bad);
      expect(accepted).toBe(false);
      expect(bus.size()).toBe(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 5: SACRED FLOW (Tribunal → Atlas subscriber)
  // ════════════════════════════════════════════════════

  describe('GATE 5: Sacred Flow — Tribunal → Atlas', () => {
    it('Atlas subscriber receives Tribunal verdict with matching geo + seed', () => {
      const tribunal = createNexusClient({ organ: 'tribunal', bus });
      const atlas = createNexusClient({
        organ: 'atlas',
        types: ['tribunal.verdict'],
        bus,
      });

      const received: NexusEvent[] = [];
      atlas.subscribe((e) => received.push(e));

      const emitted = tribunal.emit<TribunalVerdictPayload>(
        'tribunal.verdict',
        {
          topic: 'Climate Crisis 2026',
          judges: ['zeta-9', 'kronos', 'nanobanana'],
          verdict: 'approved',
          reasoning: 'Satellite data confirms global impact',
          flowTarget: 'atlas',
        },
        {
          geo: { lat: -23.5505, lon: -46.6333 },
          severity: 0.9,
          confidence: 0.95,
        },
      );

      expect(emitted).not.toBeNull();
      expect(received).toHaveLength(1);

      // Atlas sees the EXACT same event Tribunal emitted
      expect(received[0].id).toBe(emitted!.id);
      expect(received[0].geo).toEqual(emitted!.geo);
      expect(received[0].seed).toBe(emitted!.seed);
      expect(received[0].source).toBe('tribunal');
      expect(received[0].type).toBe('tribunal.verdict');
    });

    it('Atlas does NOT receive events it did not subscribe to', () => {
      const atlas = createNexusClient({
        organ: 'atlas',
        types: ['tribunal.verdict'],
        bus,
      });

      const received: NexusEvent[] = [];
      atlas.subscribe((e) => received.push(e));

      // Publish a news.broadcast event (Atlas doesn't subscribe to this)
      const newsEvent: NexusEvent = {
        id: 'nxe_news_test',
        type: 'news.broadcast',
        createdAt: new Date().toISOString(),
        source: 'news',
        severity: 0.5,
        payload: { title: 'Test', content: 'Test', live: false },
        confidence: 0.8,
        seed: 12345,
        version: 1,
      };

      bus.publish(newsEvent);
      expect(received).toHaveLength(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 5b: SACRED FLOW (Atlas → Index)
  // ════════════════════════════════════════════════════

  describe('GATE 5b: Sacred Flow — Atlas → Index', () => {
    it('Index subscriber receives atlas.marker events and publishes index.entry', () => {
      const atlas = createNexusClient({ organ: 'atlas', bus });
      const index = createNexusClient({
        organ: 'index',
        types: ['atlas.marker'],
        bus,
      });

      const markersSeen: NexusEvent[] = [];
      index.subscribe((e) => {
        markersSeen.push(e);

        // Index processes the atlas marker into an index entry
        const ap = e.payload as AtlasMarkerPayload;
        index.emit<IndexEntryPayload>('index.entry', {
          title: `${ap.label} [${ap.dataSource}]`,
          category: ap.category,
          rank: e.severity * e.confidence,
        }, {
          geo: e.geo,
          severity: e.severity,
          confidence: e.confidence,
        });
      });

      // Atlas publishes a sensor reading
      const emitted = atlas.emit<AtlasMarkerPayload>(
        'atlas.marker',
        {
          label: 'Temperature anomaly',
          category: 'climate',
          dataSource: 'climate',
          value: 32.5,
          unit: '°C',
        },
        {
          geo: { lat: 14.93, lon: -23.51 },
          severity: 0.8,
          confidence: 0.9,
        },
      );

      // Verify: Index received the atlas marker
      expect(markersSeen).toHaveLength(1);
      expect(markersSeen[0].id).toBe(emitted!.id);
      expect(markersSeen[0].geo).toEqual({ lat: 14.93, lon: -23.51 });

      // Verify: Index published an index.entry to the bus
      const allEvents = bus.replay({ limit: 100 });
      const indexEntries = allEvents.filter((e) => e.type === 'index.entry');
      expect(indexEntries).toHaveLength(1);
      expect((indexEntries[0].payload as IndexEntryPayload).title).toContain('Temperature anomaly');
      expect((indexEntries[0].payload as IndexEntryPayload).category).toBe('climate');
    });

    it('Atlas markers are deterministic and idempotent', () => {
      const atlas = createNexusClient({ organ: 'atlas', bus });

      const payload: AtlasMarkerPayload = {
        label: 'CO2 reading',
        category: 'climate',
        dataSource: 'climate',
        value: 421.5,
        unit: 'ppm',
      };

      const first = atlas.emit('atlas.marker', payload, { severity: 0.6, confidence: 0.95 });
      const duplicate = atlas.emit('atlas.marker', payload, { severity: 0.6, confidence: 0.95 });

      expect(first).not.toBeNull();
      expect(duplicate).toBeNull(); // rejected as duplicate
    });

    it('Full Atlas Sacred Flow: Atlas → Index → News', () => {
      const atlas = createNexusClient({ organ: 'atlas', bus });
      const index = createNexusClient({
        organ: 'index',
        types: ['atlas.marker'],
        bus,
      });
      const news = createNexusClient({
        organ: 'news',
        types: ['index.entry'],
        bus,
      });

      // Index processes atlas markers
      index.subscribe((e) => {
        const ap = e.payload as AtlasMarkerPayload;
        index.emit<IndexEntryPayload>('index.entry', {
          title: ap.label,
          category: ap.category,
          rank: e.severity * e.confidence,
        }, {
          geo: e.geo,
          severity: e.severity,
          confidence: e.confidence,
        });
      });

      // News narrates index entries
      news.subscribe((e) => {
        const ip = e.payload as IndexEntryPayload;
        news.emit<NewsBroadcastPayload>('news.broadcast', {
          title: `ALERT: ${ip.title}`,
          content: `Atlas sensor data: ${ip.title} — severity ${e.severity.toFixed(1)}`,
          live: true,
        }, {
          severity: e.severity,
          confidence: e.confidence,
        });
      });

      // Atlas emits a sensor event
      atlas.emit<AtlasMarkerPayload>(
        'atlas.marker',
        {
          label: 'Earthquake detected',
          category: 'security',
          dataSource: 'geopolitics',
          value: 6.2,
          unit: 'magnitude',
        },
        {
          geo: { lat: 35.68, lon: 139.69 },
          severity: 0.9,
          confidence: 0.85,
        },
      );

      // Verify full flow on the bus
      const allEvents = bus.replay({ limit: 100 });
      expect(allEvents).toHaveLength(3);

      expect(allEvents[0].type).toBe('atlas.marker');
      expect(allEvents[0].source).toBe('atlas');
      expect(allEvents[0].geo).toEqual({ lat: 35.68, lon: 139.69 });

      expect(allEvents[1].type).toBe('index.entry');
      expect(allEvents[1].source).toBe('index');

      expect(allEvents[2].type).toBe('news.broadcast');
      expect(allEvents[2].source).toBe('news');
      expect((allEvents[2].payload as NewsBroadcastPayload).title).toContain('Earthquake detected');
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 6: LOGGED (Index consumes bus events)
  // ════════════════════════════════════════════════════

  describe('GATE 6: Logged — Index consumes bus events', () => {
    it('Index subscriber receives tribunal.verdict and publishes index.entry', () => {
      // Simulate the Index organ subscribing to tribunal verdicts
      const index = createNexusClient({
        organ: 'index',
        types: ['tribunal.verdict'],
        bus,
      });

      const verdictsSeen: NexusEvent[] = [];
      index.subscribe((e) => {
        verdictsSeen.push(e);

        // Index processes the verdict and publishes an index.entry
        const payload: IndexEntryPayload = {
          title: (e.payload as TribunalVerdictPayload).topic,
          category: 'verdict',
          rank: e.severity * e.confidence,
          linkedVerdictId: e.id,
        };

        index.emit<IndexEntryPayload>('index.entry', payload, {
          severity: e.severity,
          confidence: e.confidence,
        });
      });

      // Tribunal publishes a verdict
      const tribunal = createNexusClient({ organ: 'tribunal', bus });
      const emitted = tribunal.emit<TribunalVerdictPayload>(
        'tribunal.verdict',
        {
          topic: 'Climate Crisis 2026',
          judges: ['zeta-9', 'kronos', 'nanobanana'],
          verdict: 'approved',
          reasoning: 'Evidence supports action',
          flowTarget: 'atlas',
        },
        { severity: 0.8, confidence: 0.9 },
      );

      // Verify: Index received the verdict
      expect(verdictsSeen).toHaveLength(1);
      expect(verdictsSeen[0].id).toBe(emitted!.id);

      // Verify: Index published an index.entry event to the bus
      const allEvents = bus.replay({ limit: 100 });
      const indexEntries = allEvents.filter((e) => e.type === 'index.entry');
      expect(indexEntries).toHaveLength(1);
      expect((indexEntries[0].payload as IndexEntryPayload).linkedVerdictId).toBe(emitted!.id);
      expect((indexEntries[0].payload as IndexEntryPayload).title).toBe('Climate Crisis 2026');
      expect(indexEntries[0].source).toBe('index');
    });

    it('index.entry events are idempotent (same verdict processed twice)', () => {
      const index = createNexusClient({ organ: 'index', bus });

      // Publish the same index.entry twice
      const payload: IndexEntryPayload = {
        title: 'Duplicate Test',
        category: 'verdict',
        rank: 0.72,
        linkedVerdictId: 'nxe_test_123',
      };

      const first = index.emit('index.entry', payload, { severity: 0.8, confidence: 0.9 });
      const second = index.emit('index.entry', payload, { severity: 0.8, confidence: 0.9 });

      // First succeeds, second is duplicate (same content → same ID → rejected)
      expect(first).not.toBeNull();
      expect(second).toBeNull();
      expect(bus.size()).toBe(1);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 7: NARRATABLE (News constructs narrative from Index)
  // ════════════════════════════════════════════════════

  describe('GATE 7: Narratable — News constructs narrative from Index', () => {
    it('News subscriber receives index.entry and publishes news.broadcast', () => {
      // Set up the full Sacred Flow chain
      const index = createNexusClient({ organ: 'index', bus });
      const news = createNexusClient({
        organ: 'news',
        types: ['index.entry'],
        bus,
      });

      const indexEntriesSeen: NexusEvent[] = [];
      news.subscribe((e) => {
        indexEntriesSeen.push(e);

        // News transforms index entry into a human-readable broadcast
        const indexPayload = e.payload as IndexEntryPayload;
        const broadcastPayload: NewsBroadcastPayload = {
          title: `BREAKING: ${indexPayload.title}`,
          content: `[Severity: ${e.severity.toFixed(1)}] ${indexPayload.title} — ranked #${indexPayload.rank.toFixed(2)} in Index.`,
          live: false,
          linkedVerdictId: indexPayload.linkedVerdictId,
        };

        news.emit<NewsBroadcastPayload>('news.broadcast', broadcastPayload, {
          severity: e.severity,
          confidence: e.confidence,
        });
      });

      // Index publishes an entry
      index.emit<IndexEntryPayload>('index.entry', {
        title: 'Climate Crisis 2026',
        category: 'verdict',
        rank: 0.72,
        linkedVerdictId: 'nxe_tribunal_verdict_abc',
      }, { severity: 0.8, confidence: 0.9 });

      // Verify: News received the index entry
      expect(indexEntriesSeen).toHaveLength(1);

      // Verify: News published a broadcast
      const allEvents = bus.replay({ limit: 100 });
      const broadcasts = allEvents.filter((e) => e.type === 'news.broadcast');
      expect(broadcasts).toHaveLength(1);

      const broadcastPayload = broadcasts[0].payload as NewsBroadcastPayload;
      expect(broadcastPayload.title).toContain('Climate Crisis 2026');
      expect(broadcastPayload.content).toContain('Severity');
      expect(broadcastPayload.linkedVerdictId).toBe('nxe_tribunal_verdict_abc');
      expect(broadcasts[0].source).toBe('news');
    });

    it('Full Sacred Flow: Tribunal → Index → News (end-to-end)', () => {
      // Wire up all three organs
      const tribunal = createNexusClient({ organ: 'tribunal', bus });
      const index = createNexusClient({
        organ: 'index',
        types: ['tribunal.verdict'],
        bus,
      });
      const news = createNexusClient({
        organ: 'news',
        types: ['index.entry'],
        bus,
      });

      // Index processes verdicts → publishes index.entry
      index.subscribe((verdictEvent) => {
        const vp = verdictEvent.payload as TribunalVerdictPayload;
        index.emit<IndexEntryPayload>('index.entry', {
          title: vp.topic,
          category: 'verdict',
          rank: verdictEvent.severity * verdictEvent.confidence,
          linkedVerdictId: verdictEvent.id,
        }, {
          severity: verdictEvent.severity,
          confidence: verdictEvent.confidence,
        });
      });

      // News narrates index entries → publishes news.broadcast
      news.subscribe((indexEvent) => {
        const ip = indexEvent.payload as IndexEntryPayload;
        news.emit<NewsBroadcastPayload>('news.broadcast', {
          title: `NEXUS REPORT: ${ip.title}`,
          content: `The Tribunal has ${ip.linkedVerdictId ? 'ruled' : 'noted'} on "${ip.title}".`,
          live: false,
          linkedVerdictId: ip.linkedVerdictId,
        }, {
          severity: indexEvent.severity,
          confidence: indexEvent.confidence,
        });
      });

      // Tribunal emits a verdict
      const verdict = tribunal.emit<TribunalVerdictPayload>(
        'tribunal.verdict',
        {
          topic: 'Global Water Crisis',
          judges: ['zeta-9', 'kronos', 'nanobanana'],
          verdict: 'needs-review',
          reasoning: 'Insufficient data from 3 continents',
          flowTarget: 'atlas',
        },
        { severity: 0.9, confidence: 0.85 },
      );

      // Verify the complete Sacred Flow on the bus
      const allEvents = bus.replay({ limit: 100 });
      expect(allEvents).toHaveLength(3);

      // Event 1: tribunal.verdict
      expect(allEvents[0].type).toBe('tribunal.verdict');
      expect(allEvents[0].source).toBe('tribunal');

      // Event 2: index.entry (logged)
      expect(allEvents[1].type).toBe('index.entry');
      expect(allEvents[1].source).toBe('index');
      expect((allEvents[1].payload as IndexEntryPayload).linkedVerdictId).toBe(verdict!.id);

      // Event 3: news.broadcast (narratable)
      expect(allEvents[2].type).toBe('news.broadcast');
      expect(allEvents[2].source).toBe('news');
      expect((allEvents[2].payload as NewsBroadcastPayload).title).toContain('Global Water Crisis');

      // The full flow is traceable: Tribunal → Index → News
      // All events share the same verdict lineage
      expect((allEvents[2].payload as NewsBroadcastPayload).linkedVerdictId).toBe(verdict!.id);
    });
  });
});
