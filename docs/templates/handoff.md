# Handoff Template

> Copy to `docs/handoffs/to-{role}/{TASK_ID}_{YYYY-MM-DD}_{from-pioneer}.md`
> Write this when you cannot or should not continue a task.
> The next pioneer must be able to start from zero using only this file + the repo.

---

## Handoff Header

```
task-id:              {TASK_ID}
task-title:           {one line}
from-pioneer:         @{your handle}
from-role:            architect | builder | auditor | research | design
to-pioneer:           @claude | @copilot | @codex | @antigravity | any eligible
to-role:              architect | builder | auditor | research | design
handoff-reason:       capacity | scope | role-mismatch | blocked | partial-completion
handed-off-at:        {YYYY-MM-DD}
recommended-platform: Claude Code | GitHub Copilot | Codex CLI | Antigravity
recommended-model:    frontier | mid | local | cached
why-this-route:       {1-2 sentences: why this pioneer/platform/model is the best fit}
fallback-if-blocked:  @{fallback pioneer} on {fallback platform}
```

---

## Current State

> Exactly what state is the task in right now?

**What was completed:**
- {file 1: what was done}
- {file 2: what was done}
- Commits: {git log --oneline since task start}

**What remains:**
- {step 1}
- {step 2}

**Smallest next step:**
> {One sentence. The absolute minimum the next pioneer must do to make progress.}

---

## Files Touched

```
{list every file modified or created}
```

---

## Risks + Blockers

- {risk 1: severity + mitigation}
- {risk 2}
- {blocker if any: what needs to happen before unblocking}

---

## Verification Needed

> What must the next pioneer check before continuing?

- [ ] {check 1}
- [ ] {check 2}
- [ ] `npx vitest run` → all green
- [ ] `npx -p typescript tsc --noEmit` → 0 errors

---

## Design Catch-Up

> Any visual debt created by this task that @copilot / @ui needs to address?

{describe or write "none"}

---

## Why This Route Is Best

> Justify the proposed pioneer, platform, and model class. Be specific.

**Role fit:** {why this role/pioneer domain matches the remaining work}
**Platform fit:** {why this platform can execute this work efficiently}
**Model class:** {why frontier/mid/local/cached is appropriate — cost vs complexity tradeoff}
**Cheaper safe route:** {is there a smaller model or simpler approach that achieves the same outcome? yes/no + reasoning}

---

## Possible Adoption Notes

> If another pioneer is watching this task and might want to adopt it instead, what should they know?

{any notes relevant to alternative adopters, or write "none — route is clear"}

---

## Start Prompt for Next Pioneer

> Copy-paste ready. The next pioneer pastes this at the start of their session.

```
You are continuing Task {TASK_ID}: {title}.

Read these files first (in order):
1. docs/workspace-contract.md
2. docs/loop-protocol.md
3. docs/task-queue/in-progress/{TASK_ID}_{slug}.md
4. docs/task-leases/{TASK_ID}_lease.md (if still active)
5. docs/handoffs/to-{role}/{TASK_ID}_{date}_{from-pioneer}.md (this file)
6. NEXUS_CONTEXT/PROJECT_STATE.md
7. NEXUS_CONTEXT/INSIGHTS.md

Context:
{2-3 sentences summarizing what was done and why}

What remains:
{exact next step}

Constraints:
{what must NOT be changed}

Acceptance criteria:
{what must be true to close}

Platform: {platform}
Model: {model class}
Branch: {branch}
```
