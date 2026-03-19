# Eternal Nexus — Loop Protocol

> The operating cycle that turns individual pioneer sessions into a coherent organism.

## The Loop (6 phases)

```
INTAKE → ROUTING DEBATE → LEASE → EXECUTE → VERIFY → HANDOFF/DONE
   ↑                                                        ↓
   └──────────────── next pioneer reads repo ───────────────┘
```

---

## Phase 1: INTAKE

When a pioneer wakes up (new session, new model, new platform):

1. Read `docs/workspace-contract.md` — verify you are in the right repo/branch
2. Read `AGENTS.md` — confirm role + operating rules
3. Read `docs/pipeline.md` — understand the current state
4. Read `docs/task-queue/ready/` — see what is available
5. Read `docs/handoffs/to-{your-role}/` — see if someone passed you specific work
6. Read `NEXUS_CONTEXT/INSIGHTS.md` — absorb cross-pioneer learnings
7. Read `NEXUS_CONTEXT/PROJECT_STATE.md` — understand current reality

Do not skip any of these. If any file is missing, stop and report.

---

## Phase 2: ROUTING DEBATE

Before touching any task, every pioneer must answer these questions and **write the answers down** (in the lease file):

| Question | Must answer |
|----------|-------------|
| Is this my role? | architect / builder / auditor / research / design |
| Is this the right platform for me? | Claude Code / Copilot / Codex / cursor / other |
| Is this the right model class? | frontier / mid / local / cached |
| Is there a cheaper safe route? | yes/no + explanation |
| What is the fallback if my credits run out? | which pioneer + platform takes over |
| Should this go to a different pioneer? | if yes, write handoff instead |

If the answer to "is this my role?" is **no**: write a handoff to the correct role and stop.

If the answer is **yes**: proceed to lease.

---

## Phase 3: LEASE

1. Copy `docs/templates/lease.md`
2. Fill all fields (task id, role, platform, model, branch, start time, collision policy)
3. Place in `docs/task-leases/{TASK_ID}_lease.md`
4. Move task file from `ready/` to `in-progress/`
5. Commit both: `lease: claim {TASK_ID} — {pioneer} on {platform}`

**No task begins without a lease.** If a lease already exists for a task, you do not claim it. Read the lease to find the current owner and either wait or write a sidecar note.

### One-builder-per-task rule
Only one pioneer may execute a task at any time. The lease enforces `collision-policy: exclusive` by default. If a second pioneer wants the same task, they must wait for the lease to expire or be released. No exceptions. Pick a different task.

---

## Phase 4: EXECUTE

- Work only in the branch declared in your lease
- Touch only files in scope (see task file constraints)
- Do not refactor product code outside your task boundary
- After each coherent unit of work, run verification (tests, typecheck)
- If blocked: update task file status to `blocked`, document the blocker, stop

---

## Phase 5: VERIFY

Before closing:

1. Run all gate checks: `npx vitest run` + `npx -p typescript tsc --noEmit`
2. Confirm all acceptance criteria pass
3. Run Reality Pass if the scope changed during execution
4. Write execution report (what changed, what files, evidence)
5. Write verification report (commands + output)

### Binary review rule
Every PR gets exactly one review verdict: **PASS** or **FAIL**.
- PASS: all acceptance criteria in the task file are met. Merge.
- FAIL: state the specific criterion that was not met. No discussion threads. Fix and re-submit.
- No "looks good but maybe..." — the task file defines done, not the reviewer's taste.

---

## Phase 6: HANDOFF or DONE

**If work is complete:**
1. Move task file to `docs/task-queue/done/`
2. Remove lease from `docs/task-leases/`
3. **Write execution report** — what changed, what files were touched, evidence of correctness
4. Write session LOG in `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_{pioneer}_{topic}.md`
5. Append to `NEXUS_CONTEXT/PROJECT_STATE.md` (append-only)
6. Append insights to `NEXUS_CONTEXT/INSIGHTS.md` (append-only)
7. If design debt was created: add entry to design backlog with tag `[DESIGN-BACKLOG]`
8. **Scan the queue**: if fewer than 3 tasks in `ready/`, inject at least 2 new tasks before stopping
9. Commit: `done: close {TASK_ID} — {title}`

**If work is partial:**
1. Keep task in `in-progress/` with updated progress notes
2. Write handoff file: `docs/handoffs/to-{role}/{TASK_ID}_handoff.md`
3. The handoff must include the exact start prompt for the next pioneer
4. Commit: `handoff: {TASK_ID} to {role} — {reason}`

---

## Capacity / Model Fallback Chain

If a pioneer's credits run out, the model is unavailable, or the platform cannot run the task:

1. **Update the lease**: set `status: blocked`, document the blocker in `blocked-reason:`
2. **Move task to `docs/task-queue/blocked/`**
3. **Write a handoff** to the next eligible pioneer (see `docs/capacity-routing.md` for fallback order)
4. **Fallback order** (default):
   - frontier blocked → try mid-tier model on same platform
   - platform blocked → try different platform with same pioneer handle
   - pioneer blocked entirely → write handoff to next eligible pioneer in the routing chain
5. **Never leave a task silently stalled.** Blocked is a valid state. Invisible is not.

---

## Continuous Flow

The loop never stops. When a pioneer finishes or is blocked:

- If `docs/task-queue/ready/` has tasks → claim the next eligible one
- If the queue is empty → generate new tasks (scope: current phase gate, your role domain)
- If you cannot generate tasks → write a handoff to `@claude` (architect) to break down the next phase gate

**No pioneer exits the loop without leaving the queue in a better state than they found it.**

---

## Pioneer Activation

"Activation" means: **the next pioneer reads the repo and discovers ready work.**

The repo does not magically launch external applications or change model dropdowns. The loop works because:
- work is persistent in the repo
- handoffs contain exact start prompts
- the next pioneer can self-orient from repo state alone

This is the maximum safe semi-automation. It is enough.

---

## Collision Prevention

- One lease per task at a time
- If two pioneers try to claim the same task simultaneously, the second one reads the existing lease, writes a note, and picks a different task
- Leases include a `collision-policy` field: `exclusive` (default) or `sidecar-allowed`

---

## Design Debt Rule

If a task creates visible UI/UX that deviates from Visual DNA, the pioneer must:
1. Complete the task
2. Add an entry to `docs/design-backlog.md` (not INSIGHTS.md — that's for cross-pioneer learnings)
3. This becomes a future U-series task for `@copilot` + `@ui`
