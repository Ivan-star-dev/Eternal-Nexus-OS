/**
 * useGovernance — Runtime governance state
 * V9-GUIDANCE-GOVERNANCE-001 | K-10+K-11
 * Source: RUBERRA_V10_2_EXPANSION.md §ANTI-CHAOS LOCKS
 *
 * Reads portal state + open panels, runs chaos detection,
 * returns clean recommendations for UI layer.
 *
 * GOVERNANCE LOCK:
 * - NEVER auto-collapses panels or modifies state.
 * - ONLY reads and recommends.
 */

import { useMemo } from 'react'
import { usePortal } from '@/contexts/PortalContext'
import { usePortalIdentity } from '@/hooks/usePortalIdentity'
import { detectChaos, type ChaosState } from '@/lib/governance/chaosDetector'

interface GovernanceReturn {
  chaosState: ChaosState
  isClean: boolean
  shouldCollapsePanels: boolean
  shouldReduceMotion: boolean
}

// Canonical recommendation strings (must match chaosDetector.ts)
const COLLAPSE_PANELS_REC = 'Collapse secondary panels to restore the anchor surface.'
const REDUCE_MOTION_REC = 'Reduce motion intensity to preserve concentration.'

export function useGovernance(): GovernanceReturn {
  const { openPanels } = usePortal()
  const { config } = usePortalIdentity()

  const chaosState = useMemo<ChaosState>(
    () =>
      detectChaos(config, {
        openPanels,
        // visibleHighlights and activeMotions are not tracked in PortalContext yet;
        // default to 0 to avoid false positives — components can pass values directly
        // to detectChaos when they have richer state.
        visibleHighlights: 0,
        activeMotions: 0,
      }),
    [config, openPanels],
  )

  const isClean = chaosState.level === 'clean'

  const shouldCollapsePanels = chaosState.recommendations.includes(COLLAPSE_PANELS_REC)
  const shouldReduceMotion = chaosState.recommendations.includes(REDUCE_MOTION_REC)

  return {
    chaosState,
    isClean,
    shouldCollapsePanels,
    shouldReduceMotion,
  }
}
