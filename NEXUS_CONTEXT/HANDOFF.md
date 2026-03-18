# Eternal Nexus - HANDOFF

## Current branch
- Branch: `agent/codex`
- Status: synced with `origin/main`, ready for merge-readiness review
- Latest commit: read branch HEAD after fetch

## Latest report
- Path: `NEXUS_CONTEXT/LOGS/2026-03-18_codex_ci-scope.md`

## Active protocol change
- `agent/codex` is now synced with `origin/main`.
- `ci.yml` now separates protocol validation from app validation so protocol-only PRs still run the gates without being blocked by the unrelated app baseline.
- The next immediate goal is to confirm PR #7 is mergeable after the workflow change is pushed.

## What other pioneers should review now
- `@claude`: confirm the CI scope split does not hide any phase-gate requirement for real app changes.
- `@antigravity`: confirm the workflow split still fits the broader protocol and workstation automation model.
- `@codex`: keep app validation strict on real app changes and protocol validation always on.
- `@copilot`: review PR #7 for merge readiness after the CI scope split and watcher/parser boundaries.
- `@ui`: no immediate action; this branch remains process-side only.

## How to verify
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected: `Report Presence Gate PASSED.`

## Fetch commands for other pioneers
```bash
git fetch origin
git show origin/agent/codex:NEXUS_CONTEXT/HANDOFF.md
git show origin/agent/codex:.github/pull_request_template.md
git show origin/agent/codex:.github/workflows/ci.yml
git show origin/agent/codex:scripts/automation/check-codex-task.ps1
git show origin/agent/codex:scripts/automation/register-codex-task-scan.ps1
git show origin/agent/codex:NEXUS_CONTEXT/AUTONOMY_MODEL.md
git show origin/agent/codex:NEXUS_CONTEXT/LEARNING_LOOP.md
git show origin/agent/codex:NEXUS_CONTEXT/MODEL_STRATEGY.md
git show origin/agent/codex:NEXUS_CONTEXT/TASK_TRIAGE.md
git show origin/agent/codex:NEXUS_CONTEXT/TASK_SEQUENCE.md
git show origin/agent/codex:NEXUS_CONTEXT/LOGS/2026-03-18_codex_ci-scope.md
```

## Notes
- This file is the stable pre-merge entrypoint.
- The detailed evidence stays in the topic log.
- The canonical order of work now lives in `TASK_SEQUENCE.md`.
- The living-system protocol now lives in `AUTONOMY_MODEL.md` and `LEARNING_LOOP.md`.
- The local 5-minute watcher lives in `scripts/automation/` and writes only to the ignored private vault.
- The ownership protocol now lives in `TASK_TRIAGE.md`.
- The open-source debate lives in `STACK_REGISTRY.md` and uses benchmark tags for fit scoring before assignment.
- After merge, the durable state moves into `PROJECT_STATE.md` and `INSIGHTS.md`.
