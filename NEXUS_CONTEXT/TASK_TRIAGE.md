# TASK_TRIAGE - Benchmark-based ownership protocol

This file defines how the team decides who should own a task.

## Core principle
No pioneer decides ownership because they like a task.
Ownership comes from benchmark fit, proven capability, current blockers, and team debate.

## Required task labels
Every task should be labeled before assignment:
- organ
- subsystem
- task type
- gate or phase
- effort size
- blocker state

Example:
`organ:atlas`, `type:verification`, `gate:nervous-system-v1`, `effort:M`, `blocked:no`

## Triage steps
1. Write the task with labels.
2. List the benchmark tags that could plausibly own it.
3. Run a short written debate using the handoff or PR as the discussion surface.
4. Score fit for each candidate based on proven skill, not preference.
5. Pick the highest-fit pioneer as owner and the next strongest as backup.
6. Record the result in `TASK_SEQUENCE.md`.

## Debate loop
Use this when ownership is not obvious:
1. Label the task first.
2. Let each plausible pioneer tag write a short benchmark-fit claim.
3. Compare who can execute, verify, and land it with the least drift.
4. Record the winner and backup in `TASK_SEQUENCE.md`.
5. Link the debate surface from `NEXUS_CONTEXT/HANDOFF.md` if it affects the next active task.

The debate is not a popularity vote.
It exists to prove which pioneer is the best fit for the task right now.

## Benchmark-fit questions
- Who has already proved capability in this lane?
- Who can finish it with the least architectural or operational risk?
- Who is best positioned to verify it, not just start it?
- Does ownership create cross-branch drift, or reduce it?
- Does the task depend on a branch, gate, or subsystem that one pioneer already controls?

## Tie-break rule
If two pioneers look equally capable:
1. prefer the one whose benchmark lane already matches the task type
2. prefer the one who reduces branch hopping and dependency risk
3. keep the other as backup

## Anti-patterns
- self-assigning because the task looks fun
- assigning based only on availability
- skipping labels
- jumping ahead of blocked tasks without recording why
