import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TribunalVerdict, RealtimeDataPoint } from '../types';

/**
 * Shared Nervous System for the Eternal Nexus.
 * Uses TanStack Query to synchronize state across organs.
 */
export const useNexusState = () => {
  const queryClient = useQueryClient();

  // ── Tribunal Verdicts ──
  const { data: verdicts = [] } = useQuery<TribunalVerdict[]>({
    queryKey: ['verdicts'],
    initialData: [],
    staleTime: Infinity, // Keep in memory during session
    enabled: false, // In-memory only — populated via addVerdict mutation
  });

  const addVerdict = useMutation({
    mutationFn: async (verdict: TribunalVerdict) => verdict,
    onSuccess: (newVerdict) => {
      queryClient.setQueryData<TribunalVerdict[]>(['verdicts'], (old = []) => [
        newVerdict,
        ...old,
      ]);
    },
  });

  // ── Atlas Sensor Data (Managed separately by useRealtimeData, but accessible here) ──
  const { data: atlasData = [] } = useQuery<RealtimeDataPoint[]>({
    queryKey: ['atlasData'],
    initialData: [],
    enabled: false, // In-memory only — populated via Atlas organ
  });

  return {
    verdicts,
    addVerdict: addVerdict.mutate,
    atlasData,
  };
};
