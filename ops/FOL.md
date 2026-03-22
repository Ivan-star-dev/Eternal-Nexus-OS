# FOL — Factory Operating Layer v1

**Pilar:** Estrutura
**Camada:** BULK-02 — Consolidação da fábrica viva
**Task:** BULK-02.1
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Data:** 2026-03-20

> Este documento formaliza como o NLF v1 é consumido e escrito por cada executor.
> Conecta LIVE_STATE, HANDOFF_LEDGER, Execution Map, fila por executor e papel da escada
> num fluxo operacional direto e verificável.
> Não substitui docs soberanos. É a camada de uso prático sobre eles.

---

## 1. COMO CADA EXECUTOR CONSOME O ESTADO VIVO

Todo executor, ao iniciar uma sessão, lê nesta ordem:

```
1. ops/LIVE_STATE.md  →  seção 1 (estado atual) + seção 2 (sua fila)
2. ops/LIVE_STATE.md  →  seção 3 (semáforo/canalização) + seção 3.1 (linha temporal)
3. ops/LIVE_STATE.md  →  seção 4 (bloqueios ativos)
4. ops/HANDOFF_LEDGER.md  →  últimas 2 entradas (handoffs recentes)
```

### O que cada executor busca ao ler

| Executor | O que lê primeiro | O que valida |
|---|---|---|
| **Claude** | Fila própria na seção 2 | Existe gate aberto para a próxima camada? Handoff da camada anterior emitido? |
| **Copilot** | Fila própria na seção 2 | Gate de Claude para a camada atual foi emitido? |
| **Cursor** | Seção 4 (bloqueios) + fila própria | Existe item mecânico designado sem depender de decisão soberana? |
| **Codex** | Fila própria + seção 1 (branch) | Branch alinhado ao canônico? Gate de Claude para refinamento disponível? |

### Regra de leitura

> Se o LIVE_STATE não encontrar gate aberto para o executor → **não executa**.
> Emite alerta no handoff e aguarda abertura do gate.

---

## 2. COMO CADA EXECUTOR ESCREVE DE VOLTA NO SISTEMA

Ao final de cada sessão, todo executor escreve em dois lugares e apenas nesses dois:

### Escrita obrigatória

```
ops/LIVE_STATE.md      →  atualiza SOMENTE:
                           - cabeçalho (data + executor + task)
                           - seção 1 (estado atual)
                           - SUA fila na seção 2
                           - seção 3 (semáforo/canalização)
                           - seção 3.1 (linha temporal)
                           - seção 4 se bloqueio novo ou resolvido
                           - seção 5 (próximos passos) se mudou

ops/HANDOFF_LEDGER.md  →  adiciona entrada no topo (formato canônico)
                           NUNCA edita entradas existentes
```

### Escrita proibida

```
❌ Editar fila de outro executor sem handoff desse executor
❌ Marcar task de outro executor como CONCLUÍDA
❌ Alterar bloqueios sem nova evidência
❌ Tocar em docs/NEXUS_OS.md sem razão explícita aprovada
❌ Tocar em qualquer arquivo de produto nesta camada
```

### Protocolo de escrita mínima

> Escrever o mínimo necessário para o sistema saber o que aconteceu.
> Se não mudou, não escreve. Sem padding, sem expansão de escopo.

---

## 3. COMO A FILA AVANÇA DE ONDA PARA ONDA

Uma onda = um conjunto de tasks executadas em paralelo pelos pioneiros ativos,
dentro de uma camada-mãe, com seus gates próprios.

### Ciclo de uma onda

```
[OWNER emite prompt master da onda]
        ↓
[Claude lê, executa BULK-N.1, emite handoff]
        ↓
[Copilot lê handoff de Claude, executa BULK-N.2, emite handoff]
        ↓
[Cursor executa BULK-N.3 (mecânico, em paralelo), emite handoff]
        ↓
[Owner lê os 3 handoffs]
        ↓
[Owner decide: abre gate para BULK-(N+1) ou bloqueia]
```

### Regra de avanço

| Condição | Resultado |
|---|---|
| Owner leu os 3 handoffs e aprova | Gate para BULK-(N+1) aberto |
| Algum handoff está partial/blocked | Owner decide se avança ou resolve antes |
| Handoff ausente de qualquer executor | BULK-(N+1) não abre — trava de continuação ativa |

### Como ler a fila no LIVE_STATE

```
Estado           Significado operacional
───────────────────────────────────────────────
PLANEJADA        Existe, mas sem gate aberto — aguarda onda anterior
GATE ABERTO      Executor pode iniciar imediatamente
EM ENTREGA       Executor ativo nesta task agora
EM ANDAMENTO     Frente independente — não bloqueada pela escada
BLOQUEADA        Aguarda decisão (owner ou alinhamento de branch)
CONCLUÍDA        Handoff emitido — tarefa fechada nesta fila
```

---

## 4. COMO TIMEOUTS AUXILIARES NÃO TRAVAM A ESCADA PRINCIPAL

Um executor auxiliar (Cursor ou Codex em frente independente) pode entrar em
timeout — sessão encerrada, tarefa incompleta, gate não emitido.

### Regra de não-bloqueio

> Timeout de executor auxiliar **não trava** a escada principal (Claude → Copilot).
> A escada principal só para se Claude ou Copilot entrarem em timeout dentro de sua task de onda.

### Como tratar timeout auxiliar

```
1. Executor em timeout → registrar no LIVE_STATE seção 4 como bloqueio auxiliar (B-AUX-N)
2. Owner decide: redesignar a task, esperar o executor ou mover para próxima onda
3. Enquanto isso, Claude e Copilot avançam normalmente
4. Handoff da onda não precisa incluir o executor em timeout para ser válido
   → owner decide com os handoffs disponíveis
```

### Formato de bloqueio auxiliar

```
| B-AUX-N | Executor X — timeout em TASK Y | Owner: redesignar ou aguardar? | EM OBSERVAÇÃO |
```

### O que NÃO fazer

```
❌ Esperar timeout do auxiliar para emitir handoff da onda
❌ Marcar onda como blocked por timeout auxiliar
❌ Deixar o sistema parado aguardando executor não-essencial
```

---

## 5. COMO OWNER GATES CONTINUAM SOBERANOS

O owner é o árbitro final de qualquer ambiguidade. Nenhum executor substitui essa função.

### Situações de owner gate obrigatório

| Situação | O que acontece |
|---|---|
| Bloqueio crítico (B-001, B-002, B-003) | Executor registra, não age — aguarda owner |
| Merge na linha principal | Sempre requer owner ou Tribunal |
| Decisão arquitetural nova | Sempre requer owner — executor não inventa |
| Abertura de camada nova (BULK-N+1) | Requer leitura e aprovação do owner |
| Expansão de escopo não prevista no prompt master | Requer owner — executor para e reporta |

### Formato de solicitação de owner gate

```
OWNER GATE SOLICITADO:
ITEM:    [descrição do que precisa de decisão]
CONTEXTO:[por que o executor parou aqui]
OPÇÕES:  [A) ... | B) ... | C) ...]
IMPACTO: [o que muda dependendo da escolha]
AGUARDA: owner
```

### Regra de soberania do owner gate

> Enquanto owner gate estiver pendente, o executor continua no resto do escopo se possível.
> Se o gate bloqueia 100% do escopo → handoff partial emitido, executor aguarda.
> Nunca improvisar para contornar um owner gate pendente.

---

## 6. MAPA DE CONEXÃO — ARTEFATOS VIVOS

```
ARTEFATO                    NATUREZA        QUEM LÊ          QUEM ESCREVE
────────────────────────────────────────────────────────────────────────────
ops/LIVE_STATE.md           vivo/sessão     todos             executor ativo
ops/HANDOFF_LEDGER.md       vivo/imutável   todos             executor que fecha sessão
ops/FOL.md (este)           referência      todos             Claude (abertura de camada)
ops/NLF.md                  soberania ops   todos             Claude (mudanças aprovadas)
docs/NEXUS_OS.md            soberania docs  todos             Claude (razão explícita)
docs/DOC_BULK_PROTOCOL.md   protocolo       todos             selado — não altera
docs/DOC_BULKING_ESCADA.md  protocolo       todos             selado — não altera
```

---

## 7. CHECKLIST RÁPIDO DE SESSÃO

### Ao iniciar
```
[ ] Ler LIVE_STATE seção 1 → estado atual
[ ] Verificar minha fila na seção 2 → gate aberto?
[ ] Ler semáforo na seção 3 → natureza e executor corretos?
[ ] Ler bloqueios na seção 4 → algum me afeta?
[ ] Ler últimas 2 entradas do HANDOFF_LEDGER → contexto recente?
[ ] Confirmar Execution Map da task → ação válida agora?
```

### Ao encerrar
```
[ ] Atualizei cabeçalho do LIVE_STATE?
[ ] Atualizei seção 1 (estado atual)?
[ ] Atualizei MINHA fila na seção 2?
[ ] Atualizei semáforo e linha temporal?
[ ] Adicionei/removi bloqueios se necessário?
[ ] Adicionei entrada no topo do HANDOFF_LEDGER?
[ ] Emiti handoff no formato canônico?
[ ] Fiz commit + push?
```

---

## 8. O QUE FICA PARA A PRÓXIMA CAMADA

| Item | Por que fica | Quem decide |
|---|---|---|
| Feature work de produto | Fora do escopo desta camada | Owner (abertura de BULK-03+) |
| Integração Codex na escada (execução) | Aguarda alinhamento de branch | Codex + owner |
| Resolução de B-001/B-002/B-003 | Decisões soberanas do owner | Owner |
| Refinamento técnico do FOL | Papel de Codex após branch alinhado | Codex |
| Lapidação de superfície do FOL | Papel de Copilot na BULK-02.2 | Copilot |

---

## 9. PROTOCOLO DE CONSOLIDAÇÃO — CODEX CONSOLIDATOR

**Registrado em:** OPS-HANDOFF-001 | 2026-03-20

O Codex atua como **consolidador oficial de fase/onda**, mesmo sem branch alinhado.
Não executa produto. Não precisa de push. Opera sobre leitura de artefatos reais.

### Resumo do fluxo atualizado

```
[Pioneiros emitem handoffs no HANDOFF_LEDGER — como sempre]
        ↓
[Owner solicita: "Codex, consolida a onda N"]
        ↓
[Codex lê HANDOFF_LEDGER + LIVE_STATE → emite relatório-mãe]
        ↓
[Owner lê só o relatório-mãe → decide → próximo comando]
```

### O que o Codex consolida

| Papel | Descrição |
|---|---|
| Leitor de handoffs | Lê HANDOFF_LEDGER da fase/onda |
| Consolidador | Agrupa tarefas por estado (done/partial/blocked) |
| Auditor de coerência | Detecta conflitos entre handoffs |
| Sintetizador de bloqueios | Lista todos os bloqueios ativos |
| Organizador de próximo passo | Propõe próximos passos com base em evidência real |

### Regra de evidência

> Codex só consolida com base em: handoffs reais + logs reais + ledger real + LIVE_STATE real.
> Qualquer inferência sem evidência direta deve ser marcada com `⚠️ INFERÊNCIA:`.

### Taxonomia fixa de claims (obrigatória)

Para relatório-mãe, handoff de fase/onda, checkpoint de Tribunal técnico e leitura de claims de produto, usar somente:

- `DOCUMENTOS_DE_SUPORTE`
- `EVIDENCIA_FECHADA`
- `EM_CONSTRUCAO`
- `NAO_AFIRMADO`

Regras diretas:
- Visão não é evidência.
- Direção não é capacidade fechada.
- Capacidade real só existe quando houver código/documentação/validação no repositório.
- Claim sem fechamento técnico obrigatório entra como `NAO_AFIRMADO`.

### Referência completa

Ver `ops/CODEX_CONSOLIDATOR.md` — blueprint canônico completo com formato do relatório-mãe.

---

## 10. PADRÃO DE OUTPUT COPIÁVEL

**Registrado em:** OPS-OUTPUT-001 | 2026-03-20

Todo executor emite handoff em bloco copiável único — nunca em parágrafo solto.
Layout fixo, consistente e idêntico para todos os pioneiros.

### Dois blocos obrigatórios ao encerrar sessão

```
1. HANDOFF_TABLE     — campos: executor/modelo/task/status/feito/nao_feito/
                               bloqueios/adaptacoes/arquivos/impacto/
                               prox_passo/sugestoes/decisao_rec
2. CANALIZACAO_TABLE — campos: chat/branch/worktree/natureza/executor/estado/ativa
```

### Regra base

> Estrutura imutável. Beleza pode variar. Layout base não.
> Sempre em bloco de código — nunca em parágrafo solto.

### Referência completa

Ver `ops/OUTPUT_STANDARD.md` — templates, campos obrigatórios, regras de preenchimento e identidade operacional.

---

## 11. FLUXO AUTÔNOMO DOS PIONEIROS — AUTOFLOW

**Registrado em:** OPS-AUTOFLOW-001 | 2026-03-20

O AUTOFLOW sela a regra de comportamento autônomo dos pioneiros.
Ao terminar uma task, o pioneiro não entra em vazio — ele lê o estado e identifica a próxima peça elegível.

### Matrix de Pilar Dominante (resumo)

| Pioneiro | Pilar Dominante | Papel fora do pilar |
|---|---|---|
| **@claude** | Estrutura + Produto | Apoio/cooperativo (competência secundária) |
| **@codex** | Qualidade | Apoio/cooperativo (competência secundária) |
| **@copilot** | Lapidação | Apoio/cooperativo (competência secundária) |
| **@cursor** | Mecânico (transversal) | Desbloqueio em qualquer pilar |

### Loop AUTOFLOW (resumo dos 6 passos)

```
1. Lê LIVE_STATE (estado + sua fila + semáforo + bloqueios)
2. Lê HANDOFF_LEDGER (últimas 2 entradas)
3. Identifica task elegível no pilar dominante
4. Decide papel: FORÇA PRINCIPAL (pilar próprio) ou APOIO (pilar alheio)
5. Executa dentro da competência
6. Emite HANDOFF + Atualiza LIVE_STATE + Commit + Push → desbloqueia corrente
```

### Regra de competência (explícita)

> No pilar dominante → FORÇA PRINCIPAL → lidera o núcleo
> Fora do pilar → APOIO/COOPERATIVO → preenche lacuna sem deslocar líder
> A diferença não é de qualidade — é de liderança do núcleo.

### Referência completa

Ver `ops/AUTOFLOW.md` — documento canônico com loop completo, matrix, apoio cruzado,
motor de indução e o que o sistema torna desnecessário.

---

## 12. MODO DE IGNIÇÃO CONTÍNUA — IGNITION

**Registrado em:** OPS-IGNITION-001 | 2026-03-20

Quando **IGNIÇÃO_ATIVA** está ligada, o sistema opera em fluxo contínuo.
Os pioneiros seguem o loop de 7 passos em cadeia sem instrução manual entre tasks.

### Estado da Ignição

```
IGNIÇÃO: ATIVA
Ativada por: owner | 2026-03-20 | OPS-IGNITION-001
```

### Loop de 7 passos (resumo)

```
1. TERMINAR   → conclui a task ou registra partial/blocked
2. LER        → LIVE_STATE + HANDOFF_LEDGER + AUTOFLOW
3. SELECIONAR → task elegível no pilar dominante, ou apoio em pilar alheio
4. EXECUTAR   → dentro da competência, sem inventar fora do sistema
5. REGISTRAR  → HANDOFF + LIVE_STATE + commit + push
6. DESBLOQUEAR → marca o gate que a entrega abriu
7. CONTINUAR  → volta ao passo 1 com a próxima task elegível
```

### Quando o loop para

```
→ Ordem do owner
→ Bloqueio real sem contorno
→ Red line / Lei Absoluta
→ Gate soberano pendente
→ Falta de task elegível em qualquer pilar
```

### Referência completa

Ver `ops/IGNITION.md` — loop canônico, regras de prioridade, corredor comum,
handoff como pipeline, interruptor, o que a ignição não é.

---

## 13. ALIASES OPERACIONAIS DOS TERRITÓRIOS — WORKTREE ALIASES

**Registrado em:** OPS-WORKTREE-ALIAS-001 | 2026-03-20

Três aliases operacionais para uso diário em prompts, handoffs e protocolo:

| Alias | Território |
|---|---|
| **WorkStructure** | Estrutura, base, governança, sustentação |
| **WorkFunction** | Funcionalidade, integração, comportamento, produto vivo |
| **WorkVisual** | Design, UI, UX, identidade, apresentação |

**Glossário rápido:**
```
WorkStructure = o que sustenta    → base, protocolo, docs canônicas, infra
WorkFunction  = o que funciona    → produto, features, integrações, fluxos
WorkVisual    = o que aparece     → UI, UX, design, identidade, apresentação
```

**Regras:**
- Aliases válidos em qualquer campo de território, frente ou área dos docs ops/
- Nomes técnicos legados continuam como referência interna quando necessário
- Aliases são ortogonais à matrix de pilar dominante dos pioneiros (AUTOFLOW)
- Nenhuma referência técnica existente foi removida ou renomeada no Git

**Referência completa:** `ops/WORKTREE_ALIASES.md`

---

## 14. EVIDENCE_BLOCK — BLOCO OBRIGATÓRIO DE EVIDÊNCIA REAL

**Registrado em:** OPS-EVIDENCE-BLOCK-001 | 2026-03-20

Todo handoff formal inclui agora um terceiro bloco obrigatório: **EVIDENCE_BLOCK**.

**Propósito:** distinguir imediatamente se uma task foi executada, analisada, sugerida ou entregue sem prova suficiente.

**Ordem de emissão por sessão:**
```
1. HANDOFF_TABLE
2. EVIDENCE_BLOCK   ← novo, obrigatório
3. CANALIZACAO_TABLE
```

**Template rápido:**
```
EVIDENCE ═══════════════════════════════════════════════════════════════════
ARQUIVOS_TOCADOS_REAIS │ file1 | file2 — ou: nenhum
TIPO_DE_ACAO           │ create | edit | review | analyze | no-change
PROVA_MINIMA           │ commit id | seção alterada | arquivo criado | analysis-only
ALTERACAO_REAL         │ sim | não
═══════════════════════════════════════════════════════════════════════════
```

**Leitura rápida:**

| ALTERACAO_REAL | Leitura |
|---|---|
| sim + create/edit | artefacto entrou ou mudou no sistema |
| não + review/analyze | task executada como análise — sem mudança |
| não + no-change | task concluída sem alteração — ou bloqueada |

**Regra:** handoff sem EVIDENCE_BLOCK deixa de ser prova forte.

**Referência completa:** `ops/OUTPUT_STANDARD.md` seção 8

---

---

## 15. BASTION — CORAÇÃO CANÔNICO DE EXECUÇÃO

**Registrado em:** OPS-BASTION-001 | 2026-03-20

O **BASTION** é a fonte única de execução elegível do Eternal Nexus OS.
Pioneiro que não encontra task elegível no BASTION não executa.

**Hierarquia operacional:**

| Elemento | Papel |
|---|---|
| **BASTION** | Coração — matriz viva de tasks elegíveis |
| **Codex** | Cérebro-orquestrador — lê, distribui, consolida |
| **Claude** | Arquiteto-executor — abre frentes, actualiza BASTION com owner |
| **Demais pioneiros** | Executores conforme matriz e worktree |
| **Owner** | Soberano — único que abre gates e aprova fases |

**Loop do pioneiro:**
```
1. Ler BASTION → task elegível com NEXT_ACTOR: eu?
2. Verificar DEPENDENCIA_STATUS → livre?
3. Verificar PODE_ENTRAR_SOZINHO → sim?
4. Executar dentro do worktree e pilar declarados
5. Handoff: HANDOFF_TABLE + EVIDENCE_BLOCK + CANALIZACAO_TABLE
6. Voltar ao BASTION
```

**Regra-mãe:** deriva começa onde o BASTION termina.
Pioneiro não cria trabalho fora do BASTION. Pioneiro não salta gate.

**Referência completa:** `ops/BASTION.md`

---

*FOL v1 — aberto em 2026-03-20 | claude-sonnet-4-6 | BULK-02.1*
*FOL v1.1 — seção 9 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-HANDOFF-001*
*FOL v1.2 — seção 10 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-OUTPUT-001*
*FOL v1.3 — seção 11 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-AUTOFLOW-001*
*FOL v1.4 — seção 12 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-IGNITION-001*
*FOL v1.5 — seção 13 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-WORKTREE-ALIAS-001*
*FOL v1.6 — seção 14 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-EVIDENCE-BLOCK-001*
*FOL v1.7 — seção 15 adicionada em 2026-03-20 | claude-sonnet-4-6 | OPS-BASTION-001*
