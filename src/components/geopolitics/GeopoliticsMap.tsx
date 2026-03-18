/**
 * GeopoliticsMap — MapLibre GL + PMTiles interactive geopolitics map.
 *
 * Sacred Flow: Tribunal verdicts → Atlas visualization (THIS COMPONENT)
 *
 * Architecture:
 * - MapLibre GL JS renders the 2D geopolitics map
 * - PMTiles protocol serves vector tiles serverlessly (no tile server)
 * - Event bus feeds tribunal verdicts as live GeoJSON markers
 * - User clicks publish atlas.marker events → flow downstream
 *
 * Visual DNA: Dark Glassmorphism base. @copilot layers full treatment via U1.
 *
 * Performance: Lazy-loads MapLibre (~200KB). PMTiles uses HTTP range requests.
 * Quality tier: balanced by default, no GPU-heavy effects in base shell.
 */

import { useEffect, useRef, useCallback, memo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { registerPMTilesProtocol, deregisterPMTilesProtocol } from '@/lib/map/pmtiles-protocol';
import { createDarkStyle, NEXUS_MAP_COLORS } from '@/lib/map/dark-style';
import { useGeopoliticsMap, type VerdictGeoJSON } from '@/hooks/useGeopoliticsMap';

interface GeopoliticsMapProps {
  /** PMTiles URL or vector tile template. Falls back to free OpenFreeMap tiles. */
  tileSource?: string;
  /** Initial center [lng, lat]. Default: Atlantic view. */
  center?: [number, number];
  /** Initial zoom level. Default: 2.5 (world view). */
  zoom?: number;
  /** CSS class for the map container */
  className?: string;
  /** Whether to show verdict markers from the event bus */
  showVerdicts?: boolean;
}

/** Verdict color by outcome */
const VERDICT_COLORS: Record<string, string> = {
  approved: NEXUS_MAP_COLORS.teal,
  rejected: NEXUS_MAP_COLORS.conflictHigh,
  'needs-review': NEXUS_MAP_COLORS.primary,
};

/**
 * Add the verdict markers layer to the map.
 * Called once after map loads, then updated via setData().
 */
function addVerdictLayer(map: maplibregl.Map): void {
  // Source: empty GeoJSON, updated reactively
  map.addSource('verdict-markers', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  // Glow ring (outer)
  map.addLayer({
    id: 'verdict-glow',
    type: 'circle',
    source: 'verdict-markers',
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['get', 'confidence'],
        0, 12,
        1, 24,
      ],
      'circle-color': [
        'match', ['get', 'verdict'],
        'approved', NEXUS_MAP_COLORS.teal,
        'rejected', NEXUS_MAP_COLORS.conflictHigh,
        NEXUS_MAP_COLORS.primary,
      ],
      'circle-opacity': 0.15,
      'circle-blur': 1,
    },
  });

  // Core dot
  map.addLayer({
    id: 'verdict-core',
    type: 'circle',
    source: 'verdict-markers',
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['get', 'confidence'],
        0, 4,
        1, 8,
      ],
      'circle-color': [
        'match', ['get', 'verdict'],
        'approved', NEXUS_MAP_COLORS.teal,
        'rejected', NEXUS_MAP_COLORS.conflictHigh,
        NEXUS_MAP_COLORS.primary,
      ],
      'circle-opacity': 0.9,
      'circle-stroke-width': 1,
      'circle-stroke-color': NEXUS_MAP_COLORS.background,
    },
  });

  // Topic label
  map.addLayer({
    id: 'verdict-labels',
    type: 'symbol',
    source: 'verdict-markers',
    layout: {
      'text-field': ['get', 'topic'],
      'text-font': ['Open Sans Bold'],
      'text-size': 10,
      'text-offset': [0, 1.5],
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.1,
    },
    paint: {
      'text-color': NEXUS_MAP_COLORS.text,
      'text-halo-color': NEXUS_MAP_COLORS.background,
      'text-halo-width': 1,
    },
  });
}

/**
 * Update the verdict markers data on the map.
 */
function updateVerdictData(map: maplibregl.Map, geojson: VerdictGeoJSON): void {
  const source = map.getSource('verdict-markers') as maplibregl.GeoJSONSource | undefined;
  if (source) {
    source.setData(geojson);
  }
}

const GeopoliticsMap = memo(function GeopoliticsMap({
  tileSource,
  center = [10, 25],
  zoom = 2.5,
  className = '',
  showVerdicts = true,
}: GeopoliticsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapLoaded = useRef(false);

  const { verdictGeoJSON, publishAtlasMarker } = useGeopoliticsMap();

  // Initialize MapLibre + PMTiles
  useEffect(() => {
    if (!containerRef.current) return;

    // Register PMTiles protocol (idempotent)
    registerPMTilesProtocol();

    const style = createDarkStyle(tileSource);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style,
      center,
      zoom,
      minZoom: 1.5,
      maxZoom: 16,
      attributionControl: false,
      antialias: true,
      fadeDuration: 0,
    });

    // Add compact attribution
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left'
    );

    // Navigation controls (zoom + compass)
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      'top-right'
    );

    // Scale bar
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 150 }),
      'bottom-right'
    );

    map.on('load', () => {
      mapLoaded.current = true;

      if (showVerdicts) {
        addVerdictLayer(map);
        updateVerdictData(map, verdictGeoJSON);
      }
    });

    // Click handler → publish atlas.marker event (Sacred Flow)
    map.on('click', (e) => {
      // Check if clicking on a verdict marker
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['verdict-core'],
      });

      if (features.length > 0) {
        // Show popup for the verdict
        const props = features[0].properties;
        const popup = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          className: 'nexus-popup',
          maxWidth: '280px',
        });

        const verdictColor = VERDICT_COLORS[props.verdict] || NEXUS_MAP_COLORS.primary;

        popup
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: monospace; font-size: 11px; background: ${NEXUS_MAP_COLORS.background}; color: ${NEXUS_MAP_COLORS.primary}; padding: 12px; border: 1px solid ${verdictColor};">
              <div style="font-size: 9px; letter-spacing: 0.15em; color: ${verdictColor}; margin-bottom: 6px;">
                TRIBUNAL VERDICT
              </div>
              <div style="font-size: 13px; font-weight: bold; color: #e0e0e0; margin-bottom: 4px;">
                ${props.topic}
              </div>
              <div style="color: ${verdictColor}; font-size: 10px; margin-bottom: 6px;">
                ${(props.verdict as string).toUpperCase()} · ${Math.round(props.confidence * 100)}% confidence
              </div>
              <div style="font-size: 10px; color: #888; line-height: 1.4;">
                ${typeof props.reasoning === 'string' ? props.reasoning.slice(0, 150) : ''}${typeof props.reasoning === 'string' && props.reasoning.length > 150 ? '…' : ''}
              </div>
            </div>
          `)
          .addTo(map);
      } else {
        // Empty area click → publish atlas marker
        publishAtlasMarker(
          e.lngLat.lat,
          e.lngLat.lng,
          `Point ${e.lngLat.lat.toFixed(2)}, ${e.lngLat.lng.toFixed(2)}`,
          'user-marker'
        );
      }
    });

    // Cursor changes
    map.on('mouseenter', 'verdict-core', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'verdict-core', () => {
      map.getCanvas().style.cursor = '';
    });

    mapRef.current = map;

    return () => {
      mapLoaded.current = false;
      map.remove();
      mapRef.current = null;
      // Don't deregister PMTiles here — other maps might use it
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileSource]);

  // Update verdict markers when GeoJSON changes
  useEffect(() => {
    if (mapRef.current && mapLoaded.current && showVerdicts) {
      updateVerdictData(mapRef.current, verdictGeoJSON);
    }
  }, [verdictGeoJSON, showVerdicts]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px', background: NEXUS_MAP_COLORS.background }}
    />
  );
});

export default GeopoliticsMap;
