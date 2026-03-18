/**
 * useGeopoliticsMap — Bridge between MapLibre and the Nervous System event bus.
 *
 * Sacred Flow: Tribunal → Atlas (this hook) → Index → News
 *
 * Subscribes to tribunal.verdict events on the bus, transforms them into
 * GeoJSON features for the map, and exposes conflict tension data.
 * Also publishes atlas.marker events when the user interacts with the map
 * (click on region → Atlas publishes marker → flows downstream).
 *
 * Task C4: Also builds conflictGeoJSON from RealtimeDataPoint sources
 * for the conflict tension heatmap layer (teal → orange → red).
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDefaultBus } from '@/lib/events/bus';
import { makeEventId, seedFromId } from '@/lib/events/id';
import type {
  NexusEvent,
  TribunalVerdictPayload,
  AtlasMarkerPayload,
} from '@/types/sacred-flow';
import type { RealtimeDataPoint } from '@/types';

/** GeoJSON Feature for a verdict marker on the map */
export interface VerdictFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    id: string;
    topic: string;
    verdict: 'approved' | 'rejected' | 'needs-review';
    confidence: number;
    reasoning: string;
    severity: number;
    timestamp: string;
  };
}

/** GeoJSON FeatureCollection for all verdict markers */
export interface VerdictGeoJSON {
  type: 'FeatureCollection';
  features: VerdictFeature[];
}

/** GeoJSON Feature for a conflict tension point (Task C4) */
export interface ConflictFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    conflictLevel: number;   // 0–1 normalized tension
    label: string;
    source: string;
    timestamp: number;
  };
}

/** GeoJSON FeatureCollection for conflict heatmap (Task C4) */
export interface ConflictGeoJSON {
  type: 'FeatureCollection';
  features: ConflictFeature[];
}

// Hard-coded topic → geo mapping for known geopolitical topics
// In production, this comes from Atlas sensor data or NLP geo-extraction
const TOPIC_LOCATIONS: Record<string, [number, number]> = {
  // Format: [lng, lat]
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
  'netherlands': [4.89, 52.37],
  'barcelona': [2.17, 41.39],
  'lisboa': [-9.14, 38.72],
  'paris': [2.35, 48.85],
  'tokyo': [139.77, 35.68],
  'default': [0, 20], // Atlantic center
};

/**
 * Extract a geo-location from a verdict topic string.
 * Matches known locations by keyword. Falls back to Atlantic center.
 */
function topicToCoordinates(topic: string): [number, number] {
  const lower = topic.toLowerCase();
  for (const [keyword, coords] of Object.entries(TOPIC_LOCATIONS)) {
    if (lower.includes(keyword)) return coords;
  }
  return TOPIC_LOCATIONS['default'];
}

/**
 * Hook: useGeopoliticsMap
 *
 * Returns a live GeoJSON FeatureCollection of verdict markers,
 * and a function to publish atlas markers when the user clicks the map.
 */
export function useGeopoliticsMap() {
  const bus = getDefaultBus();
  const [verdictGeoJSON, setVerdictGeoJSON] = useState<VerdictGeoJSON>({
    type: 'FeatureCollection',
    features: [],
  });
  const [conflictGeoJSON, setConflictGeoJSON] = useState<ConflictGeoJSON>({
    type: 'FeatureCollection',
    features: [],
  });
  const publishedAtlasIds = useRef(new Set<string>());

  // Subscribe to tribunal.verdict events → transform to GeoJSON
  useEffect(() => {
    const unsubscribe = bus.subscribe(
      { types: ['tribunal.verdict'] },
      (event: NexusEvent) => {
        const payload = event.payload as TribunalVerdictPayload;
        const coords = topicToCoordinates(payload.topic);

        const feature: VerdictFeature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: coords,
          },
          properties: {
            id: event.id,
            topic: payload.topic,
            verdict: payload.verdict,
            confidence: event.confidence ?? 0.5,
            reasoning: payload.reasoning,
            severity: event.severity ?? 0.5,
            timestamp: event.createdAt,
          },
        };

        setVerdictGeoJSON((prev) => ({
          type: 'FeatureCollection',
          features: [...prev.features, feature],
        }));
      }
    );

    return unsubscribe;
  }, [bus]);

  // Replay existing verdicts on mount (cursor-based replay)
  useEffect(() => {
    const existing = bus.replay({ types: ['tribunal.verdict'] });
    if (existing.length === 0) return;

    const features: VerdictFeature[] = existing.map((event) => {
      const payload = event.payload as TribunalVerdictPayload;
      const coords = topicToCoordinates(payload.topic);

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: coords },
        properties: {
          id: event.id,
          topic: payload.topic,
          verdict: payload.verdict,
          confidence: event.confidence ?? 0.5,
          reasoning: payload.reasoning,
          severity: event.severity ?? 0.5,
          timestamp: event.createdAt,
        },
      };
    });

    setVerdictGeoJSON({ type: 'FeatureCollection', features });
  }, [bus]);

  /**
   * Publish an atlas.marker event when the user interacts with the map.
   * Sacred Flow: Atlas → Index → News
   */
  const publishAtlasMarker = useCallback(
    (lat: number, lng: number, label: string, category: string) => {
      const payload: AtlasMarkerPayload = {
        lat,
        lng,
        label,
        category,
        intensity: 0.7,
      };

      const createdAt = new Date().toISOString();
      const eventId = makeEventId('atlas.marker', 'atlas', createdAt, payload);

      // Prevent duplicate markers
      if (publishedAtlasIds.current.has(eventId)) return;

      const event: NexusEvent<AtlasMarkerPayload> = {
        id: eventId,
        type: 'atlas.marker',
        createdAt,
        source: 'atlas',
        severity: 0.5,
        payload,
        confidence: 0.8,
        seed: seedFromId(eventId),
        version: 1,
      };

      if (bus.publish(event as NexusEvent)) {
        publishedAtlasIds.current.add(eventId);
      }
    },
    [bus]
  );

  return {
    /** Live GeoJSON of verdict markers for the map */
    verdictGeoJSON,
    /** Live GeoJSON of conflict tension points for the heatmap (Task C4) */
    conflictGeoJSON,
    /** Update conflict heatmap from external RealtimeDataPoint feed */
    updateConflictData: (points: RealtimeDataPoint[]) => {
      const features: ConflictFeature[] = points
        .filter(
          (p): p is RealtimeDataPoint & { conflictLevel: number } =>
            p.source === 'geopolitics' &&
            typeof p.conflictLevel === 'number' &&
            p.conflictLevel >= 0 &&
            p.conflictLevel <= 1
        )
        .map((p) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [p.lng, p.lat] as [number, number],
          },
          properties: {
            conflictLevel: p.conflictLevel,
            label: p.label ?? 'Conflict Zone',
            source: p.source,
            timestamp: p.timestamp,
          },
        }));
      setConflictGeoJSON({ type: 'FeatureCollection', features });
    },
    /** Publish an atlas marker event (user click → Sacred Flow) */
    publishAtlasMarker,
    /** Direct bus reference for advanced usage */
    bus,
  };
}
