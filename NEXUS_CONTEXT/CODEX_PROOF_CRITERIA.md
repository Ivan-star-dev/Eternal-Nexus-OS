# CODEX_PROOF_CRITERIA — Nervous System v1 pilot guardrails

## Purpose
Define measurable proof criteria and performance guardrails for stack-debate candidates in the Codex lane.

## Scope lock
- This file defines **verification criteria only**.
- It does not select product architecture owners.
- It does not introduce new product features.

## Candidate proof criteria (pass/fail)

### 1) MapLibre GL JS (Geopolitics runtime)
- Startup memory gate:
  - `npm run gate:memory:atlas` must pass when `maplibre-gl` imports exist.
  - Heap delta budget: `<= 180MB` during module load profile.
- Build health:
  - `npm run build` must pass with map path enabled.
- Interaction baseline:
  - no unhandled runtime exception during initial map boot in CI smoke harness (when harness is added).

### 2) PMTiles (serverless tiles package)
- Startup memory gate:
  - `npm run gate:memory:atlas` must pass when `pmtiles` imports exist.
  - Heap delta budget: `<= 80MB` during module load profile.
- Protocol safety:
  - Sacred Flow gates continue to pass (`sacred-flow` + `report-presence`).

### 3) Motion (UI transition layer)
- App quality baseline:
  - `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` all pass.
- Performance guardrail:
  - no regressions in atlas memory artifact trend once motion touches map surfaces.

### 4) kepler.gl (optional analysis hub)
- Adoption gate:
  - must remain optional and isolated from default hub routing.
  - app quality baseline must pass with feature off by default.

## CI evidence artifacts
- Primary artifact: `artifacts/map-memory-profile.json`
- Required fields:
  - `generatedAt`
  - `budgetsMb`
  - `detection`
  - `mode`
  - `moduleProfiles`

## Review protocol
- Codex owns threshold enforcement and CI signal quality.
- Claude and Copilot review threshold realism against architecture and UX pressure.
- Budgets are allowed to tighten over time with evidence, never by preference.
