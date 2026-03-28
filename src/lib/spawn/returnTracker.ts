/**
 * returnTracker.ts — Cross-visit return tracking for wedge gate proof.
 *
 * Measures the single metric that validates the wedge:
 * unprompted return in 48h without external trigger.
 *
 * Persists to localStorage. No backend. Pilot-grade.
 * Call recordVisit() once on /lab mount.
 * Read getReturnMetrics() for ControlTower or gate decisions.
 *
 * Canon: GOVERNANCE_OBSERVABILITY_MANIFEST.md · WG-03 (return rate)
 * @claude | 2026-03-28
 */

const STORE_KEY = 'nxos_return_log';

export interface ReturnLog {
  first_visit_ts: number;    // epoch ms — first ever visit to /lab
  last_visit_ts: number;     // epoch ms — most recent visit
  visit_count: number;       // total visits (includes first)
  return_count: number;      // visits after first (unprompted returns)
  last_gap_ms: number;       // ms between last two visits (0 if only one visit)
}

export interface ReturnMetrics extends ReturnLog {
  hours_since_first: number;
  hours_since_last: number;
  returned_within_48h: boolean;   // true if any return happened within 48h of a prior visit
  wedge_signal: 'none' | 'weak' | 'strong'; // none=0 returns, weak=1-2, strong=≥3
}

function load(): ReturnLog | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReturnLog;
  } catch {
    return null;
  }
}

function save(log: ReturnLog): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(log));
  } catch { /* storage unavailable — silent */ }
}

/**
 * Record a visit to /lab.
 * Call once on mount. Idempotent within the same browser session via
 * sessionStorage dedup — multiple renders don't inflate count.
 */
export function recordVisit(): void {
  const SESSION_DEDUP_KEY = 'nxos_visit_recorded';
  try {
    if (sessionStorage.getItem(SESSION_DEDUP_KEY)) return;
    sessionStorage.setItem(SESSION_DEDUP_KEY, '1');
  } catch { /* sessionStorage unavailable — proceed without dedup */ }

  const now = Date.now();
  const existing = load();

  if (!existing) {
    save({
      first_visit_ts: now,
      last_visit_ts: now,
      visit_count: 1,
      return_count: 0,
      last_gap_ms: 0,
    });
    return;
  }

  const gap = now - existing.last_visit_ts;
  save({
    ...existing,
    last_visit_ts: now,
    visit_count: existing.visit_count + 1,
    return_count: existing.return_count + 1,
    last_gap_ms: gap,
  });
}

/**
 * Read current return metrics. Safe to call at any time.
 * Returns null if no visit has been recorded.
 */
export function getReturnMetrics(): ReturnMetrics | null {
  const log = load();
  if (!log) return null;

  const now = Date.now();
  const MS_48H = 48 * 60 * 60 * 1000;

  return {
    ...log,
    hours_since_first: Math.floor((now - log.first_visit_ts) / 3600000),
    hours_since_last: Math.floor((now - log.last_visit_ts) / 3600000),
    returned_within_48h: log.return_count > 0 && log.last_gap_ms > 0 && log.last_gap_ms < MS_48H,
    wedge_signal:
      log.return_count === 0 ? 'none' :
      log.return_count < 3  ? 'weak' : 'strong',
  };
}
