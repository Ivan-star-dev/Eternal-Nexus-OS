/**
 * scoring.ts — System Observability Scoring Engine.
 *
 * Computes 8 system health scores from live organism state + pilot metrics.
 * All scores: 0.0–1.0. Higher = healthier (except friction: lower = better).
 *
 * Scores are purely read-only observations — they never mutate state.
 * Used by: ControlTower (owner), governance decisions, pilot proof metrics.
 *
 * SCORE DEFINITIONS:
 *   continuity  — does the world remember the user correctly?
 *   calm        — is the experience non-intrusive and spatially quiet?
 *   identity    — is the portal's atmospheric DNA intact?
 *   adaptation  — are route intelligence suggestions actually useful?
 *   return      — does the resume flow feel legitimate and alive?
 *   artifact    — are artifacts being used, not just accumulated?
 *   clarity     — is the portal's purpose and spatial role clear?
 *   friction    — how much obstruction exists in the experience? (inverse)
 *
 * Canon: GOVERNANCE_OBSERVABILITY_MANIFEST.md · @claude · 2026-03-28
 */

import type { OrganismState } from '@/lib/core/organism-state';
import type { PilotMetrics } from '@/lib/instrumentation/event-logger';
import { listArtifacts } from '@/lib/artifacts/store';

// ─── Output ───────────────────────────────────────────────────────────────────

export interface SystemScores {
  continuity: Score;
  calm: Score;
  identity: Score;
  adaptation: Score;
  return_quality: Score;
  artifact: Score;
  clarity: Score;
  friction: Score;  // inverse — 0 is perfect, 1 is broken
}

export interface Score {
  value: number;         // 0.0–1.0
  grade: ScoreGrade;     // derived from value
  signals: string[];     // what contributed positively
  warnings: string[];    // what pulled the score down
}

export type ScoreGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

// ─── Grade helper ─────────────────────────────────────────────────────────────

function grade(value: number, inverse = false): ScoreGrade {
  const v = inverse ? 1 - value : value;
  if (v >= 0.90) return 'S';
  if (v >= 0.75) return 'A';
  if (v >= 0.60) return 'B';
  if (v >= 0.40) return 'C';
  if (v >= 0.20) return 'D';
  return 'F';
}

function score(
  value: number,
  signals: string[],
  warnings: string[],
  inverse = false
): Score {
  return {
    value: Math.min(1, Math.max(0, value)),
    grade: grade(value, inverse),
    signals,
    warnings,
  };
}

// ─── 1. CONTINUITY SCORE ──────────────────────────────────────────────────────
// Does the world remember the user correctly?

export function scoreContinity(state: OrganismState): Score {
  const m = state.memory;
  const signals: string[] = [];
  const warnings: string[] = [];
  let v = 0;

  if (m.re_entry_point) { v += 0.30; signals.push('re_entry_point present'); }
  else warnings.push('no re_entry_point — cold start on return');

  if (m.is_resume) { v += 0.20; signals.push('is_resume true'); }
  else warnings.push('not a resume session');

  if (m.artifact_count >= 1) {
    const bonus = Math.min(0.20, m.artifact_count * 0.05);
    v += bonus;
    signals.push(`${m.artifact_count} artifact(s)`);
  } else {
    warnings.push('no artifacts — nothing to resume to');
  }

  if (m.last_active) {
    const age = Date.now() - new Date(m.last_active).getTime();
    if (age < 24 * 3600000) { v += 0.10; signals.push('last active < 24h'); }
    else if (age > 7 * 24 * 3600000) warnings.push('last active > 7 days');
  }

  if (m.open_panels?.length > 0) { v += 0.10; signals.push('panels in memory'); }
  if (state.memory.continuity_score > 0) signals.push(`score: ${(state.memory.continuity_score * 100).toFixed(0)}%`);

  return score(v, signals, warnings);
}

// ─── 2. CALM SCORE ────────────────────────────────────────────────────────────
// Is the experience non-intrusive and spatially quiet?

export function scoreCalm(state: OrganismState, metrics: PilotMetrics): Score {
  const signals: string[] = [];
  const warnings: string[] = [];
  let v = 1.0; // starts perfect, deduct for noise

  // Governance violations reduce calm
  const violations = state.system.violation_count;
  if (violations === 0) { signals.push('no governance violations'); }
  else {
    const penalty = Math.min(0.40, violations * 0.10);
    v -= penalty;
    warnings.push(`${violations} governance violation(s)`);
  }

  // Organism degraded reduces calm significantly
  if (metrics.organism_degraded_count > 0) {
    v -= 0.30;
    warnings.push(`organism degraded ${metrics.organism_degraded_count}x`);
  } else {
    signals.push('organism stable');
  }

  // Transition in progress is transient noise
  if (state.environment.transition_in_progress) {
    v -= 0.05;
    warnings.push('transition in progress');
  }

  // High suggestion confidence = calm guidance (shows only when certain)
  const confidence = state.intelligence.suggestion_confidence;
  if (confidence >= 0.65 || !state.intelligence.route_suggestion) {
    signals.push('guidance threshold respected (≥0.65 or silent)');
  } else {
    v -= 0.10;
    warnings.push(`suggestion shown at low confidence (${(confidence * 100).toFixed(0)}%)`);
  }

  // Atmosphere dirty = visual noise
  if (state.environment.atmosphere_dirty) {
    v -= 0.05;
    warnings.push('atmosphere cache stale');
  } else {
    signals.push('atmosphere clean');
  }

  return score(v, signals, warnings);
}

// ─── 3. IDENTITY INTEGRITY SCORE ─────────────────────────────────────────────
// Is the portal's atmospheric DNA intact and distinct?

export function scoreIdentity(state: OrganismState): Score {
  const signals: string[] = [];
  const warnings: string[] = [];
  let v = 1.0;

  if (!state.environment.current_portal) {
    v -= 0.50;
    warnings.push('no active portal — atmosphere undefined');
  } else {
    signals.push(`portal: ${state.environment.current_portal}`);
  }

  if (state.environment.atmosphere_dirty) {
    v -= 0.20;
    warnings.push('atmosphere not yet rebuilt after portal change');
  } else {
    signals.push('atmosphere fresh');
  }

  // Fidelity light with pulse active = identity leak
  if (state.environment.fidelity_tier === 'light') {
    signals.push('light tier — atmospheric overlays correctly suppressed');
  }

  if (state.environment.previous_portal === state.environment.current_portal) {
    signals.push('intra-portal navigation — soft transition correct');
  }

  const uniquePortals = state.intelligence.dominant_portal ? 1 : 0;
  if (uniquePortals > 0) signals.push(`dominant portal: ${state.intelligence.dominant_portal}`);

  return score(v, signals, warnings);
}

// ─── 4. ADAPTATION QUALITY SCORE ─────────────────────────────────────────────
// Are route intelligence suggestions actually useful?

export function scoreAdaptation(state: OrganismState, metrics: PilotMetrics): Score {
  const signals: string[] = [];
  const warnings: string[] = [];
  let v = 0.5; // neutral baseline

  const confidence = state.intelligence.suggestion_confidence;
  const suggestion = state.intelligence.route_suggestion;
  const maturity = state.intelligence.maturity_level;

  if (suggestion && confidence >= 0.65) {
    v += 0.30;
    signals.push(`suggestion present (confidence ${(confidence * 100).toFixed(0)}%)`);
  } else if (!suggestion && maturity >= 2) {
    v -= 0.20;
    warnings.push('mature user but no suggestion — route engine underutilized');
  }

  if (confidence > 0.80) { v += 0.10; signals.push('high-confidence suggestion'); }
  if (confidence < 0.50 && suggestion) { v -= 0.20; warnings.push('suggestion below useful threshold'); }

  // Return rate above threshold = suggestions are working
  if (metrics.return_rate >= 0.60) {
    v += 0.20;
    signals.push(`return rate ${(metrics.return_rate * 100).toFixed(0)}% — adaptation contributing`);
  } else if (metrics.total_sessions > 3 && metrics.return_rate < 0.30) {
    v -= 0.20;
    warnings.push('low return rate — suggestions may not be useful');
  }

  if (maturity >= 2) { signals.push(`maturity level ${maturity} — behavioral profile rich`); }
  else if (maturity === 0) { warnings.push('unknown behavioral type — insufficient signal'); }

  return score(v, signals, warnings);
}

// ─── 5. RETURN QUALITY SCORE ──────────────────────────────────────────────────
// Does the resume flow feel legitimate and alive?

export function scoreReturn(state: OrganismState, metrics: PilotMetrics): Score {
  const signals: string[] = [];
  const warnings: string[] = [];
  let v = 0;

  if (state.memory.is_resume) {
    v += 0.30;
    signals.push('resume session active');
  } else {
    warnings.push('cold start — no resume signals');
  }

  if (state.memory.re_entry_point?.startsWith('lab:')) {
    v += 0.20;
    signals.push('re_entry_point targets Lab portal');
  } else if (state.memory.re_entry_point?.startsWith('resume-swarm:')) {
    v += 0.20;
    signals.push('re_entry_point targets Nexus swarm');
  }

  if (state.memory.artifact_count >= 1 && state.memory.is_resume) {
    v += 0.20;
    signals.push('artifacts available on resume');
  }

  if (metrics.total_returns > 0) {
    const returnBonus = Math.min(0.30, metrics.return_rate * 0.30);
    v += returnBonus;
    signals.push(`${metrics.total_returns} return(s) recorded`);
  } else if (metrics.total_sessions > 1) {
    warnings.push('sessions exist but no returns — continuity not landing');
  }

  if (metrics.session_2_artifact) {
    v += 0.10;
    signals.push('user created artifact in 2nd+ session');
  }

  return score(v, signals, warnings);
}

// ─── 6. ARTIFACT USEFULNESS SCORE ────────────────────────────────────────────
// Are artifacts being used, not just accumulated?

export function scoreArtifact(state: OrganismState): Score {
  const signals: string[] = [];
  const warnings: string[] = [];

  const all = listArtifacts();
  const total = all.length;

  if (total === 0) {
    return score(0, [], ['no artifacts exist'], false);
  }

  const now = Date.now();
  const RECENT_MS = 7 * 24 * 3600000;
  const ACTIVE_MS = 30 * 24 * 3600000;

  const recentlyTouched = all.filter(a => {
    const ts = new Date(a.ts_updated ?? a.ts_created).getTime();
    return now - ts < RECENT_MS;
  });

  const active = all.filter(a => a.status === 'active');
  const sealed = all.filter(a => a.status === 'sealed');
  const archived = all.filter(a => a.status === 'archived');
  const stale = all.filter(a => {
    const ts = new Date(a.ts_updated ?? a.ts_created).getTime();
    return now - ts > ACTIVE_MS && a.status === 'active';
  });

  let v = 0;

  const recentRatio = recentlyTouched.length / total;
  v += recentRatio * 0.40;
  if (recentRatio >= 0.5) signals.push(`${recentlyTouched.length}/${total} artifacts active recently`);
  else warnings.push(`only ${recentlyTouched.length}/${total} artifacts touched in 7 days`);

  const sealedRatio = total > 0 ? sealed.length / total : 0;
  v += sealedRatio * 0.20;
  if (sealed.length > 0) signals.push(`${sealed.length} artifact(s) sealed (completed work)`);

  if (stale.length > 0) {
    const stalePenalty = Math.min(0.20, stale.length * 0.05);
    v -= stalePenalty;
    warnings.push(`${stale.length} stale artifact(s) > 30 days untouched`);
  }

  if (archived.length > 0) signals.push(`${archived.length} archived (space maintained)`);
  if (total > 0 && total <= 200) signals.push(`${total}/200 local capacity`);
  if (total >= 190) warnings.push('approaching local capacity (200 limit)');

  // Active artifact in re_entry_point = artifact being used right now
  if (state.memory.re_entry_point?.includes('ART-')) {
    v += 0.20;
    signals.push('artifact active in re_entry_point');
  }

  return score(v, signals, warnings);
}

// ─── 7. PORTAL CLARITY SCORE ─────────────────────────────────────────────────
// Is the portal's purpose and spatial role clear?

export function scoreClarity(state: OrganismState, metrics: PilotMetrics): Score {
  const signals: string[] = [];
  const warnings: string[] = [];
  let v = 0.5; // neutral baseline

  const portal = state.environment.current_portal;
  if (!portal) {
    return score(0.20, [], ['no active portal'], false);
  }

  // Atmosphere clean = portal identity communicated
  if (!state.environment.atmosphere_dirty) {
    v += 0.20;
    signals.push('atmosphere clean — portal DNA rendered');
  }

  // User has visited multiple portals = they understand the space
  const visited = metrics.unique_portals_visited.length;
  if (visited >= 3) {
    v += 0.20;
    signals.push(`${visited} portals visited — spatial map formed`);
  } else if (visited === 1) {
    warnings.push('only 1 portal visited — space may feel narrow');
  }

  // Fidelity at balanced or above = full atmosphere visible
  const tierScore = { ultra: 0.20, high: 0.15, balanced: 0.10, light: 0 };
  v += tierScore[state.environment.fidelity_tier] ?? 0;
  if (state.environment.fidelity_tier !== 'light') {
    signals.push(`fidelity ${state.environment.fidelity_tier} — atmospheric identity fully expressed`);
  } else {
    warnings.push('light tier — atmospheric overlays suppressed, identity less distinct');
  }

  // No governance violations = portal routing correct
  if (state.system.violation_count === 0) {
    v += 0.10;
    signals.push('no portal routing violations');
  }

  return score(v, signals, warnings);
}

// ─── 8. FRICTION SCORE ───────────────────────────────────────────────────────
// How much obstruction exists? (inverse: 0 = perfect, 1 = broken)

export function scoreFriction(state: OrganismState, metrics: PilotMetrics): Score {
  const signals: string[] = [];
  const warnings: string[] = [];
  let v = 0; // starts perfect, grows with friction

  const violations = state.system.violation_count;
  if (violations > 0) {
    v += Math.min(0.30, violations * 0.05);
    warnings.push(`${violations} governance violation(s)`);
  } else {
    signals.push('no governance friction');
  }

  if (metrics.organism_degraded_count > 0) {
    v += 0.30;
    warnings.push(`organism degraded ${metrics.organism_degraded_count}x`);
  } else {
    signals.push('organism never degraded');
  }

  if (state.system.error_count > 0) {
    v += Math.min(0.20, state.system.error_count * 0.05);
    warnings.push(`${state.system.error_count} error(s) in system`);
  } else {
    signals.push('zero errors recorded');
  }

  // Degraded subsystems
  const degraded = Object.entries(state.system.subsystem_health)
    .filter(([, h]) => h === 'degraded')
    .map(([name]) => name);

  if (degraded.length > 0) {
    v += degraded.length * 0.10;
    warnings.push(`degraded subsystems: ${degraded.join(', ')}`);
  } else {
    signals.push('all subsystems healthy');
  }

  return score(v, signals, warnings, true); // inverse grade
}

// ─── Composite Runner ─────────────────────────────────────────────────────────

export function computeSystemScores(
  state: OrganismState,
  metrics: PilotMetrics
): SystemScores {
  return {
    continuity: scoreContinity(state),
    calm: scoreCalm(state, metrics),
    identity: scoreIdentity(state),
    adaptation: scoreAdaptation(state, metrics),
    return_quality: scoreReturn(state, metrics),
    artifact: scoreArtifact(state),
    clarity: scoreClarity(state, metrics),
    friction: scoreFriction(state, metrics),
  };
}

// ─── System Health Summary ────────────────────────────────────────────────────

export interface SystemHealthSummary {
  overall_grade: ScoreGrade;
  pilot_ready: boolean;
  blocking_issues: string[];
  scores: SystemScores;
}

export function getSystemHealthSummary(
  state: OrganismState,
  metrics: PilotMetrics
): SystemHealthSummary {
  const scores = computeSystemScores(state, metrics);

  // Blocking issues = any score below 0.40 (grade D or F)
  const blocking_issues: string[] = [];
  if (scores.continuity.value < 0.40) blocking_issues.push('continuity critical — user will not feel remembered');
  if (scores.friction.value > 0.60) blocking_issues.push('friction critical — too many system errors');
  if (scores.identity.value < 0.50) blocking_issues.push('identity broken — portal atmosphere not rendering');
  if (scores.return_quality.value < 0.30 && metrics.total_sessions > 2) {
    blocking_issues.push('return quality poor — resume flow not landing');
  }

  // Overall grade: average of all 8 scores (friction inverted)
  const values = [
    scores.continuity.value,
    scores.calm.value,
    scores.identity.value,
    scores.adaptation.value,
    scores.return_quality.value,
    scores.artifact.value,
    scores.clarity.value,
    1 - scores.friction.value, // invert friction
  ];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  // Pilot ready: no blocking issues + friction < 0.40
  const pilot_ready = blocking_issues.length === 0 && scores.friction.value < 0.40;

  return {
    overall_grade: grade(avg),
    pilot_ready,
    blocking_issues,
    scores,
  };
}
