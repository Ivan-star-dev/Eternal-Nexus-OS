/**
 * ROUTE-INTELLIGENCE-001
 * Next-step suggestion engine — v1.
 * Suggests next actions based on:
 *   1. Recent artifact history (what kind, what source)
 *   2. Current session face + regime
 *   3. Re-entry context (resuming vs fresh)
 *   4. Time-of-day and recency signals
 *
 * NOT based on maturity level alone — real behavioral patterns.
 * Browser-safe: no node imports.
 */

import type { SessionState } from '@/contexts/SessionContext';
import type { ArtifactMeta, ArtifactKind } from '@/lib/artifacts/types';

export type RouteActionKind =
  | 'continue-artifact'   // Resume work on a specific artifact
  | 'create-artifact'     // Start a new artifact of a specific kind
  | 'visit-portal'        // Navigate to a portal
  | 'start-session'       // Begin a fresh session with a suggested subject
  | 'archive-stale';      // Archive old artifacts to reduce noise

export interface RouteAction {
  kind: RouteActionKind;
  label: string;
  description: string;
  confidence: number;        // 0.0 → 1.0
  payload: {
    artifactId?: string;
    artifactKind?: ArtifactKind;
    portal?: string;
    subject?: string;
  };
}

interface RouteIntelligenceInput {
  session: SessionState | null;
  recentArtifacts: ArtifactMeta[];
  currentPath: string;
}

interface RouteIntelligenceResult {
  primary: RouteAction | null;
  alternatives: RouteAction[];
  reasoning: string;
}

// ─── Pattern Analysis ─────────────────────────────────────────────────────────

function mostUsedKind(artifacts: ArtifactMeta[]): ArtifactKind | null {
  if (artifacts.length === 0) return null;
  const counts: Partial<Record<ArtifactKind, number>> = {};
  for (const a of artifacts) {
    counts[a.kind] = (counts[a.kind] ?? 0) + 1;
  }
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as ArtifactKind) ?? null;
}

function stalestArtifact(artifacts: ArtifactMeta[]): ArtifactMeta | null {
  if (artifacts.length < 5) return null;
  const stale = [...artifacts].sort(
    (a, b) => new Date(a.ts_last_accessed).getTime() - new Date(b.ts_last_accessed).getTime()
  );
  const oldest = stale[0];
  const daysSince = (Date.now() - new Date(oldest.ts_last_accessed).getTime()) / (1000 * 86400);
  return daysSince > 14 ? oldest : null;
}

function mostRecentActive(artifacts: ArtifactMeta[]): ArtifactMeta | null {
  const active = artifacts.filter(a => a.status === 'active');
  if (active.length === 0) return null;
  return active.sort(
    (a, b) => new Date(b.ts_last_accessed).getTime() - new Date(a.ts_last_accessed).getTime()
  )[0];
}

function portalFromPath(path: string): string {
  const map: Record<string, string> = {
    '/': 'home', '/nexus': 'nexus', '/lab': 'lab',
    '/atlas': 'atlas', '/founder': 'founder', '/school': 'school',
    '/workshop': 'workshop', '/research': 'research',
  };
  return map[path.split('?')[0]] ?? 'home';
}

function dominantSourcePortal(artifacts: ArtifactMeta[]): string | null {
  if (artifacts.length === 0) return null;
  const counts: Record<string, number> = {};
  for (const a of artifacts) {
    counts[a.source] = (counts[a.source] ?? 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

// ─── Action Builders ──────────────────────────────────────────────────────────

function buildContinueAction(artifact: ArtifactMeta): RouteAction {
  const ageMs = Date.now() - new Date(artifact.ts_last_accessed).getTime();
  const ageH = ageMs / 3600000;
  const recencyBonus = ageH < 1 ? 0.15 : ageH < 24 ? 0.05 : 0;

  return {
    kind: 'continue-artifact',
    label: `Continue: ${artifact.title}`,
    description: `Pick up where you left off on this ${artifact.kind}.`,
    confidence: Math.min(0.95, 0.7 + recencyBonus),
    payload: { artifactId: artifact.artifact_id, artifactKind: artifact.kind },
  };
}

function buildCreateAction(kind: ArtifactKind, confidence: number): RouteAction {
  const labels: Record<ArtifactKind, string> = {
    research: 'Start a Research thread',
    note: 'Capture a Note',
    plan: 'Draft a Plan',
    simulation: 'Run a Simulation',
    draft: 'Open a Draft',
    code: 'Start a Code artifact',
    synthesis: 'Write a Synthesis',
    decision: 'Record a Decision',
  };
  return {
    kind: 'create-artifact',
    label: labels[kind],
    description: `You frequently create ${kind} artifacts. Start another?`,
    confidence,
    payload: { artifactKind: kind },
  };
}

function buildPortalVisitAction(portal: string, reason: string): RouteAction {
  const labels: Record<string, string> = {
    lab: 'Go to Creation Lab',
    nexus: 'Open Nexus',
    atlas: 'Open Atlas',
    research: 'Visit Research',
    school: 'Visit School',
  };
  return {
    kind: 'visit-portal',
    label: labels[portal] ?? `Visit ${portal}`,
    description: reason,
    confidence: 0.55,
    payload: { portal },
  };
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

export function resolveRouteIntelligence(
  input: RouteIntelligenceInput
): RouteIntelligenceResult {
  const { session, recentArtifacts, currentPath } = input;
  const actions: RouteAction[] = [];
  const reasons: string[] = [];

  // 1. Resume most recent active artifact (highest priority if session is resume)
  const recent = mostRecentActive(recentArtifacts);
  if (recent && session?.is_resume) {
    actions.push(buildContinueAction(recent));
    reasons.push(`Session is resuming — most recent active artifact: "${recent.title}"`);
  } else if (recent) {
    // Not a resume but there's active work — offer continue with lower confidence
    const action = buildContinueAction(recent);
    actions.push({ ...action, confidence: action.confidence - 0.15 });
    reasons.push(`Active artifact found: "${recent.title}"`);
  }

  // 2. Suggest creating the most-used kind
  const dominant = mostUsedKind(recentArtifacts);
  if (dominant) {
    const alreadySuggested = actions.some(a => a.payload.artifactKind === dominant);
    if (!alreadySuggested) {
      actions.push(buildCreateAction(dominant, 0.6));
      reasons.push(`Most-used artifact kind: ${dominant}`);
    }
  }

  // 3. Portal visit — if most artifacts come from a different portal
  const dominantSource = dominantSourcePortal(recentArtifacts);
  const currentPortal = portalFromPath(currentPath);
  if (dominantSource && dominantSource !== currentPortal && dominantSource !== 'manual') {
    actions.push(buildPortalVisitAction(dominantSource, `Most of your work happens in ${dominantSource}.`));
    reasons.push(`Work pattern suggests ${dominantSource} portal`);
  }

  // 4. Archive stale artifacts suggestion
  const stale = stalestArtifact(recentArtifacts);
  if (stale) {
    actions.push({
      kind: 'archive-stale',
      label: `Archive: ${stale.title}`,
      description: `This artifact hasn't been accessed in over 2 weeks.`,
      confidence: 0.45,
      payload: { artifactId: stale.artifact_id },
    });
    reasons.push(`Stale artifact detected: "${stale.title}"`);
  }

  // 5. Fresh start if nothing else
  if (actions.length === 0) {
    actions.push({
      kind: 'start-session',
      label: 'Start something new',
      description: 'Your lab is fresh. Begin with a research thread or a new draft.',
      confidence: 0.5,
      payload: { portal: 'lab' },
    });
    reasons.push('No prior artifacts — cold start suggestion');
  }

  // Sort by confidence descending
  const sorted = [...actions].sort((a, b) => b.confidence - a.confidence);
  const [primary, ...alternatives] = sorted;

  return {
    primary: primary ?? null,
    alternatives: alternatives.slice(0, 3),
    reasoning: reasons.join(' | '),
  };
}
