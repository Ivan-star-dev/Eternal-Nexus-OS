#!/usr/bin/env node
/**
 * bundle-size-gate.mjs — Build quality gate for bundle size regression.
 *
 * Fails CI if critical bundles exceed gzip limits.
 * Run: node scripts/gates/bundle-size-gate.mjs
 * Or:  npm run gate:bundle
 *
 * SCALE LAW: Performance is law (C-07). No chunk may bloat past threshold
 * without an explicit owner gate review.
 *
 * Canon: SCALE_REAL_MANIFEST.md · @claude · 2026-03-28
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { gzipSync } from 'zlib';

const DIST_DIR = './dist/assets';

// ─── Limits (gzipped KB) ──────────────────────────────────────────────────────
// Format: { pattern: RegExp, limitKb: number, note: string }
const LIMITS = [
  // ── App shell (cold-start critical) ──────────────────────────────────────
  { pattern: /^index-/, limitKb: 90, note: 'App shell (cold-start critical)' },
  // ── WEDGE PORTAL — must be fast, this is the entry point ─────────────────
  { pattern: /^LabPage-/, limitKb: 15, note: 'Creation Lab — wedge portal (HARD LIMIT)' },
  // ── Known complex portals — named limits ──────────────────────────────────
  { pattern: /^NexusPage-/, limitKb: 40, note: 'Nexus portal (AI interface)' },
  { pattern: /^DashboardPage-/, limitKb: 60, note: 'Dashboard (charts + data)' },
  { pattern: /^ProjectPage-/, limitKb: 40, note: 'Project portal' },
  { pattern: /^OwnerDashboard-/, limitKb: 15, note: 'Owner dashboard' },
  { pattern: /^InvestorBriefing-/, limitKb: 12, note: 'Investor briefing' },
  // ── Simple portals — must stay lean (anything not named above) ───────────
  { pattern: /^(Founder|Globe|World|Research|School|Workshop|Missions|System|NotFound|PrivacyPolicy|Terms|GovAuth)Page-/, limitKb: 15, note: 'Simple portal chunks' },
  // ── Vendors ───────────────────────────────────────────────────────────────
  { pattern: /^vendor-three-/, limitKb: 250, note: 'Three.js (lazy-loaded)' },
  { pattern: /^vendor-react-/, limitKb: 150, note: 'React runtime' },
  { pattern: /^vendor-motion-/, limitKb: 60, note: 'Framer Motion' },
  { pattern: /^vendor-query-/, limitKb: 12, note: 'React Query' },
  { pattern: /^BarChart-/, limitKb: 100, note: 'Chart library (lazy)' },
];

// ─── Read + gzip ──────────────────────────────────────────────────────────────

function gzippedKb(filePath) {
  const content = readFileSync(filePath);
  const gzipped = gzipSync(content, { level: 9 });
  return Math.round(gzipped.length / 1024 * 10) / 10;
}

function getDistFiles() {
  try {
    return readdirSync(DIST_DIR)
      .filter(f => f.endsWith('.js'))
      .map(f => ({ name: f, path: join(DIST_DIR, f) }));
  } catch {
    console.error('[BUNDLE-GATE] dist/assets not found. Run npm run build first.');
    process.exit(1);
  }
}

// ─── Check ────────────────────────────────────────────────────────────────────

const files = getDistFiles();
const failures = [];
const warnings = [];

for (const limit of LIMITS) {
  const matched = files.filter(f => limit.pattern.test(f.name));
  if (matched.length === 0) continue;

  for (const file of matched) {
    const kb = gzippedKb(file.path);
    const status = kb > limit.limitKb ? '❌ FAIL' : kb > limit.limitKb * 0.85 ? '⚠  WARN' : '✅ OK  ';

    if (kb > limit.limitKb) {
      failures.push({ file: file.name, kb, limitKb: limit.limitKb, note: limit.note });
    } else if (kb > limit.limitKb * 0.85) {
      warnings.push({ file: file.name, kb, limitKb: limit.limitKb, note: limit.note });
    }

    console.log(`${status} | ${kb.toString().padStart(6)}KB gz | ${limit.limitKb}KB limit | ${file.name}`);
  }
}

// ─── Report ───────────────────────────────────────────────────────────────────

if (warnings.length > 0) {
  console.log('\n⚠  BUNDLE WARNINGS (approaching limit):');
  warnings.forEach(w => {
    console.log(`   ${w.file}: ${w.kb}KB / ${w.limitKb}KB limit — ${w.note}`);
  });
}

if (failures.length > 0) {
  console.error('\n❌ BUNDLE SIZE GATE FAILED:');
  failures.forEach(f => {
    console.error(`   ${f.file}: ${f.kb}KB gzip exceeds ${f.limitKb}KB limit — ${f.note}`);
  });
  console.error('\nFix: split the chunk, lazy-load more aggressively, or request owner gate review.');
  process.exit(1);
}

console.log('\n✅ Bundle size gate passed.');
process.exit(0);
