import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNexusState } from '../hooks/useNexusState';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Nexus Propagation Flow', () => {
  it('should propagate a Tribunal verdict to the shared session state', async () => {
    const { result } = renderHook(() => useNexusState(), {
      wrapper: createWrapper(),
    });

    const mockVerdict = {
      id: 'test-verdict',
      topic: 'Climate Change',
      judges: ['zeta-9'] as any,
      verdict: 'approved' as const,
      confidence: 0.95,
      reasoning: 'Verified by satellite data.',
      timestamp: Date.now(),
      flowTarget: 'index' as const,
    };

    // Trigger mutation
    act(() => {
      result.current.addVerdict(mockVerdict);
    });

    // Wait for the mutation Success and cache update
    const waitFor = async (fn: () => void, ms = 1000) => {
      const start = Date.now();
      while (Date.now() - start < ms) {
        try { fn(); return; } catch {}
        await new Promise((r) => setTimeout(r, 50));
      }
      fn(); // final attempt — throws if still failing
    };
    await waitFor(() => {
      expect(result.current.verdicts).toContainEqual(mockVerdict);
    });
  });
});

