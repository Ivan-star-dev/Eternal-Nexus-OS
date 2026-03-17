import { useEffect, useMemo, useState } from 'react';
import type { RealtimeDataPoint, TribunalVerdict } from '@/types/index';
import { INDEX_CATEGORIES, type IndexEntry, type IndexStats } from '@/types/index-organ';
import { aggregateOrganism } from '@/lib/index-organ/aggregator';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useOrganismFlow } from '@/hooks/useOrganismFlow';

interface UseIndexOrganResult {
  entries: IndexEntry[];
  isProcessing: boolean;
  lastUpdate: number | null;
  stats: IndexStats;
}

export const useIndexOrgan = (verdicts?: TribunalVerdict[]): UseIndexOrganResult => {
  const { data: realtimeData, isLoading } = useRealtimeData();
  const { verdicts: sharedVerdicts, setIndexEntries } = useOrganismFlow();
  const [entries, setEntries] = useState<IndexEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const inputVerdicts = useMemo(() => {
    if (verdicts && verdicts.length > 0) return verdicts;
    return sharedVerdicts;
  }, [verdicts, sharedVerdicts]);

  const safeRealtimeData = useMemo<RealtimeDataPoint[]>(() => {
    if (!Array.isArray(realtimeData)) return [];
    return realtimeData;
  }, [realtimeData]);

  useEffect(() => {
    if (isLoading) return;
    setIsProcessing(true);

    const timer = setTimeout(() => {
      const nextEntries = aggregateOrganism(inputVerdicts, safeRealtimeData);
      setEntries(nextEntries);
      setIndexEntries(nextEntries);
      setLastUpdate(Date.now());
      setIsProcessing(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [inputVerdicts, safeRealtimeData, isLoading, setIndexEntries]);

  const stats: IndexStats = useMemo(() => {
    const byCategory = Object.fromEntries(
      INDEX_CATEGORIES.map((category) => [category, 0]),
    ) as IndexStats['byCategory'];

    let severityTotal = 0;
    const sourceCount: Record<string, number> = {};

    for (const e of entries) {
      byCategory[e.category] += 1;
      severityTotal += e.severity;
      for (const s of e.sources) {
        sourceCount[s.organ] = (sourceCount[s.organ] ?? 0) + 1;
      }
    }

    const topSources = Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 3);

    return {
      totalEntries: entries.length,
      byCategory,
      avgSeverity: entries.length ? severityTotal / entries.length : 0,
      topSources,
    };
  }, [entries]);

  return { entries, isProcessing, lastUpdate, stats };
};
