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
