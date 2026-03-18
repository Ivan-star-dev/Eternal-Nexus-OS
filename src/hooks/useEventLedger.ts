/**
 * useEventLedger.ts — React hook for Nervous System event observability
 *
 * Subscribes to the default bus, feeds every event into a ledger,
 * and exposes a live-updating view of the recorded entries.
 *
 * Dev-only by design: returns an empty stub in production to preserve
 * tree-shaking and zero production overhead.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getDefaultBus } from '@/lib/events/bus';
import { createEventLedger, attachLedger } from '@/lib/events/ledger';
import type { EventLedger, LedgerEntry, LedgerFilter, LedgerStats } from '@/lib/events/ledger';
import type { NexusEventBus } from '@/lib/events/bus';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseEventLedgerResult {
  entries: LedgerEntry[];
  stats: LedgerStats;
  filter: LedgerFilter;
  setFilter: (f: LedgerFilter) => void;
  clear: () => void;
  replay: (targetBus?: NexusEventBus) => number;
  isActive: boolean;
}

const EMPTY_STATS: LedgerStats = {
  total: 0,
  byType: {},
  bySource: {},
  capacity: 0,
  evicted: 0,
};

/**
 * @param capacity  Ring buffer size. Default 200.
 * @param enabled   Opt-out override (useful in tests). Defaults to import.meta.env.DEV.
 */
export function useEventLedger(
  capacity = 200,
  enabled?: boolean,
): UseEventLedgerResult {
  const isDev = enabled ?? (typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true);

  const ledgerRef = useRef<EventLedger | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [stats, setStats] = useState<LedgerStats>(EMPTY_STATS);
  const [filter, setFilter] = useState<LedgerFilter>({});

  // Sync state from ledger
  const sync = useCallback(() => {
    if (!ledgerRef.current) return;
    const all = filter.types?.length || filter.sources?.length
      ? ledgerRef.current.filter(filter)
      : ledgerRef.current.getAll();
    setEntries(all);
    setStats(ledgerRef.current.stats());
  }, [filter]);

  useEffect(() => {
    if (!isDev) return;

    const bus = getDefaultBus();
    const ledger = createEventLedger(capacity);
    ledgerRef.current = ledger;

    // Subscribe to bus — record + trigger re-render on every event
    const unsubscribe = bus.subscribe({}, (event) => {
      ledger.record(event);
      sync();
    });

    return () => {
      unsubscribe();
      ledgerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDev, capacity]);

  // Re-filter when filter changes
  useEffect(() => {
    sync();
  }, [sync]);

  const clear = useCallback(() => {
    ledgerRef.current?.clear();
    setEntries([]);
    setStats(EMPTY_STATS);
  }, []);

  const replay = useCallback((targetBus?: NexusEventBus): number => {
    if (!ledgerRef.current) return 0;
    const bus = targetBus ?? getDefaultBus();
    const count = ledgerRef.current.replay(bus, filter.types?.length || filter.sources?.length ? filter : undefined);
    return count;
  }, [filter]);

  if (!isDev) {
    return {
      entries: [],
      stats: EMPTY_STATS,
      filter: {},
      setFilter: () => {},
      clear: () => {},
      replay: () => 0,
      isActive: false,
    };
  }

  return { entries, stats, filter, setFilter, clear, replay, isActive: true };
}
