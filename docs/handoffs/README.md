# Handoffs

When a pioneer cannot or should not continue a task, they write a handoff.

A handoff is the **transmission signal** — it tells the next pioneer exactly where to start, what was done, what remains, and why they are the right one to continue.

```
to-architect/   ← for @claude — contracts, spine, sacred flow
to-builder/     ← for @claude / @copilot / @codex — feature implementation
to-auditor/     ← for @codex — CI, tests, gate verification
to-research/    ← for any pioneer in lab mode — exploration, evaluation
to-design/      ← for @copilot / @ui — visual DNA, styling, UX
```

## When to Write a Handoff

- You finish a task partially and cannot continue (capacity, scope, platform)
- You receive a task that belongs to a different role
- You are blocked and the unblock requires a different pioneer
- You are at a decision point that requires debate before continuing

## What a Handoff Must Include

1. Task ID + current state
2. What was completed (files, commits)
3. What remains (smallest next step)
4. Why this role/pioneer is the right one to continue
5. Risks + known blockers
6. Recommended platform + model for next pioneer
7. **Exact start prompt** for the next pioneer — copy-paste ready

## File Naming

```
{TASK_ID}_{YYYY-MM-DD}_{from-pioneer}.md
```

Example: `C5_2026-03-18_claude.md`

## Template

See `docs/templates/handoff.md`
