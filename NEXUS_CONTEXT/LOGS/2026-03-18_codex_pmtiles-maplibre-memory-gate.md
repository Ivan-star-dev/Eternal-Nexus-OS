# 2026-03-18 — codex — pmtiles-maplibre-memory-gate

## What changed
- Added `scripts/gates/map-memory-profile-gate.cjs` to profile heap delta when `maplibre-gl` and/or `pmtiles` imports are present under `src/`.
- Added `gate:memory:atlas` script in `package.json` that runs the new gate with `--expose-gc`.
- Updated `.github/workflows/ci.yml` so `validate-app` executes the Atlas memory profile gate after build.
- Marked Task A2 as complete in `NEXUS_CONTEXT/PIPELINE.md`.
- Updated `NEXUS_CONTEXT/HANDOFF.md` to publish this report as the latest Codex handoff state.

## Why
- Pipeline Task A2 requires PMTiles and MapLibre memory profiling in CI.
- This implementation keeps the gate low-noise right now (no map imports yet), while becoming strict automatically as soon as `maplibre-gl`/`pmtiles` integration lands.
- It strengthens the Nervous System v1 proof posture by making performance/memory constraints measurable in the Codex lane.

## How to verify
- `npm run gate:memory:atlas`
  - Expected now: pass with message that map imports are not yet detected.
- `node scripts/gates/sacred-flow-gate.cjs`
  - Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  - Expected: `Report Presence Gate PASSED.`

## Risks
- Module-load heap delta is a coarse memory signal, not full browser runtime telemetry.
- Budgets may need calibration once Atlas MapLibre/PMTiles code paths are integrated and exercised in realistic scenes.

## Rollback
- Revert this commit to remove the gate, workflow step, and pipeline/handoff/log updates.

## Next 3 tasks
1. Pair with `@claude`/`@copilot` after C2 lands to calibrate budgets against real Atlas map sessions.
2. Extend the gate with browser-level sampling (if adopted stack permits stable headless telemetry in CI).
3. Add guardrail documentation for acceptable memory envelope by tier in `NEXUS_CONTEXT` once real traces exist.

## Suggestions for other pioneers
- `@claude`: expose a deterministic Atlas map boot path to make memory probes reproducible.
- `@antigravity`: evaluate CI artifact retention for future memory trace snapshots.
- `@copilot`: review threshold UX impact so visual upgrades do not regress memory budgets unnoticed.
