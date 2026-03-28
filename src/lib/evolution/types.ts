/**
 * Evolution Engine — Types
 * V9-EVOLUTION-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md §EVOLUTION MODEL
 */

import type { PortalId } from '@/lib/portal/types'

export interface UsageEvent {
  portalId: PortalId
  action: 'visit' | 'tool_open' | 'panel_open' | 'artifact_create' | 'task_complete'
  timestamp: number
  sessionId: string
}

export interface MaturityLevel {
  level: 0 | 1 | 2 | 3  // 0=new, 1=familiar, 2=practiced, 3=expert
  portalVisits: Record<PortalId, number>
  totalSessions: number
  lastActivePortal: PortalId | null
  dominantRoute: PortalId[]  // most visited portals in order
}

export interface UnlockGraph {
  unlockedFeatures: string[]  // feature ids that are now visible
  nextSuggestedPortal: PortalId | null
  nextSuggestedAction: string | null
}
