/**
 * FIDELITY-LADDER-001
 * Device-aware fidelity tiers: ultra / high / balanced / light.
 * Detects device capabilities and maps to render budget.
 * Browser-safe: no node imports.
 *
 * Tier selection order:
 *  1. User override (localStorage)
 *  2. Auto-detect from device signals
 *  3. Default to 'balanced'
 */

export type FidelityTier = 'ultra' | 'high' | 'balanced' | 'light';

export interface FidelityBudget {
  tier: FidelityTier;
  // Render
  particle_count: number;
  shadow_quality: 'off' | 'low' | 'medium' | 'high';
  antialiasing: boolean;
  bloom: boolean;
  depth_of_field: boolean;
  motion_blur: boolean;
  // 3D
  geometry_detail: 'low' | 'medium' | 'high' | 'ultra';
  texture_size: 256 | 512 | 1024 | 2048;
  draw_distance: number;              // arbitrary units
  // Animation
  fps_target: 60 | 30;
  transition_duration_ms: number;
  // Data
  chart_point_limit: number;
  map_tile_quality: 'low' | 'medium' | 'high';
  // Network
  prefetch: boolean;
}

const BUDGETS: Record<FidelityTier, FidelityBudget> = {
  ultra: {
    tier: 'ultra',
    particle_count: 8000,
    shadow_quality: 'high',
    antialiasing: true,
    bloom: true,
    depth_of_field: true,
    motion_blur: true,
    geometry_detail: 'ultra',
    texture_size: 2048,
    draw_distance: 1000,
    fps_target: 60,
    transition_duration_ms: 600,
    chart_point_limit: 50000,
    map_tile_quality: 'high',
    prefetch: true,
  },
  high: {
    tier: 'high',
    particle_count: 4000,
    shadow_quality: 'medium',
    antialiasing: true,
    bloom: true,
    depth_of_field: false,
    motion_blur: false,
    geometry_detail: 'high',
    texture_size: 1024,
    draw_distance: 600,
    fps_target: 60,
    transition_duration_ms: 500,
    chart_point_limit: 20000,
    map_tile_quality: 'high',
    prefetch: true,
  },
  balanced: {
    tier: 'balanced',
    particle_count: 1500,
    shadow_quality: 'low',
    antialiasing: false,
    bloom: false,
    depth_of_field: false,
    motion_blur: false,
    geometry_detail: 'medium',
    texture_size: 512,
    draw_distance: 300,
    fps_target: 60,
    transition_duration_ms: 400,
    chart_point_limit: 10000,
    map_tile_quality: 'medium',
    prefetch: false,
  },
  light: {
    tier: 'light',
    particle_count: 300,
    shadow_quality: 'off',
    antialiasing: false,
    bloom: false,
    depth_of_field: false,
    motion_blur: false,
    geometry_detail: 'low',
    texture_size: 256,
    draw_distance: 150,
    fps_target: 30,
    transition_duration_ms: 250,
    chart_point_limit: 3000,
    map_tile_quality: 'low',
    prefetch: false,
  },
};

const OVERRIDE_KEY = 'nxos_fidelity_tier';

// ─── Device Detection ─────────────────────────────────────────────────────────

interface DeviceSignals {
  cores: number;
  memory_gb: number | null;
  is_mobile: boolean;
  pixel_ratio: number;
  prefers_reduced_motion: boolean;
  connection_type: string | null;
}

function collectDeviceSignals(): DeviceSignals {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string };
  };

  return {
    cores: nav.hardwareConcurrency ?? 2,
    memory_gb: nav.deviceMemory ?? null,
    is_mobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent),
    pixel_ratio: window.devicePixelRatio ?? 1,
    prefers_reduced_motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    connection_type: nav.connection?.effectiveType ?? null,
  };
}

function detectTier(signals: DeviceSignals): FidelityTier {
  // Reduced motion preference — always light
  if (signals.prefers_reduced_motion) return 'light';

  // Slow connection — cap at balanced
  if (signals.connection_type === '2g' || signals.connection_type === 'slow-2g') return 'light';
  if (signals.connection_type === '3g') return 'balanced';

  // Mobile devices
  if (signals.is_mobile) {
    if (signals.cores >= 6 && (signals.memory_gb ?? 0) >= 4) return 'balanced';
    return 'light';
  }

  // Desktop detection
  const mem = signals.memory_gb ?? 4;
  const cores = signals.cores;
  const dpr = signals.pixel_ratio;

  if (cores >= 8 && mem >= 8 && dpr >= 1) return 'ultra';
  if (cores >= 4 && mem >= 4) return 'high';
  if (cores >= 2 && mem >= 2) return 'balanced';
  return 'light';
}

// ─── Public API ───────────────────────────────────────────────────────────────

let _resolved: FidelityTier | null = null;

export function resolveFidelityTier(): FidelityTier {
  if (_resolved) return _resolved;

  // Check user override first
  try {
    const stored = localStorage.getItem(OVERRIDE_KEY) as FidelityTier | null;
    if (stored && stored in BUDGETS) {
      _resolved = stored;
      return _resolved;
    }
  } catch { /* ignore */ }

  // Auto-detect
  try {
    const signals = collectDeviceSignals();
    _resolved = detectTier(signals);
  } catch {
    _resolved = 'balanced';
  }

  return _resolved;
}

export function setFidelityOverride(tier: FidelityTier): void {
  try { localStorage.setItem(OVERRIDE_KEY, tier); } catch { /* ignore */ }
  _resolved = tier;
}

export function clearFidelityOverride(): void {
  try { localStorage.removeItem(OVERRIDE_KEY); } catch { /* ignore */ }
  _resolved = null;
}

export function getFidelityBudget(tier?: FidelityTier): FidelityBudget {
  const t = tier ?? resolveFidelityTier();
  return BUDGETS[t];
}

export function getCurrentBudget(): FidelityBudget {
  return getFidelityBudget(resolveFidelityTier());
}
