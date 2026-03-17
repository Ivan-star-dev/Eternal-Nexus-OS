# Eternal Nexus - PROJECT_STATE

This file is the current-state snapshot for the project. After each merge, append a state bump instead of rewriting history.

## Current snapshot
- Source of truth: `main` plus `NEXUS_CONTEXT/`
- Collaboration OS: commit = report = sync
- Permanent branches: `main`, `agent/claude`, `agent/codex`, `agent/antigravity`
- Lab branches: up to three per pioneer, never merged directly to `main`
- Active priority: spine first, then gates, then ops, then polish

## Known current state
- Sacred Flow Gate exists and is wired into CI.
- Report Presence Gate now exists to enforce `HANDOFF.md` plus a topic log before merge.
- Session logs live in `NEXUS_CONTEXT/LOGS/`.
- Stable pre-merge branch broadcast now lives in `NEXUS_CONTEXT/HANDOFF.md`.
- `TASK_SEQUENCE.md` now defines the canonical ordered queue so blocked work is explicit.
- `TASK_TRIAGE.md` now defines benchmark-based ownership, labels, and short debate before assignment.
- `AUTONOMY_MODEL.md` now defines how the system can become more self-directed without drifting away from founder control.
- `LEARNING_LOOP.md` now defines how the repo learns from sessions, merges, evidence, and founder feedback.
- `MODEL_STRATEGY.md` now defines the path to a product-owned AI system before any from-scratch model ambition.
- `FOUNDER_PROFILE.template.md` now provides the safe template for a private founder-memory layer.
- Codex now has repo-owned local watcher scripts for a 5-minute task scan that write only into `NEXUS_CONTEXT/_private/task-scan/`.
- `STACK_REGISTRY.md` is now seeded with concrete candidates and benchmark tags for pioneer debate.
- `DEBATE_PROMPT_OPEN_SOURCE.md` and `SECURITY_MODEL.md` now define how to debate external adoption and what must stay private.
- Cross-pioneer handoffs are now expected through logs, PRs, `PROJECT_STATE.md`, and `INSIGHTS.md`.
- Full green CI still depends on fixing the existing `typecheck` and `lint` baseline in the app.

## State bump log
- 2026-03-17: collaboration OS bootstrapped on `agent/codex` pending merge to `main`.
- 2026-03-17: pre-merge handoff layer added with `HANDOFF.md`, PR template, and Report Presence Gate.
- 2026-03-17: open-source accelerator debate pack seeded for tagged pioneer review.
- 2026-03-17: canonical ordered task queue added in `TASK_SEQUENCE.md`.
- 2026-03-18: benchmark-based task triage added in `TASK_TRIAGE.md`, with labels and debate required before ownership is assigned.
- 2026-03-18: autonomy, learning-loop, founder-memory template, and model-ownership strategy added as the living-system layer.
- 2026-03-18: local 5-minute Codex task watcher added as repo-owned automation with private snapshots.
