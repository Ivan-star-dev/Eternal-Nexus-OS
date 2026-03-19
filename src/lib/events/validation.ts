/**
 * validation.ts — Lightweight runtime validation for NexusEvent
 *
 * Keeps the bundle small: no Zod dependency in the hot path.
 * Use for bus ingress validation only.
 */

import type { NexusEvent, NexusEventType, Organ } from '@/types/sacred-flow';

const VALID_TYPES: Set<string> = new Set<NexusEventType>([
  'tribunal.verdict',
  'tribunal.escalation',
  'atlas.marker',
  'atlas.layer-update',
  'index.entry',
  'news.broadcast',
  'streams.feed',
]);

const VALID_SOURCES: Set<string> = new Set<Organ>([
  'nexus',
  'tribunal',
  'atlas',
  'index',
  'news',
  'streams',
]);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a NexusEvent at bus ingress.
 * Returns {valid, errors} — never throws.
 */
export function validateEvent(event: unknown): ValidationResult {
  const errors: string[] = [];

  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['Event must be a non-null object'] };
  }

  const e = event as Record<string, unknown>;

  // Required string fields
  if (typeof e.id !== 'string' || e.id.length === 0) {
    errors.push('id: must be a non-empty string');
  }

  if (!VALID_TYPES.has(e.type as string)) {
    errors.push(`type: must be one of [${[...VALID_TYPES].join(', ')}]`);
  }

  if (typeof e.createdAt !== 'string' || Number.isNaN(Date.parse(e.createdAt as string))) {
    errors.push('createdAt: must be a valid ISO-8601 string');
  }

  if (!VALID_SOURCES.has(e.source as string)) {
    errors.push(`source: must be one of [${[...VALID_SOURCES].join(', ')}]`);
  }

  // Numeric fields
  if (typeof e.severity !== 'number' || e.severity < 0 || e.severity > 1) {
    errors.push('severity: must be a number between 0 and 1');
  }

  if (typeof e.confidence !== 'number' || e.confidence < 0 || e.confidence > 1) {
    errors.push('confidence: must be a number between 0 and 1');
  }

  if (typeof e.seed !== 'number') {
    errors.push('seed: must be a number');
  }

  if (typeof e.version !== 'number' || !Number.isInteger(e.version) || e.version < 1) {
    errors.push('version: must be a positive integer');
  }

  // Payload must exist
  if (e.payload === undefined || e.payload === null) {
    errors.push('payload: must not be null/undefined');
  }

  // Geo is optional but must be valid if present
  if (e.geo !== undefined && e.geo !== null) {
    const geo = e.geo as Record<string, unknown>;
    if (typeof geo.lat !== 'number' || geo.lat < -90 || geo.lat > 90) {
      errors.push('geo.lat: must be a number between -90 and 90');
    }
    if (typeof geo.lon !== 'number' || geo.lon < -180 || geo.lon > 180) {
      errors.push('geo.lon: must be a number between -180 and 180');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Type guard — validates and narrows to NexusEvent.
 */
export function isNexusEvent(event: unknown): event is NexusEvent {
  return validateEvent(event).valid;
}
