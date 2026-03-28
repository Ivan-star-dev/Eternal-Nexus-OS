/**
 * Portal State Framework — Types
 * V7-PORTAL-STATE-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md + RUBERRA_V10_2_EXPANSION.md
 */

export type PortalId = 'lab' | 'school' | 'workshop' | 'focus' | 'archive' | 'world'

export interface PortalConfig {
  id: PortalId
  displayName: string
  route: string
  // Identity locks (V10.2 Anti-chaos)
  densityCap: 'minimal' | 'low' | 'medium' | 'high'
  motionCap: 'none' | 'subtle' | 'moderate' | 'full'
  highlightCap: 1 | 2 | 3  // max simultaneous highlight clusters
  panelCap: 1 | 2 | 3      // max simultaneous panels
  // Atmosphere
  atmosphere: {
    baseColor: string       // primary bg
    accentColor: string     // primary accent
    secondaryAccent: string
    motionSpeed: 'frozen' | 'slow' | 'normal'
    lightingMood: 'dark' | 'deep' | 'warm' | 'cool'
  }
  // Spawn
  defaultSpawnZone: string
  continuityPriority: number  // 1-5, higher = restore more aggressively
}

export interface SessionSnapshot {
  portalId: PortalId
  lastRoute: string
  scrollPosition: number
  openPanels: string[]
  lastTaskContext: string | null
  timestamp: number
}

export interface PortalState {
  current: PortalId
  previous: PortalId | null
  snapshot: SessionSnapshot | null
  isTransitioning: boolean
}
