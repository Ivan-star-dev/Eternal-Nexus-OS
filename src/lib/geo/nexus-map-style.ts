// sacred flow — Eternal Nexus Dark Glassmorphism MapLibre Style Specification
// Task U1: Apply Eternal Nexus visual DNA to the Geopolitics map.
//
// Design rules (VISUAL_DNA.md):
//   - Inherit background from Nexus: deep institutional navy
//   - Glowing neon borders for geopolitical domains
//   - Hide noisy labels; keep only strategic placenames
//   - No neon soup — only purposeful bloom on borders & hotspots
//   - Glassmorphism: dark base + subtle gradient + frosted overlay

import type { StyleSpecification } from "maplibre-gl";

// ── Eternal Nexus colour tokens ──────────────────────────────────────────────
// Mapped from CSS custom properties in src/index.css
const C = {
  inkDeep: "hsl(216, 55%, 3%)",      // --ink-deep  (darkest bg)
  inkMedium: "hsl(216, 45%, 8%)",    // --ink-medium / card base
  navy: "hsl(216, 40%, 11%)",        // --navy
  navyLight: "hsl(216, 35%, 16%)",   // --navy-light
  gold: "hsl(42, 78%, 45%)",         // --primary gold
  goldDim: "hsl(42, 55%, 28%)",      // --gold-dim
  tealBase: "hsl(172, 55%, 28%)",    // --accent teal (muted base, matches --accent)
  tealGlow: "hsl(172, 80%, 45%)",    // teal neon glow (borders / hotspots)
  red: "hsl(0, 52%, 32%)",           // --destructive  (conflict zones)
  paperDim: "hsl(215, 12%, 55%)",    // --paper-dim (muted labels)
  border: "hsl(216, 22%, 14%)",      // --border
  transparent: "rgba(0,0,0,0)",
} as const;

// ── Style specification ───────────────────────────────────────────────────────
export const nexusMapStyle: StyleSpecification = {
  version: 8,
  name: "Eternal Nexus — Dark Glassmorphism",
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  // No sprite needed for pure vector style
  sources: {},
  layers: [
    // ── 0. Deep navy background (glassmorphism base) ─────────────────────────
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": C.inkDeep,
        "background-opacity": 1,
      },
    },
  ],
};

// ── Layer builders ────────────────────────────────────────────────────────────
// These are called by GeopoliticsMap.tsx after the map loads to add
// the domain-specific layers on top of the base style.

/** Country fills — very dark, almost invisible; slight navy tint */
export const countryFillLayer = {
  id: "country-fill",
  type: "fill" as const,
  source: "nexus-geo",
  "source-layer": "countries",
  paint: {
    "fill-color": C.inkMedium,
    "fill-opacity": 0.85,
  },
};

/** Country borders — glowing teal neon lines (primary geopolitical DNA) */
export const countryBorderLayer = {
  id: "country-border",
  type: "line" as const,
  source: "nexus-geo",
  "source-layer": "countries",
  paint: {
    "line-color": C.tealGlow,
    "line-width": ["interpolate", ["linear"], ["zoom"], 1, 0.4, 6, 1.2],
    "line-opacity": 0.7,
    "line-blur": 1,
  },
};

/** Country borders — inner glow pass (double-render trick for neon bloom) */
export const countryBorderGlowLayer = {
  id: "country-border-glow",
  type: "line" as const,
  source: "nexus-geo",
  "source-layer": "countries",
  paint: {
    "line-color": C.tealGlow,
    "line-width": ["interpolate", ["linear"], ["zoom"], 1, 2, 6, 5],
    "line-opacity": 0.15,
    "line-blur": 4,
  },
};

/** Ocean / water fill — darkest black-navy */
export const waterFillLayer = {
  id: "water-fill",
  type: "fill" as const,
  source: "nexus-geo",
  "source-layer": "water",
  paint: {
    "fill-color": C.inkDeep,
    "fill-opacity": 1,
  },
};

/** Strategic placenames — minimal, gold mono, only at zoom ≥ 4 */
export const placeLabelsLayer = {
  id: "place-labels",
  type: "symbol" as const,
  source: "nexus-geo",
  "source-layer": "place_labels",
  minzoom: 4,
  filter: ["in", ["get", "class"], ["literal", ["capital", "country"]]],
  layout: {
    "text-field": ["get", "name_en"],
    "text-font": ["Noto Sans Bold"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 4, 9, 8, 13],
    "text-letter-spacing": 0.12,
    "text-transform": "uppercase",
    "symbol-sort-key": ["get", "rank"],
    "text-max-width": 8,
  },
  paint: {
    "text-color": C.goldDim,
    "text-halo-color": C.inkDeep,
    "text-halo-width": 1.5,
    "text-opacity": 0.8,
  },
};

/** All layers in render order */
export const ALL_NEXUS_LAYERS = [
  waterFillLayer,
  countryFillLayer,
  countryBorderGlowLayer,
  countryBorderLayer,
  placeLabelsLayer,
] as const;
