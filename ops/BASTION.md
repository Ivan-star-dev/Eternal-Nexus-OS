# BASTION — Coração Canônico de Execução dos Pioneiros

**Versão:** v1
**Data:** 2026-03-20
**Task:** OPS-BASTION-001
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

> O BASTION é a fonte única de execução elegível do Eternal Nexus OS.
> Pioneiro que não encontra sua task elegível no BASTION não executa.
> Pioneiro que termina task faz handoff e volta ao BASTION.
> Deriva começa onde o BASTION termina.

---

## 1. IDENTIDADE DO BASTION

| Elemento | Papel |
|---|---|
| **BASTION** | Coração — matriz viva de execução elegível; fonte única de autoridade operacional |
| **Codex** | Cérebro-orquestrador — lê o BASTION, distribui tasks, consolida ondas |
| **Claude** | Arquiteto-executor — abre frentes, executa tasks de alta soberania, actualiza o BASTION com owner |
| **Copilot** | Executor-lapidador — entra nas tasks elegíveis dentro do seu worktree e pilar |
| **Cursor** | Executor-desbloqueador — gates mecânicos, backlog técnico, desbloqueio rápido |
| **Owner** | Soberano — único que abre novos gates, aprova fases, altera prioridades no BASTION |

**Regra-mãe:**
- Só o que estiver com `STATUS: elegível` no BASTION é executável.
- Pioneiro não cria trabalho fora do BASTION.
- Pioneiro não abre nova fase sozinho.
- Pioneiro não salta gate.
- Pioneiro termina task → faz handoff → volta ao BASTION.
- Owner + Claude atualizam o BASTION. Codex orquestra a leitura.

---

## 2. TERRITÓRIOS (WORKTREE ALIASES)

| Alias | Território | Competência máxima |
|---|---|---|
| **WorkStructure** | Estrutura / base / governança / protocolos / ops | @claude / @copilot |
| **WorkFunction** | Funcionalidade / integração / comportamento / produto vivo | @claude / @cursor |
| **WorkVisual** | Design / UI / UX / identidade / apresentação | @copilot |

**Regra de território:**
- No próprio território: competência máxima — executa sem consulta adicional.
- Fora do território: apoio secundário — executa com cuidado; não abre frente nova.
- Território é guia de competência, não de exclusividade absoluta.

---

## 3. REGRA DE EXECUÇÃO

```
LOOP DO PIONEIRO:
───────────────────────────────────────────────────────────────────────────
1. Ler BASTION → identificar tasks com STATUS: elegível + NEXT_ACTOR: eu
2. Verificar DEPENDENCIA_STATUS → se pendente, aguardar
3. Verificar PODE_ENTRAR_SOZINHO → se não, aguardar gate do owner
4. Executar task dentro do worktree e pilar declarados
5. Ao concluir → emitir HANDOFF_TABLE + EVIDENCE_BLOCK + CANALIZACAO_TABLE
6. Voltar ao BASTION → ler próxima task elegível
───────────────────────────────────────────────────────────────────────────
```

**O pioneiro NÃO:**
- Não inventa tasks fora do BASTION
- Não abre nova fase sem gate do owner
- Não salta dependência bloqueada
- Não actua fora do seu worktree sem aprovação explícita
- Não assume que task PLANEJADA é elegível sem mudança de status

**O pioneer SIM:**
- Lê BASTION antes de cada sessão
- Executa só o que estiver elegível
- Fecha com EVIDENCE_BLOCK (ALTERACAO_REAL obrigatório)
- Actualiza BASTION ao concluir (via handoff ou instrução directa)

---

## 4. ESTRUTURA DA MATRIZ DE TASKS

Cada item da matriz regista os seguintes campos:

| Campo | Descrição |
|---|---|
| `TASK_ID` | Identificador único (ex: OPS-BASTION-001, PLv6.2-b) |
| `PILAR` | Produto / Governança / Consolidação / Operacional / Mecânico |
| `WORKTREE_ALIAS` | WorkStructure / WorkFunction / WorkVisual |
| `DONO_PRINCIPAL` | @pioneiro responsável pela execução principal |
| `APOIO_SECUNDARIO` | @pioneiro de apoio — ou: nenhum |
| `STATUS` | elegível / planejada / bloqueada / concluída / aguarda-gate |
| `DEPENDENCIA_STATUS` | livre / pendente / bloqueada |
| `DEPENDE_DE` | TASK_ID da qual depende — ou: nenhum |
| `PODE_ENTRAR_SOZINHO` | sim / não (não = requer gate do owner) |
| `PRIORIDADE` | P1 (crítica) / P2 (alta) / P3 (normal) / P4 (backlog) |
| `GATE` | aberto / fechado / aguarda-owner |
| `NEXT_ACTOR` | quem entra a seguir |
| `NEXT_TASK` | próxima task após esta |
| `EVIDENCIA_MINIMA` | o que deve aparecer no EVIDENCE_BLOCK para fechar a task |
| `NOTAS_DO_OWNER` | decisões soberanas, restrições, contexto privado |

---

## 5. MATRIZ VIVA DE TASKS

> Esta é a matriz operacional activa do sistema.
> Fonte única de execução elegível.
> Owner + Claude actualizam. Codex orquestra a leitura e distribuição.

---

### 5.1 TASKS CONCLUÍDAS (Histórico)

| TASK_ID | PILAR | WORKTREE | DONO_PRINCIPAL | STATUS | EVIDENCIA |
|---|---|---|---|---|---|
| E17 | Produto | WorkFunction | @claude | concluída | handoff emitido |
| E18 | Governança | WorkStructure | @claude | concluída | handoff emitido |
| BULK-01.1 | Operacional | WorkStructure | @claude | concluída | handoff emitido |
| BULK-02.1 | Governança | WorkStructure | @claude | concluída | handoff emitido — FOL v1 |
| BULK-03.1 | Produto | WorkFunction | @claude | concluída | handoff emitido — PLv1 |
| BULK-03.2 | Produto | WorkFunction | @claude | concluída | handoff emitido — PLv2 |
| BULK-04.1 | Produto | WorkFunction | @claude | concluída | handoff emitido — PLv3 |
| SUPER-BULK-A | Produto | WorkFunction | @claude | concluída | handoff emitido — PLv4 |
| PLv5.1 | Produto | WorkFunction | @claude | concluída | handoff emitido — PLv5 |
| PLv6.1 | Produto | WorkFunction | @claude | concluída | handoff emitido — PLv6.1 |
| PLv6.2-a | Produto | WorkFunction | @claude | concluída | handoff emitido — PLv6.2-a |
| OPS-OUTPUT-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — OUTPUT_STANDARD v1 |
| GENESIS-FOUNDER-001 | Governança | WorkStructure | @claude | concluída | handoff emitido |
| OPS-AUTOFLOW-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — AUTOFLOW v1 |
| FOUNDER-VISION-LAYER-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — FVL v1 |
| OPS-IGNITION-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — IGNITION v1 |
| OPS-WORKTREE-ALIAS-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — WORKTREE_ALIASES v1 |
| OPS-EVIDENCE-BLOCK-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — OUTPUT_STANDARD v1.1 + FOL v1.6 |
| OPS-BASTION-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — BASTION v1 criado |
| OPS-BASTION-DISPATCH-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — BASTION_DISPATCH_001.md emitido |
| OPS-BASTION-AUTO-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — modo automático selado; IGNIÇÃO_ATIVA permanente |
| OPS-BASTION-AUTO-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — modo automático BASTION/IGNITION activo |
| OPS-FULL-AUTO-UNTIL-STOP-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — execução contínua reforçada até segunda ordem |

---

### 5.2 TASKS ACTIVAS E ELEGÍVEIS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BULK-02.2                                               │
│ PILAR              │ Governança / Operacional                                │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @copilot                                                │
│ APOIO_SECUNDARIO   │ nenhum                                                  │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P3                                                      │
│ GATE               │ aberto                                                  │
│ NEXT_ACTOR         │ @copilot                                                │
│ NEXT_TASK          │ BULK-02.2 completa → @owner decide PLv6.2-b ou FVL     │
│ EVIDENCIA_MINIMA   │ arquivos ops/ tocados + commit id + ALTERACAO_REAL: sim │
│ NOTAS_DO_OWNER     │ Lapidação de ops/ — remover rastos de PLv4/PLv5/PLv6;  │
│                    │ suavizar superfície operacional; sem alteração soberana  │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BULK-01.3-a                                             │
│ PILAR              │ Mecânico                                                │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @cursor                                                 │
│ APOIO_SECUNDARIO   │ nenhum                                                  │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P3                                                      │
│ GATE               │ aberto                                                  │
│ NEXT_ACTOR         │ @cursor                                                 │
│ NEXT_TASK          │ BULK-01.3-b                                             │
│ EVIDENCIA_MINIMA   │ arquivo removido do tracking + ALTERACAO_REAL: sim      │
│ NOTAS_DO_OWNER     │ Remover vite.config.ts.timestamp-* do versionamento     │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BULK-01.3-b                                             │
│ PILAR              │ Mecânico                                                │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @cursor                                                 │
│ APOIO_SECUNDARIO   │ nenhum                                                  │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P3                                                      │
│ GATE               │ aberto                                                  │
│ NEXT_ACTOR         │ @cursor                                                 │
│ NEXT_TASK          │ BULK-01.3-c                                             │
│ EVIDENCIA_MINIMA   │ decisão PM canônico (B-002) ou limpeza + ALTERACAO_REAL │
│ NOTAS_DO_OWNER     │ Avaliar bun.lock + package-lock.json — PM canônico?     │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BULK-01.3-c                                             │
│ PILAR              │ Mecânico                                                │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @cursor                                                 │
│ APOIO_SECUNDARIO   │ nenhum                                                  │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P4                                                      │
│ GATE               │ aberto                                                  │
│ NEXT_ACTOR         │ @cursor                                                 │
│ NEXT_TASK          │ @owner decide próximo backlog mecânico                  │
│ EVIDENCIA_MINIMA   │ avaliação registada + decisão clara + ALTERACAO_REAL    │
│ NOTAS_DO_OWNER     │ Verificar antigravity/legacy-html/ — lixo mecânico?     │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BULK-01.2 / L-001                                       │
│ PILAR              │ Mecânico                                                │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @copilot                                                │
│ APOIO_SECUNDARIO   │ nenhum                                                  │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P3                                                      │
│ GATE               │ aberto                                                  │
│ NEXT_ACTOR         │ @copilot                                                │
│ NEXT_TASK          │ BULK-01.2 / L-002                                       │
│ EVIDENCIA_MINIMA   │ .gitignore actualizado + ALTERACAO_REAL: sim            │
│ NOTAS_DO_OWNER     │ Higiene .gitignore — cobrir gaps mapeados pelo Tribunal  │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BULK-01.2 / L-002                                       │
│ PILAR              │ Mecânico                                                │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @copilot                                                │
│ APOIO_SECUNDARIO   │ nenhum                                                  │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ pendente                                                │
│ DEPENDE_DE         │ BULK-01.2 / L-001                                       │
│ PODE_ENTRAR_SOZINHO│ não                                                     │
│ PRIORIDADE         │ P3                                                      │
│ GATE               │ aberto (após L-001)                                     │
│ NEXT_ACTOR         │ @copilot                                                │
│ NEXT_TASK          │ BULK-02.2                                               │
│ EVIDENCIA_MINIMA   │ timestamp file removido do tracking + ALTERACAO_REAL    │
│ NOTAS_DO_OWNER     │ git rm --cached do timestamp file já rastreado          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.3 TASKS PLANEJADAS (Aguardam Gate do Owner)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ PLv6.2-b                                                │
│ PILAR              │ Produto                                                 │
│ WORKTREE_ALIAS     │ WorkFunction                                            │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ APOIO_SECUNDARIO   │ a definir                                               │
│ STATUS             │ aguarda-gate                                            │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ não                                                     │
│ PRIORIDADE         │ P2                                                      │
│ GATE               │ fechado — aguarda decisão owner                         │
│ NEXT_ACTOR         │ @owner (decide) → @claude (executa)                     │
│ NEXT_TASK          │ a definir                                               │
│ EVIDENCIA_MINIMA   │ a definir pelo owner ao abrir gate                      │
│ NOTAS_DO_OWNER     │ NewsAPI? project_metrics? página dedicada de portfólio? │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ FVL-IMPL-001                                            │
│ PILAR              │ Produto                                                 │
│ WORKTREE_ALIAS     │ WorkFunction + WorkVisual                               │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ APOIO_SECUNDARIO   │ @copilot (WorkVisual)                                   │
│ STATUS             │ aguarda-gate                                            │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ não                                                     │
│ PRIORIDADE         │ P2                                                      │
│ GATE               │ fechado — aguarda decisão owner                         │
│ NEXT_ACTOR         │ @owner (decide) → @claude (executa)                     │
│ NEXT_TASK          │ a definir                                               │
│ EVIDENCIA_MINIMA   │ rota /founder implementada + ALTERACAO_REAL: sim        │
│ NOTAS_DO_OWNER     │ Blueprint FVL v1 pronto; paralelo ou sequencial c/ PLv6.2-b │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.4 TASKS BLOQUEADAS

| TASK_ID | BLOQUEIO | AGUARDA |
|---|---|---|
| BULK-01-Codex | Branch @codex não alinhado ao canônico | Alinhamento de branch na próxima onda |
| F6 | Em andamento por @codex | Frente independente — não bloqueia outras |

---

## 6. PROTOCOLO DE ACTUALIZAÇÃO DO BASTION

**Quem actualiza:**
- Owner → qualquer campo; gates; notas soberanas; prioridade; abertura de fase
- Claude → TASK_ID, STATUS, EVIDENCIA_MINIMA, NOTAS_DO_OWNER operacionais; ao abrir nova frente com owner
- Codex → STATUS de tasks concluídas após consolidação; NEXT_ACTOR / NEXT_TASK

**Como actualizar:**
1. Mover task de 5.2 → 5.1 ao concluir (com data e commit)
2. Actualizar STATUS + DEPENDENCIA_STATUS dos dependentes
3. Registar NEXT_ACTOR correcto
4. Emitir EVIDENCE_BLOCK com ALTERACAO_REAL: sim ao actualizar

**O que NÃO fazer:**
- Nunca deletar tasks do histórico (5.1) — manter rastreio completo
- Nunca mover task para elegível sem aprovação do owner (se PODE_ENTRAR_SOZINHO: não)
- Nunca alterar NOTAS_DO_OWNER sem instrução directa do owner

---

## 7. CODEX COMO ORQUESTRADOR DO BASTION

O Codex não executa. O Codex lê, distribui e consolida.

**Função do Codex em relação ao BASTION:**

```
1. Ler BASTION ao início de cada onda
2. Identificar tasks elegíveis por executor
3. Distribuir tasks aos pioneiros (via relatório-mãe ou instrução directa)
4. Verificar EVIDENCE_BLOCK de cada handoff recebido
5. Consolidar ondas: TASK_ID → STATUS → ALTERACAO_REAL
6. Sinalizar ao owner: tarefas done / partial / blocked / sem evidência
7. Actualizar BASTION após consolidação
```

**Relatório-mãe do Codex inclui (por task):**
- TASK_ID | EXECUTOR | STATUS | ALTERACAO_REAL | EVIDENCIA_MINIMA recebida

---

## 8. SEMÁFORO DO BASTION

```
BASTION ════════════════════════════════════════════════════════════════════
VERSÃO          │ v1.2
DATA            │ 2026-03-21
ÚLTIMA_ACTUAÇÃO │ OPS-BASTION-AUTO-001 | @claude | 2026-03-21
VERSÃO          │ v1.3
DATA            │ 2026-03-20
ÚLTIMA_ACTUAÇÃO │ OPS-FULL-AUTO-UNTIL-STOP-001 | @claude | 2026-03-21
ESTADO          │ ACTIVO — fonte única de execução elegível
DISPATCH        │ BASTION_DISPATCH_001 + OPS_FULL_AUTO_UNTIL_STOP_001 activos
TASKS_ELEGÍVEIS │ BULK-02.2 | BULK-01.3-a | BULK-01.3-b | BULK-01.3-c |
                │ BULK-01.2/L-001 | BULK-01.2/L-002
@copilot        │ ACTIVADO → L-001 → L-002 → BULK-02.2
@cursor         │ ACTIVADO → 01.3-a → 01.3-b → 01.3-c
@codex          │ CONSOLIDADOR ATIVO → aguarda handoffs para relatório-mãe
@claude         │ MODO AUTOMÁTICO SELADO — aguarda gate owner (PLv6.2-b / FVL-IMPL-001)
@codex          │ CONSOLIDADOR/TRIBUNAL ATIVO → KEEP/SALVAGE/KILL/REBUILD quando necessário
@claude         │ GUARDA DO TOPO DO BASTION + arbitragem canônica contínua
AUTOMÁTICO      │ ON — terminou task = volta ao BASTION; entrada automática só com
                │ NEXT_ACTOR correspondente + ACTIVATION_MODE: imediato + CONDITION: nenhuma
GATES_FECHADOS  │ PLv6.2-b | FVL-IMPL-001 (aguardam owner)
BLOQUEADAS      │ BULK-01-Codex (branch) | F6 (em andamento)
IGNIÇÃO         │ ATIVA — PERMANENTE (até ordem owner / gate soberano / bloqueio real / sem elegível)
MODO_AUTO       │ SELADO — pioneiros seguem BASTION sem instrução manual entre tasks
DERIVA          │ 🔴 impermitida — qualquer execução fora do BASTION é deriva
════════════════════════════════════════════════════════════════════════════
```

---

## 9. LOCALIZAÇÃO CANÔNICA

| Artefacto | Localização |
|---|---|
| Este ficheiro | `ops/BASTION.md` |
| Dispatch activo | `ops/BASTION_DISPATCH_001.md` |
| Referência no FOL | `ops/FOL.md` seção 15 |
| Padrão de output | `ops/OUTPUT_STANDARD.md` |
| Estado vivo | `ops/LIVE_STATE.md` |
| Histórico de handoffs | `ops/HANDOFF_LEDGER.md` |
| Orquestração do Codex | `ops/CODEX_CONSOLIDATOR.md` |
| Modo de ignição | `ops/IGNITION.md` |
| Fluxo autônomo | `ops/AUTOFLOW.md` |
| Ordem full-auto | `ops/OPS_FULL_AUTO_UNTIL_STOP_001.md` |

---

*BASTION.md v1 — criado em 2026-03-20 | claude-sonnet-4-6 | OPS-BASTION-001*
*BASTION.md v1.1 — semáforo actualizado com dispatch em 2026-03-20 | claude-sonnet-4-6 | OPS-BASTION-DISPATCH-001*
*BASTION.md v1.2 — modo automático selado; IGNIÇÃO_ATIVA permanente registada em 2026-03-21 | claude-sonnet-4-6 | OPS-BASTION-AUTO-001*
*BASTION.md v1.2 — modo automático BASTION/IGNITION reforçado em 2026-03-21 | claude-sonnet-4-6 | OPS-BASTION-AUTO-001*
*BASTION.md v1.3 — execução contínua reforçada até segunda ordem em 2026-03-21 | claude-sonnet-4-6 | OPS-FULL-AUTO-UNTIL-STOP-001*
