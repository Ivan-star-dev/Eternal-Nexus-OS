// sacred flow — Atlas render presets per mode
// Controls post-processing, particles, quality per mode

import type { AtlasMode, QualityTier } from "./atlas-state";

export interface RenderPreset {
  bloom: { enabled: boolean; contrast: number; brightness: number; delta: number; sigma: number; stepSize: number };
  ao: { enabled: boolean; intensity: number };
  fxaa: boolean;
  msaa: number;
  particleDensity: number; // 0-1 scale
  cityTiles: boolean;
  idleOrbit: boolean;
  renderCadence: "explicit" | "continuous";
}

export const MODE_PRESETS: Record<AtlasMode, RenderPreset> = {
  clean: {
    bloom: { enabled: true, contrast: 110, brightness: -0.15, delta: 1.0, sigma: 1.5, stepSize: 1.0 },
    ao: { enabled: true, intensity: 1.5 },
    fxaa: true,
    msaa: 4,
    particleDensity: 0.05,
    cityTiles: false,
    idleOrbit: false,
    renderCadence: "explicit",
  },
  cinematic: {
    bloom: { enabled: true, contrast: 115, brightness: -0.08, delta: 1.2, sigma: 2.5, stepSize: 1.0 },
    ao: { enabled: true, intensity: 2.0 },
    fxaa: true,
    msaa: 4,
    particleDensity: 0.3,
    cityTiles: false,
    idleOrbit: true,
    renderCadence: "continuous",
  },
  intelligence: {
    bloom: { enabled: true, contrast: 105, brightness: -0.2, delta: 0.8, sigma: 1.2, stepSize: 1.0 },
    ao: { enabled: true, intensity: 1.2 },
    fxaa: true,
    msaa: 2,
    particleDensity: 0.0,
    cityTiles: false,
    idleOrbit: false,
    renderCadence: "explicit",
  },
  live: {
    bloom: { enabled: true, contrast: 108, brightness: -0.12, delta: 1.0, sigma: 1.8, stepSize: 1.0 },
    ao: { enabled: false, intensity: 0 },
    fxaa: true,
    msaa: 2,
    particleDensity: 0.1,
    cityTiles: false,
    idleOrbit: false,
    renderCadence: "continuous",
  },
};

// sacred flow — quality tier multipliers
export const QUALITY_MULTIPLIERS: Record<QualityTier, { pixelRatio: number; msaaOverride?: number; particleScale: number }> = {
  low: { pixelRatio: 0.75, msaaOverride: 1, particleScale: 0.3 },
  balanced: { pixelRatio: 1.0, particleScale: 0.7 },
  premium: { pixelRatio: 1.5, particleScale: 1.0 },
  capture: { pixelRatio: 2.0, msaaOverride: 8, particleScale: 1.5 },
};
