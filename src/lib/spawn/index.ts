/**
 * SPAWN-ENTRY-001 — Public API barrel
 */
export type { EntryKind, EntryResolution } from './entry-pipeline';
export { resolveEntry, buildReEntryPoint } from './entry-pipeline';
