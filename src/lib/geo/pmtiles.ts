// sacred-flow: Atlas — PMTiles serverless registrar
// Registers the pmtiles:// custom protocol with MapLibre GL JS so that
// vector tiles are served directly from .pmtiles archives (no tile server).

import { Protocol } from 'pmtiles';
import maplibregl from 'maplibre-gl';

let registered = false;

/**
 * Register the `pmtiles://` custom protocol with MapLibre GL JS.
 * Must be called once before initializing any MapLibre map instance.
 * Safe to call multiple times — subsequent calls are no-ops (idempotent).
 */
export function registerPMTilesProtocol(): void {
  if (registered) return;

  const protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);
  registered = true;
}

/**
 * Build a MapLibre source definition backed by a PMTiles archive.
 *
 * @param url  Full URL to the .pmtiles file (e.g. https://cdn.example.com/world.pmtiles)
 * @param type Vector or raster tile type (default: 'vector')
 */
export function buildPMTilesSource(
  url: string,
  type: 'vector' | 'raster' = 'vector',
): maplibregl.SourceSpecification {
  return {
    type,
    url: `pmtiles://${url}`,
  } as maplibregl.SourceSpecification;
}

/** Default world admin boundaries PMTiles archive (public domain). */
export const WORLD_ADMIN_PMTILES_URL =
  'https://data.source.coop/protomaps/natural-earth/natural_earth_vector.pmtiles';
