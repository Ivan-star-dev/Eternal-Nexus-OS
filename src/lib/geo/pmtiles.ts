// sacred-flow: Atlas geo layer — PMTiles serverless registrar
// Protocol: pmtiles:// → MapLibre GL tile handler (idempotent, replayable)
// Task C2 — Eternal Nexus OS

import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';

// ── Singleton guard — registerPMTilesProtocol is idempotent ──
let _registered = false;
let _protocol: Protocol | null = null;

/**
 * Registers the pmtiles:// custom protocol with MapLibre GL.
 * Safe to call multiple times — registration is performed only once.
 *
 * Usage:
 *   registerPMTilesProtocol();
 *   // then use sources like: { type: 'vector', url: 'pmtiles://https://…/tiles.pmtiles' }
 */
export function registerPMTilesProtocol(): void {
  if (_registered) return;
  _protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', _protocol.tile);
  _registered = true;
}

/**
 * Returns the active Protocol instance (after registration).
 * Throws if called before registerPMTilesProtocol().
 */
export function getPMTilesProtocol(): Protocol {
  if (!_protocol) throw new Error('[pmtiles] Protocol not registered. Call registerPMTilesProtocol() first.');
  return _protocol;
}

/**
 * Builds a MapLibre GL vector source spec that points at a PMTiles archive.
 * @param archiveUrl – URL of the .pmtiles file (with or without https://)
 */
export function pmtilesVectorSource(archiveUrl: string): maplibregl.SourceSpecification {
  // Strip any existing protocol so we never double-prefix (e.g. pmtiles://https://…)
  const bare = archiveUrl.replace(/^[a-z][a-z0-9+\-.]*:\/\//i, '');
  return {
    type: 'vector',
    url: `pmtiles://${bare}`,
  } as maplibregl.SourceSpecification;
}

/**
 * Builds a MapLibre GL raster source spec that points at a PMTiles archive.
 * @param archiveUrl – URL of the .pmtiles raster file (with or without https://)
 * @param tileSize  – tile pixel size (default 512)
 */
export function pmtilesRasterSource(
  archiveUrl: string,
  tileSize = 512,
): maplibregl.SourceSpecification {
  const bare = archiveUrl.replace(/^[a-z][a-z0-9+\-.]*:\/\//i, '');
  return {
    type: 'raster',
    url: `pmtiles://${bare}`,
    tileSize,
  } as maplibregl.SourceSpecification;
}

// Re-export Protocol so consumers can construct additional instances
export { Protocol };
