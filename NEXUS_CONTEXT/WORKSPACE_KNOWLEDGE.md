# Eternal Nexus - WORKSPACE_KNOWLEDGE

## Branches and worktrees
- `main`: `./`
- `agent/claude`: `./_worktrees/claude`
- `agent/codex`: `./_worktrees/codex`
- `agent/antigravity`: `./_worktrees/antigravity`

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

## External harvesting
Any external repo or library must go through:
1. `NEXUS_CONTEXT/STACK_REGISTRY.md`
2. lab branch validation
3. clean agent-branch implementation for PR
