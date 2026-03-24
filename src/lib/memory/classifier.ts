/**
 * SWMR-CLASSIFIER-MINIMUM-001
 * Sovereign World Materialization Runtime — Minimum Classifier
 *
 * Rule-based. No provider coupling. No AI orchestration.
 * Input: subject + intention + phase + profile hint + session state
 * Output: chosen_trinity_face, route_confidence, active_mode, next_expected_step
 */

import type { TrinityFace, SessionEntity } from './types';

export interface ClassifierInput {
  subject: string;
  intention: string;
  phase?: string;
  profile_hint?: string;
  /** Partial session state — may be undefined for a brand-new session */
  session?: Pick<SessionEntity, 'fruit' | 'open_threads' | 're_entry_point' | 'concepts_touched'>;
}

export interface ClassifierOutput {
  chosen_trinity_face: TrinityFace;
  route_confidence: number;          // 0.0 – 1.0
  active_mode: ActiveMode;
  next_expected_step: string;
  classification_signals: string[];  // human-readable explanation
}

export type ActiveMode =
  | 'research'       // deep investigation, modelling
  | 'production'     // building, creating artefacts
  | 'learning'       // acquiring knowledge, tutoring
  | 'synthesis'      // connecting ideas, writing, prototyping
  | 'decision'       // evaluating options, choosing path
  | 'continuation';  // resuming prior session

// ── Signal tables ────────────────────────────────────────────────────────────

const HEAVEN_LAB_SIGNALS = [
  'fusion', 'plasma', 'quantum', 'physics', 'simulation', 'model',
  'data', 'research', 'science', 'hypothesis', 'experiment', 'analyse',
  'investigate', 'measure', 'calculate', 'trajectory', 'orbit', 'mars',
  'space', 'engine', 'mechanism', 'energy', 'lab', 'technical', 'engineering',
  'algorithm', 'compute', 'mathematics', 'formula', 'theory', 'concept',
];

const BRIDGE_NOVA_SIGNALS = [
  'learn', 'understand', 'explain', 'teach', 'how to', 'guide', 'step by step',
  'tutorial', 'beginner', 'course', 'education', 'study', 'progress',
  'skill', 'master', 'practice', 'grow', 'six months', 'roadmap', 'path',
  'reach', 'achieve', 'improve', 'develop', 'journey',
];

const NEXUS_CRIA_SIGNALS = [
  'create', 'build', 'make', 'produce', 'paper', 'prototype', 'visual',
  'design', 'write', 'draft', 'publish', 'portfolio', 'launch', 'ship',
  'artefact', 'output', 'deliverable', 'project', 'turn into', 'transform',
  'generate', 'render', 'record', 'film', 'animate', 'code',
];

const MODE_SIGNALS: Record<ActiveMode, string[]> = {
  research:     ['research', 'investigate', 'model', 'analyse', 'study', 'simulation', 'experiment'],
  production:   ['build', 'create', 'make', 'code', 'ship', 'launch', 'produce', 'prototype'],
  learning:     ['learn', 'understand', 'how to', 'teach', 'guide', 'tutorial', 'step by step'],
  synthesis:    ['paper', 'write', 'visual', 'turn into', 'transform', 'connect', 'combine'],
  decision:     ['choose', 'decide', 'evaluate', 'compare', 'best', 'which', 'should i'],
  continuation: [], // detected by session state, not keywords
};

// ── Scoring ──────────────────────────────────────────────────────────────────

function score(text: string, signals: string[]): number {
  const lower = text.toLowerCase();
  return signals.reduce((acc, s) => acc + (lower.includes(s) ? 1 : 0), 0);
}

function topMode(text: string): { mode: ActiveMode; score: number } {
  const scores = (Object.entries(MODE_SIGNALS) as [ActiveMode, string[]][]).map(
    ([mode, sigs]) => ({ mode, score: score(text, sigs) })
  );
  scores.sort((a, b) => b.score - a.score);
  return scores[0];
}

// ── Next step templates ───────────────────────────────────────────────────────

function deriveNextStep(face: TrinityFace, mode: ActiveMode, subject: string): string {
  if (face === 'heaven_lab') {
    if (mode === 'research')  return `Run structured analysis on "${subject}" — define hypotheses and model parameters`;
    if (mode === 'production') return `Build initial prototype or simulation for "${subject}"`;
    return `Explore "${subject}" through structured Heaven Lab investigation`;
  }
  if (face === 'bridge_nova') {
    if (mode === 'learning')  return `Map learning path for "${subject}" — define milestones and knowledge prerequisites`;
    if (mode === 'decision')  return `Evaluate routes to "${subject}" — compare strategies and constraints`;
    return `Progress through "${subject}" with Bridge Nova guidance`;
  }
  // nexus_cria
  if (mode === 'production') return `Open production track for "${subject}" — define deliverable type and first output`;
  if (mode === 'synthesis')  return `Synthesise "${subject}" into concrete artefact — choose output format`;
  return `Create tangible output for "${subject}" via Nexus Cria`;
}

// ── Main classifier ───────────────────────────────────────────────────────────

export function classify(input: ClassifierInput): ClassifierOutput {
  const fullText = `${input.subject} ${input.intention} ${input.profile_hint ?? ''}`;

  // If session has re_entry_point and fruit, this is a continuation
  const isContinuation =
    (input.session?.re_entry_point ?? '').length > 0 &&
    (input.session?.fruit.length ?? 0) > 0;

  if (isContinuation) {
    return {
      chosen_trinity_face: 'heaven_lab', // default — actual face persisted in session
      route_confidence: 0.95,
      active_mode: 'continuation',
      next_expected_step: input.session!.re_entry_point,
      classification_signals: ['session.re_entry_point set', 'session.fruit non-empty → continuation detected'],
    };
  }

  const hl = score(fullText, HEAVEN_LAB_SIGNALS);
  const bn = score(fullText, BRIDGE_NOVA_SIGNALS);
  const nc = score(fullText, NEXUS_CRIA_SIGNALS);
  const total = Math.max(hl + bn + nc, 1);

  const scores: [TrinityFace, number][] = [
    ['heaven_lab',  hl],
    ['bridge_nova', bn],
    ['nexus_cria',  nc],
  ];
  scores.sort((a, b) => b[1] - a[1]);

  const [chosen_trinity_face, topScore] = scores[0];
  const route_confidence = Math.min(topScore / total + 0.2, 1.0);

  const { mode: active_mode } = topMode(fullText);

  const signals: string[] = [
    `heaven_lab:${hl} bridge_nova:${bn} nexus_cria:${nc}`,
    `chosen: ${chosen_trinity_face} (score ${topScore}/${total})`,
    `mode: ${active_mode}`,
  ];

  return {
    chosen_trinity_face,
    route_confidence: Math.round(route_confidence * 100) / 100,
    active_mode,
    next_expected_step: deriveNextStep(chosen_trinity_face, active_mode, input.subject),
    classification_signals: signals,
  };
}
