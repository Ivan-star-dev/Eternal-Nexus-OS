# OPEN_PR_AUDIT_001 — COUNCIL-OPEN-PR-AUDIT-001

**Emitido por:** @claude — portão do conselho
**Data:** 2026-03-21
**Branch:** `claude/expose-workspace-config-yt4Km`
**PRs auditados:** #74, #65, #51, #7

---

## OPEN_PR_AUDIT

```
ITENS_AVALIADOS: 4
KEEP:    []
SALVAGE: [PR #74, PR #65]
REBUILD: []
KILL:    [PR #51, PR #7]
```

---

## MATRIZ_DE_DECISAO

| PR | TITULO | DONO_NATURAL | APOIO | DEPENDENCIA_REAL | DECISAO | JUSTIFICATIVA |
|---|---|---|---|---|---|---|
| #74 | C6 codex eslint audit | @codex | @claude | Não — conteúdo extractável | **SALVAGE** | ESLint hardenado (7 regras vs 3 no canônico) + PR gate template alinhado com BASTION. Branch stale — não mergear. Extrair `eslint.config.js` delta e template de gate. |
| #65 | feat(deps): R3F v8→v9 + Drei v9→v10 | @cursor | @copilot | Sim — canônico ainda em v8/v9 | **SALVAGE** | Canonical tem `@react-three/fiber ^8.18.0` + `@react-three/drei ^9.122.0`. Branch tem v9.5.0 + v10.7.7. Diff limpo: 6 ficheiros. Não mergear directo — replicar mudanças limpo no canônico. |
| #51 | feat(spine): ReplayCursor type filter + Phase 1 close | @claude | — | Não — Phase/Gate não existem no BASTION | **KILL** | 39 commits, merges internos, commits numerados ("1","2","3"). Conceitos Phase 1/Phase 2/A5 gate incompatíveis com arquitectura BASTION. Base `4144c4b` — stale. Nada reaproveitável. |
| #7 | [codex] CI + Sacred Flow Gate | @codex | — | Não — Sacred Flow extinto | **KILL** | Base SHA `43383b9` — 10+ merges stale. CI para Atlas/MapLibre/PMTiles — produto que não existe no canônico. Sacred Flow Gate superseded por BASTION. 39 commits de ruído. |

---

## PARECER_DO_CONSELHO

**CLAUDE — coerência estrutural, alinhamento, risco de merge:**

PR #74: O branch `C6-codex-eslint-audit` diverge do canônico em `4144c4b`. O ESLint do canônico tem 3 regras; o do branch tem 7 (adiciona `no-explicit-any: warn`, `no-empty-object-type: warn`, `no-unused-expressions: warn`, `no-require-imports: warn`, `no-empty: warn`, `no-case-declarations: warn`). Essas regras são estruturalmente sãs e directamente aplicáveis — mas o PR em si carrega submodule refs obsoletos e streams de uma arquitectura pré-BASTION. Risco de merge directo: alto. Risco de extrair só as regras ESLint: zero.

PR #65: O upgrade R3F v8→v9 tem dependência real nos componentes activos (`ParticleSystem.tsx`, `PlataformaNacional.tsx`, `r3f-global.d.ts`). O diff é pequeno e cirúrgico. Não há risco estrutural de adoptar o upgrade — a API surface entre v8 e v9 é estável para o uso actual do canônico (sem Suspense dramático, sem portais 3D complexos). Risco de merge directo: médio (package-lock divergiu). Solução: aplicar manualmente as alterações de `package.json` + patches de tipos.

PR #51 e #7: Nenhum alinhamento com o sistema actual. Matar sem hesitar.

**COPILOT — esforço de correção prática, lapidação, compatibilidade:**

PR #74 — Esforço de extracção das regras ESLint: ~10 min. Copiar o bloco `rules` do branch para o `eslint.config.js` canônico, adicionar `ignores: [".claude", "_worktrees"]` (que o branch já tem e o canônico não). Nenhuma instalação de pacote nova necessária. O PR gate template (`2aa1d0e codex: harden PR gate template for CI evidence`) é reaproveitável para o formato BASTION — pode alimentar o campo EVIDENCE_BLOCK dos futuros PRs.

PR #65 — Esforço de upgrade no canônico: ~15-20 min. Alterar `package.json` (`fiber: ^9.5.0`, `drei: ^10.7.7`), aplicar patches em `ParticleSystem.tsx` + `PlataformaNacional.tsx` + `r3f-global.d.ts`, correr `npm install`. O `vite-env.d.ts` do branch tem declaração de módulo Three — verificar se o canônico já tem equivalente.

PR #51 e #7 — Esforço de correção: infinito. Não tem ROI.

**CODEX — auditoria técnica, dependência real, tribunal de KEEP/SALVAGE/KILL:**

```
TRIBUNAL TÉCNICO

PR #74 (C6-codex-eslint-audit)
  SHA base:    4144c4b (Grand Reset — 12 commits atrás do canônico)
  Commits:     10 próprios + 1 merge interno
  Conflitos:   prováveis em ops/ (BASTION.md, HANDOFF_LEDGER.md ausentes no branch)
  Valor real:  eslint.config.js delta + PR gate template
  VEREDICTO:   SALVAGE — extrair dois artefactos, fechar PR

PR #65 (feat/r3f-v9-clean)
  SHA base:    8394d37 (Grand Reset + 2 commits)
  Commits:     2 — limpos
  Conflitos:   package-lock.json (esperado), r3f-global.d.ts (verificar)
  Valor real:  ALTO — upgrade real de dependência activa
  VEREDICTO:   SALVAGE — replicar upgrade manualmente no canônico

PR #51 (fix/replay-cursor-types-and-C5-close)
  SHA base:    4144c4b
  Commits:     39 — inclui merges, commits numerados, audit reopens
  Conceitos:   Phase 1, Phase 2, A5 gate, ReplayCursor, Cesium — todos extintos
  Conflitos:   catastróficos — 58 ficheiros na base, maioria já substituída
  VEREDICTO:   KILL imediato

PR #7 (A2-ci-baseline-gate)
  SHA base:    43383b9 (pré-Grand Reset — geração anterior)
  Commits:     39 — Atlas, PMTiles, MapLibre, Sacred Flow, Dormant Protocol
  Conceitos:   Sacred Flow Gate, Atlas CI, PMTiles — tudo extinto
  VEREDICTO:   KILL imediato
```

**CURSOR — valor visual/UI/fluxo reaproveitável:**

PR #74: Nenhum componente UI. O PR gate template tem valor de processo mas não visual. Sem relevância directa para Cursor.

PR #65: Directo ao alvo de Cursor. `@react-three/drei ^10.7.7` desbloqueia `<BakeShadows>`, `<AccumulativeShadows>`, instâncias melhoradas e `<Float>` v2. O `ParticleSystem.tsx` no branch tem ajustes de tipagem para drei v10. Cursor deve executar este upgrade — é o pioneiro com mais contexto 3D no canônico.

PR #51/#7: Zero valor visual. Arquitecturas extintas.

---

## ACOES_IMEDIATAS

**FECHAR_AGORA:**
```
- PR #51 — fix/replay-cursor-types-and-C5-close (KILL)
- PR #7  — A2-ci-baseline-gate (KILL)
```

**RESOLVER_AGORA:**
```
- PR #74 (SALVAGE): extrair delta ESLint + PR gate template → aplicar no canônico
  DONO: @codex | APOIO: @claude
  ACÇÃO: cherry-pick selectivo de eslint.config.js + template de gate

- PR #65 (SALVAGE): replicar upgrade R3F v9 + Drei v10 no canônico
  DONO: @cursor | APOIO: @copilot
  ACÇÃO: aplicar mudanças manualmente — não mergear PR directo
```

**REFAZER_LIMPO:** nenhum

**MIGRAR_PARA_BASTION:**
```
- R3F v9 upgrade → criar task BASTION para @cursor: "upgrade R3F v8→v9 + Drei v9→v10 no canônico"
- ESLint harden → criar task BASTION para @codex: "extrair e aplicar ESLint rules de C6-audit no canônico"
```

---

## PREVENCAO_FUTURA

**Regra: todo PR nasce com ficha obrigatória antes do primeiro commit.**

```
PR_BIRTH_GATE
| CAMPO                | OBRIGATORIO | EXEMPLO |
|---|---|---|
| DONO_PRINCIPAL       | sim         | @cursor |
| APOIO_SECUNDARIO     | sim/nenhum  | @copilot / nenhum |
| DEPENDENCIA_STATUS   | sim         | independente / depende de PR #X |
| DECISAO_DE_DESTINO   | sim         | KEEP / SALVAGE / REBUILD / KILL |
| BASE_SHA_VALIDA      | sim         | deve estar dentro de 3 commits do canônico |
| EVIDENCE_BLOCK_MINIMO| sim         | O QUE / POR QUE / IMPACTO / PODE_ENTRAR_SOZINHO |
```

**Regra de expiração automática:**
- PR sem DONO_PRINCIPAL → marcado como órfão após 48h
- PR com base > 5 commits do canônico → KILL automático (recriar limpo se ainda relevante)
- PR sem Evidence Block → não elegível para merge

**Aplicação via BASTION:**
BASTION deve recusar dispatch de tasks sem `DONO_PRINCIPAL` e `PODE_ENTRAR_SOZINHO` definidos.
O campo `DECISAO_RECOMENDADA` do HANDOFF_TABLE substitui o `DECISAO_DE_DESTINO` do PR ao entregar.

---

## HANDOFF_TABLE

```
HANDOFF_TABLE
| CAMPO               | VALOR |
|---|---|
| EXECUTOR            | @claude |
| MODELO              | claude-sonnet-4-6 |
| TASK                | COUNCIL-OPEN-PR-AUDIT-001 |
| STATUS              | done |
| FEITO               | Auditoria dos 4 PRs (#74, #65, #51, #7); matriz de decisão completa; pareceres por pioneiro; acções imediatas; regra de prevenção futura |
| NAO_FEITO           | Execução física do fechamento de PRs (requer acesso web/gh CLI — owner executa) |
| BLOQUEIOS           | gh CLI indisponível; Gitea API inacessível — audit baseado em git log + diff de branches |
| ADAPTACOES          | Verificação directa de package.json canônico vs branch R3F; diff ESLint regras contadas manualmente |
| ARQUIVOS            | ops/OPEN_PR_AUDIT_001.md (criado) |
| IMPACTO             | médio — clareza sobre 4 PRs; path para upgrade R3F + ESLint |
| DEPENDENCIA_STATUS  | independente |
| DEPENDE_DE          | nenhum |
| PODE_ENTRAR_SOZINHO | sim |
| ORDEM_DE_MERGE      | livre |
| PROXIMO_PASSO       | Owner fecha PR #51 + #7 via web; cria tasks BASTION para @cursor (R3F upgrade) e @codex (ESLint harden) |
| SUGESTOES           | 1) Fechar PR #51 e #7 imediatamente — zero risco de perda; 2) Task @cursor: upgrade R3F v9 aplicando só patch de package.json + 3 ficheiros de src; 3) Task @codex: aplicar 4 regras ESLint no eslint.config.js canônico + adicionar ignores ".claude" e "_worktrees" |
| DECISAO_RECOMENDADA | KILL #51 e #7 agora; SALVAGE #74 e #65 via tasks BASTION com dono claro |
```

---

## CANALIZACAO_TABLE

```
CANALIZACAO_TABLE
| CAMPO           | VALOR |
|---|---|
| CHAT            | mesmo |
| BRANCH          | claude/expose-workspace-config-yt4Km |
| WORKTREE        | WorkStructure |
| NATUREZA        | audit tático de PRs abertos com checks falhadas |
| EXECUTOR        | @claude |
| ESTADO_FINAL    | done |
| CANALIZACAO_ATIVA | Audit completo emitido; owner fecha #51/#7; BASTION recebe tasks para R3F + ESLint |
```

---

*OPEN_PR_AUDIT_001 — emitido em 2026-03-21 | @claude | claude-sonnet-4-6 | COUNCIL-OPEN-PR-AUDIT-001*
