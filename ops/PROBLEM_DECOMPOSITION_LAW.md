# PROBLEM DECOMPOSITION LAW — Lei de Decomposição do Problema

**Versão:** v1.0
**Data:** 2026-03-24
**Task:** RETAINED-TRUTH-INTEGRATION-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Executor:** @claude

> Todo problema tem escala. A escala determina a formação.
> A formação determina quem executa e em que layer de materialização.
> O projecto inteiro pode ser lido como um problema único:
> o problema de materializar um organismo soberano de V1 a V10.

---

## 1. OBJECTIVE

Formalizar como o organismo lê e decompõe qualquer problema — do micro ao macro — e como essa leitura informa a formação activada, o pioneiro eleito e o layer de materialização utilizado. Fechar a lei que torna o projecto inteiro legível como problema único.

---

## 2. WHAT_IT_IS

- Sistema de escalas de problema com definição operacional
- Critérios de decomposição por nível
- Mapeamento de escala → formação → materialização
- Leitura canónica do projecto como problema único de ordem macro-organism

---

## 3. WHAT_IT_IS_NOT

- Não é framework de gestão de projecto (não é Scrum, Kanban, etc.)
- Não é estrutura hierárquica rígida — escalas podem coexistir
- Não é substituição do BASTION — é lente de leitura que alimenta o BASTION
- Não é permissão para atacar escala maior sem resolver escalas menores
- Não é análise por análise — toda decomposição tem de gerar acção ou gate

---

## 4. CORE_LAWS

```
PDL-LAW-001: todo problema tem escala — identificar escala é o primeiro acto de resolução
PDL-LAW-002: a escala do problema determina a formação necessária
PDL-LAW-003: problema de escala maior não pode ser resolvido sem resolver escalas menores que o bloqueiam
PDL-LAW-004: o projecto inteiro é um problema único de escala macro-organism
PDL-LAW-005: decompor não é dividir — é revelar a estrutura que já existe no problema
PDL-LAW-006: cada nível de decomposição tem o seu pioneiro elegível
PDL-LAW-007: um problema mal-escalado é a causa mais comum de formation mismatch
PDL-LAW-008: a escala pode ser corrigida mid-task quando problem-induced shift acontece
```

---

## 5. STRUCTURE — AS 4 ESCALAS

---

### ESCALA 1 — MICRO

```
MICRO PROBLEM
─────────────────────────────────────────────────────────
DEFINIÇÃO:    Problema de granularidade mínima. Um ficheiro, uma função,
              um componente, uma linha de copy, um token visual.

EXEMPLOS:
  → bug num componente específico
  → ajuste de tipografia num bloco
  → correcção de uma lei num artefacto ops
  → adição de campo ao RELAY_ENTRY schema

FORMAÇÃO:     NEEDLE FORMATION (1 agente ou subagente)
PIONEIRO:     o mais especializado no território (ex: @cursor para bug de componente)
LAYER:        Assault Layer (toca o corpo directamente)
DURAÇÃO:      minutos a horas
ENTREGA:      arquivo modificado · task fechada no BASTION

CRITÉRIO DE ESCALA CORRECTA:
  ✓ resolve sem tocar mais de 2 ficheiros
  ✓ não requer decisão de KERNEL para avançar (gate já existe)
  ✓ não afecta mais de 1 pioneiro
─────────────────────────────────────────────────────────
```

---

### ESCALA 2 — BLOCK

```
BLOCK PROBLEM
─────────────────────────────────────────────────────────
DEFINIÇÃO:    Problema de uma camada ou domínio coerente.
              Múltiplos micros relacionados que formam um todo.

EXEMPLOS:
  → implementar toda a animação do globe 3D
  → criar toda a estrutura do Creator Relay System
  → consolidar todos os artefactos ops de um sprint
  → V3 WorkVisual: globe + motion + orbital + typography

FORMAÇÃO:     BLOCK FORMATION (1 pioneiro + agentes)
PIONEIRO:     o dono do território do bloco
LAYER:        Assault + Preparatory (parte toca corpo, parte prepara)
DURAÇÃO:      horas a dias
ENTREGA:      bloco de tasks fechadas · handoff no ledger

CRITÉRIO DE ESCALA CORRECTA:
  ✓ tasks têm afinidade de domínio clara
  ✓ 1 pioneiro tem soberania sobre todas as tasks do bloco
  ✓ bloco tem início e fim definidos (gate de entrada + gate de saída)
─────────────────────────────────────────────────────────
```

---

### ESCALA 3 — CONSTELLATION

```
CONSTELLATION PROBLEM
─────────────────────────────────────────────────────────
DEFINIÇÃO:    Problema que cruza múltiplos domínios e requer coordenação.
              Não pode ser resolvido por 1 pioneiro — requer 2-4 em coordenação.

EXEMPLOS:
  → feature que tem lógica + UI + motion (cursor + framer + antigravity)
  → V3 flagship surface completa (WorkVisual + WorkFunction + WorkStructure)
  → OPERATION_ZERO_GAP (todos os pilares em paralelo)
  → corp + product convergence (codex + claude + cursor)

FORMAÇÃO:     CONSTELLATION FORMATION (2-4 pioneiros)
PIONEIRO:     KERNEL como árbitro · cada pioneiro no seu território
LAYER:        Assault + Preparatory + Strategic Reserve activos
DURAÇÃO:      dias a semanas (sprint completo)
ENTREGA:      produto de uma fase · PR no canal · handoff maior

CRITÉRIO DE ESCALA CORRECTA:
  ✓ pelo menos 2 territórios distintos com interdependência real
  ✓ KERNEL confirma que 1 pioneiro não resolve sozinho
  ✓ cada pioneiro tem gate próprio no BASTION
─────────────────────────────────────────────────────────
```

---

### ESCALA 4 — MACRO-ORGANISM

```
MACRO-ORGANISM PROBLEM
─────────────────────────────────────────────────────────
DEFINIÇÃO:    O problema maior — materializar o organismo soberano de V1 a V10.
              Todas as outras escalas são decomposições deste problema único.

DEFINIÇÃO CANÓNICA:
  O projecto inteiro é a resolução do problema de:
  "Como materializar um organismo soberano, adaptativo e vivo
   que resolve, aprende e cria — fiel ao DNA do founder —
   de V1 à visão V10?"

FORMAÇÕES:    todas as formações em sequência e em paralelo ao longo do tempo
PIONEIRO:     KERNEL como arquitecto · todos os pioneiros como executores
LAYER:        todos os layers activos ao longo do tempo
DURAÇÃO:      V1 → V10 (não tem prazo — tem sequência)
ENTREGA:      o organismo vivo · fiel ao DNA · capaz de escalar

SEQUÊNCIA DE MACRO-ORGANISM:
  PHASE_1: V3-FLAGSHIP-SURFACE-CLOSE-001    → Assault Layer
  PHASE_2: V4-LIVING-WORLD-MINIMUM-001      → Assault Layer (após V3)
  PHASE_3: V5-RESEARCH-ARCH-001             → Preparatory (agora) → Assault (após V4)

CRITÉRIO DE SAÚDE DO MACRO:
  ✓ sequência é respeitada sem excepção
  ✓ todas as expressões do organismo são coerentes entre si (One Organism Law)
  ✓ progresso real em cada fase — fruto observável
  ✓ o organismo fica mais forte a cada ciclo
─────────────────────────────────────────────────────────
```

---

## 6. MAPEAMENTO COMPLETO

| Escala | Formação | Pioneiro | Layer | Duração |
|--------|----------|----------|-------|---------|
| Micro | Needle | 1 especialista | Assault | min → horas |
| Block | Block | 1 dono + agentes | Assault + Preparatory | horas → dias |
| Constellation | Constellation / Mesh | 2-4 + KERNEL | todos activos | dias → semanas |
| Macro-Organism | Universal Pressure + rotação | todos ao longo do tempo | todos ao longo do tempo | V1 → V10 |

---

## 7. OPERATIONAL_IMPLICATIONS

- Antes de abrir task no BASTION: identificar escala → escolher formação → definir layer
- Problem-induced shift pode mudar a escala mid-task — KERNEL autoriza e actualiza BASTION
- Micro problems com gate aberto: pioneiro pode executar sem consultar KERNEL
- Constellation e Macro: KERNEL intervém activamente no routing e nas decisões de território
- V5 é preparação de constellation problem — não pode ser assault antes de V3+V4

---

## 8. ANTI_DRIFT_RULES

```
DRIFT-1: não atacar Macro-Organism sem ter Micro e Block resolvidos nos P0 actuais
DRIFT-2: não usar Constellation para problema que 1 pioneiro resolve (over-engineering)
DRIFT-3: não deixar Micro problem sem escala definida — toda task tem escala
DRIFT-4: não confundir "o projecto todo" com "uma tarefa do projecto" — escalas distintas
DRIFT-5: não escalar problema artificialmente para justificar mais recursos
DRIFT-6: não descer escala artificialmente para evitar coordenação necessária
DRIFT-7: não avançar para Macro-Organism antes de V3+V4 done — sequência é lei
```

---

## 9. NEXT_INTEGRATION_POINTS

- `ops/OMNIPRESENT_FORMATION_SYSTEM.md` — escala determina formação
- `ops/MATERIALIZATION_STRATIFICATION_LAW.md` — escala determina layer de acesso
- `ops/RECIPROCAL_ADAPTIVE_RESOLUTION.md` — escala pode mudar durante resolução
- `ops/SEQUENCE_LAW_V3_V4_V5.md` — sequência de fases é decomposição do macro
- `ops/BASTION.md` — toda task tem escala registada (implicitamente na prioridade)
- `ops/HYPERSONIC_ARMY_DOCTRINE.md` — doutrina de base que esta lei estende

---

_PROBLEM_DECOMPOSITION_LAW v1.0 — 2026-03-24 | @claude | RETAINED-TRUTH-INTEGRATION-001_
