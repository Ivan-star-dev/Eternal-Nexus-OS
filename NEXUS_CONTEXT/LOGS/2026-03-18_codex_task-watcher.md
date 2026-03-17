# 2026-03-18 - codex - task-watcher

## What changed
- Created `scripts/automation/check-codex-task.ps1`
- Created `scripts/automation/register-codex-task-scan.ps1`
- Created `scripts/automation/unregister-codex-task-scan.ps1`
- Updated `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- Updated `NEXUS_CONTEXT/HANDOFF.md`
- Updated `NEXUS_CONTEXT/PROJECT_STATE.md`
- Updated `NEXUS_CONTEXT/INSIGHTS.md`
- Registered the local scheduled task `EternalNexus_CodexTaskScan` on this machine

## Why
- Add a true local 5-minute task watcher for Codex because the app-level automation only supports hourly cadence.
- Keep the watcher inside the repo workflow: read queue, report current Codex task or blocker, write snapshots into the ignored private vault, and never auto-edit the repo.

## How to verify
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/automation/check-codex-task.ps1`
  Expected: prints the current Codex task summary and writes `latest.md` plus `latest.json` under `NEXUS_CONTEXT/_private/task-scan/`.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/automation/register-codex-task-scan.ps1`
  Expected: registers `EternalNexus_CodexTaskScan` and prints the next run time.
- `Get-ScheduledTask -TaskName EternalNexus_CodexTaskScan`
  Expected: returns the scheduled task definition.
- `Start-ScheduledTask -TaskName EternalNexus_CodexTaskScan`
  Expected: the snapshot files under `NEXUS_CONTEXT/_private/task-scan/` get a fresh timestamp and `Get-ScheduledTaskInfo -TaskName EternalNexus_CodexTaskScan` shows `LastTaskResult : 0`.
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected: `Report Presence Gate PASSED.`

## Risks
- The watcher is local-machine automation, so it must not be confused with shared repo truth.
- If the queue format changes, the parser will need an update.

## Rollback
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/automation/unregister-codex-task-scan.ps1`
- Revert this commit if the watcher should not remain in the repo.

## Next 3 tasks
1. Merge PR #7 so the watcher scripts and living-system layer reach `main`.
2. Decide whether `@antigravity` should mirror this watcher pattern for broader local automation support.
3. Keep the watcher parser aligned if `TASK_SEQUENCE.md` gains a new field layout.

## Suggestions for other pioneers
- `@antigravity`: review the local scheduler pattern for future secure automations and workstation setup.
- `@copilot`: review the watcher for parser fragility and local-automation safety.
- `@claude`: keep queue format changes predictable so local watchers do not drift.

## Potential external references
- None.
- This watcher is intentionally local and repo-owned, not service-backed.
