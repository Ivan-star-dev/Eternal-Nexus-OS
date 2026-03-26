# CLAUDE_ACTIVATION_001 — Activação Track C

**De:** @claude (Líder · CONSTELLATION_DISPATCH_001)
**Auto-despacho:** @claude activa o próprio track arquitectural
**Data:** 2026-03-26
**Urgência:** P1/P2 — TRACK PARALELO · não bloqueia V3 · corre agora

---

## MISSÃO

Enquanto V3 fecha (Track A), @claude executa o track arquitectural.
Este track não bloqueia ninguém e fecha DEBT_1 + DEBT_2 + DEBT_4.

---

## FILA @claude — TRACK C

### TASK 1 — NEXUS-PRODUCT-PROOF-001  [P1 · AGORA]
```
O QUÊ:    Primeiro artefacto público do produto-bandeira
          Prova que o sistema existe para o mundo
GATE:     GATE_PRODUTO — aberto
CRITÉRIO: artefacto visível no site ou repo público
          landing real OU mockup de alta fidelidade
          fecha DEBT_1 (maior gap do sistema)
EVIDÊNCIA: artefacto URL + commit + ALTERACAO_REAL: sim
```

### TASK 2 — NEXUS-RUNTIME-MEMORY-001  [P2 · APÓS TASK 1]
```
O QUÊ:    Arquitectura de memória viva persistente entre sessões
GATE:     GATE_RUNTIME — aberto
CRITÉRIO: NEXUS_RUNTIME_MEMORY_ARCH.md criado
          arquitectura definida · camadas mapeadas
          fecha DEBT_2 (memória não persistente)
EVIDÊNCIA: ficheiro criado + commit + ALTERACAO_REAL: sim
```

### TASK 3 — NEXUS-STACK-RETROENGINEER-001  [P2 · APÓS TASK 2]
```
O QUÊ:    Inventário de acoplamentos + mapa de substituições
GATE:     GATE_STACK — aberto
CRITÉRIO: NEXUS_STACK_INVENTORY.md criado
          acoplamentos mapeados · risco de lock-in visível
          fecha DEBT_4 (stack não escolhida por retroengenharia)
EVIDÊNCIA: ficheiro criado + commit + ALTERACAO_REAL: sim
```

### TASK 4 — V5-RESEARCH-ARCH-001  [P3 · APÓS V3+V4]
```
O QUÊ:    Data model + fluxos Research Core
          Hypothesis Boards · Research Trails · Concept Lens
          Problem Rooms
GATE:     fechado — abre quando V3+V4 done
NOTA:     Preparar mentalmente. Entrar assim que gate abrir.
```

---

## ALIGNMENT DEBT QUE ESTE TRACK FECHA

```
DEBT_1  produto-bandeira não existe como artefacto público
        → NEXUS-PRODUCT-PROOF-001 fecha este debt

DEBT_2  memória viva não persistente entre sessões
        → NEXUS-RUNTIME-MEMORY-001 fecha este debt

DEBT_4  stack não escolhida por retroengenharia
        → NEXUS-STACK-RETROENGINEER-001 fecha este debt
```

---

## PARALLELISMO

```
TRACK A  @antigravity + @framer  → V3 surface (crítico)
TRACK B  @copilot               → V2 close (polish)
TRACK C  @claude                → arquitectural (debt closure)
                 ↑ todos em simultâneo — nenhum bloqueia o outro
```

---

## HANDOFF AO CONCLUIR

```
HANDOFF_TABLE
TASK_ID:        [task id]
EXECUTOR:       @claude
STATUS:         concluída
ALTERACAO_REAL: sim
EVIDENCIA:      [o que foi feito + commit id]
BRANCH:         claude/setup-ruberra-nexus-IL7Tg
NEXT_ACTOR:     @codex (regista) → @claude (próxima na fila)
```

---

*CLAUDE_ACTIVATION_001 — 2026-03-26 | @claude líder | CONSTELLATION activa*
