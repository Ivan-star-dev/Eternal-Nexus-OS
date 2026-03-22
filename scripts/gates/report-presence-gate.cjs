'use strict';

const fs = require('fs');
const path = require('path');

// Resolve paths relative to the project root (two levels up from scripts/gates/)
const projectRoot = path.resolve(__dirname, '..', '..');

const HANDOFF_LEDGER = 'ops/HANDOFF_LEDGER.md';
const LIVE_STATE = 'ops/LIVE_STATE.md';

let allPassed = true;
const results = [];

function checkFile(relPath) {
  const absPath = path.join(projectRoot, relPath);
  if (!fs.existsSync(absPath)) {
    return { exists: false, content: null, absPath };
  }
  const content = fs.readFileSync(absPath, 'utf8');
  return { exists: true, content, absPath };
}

// --- Check 1: HANDOFF_LEDGER.md exists and is non-empty ---
const ledger = checkFile(HANDOFF_LEDGER);
if (!ledger.exists) {
  results.push({ label: `${HANDOFF_LEDGER} exists and is non-empty`, passed: false, error: `MISSING — ${ledger.absPath}` });
  allPassed = false;
} else if (ledger.content.trim().length === 0) {
  results.push({ label: `${HANDOFF_LEDGER} exists and is non-empty`, passed: false, error: `File exists but is empty` });
  allPassed = false;
} else {
  results.push({ label: `${HANDOFF_LEDGER} exists and is non-empty`, passed: true });
}

// --- Check 2: HANDOFF_LEDGER.md contains at least one HANDOFF entry ---
if (ledger.exists && ledger.content.trim().length > 0) {
  const hasHandoff = /HANDOFF/i.test(ledger.content);
  if (hasHandoff) {
    results.push({ label: `${HANDOFF_LEDGER} contains at least one HANDOFF entry`, passed: true });
  } else {
    results.push({
      label: `${HANDOFF_LEDGER} contains at least one HANDOFF entry`,
      passed: false,
      error: `No "HANDOFF" keyword found in ${HANDOFF_LEDGER}`,
    });
    allPassed = false;
  }
} else {
  results.push({
    label: `${HANDOFF_LEDGER} contains at least one HANDOFF entry`,
    passed: false,
    error: `Cannot check content — file missing or empty`,
  });
  allPassed = false;
}

// --- Check 3: LIVE_STATE.md exists and is non-empty ---
const liveState = checkFile(LIVE_STATE);
if (!liveState.exists) {
  results.push({ label: `${LIVE_STATE} exists and is non-empty`, passed: false, error: `MISSING — ${liveState.absPath}` });
  allPassed = false;
} else if (liveState.content.trim().length === 0) {
  results.push({ label: `${LIVE_STATE} exists and is non-empty`, passed: false, error: `File exists but is empty` });
  allPassed = false;
} else {
  results.push({ label: `${LIVE_STATE} exists and is non-empty`, passed: true });
}

// --- Print summary ---
console.log('\n=== REPORT PRESENCE GATE ===\n');
for (const r of results) {
  const icon = r.passed ? '[PASS]' : '[FAIL]';
  console.log(`  ${icon}  ${r.label}`);
  if (!r.passed && r.error) {
    console.log(`         ERROR: ${r.error}`);
  }
}

console.log('');
if (allPassed) {
  console.log('RESULT: ALL CHECKS PASSED — gate open.\n');
  process.exit(0);
} else {
  const failed = results.filter((r) => !r.passed).length;
  console.log(`RESULT: ${failed} CHECK(S) FAILED — gate closed.\n`);
  process.exit(1);
}
