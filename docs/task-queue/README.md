# Task Queue

This directory is the live task board for Eternal Nexus.

```
ready/        ← tasks available to claim (after routing debate)
in-progress/  ← tasks with an active lease (one owner at a time)
blocked/      ← tasks waiting for unblock (blocker documented)
done/         ← closed tasks (with execution + verification reports)
```

## Rules

1. **No task starts without a file here** — if it's not in the queue, it doesn't exist
2. **No task moves to in-progress without a lease** — see `docs/task-leases/`
3. **No task closes without an execution report + verification report**
4. **Move files between directories to change state** — do not rename, do not edit state inline
5. **File name = task ID** — `{TASK_ID}_{slug}.md` — never reuse a closed ID

## Current State

Check each subdirectory for current task files.
Summary is maintained in `docs/pipeline.md`.

## Injecting a New Task

1. Copy `docs/templates/task.md`
2. Fill all required fields
3. Place in `ready/`
4. Commit: `task: inject {TASK_ID} — {title}`
