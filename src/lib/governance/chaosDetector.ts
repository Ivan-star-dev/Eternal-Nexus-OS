/**
 * Chaos Detector — Runtime chaos detection per V10.2 Anti-Chaos Locks
 * V9-GUIDANCE-GOVERNANCE-001 | K-10+K-11
 * Source: RUBERRA_V10_2_EXPANSION.md §ANTI-CHAOS LOCKS — EXPANDED
 *
 * GOVERNANCE LOCK:
 * - Chaos detector ONLY recommends — never auto-collapses without user action.
 * - Does NOT modify portal identity, config, or any state.
 */

import type { PortalConfig } from '@/lib/portal/types'

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────

export interface ChaosState {
  level: 'clean' | 'warning' | 'chaos'
  triggers: string[]          // what caused chaos
  recommendations: string[]   // what to do (recommendations only — no auto-action)
}

export interface CurrentSpatialState {
  openPanels: string[]
  visibleHighlights: number
  activeMotions: number
}

// ──────────────────────────────────────────────
// RECOMMENDATIONS (canonical strings)
// ──────────────────────────────────────────────

const REC_COLLAPSE_PANELS = 'Collapse secondary panels to restore the anchor surface.'
const REC_LOWER_MOTION = 'Reduce motion intensity to preserve concentration.'
const REC_RESTORE_ANCHOR = 'Restore the portal anchor surface to reorient the environment.'
const REC_LOWER_HIGHLIGHTS = 'Reduce visible highlight clusters to stay within the portal cap.'

// ──────────────────────────────────────────────
// DETECTOR
// ──────────────────────────────────────────────

export function detectChaos(
  portalConfig: PortalConfig,
  currentState: CurrentSpatialState,
): ChaosState {
  const chaosTrigs: string[] = []
  const warnTrigs: string[] = []
  const recommendations: string[] = []

  const { openPanels, visibleHighlights, activeMotions } = currentState
  const { panelCap, highlightCap, densityCap, motionCap } = portalConfig

  // ── Hard chaos: Deep Focus + any open panel
  if (densityCap === 'minimal' && openPanels.length > 0) {
    chaosTrigs.push(
      `Deep Focus panel violation: ${openPanels.length} open panel(s) detected (cap: 0 in Deep Focus)`,
    )
    recommendations.push(REC_COLLAPSE_PANELS)
    recommendations.push(REC_RESTORE_ANCHOR)
  }

  // ── Hard chaos: panels exceed portal cap
  if (openPanels.length > panelCap) {
    chaosTrigs.push(
      `Panel cap exceeded: ${openPanels.length} open (cap: ${panelCap})`,
    )
    if (!recommendations.includes(REC_COLLAPSE_PANELS)) {
      recommendations.push(REC_COLLAPSE_PANELS)
    }
  }

  // ── Warning: highlights exceed portal cap
  if (visibleHighlights > highlightCap) {
    warnTrigs.push(
      `Highlight cap exceeded: ${visibleHighlights} visible (cap: ${highlightCap})`,
    )
    recommendations.push(REC_LOWER_HIGHLIGHTS)
  }

  // ── Warning: active motions while portal motionCap is 'none'
  if (motionCap === 'none' && activeMotions > 0) {
    chaosTrigs.push(
      `Motion violation in zero-motion portal: ${activeMotions} active motion(s)`,
    )
    if (!recommendations.includes(REC_LOWER_MOTION)) {
      recommendations.push(REC_LOWER_MOTION)
    }
  }

  // ── Determine level
  if (chaosTrigs.length > 0) {
    return {
      level: 'chaos',
      triggers: chaosTrigs,
      recommendations,
    }
  }

  if (warnTrigs.length > 0) {
    return {
      level: 'warning',
      triggers: warnTrigs,
      recommendations,
    }
  }

  return {
    level: 'clean',
    triggers: [],
    recommendations: [],
  }
}
