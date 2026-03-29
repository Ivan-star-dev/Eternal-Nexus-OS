# PROTOCOL_BRANCH_GUARD — Eternal Nexus OS

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** BRANCH-GUARD-PROTOCOL-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (gate aberto — 2026-03-22)

> **Frase canônica:** Task no branch errado não executa; triage primeiro, redirecionamento depois.

---

## MISSÃO

Garantir que nenhuma task seja executada no branch errado e que todo pioneer receba triagem automática antes de contaminar uma missão ativa.

**Lei central:**
Task no branch errado não executa. Ela é:
1. validada
2. rejeitada se houver mismatch
3. triada
4. redirecionada para o branch correto

---

## FAMÍLIAS

### Família A — Validação

Confere:
- branch atual
- branch esperado
- missão associada
- dispatch associado
- actor esperado
- ciclo ativo

### Família B — Rejeição

Impede:
- execução silenciosa
- improviso no branch errado
- contaminação de missão
- mistura de backlog paralelo

### Família C — Triagem

Emite feedback automático com:
- branch atual
- branch ideal
- motivo da rejeição
- ação correta

### Família D — Redirecionamento

Indica:
- para onde a task deve ir
- qual fluxo deve recebê-la
- se deve ser reemitida ou movida

---

## SUBFAMÍLIAS

### Subfamília A1 — Branch Match

**Quando:** `current_branch == expected_branch`
**Ação:** execução permitida

### Subfamília A2 — Branch Mismatch

**Quando:** `current_branch != expected_branch`
**Ação:** execução bloqueada + triagem obrigatória

### Subfamília B1 — Wrong Mission

Quando a task pertence a outro sprint, bastião, experimento, produto ou fase.

### Subfamília B2 — Wrong Actor Flow

Quando a task está no branch certo, mas não pertence ao `NEXT_ACTOR`, fluxo atual ou ordem canônica.

---

## GRUPOS

### Grupo 1 — Branch Guard Core

Responsável por:
- validar branch
- comparar missão
- aprovar ou rejeitar execução

### Grupo 2 — Triage Emitter

Responsável por:
- emitir mensagem padrão
- evitar ambiguidade
- mostrar branch correto

### Grupo 3 — Redirect Controller

Responsável por:
- indicar destino correto
- preservar ordem canônica
- impedir mistura

---

## PROTOCOLOS

### Protocolo 1 — Pre-Execution Validation

Antes de qualquer execução, todo pioneer deve validar:

```
current_branch    ← git branch --show-current
expected_branch   ← ops/LIVE_STATE.md (campo "Branch canônico")
mission_id        ← ops/BASTION.md (campo MISSAO ou ID)
dispatch_id       ← ops/BASTION_DISPATCH_002.md
next_actor        ← ops/BASTION.md (campo NEXT_ACTOR da task)
cycle_state       ← ops/LIVE_STATE.md (campo "Fase ativa")
```

**Regra:** se qualquer um destes campos entrar em conflito com a task recebida → **não executar**.

---

### Protocolo 2 — Automatic Rejection

Se houver mismatch de branch, ação obrigatória:
- bloquear execução
- não editar
- não abrir patch
- não "aproveitar" a task no fluxo atual
- emitir triagem

**Regra:** nunca executar "só desta vez".

---

### Protocolo 3 — Automatic Triage Message (Branch Mismatch)

```
BRANCH TRIAGE
═══════════════════════════════════════════════════════════

Execution rejected.

Current branch  : <current_branch>
Expected branch : <expected_branch>

Reason:
This task belongs to a different mission flow and cannot
be executed here.

Correct action:
  git fetch origin <expected_branch>
  git checkout <expected_branch>

Redirect or reissue this task in the expected branch.
```

---

### Protocolo 4 — Redirect Suggestion

Se o branch correto for conhecido:

```
Recommended branch: <expected_branch>
```

Se não for conhecido:

```
Expected branch unresolved.
Task requires branch classification before execution.
```

---

### Protocolo 5 — Same Branch, Wrong Flow

Mesmo no branch certo, se a task não for do `NEXT_ACTOR` ou não estiver no fluxo atual:

```
FLOW TRIAGE
═══════════════════════════════════════════════════════════

Execution rejected.

Current branch is correct, but this task is not aligned
with the active actor or canonical sequence.

Current NEXT_ACTOR : <actor_from_bastion>
Your identity      : <pioneer>

Correct action:
Wait for the proper actor turn or reclassify the task
explicitly via owner gate.
```

---

## ÁRVORE

```
PROTOCOL_BRANCH_GUARD
├── Validation Layer
│   ├── branch check         (current vs expected)
│   ├── mission check        (task pertence a esta missão?)
│   ├── dispatch check       (task está no dispatch ativo?)
│   ├── actor check          (NEXT_ACTOR == eu?)
│   └── cycle check          (ciclo ativo permite esta task?)
│
├── Rejection Layer
│   ├── block execution
│   ├── suppress patching
│   └── stop silent contamination
│
├── Triage Layer
│   ├── branch mismatch message  (Protocolo 3)
│   ├── flow mismatch message    (Protocolo 5)
│   └── redirect advice          (Protocolo 4)
│
└── Redirect Layer
    ├── expected branch routing
    ├── mission preservation
    └── canonical continuation
```

---

## CAMADAS

| Camada | Nome | Função |
|--------|------|---------|
| 1 | Input | Recebe task + contexto |
| 2 | Validation | Compara task com branch e missão |
| 3 | Decision | Decide: allow / reject / reject + redirect |
| 4 | Feedback | Emite mensagem canônica |
| 5 | Continuation | Encaminha para o fluxo correto |

---

## FUNÇÕES

| Função | Responsabilidade |
|--------|-----------------|
| **Branch Guard** | Verifica branch atual vs esperado |
| **Mission Guard** | Verifica se a task pertence ao fluxo certo |
| **Actor Guard** | Verifica se o ator atual é o correto |
| **Triage Emitter** | Produz feedback canônico |
| **Redirect Advisor** | Indica branch e fluxo corretos |

---

## ESTADOS

```
branch_validated
branch_mismatch_detected
flow_mismatch_detected
execution_rejected
triage_emitted
redirect_required
execution_allowed
```

---

## BRANCH SOBERANO DO CICLO ATUAL

```
BRANCH: claude/rebuild-bastion-core-rihGX
FONTE:  ops/LIVE_STATE.md (campo "Branch canônico")
CICLO:  BASTION v1.9 + BASTION_DISPATCH_002
```

Toda task do ciclo canônico atual deve ser validada contra este branch antes de executar.

---

## IMPLEMENTAÇÃO ACTIVA

Este protocolo está implementado em dois artefactos:

| Artefacto | Localização | Função |
|-----------|-------------|--------|
| `branch-guard.sh` | `.claude/hooks/branch-guard.sh` | PreToolUse hook — bloqueio automático |
| `CLAUDE.md` | `/CLAUDE.md` (raiz) | Protocolo lido em cada sessão |

O hook lê o branch canônico dinamicamente de `ops/LIVE_STATE.md` — acompanha o sprint sem edição manual.

---

## PROMPT CURTO PARA PIONEERS

```
Apply PROTOCOL_BRANCH_GUARD before any execution.

If current_branch != expected_branch:
  - reject execution
  - emit BRANCH TRIAGE
  - suggest expected branch
  - do not patch, edit, or continue

If current_branch is correct but task is outside NEXT_ACTOR
or canonical flow:
  - reject execution
  - emit FLOW TRIAGE

No silent execution on the wrong branch is allowed.
Expected branch: ops/LIVE_STATE.md → "Branch canônico"
```

---

## CLOSURE STATE

```
protocol_branch_guard_defined ✓
hook_active                   ✓
claude_md_embedded            ✓
gitignore_exceptions_added    ✓
```

---

_PROTOCOL_BRANCH_GUARD v1.0 — cravado em 2026-03-22 | @claude | BRANCH-GUARD-PROTOCOL-001_
