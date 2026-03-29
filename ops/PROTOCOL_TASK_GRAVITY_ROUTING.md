# PROTOCOL_TASK_GRAVITY_ROUTING.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** TASK-GRAVITY-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Formalizar o protocolo pelo qual qualquer task recebida num qualquer chat / superfície é:
- classificada
- triada
- roteada
- posicionada no branch/worktree/workspace certo
- executada pelo pioneer correcto

e devolvida ao owner de forma compacta e canônica.

---

## FRASE CANÔNICA

> Não é o chat que decide o destino da task.
> É a gravidade da própria task dentro da máquina.

---

## LEI CENTRAL

**Input neutrality:** o sistema recebe a task em qualquer superfície.
**Silent classification:** classifica internamente sem fazer o owner sortear manualmente.
**Routing outcome:** devolve apenas a confirmação curta de quem executa, onde e em que branch.

---

# FAMÍLIA 1 — FLUXO DE ENTRADA

## Passos

```
1. TASK RECEBIDA → em qualquer chat / superfície

2. CLASSIFICAÇÃO SILENCIOSA
   → domínio: WorkStructure | WorkFunction | WorkVisual
   → magnitude: local / multi-bloco / estratégico
   → owner: pioneer único / cooperação / orquestração

3. VERIFICAÇÃO DE GATE
   → task está no BASTION com STATUS: elegível?
   → dependências resolvidas?

4. ROUTING
   → pioneer(s) designado(s)
   → branch confirmado
   → worktree activo se necessário

5. MENSAGEM DE RETORNO CURTA (ver Família 7)
```

---

# FAMÍLIA 2 — CLASSIFICAÇÃO DE DOMÍNIO

| Domínio | Produz | Pioneer preferido |
|---------|--------|-------------------|
| **WorkStructure** | doc / protocolo / config / infra / governança | @claude (abre) · @copilot (lapida) |
| **WorkFunction** | feature / fluxo / dado / API / comportamento | @cursor (mecânico) · @claude (arquitectural) |
| **WorkVisual** | design / UI / UX / identidade / visual / motion | @framer (design) · @antigravity (motion/3D) |

---

# FAMÍLIA 3 — CLASSIFICAÇÃO DE MAGNITUDE

| Magnitude | Definição | Acção |
|-----------|-----------|-------|
| **Local** | Afecta um ficheiro / componente / doc | Pioneer executa directamente |
| **Multi-bloco** | Afecta 2+ blocos ou famílias | Cooperação + orquestração |
| **Estratégico** | Afecta V10 line, arquitectura, brand thesis | Escalação para @claude + owner |

---

# FAMÍLIA 4 — VERIFICAÇÃO DE GATE

Antes de qualquer execução, verificar:

```
GATE-1: Task está no BASTION com STATUS: elegível?
GATE-2: Branch canônico está correcto?
GATE-3: Dependências estão resolvidas?
GATE-4: Pioneer designado está livre?
```

Se qualquer gate falhar → PARAR e comunicar ao owner.

---

# FAMÍLIA 5 — ACTIVAÇÃO DE BRANCH / WORKTREE

## Regra

A natureza da task determina o workspace:

| Tipo de task | Branch | Worktree |
|-------------|--------|---------|
| Task canônica de sprint | branch canónico activo | não necessário |
| Task experimental / isolada | branch de feature separado (com aprovação) | worktree isolado |
| Task de longo horizonte (Codex) | branch canónico activo | worktree separado |
| Task de review / auditoria | branch canónico activo (read-only) | não necessário |

---

# FAMÍLIA 6 — REGRA DE UPGRADE V10

Se a task chega em versão fraca, o receiver tenta puxá-la para:

```
TASK FRACA → LEITURA MAIS MADURA

Exemplos:
- "adicionar botão" → "qual é o momento correcto neste flow para este acção?"
- "corrigir estilo" → "este componente está alinhado com o design system?"
- "escrever doc" → "esta doc pertence a que família canônica e qual é o nível de maturidade esperado?"
- "mudar cor" → "este token está definido no sistema de cores ou está a criar excepção?"
```

## Lei

O receiver não cria complexidade desnecessária.
Mas também não aceita task fraca sem tentar elevá-la para a leitura mais útil.

---

# FAMÍLIA 7 — FORMATO DE MENSAGEM DE RETORNO

Depois de classificar e rotear, o pioneer devolve apenas:

```
ROUTING CONFIRMADO
Task: [nome curto]
Domínio: [WorkStructure | WorkFunction | WorkVisual]
Magnitude: [local | multi-bloco | estratégico]
Pioneer(s): [@nome]
Branch: [branch canónico]
Gate: [aberto | bloqueado — motivo]
Acção: [executa | coopera | escala]
```

---

# FAMÍLIA 8 — PADRÃO DE COOPERAÇÃO ACTIVADA

Quando magnitude é multi-bloco ou estratégico, o routing activa cooperação:

```
COOPERAÇÃO ACTIVADA
Task: [nome]
Lead: [@pioneer principal]
Cooperação: [@pioneer secundário]
Sync: [momento de alinhamento — ex: após cada entrega de bloco]
```

---

# FAMÍLIA 9 — PADRÃO DE ESCALAÇÃO

Quando magnitude é estratégica ou task conflitua com DNA:

```
ESCALAÇÃO NECESSÁRIA
Task: [nome]
Motivo: [multi-bloco / conflito DNA / gate fechado / dependência pendente]
Receiver original: [@pioneer]
Proposta: [o que precisa de acontecer para desbloquear]
Owner: [acção requerida]
```

---

# FAMÍLIA 10 — CHECKLIST DE TASK GRAVITY ROUTING

Antes de executar qualquer task:
1. Domínio classificado?
2. Magnitude avaliada?
3. Gates verificados?
4. Pioneer(s) correcto(s) designado(s)?
5. Branch canónico confirmado?
6. Task elevada para leitura mais madura se fraca?
7. Mensagem de retorno curta preparada?

---

```
task_gravity_routing_protocol_initialized   ✓
input_neutrality_enforced                   ✓
silent_classification_defined               ✓
routing_outcomes_formalized                 ✓
v10_task_upgrade_rule_embedded              ✓
task_routes_not_chat_routes                 ✓
```

---

_PROTOCOL_TASK_GRAVITY_ROUTING v1.0 — cravado em 2026-03-22 | @claude | TASK-GRAVITY-001_
