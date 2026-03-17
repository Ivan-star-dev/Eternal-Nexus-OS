import { describe, expect, it } from 'vitest';
import { aggregateOrganism } from '@/lib/index-organ/aggregator';
import {
  getOrganismFlowSnapshot,
  pushOrganismVerdict,
  resetOrganismFlowForTest,
  setOrganismIndexEntries,
  setOrganismNewsItems,
  type OrganismVerdict,
} from '@/hooks/useOrganismFlow';

const buildVerdict = (): OrganismVerdict => ({
  id: 'v-1',
  createdAt: Date.now(),
  source: 'tribunal',
  summary: 'Synthetic tribunal summary',
  status: 'new',
  topic: 'Escalada Sudão 2026',
  judges: ['zeta-9', 'kronos', 'nanobanana'],
  verdict: 'needs-review',
  confidence: 0.74,
  reasoning: 'Needs coordinated response',
  timestamp: Date.now(),
  flowTarget: 'atlas',
  region: 'África',
  evidenceReference: 'ACLED',
});

describe('organism flow plumbing', () => {
  it('propagates Tribunal -> shared state -> Index -> News', () => {
    resetOrganismFlowForTest();

    const verdict = buildVerdict();
    pushOrganismVerdict(verdict);

    const afterShared = getOrganismFlowSnapshot();
    expect(afterShared.verdicts[0]?.id).toBe('v-1');
    expect(afterShared.verdicts[0]?.status).toBe('new');

    const indexEntries = aggregateOrganism(afterShared.verdicts, []);
    setOrganismIndexEntries(indexEntries);

    const afterIndex = getOrganismFlowSnapshot();
    expect(afterIndex.indexEntries.length).toBeGreaterThan(0);
    expect(afterIndex.verdicts[0]?.status).toBe('indexed');

    setOrganismNewsItems([
      {
        id: indexEntries[0].id,
        title: indexEntries[0].title,
        summary: indexEntries[0].summary,
        category: 'security',
        timestamp: new Date(indexEntries[0].timestamp).toISOString(),
        source: 'index',
      },
    ]);

    const afterNews = getOrganismFlowSnapshot();
    expect(afterNews.newsItems.length).toBe(1);
    expect(afterNews.verdicts[0]?.status).toBe('broadcast');
  });


  it('uses verdict ids for broadcast mapping and does not downgrade status', () => {
    resetOrganismFlowForTest();

    const verdict = buildVerdict();
    pushOrganismVerdict(verdict);

    setOrganismNewsItems([
      {
        id: `verdict-${verdict.id}`,
        title: 'different-title',
        summary: 'Synthetic summary',
        category: 'security',
        timestamp: new Date(verdict.timestamp).toISOString(),
        source: 'index',
      },
    ]);

    const afterNews = getOrganismFlowSnapshot();
    expect(afterNews.verdicts[0]?.status).toBe('broadcast');

    setOrganismIndexEntries([
      {
        id: `verdict-${verdict.id}`,
        rank: 0.6,
        title: verdict.topic,
        summary: verdict.reasoning,
        category: 'verdict',
        severity: verdict.confidence,
        timestamp: verdict.timestamp,
        crossReferences: [],
        flowTarget: 'news',
        sources: [{ organ: 'tribunal', dataId: verdict.id, confidence: verdict.confidence }],
      },
    ]);

    const afterIndex = getOrganismFlowSnapshot();
    expect(afterIndex.verdicts[0]?.status).toBe('broadcast');
  });
});
