/**
 * ORGANISM_MINIMUM_MEMORY — Browser Client
 * Thin fetch wrapper. No fs. No node imports.
 * Talks to the dev-server memory API exposed by vite-plugin-memory.ts.
 */

import type {
  SessionEntity,
  ProvenanceNode,
  ReentryGrace,
  RelayCoupling,
} from './types';

const BASE = '/api/memory';

export async function createSession(
  data: Omit<SessionEntity, 'session_id' | 'ts_start' | 'ts_end'>
): Promise<SessionEntity> {
  const res = await fetch(`${BASE}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`createSession: ${res.status} ${res.statusText}`);
  return res.json() as Promise<SessionEntity>;
}

export async function loadSession(session_id: string): Promise<SessionEntity> {
  const res = await fetch(`${BASE}/session/${encodeURIComponent(session_id)}`);
  if (!res.ok) throw new Error(`loadSession: ${res.status} ${res.statusText}`);
  return res.json() as Promise<SessionEntity>;
}

export async function updateSession(
  session_id: string,
  patch: Partial<Omit<SessionEntity, 'session_id' | 'ts_start'>>
): Promise<SessionEntity> {
  const res = await fetch(`${BASE}/session/${encodeURIComponent(session_id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`updateSession: ${res.status} ${res.statusText}`);
  return res.json() as Promise<SessionEntity>;
}

export async function closeSession(session_id: string): Promise<SessionEntity> {
  return updateSession(session_id, { ts_end: new Date().toISOString() });
}

export async function createProvenance(
  data: Omit<ProvenanceNode, 'node_id' | 'timestamp'>
): Promise<ProvenanceNode> {
  const res = await fetch(`${BASE}/provenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`createProvenance: ${res.status} ${res.statusText}`);
  return res.json() as Promise<ProvenanceNode>;
}

export async function getReentry(session_id: string): Promise<ReentryGrace> {
  const res = await fetch(`${BASE}/session/${encodeURIComponent(session_id)}/reentry`);
  if (!res.ok) throw new Error(`getReentry: ${res.status} ${res.statusText}`);
  return res.json() as Promise<ReentryGrace>;
}

export async function getRelayCoupling(session_id: string): Promise<RelayCoupling> {
  const res = await fetch(`${BASE}/relay/${encodeURIComponent(session_id)}`);
  if (!res.ok) throw new Error(`getRelayCoupling: ${res.status} ${res.statusText}`);
  return res.json() as Promise<RelayCoupling>;
}
