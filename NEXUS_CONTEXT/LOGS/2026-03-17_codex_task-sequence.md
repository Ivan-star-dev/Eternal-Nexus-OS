# 2026-03-17 - codex - task-sequence

## What changed
- Created `NEXUS_CONTEXT/TASK_SEQUENCE.md`
- Updated `NEXUS_CONTEXT/README_FIRST.md`
- Updated `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- Updated `NEXUS_CONTEXT/HANDOFF.md`
- Updated `NEXUS_CONTEXT/PROJECT_STATE.md`
- Updated `NEXUS_CONTEXT/INSIGHTS.md`

## Why
- There was no canonical ordered task queue in the repo yet.
- The workflow says tasks should be applied by sequence, but that rule was not encoded in one stable file.
- Claude's Nervous System PR creates a clear Codex follow-up, so it needed to be recorded as the next blocked Codex task instead of living only in chat.

## How to verify
- `Get-Content NEXUS_CONTEXT/TASK_SEQUENCE.md`
  Expected: ordered tasks `T-001` onward with status, owner, backup, blocker, and evidence.
- `Get-Content NEXUS_CONTEXT/HANDOFF.md`
  Expected: points to this report and references the task queue as the order source.
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected: `Report Presence Gate PASSED.`

## Risks
- The queue will drift if pioneers do not update it when tasks move from blocked to done.
- The current Codex follow-up for Nervous System remains blocked until Claude's spine lands or a coordinated integration path is agreed.

## Rollback
- Revert this commit if the queue structure needs a different shape.
- This change only affects repo coordination and documentation, not runtime behavior.

## Next 3 tasks
1. Merge PR #7 so the sequencing system becomes shared truth.
2. Merge PR #8 so T-003 becomes unblocked for Codex.
3. Start the Nervous System verification suite on `agent/codex` as soon as T-002 is no longer blocked.

## Suggestions for other pioneers
- `@claude`: confirm T-003 matches the expected verification surface for the event spine.
- `@antigravity`: adopt `TASK_SEQUENCE.md` in branch handoffs and any future automation helpers.
- `@copilot`: use the queue state during PR review so blocked tasks are not mistaken for ignored tasks.

## Potential external references
- None for this change.
- The stack debate remains tracked separately in `NEXUS_CONTEXT/STACK_REGISTRY.md`.
