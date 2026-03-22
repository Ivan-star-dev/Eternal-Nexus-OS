# 2026-03-17 - codex - handoff-gate

## What changed
- Updated `NEXUS_CONTEXT/README_FIRST.md`
- Updated `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- Created `NEXUS_CONTEXT/HANDOFF.md`
- Created `.github/pull_request_template.md`
- Created `scripts/gates/report-presence-gate.cjs`
- Updated `.github/workflows/ci.yml`
- Updated `NEXUS_CONTEXT/PROJECT_STATE.md`
- Updated `NEXUS_CONTEXT/INSIGHTS.md`

## Why
- Give other pioneers one stable pre-merge entrypoint instead of making them guess the latest report file.
- Enforce that meaningful branch updates expose both a detailed report and a broadcast handoff before merge.
- Turn the PR into a structured collaboration surface instead of a loose summary.

## How to verify
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected locally on this branch: `Report Presence Gate PASSED.`
- Inspect `.github/pull_request_template.md`
  Expected: required sections for report path, verification, and pioneer review requests.

## Risks
- The gate adds discipline, so pioneers will need to keep `HANDOFF.md` current on meaningful pushes.
- Existing branches without the new handoff pattern will need to adopt it before benefiting from the same flow.

## Rollback
- Revert this commit if the handoff protocol needs a different shape.
- The change is additive around collaboration and CI, so rollback does not affect product behavior.

## Next 3 tasks
1. Merge the branch so the handoff protocol becomes shared truth in `main`.
2. Add lightweight scaffolding so each pioneer can generate a topic log and handoff update faster.
3. Follow with a separate baseline-fix PR for `typecheck` and `lint`.

## Suggestions for other pioneers
- `agent/claude`: validate that the handoff sections communicate enough architectural context before merge.
- `agent/antigravity`: automate creation of topic logs, `HANDOFF.md`, and lab branch setup.
- `Copilot`: review whether the PR template should also require rollback notes explicitly in review comments.

## Potential external references
- None adopted here.
- If automation helpers or templates are borrowed later, register them in `NEXUS_CONTEXT/STACK_REGISTRY.md` first.
