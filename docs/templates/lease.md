# Lease Template

> Copy to `docs/task-leases/{TASK_ID}_lease.md`
> Fill before moving any task to in-progress.
> One lease per task at a time.

---

## Lease Contract

```
task-id:                    {TASK_ID}
task-title:                 {one line}
pioneer:                    @{pioneer}
role:                       architect | builder | auditor | research | design
platform:                   Claude Code | GitHub Copilot | Codex | cursor | other
model-class:                frontier | mid | local | cached
model-specific:             {exact model if known, e.g. claude-sonnet-4-6}
branch:                     {branch name}
repo-root:                  {absolute path verified}
started-at:                 {YYYY-MM-DD HH:MM UTC}
collision-policy:           exclusive | sidecar-allowed
fallback-pioneer:           @{pioneer}
fallback-platform:          {platform}
capacity-state:             green | yellow | red | unknown
cheaper-safe-route:         yes | no
cheaper-safe-route-notes:   {why this model/platform was chosen over cheaper option, or "N/A"}
```

---

## Routing Debate Record

> Answer every question before claiming. This is mandatory.

**Is this my role?**
{yes/no + one line justification}

**Is this the right platform?**
{yes/no + why}

**Is this the right model class?**
{frontier/mid/local/cached + why}

**Is there a cheaper safe route?**
{yes/no + if yes, why not taking it}

**What is the fallback if my credits run out?**
{pioneer + platform + handoff trigger condition}

**Should this go to a different pioneer?**
{yes/no — if yes, stop here and write a handoff instead}

---

## Progress Notes

> Update as work progresses. Last updated: {date}

- {what has been done so far}
- {current stopping point}
- {what remains}
