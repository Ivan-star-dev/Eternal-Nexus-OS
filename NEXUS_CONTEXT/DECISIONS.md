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

## 2026-03-17 — Autonomous Task Generation + 3-Month Strategic Focus
- Decidido: **Autonomous task generation** — after every PR merge, pioneers MUST assess what's now possible and generate new tasks within their scope. No waiting for instructions. Go fast.
- Decidido: **3-month strategic focus** — build principal systems that feel ALIVE. Priority: Structure → Depth → Life. EIs must debate, Atlas must react, Index must remember, News must narrate.
- Decidido: **Pioneer debate via repo** — architecture changes and cross-agent proposals are debated in `INSIGHTS.md`. Pioneers tag each other. The repo is the meeting room.
- Decidido: **Task priority levels** — P0 (gate-breaking, fix immediately), P1 (strengthens gate), P2 (advances next phase), P3 (research/innovation in lab branch).
- Decidido: **What pioneers can do without asking** — fix bugs in scope, add tests, optimize performance, propose tech in STACK_REGISTRY, create types/contracts, write docs, generate tasks for others.
- Decidido: **What requires debate** — changing existing contracts, adding organs/flows, replacing adopted tech, cross-agent refactors.

## 2026-03-17 — Repo-as-Agent OS + Templates + Operating Windows
- Decidido: **Repo-as-Agent** — the repository is not a codebase, it is a living HQ that enforces discipline, synchronizes pioneers, and prevents soup.
- Decidido: **AGENTS.md rewritten** as the complete Repo-as-Agent OS (sections 0–11): Retention Lock, Immutable DNA, Phase Gate, Pioneer Roles, Automation Loop, Commit-as-Report, Post-Merge State Upgrade, Universal Neural Link, Drift Rule, War Room Prompt, Security/Privacy.
- Decidido: **Operating windows (Amsterdam)** — Night Ops (01:00–06:00), Day Ops (08:00–17:00). Check-in issues at window start, baton passes via HANDOFF.
- Decidido: **Templates** in `NEXUS_CONTEXT/TEMPLATES/` — HANDOFF.md, LOG_TEMPLATE.md, PROJECT_STATE_TEMPLATE.md, OPS_WINDOWS_CHECKLIST.md. Zero-friction, copy-paste ready.
- Decidido: **Organ identity upgrade** — Tribunal is the "nervous system" (decisions), Atlas is the "heart" (world consequences), Index is the "memory spine" (knowledge), News is the "voice" (narrative).
- Decidido: **Security/Privacy rule** — if repo is public, anything committed is public. No API keys, tokens, or credentials in repo. Sensitive strategy in private repo or encrypted vault.
