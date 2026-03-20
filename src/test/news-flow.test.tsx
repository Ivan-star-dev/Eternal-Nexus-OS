import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NewsPortal from '@/pages/NewsPortal';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

vi.mock('@/hooks/useIndexOrgan', () => ({
  useIndexOrgan: () => ({
    entries: [
      {
        id: 'idx-001',
        rank: 0.91,
        title: 'Tribunal corridor alert',
        summary: 'Escalation corridor validated by Atlas feeds.',
        sources: [{ organ: 'tribunal', dataId: 'v1', confidence: 0.91 }],
        category: 'verdict',
        severity: 0.88,
        timestamp: 1_700_000_300_000,
        crossReferences: [],
        flowTarget: 'news',
      },
    ],
    isProcessing: false,
    lastUpdate: 1_700_000_300_500,
    stats: {
      totalEntries: 1,
      byCategory: { verdict: 1, climate: 0, economy: 0, security: 0, health: 0, infra: 0 },
      avgSeverity: 0.88,
      topSources: ['tribunal'],
    },
  }),
}));

vi.mock('@/components/news/AIAnchor3D', () => ({
  default: ({ reportTitle }: { reportTitle?: string }) => <div data-testid="ai-anchor">{reportTitle}</div>,
}));

vi.mock('@/components/news/BroadcastBar', () => ({
  default: () => <div data-testid="broadcast-bar" />,
}));

describe('News organ consumes Index output', () => {
  it('renders Index entry content in the News portal', async () => {
    render(
      <MemoryRouter>
        <NewsPortal />
      </MemoryRouter>
    );

    expect((await screen.findAllByText('Tribunal corridor alert')).length).toBeGreaterThan(0);
    expect(screen.getByText(/Fonte:\s*tribunal/i)).toBeInTheDocument();
    expect(screen.getByTestId('ai-anchor')).toHaveTextContent('Tribunal corridor alert');
  });
});
