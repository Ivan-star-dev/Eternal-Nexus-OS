# Task Leases

A lease means: **one pioneer has claimed this task and is actively working on it.**

No two pioneers can hold a lease on the same task simultaneously.

## Lease File Naming

```
{TASK_ID}_lease.md
```

## Lease Lifecycle

1. Pioneer completes routing debate → decides to claim
2. Pioneer creates `{TASK_ID}_lease.md` here
3. Pioneer moves task from `ready/` to `in-progress/`
4. Pioneer commits both in one commit: `lease: claim {TASK_ID}`
5. On completion: lease file is deleted, task moves to `done/`
6. On handoff: lease file is updated with handoff details, new pioneer creates new lease

## Collision Policy

If you arrive and a lease already exists:
- Read the lease to see who owns it and when they started
- Do NOT claim the same task
- Pick a different ready task
- If the lease is stale (no commits for 24+ hours), write a note in `NEXUS_CONTEXT/INSIGHTS.md` tagging the pioneer

## Template

See `docs/templates/lease.md`
