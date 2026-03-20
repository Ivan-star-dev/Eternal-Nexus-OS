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
