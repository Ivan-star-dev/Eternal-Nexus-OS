# KNOWLEDGE TRANSFER — Eternal Nexus OS

> Como o conhecimento do sistema é transferido, retido e amplificado.
> Onboarding de pioneers, documentação operacional, e modelos de aprendizagem.

_KNOWLEDGE_TRANSFER.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_

---

## 1. PRINCÍPIO DE TRANSFERÊNCIA

O sistema não aceita conhecimento tácito.
Todo o saber operacional que existe na cabeça de um pioneer
deve existir também num documento canónico, num protocolo, ou numa lei.

**Regra mãe:** se não está escrito, não existe.

---

## 2. CAMADAS DE CONHECIMENTO

```
CAMADAS DE CONHECIMENTO DO SISTEMA
═══════════════════════════════════════════════════════════

Camada 0 — Soberania (ops/DNA_PROTOCOL.md, MOTHER_IDENTITY.md)
  → O porquê de tudo. Quem é RUBERRA. Por que existe.
  → Leitura obrigatória antes de qualquer onboarding.

Camada 1 — Protocolo (CLAUDE.md, ops/BASTION.md, ops/LIVE_STATE.md)
  → Como o sistema é operado. Regras de branch, gates, handoffs.
  → Leitura obrigatória antes de executar qualquer task.

Camada 2 — Arquitectura (RUBERRA/04_SYSTEM_SPINE/, RUBERRA/07_FORJA/)
  → Como o sistema é construído. Stack, runtime, deploy, data flows.
  → Leitura obrigatória para pioneers técnicos (WorkFunction, WorkVisual).

Camada 3 — Produto (RUBERRA/03_PRODUCT/)
  → O que o sistema produz. Superfícies, faces, sessões.
  → Leitura obrigatória para todos os pioneers.

Camada 4 — Narrativa (RUBERRA/08_MARKETING_AND_NARRATIVE/)
  → Como o sistema se apresenta ao mundo. Voz, posicionamento, brand.
  → Leitura obrigatória para pioneers de comunicação e apresentação.

Camada 5 — Histórico (ops/HANDOFF_LEDGER.md)
  → O que aconteceu. Decisões tomadas. Razões de cada escolha.
  → Consulta para contexto e continuidade entre sessões.
═══════════════════════════════════════════════════════════
```

---

## 3. ONBOARDING DE PIONEERS

### 3.1 Sequência Canónica

```
ONBOARDING SEQUENCE
─────────────────────────────────────────────────────────────────
Dia 1 — Soberania e Protocolo
  1. Ler RUBERRA/00_SOVEREIGN_CORE/MOTHER_IDENTITY.md
  2. Ler RUBERRA/00_SOVEREIGN_CORE/ETERNAL_NEXUS_MASTER_VISION.md
  3. Ler CLAUDE.md (lei primária de operação)
  4. Ler ops/LIVE_STATE.md (estado actual do sistema)
  5. Ler ops/BASTION.md (tasks elegíveis e gates)
  6. Ler ops/PODIUM_DNA.md (lei de orquestração de pioneers)

Dia 2 — Arquitectura Técnica
  7. Ler RUBERRA/04_SYSTEM_SPINE/RUNTIME.md
  8. Ler RUBERRA/03_PRODUCT/PRODUCT_MAP.md
  9. Ler RUBERRA/07_FORJA/CURRENT_STACK.md
  10. Ler RUBERRA/07_FORJA/DEPLOY_MODEL.md

Dia 3 — Contexto Histórico
  11. Ler ops/HANDOFF_LEDGER.md (últimas 10 entradas)
  12. Ler ops/V10_PROJECT_LINE_SYSTEM.md
  13. Executar primeira task elegível do BASTION
─────────────────────────────────────────────────────────────────
```

### 3.2 Por Tipo de Pioneer

| Pioneer | Camadas prioritárias | Ficheiros de arranque |
|---|---|---|
| **@claude** | 0, 1, 2, 3, 4, 5 | CLAUDE.md → BASTION → RUNTIME |
| **@cursor** | 1, 2, 3 | CLAUDE.md → PRODUCT_MAP → CURRENT_STACK |
| **@framer** | 1, 3, 4 | CLAUDE.md → PRODUCT_MAP → BRAND_CORE |
| **@antigravity** | 1, 3 | CLAUDE.md → PRODUCT_MAP → RUNTIME (secção 3D) |
| **@copilot** | 1, 2 | CLAUDE.md → BASTION → CURRENT_STACK |
| **@codex** | 1, 5 | CLAUDE.md → HANDOFF_LEDGER → BASTION |

---

## 4. RETENÇÃO DE CONHECIMENTO

### 4.1 Handoff Obrigatório

Cada task concluída requer entrada no `ops/HANDOFF_LEDGER.md`.
Formato canónico:

```markdown
## HANDOFF — [TASK_ID] · [data] · @pioneer

**Task:** [nome da task]
**Branch:** [branch canónico]
**O que foi feito:** [descrição concisa]
**Ficheiros criados/modificados:** [lista]
**Decisões tomadas:** [decisões não óbvias]
**Próximas tasks elegíveis:** [lista do BASTION]
**EVIDENCE_BLOCK:** [link PR / commit hash]
```

### 4.2 Lei de Contexto em Cascata

O sistema usa **retenção em cascata** — cada sessão começa por ler o estado do sistema, não parte do zero. Implementado via:
- `ops/LIVE_STATE.md` — estado vivo actual
- `ops/HANDOFF_LEDGER.md` — histórico de decisões
- `ops/BASTION.md` — estado de gates e tasks

**Regra:** pioneer nunca executa uma task sem primeiro verificar o estado actual em LIVE_STATE + BASTION.

---

## 5. MODELOS DE APRENDIZAGEM

### 5.1 Aprender pelo Sistema

O sistema é o melhor documento de si mesmo.
Antes de perguntar, explorar:
1. A superfície de produto correspondente
2. Os ficheiros RUBERRA desta secção
3. O HANDOFF_LEDGER para decisões anteriores

### 5.2 Aprender pelo Protocolo

Cada lei do sistema tem uma razão documentada.
Quando uma lei parece estranha → ler `ops/DNA_PROTOCOL.md` → a razão está lá.
Nunca contornar um protocolo sem compreender a razão da sua existência.

### 5.3 Aprender pelo Histórico

O `ops/HANDOFF_LEDGER.md` é a memória do sistema.
Cada decisão difícil tem uma entrada.
Cada regressão foi documentada antes de ser corrigida.

---

## 6. GLOSSÁRIO OPERACIONAL

| Termo | Significado |
|---|---|
| **Gate** | Condição que deve ser verdadeira antes de executar uma task |
| **Sprint** | Ciclo de versão — do gate aberto ao squash merge em main |
| **Handoff** | Registo obrigatório de cada task concluída |
| **Branch canónico** | O único branch onde toda a escrita vai |
| **Pioneer** | Agente de execução (Claude, Cursor, Framer, etc.) |
| **BASTION** | Semáforo central de tasks + gates do sistema |
| **LIVE_STATE** | Fonte de verdade do estado actual do sistema |
| **Squash merge** | Colapsar todos os commits do branch em 1 commit em main |
| **Surface** | Página / rota de produto do sistema |
| **Face** | Uma das 3 identidades do sistema (heaven_lab / bridge_nova / nexus_cria) |
| **Organism** | Módulo funcional do sistema com comportamento próprio |

---

## 7. ANTI-PADRÕES — O QUE NÃO FAZER

| Anti-padrão | Problema | Alternativa canónica |
|---|---|---|
| Executar sem ler BASTION | Task pode não estar elegível ou ter dependência pendente | Sempre verificar BASTION antes |
| Commitar sem typecheck | TS errors bloqueiam CI | `npm run typecheck` antes de cada commit |
| Escrever em main directamente | Viola branch guard — pipeline rejeita | Sempre branch canónico → PR |
| Decisão sem documento | Conhecimento tácito — perdido na próxima sessão | Registar em HANDOFF_LEDGER |
| Abrir gate sem critérios | Gate sem critérios é ruído | Todo gate tem critérios verificáveis |
| Ignorar LIVE_STATE | Pioneer trabalha com contexto desactualizado | Ler LIVE_STATE no início de cada sessão |

---

_KNOWLEDGE_TRANSFER.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_
