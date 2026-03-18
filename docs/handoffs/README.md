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

## Allowed Candidate Pioneer Tags

Handoffs route to specific pioneers using these tags (routing metadata — not auto-execution):

| Tag | Pioneer | Platform | Domain |
|-----|---------|----------|--------|
| `@claude` | Claude Code | Claude Code CLI | Architecture, spine, contracts, sacred flow |
| `@copilot` | GitHub Copilot | GitHub Copilot Workspace | UI, visual DNA, styling, UX, feature build |
| `@codex` | OpenAI Codex | Codex CLI / GitHub Actions | CI, tests, automation, gate verification |
| `@antigravity` | Antigravity | Antigravity platform | Ops, infra, releases, repo hygiene, PMTiles |

Every handoff must **justify** why the proposed pioneer/platform/model is the best route:
- Why is this their domain? (role fit)
- Why is this platform appropriate? (capability fit)
- What model class is needed? (see `docs/capacity-routing.md`)
- Is there a cheaper safe route? (smaller model, same platform)
- What is the fallback if they are blocked?

Without this justification, the handoff is incomplete and may be ignored by a routing-aware pioneer.

## What a Handoff Must Include

1. Task ID + current state
2. What was completed (files, commits)
3. What remains (smallest next step)
4. Why this role/pioneer is the right one to continue (with justification — see above)
5. Risks + known blockers
6. Recommended platform + model for next pioneer
7. **Exact start prompt** for the next pioneer — copy-paste ready
8. Possible adoption notes for other pioneers watching the task

## File Naming

```
{TASK_ID}_{YYYY-MM-DD}_{from-pioneer}.md
```

Example: `C5_2026-03-18_claude.md`

## Template

See `docs/templates/handoff.md`
