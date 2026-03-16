// sacred flow — Atlas adaptive quality manager
// Reduces quality during motion, restores on idle
// Device tier detection for baseline quality

import type { CesiumWidget } from "cesium";
import { MODE_PRESETS, QUALITY_MULTIPLIERS, type RenderPreset } from "./presets";
import type { AtlasMode, QualityTier } from "./atlas-state";

export type DeviceTier = 1 | 2 | 3 | 4;

// sacred flow — detect device capability
export function detectDeviceTier(): DeviceTier {
  const dpr = window.devicePixelRatio || 1;
  const mem = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile || (mem <= 2 && cores <= 4)) return 1;
  if (mem <= 4 || cores <= 4 || dpr < 1.5) return 2;
  if (mem >= 8 && cores >= 8) return 4;
  return 3;
}

export function tierToQuality(tier: DeviceTier): QualityTier {
  const map: Record<DeviceTier, QualityTier> = { 1: "low", 2: "balanced", 3: "premium", 4: "premium" };
  return map[tier];
}

// sacred flow — apply render preset to Cesium scene
export function applyPreset(widget: CesiumWidget, mode: AtlasMode, quality: QualityTier): void {
  if (!widget || widget.isDestroyed()) return;

  const preset = MODE_PRESETS[mode];
  const multiplier = QUALITY_MULTIPLIERS[quality];
  const scene = widget.scene;

  // Post-processing: bloom
  const bloom = scene.postProcessStages.bloom;
  bloom.enabled = preset.bloom.enabled;
  if (bloom.enabled) {
    bloom.uniforms.contrast = preset.bloom.contrast;
    bloom.uniforms.brightness = preset.bloom.brightness;
    bloom.uniforms.delta = preset.bloom.delta;
    bloom.uniforms.sigma = preset.bloom.sigma;
    bloom.uniforms.stepSize = preset.bloom.stepSize;
  }

  // Post-processing: AO
  const ao = scene.postProcessStages.ambientOcclusion;
  ao.enabled = preset.ao.enabled;
  if (ao.enabled) {
    ao.uniforms.intensity = preset.ao.intensity;
  }

  // FXAA
  scene.postProcessStages.fxaa.enabled = preset.fxaa;

  // Render cadence
  scene.requestRenderMode = preset.renderCadence === "explicit";

  // Pixel ratio based on quality tier
  widget.resolutionScale = multiplier.pixelRatio;

  scene.requestRender();
}

// sacred flow — reduce quality during motion
export function applyMotionReduction(widget: CesiumWidget, quality: QualityTier): void {
  if (!widget || widget.isDestroyed()) return;

  const scene = widget.scene;
  const multiplier = QUALITY_MULTIPLIERS[quality];

  // Reduce pixel ratio during motion
  widget.resolutionScale = Math.max(multiplier.pixelRatio * 0.7, 0.5);

  // Disable expensive post-processing
  scene.postProcessStages.ambientOcclusion.enabled = false;
  scene.postProcessStages.bloom.uniforms.sigma = 1.0;

  scene.requestRender();
}

// sacred flow — restore quality on idle (call after motion stops)
export function restoreIdleQuality(widget: CesiumWidget, mode: AtlasMode, quality: QualityTier): void {
  applyPreset(widget, mode, quality);
}

// sacred flow — motion detection via camera events
export function createMotionDetector(
  widget: CesiumWidget,
  onMotionStart: () => void,
  onMotionEnd: () => void,
  idleDelay = 500,
): () => void {
  if (!widget || widget.isDestroyed()) return () => {};

  let isMoving = false;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;

  const onCameraMove = () => {
    if (!isMoving) {
      isMoving = true;
      onMotionStart();
    }
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isMoving = false;
      onMotionEnd();
    }, idleDelay);
    widget.scene.requestRender();
  };

  widget.camera.changed.addEventListener(onCameraMove);

  // Cleanup function
  return () => {
    widget.camera.changed.removeEventListener(onCameraMove);
    if (idleTimer) clearTimeout(idleTimer);
  };
}
