/**
 * SPAWN-ENTRY-001
 * Entry utility — buildReEntryPoint only.
 * resolveEntry() removed: zero call sites, replaced by SessionContext
 * is_resume detection at load time + returnTracker cross-visit signal.
 * Browser-safe: no node imports.
 */

/**
 * buildReEntryPoint — canonical re-entry string from current portal + context.
 * Format: {portal}:{context} e.g. "lab:artifact:ART-2026-abc123"
 * Nexus special case: "resume-swarm:{id}"
 */
export function buildReEntryPoint(portal: string, context: string): string {
  if (portal === 'nexus') return `resume-swarm:${context}`;
  return `${portal}:${context}`;
}
