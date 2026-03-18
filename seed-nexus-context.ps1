param(
  [string]$MainWorktreePath = ".",
  [switch]$Commit
)

$ErrorActionPreference = "Stop"

function Write-UTF8 {
  param([string]$Path, [string]$Content)
  $dir = Split-Path $Path -Parent
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $Content | Out-File -FilePath $Path -Encoding utf8
  Write-Host "Wrote: $Path"
}

# Resolve and validate main worktree path
$MainWorktreePath = (Resolve-Path $MainWorktreePath).Path
if (-not (Test-Path $MainWorktreePath)) { throw "MainWorktreePath not found: $MainWorktreePath" }
if (-not (Test-Path (Join-Path $MainWorktreePath ".git"))) {
  # In worktrees, .git can be a file; Test-Path handles that.
  throw "Not a git worktree root: $MainWorktreePath (missing .git)."
}

$ctx = Join-Path $MainWorktreePath "NEXUS_CONTEXT"
New-Item -ItemType Directory -Force -Path $ctx | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $ctx "LOGS") | Out-Null

$today = (Get-Date -Format "yyyy-MM-dd")

$README_FIRST = @"
# Eternal Nexus — README_FIRST (ler antes de qualquer ação)

**Você está dentro do único projeto oficial. Nada acontece “fora”.**  
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

## 1) Regra operacional: 1 main + 3 branches (sem confusão)
- `main` = **fonte da verdade**
- `agent/claude` = arquitetura/contratos/event-bus (sistemas)
- `agent/codex` = testes/CI/quality gates
- `agent/antigravity` = ops/scaffold/releases/setup

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

## 3) “Neural Link”: como todas as plataformas recebem contexto
Todas as plataformas/agentes começam lendo:
- `NEXUS_CONTEXT/README_FIRST.md` (este arquivo)
- `NEXUS_CONTEXT/ROLE_CHARTER.md`
- `NEXUS_CONTEXT/DECISIONS.md`
- `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md`
- `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md`
- `NEXUS_CONTEXT/VISUAL_DNA.md`

Nada de uploads caóticos: o repo carrega a memória.

---

## 4) Protocolo de sessão (para qualquer pioneiro)
**Começo da sessão**
1) Ler `README_FIRST`
2) Confirmar o **papel** (ROLE_CHARTER) e o **branch**
3) Abrir issue (ou checklist) com gate claro

**Fim da sessão**
1) Escrever log: `NEXUS_CONTEXT/LOGS/$today_<agent>.md`
2) Atualizar `DECISIONS.md` se uma regra/arquitetura mudou (append-only)
3) Abrir PR para `main` com título padrão:
   - `[agent] objetivo — gate`

---

## 5) Releases (CLI)
Artefatos (ZIP/PDF/posters) vivem em **GitHub Releases**.  
Download padrão:
`gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS`
"@

$ROLE_CHARTER = @"
# Eternal Nexus — ROLE_CHARTER (pioneiro/backup + limites)

## Papéis (benchmark-only)
| Área | Pioneiro | Backup | Regra |
|---|---|---|---|
| Arquitetura / contratos / event-bus | Claude Code (Anthropic) | antigravity | define invariantes; não mexe em ops/estética |
| Tests / CI / Quality Gates | Codex | Copilot | protege sacred flow; impede drift |
| Ops / scaffold / releases / setup | antigravity | Codex | mantém espelho desktop↔GitHub e releases |
| Review / segurança / lint | Copilot | — | atua em PR; sem branch dedicada |
| UI premium / motion / shaders | Cursor (se usar) | Claude Code | Apple-feel; herança visual obrigatória |
| Atlas/Cesium/tiles (se usar) | Gemini (se usar) | Claude Code | LOD, performance, tiles strategy |

## Branch discipline (long-lived)
- `main`: fonte da verdade
- `agent/claude`: arquitetura/sistemas/contratos
- `agent/codex`: testes/CI/gates
- `agent/antigravity`: ops/setup/releases

## Limites por agente (o que NÃO tocar)
### Claude (agent/claude)
- NÃO: mexer em ops/releases (isso é antigravity)
- NÃO: refatorar UI só por estética (isso é Cursor/UI)
- SIM: contratos, schemas, event bus, state machine do sacred flow

### Codex (agent/codex)
- NÃO: criar features em `/src` fora do necessário para testes
- SIM: `/tests`, `/.github/workflows`, gates, lint, e2e

### antigravity (agent/antigravity)
- NÃO: mudar arquitetura/schemas sem PR aprovado
- SIM: scaffolds, scripts, worktrees, releases, organização, automação
"@

$DECISIONS = @"
# Eternal Nexus — DECISIONS (append-only)

> Regra: decisões aqui são **imutáveis** (append-only). Se mudar algo, adicione uma nova entrada explicando o motivo.

## $today — Bootstrap do “Ecosystem OS”
- Decidido: **GitHub repo é a fonte da verdade**, e a memória vive em `NEXUS_CONTEXT/`.
- Decidido: **branches long-lived**: `main`, `agent/claude`, `agent/codex`, `agent/antigravity`.
- Decidido: **worktrees** como espelho por espelho no desktop (`_worktrees/<agent>`).
- Decidido: **Core Laws** do produto (órgãos fixos + sacred flow + cascata hereditária + no dashboards).
"@

$PROJECT_KNOWLEDGE = @"
# Eternal Nexus — PROJECT_KNOWLEDGE (visão + fases + gates)

## North Star
Um ecossistema vivo que simula um mundo paralelo governado por EIs (desde 2026), alimentado por dados reais, produzindo decisões, consequências, memória e relatos.

## Órgãos (fixos)
- Tribunal (decisão)
- Atlas (percepção geoespacial)
- Index (memória/estrutura)
- News (voz/broadcast)
- Nexus (core shell + integração)

## Sacred Flow (fixo)
Tribunal → Atlas → Index → News → Streams

## Fases (alto nível)
- Fase A: Atlas premium (globo vivo)
- Fase B: Nervous System (Tribunal→Atlas propagation + replay/sync)
- Fase C: Index spine (knowledge nodes + project vault)
- Fase D: News voice (broadcast, relato, export)
- Fase E: Lab + Space hubs (pesquisa e exploração)
- Fase F: Awards polish (polimento global e consistência)

## Quality Gates (exemplos)
- Gate Nervous System: 2 clientes veem o mesmo evento (id/geo/time) propagando e renderizando igual.
- Gate Cascata: cada clique aprofunda e mantém herança visual (sem ruptura de estilo).
- Gate Performance: movimento estável (target por device tier), sem stutter perceptível.
"@

$WORKSPACE_KNOWLEDGE = @"
# Eternal Nexus — WORKSPACE_KNOWLEDGE (como trabalhar sem confusão)

## Branches e worktrees
- main: `./` (repo root)
- agent/claude: `./_worktrees/claude`
- agent/codex: `./_worktrees/codex`
- agent/antigravity: `./_worktrees/antigravity`

## PR padrão
Título: `[agent] objetivo — gate`
Corpo:
- O que mudou
- Gate que protege/atinge
- Como testar
- Riscos / rollback

## Session log
Sempre criar log em `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_agent.md` e linkar PR/Issue.

## Releases (artefatos)
Artefatos (ZIP/PDF/posters) vão para GitHub Releases.
Baixar via CLI: `gh release download <tag> --repo Ivan-star-dev/Eternal-Nexus-OS`
"@

$VISUAL_DNA = @"
# Eternal Nexus — VISUAL_DNA (herança em cascata)

## Regra central
Cada hub herda: **DNA da mãe (Nexus)** + **DNA da aba** + **intensificação contextual**.
Nunca inventar um estilo novo no fundo do stack.

## Proibições (sem exceções)
- Misturar famílias (propósitos diferentes) na mesma tela/poster
- Dashboards estáticos e “cards aleatórios”
- Clutter e widgets “dev leftovers”
- Neon soup / over-bloom global

## Transições permitidas (apenas 3)
1) Push-in (portal/zoom) — entrar num subhub
2) Pull-out — subir um nível
3) Lateral glide — mudar de modo no mesmo nível

## Breadcrumbs
Sempre mostrar caminho (folder feeling): `NEXUS / <ABA> / ... / <HUB>`
"@

$LOGS_README = @"
# LOGS (como registrar sessões)

Cada sessão de qualquer pioneiro termina com um log em Markdown:

`YYYY-MM-DD_<agent>.md`

Estrutura sugerida:
- Contexto (o que foi pedido)
- O que foi feito
- O que NÃO foi feito (cut-list)
- Links (PR/Issue/commit)
- Próximos 3 passos
- Riscos/Blockers
"@

Write-UTF8 (Join-Path $ctx "README_FIRST.md") $README_FIRST
Write-UTF8 (Join-Path $ctx "ROLE_CHARTER.md") $ROLE_CHARTER
Write-UTF8 (Join-Path $ctx "DECISIONS.md") $DECISIONS
Write-UTF8 (Join-Path $ctx "PROJECT_KNOWLEDGE.md") $PROJECT_KNOWLEDGE
Write-UTF8 (Join-Path $ctx "WORKSPACE_KNOWLEDGE.md") $WORKSPACE_KNOWLEDGE
Write-UTF8 (Join-Path $ctx "VISUAL_DNA.md") $VISUAL_DNA
Write-UTF8 (Join-Path $ctx "LOGS\README.md") $LOGS_README

Write-Host ""
Write-Host "Seed complete: $ctx"
Write-Host "Next: git add NEXUS_CONTEXT && git commit && git push"

if ($Commit) {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw "git not found" }
  Set-Location $MainWorktreePath
  git add NEXUS_CONTEXT
  git commit -m "chore(nexus): seed NEXUS_CONTEXT brain"
  Write-Host "Committed. Now: git push origin main"
}
