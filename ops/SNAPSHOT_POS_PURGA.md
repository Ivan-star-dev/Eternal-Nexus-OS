# SNAPSHOT PÓS-PURGA + PLANO DE REBUILD — v1.0

**Data:** 2026-03-26 · 20:36
**Executor:** @antigravity | Antigravity (Google DeepMind)
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Status:** NÚCLEO VERIFICADO · REBUILD DEFINIDO

---

## 1. SNAPSHOT DO NÚCLEO ATUAL

### Páginas sobreviventes (`src/pages/`)

| Ficheiro | Papel | Estado |
|---|---|---|
| `Index.tsx` | Home — só Hero + Trinity | ✅ limpa, reescrita |
| `NexusPage.tsx` | Product Face — Heaven Lab | ✅ canônica |
| `FounderPage.tsx` | Founder Vision Layer — FVL | ✅ canônica |
| `SystemFacePage.tsx` | System Face — cockpit soberano | ✅ canônica |
| `AtlasPage.tsx` | Sacred Flow — Atlas organ | ✅ canônica |
| `NewsPortal.tsx` | Sacred Flow — News organ | ✅ canônica |
| `Projects.tsx` | Galeria de projetos | ✅ canônica |
| `ProjectPage.tsx` | Detalhe de projeto | ✅ canônica |
| `DashboardPage.tsx` | Dashboard interno | ✅ canônica |
| `OwnerDashboard.tsx` | Cockpit do owner | ✅ canônica |
| `PrivacyPolicy.tsx` | Legal | ✅ padrão |
| `Terms.tsx` | Legal | ✅ padrão |
| `NotFound.tsx` | Fallback 404 | ✅ padrão |
| `ErrorPage.tsx` | Boundary de erro | ✅ padrão |

**Total: 14 páginas. Zero ruído.**

---

### Rotas activas (`src/App.tsx`)

```
/             → Index (Home — Hero + Trinity)
/atlas        → AtlasPage (Sacred Flow — Atlas)
/news         → NewsPortal (Sacred Flow — News)
/nexus        → NexusPage (Product Face)
/system       → SystemFacePage (System Face)
/founder      → FounderPage (Founder Vision Layer)
/projects     → Projects (Ecosystem)
/project/:id  → ProjectPage (Detalhe)
/dashboard    → DashboardPage (Interno)
/owner        → OwnerDashboard (Cockpit soberano)
/privacy      → PrivacyPolicy
/terms        → Terms
*             → NotFound
```

---

### Componentes home preservados (`src/components/home/`)

| Componente | Papel | Estado |
|---|---|---|
| `ProductHero.tsx` | Hero completa — Globe + Text + CTAs | ✅ DNA mãe |
| `TrinityRow.tsx` | 3 portais estruturais | ✅ base para rebuild |
| `HeroFirstProof.tsx` | Proof strip com métricas count-up | ✅ canônico |
| `index.ts` | Barrel limpo — apenas 3 exports | ✅ limpo |

---

### Globe engine preservado (`src/components/globe/`)

| Ficheiro | Conteúdo técnico |
|---|---|
| `InteractiveGlobe.tsx` | Orquestrador — mobile fallback + R3F Canvas |
| `GlobeScene.tsx` | Geometria 3D, hotspots, shaders, rotação |
| `GlobeConstructionSequence.tsx` | Sequência de construção animada |
| `GlobeLayerSelector.tsx` | Controlo de layers (projects, seismic…) |
| `EarthquakeLayer.tsx` | Layer de dados sísmicos |
| `MobileGlobeMap.tsx` | Fallback 2D para mobile |
| `ParticleFlow.tsx` | Sistema de partículas atmosféricas |

**Backbone técnico intacto:** R3F canvas · camera `fov 42` · `dpr [2,3]` · `antialias` · `powerPreference: high-performance` · layers configuráveis · mobile-responsive · `OrganErrorBoundary` envolto.

---

## 2. CONFIRMAÇÃO CANÓNICA

```
✅ HERO                — ProductHero.tsx com GlobeZone + SovereignText + SessionPulse
✅ GLOBO              — InteractiveGlobe.tsx + GlobeScene.tsx (R3F, configurado, vivo)
✅ BACKBONE TÉCNICO   — 7 ficheiros de globe engine, parâmetros calibrados, preservados
✅ TRINDADE           — TrinityRow.tsx com 3 portais (estrutura conceitual intacta)
✅ FLUXO SAGRADO      — /atlas + /news no router · AtlasPage.tsx + NewsPortal.tsx existem
✅ FACES CANÓNICAS    — System · Product (Nexus) · Ecosystem (Founder/Atlas) presentes
✅ APP.TSX            — limpo, comentado, sem imports fantasmas
```

**Veredicto:** O núcleo sobreviveu intacto e canônico. A base é sólida. O organismo pode crescer a partir daqui sem repetir o caos anterior.

---

## 3. MAPA DA PRÓXIMA FASE — ORDEM EXACTA DE REBUILD

### GATE 0 — Em curso agora
**Validar que o runtime não quebra.**
```
npm run dev → verificar que a home carrega (Hero + Globe + Trinity)
Critério de pronto: sem erros de console críticos, Globe renderiza, Trinity aparece
```

---

### BLOCO 1 — TRINITY MONUMENTAL (Foco imediato)
**Líder:** @framer / executor de experiência
**Apoio:** @cursor (integração técnica) · @copilot (detalhes e bordas)

**Problema atual do TrinityRow:**
- Portais têm `minHeight: 500px` — é uma aproximação, não uma presença
- Fundo atmosférico é subtil mas não imersivo
- Falta o "portal feeling" — o visitante não sente que está a entrar num outro mundo
- As palavras temporais (Past · Present · Future) estão corretas mas perdidas no espaço

**O que o rebuild da Trinity deve fazer:**
```
1. Cada portal ocupa viewport significativa (vh mínimo: 70–80vh no desktop)
2. Fundo próprio por portal — não genérico, não suave demais:
   - SCHOOL (Heaven Lab): gold atmosphere — lembrar memória, âmbar quente
   - LAB (Bridge Nova): teal deep — frieza do exame, azul-verde técnico
   - CREATION HUB (Nexus Cria): dark-gold amber — alquimia, a criação em ignição
3. Entrada com presença: o visitante rola e sente que chegou a outro lugar
4. Palavra temporal como âncora visual grande (clamp 60–80px), não detalhe
5. CTA de entrada: mais visível, mais invitante, mais autoritário
6. Border superior de cada portal: linha de separação visível mas elegante
7. Responsivo: em mobile, portais empilham mas mantêm presença individual
```

**Critério de pronto do Bloco 1:**
```
✅ Trinity ao mesmo nível visual da Hero (textura, presença, atmosfera)
✅ Cada portal tem identidade própria e inconfundível
✅ Os 3 CTAs levam às rotas canónicas certas (/nexus, /system, /founder)
✅ Mobile preserva a presença (scroll vertical de portais)
✅ Sem breaking do engine Globe acima deles
```

---

### BLOCO 2 — PRIMEIRO PROOF STRIP (refinamento)
**Líder:** @copilot (detalhes)
**Contexto:** `HeroFirstProof.tsx` já existe e é canônico. Necessita pequenos ajustes:
- Métricas precisam de ser reais (verificar se os números são correctos com a visão actual)
- A frase mãe está em PT — validar se o owner quer bilingue ou só PT
- A posição dentro do `ProductHero` (Bloco 4) deve ser após a Trinity, não separada

**Critério de pronto do Bloco 2:**
```
✅ Números confirmados pelo owner
✅ Língua da frase mãe decidida
✅ Posicionamento visual consistente com o nível premium da Hero
```

---

### BLOCO 3 — NEXUS PAGE (Heaven Lab experience)
**Líder:** @framer
**Quando:** Só depois de Bloco 1 concluído e validado pelo owner.
**Contexto:** `NexusPage.tsx` tem 45KB — é a maior página. Provavelmente necessita purga própria alinhada à PRODUCT_FACE_CANON.

---

### BLOCOS 4–N — RESTANTE DO ORGANISMO
**Quando:** Só depois de Bloco 1 + Bloco 2 fechados.
**Sequência:** Cada página alinhada ao DNA da Hero/Globe antes de avançar para a seguinte.

---

## 4. FOCO IMEDIATO — LEI DE ANTI-EXPANSÃO

```
REGRA ACTIVA:
Nenhum pioneiro abre trabalho em Bloco 2+ antes de Bloco 1 estar fechado.
Nenhuma nova feature é adicionada antes de a Trinity estar ao nível da Hero.
O organismo expande por blocos fechados — nunca em onda aberta.

GATE DE ENTRADA DO BLOCO 1:
  Owner confirma que os destinos dos portais estão correctos:
    SCHOOL → /nexus ✓ ou precisa de outra rota?
    LAB    → /system ✓ ou precisa de outra rota?
    HUB    → /founder ✓ ou precisa de outra rota?
```

---

## 5. DEPENDÊNCIAS E GATES

```
BLOCO 1 (Trinity Monumental):
  DEPENDE DE: nada — pode começar agora
  GATE DE SAÍDA: owner valida presença visual + links

BLOCO 2 (First Proof):
  DEPENDE DE: Bloco 1 concluído
  GATE DE SAÍDA: owner valida números e língua

BLOCO 3 (Nexus Page):
  DEPENDE DE: Bloco 2 concluído
  GATE DE SAÍDA: owner valida PRODUCT_FACE alinhada com Hero

BLOCOS 4-N:
  DEPENDE DE: sequência anterior fechada
```

---

_SNAPSHOT_POS_PURGA.md v1.0 — 2026-03-26 | @antigravity | AUDITORIA-CANONICA-TOTAL-001_
