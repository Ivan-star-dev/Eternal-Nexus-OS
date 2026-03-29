# FORCE_TASK — ACTIVATION 002
# TAG: @codex @antigravity @cursor @copilot

> **Emitido por:** `@claude` | `claude-sonnet-4-6`
> **Branch:** `claude/rebuild-bastion-core-rihGX`
> **Data:** 2026-03-22
> **Tipo:** ATIVAÇÃO IMEDIATA — FORÇA-TAREFA MÁXIMA
> **Gravidade:** G4 — Sistêmico

---

## ORDEM DIRETA DO FUNDADOR

> "Everyone in the same branch? All engaged? We are staking in a multiple well
> coordinated way, absorbing the most of the main problems and tasks that currently
> have to be finished. Pilar 1 Function. Pilar 2 Structure. Pilar 3 Design/UI/UX
> only AFTER Pilar 1 and 2 are done."

**Todos os pioneers são convocados agora. Não há espera. Não há dúvida. Ativar.**

---

## LEI DE OPERAÇÃO DESTA RODADA

```
PILAR 1 — FUNCTION        → fechar agora
PILAR 2 — STRUCTURE       → fechar agora
PILAR 3 — DESIGN / UI/UX  → BLOQUEADO até Pilar 1 e 2 estarem fechados
                             liderado por @cursor + Framer quando liberado
```

Cada pioneer opera na sua branch. As branches não colapsam — colapsam os
resultados via PR. Fragmentar localmente. Reconciliar soberanamente.

---

## ATIVAÇÃO POR PIONEER

---

### @CODEX — ATIVADO
**Branch:** `agent/codex`
**Pilar:** 1 (Function — CI, guardrails, test coverage)
**Gravidade local:** G3

**Missão:**
Garantir que o sistema tem fundação funcional verificável.
Sem testes que passam, não há Pilar 1 fechado.

**Tarefas imediatas — ordem de ataque:**

1. **T-001** — CI Suite: push final, tag para merge. Verificar:
   ```bash
   node scripts/gates/report-presence-gate.cjs
   node scripts/gates/sacred-flow-gate.cjs
   ```

2. **T-003** — Scaffold test suite em `src/test/nervous-system/`:
   - `deterministic-ids.test.ts`
   - `idempotency.test.ts`
   - `replay-cursor.test.ts`
   - Marcar boundary com `TODO` — não bloquear, scaffoldar e anotar.
   - `npm run test` inclui a nova suite.

3. **T-007** — Input validation no Tribunal event ingestion path.
   - Prevenir eventos malformados de chegar ao Index.
   - Ativar após T-001 merged.

**Veredito esperado:** CI verde. Testes scaffoldados. Guardrails vivos.

---

### @ANTIGRAVITY — ATIVADO
**Branch:** `agent/antigravity`
**Pilar:** 1 (Function — ops, deploy, workspace)
**Gravidade local:** G3

**Missão:**
Garantir que o produto tem pipeline de deploy estável.
Sem deploy gate, o produto não existe funcionalmente.

**Tarefas imediatas — ordem de ataque:**

1. **T-004** — Workspace setup PR: confirmar pronto, push corrections finais.

2. **T-006** — Stack scoring — packaging + private vault lane em `NEXUS_CONTEXT/STACK_REGISTRY.md`:
   - PMTiles packaging, basemap bundling, private data handling.
   - Scores A/B/C/D/E + Decision por candidato.

3. **T-008** — Deploy Pipeline Hardening:
   - `scripts/gates/deploy-readiness-gate.cjs` — env vars + Sacred Flow + build exit 0.
   - `.github/workflows/deploy-readiness.yml` — gate rodando em PRs para `main`.
   - `README.md` — seção Deployment.
   - Acceptance: `node scripts/gates/deploy-readiness-gate.cjs` sai com 0.

**Standing backup:** T-002 (Nervous System spine) se @claude bloquear — aguardar sinal.

**Veredito esperado:** Deploy gate vivo. Pipeline estável. Workspace confirmado.

---

### @CURSOR — ATIVADO
**Branch:** `cursor/espinha-visual-do-ecossistema-6ecf`
**Pilar:** 2 (Structure — visual spine, NexusPage architecture)
**Pilar 3:** LÍDER — mas apenas após Pilar 1 e 2 fechados
**Gravidade local:** G3

**Missão:**
Construir a espinha estrutural visual do produto.
Não é design final. É arquitetura de interface — estrutura que sustenta o produto.

**Tarefas imediatas — ordem de ataque:**

1. **T-009** — NexusPage Implementation (Aether Canon Terminal):
   Implementar estrutura de 6 camadas em `src/pages/NexusPage.tsx`:
   - `L1_Corporate_Header`
   - `L2_Context_Rail`
   - `L3_Long_Read_Core`
   - `L4_Execution_Deck`
   - `L5_Pioneer_Signature_Band`
   - `L6_Handoff_Chain_Block`
   - **Regra:** Estrutura primeiro. Sem Framer motion ainda.
   - Validar: output visual bate com `docs/VISUAL_MOTHER.md` section 2.

2. **U1** — Dark Glassmorphism nos estilos Mapbox/MapLibre:
   - Neon borders em fronteiras geopolíticas.
   - Manter Aether Canon Terminal principles.
   - Sem tocar em: `vite.config.ts`, `src/types/index.ts`, `tailwind.config.ts`.
   - Validar: `npm run build` exit 0, `npm run lint` passa.

3. **T-010** — Stack scoring — UI/Atlas visual candidates:
   - CesiumJS, deck.gl, Motion.
   - Scores A/B/C/D/E + Decision + 1-line rationale.

**GATE DE PILAR 3:**
Cursor e Framer assumem liderança total de design/UI/UX quando o fundador
liberar Pilar 3. Antes disso: estrutura e função apenas.

**Veredito esperado:** NexusPage estruturada. Glassmorphism aplicado. Stack scores emitidos.

---

### @COPILOT — ATIVADO
**Branch:** `agent/copilot`
**Pilar:** 2 (Structure — MapLibre shell, React component layer)
**Gravidade local:** G3

**Missão:**
Construir o shell do mapa geopolítico e a camada de componentes React.
Esta é a estrutura que o produto precisa para ter corpo real.

**Tarefas imediatas — ordem de ataque:**

1. **C2** — `GeopoliticsMap.tsx` MapLibre shell:
   - `src/components/atlas/GeopoliticsMap.tsx`
   - Carregar PMTiles protocol adapter.
   - Conectar à Tribunal data layer (ler eventos do Atlas bus).
   - Bus integration marcado como `TODO` — não bloquear no T-002.
   - Coordenar com @cursor (Cursor: estilos Mapbox JSON. Copilot: shell React).
   - Validar: `npm run typecheck` e `npm run build` passam.

2. **U1 co-owner** — coordenar com @cursor em glassmorphism:
   - Cursor dono dos estilos. Copilot dono do componente shell.
   - Zero duplicação.

**Veredito esperado:** GeopoliticsMap shell vivo. Componente tipado. Build verde.

---

## COORDENAÇÃO ENTRE PIONEERS

```
@codex       → verifica CI de todos quando solicitado
@antigravity → confirma deploy gate + backup @claude em T-002
@cursor      → espinha visual + NexusPage + coordena @copilot em estilos
@copilot     → shell React + componente atlas + coordena @cursor no mapa
@claude      → árbitro + reconciliador + fechar Nervous System spine (T-002)
```

**Lei de conflito:** se dois pioneers tocarem o mesmo arquivo — parar, comunicar,
decidir quem é dono. Nunca sobrescrever o trabalho do outro silenciosamente.

---

## ORDEM DE ATAQUE GLOBAL (por onda)

### ONDA 1 — Diagnóstico rápido (esta sessão)
- @codex: CI gate + test scaffold
- @antigravity: deploy gate + workspace confirm
- @cursor: NexusPage estrutura (sem motion)
- @copilot: GeopoliticsMap shell (sem bus)

### ONDA 2 — Consolidação estrutural
- @codex: T-007 guardrails
- @antigravity: T-008 pipeline hardening
- @cursor: U1 glassmorphism + T-010 stack scores
- @copilot: U1 coordenação + componente finalizado

### ONDA 3 — Consolidação funcional
- Nervous System spine (T-002) — @claude dono, @antigravity backup
- Bus integration completa (todas as TODO annotations resolvidas)
- Deploy gate verde + tudo em ordem para merge

### ONDA 4 — Lapidação
- Revisar o que ficou
- Cortar sobras
- Garantir coerência interna

### ONDA 5 — Fechamento
- Veredito por item: **manter / corrigir / remover / adiar**
- Handoff canônico emitido por cada pioneer
- Estado de saída claro registrado no HANDOFF_LEDGER

---

## GATE DE PILAR 3

```
PILAR 3 — DESIGN / UI/UX está BLOQUEADO.

Será liberado quando:
  ✓ Pilar 1 (Function) estiver fechado e verificado
  ✓ Pilar 2 (Structure) estiver fechado e verificado
  ✓ Fundador emitir sinal de liberação

Quando liberado:
  → @cursor LIDERA (feito para isso)
  → Framer entra como co-líder
  → @copilot co-lidera visual
  → Pilar 3 é onde o organismo fica bonito
```

---

## PROTOCOLO DE PRESSÃO MÁXIMA

Esta rodada opera sob pressão máxima. Cada pioneer responde:

- **Zero preguiça** — não existe "vou fazer depois"
- **Zero drift** — não existe tarefa fora do escopo dos Pilares 1 e 2
- **Zero vaidade** — não existe refactor por estética sem função
- **Zero pseudo-inovação** — não existe feature nova sem necessidade real
- **Foco total** — cada commit justifica sua existência
- **Fechamento real** — o objetivo é pilar fechado, não pilar mexido

---

## SAÍDA ESPERADA DESTA RODADA

| Pilar | Estado alvo |
|---|---|
| **Pilar 1 — Function** | CI verde. Gates passando. Deploy estável. Testes scaffoldados. |
| **Pilar 2 — Structure** | NexusPage arquitetada. MapLibre shell vivo. Espinha visual definida. |
| **Pilar 3 — Design** | BLOQUEADO — aguardando liberação do fundador |

---

## REGISTRAR HANDOFF AO FECHAR

Cada pioneer ao fechar sua rodada:
1. Commit na sua branch com mensagem clara
2. Push para o remote
3. Adicionar entrada no `ops/HANDOFF_LEDGER.md`
4. Sinalizar no próximo handoff o que ficou pendente

---

*FORCE_TASK_ACTIVATION_002 — @claude → @codex @antigravity @cursor @copilot*
*Eternal Nexus OS — 2026-03-22 — G4 Sistêmico — Pilares 1 e 2 em força-tarefa*
