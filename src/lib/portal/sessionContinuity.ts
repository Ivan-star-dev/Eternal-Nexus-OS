/**
 * Session Continuity — Snapshot persistence + validation
 * V7-PORTAL-STATE-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md Save/Resume Laws
 */

import type { SessionSnapshot } from './types'

const SNAPSHOT_KEY = 'ruberra:session:snapshot'
const SNAPSHOT_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export function saveSnapshot(snapshot: SessionSnapshot): void {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot))
  } catch {
    // Storage quota exceeded or unavailable — silent fail preserves app stability
  }
}

export function loadSnapshot(): SessionSnapshot | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionSnapshot
    if (!isSnapshotValid(parsed)) {
      clearSnapshot()
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearSnapshot(): void {
  try {
    localStorage.removeItem(SNAPSHOT_KEY)
  } catch {
    // Storage unavailable — silent fail
  }
}

export function isSnapshotValid(snapshot: SessionSnapshot): boolean {
  if (!snapshot || typeof snapshot.timestamp !== 'number') return false
  const age = Date.now() - snapshot.timestamp
  return age < SNAPSHOT_TTL_MS
}
