/**
 * ORGANISM_MINIMUM_MEMORY — Vite Dev Server Plugin
 * Node-side file I/O for the memory API.
 * Runs ONLY in the Vite dev server — never in browser builds.
 *
 * Routes exposed:
 *   POST   /api/memory/session            → create session
 *   GET    /api/memory/session/:id        → load session
 *   PATCH  /api/memory/session/:id        → update session
 *   POST   /api/memory/provenance         → create provenance node
 *   GET    /api/memory/session/:id/reentry → reentry grace
 *   GET    /api/memory/relay/:id          → relay coupling
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

const ROOT = process.cwd();
const SESSIONS_DIR = join(ROOT, 'ops/sessions');
const PROVENANCE_DIR = join(ROOT, 'ops/runtime/provenance');

async function ensureDirs(): Promise<void> {
  await mkdir(SESSIONS_DIR, { recursive: true });
  await mkdir(PROVENANCE_DIR, { recursive: true });
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

function respond(res: ServerResponse, status: number, data: unknown): void {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
}

async function readJSON<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

async function writeJSON(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function memoryApiPlugin(): Plugin {
  return {
    name: 'memory-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/api/memory/')) return next();

        await ensureDirs();
        const method = (req.method ?? 'GET').toUpperCase();

        try {
          // ── POST /api/memory/session ──────────────────────────────────
          if (method === 'POST' && url === '/api/memory/session') {
            const body = JSON.parse(await readBody(req)) as Record<string, unknown>;
            const session_id = `SES-${todayISO()}-${randomUUID().slice(0, 8)}`;
            const session = {
              session_id,
              user_id: (body.user_id as string | undefined) ?? 'owner',
              subject: (body.subject as string | undefined) ?? '',
              intention: (body.intention as string | undefined) ?? '',
              profile_snapshot: (body.profile_snapshot as Record<string, unknown> | undefined) ?? {},
              trinity_face: (body.trinity_face as string | undefined) ?? 'heaven_lab',
              swarm_activated: (body.swarm_activated as string[] | undefined) ?? [],
              concepts_touched: (body.concepts_touched as string[] | undefined) ?? [],
              fruit: (body.fruit as string[] | undefined) ?? [],
              open_threads: (body.open_threads as string[] | undefined) ?? [],
              re_entry_point: (body.re_entry_point as string | undefined) ?? '',
              ts_start: new Date().toISOString(),
              ts_end: null as string | null,
            };
            await writeJSON(join(SESSIONS_DIR, `${session_id}.json`), session);
            return respond(res, 201, session);
          }

          // ── /api/memory/session/:id (with optional suffix) ───────────
          const sessionBase = url.match(/^\/api\/memory\/session\/([^/]+)(\/.*)?$/);
          if (sessionBase) {
            const session_id = decodeURIComponent(sessionBase[1]);
            const suffix = sessionBase[2] ?? '';
            const sessionFile = join(SESSIONS_DIR, `${session_id}.json`);

            // GET /api/memory/session/:id
            if (method === 'GET' && suffix === '') {
              if (!existsSync(sessionFile)) return respond(res, 404, { error: 'Session not found' });
              return respond(res, 200, await readJSON(sessionFile));
            }

            // PATCH /api/memory/session/:id
            if (method === 'PATCH' && suffix === '') {
              if (!existsSync(sessionFile)) return respond(res, 404, { error: 'Session not found' });
              const existing = await readJSON<Record<string, unknown>>(sessionFile);
              const patch = JSON.parse(await readBody(req)) as Record<string, unknown>;
              const updated = { ...existing, ...patch };
              await writeJSON(sessionFile, updated);
              return respond(res, 200, updated);
            }

            // GET /api/memory/session/:id/reentry
            if (method === 'GET' && suffix === '/reentry') {
              if (!existsSync(sessionFile)) return respond(res, 404, { error: 'Session not found' });
              const session = await readJSON<{
                session_id: string;
                subject: string;
                ts_end: string | null;
                fruit: string[];
                open_threads: string[];
                re_entry_point: string;
              }>(sessionFile);

              const relayFile = join(SESSIONS_DIR, `${session_id}.relay.json`);
              let provenance_tail = '';
              if (existsSync(relayFile)) {
                const coupling = await readJSON<{ latest_provenance_node: string }>(relayFile);
                provenance_tail = coupling.latest_provenance_node;
              }

              return respond(res, 200, {
                session_id,
                stopped_at: session.ts_end ?? new Date().toISOString(),
                latest_fruit: session.fruit.at(-1) ?? '',
                latest_subject: session.subject,
                open_threads: session.open_threads,
                next_expected_step: session.re_entry_point,
                provenance_tail,
              });
            }

            return next();
          }

          // ── POST /api/memory/provenance ───────────────────────────────
          if (method === 'POST' && url === '/api/memory/provenance') {
            const body = JSON.parse(await readBody(req)) as Record<string, unknown>;
            const node_id = `PROV-${randomUUID().slice(0, 12)}`;
            const node = {
              node_id,
              session_id: (body.session_id as string | undefined) ?? '',
              origin_agent: (body.origin_agent as string | undefined) ?? '@claude',
              origin_constellation: (body.origin_constellation as string | undefined) ?? 'Eternal Nexus OS',
              timestamp: new Date().toISOString(),
              phase: (body.phase as string | undefined) ?? 'V3',
              subject: (body.subject as string | undefined) ?? '',
              intention: (body.intention as string | undefined) ?? '',
              input_ref: (body.input_ref as string | undefined) ?? '',
              output_type: (body.output_type as string | undefined) ?? 'analysis',
              output_ref: (body.output_ref as string | undefined) ?? '',
              fruit_class: (body.fruit_class as string | undefined) ?? 'primary',
              next_consumer: (body.next_consumer as string | undefined) ?? 'owner',
              status: (body.status as string | undefined) ?? 'active',
            };
            await writeJSON(join(PROVENANCE_DIR, `${node_id}.json`), node);

            // Write / update relay coupling alongside its session
            const linked_session_id = node.session_id;
            const sessionFile = join(SESSIONS_DIR, `${linked_session_id}.json`);
            if (linked_session_id && existsSync(sessionFile)) {
              const session = await readJSON<{ re_entry_point: string }>(sessionFile);
              const coupling = {
                session_id: linked_session_id,
                latest_provenance_node: node_id,
                re_entry_point: session.re_entry_point,
                ts_coupled: new Date().toISOString(),
              };
              await writeJSON(join(SESSIONS_DIR, `${linked_session_id}.relay.json`), coupling);
            }

            return respond(res, 201, node);
          }

          // ── GET /api/memory/relay/:id ─────────────────────────────────
          const relayMatch = url.match(/^\/api\/memory\/relay\/([^/]+)$/);
          if (method === 'GET' && relayMatch) {
            const session_id = decodeURIComponent(relayMatch[1]);
            const relayFile = join(SESSIONS_DIR, `${session_id}.relay.json`);
            if (!existsSync(relayFile)) return respond(res, 404, { error: 'Relay coupling not found' });
            return respond(res, 200, await readJSON(relayFile));
          }

          next();
        } catch (err) {
          respond(res, 500, { error: String(err) });
        }
      });
    },
  };
}
