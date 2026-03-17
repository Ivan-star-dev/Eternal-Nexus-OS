# Eternal Nexus â€” DECISIONS (append-only)

> Regra: decisÃµes aqui sÃ£o **imutÃ¡veis** (append-only). Se mudar algo, adicione uma nova entrada explicando o motivo.

## 2026-03-17 â€” Bootstrap do â€œEcosystem OSâ€
- Decidido: **GitHub repo Ã© a fonte da verdade**, e a memÃ³ria vive em NEXUS_CONTEXT/.
- Decidido: **branches long-lived**: main, gent/claude, gent/codex, gent/antigravity.
- Decidido: **worktrees** como espelho por espelho no desktop (_worktrees/<agent>).
- Decidido: **Core Laws** do produto (órgãos fixos + sacred flow + cascata hereditária + no dashboards).

## 2026-03-17 — Collaboration Protocol ("Commit-as-Report OS")
- Decidido: **commit = report = sync**. Todo commit significativo inclui um LOG report em NEXUS_CONTEXT/LOGS/.
- Decidido: **PROJECT_STATE.md** é o snapshot do estado atual — atualizado pós-merge.
- Decidido: **INSIGHTS.md** é append-only — learnings cross-agent.
- Decidido: **STACK_REGISTRY.md** — tech externo só entra via registry → lab branch → clean PR.
- Decidido: **Lab branches** (lab/<agent>/01..03) — experimentos isolados, nunca merge direto para main.
- Decidido: **Post-merge protocol** — atualizar PROJECT_STATE + INSIGHTS após cada PR mergeado.
- Decidido: **Stop condition** — se proposta quebra DNA ou cria feature soup, parar e propor alternativa alinhada.
