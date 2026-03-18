# Eternal Nexus - DECISIONS

This file is append-only. Add a new entry when a rule or operating model changes.

## 2026-03-17 - Ecosystem bootstrap
- GitHub is the source of truth and long-term memory lives in `NEXUS_CONTEXT/`.
- Long-lived branches are `main`, `agent/claude`, `agent/codex`, and `agent/antigravity`.
- Desktop mirrors use worktrees in `./_worktrees/<agent>`.
- The core laws stay fixed: organs, Sacred Flow, cascading inheritance, and no dashboards.

## 2026-03-17 - Commit-as-Report collaboration OS
- Every meaningful change must ship as code plus evidence plus a committed report.
- The report path is `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`.
- Each pioneer can use up to three lab branches, and those branches never merge directly to `main`.
- After merge, the responsible pioneer updates `PROJECT_STATE.md`, appends a handoff note in `INSIGHTS.md`, and updates `PROJECT_KNOWLEDGE.md` if the phase reality changed.
- External harvesting must be logged in `STACK_REGISTRY.md` before any lab validation or clean adoption.
- Design polish is always considered, but executed after the spine, gates, and ops layers are solid.

## 2026-03-17 - Operating principles and repo protocol
- The operating principles are codified in `PROJECT_KNOWLEDGE.md`: contract-first systems, proof-over-vibes gates, repo-enforced collaboration, performance budgets, lab isolation, and post-merge state upgrades.
- The Nervous System v1 gate is pass/fail: deterministic, idempotent, replayable, logged, and narratable.
- `AGENTS.md` remains the universal instruction surface for pioneers, while `NEXUS_CONTEXT/` carries the project memory.
- `NEXUS_CONTEXT/MODEL_ROUTING.md` defines the model supply policy; `MODEL_STRATEGY.md` defines the long-term ownership path.
- `.github/pull_request_template.md` is part of the enforcement layer for gate alignment, logs, and handoff expectations.

## 2026-03-18 - Benchmark-based task triage
- No pioneer self-assigns because a task looks fun or convenient.
- Ownership comes from benchmark fit, proven capability, labels, and a short written debate when needed.
- The canonical queue lives in `TASK_SEQUENCE.md` and the assignment protocol lives in `TASK_TRIAGE.md`.

## 2026-03-18 - Autonomy clarified
- Pioneers execute assigned branch work without micro-approval, but autonomy stays bounded by `TASK_TRIAGE.md`, `TASK_SEQUENCE.md`, `HANDOFF.md`, CI gates, and founder control points.
- Founder approval is still required for DNA changes, security/privacy changes, spending decisions, public narrative changes, model vendor changes with product impact, and destructive migrations.
- The private founder memory path is `NEXUS_CONTEXT/_private/FOUNDER_PROFILE.md`; the tracked template is `NEXUS_CONTEXT/FOUNDER_PROFILE.template.md`.

## 2026-03-18 - Local task watcher
- Codex may use a local five-minute watcher to read the queue and handoff and write snapshots into `NEXUS_CONTEXT/_private/task-scan/`.
- Local automation must stay read-only against the repo and cannot self-assign or mutate task state.

## 2026-03-18 - CI scope clarification
- Protocol changes must still run Sacred Flow and Report Presence validation.
- Install, lint, typecheck, test, and build should run only when app-facing files changed, so protocol-only PRs are not blocked by the unrelated app baseline.
- The app baseline remains real and should still fail on app changes until it is fixed at the source.
