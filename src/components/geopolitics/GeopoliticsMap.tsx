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
 * Visual DNA (Task U1): Full Dark Glassmorphism treatment applied.
 * Layer Panel (Task U2): Layer toggle panel following EnvironmentPanel.tsx pattern.
 * Conflict Heatmap (Task C4): teal→orange→red gradient fill layer.
 *
 * Performance: Lazy-loads MapLibre (~200KB). PMTiles uses HTTP range requests.
 * Quality tier: balanced by default, no GPU-heavy effects in base shell.
 */

import { useEffect, useRef, useCallback, useState, memo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { registerPMTilesProtocol } from '@/lib/map/pmtiles-protocol';
import { createDarkStyle, NEXUS_MAP_COLORS } from '@/lib/map/dark-style';
import { useGeopoliticsMap, type VerdictGeoJSON, type ConflictGeoJSON } from '@/hooks/useGeopoliticsMap';
import LayerTogglePanel, { type LayerVisibility } from './LayerTogglePanel';

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
 * Inject CSS for Eternal Nexus map chrome (Task U1):
 * - Glassmorphism popup
 * - Neon glow animation on border pulses
 * - Attribution styling
 */
function injectMapCSS(): void {
  const id = 'nexus-map-styles';
  if (document.getElementById(id)) return;

  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    /* Nexus Glassmorphism Popup */
    .nexus-popup .maplibregl-popup-content {
      background: #0a0a0fdd !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      border: 1px solid #c8a84e33 !important;
      border-radius: 0 !important;
      padding: 0 !important;
      box-shadow: 0 0 20px #c8a84e11, 0 8px 32px #00000088 !important;
    }
    .nexus-popup .maplibregl-popup-tip {
      border-top-color: #c8a84e33 !important;
      border-bottom-color: #c8a84e33 !important;
    }
    .nexus-popup .maplibregl-popup-close-button {
      color: #c8a84e88 !important;
      font-size: 14px !important;
      padding: 4px 8px !important;
    }
    .nexus-popup .maplibregl-popup-close-button:hover {
      color: #c8a84e !important;
      background: transparent !important;
    }
    /* Attribution — minimal dark style */
    .maplibregl-ctrl-attrib {
      background: #0a0a0faa !important;
      backdrop-filter: blur(8px) !important;
    }
    .maplibregl-ctrl-attrib-button {
      filter: invert(0.7) !important;
    }
    .maplibregl-ctrl-attrib a {
      color: #c8a84e88 !important;
    }
    /* Navigation controls */
    .maplibregl-ctrl-group {
      background: #0a0a0fdd !important;
      backdrop-filter: blur(12px) !important;
      border: 1px solid #c8a84e22 !important;
      border-radius: 0 !important;
      box-shadow: 0 0 12px #c8a84e0a !important;
    }
    .maplibregl-ctrl-group button {
      background: transparent !important;
      border-bottom-color: #c8a84e22 !important;
    }
    .maplibregl-ctrl-group button:hover {
      background: #c8a84e11 !important;
    }
    .maplibregl-ctrl-icon {
      filter: invert(0.7) sepia(0.5) hue-rotate(5deg) !important;
    }
    /* Scale bar */
    .maplibregl-ctrl-scale {
      background: #0a0a0faa !important;
      border-color: #c8a84e55 !important;
      color: #c8a84e88 !important;
      font-family: monospace !important;
      font-size: 9px !important;
      letter-spacing: 0.05em !important;
    }
    /* Neon border pulse animation on map canvas */
    @keyframes nexus-border-pulse {
      0%, 100% { box-shadow: 0 0 0 0 #c8a84e00; }
      50% { box-shadow: 0 0 8px 2px #c8a84e18; }
    }
    .nexus-map-container {
      animation: nexus-border-pulse 4s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Escape HTML special characters to prevent XSS in popup content.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Add the verdict markers layer to the map (Task U1: enhanced visual DNA).
 */
function addVerdictLayer(map: maplibregl.Map): void {
  map.addSource('verdict-markers', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  // Outer glow aura — large, diffuse
  map.addLayer({
    id: 'verdict-aura',
    type: 'circle',
    source: 'verdict-markers',
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['get', 'confidence'],
        0, 20, 1, 40,
      ],
      'circle-color': [
        'match', ['get', 'verdict'],
        'approved', NEXUS_MAP_COLORS.teal,
        'rejected', NEXUS_MAP_COLORS.conflictHigh,
        NEXUS_MAP_COLORS.primary,
      ],
      'circle-opacity': 0.04,
      'circle-blur': 1,
    },
  });

  // Glow ring — medium
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
      'circle-opacity': 0.18,
      'circle-blur': 0.8,
    },
  });

  // Core dot — crisp neon
  map.addLayer({
    id: 'verdict-core',
    type: 'circle',
    source: 'verdict-markers',
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['get', 'confidence'],
        0, 4, 1, 8,
      ],
      'circle-color': [
        'match', ['get', 'verdict'],
        'approved', NEXUS_MAP_COLORS.teal,
        'rejected', NEXUS_MAP_COLORS.conflictHigh,
        NEXUS_MAP_COLORS.primary,
      ],
      'circle-opacity': 1,
      'circle-stroke-width': 1.5,
      'circle-stroke-color': NEXUS_MAP_COLORS.background,
    },
  });

  // Topic label — monospace uppercase
  map.addLayer({
    id: 'verdict-labels',
    type: 'symbol',
    source: 'verdict-markers',
    layout: {
      'text-field': ['get', 'topic'],
      'text-font': ['Open Sans Bold'],
      'text-size': 9,
      'text-offset': [0, 1.8],
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.12,
      'text-max-width': 10,
    },
    paint: {
      'text-color': NEXUS_MAP_COLORS.textMuted,
      'text-halo-color': NEXUS_MAP_COLORS.background,
      'text-halo-width': 1.5,
    },
  });
}

/**
 * Add the conflict tension heatmap layer (Task C4).
 * Color gradient: teal → orange → red based on conflictLevel (0–1).
 */
function addConflictHeatmapLayer(map: maplibregl.Map): void {
  map.addSource('conflict-heatmap', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  // Heatmap layer — density-based intensity
  map.addLayer(
    {
      id: 'conflict-heat',
      type: 'heatmap',
      source: 'conflict-heatmap',
      paint: {
        // Weight directly by conflictLevel (0–1)
        'heatmap-weight': ['get', 'conflictLevel'],
        // Intensity scales with zoom
        'heatmap-intensity': [
          'interpolate', ['linear'], ['zoom'],
          0, 0.6,
          9, 2,
        ],
        // Color gradient: teal → orange → red (Visual DNA conflict palette)
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0, 'rgba(74,226,200,0)',      // transparent
          0.2, 'rgba(74,226,200,0.4)',  // teal (low tension)
          0.5, 'rgba(226,148,74,0.6)',  // orange (medium tension)
          0.8, 'rgba(226,74,111,0.7)',  // red (high tension)
          1, 'rgba(226,74,111,0.9)',    // destructive red (critical)
        ],
        // Radius scales with zoom
        'heatmap-radius': [
          'interpolate', ['linear'], ['zoom'],
          0, 30,
          9, 60,
        ],
        'heatmap-opacity': 0.6,
      },
    },
    // Insert BELOW verdict markers so verdicts are always visible on top
    'verdict-aura'
  );

  // Point layer visible at high zoom — individual conflict markers
  map.addLayer(
    {
      id: 'conflict-points',
      type: 'circle',
      source: 'conflict-heatmap',
      minzoom: 6,
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['get', 'conflictLevel'],
          0, 3, 1, 8,
        ],
        'circle-color': [
          'interpolate', ['linear'], ['get', 'conflictLevel'],
          0, NEXUS_MAP_COLORS.conflictLow,
          0.5, NEXUS_MAP_COLORS.conflictMed,
          1, NEXUS_MAP_COLORS.conflictHigh,
        ],
        'circle-opacity': [
          'interpolate', ['linear'], ['zoom'],
          6, 0,
          8, 0.8,
        ],
        'circle-stroke-width': 0.5,
        'circle-stroke-color': NEXUS_MAP_COLORS.background,
        'circle-blur': 0.2,
      },
    },
    'verdict-aura'
  );
}

/**
 * Add migration routes layer (Task U2 — placeholder line layer).
 * Will animate as arc lines in a future iteration.
 */
function addMigrationLayer(map: maplibregl.Map): void {
  map.addSource('migration-routes', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  map.addLayer({
    id: 'migration-lines',
    type: 'line',
    source: 'migration-routes',
    paint: {
      'line-color': NEXUS_MAP_COLORS.teal,
      'line-width': 1,
      'line-opacity': 0.5,
      'line-dasharray': [4, 3],
    },
  });
}

/**
 * Add energy grid layer (Task U2 — placeholder point layer).
 */
function addEnergyGridLayer(map: maplibregl.Map): void {
  map.addSource('energy-grid', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  map.addLayer({
    id: 'energy-nodes',
    type: 'circle',
    source: 'energy-grid',
    paint: {
      'circle-radius': 4,
      'circle-color': '#f0d060',
      'circle-opacity': 0.7,
      'circle-stroke-width': 1,
      'circle-stroke-color': NEXUS_MAP_COLORS.background,
      'circle-blur': 0.3,
    },
  });
}

/**
 * Update the verdict markers data on the map.
 */
function updateVerdictData(map: maplibregl.Map, geojson: VerdictGeoJSON): void {
  const source = map.getSource('verdict-markers') as maplibregl.GeoJSONSource | undefined;
  if (source) source.setData(geojson);
}

/**
 * Update the conflict heatmap data on the map (Task C4).
 */
function updateConflictData(map: maplibregl.Map, geojson: ConflictGeoJSON): void {
  const source = map.getSource('conflict-heatmap') as maplibregl.GeoJSONSource | undefined;
  if (source) source.setData(geojson);
}

/**
 * Toggle a set of map layer IDs visible/hidden.
 */
function setLayersVisible(map: maplibregl.Map, layerIds: string[], visible: boolean): void {
  for (const id of layerIds) {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
    }
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

  const { verdictGeoJSON, conflictGeoJSON } = useGeopoliticsMap();

  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    conflictHeatmap: true,
    migrationRoutes: false,
    energyGrid: false,
    verdictMarkers: showVerdicts,
  });

  // Initialize MapLibre + PMTiles
  useEffect(() => {
    if (!containerRef.current) return;

    injectMapCSS();
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

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left'
    );
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      'top-right'
    );
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 150 }), 'bottom-right');

    map.on('load', () => {
      mapLoaded.current = true;

      // Add all layers in z-order (bottom → top)
      addConflictHeatmapLayer(map);
      addMigrationLayer(map);
      addEnergyGridLayer(map);
      addVerdictLayer(map);

      // Seed initial data
      updateConflictData(map, conflictGeoJSON);
      if (showVerdicts) updateVerdictData(map, verdictGeoJSON);

      // Apply initial layer visibility
      setLayersVisible(map, ['conflict-heat', 'conflict-points'], layerVisibility.conflictHeatmap);
      setLayersVisible(map, ['migration-lines'], layerVisibility.migrationRoutes);
      setLayersVisible(map, ['energy-nodes'], layerVisibility.energyGrid);
      setLayersVisible(
        map,
        ['verdict-aura', 'verdict-glow', 'verdict-core', 'verdict-labels'],
        layerVisibility.verdictMarkers
      );
    });

    // Click handler → publish atlas.marker event (Sacred Flow)
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['verdict-core'] });

      if (features.length > 0) {
        const props = features[0].properties;
        const verdictColor = VERDICT_COLORS[props.verdict] || NEXUS_MAP_COLORS.primary;
        const safeTopic = escapeHtml(String(props.topic ?? ''));
        const safeVerdict = escapeHtml(String(props.verdict ?? '').toUpperCase());
        const safeReasoning = escapeHtml(
          typeof props.reasoning === 'string' ? props.reasoning.slice(0, 160) : ''
        );

        new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          className: 'nexus-popup',
          maxWidth: '280px',
        })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family:monospace;font-size:11px;color:${NEXUS_MAP_COLORS.primary};padding:14px;">
              <div style="font-size:8px;letter-spacing:0.18em;color:${verdictColor};margin-bottom:8px;opacity:0.9;">
                ▸ TRIBUNAL VERDICT
              </div>
              <div style="font-size:13px;font-weight:bold;color:#e8e8e8;margin-bottom:6px;letter-spacing:0.04em;">
                ${safeTopic}
              </div>
              <div style="color:${verdictColor};font-size:9px;margin-bottom:8px;letter-spacing:0.12em;">
                ${safeVerdict} · ${Math.round(props.confidence * 100)}% CONF
              </div>
              <div style="font-size:9px;color:#888;line-height:1.5;border-top:1px solid #c8a84e22;padding-top:8px;">
                ${safeReasoning}${typeof props.reasoning === 'string' && props.reasoning.length > 160 ? '…' : ''}
              </div>
            </div>
          `)
          .addTo(map);
      }
    });

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileSource]);

  // Update verdict markers when GeoJSON changes
  useEffect(() => {
    if (mapRef.current && mapLoaded.current) {
      updateVerdictData(mapRef.current, verdictGeoJSON);
    }
  }, [verdictGeoJSON]);

  // Update conflict heatmap when GeoJSON changes (Task C4)
  useEffect(() => {
    if (mapRef.current && mapLoaded.current) {
      updateConflictData(mapRef.current, conflictGeoJSON);
    }
  }, [conflictGeoJSON]);

  // React to layer visibility changes (Task U2)
  const handleLayerChange = useCallback((newLayers: LayerVisibility) => {
    setLayerVisibility(newLayers);
    const map = mapRef.current;
    if (!map || !mapLoaded.current) return;

    setLayersVisible(map, ['conflict-heat', 'conflict-points'], newLayers.conflictHeatmap);
    setLayersVisible(map, ['migration-lines'], newLayers.migrationRoutes);
    setLayersVisible(map, ['energy-nodes'], newLayers.energyGrid);
    setLayersVisible(
      map,
      ['verdict-aura', 'verdict-glow', 'verdict-core', 'verdict-labels'],
      newLayers.verdictMarkers
    );
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: '400px' }}>
      {/* Map canvas */}
      <div
        ref={containerRef}
        className="nexus-map-container w-full h-full"
        style={{ background: NEXUS_MAP_COLORS.background }}
      />

      {/* Layer toggle panel — top-left overlay (Task U2) */}
      <div className="absolute top-3 left-3 z-10">
        <LayerTogglePanel layers={layerVisibility} onChange={handleLayerChange} />
      </div>
    </div>
  );
});

export default GeopoliticsMap;
