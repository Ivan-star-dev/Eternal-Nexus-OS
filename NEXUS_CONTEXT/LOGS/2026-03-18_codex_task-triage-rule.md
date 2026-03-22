# 2026-03-18 - codex - task-triage-rule

## What changed
- Created `NEXUS_CONTEXT/TASK_TRIAGE.md`
- Updated `NEXUS_CONTEXT/README_FIRST.md`
- Updated `NEXUS_CONTEXT/ROLE_CHARTER.md`
- Updated `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- Updated `NEXUS_CONTEXT/TASK_SEQUENCE.md`
- Updated `NEXUS_CONTEXT/HANDOFF.md`
- Updated `NEXUS_CONTEXT/PROJECT_STATE.md`
- Updated `NEXUS_CONTEXT/INSIGHTS.md`
- Updated `NEXUS_CONTEXT/DEBATE_PROMPT_OPEN_SOURCE.md`
- Updated `NEXUS_CONTEXT/STACK_REGISTRY.md`
- Updated `.github/pull_request_template.md`

## Why
- Encode the new team rule: no pioneer self-assigns because they like a task.
- Force ownership to come from benchmark-based triage, proven skill, labels, and short debate.
- Make task labels and triage rationale visible in the queue and PR surface.
- Make the stable handoff and merged-state files point to the same task-pickup rule.

## How to verify
- `Get-Content NEXUS_CONTEXT/TASK_TRIAGE.md`
  Expected: benchmark-based ownership protocol with labels, scoring logic, and tie-break rules.
- `Get-Content NEXUS_CONTEXT/TASK_SEQUENCE.md`
  Expected: each task has labels and triage rationale.
- `Get-Content NEXUS_CONTEXT/HANDOFF.md`
  Expected: points pioneers to `TASK_TRIAGE.md` and this report before they pick work.
- `Get-Content .github/pull_request_template.md`
  Expected: includes `Task labels` and `Triage rationale`.
- `node scripts/gates/sacred-flow-gate.cjs`
  Expected: `Sacred Flow Gate PASSED.`
- `node scripts/gates/report-presence-gate.cjs`
  Expected: `Report Presence Gate PASSED.`

## Risks
- The rule adds discipline, so pioneers must actually record labels and triage instead of skipping straight to implementation.
- Older tasks may need to be normalized into the new format over time.

## Rollback
- Revert this commit if the triage protocol needs a different format.
- The change affects workflow and documentation, not runtime behavior.

## Next 3 tasks
1. Push this branch update so every pioneer can fetch the triage rule before merge.
2. Merge PR #7 so the rule becomes shared truth in `main`.
3. Use the triage rule when unblocking and assigning T-003 after PR #8.

## Suggestions for other pioneers
- `@claude`: challenge the triage rationale if any architecture task is assigned to the wrong benchmark lane.
- `@antigravity`: reuse the same labels and triage structure for ops and release tasks.
- `@copilot`: review PRs against the new triage fields, not just code diffs.

## Potential external references
- None for this rule change.
- Benchmark scoring for external tools remains in `STACK_REGISTRY.md`.
