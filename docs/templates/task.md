# Task Template

> Copy this file to `docs/task-queue/ready/{TASK_ID}_{slug}.md`
> Fill every field. Leave none blank — write "none" if truly not applicable.

---

## Task Header

```
id:                  {TASK_ID}           # e.g. C5, U1, A2, R1, X1
title:               {one line}
status:              ready               # ready | in-progress | blocked | done
priority:            P1                  # P0 | P1 | P2 | P3
owner-role:          builder             # architect | builder | auditor | research | design
suggested-pioneer:   @claude             # @claude | @copilot | @codex | @antigravity | any
suggested-platform:  Claude Code         # Claude Code | GitHub Copilot | Codex | cursor | any
suggested-model:     mid                 # frontier | mid | local | cached
branch:              {branch-name}
injected-by:         @{pioneer}
injected-at:         {YYYY-MM-DD}
linked-handoff:      none
linked-design-debt:  none
```

---

## Requested Outcome

> What must exist or be true when this task is done? One paragraph, concrete.

{describe the end state}

---

## Scope

> What files / domains / organs are in bounds?

- {list what is explicitly in scope}

---

## Constraints

> What must NOT be touched?

- Do not modify product source code outside the listed scope
- Do not change existing event contracts without a gate test update
- {add task-specific constraints}

---

## Acceptance Criteria

> Pass/fail conditions. All must pass before closing.

- [ ] {criterion 1}
- [ ] {criterion 2}
- [ ] Tests pass: `npx vitest run` → all green
- [ ] Type check: `npx -p typescript tsc --noEmit` → 0 errors

---

## Risk

> What could go wrong? What is the blast radius?

- {risk 1}
- {risk 2}

---

## Fallback Notes

> If the suggested pioneer/platform is unavailable, who/what takes over?

- Fallback pioneer: @{pioneer}
- Fallback platform: {platform}
- Fallback model class: {model}
- Notes: {any constraints on fallback}

---

## Linked Resources

- Related task(s): {TASK_ID or none}
- Related PR(s): {# or none}
- Related docs: {path or none}
