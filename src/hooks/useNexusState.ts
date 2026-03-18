import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TribunalVerdict, RealtimeDataPoint } from '../types';
import { bus } from '../lib/events/bus';

/**
 * Shared Nervous System for the Eternal Nexus — v2.
 * Wires TanStack Query state with the Nervous System v2 event bus.
 * Sacred Flow: Tribunal → Atlas → Index → News
 *
 * Invariants:
 *   Deterministic — same verdict input always yields the same state.
 *   Idempotent    — replaying an event with the same id is a no-op.
 *   Replayable    — bus.replay(cursor) restores full state from any checkpoint.
 */
export const useNexusState = () => {
  const queryClient = useQueryClient();

  // ── Tribunal Verdicts ──
  const { data: verdicts = [] } = useQuery<TribunalVerdict[]>({
    queryKey: ['verdicts'],
    initialData: [],
    staleTime: Infinity, // Keep in memory during session
  });

  const addVerdict = useMutation({
    mutationFn: async (verdict: TribunalVerdict) => verdict,
    onSuccess: (newVerdict) => {
      queryClient.setQueryData<TribunalVerdict[]>(['verdicts'], (old = []) => [
        newVerdict,
        ...old,
      ]);
      // Emit into Nervous System v2 bus — triggers Sacred Flow
      bus.emit('tribunal:verdict', newVerdict, `verdict:${newVerdict.id}`);
    },
  });

  // ── Atlas Sensor Data (Managed separately by useRealtimeData, but accessible here) ──
  const { data: atlasData = [] } = useQuery<RealtimeDataPoint[]>({
    queryKey: ['atlasData'],
    initialData: [],
  });

  // ── Bus → Query bridge: keep TanStack cache in sync with bus events ──
  useEffect(() => {
    const unsubVerdicts = bus.on<TribunalVerdict>('tribunal:verdict', (event) => {
      queryClient.setQueryData<TribunalVerdict[]>(['verdicts'], (old = []) => {
        // Idempotency: skip if the verdict is already present
        if (old.some((v) => v.id === event.payload.id)) return old;
        return [event.payload, ...old];
      });
    });

    const unsubAtlas = bus.on<RealtimeDataPoint>('atlas:data', (event) => {
      queryClient.setQueryData<RealtimeDataPoint[]>(['atlasData'], (old = []) => [
        event.payload,
        ...old,
      ]);
    });

    return () => {
      unsubVerdicts();
      unsubAtlas();
    };
  }, [queryClient]);

  return {
    verdicts,
    addVerdict: addVerdict.mutate,
    atlasData,
    /** Expose bus cursor for client-side replay checkpointing */
    busCursor: bus.getCursor(),
    /** Replay events from a given cursor — replayable invariant */
    replayFrom: bus.replay.bind(bus),
  };
};
