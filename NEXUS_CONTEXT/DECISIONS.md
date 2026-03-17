# Eternal Nexus — DECISIONS (append-only)

> Regra: decisões aqui são **imutáveis** (append-only). Se mudar algo, adicione uma nova entrada explicando o motivo.

## 2026-03-17 — Bootstrap do "Ecosystem OS"
- Decidido: **GitHub repo é a fonte da verdade**, e a memória vive em `NEXUS_CONTEXT/`.
- Decidido: **branches long-lived**: `main`, `agent/claude`, `agent/codex`, `agent/antigravity`.
- Decidido: **worktrees** como espelho por espelho no desktop (`_worktrees/<agent>`).
- Decidido: **Core Laws** do produto (órgãos fixos + sacred flow + cascata hereditária + no dashboards).

## 2026-03-17 — Collaboration OS ("Commit-as-Report")
- Decidido: **Commit = Report = Sync** — every meaningful commit includes a log with what/why/verify/risks/next/suggestions.
- Decidido: **Lab branches** (`lab/<agent>/01..03`) allow isolated experiments; never merge directly to main.
- Decidido: **Post-merge protocol** — after every PR merge: bump `PROJECT_STATE.md`, update `PROJECT_KNOWLEDGE.md` if needed, leave handoff in `INSIGHTS.md`.
- Decidido: **STACK_REGISTRY.md** — all external tech must be registered before adoption (registry → lab → clean PR).
- Decidido: **Design polish is considered always, executed last** — spine first, aesthetics after gates pass.
- Decidido: New NEXUS_CONTEXT files: `PROJECT_STATE.md`, `STACK_REGISTRY.md`, `INSIGHTS.md`.

## 2026-03-17 — 10 Operating Principles + War Room Prompt
- Decidido: **10 Operating Principles** codified in `PROJECT_KNOWLEDGE.md` (contract-first, proof-over-vibes, repo-enforced collaboration, performance budgets, etc.).
- Decidido: **Nervous System v1 phase gate** is pass/fail: deterministic + idempotent + replayable + logged + narratable.
- Decidido: **War Room Prompt** codified in `AGENTS.md` — universal instruction for all pioneers.
- Decidido: **Model Routing policy** in `NEXUS_CONTEXT/MODEL_ROUTING.md` — 4-tier routing (frontier → mid → local → cached), no trial farming.
- Decidido: **PR template** (`.github/pull_request_template.md`) enforces gate alignment, session log, post-merge checklist, and pioneer suggestions.
- Decidido: Copilot instructions (`.github/copilot-instructions.md`) updated with retention lock + 10 principles + phase gate.
