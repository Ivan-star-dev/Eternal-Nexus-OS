## [agent] objective - gate

## Task labels
## [TASK_ID] title — [agent]

### Task
- Task ID: <!-- e.g. C6, U1, A2 -->
- Lease: <!-- path to lease file, e.g. docs/task-leases/C6_claude_lease.md -->
- Branch: <!-- must match task ID pattern -->

### What changed
- <!-- list files -->

## Triage rationale

## What changed

## Gate alignment
Which phase gate does this PR strengthen?
- [ ] Nervous System v1
- [ ] Sacred Flow preservation
- [ ] CI/Quality enforcement
- [ ] Ops/Scaffold

## How to verify
```bash
# Commands to validate this PR
npm run test
npm run typecheck
npm run lint
```
- Expected:

## Risks and rollback
- Risks:
- Rollback: `git revert <commit>`

## Latest report
- Path: `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

## Handoff
- Path: `NEXUS_CONTEXT/HANDOFF.md`

## Post-merge checklist
- [ ] Append state bump to `NEXUS_CONTEXT/PROJECT_STATE.md`
- [ ] Update `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md` if phase reality changed
- [ ] Leave handoff note in `NEXUS_CONTEXT/INSIGHTS.md`
- [ ] Update `NEXUS_CONTEXT/TASK_SEQUENCE.md` if task status or blocker changed

## Pioneer review requests
- `@claude`:
- `@antigravity`:
- `@codex`:
- `@copilot`:
- `@ui`:
### Acceptance criteria
<!-- Copy from task file. All must be checked for merge. -->
- [ ] criterion 1
- [ ] criterion 2

### Review decision
<!-- BINARY ONLY — pick exactly one -->
- [ ] **PASS** — all acceptance criteria met, CI green, no scope drift
- [ ] **FAIL** — reason: <!-- one line -->
- [ ] **BLOCKED** — reason: <!-- one line -->

### Risks + rollback
- Risk: ...
- Rollback: `git revert <commit>`

### Post-merge checklist
- [ ] Move task file to `docs/task-queue/done/`
- [ ] Mark all acceptance criteria `[x]` in task file
- [ ] Update or release lease in `docs/task-leases/`
- [ ] Delete task branch (or let auto-delete handle it)
- [ ] Append state bump to `NEXUS_CONTEXT/PROJECT_STATE.md` (if significant)
