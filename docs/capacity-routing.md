# Eternal Nexus — Capacity Routing

> Before claiming any task, every pioneer must assess capacity and route to the correct model/platform.
> This is not optional. It is part of the routing debate.

## Capacity States

| State | Meaning | Action |
|-------|---------|--------|
| `green` | Full capacity, no limits | Proceed normally |
| `yellow` | Usage approaching limit | Prefer cheaper-safe routes. Avoid redundant work. |
| `red` | Near limit | Only P0/P1 tasks. Hand off P2/P3 to other pioneer. |
| `blocked` | Credits exhausted / platform down | Stop. Write handoff immediately. |
| `unknown` | Cannot assess | Treat as yellow. |

## Model Classes

| Class | When to use | Examples |
|-------|-------------|---------|
| `frontier` | Complex architecture, multi-file reasoning, gate design, new organs | Claude Opus, GPT-4o, Gemini Ultra |
| `mid` | Standard implementation, tests, refactors, docs | Claude Sonnet, GPT-4o-mini |
| `local` | Repetitive tasks, search, grep, simple edits | Local models, cached responses |
| `cached` | Re-running known patterns, template fills | Any model with prompt cache |

## Task Complexity → Model Routing

| Task Type | Recommended Class | Rationale |
|-----------|------------------|-----------|
| New organ / sacred flow contract change | `frontier` | High risk, multi-file impact |
| Gate test suite | `frontier` or `mid` | Logic-heavy but bounded |
| Feature implementation (bounded) | `mid` | Standard builder work |
| CSS / styling / visual DNA | `mid` or `local` | Low complexity |
| CI scripts / ops | `mid` | Scripting, not reasoning |
| Documentation / templates | `local` or `cached` | Pattern-fill work |
| Research / lab exploration | `frontier` | Open-ended reasoning |

## Cheaper-Safe Route Policy

Before using a frontier model, ask:
1. Can a `mid` model do this with the same correctness?
2. Is this task bounded enough that the model class doesn't matter?
3. Am I using frontier because it's genuinely needed, or just habit?

If the answer is "mid is fine" → use mid. Save frontier for when it matters.

## Platform Routing

| Pioneer | Primary Platform | Fallback |
|---------|-----------------|---------|
| @claude | Claude Code (Sonnet/Opus) | Any Claude API |
| @copilot | GitHub Copilot | Claude Code |
| @codex | OpenAI Codex / ChatGPT | Claude Code |
| @antigravity | Claude Code / scripts | Any terminal |

## When Capacity Is Low

1. **Yellow:** Finish current task. Don't start new P2/P3. Write handoff on close.
2. **Red:** Finish the current coherent unit only. Write handoff immediately after. Tag `[CAPACITY-RED]` in the handoff.
3. **Blocked:** Write handoff NOW. Record: task state, files touched, exact next step, which pioneer should continue, why.

## Fallback Chain

If `@claude` is blocked:
→ @copilot picks up UI/design tasks
→ @codex picks up CI/test tasks
→ @antigravity picks up ops tasks
→ Architecture tasks wait for @claude (no other pioneer owns the spine)

If `@copilot` is blocked:
→ @claude can do minimal UI wiring if P0
→ Design tasks wait for @copilot or @ui

If `@codex` is blocked:
→ @antigravity can handle CI scripts
→ Performance analysis waits for @codex

## Declaring Capacity in Lease

Every lease must include:
```
capacity-state: green | yellow | red | unknown
model-class: frontier | mid | local | cached
cheaper-safe-route-considered: yes | no
fallback-pioneer: @{pioneer}
```
