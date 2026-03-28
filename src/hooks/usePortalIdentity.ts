/**
 * usePortalIdentity — Enforce density/motion caps from active portal config
 * V7-PORTAL-STATE-001 | K-16 ARCH
 * Source: RUBERRA_V10_2_EXPANSION.md Anti-Chaos Locks / Hard Caps
 */

import { usePortal } from '@/contexts/PortalContext'
import type { PortalConfig } from '@/lib/portal/types'

const DENSITY_ORDER = ['minimal', 'low', 'medium', 'high'] as const
const MOTION_ORDER = ['none', 'subtle', 'moderate', 'full'] as const

type MotionLevel = 'subtle' | 'moderate' | 'full'

interface PortalIdentity {
  config: PortalConfig
  isDenseAllowed: boolean
  isMotionAllowed: (level: MotionLevel) => boolean
  isExtraHighlightAllowed: boolean
}

export function usePortalIdentity(): PortalIdentity {
  const { portalConfig } = usePortal()

  const isDenseAllowed =
    DENSITY_ORDER.indexOf(portalConfig.densityCap) >= DENSITY_ORDER.indexOf('medium')

  const isMotionAllowed = (level: MotionLevel): boolean => {
    const capIndex = MOTION_ORDER.indexOf(portalConfig.motionCap)
    const requestedIndex = MOTION_ORDER.indexOf(level)
    return requestedIndex <= capIndex
  }

  // Extra highlights = more than 1 cluster active simultaneously
  const isExtraHighlightAllowed = portalConfig.highlightCap > 1

  return {
    config: portalConfig,
    isDenseAllowed,
    isMotionAllowed,
    isExtraHighlightAllowed,
  }
}
