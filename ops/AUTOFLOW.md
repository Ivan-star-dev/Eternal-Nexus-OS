# AUTOFLOW — Regra de Fluxo Autônomo dos Pioneiros

**Versão:** v1
**Task:** OPS-AUTOFLOW-001
**Data:** 2026-03-20
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6

> Este documento sela a regra de comportamento autônomo dos pioneiros.
> Quando o sistema está correndo corretamente, o owner não repete instrução operacional.
> O projeto, o branch canônico, os handoffs, o LIVE_STATE e a matrix de pilares
> são suficientes para induzir a próxima ação.

---

## PRINCÍPIO-MÃE

> **O handoff não é despedida. É continuidade operacional.**
> Ao terminar uma task, o pioneiro não entra em vazio.
> Ele lê o estado. Identifica a próxima peça elegível. Executa. Fecha. Desbloqueia.

---

## 1. BRANCH CANÔNICO VIVO

Todos os pioneiros operam mental e operacionalmente no **branch canônico vivo**.

```
Branch canônico vivo: claude/expose-workspace-config-yt4Km
```

**Regras:**
- Nenhum pioneiro toma `main` como fonte de verdade da fase ativa
- O branch canônico vivo é o corredor comum — é onde o estado real vive
- Verificar branch ao iniciar toda sessão (semáforo 🟢/🔴)
- Se o branch divergiu do canônico → parar, registrar no LIVE_STATE, aguardar alinhamento

---

## 2. MATRIX DE PILAR DOMINANTE

Cada pioneiro tem um pilar dominante onde atua em competência máxima.
Nesse território: ele lidera, pega o núcleo das tasks, entrega no nível mais alto.

| Pioneiro | Pilar Dominante | Competência Primária (lidera o núcleo) | Competência Secundária (apoio/cooperativo) |
|---|---|---|---|
| **@claude** | Estrutura + Produto | Abertura de caminho: implementa layers funcionais, arquiteta, cria estruturas vivas | Qualidade: revisão de types e estrutura quando necessário para a entrega |
| **@codex** | Qualidade | Refinamento técnico: types, tests, performance, clean code, análise | Estrutura: documentação técnica e análise arquitetural (requer branch alinhado) |
| **@copilot** | Lapidação | Polimento: DX, UI hygiene, gitignore, smoothing, comentários, beleza | Qualidade: lint, formatting, code style, higiene visual |
| **@cursor** | Mecânico (transversal) | Desbloqueio: remoção de lixo técnico, conflitos mecânicos, backlog de arquivo | Qualquer pilar quando desbloqueando obstáculos mecânicos concretos |

**Regra de liderança:**
> No pilar dominante → o pioneiro atua como **força principal**.
> Fora dele → atua como **reforço fino / apoio cooperativo**.
> A diferença não é de qualidade — é de **liderança do núcleo**.
> Em ambos os casos, o pioneiro entrega o máximo dentro do seu papel.

---

## 3. FLUXO AUTÔNOMO — O LOOP DE 6 PASSOS

Ao terminar uma task, o pioneiro executa este loop:

```
┌─────────────────────────────────────────────────────────┐
│                   LOOP AUTOFLOW v1                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. LÊ LIVE_STATE.md                                    │
│     → seção 1 (estado atual)                            │
│     → seção 2 (sua fila — gate aberto? bloqueada?)      │
│     → seção 3 (semáforo — branch e worktree corretos?)  │
│     → seção 4 (bloqueios — algum me afeta?)             │
│                                                         │
│  2. LÊ HANDOFF_LEDGER.md                               │
│     → últimas 2 entradas (contexto recente da corrente) │
│                                                         │
│  3. IDENTIFICA task elegível                            │
│     → existe task primária no pilar dominante?          │
│       gate aberto ou EM ANDAMENTO?                      │
│                                                         │
│  4. DECIDE papel                                        │
│     → task primária disponível:                         │
│       executa como FORÇA PRINCIPAL                      │
│     → sem task primária disponível:                     │
│       verifica apoio elegível em outros pilares         │
│       → executa como APOIO/COOPERATIVO                  │
│     → nenhuma task elegível:                            │
│       registra "aguardando gate" no LIVE_STATE          │
│       não fica em vazio — documenta e fecha             │
│                                                         │
│  5. EXECUTA dentro da competência definida              │
│     → primária: lidera o núcleo                         │
│     → secundária: preenche lacuna sem deslocar líder    │
│                                                         │
│  6. FECHA o ciclo                                       │
│     → emite HANDOFF (formato OUTPUT_STANDARD)           │
│     → atualiza LIVE_STATE (cabeçalho + fila + semáforo) │
│     → faz commit + push                                 │
│     → desbloqueia a corrente seguinte                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. APOIO CRUZADO — REGRAS DE ATUAÇÃO FORA DO PILAR DOMINANTE

Quando um pioneiro atua em pilar alheio:

```
✅ Continua a dar o máximo dentro do seu papel
✅ Preenche lacunas sem deslocar a liderança do pilar
✅ Respeita o handoff do líder do pilar antes de atuar
✅ Indica no handoff que está em modo APOIO/COOPERATIVO
✅ Não toma decisões do núcleo sem gate do líder do pilar

❌ Não substitui o líder do pilar permanentemente
❌ Não abre frente de liderança em pilar alheio sem gate
❌ Não fecha tasks de núcleo do outro pioneiro como CONCLUÍDA
❌ Não altera arquitetura central fora da sua competência
```

---

## 5. O HANDOFF COMO MOTOR DE INDUÇÃO

O handoff deixou de ser apenas despedida de sessão.
**É a peça que ativa o próximo elo da corrente.**

### O que um handoff ativo faz

```
Pioneiro A termina task X
        ↓
Emite HANDOFF → LIVE_STATE atualizado → HANDOFF_LEDGER appendado
        ↓
Pioneiro B lê LIVE_STATE → identifica gate aberto criado pelo handoff de A
        ↓
Pioneiro B executa task Y → emite handoff → ...
        ↓
A corrente avança sem intervenção manual do owner
```

### O que um handoff mínimo deve conter para induzir o próximo passo

| Campo | Por que importa para indução |
|---|---|
| `STATUS` | done/partial/blocked — define se o gate abre ou não |
| `FEITO` | contexto do que foi entregue — próximo pioneiro entende o estado |
| `NAO_FEITO` | o que sobrou — próximo pioneiro não duplica |
| `BLOQUEIOS` | o que parou — outros podem contornar ou escalar |
| `ARQUIVOS` | exatamente o que mudou — sem ambiguidade |
| `PROX_PASSO` | recomendação explícita — induz sem precisar de explicação |
| `DECISAO_REC` | quem entra a seguir e por quê — roteia a corrente |

---

## 6. A MÁQUINA SEM DEPENDER DE EXPLICAÇÃO MANUAL

### O que o sistema deve tornar desnecessário

```
❌ Owner repetir o papel de cada pioneiro a cada prompt
❌ Owner explicar quem lidera e quem apoia em cada task
❌ Owner gerenciar a sequência dentro de uma onda
❌ Pioneer perguntar "o que faço agora?" sem ter lido o LIVE_STATE
```

### O que o sistema garante em lugar disso

```
✅ LIVE_STATE diz o estado e a fila — pioneiro lê e age
✅ HANDOFF diz o contexto e o próximo — corrente avança sozinha
✅ AUTOFLOW define quem lidera e quem apoia — sem briefing manual
✅ OUTPUT_STANDARD garante que qualquer pioneiro entende o output de qualquer outro
✅ Owner entra para: aprovar gates, decidir direção, responder bloqueios soberanos
```

### O que o owner faz num sistema com AUTOFLOW ativo

```
Owner lê relatório-mãe do Codex
        ↓
Owner decide: avança? qual direção? resolve bloqueio?
        ↓
Owner emite gate ou responde bloqueio soberano
        ↓
Sistema avança autônomo até o próximo gate
```

---

## 7. REGRA DE COMPETÊNCIA — EXPLÍCITA E PERMANENTE

```
REGRA DE COMPETÊNCIA — AUTOFLOW v1
───────────────────────────────────────────────────────
No pilar dominante:
  → o pioneiro é FORÇA PRINCIPAL
  → lidera o núcleo das tasks do pilar
  → toma decisões dentro da sua competência sem briefing

Fora do pilar dominante:
  → o pioneiro é APOIO/COOPERATIVO
  → preenche lacunas sem deslocar o líder do pilar
  → executa dentro da sua competência secundária
  → não toma decisões do núcleo alheio sem gate

Em ambos os casos:
  → entrega o máximo
  → a diferença não é de qualidade
  → a diferença é de liderança do núcleo
───────────────────────────────────────────────────────
```

---

## 8. O QUE NÃO PERTENCE A ESTE DOCUMENTO

```
❌ Abrir nova feature de produto
❌ Alterar data layers ou arquitetura de produto
❌ Mudar o papel soberano do NEXUS_OS ou do Tribunal
❌ Mudar branch ou worktree real de qualquer pioneiro
❌ Inventar nova arquitetura paralela de governança
❌ Substituir ou contradizer FOL, NLF, DOC_BULKING_ESCADA ou NEXUS_OS
```

Este documento **sela a regra de operação autônoma**.
Não é sobre produto. Não é sobre tecnologia.
É sobre como os pioneiros se movem quando o sistema está funcionando.

---

## 9. REFERÊNCIAS CANÔNICAS

| Documento | O que complementa o AUTOFLOW |
|---|---|
| `ops/FOL.md` | Como cada executor lê e escreve no sistema (protocolo de sessão) |
| `ops/NLF.md` | Soberania do tecido operacional vivo |
| `ops/LIVE_STATE.md` | Fonte de verdade operacional — alimentada pelo loop AUTOFLOW |
| `ops/HANDOFF_LEDGER.md` | Motor de indução — append-only, activa correntes |
| `ops/OUTPUT_STANDARD.md` | Formato canônico de output que torna handoffs interoperáveis |
| `docs/DOC_BULKING_ESCADA.md` | Escada de pioneiros — gap de 1 camada entre cada |
| `docs/DOC_BULK_PROTOCOL.md` | Blueprints operacionais (mapa de execução, preflight, guard) |

---

*AUTOFLOW v1 — selado em 2026-03-20 | claude-sonnet-4-6 | OPS-AUTOFLOW-001 | Fase 3*
