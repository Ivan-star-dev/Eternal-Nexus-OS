# PRECONDITIONS_BEFORE_HARD_EXECUTION.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** PBHE-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta — audit extraction)

---

## MISSÃO

Listar as pré-condições exactas que devem ser fechadas antes de activar execução pesada em larga escala (hard execution mode / batalhão completo).

Não são sugestões. São travões reais. Se não estiverem fechadas, o batalhão vai produzir trabalho que precisará de ser refeito.

---

## LEI CENTRAL

```
PRECONDITION LAW
────────────────────────────────────────────────────────────
Uma pré-condição não é burocracia.
É o reconhecimento de que alguns trabalhos só têm valor
quando o solo onde assentam está firme.

Executar antes de fechar as pré-condições não é agilidade.
É risco de retrabalho alto com velocidade alta.
────────────────────────────────────────────────────────────
```

---

## FRASE CANÔNICA

> Antes de activar hard execution, a máquina precisa de chão firme.
> Chão firme é: interface de referência encarnada, product layer mais forte,
> ciclo actual fechado, brand command operacional, feature architecture definida.

---

# PRÉ-CONDIÇÕES POR CRITICIDADE

## NÍVEL CRÍTICO — SEM ESTAS, NÃO ACTIVAR

---

### PRE-01 — FVL-IMPL-001 Concluído

**O que é:**
Founder Vision Layer implementado — rota `/founder` funcional + visual polido + interface de referência que encarna o Heaven Lab feeling.

**Por que é crítico:**
O FVL é a primeira encarnação visível da visão do projecto. Sem ele, @framer e @antigravity não têm North Star visual incarnado para executar. Tudo que for construído antes de FVL-IMPL-001 concluído vai ou ignorar a visão ou precisar de ser refactored.

**Critério de fecho:**
```
□ rota /founder funcional
□ visual polido encarnando calmo · premium · científico · espacial
□ Heaven Lab feeling reconhecível (não apenas descrito em docs)
□ ALTERACAO_REAL: sim com evidence block
□ owner valida que a atmosfera está encarnada
```

**Owner:** @claude (principal) + @copilot + @antigravity (apoio)
**Status actual:** elegível — gate aberto pelo owner em 2026-03-22
**Bloco impactado:** Bloco 4 — Interface / Brand / Atmosfera

---

### PRE-02 — PLv6.2-b Concluído

**O que é:**
Próxima camada de produto — NewsAPI integrada OU project_metrics expandido.

**Por que é crítico:**
O product layer actual (V3) precisa de estar mais forte antes de abrir feature scaffolding em massa. Sem PLv6.2-b, o produto não tem fundação técnica suficiente para suportar as features da Wonder Layer.

**Critério de fecho:**
```
□ NewsAPI integrada OU project_metrics expandido com dados reais
□ commit válido com ALTERACAO_REAL: sim
□ handoff emitido para @codex
```

**Owner:** @claude (principal) + @codex + @cursor (apoio)
**Status actual:** elegível — gate aberto pelo owner em 2026-03-22
**Bloco impactado:** Bloco 3 — Arquitectura de Produto

---

### PRE-03 — CYCLE-CLOSE-001 Concluído

**O que é:**
Consolidação final do ciclo actual — relatório-mãe + todos os handoffs recebidos + PR para main aprovado pelo owner.

**Por que é crítico:**
Não se pode activar um novo batalhão sobre um ciclo que ainda não fechou. O PR para main limpa a base. Sem ele, estamos a empilhar execução sobre execução sem merge definitivo.

**Critério de fecho:**
```
□ todos os handoffs do sprint final recebidos pelo @codex
□ relatório-mãe consolidado emitido
□ PR criado para main
□ owner aprova merge
□ ciclo declarado fechado
```

**Owner:** @codex (principal) + @claude (apoio)
**Status actual:** elegível — aguarda handoffs de PLv6.2-b + FVL-IMPL-001 + BULK-02.2 + BULK-01.2/L-002
**Bloco impactado:** Bloco 6 — Execução e Governança

---

## NÍVEL ALTO — SEM ESTAS, BATALHÃO VISUAL NÃO ACTIVA

---

### PRE-04 — Brand Mother System Docs Completos

**O que é:**
Documentação canônica completa do brand identity system: família de cores · tipografia canônica · linhas · formas · motion language · atmosfera · token system.

**Por que é alto:**
@framer + @antigravity precisam de lei visual completa para executar correctamente. Sem brand mother system docs completos, WorkVisual produz em interpretação pessoal — não em lei canônica.

**Critério de fecho:**
```
□ BRAND_MOTHER_SYSTEM.md criado e aprovado
□ token system (cores · tipografia · espaçamento) canônico
□ motion language definida (duração · easing · tipos de transição)
□ atmosfera parametrizada (glass intensity · depth · silence rules)
□ owner valida como North Star visual operacional
```

**Owner:** @claude (arquitetura) + @framer (design command)
**Status actual:** parcialmente definido conceptualmente — docs formais não criados
**Bloco impactado:** Bloco 4 — Interface / Brand / Atmosfera

---

### PRE-05 — Feature Architecture Definida (Feature Scaffolding Plan)

**O que é:**
Ordem canônica de construção das features da Wonder Layer — por família, por prioridade, com dependências entre features mapeadas.

**Por que é alto:**
Sem esta arquitectura, @cursor e @copilot vão construir features em ordem de impulso, não em ordem de valor e dependência. Features interdependentes precisam de sequência correcta.

**Critério de fecho:**
```
□ FEATURE_SCAFFOLDING_PLAN.md criado
□ Wonder Layer ordenada por: família → prioridade → dependência técnica
□ Fase 1 (fundação): globe · data layers · navigation
□ Fase 2 (colaboração): shared labs · research trails · hypothesis boards
□ Fase 3 (inteligência): AI assistance · concept lens · debate chamber
□ Fase 4 (atmosfera): contemplation mode · breathing interface · legacy vault
□ owner aprova a sequência
```

**Owner:** @claude
**Status actual:** não criado
**Bloco impactado:** Bloco 5 — Features e Matéria Viva

---

## NÍVEL MÉDIO — PODEM SER PARALELOS À EXECUÇÃO

---

### PRE-06 — Research OS Architecture Doc

**O que é:**
Documento canônico que define a arquitectura real do Research Operating System como produto.

**Por que é médio:**
Pode ser desenvolvido em paralelo enquanto interface e features base são construídas. Não bloqueia o início do batalhão, mas deve estar pronto antes de features de investigação avançadas.

**Critério de fecho:**
```
□ RESEARCH_OS_ARCHITECTURE.md criado
□ fluxos de utilizador definidos para público A (researchers)
□ funcionalidades core mapeadas (workspace · tools · AI integration)
```

---

### PRE-07 — Learning OS Architecture Doc

**O que é:**
Documento canônico que define a arquitectura do Learning and Mastery System.

**Por que é médio:**
Pode ser paralelo. Não bloqueia interface ou features base. Deve estar pronto antes de features de aprendizagem avançadas.

**Critério de fecho:**
```
□ LEARNING_OS_ARCHITECTURE.md criado
□ fluxos de utilizador definidos para público B (students/autodidacts)
□ mastery map + learning trails mapeados
```

---

# TABELA DE PRECONDIÇÕES

```
PRECONDITION TABLE
════════════════════════════════════════════════════════════════
ID       NOME                              NÍVEL      STATUS
────────────────────────────────────────────────────────────────
PRE-01   FVL-IMPL-001                      CRÍTICO    elegível — sprint final
PRE-02   PLv6.2-b                          CRÍTICO    elegível — sprint final
PRE-03   CYCLE-CLOSE-001                   CRÍTICO    aguarda PRE-01 + PRE-02
PRE-04   Brand Mother System Docs          ALTO       não iniciado
PRE-05   Feature Scaffolding Plan          ALTO       não iniciado
PRE-06   Research OS Architecture          MÉDIO      pode ser paralelo
PRE-07   Learning OS Architecture          MÉDIO      pode ser paralelo
════════════════════════════════════════════════════════════════
```

---

# GATE DE ACTIVAÇÃO

```
BATTALION ACTIVATION GATE
══════════════════════════════════════════════════════════════════

GATE NÍVEL 1 — WorkVisual parcial + WorkFunction base
  □ PRE-01 (FVL-IMPL-001) concluído
  □ PRE-02 (PLv6.2-b) concluído
  □ PRE-03 (CYCLE-CLOSE-001) concluído
  → Após fechamento: @framer + @antigravity activam (WorkVisual)
  → @cursor activa em feature scaffolding base

GATE NÍVEL 2 — WorkVisual total + WorkFunction avançado
  □ PRE-04 (Brand Mother System Docs) concluído
  □ PRE-05 (Feature Scaffolding Plan) concluído
  → Após fechamento: batalhão completo pode activar
  → Execução paralela em todos os blocos

GATE NÍVEL 3 — Hard Execution Total
  □ Interface de referência validada pelo owner
  □ Feature família 1 (fundação) operacional
  □ Loops de handoff + consolidação funcionando a plena carga
  → Após fechamento: hard execution mode declarado
══════════════════════════════════════════════════════════════════
```

---

# O QUE ACONTECE SE IGNORARMOS AS PRÉ-CONDIÇÕES

```
RISCO SE PRE-01 IGNORADA:
  @framer e @antigravity executam sem North Star visual encarnado.
  Resultado: divergência visual entre pioneers. Refactor posterior.

RISCO SE PRE-02 IGNORADA:
  Feature scaffolding começa sem product layer suficientemente forte.
  Resultado: features assentam em fundação fraca. Dívida técnica acumulada.

RISCO SE PRE-03 IGNORADA:
  Novo sprint activa sobre ciclo não fechado.
  Resultado: merge para main com conflitos ou trabalho não consolidado.

RISCO SE PRE-04 IGNORADA:
  Batalhão visual activa sem lei canônica.
  Resultado: Heaven Lab feeling nunca fica consistente.

RISCO SE PRE-05 IGNORADA:
  Features construídas em ordem de impulso.
  Resultado: features interdependentes com dependências incorrectas.
```

---

```
preconditions_before_hard_execution_defined   ✓
5_niveis_de_criticidade                       ✓
7_preconditions_mapeadas                      ✓
gate_de_activacao_em_3_niveis                 ✓
riscos_se_ignoradas                           ✓
```

---

_PRECONDITIONS_BEFORE_HARD_EXECUTION v1.0 — cravado em 2026-03-22 | @claude | PBHE-001_
