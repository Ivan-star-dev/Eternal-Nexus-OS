import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TribunalVerdict, RealtimeDataPoint } from '../types';
import { validateTribunalEvent } from '@/lib/tribunal/validation';

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
    mutationFn: async (verdict: TribunalVerdict) => {
      // Pilar 1: validate before ingestion — reject malformed events
      const { valid, errors } = validateTribunalEvent(verdict);
      if (!valid) {
        console.warn('[Tribunal] Malformed event rejected:', errors);
        throw new Error(`[Tribunal] Invalid event: ${errors.join('; ')}`);
      }
      return verdict;
    },
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
