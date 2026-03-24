/**
 * ORGANISM_MINIMUM_MEMORY — Node-side File I/O
 * Used by proof-loop.mjs and any direct Node script.
 * NOT imported by browser code.
 *
 * Storage:
 *   ops/sessions/SES-{date}-{id}.json
 *   ops/sessions/SES-{date}-{id}.relay.json
 *   ops/runtime/provenance/PROV-{id}.json
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../');
const SESSIONS_DIR = join(ROOT, 'ops/sessions');
const PROVENANCE_DIR = join(ROOT, 'ops/runtime/provenance');

async function ensureDirs() {
  await mkdir(SESSIONS_DIR, { recursive: true });
  await mkdir(PROVENANCE_DIR, { recursive: true });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function readJSON(filePath) {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function writeJSON(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ── SESSION ──────────────────────────────────────────────────────────────────

export async function createSession(data) {
  await ensureDirs();
  const session_id = `SES-${todayISO()}-${randomUUID().slice(0, 8)}`;
  const session = {
    session_id,
    user_id:          data.user_id          ?? 'owner',
    subject:          data.subject          ?? '',
    intention:        data.intention        ?? '',
    profile_snapshot: data.profile_snapshot ?? {},
    trinity_face:     data.trinity_face     ?? 'heaven_lab',
    swarm_activated:  data.swarm_activated  ?? [],
    concepts_touched: data.concepts_touched ?? [],
    fruit:            data.fruit            ?? [],
    open_threads:     data.open_threads     ?? [],
    re_entry_point:   data.re_entry_point   ?? '',
    ts_start:         new Date().toISOString(),
    ts_end:           null,
  };
  await writeJSON(join(SESSIONS_DIR, `${session_id}.json`), session);
  return session;
}

export async function loadSession(session_id) {
  const file = join(SESSIONS_DIR, `${session_id}.json`);
  return readJSON(file);
}

export async function updateSession(session_id, patch) {
  const file = join(SESSIONS_DIR, `${session_id}.json`);
  const existing = await readJSON(file);
  const updated = { ...existing, ...patch };
  await writeJSON(file, updated);
  return updated;
}

// ── PROVENANCE ────────────────────────────────────────────────────────────────

export async function createProvenance(data) {
  await ensureDirs();
  const node_id = `PROV-${randomUUID().slice(0, 12)}`;
  const node = {
    node_id,
    session_id:           data.session_id           ?? '',
    origin_agent:         data.origin_agent         ?? '@claude',
    origin_constellation: data.origin_constellation ?? 'Eternal Nexus OS',
    timestamp:            new Date().toISOString(),
    phase:                data.phase                ?? 'V3',
    subject:              data.subject              ?? '',
    intention:            data.intention            ?? '',
    input_ref:            data.input_ref            ?? '',
    output_type:          data.output_type          ?? 'analysis',
    output_ref:           data.output_ref           ?? '',
    fruit_class:          data.fruit_class          ?? 'primary',
    next_consumer:        data.next_consumer        ?? 'owner',
    status:               data.status               ?? 'active',
  };
  await writeJSON(join(PROVENANCE_DIR, `${node_id}.json`), node);

  // Write relay coupling — always kept current alongside the session
  const sessionFile = join(SESSIONS_DIR, `${node.session_id}.json`);
  if (node.session_id && existsSync(sessionFile)) {
    const session = await readJSON(sessionFile);
    const coupling = {
      session_id: node.session_id,
      latest_provenance_node: node_id,
      re_entry_point: session.re_entry_point,
      ts_coupled: new Date().toISOString(),
    };
    await writeJSON(join(SESSIONS_DIR, `${node.session_id}.relay.json`), coupling);
  }

  return node;
}

export async function loadProvenance(node_id) {
  const file = join(PROVENANCE_DIR, `${node_id}.json`);
  return readJSON(file);
}

// ── REENTRY GRACE ─────────────────────────────────────────────────────────────

export function buildReentryGrace(session, provenance_node) {
  return {
    session_id:         session.session_id,
    stopped_at:         session.ts_end ?? new Date().toISOString(),
    latest_fruit:       session.fruit.at(-1) ?? '',
    latest_subject:     session.subject,
    open_threads:       session.open_threads,
    next_expected_step: session.re_entry_point,
    provenance_tail:    provenance_node.node_id,
  };
}

// ── RELAY COUPLING ────────────────────────────────────────────────────────────

export function buildRelayCoupling(session, provenance_node) {
  return {
    session_id:              session.session_id,
    latest_provenance_node:  provenance_node.node_id,
    re_entry_point:          session.re_entry_point,
    ts_coupled:              new Date().toISOString(),
  };
}
