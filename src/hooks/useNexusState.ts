import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TribunalVerdict, RealtimeDataPoint } from '../types';
import { getDefaultBus } from '@/lib/events/bus';
import { makeEventId, seedFromId } from '@/lib/events/id';
import type { NexusEvent, TribunalVerdictPayload, AtlasMarkerPayload } from '@/types/sacred-flow';

/**
 * Shared Nervous System for the Eternal Nexus.
 *
 * BRIDGE LAYER (v2):
 * - TanStack Query remains the React view cache (what components read)
 * - Event bus is the authoritative event log (what the spine records)
 * - addVerdict() publishes to BOTH: bus (for replay/idempotency/determinism)
 *   + TanStack cache (for instant React re-renders)
 *
 * Consumers (GeopoliticsNarrative, useIndexOrgan, NexusFlowInspector)
 * see zero API changes. The bus operates silently underneath.
 */
export const useNexusState = () => {
  const queryClient = useQueryClient();
  const bus = getDefaultBus();

  // ── Tribunal Verdicts (React view cache) ──
  const { data: verdicts = [] } = useQuery<TribunalVerdict[]>({
    queryKey: ['verdicts'],
    initialData: [],
    staleTime: Infinity,
  });

  // ── Bridge mutation: TanStack + Event Bus ──
  const addVerdict = useMutation({
    mutationFn: async (verdict: TribunalVerdict) => {
      // 1) Build typed payload for the event bus
      const payload: TribunalVerdictPayload = {
        topic: verdict.topic,
        judges: verdict.judges as string[],
        verdict: verdict.verdict,
        reasoning: verdict.reasoning,
        flowTarget: verdict.flowTarget,
      };

      // 2) Publish to event bus (deterministic ID, idempotent)
      const createdAt = new Date(verdict.timestamp).toISOString();
      const eventId = makeEventId('tribunal.verdict', 'tribunal', createdAt, payload);

      const event: NexusEvent<TribunalVerdictPayload> = {
        id: eventId,
        type: 'tribunal.verdict',
        createdAt,
        source: 'tribunal',
        severity: verdict.confidence,
        payload,
        confidence: verdict.confidence,
        seed: seedFromId(eventId),
        version: 1,
      };

      // publish() returns false if duplicate (idempotency guarantee)
      bus.publish(event as NexusEvent);

      return verdict;
    },
    onSuccess: (newVerdict) => {
      // 3) Update TanStack cache for instant React re-render
      queryClient.setQueryData<TribunalVerdict[]>(['verdicts'], (old = []) => {
        // Prevent duplicate in view cache (matches bus idempotency)
        if (old.some((v) => v.id === newVerdict.id)) return old;
        return [newVerdict, ...old];
      });
    },
  });

  // ── Atlas Sensor Data (React view cache) ──
  const { data: atlasData = [] } = useQuery<RealtimeDataPoint[]>({
    queryKey: ['atlasData'],
    initialData: [],
  });

  // ── Bridge mutation: Atlas data → TanStack + Event Bus ──
  const addAtlasData = useMutation({
    mutationFn: async (points: RealtimeDataPoint[]) => {
      for (const point of points) {
        const payload: AtlasMarkerPayload = {
          label: point.label ?? `${point.source} reading`,
          category: point.category ?? point.source,
          dataSource: point.source,
          value: point.value,
          unit: point.unit,
        };

        const createdAt = new Date(point.timestamp).toISOString();
        const eventId = makeEventId('atlas.marker', 'atlas', createdAt, payload);

        const event: NexusEvent<AtlasMarkerPayload> = {
          id: eventId,
          type: 'atlas.marker',
          createdAt,
          source: 'atlas',
          geo: { lat: point.lat, lon: point.lng },
          severity: point.severity,
          payload,
          confidence: 1 - (point.severity * 0.3), // higher severity → slightly lower confidence
          seed: seedFromId(eventId),
          version: 1,
        };

        bus.publish(event as NexusEvent);
      }
      return points;
    },
    onSuccess: (newPoints) => {
      queryClient.setQueryData<RealtimeDataPoint[]>(['atlasData'], (old = []) => {
        const existingTimestamps = new Set(old.map(p => `${p.source}:${p.timestamp}`));
        const unique = newPoints.filter(p => !existingTimestamps.has(`${p.source}:${p.timestamp}`));
        return [...unique, ...old].slice(0, 1000); // cap at 1000
      });
    },
  });

  return {
    verdicts,
    addVerdict: addVerdict.mutate,
    atlasData,
    addAtlasData: addAtlasData.mutate,
    /** Direct bus access for advanced consumers (replay, subscribe) */
    bus,
  };
};
