/**
 * Evolution Engine — Usage Tracker
 * V9-EVOLUTION-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md §EVOLUTION MODEL
 *
 * GOVERNANCE: No PortalConfig mutation. Feature visibility only.
 */

import type { PortalId } from '@/lib/portal/types'
import type { UsageEvent, MaturityLevel } from './types'

const STORAGE_KEY = 'ruberra_usage_log'
const MAX_EVENTS = 200

const ALL_PORTALS: PortalId[] = ['lab', 'school', 'workshop', 'focus', 'archive', 'world']

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function recordEvent(event: UsageEvent): void {
  try {
    const log = getUsageLog()
    log.push(event)
    // FIFO: keep last MAX_EVENTS
    const trimmed = log.length > MAX_EVENTS ? log.slice(log.length - MAX_EVENTS) : log
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Silent fail — localStorage may be unavailable
  }
}

export function getUsageLog(): UsageEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as UsageEvent[]
  } catch {
    return []
  }
}

// ─── Derived maturity ─────────────────────────────────────────────────────────

export function getMaturityLevel(): MaturityLevel {
  const log = getUsageLog()

  // Count unique sessions
  const sessionSet = new Set<string>()
  for (const e of log) {
    sessionSet.add(e.sessionId)
  }
  const totalSessions = sessionSet.size

  // Count portal visits
  const portalVisits: Record<PortalId, number> = {
    lab: 0,
    school: 0,
    workshop: 0,
    focus: 0,
    archive: 0,
    world: 0,
  }
  for (const e of log) {
    if (e.action === 'visit') {
      portalVisits[e.portalId] = (portalVisits[e.portalId] ?? 0) + 1
    }
  }

  const totalVisits = Object.values(portalVisits).reduce((a, b) => a + b, 0)

  // Derive level
  let level: 0 | 1 | 2 | 3 = 0
  if (totalSessions >= 30 || totalVisits >= 50) {
    level = 3
  } else if (totalSessions >= 10 || totalVisits >= 20) {
    level = 2
  } else if (totalSessions >= 3 || totalVisits >= 5) {
    level = 1
  }

  // Last active portal
  let lastActivePortal: PortalId | null = null
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].action === 'visit') {
      lastActivePortal = log[i].portalId
      break
    }
  }

  return {
    level,
    portalVisits,
    totalSessions,
    lastActivePortal,
    dominantRoute: getDominantRoute(),
  }
}

export function getDominantRoute(): PortalId[] {
  const log = getUsageLog()
  const counts: Record<PortalId, number> = {
    lab: 0,
    school: 0,
    workshop: 0,
    focus: 0,
    archive: 0,
    world: 0,
  }
  for (const e of log) {
    if (e.action === 'visit') {
      counts[e.portalId] = (counts[e.portalId] ?? 0) + 1
    }
  }
  return (ALL_PORTALS as PortalId[])
    .filter(p => counts[p] > 0)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 3)
}
