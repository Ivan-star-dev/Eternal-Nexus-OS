/**
 * Sacred Flow Gate (no deps)
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

const MUST_EXIST = [
  'NEXUS_CONTEXT/README_FIRST.md',
  'NEXUS_CONTEXT/ROLE_CHARTER.md',
  'NEXUS_CONTEXT/DECISIONS.md',
  'NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md',
  'NEXUS_CONTEXT/VISUAL_DNA.md',
];

const KEYWORDS = [
  'Tribunal',
  'Atlas',
  'Index',
  'News',
  'Streams',
];

const FLOW_VARIANTS = [
  'Tribunal -> Atlas -> Index -> News -> Streams',
  'Tribunal → Atlas → Index → News → Streams',
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '_worktrees', 'dist', 'build'].includes(entry.name)) continue;
      out.push(...walk(path.join(dir, entry.name)));
    } else {
      const p = path.join(dir, entry.name);
      if (/\.(md|ts|tsx|js|jsx|json|yml|yaml|txt)$/.test(entry.name)) out.push(p);
    }
  }
  return out;
}

function assertFiles() {
  const missing = MUST_EXIST.filter(rel => !fs.existsSync(path.join(ROOT, rel)));
  if (missing.length) {
    console.error('Sacred Flow Gate FAILED: missing required files:');
    missing.forEach(m => console.error(' - ' + m));
    process.exit(1);
  }
}

function assertKeywords() {
  const files = walk(ROOT);
  const haystack = files.map(f => {
    try { return fs.readFileSync(f, 'utf8'); } catch { return ''; }
  }).join('\n');

  const missing = KEYWORDS.filter(k => !haystack.includes(k));
  const hasCanonicalFlow = FLOW_VARIANTS.some(flow => haystack.includes(flow));

  if (missing.length) {
    console.error('Sacred Flow Gate FAILED: missing required keywords (possible drift):');
    missing.forEach(m => console.error(' - ' + m));
    process.exit(1);
  }

  if (!hasCanonicalFlow) {
    console.error('Sacred Flow Gate FAILED: missing canonical Sacred Flow sequence:');
    FLOW_VARIANTS.forEach(flow => console.error(' - ' + flow));
    process.exit(1);
  }
}

assertFiles();
assertKeywords();
console.log('Sacred Flow Gate PASSED.');
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
