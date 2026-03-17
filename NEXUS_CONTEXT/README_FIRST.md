# Eternal Nexus — README_FIRST (ler antes de qualquer ação)

**Você está dentro do único projeto oficial. Nada acontece "fora".**
Fonte da verdade: **GitHub repo** + pasta canônica `NEXUS_CONTEXT/`.

Repo: `Ivan-star-dev/Eternal-Nexus-OS`

---

## 0) DNA imutável (não discutir, só proteger)
- **Órgãos fixos:** Nexus (core), Tribunal (decisão), Atlas (percepção), Index (memória), News (voz)
- **Sacred Flow:** Tribunal → Atlas → Index → News → Streams
- **Nada de dashboards:** todo hub tem **loop vivo + evidência + próxima ação**
- **Cascata hereditária:** cada clique aprofunda (folder→folder) e **herda o DNA visual**
- **Regra Elite:** para cada tarefa, **1 pioneiro + 1 backup** (benchmark) — se não encaixa, vira issue

---

## 1) Regra operacional: 1 main + 3 branches + lab branches

### Permanent branches
- `main` = **fonte da verdade**
- `agent/claude` = arquitetura/contratos/event-bus (sistemas)
- `agent/codex` = testes/CI/quality gates
- `agent/antigravity` = ops/scaffold/releases/setup

### Lab branches (per pioneer, isolated)
Each pioneer is allowed **up to 3 lab branches**:
- `lab/<agent>/01`, `lab/<agent>/02`, `lab/<agent>/03`

Rules:
- Lab branches can be experimental/wild
- Lab branches **never merge directly to main**
- If a lab experiment becomes "real", re-implement cleanly in the agent branch with tests + report

**Merge só via PR** para `main`.

---

## 2) Workspaces (espelho por espelho no desktop)
Estrutura esperada (worktrees):
- `./` (este root) = **main**
- `./_worktrees/claude`
- `./_worktrees/codex`
- `./_worktrees/antigravity`

> Se worktrees não existirem, crie antes de continuar.

---

## 3) "Neural Link": como todas as plataformas recebem contexto
Todas as plataformas/agentes começam lendo:
- `NEXUS_CONTEXT/README_FIRST.md` (este arquivo)
- `NEXUS_CONTEXT/ROLE_CHARTER.md`
- `NEXUS_CONTEXT/DECISIONS.md`
- `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md`
- `NEXUS_CONTEXT/PROJECT_STATE.md`
- `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- `NEXUS_CONTEXT/VISUAL_DNA.md`

Post-merge sync files:
- `NEXUS_CONTEXT/INSIGHTS.md` (append-only, cross-agent learnings)
- `NEXUS_CONTEXT/STACK_REGISTRY.md` (external tech candidates)

Nada de uploads caóticos: o repo carrega a memória.

---

## 4) Protocolo de sessão — "Commit = Report = Sync"

### Começo da sessão
1) Ler `README_FIRST.md`
2) Confirmar o **papel** (`ROLE_CHARTER.md`) e o **branch**
3) Ler `PROJECT_STATE.md` + `INSIGHTS.md` para entender estado atual
4) Propor top 3 ideias alinhadas à fase + gate

### Durante a sessão
Every meaningful commit must ship:
1) **Code change**
2) **Test/evidence** (where possible)
3) **Strong report** in `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

### Fim da sessão
1) Escrever log: `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`
2) Atualizar `DECISIONS.md` se uma regra/arquitetura mudou (append-only)
3) Abrir PR para `main` com título padrão: `[agent] objetivo — gate`

### Post-merge (after PR is merged)
1) Append a "state bump" to `NEXUS_CONTEXT/PROJECT_STATE.md`
2) Update `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md` (only if it changes the phase reality)
3) Leave a "handoff note" for other agents in `NEXUS_CONTEXT/INSIGHTS.md`

---

## 5) Innovation harvesting (external tech)
- Any external repo/library must be logged in `NEXUS_CONTEXT/STACK_REGISTRY.md` first
- Validate in lab branch
- Only then re-implement cleanly in agent branch for PR

---

## 6) Releases (CLI)
Artefatos (ZIP/PDF/posters) vivem em **GitHub Releases**.
Download padrão:
```
gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS
```

---

## 7) Retention lock
> Read NEXUS_CONTEXT first. Work only in your branch. Every commit includes a LOG report.
> Ask: "Does this strengthen Sacred Flow and phase gate without soup?" If not, stop.
