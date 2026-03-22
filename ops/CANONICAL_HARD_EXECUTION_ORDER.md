# CANONICAL_HARD_EXECUTION_ORDER.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** CHEO-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta — audit extraction)

---

## MISSÃO

Definir a ordem canônica de ataque para activação de hard execution mode, dado o veredicto da auditoria (B — parcialmente pronto) e as pré-condições mapeadas.

Esta não é uma sugestão de cronograma. É a sequência lógica que maximiza a probabilidade de um produto de categoria e minimiza retrabalho.

---

## LEI CENTRAL

```
HARD EXECUTION LAW
────────────────────────────────────────────────────────────
A ordem de ataque não é determinada por o que é mais fácil.
É determinada por o que desbloqueie mais valor a seguir.

A regra é: primeiro o chão, depois as paredes, depois os tetos.
Não se constróem tetos antes de o chão estar sólido.
────────────────────────────────────────────────────────────
```

---

## FRASE CANÔNICA

> A ordem de ataque é: interface de referência → product layer → ciclo fechado →
> brand command → feature scaffolding → hard execution total.
> Cada fase desbloqueia a próxima. Nenhuma fase pode ser saltada sem custo.

---

# A LINHA DO TEMPO DE ACTIVAÇÃO

```
ACTIVATION TIMELINE
══════════════════════════════════════════════════════════════════

AGORA ACTIVO (Sprint Final)
  ↓ FVL-IMPL-001 + PLv6.2-b → CYCLE-CLOSE-001

GATE 1 — Interface de referência encarnada
  ↓ Brand Mother System Docs + Feature Scaffolding Plan

GATE 2 — North Star visual operacional
  ↓ WorkVisual total + Feature Scaffolding Fase 1

GATE 3 — Feature fundação operacional
  ↓ Hard Execution Total — todos os blocos em paralelo coordenado

══════════════════════════════════════════════════════════════════
```

---

# FASE A — SPRINT FINAL ACTIVO (Agora)

**Modo:** execução sequencial-paralela com governança actual
**Duração:** este ciclo

```
FASE A — SPRINT FINAL
────────────────────────────────────────────────────────────

PARALELO 1:
  @claude  → FVL-IMPL-001 (rota /founder + Heaven Lab feeling incarnado)
  @claude  → PLv6.2-b (product layer → NewsAPI ou metrics expandido)

PARALELO 2 (suporte):
  @copilot → BULK-01.2/L-001 → L-002 → BULK-02.2 (mecânico, WorkStructure)
  @cursor  → BULK-01.3-a → b → c (mecânico, git hygiene)

CONSOLIDAÇÃO:
  @codex   → aguarda handoffs → relatório-mãe → CYCLE-CLOSE-001 → PR

CONTROLO SOBERANO:
  @claude  → arquitectura canônica · gates · handoffs · branch guard

RESULTADO ESPERADO:
  → interface de referência no site (Heaven Lab feeling visível)
  → product layer mais forte
  → PR para main aprovado
  → ciclo formalmente fechado
────────────────────────────────────────────────────────────
```

---

# FASE B — COMMAND VISUAL (Após CYCLE-CLOSE-001)

**Modo:** activação de WorkVisual pesado com North Star visual encarnado
**Trigger:** PR para main aprovado + interface de referência validada pelo owner

```
FASE B — WORKVISUAL COMMAND
────────────────────────────────────────────────────────────

PRIMEIRO BLOCO:
  @claude  → BRAND_MOTHER_SYSTEM.md criado e aprovado pelo owner
             (cores · tipografia · motion language · atmosfera parametrizada)

SEGUNDO BLOCO (após brand docs):
  @framer  → design command: token system + componentes de referência
             baseados no Heaven Lab feeling incarnado em FVL-IMPL-001
  @antigravity → motion language: soft cinematic motion + glass + depth
                 + silence como experiência base de todas as páginas

PARALELO:
  @claude  → FEATURE_SCAFFOLDING_PLAN.md (ordem de construção da Wonder Layer)
  @codex   → novo sprint iniciado · BASTION actualizado · gates de Fase C abertos

CONTROLO SOBERANO:
  @claude  → review de brand docs antes de WorkVisual activar
  Owner    → valida que Heaven Lab feeling está correcto antes de escalar

RESULTADO ESPERADO:
  → North Star visual operacional (brand law + motion law completos)
  → @framer + @antigravity em execução com lei canônica, não com interpretação
  → Feature Scaffolding Plan aprovado e pronto para execução
────────────────────────────────────────────────────────────
```

---

# FASE C — FEATURE SCAFFOLDING FASE 1 (Após Fase B)

**Modo:** execução de features por família canônica — fundação primeiro
**Trigger:** Brand Mother System aprovado + Feature Scaffolding Plan aprovado

```
FASE C — FEATURE SCAFFOLDING FASE 1 (FUNDAÇÃO)
────────────────────────────────────────────────────────────

FAMÍLIA: PRESENCE (fundação)
  @cursor  → globe flagship experience aprofundado
  @cursor  → multi-scale navigation real
  @cursor  → real data layers integradas
  @framer  → globe visual polish + atmosfera de observatório

FAMÍLIA: EXPLORATION (fundação)
  @cursor  → world pulse base
  @cursor  → timeline base
  @cursor  → scenario comparison base

PARALELO (WorkVisual):
  @framer  → continua design command em páginas existentes
  @antigravity → motion em páginas existentes (não novas features)

CONTROLO SOBERANO:
  @claude  → review de arquitectura de cada feature antes de merge
  Owner    → aprova gates de família para Fase C2

RESULTADO ESPERADO:
  → fundação da Wonder Layer operacional
  → globe flagship experience em nível de categoria
  → data real presente e navegável
  → atmosfera de observatório/laboratório dominante
────────────────────────────────────────────────────────────
```

---

# FASE D — FEATURE SCAFFOLDING FASE 2 (Após Fase C Fundação)

**Modo:** features de colaboração e inteligência
**Trigger:** Família PRESENCE + EXPLORATION operacionais

```
FASE D — FEATURE SCAFFOLDING FASE 2 (COLABORAÇÃO + INTELIGÊNCIA)
────────────────────────────────────────────────────────────

FAMÍLIA: COLLABORATION
  @cursor  → shared live labs base
  @cursor  → research trails
  @cursor  → hypothesis boards
  @cursor  → professor / lead investigator mode base

FAMÍLIA: INTELLIGENCE
  @cursor  → AI assistance integration base
  @cursor  → concept lens
  @claude  → arquitectura de AI debate chamber
  @claude  → research copilot architecture

CONTROLO SOBERANO:
  @claude  → toda a integração de IA passa por revisão arquitectural
  Owner    → aprova gates para Fase D2

RESULTADO ESPERADO:
  → colaboração científica como funcionalidade real
  → inteligência artificial como assistente encarnado, não como feature decorativa
────────────────────────────────────────────────────────────
```

---

# FASE E — HARD EXECUTION TOTAL (Após Fase D)

**Modo:** todos os blocos em paralelo coordenado
**Trigger:** interface de referência + features base + colaboração + inteligência operacionais

```
FASE E — HARD EXECUTION TOTAL
────────────────────────────────────────────────────────────

NESTE PONTO:
  → Blocos 1–7 todos acima de V5
  → Interface flagship encarnada
  → Features fundação + colaboração + inteligência operacionais
  → Brand + motion canônicos
  → Governança já V7+

ACTIVAÇÃO:
  @claude  → soberania arquitectural + abertura de sprints
  @framer  → design avançado (features de atmosfera)
  @antigravity → features imersivas (contemplation · breathing interface)
  @cursor  → features de reputação e memória (legacy vault · proof-based rep.)
  @copilot → lapidação e QA contínuo de todo o build
  @codex   → orquestração e consolidação de ondas em velocidade máxima

FEATURES NESTA FASE:
  → Contemplation Mode
  → Breathing Interface
  → Dawn / Dusk Intelligence Theme
  → Legacy Vault
  → Proof-based Reputation
  → Problem Rooms
  → Silent Collaboration Layer
  → Lab Missions
  → Mastery Map
  → Discovery Signatures
  → Cross-Discipline Bridges

CONTROLO SOBERANO:
  → @claude mantém arquitectura
  → Owner faz gates de fase, não de task individual
  → BASTION continua como lei de execução

RESULTADO ESPERADO:
  → Produto que define categoria
  → Heaven Lab feeling em todo o site
  → Wonder Layer ~80%+ presente
  → Dual public model operacional
  → Award-level quality standard atingido
────────────────────────────────────────────────────────────
```

---

# TABELA DE ORDEM DE ATAQUE

```
CANONICAL ATTACK ORDER
════════════════════════════════════════════════════════════════
FASE  NOME                    PIONEERS ACTIVOS        GATE
────────────────────────────────────────────────────────────────
A     Sprint Final             @claude · @copilot      ACTIVO AGORA
                               @cursor · @codex
B     Command Visual           @framer · @antigravity  Após CYCLE-CLOSE
                               @claude (brand docs)
C     Feature Fase 1           @cursor · @framer       Após brand docs
      (PRESENCE+EXPLORATION)   @antigravity
D     Feature Fase 2           @cursor · @claude       Após Fase C
      (COLABORAÇÃO+INTEL.)
E     Hard Execution Total     TODOS                   Após Fase D
════════════════════════════════════════════════════════════════
```

---

# O QUE FICA SOB CONTROLO SOBERANO EM TODAS AS FASES

```
SOVEREIGN CONTROL — PERMANENTE
════════════════════════════════════════════════════════════════

Sob @claude (arquiteto soberano):
  → abertura de sprints e fases
  → arquitectura canônica de features antes de build
  → review de brand docs antes de WorkVisual activar
  → toda integração de IA (arquitectura e decisão)
  → actualização do BASTION com o owner
  → protocolos canônicos (nenhum pioneer muta sem gate)

Sob owner (soberano final):
  → aprovação de gates de fase (não de tasks)
  → validação de Heaven Lab feeling encarnado (PRE-01)
  → aprovação do Brand Mother System (PRE-04)
  → merge para main (CYCLE-CLOSE-001)
  → abertura de Fase B, C, D, E
════════════════════════════════════════════════════════════════
```

---

# O QUE NÃO DEVE SER DELEGADO AINDA

```
NÃO DELEGAR ANTES DO TEMPO
══════════════════════════════════════════════════════════════════

NÃO DELEGAR A @cursor ANTES DE FASE C:
  → feature scaffolding → aguarda interface de referência + brand docs

NÃO DELEGAR A @framer ANTES DE FASE B:
  → design command → aguarda brand mother system docs aprovados

NÃO DELEGAR A @antigravity ANTES DE FASE B:
  → motion language → aguarda interface de referência encarnada + North Star

NÃO DELEGAR GATES DE FASE AO BASTION AUTOMÁTICO:
  → gates de fase sempre requerem owner
  → tasks dentro da fase: BASTION automático

NÃO ABRIR FEATURE SCAFFOLDING EM MASSA ANTES DE FASE C:
  → a ordem de features é lei — não há skip de família
══════════════════════════════════════════════════════════════════
```

---

# CRITÉRIO DE SUCESSO POR FASE

```
FASE A — SUCCESS CRITERIA:
  □ /founder funcional e com Heaven Lab feeling reconhecível
  □ product layer mais forte (NewsAPI ou metrics real)
  □ PR para main aprovado
  □ Ciclo fechado formalmente

FASE B — SUCCESS CRITERIA:
  □ Brand mother system docs aprovados pelo owner
  □ @framer executando com lei canônica completa
  □ @antigravity executando motion language canônica
  □ Feature Scaffolding Plan aprovado

FASE C — SUCCESS CRITERIA:
  □ Globe flagship em nível de categoria
  □ Data real navegável
  □ World Pulse base funcional
  □ Atmosfera de observatório dominante na experiência

FASE D — SUCCESS CRITERIA:
  □ Colaboração científica real (shared labs + research trails)
  □ AI assistance encarnada (não decorativa)
  □ Professor mode funcional

FASE E — SUCCESS CRITERIA:
  □ Wonder Layer 80%+ presente
  □ Dual public model operacional
  □ Heaven Lab feeling em todo o site
  □ Produto define categoria
```

---

```
canonical_hard_execution_order_defined     ✓
5_fases_mapeadas                           ✓
pioneers_por_fase                          ✓
controlo_soberano_permanente               ✓
o_que_nao_delegar_antes_do_tempo           ✓
criterio_de_sucesso_por_fase               ✓
```

---

_CANONICAL_HARD_EXECUTION_ORDER v1.0 — cravado em 2026-03-22 | @claude | CHEO-001_
