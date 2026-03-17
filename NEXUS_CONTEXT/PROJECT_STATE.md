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
- Session logs live in `NEXUS_CONTEXT/LOGS/`.
- Cross-pioneer handoffs are now expected through logs, PRs, `PROJECT_STATE.md`, and `INSIGHTS.md`.
- Full green CI still depends on fixing the existing `typecheck` and `lint` baseline in the app.

## State bump log
- 2026-03-17: collaboration OS bootstrapped on `agent/codex` pending merge to `main`.
