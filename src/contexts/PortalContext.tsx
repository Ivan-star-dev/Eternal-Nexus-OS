/**
 * Portal Context — Runtime portal state + continuity
 * V7-PORTAL-STATE-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md Session Loop + Spawn Model
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { PortalId, PortalConfig, PortalState, SessionSnapshot } from '@/lib/portal/types'
import { getPortalConfig } from '@/lib/portal/portalRegistry'
import { saveSnapshot, loadSnapshot, clearSnapshot } from '@/lib/portal/sessionContinuity'

interface PortalContextValue {
  currentPortal: PortalId
  portalConfig: PortalConfig
  portalState: PortalState
  snapshot: SessionSnapshot | null
  transition: (portalId: PortalId, route?: string) => void
  clearContinuity: () => void
}

const DEFAULT_PORTAL: PortalId = 'lab'

const PortalContext = createContext<PortalContextValue | null>(null)

interface PortalProviderProps {
  children: ReactNode
}

export function PortalProvider({ children }: PortalProviderProps) {
  const [portalState, setPortalState] = useState<PortalState>(() => {
    const snapshot = loadSnapshot()
    const initial: PortalId = snapshot?.portalId ?? DEFAULT_PORTAL
    return {
      current: initial,
      previous: null,
      snapshot: snapshot,
      isTransitioning: false,
    }
  })

  const [snapshot, setSnapshot] = useState<SessionSnapshot | null>(() => loadSnapshot())

  const transition = useCallback((portalId: PortalId, route?: string) => {
    setPortalState(prev => {
      const newSnapshot: SessionSnapshot = {
        portalId,
        lastRoute: route ?? getPortalConfig(portalId).route,
        scrollPosition: typeof window !== 'undefined' ? window.scrollY : 0,
        openPanels: [],
        lastTaskContext: null,
        timestamp: Date.now(),
      }
      saveSnapshot(newSnapshot)
      setSnapshot(newSnapshot)
      return {
        current: portalId,
        previous: prev.current,
        snapshot: newSnapshot,
        isTransitioning: false,
      }
    })
  }, [])

  const clearContinuity = useCallback(() => {
    clearSnapshot()
    setSnapshot(null)
    setPortalState(prev => ({ ...prev, snapshot: null }))
  }, [])

  // Persist snapshot whenever portal changes
  useEffect(() => {
    if (!snapshot) return
    saveSnapshot({
      ...snapshot,
      timestamp: Date.now(),
    })
  }, [portalState.current, snapshot])

  const value: PortalContextValue = {
    currentPortal: portalState.current,
    portalConfig: getPortalConfig(portalState.current),
    portalState,
    snapshot,
    transition,
    clearContinuity,
  }

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return ctx
}
