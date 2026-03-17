# Eternal Nexus — README_FIRST (ler antes de qualquer ação)

**Você está dentro do único projeto oficial. Nada acontece "fora".**
Fonte da verdade: **GitHub repo** + pasta canônica NEXUS_CONTEXT/.

Repo: Ivan-star-dev/Eternal-Nexus-OS

---

## 0) DNA imutável (não discutir, só proteger)
- **Órgãos fixos:** Nexus (core), Tribunal (decisão), Atlas (percepção), Index (memória), News (voz)
- **Sacred Flow:** Tribunal → Atlas → Index → News → Streams
- **Nada de dashboards:** todo hub tem **loop vivo + evidência + próxima ação**
- **Cascata hereditária:** cada clique aprofunda (folder→folder) e **herda o DNA visual**
- **Regra Elite:** para cada tarefa, **1 pioneiro + 1 backup** (benchmark) — se não encaixa, vira issue

---

## 1) Regra operacional: 1 main + 3 agent branches + lab branches

### Agent branches (long-lived)
- main = **fonte da verdade**
- agent/claude = arquitetura/contratos/event-bus (sistemas)
- agent/codex = testes/CI/quality gates
- agent/antigravity = ops/scaffold/releases/setup

**Merge só via PR** para main.

### Lab branches (isoladas, por pioneiro)
Cada pioneiro pode ter até **3 lab branches**:
- `lab/<agent>/01`, `lab/<agent>/02`, `lab/<agent>/03`

Regras:
- Lab branches podem ser experimentais (wild)
- Lab branches **nunca fazem merge direto para main**
- Se um experimento vira "real": re-implementar limpo no agent branch com testes + report → PR

---

## 2) Workspaces (espelho por espelho no desktop)
Estrutura esperada (worktrees):
- ./ (este root) = **main**
- ./_worktrees/claude
- ./_worktrees/codex
- ./_worktrees/antigravity

> Se worktrees não existirem, crie antes de continuar.

---

## 3) "Neural Link": como todas as plataformas recebem contexto
Todas as plataformas/agentes começam lendo:
- NEXUS_CONTEXT/README_FIRST.md (este arquivo)
- NEXUS_CONTEXT/ROLE_CHARTER.md
- NEXUS_CONTEXT/DECISIONS.md
- NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md
- NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md
- NEXUS_CONTEXT/VISUAL_DNA.md
- NEXUS_CONTEXT/PROJECT_STATE.md (estado atual — onde estamos agora)
- NEXUS_CONTEXT/INSIGHTS.md (learnings cross-agent — append-only)
- NEXUS_CONTEXT/STACK_REGISTRY.md (tech externo candidato/adotado)

Nada de uploads caóticos: o repo carrega a memória.

---

## 4) Protocolo de sessão (para qualquer pioneiro)

### Início da sessão
1) Ler README_FIRST
2) Confirmar o **papel** (ROLE_CHARTER) e o **branch**
3) Ler PROJECT_STATE.md para saber o estado atual
4) Abrir issue (ou checklist) com gate claro

### Durante a sessão (commit-as-report)
Todo commit significativo **deve incluir um REPORT** em:
`NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

O report deve conter:
- **O que mudou** (paths)
- **Por quê** (alinhado ao Sacred Flow + phase gate)
- **Como verificar** (comandos + output esperado)
- **Riscos** + rollback
- **Próximos 3 passos**
- **Sugestões para outros pioneiros** (baseado no benchmark deles)
- **Referências externas** opcionais (com licença + plano de adoção)

### Fim da sessão
1) Garantir que o log existe em NEXUS_CONTEXT/LOGS/
2) Atualizar DECISIONS.md se uma regra/arquitetura mudou (append-only)
3) Abrir PR para main com título padrão: `[agent] objetivo — gate`

### Pós-merge (depois do PR ser mergeado)
1) Append em NEXUS_CONTEXT/PROJECT_STATE.md: o que mudou + novo estado
2) Append em NEXUS_CONTEXT/INSIGHTS.md: 1–3 learnings + requests para outros agents

---

## 5) Innovation harvesting (tech externo)
Qualquer repo/lib externo deve ser registrado primeiro em:
`NEXUS_CONTEXT/STACK_REGISTRY.md`

Fluxo: **registry entry → lab branch validation → clean implementation PR**

Nunca copy-paste direto. Sempre com licença, plano e decisão documentada.

---

## 6) Stop condition
Se uma proposta **quebra o DNA** (órgãos/flow/cascata) ou cria "feature soup":
**parar e propor uma alternativa menor e alinhada.**

---

## 7) Releases (CLI)
Artefatos (ZIP/PDF/posters) vivem em **GitHub Releases**.
Download padrão:
```
gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS
```
