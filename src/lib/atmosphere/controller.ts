/**
 * ATMOSPHERE-CONTROLLER-001
 * Disciplined atmosphere engine — links portal identity to visual state.
 * Provides CSS values ready to inject into portal wrapper elements.
 * No direct DOM manipulation — returns pure data, UI layer applies it.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 7 (Atmosphere) + Gap 2 (Portal Identity)
 * @claude | 2026-03-28
 */

import { getPortalIdentity, getPortalFromPath } from '@/lib/portal/identity';
import type { PortalId, PortalIdentitySignature } from '@/lib/portal/identity';
import { getCurrentBudget } from '@/lib/fidelity';

export interface AtmosphereState {
  // CSS background value for page wrapper
  page_background: string;
  // CSS value for ambient overlay (position:absolute, inset:0, pointer-events:none)
  ambient_gradient: string;
  // CSS background-image for engineering grid
  grid_gradient: string | null;
  // Grain overlay opacity (0 = off)
  grain_opacity: number;
  // Vignette strength (0 = off, 1 = full)
  vignette_strength: number;
  // Whether ambient pulse animation should run
  has_pulse: boolean;
  // Primary accent color (for glow effects)
  accent: string;
  // Glow CSS value (for box-shadow etc)
  glow: string;
  // Portal identity (for consumers that need colors)
  identity: PortalIdentitySignature;
}

export interface AtmosphereTransition {
  from: AtmosphereState;
  to: AtmosphereState;
  duration_ms: number;
}

// ─── State Builder ────────────────────────────────────────────────────────────

function buildAtmosphereState(
  portalId: PortalId,
  reducedMotion: boolean
): AtmosphereState {
  const identity = getPortalIdentity(portalId);
  const budget = getCurrentBudget();

  // Fidelity-aware downgrades
  const showGrid = budget.tier !== 'light';
  const grainOpacity = budget.tier === 'light' ? 0 : identity.atmosphere.grain_opacity;
  const vignetteStrength = budget.tier === 'light' ? 0 : identity.atmosphere.vignette_strength;
  const hasPulse = !reducedMotion && identity.motion.has_ambient_pulse && budget.tier !== 'light';

  const ambientGradient = [
    identity.atmosphere.ambient_left,
    identity.atmosphere.ambient_right,
  ].filter(Boolean).join(', ');

  const gridGradient = showGrid
    ? [
        `linear-gradient(${identity.atmosphere.grid_color} 1px, transparent 1px)`,
        `linear-gradient(90deg, ${identity.atmosphere.grid_color} 1px, transparent 1px)`,
      ].join(', ')
    : null;

  return {
    page_background: identity.colors.bg_base,
    ambient_gradient: ambientGradient,
    grid_gradient: gridGradient,
    grain_opacity: grainOpacity,
    vignette_strength: vignetteStrength,
    has_pulse: hasPulse,
    accent: identity.colors.accent_primary,
    glow: `0 0 60px -10px ${identity.colors.glow_color}`,
    identity,
  };
}

// ─── Singleton cache ──────────────────────────────────────────────────────────

const _cache = new Map<string, AtmosphereState>();

function cacheKey(portalId: PortalId, reducedMotion: boolean): string {
  return `${portalId}:${reducedMotion ? 'rm' : 'full'}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAtmosphereForPortal(portalId: PortalId): AtmosphereState {
  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const key = cacheKey(portalId, reducedMotion);
  if (_cache.has(key)) return _cache.get(key)!;

  const state = buildAtmosphereState(portalId, reducedMotion);
  _cache.set(key, state);
  return state;
}

export function getAtmosphereForPath(path: string): AtmosphereState {
  const portalId = getPortalFromPath(path);
  return getAtmosphereForPortal(portalId);
}

/** Invalidate cache (call when fidelity tier changes) */
export function invalidateAtmosphereCache(): void {
  _cache.clear();
}

/** Build inline style object for a portal wrapper div */
export function buildPortalWrapperStyle(
  portalId: PortalId
): React.CSSProperties {
  const state = getAtmosphereForPortal(portalId);
  return {
    background: state.page_background,
    minHeight: '100svh',
  };
}

/** Build inline style object for the ambient overlay div */
export function buildAmbientOverlayStyle(
  portalId: PortalId
): React.CSSProperties {
  const state = getAtmosphereForPortal(portalId);
  return {
    position: 'absolute' as const,
    inset: 0,
    background: state.ambient_gradient,
    pointerEvents: 'none' as const,
  };
}

/** Build inline style object for the engineering grid div */
export function buildGridOverlayStyle(
  portalId: PortalId
): React.CSSProperties | null {
  const state = getAtmosphereForPortal(portalId);
  if (!state.grid_gradient) return null;
  return {
    position: 'absolute' as const,
    inset: 0,
    pointerEvents: 'none' as const,
    backgroundImage: state.grid_gradient,
    backgroundSize: '40px 40px',
    maskImage:
      'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
    WebkitMaskImage:
      'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
  };
}
