# FEATURE SCAFFOLDING PLAN

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** FSP-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução directa — "O que der · Começa agora")
**Precondição de:** Fase C (Feature Scaffolding Fase 1)

> Ordem de construção canónica da Wonder Layer.
> Este plano é a lei de sequência — não é uma sugestão.
> Alterações requerem gate do owner.

---

## FRASE CANÓNICA

> O produto existe para dar às pessoas um workspace científico real
> onde o mundo é estudado, comparado, debatido e transformado.
> Não é uma plataforma de conteúdo. É um laboratório operacional.

---

## CONTEXTO — O que já existe

```
ESTADO ACTUAL ════════════════════════════════════════════════════

PRODUTO:
  ✓ PLv1–PLv6.2-b — Workspace, organs, data, metrics, projects gallery
  ✓ FVL — FounderPage v2 operacional
  ✓ InteractiveGlobe — canvas R3F com hotspots de projecto

INFRA:
  ✓ DATA_LAYER_1 — 7/7 órgãos com Layer 1 activa
  ✓ Supabase — globe_projects, auth, realtime
  ✓ TanStack Query — aggregator operacional
  ✓ Framer Motion — padrões canónicos estabelecidos

VISUAL:
  ✓ BRAND_MOTHER_SYSTEM.md — lei visual completa
  ✓ NS1 — Index hero com engineering grid + orbs + classification strip

LACUNA:
  ✗ Globe é render 3D — não é observatory com data layers
  ✗ Nenhuma feature de Wonder Layer operacional
  ✗ Produto não tem "matéria de wonder" visível
  ✗ NS2 e NS3 por alcançar

══════════════════════════════════════════════════════════════════
```

---

## MAPA DE FAMÍLIAS

```
WONDER LAYER — 4 FAMÍLIAS ══════════════════════════════════════

PRESENCE       → o mundo vivo, presente, observável
EXPLORATION    → o mundo navegável, comparável, investigável
COLLABORATION  → o mundo trabalhado em conjunto, em tempo real
INTELLIGENCE   → o mundo interpretado, debatido, sintetizado por IA

Sequência de construção: PRESENCE → EXPLORATION → COLLABORATION → INTELLIGENCE
Cada família tem fundação + expansão
Fundação de uma família abre gate para a próxima

══════════════════════════════════════════════════════════════════
```

---

## FASE C — FEATURE SCAFFOLDING FASE 1

**Trigger:** Brand Mother System aprovado ✓ + FSP-001 aprovado (este doc)
**NS alvo:** NS2 (Presence + Exploration Scaffolding)

---

### C.1 — FAMÍLIA PRESENCE — Fundação

**PLv7 — Globe Observatory Layer**

| Feature | Estado | Pioneer | Prioridade |
|---------|--------|---------|-----------|
| Globe data overlay — earthquakes M4.5+ (USGS) | disponível em `fetchRecentEarthquakes` | @cursor | P1 |
| Globe data overlay — pollution points (fetchGlobalPollution) | disponível na lib | @cursor | P1 |
| Multi-scale navigation — zoom com contexto regional | R3F camera controls | @cursor | P1 |
| Observatory atmosphere — data tick em tempo real no globe | novo UI layer | @framer | P2 |
| Globe legend — layer selector (sismicidade / poluição / projectos) | novo componente | @cursor | P2 |

**Critério de conclusão PLv7:**
```
□ Globe mostra pelo menos 2 data layers reais em simultâneo
□ Ao fazer zoom, o contexto regional aparece (country labels, scale indicator)
□ Um utilizador novo sente "aqui o mundo é estudado" em <30s
□ Atmosfera: dark + data + precision — não "mapa bonito"
```

**PLv7.1 — World Pulse**

| Feature | Estado | Pioneer | Prioridade |
|---------|--------|---------|-----------|
| Pulse feed — eventos globais em tempo real (sismos, alertas) | USGS feed existe | @cursor | P1 |
| Pulse visual — linha de tempo de eventos com magnitude | novo componente | @framer | P1 |
| Pulse integração com globe — click em evento foca globe | @cursor | @cursor | P2 |

**Critério de conclusão PLv7.1 (World Pulse):**
```
□ Existe um momento no produto onde o utilizador vê o mundo acontecer
□ Eventos reais, dados reais, em tempo quase-real
□ Integrado visualmente com a atmosfera Heaven Lab (não um dashboard genérico)
```

---

### C.2 — FAMÍLIA EXPLORATION — Fundação

**PLv8 — Scenario Comparison Base**

| Feature | Estado | Pioneer | Prioridade |
|---------|--------|---------|-----------|
| Scenario Comparison — comparar 2 países / regiões em métricas | dados World Bank existem | @cursor | P1 |
| Comparison view — side-by-side com métricas de GDP, CO₂, FDI | novo componente | @cursor | P1 |
| Comparison visual — gráfico de linha comparativo | DataCharts existe | @cursor | P2 |

**PLv8.1 — Timeline Base**

| Feature | Estado | Pioneer | Prioridade |
|---------|--------|---------|-----------|
| Timeline — evolução histórica de uma métrica (1990–2024) | World Bank histórico | @cursor | P1 |
| Timeline visual — linha temporal interactiva | novo componente | @framer | P2 |

**Critério de conclusão PLv8 (Exploration):**
```
□ Utilizador pode comparar 2 entidades (países / projectos / cenários)
□ Utilizador pode ver evolução temporal de pelo menos 1 métrica
□ A interface comunica "aqui pensa-se sobre futuros", não "aqui lê-se dados"
```

---

## FASE D — FEATURE SCAFFOLDING FASE 2

**Trigger:** PLv7 + PLv8 concluídos · Owner abre gate
**NS alvo:** NS3 (Wonder Layer Matter — 5–7 features)

---

### D.1 — FAMÍLIA COLLABORATION — Fundação

**PLv9 — Research Trails Base**

| Feature | Estado | Pioneer | Prioridade |
|---------|--------|---------|-----------|
| Research Trail — sequência de exploração gravada | novo (Supabase) | @cursor | P1 |
| Trail share — URL shareable de uma investigação | novo | @cursor | P2 |
| Trail view — modo de leitura de trail de outro utilizador | novo | @cursor | P2 |

**PLv9.1 — Hypothesis Boards Base**

| Feature | Estado | Pioneer | Prioridade |
|---------|--------|---------|-----------|
| Hypothesis board — quadro de hipóteses com suporte de dados | novo | @cursor | P1 |
| Board vote — comunidade valida hipóteses com evidência | novo | @cursor | P2 |

---

### D.2 — FAMÍLIA INTELLIGENCE — Fundação

**PLv10 — AI Research Copilot Base**

| Feature | Estado | Pioneer | Prioridade |
|---------|--------|---------|-----------|
| Research Copilot — AI que responde com dados do sistema | Supabase AI exists | @claude (arq) + @cursor | P1 |
| Concept Lens — AI que explica um evento com context global | novo | @claude (arq) | P1 |
| AI Debate Chamber base — 2 perspectivas de AI em confronto | novo (experimental) | @claude (arq) | P3 |

---

## SEQUÊNCIA EXECUTÁVEL — Próximos 3 sprints

```
SPRINT PRÓXIMO (após merge do PR actual)
────────────────────────────────────────────────────────────────
  PLv7 — Globe Observatory Layer
    @cursor: adicionar USGS earthquake overlay ao GlobeScene
    @cursor: adicionar pollution overlay (fetchGlobalPollution)
    @cursor: multi-scale navigation + region labels
    @framer: observatory atmosphere (data tick, scale indicator)

  PLv7.1 — World Pulse
    @cursor: pulse feed component com eventos USGS em tempo real
    @framer: visual do pulse (linha temporal, magnitude indicator)

  Gate: owner valida "aqui o mundo é estudado" antes de abrir PLv8

────────────────────────────────────────────────────────────────
SPRINT +1 (após gate PLv7)
────────────────────────────────────────────────────────────────
  PLv8 — Scenario Comparison
    @cursor: comparison view side-by-side
    @cursor: World Bank histórico + gráfico temporal

  PLv8.1 — Timeline Base
    @cursor: timeline interactiva de métrica

  Gate: owner valida "aqui pensa-se sobre futuros"
  → NS2 alcançado se PLv7 + PLv8 passam os critérios

────────────────────────────────────────────────────────────────
SPRINT +2 (após gate PLv8 + NS2 confirmado)
────────────────────────────────────────────────────────────────
  PLv9 — Research Trails + Hypothesis Boards (fundação)
  PLv10 — AI Research Copilot base

  Gate: owner valida NS3 (5–7 features com matéria de wonder)
  → Após NS3: batalhão total activado

════════════════════════════════════════════════════════════════
```

---

## REGRAS DE EXECUÇÃO

```
REGRAS FSP ════════════════════════════════════════════════════

1.  Fundação antes de expansão — nunca começar PLv8 sem PLv7 base
2.  Gate do owner entre famílias — PRESENCE → EXPLORATION requer validação
3.  @claude revê arquitectura de cada feature antes de merge
4.  Features de IA (@claude arq) precisam de design doc antes de @cursor implementar
5.  @framer só entra após @cursor ter o scaffold funcional
6.  Brand Mother System é lei — toda a UI passa pela checklist visual
7.  Dados reais sempre — nenhuma feature de Wonder Layer com dados mock em produção
8.  NS critérios são binários — passa ou não passa; sem "quase passou"

══════════════════════════════════════════════════════════════
```

---

## ARTEFACTOS RELACIONADOS

| Ficheiro | Relação |
|----------|---------|
| `ops/NORTH_STAR_BEFORE_HARD_EXECUTION.md` | Critérios de NS2 e NS3 |
| `ops/CANONICAL_HARD_EXECUTION_ORDER.md` | Fases C e D — ordem de execução |
| `ops/BRAND_MOTHER_SYSTEM.md` | Lei visual — precondição de toda a WorkVisual |
| `ops/BASTION.md` | Gates de execução — PLv7 + PLv8 tasks a abrir |
| `src/components/globe/` | Globe R3F — ponto de partida do PLv7 |
| `src/lib/earthquakeData.ts` | USGS feed já disponível |
| `src/lib/dataSources.ts` | Pollution + data sources disponíveis |

---

*FEATURE_SCAFFOLDING_PLAN.md v1.0 — cravado em 2026-03-22 | claude-sonnet-4-6 | FSP-001*
