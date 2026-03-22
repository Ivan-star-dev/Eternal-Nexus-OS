/**
 * useConflictHeatmap — C4 data layer for the GeopoliticsMap conflict heatmap.
 *
 * Sacred Flow: Tribunal → Atlas (this hook) → rendered heatmap layer
 *
 * Consumes:
 * 1. tribunal.verdict events — maps severity + confidence to heatmap weight
 * 2. RealtimeDataPoint with source:'geopolitics' + conflictLevel field
 *
 * Returns a GeoJSON FeatureCollection suitable for a MapLibre heatmap layer.
 * Each feature has a `weight` property (0–1) driving teal→orange→red gradient.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDefaultBus } from '@/lib/events/bus';
import type { NexusEvent, TribunalVerdictPayload } from '@/types/sacred-flow';
import type { RealtimeDataPoint } from '@/types';

/** GeoJSON feature for a single heatmap point */
interface HeatmapFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    weight: number; // 0-1 → teal (calm) to red (conflict)
    source: string;
  };
}

/** GeoJSON FeatureCollection for the heatmap layer */
export interface HeatmapGeoJSON {
  type: 'FeatureCollection';
  features: HeatmapFeature[];
}

// Known geopolitical hotspots with base tension weights
// Used to seed the heatmap before live data arrives
const SEED_HOTSPOTS: HeatmapFeature[] = [
  // [lng, lat], weight
  { type: 'Feature', geometry: { type: 'Point', coordinates: [35.21, 31.77] }, properties: { weight: 0.92, source: 'seed' } },  // Israel
  { type: 'Feature', geometry: { type: 'Point', coordinates: [34.47, 31.50] }, properties: { weight: 0.95, source: 'seed' } },  // Gaza
  { type: 'Feature', geometry: { type: 'Point', coordinates: [30.52, 50.45] }, properties: { weight: 0.88, source: 'seed' } },  // Ukraine
  { type: 'Feature', geometry: { type: 'Point', coordinates: [51.39, 35.69] }, properties: { weight: 0.75, source: 'seed' } },  // Iran
  { type: 'Feature', geometry: { type: 'Point', coordinates: [114.0, 12.0] },  properties: { weight: 0.65, source: 'seed' } },  // South China Sea
  { type: 'Feature', geometry: { type: 'Point', coordinates: [125.75, 39.02] }, properties: { weight: 0.70, source: 'seed' } }, // North Korea
  { type: 'Feature', geometry: { type: 'Point', coordinates: [43.0, 12.5] },   properties: { weight: 0.80, source: 'seed' } },  // Horn of Africa
  { type: 'Feature', geometry: { type: 'Point', coordinates: [21.5, 11.0] },   properties: { weight: 0.72, source: 'seed' } },  // Sudan/Sahel
];

/**
 * Hook: useConflictHeatmap
 *
 * Subscribes to tribunal.verdict events and accepts RealtimeDataPoint injections.
 * Returns a live GeoJSON FeatureCollection for the conflict tension heatmap.
 */
export function useConflictHeatmap() {
  const bus = getDefaultBus();
  const [heatmapGeoJSON, setHeatmapGeoJSON] = useState<HeatmapGeoJSON>({
    type: 'FeatureCollection',
    features: [...SEED_HOTSPOTS],
  });
  const processedIds = useRef(new Set<string>());
  const MAX_PROCESSED_IDS = 10_000;

  /** Add to processedIds with size cap to prevent unbounded growth. */
  const markProcessed = useCallback((id: string) => {
    if (processedIds.current.size >= MAX_PROCESSED_IDS) {
      // Drop the oldest half when the cap is reached
      const arr = Array.from(processedIds.current);
      processedIds.current = new Set(arr.slice(arr.length / 2));
    }
    processedIds.current.add(id);
  }, []);

  /**
   * Merge a set of new heatmap features.
   * Accumulates rather than replaces, preserving seed data.
   */
  const addFeatures = useCallback((newFeatures: HeatmapFeature[]) => {
    setHeatmapGeoJSON((prev) => ({
      type: 'FeatureCollection',
      features: [...prev.features, ...newFeatures],
    }));
  }, []);

  // Subscribe to tribunal.verdict events → derive heatmap weight
  useEffect(() => {
    const unsubscribe = bus.subscribe(
      { types: ['tribunal.verdict'] },
      (event: NexusEvent) => {
        if (processedIds.current.has(event.id)) return;
        markProcessed(event.id);

        const payload = event.payload as TribunalVerdictPayload;

        // Derive conflict weight from verdict + severity + confidence
        let weight = (event.severity ?? 0.5) * (event.confidence ?? 0.5);
        if (payload.verdict === 'rejected') weight = Math.min(1, weight * 1.4);
        if (payload.verdict === 'approved') weight = weight * 0.6;

        // Try to extract coordinates from topic keyword mapping (same as useGeopoliticsMap)
        const coords = topicToHeatmapCoords(payload.topic);
        if (!coords) return;

        // Spread a cluster of points around the hotspot for a true heatmap feel
        const cluster = generateCluster(coords, weight, event.id);
        addFeatures(cluster);
      }
    );
    return unsubscribe;
  }, [bus, addFeatures, markProcessed]);

  // Replay existing tribunal verdicts on mount
  useEffect(() => {
    const existing = bus.replay({}).filter((e) => e.type === 'tribunal.verdict');
    if (existing.length === 0) return;

    const newFeatures: HeatmapFeature[] = [];
    for (const event of existing) {
      if (processedIds.current.has(event.id)) continue;
      markProcessed(event.id);

      const payload = event.payload as TribunalVerdictPayload;
      let weight = (event.severity ?? 0.5) * (event.confidence ?? 0.5);
      if (payload.verdict === 'rejected') weight = Math.min(1, weight * 1.4);
      if (payload.verdict === 'approved') weight = weight * 0.6;

      const coords = topicToHeatmapCoords(payload.topic);
      if (!coords) continue;

      newFeatures.push(...generateCluster(coords, weight, event.id));
    }

    if (newFeatures.length > 0) addFeatures(newFeatures);
  }, [bus, addFeatures, markProcessed]);

  /**
   * Ingest a RealtimeDataPoint with source:'geopolitics' and conflictLevel.
   * Called from the parent component when new data arrives.
   */
  const ingestDataPoint = useCallback((point: RealtimeDataPoint) => {
    if (point.source !== 'geopolitics' || point.conflictLevel == null) return;

    const id = `realtime-${point.lat}-${point.lng}-${point.timestamp}`;
    if (processedIds.current.has(id)) return;
    markProcessed(id);

    const feature: HeatmapFeature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [point.lng, point.lat] },
      properties: { weight: Math.min(1, Math.max(0, point.conflictLevel)), source: 'realtime' },
    };
    addFeatures([feature]);
  }, [addFeatures]);

  return {
    /** Live GeoJSON for the MapLibre heatmap layer */
    heatmapGeoJSON,
    /** Ingest a RealtimeDataPoint — call from parent when geopolitics data arrives */
    ingestDataPoint,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TOPIC_HEATMAP_LOCATIONS: Record<string, [number, number]> = {
  'ukraine': [30.52, 50.45],
  'russia': [37.62, 55.76],
  'china': [116.40, 39.91],
  'taiwan': [121.56, 25.03],
  'iran': [51.39, 35.69],
  'israel': [35.21, 31.77],
  'gaza': [34.47, 31.50],
  'north korea': [125.75, 39.02],
  'south china sea': [114.0, 12.0],
  'brazil': [-47.88, -15.79],
  'cabo verde': [-24.35, 14.95],
  'syria': [36.3, 35.0],
  'yemen': [44.2, 15.3],
  'sudan': [32.5, 15.5],
  'myanmar': [96.2, 19.7],
  'sahel': [2.0, 14.0],
};

function topicToHeatmapCoords(topic: string): [number, number] | null {
  const lower = topic.toLowerCase();
  for (const [keyword, coords] of Object.entries(TOPIC_HEATMAP_LOCATIONS)) {
    if (lower.includes(keyword)) return coords;
  }
  return null; // Unknown location — skip rather than defaulting
}

/**
 * Generate a small cluster of points around a hotspot center.
 * Creates a natural heatmap spread instead of a single spike.
 */
function generateCluster(
  center: [number, number],
  weight: number,
  seed: string
): HeatmapFeature[] {
  // Deterministic pseudo-random from seed string (unsigned 32-bit to prevent overflow)
  const hash = seed.split('').reduce((acc, c) => ((acc * 31 + c.charCodeAt(0)) >>> 0), 0);
  const rand = (i: number) => Math.abs(Math.sin(hash + i)) * 2 - 1;

  const spread = 2.5; // degrees spread
  const count = 5;
  return Array.from({ length: count }, (_, i) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [
        center[0] + rand(i * 2) * spread,
        center[1] + rand(i * 2 + 1) * spread,
      ] as [number, number],
    },
    properties: {
      weight: weight * (0.7 + rand(i * 3) * 0.3),
      source: 'verdict',
    },
  }));
}
