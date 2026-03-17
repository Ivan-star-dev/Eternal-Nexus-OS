# TASK_SEQUENCE - Ordered execution queue

This file is the canonical task queue.
Every task should be applied in sequence to reduce errors and hidden drift.

## Status legend
- `queued`
- `in-progress`
- `in-review`
- `blocked`
- `done`

## Sequencing rules
1. Work from the top of the list downward.
2. Do not skip a task unless it is explicitly marked `blocked`.
3. Every blocked task must name its blocker.
4. Every task must name an owner tag and a backup tag.
5. When a task is completed or unblocked, update this file in the same PR or the next immediate follow-up.

## Current ordered queue

### T-001
- Status: `in-review`
- Owner: `@codex`
- Backup: `@copilot`
- Branch: `agent/codex`
- Task: merge the CI, Sacred Flow Gate, handoff protocol, and debate-pack PR into `main`
- Why now: it establishes the repo-wide collaboration surface, pre-merge handoff, and stack debate system
- Evidence: PR #7
- Blocker: reviewer approval and merge

### T-002
- Status: `in-review`
- Owner: `@claude`
- Backup: `@antigravity`
- Branch: `claude/magical-goodall`
- Task: merge Nervous System v1 spine into `main`
- Why now: Codex cannot add real verification coverage for the new event spine until the spine exists in the base branch or a coordinated integration branch
- Evidence: PR #8
- Blocker: reviewer approval and merge

### T-003
- Status: `blocked`
- Owner: `@codex`
- Backup: `@copilot`
- Branch: `agent/codex`
- Task: add Nervous System v1 verification suite for deterministic IDs, publish-subscribe delivery, replay, and idempotency
- Why now: this is the clearest Codex follow-up to Claude's spine work
- Acceptance target:
  - deterministic event ID tests
  - publish-subscribe propagation tests
  - replay cursor tests
  - CI command wired into the normal verification flow
- Blocker: T-002 must land first, or Claude and Codex must explicitly coordinate a shared integration branch

### T-004
- Status: `in-review`
- Owner: `@antigravity`
- Backup: `@codex`
- Branch: `agent/antigravity`
- Task: merge workspace setup and context seeding support
- Why now: reduces setup friction for every pioneer and helps the collaboration OS stick
- Evidence: PR #9
- Blocker: reviewer approval and merge

### T-005
- Status: `queued`
- Owner: `@claude`
- Backup: `@ui`
- Branch: `agent/claude`
- Task: claim and score the spine-side candidates in `STACK_REGISTRY.md`
- Why now: the stack debate should move from proposal to scored recommendations in the architecture lane
- Blocker: none once T-001 is merged, but can be reviewed pre-merge on `agent/codex`

### T-006
- Status: `queued`
- Owner: `@antigravity`
- Backup: `@ui`
- Branch: `agent/antigravity`
- Task: claim and score the packaging and private-vault candidates in `STACK_REGISTRY.md`
- Why now: PMTiles, basemap packaging, and private handling are in the ops lane
- Blocker: none once T-001 is merged, but can be reviewed pre-merge on `agent/codex`

### T-007
- Status: `queued`
- Owner: `@codex`
- Backup: `@copilot`
- Branch: `agent/codex`
- Task: define measurable pilot proof criteria and performance guardrails for debate candidates in the Codex lane
- Why now: benchmark scoring needs testability, not just taste
- Blocker: best done after T-003 or in parallel only if it stays documentation-only
