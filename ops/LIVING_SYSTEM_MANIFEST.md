# LIVING SYSTEM MANIFEST — Nexus Living Organism
> Cravado em 2026-03-28 | @claude | Branch: claude/setup-ruberra-nexus-IL7Tg
> Lei primária da arquitetura viva. Não editar fora de protocolo canónico.

---

## 0. DEFINIÇÃO

Ruberra não é uma aplicação com features.
É um **organismo cognitivo vivo** com:
- Identidade que reconhece o utilizador
- Memória que persiste entre sessões
- Inteligência que percebe e sugere
- Ambiente que incorpora tudo isso numa experiência espacial premium

O organismo não executa comandos. **Ele vive.**

---

## 1. TRINITADE VIVA

### 1.1 Inteligência Viva
O sistema percebe, prioriza, orquestra, adapta, guia, protege e evolui.
Não responde a pedidos. Antecipa-os.

### 1.2 Memória Viva
O sistema reconhece o utilizador, preserva continuidade, retém artefactos, rotas, contexto, progresso e padrões de preferência.
A memória não é armazenamento. É identidade acumulada.

### 1.3 Ambiente Vivo
O espaço não é fundo.
O espaço é interface, memória, método e inteligência incorporados.
O ambiente muda quando o estado muda. Nunca independentemente.

---

## 2. ARQUITETURA DO ORGANISMO — 11 CAMADAS VIVAS

```
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 1: Identity Interpreter                                    │
│  Quem é o utilizador? Owner, authenticated, behavioral type?     │
│  Source: AuthContext → NexusRuntime.setIdentity()                │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 2: Intent Resolver                                         │
│  O que o utilizador tenta fazer? Research / Production / Reentry │
│  Source: memory/classifier.ts → trinity face + regime            │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 3: World Composer                                          │
│  Qual é o estado completo do mundo? OrganismState composição.    │
│  Source: NexusRuntime.getState() — única fonte de verdade        │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 4: Atmosphere Director                                     │
│  Que identidade atmosférica projeta o portal atual?              │
│  Source: portal/identity.ts + atmosphere/controller.ts           │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 5: Interaction Conductor                                   │
│  Como fluem as interações? Sem conflitos, sem caos, com ordem.   │
│  Source: governance/runtime-guard.ts + fusion-bus events         │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 6: Memory Core                                             │
│  Sessão, artefactos, re_entry_point, scroll, continuity score.   │
│  Source: contexts/SessionContext + artifacts/store.ts            │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 7: Route Intelligence                                      │
│  Que próximo passo faz mais sentido para este utilizador agora?  │
│  Source: route-intelligence/engine.ts + useRouteIntelligence     │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 8: Guidance Engine                                         │
│  Como apresentar a sugestão sem ser intrusivo?                   │
│  Source: components/intelligence/NextStepHint.tsx                │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 9: Governance Guardian                                     │
│  Que leis protegem o sistema do caos?                            │
│  Source: governance/runtime-guard.ts (G-01→G-06, C-01→C-07)     │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 10: Performance Governor                                   │
│  Que tier de fidelidade opera? O que renderiza agora?           │
│  Source: fidelity/ladder.ts + transitions/portal-transition.ts   │
├──────────────────────────────────────────────────────────────────┤
│  LAYER 11: Evolution Engine                                       │
│  Como evolui o organismo com o uso? Maturity, unlocks, profile.  │
│  Source: evolution/usageTracker.ts + unlockGraph.ts              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. FUSION BUS — GRAFO DE EVENTOS

```
DIREÇÃO CANÓNICA:
  Identity → Intelligence → Memory → Environment

EVENTOS PRINCIPAIS:
┌──────────────────────┬─────────────────────┬─────────────────────┐
│ Evento               │ Emitido por          │ Consumido por       │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ identity:resolved    │ AuthContext          │ NexusRuntime        │
│ session:booted       │ SessionContext       │ NexusRuntime        │
│ session:resumed      │ NexusRuntime         │ LabHero, NextHint   │
│ portal:entered       │ NexusRuntime         │ Atmosphere, Evol.   │
│ artifact:created     │ artifacts/store.ts   │ NexusRuntime, Evol. │
│ fidelity:changed     │ ControlTower         │ NexusRuntime, Atm.  │
│ governance:violation │ runtime-guard.ts     │ NexusRuntime, Log   │
│ evolution:leveled-up │ NexusRuntime         │ NextHint, UI        │
│ route:suggested      │ route-intelligence   │ NextStepHint        │
│ organism:ready       │ NexusRuntime         │ App shell           │
└──────────────────────┴─────────────────────┴─────────────────────┘
```

---

## 4. ORGANISM STATE — SCHEMA CANÓNICO

```typescript
OrganismState {
  boot_phase:    'cold' | 'booting' | 'live' | 'degraded'

  identity: {
    user_id:          string | null
    is_owner:         boolean
    is_authenticated: boolean
    behavioral_type:  'explorer' | 'builder' | 'researcher' | 'navigator' | 'unknown'
  }

  memory: {
    session_id:       string
    subject:          string
    re_entry_point:   string
    is_resume:        boolean
    artifact_count:   number
    open_panels:      string[]
    continuity_score: 0.0–1.0   // computed from all memory signals
    last_active:      ISO 8601
  }

  environment: {
    current_portal:        PortalId | null
    previous_portal:       PortalId | null
    fidelity_tier:         'ultra' | 'high' | 'balanced' | 'light'
    transition_in_progress: boolean
    atmosphere_dirty:      boolean
  }

  intelligence: {
    trinity_face:         TrinityFace | null
    regime:               Regime | null
    route_suggestion:     RouteAction | null
    suggestion_confidence: 0.0–1.0
    maturity_level:       0 | 1 | 2 | 3
    dominant_portal:      PortalId | null
  }

  system: {
    governance_violations: GovernanceViolation[]
    violation_count:       number
    last_violation_ts:     ISO 8601 | null
    error_count:           number
    subsystem_health:      Record<subsystem, 'ok' | 'degraded' | 'offline'>
  }
}
```

---

## 5. ANTI-CHAOS LAWS (C-01 → C-07)

```
C-01  STATE FLOWS DOWN
      Identity → Intelligence → Memory → Environment.
      Nunca inverter. Nunca pular camadas.

C-02  NO DIRECT CROSS-LAYER WRITES
      Nenhum subsistema escreve no domínio de outro.
      Todas as mutações passam pela NexusRuntime.

C-03  GOVERNANCE IS SYNCHRONOUS
      Todos os checks de governance são síncronos.
      Bloqueiam antes de qualquer commit de estado.
      Nunca fire-and-forget.

C-04  MEMORY NEVER DESTROYED ON ERROR
      Erros degradam gracefully. A memória persiste.
      Em caso de falha: boot_phase → 'degraded', nunca limpeza.

C-05  ENVIRONMENT IS CONSEQUENCE
      O ambiente é sempre derivado do estado.
      Nunca estilizado independentemente.
      AtmosphereController é função pura de PortalId + FidelityTier.

C-06  EVOLUTION IS ADDITIVE
      O sistema adiciona memória. Nunca remove.
      Maturity level nunca decresce sem gate explícito do owner.
      Artefactos nunca apagados sem ação explícita do utilizador.

C-07  PERFORMANCE BUDGET GATES ALL RENDERING
      FidelityBudget determina o que renderiza.
      Nenhum componente ignora o tier.
      Light tier → sem partículas, sem bloom, sem 3D pesado, transições instantâneas.
```

---

## 6. CONTINUITY SCORE — FÓRMULA CANÓNICA

```
continuity_score = 0.0 → 1.0

Componentes:
  +0.30  re_entry_point presente
  +0.20  is_resume === true
  +0.20  artifact_count ≥ 1 (cap 0.20, acumula 0.05/artefacto)
  +0.10  última sessão há < 24h
  +0.10  scroll_snapshot presente
  +0.10  open_panels.length > 0

Uso:
  ≥ 0.60 → Resume badge no LabHero
  ≥ 0.70 → NextStepHint confia na sugestão de reentrada
  = 1.00 → Continuidade total — utilizador sente que o mundo o esperava
```

---

## 7. BEHAVIORAL PROFILE — MATRIZ DE RESOLUÇÃO

```
CONDIÇÃO                                  → TIPO
────────────────────────────────────────────────────────
totalSessions < 2                         → unknown
artifact_count > 10 AND dominant = 'lab' → builder
dominant = 'nexus' OR 'atlas'            → researcher
maturity ≥ 2 AND artifact_count > 5      → navigator
maturity ≥ 1                             → explorer
else                                      → unknown
```

---

## 8. FICHEIROS CANÓNICOS DO ORGANISMO

| Ficheiro | Camada | Estado |
|----------|--------|--------|
| `src/lib/core/fusion-bus.ts` | Event bus | ✅ LIVE |
| `src/lib/core/organism-state.ts` | State schema | ✅ LIVE |
| `src/lib/core/runtime.ts` | NexusRuntime singleton | ✅ LIVE |
| `src/hooks/useOrganism.ts` | React integration | ✅ LIVE |
| `src/components/SessionBoot.tsx` | Organism boot trigger | ✅ LIVE |
| `src/contexts/SessionContext.tsx` | Memory Core (session) | ✅ LIVE |
| `src/lib/artifacts/store.ts` | Memory Core (artifacts) | ✅ LIVE |
| `src/lib/governance/runtime-guard.ts` | Governance Guardian | ✅ LIVE |
| `src/lib/fidelity/ladder.ts` | Performance Governor | ✅ LIVE |
| `src/lib/transitions/portal-transition.ts` | Transition Grammar | ✅ LIVE |
| `src/lib/portal/identity.ts` | Portal Identity | ✅ LIVE |
| `src/lib/atmosphere/controller.ts` | Atmosphere Director | ✅ LIVE |
| `src/lib/route-intelligence/engine.ts` | Route Intelligence | ✅ LIVE |
| `src/components/intelligence/NextStepHint.tsx` | Guidance Engine | ✅ LIVE |
| `src/lib/evolution/usageTracker.ts` | Evolution Engine | ✅ LIVE |
| `src/lib/owner/control-tower.ts` | Owner Control | ✅ LIVE |
| `src/lib/memory/routing.ts` | Trinity Routing | ✅ LIVE |
| `src/lib/memory/classifier.ts` | Intent Classifier | ✅ LIVE |
| `src/lib/spawn/entry-pipeline.ts` | Entry/Spawn | ✅ LIVE |

---

## 9. ADAPTATION DISCIPLINE

```
REGRA-1: O organismo aprende pela ação, não pela configuração.
  → Evolution Engine regista eventos (visit, create, complete).
  → Perfil comportamental emerge do padrão, não de formulários.

REGRA-2: Sugestões têm confiança mínima de 0.65.
  → NextStepHint só aparece se confidence ≥ 0.65.
  → Abaixo disso: silêncio. Guiar sem irritar.

REGRA-3: O organismo nunca adapta o ambiente sem sinal.
  → Ambiente muda quando portal muda ou fidelidade muda.
  → Nunca por timer, nunca por idle, nunca sem evento.

REGRA-4: Memória é sagrada. Adaptar ≠ apagar.
  → C-04: nenhum erro destrói memória.
  → Adaptação é sempre aditiva (C-06).

REGRA-5: Velocidade de adaptação respeita o utilizador.
  → Maturity level só sobe — nunca desce.
  → Sugestões de reentrada só aparecem após 1 retorno confirmado.
```

---

## 10. GRAMMAR DE TRANSIÇÃO

```
REGRA T-01:  familia_mesma (nexus→nexus, lab→lab)    → soft (0.3s)
REGRA T-02:  familia_lab ↔ familia_nexus              → dominant (0.5s)
REGRA T-03:  família_diferente (qualquer outra)       → full (0.7s)
REGRA T-04:  tier = light OR prefers-reduced-motion   → instant (0s)
REGRA T-05:  owner override                           → instant (0s)

FAMÍLIAS:
  nexusFamily: ['nexus', 'home']
  labFamily:   ['lab', 'workshop', 'school']
  dataFamily:  ['atlas', 'research']
```

---

## 11. GRAMMAR DE ATMOSFERA

```
Cada portal tem ADN atmosférico único:
  bg_base        → cor de fundo soberana (nunca shared)
  accent_primary → cor de acento dominante
  ambient_left   → glow ambiente esquerda (posição + opacidade)
  ambient_right  → glow ambiente direita
  grid_color     → cor da grelha de engenharia
  grain_opacity  → textura orgânica (0 em light tier)
  vignette       → profundidade de vinheta
  has_pulse      → ambiance pulsante (false em light tier)

Lei: ambiente = f(PortalId, FidelityTier)
     Nunca função de preferência de UI, nunca override manual.
```

---

_LIVING_SYSTEM_MANIFEST.md v1.0 — cravado em 2026-03-28 | @claude | ORGANISM-BOOT-001_
