# 2026-03-18 — codex — audit-fixes

## What changed
- Updated `scripts/gates/report-presence-gate.cjs` to use a `spawnSync`-based git runner that captures stderr and throws cleanly without leaking noisy fatal output.
- Added `--quiet` to the remote base `rev-parse` probe in the report gate.
- Regenerated `package-lock.json` using `npm install --package-lock-only` to fix package/lock drift discovered during audit.
- Updated `NEXUS_CONTEXT/HANDOFF.md` to publish this report.

## Why
- Audit found noisy `fatal: Needed a single revision` output despite successful gate pass.
- Audit also found `npm ci` previously failing for lock drift (`Missing: esbuild@ from lock file`).
- Goal: restore signal quality and lock consistency before further CI claims.

## How to verify
- `node scripts/gates/report-presence-gate.cjs`
  - Expected: pass/fail output without unrelated fatal git noise.
- `node scripts/gates/sacred-flow-gate.cjs`
  - Expected: `Sacred Flow Gate PASSED.`
- `npm ci`
  - Expected now in this environment: lock-drift error is gone; remaining blocker is external package registry access (`403`).

## Risks
- Lockfile refresh can produce transitive metadata churn depending on npm version.
- Report gate behavior depends on local git context when remote refs are missing.

## Rollback
- Revert this commit to restore previous gate runner and prior lockfile.

## Next 3 tasks
1. Re-run full app checks (`typecheck/lint/test/build`) in an environment with registry access.
2. Add a tiny regression test harness for report-gate stderr cleanliness.
3. Coordinate with antigravity for reproducible package mirror policy in CI.

## Suggestions for other pioneers
- `@antigravity`: confirm npm registry/network policy for CI runners.
- `@claude`: verify no protocol assumptions rely on old noisy stderr behavior.
- `@copilot`: review audit language and merge readiness notes for clarity.
