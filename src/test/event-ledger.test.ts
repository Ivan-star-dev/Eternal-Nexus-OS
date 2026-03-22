/**
 * event-ledger.test.ts — Gate tests for C4 Nervous System Observability
 *
 * Tests:
 * 1. RECORDING: events are captured correctly
 * 2. BOUNDED RETENTION: ring buffer evicts oldest at capacity
 * 3. FILTERING: type + source filters work independently and combined
 * 4. STATS: counts by type + source are accurate
 * 5. REPLAY: recorded events replayed in order, bus idempotency preserved
 * 6. CLEAR: ledger resets fully
 * 7. BUS WIRING: attachLedger captures all published events
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createEventLedger, attachLedger } from '../lib/events/ledger';
import { createInMemoryBus } from '../lib/events/bus';
import { makeEventId, seedFromId } from '../lib/events/id';
import type { NexusEvent, TribunalVerdictPayload, AtlasMarkerPayload, IndexEntryPayload } from '../types/sacred-flow';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeVerdict(topic: string, ts: string): NexusEvent<TribunalVerdictPayload> {
  const payload: TribunalVerdictPayload = {
    topic,
    judges: ['zeta-9'],
    verdict: 'approved',
    reasoning: 'test',
    flowTarget: 'atlas',
  };
  const id = makeEventId('tribunal.verdict', 'tribunal', ts, payload);
  return {
    id,
    type: 'tribunal.verdict',
    createdAt: ts,
    source: 'tribunal',
    severity: 0.8,
    payload,
    confidence: 0.9,
    seed: seedFromId(id),
    version: 1,
  };
}

function makeAtlasMarker(label: string, ts: string): NexusEvent<AtlasMarkerPayload> {
  const payload: AtlasMarkerPayload = {
    label,
    category: 'climate',
    dataSource: 'climate',
    value: 42,
    unit: '°C',
  };
  const id = makeEventId('atlas.marker', 'atlas', ts, payload);
  return {
    id,
    type: 'atlas.marker',
    createdAt: ts,
    source: 'atlas',
    geo: { lat: 10, lon: 20 },
    severity: 0.5,
    payload,
    confidence: 0.95,
    seed: seedFromId(id),
    version: 1,
  };
}

function makeIndexEntry(title: string, ts: string): NexusEvent<IndexEntryPayload> {
  const payload: IndexEntryPayload = { title, category: 'verdict', rank: 0.7 };
  const id = makeEventId('index.entry', 'index', ts, payload);
  return {
    id,
    type: 'index.entry',
    createdAt: ts,
    source: 'index',
    severity: 0.6,
    payload,
    confidence: 0.85,
    seed: seedFromId(id),
    version: 1,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('C4: Event Ledger — Nervous System Observability', () => {
  let ledger: ReturnType<typeof createEventLedger>;

  beforeEach(() => {
    ledger = createEventLedger(5); // small capacity to test eviction
  });

  // ════════════════════════════════════════════════════
  // GATE 1: RECORDING
  // ════════════════════════════════════════════════════

  describe('Recording', () => {
    it('records an event with correct fields', () => {
      const e = makeVerdict('Climate Crisis', '2026-03-18T10:00:00.000Z');
      ledger.record(e as NexusEvent);

      expect(ledger.size()).toBe(1);
      const entries = ledger.getAll();
      expect(entries[0].event.id).toBe(e.id);
      expect(entries[0].event.type).toBe('tribunal.verdict');
      expect(entries[0].seq).toBe(0);
      expect(entries[0].recordedAt).toBeGreaterThan(0);
    });

    it('records multiple events in insertion order', () => {
      const e1 = makeVerdict('A', '2026-03-18T10:00:00.000Z');
      const e2 = makeAtlasMarker('B', '2026-03-18T10:01:00.000Z');
      const e3 = makeIndexEntry('C', '2026-03-18T10:02:00.000Z');

      ledger.record(e1 as NexusEvent);
      ledger.record(e2 as NexusEvent);
      ledger.record(e3 as NexusEvent);

      const entries = ledger.getAll();
      expect(entries).toHaveLength(3);
      expect(entries[0].event.id).toBe(e1.id);
      expect(entries[1].event.id).toBe(e2.id);
      expect(entries[2].event.id).toBe(e3.id);
      expect(entries[0].seq).toBe(0);
      expect(entries[1].seq).toBe(1);
      expect(entries[2].seq).toBe(2);
    });

    it('getAll returns a defensive copy (mutations do not affect ledger)', () => {
      const e = makeVerdict('test', '2026-03-18T10:00:00.000Z');
      ledger.record(e as NexusEvent);

      const copy = ledger.getAll();
      copy.pop();

      expect(ledger.size()).toBe(1); // internal state unchanged
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 2: BOUNDED RETENTION (ring buffer)
  // ════════════════════════════════════════════════════

  describe('Bounded retention (ring buffer)', () => {
    it('evicts oldest events when capacity is exceeded', () => {
      // capacity = 5, add 7
      for (let i = 0; i < 7; i++) {
        ledger.record(makeVerdict(`Event ${i}`, `2026-03-18T10:0${i}:00.000Z`) as NexusEvent);
      }

      expect(ledger.size()).toBe(5); // capped
    });

    it('tracks eviction count in stats', () => {
      for (let i = 0; i < 7; i++) {
        ledger.record(makeVerdict(`Event ${i}`, `2026-03-18T10:0${i}:00.000Z`) as NexusEvent);
      }

      const stats = ledger.stats();
      expect(stats.evicted).toBe(2); // 7 - 5 = 2 evicted
      expect(stats.capacity).toBe(5);
    });

    it('oldest events are the ones evicted', () => {
      const events = Array.from({ length: 7 }, (_, i) =>
        makeVerdict(`Event ${i}`, `2026-03-18T10:0${i}:00.000Z`),
      );

      for (const e of events) ledger.record(e as NexusEvent);

      const remaining = ledger.getAll().map((e) => (e.event.payload as TribunalVerdictPayload).topic);
      expect(remaining).toEqual(['Event 2', 'Event 3', 'Event 4', 'Event 5', 'Event 6']);
    });

    it('does not evict when under capacity', () => {
      for (let i = 0; i < 5; i++) {
        ledger.record(makeVerdict(`Event ${i}`, `2026-03-18T10:0${i}:00.000Z`) as NexusEvent);
      }

      expect(ledger.stats().evicted).toBe(0);
      expect(ledger.size()).toBe(5);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 3: FILTERING
  // ════════════════════════════════════════════════════

  describe('Filtering', () => {
    beforeEach(() => {
      ledger = createEventLedger(20);
      ledger.record(makeVerdict('Verdict 1', '2026-03-18T10:00:00.000Z') as NexusEvent);
      ledger.record(makeAtlasMarker('Atlas 1', '2026-03-18T10:01:00.000Z') as NexusEvent);
      ledger.record(makeIndexEntry('Index 1', '2026-03-18T10:02:00.000Z') as NexusEvent);
      ledger.record(makeVerdict('Verdict 2', '2026-03-18T10:03:00.000Z') as NexusEvent);
    });

    it('filters by event type', () => {
      const verdicts = ledger.filter({ types: ['tribunal.verdict'] });
      expect(verdicts).toHaveLength(2);
      expect(verdicts.every((e) => e.event.type === 'tribunal.verdict')).toBe(true);
    });

    it('filters by source organ', () => {
      const atlasEntries = ledger.filter({ sources: ['atlas'] });
      expect(atlasEntries).toHaveLength(1);
      expect(atlasEntries[0].event.source).toBe('atlas');
    });

    it('filters by multiple types (OR semantics)', () => {
      const mixed = ledger.filter({ types: ['tribunal.verdict', 'index.entry'] });
      expect(mixed).toHaveLength(3);
    });

    it('combined type + source filter (AND semantics)', () => {
      const result = ledger.filter({ types: ['tribunal.verdict'], sources: ['tribunal'] });
      expect(result).toHaveLength(2);
    });

    it('empty filter returns all entries', () => {
      expect(ledger.filter({})).toHaveLength(4);
    });

    it('filter with no match returns empty array', () => {
      const result = ledger.filter({ types: ['news.broadcast'] });
      expect(result).toHaveLength(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 4: STATS
  // ════════════════════════════════════════════════════

  describe('Stats', () => {
    it('counts events by type correctly', () => {
      ledger = createEventLedger(20);
      ledger.record(makeVerdict('V1', '2026-03-18T10:00:00.000Z') as NexusEvent);
      ledger.record(makeVerdict('V2', '2026-03-18T10:01:00.000Z') as NexusEvent);
      ledger.record(makeAtlasMarker('A1', '2026-03-18T10:02:00.000Z') as NexusEvent);

      const stats = ledger.stats();
      expect(stats.byType['tribunal.verdict']).toBe(2);
      expect(stats.byType['atlas.marker']).toBe(1);
    });

    it('counts events by source correctly', () => {
      ledger = createEventLedger(20);
      ledger.record(makeVerdict('V1', '2026-03-18T10:00:00.000Z') as NexusEvent);
      ledger.record(makeAtlasMarker('A1', '2026-03-18T10:01:00.000Z') as NexusEvent);
      ledger.record(makeIndexEntry('I1', '2026-03-18T10:02:00.000Z') as NexusEvent);

      const stats = ledger.stats();
      expect(stats.bySource['tribunal']).toBe(1);
      expect(stats.bySource['atlas']).toBe(1);
      expect(stats.bySource['index']).toBe(1);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 5: REPLAY
  // ════════════════════════════════════════════════════

  describe('Replay', () => {
    it('replays all recorded events into target bus in order', () => {
      ledger = createEventLedger(20);
      const e1 = makeVerdict('V1', '2026-03-18T10:00:00.000Z');
      const e2 = makeAtlasMarker('A1', '2026-03-18T10:01:00.000Z');
      const e3 = makeIndexEntry('I1', '2026-03-18T10:02:00.000Z');

      ledger.record(e1 as NexusEvent);
      ledger.record(e2 as NexusEvent);
      ledger.record(e3 as NexusEvent);

      const bus = createInMemoryBus();
      const accepted = ledger.replay(bus);

      expect(accepted).toBe(3);
      expect(bus.size()).toBe(3);

      const all = bus.replay({ limit: 100 });
      expect(all[0].id).toBe(e1.id);
      expect(all[1].id).toBe(e2.id);
      expect(all[2].id).toBe(e3.id);
    });

    it('replay respects idempotency — same events not double-inserted', () => {
      ledger = createEventLedger(20);
      const e1 = makeVerdict('V1', '2026-03-18T10:00:00.000Z');
      ledger.record(e1 as NexusEvent);

      const bus = createInMemoryBus();
      bus.publish(e1 as NexusEvent); // already on bus

      const accepted = ledger.replay(bus);
      expect(accepted).toBe(0); // rejected as duplicate
      expect(bus.size()).toBe(1); // still only 1 event
    });

    it('filtered replay only replays matching events', () => {
      ledger = createEventLedger(20);
      ledger.record(makeVerdict('V1', '2026-03-18T10:00:00.000Z') as NexusEvent);
      ledger.record(makeAtlasMarker('A1', '2026-03-18T10:01:00.000Z') as NexusEvent);
      ledger.record(makeIndexEntry('I1', '2026-03-18T10:02:00.000Z') as NexusEvent);

      const bus = createInMemoryBus();
      const accepted = ledger.replay(bus, { types: ['tribunal.verdict'] });

      expect(accepted).toBe(1);
      expect(bus.size()).toBe(1);
      expect(bus.replay({ limit: 10 })[0].type).toBe('tribunal.verdict');
    });

    it('replay of empty ledger returns 0', () => {
      const bus = createInMemoryBus();
      expect(ledger.replay(bus)).toBe(0);
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 6: CLEAR
  // ════════════════════════════════════════════════════

  describe('Clear', () => {
    it('clear removes all entries and resets stats', () => {
      ledger = createEventLedger(20);
      ledger.record(makeVerdict('V1', '2026-03-18T10:00:00.000Z') as NexusEvent);
      ledger.record(makeVerdict('V2', '2026-03-18T10:01:00.000Z') as NexusEvent);

      ledger.clear();

      expect(ledger.size()).toBe(0);
      expect(ledger.getAll()).toHaveLength(0);
      const stats = ledger.stats();
      expect(stats.total).toBe(0);
      expect(stats.evicted).toBe(0);
    });

    it('can record again after clear', () => {
      ledger = createEventLedger(20);
      ledger.record(makeVerdict('V1', '2026-03-18T10:00:00.000Z') as NexusEvent);
      ledger.clear();
      ledger.record(makeVerdict('V2', '2026-03-18T10:01:00.000Z') as NexusEvent);

      expect(ledger.size()).toBe(1);
      expect(ledger.getAll()[0].seq).toBe(0); // seq resets after clear
    });
  });

  // ════════════════════════════════════════════════════
  // GATE 7: BUS WIRING (attachLedger)
  // ════════════════════════════════════════════════════

  describe('Bus wiring via attachLedger', () => {
    it('automatically records all events published to the bus', () => {
      ledger = createEventLedger(20);
      const bus = createInMemoryBus();
      attachLedger(bus, ledger);

      const e1 = makeVerdict('V1', '2026-03-18T10:00:00.000Z');
      const e2 = makeAtlasMarker('A1', '2026-03-18T10:01:00.000Z');

      bus.publish(e1 as NexusEvent);
      bus.publish(e2 as NexusEvent);

      expect(ledger.size()).toBe(2);
      expect(ledger.getAll()[0].event.id).toBe(e1.id);
      expect(ledger.getAll()[1].event.id).toBe(e2.id);
    });

    it('does not record events that the bus itself rejected (invalid)', () => {
      ledger = createEventLedger(20);
      const bus = createInMemoryBus();
      attachLedger(bus, ledger);

      const bad = { id: '', type: 'invalid' } as unknown as NexusEvent;
      bus.publish(bad); // bus rejects before subscriber fires

      expect(ledger.size()).toBe(0);
    });

    it('unsubscribe stops recording', () => {
      ledger = createEventLedger(20);
      const bus = createInMemoryBus();
      const unsub = attachLedger(bus, ledger);

      const e1 = makeVerdict('V1', '2026-03-18T10:00:00.000Z');
      bus.publish(e1 as NexusEvent);
      expect(ledger.size()).toBe(1);

      unsub(); // detach

      const e2 = makeVerdict('V2', '2026-03-18T10:01:00.000Z');
      bus.publish(e2 as NexusEvent);
      expect(ledger.size()).toBe(1); // no new recordings
    });
  });
});
