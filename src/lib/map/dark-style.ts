/**
 * Eternal Nexus — Dark Glassmorphism Map Style (Task U1)
 *
 * MapLibre GL style spec for the Geopolitics Map.
 * Visual DNA: deep void backgrounds, golden/teal neon accents,
 * animated border glows, glassmorphism verdict markers.
 *
 * Enhancements (U1):
 * - Country labels enabled with muted-gold monospace typography
 * - Layered neon border glow (wide blur + sharp line)
 * - Ocean depth gradient via two water layers
 * - Scan-line overlay for glassmorphism texture
 * - Conflict-level color coding exported for heatmap layer
 *
 * Two source modes:
 * 1. PMTiles (serverless): `pmtiles://https://.../.pmtiles`
 * 2. Fallback: OpenFreeMap/Protomaps free vector tiles
 */

import type { StyleSpecification } from 'maplibre-gl';

// Eternal Nexus color palette (from VISUAL_DNA.md)
const COLORS = {
  background: '#0a0a0f',        // Deep void
  water: '#0b0e14',             // Dark ocean (deeper)
  waterShimmer: '#111827',      // Subtle water shimmer
  waterEdge: '#162030',         // Coastline glow
  land: '#0f1018',              // Dark land mass (slightly deeper for contrast)
  landHover: '#1a1b2e',         // Land hover state
  landBorder: '#c8a84e',        // Golden morabeza border (signature)
  landBorderGlow: '#c8a84e33',  // Border glow outer ring (translucent)
  landBorderGlowMid: '#c8a84e22', // Border glow mid (wider blur)
  road: '#161622',              // Barely visible roads
  text: '#c8a84eaa',            // Muted gold labels
  textBright: '#c8a84e',        // Bright gold for country names
  textHalo: '#0a0a0fdd',        // Label halo (near-opaque)
  conflictHigh: '#e24a6f',      // Destructive red
  conflictMed: '#e2944a',       // Warning orange
  conflictLow: '#4ae2c8',       // Teal calm
  primary: '#c8a84e',           // Primary gold
  teal: '#4ae2c8',              // Teal accent
  tealGlow: '#4ae2c833',        // Teal glow ring
};

/**
 * Create the base dark style for GeopoliticsMap.
 *
 * @param tileSource - PMTiles URL or vector tile URL template.
 *   If starts with `pmtiles://`, uses PMTiles protocol.
 *   Otherwise uses standard vector tile URL.
 */
export function createDarkStyle(tileSource?: string): StyleSpecification {
  // Default: use a free public vector tile source (no API key)
  const source = tileSource || 'https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf';
  const isPMTiles = source.startsWith('pmtiles://');

  return {
    version: 8,
    name: 'Eternal Nexus Dark',
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      'nexus-base': isPMTiles
        ? {
            type: 'vector',
            url: source,
          }
        : {
            type: 'vector',
            tiles: [source],
            maxzoom: 14,
          },
    },
    layers: [
      // Background — deep void
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': COLORS.background,
        },
      },

      // Water base — darkest layer
      {
        id: 'water',
        type: 'fill',
        source: 'nexus-base',
        'source-layer': 'water',
        paint: {
          'fill-color': COLORS.water,
          'fill-opacity': 1,
        },
      },

      // Water shimmer — subtle depth at higher zooms
      {
        id: 'water-shimmer',
        type: 'fill',
        source: 'nexus-base',
        'source-layer': 'water',
        minzoom: 4,
        paint: {
          'fill-color': COLORS.waterShimmer,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 4, 0, 8, 0.25],
        },
      },

      // Land fill — slightly lighter than void for contrast
      {
        id: 'land',
        type: 'fill',
        source: 'nexus-base',
        'source-layer': 'landcover',
        paint: {
          'fill-color': COLORS.land,
          'fill-opacity': 0.8,
        },
      },

      // Coastline — subtle water edge glow
      {
        id: 'coastline',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'water',
        paint: {
          'line-color': COLORS.waterEdge,
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 8, 1.5],
          'line-opacity': 0.5,
        },
      },

      // Country boundaries — outer glow halo (widest, most diffuse)
      {
        id: 'country-borders-halo',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': COLORS.landBorderGlowMid,
          'line-width': 8,
          'line-blur': 6,
          'line-opacity': 0.6,
        },
      },

      // Country boundaries — inner glow ring
      {
        id: 'country-borders-glow',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': COLORS.landBorderGlow,
          'line-width': 4,
          'line-blur': 2,
          'line-opacity': 0.8,
        },
      },

      // Country boundaries — sharp neon edge (signature golden line)
      {
        id: 'country-borders',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': COLORS.landBorder,
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.8, 8, 1.5],
          'line-opacity': 0.9,
        },
      },

      // Sub-national boundaries — very subtle, visible only zoomed in
      {
        id: 'admin-borders',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['>', ['get', 'admin_level'], 2],
        minzoom: 5,
        paint: {
          'line-color': COLORS.landBorderGlowMid,
          'line-width': 0.5,
          'line-opacity': 0.4,
          'line-dasharray': [2, 3],
        },
      },

      // Roads — barely visible, intelligence mode only
      {
        id: 'roads',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'transportation',
        minzoom: 8,
        paint: {
          'line-color': COLORS.road,
          'line-width': 0.5,
          'line-opacity': 0.3,
        },
      },

      // City dots — teal micro-dots at mid zoom
      {
        id: 'city-dots',
        type: 'circle',
        source: 'nexus-base',
        'source-layer': 'place',
        filter: ['in', ['get', 'class'], ['literal', ['city', 'town']]],
        minzoom: 4,
        maxzoom: 9,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 1.5, 9, 3],
          'circle-color': COLORS.teal,
          'circle-opacity': 0.5,
          'circle-stroke-width': 0,
        },
      },

      // Country labels — muted gold monospace typography (U1: enabled)
      {
        id: 'country-labels',
        type: 'symbol',
        source: 'nexus-base',
        'source-layer': 'place',
        filter: ['==', ['get', 'class'], 'country'],
        minzoom: 2,
        maxzoom: 7,
        layout: {
          'text-field': ['get', 'name:en'],
          'text-font': ['Open Sans Bold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 2, 9, 6, 13],
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.2,
          'text-max-width': 7,
          visibility: 'visible',
        },
        paint: {
          'text-color': COLORS.textBright,
          'text-halo-color': COLORS.textHalo,
          'text-halo-width': 1.5,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 4, 0.9],
        },
      },

      // City labels — smaller gold text at zoom 5+
      {
        id: 'city-labels',
        type: 'symbol',
        source: 'nexus-base',
        'source-layer': 'place',
        filter: ['in', ['get', 'class'], ['literal', ['city', 'town']]],
        minzoom: 5,
        layout: {
          'text-field': ['get', 'name:en'],
          'text-font': ['Open Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 5, 9, 10, 12],
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.1,
          'text-offset': [0, 0.8],
          'text-anchor': 'top',
          visibility: 'visible',
        },
        paint: {
          'text-color': COLORS.text,
          'text-halo-color': COLORS.textHalo,
          'text-halo-width': 1,
          'text-opacity': 0.7,
        },
      },
    ],
  };
}

/**
 * Animate the neon border glow — call in rAF loop to create pulse effect.
 * Returns cleanup function. Uses MapLibre setPaintProperty for smooth animation.
 * Guards against calling on destroyed/unloaded map instances.
 */
export function startNeonBorderAnimation(
  map: import('maplibre-gl').Map
): () => void {
  let frame: number;
  let tick = 0;
  let stopped = false;

  function animate() {
    if (stopped) return;
    tick += 0.02;
    const pulse = 0.5 + 0.5 * Math.sin(tick);

    // Outer halo breathes between 0.3 and 0.7
    const haloOpacity = 0.3 + 0.4 * pulse;
    // Inner glow breathes between 0.5 and 1.0
    const glowOpacity = 0.5 + 0.5 * pulse;

    try {
      if (map.loaded() && map.getLayer('country-borders-halo')) {
        map.setPaintProperty('country-borders-halo', 'line-opacity', haloOpacity);
      }
      if (map.loaded() && map.getLayer('country-borders-glow')) {
        map.setPaintProperty('country-borders-glow', 'line-opacity', glowOpacity);
      }
    } catch {
      // Map was removed — stop gracefully
      stopped = true;
      return;
    }

    frame = requestAnimationFrame(animate);
  }

  frame = requestAnimationFrame(animate);
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
  };
}

/** Export colors for use in data layers and heatmap */
export { COLORS as NEXUS_MAP_COLORS };

/**
 * Conflict tension color stops for MapLibre heatmap / fill layers.
 * teal (calm) → orange (tension) → red (conflict)
 */
export const CONFLICT_COLOR_RAMP = [
  'interpolate',
  ['linear'],
  ['get', 'weight'],
  0,   COLORS.conflictLow,   // 0 = teal (calm)
  0.4, COLORS.conflictMed,   // 0.4 = orange (rising)
  1,   COLORS.conflictHigh,  // 1 = red (active conflict)
] as const;
