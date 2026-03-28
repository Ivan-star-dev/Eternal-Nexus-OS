/**
 * useGuidance — Resolves guidance state for current portal + maturity
 * V9-GUIDANCE-GOVERNANCE-001 | K-10+K-11
 * Source: RUBERRA_V10_1_MASTER.md §GUIDANCE MODEL
 *
 * GOVERNANCE LOCK:
 * - NEVER modifies portal identity, palette, motion cap, or density cap.
 * - Guidance appears maximum once per portal visit (trigger lifecycle managed by caller).
 *
 * Design: accepts maturityLevel directly so callers compose with useEvolution
 * if available, or pass 0 as the safe default for new users.
 */

import { useMemo } from 'react'
import { usePortalIdentity } from '@/hooks/usePortalIdentity'
import { resolveGuidanceIntensity } from '@/lib/guidance/guidanceModel'
import type { GuidanceState, GuidanceTrigger } from '@/lib/guidance/types'

// ──────────────────────────────────────────────
// HOOK
// ──────────────────────────────────────────────

/**
 * Resolves guidance state for the current portal and user maturity.
 *
 * @param trigger - What triggered this guidance check. null = no guidance shown.
 * @param maturityLevel - User maturity level (0–3). Defaults to 0 (new user / safe default).
 *                        Callers should compose with useEvolution().maturity.level when available.
 */
export function useGuidance(
  trigger: GuidanceTrigger | null,
  maturityLevel: 0 | 1 | 2 | 3 = 0,
): GuidanceState {
  const { config } = usePortalIdentity()

  const guidanceState = useMemo<GuidanceState>(
    () => resolveGuidanceIntensity(maturityLevel, config.densityCap, trigger),
    [maturityLevel, config.densityCap, trigger],
  )

  return guidanceState
}
