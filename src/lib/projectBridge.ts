/**
 * projectBridge.ts — V4-PROJECT-PAGE-001 · Arch Layer
 *
 * Canonical bridge between the three project identity systems:
 *   1. GeoProject.id      — numeric (Atlas/Cesium globe)
 *   2. projectData key    — string slug (route + data store)
 *   3. Route path         — /project/:key
 *
 * Used by:
 *   - AtlasPage → navigate to ProjectPage when user clicks globe hotspot
 *   - ProjectPage → record lastProject in session memory
 *   - SessionBoot → restore globe focus from lastProject on Atlas return
 *
 * Law: immutable mapping — changes require V4 gate owner approval.
 * sacred-flow: PLv6.2 | V4-PROJECT-PAGE-001 | 2026-03-25
 */

// ---------------------------------------------------------------------------
// GeoProject.id → projectData key
// Only projects with a sealed ProjectPage are listed.
// Next Path Infra variants (7–12) are MECH-pending.
// ---------------------------------------------------------------------------

export const GEO_ID_TO_PROJECT_KEY: Record<number, string> = {
  2: "deltaspine-nl",   // Delta Spine NL    — Netherlands
  3: "geocore-power",   // Geocore Power     — Spain (Barcelona)
  4: "terra-lenta",     // Terra Lenta       — Portugal (Lisboa)
  5: "fusion-core",     // Fusion Core       — France (Paris)
  6: "chip-fold",       // Chip Fold         — Japan (Tokyo)
  // id 1  "Pico do Fogo"       — prototype site, no standalone page yet
  // id 7  "Next Path Infra NL" — MECH-pending (V4-PROJECT-PAGE-001-MECH)
  // id 8  "Next Path Infra PT" — MECH-pending
  // id 9  "Next Path Infra BR" — MECH-pending
  // id 10 "Next Path Infra US" — MECH-pending
  // id 11 "Next Path Infra AE" — MECH-pending
  // id 12 "Next Path Infra JP" — MECH-pending
};

// ---------------------------------------------------------------------------
// projectData key → GeoProject.id  (reverse lookup)
// ---------------------------------------------------------------------------

export const PROJECT_KEY_TO_GEO_ID: Record<string, number> = Object.fromEntries(
  Object.entries(GEO_ID_TO_PROJECT_KEY).map(([id, key]) => [key, Number(id)])
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the projectData string key for a given GeoProject id.
 * Returns null if the project has no sealed ProjectPage yet.
 */
export function geoIdToProjectKey(geoId: number): string | null {
  return GEO_ID_TO_PROJECT_KEY[geoId] ?? null;
}

/**
 * Returns the GeoProject id for a given projectData key.
 * Returns null if the key is not mapped to a globe hotspot.
 */
export function projectKeyToGeoId(key: string): number | null {
  return PROJECT_KEY_TO_GEO_ID[key] ?? null;
}

/**
 * Returns the full route path for a given GeoProject id.
 * Returns null if the project has no route yet.
 */
export function geoIdToRoute(geoId: number): string | null {
  const key = geoIdToProjectKey(geoId);
  return key ? `/project/${key}` : null;
}

/**
 * Returns true if this GeoProject id has a sealed ProjectPage.
 */
export function hasProjectPage(geoId: number): boolean {
  return geoId in GEO_ID_TO_PROJECT_KEY;
}
