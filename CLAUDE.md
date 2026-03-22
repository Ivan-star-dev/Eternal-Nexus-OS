# CLAUDE.md — Eternal Nexus OS · Branch & Triage Protocol

> Lei primária. Lida em cada sessão. Não editar fora de protocolo canônico.

---

## 0. LEITURA OBRIGATÓRIA ANTES DE QUALQUER ACÇÃO

Antes de executar qualquer task, ler na seguinte ordem:
1. Este ficheiro (CLAUDE.md)
2. `ops/LIVE_STATE.md` — branch canónico e estado atual
3. `ops/BASTION.md` — tasks elegíveis e gates abertos

---

## 1. BRANCH CANÓNICO ATIVO

```
BRANCH ATIVO: claude/rebuild-bastion-core-rihGX
FONTE DA VERDADE: ops/LIVE_STATE.md (campo "Branch canônico")
```

**Regra absoluta:** toda escrita, commit e push vai para o branch canónico ativo.
Nunca escrever em `master`, `main`, ou qualquer outro branch sem gate explícito do owner.

---

## 2. TRIAGE AUTOMÁTICA — PILLAR → BRANCH

Antes de executar qualquer task, passar por esta triagem:

```
TRIAGEM-RÁPIDA
═══════════════════════════════════════════════════════════

PERGUNTA 1: O que esta task produz?
  → doc / protocolo / config / infra / governança    → WorkStructure
  → feature / fluxo / dado / API / comportamento     → WorkFunction
  → design / UI / UX / identidade / visual / motion  → WorkVisual

PERGUNTA 2: Qual pioneer executa?
  WorkStructure → @claude (abre frente) | @copilot (lapida)
  WorkFunction  → @cursor (mecânico)    | @claude (arquitetural)
  WorkVisual    → @framer (design)      | @antigravity (motion/3D)

PERGUNTA 3: Gate aberto no BASTION para esta task?
  → sim → entra no branch canónico ativo
  → não → PARAR. Comunicar ao owner. Não executar.

PERGUNTA 4: Estou no branch canónico correto?
  → sim → executar
  → não → CORRIGIR AGORA (ver Secção 3)
```

---

## 3. CORRECÇÃO AUTOMÁTICA DE BRANCH

Se o branch atual **não corresponde** ao branch canónico em `ops/LIVE_STATE.md`:

```bash
# 1. Verificar branch atual
git branch --show-current

# 2. Ler branch canónico
grep "Branch canônico" ops/LIVE_STATE.md

# 3. Corrigir — mudar para o branch canónico
git checkout <branch-canónico>

# 4. Se não existe localmente, criar a partir de origin
git fetch origin <branch-canónico>
git checkout -b <branch-canónico> origin/<branch-canónico>
```

**Nunca** criar workarounds, commits temporários, ou "continuo aqui e depois movo".
Correcção é obrigatória antes de qualquer escrita.

---

## 4. MAPA DE PILARES

| Pillar | Território | Output típico | Branch |
|--------|-----------|---------------|--------|
| **WorkStructure** | Estrutura, protocolo, governança, ops, docs canónicos | `.md`, config, schema, infra | branch canónico ativo |
| **WorkFunction** | Features, fluxos, dados, integrações, produto vivo | `.ts`, `.tsx` (lógica), API | branch canónico ativo |
| **WorkVisual** | Design, UI/UX, tokens, identidade, animações | `.tsx` (UI), token, motion | branch canónico ativo |

> Todos os pilares convergem no mesmo branch canónico do sprint ativo.
> O que muda é o pioneiro e o território — não o branch.

---

## 5. BLOQUEADORES — QUANDO PARAR

Parar imediatamente e comunicar ao owner se:

```
STOP-1: Branch atual ≠ branch canónico E não foi possível corrigir
STOP-2: Task não está no BASTION com STATUS: elegível
STOP-3: Gate não está aberto para esta task
STOP-4: Dependência pendente (DEPENDENCIA_STATUS: pendente)
STOP-5: Deriva detectada — task pedida conflitua com DNA Protocol
```

Formato de comunicação ao owner:
```
BLOQUEIO DETECTADO
Task: [nome da task]
Motivo: [STOP-X — descrição]
Branch atual: [branch]
Branch canónico: [branch]
Proposta: [o que precisa acontecer para desbloquear]
```

---

## 6. HANDOFF OBRIGATÓRIO

Toda task concluída requer handoff antes de fechar sessão:
- Actualizar `ops/LIVE_STATE.md`
- Adicionar entrada em `ops/HANDOFF_LEDGER.md` (append no topo)
- Actualizar `ops/BASTION.md` se estado de task mudou
- Commit + push para branch canónico

Sem handoff = task não concluída.

---

## 7. REGRA DE BENEFÍCIO (síntese)

Toda acção deve deixar o sistema melhor do que encontrou:
- Optimizar · Automatizar · Reduzir atrito · Aumentar clareza · Aumentar throughput

Se a task não traz nenhum destes benefícios → questionar ao owner antes de executar.

---

## ARTEFACTOS CANÓNICOS DE REFERÊNCIA

| Ficheiro | Papel |
|----------|-------|
| `ops/BASTION.md` | Semáforo + tasks + gates — lei de execução |
| `ops/LIVE_STATE.md` | Estado vivo — branch + fila + bloqueadores |
| `ops/DNA_PROTOCOL.md` | Espinha canónica — lei primária do sistema |
| `ops/PIONEER_MATRIX.md` | Papéis, territórios, regra dos 3 chats |
| `ops/HANDOFF_LEDGER.md` | Histórico imutável de todas as sessões |
| `ops/PROTOCOL_BRANCH_GUARD.md` | Guard de branch — triage automática, rejeição, redirecionamento |
| `ops/PROTOCOL_CASCADE_CANON.md` | Lei de resposta — retenção em cascata, 4 blocos, V10, matéria |
| `ops/V10_PROJECT_LINE_SYSTEM.md` | Linha V1→V10 — fases, diagnóstico, Phase Tracker, Gap Auditor |

---

_CLAUDE.md v1.0 — cravado em 2026-03-22 | @claude | BRANCH-GUARD-PROTOCOL-001_
