/**
 * ORGANISM_MINIMUM_MEMORY — Type Definitions
 * SESSION-BACKBONE-MINIMUM-001 · PROVENANCE-SPINE-MINIMUM-001
 * REENTRY-GRACE-MINIMUM-001 · RELAY-COUPLING-MINIMUM-001
 *
 * Browser-safe: no node imports. Pure TS types only.
 */

export type TrinityFace = 'heaven_lab' | 'bridge_nova' | 'nexus_cria';
export type OutputType = 'doc' | 'code' | 'plan' | 'analysis' | 'synthesis' | 'session';
export type FruitClass = 'primary' | 'derivative' | 'residual';
export type ProvenanceStatus = 'active' | 'closed' | 'pending';

/**
 * SESSION-BACKBONE-MINIMUM-001
 * Persisted at: ops/sessions/SES-{date}-{id}.json
 */
export interface SessionEntity {
  session_id: string;
  user_id: string;
  subject: string;
  intention: string;
  profile_snapshot: Record<string, unknown>;
  trinity_face: TrinityFace;
  swarm_activated: string[];
  concepts_touched: string[];
  fruit: string[];
  open_threads: string[];
  re_entry_point: string;
  ts_start: string; // ISO 8601
  ts_end: string | null; // ISO 8601 — null while session is active
}

/**
 * PROVENANCE-SPINE-MINIMUM-001
 * Persisted at: ops/runtime/provenance/PROV-{id}.json
 */
export interface ProvenanceNode {
  node_id: string;
  session_id: string;
  origin_agent: string;
  origin_constellation: string;
  timestamp: string; // ISO 8601
  phase: string;
  subject: string;
  intention: string;
  input_ref: string;
  output_type: OutputType;
  output_ref: string;
  fruit_class: FruitClass;
  next_consumer: string;
  status: ProvenanceStatus;
}

/**
 * REENTRY-GRACE-MINIMUM-001
 * Summarizes where a session stopped and what the next step is.
 * Derived — not independently persisted; computed from SessionEntity + ProvenanceNode.
 */
export interface ReentryGrace {
  session_id: string;
  stopped_at: string; // ISO 8601
  latest_fruit: string;
  latest_subject: string;
  open_threads: string[];
  next_expected_step: string;
  provenance_tail: string; // node_id of last ProvenanceNode
}

/**
 * RELAY-COUPLING-MINIMUM-001
 * Persisted at: ops/sessions/SES-{id}.relay.json
 * Links a session to its latest provenance node + re-entry point.
 */
export interface RelayCoupling {
  session_id: string;
  latest_provenance_node: string; // node_id
  re_entry_point: string;
  ts_coupled: string; // ISO 8601
}
