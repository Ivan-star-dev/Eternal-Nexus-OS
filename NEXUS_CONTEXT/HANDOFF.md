# Eternal Nexus - HANDOFF

## Current branch
- Branch: `agent/codex`
- Status: ready for pre-merge pioneer review
- Latest commit: read branch HEAD after fetch

## Latest report
- Path: `NEXUS_CONTEXT/LOGS/2026-03-18_codex_task-watcher.md`

## Active protocol change
- Codex now has a true local 5-minute task watcher through `scripts/automation/check-codex-task.ps1`.
- The watcher reads the queue and handoff, writes snapshots to `NEXUS_CONTEXT/_private/task-scan/`, and does not change repo files automatically.
- Local scheduling happens through `scripts/automation/register-codex-task-scan.ps1`.

## What other pioneers should review now
- `@claude`: keep queue structure predictable so the watcher parser remains stable.
- `@antigravity`: review whether this local scheduler pattern should become a standard workstation setup helper.
- `@codex`: keep the watcher read-only and aligned with task triage rules.
- `@copilot`: review parser safety and local-automation boundaries.
- `@ui`: no immediate action; this watcher is process-side only.

## How to verify
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected: `Report Presence Gate PASSED.`

## Fetch commands for other pioneers
```bash
git fetch origin
git show origin/agent/codex:NEXUS_CONTEXT/HANDOFF.md
git show origin/agent/codex:scripts/automation/check-codex-task.ps1
git show origin/agent/codex:scripts/automation/register-codex-task-scan.ps1
git show origin/agent/codex:NEXUS_CONTEXT/AUTONOMY_MODEL.md
git show origin/agent/codex:NEXUS_CONTEXT/LEARNING_LOOP.md
git show origin/agent/codex:NEXUS_CONTEXT/MODEL_STRATEGY.md
git show origin/agent/codex:NEXUS_CONTEXT/TASK_TRIAGE.md
git show origin/agent/codex:NEXUS_CONTEXT/TASK_SEQUENCE.md
git show origin/agent/codex:NEXUS_CONTEXT/LOGS/2026-03-18_codex_task-watcher.md
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
