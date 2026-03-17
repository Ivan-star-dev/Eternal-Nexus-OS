# Eternal Nexus - WORKSPACE_KNOWLEDGE

## Branches and worktrees
- `main`: `./`
- `agent/claude`: `./_worktrees/claude`
- `agent/codex`: `./_worktrees/codex`
- `agent/antigravity`: `./_worktrees/antigravity`

## Canonical task queue
The ordered execution queue lives in:
`NEXUS_CONTEXT/TASK_SEQUENCE.md`

Rules:
- No task is ignored.
- Take tasks in sequence order.
- Skip only when the task is explicitly blocked and the blocker is recorded.
- The next pioneer action should always be the first unblocked task assigned to that tag by triage.

## Task triage
Task triage lives in:
`NEXUS_CONTEXT/TASK_TRIAGE.md`

Principles:
- No pioneer self-assigns work by preference.
- Every task must have labels before assignment.
- Ownership is chosen by benchmark fit and proven capability.
- Backup is the second-best fit, not a random fallback.
- If there is doubt, run a short written debate and record the result.

## Benchmark tags
Use these tags in handoffs, debate docs, and PR review requests:
- `@claude`
- `@codex`
- `@antigravity`
- `@copilot`
- `@ui`

## Commit-as-Report requirements
Every meaningful commit must carry:
- a topic log in `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`
- an updated `NEXUS_CONTEXT/HANDOFF.md`

The report must contain:
- What changed, with file paths
- Why it changed, aligned to Sacred Flow and the current phase gate
- How to verify, with commands and expected output
- Risks
- Rollback
- Next 3 tasks
- Suggestions for other pioneers
- Optional external references, with feasibility notes

## Pre-merge access for other pioneers
Before merge, every pioneer should be able to fetch one stable handoff file:

```bash
git fetch origin
git show origin/agent/<agent>:NEXUS_CONTEXT/HANDOFF.md
```

To inspect the detailed report:

```bash
git show origin/agent/<agent>:NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md
```

## Standard PR format
Title: `[agent] objective - gate`

Body:
- Task labels
- Triage rationale
- What changed
- Which gate it protects or reaches
- How to test
- Risks and rollback
- Latest report path
- Pioneer review requests

## Post-merge state upgrade
After merge, the responsible pioneer must:
1. Append a state bump to `NEXUS_CONTEXT/PROJECT_STATE.md`
2. Update `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md` if the phase reality changed
3. Append a handoff note to `NEXUS_CONTEXT/INSIGHTS.md`
4. Update `NEXUS_CONTEXT/TASK_SEQUENCE.md` to mark the completed task and unblock the next one

## External harvesting
Any external repo or library must go through:
1. `NEXUS_CONTEXT/STACK_REGISTRY.md`
2. lab branch validation
3. clean agent-branch implementation for PR

For open-source debates, use `NEXUS_CONTEXT/DEBATE_PROMPT_OPEN_SOURCE.md` and assign candidates by benchmark tag.
