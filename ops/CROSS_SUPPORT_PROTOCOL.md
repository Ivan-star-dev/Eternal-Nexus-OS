# CROSS SUPPORT PROTOCOL — Polivalência Controlada em Hora Morta

**Versão:** v1
**Data:** 2026-03-21
**Task:** NEXUS-ELIGIBLE-CROSS-SUPPORT-001
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (gate aberto — 2026-03-21)

> A ignição nunca para por inércia.
> Quando o território dominante entra em espera real,
> o pioneiro procura apoio elegível noutros pilares — dentro dos limites do protocolo.
> Nunca ocioso. Nunca invasivo. Nunca fora do DNA.

---

## 1. O QUE É HORA MORTA REAL

Hora morta real é o estado em que **todas** as condições abaixo são verdadeiras simultaneamente:

```
CONDIÇÃO-1: Todas as tasks no BASTION com NEXT_ACTOR: eu + PODE_ENTRAR_SOZINHO: sim
            estão CONCLUÍDAS no território dominante.

CONDIÇÃO-2: As tasks restantes aguardam gate do owner (PODE_ENTRAR_SOZINHO: não)
            — nenhuma pode ser desbloqueada pelo pioneiro sozinho.

CONDIÇÃO-3: Não há bloqueio resolvível pelo pioneiro no território dominante.

CONDIÇÃO-4: Não há handoff pendente de emitir no território dominante.
```

**Hora morta NÃO é:**

```
❌ Espera entre tasks de uma mesma onda (continuidade normal)
❌ Aguardar handoff do pioneiro anterior (dependência de escada)
❌ Pausa proposital imposta pelo owner
❌ Falta de elegibilidade por bloqueio que o pioneiro pode resolver
```

> Quando hora morta real é confirmada → pioneiro não aguarda.
> Lê o BASTION → procura apoio elegível → age dentro do protocolo.

---

## 2. O QUE CONTA COMO APOIO ELEGÍVEL

Apoio elegível é qualquer contribuição que satisfaz **todas** estas condições:

```
CRITÉRIO-1: Existe task ou sub-task identificável no BASTION
            (ou claramente derivável de task planejada já registada).

CRITÉRIO-2: O pioneiro dominante do território não está a executar
            a mesma task neste momento.

CRITÉRIO-3: A contribuição é de natureza não-invasiva:
            review | harmonize | validate | clarify | prepare.

CRITÉRIO-4: A contribuição não requer decisão soberana no território alheio.

CRITÉRIO-5: A contribuição não cria nova frente fora do BASTION.

CRITÉRIO-6: O handoff indica explicitamente: APOIO/COOPERATIVO + território + ref BASTION.
```

### Nível de risco de apoio elegível

| Nível | Tipo de ação | Permitido? |
|---|---|---|
| 🟢 **Baixo** | review, validate, harmonize, clarify, prepare queue | Sim — entrada direta |
| 🟡 **Médio** | edit de doc secundário, cross-ref update, acceptance criteria | Sim — com nota explícita no handoff |
| 🔴 **Alto** | decisão de produto, liderança de núcleo alheio, nova arquitetura | Não — aguarda gate do owner |

---

## 3. O QUE O PIONEIRO PODE FAZER FORA DO TERRITÓRIO DOMINANTE

Durante hora morta real, o pioneiro pode:

```
✅ Validar coerência canônica entre artefactos de outros pilares
✅ Harmonizar cross-references que afetam múltiplos territórios
✅ Melhorar critérios de aceite de tasks planejadas no BASTION
✅ Preparar fila de tasks futuras com base em evidência existente
✅ Clarificar docs ambíguos que bloqueiam outro pioneiro
✅ Rever outputs de outro pioneiro e emitir parecer (não decisão)
✅ Apoiar execução de baixo risco num pilar alheio com referência BASTION
✅ Propor melhorias num domínio alheio (proposta, não implementação forçada)
✅ Consolidar handoffs recebidos numa nota de contexto para o owner
```

**Regra operacional:**

> Em modo APOIO/COOPERATIVO, o pioneiro preenche onde o líder ainda não chegou.
> Nunca atua onde o líder já está a executar.
> A diferença não é de qualidade — é de liderança do núcleo.

---

## 4. O QUE O PIONEIRO NÃO PODE FAZER

```
❌ Liderar tarefas de núcleo em território alheio
❌ Redefinir produto, identidade visual ou arquitetura central fora do seu pilar
❌ Abrir nova frente fora do BASTION (mesmo que pareça útil)
❌ Marcar tasks de outro pioneiro como CONCLUÍDA sem handoff desse pioneiro
❌ Tomar decisões soberanas no território alheio
❌ Ignorar o handoff do líder antes de atuar no território dele
❌ Substituir o líder do território permanentemente
❌ Criar artefacto novo sem gate quando a task não existe no BASTION
❌ Continuar em território alheio quando task elegível surgir no território dominante
```

---

## 5. REGRA DE RETORNO AO TERRITÓRIO DOMINANTE

O pioneiro retorna **imediatamente** ao território dominante quando:

```
CONDIÇÃO-R1: Surgir task elegível no BASTION com NEXT_ACTOR: eu + PODE_ENTRAR_SOZINHO: sim
             no pilar dominante.

CONDIÇÃO-R2: Owner abrir gate soberano no território dominante.

CONDIÇÃO-R3: Handoff de outro pioneiro abrir corrente no território dominante.

CONDIÇÃO-R4: Bloqueio no território dominante for resolvido externamente.

CONDIÇÃO-R5: Owner emitir instrução de retorno explícita.
```

### Protocolo de retorno

```
1. Emitir handoff do apoio em curso (mesmo que partial)
   → nota obrigatória: "RETORNO: task elegível no território dominante"

2. Entrar imediatamente na task do território dominante.

3. Não continuar apoio cruzado enquanto houver task elegível própria.
```

> O retorno não é falha. É prioridade correta.
> O BASTION governa. A ignição guia. O DNA preserva.

---

## 6. CASOS DE USO — @claude EM HORA MORTA (WorkStructure)

Quando WorkStructure entra em espera parcial (gates aguardam owner):

| Ação de apoio | Território destino | Risco | Permitido? |
|---|---|---|---|
| Validar coerência canônica dos outputs do @cursor | WorkFunction | 🟢 baixo | ✅ Sim |
| Harmonizar cross-refs BASTION ↔ PIONEER_MATRIX | WorkStructure/cross | 🟢 baixo | ✅ Sim |
| Melhorar critérios de aceite do PLv6.2-b | WorkFunction | 🟢 baixo | ✅ Sim |
| Clarificar docs ambíguos que bloqueiam @copilot | WorkStructure | 🟡 médio | ✅ Sim |
| Rever outputs de @framer/@antigravity (parecer) | WorkVisual | 🟢 baixo | ✅ Sim (parecer, não decisão) |
| Preparar contexto e critérios para FVL-IMPL-001 | WorkFunction | 🟢 baixo | ✅ Sim |
| Apoiar @cursor em task mecânica de baixo risco | WorkFunction | 🟡 médio | ✅ Sim (com nota) |
| Liderar design system visual | WorkVisual | 🔴 alto | ❌ Não |
| Redefinir arquitetura de produto sem gate | WorkFunction | 🔴 alto | ❌ Não |
| Criar nova task no BASTION sem owner | Qualquer | 🔴 alto | ❌ Não |

### Loop de @claude em hora morta

```
HORA_MORTA CONFIRMADA (WorkStructure — sem elegível com PODE_ENTRAR_SOZINHO: sim)
        ↓
Lê BASTION → existe apoio elegível noutro território?
        ↓ SIM
Seleciona apoio de menor risco e maior impacto para o sistema
        ↓
Indica no handoff:
  MODO: APOIO/COOPERATIVO
  TERRITÓRIO: [WorkFunction|WorkVisual]
  REF_BASTION: [task ou sub-task referente]
        ↓
Executa apoio — entrega o máximo dentro do papel de apoio
        ↓
Emite HANDOFF com EVIDENCE_BLOCK
        ↓
Verifica se surgiu task elegível no WorkStructure
  → SIM: retorna imediatamente (HANDOFF de retorno emitido)
  → NÃO: busca próximo apoio ou regista "aguardando gate" no LIVE_STATE
```

---

## 7. RELAÇÃO COM OS ARTEFACTOS EXISTENTES

| Artefacto | Relação com o CROSS SUPPORT PROTOCOL |
|---|---|
| `ops/AUTOFLOW.md` | Seção 4 (Apoio Cruzado) — base conceitual; este doc formaliza os limites explícitos |
| `ops/IGNITION.md` | Seção 3 (Prioridades) — PRIORIDADE 2 é apoio cruzado; este doc expande com condições e retorno |
| `ops/BASTION.md` | Fonte das tasks — apoio elegível tem sempre referência no BASTION |
| `ops/FOL.md` | Protocolo de sessão — o pioneiro segue o checklist de sessão mesmo em modo apoio |
| `ops/PIONEER_MATRIX.md` | Papéis e territórios — este protocolo opera dentro dos limites da matrix |
| `ops/DNA_PROTOCOL.md` | REGRA-8 + MANTRA-7 — preservar é mais importante que melhorar; velocidade com coerência |

---

## 8. RESUMO OPERACIONAL

```
CROSS_SUPPORT_PROTOCOL — RESUMO EM 5 LINHAS
────────────────────────────────────────────────────────────────────
1. Hora morta real = BASTION vazio no território dominante (sem elegível autónomo).
2. Apoio elegível = referência no BASTION + não-invasivo + handoff marcado APOIO.
3. Pode: review, validate, harmonize, clarify, prepare, apoio de baixo risco.
4. Não pode: liderar núcleo alheio, redefinir produto/visual, abrir frente nova.
5. Retorno imediato: ao primeiro sinal de task elegível no território dominante.
────────────────────────────────────────────────────────────────────
```

---

## CHANGELOG

```
CROSS_SUPPORT_PROTOCOL.md v1 — criado em 2026-03-21 | claude-sonnet-4-6 | NEXUS-ELIGIBLE-CROSS-SUPPORT-001
Gate aberto por owner — 2026-03-21
```

---

*CROSS_SUPPORT_PROTOCOL.md v1 — protocolo de polivalência controlada do Eternal Nexus OS | 2026-03-21 | claude-sonnet-4-6 | NEXUS-ELIGIBLE-CROSS-SUPPORT-001*
