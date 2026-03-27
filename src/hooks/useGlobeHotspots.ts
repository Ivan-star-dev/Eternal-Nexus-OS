/**
 * useGlobeHotspots.ts — K-08 PIPELINE
 * V4-WORLD-FEATURES-001 | 2026-03-27
 *
 * Returns a static array of globe hotspot positions with real-world coordinates.
 * These represent active project locations visible on the globe canvas.
 * Data layer for GlobeCanvas — consumed by any component needing hotspot positions.
 */

export interface GlobeHotspot {
  id: string;
  lat: number;
  lng: number;
  label: string;
  status: "active" | "monitoring" | "research" | "planning";
  projectId?: string;
}

const HOTSPOTS: GlobeHotspot[] = [
  {
    id: "hs-deltaspine",
    lat: 52.3676,
    lng: 4.9041,
    label: "DeltaSpine NL",
    status: "active",
    projectId: "deltaspine-nl",
  },
  {
    id: "hs-geocore",
    lat: 14.9305,
    lng: -23.5133,
    label: "GeoCore Power",
    status: "active",
    projectId: "geocore-power",
  },
  {
    id: "hs-terralenta",
    lat: -15.7801,
    lng: -47.9292,
    label: "Terra Lenta — Research Hub",
    status: "research",
    projectId: "terra-lenta",
  },
  {
    id: "hs-fusion",
    lat: 35.6762,
    lng: 139.6503,
    label: "Fusion Core — Asia Node",
    status: "planning",
    projectId: "fusion-core",
  },
  {
    id: "hs-chipfold",
    lat: 37.5665,
    lng: 126.978,
    label: "Chip Fold — Seoul Lab",
    status: "active",
    projectId: "chip-fold",
  },
];

export function useGlobeHotspots(): GlobeHotspot[] {
  return HOTSPOTS;
}
