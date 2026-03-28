/**
 * Portal Registry — All 6 portal configurations
 * V7-PORTAL-STATE-001 | K-16 ARCH
 * Source: RUBERRA_V10_1_MASTER.md portal laws + RUBERRA_V10_2_EXPANSION.md anti-chaos locks
 */

import type { PortalId, PortalConfig } from './types'

const portalRegistry: Record<PortalId, PortalConfig> = {
  lab: {
    id: 'lab',
    displayName: 'Creation Lab',
    route: '/lab',
    densityCap: 'medium',
    motionCap: 'moderate',
    highlightCap: 2,
    panelCap: 2,
    atmosphere: {
      baseColor: '#0d1b2a',       // petroleum-blue deep
      accentColor: '#1e3a5f',     // deep ocean blue
      secondaryAccent: '#2a6496', // mid blue
      motionSpeed: 'normal',
      lightingMood: 'deep',
    },
    defaultSpawnZone: 'core-work-bay',
    continuityPriority: 5,
  },

  school: {
    id: 'school',
    displayName: 'Learning School',
    route: '/school',
    densityCap: 'low',
    motionCap: 'subtle',
    highlightCap: 2,
    panelCap: 2,
    atmosphere: {
      baseColor: '#1a1a2e',       // soft deep navy
      accentColor: '#c9a96e',     // warm gold
      secondaryAccent: '#e8d5b0', // warm cream
      motionSpeed: 'slow',
      lightingMood: 'warm',
    },
    defaultSpawnZone: 'guided-learning-hall',
    continuityPriority: 4,
  },

  workshop: {
    id: 'workshop',
    displayName: 'Workshop',
    route: '/workshop',
    densityCap: 'medium',
    motionCap: 'moderate',
    highlightCap: 2,
    panelCap: 3,
    atmosphere: {
      baseColor: '#111827',       // dark slate
      accentColor: '#374151',     // steel grey
      secondaryAccent: '#6b7280', // mid grey
      motionSpeed: 'normal',
      lightingMood: 'cool',
    },
    defaultSpawnZone: 'main-workbench',
    continuityPriority: 4,
  },

  focus: {
    id: 'focus',
    displayName: 'Deep Focus Chamber',
    route: '/focus',
    densityCap: 'minimal',
    motionCap: 'none',
    highlightCap: 1,
    panelCap: 1,
    atmosphere: {
      baseColor: '#0a0a0f',       // near-black
      accentColor: '#1a1a2e',     // barely-there navy
      secondaryAccent: '#2d2d44', // muted indigo
      motionSpeed: 'frozen',
      lightingMood: 'dark',
    },
    defaultSpawnZone: 'focus-core',
    continuityPriority: 5,
  },

  archive: {
    id: 'archive',
    displayName: 'Memory Archive',
    route: '/archive',
    densityCap: 'low',
    motionCap: 'subtle',
    highlightCap: 2,
    panelCap: 2,
    atmosphere: {
      baseColor: '#13111c',       // deep violet-black
      accentColor: '#4a3f6b',     // muted purple
      secondaryAccent: '#7c6f9f', // soft lavender
      motionSpeed: 'slow',
      lightingMood: 'deep',
    },
    defaultSpawnZone: 'memory-gallery',
    continuityPriority: 3,
  },

  world: {
    id: 'world',
    displayName: 'World',
    route: '/world',
    densityCap: 'high',
    motionCap: 'full',
    highlightCap: 3,
    panelCap: 3,
    atmosphere: {
      baseColor: '#040d1a',       // space black
      accentColor: '#0066cc',     // globe blue
      secondaryAccent: '#00aaff', // atmosphere cyan
      motionSpeed: 'normal',
      lightingMood: 'deep',
    },
    defaultSpawnZone: 'globe-orbit',
    continuityPriority: 3,
  },
}

export function getPortalConfig(id: PortalId): PortalConfig {
  return portalRegistry[id]
}

export function getAllPortalConfigs(): PortalConfig[] {
  return Object.values(portalRegistry)
}

export function getPortalByRoute(route: string): PortalConfig | undefined {
  return Object.values(portalRegistry).find(p => p.route === route)
}

export { portalRegistry }
