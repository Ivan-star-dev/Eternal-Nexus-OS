/**
 * GeopoliticsMap — MapLibre GL + PMTiles interactive geopolitics map.
 *
 * Sacred Flow: Tribunal verdicts → Atlas visualization (THIS COMPONENT)
 *
 * Tasks completed:
 * - U1: Dark Glassmorphism visual DNA — neon border animation, labels, popup styling
 * - U2: LayerTogglePanel — toggle verdict markers, conflict heatmap, migration, energy
 * - C4: Conflict tension heatmap — teal→orange→red gradient driven by tribunal verdicts
 *
 * Architecture:
 * - MapLibre GL JS renders the 2D geopolitics map
 * - PMTiles protocol serves vector tiles serverlessly (no tile server)
 * - Event bus feeds tribunal verdicts as live GeoJSON markers + heatmap
 * - LayerTogglePanel controls layer visibility from the overlay
 * - User clicks publish atlas.marker events → flow downstream
 *
 * Performance: Lazy-loads MapLibre (~200KB). PMTiles uses HTTP range requests.
 */

import { useEffect, useRef, useCallback, useState, memo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { registerPMTilesProtocol } from '@/lib/map/pmtiles-protocol';
import { createDarkStyle, NEXUS_MAP_COLORS, startNeonBorderAnimation, enableHoverEffects } from '@/lib/map/dark-style';
import { useGeopoliticsMap, type VerdictGeoJSON } from '@/hooks/useGeopoliticsMap';
import { useConflictHeatmap, type HeatmapGeoJSON } from '@/hooks/useConflictHeatmap';
import LayerTogglePanel, { DEFAULT_VISIBILITY, type LayerVisibility, type LayerId } from './LayerTogglePanel';

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
  map.addSource('verdict-markers', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
    generateId: true,
  });

  // Outer glow ring (halo)
  map.addLayer({
    id: 'verdict-halo',
    type: 'circle',
    source: 'verdict-markers',
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['get', 'confidence'],
        0, 18, 1, 32,
      ],
      'circle-color': [
        'match', ['get', 'verdict'],
        'approved', NEXUS_MAP_COLORS.teal,
        'rejected', NEXUS_MAP_COLORS.conflictHigh,
        NEXUS_MAP_COLORS.primary,
      ],
      'circle-opacity': 0.07,
      'circle-blur': 1.5,
    },
  });

  // Mid glow ring
  map.addLayer({
    id: 'verdict-glow',
    type: 'circle',
    source: 'verdict-markers',
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['get', 'confidence'],
        0, 12, 1, 24,
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

  // Branded Nexus marker — outer reticle ring (stroke-only circle, no fill)
  map.addLayer({
    id: 'verdict-ring',
    type: 'circle',
    source: 'verdict-markers',
    paint: {
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        ['interpolate', ['linear'], ['get', 'confidence'], 0, 13, 1, 22],
        ['interpolate', ['linear'], ['get', 'confidence'], 0, 10, 1, 18],
      ],
      'circle-color': 'transparent',
      'circle-opacity': 1,
      'circle-stroke-width': [
        'case', ['boolean', ['feature-state', 'hover'], false], 2.5, 1.5,
      ],
      'circle-stroke-color': [
        'match', ['get', 'verdict'],
        'approved', NEXUS_MAP_COLORS.teal,
        'rejected', NEXUS_MAP_COLORS.conflictHigh,
        NEXUS_MAP_COLORS.primary,
      ],
      'circle-stroke-opacity': [
        'case', ['boolean', ['feature-state', 'hover'], false], 1, 0.75,
      ],
      'circle-blur': 0,
    },
  });

  // Core dot — brightens on hover
  map.addLayer({
    id: 'verdict-core',
    type: 'circle',
    source: 'verdict-markers',
    paint: {
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        ['interpolate', ['linear'], ['get', 'confidence'], 0, 6, 1, 10],
        ['interpolate', ['linear'], ['get', 'confidence'], 0, 4, 1, 8],
      ],
      'circle-color': [
        'match', ['get', 'verdict'],
        'approved', NEXUS_MAP_COLORS.teal,
        'rejected', NEXUS_MAP_COLORS.conflictHigh,
        NEXUS_MAP_COLORS.primary,
      ],
      'circle-opacity': [
        'case', ['boolean', ['feature-state', 'hover'], false], 1, 0.95,
      ],
      'circle-stroke-width': 1.5,
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
      'text-offset': [0, 1.8],
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.12,
    },
    paint: {
      'text-color': NEXUS_MAP_COLORS.text,
      'text-halo-color': NEXUS_MAP_COLORS.background,
      'text-halo-width': 1.5,
    },
  });
}

/**
 * Add the conflict tension heatmap layer (Task C4).
 * Color gradient: teal (calm) → orange (tension) → red (conflict)
 */
function addHeatmapLayer(map: maplibregl.Map): void {
  map.addSource('conflict-heatmap', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  map.addLayer(
    {
      id: 'conflict-heatmap-layer',
      type: 'heatmap',
      source: 'conflict-heatmap',
      maxzoom: 9,
      paint: {
        // Intensity scales with conflict weight
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'weight'], 0, 0, 1, 1],
        // Heatmap intensity — increases with zoom for detail
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0.8, 9, 2],
        // Color ramp: teal (calm) → orange (tension) → red (conflict)
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,   'rgba(74, 226, 200, 0)',     // transparent
          0.1, 'rgba(74, 226, 200, 0.4)',   // teal — calm
          0.3, 'rgba(100, 200, 150, 0.5)',  // teal-green
          0.5, 'rgba(226, 148, 74, 0.6)',   // orange — rising tension
          0.7, 'rgba(226, 100, 74, 0.7)',   // red-orange
          1.0, 'rgba(226, 74, 111, 0.85)',  // red — active conflict
        ],
        // Radius grows with zoom level
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 20, 9, 50],
        // Fade out at zoom 7, replaced by circle layer
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0.9, 9, 0],
      },
    },
    // Insert below verdict layers so markers stay on top
    'verdict-halo'
  );

  // At higher zooms — switch to conflict circles for precision
  map.addLayer(
    {
      id: 'conflict-circles',
      type: 'circle',
      source: 'conflict-heatmap',
      minzoom: 7,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 4, 16, 16],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'weight'],
          0,   NEXUS_MAP_COLORS.conflictLow,
          0.4, NEXUS_MAP_COLORS.conflictMed,
          1,   NEXUS_MAP_COLORS.conflictHigh,
        ],
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 0.7],
        'circle-blur': 0.6,
        'circle-stroke-width': 0,
      },
    },
    'verdict-halo'
  );
}

/**
 * Add placeholder migration route lines layer (U2 toggle target).
 * Lines are seeded with known migration corridors; can be fed live data later.
 */
function addMigrationLayer(map: maplibregl.Map): void {
  map.addSource('migration-routes', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        // Africa → Mediterranean
        { type: 'Feature', geometry: { type: 'LineString', coordinates: [[13.5, 15.0], [12.0, 25.0], [10.0, 33.0], [13.2, 37.5]] }, properties: {} },
        // Middle East → Europe
        { type: 'Feature', geometry: { type: 'LineString', coordinates: [[36.0, 32.0], [28.0, 38.0], [23.0, 40.0], [14.0, 46.0]] }, properties: {} },
        // Central America → North
        { type: 'Feature', geometry: { type: 'LineString', coordinates: [[-85.0, 12.0], [-90.0, 15.5], [-94.0, 18.0], [-99.0, 22.0]] }, properties: {} },
        // SE Asia → Pacific
        { type: 'Feature', geometry: { type: 'LineString', coordinates: [[95.0, 20.0], [100.0, 13.0], [110.0, 7.0], [124.0, 5.0]] }, properties: {} },
      ],
    },
  });

  map.addLayer({
    id: 'migration-route-lines',
    type: 'line',
    source: 'migration-routes',
    layout: { visibility: 'none' },
    paint: {
      'line-color': NEXUS_MAP_COLORS.teal,
      'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1, 8, 3],
      'line-opacity': 0.55,
      'line-dasharray': [3, 4],
    },
  });

  map.addLayer({
    id: 'migration-route-glow',
    type: 'line',
    source: 'migration-routes',
    layout: { visibility: 'none' },
    paint: {
      'line-color': NEXUS_MAP_COLORS.tealGlow,
      'line-width': ['interpolate', ['linear'], ['zoom'], 2, 4, 8, 8],
      'line-opacity': 0.25,
      'line-blur': 3,
    },
  });
}

/**
 * Add placeholder energy grid nodes layer (U2 toggle target).
 */
function addEnergyGridLayer(map: maplibregl.Map): void {
  map.addSource('energy-grid', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        // Major energy hubs
        { type: 'Feature', geometry: { type: 'Point', coordinates: [55.3, 25.1] }, properties: { intensity: 0.9 } }, // Gulf
        { type: 'Feature', geometry: { type: 'Point', coordinates: [49.5, 56.8] }, properties: { intensity: 0.85 } }, // Russia
        { type: 'Feature', geometry: { type: 'Point', coordinates: [-97.0, 35.0] }, properties: { intensity: 0.95 } }, // US
        { type: 'Feature', geometry: { type: 'Point', coordinates: [113.0, 23.0] }, properties: { intensity: 0.8 } }, // China
        { type: 'Feature', geometry: { type: 'Point', coordinates: [-60.0, -3.0] }, properties: { intensity: 0.7 } }, // Brazil
        { type: 'Feature', geometry: { type: 'Point', coordinates: [8.5, 53.0] }, properties: { intensity: 0.75 } }, // Europe
      ],
    },
  });

  map.addLayer({
    id: 'energy-grid-glow',
    type: 'circle',
    source: 'energy-grid',
    layout: { visibility: 'none' },
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 12, 8, 30],
      'circle-color': '#3b82f6',
      'circle-opacity': ['*', ['get', 'intensity'], 0.12],
      'circle-blur': 1.5,
    },
  });

  map.addLayer({
    id: 'energy-grid-core',
    type: 'circle',
    source: 'energy-grid',
    layout: { visibility: 'none' },
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 3, 8, 7],
      'circle-color': '#60a5fa',
      'circle-opacity': ['*', ['get', 'intensity'], 0.8],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#1e3a5f',
    },
  });
}

function updateVerdictData(map: maplibregl.Map, geojson: VerdictGeoJSON): void {
  const source = map.getSource('verdict-markers') as maplibregl.GeoJSONSource | undefined;
  if (source) source.setData(geojson);
}

function updateHeatmapData(map: maplibregl.Map, geojson: HeatmapGeoJSON): void {
  const source = map.getSource('conflict-heatmap') as maplibregl.GeoJSONSource | undefined;
  if (source) source.setData(geojson);
}

/** Map layer IDs controlled by each toggle */
const LAYER_MAP_IDS: Record<LayerId, string[]> = {
  'verdict-markers': ['verdict-halo', 'verdict-glow', 'verdict-ring', 'verdict-core', 'verdict-labels'],
  'conflict-heatmap': ['conflict-heatmap-layer', 'conflict-circles'],
  'migration-routes': ['migration-route-lines', 'migration-route-glow'],
  'energy-grid': ['energy-grid-glow', 'energy-grid-core'],
};

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
  const stopAnimationRef = useRef<(() => void) | null>(null);
  const stopHoverRef = useRef<(() => void) | null>(null);
  const hoveredVerdictId = useRef<string | number | null>(null);

  // Layer visibility state (U2)
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>(DEFAULT_VISIBILITY);

  const { verdictGeoJSON, publishAtlasMarker } = useGeopoliticsMap();
  const { heatmapGeoJSON } = useConflictHeatmap();

  // Initialize MapLibre + PMTiles
  useEffect(() => {
    if (!containerRef.current) return;

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
      fadeDuration: 0,
    } as maplibregl.MapOptions);

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 150 }), 'bottom-right');

    map.on('load', () => {
      mapLoaded.current = true;

      // Add all layers
      addHeatmapLayer(map);
      addMigrationLayer(map);
      addEnergyGridLayer(map);

      if (showVerdicts) {
        addVerdictLayer(map);
        updateVerdictData(map, verdictGeoJSON);
      }

      updateHeatmapData(map, heatmapGeoJSON);

      // Apply initial visibility from state
      applyLayerVisibility(map, layerVisibility);

      // Start neon border animation (U1) — stored in ref for safe cleanup
      stopAnimationRef.current = startNeonBorderAnimation(map);

      // Enable hover effects (U1) — country border + verdict marker glows
      stopHoverRef.current = enableHoverEffects(map);
    });

    // Click handler → popup for verdicts, publish atlas.marker for empty areas
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['verdict-core'] });

      if (features.length > 0) {
        const props = features[0].properties;
        const verdictColor = VERDICT_COLORS[props.verdict as string] ?? NEXUS_MAP_COLORS.primary;

        new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          className: 'nexus-popup',
          maxWidth: '280px',
        })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family:monospace;font-size:11px;background:${NEXUS_MAP_COLORS.background};color:${NEXUS_MAP_COLORS.primary};padding:12px;border:1px solid ${verdictColor};box-shadow:0 0 16px ${verdictColor}44;">
              <div style="font-size:9px;letter-spacing:0.15em;color:${verdictColor};margin-bottom:6px;">TRIBUNAL VERDICT</div>
              <div style="font-size:13px;font-weight:bold;color:#e0e0e0;margin-bottom:4px;">${props.topic}</div>
              <div style="color:${verdictColor};font-size:10px;margin-bottom:6px;">
                ${String(props.verdict).toUpperCase()} · ${Math.round((props.confidence as number) * 100)}% confidence
              </div>
              <div style="font-size:10px;color:#888;line-height:1.4;">
                ${typeof props.reasoning === 'string' ? props.reasoning.slice(0, 150) : ''}${typeof props.reasoning === 'string' && props.reasoning.length > 150 ? '…' : ''}
              </div>
            </div>
          `)
          .addTo(map);
      } else {
        publishAtlasMarker(
          e.lngLat.lat,
          e.lngLat.lng,
          `Point ${e.lngLat.lat.toFixed(2)}, ${e.lngLat.lng.toFixed(2)}`,
          'user-marker'
        );
      }
    });

    map.on('mouseenter', 'verdict-core', (e) => {
      map.getCanvas().style.cursor = 'pointer';
      if (e.features && e.features.length > 0) {
        const id = e.features[0].id as string | number | undefined;
        if (id != null) {
          if (hoveredVerdictId.current != null) {
            map.setFeatureState({ source: 'verdict-markers', id: hoveredVerdictId.current }, { hover: false });
          }
          hoveredVerdictId.current = id;
          map.setFeatureState({ source: 'verdict-markers', id }, { hover: true });
        }
      }
    });
    map.on('mouseleave', 'verdict-core', () => {
      map.getCanvas().style.cursor = '';
      if (hoveredVerdictId.current != null) {
        map.setFeatureState({ source: 'verdict-markers', id: hoveredVerdictId.current }, { hover: false });
        hoveredVerdictId.current = null;
      }
    });

    mapRef.current = map;

    return () => {
      if (stopAnimationRef.current) {
        stopAnimationRef.current();
        stopAnimationRef.current = null;
      }
      if (stopHoverRef.current) {
        stopHoverRef.current();
        stopHoverRef.current = null;
      }
      hoveredVerdictId.current = null;
      mapLoaded.current = false;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileSource]);

  // Update verdict markers reactively
  useEffect(() => {
    if (mapRef.current && mapLoaded.current && showVerdicts) {
      updateVerdictData(mapRef.current, verdictGeoJSON);
    }
  }, [verdictGeoJSON, showVerdicts]);

  // Update heatmap data reactively (C4)
  useEffect(() => {
    if (mapRef.current && mapLoaded.current) {
      updateHeatmapData(mapRef.current, heatmapGeoJSON);
    }
  }, [heatmapGeoJSON]);

  // Apply layer visibility changes (U2)
  const handleLayerToggle = useCallback((id: LayerId) => {
    setLayerVisibility((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (mapRef.current && mapLoaded.current) {
        applyLayerVisibility(mapRef.current, next);
      }
      return next;
    });
  }, []);

  return (
    <div className={`relative w-full h-full nexus-map-frame ${className}`} style={{ minHeight: '400px' }}>
      {/* Map canvas */}
      <div
        ref={containerRef}
        className="nexus-map-container absolute inset-0"
        style={{ background: NEXUS_MAP_COLORS.background }}
      />

      {/* Layer toggle panel overlay (U2) */}
      <div className="absolute top-3 left-3 z-10">
        <LayerTogglePanel
          visibility={layerVisibility}
          onToggle={handleLayerToggle}
        />
      </div>
    </div>
  );
});

export default GeopoliticsMap;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function applyLayerVisibility(map: maplibregl.Map, visibility: LayerVisibility): void {
  for (const [toggleId, layerIds] of Object.entries(LAYER_MAP_IDS) as [LayerId, string[]][]) {
    const vis = visibility[toggleId] ? 'visible' : 'none';
    for (const layerId of layerIds) {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', vis);
      }
    }
  }
}
