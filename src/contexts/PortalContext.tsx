/**
 * Portal Context — Runtime portal state + continuity
 * V7-PORTAL-STATE-001 | K-16 ARCH
 * V8-AUTH-001 update: Supabase session persistence for authed users
 * Source: RUBERRA_V10_1_MASTER.md Session Loop + Spawn Model
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode, useRef } from 'react'
import type { PortalId, PortalConfig, PortalState, SessionSnapshot } from '@/lib/portal/types'
import { getPortalConfig } from '@/lib/portal/portalRegistry'
import { saveSnapshot, loadSnapshot, clearSnapshot } from '@/lib/portal/sessionContinuity'
import { saveSessionSnapshot, loadSessionSnapshot } from '@/lib/auth/sessionPersistence'
import { supabase } from '@/integrations/supabase/client'

interface PortalContextValue {
  currentPortal: PortalId
  portalConfig: PortalConfig
  portalState: PortalState
  snapshot: SessionSnapshot | null
  openPanels: string[]
  transition: (portalId: PortalId, route?: string) => void
  clearContinuity: () => void
  openPanel: (id: string) => void
  closePanel: (id: string) => void
}

const DEFAULT_PORTAL: PortalId = 'lab'

const PortalContext = createContext<PortalContextValue | null>(null)

interface PortalProviderProps {
  children: ReactNode
}

export function PortalProvider({ children }: PortalProviderProps) {
  // Track authenticated user id for Supabase persistence
  const userIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      userIdRef.current = session?.user?.id
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      userIdRef.current = session?.user?.id
    })
    return () => subscription?.unsubscribe()
  }, [])

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
  const [openPanels, setOpenPanels] = useState<string[]>(() => loadSnapshot()?.openPanels ?? [])

  // On mount: try Supabase first (if authed), fall back to localStorage
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user?.id) return
      const remote = await loadSessionSnapshot(session.user.id)
      if (!remote) return
      setSnapshot(remote)
      setOpenPanels(remote.openPanels ?? [])
      setPortalState(prev => ({
        ...prev,
        current: remote.portalId,
        snapshot: remote,
      }))
    })
  }, [])

  // Keep a ref so transition() can read latest openPanels without stale closure
  const openPanelsRef = useRef<string[]>(openPanels)
  useEffect(() => {
    openPanelsRef.current = openPanels
  }, [openPanels])

  const transition = useCallback((portalId: PortalId, route?: string) => {
    setPortalState(prev => {
      const newSnapshot: SessionSnapshot = {
        portalId,
        lastRoute: route ?? getPortalConfig(portalId).route,
        scrollPosition: typeof window !== 'undefined' ? window.scrollY : 0,
        openPanels: openPanelsRef.current,
        lastTaskContext: null,
        timestamp: Date.now(),
      }
      saveSnapshot(newSnapshot)
      setSnapshot(newSnapshot)
      void saveSessionSnapshot(newSnapshot, userIdRef.current)
      // Reset panels on portal change
      setOpenPanels([])
      openPanelsRef.current = []
      return {
        current: portalId,
        previous: prev.current,
        snapshot: newSnapshot,
        isTransitioning: false,
      }
    })
  }, [])

  const openPanel = useCallback((id: string) => {
    setOpenPanels(prev => prev.includes(id) ? prev : [...prev, id])
  }, [])

  const closePanel = useCallback((id: string) => {
    setOpenPanels(prev => prev.filter(p => p !== id))
  }, [])

  const clearContinuity = useCallback(() => {
    clearSnapshot()
    setSnapshot(null)
    setOpenPanels([])
    setPortalState(prev => ({ ...prev, snapshot: null }))
  }, [])

  // Persist snapshot whenever portal or openPanels changes
  useEffect(() => {
    if (!snapshot) return
    const updated: SessionSnapshot = {
      ...snapshot,
      openPanels,
      timestamp: Date.now(),
    }
    saveSnapshot(updated)
    void saveSessionSnapshot(updated, userIdRef.current)
  }, [portalState.current, snapshot, openPanels])

  const value: PortalContextValue = {
    currentPortal: portalState.current,
    portalConfig: getPortalConfig(portalState.current),
    portalState,
    snapshot,
    openPanels,
    transition,
    clearContinuity,
    openPanel,
    closePanel,
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
