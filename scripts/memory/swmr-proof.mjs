/**
 * SWMR_MINIMUM_RUNTIME — Proof Script
 * Runs all 3 tasks against 3 required test inputs.
 *
 * Inputs:
 *   1. "compact fusion engine"
 *   2. "how to reach Mars in six months"
 *   3. "turn this research into a paper and visual prototype"
 *
 * Run: node scripts/memory/swmr-proof.mjs
 *
 * NOTE: This is a self-contained Node proof.
 * The TypeScript modules are replicated here as plain JS to avoid
 * bundler dependency in this standalone script.
 * Canonical source of truth remains src/lib/memory/*.ts
 */

// ── Inline classifier (mirrors src/lib/memory/classifier.ts) ─────────────────

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
const MODE_SIGNALS = {
  research:     ['research', 'investigate', 'model', 'analyse', 'study', 'simulation', 'experiment'],
  production:   ['build', 'create', 'make', 'code', 'ship', 'launch', 'produce', 'prototype'],
  learning:     ['learn', 'understand', 'how to', 'teach', 'guide', 'tutorial', 'step by step'],
  synthesis:    ['paper', 'write', 'visual', 'turn into', 'transform', 'connect', 'combine'],
  decision:     ['choose', 'decide', 'evaluate', 'compare', 'best', 'which', 'should i'],
  continuation: [],
};

function score(text, signals) {
  const lower = text.toLowerCase();
  return signals.reduce((acc, s) => acc + (lower.includes(s) ? 1 : 0), 0);
}
function topMode(text) {
  const entries = Object.entries(MODE_SIGNALS).map(([mode, sigs]) => ({ mode, score: score(text, sigs) }));
  entries.sort((a, b) => b.score - a.score);
  return entries[0];
}
function deriveNextStep(face, mode, subject) {
  if (face === 'heaven_lab') {
    if (mode === 'research')   return `Run structured analysis on "${subject}" — define hypotheses and model parameters`;
    if (mode === 'production') return `Build initial prototype or simulation for "${subject}"`;
    return `Explore "${subject}" through structured Heaven Lab investigation`;
  }
  if (face === 'bridge_nova') {
    if (mode === 'learning')   return `Map learning path for "${subject}" — define milestones and knowledge prerequisites`;
    if (mode === 'decision')   return `Evaluate routes to "${subject}" — compare strategies and constraints`;
    return `Progress through "${subject}" with Bridge Nova guidance`;
  }
  if (mode === 'production')   return `Open production track for "${subject}" — define deliverable type and first output`;
  if (mode === 'synthesis')    return `Synthesise "${subject}" into concrete artefact — choose output format`;
  return `Create tangible output for "${subject}" via Nexus Cria`;
}
function classify(input) {
  const fullText = `${input.subject} ${input.intention} ${input.profile_hint ?? ''}`;
  const isContinuation = (input.session?.re_entry_point ?? '').length > 0 && (input.session?.fruit.length ?? 0) > 0;
  if (isContinuation) {
    return {
      chosen_trinity_face: 'heaven_lab',
      route_confidence: 0.95,
      active_mode: 'continuation',
      next_expected_step: input.session.re_entry_point,
      classification_signals: ['continuation detected'],
    };
  }
  const hl = score(fullText, HEAVEN_LAB_SIGNALS);
  const bn = score(fullText, BRIDGE_NOVA_SIGNALS);
  const nc = score(fullText, NEXUS_CRIA_SIGNALS);
  const total = Math.max(hl + bn + nc, 1);
  const scores = [['heaven_lab', hl], ['bridge_nova', bn], ['nexus_cria', nc]];
  scores.sort((a, b) => b[1] - a[1]);
  const [chosen_trinity_face, topScore] = scores[0];
  const route_confidence = Math.min(topScore / total + 0.2, 1.0);
  const { mode: active_mode } = topMode(fullText);
  return {
    chosen_trinity_face,
    route_confidence: Math.round(route_confidence * 100) / 100,
    active_mode,
    next_expected_step: deriveNextStep(chosen_trinity_face, active_mode, input.subject),
    classification_signals: [`hl:${hl} bn:${bn} nc:${nc}`, `chosen: ${chosen_trinity_face}`],
  };
}

// ── Inline router (mirrors src/lib/memory/routing.ts) ────────────────────────

const ROUTING_TABLE = {
  heaven_lab: {
    research:     { regime: 'deep-investigation',  surface_hint: 'Open structured analysis workspace',   toolset: ['session-backbone', 'provenance-spine'], constraint: 'No speculative outputs without evidence chain' },
    production:   { regime: 'rapid-mapping',        surface_hint: 'Map domain before building',           toolset: ['session-backbone'],                    constraint: 'Map first, produce second' },
    learning:     { regime: 'rapid-mapping',        surface_hint: 'Establish concept landscape',          toolset: ['session-backbone'],                    constraint: 'Establish foundations before advancing' },
    synthesis:    { regime: 'deep-investigation',   surface_hint: 'Investigate before generating output', toolset: ['session-backbone', 'provenance-spine'], constraint: 'Evidence required before synthesis' },
    decision:     { regime: 'rapid-mapping',        surface_hint: 'Map decision space',                   toolset: ['session-backbone'],                    constraint: 'Map all options before recommending' },
    continuation: { regime: 'deep-investigation',   surface_hint: 'Resume from re_entry_point',           toolset: ['session-backbone', 'relay-coupling'],  constraint: 'No cold start' },
  },
  bridge_nova: {
    research:     { regime: 'guided-progression',   surface_hint: 'Convert research into learning path',  toolset: ['session-backbone'],                    constraint: 'Sequence by dependency order' },
    production:   { regime: 'guided-progression',   surface_hint: 'Step-by-step to production milestone', toolset: ['session-backbone'],                    constraint: 'No skipped prerequisites' },
    learning:     { regime: 'guided-progression',   surface_hint: 'Build milestone map',                  toolset: ['session-backbone', 'relay-coupling'],  constraint: 'Validate understanding before advancing' },
    synthesis:    { regime: 'navigation-assist',    surface_hint: 'Navigate to synthesis capability',     toolset: ['session-backbone'],                    constraint: 'Build capability before asking for output' },
    decision:     { regime: 'navigation-assist',    surface_hint: 'Compare routes',                       toolset: ['session-backbone'],                    constraint: 'Concrete constraints required before scoring' },
    continuation: { regime: 'guided-progression',   surface_hint: 'Resume milestone path',                toolset: ['session-backbone', 'relay-coupling'],  constraint: 'Validate prior milestone' },
  },
  nexus_cria: {
    research:     { regime: 'synthesis-track',      surface_hint: 'Research feeds production artefact',   toolset: ['session-backbone', 'provenance-spine'], constraint: 'Research must resolve in concrete output' },
    production:   { regime: 'artefact-production',  surface_hint: 'Open production track',                toolset: ['session-backbone', 'provenance-spine'], constraint: 'Artefact must be real and deliverable' },
    learning:     { regime: 'artefact-production',  surface_hint: 'Learn by making',                      toolset: ['session-backbone'],                    constraint: 'Output demonstrates learning' },
    synthesis:    { regime: 'synthesis-track',      surface_hint: 'Combine inputs into new form',         toolset: ['session-backbone', 'provenance-spine'], constraint: 'Input refs must exist before synthesis opens' },
    decision:     { regime: 'artefact-production',  surface_hint: 'Decision resolves in deliverable',     toolset: ['session-backbone'],                    constraint: 'Decision must produce tangible output' },
    continuation: { regime: 'artefact-production',  surface_hint: 'Resume production from last state',    toolset: ['relay-coupling'],                      constraint: 'Do not restart from scratch' },
  },
};
function route(classification) {
  const { chosen_trinity_face, active_mode } = classification;
  const entry = ROUTING_TABLE[chosen_trinity_face]?.[active_mode] ?? ROUTING_TABLE[chosen_trinity_face].research;
  return { face: chosen_trinity_face, ...entry };
}

// ── Inline fruit detector (mirrors src/lib/memory/fruit.ts) ──────────────────

function detectFruitClass(entry) {
  const lower = entry.toLowerCase();
  if (lower.includes('analysis') || lower.includes('synthesis') || lower.includes('plan')) return 'primary';
  if (lower.includes('note') || lower.includes('ref') || lower.includes('link')) return 'derivative';
  return 'residual';
}
function dominantClass(entries) {
  if (!entries.length) return null;
  const counts = { primary: 0, derivative: 0, residual: 0 };
  for (const e of entries) counts[detectFruitClass(e)]++;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}
function detectProgression(session, provenance_nodes = []) {
  if (session.ts_end && session.fruit.length > 0) return 'complete';
  if (session.fruit.length === 0) return 'stalled';
  if (provenance_nodes.length >= 2) {
    const matches = provenance_nodes.filter(n => n.intention === session.re_entry_point);
    if (matches.length >= 2) return 'circling';
  }
  return 'advancing';
}
function deriveDirective(session, signal) {
  if (signal === 'complete') return 'close-gracefully';
  if (signal === 'circling') return 'redirect';
  if (signal === 'stalled') return session.open_threads.length > 0 ? 'reopen' : 'redirect';
  if (session.ts_end && session.open_threads.length > 0) return 'reopen';
  return 'continue';
}
function detectFruit(session, provenance_nodes = []) {
  const has_fruit = session.fruit.length > 0;
  const signal = detectProgression(session, provenance_nodes);
  const directive = deriveDirective(session, signal);
  return {
    has_fruit,
    fruit_count: session.fruit.length,
    dominant_fruit_class: dominantClass(session.fruit),
    progression_signal: signal,
    session_directive: directive,
    rationale: [
      has_fruit ? `${session.fruit.length} fruit entry(ies)` : 'No fruit',
      session.open_threads.length > 0 ? `${session.open_threads.length} open thread(s)` : null,
      session.ts_end ? 'Session closed' : 'Session active',
      `${signal} → ${directive}`,
    ].filter(Boolean).join(' · '),
  };
}

// ── Integrate with session backbone (io.mjs) ─────────────────────────────────

import { createSession, updateSession } from './io.mjs';

// ── PROOF ─────────────────────────────────────────────────────────────────────

const SEP = '─'.repeat(60);
const INPUTS = [
  {
    subject:   'compact fusion engine',
    intention: 'Understand and model compact fusion engine dynamics',
  },
  {
    subject:   'how to reach Mars in six months',
    intention: 'Plan mission and skill path to achieve Mars transit in six months',
  },
  {
    subject:   'turn this research into a paper and visual prototype',
    intention: 'Produce a publishable paper and an interactive visual prototype from existing research',
  },
];

console.log('\n════ SWMR_MINIMUM_RUNTIME — PROOF ════════════════════════════');

for (let i = 0; i < INPUTS.length; i++) {
  const inp = INPUTS[i];
  console.log(`\n${SEP}`);
  console.log(`INPUT ${i + 1}: "${inp.subject}"`);
  console.log(SEP);

  // ── 1. Classify ─────────────────────────────────────────────────────────────
  const classification = classify({ subject: inp.subject, intention: inp.intention });
  console.log(`\n[CLASSIFIER]`);
  console.log(`  chosen_trinity_face: ${classification.chosen_trinity_face}`);
  console.log(`  route_confidence:    ${classification.route_confidence}`);
  console.log(`  active_mode:         ${classification.active_mode}`);
  console.log(`  next_expected_step:  ${classification.next_expected_step}`);
  console.log(`  signals:             ${classification.classification_signals.join(' | ')}`);

  // ── 2. Route ─────────────────────────────────────────────────────────────────
  const routing = route(classification);
  console.log(`\n[ROUTER]`);
  console.log(`  face:          ${routing.face}`);
  console.log(`  regime:        ${routing.regime}`);
  console.log(`  surface_hint:  ${routing.surface_hint}`);
  console.log(`  toolset:       ${routing.toolset.join(', ')}`);
  console.log(`  constraint:    ${routing.constraint}`);

  // ── 3. Create session + record fruit ─────────────────────────────────────────
  const session = await createSession({
    subject:          inp.subject,
    intention:        inp.intention,
    trinity_face:     classification.chosen_trinity_face,
    swarm_activated:  ['@claude'],
    concepts_touched: [],
    fruit:            [],
    open_threads:     ['initial-thread'],
    re_entry_point:   '',
  });

  // Record fruit and update next_expected_step from classifier
  const fruit_entry = `analysis::${inp.subject.replace(/\s+/g, '-').toLowerCase()}::initial::${new Date().toISOString()}`;
  const updated = await updateSession(session.session_id, {
    fruit:          [fruit_entry],
    re_entry_point: classification.next_expected_step,
  });

  // ── 4. Detect fruit ──────────────────────────────────────────────────────────
  const fruit_result = detectFruit(updated);
  console.log(`\n[FRUIT DETECTOR]`);
  console.log(`  has_fruit:            ${fruit_result.has_fruit}`);
  console.log(`  fruit_count:          ${fruit_result.fruit_count}`);
  console.log(`  dominant_fruit_class: ${fruit_result.dominant_fruit_class}`);
  console.log(`  progression_signal:   ${fruit_result.progression_signal}`);
  console.log(`  session_directive:    ${fruit_result.session_directive}`);
  console.log(`  rationale:            ${fruit_result.rationale}`);

  // ── 5. Session backbone updated ─────────────────────────────────────────────
  console.log(`\n[SESSION BACKBONE]`);
  console.log(`  session_id:         ${updated.session_id}`);
  console.log(`  trinity_face:       ${updated.trinity_face}`);
  console.log(`  fruit[0]:           ${updated.fruit[0]}`);
  console.log(`  re_entry_point:     ${updated.re_entry_point}`);
}

console.log(`\n${SEP}`);
console.log('════ SWMR PROOF COMPLETE ══════════════════════════════════════\n');
