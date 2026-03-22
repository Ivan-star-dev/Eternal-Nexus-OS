# Eternal Nexus - INSIGHTS

This file is append-only. Use it for merged learnings, handoff notes, and direct requests to other pioneers.

## Seed
- 2026-03-17: Commit-as-Report OS introduced on `agent/codex`; after merge, pioneers should adopt topic-based logs and post-merge state bumps.
- 2026-03-17: Before merge, pioneers should fetch the active agent branch and read `NEXUS_CONTEXT/HANDOFF.md` first, then open the detailed topic log it points to.
- 2026-03-17: Stack debate is now benchmark-tagged; pioneers should pick candidates from `STACK_REGISTRY.md` using `@claude`, `@codex`, `@antigravity`, `@copilot`, and `@ui`.
- 2026-03-17: Ordered execution now lives in `TASK_SEQUENCE.md`; blocked work must be recorded there instead of silently skipped.
- 2026-03-18: Task ownership no longer comes from preference; pioneers should use `TASK_TRIAGE.md`, label the task, run a short benchmark-fit debate when needed, and then record owner plus backup in `TASK_SEQUENCE.md`.
- 2026-03-18: The system now has a documented autonomy and learning layer; pioneers should adapt through evidence, logs, and the private founder profile instead of guessing or overfitting to one session.
- 2026-03-18: Local automation should stay read-only against the repo; Codex's 2-minute watcher writes snapshots to `NEXUS_CONTEXT/_private/task-scan/` and still obeys `TASK_SEQUENCE.md` plus `TASK_TRIAGE.md`.
- 2026-03-18: CI scope is now split so protocol-only PRs still run Sacred Flow and report gates, while install/lint/typecheck/test/build stay reserved for real app changes.

## Imported history from `main`

### 2026-03-17 - antigravity - Collaboration OS bootstrap
Learnings:
1. The seed script initially had encoding issues; the canonical context files needed to be rebuilt with stable encoding.
2. `agent/antigravity` was already acting as the ops branch and its setup conventions should be preserved.
3. `NEXUS_CONTEXT/LOGS/` was previously caught by broad log ignore patterns, which is why `.gitignore` now carries an explicit exception.

Requests to other pioneers:
- `@codex`: keep `.gitignore` compatible with tracked session logs.
- `@claude`: clarify how the event spine should relate to the existing TanStack-based nervous system when `T-003` is unblocked.

Open questions:
- Should lab branches be created preemptively, or only when a pioneer has an actual experiment to run?

### 2026-03-17 - antigravity - Operating principles and model routing
Learnings:
1. Contract-first systems, proof-over-vibes gates, and repo-enforced collaboration are now part of the project identity.
2. The PR template is part of the enforcement layer, not optional documentation.
3. Model routing exists to preserve reasoning quality without wasting expensive model capacity.

Requests to other pioneers:
- `@claude`: keep the current phase gate concrete and testable.
- `@codex`: keep PR validation aligned with the repo protocol surface.
- `@all`: use `MODEL_ROUTING.md` and the benchmark tags intentionally, not casually.
