// sacred flow — PMTiles serverless registrar for MapLibre GL
// Registers the pmtiles:// protocol so MapLibre can fetch tiles
// from a remote PMTiles archive without a tile server.
import { Protocol } from "pmtiles";
import { addProtocol, removeProtocol } from "maplibre-gl";

let registered = false;

/**
 * Registers the `pmtiles://` protocol handler globally for MapLibre GL JS.
 * Safe to call multiple times — only registers once per page lifecycle.
 *
 * Must be called before any map instance adds a pmtiles:// source.
 *
 * Usage:
 *   registerPMTilesProtocol();
 *   // Then in a MapLibre style source:
 *   // { type: "vector", url: "pmtiles://https://…/world.pmtiles" }
 */
export function registerPMTilesProtocol(): void {
  if (registered) return;

  const protocol = new Protocol();
  addProtocol("pmtiles", protocol.tilev4);
  registered = true;
}

/**
 * Removes the `pmtiles://` protocol handler and resets the registration flag.
 * Useful for hot-module-replacement and test teardown.
 */
export function unregisterPMTilesProtocol(): void {
  if (!registered) return;
  removeProtocol("pmtiles");
  registered = false;
}
