// sacred-flow: @copilot — PMTiles Serverless Registrar
// Ties Atlas layer into serverless pmtiles:// protocol via MapLibre GL
// No tile-server required — client-side tile fetch from single .pmtiles file

import { Protocol } from 'pmtiles';
import type { Map as MapLibreMap } from 'maplibre-gl';

let _protocolRegistered = false;

/**
 * Registers the PMTiles protocol with MapLibre GL once per session.
 * Idempotent — safe to call multiple times.
 */
export function registerPMTilesProtocol(): void {
  if (_protocolRegistered) return;

  const protocol = new Protocol();

  // MapLibre GL allows custom protocol handlers via addProtocol
  // Cast required because MapLibre's types reference global addProtocol differently across versions
  const addProtocol = (globalThis as typeof globalThis & {
    maplibregl?: { addProtocol: (name: string, handler: typeof protocol.tile) => void };
  }).maplibregl?.addProtocol;

  if (addProtocol) {
    addProtocol('pmtiles', protocol.tile);
  }

  _protocolRegistered = true;
}

/**
 * Attaches the PMTiles protocol handler directly to a MapLibre Map instance.
 * Use when maplibregl global is not accessible (e.g. module-only builds).
 */
export function attachPMTilesToMap(map: MapLibreMap): void {
  const protocol = new Protocol();

  // Register via the map's internal fetch handler
  (map as typeof map & {
    _requestManager?: {
      _customProtocols?: Record<string, (url: string) => Promise<unknown>>;
    };
  })._requestManager?._customProtocols &&
    Object.assign(
      (map as typeof map & { _requestManager: { _customProtocols: Record<string, unknown> } })
        ._requestManager._customProtocols,
      { pmtiles: protocol.tile }
    );
}

/**
 * Returns a MapLibre-compatible vector tile source definition pointing to a PMTiles archive.
 * @param url - Full URL to the .pmtiles file (https:// or relative path)
 */
export function pmtilesSource(url: string): {
  type: 'vector';
  url: string;
} {
  const pmUrl = url.startsWith('pmtiles://') ? url : `pmtiles://${url}`;
  return {
    type: 'vector',
    url: pmUrl,
  };
}

/**
 * Default public PMTiles source for geopolitical boundaries.
 * Using Protomaps public demo extract (ODbL licence, Florence subset).
 * Note: `pmtiles://https://` is the correct MapLibre protocol prefix —
 * the PMTiles handler strips `pmtiles://` and fetches from the HTTPS URL.
 */
export const GEOPOLITICS_PMTILES_URL =
  'pmtiles://https://r2-public.protomaps.com/protomaps-sample-datasets/protomaps(vector)ODbL_firenze.pmtiles';
