/**
 * ARTIFACT-MEMORY-001
 * Artifact store — dual-write: localStorage (instant) + Supabase (durable).
 * Falls back to localStorage-only when Supabase is unavailable or user is anon.
 * P0-2: memory durability — local wipe does not kill the line.
 * P0-3: governance — guardArtifactCount enforced on every save.
 * Browser-safe: no node imports.
 */

import type {
  ArtifactMeta,
  ArtifactKind,
  ArtifactSource,
  ArtifactFilter,
  ArtifactSaveResult,
} from './types';
import { guardArtifactCount } from '@/lib/governance/runtime-guard';
import { supabase } from '@/integrations/supabase/client';

const STORE_KEY = 'nxos_artifacts';
const MAX_LOCAL_ARTIFACTS = 200;

function generateArtifactId(): string {
  const date = new Date().toISOString().slice(0, 10);
  const uid = Math.random().toString(36).slice(2, 10);
  return `ART-${date}-${uid}`;
}

function loadAll(): ArtifactMeta[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ArtifactMeta[];
  } catch {
    return [];
  }
}

function saveAll(artifacts: ArtifactMeta[]): void {
  try {
    const sorted = [...artifacts].sort(
      (a, b) => new Date(b.ts_updated).getTime() - new Date(a.ts_updated).getTime()
    );
    localStorage.setItem(STORE_KEY, JSON.stringify(sorted.slice(0, MAX_LOCAL_ARTIFACTS)));
  } catch {
    // storage unavailable — fail silently
  }
}

// Upsert a single artifact to Supabase. Fire-and-forget — local write never waits.
async function syncToSupabase(artifact: ArtifactMeta, userId: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('artifacts').upsert({
      artifact_id: artifact.artifact_id,
      user_id: userId,
      session_id: artifact.session_id,
      kind: artifact.kind,
      title: artifact.title,
      summary: artifact.summary,
      content: artifact.content,
      tags: artifact.tags,
      source: artifact.source,
      status: artifact.status,
      version: artifact.version,
      ts_created: artifact.ts_created,
      ts_updated: artifact.ts_updated,
      ts_last_accessed: artifact.ts_last_accessed,
      ...(artifact.validation_status !== undefined
        ? { validation_status: artifact.validation_status }
        : {}),
      ...(artifact.related_artifact_ids !== undefined
        ? { related_artifact_ids: artifact.related_artifact_ids }
        : {}),
    }, { onConflict: 'artifact_id' });
  } catch {
    // sync failure is non-fatal — localStorage is the immediate source of truth
  }
}

// Hydrate localStorage from Supabase on session restore (call once on boot).
export async function hydrateFromSupabase(userId: string): Promise<boolean> {
  if (!supabase || !userId) return false;
  try {
    const { data, error } = await supabase
      .from('artifacts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('ts_last_accessed', { ascending: false })
      .limit(MAX_LOCAL_ARTIFACTS);
    if (error || !data) return false;
    // Merge: remote wins for same artifact_id (remote is durable source of truth)
    const local = loadAll();
    const remoteIds = new Set(data.map((a: ArtifactMeta) => a.artifact_id));
    const localOnly = local.filter(a => !remoteIds.has(a.artifact_id));
    saveAll([...(data as ArtifactMeta[]), ...localOnly]);
    return true;
  } catch {
    return false;
  }
}

function matchesFilter(artifact: ArtifactMeta, filter: ArtifactFilter): boolean {
  if (filter.kind && artifact.kind !== filter.kind) return false;
  if (filter.status && artifact.status !== filter.status) return false;
  if (filter.source && artifact.source !== filter.source) return false;
  if (filter.session_id && artifact.session_id !== filter.session_id) return false;
  if (filter.tags && filter.tags.length > 0) {
    const hasTag = filter.tags.some(t => artifact.tags.includes(t));
    if (!hasTag) return false;
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const hit =
      artifact.title.toLowerCase().includes(q) ||
      artifact.summary.toLowerCase().includes(q) ||
      artifact.content.toLowerCase().includes(q);
    if (!hit) return false;
  }
  return true;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface SaveArtifactOptions {
  session_id: string;
  kind: ArtifactKind;
  title: string;
  summary: string;
  content: string;
  tags?: string[];
  source?: ArtifactSource;
  userId?: string; // if provided, dual-write to Supabase
  validation_status?: ArtifactMeta['validation_status'];
  related_artifact_ids?: string[];
}

export function saveArtifact(params: SaveArtifactOptions): ArtifactSaveResult {
  const artifacts = loadAll();

  // P0-3: governance gate — enforce artifact cap before writing
  const guard = guardArtifactCount(artifacts.filter(a => a.status === 'active').length);
  if (!guard.allowed) {
    // Return the violation as a thrown error with law context so UI can surface it
    const violation = guard.violations[0];
    throw Object.assign(new Error(violation.message), { law: violation.law, severity: violation.severity });
  }

  const now = new Date().toISOString();
  const artifact: ArtifactMeta = {
    artifact_id: generateArtifactId(),
    session_id: params.session_id,
    kind: params.kind,
    title: params.title,
    summary: params.summary,
    content: params.content,
    tags: params.tags ?? [],
    source: params.source ?? 'manual',
    status: 'active',
    ts_created: now,
    ts_updated: now,
    ts_last_accessed: now,
    version: 1,
    ...(params.validation_status !== undefined
      ? { validation_status: params.validation_status }
      : {}),
    ...(params.related_artifact_ids !== undefined
      ? { related_artifact_ids: params.related_artifact_ids }
      : {}),
  };

  // Local write is synchronous and immediate
  saveAll([artifact, ...artifacts]);

  // P0-2: Supabase dual-write is fire-and-forget — never blocks local write
  if (params.userId && supabase) {
    syncToSupabase(artifact, params.userId);
  }

  return { artifact, is_new: true };
}

export function updateArtifact(
  artifact_id: string,
  patch: Partial<Pick<ArtifactMeta, 'title' | 'summary' | 'content' | 'tags' | 'status' | 'ts_last_accessed' | 'validation_status' | 'related_artifact_ids'>>,
  userId?: string
): ArtifactMeta | null {
  const artifacts = loadAll();
  const idx = artifacts.findIndex(a => a.artifact_id === artifact_id);
  if (idx === -1) return null;

  const updated: ArtifactMeta = {
    ...artifacts[idx],
    ...patch,
    ts_updated: new Date().toISOString(),
    version: artifacts[idx].version + 1,
  };

  artifacts[idx] = updated;
  saveAll(artifacts);

  if (userId && supabase) {
    syncToSupabase(updated, userId);
  }

  return updated;
}

export function getArtifact(artifact_id: string): ArtifactMeta | null {
  const artifacts = loadAll();
  const found = artifacts.find(a => a.artifact_id === artifact_id);
  if (!found) return null;

  // Touch last_accessed
  const touched: ArtifactMeta = { ...found, ts_last_accessed: new Date().toISOString() };
  const idx = artifacts.findIndex(a => a.artifact_id === artifact_id);
  artifacts[idx] = touched;
  saveAll(artifacts);
  return touched;
}

export function listArtifacts(filter: ArtifactFilter = {}): ArtifactMeta[] {
  return loadAll().filter(a => matchesFilter(a, filter));
}

export function archiveArtifact(artifact_id: string): boolean {
  const result = updateArtifact(artifact_id, { status: 'archived' });
  return result !== null;
}

export function deleteArtifact(artifact_id: string): boolean {
  const artifacts = loadAll();
  const filtered = artifacts.filter(a => a.artifact_id !== artifact_id);
  if (filtered.length === artifacts.length) return false;
  saveAll(filtered);
  return true;
}

export function getRecentArtifacts(limit = 10): ArtifactMeta[] {
  return loadAll()
    .filter(a => a.status === 'active')
    .sort((a, b) => new Date(b.ts_last_accessed).getTime() - new Date(a.ts_last_accessed).getTime())
    .slice(0, limit);
}

export function getArtifactsBySession(session_id: string): ArtifactMeta[] {
  return listArtifacts({ session_id });
}
