// sacred-flow: Phase Gate Test — Nervous System v2 (bus.ts)
// Proves: Deterministic | Idempotent | Replayable
// All three invariants must pass for the gate to be GREEN.

import { describe, it, expect, beforeEach } from 'vitest';
import { bus, NexusEvent } from '@/lib/events/bus';
import { TribunalVerdict } from '@/types';

const MOCK_VERDICT: TribunalVerdict = {
  id: 'verdict-001',
  topic: 'Climate Emergency Protocol',
  judges: ['zeta-9', 'kronos'],
  verdict: 'approved',
  confidence: 0.94,
  reasoning: 'Unanimous approval after weighted deliberation.',
  timestamp: 1700000000000,
  flowTarget: 'atlas',
};

describe('Nervous System v2 — bus.ts Phase Gate', () => {
  beforeEach(() => {
    bus.reset();
  });

  // ── Invariant 1: Deterministic ──────────────────────────────────────────
  describe('Deterministic', () => {
    it('emitting the same payload with the same id always produces the same event', () => {
      const id = 'deterministic-test';
      const e1 = bus.emit('tribunal:verdict', MOCK_VERDICT, id);
      bus.reset();
      const e2 = bus.emit('tribunal:verdict', MOCK_VERDICT, id);

      expect(e1.type).toBe(e2.type);
      expect(e1.id).toBe(e2.id);
      expect(e1.payload).toEqual(e2.payload);
    });

    it('cursor increases monotonically — same seed produces same sequence order', () => {
      const a = bus.emit('tribunal:verdict', MOCK_VERDICT, 'a');
      const b = bus.emit('atlas:data', { source: 'climate', value: 1, lat: 0, lng: 0, timestamp: 0, severity: 0 }, 'b');

      expect(a.cursor).toBe(1);
      expect(b.cursor).toBe(2);
    });
  });

  // ── Invariant 2: Idempotent ─────────────────────────────────────────────
  describe('Idempotent', () => {
    it('emitting an event with the same id twice does NOT duplicate the log', () => {
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'idem-001');
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'idem-001'); // duplicate

      expect(bus.getLog().filter((e) => e.id === 'idem-001')).toHaveLength(1);
    });

    it('duplicate emit does NOT fire listeners a second time', () => {
      let callCount = 0;
      bus.on('tribunal:verdict', () => { callCount++; });

      bus.emit('tribunal:verdict', MOCK_VERDICT, 'idem-002');
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'idem-002'); // duplicate

      expect(callCount).toBe(1);
    });

    it('emitting with a different id DOES create a new entry', () => {
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'unique-a');
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'unique-b');

      expect(bus.getLog()).toHaveLength(2);
    });
  });

  // ── Invariant 3: Replayable ─────────────────────────────────────────────
  describe('Replayable', () => {
    it('replay(0) returns all events in cursor order', () => {
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'r-a');
      bus.emit('index:logged', { ref: 'r-a' }, 'r-b');
      bus.emit('news:broadcast', { title: 'Breaking' }, 'r-c');

      const replayed = bus.replay(0);
      expect(replayed).toHaveLength(3);
      expect(replayed.map((e: NexusEvent) => e.cursor)).toEqual([1, 2, 3]);
    });

    it('replay(n) returns only events after cursor n (partial resume)', () => {
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'resume-a');
      const checkpoint = bus.getCursor(); // cursor = 1
      bus.emit('atlas:data', { source: 'geopolitics', value: 0.7, lat: 48, lng: 2, timestamp: 0, severity: 0.7 }, 'resume-b');
      bus.emit('index:logged', { ref: 'resume-b' }, 'resume-c');

      const resumed = bus.replay(checkpoint);
      expect(resumed).toHaveLength(2);
      expect(resumed[0].id).toBe('resume-b');
    });

    it('cursor is preserved across subscribes/unsubscribes', () => {
      const unsub = bus.on('tribunal:verdict', () => {});
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'cursor-test');
      unsub();

      expect(bus.getCursor()).toBe(1);
    });
  });

  // ── Sacred Flow: listeners receive payloads correctly ───────────────────
  describe('Sacred Flow — listener delivery', () => {
    it('tribunal:verdict listener receives the verdict payload', () => {
      let received: TribunalVerdict | null = null;
      bus.on<TribunalVerdict>('tribunal:verdict', (e) => { received = e.payload; });
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'delivery-test');

      expect(received).toEqual(MOCK_VERDICT);
    });

    it('unsubscribe stops listener from receiving events', () => {
      let callCount = 0;
      const unsub = bus.on('tribunal:verdict', () => { callCount++; });

      bus.emit('tribunal:verdict', MOCK_VERDICT, 'unsub-a');
      unsub();
      bus.emit('tribunal:verdict', MOCK_VERDICT, 'unsub-b');

      expect(callCount).toBe(1);
    });
  });
});
