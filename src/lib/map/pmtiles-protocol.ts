/**
 * PMTiles Protocol Registrar for MapLibre GL
 *
 * Registers the `pmtiles://` protocol with MapLibre so vector/raster tiles
 * can be served directly from a single .pmtiles file (local or remote).
 * Zero tile server required — fully serverless.
 *
 * Sacred Flow alignment: Atlas organ data layer infrastructure.
 * This is the plumbing that lets the map consume pre-built tile archives.
 *
 * Usage:
 *   import { registerPMTilesProtocol, deregisterPMTilesProtocol } from '@/lib/map/pmtiles-protocol';
 *   registerPMTilesProtocol();   // call once before creating map
 *   deregisterPMTilesProtocol(); // call on unmount
 */

import { PMTiles, FetchSource } from 'pmtiles';
import maplibregl from 'maplibre-gl';

// Cache PMTiles instances by URL to avoid re-fetching headers
const pmtilesCache = new Map<string, PMTiles>();

let registered = false;

/**
 * Get or create a PMTiles instance for a given URL.
 * Caches instances so multiple layers sharing the same archive
 * don't duplicate HTTP range-request overhead.
 */
function getPMTiles(url: string): PMTiles {
  let instance = pmtilesCache.get(url);
  if (!instance) {
    instance = new PMTiles(new FetchSource(url));
    pmtilesCache.set(url, instance);
  }
  return instance;
}

/**
 * Register the `pmtiles://` protocol with MapLibre GL.
 *
 * After registration, any source URL like:
 *   `pmtiles://https://example.com/tiles.pmtiles`
 * will be intercepted, and tile requests will be served via
 * HTTP range requests against the .pmtiles archive.
 *
 * Call this ONCE before creating any MapLibre map instance.
 */
export function registerPMTilesProtocol(): void {
  if (registered) return;

  maplibregl.addProtocol('pmtiles', async (params) => {
    // params.url format: "pmtiles://https://example.com/file.pmtiles/{z}/{x}/{y}"
    // We need to split the archive URL from the tile coordinates
    const url = params.url.replace('pmtiles://', '');

    // Extract the .pmtiles archive URL (everything before the tile path)
    const pmtilesMatch = url.match(/^(.*?\.pmtiles)/);
    if (!pmtilesMatch) {
      throw new Error(`Invalid pmtiles URL: ${params.url}`);
    }

    const archiveUrl = pmtilesMatch[1];
    const tilePath = url.slice(archiveUrl.length + 1); // skip the "/"

    const pmtiles = getPMTiles(archiveUrl);

    // If no tile path, return the TileJSON metadata
    if (!tilePath || tilePath === '') {
      const header = await pmtiles.getHeader();
      const metadata = await pmtiles.getMetadata();

      const tileJson = {
        tiles: [`pmtiles://${archiveUrl}/{z}/{x}/{y}`],
        minzoom: header.minZoom,
        maxzoom: header.maxZoom,
        bounds: [header.minLon, header.minLat, header.maxLon, header.maxLat],
        ...(typeof metadata === 'object' ? metadata : {}),
      };

      return {
        data: new TextEncoder().encode(JSON.stringify(tileJson)).buffer,
      };
    }

    // Parse tile coordinates: z/x/y
    const parts = tilePath.split('/');
    if (parts.length < 3) {
      throw new Error(`Invalid tile path: ${tilePath}`);
    }

    const z = parseInt(parts[0], 10);
    const x = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);

    const tileData = await pmtiles.getZxy(z, x, y);

    if (!tileData || !tileData.data) {
      // Empty tile — return empty response (MapLibre handles gracefully)
      return { data: new ArrayBuffer(0) };
    }

    return { data: tileData.data };
  });

  registered = true;
}

/**
 * Deregister the `pmtiles://` protocol and clear the cache.
 * Call on app unmount or when the map is no longer needed.
 */
export function deregisterPMTilesProtocol(): void {
  if (!registered) return;

  maplibregl.removeProtocol('pmtiles');
  pmtilesCache.clear();
  registered = false;
}

/**
 * Check if the PMTiles protocol is currently registered.
 */
export function isPMTilesRegistered(): boolean {
  return registered;
}
