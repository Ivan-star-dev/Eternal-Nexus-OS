# CODEX CONSOLIDATOR — Protocolo Canônico de Consolidação de Fase/Onda

**Versão:** v1
**Data:** 2026-03-20
**Task:** OPS-HANDOFF-001
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

> O Codex atua como consolidador oficial de fase/onda.
> Não é dono da decisão final. Não executa produto. Não empurra código.
> Lê handoffs reais, audita coerência, sintetiza bloqueios, organiza próximo passo.
> O owner traz o relatório-mãe como input para o próximo comando.

---

## 1. REGRA OPERACIONAL

### O que não muda
- Cada pioneiro continua emitindo handoff individual no formato canônico
- Os handoffs ficam escritos em `ops/HANDOFF_LEDGER.md` (imutável, append-only)
- O `ops/LIVE_STATE.md` continua sendo atualizado pelo executor ativo ao final de cada sessão

### O que muda — papel do Codex
- O Codex passa a ser o **consolidador oficial** de fase/onda
- Ao final de cada fase (conjunto de ondas) ou onda major, o owner solicita ao Codex o relatório-mãe
- O Codex lê todos os handoffs da fase/onda e gera um relatório-mãe consolidado
- O owner traz esse relatório-mãe como input único para decisão e próximo comando
- O Codex **não precisa de branch alinhado** para executar esta função — opera sobre leitura de artefatos reais

---

## 2. PAPEL DO CODEX NESTE FLUXO

O Codex atua como:

| Papel | Descrição |
|---|---|
| **Leitor de handoffs** | Lê todos os handoffs da fase/onda no HANDOFF_LEDGER |
| **Consolidador** | Agrupa tarefas concluídas, parciais e bloqueadas por executor |
| **Auditor de coerência** | Detecta conflitos, sobreposições, lacunas entre handoffs |
| **Sintetizador de bloqueios** | Lista todos os bloqueios ativos e seus estados |
| **Organizador de próximo passo** | Propõe os próximos passos possíveis com base nos handoffs reais |

O Codex **não é:**
- Dono da decisão final (essa é do owner)
- Executor de produto (não abre camadas, não escreve código)
- Substituto do Tribunal (não julga — apenas reporta o que os handoffs dizem)
- Fonte de inferência solta (ver Seção 4 — Regra de Evidência)

---

## 3. BLUEPRINT DO RELATÓRIO-MÃE

O relatório-mãe é o documento de consolidação que o Codex emite ao final de cada fase/onda.
O owner usa este relatório como input único para o próximo comando.

### Formato canônico

```
RELATÓRIO-MÃE — CONSOLIDAÇÃO DE FASE/ONDA
==========================================
FASE/ONDA:      [identificador — ex: Onda 4 | BULK-04 + PLv3 + PLv4]
DATA:           [YYYY-MM-DD]
CONSOLIDADOR:   @codex | [modelo]
FONTE:          ops/HANDOFF_LEDGER.md | ops/LIVE_STATE.md | [outros artefatos lidos]
PIONEIROS LIDOS:[lista dos executores cujos handoffs foram lidos]

---

## TAREFAS CONCLUÍDAS

| Task | Executor | Modelo | Impacto | Arquivos |
|---|---|---|---|---|
| [id + nome] | [@pioneiro] | [modelo] | [baixo/medio/alto] | [lista curta] |

---

## TAREFAS PARCIAIS

| Task | Executor | O que ficou | Motivo |
|---|---|---|---|
| [id + nome] | [@pioneiro] | [resumo] | [motivo real do handoff] |

---

## BLOQUEIOS ATIVOS

| ID | Descrição | Aguarda | Estado |
|---|---|---|---|
| [B-N] | [descrição real do handoff] | [owner / executor / externo] | [estado real] |

---

## CONFLITOS DETECTADOS

| Tipo | Descrição | Handoffs envolvidos |
|---|---|---|
| [sobreposição / lacuna / contradição] | [descrição] | [handoff A vs handoff B] |
| — | Nenhum conflito detectado | — |

---

## PRÓXIMOS PASSOS POSSÍVEIS

1. [passo A — baseado em handoff real]
2. [passo B — baseado em handoff real]
3. [passo C — baseado em handoff real]

---

## DECISÃO RECOMENDADA

[Recomendação do Codex — marcada claramente como recomendação, não como decisão]
[Listar 2-3 opções se houver ambiguidade real]

---

## RISCO / IMPACTO

| Dimensão | Avaliação |
|---|---|
| Risco de continuação | [baixo/medio/alto + justificativa curta] |
| Impacto acumulado da fase/onda | [baixo/medio/alto + justificativa curta] |
| Dívida técnica identificada | [itens reais dos handoffs ou "nenhuma identificada"] |

---

## ESTADO DE CANALIZAÇÃO CONSOLIDADO

SEMÁFORO LIDO:
[🟢 ou 🔴] CHAT:[valor do LIVE_STATE]
[🟢 ou 🔴] BRANCH:[valor do LIVE_STATE]
[🟢 ou 🔴] WORKTREE:[valor do LIVE_STATE]
EXECUTOR ATIVO:[último executor registrado no LIVE_STATE]
ESTADO GERAL:[resumo do estado atual do sistema]

---

## INFERÊNCIAS MARCADAS

[Lista de qualquer avaliação que não tem evidência direta nos handoffs/logs/ledger]
[Prefixo obrigatório: "⚠️ INFERÊNCIA:" antes de qualquer avaliação não documentada]
[Se nenhuma inferência: "Nenhuma inferência usada — todo conteúdo acima baseado em evidência direta"]
```

---

## 4. REGRA DE EVIDÊNCIA

O Codex **só consolida** com base em:

| Fonte permitida | Descrição |
|---|---|
| `ops/HANDOFF_LEDGER.md` | Handoffs reais emitidos pelos pioneiros |
| `ops/LIVE_STATE.md` | Estado vivo atual do sistema |
| `ops/FOL.md` | Regras operacionais da fábrica |
| Logs reais de commit/push | Se disponíveis e verificáveis |
| Diff real de arquivos | Se solicitado para auditoria técnica |

**Proibido:**
- Inferir o estado de uma task sem handoff emitido
- Marcar task como concluída sem entrada no ledger
- Reportar bloqueio resolvido sem evidência de resolução no LIVE_STATE
- Usar conhecimento prévio de sessão anterior sem verificar o ledger atual

**Regra de marcação de inferência:**

> Qualquer avaliação sem evidência direta deve ser prefixada com `⚠️ INFERÊNCIA:` e colocada na seção **INFERÊNCIAS MARCADAS** do relatório-mãe.

---

## 5. OBJETIVO DE VOLUME

Este protocolo existe para **aumentar volume de task sem o owner ter de carregar manualmente todos os handoffs.**

### Como o volume aumenta

```
ANTES:
Owner lê handoff de Claude → handoff de Copilot → handoff de Cursor → Codex → decide

DEPOIS:
Owner solicita: "Codex, consolida a onda N"
Codex emite relatório-mãe
Owner lê só o relatório-mãe → decide → próximo comando
```

### Quando solicitar o relatório-mãe

| Situação | Ação recomendada |
|---|---|
| Final de onda completa (N handoffs emitidos) | Solicitar relatório-mãe ao Codex |
| Antes de abrir gate de nova fase/camada | Solicitar relatório-mãe como input de decisão |
| Quando bloqueios acumulados precisam de visão unificada | Solicitar relatório-mãe focado em bloqueios |
| Owner perdeu contexto de handoffs anteriores | Solicitar relatório-mãe para reentrada de contexto |

### O que o owner traz para o Codex

Mínimo necessário:
```
"Codex, consolida a [onda N / fase X].
Lê: ops/HANDOFF_LEDGER.md (entradas de [data] a [data] ou tasks [lista])
Emite o relatório-mãe no formato canônico."
```

---

## 6. LOCALIZAÇÃO CANÔNICA

| Artefato | Localização | Natureza |
|---|---|---|
| Este protocolo | `ops/CODEX_CONSOLIDATOR.md` | referência — não altera por conta de sessão |
| Relatório-mãe emitido | Canal do owner (chat direto com Codex) | efêmero — não é commitado |
| Referência no FOL | `ops/FOL.md` seção 9 | integrado ao fluxo operacional |

> O relatório-mãe **não é commitado** no repositório por padrão — é emitido no canal do owner e usado como input de decisão. Se o owner decidir registrar um relatório específico, pode fazê-lo em `ops/` com nome `CONSOLIDATION_[fase]-[data].md`.

---

## 7. INTEGRAÇÃO COM O FLUXO EXISTENTE

```
FLUXO ATUALIZADO:

[OWNER emite prompt master da onda]
        ↓
[Claude executa BULK-N.1 → emite handoff no HANDOFF_LEDGER]
        ↓
[Copilot executa BULK-N.2 → emite handoff no HANDOFF_LEDGER]
        ↓
[Cursor executa BULK-N.3 (mecânico) → emite handoff no HANDOFF_LEDGER]
        ↓
[Owner solicita: "Codex, consolida a onda N"]
        ↓
[Codex lê HANDOFF_LEDGER + LIVE_STATE → emite relatório-mãe]
        ↓
[Owner lê só o relatório-mãe → decide → próximo comando]
        ↓
[Owner emite prompt master da próxima onda]
```

---

*CODEX_CONSOLIDATOR.md v1 — registrado em 2026-03-20 | claude-sonnet-4-6 | OPS-HANDOFF-001*
