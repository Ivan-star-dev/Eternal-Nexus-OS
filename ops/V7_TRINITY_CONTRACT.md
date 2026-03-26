# V7_TRINITY_CONTRACT — Eternal Nexus OS

> Contrato estrutural canónico das três superfícies trinity.
> Fonte de verdade para @cursor, @framer, @antigravity.
> Nenhuma superfície é construída sem este documento estar selado.

_V7_TRINITY_CONTRACT.md v1.0 · 2026-03-26 · @claude · AUTO-GATE V7 OPEN_

---

## VISÃO TRINITY

```
TRINITY LAW — TRÊS TEMPOS, UMA ESPÉCIE
═══════════════════════════════════════════════════════════════

LAB        → PRESENTE  → `heaven_lab`   → /lab
SCHOOL     → PASSADO   → `bridge_nova`  → /school
CREATION HUB → FUTURO → `nexus_cria`   → /workshop

Não são páginas. São portais.
Mesma espécie-mãe. O propósito muda — a espécie não.
O owner habita os três. O sistema recorda o que foi feito em cada um.
═══════════════════════════════════════════════════════════════
```

---

## SUPERFÍCIE 1 — LAB (PRESENTE)

**Route:** `/lab`
**Face:** `heaven_lab`
**Temporalidade:** Presente — o que está a acontecer agora
**Session key:** `heaven-lab`

---

### 1a. PAPEL NO ORGANISMO

O Lab é o habitat de investigação holográfica do sistema.
É onde o owner observa o mundo, formula hipóteses, sonda projectos activos, e produz findings que alimentam o Workshop.

O Lab não decide. O Lab revela.
A decisão vai para o Nexus (Parliament). A construção vai para o Workshop.
O Lab é o telescópio — não o parlamento, não a forge.

---

### 1b. MODELO ESPACIAL / INTERACÇÃO

```
LAB SPATIAL MODEL
─────────────────────────────────────────────────────────────────
┌─────────────┬──────────────────────────┬──────────────────────┐
│  WORLD      │   INVESTIGATION BENCH    │   EVIDENCE WALL      │
│  SIGNAL     │                          │                      │
│  STRIP      │  Hipótese activa         │  Findings acumulados │
│             │  Probe de projecto        │  Ligações entre      │
│  Intel feed │  Camada geo (GeoLayer)   │  evidências          │
│  Anomalias  │  AIProbe activo          │  Export → Nexus      │
│  Pulsos     │                          │  Export → Workshop   │
│  globais    │                          │                      │
└─────────────┴──────────────────────────┴──────────────────────┘

INTERACÇÃO:
- World Signal Strip: feed passivo — scroll, click para fixar sinal
- Investigation Bench: workspace activo — drag/drop evidências, invocar AIProbe
- Evidence Wall: painel de resultados — organiza findings, exporta
- Mobile: stack vertical — strip colapsável, bench primário, wall em overlay
─────────────────────────────────────────────────────────────────
```

---

### 1c. MÓDULOS / COMPONENTES

| Componente | Path | Responsabilidade |
|---|---|---|
| `LabSurface` | `src/pages/LabPage.tsx` | Shell da superfície — orquestra zonas |
| `HypothesisBoard` | `src/components/lab/HypothesisBoard.tsx` | Formular e manter hipótese activa |
| `EvidencePanel` | `src/components/lab/EvidencePanel.tsx` | Painel direito — evidence wall |
| `ProjectProbe` | `src/components/lab/ProjectProbe.tsx` | Sonda projecto seleccionado — dados, status, anomalias |
| `IntelFeed` | `src/components/lab/IntelFeed.tsx` | Strip esquerda — feed de sinais globais (absorveu NewsPortal) |
| `GeoLayer` | `src/components/lab/GeoLayer.tsx` | Camada geoespacial no bench (absorveu AtlasPage/Cesium) |
| `AIProbe` | `src/components/lab/AIProbe.tsx` | AI integrada no bench — não autónoma, responde a hipótese activa |
| `useLabState` | `src/hooks/useLabState.ts` | Hook de estado persistente (localStorage + Supabase futuro) |

---

### 1d. LÓGICA DE MOVIMENTO DE PROJECTOS

```
ENTRY VECTORS → LAB:
  Globe hotspot click → "Investigate" CTA → Lab abre com projecto pré-carregado
  Dashboard anomaly → "Probe" CTA → Lab abre com sinal fixado no bench
  Direct nav /lab → restaura lab_state anterior (useLabState.restore)
  Nexus proposal aceite → "Validate" CTA → Lab com contexto de proposta

EXIT VECTORS ← LAB:
  Lab finding → "Send to Parliament" → Nexus com finding como input
  Lab finding → "Build on this" → Workshop com finding como contexto de canvas
  Lab finding → "Study precedent" → School com tema do finding como path
  Lab close → estado persiste em nxos_lab_state (silent)
```

---

### 1e. MEMÓRIA / ESTADO

```typescript
// Storage key: 'nxos_lab_state'
interface LabState {
  lab_hypothesis: string | null;        // hipótese activa formulada
  lab_project_id: string | null;        // projecto em investigação
  lab_evidence_ids: string[];           // findings acumulados nesta sessão
  lab_geo_active: boolean;              // GeoLayer visível
  lab_intel_feed_pinned: string | null; // sinal fixado no IntelFeed
  lab_last_active: number;              // timestamp — para restore
}

// Hook canónico
function useLabState(): {
  state: LabState;
  setHypothesis: (h: string) => void;
  probeProject: (id: string) => void;
  addEvidence: (id: string) => void;
  exportFinding: (target: 'nexus' | 'workshop' | 'school') => void;
  restore: () => void;
}
```

---

### 1f. ORQUESTRAÇÃO PODIUM

| Pioneer | Papel | Território |
|---|---|---|
| **@cursor** | Constrói `LabSurface`, `useLabState`, `ProjectProbe`, `AIProbe` | WorkFunction |
| **@framer** | Atmosphera do Lab — dark + gold + data density | WorkVisual |
| **@antigravity** | Motion do bench — entrada de evidências, pulse do IntelFeed | WorkVisual |
| **@claude** | Arquitectura + contrato AIProbe | WorkStructure |

**Split canónico:**
- @cursor: mecânica, hooks, API wiring — sem decisão de design
- @framer: tokens visuais, layout, feel do observatório
- @antigravity: anima superfícies já construídas pelo @framer/@cursor

---

### 1g. VISÍVEL vs INTERNO

| Visível ao owner | Interno ao sistema |
|---|---|
| HypothesisBoard (texto, estado) | useLabState (localStorage writes) |
| IntelFeed (sinais) | GeoLayer fetch logic |
| GeoLayer (mapa) | AIProbe model calls |
| EvidencePanel (findings) | lab_evidence_ids sync |
| AIProbe (respostas) | export routing logic |
| Export CTAs | Session carryover para Workshop/School/Nexus |

---

### 1h. O QUE NÃO DEVE ENTRAR NO LAB

```
LAB DRIFT PREVENTION
─────────────────────────────────────────────────────────────────
❌ Dashboard de métricas genérico (Lab não é analytics SaaS)
❌ Atlas standalone com UI própria (GeoLayer = módulo do Lab, não superfície)
❌ Feed de notícias independente (IntelFeed = sinal, não NewsPortal)
❌ Parliament / voting / proposals (→ Nexus)
❌ Construção de artefactos (→ Workshop)
❌ Módulos de aprendizagem (→ School)
❌ Autenticação própria (→ /access layer)
❌ Chat AI autónomo sem hipótese (AIProbe serve a hipótese, não existe sozinho)
─────────────────────────────────────────────────────────────────
```

---

## SUPERFÍCIE 2 — SCHOOL (PASSADO)

**Route:** `/school`
**Face:** `bridge_nova`
**Temporalidade:** Passado — o que foi aprendido, o que aconteceu, o que ficou
**Session key:** `bridge-nova`

---

### 2a. PAPEL NO ORGANISMO

O School é a realidade imersiva de aprendizagem construída a partir do passado.
É onde o owner estuda precedentes, completa módulos de conhecimento, e acumula mastery que alimenta o Lab e o Workshop.

O School não investiga o presente — estuda o passado.
Não constrói — prepara o construtor.
É a biblioteca viva, não a forge, não o telescópio.

---

### 2b. MODELO ESPACIAL / INTERACÇÃO

```
SCHOOL SPATIAL MODEL
─────────────────────────────────────────────────────────────────
┌─────────────┬──────────────────────────┬──────────────────────┐
│  MASTERY    │   KNOWLEDGE SURFACE      │   AI TUTOR           │
│  MAP        │                          │   (collapsible)      │
│             │  Módulo activo           │                      │
│  Paths      │  Texto + media           │  Pergunta/resposta   │
│  Progresso  │  Case archive            │  baseado no módulo   │
│  Fruição    │  Links para Lab          │  activo              │
│             │                          │                      │
└─────────────┴──────────────────────────┴──────────────────────┘

INTERACÇÃO:
- Mastery Map: navegação — seleccionar path, ver progresso, fruição acumulada
- Knowledge Surface: leitura imersiva — scroll profundo, media embebida
- AI Tutor: colapsável à direita — responde apenas ao módulo activo
- Mobile: Mastery Map como bottom nav, Knowledge Surface full-screen, Tutor em overlay
─────────────────────────────────────────────────────────────────
```

---

### 2c. MÓDULOS / COMPONENTES

| Componente | Path | Responsabilidade |
|---|---|---|
| `SchoolSurface` | `src/pages/SchoolPage.tsx` | Shell da superfície — orquestra zonas |
| `MasteryMap` | `src/components/school/MasteryMap.tsx` | Mapa de paths + progresso + fruição |
| `LearningModule` | `src/components/school/LearningModule.tsx` | Renderiza módulo activo (texto, media, case) |
| `AITutor` | `src/components/school/AITutor.tsx` | AI colapsável — contexto = módulo activo |
| `CaseArchive` | `src/components/school/CaseArchive.tsx` | Arquivo de casos históricos navegáveis |
| `ProgressEngine` | `src/components/school/ProgressEngine.tsx` | Lógica de progresso + updateFruit() |
| `useSchoolState` | `src/hooks/useSchoolState.ts` | Hook de estado persistente |

---

### 2d. LÓGICA DE MOVIMENTO DE PROJECTOS

```
ENTRY VECTORS → SCHOOL:
  Globe project click → "Study precedent" → School abre com path do projecto
  Lab finding → "Research background" → School abre com tema do finding
  Direct nav /school → restaura school_state anterior
  Nexus case study → "Learn more" → School com módulo do caso

EXIT VECTORS ← SCHOOL:
  Módulo completo → updateFruit() → progresso acumulado no MasteryMap
  Insight → "Test in Lab" → Lab com hipótese derivada do módulo
  Módulo → "Build this" → Workshop com template derivado do conteúdo
  School close → estado persiste em nxos_school_state (silent)
```

---

### 2e. MEMÓRIA / ESTADO

```typescript
// Storage key: 'nxos_school_state'
interface SchoolState {
  school_path_id: string | null;        // path activo no MasteryMap
  school_module_id: string | null;      // módulo activo na Knowledge Surface
  school_mastery: string[];             // IDs de módulos completados
  school_tutor_thread: string | null;   // thread do AI Tutor (continuidade)
  school_last_active: number;           // timestamp — para restore
}

// Hook canónico
function useSchoolState(): {
  state: SchoolState;
  selectPath: (id: string) => void;
  openModule: (id: string) => void;
  completeModule: (id: string) => void;  // dispara updateFruit()
  setTutorThread: (thread: string) => void;
  restore: () => void;
}
```

---

### 2f. ORQUESTRAÇÃO PODIUM

| Pioneer | Papel | Território |
|---|---|---|
| **@cursor** | Constrói `SchoolSurface`, `useSchoolState`, `ProgressEngine`, `LearningModule` | WorkFunction |
| **@framer** | Atmosphera do School — bridge_nova feel, espaço de leitura, progressão clara | WorkVisual |
| **@antigravity** | Motion do MasteryMap — fruição acumulada, entrada de módulo | WorkVisual |
| **@claude** | Contrato AITutor (modelo, contexto, limites) | WorkStructure |

**Split canónico:**
- @cursor: renderização de módulos, lógica de progresso, state persistence
- @framer: tipografia de leitura profunda, espaçamento, atmosfera de arquivo
- @claude: define como AITutor usa o módulo como contexto (não deriva para chat genérico)

---

### 2g. VISÍVEL vs INTERNO

| Visível ao owner | Interno ao sistema |
|---|---|
| MasteryMap (paths, progresso visual) | school_mastery[] sync |
| LearningModule (conteúdo) | ProgressEngine updateFruit() |
| AITutor (conversa) | school_tutor_thread storage |
| CaseArchive (casos navegáveis) | Fetch de módulos (Supabase futuro) |
| Exit CTAs (Lab / Workshop) | Session carryover routing |

---

### 2h. O QUE NÃO DEVE ENTRAR NO SCHOOL

```
SCHOOL DRIFT PREVENTION
─────────────────────────────────────────────────────────────────
❌ EducacaoNacional pattern (School é da RUBERRA, não plataforma nacional)
❌ LMS genérico com certificados, progresso gamificado, leaderboards
❌ Gamification — pontos, badges, rankings (fruição é operacional, não lúdica)
❌ Bright white eLearning aesthetic (→ bridge_nova: dark, espaço, permanência)
❌ Investigação do presente (→ Lab)
❌ Construção de artefactos (→ Workshop)
❌ Chat AI autónomo (AITutor serve o módulo activo, não existe sozinho)
❌ Módulos de terceiros / marketplace / conteúdo externo não curado
─────────────────────────────────────────────────────────────────
```

---

## SUPERFÍCIE 3 — CREATION HUB / WORKSHOP (FUTURO)

**Route:** `/workshop`
**Face:** `nexus_cria`
**Temporalidade:** Futuro — o que será construído, criado, materializado
**Session key:** `nexus-cria`

---

### 3a. PAPEL NO ORGANISMO

O Workshop é a forge — o lugar onde o owner constrói outputs, artefactos, e sistemas a partir dos findings do Lab e do conhecimento da School.

O Workshop não investiga — constrói.
Não aprende — produz.
É o terminus activo do loop Lab→School→Workshop.
O que sai do Workshop entra no mundo real (Projects layer, Supabase, deploy).

---

### 3b. MODELO ESPACIAL / INTERACÇÃO

```
WORKSHOP SPATIAL MODEL
─────────────────────────────────────────────────────────────────
┌─────────────┬──────────────────────────┬──────────────────────┐
│  TOOL       │   CREATION CANVAS        │   OUTPUT SURFACE     │
│  LAYER      │                          │                      │
│             │  Canvas activo           │  Artefactos prontos  │
│  Templates  │  AICoCreator integrado   │  Export / deploy     │
│  Workflows  │  OrganismBuilder         │  Bridge → Projects   │
│  Artefacts  │  WorkflowEngine          │  OutputBridge        │
│  lib        │                          │                      │
└─────────────┴──────────────────────────┴──────────────────────┘

INTERACÇÃO:
- Tool Layer: paleta de ferramentas e templates — seleccionar para iniciar canvas
- Creation Canvas: workspace principal — AICoCreator assistente lateral, não dominante
- Output Surface: painel de resultados — artefactos prontos para export/deploy
- Mobile: Tool Layer como bottom sheet, Canvas full-screen, Output em overlay
─────────────────────────────────────────────────────────────────
```

---

### 3c. MÓDULOS / COMPONENTES

| Componente | Path | Responsabilidade |
|---|---|---|
| `WorkshopSurface` | `src/pages/WorkshopPage.tsx` | Shell da superfície — orquestra zonas |
| `CreationCanvas` | `src/components/workshop/CreationCanvas.tsx` | Canvas principal de criação |
| `AICoCreator` | `src/components/workshop/AICoCreator.tsx` | AI co-criação — serve o canvas, não domina |
| `ArtefactLibrary` | `src/components/workshop/ArtefactLibrary.tsx` | Biblioteca de artefactos produzidos |
| `OrganismBuilder` | `src/components/workshop/OrganismBuilder.tsx` | Construtor de organismos (absorveu NexusOrganismBuilder) |
| `WorkflowEngine` | `src/components/workshop/WorkflowEngine.tsx` | Fluxos de trabalho configuráveis |
| `OutputBridge` | `src/components/workshop/OutputBridge.tsx` | Bridge → Projects layer / Supabase `artefacts` |
| `useWorkshopState` | `src/hooks/useWorkshopState.ts` | Hook de estado persistente |

---

### 3d. LÓGICA DE MOVIMENTO DE PROJECTOS

```
ENTRY VECTORS → WORKSHOP:
  Lab finding → "Build on this" → Workshop abre canvas com finding como contexto
  School module complete → "Create artefact" → Workshop com template derivado
  Nexus proposal aceite → "Implement" → Workshop com proposta como spec do canvas
  Globe project → "Configure" → Workshop com projecto como target
  Direct nav /workshop → restaura workshop_state anterior

EXIT VECTORS ← WORKSHOP:
  Artefacto completo → OutputBridge → Projects layer (actualiza projecto)
  Artefacto completo → OutputBridge → Supabase `artefacts` table (futuro V8+)
  Organism built → → Nexus (como novo organismo disponível)
  Workshop close → estado persiste em nxos_workshop_state (silent)
```

---

### 3e. MEMÓRIA / ESTADO

```typescript
// Storage key: 'nxos_workshop_state'
interface WorkshopState {
  workshop_canvas_id: string | null;     // canvas activo
  workshop_project_id: string | null;    // projecto target do canvas
  workshop_artefacts: string[];          // IDs de artefactos produzidos
  workshop_workflow: string | null;      // workflow activo no WorkflowEngine
  workshop_tool_active: string | null;   // ferramenta activa no Tool Layer
  workshop_last_active: number;          // timestamp — para restore
}

// Hook canónico
function useWorkshopState(): {
  state: WorkshopState;
  openCanvas: (id: string, context?: { from: 'lab' | 'school' | 'nexus'; data: unknown }) => void;
  saveArtefact: (id: string) => void;
  bridgeToProject: (projectId: string, artefactId: string) => void;
  setWorkflow: (id: string) => void;
  restore: () => void;
}
```

---

### 3f. ORQUESTRAÇÃO PODIUM

| Pioneer | Papel | Território |
|---|---|---|
| **@cursor** | Constrói `WorkshopSurface`, `useWorkshopState`, `OutputBridge`, `WorkflowEngine` | WorkFunction |
| **@framer** | Atmosphera da forge — nexus_cria feel, materialização, densidade de tool | WorkVisual |
| **@antigravity** | Motion do canvas — materialização de artefactos, WorkflowEngine transitions | WorkVisual |
| **@claude** | Contrato AICoCreator + OrganismBuilder arch (absorção de NexusOrganismBuilder) | WorkStructure |

**Split canónico:**
- @cursor: canvas interactivo, output bridge wiring, state persistence, Supabase writes
- @framer: UI da forge — tool layer, artefact library, output surface design
- @claude: define como AICoCreator serve o canvas sem dominar (contra-lei do chatbot autónomo)

---

### 3g. VISÍVEL vs INTERNO

| Visível ao owner | Interno ao sistema |
|---|---|
| Tool Layer (templates, workflows) | useWorkshopState writes |
| CreationCanvas (workspace activo) | AICoCreator model calls |
| AICoCreator (sugestões, co-criação) | OutputBridge Supabase writes |
| ArtefactLibrary (produzidos) | WorkflowEngine state machine |
| OutputBridge CTAs (export, deploy) | Session carryover do Lab/School |
| OrganismBuilder (configuração) | Organism publish → Nexus |

---

### 3h. O QUE NÃO DEVE ENTRAR NO WORKSHOP

```
WORKSHOP DRIFT PREVENTION
─────────────────────────────────────────────────────────────────
❌ NexusOrganismBuilder como identidade standalone (OrganismBuilder = módulo do Workshop)
❌ Padrão Figma / Notion / CMS (Workshop é forge soberana, não editor genérico)
❌ No-code builder para utilizadores externos (serve apenas o owner)
❌ AI chatbot como superfície primária (AICoCreator serve o canvas — não domina)
❌ Parliament / voting / proposals (→ Nexus — AICouncil vive lá)
❌ Investigação do presente (→ Lab)
❌ Módulos de aprendizagem (→ School)
❌ Dashboard de métricas (→ /dashboard ou Nexus)
─────────────────────────────────────────────────────────────────
```

---

## LOOP TRINITY — FLUXO CANÓNICO

```
LOOP CANÓNICO LAB → SCHOOL → WORKSHOP
═══════════════════════════════════════════════════════════════

OBSERVAR (Lab/Presente)
  ↓ finding gerado
APRENDER (School/Passado)
  ↓ módulo completado — mastery acumulado
CONSTRUIR (Workshop/Futuro)
  ↓ artefacto produzido
PUBLICAR (Projects layer / Supabase)
  ↓ projecto actualizado no globe
OBSERVAR novamente (Lab — loop fecha)

─────────────────────────────────────────────────────────────
Nexus (Parliament) recebe findings do Lab e outputs do Workshop.
Nexus não faz parte do loop trinity — é o árbitro soberano.
─────────────────────────────────────────────────────────────
```

---

## CRITÉRIOS DE IMPLEMENTAÇÃO V7

Para cada superfície, o gate de V7 fecha quando:

| Critério | Lab | School | Workshop |
|---|---|---|---|
| Shell page funcional (sem placeholder) | ☐ | ☐ | ☐ |
| State hook implementado e persistente | ☐ | ☐ | ☐ |
| 3 zonas espaciais renderizadas | ☐ | ☐ | ☐ |
| Entry vectors funcionais (mínimo 1) | ☐ | ☐ | ☐ |
| Exit vectors funcionais (mínimo 1) | ☐ | ☐ | ☐ |
| Session carryover (startSession wired) | ☐ | ☐ | ☐ |
| AI module integrado (stub ok) | ☐ | ☐ | ☐ |
| Drift prevention verificada | ☐ | ☐ | ☐ |

**Gate V7 fecha** quando todos os critérios das 3 superfícies estiverem [✓].

---

## REFERÊNCIAS

| Documento | Papel |
|---|---|
| `ops/BASTION.md` | Tasks V7 elegíveis — V7-LAB-001, V7-SCHOOL-001, V7-WORKSHOP-001 |
| `ops/MASTER_EXECUTION_PROTOCOL.md` | 22 leis — TRINITY LAW, LAB LAW, SCHOOL LAW, CREATION HUB LAW |
| `RUBERRA/08_MARKETING_AND_NARRATIVE/BRAND_CORE.md` | Feel canónico por face |
| `ops/LIVE_STATE.md` | Estado vivo — branch canónico activo |

---

_V7_TRINITY_CONTRACT.md v1.0 · 2026-03-26 · @claude · AUTO-GATE V7 OPEN — Cursor elegível para todas as 3 superfícies_
