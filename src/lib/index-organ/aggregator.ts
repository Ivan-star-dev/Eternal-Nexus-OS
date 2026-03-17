import type { RealtimeDataPoint, TribunalVerdict } from '@/types/index';
import type { IndexEntry, IndexCategory } from '@/types/index-organ';

const ONE_HOUR_MS = 60 * 60 * 1000;

const getRecencyWeight = (timestamp: number): number => {
  const hoursAgo = Math.max(0, (Date.now() - timestamp) / ONE_HOUR_MS);
  return Math.max(0.1, 1 - hoursAgo * 0.05);
};

const stringSimilarity = (a: string, b: string): number => {
  const longer = a.length >= b.length ? a : b;
  const shorter = a.length < b.length ? a : b;
  if (!longer.length) return 1;

  let matches = 0;
  for (let i = 0; i < shorter.length; i += 1) {
    if (longer[i] === shorter[i]) matches += 1;
  }
  return matches / longer.length;
};

const mapDataCategory = (dp: RealtimeDataPoint): IndexCategory => {
  if (dp.co2 !== undefined || dp.temperature !== undefined || dp.source === 'climate') return 'climate';
  if (dp.source === 'economy') return 'economy';
  if (dp.source === 'geopolitics') return 'security';
  if (dp.source === 'energy') return 'infra';
  if (dp.source === 'migration') return 'health';
  return 'climate';
};

export const aggregateOrganism = (verdicts: TribunalVerdict[], dataPoints: RealtimeDataPoint[]): IndexEntry[] => {
  const verdictEntries: IndexEntry[] = verdicts.map((v) => ({
    id: `verdict-${v.id}`,
    rank: 0,
    title: v.topic,
    summary: `${v.verdict} (${v.confidence.toFixed(2)}) — ${v.reasoning.slice(0, 140)}`,
    sources: [{ organ: 'tribunal', dataId: v.id, confidence: v.confidence }],
    category: 'verdict',
    severity: Math.min(1, Math.max(0, v.confidence)),
    timestamp: v.timestamp,
    crossReferences: [],
    flowTarget: 'news',
  }));

  const dataEntries: IndexEntry[] = dataPoints.map((dp, idx) => ({
    id: `data-${dp.source}-${dp.timestamp}-${idx}`,
    rank: 0,
    title: `${dp.source.toUpperCase()} · ${dp.value.toFixed(2)}`,
    summary: `Atualização em (${dp.lat.toFixed(2)}, ${dp.lng.toFixed(2)})` +
      (dp.label ? ` · ${dp.label}` : ''),
    sources: [{ organ: 'atlas', dataId: `${dp.source}-${dp.timestamp}`, confidence: 0.72 }],
    category: mapDataCategory(dp),
    severity: Math.min(1, Math.max(0, dp.severity ?? 0.5)),
    timestamp: dp.timestamp,
    crossReferences: [],
    flowTarget: 'news',
  }));

  const deduped: IndexEntry[] = [];
  for (const entry of [...verdictEntries, ...dataEntries]) {
    const similar = deduped.find(
      (e) => stringSimilarity(e.title, entry.title) > 0.85 && Math.abs(e.timestamp - entry.timestamp) < ONE_HOUR_MS,
    );

    if (similar) {
      similar.sources.push(...entry.sources);
      similar.severity = Math.max(similar.severity, entry.severity);
      if (!similar.summary.includes(entry.summary)) {
        similar.summary = `${similar.summary} | ${entry.summary}`;
      }
      continue;
    }

    deduped.push(entry);
  }

  for (const entry of deduped) {
    const authority = entry.sources.some((s) => s.organ === 'tribunal') ? 1 : 0.7;
    entry.rank = entry.severity * getRecencyWeight(entry.timestamp) * authority;
  }

  return deduped.sort((a, b) => b.rank - a.rank).slice(0, 200);
};
