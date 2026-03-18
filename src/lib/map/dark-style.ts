/**
 * Eternal Nexus — Dark Glassmorphism Map Style (Task U1)
 *
 * MapLibre GL style spec for the Geopolitics Map.
 * Follows the Visual DNA: dark backgrounds, golden/teal accents,
 * neon borders, glassmorphism panels, custom typography.
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
  waterDeep: '#0a0e17',         // Deep ocean
  land: '#12131a',              // Dark land mass
  landHover: '#1a1d28',         // Land hover state
  landBorder: '#c8a84e',        // Golden morabeza border
  landBorderGlow: '#c8a84e44',  // Border glow (translucent)
  landBorderDim: '#c8a84e22',   // Subtle inner glow
  road: '#1a1a2e',              // Barely visible roads
  roadMajor: '#222236',         // Major roads
  text: '#c8a84e',              // Gold labels
  textMuted: '#c8a84e88',       // Muted gold labels
  textHalo: '#0a0a0f',          // Label halo
  textHaloGlow: '#0a0a0fcc',    // Label halo with glow
  conflictHigh: '#e24a6f',      // Destructive red
  conflictMed: '#e2944a',       // Warning orange
  conflictLow: '#4ae2c8',       // Teal calm
  primary: '#c8a84e',           // Primary gold
  primaryDim: '#c8a84e55',      // Dim gold
  teal: '#4ae2c8',              // Teal accent
  tealDim: '#4ae2c822',         // Dim teal
  glass: '#0a0a0faa',           // Glassmorphism panel bg
};

/**
 * Create the base dark style for GeopoliticsMap.
 *
 * Task U1: Full Dark Glassmorphism treatment applied.
 * - Neon border glow with double-layer (wide blur + crisp line)
 * - Enhanced water depth using radial gradient via multi-layer fill
 * - Country labels enabled with neon glow text-halo
 * - Capital city markers with teal accent
 * - Major road grid subtly visible at zoom 8+
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

      // Deep ocean base — darker than water fill
      {
        id: 'ocean-deep',
        type: 'background',
        paint: {
          'background-color': COLORS.waterDeep,
          'background-opacity': 0.6,
        },
      },

      // Water fill — dark ocean with depth
      {
        id: 'water',
        type: 'fill',
        source: 'nexus-base',
        'source-layer': 'water',
        paint: {
          'fill-color': COLORS.water,
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.9, 10, 1],
        },
      },

      // Land base fill — slightly lighter than void
      {
        id: 'land',
        type: 'fill',
        source: 'nexus-base',
        'source-layer': 'landcover',
        paint: {
          'fill-color': COLORS.land,
          'fill-opacity': 0.7,
        },
      },

      // Land-use overlay — adds subtle texture variation
      {
        id: 'landuse',
        type: 'fill',
        source: 'nexus-base',
        'source-layer': 'landuse',
        paint: {
          'fill-color': COLORS.land,
          'fill-opacity': 0.3,
        },
      },

      // Country boundaries — outer diffuse glow (wide blur)
      {
        id: 'country-borders-glow-outer',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': COLORS.landBorderDim,
          'line-width': 8,
          'line-blur': 6,
          'line-opacity': 0.6,
        },
      },

      // Country boundaries — inner focused glow
      {
        id: 'country-borders-glow',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': COLORS.landBorderGlow,
          'line-width': 3,
          'line-blur': 2,
        },
      },

      // Country boundaries — crisp golden line on top
      {
        id: 'country-borders',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': COLORS.landBorder,
          'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.6, 5, 1, 10, 1.5],
          'line-opacity': 0.9,
        },
      },

      // Sub-national borders — dimmer gold
      {
        id: 'state-borders',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 4],
        minzoom: 4,
        paint: {
          'line-color': COLORS.landBorderGlow,
          'line-width': 0.5,
          'line-opacity': 0.4,
          'line-dasharray': [3, 4],
        },
      },

      // Coastline — subtle water edge glow
      {
        id: 'coastline-glow',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'water',
        paint: {
          'line-color': COLORS.tealDim,
          'line-width': 2,
          'line-blur': 2,
          'line-opacity': 0.3,
        },
      },

      // Coastline — crisp teal edge
      {
        id: 'coastline',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'water',
        paint: {
          'line-color': COLORS.waterEdge,
          'line-width': 0.5,
          'line-opacity': 0.5,
        },
      },

      // Major roads — barely visible grid at zoom 8+
      {
        id: 'roads-major',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'transportation',
        minzoom: 8,
        filter: ['any',
          ['==', ['get', 'class'], 'motorway'],
          ['==', ['get', 'class'], 'trunk'],
          ['==', ['get', 'class'], 'primary'],
        ],
        paint: {
          'line-color': COLORS.roadMajor,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 12, 1.5],
          'line-opacity': 0.4,
        },
      },

      // Minor roads — ghost presence at high zoom
      {
        id: 'roads',
        type: 'line',
        source: 'nexus-base',
        'source-layer': 'transportation',
        minzoom: 11,
        paint: {
          'line-color': COLORS.road,
          'line-width': 0.4,
          'line-opacity': 0.25,
        },
      },

      // Capital city dots — teal pulse markers
      {
        id: 'city-capitals-glow',
        type: 'circle',
        source: 'nexus-base',
        'source-layer': 'place',
        filter: ['==', ['get', 'class'], 'capital'],
        minzoom: 3,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 3, 8, 6],
          'circle-color': COLORS.teal,
          'circle-opacity': 0.12,
          'circle-blur': 0.8,
        },
      },
      {
        id: 'city-capitals',
        type: 'circle',
        source: 'nexus-base',
        'source-layer': 'place',
        filter: ['==', ['get', 'class'], 'capital'],
        minzoom: 3,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 1.5, 8, 3],
          'circle-color': COLORS.teal,
          'circle-opacity': 0.7,
          'circle-stroke-width': 0.5,
          'circle-stroke-color': COLORS.background,
        },
      },

      // Country labels — neon gold typography
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
          'text-size': ['interpolate', ['linear'], ['zoom'], 2, 9, 4, 11, 8, 14],
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.18,
          'text-max-width': 8,
          visibility: 'visible',
        },
        paint: {
          'text-color': COLORS.text,
          'text-halo-color': COLORS.textHaloGlow,
          'text-halo-width': 1.5,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 4, 0.85],
        },
      },

      // Capital city labels — teal accent, show at zoom 4+
      {
        id: 'capital-labels',
        type: 'symbol',
        source: 'nexus-base',
        'source-layer': 'place',
        filter: ['==', ['get', 'class'], 'capital'],
        minzoom: 4,
        layout: {
          'text-field': ['get', 'name:en'],
          'text-font': ['Open Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 4, 8, 8, 11],
          'text-letter-spacing': 0.08,
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': COLORS.teal,
          'text-halo-color': COLORS.textHalo,
          'text-halo-width': 1,
          'text-opacity': 0.7,
        },
      },
    ],
  };
}

/** Export colors for use in data layers */
export { COLORS as NEXUS_MAP_COLORS };
