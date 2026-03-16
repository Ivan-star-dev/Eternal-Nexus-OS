/**
 * KENSHO Atlas — Satellite Tile Provider System
 * Supports NASA GIBS (free, no key), Blue Marble, and fallback procedural.
 */

export type TileLayer = "blue-marble" | "modis-truecolor" | "viirs-nightlights" | "procedural";

interface TileConfig {
  id: TileLayer;
  label: string;
  urlTemplate: string;
  maxZoom: number;
  attribution: string;
  requiresKey: boolean;
}

export const TILE_LAYERS: TileConfig[] = [
  {
    id: "blue-marble",
    label: "Blue Marble (NASA)",
    urlTemplate: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/2004-08/EPSG4326_500m/{z}/{y}/{x}.jpeg",
    maxZoom: 8,
    attribution: "NASA GIBS",
    requiresKey: false,
  },
  {
    id: "modis-truecolor",
    label: "MODIS True Color (Daily)",
    urlTemplate: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{date}/EPSG4326_250m/{z}/{y}/{x}.jpg",
    maxZoom: 9,
    attribution: "NASA GIBS / MODIS",
    requiresKey: false,
  },
  {
    id: "viirs-nightlights",
    label: "VIIRS Night Lights",
    urlTemplate: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_SNPP_DayNightBand_AtSensor_M15/default/{date}/EPSG4326_500m/{z}/{y}/{x}.png",
    maxZoom: 8,
    attribution: "NASA GIBS / VIIRS",
    requiresKey: false,
  },
  {
    id: "procedural",
    label: "Procedural (Offline)",
    urlTemplate: "",
    maxZoom: 0,
    attribution: "KENSHO Engine",
    requiresKey: false,
  },
];

/** Get today's date in YYYY-MM-DD for GIBS daily layers */
export function getGIBSDate(daysAgo = 1): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

/** Build tile URL for a given layer, zoom, row, col */
export function buildTileUrl(layer: TileLayer, z: number, y: number, x: number): string | null {
  const config = TILE_LAYERS.find((l) => l.id === layer);
  if (!config || config.id === "procedural") return null;
  return config.urlTemplate
    .replace("{z}", String(z))
    .replace("{y}", String(y))
    .replace("{x}", String(x))
    .replace("{date}", getGIBSDate());
}

/** Texture cache to avoid reloading tiles */
const textureCache = new Map<string, HTMLImageElement>();

export function loadTileImage(url: string): Promise<HTMLImageElement> {
  if (textureCache.has(url)) return Promise.resolve(textureCache.get(url)!);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      textureCache.set(url, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
