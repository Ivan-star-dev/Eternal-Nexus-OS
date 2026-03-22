'use strict';

const fs = require('fs');
const path = require('path');

// Resolve paths relative to the project root (two levels up from scripts/gates/)
const projectRoot = path.resolve(__dirname, '..', '..');

let allPassed = true;
const results = [];

function check(label, passed, error) {
  results.push({ label, passed, error: passed ? undefined : error });
  if (!passed) allPassed = false;
}

// --- Check 1: Key source files exist ---
const SRC_FILES = [
  'src/main.tsx',
  'src/App.tsx',
  'package.json',
  'vite.config.ts',
];

for (const relPath of SRC_FILES) {
  const absPath = path.join(projectRoot, relPath);
  const exists = fs.existsSync(absPath);
  check(
    `Structural check: ${relPath} exists`,
    exists,
    `MISSING — ${absPath}`
  );
}

// --- Check 2: .env.example present (environment variable documentation) ---
const envExamplePath = path.join(projectRoot, '.env.example');
check(
  'Environment documentation: .env.example exists',
  fs.existsSync(envExamplePath),
  `MISSING — ${envExamplePath} (document required env var names here)`
);

// --- Check 3: Sacred Flow gate dependency — ops/LIVE_STATE.md ---
const liveStatePath = path.join(projectRoot, 'ops/LIVE_STATE.md');
check(
  'Sacred Flow gate dependency: ops/LIVE_STATE.md exists',
  fs.existsSync(liveStatePath),
  `MISSING — ${liveStatePath}`
);

// --- Check 4: Report presence dependency — ops/HANDOFF_LEDGER.md ---
const handoffPath = path.join(projectRoot, 'ops/HANDOFF_LEDGER.md');
check(
  'Report presence dependency: ops/HANDOFF_LEDGER.md exists',
  fs.existsSync(handoffPath),
  `MISSING — ${handoffPath}`
);

// --- Print summary ---
console.log('\n=== DEPLOY READINESS GATE ===\n');
for (const r of results) {
  const icon = r.passed ? '[PASS]' : '[FAIL]';
  console.log(`  ${icon}  ${r.label}`);
  if (!r.passed && r.error) {
    console.log(`         ERROR: ${r.error}`);
  }
}

console.log('');
if (allPassed) {
  console.log('RESULT: ALL CHECKS PASSED — deploy gate open.\n');
  process.exit(0);
} else {
  const failed = results.filter((r) => !r.passed).length;
  console.log(`RESULT: ${failed} CHECK(S) FAILED — deploy gate closed.\n`);
  process.exit(1);
}
