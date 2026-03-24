/**
 * TRINITY-ROUTING-MINIMUM-001
 * Internal runtime routing logic — not UI navigation.
 * Given a classifier output, assigns the active regime for the session.
 */

import type { TrinityFace } from './types';
import type { ActiveMode, ClassifierOutput } from './classifier';

export interface RoutingResult {
  face: TrinityFace;
  regime: Regime;
  surface_hint: string;
  toolset: string[];
  constraint: string;
}

/**
 * A regime describes the operative behaviour within a trinity face.
 * Think of it as the "gear" the organism is currently running in.
 */
export type Regime =
  | 'deep-investigation'    // Heaven Lab — structured research, modelling, simulation
  | 'rapid-mapping'         // Heaven Lab — quick conceptual mapping before deep dive
  | 'guided-progression'    // Bridge Nova — milestone-based learning / skill building
  | 'navigation-assist'     // Bridge Nova — helping reach a goal with route comparison
  | 'artefact-production'   // Nexus Cria — building, writing, coding a deliverable
  | 'synthesis-track'       // Nexus Cria — combining inputs into new form
  | 'reentry-track';        // Any face — resuming prior interrupted session

// ── Routing table ────────────────────────────────────────────────────────────

type RoutingEntry = {
  regime: Regime;
  surface_hint: string;
  toolset: string[];
  constraint: string;
};

const ROUTING_TABLE: Record<TrinityFace, Record<ActiveMode, RoutingEntry>> = {
  heaven_lab: {
    research: {
      regime: 'deep-investigation',
      surface_hint: 'Open structured analysis workspace — hypothesis, model, evidence',
      toolset: ['session-backbone', 'provenance-spine', 'concept-graph'],
      constraint: 'No speculative outputs without evidence chain',
    },
    production: {
      regime: 'rapid-mapping',
      surface_hint: 'Map domain before building — define parameters',
      toolset: ['session-backbone', 'concept-graph'],
      constraint: 'Map first, produce second',
    },
    learning: {
      regime: 'rapid-mapping',
      surface_hint: 'Establish concept landscape before structured learning',
      toolset: ['session-backbone'],
      constraint: 'Establish foundations before advancing',
    },
    synthesis: {
      regime: 'deep-investigation',
      surface_hint: 'Investigate synthesis target deeply before generating output',
      toolset: ['session-backbone', 'provenance-spine'],
      constraint: 'Evidence required before synthesis',
    },
    decision: {
      regime: 'rapid-mapping',
      surface_hint: 'Map decision space — constraints, options, tradeoffs',
      toolset: ['session-backbone'],
      constraint: 'Map all options before recommending',
    },
    continuation: {
      regime: 'deep-investigation',
      surface_hint: 'Resume from re_entry_point — no cold start',
      toolset: ['session-backbone', 'provenance-spine', 'relay-coupling'],
      constraint: 'Pick up exactly where session left off',
    },
  },
  bridge_nova: {
    research: {
      regime: 'guided-progression',
      surface_hint: 'Convert research goal into structured learning path',
      toolset: ['session-backbone'],
      constraint: 'Sequence knowledge acquisition by dependency order',
    },
    production: {
      regime: 'guided-progression',
      surface_hint: 'Guide step-by-step toward production milestone',
      toolset: ['session-backbone'],
      constraint: 'No skipped prerequisites',
    },
    learning: {
      regime: 'guided-progression',
      surface_hint: 'Build milestone map — knowledge checkpoints with progress tracking',
      toolset: ['session-backbone', 'relay-coupling'],
      constraint: 'Validate understanding before advancing milestone',
    },
    synthesis: {
      regime: 'navigation-assist',
      surface_hint: 'Help navigate from current knowledge to synthesis capability',
      toolset: ['session-backbone'],
      constraint: 'Build capability before asking for output',
    },
    decision: {
      regime: 'navigation-assist',
      surface_hint: 'Compare routes — time, cost, skill requirement, risk',
      toolset: ['session-backbone'],
      constraint: 'Concrete constraints required before route scoring',
    },
    continuation: {
      regime: 'guided-progression',
      surface_hint: 'Resume milestone path from last checkpoint',
      toolset: ['session-backbone', 'relay-coupling'],
      constraint: 'Validate prior milestone before continuing',
    },
  },
  nexus_cria: {
    research: {
      regime: 'synthesis-track',
      surface_hint: 'Research feeds directly into production artefact',
      toolset: ['session-backbone', 'provenance-spine'],
      constraint: 'Research must resolve in concrete output',
    },
    production: {
      regime: 'artefact-production',
      surface_hint: 'Open production track — type, scope, first commit',
      toolset: ['session-backbone', 'provenance-spine'],
      constraint: 'Artefact must be real and deliverable',
    },
    learning: {
      regime: 'artefact-production',
      surface_hint: 'Learn by making — produce artefact as proof of understanding',
      toolset: ['session-backbone'],
      constraint: 'Output demonstrates learning',
    },
    synthesis: {
      regime: 'synthesis-track',
      surface_hint: 'Combine inputs into new form — define output type and format',
      toolset: ['session-backbone', 'provenance-spine'],
      constraint: 'Input refs must exist before synthesis opens',
    },
    decision: {
      regime: 'artefact-production',
      surface_hint: 'Decision resolves in a deliverable — spec, plan, or prototype',
      toolset: ['session-backbone'],
      constraint: 'Decision must produce tangible output',
    },
    continuation: {
      regime: 'artefact-production',
      surface_hint: 'Resume production from last artefact state',
      toolset: ['session-backbone', 'provenance-spine', 'relay-coupling'],
      constraint: 'Re-open artefact — do not restart from scratch',
    },
  },
};

// ── Router ───────────────────────────────────────────────────────────────────

export function route(classification: ClassifierOutput): RoutingResult {
  const { chosen_trinity_face, active_mode } = classification;

  const entry = ROUTING_TABLE[chosen_trinity_face][active_mode];

  return {
    face: chosen_trinity_face,
    regime: entry.regime,
    surface_hint: entry.surface_hint,
    toolset: entry.toolset,
    constraint: entry.constraint,
  };
}
