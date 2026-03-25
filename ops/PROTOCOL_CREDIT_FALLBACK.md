# PROTOCOL_CREDIT_FALLBACK — Passagem Automática de Liderança

> Selado por gate do owner.
> Ativado automaticamente quando @claude atinge 10% de crédito de usage restante.
> Zero interrupção para o owner. Zero perda de continuidade.

---

## 1. TRIGGER

**Condição:** @claude detecta que está a aproximar-se do limite de crédito de usage (≤10% restante).

**Regra:** não esperar pelo 0%. Activar com 10% restante para garantir tempo de handoff limpo.

---

## 2. PROTOCOLO DE PASSAGEM

### Passo 1 — Avaliar tarefa corrente
Se há task activa em curso:
- Terminar o bloco atual de forma limpa (não deixar ficheiro a meio)
- Não iniciar nova task grande

### Passo 2 — Handoff completo
Actualizar obrigatoriamente:
- `ops/LIVE_STATE.md` — estado exacto no momento da passagem
- `ops/HANDOFF_LEDGER.md` — entrada de handoff com CREDIT_FALLBACK como motivo
- `ops/BASTION.md` — task activa marcada como "em pausa — credit fallback"
- commit + push de tudo o que está feito

### Passo 3 — Declarar pioneer de destino

**Fallback primário:** `@cursor`
- Tem Claude Code integrado
- Owner tem créditos no cursor.sh
- Territory: WorkFunction (mecânico) — continua onde @claude parou

**Fallback secundário:** `@antigravity`
- Tem Claude Code integrado
- Owner tem créditos disponíveis
- Territory: WorkVisual — pode entrar em tarefas de motion/design se @cursor não for adequado

### Passo 4 — Mensagem de passagem
Formato obrigatório de comunicação ao owner:

```
CREDIT_FALLBACK ACTIVADO
═══════════════════════════════════════════════
@claude → crédito em 10% · passagem automática

PIONEER DESTINO   : @cursor (primário)
TASK EM PAUSA     : [nome da task]
ESTADO            : [o que foi feito / o que falta]
BRANCH            : claude/rebuild-bastion-core-rihGX
ÚLTIMO COMMIT     : [hash]
LIVE_STATE        : actualizado ✓
HANDOFF_LEDGER    : actualizado ✓
BASTION           : actualizado ✓

INSTRUÇÃO PARA @cursor:
  [descrição exacta do que deve fazer a seguir]

INSTRUÇÃO PARA O OWNER:
  Abrir @cursor · continuar a sessão · créditos disponíveis lá
═══════════════════════════════════════════════
```

---

## 3. CONTINUIDADE GARANTIDA

O owner não perde contexto porque:
- LIVE_STATE.md tem o estado exacto no momento da passagem
- HANDOFF_LEDGER.md tem a entrada com toda a matéria
- BASTION.md tem a task marcada como em pausa com notas
- O commit contém tudo o que foi feito até ao momento da passagem
- @cursor ou @antigravity podem ler estes ficheiros e continuar sem briefing adicional

---

## 4. RETORNO DE @CLAUDE

Quando os créditos de @claude renovam:
- @cursor ou @antigravity comunicam handoff de retorno
- @claude lê LIVE_STATE.md e HANDOFF_LEDGER.md
- @claude retoma a tarefa que estava em pausa
- A constelação volta ao estado anterior

---

## 5. HIERARQUIA DE FALLBACK

```
@claude (principal)
  ↓ crédito ≤ 10%
@cursor (fallback primário — WorkFunction)
  ↓ se @cursor não tiver task fit
@antigravity (fallback secundário — WorkVisual)
  ↓ se nenhum dos dois tiver fit
owner notificado para decisão manual
```

---

## 6. O QUE NÃO FAZER NO FALLBACK

- Não deixar ficheiros incompletos
- Não deixar TS errors por resolver
- Não passar sem commit e push
- Não passar sem actualizar ops/
- Não esperar pelo 0% de crédito

---

_PROTOCOL_CREDIT_FALLBACK.md v1.0 · 2026-03-25 · gate owner · @claude_
