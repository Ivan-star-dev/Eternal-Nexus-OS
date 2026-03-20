import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { aggregateOrganism } from '@/lib/index-organ/aggregator';
import { useNexusState } from '@/hooks/useNexusState';
import { useIndexOrgan } from '@/hooks/useIndexOrgan';
import type { TribunalVerdict } from '@/types';

vi.mock('@/hooks/useRealtimeData', () => ({
  useRealtimeData: () => ({
    data: [
      {
        source: 'economy',
        value: 73,
        lat: 10.2,
        lng: -19.5,
        timestamp: 1_700_000_100_000,
        severity: 0.61,
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

const createClientWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Sacred Flow (Tribunal → Atlas → Index → News)', () => {

  it('aggregates Tribunal and Atlas signals into Index entries targeting News', () => {
    const verdicts: TribunalVerdict[] = [
      {
        id: 'verdict-01',
        topic: 'Port security escalation',
        judges: ['zeta-9'],
        verdict: 'approved',
        confidence: 0.91,
        reasoning: 'Independent satellite and maritime correlation confirmed risk.',
        timestamp: Date.now(),
        flowTarget: 'index',
      },
    ];

    const atlasData = [{ source: 'economy' as const, value: 31, lat: 14.9, lng: -23.5, timestamp: Date.now() - 5_000, severity: 0.55 }];
    const entries = aggregateOrganism(verdicts, atlasData);

    expect(entries).toHaveLength(2);
    expect(entries.every((entry) => entry.flowTarget === 'news')).toBe(true);
    expect(entries.map((entry) => entry.sources[0]?.organ)).toEqual(expect.arrayContaining(['tribunal', 'atlas']));
  });

  it('persists Tribunal verdicts in shared query state', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = createClientWrapper(queryClient);
    const nexusState = renderHook(() => useNexusState(), { wrapper });

    act(() => {
      nexusState.result.current.addVerdict({
        id: 'verdict-live-01',
        topic: 'Water stress alert',
        judges: ['zeta-9'],
        verdict: 'needs-review',
        confidence: 0.87,
        reasoning: 'Cross-sensor divergence exceeds threshold in 3 regions.',
        timestamp: 1_700_000_200_000,
        flowTarget: 'index',
      });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(['verdicts'])).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 'verdict-live-01' })])
      );
    });
  });

  it('computes Index entries and audit stats from Tribunal+Atlas inputs', async () => {
    vi.useFakeTimers();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.setQueryData(['verdicts'], [
      {
        id: 'verdict-preload-01',
        topic: 'Hydric pressure front',
        judges: ['zeta-9'],
        verdict: 'approved',
        confidence: 0.82,
        reasoning: 'Confirmed by cross-region climatology.',
        timestamp: 1_700_000_210_000,
        flowTarget: 'index',
      },
    ]);

    const wrapper = createClientWrapper(queryClient);
    const indexState = renderHook(() => useIndexOrgan(), { wrapper });

    await act(async () => {
      vi.advanceTimersByTime(2100);
      await Promise.resolve();
    });

    expect(indexState.result.current.entries.length).toBe(2);
    expect(indexState.result.current.stats.totalEntries).toBe(2);
    expect(indexState.result.current.stats.topSources).toEqual(expect.arrayContaining(['tribunal', 'atlas']));
    expect(indexState.result.current.entries.every((entry) => entry.flowTarget === 'news')).toBe(true);
    vi.useRealTimers();
  });
});
