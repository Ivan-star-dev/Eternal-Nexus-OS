// sacred flow — Atlas state system: modes, quality tiers, camera states
// Single source of truth for the Atlas organ

export type AtlasMode = "clean" | "cinematic" | "intelligence" | "live";
export type QualityTier = "low" | "balanced" | "premium" | "capture";
export type CameraState = "arrival" | "orbit" | "focus" | "inspect" | "idle" | "transition";

export interface AtlasState {
  mode: AtlasMode;
  qualityTier: QualityTier;
  cameraState: CameraState;
  activeRegionId?: string;
  activeLayers: string[];
  selectedEntityId?: string;
  isMoving: boolean;
  isUserInteracting: boolean;
  isIdleOrbitEnabled: boolean;
  timelineTime: number;
}

export const DEFAULT_ATLAS_STATE: AtlasState = {
  mode: "clean",
  qualityTier: "balanced",
  cameraState: "arrival",
  activeLayers: ["base", "labels"],
  isMoving: false,
  isUserInteracting: false,
  isIdleOrbitEnabled: true,
  timelineTime: 50,
};

// sacred flow — mode layer limits (prevent GIS soup)
export const MODE_LAYER_LIMITS: Record<AtlasMode, number> = {
  clean: 1,
  cinematic: 2,
  intelligence: 3,
  live: 3,
};

// sacred flow — layer groups (never mix conflicting groups)
export const LAYER_GROUPS = {
  base: ["terrain", "imagery", "labels"],
  environment: ["weather", "clouds", "atmosphere"],
  mobility: ["shipping", "air-traffic", "trade-corridors"],
  economy: ["co2", "energy-grids", "innovation-clusters"],
  georisk: ["earthquakes", "volcanism", "coastal-flood", "conflict"],
  broadcast: ["media-density", "broadcast-hotspots"],
  atlas: ["projects", "connection-arcs", "agent-beams"],
} as const;
