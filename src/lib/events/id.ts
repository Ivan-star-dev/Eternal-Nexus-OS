/**
 * id.ts — Deterministic event ID generation
 *
 * IDs are content-addressable: same (type + source + createdAt + payloadHash)
 * always yields the same ID → natural idempotency key.
 */

/**
 * FNV-1a 32-bit hash (fast, deterministic, no crypto dependency).
 * Used for both ID generation and visual seed derivation.
 */
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

/**
 * Stable JSON serialization for payload hashing.
 * Sorts keys to ensure deterministic output.
 */
function stableStringify(obj: unknown): string {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';

  const sorted = Object.keys(obj as Record<string, unknown>).sort();
  return (
    '{' +
    sorted
      .map((k) => `${k}:${stableStringify((obj as Record<string, unknown>)[k])}`)
      .join(',') +
    '}'
  );
}

/**
 * Generate a deterministic event ID.
 *
 * Format: `nxe_{type}_{fnv1a(composite)}`
 *
 * The composite key includes type + source + timestamp + payload hash,
 * making each event naturally idempotent.
 */
export function makeEventId(
  type: string,
  source: string,
  createdAt: string,
  payload: unknown,
): string {
  const payloadHash = fnv1a32(stableStringify(payload));
  const composite = `${type}|${source}|${createdAt}|${payloadHash}`;
  const hash = fnv1a32(composite);
  return `nxe_${type}_${hash.toString(36)}`;
}

/**
 * Derive a deterministic visual seed from an event ID.
 * Used by renderers for consistent particle/color generation.
 */
export function seedFromId(eventId: string): number {
  return fnv1a32(eventId);
}
