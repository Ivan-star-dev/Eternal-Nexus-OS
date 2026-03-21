import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  NexusEvent,
  NexusEventType,
  Organ,
  EventFilter,
} from '@/types/sacred-flow';
import { getDefaultBus } from '@/lib/events/bus';
import { createReplaySession, type ReplaySession } from '@/lib/events/replay';

/**
 * useNexusEvents — React hook for subscribing to the Nervous System event bus.
 *
 * Provides:
 * - Live event stream (new events appear in state as they're published)
 * - Replay on mount (catches up on events emitted before the component mounted)
 * - Filter by event type, source organ, or minimum severity
 *
 * This is the pure bus consumer — no TanStack dependency.
 * Use alongside useNexusState for components that need both views.
 *
 * Usage:
 * ```tsx
 * const { events } = useNexusEvents({
 *   types: ['tribunal.verdict'],
 *   replayOnMount: true,
 * });
 * ```
 */

export interface UseNexusEventsOptions {
  /** Filter by event types */
  types?: NexusEventType[];
  /** Filter by source organs */
  sources?: Organ[];
  /** Minimum severity threshold (0-1) */
  minSeverity?: number;
  /** Replay all matching events on mount (default: true) */
  replayOnMount?: boolean;
  /** Max events to keep in state (oldest dropped first, default: 500) */
  maxEvents?: number;
}

export interface UseNexusEventsReturn {
  /** All events matching the filter, newest first */
  events: NexusEvent[];
  /** Total event count on the bus */
  busSize: number;
  /** Replay session for manual cursor control */
  replay: ReplaySession;
  /** Clear local event state (does not clear bus) */
  clear: () => void;
}

export function useNexusEvents(
  options: UseNexusEventsOptions = {},
): UseNexusEventsReturn {
  const {
    types,
    sources,
    minSeverity,
    replayOnMount = true,
    maxEvents = 500,
  } = options;

  const bus = getDefaultBus();
  const [events, setEvents] = useState<NexusEvent[]>([]);
  const replayRef = useRef<ReplaySession>(createReplaySession(bus));

  // Stable filter reference
  const filter: EventFilter = {
    types,
    sources,
    minSeverity,
  };

  // Add event to state (with dedup and max cap)
  const addEvent = useCallback(
    (event: NexusEvent) => {
      setEvents((prev) => {
        // Dedup by ID
        if (prev.some((e) => e.id === event.id)) return prev;
        const next = [event, ...prev];
        // Cap at maxEvents
        return next.length > maxEvents ? next.slice(0, maxEvents) : next;
      });
    },
    [maxEvents],
  );

  // Replay on mount
  useEffect(() => {
    if (!replayOnMount) return;

    const session = replayRef.current;
    session.reset();
    const existing = session.fetchNext(maxEvents);

    // Apply filter manually for replayed events
    const filtered = existing.filter((e) => {
      if (filter.types?.length && !filter.types.includes(e.type)) return false;
      if (filter.sources?.length && !filter.sources.includes(e.source))
        return false;
      if (filter.minSeverity !== undefined && e.severity < filter.minSeverity)
        return false;
      return true;
    });

    if (filtered.length > 0) {
      setEvents(filtered.reverse()); // newest first
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayOnMount]);

  // Subscribe to live events
  useEffect(() => {
    const unsubscribe = bus.subscribe(filter, addEvent);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types?.join(','), sources?.join(','), minSeverity]);

  const clear = useCallback(() => setEvents([]), []);

  return {
    events,
    busSize: bus.size(),
    replay: replayRef.current,
    clear,
  };
}
