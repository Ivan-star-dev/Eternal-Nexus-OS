// sacred-flow: Pilar 1 — Input validation guardrails for Tribunal event ingestion
// Prevents malformed TribunalVerdict events from entering the Index
// Fluxo imutável: Tribunal → Atlas → Index → News

import type { TribunalVerdict, AgentId } from '@/types/index';

/** Valid verdict outcome values */
const VALID_VERDICTS = ['approved', 'rejected', 'needs-review'] as const;

/** Valid flow target values */
const VALID_FLOW_TARGETS = ['atlas', 'index', 'news'] as const;

/** Valid AgentId values */
const VALID_AGENT_IDS: AgentId[] = [
  'zeta-9', 'kronos', 'nanobanana',
  'sora-prime', 'cidance', 'texturelord',
  'echo-vox', 'clipmaster',
];

/**
 * Validate that a string is a valid ISO 8601 date or a numeric Unix timestamp (ms).
 * TribunalVerdict uses `timestamp: number` (Unix ms), but we accept both formats
 * so this utility is reusable for future event types that may use ISO strings.
 */
export function isValidTimestamp(value: unknown): boolean {
  if (typeof value === 'number') {
    // Must be a positive finite number representing a plausible Unix ms timestamp
    // Earliest plausible: 2000-01-01 (946684800000), latest: year 2100
    return (
      Number.isFinite(value) &&
      value > 946_684_800_000 &&
      value < 4_102_444_800_000
    );
  }
  if (typeof value === 'string') {
    if (value.trim() === '') return false;
    const d = new Date(value);
    return !isNaN(d.getTime());
  }
  return false;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a `TribunalVerdict` (or unknown input) before it is ingested into
 * the Tribunal → Index pipeline.
 *
 * Rules:
 *  - Required fields present and non-empty: id, topic, judges, verdict, confidence, reasoning, timestamp, flowTarget
 *  - `id`:          non-empty string
 *  - `topic`:       non-empty string
 *  - `judges`:      non-empty array of valid AgentId strings
 *  - `verdict`:     one of 'approved' | 'rejected' | 'needs-review'
 *  - `confidence`:  number in [0, 1]
 *  - `reasoning`:   non-empty string
 *  - `timestamp`:   valid Unix ms timestamp (number)
 *  - `flowTarget`:  one of 'atlas' | 'index' | 'news'
 */
export function validateTribunalEvent(event: unknown): ValidationResult {
  const errors: string[] = [];

  // Must be a plain object
  if (event === null || typeof event !== 'object' || Array.isArray(event)) {
    return {
      valid: false,
      errors: ['Event must be a non-null object.'],
    };
  }

  const e = event as Record<string, unknown>;

  // ── id ──────────────────────────────────────────────────────────────────
  if (!('id' in e) || e.id === undefined || e.id === null) {
    errors.push('Missing required field: id.');
  } else if (typeof e.id !== 'string') {
    errors.push(`Field 'id' must be a string, got ${typeof e.id}.`);
  } else if (e.id.trim() === '') {
    errors.push("Field 'id' must not be empty.");
  }

  // ── topic ────────────────────────────────────────────────────────────────
  if (!('topic' in e) || e.topic === undefined || e.topic === null) {
    errors.push('Missing required field: topic.');
  } else if (typeof e.topic !== 'string') {
    errors.push(`Field 'topic' must be a string, got ${typeof e.topic}.`);
  } else if (e.topic.trim() === '') {
    errors.push("Field 'topic' must not be empty.");
  }

  // ── judges ───────────────────────────────────────────────────────────────
  if (!('judges' in e) || e.judges === undefined || e.judges === null) {
    errors.push('Missing required field: judges.');
  } else if (!Array.isArray(e.judges)) {
    errors.push(`Field 'judges' must be an array, got ${typeof e.judges}.`);
  } else if (e.judges.length === 0) {
    errors.push("Field 'judges' must not be empty.");
  } else {
    e.judges.forEach((j, i) => {
      if (typeof j !== 'string') {
        errors.push(`Field 'judges[${i}]' must be a string, got ${typeof j}.`);
      } else if (!(VALID_AGENT_IDS as string[]).includes(j)) {
        errors.push(`Field 'judges[${i}]' contains unknown AgentId: '${j}'.`);
      }
    });
  }

  // ── verdict ──────────────────────────────────────────────────────────────
  if (!('verdict' in e) || e.verdict === undefined || e.verdict === null) {
    errors.push('Missing required field: verdict.');
  } else if (!(VALID_VERDICTS as readonly unknown[]).includes(e.verdict)) {
    errors.push(
      `Field 'verdict' must be one of [${VALID_VERDICTS.join(', ')}], got '${String(e.verdict)}'.`
    );
  }

  // ── confidence ───────────────────────────────────────────────────────────
  if (!('confidence' in e) || e.confidence === undefined || e.confidence === null) {
    errors.push('Missing required field: confidence.');
  } else if (typeof e.confidence !== 'number' || !Number.isFinite(e.confidence)) {
    errors.push(`Field 'confidence' must be a finite number, got ${typeof e.confidence}.`);
  } else if (e.confidence < 0 || e.confidence > 1) {
    errors.push(`Field 'confidence' must be in [0, 1], got ${e.confidence}.`);
  }

  // ── reasoning ────────────────────────────────────────────────────────────
  if (!('reasoning' in e) || e.reasoning === undefined || e.reasoning === null) {
    errors.push('Missing required field: reasoning.');
  } else if (typeof e.reasoning !== 'string') {
    errors.push(`Field 'reasoning' must be a string, got ${typeof e.reasoning}.`);
  } else if (e.reasoning.trim() === '') {
    errors.push("Field 'reasoning' must not be empty.");
  }

  // ── timestamp ────────────────────────────────────────────────────────────
  if (!('timestamp' in e) || e.timestamp === undefined || e.timestamp === null) {
    errors.push('Missing required field: timestamp.');
  } else if (!isValidTimestamp(e.timestamp)) {
    errors.push(
      `Field 'timestamp' must be a valid Unix ms timestamp or ISO date string, got ${JSON.stringify(e.timestamp)}.`
    );
  }

  // ── flowTarget ───────────────────────────────────────────────────────────
  if (!('flowTarget' in e) || e.flowTarget === undefined || e.flowTarget === null) {
    errors.push('Missing required field: flowTarget.');
  } else if (!(VALID_FLOW_TARGETS as readonly unknown[]).includes(e.flowTarget)) {
    errors.push(
      `Field 'flowTarget' must be one of [${VALID_FLOW_TARGETS.join(', ')}], got '${String(e.flowTarget)}'.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Type-guard that narrows `unknown` to `TribunalVerdict` after validation.
 * Usage:
 *   if (isTribunalVerdict(event)) { ... }
 */
export function isTribunalVerdict(event: unknown): event is TribunalVerdict {
  return validateTribunalEvent(event).valid;
}
