# 2026-03-18 — codex — memory-gate-hardening

## What changed
- Hardened `scripts/gates/map-memory-profile-gate.cjs`:
  - records richer memory snapshots (`rss`, `heapUsed`, `heapTotal`, `external`)
  - writes machine-readable artifact JSON to `artifacts/map-memory-profile.json`
  - records detection metadata and strict/armed mode in output.
- Updated `.github/workflows/ci.yml` to upload the memory artifact via `actions/upload-artifact@v4`.
- Added `NEXUS_CONTEXT/CODEX_PROOF_CRITERIA.md` with measurable pilot proof criteria and guardrails for Codex lane candidates.
- Updated `NEXUS_CONTEXT/TASK_SEQUENCE.md` to mark T007 as done with evidence.
- Updated `NEXUS_CONTEXT/HANDOFF.md` to publish this report as latest state.

## Why
- Previous memory gate signal was too opaque for review and trend tracking.
- Artifact-backed evidence makes CI outcomes auditable and supports future threshold calibration.
- T007 requires measurable proof criteria, not preference-based candidate scoring.

## How to verify
- `npm run gate:memory:atlas`
  - Expected now: pass; writes `artifacts/map-memory-profile.json`; mode is `armed-no-imports` on current codebase.
- `node scripts/gates/sacred-flow-gate.cjs`
  - Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  - Expected: `Report Presence Gate PASSED.`

## Risks
- Module-load profiling is still a coarse signal and does not replace browser runtime memory traces.
- Artifact trend value depends on consistent CI execution over time.

## Rollback
- Revert this commit to restore the prior memory gate and remove artifact/proof-criteria changes.

## Next 3 tasks
1. Calibrate memory thresholds after C2 introduces real `maplibre-gl`/`pmtiles` imports.
2. Add a browser-level memory smoke harness once map shell exists in the app path.
3. Define a simple artifact trend checker to detect regressions across recent runs.

## Suggestions for other pioneers
- `@claude`: expose deterministic map boot path to stabilize memory measurements.
- `@antigravity`: align artifact retention TTL with CI storage budgets.
- `@copilot`: keep visual style growth within measurable memory envelope limits.
