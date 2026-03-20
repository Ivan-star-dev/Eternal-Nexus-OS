// sacred-flow: grok
import { useState, useEffect, useMemo } from 'react';
import { TribunalVerdict } from '@/types/index';
import { IndexEntry, IndexStats } from '@/types/index-organ';
import { aggregateOrganism } from '@/lib/index-organ/aggregator';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useNexusState } from '@/hooks/useNexusState';

export const useIndexOrgan = () => {
  const { verdicts } = useNexusState();
  const { data: realtimeData, isLoading, error } = useRealtimeData();
  const [entries, setEntries] = useState<IndexEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  // Debounce aggregation to prevent excessive updates
  useEffect(() => {
    if (isLoading || error) return;
    setIsProcessing(true);
    const timer = setTimeout(() => {
      const newEntries = aggregateOrganism(verdicts, realtimeData);
      setEntries(newEntries);
      setLastUpdate(Date.now());
      setIsProcessing(false);
    }, 2000); // 2s debounce
    return () => clearTimeout(timer);
  }, [verdicts, realtimeData, isLoading, error]);

  // Compute stats memoized
  const stats: IndexStats = useMemo(() => {
    const totalEntries = entries.length;
    const byCategory: Record<string, number> = {
      verdict: 0,
      climate: 0,
      economy: 0,
      security: 0,
      health: 0,
      infra: 0,
    };
    let totalSeverity = 0;
    const sourceCounts: Record<string, number> = {};

    entries.forEach((e) => {
      byCategory[e.category]++;
      totalSeverity += e.severity;
      e.sources.forEach((s) => {
        sourceCounts[s.organ] = (sourceCounts[s.organ] || 0) + 1;
      });
    });

    const topSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .map((e) => e[0])
      .slice(0, 3);

    return {
      totalEntries,
      byCategory,
      avgSeverity: totalEntries > 0 ? totalSeverity / totalEntries : 0,
      topSources,
    };
  }, [entries]);

  return { entries, isProcessing, lastUpdate, stats, realtimeData };
};
