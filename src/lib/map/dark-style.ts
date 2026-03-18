/**
 * Eternal Nexus — Dark Glassmorphism Map Style
 *
 * MapLibre GL style spec for the Geopolitics Map.
 * Follows the Visual DNA: dark backgrounds, golden/teal accents,
 * neon borders, no clutter. Labels hidden by default.
 *
 * This is a minimal base style. @copilot will layer the full
 * Dark Glassmorphism treatment (Task U1) on top.
 *
 * Two source modes:
 * 1. PMTiles (serverless): `pmtiles://https://.../.pmtiles`
 * 2. Fallback: OpenFreeMap/Protomaps free vector tiles
 */

import type { StyleSpecification } from 'maplibre-gl';

// Eternal Nexus color palette (from VISUAL_DNA.md)
const COLORS = {
  background: '#0a0a0f',        // Deep void
  water: '#0d1117',             // Dark ocean
  waterEdge: '#1a2332',         // Coastline glow
  land: '#12131a',              // Dark land mass
  landBorder: '#c8a84e',        // Golden morabeza border
  landBorderGlow: '#c8a84e44',  // Border glow (translucent)
  road: '#1a1a2e',              // Barely visible roads
  text: '#c8a84e88',            // Muted gold labels
  textHalo: '#0a0a0f',          // Label halo
  conflictHigh: '#e24a6f',      // Destructive red
  conflictMed: '#e2944a',       // Warning orange
  conflictLow: '#4ae2c8',       // Teal calm
  primary: '#c8a84e',           // Primary gold
  teal: '#4ae2c8',              // Teal accent
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

      // Water fill — dark ocean
      {
        id: 'water',
        type: 'fill',
        source: 'nexus-base',
        'source-layer': 'water',
        paint: {
          'fill-color': COLORS.water,
        },
      },

      // Land fill — slightly lighter than void
      {
        id: 'land',
        type: 'fill',
        source: 'nexus-base',
        'source-layer': 'landcover',
        paint: {
          'fill-color': COLORS.land,
          'fill-opacity': 0.6,
        },
      },

      // Country boundaries — golden neon glow (the signature look)
      {
        id: 'country-borders-glow',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': COLORS.landBorderGlow,
          'line-width': 4,
          'line-blur': 3,
        },
      },
      {
        id: 'country-borders',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': COLORS.landBorder,
          'line-width': 1,
          'line-opacity': 0.8,
        },
      },

      // Coastline — subtle water edge
      {
        id: 'coastline',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'water',
        paint: {
          'line-color': COLORS.waterEdge,
          'line-width': 0.5,
          'line-opacity': 0.4,
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

      // Country labels — muted gold, only at higher zooms
      {
        id: 'country-labels',
        type: 'symbol',
        source: 'nexus-base',
        'source-layer': 'place',
        filter: ['==', ['get', 'class'], 'country'],
        minzoom: 2,
        layout: {
          'text-field': ['get', 'name:en'],
          'text-font': ['Open Sans Bold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 2, 10, 6, 14],
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.15,
          visibility: 'none', // Hidden by default — @copilot enables via U1
        },
        paint: {
          'text-color': COLORS.text,
          'text-halo-color': COLORS.textHalo,
          'text-halo-width': 1,
        },
      },
    ],
  };
}

/** Export colors for use in data layers */
export { COLORS as NEXUS_MAP_COLORS };
