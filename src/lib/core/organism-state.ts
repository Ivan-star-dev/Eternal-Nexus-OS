/**
 * organism-state.ts — Canonical state schema for the Nexus Living Organism.
 *
 * This is the single source of truth for the entire runtime.
 * Every layer (identity, memory, intelligence, environment, system)
 * is represented here and only mutated via NexusRuntime.
 *
 * Canon: LIVING_SYSTEM_MANIFEST.md · @claude · 2026-03-28
 */

import type { FidelityTier } from '@/lib/fidelity/ladder';
import type { PortalId } from '@/lib/portal/identity';
import type { RouteAction } from '@/lib/route-intelligence/engine';
import type { TrinityFace, ProvenanceStatus } from '@/lib/memory/types';
import type { Regime } from '@/lib/memory/routing';
import type { GovernanceViolation } from '@/lib/governance/runtime-guard';

// ─── Boot Phase ───────────────────────────────────────────────────────────────

/**
 * The lifecycle of the organism from process start to live state.
 * cold → booting → live
 * Any subsystem failure → degraded (but never dead — memory persists)
 */
export type BootPhase = 'cold' | 'booting' | 'live' | 'degraded';

// ─── Behavioral Profile ───────────────────────────────────────────────────────

/**
 * Inferred from evolution data. Updated each session.
 * Drives route intelligence suggestions + atmosphere tone.
 */
export type BehavioralType =
  | 'explorer'    // visits many portals, low artifact depth — new or wide-ranging
  | 'builder'     // high artifact count, stays in Lab — production-focused
  | 'researcher'  // deep Lab+Nexus sessions, long TTL — investigation-focused
  | 'navigator'   // follows route suggestions, milestone-oriented
  | 'unknown';    // insufficient signal — first session or early usage

// ─── Continuity Score ─────────────────────────────────────────────────────────

/**
 * 0–1 float. Measures how complete the organism's memory of this user is.
 * Computed each boot from available signals. Drives resume confidence.
 *
 * Components:
 *   +0.30 re_entry_point present
 *   +0.20 is_resume === true
 *   +0.20 artifact_count >= 1 (capped)
 *   +0.10 session age < 24h
 *   +0.10 scroll_snapshot present
 *   +0.10 open_panels.length > 0
 */
export type ContinuityScore = number; // 0.0 – 1.0

// ─── Layer Interfaces ─────────────────────────────────────────────────────────

export interface IdentityLayer {
  user_id: string | null;
  is_owner: boolean;
  is_authenticated: boolean;
  behavioral_type: BehavioralType;
}

export interface MemoryLayer {
  session_id: string;
  subject: string;
  re_entry_point: string;
  is_resume: boolean;
  artifact_count: number;
  open_panels: string[];
  continuity_score: ContinuityScore;
  last_active: string;  // ISO 8601
  provenance_status: ProvenanceStatus;
}

export interface EnvironmentLayer {
  current_portal: PortalId | null;
  previous_portal: PortalId | null;
  fidelity_tier: FidelityTier;
  transition_in_progress: boolean;
  atmosphere_dirty: boolean;  // true → atmosphere cache needs rebuild
}

export interface IntelligenceLayer {
  trinity_face: TrinityFace | null;
  regime: Regime | null;
  route_suggestion: RouteAction | null;
  suggestion_confidence: number;   // 0–1
  maturity_level: 0 | 1 | 2 | 3;  // from evolution engine
  dominant_portal: PortalId | null;
}

export interface SystemLayer {
  governance_violations: GovernanceViolation[];
  violation_count: number;
  last_violation_ts: string | null;
  error_count: number;
  subsystem_health: Record<string, 'ok' | 'degraded' | 'offline'>;
}

// ─── Organism State ───────────────────────────────────────────────────────────

/**
 * OrganismState — the unified state of the living system.
 *
 * Direction of causality:
 *   identity → intelligence → memory → environment
 *
 * Never write to a layer from a lower layer.
 * All mutations go through NexusRuntime.update().
 */
export interface OrganismState {
  boot_phase: BootPhase;
  identity: IdentityLayer;
  memory: MemoryLayer;
  environment: EnvironmentLayer;
  intelligence: IntelligenceLayer;
  system: SystemLayer;
}

// ─── Initial State ────────────────────────────────────────────────────────────

export const COLD_ORGANISM_STATE: OrganismState = {
  boot_phase: 'cold',

  identity: {
    user_id: null,
    is_owner: false,
    is_authenticated: false,
    behavioral_type: 'unknown',
  },

  memory: {
    session_id: '',
    subject: '',
    re_entry_point: '',
    is_resume: false,
    artifact_count: 0,
    open_panels: [],
    continuity_score: 0,
    last_active: '',
    provenance_status: 'pending',
  },

  environment: {
    current_portal: null,
    previous_portal: null,
    fidelity_tier: 'balanced',
    transition_in_progress: false,
    atmosphere_dirty: false,
  },

  intelligence: {
    trinity_face: null,
    regime: null,
    route_suggestion: null,
    suggestion_confidence: 0,
    maturity_level: 0,
    dominant_portal: null,
  },

  system: {
    governance_violations: [],
    violation_count: 0,
    last_violation_ts: null,
    error_count: 0,
    subsystem_health: {
      session: 'ok',
      artifacts: 'ok',
      governance: 'ok',
      fidelity: 'ok',
      transitions: 'ok',
      evolution: 'ok',
      route_intelligence: 'ok',
      atmosphere: 'ok',
    },
  },
};

// ─── Continuity Score Calculator ─────────────────────────────────────────────

export function computeContinuityScore(
  session: Pick<MemoryLayer, 're_entry_point' | 'is_resume' | 'artifact_count' | 'last_active' | 'open_panels'> & { scroll_snapshot?: unknown }
): ContinuityScore {
  let score = 0;

  if (session.re_entry_point) score += 0.30;
  if (session.is_resume) score += 0.20;
  if (session.artifact_count >= 1) score += Math.min(0.20, session.artifact_count * 0.05);

  if (session.last_active) {
    const age = Date.now() - new Date(session.last_active).getTime();
    if (age < 24 * 60 * 60 * 1000) score += 0.10;
  }

  if (session.scroll_snapshot) score += 0.10;
  if (session.open_panels?.length > 0) score += 0.10;

  return Math.min(1, score);
}

// ─── Behavioral Type Resolver ─────────────────────────────────────────────────

export function resolveBehavioralType(
  maturityLevel: 0 | 1 | 2 | 3,
  artifactCount: number,
  totalSessions: number,
  dominantPortal: string | null
): BehavioralType {
  if (totalSessions < 2) return 'unknown';
  if (artifactCount > 10 && dominantPortal === 'lab') return 'builder';
  if (dominantPortal === 'nexus' || dominantPortal === 'atlas') return 'researcher';
  if (maturityLevel >= 2 && artifactCount > 5) return 'navigator';
  if (maturityLevel >= 1) return 'explorer';
  return 'unknown';
}
