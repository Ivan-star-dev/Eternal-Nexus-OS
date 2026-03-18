# 2026-03-17 - codex - stack-debate-pack

## What changed
- Updated `NEXUS_CONTEXT/STACK_REGISTRY.md`
- Created `NEXUS_CONTEXT/DEBATE_PROMPT_OPEN_SOURCE.md`
- Created `NEXUS_CONTEXT/SECURITY_MODEL.md`
- Updated `NEXUS_CONTEXT/README_FIRST.md`
- Updated `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- Updated `NEXUS_CONTEXT/PROJECT_STATE.md`
- Updated `NEXUS_CONTEXT/INSIGHTS.md`
- Updated `NEXUS_CONTEXT/HANDOFF.md`
- Updated `.github/pull_request_template.md`
- Updated `.gitignore`

## Why
- Carve the open-source debate directly into the repo so every pioneer can engage from the same source of truth.
- Seed a concrete `STACK_REGISTRY.md` so pioneers can claim candidates by benchmark tag instead of debating from zero.
- Add a dedicated debate prompt and a realistic security note so the team can debate in public-safe docs and keep private strategy out of the public repo.

## How to verify
- `Get-Content NEXUS_CONTEXT/STACK_REGISTRY.md`
  Expected: top 10 candidates with pilot plans, risks, and owner tags such as `@claude`, `@antigravity`, `@codex`, `@copilot`, and `@ui`.
- `Get-Content NEXUS_CONTEXT/DEBATE_PROMPT_OPEN_SOURCE.md`
  Expected: reusable prompt for all pioneers with lab-branch validation rules.
- `Get-Content NEXUS_CONTEXT/HANDOFF.md`
  Expected: latest report path points to this file and review asks are benchmark-tagged.
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected: `Report Presence Gate PASSED.`

## Risks
- The seeded stack list is a proposal, not a decision, so pioneers still need to score and challenge it.
- If private strategy is accidentally committed instead of stored in `NEXUS_CONTEXT/_private/` or a private repo, visibility risk remains.

## Rollback
- Revert this commit if the debate structure or candidate ordering needs a different first pass.
- The change is documentation and collaboration scaffolding only, so rollback does not affect runtime behavior.

## Next 3 tasks
1. Have each pioneer review `STACK_REGISTRY.md` and respond from their benchmark lane.
2. Select at most three near-term candidates for lab validation under the current phase gate.
3. Keep sensitive strategy in a private surface while leaving only public-safe debate artifacts in this repo.

## Suggestions for other pioneers
- `@claude`: evaluate XState, CesiumJS, deck.gl, and Yjs for architectural fit and anti-soup value.
- `@antigravity`: evaluate PMTiles, basemap packaging, and the `_private` handling workflow.
- `@codex`: define measurable pilot proof criteria and performance gates for deck.gl, Motion, and kepler.gl.
- `@copilot`: review scoring language, red flags, and whether the PR template gives enough structure for debate rounds.
- `@ui`: challenge visual-fit risks for Motion, MapLibre, basemaps, and Cytoscape before any polish execution starts.

## Potential external references
- The proposal candidates are now listed in `NEXUS_CONTEXT/STACK_REGISTRY.md`.
- No candidate is adopted yet; each one must go through registry -> lab branch -> clean agent branch -> PR.
