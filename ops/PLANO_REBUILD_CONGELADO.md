# NÚCLEO CONGELADO + ORDEM DE REBUILD
**Data:** 2026-03-26 · 20:51
**Executor:** @antigravity | Antigravity (Google DeepMind)
**Status:** CONGELADO — imutável até ordem explícita do owner

---

## 1. NÚCLEO CONGELADO (INTOCÁVEL)

### Ficheiros protegidos — não alterar sem ordem explícita:

| Ficheiro | Motivo da protecção |
|---|---|
| `src/components/globe/*` (7 ficheiros) | Engine técnico — dias de calibração |
| `src/components/home/ProductHero.tsx` | Hero canónica — DNA mãe |
| `src/pages/Index.tsx` | Home limpa — apenas Hero |
| `src/App.tsx` | Router canónico — 13 rotas correctas |
| `tailwind.config.ts` | Cores/fontes — lei NEXUS_OS §3.7 |
| `vite.config.ts` | Build config — lei NEXUS_OS §3.4 |
| `src/types/index.ts` | Tipos centrais — lei NEXUS_OS §3.5 |
| `data/projects.ts` | Dados do owner — lei NEXUS_OS §3.6 |

---

## 2. MAPA DE NAVEGAÇÃO FECHADO

### Rotas canónicas (imutável):
```
/             → Index (Home — Hero + Trinity)
/atlas        → AtlasPage (Sacred Flow — Atlas)
/news         → NewsPortal (Sacred Flow — News)
/nexus        → NexusPage (Product Face — War Room)
/system       → SystemFacePage (System Face — Cockpit)
/founder      → FounderPage (Founder Vision Layer)
/projects     → Projects (Ecosystem galeria)
/project/:id  → ProjectPage (Detalhe)
/dashboard    → DashboardPage (Interno)
/owner        → OwnerDashboard (Owner cockpit)
/privacy      → PrivacyPolicy
/terms        → Terms
*             → NotFound
```

### Trinity portals → destinações:
```
SCHOOL (Heaven Lab)    → /nexus
LAB (Bridge Nova)      → /atlas
CREATION HUB (N.Cria)  → /founder
```

### Navegação pública (NavBar):
```
NEXUS   → /nexus
SYSTEM  → /system
```

### CommandPalette — grupos canónicos:
```
HOME · SACRED FLOW · PRODUCT · ECOSYSTEM · INTERNAL · LEGAL
```

**Rotas mortas eliminadas:** `/tribunal` · `/access` · `/geopolitics` · `/investor/*` · `/about` · `/globe` · `/lab` · `/school` · `/workshop`

---

## 3. ORDEM FIXA DE REBUILD

```
FASE ACTUAL (EM CURSO):
  BLOCO 0 — Núcleo congelado ✅ FECHADO
  BLOCO 1 — Trinity monumental ✅ FECHADO
  BLOCO 2 — Product Face (NexusPage DNA) ✅ FECHADO
  BLOCO 3 — Mapa de navegação ✅ FECHADO

PRÓXIMO (NÃO ABRIR ATÉ GATE):
  BLOCO 4 — HeroFirstProof micro-polish
             Gate: owner valida Hero + Trinity ao vivo
  
  BLOCO 5 — SystemFacePage (System Face)
             Gate: BLOCO 4 fechado
  
  BLOCO 6 — FounderPage (Founder Vision)
             Gate: BLOCO 5 fechado
  
  BLOCOS 7-N — Páginas restantes por ordem de prioridade
             Gate: cada bloco anterior fechado e validado
```

---

## 4. PROIBIDO REINTRODUZIR

```
❌ Rotas: /tribunal /access /about /geopolitics /investor/* /globe /lab /school /workshop
❌ Componentes: GovernmentBids ClassifiedBanner IPProtectionBanner GlobeBackground IntroBanner
❌ Páginas: GovAuth InvestorBriefing GeopoliticsNarrative SalaDeCrise PlataformaNacional
❌ Secções: DossierCard ProjectsLiveSection ContributionsSection OrganStatusGrid
❌ Comportamentos: polir vários blocos ao mesmo tempo · abrir páginas novas sem gate
```

---

## 5. VEREDITO DO ESTADO ACTUAL

```
✅ Hero: Globe engine + ProductHero preservados e polidos
✅ Trinity: Portais monumentais com presença real (64-104px regime words)
✅ NexusPage: Surface elevated (DNA #060c14 aplicado)
✅ Router: 13 rotas canónicas, zero rotas mortas
✅ CommandPalette: Grupos canónicos, zero entradas mortas
✅ NavBar: Canónico — NEXUS + SYSTEM
✅ NexusPage header: /tribunal → /atlas, /access → /owner
✅ Commits: purge + trinity + nexus surface registados

PENDENTE (próxima sessão):
  - Owner valida Hero + Trinity ao vivo (npm run dev)
  - Gate de entrada BLOCO 4
```

---

_PLANO_REBUILD_CONGELADO.md v1.0 — 2026-03-26 | @antigravity_
