/**
 * bus.ts — Event Bus interface + in-memory implementation (v1)
 *
 * The bus is the spine of the Nervous System.
 * Guarantees:
 *   1. Idempotency — same event ID is never processed twice
 *   2. Order — events are stored in insertion order
 *   3. Replay — consumers can fetch events from a cursor
 *   4. Determinism — IDs and seeds are content-addressable
 */

import type {
  NexusEvent,
  NexusEventType,
  Organ,
  EventFilter,
  ReplayCursor,
  Unsubscribe,
} from '@/types/sacred-flow';
import { validateEvent } from './validation';

// ---------------------------------------------------------------------------
// Bus interface (swap implementations later: WS, Supabase, etc.)
// ---------------------------------------------------------------------------

export interface NexusEventBus {
  /** Publish an event. Returns false if duplicate (idempotent). */
  publish(event: NexusEvent): boolean;

  /** Subscribe to events matching a filter. */
  subscribe(
    filter: EventFilter,
    handler: (event: NexusEvent) => void,
  ): Unsubscribe;

  /** Replay events from a cursor. */
  replay(cursor: ReplayCursor): NexusEvent[];

  /** Get event by ID (for dedup checks, linking). */
  getById(id: string): NexusEvent | undefined;

  /** Current event count. */
  size(): number;

  /** Reset (testing only). */
  clear(): void;
}

// ---------------------------------------------------------------------------
// Subscriber record
// ---------------------------------------------------------------------------

interface Subscriber {
  filter: EventFilter;
  handler: (event: NexusEvent) => void;
}

// ---------------------------------------------------------------------------
// In-memory implementation (v1)
// ---------------------------------------------------------------------------

export function createInMemoryBus(): NexusEventBus {
  /** Ordered event log */
  const log: NexusEvent[] = [];

  /** ID → index for O(1) dedup lookups */
  const idIndex = new Map<string, number>();

  /** Active subscribers */
  let subscribers: Subscriber[] = [];

  function matchesFilter(event: NexusEvent, filter: EventFilter): boolean {
    if (filter.types && filter.types.length > 0) {
      if (!filter.types.includes(event.type)) return false;
    }
    if (filter.sources && filter.sources.length > 0) {
      if (!filter.sources.includes(event.source)) return false;
    }
    if (filter.minSeverity !== undefined) {
      if (event.severity < filter.minSeverity) return false;
    }
    return true;
  }

  const bus: NexusEventBus = {
    publish(event: NexusEvent): boolean {
      // Idempotency: reject duplicates
      if (idIndex.has(event.id)) {
        return false;
      }

      // Validate at ingress
      const { valid, errors } = validateEvent(event);
      if (!valid) {
        console.warn('[NexusBus] Invalid event rejected:', errors);
        return false;
      }

      // Store
      const idx = log.length;
      log.push(event);
      idIndex.set(event.id, idx);

      // Notify subscribers
      for (const sub of subscribers) {
        if (matchesFilter(event, sub.filter)) {
          try {
            sub.handler(event);
          } catch (err) {
            console.error('[NexusBus] Subscriber error:', err);
          }
        }
      }

      return true;
    },

    subscribe(
      filter: EventFilter,
      handler: (event: NexusEvent) => void,
    ): Unsubscribe {
      const sub: Subscriber = { filter, handler };
      subscribers.push(sub);
      return () => {
        subscribers = subscribers.filter((s) => s !== sub);
      };
    },

    replay(cursor: ReplayCursor): NexusEvent[] {
      let startIdx = 0;

      // If afterId is set, start after that event
      if (cursor.afterId) {
        const idx = idIndex.get(cursor.afterId);
        if (idx !== undefined) {
          startIdx = idx + 1;
        }
      }

      // If since is set, binary-search by timestamp
      if (cursor.since) {
        const sinceMs = new Date(cursor.since).getTime();
        // Linear scan (fine for v1 in-memory; optimize later)
        for (let i = startIdx; i < log.length; i++) {
          if (new Date(log[i].createdAt).getTime() >= sinceMs) {
            startIdx = i;
            break;
          }
        }
      }

      const limit = cursor.limit ?? 100;
      return log.slice(startIdx, startIdx + limit);
    },

    getById(id: string): NexusEvent | undefined {
      const idx = idIndex.get(id);
      return idx !== undefined ? log[idx] : undefined;
    },

    size(): number {
      return log.length;
    },

    clear(): void {
      log.length = 0;
      idIndex.clear();
      subscribers = [];
    },
  };

  return bus;
}

// ---------------------------------------------------------------------------
// Singleton (app-wide default bus)
// ---------------------------------------------------------------------------

let _defaultBus: NexusEventBus | null = null;

export function getDefaultBus(): NexusEventBus {
  if (!_defaultBus) {
    _defaultBus = createInMemoryBus();
  }
  return _defaultBus;
}

/** Replace the singleton bus (call before any component mounts). */
export function setDefaultBus(bus: NexusEventBus): void {
  _defaultBus = bus;
}
