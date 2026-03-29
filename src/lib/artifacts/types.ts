/**
 * ARTIFACT-MEMORY-001
 * Canonical type definitions for the Artifact Memory layer.
 * Artifacts are units of user-created value that survive sessions.
 * Browser-safe: no node imports.
 */

export type ArtifactKind =
  | 'research'     // investigation output, analysis, findings
  | 'note'         // quick capture, observation, reference
  | 'plan'         // structured execution plan or blueprint
  | 'simulation'   // simulation result or model run
  | 'draft'        // work-in-progress document or design
  | 'code'         // code snippet, script, algorithm
  | 'synthesis'    // cross-domain distillation, insight
  | 'decision'     // owner decision record
  | 'experiment'   // Lab tri-core: structured experiment with hypothesis + result
  | 'evidence'     // Lab tri-core: observed fact, verified data point
  | 'hypothesis'   // Lab tri-core: falsifiable claim awaiting test
  | 'lesson';      // School tri-core: study session anchor

export type ArtifactStatus = 'active' | 'archived' | 'draft' | 'sealed';

export type ArtifactSource =
  | 'nexus'        // came from NexusPage interaction
  | 'lab'          // came from Creation Lab
  | 'school'       // came from Bridge Nova / School portal
  | 'test'         // came from Lab tri-core test portal
  | 'atlas'        // came from Atlas geospatial
  | 'manual'       // user-created directly
  | 'import';      // imported from external

export interface ArtifactMeta {
  artifact_id: string;           // ART-{date}-{uuid}
  session_id: string;            // originating session
  kind: ArtifactKind;
  title: string;
  summary: string;               // 1-3 sentence description
  content: string;               // full content (markdown / code / json)
  tags: string[];
  source: ArtifactSource;
  status: ArtifactStatus;
  ts_created: string;            // ISO 8601
  ts_updated: string;            // ISO 8601
  ts_last_accessed: string;      // ISO 8601
  version: number;               // starts at 1, increments on update
  validation_status?: 'pending' | 'running' | 'passed' | 'failed' | 'inconclusive';
  related_artifact_ids?: string[];
}

export interface ArtifactFilter {
  kind?: ArtifactKind;
  status?: ArtifactStatus;
  source?: ArtifactSource;
  tags?: string[];
  session_id?: string;
  search?: string;               // title/summary/content substring
}

export interface ArtifactSaveResult {
  artifact: ArtifactMeta;
  is_new: boolean;
}
