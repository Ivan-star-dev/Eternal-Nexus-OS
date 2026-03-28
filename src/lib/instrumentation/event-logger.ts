/**
 * event-logger.ts — Lightweight pilot instrumentation.
 *
 * Taps into the FusionBus and writes a rolling event log to localStorage.
 * No backend required for pilot. Max 500 events (ring buffer, drops oldest).
 * Used to compute pilot proof metrics: return rate, artifact rate, session depth.
 *
 * SCALE LAW: This is pilot-grade instrumentation. Swap for server-side
 * analytics (PostHog / Mixpanel) only after pilot proves the wedge.
 *
 * Canon: SCALE_REAL_MANIFEST.md · @claude · 2026-03-28
 */

import { bus } from '@/lib/core/fusion-bus';
import type { FusionEventKind } from '@/lib/core/fusion-bus';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InstrumentationEvent {
  kind: FusionEventKind;
  session_id: string;
  ts: string;         // ISO 8601
  payload_summary: string; // stringified key fields — no PII
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STORE_KEY = 'nxos_events';
const MAX_EVENTS = 500;

// Events that carry meaningful pilot signal
const TRACKED_EVENTS: Set<FusionEventKind> = new Set([
  'session:booted',
  'session:resumed',
  'session:expired',
  'artifact:created',
  'artifact:updated',
  'portal:entered',
  'evolution:leveled-up',
  'governance:violation',
  'organism:ready',
  'organism:degraded',
]);

// ─── Storage helpers ──────────────────────────────────────────────────────────

function readLog(): InstrumentationEvent[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InstrumentationEvent[];
  } catch {
    return [];
  }
}

function writeLog(events: InstrumentationEvent[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch { /* quota exceeded — silent */ }
}

function safeStringify(payload: unknown): string {
  if (!payload) return '';
  try {
    const p = payload as Record<string, unknown>;
    // Keep only non-PII keys
    const safe: Record<string, unknown> = {};
    if (p.portal) safe.portal = p.portal;
    if (p.kind) safe.kind = p.kind;
    if (p.level !== undefined) safe.level = p.level;
    if (p.law) safe.law = p.law;
    if (p.tier) safe.tier = p.tier;
    if (p.session_id) safe.sid = String(p.session_id).slice(-8); // last 8 chars only
    return JSON.stringify(safe);
  } catch {
    return '';
  }
}

// ─── Logger ───────────────────────────────────────────────────────────────────

let unsubscribe: (() => void) | null = null;

/**
 * startInstrumentation — taps into FusionBus and logs tracked events.
 * Called from NexusRuntime.boot() — safe to call multiple times (idempotent).
 */
export function startInstrumentation(session_id: string): void {
  if (unsubscribe) return; // already running

  unsubscribe = bus.onAll((event) => {
    if (!TRACKED_EVENTS.has(event.kind)) return;

    const entry: InstrumentationEvent = {
      kind: event.kind,
      session_id,
      ts: event.ts,
      payload_summary: safeStringify(event.payload),
    };

    const log = readLog();
    log.push(entry);
    writeLog(log);
  });
}

export function stopInstrumentation(): void {
  unsubscribe?.();
  unsubscribe = null;
}

// ─── Pilot Metrics ────────────────────────────────────────────────────────────

export interface PilotMetrics {
  total_sessions: number;
  total_returns: number;           // sessions where session:resumed fired
  return_rate: number;             // total_returns / total_sessions (0–1)
  total_artifacts_created: number;
  artifact_rate_per_session: number;
  session_2_artifact: boolean;     // did user create artifact in 2nd+ session?
  unique_portals_visited: string[];
  governance_violations: number;
  organism_degraded_count: number;
  log_size: number;
}

export function getPilotMetrics(): PilotMetrics {
  const log = readLog();

  const sessions = new Set(log.filter(e => e.kind === 'session:booted').map(e => e.session_id));
  const returns = log.filter(e => e.kind === 'session:resumed');
  const artifacts = log.filter(e => e.kind === 'artifact:created');
  const portals = [...new Set(
    log
      .filter(e => e.kind === 'portal:entered')
      .map(e => {
        try { return JSON.parse(e.payload_summary).portal as string; } catch { return ''; }
      })
      .filter(Boolean)
  )];

  const total_sessions = sessions.size;
  const total_returns = returns.length;

  // session_2_artifact: artifact created in a session that is NOT the first session
  const firstSessionId = log.find(e => e.kind === 'session:booted')?.session_id ?? '';
  const session_2_artifact = artifacts.some(e => e.session_id !== firstSessionId);

  return {
    total_sessions,
    total_returns,
    return_rate: total_sessions > 0 ? total_returns / total_sessions : 0,
    total_artifacts_created: artifacts.length,
    artifact_rate_per_session: total_sessions > 0 ? artifacts.length / total_sessions : 0,
    session_2_artifact,
    unique_portals_visited: portals,
    governance_violations: log.filter(e => e.kind === 'governance:violation').length,
    organism_degraded_count: log.filter(e => e.kind === 'organism:degraded').length,
    log_size: log.length,
  };
}

export function clearInstrumentationLog(): void {
  try { localStorage.removeItem(STORE_KEY); } catch { /* silent */ }
}

export { readLog as getRawLog };
