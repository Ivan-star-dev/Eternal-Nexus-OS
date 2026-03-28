/**
 * Guidance Model — Resolves guidance intensity from maturity + context
 * V9-GUIDANCE-GOVERNANCE-001 | K-10+K-11
 * Source: RUBERRA_V10_1_MASTER.md §GUIDANCE MODEL
 *
 * Core law: guidance reduces with maturity. Never dominates.
 * Guidance NEVER appears without a trigger.
 * Message must be 1 sentence max.
 *
 * GOVERNANCE LOCK:
 * - Does NOT modify portal identity, palette, motion cap, or density cap.
 */

import type { GuidanceState, GuidanceIntensity, GuidanceTrigger } from './types'

// ──────────────────────────────────────────────
// MESSAGES (1 sentence max, per trigger type)
// ──────────────────────────────────────────────

const MESSAGES: Record<GuidanceTrigger['type'], string> = {
  first_visit: 'This space adapts to your work — explore to unlock deeper layers.',
  task_stall: 'It looks like you paused — use the tool surface on the right to continue.',
  feature_unlock: 'A new capability is now available in your current portal.',
  error_detected: 'Something went wrong — your last state has been preserved.',
}

// ──────────────────────────────────────────────
// RESOLUTION RULES
//
// maturity 0 + first_visit   → light
// maturity 0 + task_stall    → moderate (max)
// maturity 0 + other         → minimal
// maturity 1                 → minimal max
// maturity 2+                → none unless task_stall → minimal
// Deep Focus (densityCap: 'minimal') → ALWAYS none (overrides everything)
// ──────────────────────────────────────────────

export function resolveGuidanceIntensity(
  maturityLevel: 0 | 1 | 2 | 3,
  portalDensityCap: 'minimal' | 'low' | 'medium' | 'high',
  trigger: GuidanceTrigger | null,
): GuidanceState {
  // No trigger → no guidance, ever
  if (trigger === null) {
    return {
      intensity: 'none',
      shouldShow: false,
      message: null,
      triggerReason: null,
    }
  }

  // Deep Focus hard override: density cap 'minimal' silences all guidance
  if (portalDensityCap === 'minimal') {
    return {
      intensity: 'none',
      shouldShow: false,
      message: null,
      triggerReason: `suppressed:deep-focus-density-cap (trigger was ${trigger.type})`,
    }
  }

  const intensity = computeIntensity(maturityLevel, trigger)
  const shouldShow = intensity !== 'none'

  return {
    intensity,
    shouldShow,
    message: shouldShow ? MESSAGES[trigger.type] : null,
    triggerReason: shouldShow ? `maturity:${maturityLevel} trigger:${trigger.type}` : null,
  }
}

// ──────────────────────────────────────────────
// INTERNAL INTENSITY COMPUTATION
// ──────────────────────────────────────────────

function computeIntensity(
  maturityLevel: 0 | 1 | 2 | 3,
  trigger: GuidanceTrigger,
): GuidanceIntensity {
  // maturity 2+ → only task_stall surfaces guidance, and only minimally
  if (maturityLevel >= 2) {
    return trigger.type === 'task_stall' ? 'minimal' : 'none'
  }

  // maturity 1 → capped at minimal
  if (maturityLevel === 1) {
    return 'minimal'
  }

  // maturity 0 → trigger-dependent
  if (trigger.type === 'task_stall') return 'moderate'
  if (trigger.type === 'first_visit') return 'light'
  return 'minimal'
}
