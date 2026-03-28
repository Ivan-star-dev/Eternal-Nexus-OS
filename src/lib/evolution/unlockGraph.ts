/**
 * Evolution Engine — Unlock Graph
 * V9-EVOLUTION-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md §EVOLUTION MODEL
 *
 * GOVERNANCE LOCK:
 * - NEVER modify PortalConfig (palette, motion cap, density cap)
 * - ONLY controls: feature visibility, guidance intensity, suggestion text
 */

import type { PortalId } from '@/lib/portal/types'
import type { MaturityLevel } from './types'

interface UnlockGate {
  minLevel: number
  portalId?: PortalId
}

const UNLOCK_GATES: Record<string, UnlockGate> = {
  'lab.tool_spine':          { minLevel: 0 },           // always visible
  'lab.advanced_filters':    { minLevel: 1 },           // after familiar
  'lab.project_analytics':   { minLevel: 2 },           // after practiced
  'school.free_navigation':  { minLevel: 1 },           // skip sequential order
  'workshop.collaboration':  { minLevel: 2 },           // after practiced
  'world.hotspot_details':   { minLevel: 1 },           // after familiar
}

interface NextSuggestion {
  portal: PortalId
  action: string
}

const SUGGESTIONS: Record<number, NextSuggestion> = {
  0: { portal: 'lab',      action: 'Open the tool spine to start your first creation' },
  1: { portal: 'school',   action: 'Explore free navigation in the Learning School' },
  2: { portal: 'workshop', action: 'Invite a collaborator in the Workshop' },
  3: { portal: 'archive',  action: 'Review your Memory Archive — your continuity is rich' },
}

export function getUnlockedFeatures(maturity: MaturityLevel): string[] {
  return Object.entries(UNLOCK_GATES)
    .filter(([, gate]) => maturity.level >= gate.minLevel)
    .map(([featureId]) => featureId)
}

export function isFeatureUnlocked(featureId: string, maturity: MaturityLevel): boolean {
  const gate = UNLOCK_GATES[featureId]
  if (!gate) return false
  return maturity.level >= gate.minLevel
}

export function getNextSuggestion(maturity: MaturityLevel): NextSuggestion | null {
  const suggestion = SUGGESTIONS[maturity.level]
  return suggestion ?? null
}
