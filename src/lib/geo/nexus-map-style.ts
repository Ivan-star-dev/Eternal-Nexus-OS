// sacred-flow: Atlas — Dark Glassmorphism visual DNA for Geopolitics Map
// Applied to MapLibre GL Style Specification JSON.
// DNA Rule: each layer inherits Nexus dark base + atlas-tab context + domain accent.

import maplibregl from 'maplibre-gl';

// ── Eternal Nexus colour tokens ─────────────────────────────────────────────
const COLORS = {
  // Backgrounds — deep darks, subtle gradients
  void:        '#020409',
  abyss:       '#060c17',
  surface:     '#0a1628',
  glass:       'rgba(6,14,30,0.85)',

  // Neon domain accents (geopolitical tension glows)
  neonCyan:    '#00f5ff',
  neonBlue:    '#0075ff',
  neonPurple:  '#9b00ff',
  neonGold:    '#ffcc00',
  neonRed:     '#ff003c',
  neonGreen:   '#00ff88',

  // Neutral infrastructure
  border:      'rgba(0,245,255,0.35)',
  borderHover: 'rgba(0,245,255,0.9)',
  dimLabel:    'rgba(200,220,255,0.18)',
  water:       '#020d1f',
  land:        '#060c17',
};

// ── Base style layers ─────────────────────────────────────────────────────────
const ETERNAL_NEXUS_LAYERS: maplibregl.LayerSpecification[] = [
  // Deep-space background
  {
    id: 'background',
    type: 'background',
    paint: { 'background-color': COLORS.void },
  },

  // Water — near-black with faint blue cast
  {
    id: 'water',
    type: 'fill',
    source: 'world',
    'source-layer': 'water',
    paint: {
      'fill-color': COLORS.water,
      'fill-opacity': 1,
    },
  },

  // Land mass — dark glass surface
  {
    id: 'land',
    type: 'fill',
    source: 'world',
    'source-layer': 'land',
    paint: {
      'fill-color': COLORS.land,
      'fill-opacity': 1,
    },
  },

  // Country borders — neon cyan glow (primary geopolitical boundary)
  {
    id: 'country-border',
    type: 'line',
    source: 'world',
    'source-layer': 'ne_10m_admin_0_boundary_lines_land',
    paint: {
      'line-color': COLORS.border,
      'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.6, 6, 1.5, 10, 2.5],
      'line-blur': 1.5,
    },
  },

  // Country borders glow pass — neon bloom effect
  {
    id: 'country-border-glow',
    type: 'line',
    source: 'world',
    'source-layer': 'ne_10m_admin_0_boundary_lines_land',
    paint: {
      'line-color': COLORS.neonCyan,
      'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.5, 6, 3, 10, 5],
      'line-opacity': 0.18,
      'line-blur': 6,
    },
  },

  // Coastlines — subtle neon outline
  {
    id: 'coastline',
    type: 'line',
    source: 'world',
    'source-layer': 'ne_10m_coastline',
    paint: {
      'line-color': 'rgba(0,180,255,0.2)',
      'line-width': 0.75,
      'line-blur': 1,
    },
  },

  // Disputed territories — pulsing neon red
  {
    id: 'disputed-border',
    type: 'line',
    source: 'world',
    'source-layer': 'ne_10m_admin_0_disputed_areas',
    paint: {
      'line-color': COLORS.neonRed,
      'line-width': 1.2,
      'line-opacity': 0.7,
      'line-dasharray': [4, 3],
    },
  },

  // Country fill — very subtle tinted glass for selected/hovered states
  {
    id: 'country-fill-hover',
    type: 'fill',
    source: 'world',
    'source-layer': 'ne_10m_admin_0_countries',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        'rgba(0,245,255,0.06)',
        'rgba(0,0,0,0)',
      ],
      'fill-opacity': 1,
    },
  },
];

/**
 * Eternal Nexus — Dark Glassmorphism MapLibre Style.
 * Uses a PMTiles vector source for admin boundaries.
 * All labels suppressed; only neon geopolitical borders are visible.
 */
export function buildNexusMapStyle(
  pmtilesUrl: string,
): maplibregl.StyleSpecification {
  return {
    version: 8,
    name: 'Eternal Nexus — Dark Geopolitics',
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      world: {
        type: 'vector',
        url: `pmtiles://${pmtilesUrl}`,
        attribution: '© Natural Earth',
      },
    },
    layers: ETERNAL_NEXUS_LAYERS,
  };
}

export { COLORS as NEXUS_MAP_COLORS };
