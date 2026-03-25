/**
 * FRUIT-DETECTION-MINIMUM-001
 * Minimum fruit detector for the organism.
 *
 * Answers:
 *   - did this session produce fruit?
 *   - what kind of fruit?
 *   - is the user progressing?
 *   - should the session continue, redirect, or close gracefully?
 */

import type { SessionEntity, ProvenanceNode, FruitClass } from './types';

export interface FruitDetectionResult {
  has_fruit: boolean;
  fruit_count: number;
  dominant_fruit_class: FruitClass | null;
  progression_signal: ProgressionSignal;
  session_directive: SessionDirective;
  rationale: string;
}

export type ProgressionSignal =
  | 'advancing'     // fruit is growing, re_entry_point is being updated
  | 'stalled'       // session has open threads but no fruit in last step
  | 'circling'      // re_entry_point unchanged across multiple provenance nodes
  | 'complete';     // ts_end set + fruit present

export type SessionDirective =
  | 'continue'           // session is alive and productive — keep going
  | 'redirect'           // session has stalled — suggest different face or mode
  | 'close-gracefully'   // session produced fruit and reached a natural end
  | 'reopen';            // session was closed with open threads — should be reopened

// ── Fruit class detection from entry string ───────────────────────────────────

function detectFruitClass(entry: string): FruitClass {
  const lower = entry.toLowerCase();
  if (lower.includes('analysis') || lower.includes('synthesis') || lower.includes('plan')) {
    return 'primary';
  }
  if (lower.includes('note') || lower.includes('ref') || lower.includes('link')) {
    return 'derivative';
  }
  return 'residual';
}

function dominantClass(entries: string[]): FruitClass | null {
  if (entries.length === 0) return null;
  const counts: Record<FruitClass, number> = { primary: 0, derivative: 0, residual: 0 };
  for (const e of entries) counts[detectFruitClass(e)]++;
  return (Object.entries(counts) as [FruitClass, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}

// ── Progression signal ────────────────────────────────────────────────────────

function detectProgression(
  session: SessionEntity,
  provenance_nodes: ProvenanceNode[]
): ProgressionSignal {
  if (session.ts_end && session.fruit.length > 0) return 'complete';

  if (session.fruit.length === 0) return 'stalled';

  // Circling: re_entry_point unchanged across 2+ provenance nodes
  if (provenance_nodes.length >= 2) {
    const reEntryMatches = provenance_nodes.filter(
      (n) => n.intention === session.re_entry_point
    );
    if (reEntryMatches.length >= 2) return 'circling';
  }

  return 'advancing';
}

// ── Session directive ─────────────────────────────────────────────────────────

function deriveDirective(
  session: SessionEntity,
  signal: ProgressionSignal
): SessionDirective {
  if (signal === 'complete') return 'close-gracefully';

  if (signal === 'circling') return 'redirect';

  if (signal === 'stalled') {
    // If there are open threads, re-open is appropriate
    if (session.open_threads.length > 0) return 'reopen';
    return 'redirect';
  }

  // advancing
  if (session.ts_end && session.open_threads.length > 0) return 'reopen';

  return 'continue';
}

// ── Main detector ────────────────────────────────────────────────────────────

export function detectFruit(
  session: SessionEntity,
  provenance_nodes: ProvenanceNode[] = []
): FruitDetectionResult {
  const fruit_count = session.fruit.length;
  const has_fruit = fruit_count > 0;
  const dominant_fruit_class = dominantClass(session.fruit);
  const progression_signal = detectProgression(session, provenance_nodes);
  const session_directive = deriveDirective(session, progression_signal);

  const rationale = buildRationale(session, has_fruit, progression_signal, session_directive);

  return {
    has_fruit,
    fruit_count,
    dominant_fruit_class,
    progression_signal,
    session_directive,
    rationale,
  };
}

function buildRationale(
  session: SessionEntity,
  has_fruit: boolean,
  signal: ProgressionSignal,
  directive: SessionDirective
): string {
  const parts: string[] = [];

  if (!has_fruit) {
    parts.push('No fruit recorded in session');
  } else {
    parts.push(`${session.fruit.length} fruit entry(ies) recorded`);
  }

  if (session.open_threads.length > 0) {
    parts.push(`${session.open_threads.length} open thread(s): ${session.open_threads.slice(0, 2).join(', ')}`);
  }

  if (session.ts_end) {
    parts.push('Session is closed (ts_end set)');
  }

  parts.push(`Progression: ${signal} → directive: ${directive}`);

  return parts.join(' · ');
}
