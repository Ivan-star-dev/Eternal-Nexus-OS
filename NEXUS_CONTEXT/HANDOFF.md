# Eternal Nexus - HANDOFF

## Current branch
- Branch: `agent/codex`
- Status: synced with `origin/main`, ready for merge-readiness review
- Latest commit: read branch HEAD after fetch

## Latest report
- Path: `NEXUS_CONTEXT/LOGS/2026-03-18_codex_main-sync.md`

## Active protocol change
- `agent/codex` has been merged with the latest `origin/main` locally to clear PR drift.
- The task-triage, autonomy, and local watcher layers remain intact after the sync.
- The next immediate goal is to confirm PR #7 is mergeable and free of protocol regressions.

## What other pioneers should review now
- `@claude`: confirm the merged protocol docs do not regress the current phase gate or queue assumptions.
- `@antigravity`: confirm the sync preserved the workstation and automation conventions already on `main`.
- `@codex`: keep PR #7 mergeable and preserve the read-only watcher boundaries.
- `@copilot`: review PR #7 for merge readiness, parser safety, and local-automation boundaries.
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
git show origin/agent/codex:scripts/automation/check-codex-task.ps1
git show origin/agent/codex:scripts/automation/register-codex-task-scan.ps1
git show origin/agent/codex:NEXUS_CONTEXT/AUTONOMY_MODEL.md
git show origin/agent/codex:NEXUS_CONTEXT/LEARNING_LOOP.md
git show origin/agent/codex:NEXUS_CONTEXT/MODEL_STRATEGY.md
git show origin/agent/codex:NEXUS_CONTEXT/TASK_TRIAGE.md
git show origin/agent/codex:NEXUS_CONTEXT/TASK_SEQUENCE.md
git show origin/agent/codex:NEXUS_CONTEXT/LOGS/2026-03-18_codex_main-sync.md
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
