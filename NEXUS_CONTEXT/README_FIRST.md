# Eternal Nexus â€” README_FIRST (ler antes de qualquer aÃ§Ã£o)

**VocÃª estÃ¡ dentro do Ãºnico projeto oficial. Nada acontece â€œforaâ€.**  
Fonte da verdade: **GitHub repo** + pasta canÃ´nica NEXUS_CONTEXT/.

Repo: Ivan-star-dev/Eternal-Nexus-OS

---

## 0) DNA imutÃ¡vel (nÃ£o discutir, sÃ³ proteger)
- **Ã“rgÃ£os fixos:** Nexus (core), Tribunal (decisÃ£o), Atlas (percepÃ§Ã£o), Index (memÃ³ria), News (voz)
- **Sacred Flow:** Tribunal â†’ Atlas â†’ Index â†’ News â†’ Streams
- **Nada de dashboards:** todo hub tem **loop vivo + evidÃªncia + prÃ³xima aÃ§Ã£o**
- **Cascata hereditÃ¡ria:** cada clique aprofunda (folderâ†’folder) e **herda o DNA visual**
- **Regra Elite:** para cada tarefa, **1 pioneiro + 1 backup** (benchmark) â€” se nÃ£o encaixa, vira issue

---

## 1) Regra operacional: 1 main + 3 branches (sem confusÃ£o)
- main = **fonte da verdade**
- gent/claude = arquitetura/contratos/event-bus (sistemas)
- gent/codex = testes/CI/quality gates
- gent/antigravity = ops/scaffold/releases/setup

**Merge sÃ³ via PR** para main.

---

## 2) Workspaces (espelho por espelho no desktop)
Estrutura esperada (worktrees):
- ./ (este root) = **main**
- ./_worktrees/claude
- ./_worktrees/codex
- ./_worktrees/antigravity

> Se worktrees nÃ£o existirem, crie antes de continuar.

---

## 3) â€œNeural Linkâ€: como todas as plataformas recebem contexto
Todas as plataformas/agentes comeÃ§am lendo:
- NEXUS_CONTEXT/README_FIRST.md (este arquivo)
- NEXUS_CONTEXT/ROLE_CHARTER.md
- NEXUS_CONTEXT/DECISIONS.md
- NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md
- NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md
- NEXUS_CONTEXT/VISUAL_DNA.md

Nada de uploads caÃ³ticos: o repo carrega a memÃ³ria.

---

## 4) Protocolo de sessÃ£o (para qualquer pioneiro)
**ComeÃ§o da sessÃ£o**
1) Ler README_FIRST
2) Confirmar o **papel** (ROLE_CHARTER) e o **branch**
3) Abrir issue (ou checklist) com gate claro

**Fim da sessÃ£o**
1) Escrever log: NEXUS_CONTEXT/LOGS/<agent>.md
2) Atualizar DECISIONS.md se uma regra/arquitetura mudou (append-only)
3) Abrir PR para main com tÃ­tulo padrÃ£o:
   - [agent] objetivo â€” gate

---

## 5) Releases (CLI)
Artefatos (ZIP/PDF/posters) vivem em **GitHub Releases**.  
Download padrÃ£o:
gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS
"@

 = @"
# Eternal Nexus â€” ROLE_CHARTER (pioneiro/backup + limites)

## PapÃ©is (benchmark-only)
| Ãrea | Pioneiro | Backup | Regra |
|---|---|---|---|
| Arquitetura / contratos / event-bus | Claude Code (Anthropic) | antigravity | define invariantes; nÃ£o mexe em ops/estÃ©tica |
| Tests / CI / Quality Gates | Codex | Copilot | protege sacred flow; impede drift |
| Ops / scaffold / releases / setup | antigravity | Codex | mantÃ©m espelho desktopâ†”GitHub e releases |
| Review / seguranÃ§a / lint | Copilot | â€” | atua em PR; sem branch dedicada |
| UI premium / motion / shaders | Cursor (se usar) | Claude Code | Apple-feel; heranÃ§a visual obrigatÃ³ria |
| Atlas/Cesium/tiles (se usar) | Gemini (se usar) | Claude Code | LOD, performance, tiles strategy |

## Branch discipline (long-lived)
- main: fonte da verdade
- gent/claude: arquitetura/sistemas/contratos
- gent/codex: testes/CI/gates
- gent/antigravity: ops/setup/releases

## Limites por agente (o que NÃƒO tocar)
### Claude (agent/claude)
- NÃƒO: mexer em ops/releases (isso Ã© antigravity)
- NÃƒO: refatorar UI sÃ³ por estÃ©tica (isso Ã© Cursor/UI)
- SIM: contratos, schemas, event bus, state machine do sacred flow

### Codex (agent/codex)
- NÃƒO: criar features em /src fora do necessÃ¡rio para testes
- SIM: /tests, /.github/workflows, gates, lint, e2e

### antigravity (agent/antigravity)
- NÃƒO: mudar arquitetura/schemas sem PR aprovado
- SIM: scaffolds, scripts, worktrees, releases, organizaÃ§Ã£o, automaÃ§Ã£o
