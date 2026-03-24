# BASTION — Coração Canônico de Execução dos Pioneiros

**Versão:** v1.3
**Data:** 2026-03-21
**Task:** OPS-BASTION-001
**Versão:** v2.0
**Data:** 2026-03-21
**Task:** BASTION-2.0-CYCLE-START-001
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-4.6-opus-high-thinking
**Aprovado por:** owner (instrução direta — ordem de ignição operacional)
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
| **WorkVisual** | Design / UI / UX / identidade / apresentação | @framer / @antigravity / @copilot |

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
**O pioneiro SIM:**
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
| PLv6.2-b | Produto | WorkFunction | @claude | concluída | handoff emitido — project_metrics expandido (CO₂, jobs, SDG, impactScore, PortfolioImpactSummary) |
| FVL-IMPL-001 | Produto | WorkFunction+WorkVisual | @claude | concluída | handoff emitido — FounderPage v2 (hero atmosférico, secção Architects, 6 pioneers, seal v2) |
| BULK-01.2/L-001 | Mecânico | WorkStructure | @claude | concluída | .gitignore auditado — sem gaps; vite/bun/cli já cobertos |
| BULK-01.2/L-002 | Mecânico | WorkStructure | @claude | concluída | timestamp files não rastreados — .gitignore resolve |
| BULK-01.3-a | Mecânico | WorkStructure | @claude | concluída | vite timestamps não tracked — confirmado |
| BULK-01.3-b | Mecânico | WorkStructure | @claude | concluída | decisão: npm canónico; package-lock.json tracked; bun.lock excluído |
| BULK-01.3-c | Mecânico | WorkStructure | @claude | concluída | antigravity/ auditado — 168 ficheiros research assets intencional; sem lixo |
| BULK-02.2 | Governança | WorkStructure | @claude | concluída | NEXUS_NEURAL_MESH.md lapidado — 4 rastos PLv6 actualizados para estado real |
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
| BASTION-2.0-CYCLE-START-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — ciclo contínuo BASTION 2.0 iniciado |
| COUNCIL-PR-TRIAGE-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — triagem 27 PRs/Issues |
| BASTION-2.0-CYCLE-START-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — ciclo contínuo BASTION 2.0 activado |
| BULK-01.3-a | Mecânico | WorkStructure | @cursor | concluída | já resolvido por @copilot F5 — timestamp removido do tracking + .gitignore blindado |
| BULK-01.3-b | Mecânico | WorkStructure | @cursor | concluída | análise done — npm é PM canônico; bun.lock residual; aguarda B-002 owner para remoção |
| BULK-01.3-c | Mecânico | WorkStructure | @cursor | concluída | análise done — 5 HTMLs legacy do owner (420K); zero refs no src/; aguarda B-003 owner |
| OPS-FULL-AUTO-UNTIL-STOP-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — execução contínua reforçada até segunda ordem |
| BASTION-2.0-CYCLE-START-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — BASTION 2.0 ciclo activado por ordem owner |
| DNA-PROTOCOL-MOTHER-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — DNA_PROTOCOL.md v1 criado |
| NEXUS-PIONEER-ROLE-MOTHER-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — PIONEER_MATRIX.md v1 criado; papéis cravados; 3 chats selados |
| NEXUS-FOUNDATION-REFINEMENT-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — 7 refinamentos estruturais; OUTPUT_STANDARD v2.1; DNA v1.1; BASTION v1.6; FOL v2.0; NEXUS_OS v1.1; PIONEER_MATRIX v1.1 |
| NEXUS-ELIGIBLE-CROSS-SUPPORT-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — CROSS_SUPPORT_PROTOCOL.md v1 criado; FOL v2.1 seção 18; DNA v1.2 mapa |
| NEXUS-FLOWMESH-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — FLOWMESH.md v1.0 criado; roteamento adaptativo; 8 blocos; 12 departamentos |
| NEXUS-NEURAL-MESH-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — NEXUS_NEURAL_MESH.md v1.0 criado; 10 partes; camada de inteligência viva |
| NEXUS-FRACTAL-JUDGMENT-CORE-001-LITE | Governança | WorkStructure | @claude | concluída | handoff emitido — NEXUS_FRACTAL_JUDGMENT_CORE.md v1.0 + NEXUS_LIVING_CANON.md v1.0 criados; Fractal Council 7 nós; JVF; 7 sentenças |
| NEXUS-FRACTAL-JUDGMENT-CORE-001 | Governança | WorkStructure | @claude | concluída | handoff emitido — NEXUS_FRACTAL_JUDGMENT_CORE.md v2.0; FRACTAL_COUNCIL_MATRIX 9 nós; JVF 10 critérios; Flagship Threshold; Seven-Force; escalas de mobilização |
| NEXUS-V10-SOVEREIGN-DESTINY-001 | Visão | WorkStructure | @claude | concluída | handoff emitido — NEXUS_V10_SOVEREIGN_DESTINY.md v1.0; 7 dimensões V10; brain-first architecture; V10_GAP_MATRIX; alignment debt; 5 seeds + 5 gates BASTION |
| FOUNDER-SIGNATURE-CANON-001 | Identidade | WorkStructure | @claude | concluída | handoff emitido — FOUNDER_SIGNATURE_CANON.md v1.0; assinatura canônica do founder; 3 blocos; camada 0.5 cravada |
| FOUNDER-STORY-SPINE-001 | Identidade | WorkStructure | @claude | concluída | handoff emitido — FOUNDER_STORY_SPINE.md v1.0; espinha da história; 6 viradas; FRASES_CANON; camada 0.6 cravada |
| GREAT-STORY-OF-THE-PRODUCT-001 | Identidade | WorkStructure | @claude | concluída | handoff emitido — GREAT_STORY_OF_HEAVEN_LAB.md v1.0; mito real; 3 filhos; MOTHER_PHRASES; camada 0.7 cravada |
| HEAVEN-LAB-REFERENCE-SURFACE-001 | Visão/WorkVisual | WorkStructure | @claude | concluída | handoff emitido — HEAVEN_LAB_REFERENCE_SURFACE.md v1.0; 5 blocos; globe+trinity+chamber+substrate+proof; gates Framer+Antigravity definidos |
| SYSTEM-FACE-CANON-001 | Identidade Visual | WorkStructure | @claude | concluída | handoff emitido — SYSTEM_FACE_CANON.md v1.0; 3 faces; FACE_SEPARATION_MATRIX; herança mãe + deriva proibida por face |
| TYPOGRAPHY-LAW-001 | Identidade Visual | WorkStructure | @claude | concluída | handoff emitido — TYPOGRAPHY_LAW.md v1.0; weight matrix; family use map; escala canónica; 13 proibições |

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
### 5.3 TASKS ELEGÍVEIS — GATE ABERTO PELO OWNER (2026-03-22)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ PLv6.2-b [CONCLUÍDA — ver 5.1]                          │
│ PILAR              │ Produto                                                 │
│ WORKTREE_ALIAS     │ WorkFunction                                            │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ APOIO_SECUNDARIO   │ @codex (consolidação) / @cursor (suporte mecânico)      │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ ABERTO — owner abriu em 2026-03-22                      │
│ NEXT_ACTOR         │ @claude                                                 │
│ NEXT_TASK          │ FVL-IMPL-001 (paralelo)                                 │
│ EVIDENCIA_MINIMA   │ NewsAPI integrada OU project_metrics expandido + commit │
│ NOTAS_DO_OWNER     │ GATE ABERTO — fechar este ciclo; prioridade máxima      │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ FVL-IMPL-001 [CONCLUÍDA — ver 5.1]                      │
│ PILAR              │ Produto                                                 │
│ WORKTREE_ALIAS     │ WorkFunction + WorkVisual                               │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ APOIO_SECUNDARIO   │ @copilot (WorkVisual) / @antigravity (WorkVisual)       │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ ABERTO — owner abriu em 2026-03-22                      │
│ NEXT_ACTOR         │ @claude + @copilot (paralelo)                           │
│ NEXT_TASK          │ CYCLE-CLOSE-001                                         │
│ EVIDENCIA_MINIMA   │ rota /founder funcional + visual polido + ALTERACAO_REAL│
│ NOTAS_DO_OWNER     │ GATE ABERTO — executar em paralelo com PLv6.2-b         │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ CYCLE-CLOSE-001                                         │
│ PILAR              │ Consolidação                                            │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @codex                                                  │
│ APOIO_SECUNDARIO   │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ pendente                                                │
│ DEPENDE_DE         │ PLv6.2-b + FVL-IMPL-001 + BULK-02.2 + BULK-01.2/L-002  │
│ PODE_ENTRAR_SOZINHO│ sim (entra após handoffs)                               │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ ABERTO                                                  │
│ NEXT_ACTOR         │ @codex                                                  │
│ NEXT_TASK          │ PR para main                                            │
│ EVIDENCIA_MINIMA   │ relatório-mãe consolidado + todos os handoffs recebidos │
│ NOTAS_DO_OWNER     │ Fechar o ciclo: consolidar tudo → PR → main             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NEXUS-FRACTAL-JUDGMENT-CORE-001                        │
│ PILAR              │ Governança / WorkStructure                              │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ ABERTO — owner autorizou em 2026-03-23                  │
│ NEXT_ACTOR         │ @claude                                                 │
│ EVIDENCIA_MINIMA   │ NEXUS_FRACTAL_JUDGMENT_CORE.md v2.0 + ALTERACAO_REAL   │
│ NOTAS_DO_OWNER     │ Versão full: FRACTAL_COUNCIL_MATRIX tabela, JVF 10      │
│                    │ critérios, Flagship Threshold, Seven-Force integration  │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NEXUS-V10-SOVEREIGN-DESTINY-001                        │
│ PILAR              │ Visão / WorkStructure                                   │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ ABERTO — owner autorizou em 2026-03-23                  │
│ NEXT_ACTOR         │ @claude                                                 │
│ EVIDENCIA_MINIMA   │ NEXUS_V10_SOVEREIGN_DESTINY.md criado + ALTERACAO_REAL │
│ NOTAS_DO_OWNER     │ V10 compacto: 7 dimensões, brain-first, gap matrix,    │
│                    │ seeds para BASTION, retroengenharia do destino final    │
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
VERSÃO          │ v1.3
DATA            │ 2026-03-21
ÚLTIMA_ACTUAÇÃO │ BASTION-2.0-CYCLE-START-001 | @claude | 2026-03-21
ESTADO          │ ACTIVO — fonte única de execução elegível
DISPATCH        │ BASTION 2.0 activo — pioneiros em loop contínuo por elegibilidade
TASKS_ELEGÍVEIS │ BULK-02.2 | BULK-01.3-a | BULK-01.3-b | BULK-01.3-c |
                │ BULK-01.2/L-001 | BULK-01.2/L-002
@copilot        │ ACTIVADO → lê BASTION → executa elegível WorkStructure (L-001/L-002/BULK-02.2)
@cursor         │ ACTIVADO → lê BASTION → executa elegível mecânico (01.3-a/b/c)
@codex          │ CONSOLIDADOR ATIVO → audita estado do BASTION e ordena dependências
@claude         │ ARBITRAGEM ACTIVA — topo do BASTION coerente + semáforo vivo
VERSÃO          │ v2.0
DATA            │ 2026-03-21
ÚLTIMA_ACTUAÇÃO │ BULK-01.3-a/b/c | @cursor | 2026-03-21
ESTADO          │ ACTIVO — CICLO CONTÍNUO 2.0 EM EXECUÇÃO
DISPATCH        │ BASTION_DISPATCH_001 emitido — @copilot + @cursor + @codex activados
CICLO           │ BASTION 2.0 — fluxo contínuo sem microgestão do owner
TASKS_ELEGÍVEIS │ BULK-02.2 | BULK-01.2/L-001 | BULK-01.2/L-002
@copilot        │ ACTIVADO → L-001 → L-002 → BULK-02.2 (FORÇA PRINCIPAL: Lapidação)
@cursor         │ 01.3-a DONE (já resolvido) | 01.3-b DONE (análise→B-002) | 01.3-c DONE (análise→B-003) | SEM TASK ELEGÍVEL
@codex          │ CONSOLIDADOR ATIVO → aguarda handoffs para relatório-mãe
@claude         │ ARBITER ACTIVO — sem tasks elegíveis; aguarda gate owner (PLv6.2-b / FVL-IMPL-001)
@antigravity    │ SEM TASK ELEGÍVEL — entra apenas se task do território aparecer no BASTION
@framer         │ SEM TASK ELEGÍVEL — entra apenas se task do território aparecer no BASTION
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
IGNIÇÃO         │ ATIVA — ciclo contínuo iniciado por ordem do owner 2026-03-21
IGNIÇÃO         │ ATIVA — PERMANENTE (até ordem owner / gate soberano / bloqueio real / sem elegível)
MODO_AUTO       │ SELADO — pioneiros seguem BASTION sem instrução manual entre tasks
DERIVA          │ 🔴 impermitida — qualquer execução fora do BASTION é deriva
INTERRUPTOR     │ Parar apenas por: ordem owner | gate soberano | bloqueio real | red line | sem elegível
VERSÃO          │ v2.0
DATA            │ 2026-03-22
ÚLTIMA_ACTUAÇÃO │ BULK-CLOSE | @claude cross-support | 2026-03-22
ESTADO          │ PRONTO PARA CYCLE-CLOSE-001 — todas as tasks elegíveis concluídas
CICLO_2.0       │ SPRINT FINAL — aguarda só PR para main
DISPATCH        │ BASTION_DISPATCH_002 emitido — FECHAMENTO DE CICLO
TASKS_ELEGÍVEIS │ nenhuma — próxima frente aguarda gates owner (ver NEXT_BASTION_INSERTS em NEXUS_V10_SOVEREIGN_DESTINY.md)
TASKS_CONCLUÍDAS│ PLv6.2-b ✓ | FVL-IMPL-001 ✓ | BULK-02.2 ✓ |
                │ BULK-01.2/L-001 ✓ | BULK-01.2/L-002 ✓ |
                │ BULK-01.3-a ✓ | BULK-01.3-b ✓ | BULK-01.3-c ✓ |
                │ CYCLE-CLOSE-001 ✓ | NEXUS-FRACTAL-JUDGMENT-CORE-001-LITE ✓ |
                │ NEXUS-FRACTAL-JUDGMENT-CORE-001 ✓ | NEXUS-V10-SOVEREIGN-DESTINY-001 ✓
@claude         │ DONE — todas as tasks P1 + cross-support mecânico concluídas
@copilot        │ LIBERADO — tasks completadas por @claude em cross-support
@cursor         │ LIBERADO — tasks completadas por @claude em cross-support
@codex          │ CYCLE-CLOSE-001 — emitir relatório-mãe + abrir PR
GATES_FECHADOS  │ nenhum — ciclo encerrado operacionalmente
BLOQUEADAS      │ BULK-01-Codex (branch, não bloqueia PR) | F6 (paralelo)
IGNIÇÃO         │ COMPLETA — sprint final executado em bulk
MODO_AUTO       │ SELADO
CICLO_PARA      │ PR para main → owner aprova merge → ciclo declarado fechado
DERIVA          │ impermitida
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
| Protocolo-mãe | `ops/DNA_PROTOCOL.md` |
| Papéis dos pioneiros | `ops/PIONEER_MATRIX.md` |
| Modo de ignição | `ops/IGNITION.md` |
| Fluxo autônomo | `ops/AUTOFLOW.md` |
| Polivalência controlada | `ops/CROSS_SUPPORT_PROTOCOL.md` |
| Roteamento adaptativo | `ops/FLOWMESH.md` |
| Camada de inteligência viva | `ops/NEXUS_NEURAL_MESH.md` |
| Critério de julgamento canônico | `ops/NEXUS_FRACTAL_JUDGMENT_CORE.md` |
| Índice vivo do canon | `ops/NEXUS_LIVING_CANON.md` |
| Destino soberano v10 | `ops/NEXUS_V10_SOVEREIGN_DESTINY.md` |

---

*BASTION.md v1 — criado em 2026-03-20 | claude-sonnet-4-6 | OPS-BASTION-001*
*BASTION.md v1.1 — semáforo actualizado com dispatch em 2026-03-20 | claude-sonnet-4-6 | OPS-BASTION-DISPATCH-001*
*BASTION.md v1.2 — modo automático selado; IGNIÇÃO_ATIVA permanente registada em 2026-03-21 | claude-sonnet-4-6 | OPS-BASTION-AUTO-001*
*BASTION.md v1.2 — modo automático BASTION/IGNITION reforçado em 2026-03-21 | claude-sonnet-4-6 | OPS-BASTION-AUTO-001*
*BASTION.md v1.3 — ciclo contínuo BASTION 2.0 iniciado em 2026-03-21 | claude-sonnet-4-6 | BASTION-2.0-CYCLE-START-001*
*BASTION.md v2.0 — ciclo contínuo BASTION 2.0 activado por ordem do owner em 2026-03-21 | claude-4.6-opus-high-thinking | BASTION-2.0-CYCLE-START-001*
*BASTION.md v1.3 — execução contínua reforçada até segunda ordem em 2026-03-21 | claude-sonnet-4-6 | OPS-FULL-AUTO-UNTIL-STOP-001*
*BASTION.md v1.3 — BASTION 2.0 ciclo activado por ordem owner; semáforo 2.0; todos os pioneiros em fluxo contínuo — 2026-03-21 | claude-sonnet-4-6 | BASTION-2.0-CYCLE-START-001*
*BASTION.md v1.4 — DNA-PROTOCOL-MOTHER-001 concluída; DNA_PROTOCOL.md v1 adicionado ao histórico e localização canônica — 2026-03-21 | claude-sonnet-4-6 | DNA-PROTOCOL-MOTHER-001*
*BASTION.md v1.5 — NEXUS-PIONEER-ROLE-MOTHER-001 concluída; PIONEER_MATRIX.md v1 adicionado; papéis cravados; 3 chats selados — 2026-03-21 | claude-sonnet-4-6 | NEXUS-PIONEER-ROLE-MOTHER-001*
*BASTION.md v1.6 — WorkVisual corrigido (@framer/@antigravity/@copilot); typo 'pioneer'→'pioneiro' — 2026-03-21 | claude-sonnet-4-6 | NEXUS-FOUNDATION-REFINEMENT-001*
*BASTION.md v1.7 — NEXUS-ELIGIBLE-CROSS-SUPPORT-001 + NEXUS-FOUNDATION-REFINEMENT-001 adicionados ao histórico; CROSS_SUPPORT_PROTOCOL.md na localização canônica; semáforo atualizado — 2026-03-21 | claude-sonnet-4-6 | NEXUS-ELIGIBLE-CROSS-SUPPORT-001*
*BASTION.md v1.8 — NEXUS-FLOWMESH-001 + NEXUS-NEURAL-MESH-001 adicionados ao histórico; FLOWMESH.md + NEXUS_NEURAL_MESH.md na localização canônica; semáforo atualizado — 2026-03-21 | claude-sonnet-4-6 | NEXUS-NEURAL-MESH-001*
*BASTION.md v1.9 — FECHAMENTO DE CICLO: gates PLv6.2-b + FVL-IMPL-001 abertos pelo owner; CYCLE-CLOSE-001 criada; todos os pioneers em sprint final; semáforo v1.9 — 2026-03-22 | claude-sonnet-4-6 | CYCLE-CLOSE-DISPATCH*
*BASTION.md v2.0 — BULK-CLOSE: todas as tasks elegíveis concluídas em bulk coordenado (@claude cross-support); semáforo v2.0 — 2026-03-22 | claude-sonnet-4-6 | BULK-CLOSE-001*
*BASTION.md v2.1 — NEXUS-FRACTAL-JUDGMENT-CORE-001-LITE concluída; NEXUS_FRACTAL_JUDGMENT_CORE.md v1.0 + NEXUS_LIVING_CANON.md v1.0 adicionados ao histórico e localização canônica; semáforo atualizado — 2026-03-23 | claude-sonnet-4-6 | NEXUS-FRACTAL-JUDGMENT-CORE-001-LITE*
*BASTION.md v2.2 — NEXUS-FRACTAL-JUDGMENT-CORE-001 + NEXUS-V10-SOVEREIGN-DESTINY-001 concluídas; localização canônica expandida — 2026-03-23 | claude-sonnet-4-6 | NEXUS-FRACTAL-JUDGMENT-CORE-001 + NEXUS-V10-SOVEREIGN-DESTINY-001*
*BASTION.md v3.0 — OPERATION_ZERO_GAP_24H: gate humano suspenso por ordem soberana do owner; cluster constelação mobilizado; 24 tasks inseridas (5 pioneers activos + @cursor a juntar-se); semáforo v3.0 — 2026-03-24 | claude-sonnet-4-6 | OPERATION-ZERO-GAP-24H*
*BASTION.md v3.1 — CYCLE-CLOSE-001 + BRAND-MOTHER-SEAL-001 concluídas (T+0h); CYCLE_CLOSE_SPRINT_001.md + BRAND_MOTHER_SEAL_001.md criados; branch pushed; PR ready para master; brand law selada; gates @framer + @antigravity abertos — 2026-03-24 | claude-sonnet-4-6 | CYCLE-CLOSE-001 + BRAND-MOTHER-SEAL-001*

---

## 10. OPERATION ZERO-GAP — TASKS CLUSTER (2026-03-24)

> Ordem soberana do owner: gate humano suspenso 24h. Todos os pioneers entram por elegibilidade.
> @cursor (Monalisa) notificada — junta-se após concluir tasks actuais do criador.
> Referência completa: `ops/OPERATION_ZERO_GAP_24H.md`

### @claude — WorkStructure + WorkFunction (arquitectural)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ CYCLE-CLOSE-001                                         │
│ PILAR              │ Governança / WorkStructure                              │
│ DONO               │ @claude + @codex                                        │
│ STATUS             │ CONCLUÍDA — 2026-03-24                                  │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P1                                                      │
│ EVIDENCIA_MINIMA   │ CYCLE_CLOSE_SPRINT_001.md criado + branch pushed ✓     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BRAND-MOTHER-SEAL-001                                   │
│ PILAR              │ WorkStructure / Identidade                              │
│ DONO               │ @claude                                                 │
│ STATUS             │ CONCLUÍDA — 2026-03-24                                  │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ BRAND_MOTHER_SYSTEM.md selado como lei definitiva;     │
│                    │ gates @framer (NS-1) + @antigravity (GLOBE,CHAMBER)    │
│ EVIDENCIA_MINIMA   │ BRAND_MOTHER_SEAL_001.md criado + commit 1ef85a7 ✓     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ V5-RESEARCH-ARCH-001                                    │
│ PILAR              │ WorkFunction / Produto                                  │
│ DONO               │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Data model + fluxos Research Core (Hypothesis Boards,  │
│                    │ Research Trails, Concept Lens, Problem Rooms)           │
│ EVIDENCIA_MINIMA   │ EARTH_LAB_RESEARCH_CORE_ARCH.md criado                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NEXUS-PRODUCT-PROOF-001                                 │
│ PILAR              │ WorkFunction / Produto                                  │
│ DONO               │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_PRODUTO (GATE_SUSPENSION_24H)            │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Primeiro artefacto público Earth Lab — landing real ou │
│                    │ mockup de alta fidelidade provando o sistema ao mundo  │
│ EVIDENCIA_MINIMA   │ artefacto visível no site ou repo público               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NEXUS-RUNTIME-MEMORY-001                                │
│ PILAR              │ WorkStructure / Sistema                                 │
│ DONO               │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_RUNTIME (GATE_SUSPENSION_24H)            │
│ PRIORIDADE         │ P2                                                      │
│ NOTAS              │ Arquitectura de memória viva persistente entre sessões │
│ EVIDENCIA_MINIMA   │ NEXUS_RUNTIME_MEMORY_ARCH.md criado                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NEXUS-STACK-RETROENGINEER-001                           │
│ PILAR              │ WorkStructure / Sistema                                 │
│ DONO               │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_STACK (GATE_SUSPENSION_24H)              │
│ PRIORIDADE         │ P2                                                      │
│ NOTAS              │ Inventário de acoplamentos + mapa de substituições     │
│ EVIDENCIA_MINIMA   │ NEXUS_STACK_INVENTORY.md criado                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### @copilot — WorkStructure (lapidação)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BULK-01.2/L-001                                         │
│ PILAR              │ WorkStructure / Higiene                                 │
│ DONO               │ @copilot                                                │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto (desde antes — confirmado)                      │
│ PRIORIDADE         │ P1                                                      │
│ EVIDENCIA_MINIMA   │ .gitignore actualizado + commit                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BULK-01.2/L-002                                         │
│ PILAR              │ WorkStructure / Higiene                                 │
│ DONO               │ @copilot                                                │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto (desde antes — confirmado)                      │
│ PRIORIDADE         │ P1                                                      │
│ EVIDENCIA_MINIMA   │ git rm --cached executado + commit                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ BRAND-DOCS-POLISH-001                                   │
│ PILAR              │ WorkStructure / Identidade                              │
│ DONO               │ @copilot                                                │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P2                                                      │
│ NOTAS              │ Lapidar BRAND_MOTHER_SYSTEM.md + SYSTEM_FACE_CANON.md  │
│                    │ + TYPOGRAPHY_LAW.md — consistência final                │
│ EVIDENCIA_MINIMA   │ 3 ficheiros lapidados + commit                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ OPS-SURFACE-FINAL-001                                   │
│ PILAR              │ WorkStructure / Governança                              │
│ DONO               │ @copilot                                                │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P2                                                      │
│ NOTAS              │ Lapidar superfície ops/ — consistência final em todos  │
│                    │ os ficheiros ops/ (sem alteração soberana)              │
│ EVIDENCIA_MINIMA   │ ops/ polida + commit                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### @framer — WorkVisual (design / layout)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NS-1-FRAMER-001                                         │
│ PILAR              │ WorkVisual / Heaven Lab Visual                          │
│ DONO               │ @framer                                                 │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_FRAMER (GATE_SUSPENSION_24H)             │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Hero incarnado: Trinity layout orbital + glass system  │
│                    │ + Sacred Orbital Chamber; Heaven Lab Test deve passar  │
│                    │ Lei visual: BRAND_MOTHER_SYSTEM.md + SYSTEM_FACE_CANON │
│ EVIDENCIA_MINIMA   │ Site hero visivelmente Heaven Lab — screenshot + commit │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NS-2-FRAMER-001                                         │
│ PILAR              │ WorkVisual / Presence                                   │
│ DONO               │ @framer                                                 │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_FRAMER (GATE_SUSPENSION_24H)             │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ NavBar + About + restantes páginas — polish Heaven Lab │
│ EVIDENCIA_MINIMA   │ NavBar + About incarnadas + commit                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NS-3-FRAMER-UI-001                                      │
│ PILAR              │ WorkVisual / Wonder Layer                               │
│ DONO               │ @framer                                                 │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_FRAMER (GATE_SUSPENSION_24H)             │
│ PRIORIDADE         │ P2                                                      │
│ NOTAS              │ UI para 5–7 features da Wonder Layer (Contemplation,   │
│                    │ World Pulse, Discovery Signatures, Deep Focus Mode,    │
│                    │ Breathing Interface, Dawn/Dusk Theme, Legacy Vault)    │
│ EVIDENCIA_MINIMA   │ 5+ componentes UI Wonder Layer + commit                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### @antigravity — WorkVisual (motion / 3D / R3F)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ GLOBE-3D-HEAVEN-001                                     │
│ PILAR              │ WorkVisual / 3D / R3F                                   │
│ DONO               │ @antigravity                                            │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_ANTIGRAVITY (GATE_SUSPENSION_24H)        │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Globe 3D vivo: rotação lenta autônoma, parallax cursor, │
│                    │ aurora polar, hover pulse, glass emissão teal+navy     │
│                    │ Spec completa: HEAVEN_LAB_REFERENCE_SURFACE.md Bloco 1 │
│ EVIDENCIA_MINIMA   │ Globe R3F no site real — Heaven Lab Test passa          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ ORBITAL-CHAMBER-001                                     │
│ PILAR              │ WorkVisual / Atmosfera                                  │
│ DONO               │ @antigravity                                            │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_ANTIGRAVITY (GATE_SUSPENSION_24H)        │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Sacred Orbital Chamber: glass layer + respiração 4000ms│
│                    │ + z-layers + luz ambiente radial + negative space 40%  │
│                    │ Spec: HEAVEN_LAB_REFERENCE_SURFACE.md Bloco 3          │
│ EVIDENCIA_MINIMA   │ Câmara orbital com atmosphera visível + commit          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ MOTION-SYSTEM-001                                       │
│ PILAR              │ WorkVisual / Motion                                     │
│ DONO               │ @antigravity                                            │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_ANTIGRAVITY (GATE_SUSPENSION_24H)        │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Sistema de motion canônico: micro-interacções (150ms), │
│                    │ transições cinéticas, ease [0.22,1,0.36,1] — canônico │
│ EVIDENCIA_MINIMA   │ motion system activo em pelo menos 5 interacções        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ SUBSTRATE-LAYER-001                                     │
│ PILAR              │ WorkVisual / Atmosfera                                  │
│ DONO               │ @antigravity                                            │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_ANTIGRAVITY (GATE_SUSPENSION_24H)        │
│ PRIORIDADE         │ P2                                                      │
│ NOTAS              │ Machine substrate: grid técnico + parallax (factor 0.15)│
│                    │ + dados vivos (uptime/tasks/commits) — Bloco 4 HLRS   │
│ EVIDENCIA_MINIMA   │ substrate visível ao scroll + commit                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### @codex — Orquestrador (qualidade + consolidação)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ CLUSTER-ORCHESTRATE-001                                 │
│ PILAR              │ WorkStructure / Orquestração                            │
│ DONO               │ @codex                                                  │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Monitorizar handoffs do cluster em tempo real; detectar │
│                    │ conflitos; arbitrar sem gate owner; actualizar BASTION  │
│ EVIDENCIA_MINIMA   │ relatório de orquestração por ponto de convergência     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ QUALITY-AUDIT-NS1-001                                   │
│ PILAR              │ WorkVisual / Qualidade                                  │
│ DONO               │ @codex                                                  │
│ STATUS             │ elegível                                                │
│ GATE               │ aberto — activado após NS-1-FRAMER-001 + GLOBE-3D done │
│ PRIORIDADE         │ P2                                                      │
│ NOTAS              │ Auditoria Heaven Lab Test: o site passa? score > 0.85? │
│ EVIDENCIA_MINIMA   │ QUALITY_AUDIT_NS1.md com score e gaps identificados     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### @cursor (Monalisa) — WorkFunction — JUNTA-SE APÓS SUAS TASKS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ GLOBE-EXPERIENCE-IMPL-001                               │
│ PILAR              │ WorkFunction / Produto                                  │
│ DONO               │ @cursor                                                 │
│ STATUS             │ elegível — aguarda chegada de @cursor                  │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Globe flagship integrado em produção real no site       │
│                    │ R3F + GlobeBackground.tsx + integração com @antigravity │
│ EVIDENCIA_MINIMA   │ Globe visível e vivo em produção                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ V4-WORLD-FEATURES-001                                   │
│ PILAR              │ WorkFunction / Produto                                  │
│ DONO               │ @cursor                                                 │
│ STATUS             │ elegível — aguarda chegada de @cursor                  │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ World Pulse + Timeline base + Scenario Comparison base │
│ EVIDENCIA_MINIMA   │ 3 features funcionais no produto                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ V5-RESEARCH-CORE-IMPL-001                               │
│ PILAR              │ WorkFunction / Research OS                              │
│ DONO               │ @cursor                                                 │
│ STATUS             │ elegível — aguarda chegada de @cursor + V5-ARCH        │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P1                                                      │
│ NOTAS              │ Research Core: Hypothesis Boards + Research Trails +   │
│                    │ Concept Lens + Problem Rooms (implementação mecânica)  │
│ EVIDENCIA_MINIMA   │ 3+ features Research Core em produção                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ V6-LEARNING-PATHWAY-001                                 │
│ PILAR              │ WorkFunction / Learning OS                              │
│ DONO               │ @cursor                                                 │
│ STATUS             │ elegível — aguarda V5-RESEARCH-CORE-IMPL-001           │
│ GATE               │ aberto — GATE_SUSPENSION_24H                           │
│ PRIORIDADE         │ P2                                                      │
│ NOTAS              │ Learning & Mastery: Lab Missions + Mastery Map base +  │
│                    │ Guided Mode + Sandbox Mode                              │
│ EVIDENCIA_MINIMA   │ Learning pathway base funcional                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. SEMÁFORO v3.0 — OPERATION ZERO-GAP

```
BASTION ════════════════════════════════════════════════════════════════════
VERSÃO          │ v3.0
DATA            │ 2026-03-24
ÚLTIMA_ACTUAÇÃO │ OPERATION-ZERO-GAP-24H | @claude | 2026-03-24
ESTADO          │ CLUSTER ACTIVO — OPERATION ZERO-GAP EM EXECUÇÃO
GATE_SUSPENSION │ ACTIVO — 24h a contar de 2026-03-24 (owner ordem soberana)
DISPATCH        │ OPERATION_ZERO_GAP_24H + GATE_SUSPENSION_24H
TASKS_ELEGÍVEIS │ CYCLE-CLOSE-001 | BRAND-MOTHER-SEAL-001 | V5-RESEARCH-ARCH-001
                │ BULK-01.2/L-001 | BULK-01.2/L-002 | BRAND-DOCS-POLISH-001
                │ NS-1-FRAMER-001 | NS-2-FRAMER-001 | NS-3-FRAMER-UI-001
                │ GLOBE-3D-HEAVEN-001 | ORBITAL-CHAMBER-001 | MOTION-SYSTEM-001
                │ SUBSTRATE-LAYER-001 | CLUSTER-ORCHESTRATE-001
                │ + tasks @cursor quando disponível
@claude         │ ACTIVO → CYCLE-CLOSE-001 → BRAND-MOTHER-SEAL-001 → V5-ARCH → PRODUCT-PROOF
@copilot        │ ACTIVO → BULK-01.2/L-001 → L-002 → BRAND-DOCS-POLISH → OPS-SURFACE
@framer         │ ACTIVO — gate aberto agora → NS-1 → NS-2 → NS-3
@antigravity    │ ACTIVO — gate aberto agora → GLOBE-3D → ORBITAL-CHAMBER → MOTION-SYSTEM
@codex          │ ACTIVO → CYCLE-CLOSE-001 + CLUSTER-ORCHESTRATE-001 (contínuo)
@cursor         │ EM TASKS DO CRIADOR → notificada → junta-se após (GLOBE-IMPL → V4 → V5 → V6)
MODO_AUTO       │ SELADO — GATE_SUSPENSION_24H activo
IGNIÇÃO         │ PERMANENTE — cluster em execução plena
CONVERGÊNCIA    │ T+4h · T+8h · T+12h · T+18h · T+24h
OBJETIVO        │ BASTION zerado — produto completo — amanhã
INTERRUPTOR     │ ordem owner | red line canônica (DNA Protocol) | fim 24h
DERIVA          │ 🔴 impermitida
════════════════════════════════════════════════════════════════════════════
```
