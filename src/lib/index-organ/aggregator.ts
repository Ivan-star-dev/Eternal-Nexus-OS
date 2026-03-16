// sacred-flow: grok
import { TribunalVerdict, RealtimeDataPoint } from '@/types/index';
import { IndexEntry } from '@/types/index-organ';

// Utility to calculate recency weight based on timestamp
const getRecencyWeight = (timestamp: number): number => {
  const now = Date.now();
  const hoursAgo = (now - timestamp) / (1000 * 60 * 60);
  return Math.max(0.1, 1 - hoursAgo * 0.05); // Decay over time, min 0.1
};

// Utility for simple string similarity (for deduplication)
const stringSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer[i] === shorter[i]) matches++;
  }
  return matches / longer.length;
};

export const aggregateOrganism = (
  verdicts: TribunalVerdict[],
  dataPoints: RealtimeDataPoint[]
): IndexEntry[] => {
  // Convert TribunalVerdict to IndexEntry
  const verdictEntries: IndexEntry[] = verdicts.map((v) => ({
    id: `verdict-${v.id}`,
    rank: 0, // To be calculated
    title: v.topic,
    summary: `${v.verdict} (${v.confidence.toFixed(2)}) - ${v.reasoning.slice(0, 100)}...`,
    sources: [{ organ: 'tribunal' as const, dataId: v.id, confidence: v.confidence }],
    category: 'verdict' as const,
    severity: v.confidence,
    timestamp: v.timestamp,
    crossReferences: [],
    flowTarget: 'news' as const, // Sacred flow
  }));

  // Convert RealtimeDataPoint to IndexEntry
  const dataEntries: IndexEntry[] = dataPoints.map((dp) => {
    let category: IndexEntry['category'] = 'climate';
    const severity = dp.severity || 0.5;
    if (dp.source.includes('econ')) category = 'economy';
    if (dp.source.includes('sec')) category = 'security';
    if (dp.source.includes('health')) category = 'health';
    if (dp.source.includes('infra')) category = 'infra';
    if (dp.co2 || dp.temperature) category = 'climate';
    return {
      id: `data-${dp.source}-${dp.timestamp}`,
      rank: 0, // To be calculated
      title: `${dp.source}: ${dp.value}`,
      summary: `Real-time update at (${dp.lat.toFixed(2)}, ${dp.lng.toFixed(2)})`,
      sources: [{ organ: 'atlas' as const, dataId: dp.source, confidence: 0.7 }],
      category,
      severity,
      timestamp: dp.timestamp,
      crossReferences: [],
      flowTarget: 'news' as const, // Sacred flow
    };
  });

  // Combine entries
  const combinedEntries = [...verdictEntries, ...dataEntries];

  // Deduplicate based on title similarity and time proximity
  const deduped: IndexEntry[] = [];
  for (const entry of combinedEntries) {
    const similar = deduped.find(
      (e) =>
        stringSimilarity(e.title, entry.title) > 0.8 &&
        Math.abs(e.timestamp - entry.timestamp) < 3600000 // 1 hour
    );
    if (similar) {
      similar.sources.push(...entry.sources);
      similar.severity = Math.max(similar.severity, entry.severity);
      similar.summary += ` | ${entry.summary}`;
      continue;
    }
    deduped.push(entry);
  }

  // Calculate rank: severity × recency_weight × source_authority
  deduped.forEach((entry) => {
    const authority = entry.sources.some((s) => s.organ === 'tribunal') ? 1.0 : 0.7;
    const recency = getRecencyWeight(entry.timestamp);
    entry.rank = entry.severity * recency * authority;
  });

  // Sort by rank descending and limit to 200
  return deduped.sort((a, b) => b.rank - a.rank).slice(0, 200);
};
