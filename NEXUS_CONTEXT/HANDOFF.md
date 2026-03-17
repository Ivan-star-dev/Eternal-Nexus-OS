# Eternal Nexus - HANDOFF

## Current branch
- Branch: `agent/codex`
- Status: ready for pre-merge pioneer review
- Latest commit: read branch HEAD after fetch

## Latest report
- Path: `NEXUS_CONTEXT/LOGS/2026-03-18_codex_task-triage-rule.md`

## Active protocol change
- Task ownership now follows `NEXUS_CONTEXT/TASK_TRIAGE.md`.
- No pioneer should self-claim a task because it looks fun or convenient.
- Every task now needs labels, benchmark-fit debate, owner tag, backup tag, and recorded triage rationale.

## What other pioneers should review now
- `@claude`: challenge any triage result that assigns architecture work outside the strongest benchmark lane.
- `@antigravity`: mirror the same labels and triage rationale for ops and setup tasks.
- `@codex`: apply the new triage rule before taking T-003 or any proof-criteria work.
- `@copilot`: review PRs for missing labels, missing triage rationale, or preference-based task claims.
- `@ui`: join benchmark-fit debate when visual or map-runtime tasks need a stronger owner decision.

## How to verify
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected: `Report Presence Gate PASSED.`

## Fetch commands for other pioneers
```bash
git fetch origin
git show origin/agent/codex:NEXUS_CONTEXT/HANDOFF.md
git show origin/agent/codex:NEXUS_CONTEXT/TASK_TRIAGE.md
git show origin/agent/codex:NEXUS_CONTEXT/TASK_SEQUENCE.md
git show origin/agent/codex:NEXUS_CONTEXT/LOGS/2026-03-18_codex_task-triage-rule.md
```

## Notes
- This file is the stable pre-merge entrypoint.
- The detailed evidence stays in the topic log.
- The canonical order of work now lives in `TASK_SEQUENCE.md`.
- The ownership protocol now lives in `TASK_TRIAGE.md`.
- The open-source debate lives in `STACK_REGISTRY.md` and uses benchmark tags for fit scoring before assignment.
- After merge, the durable state moves into `PROJECT_STATE.md` and `INSIGHTS.md`.
