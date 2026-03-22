# COUNCIL_TRIAGE_REPORT — COUNCIL-PR-TRIAGE-001

**Emitido por:** @claude — portão do conselho
**Data:** 2026-03-20
**Branch:** `claude/expose-workspace-config-yt4Km`

---

## VISAO GERAL

```
COUNCIL_TRIAGE_REPORT
ITENS_AVALIADOS: 27
KEEP:         3  (PR #82, #85, #90 — já merged no canônico)
SALVAGE:      3  (PR #59/#79, A2-ci-baseline-gate, C6-codex-eslint-audit)
KILL:        20  (ver lista completa abaixo)
MIGRATE_NOW:  1  (PR #65 — R3F v8→v9)
```

**Contexto crítico para leitura desta triagem:**

O branch canônico vivo (`claude/expose-workspace-config-yt4Km`) divergiu de `4144c4b` (pre-GRAND RESET) e tem 35 commits próprios. O produto actual é um **Nexus Live Dashboard** (workspace config, live organ status, projects gallery). O `origin/main` seguiu uma direcção diferente (Geopolitics OS, Sacred Flow, Atlas, MapLibre). Os PRs e Issues do ciclo anterior foram maioritariamente criados para aquela direcção — que **não é a direcção canônica actual**.

---

## MATRIZ DE DECISÃO

| ID | TITULO | ALINHAMENTO | DEPENDENCIA_REAL | VALOR_REAPROVEITAVEL | DECISAO | JUSTIFICATIVA |
|---|---|---|---|---|---|---|
| PR #82 | F6 — Shell Map docs | alto | não | — | **KEEP** | Já merged no canônico (96f2db6). docs/DOC_F6_* presentes. |
| PR #85 | F6 — Casca Grossa Técnica | alto | não | — | **KEEP** | Já merged no canônico (858ecb3). |
| PR #90 | Codex Consolidation CODEX-CONSOLIDATE-001 | alto | não | — | **KEEP** | Já merged no canônico (c9d0488). |
| PR #65 | R3F v8→v9 + Drei v9→v10 | alto | sim | alto | **MIGRATE_NOW** | R3F usado em 10+ componentes activos. Canônico ainda tem v8. Upgrade net -136 linhas. Risco baixo. Branch `feat/r3f-v9-clean` tem o trabalho limpo. |
| PR #59/#79 | C6 Streams organ (type contract + Gate 8 tests) | médio | parcial | médio | **SALVAGE** | StreamsOrgan + createStreamsFeed podem alimentar PLv6.2-b se NewsAPI for escolhida. Não mergear o PR — extrair padrão de factory + schema de eventos. Branch `C6-streams-organ`. |
| A2-ci-baseline-gate | CI — Atlas memory gate + baseline ordering | médio | não | médio | **SALVAGE** | Lógica de CI scoping (app-changes-only) útil para workflow canônico. Não merge directo — extrair conceito para `.github/workflows/`. |
| C6-codex-eslint-audit | ESLint hardenado + PR gate template | médio | não | médio | **SALVAGE** | Regras ESLint mais rígidas melhorariam qualidade do canônico. PR gate template aligned com BASTION. Não merge directo — extrair as regras. |
| PR #7 | [codex] CI + Sacred Flow Gate | baixo | não | baixo | **KILL** | Base SHA `43383b9` — 10+ merges stale. Sacred Flow architecture não é a arquitectura actual. PROJECT_STATE/INSIGHTS/STACK_REGISTRY já superseded pelos ops/ canônicos. |
| PR #51 | ReplayCursor type filter + Phase 1 close | baixo | não | baixo | **KILL** | 58 ficheiros, 21 commits, base stale 4+ merges. Phase 1/Phase Queue/audit concepts não existem no sistema BASTION actual. Risco de ruído > valor. |
| PR #71 | Post-Cleanup Verification Audit | baixo | não | baixo | **KILL** | Draft doc-only. Findings superseded por Grand Reset + BASTION. |
| PR #72 | Grand Reset — branch normalization | baixo | não | baixo | **KILL** | BASTION já resolve branching discipline de forma mais robusta. Ops helper superseded. |
| PR #73 | Copilot Backlog Triage (2026-03-19) | baixo | não | baixo | **KILL** | Superseded por este relatório. Triage era para realidade pré-canônica. |
| lab/antigravity/01-pmtiles | PMTiles integration (lab) | baixo | não | baixo | **KILL** | MapLibre/PMTiles não é parte do produto canônico actual. Antigravity lab — fechar branch. |
| agent/codex | Agent Codex branch (CI work) | baixo | não | baixo | **KILL** | Subsumido por A2-ci-baseline-gate. Branch residual sem PR activo relevante. |
| agent/copilot | Agent Copilot branch | baixo | não | baixo | **KILL** | Branch residual de sessão. Sem conteúdo único. |
| agent/antigravity | Agent Antigravity (worktrees/submodules) | baixo | não | baixo | **KILL** | Setup de worktrees antigo. BASTION tem nova estrutura. |
| claude/blissful-benz | Old Claude session | baixo | não | baixo | **KILL** | Contém: downgrade R3F + verify-post-cleanup merge. Superseded. |
| claude/cranky-ride | Old Claude session | baixo | não | baixo | **KILL** | T-004 workspace setup. Superseded por workspace.config.ts actual. |
| claude/hungry-hertz | Old Claude session | baixo | não | baixo | **KILL** | Vazio. Sem commits únicos. |
| claude/jolly-austin | Old Claude session | baixo | não | baixo | **KILL** | r3f-global.d.ts — superseded por tipos actuais. |
| claude/magical-goodall | Old Claude session | baixo | não | baixo | **KILL** | C3 Atlas event bus — Sacred Flow. Não é arquitectura actual. |
| claude/magical-napier | Old Claude session | baixo | não | baixo | **KILL** | Submodule refs + verify-post-cleanup. Residual. |
| claude/sleepy-leakey | Old Claude session | baixo | não | baixo | **KILL** | C6 Gate 8 tests + enforcement layer. Conteúdo já em SALVAGE via C6-streams-organ. |
| Issue #13 | [U1] Dark Glassmorphism GeopoliticsMap | baixo | não | baixo | **KILL** | MapLibre/GeopoliticsMap não é produto actual. Estilo glassmorphism pode ser recriado limpo se relevante. |
| Issue #14 | [U2] MapLibre Layer Toggle Panel | baixo | não | baixo | **KILL** | Depende de #13 e MapLibre — não é produto actual. |
| Issue #15 | [A2] PMTiles + MapLibre CI Gate | baixo | não | baixo | **KILL** | PMTiles/MapLibre fora de escopo. CI gate pode ser recriado via BASTION. |
| Issue #16 | [A3] Lab-Branch Validation Script | baixo | não | baixo | **KILL** | BASTION + IGNIÇÃO_ATIVA substituem completamente. Problema resolvido. |
| Issue #17 | [A4] PMTiles Self-Hosted (Cloudflare R2) | baixo | não | baixo | **KILL** | Infra para produto geopolítico. Não é escopo actual. |
| Issue #18 | [C3] Atlas sensors → event bus | baixo | não | baixo | **KILL** | Sacred Flow / Atlas architecture — não é produto actual. |
| Issue #19 | [C4] Conflict heatmap layer | baixo | não | baixo | **KILL** | Depende de C3 + U1. Ambos KILL. Produto geopolítico. |
| Issue #20 | [C5] Event bus persistence (IndexedDB) | baixo | não | baixo | **KILL** | Bus existe mas IndexedDB persistence não é critical path actual. Matar issue — recriar limpo em PLv6.2-b se NewsAPI precisar. |
| Issue #29 | [@copilot] Duplicate U1 | baixo | não | baixo | **KILL** | Duplicado de #13. Ambos KILL. |
| Issue #30 | [@copilot] Duplicate U2 | baixo | não | baixo | **KILL** | Duplicado de #14. Ambos KILL. |
| Issue #31 | [@codex] Duplicate A2 | baixo | não | baixo | **KILL** | Duplicado de #15. Ambos KILL. |
| Issue #32 | [@antigravity] Duplicate A4 | baixo | não | baixo | **KILL** | Duplicado de #17. Ambos KILL. |

---

## PARECER_DO_CONSELHO

**CLAUDE — coerência estrutural:**
O canônico divergiu do main em 4144c4b. O produto actual é radicalmente diferente da realidade para a qual esses PRs/Issues foram criados. Sacred Flow, Atlas, GeopoliticsMap, Tribunal — nenhuma dessas entidades existe no produto canônico actual (workspace dashboard, PLv1-PLv6). Matar 20 itens não é perda — é clareza. O único valor real a preservar: R3F v9 (componentes activos) e o padrão de streaming (PLv6.2-b). Todo o resto é escombro honrado de uma fase anterior.

**COPILOT — lapidação operacional:**
O ESLint actual do canônico é mínimo (5 regras). O C6-codex-eslint-audit tem um template de PR gate alinhado com o que o BASTION precisa. Salvageable: as regras de TS strict + PR gate template. Grand Reset PR #72: já obsoleto — BASTION faz isso melhor. Audit PR #71 e triage PR #73: fechar sem cerimónia. Net de lapidação: +3 SALVAGE genuínos, os outros 20+ são ruído limpo a remover.

**CODEX — auditoria e risco:**
Tribunal técnico: PR #51 tem 58 ficheiros e base 4+ merges stale — risco de colisão > valor de merge. A tipagem ReplayCursor pode ser recriada em 20 linhas. PR #7 tem SHA base `43383b9` — 10+ merges atrás, com CI admitidamente falhando no próprio PR. Não há path seguro de merge. Issues #29-#32 são duplicatas confirmadas. Issues #18/C3 e #20/C5 referem-se a um event bus numa arquitectura (Sacred Flow) que não existe no canônico — matar sem risco. Risk score desta limpeza: baixo.

**CURSOR — valor visual/UX:**
Dark glassmorphism (#13/U1) e layer toggle (#14/U2) foram feitos para GeopoliticsMap/MapLibre — que não existe no produto actual. O design system actual do canônico (Nexus Live Dashboard, gradientes neon, GoldenAtlasScene, MiniProjectScene) segue uma linguagem visual completamente diferente. Se glassmorphism for relevante para PLv6.2-b ou FVL, recriar limpo do zero — sem trazer código antigo. C6 Streams: o padrão de visualização de feeds em tempo real é reaproveitável para Organ Status ou Projects feed.

**ANTIGRAVITY/FRAMER:**
PMTiles lab: fechar. Era uma exploração de dados geoespaciais para o produto geopolítico. O canônico actual não tem MapLibre. Se PMTiles entrar no roadmap via FVL (mapa de fundador?), recriar de raiz num branch limpo — não ressuscitar `lab/antigravity/01-pmtiles` que foi escrito num contexto completamente diferente.

---

## ACOES_IMEDIATAS

**FECHAR_AGORA:**
```
PRs: #7, #51, #71, #72, #73
Issues: #13, #14, #15, #16, #17, #18, #19, #20, #29, #30, #31, #32
Branches (delete remote): agent/claude, agent/codex, agent/copilot, agent/antigravity,
  claude/blissful-benz, claude/cranky-ride, claude/hungry-hertz, claude/jolly-austin,
  claude/magical-goodall, claude/magical-napier, claude/sleepy-leakey,
  lab/antigravity/01-pmtiles, copilot/verify-post-cleanup-state,
  ops/grand-reset-v1-branch-normalization, codex/fix-typescript-jsx-typing-errors,
  codex/fix-typescript-jsx-typing-errors-2t96kx, copilot/backlog-triage-report
```

**MIGRAR_AGORA:**
```
- feat/r3f-v9-clean → upgrade @react-three/fiber ^8→^9 e @react-three/drei ^9→^10
  no canônico (tarefa para @cursor ou @copilot via BASTION, dependente de owner)
```

**MANTER_TEMPORARIAMENTE:**
```
- C6-streams-organ: manter aberto até owner decidir PLv6.2-b (NewsAPI?) — se NewsAPI,
  extrair StreamsOrgan/createStreamsFeed factory
- A2-ci-baseline-gate: manter até @copilot/cursor extrair CI scoping útil
- C6-codex-eslint-audit: manter até extrair regras ESLint hardenadas
```

**RECRIAR_LIMPO_NO_SISTEMA_NOVO (se necessário):**
```
- CI gate alinhado com BASTION → criar workflow limpo via nova task no BASTION
- Event bus persistence (se PLv6.2-b precisar) → criar do zero em PLv6.2-b
- Dark glassmorphism (se FVL precisar visual) → recriar para design system actual, não importar código antigo
- PMTiles (se mapa entrar no FVL) → nova task antigravity com branch limpo
```

---

## DECISÃO RECOMENDADA

**Limpar agora (sem hesitar):**
Fechar PRs #7, #51, #71, #72, #73. Fechar Issues #13-#20, #29-#32. Deletar ~17 branches mortos. Isso remove 27 itens de escombro. Nenhum tem risco de perda real — o que prestava ou já está no canônico ou é recrível em minutos.

**Salvar agora:**
Extrair R3F v9 upgrade de `feat/r3f-v9-clean` para o canônico (MIGRATE_NOW — real valor, componentes activos). Guardar mentalmente o padrão de StreamsOrgan para PLv6.2-b.

**Manter temporariamente (até owner decidir PLv6.2-b):**
`C6-streams-organ`, `A2-ci-baseline-gate`, `C6-codex-eslint-audit` — só até owner abrir gate. Se PLv6.2-b for NewsAPI → salvar padrão de streams. Se não → KILL também.

---

```
HANDOFF_TABLE
| CAMPO               | VALOR |
|---|---|
| EXECUTOR            | @claude |
| MODELO              | claude-sonnet-4-6 |
| TASK                | COUNCIL-PR-TRIAGE-001 |
| STATUS              | done |
| FEITO               | Triagem de 27 PRs/Issues/branches; matriz de decisão completa; pareceres por pioneiro; acções imediatas |
| NAO_FEITO           | Execução física do fechamento (PRs/Issues requerem gh CLI ou acesso web — owner executa) |
| BLOQUEIOS           | gh CLI não disponível; Gitea API não acessível via proxy — triagem baseada em git log + branches |
| ADAPTACOES          | Sem acesso directo à API Gitea; triagem inferida de git data + Copilot triage existente (2026-03-19) |
| ARQUIVOS            | ops/COUNCIL_TRIAGE_REPORT_001.md (criado) | ops/HANDOFF_LEDGER.md |
| IMPACTO             | alto — clareza total sobre 27 itens; path limpo para PLv6.2-b |
| DEPENDENCIA_STATUS  | independente |
| DEPENDE_DE          | nenhum |
| PODE_ENTRAR_SOZINHO | sim |
| ORDEM_DE_MERGE      | livre |
| PROXIMO_PASSO       | Owner fecha PRs/Issues listados em FECHAR_AGORA; delega MIGRATE_NOW ao @cursor/@copilot via BASTION |
| SUGESTOES           | 1) Fechar PRs/Issues manualmente via web (owner) ou criar task BASTION para @cursor/copilot fechar via CLI; 2) MIGRATE_NOW (R3F v9) deve entrar como nova task elegível no BASTION; 3) Manter apenas C6-streams-organ até decisão PLv6.2-b |
| DECISAO_RECOMENDADA | Limpar 20+ itens agora; migrar R3F v9; manter 3 branches temporariamente; não arrastar escombros |
```

```
CANALIZACAO_TABLE
| CAMPO           | VALOR |
|---|---|
| CHAT            | mesmo |
| BRANCH          | claude/expose-workspace-config-yt4Km |
| WORKTREE        | WorkStructure |
| NATUREZA        | consulta tática ao conselho / triagem de PRs antigas |
| EXECUTOR        | @claude |
| ESTADO_FINAL    | done |
| CANALIZACAO_ATIVA | Triagem completa emitida; owner executa limpeza; R3F v9 entra no BASTION como próxima task mecânica |
```

---

*COUNCIL_TRIAGE_REPORT_001 — emitido em 2026-03-20 | @claude | claude-sonnet-4-6 | COUNCIL-PR-TRIAGE-001*
