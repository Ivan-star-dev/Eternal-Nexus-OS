// sacred-flow: Index organ — memory layer of the Nervous System
// Flow: Tribunal → Atlas → **Index** → News
//
// BRIDGE (v2): Index now subscribes to the event bus AND TanStack cache.
// When tribunal.verdict events arrive on the bus, they are aggregated into
// IndexEntry objects, ranked, and published back as index.entry events.
// This closes Gate: Logged — every bus event is persisted in Index.

import { useState, useEffect, useMemo, useRef } from 'react';
import { TribunalVerdict } from '@/types/index';
import { IndexEntry, IndexStats } from '@/types/index-organ';
import { aggregateOrganism } from '@/lib/index-organ/aggregator';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useNexusState } from '@/hooks/useNexusState';
import { getDefaultBus } from '@/lib/events/bus';
import { makeEventId, seedFromId } from '@/lib/events/id';
import type { NexusEvent, IndexEntryPayload } from '@/types/sacred-flow';

export const useIndexOrgan = () => {
  const { verdicts } = useNexusState();
  const { data: realtimeData, isLoading, error } = useRealtimeData();
  const [entries, setEntries] = useState<IndexEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const bus = getDefaultBus();

  // Track which entries we've already published to bus (prevent loops)
  const publishedIds = useRef<Set<string>>(new Set());

  // Debounce aggregation to prevent excessive updates
  useEffect(() => {
    if (isLoading || error) return;
    setIsProcessing(true);
    const timer = setTimeout(() => {
      const newEntries = aggregateOrganism(verdicts, realtimeData);
      setEntries(newEntries);
      setLastUpdate(Date.now());
      setIsProcessing(false);

      // Gate: Logged — publish index.entry events to bus
      // This makes every processed verdict/data point traceable on the bus
      for (const entry of newEntries) {
        if (publishedIds.current.has(entry.id)) continue;

        const payload: IndexEntryPayload = {
          title: entry.title,
          category: entry.category,
          rank: entry.rank,
          linkedVerdictId: entry.sources.find(s => s.organ === 'tribunal')?.dataId,
        };

        const createdAt = new Date(entry.timestamp).toISOString();
        const eventId = makeEventId('index.entry', 'index', createdAt, payload);

        const event: NexusEvent<IndexEntryPayload> = {
          id: eventId,
          type: 'index.entry',
          createdAt,
          source: 'index',
          severity: entry.severity,
          payload,
          confidence: entry.sources[0]?.confidence ?? 0.7,
          seed: seedFromId(eventId),
          version: 1,
        };

        if (bus.publish(event as NexusEvent)) {
          publishedIds.current.add(entry.id);
        }
      }
    }, 2000); // 2s debounce
    return () => clearTimeout(timer);
  }, [verdicts, realtimeData, isLoading, error, bus]);

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
