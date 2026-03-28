/**
 * ARTIFACT-MEMORY-001
 * Local artifact store — localStorage-backed with indexed access.
 * Production path: Supabase table `artifacts` (migration: 20260328_artifacts).
 * Falls back to localStorage when Supabase is unavailable.
 * Browser-safe: no node imports.
 */

import type {
  ArtifactMeta,
  ArtifactKind,
  ArtifactSource,
  ArtifactFilter,
  ArtifactSaveResult,
} from './types';

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
    // Keep only the most recent MAX_LOCAL_ARTIFACTS to avoid storage bloat
    const sorted = [...artifacts].sort(
      (a, b) => new Date(b.ts_updated).getTime() - new Date(a.ts_updated).getTime()
    );
    localStorage.setItem(STORE_KEY, JSON.stringify(sorted.slice(0, MAX_LOCAL_ARTIFACTS)));
  } catch {
    // storage unavailable — fail silently
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

export function saveArtifact(
  params: {
    session_id: string;
    kind: ArtifactKind;
    title: string;
    summary: string;
    content: string;
    tags?: string[];
    source?: ArtifactSource;
  }
): ArtifactSaveResult {
  const artifacts = loadAll();
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
  };

  saveAll([artifact, ...artifacts]);
  return { artifact, is_new: true };
}

export function updateArtifact(
  artifact_id: string,
  patch: Partial<Pick<ArtifactMeta, 'title' | 'summary' | 'content' | 'tags' | 'status'>>
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
