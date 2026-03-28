/**
 * Guidance System — Types
 * V9-GUIDANCE-GOVERNANCE-001 | K-10+K-11
 * Source: RUBERRA_V10_1_MASTER.md §GUIDANCE MODEL + RUBERRA_V10_2_EXPANSION.md §ANTI-CHAOS LOCKS
 *
 * GOVERNANCE LOCK:
 * - Guidance NEVER modifies portal identity (palette, motion cap, density cap)
 * - Guidance appears maximum once per portal visit
 * - ContextualHint cannot appear in Deep Focus (portalId: 'focus')
 */

import type { PortalId } from '@/lib/portal/types'

// ──────────────────────────────────────────────
// GUIDANCE INTENSITY
// Core law: guidance reduces with maturity. Never dominates.
// ──────────────────────────────────────────────

export type GuidanceIntensity = 'none' | 'minimal' | 'light' | 'moderate'

export interface GuidanceState {
  intensity: GuidanceIntensity
  shouldShow: boolean
  message: string | null
  triggerReason: string | null  // why guidance appeared (for debugging)
}

// ──────────────────────────────────────────────
// GUIDANCE TRIGGER
// Guidance NEVER appears without a trigger.
// ──────────────────────────────────────────────

export interface GuidanceTrigger {
  type: 'task_stall' | 'first_visit' | 'feature_unlock' | 'error_detected'
  portalId: PortalId
  context: string
}
