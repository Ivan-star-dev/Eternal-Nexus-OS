/**
 * ledger.ts — Bounded in-memory event ledger for Nervous System observability
 *
 * Dev-only layer that records every event passing through the bus.
 * Sits on top of the bus via subscribe() — does NOT modify bus internals.
 *
 * Guarantees:
 * - Ring buffer: oldest events are evicted when capacity is exceeded (no unbounded growth)
 * - Deterministic replay: recorded events replayed in insertion order via bus.publish()
 * - Production safe: when disabled (default in prod), zero overhead — no subscription
 * - Bus idempotency preserved: replay re-publishes via same bus.publish(), duplicates rejected
 */

import type { NexusEvent, NexusEventType, Organ } from '@/types/sacred-flow';
import type { NexusEventBus } from './bus';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LedgerEntry {
  /** The recorded event (original reference, not a copy) */
  event: NexusEvent;
  /** Wall-clock time this entry was recorded (ms since epoch) */
  recordedAt: number;
  /** Sequential position in this ledger session (0-based) */
  seq: number;
}

export interface LedgerFilter {
  types?: NexusEventType[];
  sources?: Organ[];
}

export interface LedgerStats {
  total: number;
  byType: Record<string, number>;
  bySource: Record<string, number>;
  capacity: number;
  evicted: number;
}

export interface EventLedger {
  /** Record a single event into the ledger */
  record(event: NexusEvent): void;
  /** All current entries, oldest first */
  getAll(): LedgerEntry[];
  /** Filtered subset of entries */
  filter(f: LedgerFilter): LedgerEntry[];
  /** Aggregate counts */
  stats(): LedgerStats;
  /** Evict all entries */
  clear(): void;
  /** Replay all recorded events (in order) into the target bus */
  replay(bus: NexusEventBus, filter?: LedgerFilter): number;
  /** Current number of entries */
  size(): number;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

const DEFAULT_CAPACITY = 200;

/**
 * Create a bounded event ledger.
 *
 * @param capacity  Max entries before oldest are evicted. Default: 200.
 */
export function createEventLedger(capacity = DEFAULT_CAPACITY): EventLedger {
  const entries: LedgerEntry[] = [];
  let seq = 0;
  let evicted = 0;

  function record(event: NexusEvent): void {
    entries.push({ event, recordedAt: Date.now(), seq: seq++ });
    if (entries.length > capacity) {
      entries.shift(); // evict oldest
      evicted++;
    }
  }

  function getAll(): LedgerEntry[] {
    return entries.slice(); // defensive copy
  }

  function filter(f: LedgerFilter): LedgerEntry[] {
    return entries.filter((e) => {
      if (f.types && !f.types.includes(e.event.type)) return false;
      if (f.sources && !f.sources.includes(e.event.source)) return false;
      return true;
    });
  }

  function stats(): LedgerStats {
    const byType: Record<string, number> = {};
    const bySource: Record<string, number> = {};

    for (const e of entries) {
      byType[e.event.type] = (byType[e.event.type] ?? 0) + 1;
      bySource[e.event.source] = (bySource[e.event.source] ?? 0) + 1;
    }

    return { total: entries.length, byType, bySource, capacity, evicted };
  }

  function clear(): void {
    entries.length = 0;
    seq = 0;
    evicted = 0;
  }

  function replay(bus: NexusEventBus, f?: LedgerFilter): number {
    const toReplay = f ? filter(f) : getAll();
    let accepted = 0;
    for (const entry of toReplay) {
      // bus.publish() enforces idempotency — same ID is rejected silently
      if (bus.publish(entry.event)) accepted++;
    }
    return accepted;
  }

  function size(): number {
    return entries.length;
  }

  return { record, getAll, filter, stats, clear, replay, size };
}

// ---------------------------------------------------------------------------
// Bus wiring: attach ledger as a passive subscriber
// ---------------------------------------------------------------------------

/**
 * Attach an EventLedger to a bus so every published event is automatically recorded.
 * Returns an unsubscribe function.
 *
 * Safe to call in dev only:
 *   if (import.meta.env.DEV) attachLedger(bus, ledger);
 */
export function attachLedger(
  bus: NexusEventBus,
  ledger: EventLedger,
): () => void {
  // Subscribe to ALL events (empty filter = no restriction)
  return bus.subscribe({}, (event) => ledger.record(event));
}

// ---------------------------------------------------------------------------
// Singleton dev ledger (only created + attached in DEV mode)
// ---------------------------------------------------------------------------

let _devLedger: EventLedger | null = null;

export function getDevLedger(): EventLedger | null {
  return _devLedger;
}

/**
 * Initialize the dev ledger and attach it to a bus.
 * Call once at app startup, guarded by DEV check.
 * Returns the ledger (or null in production).
 */
export function initDevLedger(
  bus: NexusEventBus,
  capacity = DEFAULT_CAPACITY,
): EventLedger | null {
  // Tree-shaken in production builds
  if (typeof import.meta !== 'undefined' && !(import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
    return null;
  }
  if (!_devLedger) {
    _devLedger = createEventLedger(capacity);
    attachLedger(bus, _devLedger);
  }
  return _devLedger;
}
