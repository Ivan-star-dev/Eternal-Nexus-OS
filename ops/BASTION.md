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
| MASTER-TOTAL-ARMY-WAVE-001 | Produto | WorkFunction+WorkVisual | @claude | concluída | motion/config.ts · OrbitalChamber · TrinityRow · HeroFirstProof · ProductHero · Index wired · TS 0 errors |
| GLOBE-3D-ATMOSPHERE-001 | Produto | WorkVisual | @claude | concluída | AtmosphereSphere+CoronaSphere+3-point lighting+focus pulse+EarthquakeLayer+GlobeLayerSelector · TS 0 errors |
| MOTION-SWEEP-001 | Mecânico | WorkStructure | @claude | concluída | 32 files migrated · 0 hardcoded ease values in src/ · EASE_OUT canonical · TS 0 errors |
| GLOBE-3D-AURORA-001 | Visual | WorkVisual | @claude | concluída | AuroraRimSphere GLSL fresnel shader teal↔gold · OrbitalChamber focused sync · onFocusChange chain · TS 0 errors |
| NS-1-HERO-COMPOSITION-001 | Visual | WorkVisual | @claude | concluída | Sacred thread Trinity→Proof · DELAY.afterGlobe stagger · motion.div wrapper · spacing sealed · TS 0 errors |
| NS-2-NAV-POLISH-001 | Visual | WorkVisual | @claude | concluída | Glass bg/80 + white/8 border · active gold gradient bar · mobile left-border active state · TS 0 errors |

> ✅ V3 GATE FECHADO — 2026-03-25 · AUTO-GATE abriu V4 imediatamente
> Lei: CLAUDE.md §5 AUTO-GATE-LAW — @claude avalia e abre gate quando critérios [✓]

---

### 5.2 TASKS ACTIVAS E ELEGÍVEIS

> 🟢 V4 — SYSTEM BEHAVIOUR LIVE — ABERTO 2026-03-25 via AUTO-GATE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ V4-INTERACTION-002                                      │
│ PILAR              │ WorkFunction + WorkVisual                               │
│ WORKTREE_ALIAS     │ WorkFunction                                            │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ APOIO_SECUNDARIO   │ nenhum                                                  │
│ STATUS             │ em execução                                             │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ GLOBE-3D-AURORA-001 (concluída)                         │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ aberto (AUTO-GATE V4)                                   │
│ NEXT_ACTOR         │ @claude                                                 │
│ NEXT_TASK          │ V4-SESSION-001                                          │
│ EVIDENCIA_MINIMA   │ ProjectFocusPanel · slide-in · click wired · TS 0      │
│ NOTAS              │ Globe hotspot click → project detail panel slide-in     │
│                    │ First real "system behaviour" moment of V4              │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ V4-SESSION-001                                          │
│ PILAR              │ WorkFunction                                            │
│ WORKTREE_ALIAS     │ WorkFunction                                            │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ aberto (AUTO-GATE V4)                                   │
│ NEXT_ACTOR         │ @claude                                                 │
│ NEXT_TASK          │ V4-NEXUS-001                                            │
│ EVIDENCIA_MINIMA   │ session memory hook · localStorage · TS 0              │
│ NOTAS              │ Eternal Memory OS — user session persists across visits │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ V4-NEXUS-001                                            │
│ PILAR              │ WorkFunction                                            │
│ WORKTREE_ALIAS     │ WorkFunction                                            │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ aberto (AUTO-GATE V4)                                   │
│ NEXT_ACTOR         │ @claude                                                 │
│ NEXT_TASK          │ V4-ATLAS-001                                            │
│ EVIDENCIA_MINIMA   │ NexusPage canonical surface · AI parliament · TS 0     │
│ NOTAS              │ NexusPage: canonical AI parliament with real proposals  │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ V4-ATLAS-001                                            │
│ PILAR              │ WorkFunction                                            │
│ WORKTREE_ALIAS     │ WorkFunction                                            │
│ DONO_PRINCIPAL     │ @claude                                                 │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P2                                                      │
│ GATE               │ aberto (AUTO-GATE V4)                                   │
│ NEXT_ACTOR         │ @claude · @cursor                                       │
│ NEXT_TASK          │ V4-PROJECT-PAGE-001                                     │
│ EVIDENCIA_MINIMA   │ AtlasPage Supabase wired · WorldBank API · TS 0        │
│ NOTAS              │ AtlasPage fully wired to Supabase globe_projects        │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ CLUSTER-ORCHESTRATE-001                                 │
│ PILAR              │ Consolidação                                            │
│ WORKTREE_ALIAS     │ WorkFunction                                            │
│ DONO_PRINCIPAL     │ @codex                                                  │
│ APOIO_SECUNDARIO   │ nenhum                                                  │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P2                                                      │
│ GATE               │ aberto                                                  │
│ NEXT_ACTOR         │ @codex                                                  │
│ NEXT_TASK          │ @owner decide                                           │
│ EVIDENCIA_MINIMA   │ sync report + conflict audit + ALTERACAO_REAL           │
│ NOTAS_DO_OWNER     │ Wave sync · detect drift across pioneer branches        │
│                    │ Emit canonical integration report                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

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
TASKS_ELEGÍVEIS │ CYCLE-CLOSE-001 (última — aguarda PR)
TASKS_CONCLUÍDAS│ PLv6.2-b ✓ | FVL-IMPL-001 ✓ | BULK-02.2 ✓ |
                │ BULK-01.2/L-001 ✓ | BULK-01.2/L-002 ✓ |
                │ BULK-01.3-a ✓ | BULK-01.3-b ✓ | BULK-01.3-c ✓
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
