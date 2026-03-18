# Eternal Nexus — Pipeline

> The repository is the transmission channel. Every task flows through this pipeline. No exceptions.

## Queue Philosophy

The pipeline is never idle. When all tasks are done, pioneers generate new ones — they do not wait.

- **Foundation-first**: Architectural correctness (Sacred Flow, event contracts, gate proofs) takes absolute priority over UI/UX polish. No UI task can block a foundation task.
- **Continuous flow**: A pioneer finishing a task immediately scans the queue for the next. If the queue has fewer than 3 ready tasks, the pioneer must inject at least 2 new ones before stopping.
- **Task discovery from repo**: Pioneers discover work by reading this file + `docs/task-queue/ready/`. No direct instructions required — the repo is self-describing.
- **Ideation and optimization tasks are valid**: A task that improves performance, reduces tech debt, adds observability, or researches a future phase belongs in the queue with a P2 or P3 priority. They are not "lesser" — they are how the organism improves itself.
- **Temporary UI/UX coverage**: UI tasks are allowed when they unblock a foundation deliverable (e.g., a test harness needs a visible output) or prevent a delivery bottleneck (e.g., a missing map shell blocks atlas integration). They must be scoped to the minimum needed and marked `temporary-ui: true` in the task file.

## Task States

```
READY → IN-PROGRESS → DONE
          ↓
        BLOCKED → READY (after unblocking)
```

| State | Location | Meaning |
|-------|----------|---------|
| `ready` | `docs/task-queue/ready/` | Claimed by no one. Any eligible pioneer can pick it up after routing debate. |
| `in-progress` | `docs/task-queue/in-progress/` | A pioneer has placed a lease. One owner at a time. |
| `blocked` | `docs/task-queue/blocked/` | Cannot proceed. Blocker documented. Waits for unblock. |
| `done` | `docs/task-queue/done/` | Closed with execution report + verification. |

## Task File Naming

```
{TASK_ID}_{short-slug}.md
```

Examples:
- `C5_event-bus-persistence.md`
- `U1_dark-glassmorphism-map.md`
- `A2_ci-perf-gate.md`

## Task ID Convention

| Prefix | Domain |
|--------|--------|
| `C` | Core architecture (spine, organs, event bus) |
| `U` | UI / design / visual DNA |
| `A` | Ops / audit / CI / infra |
| `R` | Research / lab branch |
| `X` | Cross-cutting (multiple pioneers) |

IDs are sequential per domain: C1, C2, C3... Never reuse a closed ID.

## Task Metadata (required)

Every task file must include:
- `id` — unique task ID
- `title` — one line
- `status` — ready / in-progress / blocked / done
- `owner-role` — architect / builder / auditor / research / design
- `priority` — P0 / P1 / P2 / P3
- `suggested-pioneer` — @claude / @copilot / @codex / @antigravity / any
- `suggested-platform` — Claude Code / GitHub Copilot / Codex / cursor / any
- `suggested-model` — frontier / mid / local / cached (see capacity-routing.md)
- `branch` — required branch name
- `scope` — what is in bounds
- `constraints` — what is out of bounds
- `acceptance-criteria` — pass/fail conditions
- `linked-handoff` — path to handoff file if relevant

Use template: `docs/templates/task.md`

## Priority Levels

| Priority | Meaning | Action |
|----------|---------|--------|
| P0 | Breaks gate or Sacred Flow | Fix immediately. No debate. |
| P1 | Strengthens current phase gate | Execute in pioneer branch. |
| P2 | Advances next phase | Routing debate required before claim. |
| P3 | Research / innovation | Lab branch only. Never merge directly. |

## Pipeline Summary (Current)

```
PHASE 1 — COMPLETE ✅  (proven: 70 gate tests)
  DONE: C1, C2, C3, C4, C4b, C5, U1, U2, A2, A3

PHASE 2 — IN PROGRESS 🔶
  READY:       C6, C7, U3, U4, A4, A5
  IN-PROGRESS: (check docs/task-queue/in-progress/)
  BLOCKED:     (none)

Phase 2 gate proof: src/test/phase2-gates.test.ts  (task A5)
```

## Injecting a New Task

1. Copy `docs/templates/task.md`
2. Fill all required fields
3. Place file in `docs/task-queue/ready/`
4. Commit with message: `task: inject {TASK_ID} — {title}`

No task begins without a file in this queue.
