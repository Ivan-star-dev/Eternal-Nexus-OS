/**
 * persistence.ts — localStorage adapter for NexusEventBus (C5)
 *
 * Wraps an in-memory bus and persists the event log to localStorage.
 * On startup, rehydrates from storage before the app publishes new events.
 *
 * Guarantees preserved:
 *   - Idempotency — persisted duplicate IDs are skipped on rehydrate
 *   - Order       — events stored/replayed in insertion order
 *   - Bounded     — max `capacity` events; oldest are evicted
 *
 * Dev-only by default. Opt into production by calling
 * `createPersistedBus({ devOnly: false })`.
 */

import type { NexusEvent, EventFilter, ReplayCursor, Unsubscribe } from '@/types/sacred-flow';
import { createInMemoryBus, type NexusEventBus } from './bus';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_STORAGE_KEY = 'nexus:event-log';
const DEFAULT_CAPACITY = 500;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PersistenceOptions {
  /** localStorage key (default: "nexus:event-log") */
  storageKey?: string;
  /** Max events to retain (default: 500, oldest evicted) */
  capacity?: number;
  /** If true, no-ops outside import.meta.env.DEV (default: true) */
  devOnly?: boolean;
}

export interface PersistedBus extends NexusEventBus {
  /** Wipe all persisted events from localStorage and in-memory bus */
  clearPersisted(): void;
  /** How many events are in localStorage right now */
  persistedSize(): number;
}

// ---------------------------------------------------------------------------
// Storage helpers (isolated for SSR / private-browsing safety)
// ---------------------------------------------------------------------------

function storageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem('__nexus_test__', '1');
    window.localStorage.removeItem('__nexus_test__');
    return true;
  } catch {
    return false;
  }
}

function readFromStorage(key: string): NexusEvent[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as NexusEvent[];
  } catch {
    return [];
  }
}

function writeToStorage(key: string, events: NexusEvent[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(events));
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

// ---------------------------------------------------------------------------
// Persisted bus factory
// ---------------------------------------------------------------------------

export function createPersistedBus(options: PersistenceOptions = {}): PersistedBus {
  const key = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const capacity = options.capacity ?? DEFAULT_CAPACITY;
  const devOnly = options.devOnly ?? true;

  // In non-dev when devOnly=true, return a no-op in-memory bus
  const isDev = typeof import.meta !== 'undefined'
    ? (import.meta as { env?: { DEV?: boolean } }).env?.DEV ?? false
    : false;

  if (devOnly && !isDev) {
    const base = createInMemoryBus();
    return {
      ...base,
      clearPersisted: () => {},
      persistedSize: () => 0,
    };
  }

  // In-memory bus is the authoritative store
  const inner = createInMemoryBus();

  // Track persisted log separately (bounded array)
  // We maintain our own ordered list for localStorage writes
  let persistedLog: NexusEvent[] = [];
  const available = storageAvailable();

  // ---------------------------------------------------------------------------
  // Rehydrate from localStorage
  // ---------------------------------------------------------------------------
  if (available) {
    const stored = readFromStorage(key);
    for (const event of stored) {
      // Publish into inner bus — idempotency enforced by inner bus
      inner.publish(event);
      persistedLog.push(event);
    }
  }

  // ---------------------------------------------------------------------------
  // Persist helper (called after every successful publish)
  // ---------------------------------------------------------------------------
  function persist(event: NexusEvent): void {
    if (!available) return;
    persistedLog.push(event);
    // Evict oldest if over capacity
    if (persistedLog.length > capacity) {
      persistedLog = persistedLog.slice(persistedLog.length - capacity);
    }
    writeToStorage(key, persistedLog);
  }

  // ---------------------------------------------------------------------------
  // PersistedBus implementation
  // ---------------------------------------------------------------------------
  const bus: PersistedBus = {
    publish(event: NexusEvent): boolean {
      const accepted = inner.publish(event);
      if (accepted) persist(event);
      return accepted;
    },

    subscribe(filter: EventFilter, handler: (event: NexusEvent) => void): Unsubscribe {
      return inner.subscribe(filter, handler);
    },

    replay(cursor: ReplayCursor): NexusEvent[] {
      return inner.replay(cursor);
    },

    getById(id: string): NexusEvent | undefined {
      return inner.getById(id);
    },

    size(): number {
      return inner.size();
    },

    clear(): void {
      inner.clear();
      persistedLog = [];
      if (available) {
        try { window.localStorage.removeItem(key); } catch { /* noop */ }
      }
    },

    clearPersisted(): void {
      bus.clear();
    },

    persistedSize(): number {
      return persistedLog.length;
    },
  };

  return bus;
}
