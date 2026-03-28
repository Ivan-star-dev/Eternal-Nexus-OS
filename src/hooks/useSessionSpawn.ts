/**
 * useSessionSpawn — App entry session restoration
 * V7-PORTAL-STATE-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md Spawn Laws + Session Loop
 */

import { useEffect, useState } from 'react'
import type { PortalId } from '@/lib/portal/types'
import { loadSnapshot, isSnapshotValid } from '@/lib/portal/sessionContinuity'
import { usePortal } from '@/contexts/PortalContext'

interface SessionSpawnResult {
  isReturning: boolean
  lastPortal: PortalId | null
  lastContext: string | null
  spawnReady: boolean
}

export function useSessionSpawn(): SessionSpawnResult {
  const { transition } = usePortal()
  const [result, setResult] = useState<SessionSpawnResult>({
    isReturning: false,
    lastPortal: null,
    lastContext: null,
    spawnReady: false,
  })

  useEffect(() => {
    const snapshot = loadSnapshot()

    if (snapshot && isSnapshotValid(snapshot)) {
      // Silently restore last portal — no interrogation, no noise
      transition(snapshot.portalId, snapshot.lastRoute)
      setResult({
        isReturning: true,
        lastPortal: snapshot.portalId,
        lastContext: snapshot.lastTaskContext,
        spawnReady: true,
      })
    } else {
      setResult({
        isReturning: false,
        lastPortal: null,
        lastContext: null,
        spawnReady: true,
      })
    }
    // Intentionally run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return result
}
