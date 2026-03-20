# PLv1 — Product Layer 1: Workspace Config Layer

**Pilar:** Produto
**Camada:** BULK-03 — Primeira entrada controlada em produto
**Task:** BULK-03.1
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Data:** 2026-03-20

> PLv1 é a primeira camada de produto real do Eternal Nexus OS.
> É pequena, controlada e canônica.
> Não é produto completo. É o primeiro passo real — a fonte que alimenta tudo depois.

---

## 1. O QUE É ESTA CAMADA

**Nome:** Workspace Config Layer
**Arquivo central:** `src/config/workspace.ts`

Declara, em código TypeScript tipado, a estrutura canônica do produto:
- os órgãos do organismo e seus metadados
- o fluxo sagrado em ordem explícita
- a identidade do produto

Esta config é a expressão tipada de `docs/NEXUS_OS.md` em código.
Não substitui o doc soberano — traduz-o para uso direto no produto.

---

## 2. O QUE ENTROU NESTA CAMADA

### Criado

| Artefato | Natureza | Porquê |
|---|---|---|
| `src/config/workspace.ts` | Config central tipada | Fonte canônica dos órgãos, fluxo sagrado e identidade do produto |
| `ops/PRODUCT_LAYER_1.md` (este) | Declaração de camada | Fronteira, escopo e conexão com o sistema vivo |

### Atualizado

| Artefato | O que mudou | Porquê |
|---|---|---|
| `src/components/shared/NexusFlowInspector.tsx` | Importa `getSacredFlowOrgans` e `WORKSPACE` de `workspace.ts`; exibe fluxo sagrado com cores canônicas e product layer no inspector de dev | Primeiro consumidor vivo da config — valida que a fonte funciona e expõe o workspace config em runtime |

---

## 3. O QUE NÃO ENTROU NESTA CAMADA

| Item | Por que ficou fora | Onde vai |
|---|---|---|
| Dados de status em tempo real dos órgãos | Esses são dados vivos, não config — dependem de API/Supabase | PLv2+ / Fase 4 |
| Substituição do mock em `OrganStatusGrid` por dados reais | Requer integração com backend real | PLv2+ |
| Feature nova de produto (nova página, nova interação) | Fora do escopo de PLv1 — ainda em consolidação | PLv2+ após owner gate |
| Migração de `homeProjects.ts` para fonte dinâmica | Refatoração maior, fora do mínimo necessário | Refinamento técnico futuro |
| Lapidação visual do NexusFlowInspector | Papel do Copilot se/quando for necessário | BULK-03.2 (se pedido) |

---

## 4. FRONTEIRA CLARA

```
DENTRO DA PLv1:
✅ src/config/workspace.ts — config estrutural dos órgãos
✅ Fluxo sagrado declarado explicitamente em código
✅ NexusFlowInspector consome workspace.ts (dev-only)
✅ Tipos TypeScript para OrganConfig e SacredFlowStep

FORA DA PLv1:
❌ Dados de runtime (status, métricas, alertas)
❌ Integração com Supabase/API para estado dos órgãos
❌ Novas páginas ou rotas
❌ Mudanças em tailwind.config.ts ou cores do tema
❌ Alterações em data/projects.ts
❌ Qualquer coisa de Fase 4
```

---

## 5. COMO ESTA CAMADA CONVERSA COM O SISTEMA VIVO

### Leitura da config no produto

```
src/config/workspace.ts
       ↓
   importado por
       ↓
NexusFlowInspector  ← consumidor atual (dev inspector)
OrganStatusGrid     ← próximo consumidor natural (quando owner gate abrir)
qualquer componente ← consumidor futuro controlado
```

### Conexão com NLF/FOL

```
NEXUS_OS.md (soberano)
       ↓ traduz para código
workspace.ts (PLv1)
       ↓ consumido por
componentes do produto
       ↓ registrado em
LIVE_STATE.md (fila e estado da camada)
       ↓ auditado em
HANDOFF_LEDGER.md (handoff da sessão)
```

### Entrada na escada

```
Claude abre PLv1 (BULK-03.1)
       ↓
Copilot entra se houver suavização necessária (BULK-03.2 — não obrigatório)
       ↓
Codex pode refinar src/config/workspace.ts tecnicamente quando branch alinhar
       ↓
PLv2 só abre após owner gate lendo este handoff
```

---

## 6. COMO PRÓXIMOS PIONEIROS REFINAM ESTA CAMADA

### Copilot (se BULK-03.2 for pedido)
- Verificar consistência visual do inspector após atualização
- Checar labels e ordem visual dos órgãos na seção WORKSPACE CONFIG do inspector
- Não mudar o core da config

### Codex (após branch alinhar)
- Pode refinar `getSacredFlowOrgans()` e `getOrgan()` se precisar de performance ou edge cases
- Pode adicionar validação/testes unitários para workspace.ts
- Não mudar a estrutura canônica sem owner gate

### Claude (PLv2 — próxima onda)
- Determinar o próximo bloco de produto a construir
- Possíveis candidatos: conectar `OrganStatusGrid` à config canônica; expor project config; primeiro toque em estado vivo real

---

## 7. ESTADO DOS BLOQUEIOS ATIVOS (herdados)

| Bloqueio | Estado | Impacto em PLv1 |
|---|---|---|
| B-001: `.env` — segredos ou placeholders? | Aguarda owner | Nenhum — PLv1 não usa env vars |
| B-002: npm como PM canônico | Aguarda owner | Nenhum — PLv1 não adiciona deps |
| B-003: merge na linha principal | Aguarda Tribunal | Nenhum — PLv1 está no branch correto |

---

*PLv1 aberta em 2026-03-20 | claude-sonnet-4-6 | BULK-03.1*

---

## PLv2 — Continuação controlada (BULK-03.2)

**Task:** BULK-03.2
**Data:** 2026-03-20

### O que PLv2 agregou

| Artefato | O que mudou | Porquê |
|---|---|---|
| `src/config/workspace.ts` | Campo `organName` adicionado a `OrganConfig`; todos os 7 órgãos têm `organName` (ex: 'Nervos', 'Coração', 'Cérebro'); `WORKSPACE.productLayer` avançado para `PLv2`; tag de versão atualizada | `organName` é metadata estrutural do órgão (papel no organismo), não dado vivo — pertence à config canônica |
| `src/components/home/OrganStatusGrid.tsx` | Eliminada duplicação de `id`, `path`, `label`, `organName`, `color`; componente importa `getOrgan()` de `workspace.ts`; `GRID_ORGAN_IDS` define subset exibido; `ORGAN_DISPLAY` local retém apenas `icon`, `status`, `metric`, `metricLabel` (ainda placeholders até PLv3+) | Primeiro componente de produto real alimentado pela config canônica |

### O que PLv2 **não** fez

| Item | Por que ficou fora |
|---|---|
| Substituir `status`/`metric`/`metricLabel` por dados reais | Requer integração viva (Supabase/API) — PLv3+ |
| Alterar a UI/layout do grid | Escopo de lapidação, não de PLv2 |
| Conectar outros componentes à config | Mínima mudança — 1 componente é suficiente para validar a PLv2 |

### Fronteira PLv2

```
DENTRO DA PLv2:
✅ organName em workspace.ts (metadata estrutural)
✅ OrganStatusGrid consome getOrgan() para id/path/label/organName/color
✅ Eliminação de duplicação de config estrutural em OrganStatusGrid

FORA DA PLv2:
❌ Dados de status/metric em tempo real
❌ Outros componentes conectados à config (próximas ondas)
❌ Alterações de layout ou design
❌ Novas páginas ou rotas
```

### Estado dos consumidores de workspace.ts

| Componente | Consome workspace.ts | Desde |
|---|---|---|
| `NexusFlowInspector` | ✅ `getSacredFlowOrgans()` + `WORKSPACE` | PLv1 |
| `OrganStatusGrid` | ✅ `getOrgan()` para config estrutural | PLv2 |
| Outros componentes | — | PLv3+ (a decidir pelo owner) |

*PLv2 adicionada em 2026-03-20 | claude-sonnet-4-6 | BULK-03.2*

---

## PLv3 — Live Organ Status Layer (BULK-04.1)

**Task:** BULK-04.1
**Data:** 2026-03-20

### O que PLv3 agregou

| Artefato | O que mudou | Porquê |
|---|---|---|
| `src/hooks/useOrganLiveStatus.ts` | Hook criado — encapsula fontes de status vivo por órgão; retorna `OrganLiveData` com `metric`, `metricLabel`, `status`, `isLive`; fontes ativas: ATLAS (Open-Meteo Mindelo) + TRIBUNAL (TanStack Query verdicts); outros 5 órgãos com placeholder explícito `isLive: false` | Pattern canônico para PLv4+ preencher os órgãos restantes |
| `src/components/home/OrganStatusGrid.tsx` | Consome `useOrganLiveStatus()`; `ORGAN_ICONS` retém ícones (puramente visual); `metric`/`metricLabel`/`status` vêm do hook; indicador `live` visível nos cartões com `isLive: true`; pulse opacity reduzida para `isLive: false` | Produto exibe real vs placeholder de forma auditável |
| `src/config/workspace.ts` | `WORKSPACE.productLayer` avançado para `PLv3`; tag de versão atualizada | Registo de avanço da camada |

### Fontes vivas ativas em PLv3

| Órgão | Fonte | Dado real | Fallback |
|---|---|---|---|
| **ATLAS** | Open-Meteo API (lat 14.93, lng -23.51 — Mindelo) | Temperatura em °C | Dado simulado pelo `useRealtimeData` |
| **TRIBUNAL** | TanStack Query — `useNexusState().verdicts` | Contagem de veredictos da sessão | 0 (sessão nova) |

### O que PLv3 **não** fez

| Item | Por que ficou fora |
|---|---|
| NEXUS, INDEX, NEWS, INVESTOR, GEOPOLITICS — fontes reais | Cada um requer sua própria integração; placeholder explícito com `isLive: false` |
| Nova UI/layout | Escopo de lapidação |
| Integração com Supabase para status dos órgãos | Requer autenticação (B-001 pendente) |

### Estado dos consumidores da cadeia canônica

| Componente | Config (workspace.ts) | Status vivo (useOrganLiveStatus) | Desde |
|---|---|---|---|
| `NexusFlowInspector` | ✅ `getSacredFlowOrgans()` + `WORKSPACE` | — (dev inspector) | PLv1 |
| `OrganStatusGrid` | ✅ `getOrgan()` | ✅ `useOrganLiveStatus()` | PLv2 + PLv3 |
| Outros componentes | — | — | PLv4+ |

### Fronteira PLv3

```
DENTRO DA PLv3:
✅ useOrganLiveStatus.ts — hook de status vivo com separação isLive clara
✅ ATLAS: temperatura real Mindelo via Open-Meteo (infra já existente no codebase)
✅ TRIBUNAL: contagem de veredictos de sessão via TanStack Query
✅ OrganStatusGrid: indicador visual LIVE vs placeholder
✅ Fallback gracioso em todos os órgãos

FORA DA PLv3:
❌ Fontes reais para nexus, index, news, investor, geopolitics (PLv4+)
❌ Integração Supabase para status (aguarda B-001)
❌ Redesign ou layout novo
❌ Nova página ou rota
```

*PLv3 adicionada em 2026-03-20 | claude-sonnet-4-6 | BULK-04.1*

---

## PLv4 — Live Organ Status Layer: escala total (SUPER-BULK-A)

**Task:** SUPER-BULK-A (SBA-01 + SBA-02 + SBA-03)
**Data:** 2026-03-20

### O que PLv4 agregou

| Artefato | O que mudou | Porquê |
|---|---|---|
| `src/hooks/useIndexOrgan.ts` | `realtimeData` exposto no return (SBA-01) | Eliminar segunda instância de `useRealtimeData`; polling único para todo o status grid |
| `src/hooks/useOrganLiveStatus.ts` | Reescrito — INDEX live (useIndexOrgan.entries) + NEWS live (entries última 1h) + ATLAS consolidado (useIndexOrgan.realtimeData) + GEOPOLITICS live (USGS M4.5+/24h); `useRealtimeData` redundante removido; 5/7 órgãos com `isLive: true` | PLv4 = 5 órgãos vivos vs 2 em PLv3 |
| `src/config/workspace.ts` | `productLayer` → `PLv4`; tag atualizada | Registo canónico de avanço |

### Fontes vivas ativas em PLv4

| Órgão | Fonte | Dado real | Fallback |
|---|---|---|---|
| **ATLAS** | Open-Meteo via useIndexOrgan.realtimeData | Temperatura °C — Mindelo, Cabo Verde | Dado simulado (useRealtimeData fallback) |
| **TRIBUNAL** | TanStack Query — useNexusState().verdicts | Contagem de veredictos da sessão | 0 (sessão nova) |
| **INDEX** | useIndexOrgan().entries | Entradas agregadas (verdicts + clima real) | 0 (sem fluxo ativo) |
| **NEWS** | Derivado de INDEX (entries última 1h) | Eventos recentes do fluxo sagrado | 0 (sessão nova) |
| **GEOPOLITICS** | USGS Earthquake Feed M4.5+ / 24h | Sismos detectados no planeta | — (sem rede) |

### O que PLv4 **não** fez

| Item | Por que ficou fora |
|---|---|
| NEXUS — fonte dinâmica de actividade EI | Requer estado runtime dos EI agents (PLv5+) |
| INVESTOR — pipeline real | Depende de dados do owner (B-001) ou Supabase auth |
| useRealtimeData → TanStack Query | Refactoring amplo; instância única via useIndexOrgan é suficiente agora |
| Nova página, redesign, refactoring global | Red lines |

### Fronteira PLv4

```
DENTRO DA PLv4:
✅ useIndexOrgan.realtimeData exposto (SBA-01)
✅ INDEX live: contagem real de entradas agregadas (SBA-02)
✅ NEWS live: eventos da última hora derivados do INDEX (SBA-02)
✅ ATLAS consolidado: sem instância duplicada de polling (SBA-02)
✅ GEOPOLITICS live: USGS M4.5+ / 24h — API pública real, sem auth (SBA-03)

FORA DA PLv4:
❌ NEXUS dinâmico (PLv5+ — nova infra de EI state)
❌ INVESTOR real (B-001 — dados do owner)
❌ Supabase auth para system health
❌ homeProjects migrado para Supabase (sem projects table)
```

### Estado dos consumidores em PLv4

| Componente | Config (workspace.ts) | Status vivo | isLive por órgão | Desde |
|---|---|---|---|---|
| `NexusFlowInspector` | ✅ | ✅ | tribunal + index vivos | PLv1 |
| `OrganStatusGrid` | ✅ | ✅ | ATLAS + TRIBUNAL + INDEX + NEWS + GEOPOLITICS | PLv2 → PLv4 |

*PLv4 adicionada em 2026-03-20 | claude-sonnet-4-6 | SUPER-BULK-A*
