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
  if (missing.length) {
    console.error('Sacred Flow Gate FAILED: missing required keywords (possible drift):');
    missing.forEach(m => console.error(' - ' + m));
    process.exit(1);
  }
}

assertFiles();
assertKeywords();
console.log('Sacred Flow Gate PASSED.');
