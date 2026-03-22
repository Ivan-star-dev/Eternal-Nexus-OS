'use strict';

const fs = require('fs');
const path = require('path');

// Resolve paths relative to the project root (two levels up from scripts/gates/)
const projectRoot = path.resolve(__dirname, '..', '..');

const REQUIRED_FILES = [
  'ops/BASTION.md',
  'ops/DNA_PROTOCOL.md',
  'ops/LIVE_STATE.md',
  'ops/HANDOFF_LEDGER.md',
  'ops/FORCE_TASK_PROTOCOL.md',
];

const LIVE_STATE_FILE = 'ops/LIVE_STATE.md';

let allPassed = true;
const results = [];

// --- Check 1: Required files exist ---
for (const relPath of REQUIRED_FILES) {
  const absPath = path.join(projectRoot, relPath);
  if (fs.existsSync(absPath)) {
    results.push({ label: `File exists: ${relPath}`, passed: true });
  } else {
    results.push({ label: `File exists: ${relPath}`, passed: false, error: `MISSING — ${absPath}` });
    allPassed = false;
  }
}

// --- Check 2: LIVE_STATE.md contains "ACTIVO" or "ACTIVE" ---
const liveStatePath = path.join(projectRoot, LIVE_STATE_FILE);
if (fs.existsSync(liveStatePath)) {
  const content = fs.readFileSync(liveStatePath, 'utf8');
  const hasActiveKeyword = /ACTIVO|ACTIVE/i.test(content);
  if (hasActiveKeyword) {
    results.push({ label: `${LIVE_STATE_FILE} contains ACTIVO/ACTIVE`, passed: true });
  } else {
    results.push({
      label: `${LIVE_STATE_FILE} contains ACTIVO/ACTIVE`,
      passed: false,
      error: `Neither "ACTIVO" nor "ACTIVE" found in ${LIVE_STATE_FILE}`,
    });
    allPassed = false;
  }
} else {
  // Already reported as missing above; skip duplicate failure
  results.push({
    label: `${LIVE_STATE_FILE} contains ACTIVO/ACTIVE`,
    passed: false,
    error: `Cannot check content — file does not exist`,
  });
  allPassed = false;
}

// --- Print summary ---
console.log('\n=== SACRED FLOW GATE ===\n');
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
