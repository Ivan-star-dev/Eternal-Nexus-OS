import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";

/**
 * Initializes the PMTiles protocol for MapLibre GL.
 * Enables the usage of `pmtiles://` custom protocol schemas in map sources.
 * 
 * @example
 * initPMTiles(); // Must be called once before the Map component mounts
 * 
 * const map = new maplibregl.Map({
 *   style: {
 *     version: 8,
 *     sources: {
 *       "basemap": {
 *         type: "vector",
 *         url: "pmtiles://path/to/my/tiles.pmtiles"
 *       }
 *     },
 *     layers: [...]
 *   }
 * })
 */
let isInitialized = false;

export const initPMTiles = () => {
  if (isInitialized) return;

  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile.bind(protocol));
  isInitialized = true;
  
  console.log("[PMTiles] Custom pmtiles:// protocol registered to MapLibre GL.");
};
