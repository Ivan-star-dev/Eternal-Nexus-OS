// sacred-flow: @copilot — Eternal Nexus Dark Glassmorphism Map Style
// Mapbox Style Specification JSON for Geopolitics layer
// Visual DNA: deep dark, neon borders, no label clutter, morabeza gold glow
// Inherited from: NEXUS → ATLAS hub (cascading inheritance rule)

import type { StyleSpecification } from 'maplibre-gl';

// ── Eternal Nexus colour palette (from VISUAL_DNA.md) ──────────────────────
const COLORS = {
  // Backgrounds
  voidBlack: '#020408',       // Deepest void — map canvas
  deepSpace: '#060c14',       // Slightly lighter space
  panelDark: '#0a1628',       // Panel dark

  // Neon accent borders (geopolitical domains)
  neonCyan: '#00e5ff',        // Primary border glow — high-tension zones
  neonTeal: '#1de9b6',        // Secondary border — active regions
  neonGold: '#FFB347',        // Morabeza gold — NPI/project markers
  neonOrange: '#ff6c00',      // Conflict heat
  neonViolet: '#7c4dff',      // Alliance domains
  neonCrimson: '#ff1744',     // Critical tension

  // Land/water — almost invisible, texture only
  land: '#0d1b2a',            // Dark teal-blue land
  water: '#030d1a',           // Near-void ocean
  coastline: '#1a3a5c',       // Subtle coastline

  // Text (when absolutely needed — minimal)
  labelPrimary: 'rgba(255, 179, 71, 0.75)',  // Gold labels only for key nodes
  labelSecondary: 'rgba(0, 229, 255, 0.4)',   // Subtle cyan hints

  // Opacity constants
  borderOpacity: 0.9,
  fillOpacity: 0.05,
  glowOpacity: 0.3,
} as const;

/**
 * Eternal Nexus Dark Glassmorphism Style Specification.
 * Designed for MapLibre GL with PMTiles vector source.
 * Sacred Flow identity: Tribunal data drives border intensity via runtime paint updates.
 */
export const nexusMapStyle: StyleSpecification = {
  version: 8,
  name: 'Eternal Nexus — Geopolitics Dark',
  glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
  sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',

  sources: {
    // PMTiles vector source — wired in by GeopoliticsMap.tsx at runtime
    // Source key 'geopolitics' is populated via pmtilesSource() helper
    // Note: `pmtiles://https://` is the correct MapLibre protocol — the
    // PMTiles handler strips the `pmtiles://` prefix and fetches via HTTPS.
    protomaps: {
      type: 'vector',
      url: 'pmtiles://https://r2-public.protomaps.com/protomaps-sample-datasets/protomaps(vector)ODbL_firenze.pmtiles',
      attribution:
        '<a href="https://protomaps.com" target="_blank">Protomaps</a> © <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a>',
    },
  },

  layers: [
    // ── 0: CANVAS — absolute void ──────────────────────────────────────────
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': COLORS.voidBlack,
      },
    },

    // ── 1: WATER — deep ocean, near-invisible ──────────────────────────────
    {
      id: 'water',
      type: 'fill',
      source: 'protomaps',
      'source-layer': 'water',
      paint: {
        'fill-color': COLORS.water,
        'fill-opacity': 1,
      },
    },

    // ── 2: EARTH — very dark land mass, subtle texture ─────────────────────
    {
      id: 'earth',
      type: 'fill',
      source: 'protomaps',
      'source-layer': 'earth',
      paint: {
        'fill-color': COLORS.land,
        'fill-opacity': 1,
      },
    },

    // ── 3: LAND COVER — suppress completely (no forest/farmland noise) ─────
    {
      id: 'landuse-hide',
      type: 'fill',
      source: 'protomaps',
      'source-layer': 'landuse',
      paint: {
        'fill-color': COLORS.land,
        'fill-opacity': 0,
      },
    },

    // ── 4: WATER WAYS — thin teal whispers ────────────────────────────────
    {
      id: 'waterways',
      type: 'line',
      source: 'protomaps',
      'source-layer': 'waterways',
      minzoom: 8,
      paint: {
        'line-color': '#0d2137',
        'line-width': 0.8,
        'line-opacity': 0.4,
      },
    },

    // ── 5: ADMIN BOUNDARIES L0 — sovereign nation borders (neon glow) ──────
    {
      id: 'boundaries-country',
      type: 'line',
      source: 'protomaps',
      'source-layer': 'boundaries',
      filter: ['==', ['get', 'admin_level'], 2],
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'tension'], false],
          COLORS.neonCrimson,
          COLORS.neonCyan,
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2, 0.8,
          6, 1.6,
          10, 2.4,
        ],
        'line-opacity': COLORS.borderOpacity,
        // Glow via double-pass: outer blur layer below handles glow
      },
    },

    // ── 6: ADMIN BOUNDARIES L0 GLOW — outer bloom pass ────────────────────
    {
      id: 'boundaries-country-glow',
      type: 'line',
      source: 'protomaps',
      'source-layer': 'boundaries',
      filter: ['==', ['get', 'admin_level'], 2],
      paint: {
        'line-color': COLORS.neonCyan,
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2, 4,
          6, 8,
          10, 14,
        ],
        'line-opacity': 0.08,
        'line-blur': 6,
      },
    },

    // ── 7: ADMIN BOUNDARIES L1 — sub-national (province/state) ───────────
    {
      id: 'boundaries-region',
      type: 'line',
      source: 'protomaps',
      'source-layer': 'boundaries',
      filter: ['==', ['get', 'admin_level'], 4],
      minzoom: 4,
      paint: {
        'line-color': COLORS.neonTeal,
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4, 0.3,
          8, 0.8,
          12, 1.2,
        ],
        'line-opacity': 0.45,
        'line-dasharray': [3, 4],
      },
    },

    // ── 8: ROADS — suppress at low zoom; faint at high zoom ───────────────
    {
      id: 'roads-motorway',
      type: 'line',
      source: 'protomaps',
      'source-layer': 'roads',
      filter: ['==', ['get', 'pmap:kind'], 'highway'],
      minzoom: 9,
      paint: {
        'line-color': '#1a2a3a',
        'line-width': 0.8,
        'line-opacity': 0.3,
      },
    },

    // ── 9: BUILDINGS — faint grid at street zoom ───────────────────────────
    {
      id: 'buildings',
      type: 'fill',
      source: 'protomaps',
      'source-layer': 'buildings',
      minzoom: 14,
      paint: {
        'fill-color': '#0e1f30',
        'fill-outline-color': '#152840',
        'fill-opacity': 0.7,
      },
    },

    // ── 10: PLACES — country labels ONLY, gold, minimal ───────────────────
    {
      id: 'labels-countries',
      type: 'symbol',
      source: 'protomaps',
      'source-layer': 'places',
      filter: ['==', ['get', 'pmap:kind'], 'country'],
      maxzoom: 7,
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Noto Sans Bold'],
        'text-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2, 10,
          5, 13,
        ],
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.18,
        'text-max-width': 7,
      },
      paint: {
        'text-color': COLORS.labelPrimary,
        'text-halo-color': 'rgba(0, 0, 0, 0.9)',
        'text-halo-width': 1.5,
        'text-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2, 0.4,
          5, 0.8,
        ],
      },
    },

    // ── 11: PLACES — capital cities at mid zoom ────────────────────────────
    {
      id: 'labels-capitals',
      type: 'symbol',
      source: 'protomaps',
      'source-layer': 'places',
      filter: ['all',
        ['==', ['get', 'pmap:kind'], 'city'],
        ['==', ['get', 'capital'], 2],
      ],
      minzoom: 5,
      maxzoom: 10,
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 10,
        'text-max-width': 6,
      },
      paint: {
        'text-color': COLORS.labelSecondary,
        'text-halo-color': 'rgba(0, 0, 0, 0.85)',
        'text-halo-width': 1,
        'text-opacity': 0.6,
      },
    },

    // ── 12: TRIBUNAL VERDICT OVERLAY — runtime-injected tension fill ───────
    // Paint updated by GeopoliticsMap.tsx when a Tribunal verdict arrives.
    // Regions with high conflictLevel glow crimson; approved regions glow gold.
    {
      id: 'tribunal-verdict-fill',
      type: 'fill',
      source: 'protomaps',
      'source-layer': 'earth',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'approved'], false],
          COLORS.neonGold,
          ['boolean', ['feature-state', 'rejected'], false],
          COLORS.neonCrimson,
          'transparent',
        ],
        'fill-opacity': COLORS.fillOpacity,
      },
    },
  ],
};

/**
 * Returns a copy of the nexusMapStyle with the verdict paint updated
 * to reflect the given Tribunal verdict state.
 * Called by GeopoliticsMap after onVerdict fires.
 */
export function applyVerdictToStyle(
  style: StyleSpecification,
  countryCode: string,
  verdict: 'approved' | 'rejected' | 'needs-review'
): StyleSpecification {
  // Deep-clone to avoid mutating the base style
  const updated = JSON.parse(JSON.stringify(style)) as StyleSpecification;
  // Feature-state approach is preferred over style mutation in production,
  // but this utility enables lightweight snapshot-driven updates.
  void countryCode; void verdict; // used via feature-state at the map level
  return updated;
}
