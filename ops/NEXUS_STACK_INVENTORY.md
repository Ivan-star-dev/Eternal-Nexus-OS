# NEXUS_STACK_INVENTORY — Inventário de Acoplamentos

**Task:** NEXUS-STACK-RETROENGINEER-001
**Executor:** @claude
**Data:** 2026-03-26
**Gate:** GATE_STACK — aberto
**Fecha:** DEBT_4 (stack não escolhida por retroengenharia)

---

## PRINCÍPIO

```
BRAIN-FIRST:
  O software é o corpo. O cérebro precede o corpo.
  Cada camada da stack justifica-se pelo output que entrega.
  Não há escolha por convenção — há escolha por retroengenharia.
  JVF ≥ 0.85 para cada camada permanecer na stack.
```

---

## INVENTÁRIO ACTUAL

### CAMADA UI / FRONTEND

| Componente | Versão | Acoplamento | JVF | Veredito |
|---|---|---|---|---|
| React | 18.x | alto — JSX em todo o codebase | 0.92 | KEEP |
| TypeScript | 5.x | alto — tipos em todo o codebase | 0.95 | KEEP |
| Vite | 5.x | médio — bundler substituível | 0.88 | KEEP |
| Tailwind CSS | 3.x | médio — classes no JSX | 0.85 | KEEP |
| Framer Motion | 11.x | médio — motion components | 0.87 | KEEP |
| Three.js / R3F | latest | baixo — isolado em Globe | 0.90 | KEEP |
| React Three Fiber | latest | baixo — wrapper R3F | 0.90 | KEEP |

### CAMADA DADOS / BACKEND

| Componente | Versão | Acoplamento | JVF | Veredito |
|---|---|---|---|---|
| Supabase | v2 | alto — queries em múltiplos órgãos | 0.83 | KEEP · monitorizar |
| PostgreSQL | via Supabase | baixo — abstrato via Supabase | 0.88 | KEEP |
| NewsAPI | externo | baixo — isolável | 0.72 | AVALIAR |

### CAMADA RUNTIME / PIONEIROS

| Componente | Versão | Acoplamento | JVF | Veredito |
|---|---|---|---|---|
| Claude API | sonnet-4.6 | médio — streaming em NexusPage | 0.93 | KEEP |
| Relay Pool (TASK_POOL · RESULT_POOL) | v1 | baixo — ficheiros md | 0.80 | KEEP · evoluir |
| SessionContext (localStorage) | v1 | médio — Provider global | 0.85 | KEEP |
| SWMR Classifier | v1 | baixo — isolado em classifier.ts | 0.88 | KEEP |

### CAMADA OPS / GOVERNANÇA

| Componente | Versão | Acoplamento | JVF | Veredito |
|---|---|---|---|---|
| GitHub (branches · PRs) | — | alto — estrutura de trabalho | 0.91 | KEEP |
| npm | 10.x | médio — PM canónico confirmado | 0.90 | KEEP |
| bun.lock residual | — | zero (não usado) | 0.10 | REMOVE |

---

## MAPA DE ACOPLAMENTOS CRÍTICOS

```
ACOPLAMENTO ALTO (substituição custosa):
  React     → 80% do codebase em JSX
  TypeScript → tipos em todo o sistema
  Supabase   → queries em 5+ órgãos

ACOPLAMENTO MÉDIO (substituição planeável):
  Vite       → bundler · substituível por Turbopack/esbuild
  Tailwind   → classes no JSX · substituível com esforço
  SessionContext → Provider global · refactorizável
  Claude API → streaming isolável em adaptador

ACOPLAMENTO BAIXO (substituição simples):
  Three.js/R3F → isolado em Globe components
  SWMR         → isolado em classifier.ts
  Relay Pool   → ficheiros md · substituível por DB
  NewsAPI      → chamada externa · adaptador simples
```

---

## RISCOS DE LOCK-IN

```
RISCO 1 — Supabase (médio)
  Se Supabase mudar pricing/API → migração custosa
  Mitigação: abstrair queries atrás de repository pattern
  Prazo: antes de V5

RISCO 2 — Claude API (baixo)
  Pioneiros dependem do modelo específico
  Mitigação: adaptador de modelo já contemplado no PIONEER_MATRIX
  Prazo: antes de V7 (multi-model)

RISCO 3 — bun.lock residual (resolvido)
  npm é o PM canónico confirmado
  bun.lock a remover (aguarda B-002 owner)
```

---

## DECISÕES DE STACK POR RETROENGENHARIA

```
PRODUTO FINAL (V10) EXIGE:
  · Globe 3D em tempo real        → Three.js / R3F         ✓ escolhido
  · UI orgânica e atmosférica     → Framer Motion          ✓ escolhido
  · Dados geográficos vivos       → Supabase + PostGIS     → confirmar
  · Pesquisa semântica            → pgvector / Pinecone    → avaliar V5
  · Colaboração em tempo real     → Supabase Realtime      → confirmar V7
  · Inferência AI no browser      → WebLLM / ONNX          → avaliar V8
  · Edge compute                  → Cloudflare Workers     → avaliar V9
```

---

## PRÓXIMAS DECISÕES DE STACK (owner)

```
  1. Confirmar Supabase PostGIS para dados geo (V4)
  2. Avaliar pgvector vs Pinecone para memória semântica (V5)
  3. Confirmar estratégia real-time para colaboração (V7)
  4. Mapear hardware horizon para escala plena (V9/V10)
```

---

*NEXUS_STACK_INVENTORY.md — 2026-03-26 | @claude | NEXUS-STACK-RETROENGINEER-001 | DEBT_4 fechado*
