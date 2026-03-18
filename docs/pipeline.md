# Eternal Nexus — Pipeline

> The repository is the transmission channel. Every task flows through this pipeline. No exceptions.

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
READY:       C4b, C5, U1, U2, A2, A4
IN-PROGRESS: (check docs/task-queue/in-progress/)
BLOCKED:     (check docs/task-queue/blocked/)
DONE:        C1, C2, C3, C4, A3
```

## Injecting a New Task

1. Copy `docs/templates/task.md`
2. Fill all required fields
3. Place file in `docs/task-queue/ready/`
4. Commit with message: `task: inject {TASK_ID} — {title}`

No task begins without a file in this queue.
