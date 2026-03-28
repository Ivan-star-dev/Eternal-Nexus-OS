/**
 * useEvolution — Evolution Engine hook
 * V9-EVOLUTION-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md §EVOLUTION MODEL
 *
 * Exposes maturity data and unlock state to components.
 * NO automatic UI changes — components decide what to do with this data.
 *
 * GOVERNANCE: Does not modify PortalConfig.
 */

import { useCallback, useMemo, useRef } from 'react'
import type { PortalId } from '@/lib/portal/types'
import type { MaturityLevel } from '@/lib/evolution/types'
import { recordEvent, getMaturityLevel } from '@/lib/evolution/usageTracker'
import { isFeatureUnlocked, getNextSuggestion } from '@/lib/evolution/unlockGraph'

// Stable session id — generated once per page load
const SESSION_ID: string = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

interface NextSuggestion {
  portal: PortalId
  action: string
}

interface UseEvolutionReturn {
  maturity: MaturityLevel
  isUnlocked: (featureId: string) => boolean
  nextSuggestion: NextSuggestion | null
  recordPortalVisit: (portalId: PortalId) => void
}

export function useEvolution(): UseEvolutionReturn {
  // Memoize maturity for the session — recalculated only once per mount
  // Components that need fresh data after a visit should remount or call recordPortalVisit.
  const maturityRef = useRef<MaturityLevel | null>(null)

  const maturity = useMemo<MaturityLevel>(() => {
    if (maturityRef.current) return maturityRef.current
    const computed = getMaturityLevel()
    maturityRef.current = computed
    return computed
  }, [])

  const recordPortalVisit = useCallback((portalId: PortalId): void => {
    recordEvent({
      portalId,
      action: 'visit',
      timestamp: Date.now(),
      sessionId: SESSION_ID,
    })
    // Invalidate cached maturity so next read reflects the new event
    maturityRef.current = null
  }, [])

  const isUnlocked = useCallback(
    (featureId: string): boolean => isFeatureUnlocked(featureId, maturity),
    [maturity],
  )

  const nextSuggestion = useMemo<NextSuggestion | null>(
    () => getNextSuggestion(maturity),
    [maturity],
  )

  return {
    maturity,
    isUnlocked,
    nextSuggestion,
    recordPortalVisit,
  }
}
