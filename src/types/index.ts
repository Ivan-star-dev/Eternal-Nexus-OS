// sacred-flow: Marabés — Phase 1+2 Types — EXPANDED
// Fluxo imutável: Tribunal → Atlas → Index → News
// UPDATED: added co2, temperature, fields for Atlas Phase 2 compat

export type AgentId = 
  | 'zeta-9' | 'kronos' | 'nanobanana'       // Nexus EIs
  | 'sora-prime' | 'cidance' | 'texturelord'  // Atlas EIs
  | 'echo-vox' | 'clipmaster';                // News EIs

export type OrganType = 'nexus' | 'atlas' | 'index' | 'tribunal' | 'news';

export interface AgentStatus {
  id: AgentId;
  organ: OrganType;
  status: 'active' | 'processing' | 'idle' | 'error';
  currentTask: string;
  confidence: number;     // 0-1
  lastUpdate: number;     // timestamp
  particleColor: string;  // hex — golden morabeza default
}

export interface TribunalVerdict {
  id: string;
  topic: string;
  judges: AgentId[];
  verdict: 'approved' | 'rejected' | 'needs-review';
  confidence: number;
  reasoning: string;
  timestamp: number;
  flowTarget: 'atlas' | 'index' | 'news'; // where it flows next
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: [number, number, number, number]; // RGBA
  type: 'ambient' | 'meteor' | 'verdict' | 'data-flow';
}

// sacred-flow: EXPANDED for Phase 2 Atlas compatibility
export interface RealtimeDataPoint {
  source: 'climate' | 'economy' | 'geopolitics' | 'energy' | 'migration';
  value: number;
  lat: number;
  lng: number;
  timestamp: number;
  severity: number; // 0-1

  // Phase 2 Atlas fields — climate layer
  co2?: number;              // CO2 ppm — used in AtlasPage.tsx
  temperature?: number;      // Global temp anomaly
  seaLevel?: number;         // Sea level rise mm
  energyOutput?: number;     // MW output
  migrationFlow?: number;    // People count
  gdp?: number;              // GDP indicator
  conflictLevel?: number;    // 0-1 geopolitical tension

  // Metadata
  label?: string;            // Display label
  category?: string;         // Sub-category
  unit?: string;             // Unit of measurement
}

export interface NexusSkill {
  id: string;
  name: string;
  philosophy: string;
  organ: OrganType;
  status: 'pending' | 'executing' | 'complete';
}

// sacred-flow: Atlas layer types for CesiumJS
export type AtlasLayerType = 
  | 'climate-heatmap'
  | 'economy-flow'
  | 'geopolitics-tension'
  | 'energy-grid'
  | 'migration-routes'
  | 'project-nodes';

export interface AtlasLayer {
  id: string;
  type: AtlasLayerType;
  visible: boolean;
  opacity: number;
  data: RealtimeDataPoint[];
  lastUpdate: number;
}

// sacred-flow: News broadcast types for Echo-Vox
export interface NewsBroadcast {
  id: string;
  title: string;
  content: string;
  source: OrganType;       // Which organ generated it
  verdict?: TribunalVerdict;
  mediaUrl?: string;       // Video/audio URL
  timestamp: number;
  live: boolean;
}
