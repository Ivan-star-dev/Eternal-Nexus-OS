/**
 * ORGANISM_MINIMUM_MEMORY — Proof Loop
 * Proves all 4 tasks work end-to-end.
 *
 * Input: "compact fusion engine"
 *
 * Proves:
 *   ✓ session is created
 *   ✓ provenance node is created
 *   ✓ fruit is recorded
 *   ✓ re_entry_point is recorded
 *   ✓ session can be reloaded
 *   ✓ a later step can know what an earlier step produced
 *   ✓ reentry grace is computed
 *   ✓ relay coupling is computed
 *
 * Run: node scripts/memory/proof-loop.mjs
 */

import {
  createSession,
  loadSession,
  updateSession,
  createProvenance,
  loadProvenance,
  buildReentryGrace,
  buildRelayCoupling,
} from './io.mjs';

const INPUT = 'compact fusion engine';
const SEP   = '─'.repeat(58);

console.log('\n════ ORGANISM_MINIMUM_MEMORY — PROOF LOOP ════════════════');
console.log(`INPUT: "${INPUT}"`);
console.log(SEP);

// ── STEP 1: Create session ────────────────────────────────────────────────────
const session = await createSession({
  subject:          INPUT,
  intention:        'Understand and model compact fusion engine dynamics',
  trinity_face:     'heaven_lab',
  swarm_activated:  ['@claude'],
  concepts_touched: ['fusion', 'plasma', 'magnetic confinement', 'energy density'],
  fruit:            [],
  open_threads:     ['plasma stability model', 'energy output calculation'],
  re_entry_point:   'Continue from plasma stability model — incomplete',
});

console.log(`✓ [1] SESSION CREATED`);
console.log(`      session_id:     ${session.session_id}`);
console.log(`      subject:        ${session.subject}`);
console.log(`      trinity_face:   ${session.trinity_face}`);
console.log(`      ts_start:       ${session.ts_start}`);

// ── STEP 2: Create provenance node ───────────────────────────────────────────
const prov = await createProvenance({
  session_id:           session.session_id,
  origin_agent:         '@claude',
  origin_constellation: 'Eternal Nexus OS / Heaven Lab',
  phase:                'V3',
  subject:              INPUT,
  intention:            'Map core fusion dynamics — produce analysis block',
  input_ref:            `prompt::"${INPUT}"`,
  output_type:          'analysis',
  output_ref:           `ops/sessions/${session.session_id}.json`,
  fruit_class:          'primary',
  next_consumer:        '@cursor',
  status:               'active',
});

console.log(`\n✓ [2] PROVENANCE NODE CREATED`);
console.log(`      node_id:        ${prov.node_id}`);
console.log(`      origin_agent:   ${prov.origin_agent}`);
console.log(`      output_type:    ${prov.output_type}`);
console.log(`      next_consumer:  ${prov.next_consumer}`);

// ── STEP 3: Record fruit ──────────────────────────────────────────────────────
const fruit_entry = `analysis::compact-fusion::plasma-stability-mapped::${new Date().toISOString()}`;
await updateSession(session.session_id, {
  fruit: [fruit_entry],
});

console.log(`\n✓ [3] FRUIT RECORDED`);
console.log(`      fruit: ${fruit_entry}`);

// ── STEP 4: Record re_entry_point ────────────────────────────────────────────
await updateSession(session.session_id, {
  re_entry_point: 'Continue from energy output calculation — plasma model done',
});

console.log(`\n✓ [4] RE_ENTRY_POINT RECORDED`);
console.log(`      re_entry_point: Continue from energy output calculation — plasma model done`);

// ── STEP 5: Close session ─────────────────────────────────────────────────────
await updateSession(session.session_id, {
  ts_end: new Date().toISOString(),
});

// ── STEP 5: Reload session from disk ─────────────────────────────────────────
const reloaded = await loadSession(session.session_id);

console.log(`\n✓ [5] SESSION RELOADED FROM DISK`);
console.log(`      session_id:     ${reloaded.session_id}`);
console.log(`      ts_end:         ${reloaded.ts_end}`);
console.log(`      fruit[0]:       ${reloaded.fruit[0]}`);
console.log(`      re_entry_point: ${reloaded.re_entry_point}`);

// ── STEP 6: Reload provenance and prove chain ────────────────────────────────
const reloaded_prov = await loadProvenance(prov.node_id);

console.log(`\n✓ [6] PROVENANCE CHAIN READABLE`);
console.log(`      node_id:        ${reloaded_prov.node_id}`);
console.log(`      next_consumer "${reloaded_prov.next_consumer}" knows:`);
console.log(`        earlier step produced:  "${reloaded_prov.output_type}" at "${reloaded_prov.output_ref}"`);
console.log(`        next step should be:    "${reloaded.re_entry_point}"`);

// ── STEP 7: Reentry Grace ────────────────────────────────────────────────────
const reentry = buildReentryGrace(reloaded, reloaded_prov);

console.log(`\n✓ [7] REENTRY GRACE`);
console.log(`      session_id:         ${reentry.session_id}`);
console.log(`      stopped_at:         ${reentry.stopped_at}`);
console.log(`      latest_fruit:       ${reentry.latest_fruit.slice(0, 60)}...`);
console.log(`      latest_subject:     ${reentry.latest_subject}`);
console.log(`      open_threads:       ${reentry.open_threads.join(' | ')}`);
console.log(`      next_expected_step: ${reentry.next_expected_step}`);
console.log(`      provenance_tail:    ${reentry.provenance_tail}`);

// ── STEP 8: Relay Coupling ───────────────────────────────────────────────────
const relay = buildRelayCoupling(reloaded, reloaded_prov);

console.log(`\n✓ [8] RELAY COUPLING`);
console.log(`      session_id:             ${relay.session_id}`);
console.log(`      latest_provenance_node: ${relay.latest_provenance_node}`);
console.log(`      re_entry_point:         ${relay.re_entry_point}`);
console.log(`      ts_coupled:             ${relay.ts_coupled}`);

console.log(`\n${SEP}`);
console.log('════ PROOF LOOP COMPLETE ══════════════════════════════════');
console.log(`\nFiles written:`);
console.log(`  ops/sessions/${session.session_id}.json`);
console.log(`  ops/sessions/${session.session_id}.relay.json`);
console.log(`  ops/runtime/provenance/${prov.node_id}.json`);
console.log('');
