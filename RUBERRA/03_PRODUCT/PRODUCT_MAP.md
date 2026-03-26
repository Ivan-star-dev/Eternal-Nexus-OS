# PRODUCT MAP — Eternal Nexus OS

> Mapa canónico de todas as superfícies de produto do sistema.
> Actualizado a cada versão activa. Fonte de verdade para routing, sessões e faces.

_PRODUCT_MAP.md v1.0 · 2026-03-26 · @claude_

---

## 1. PRINCÍPIO DE MAPEAMENTO

Cada superfície de produto tem quatro atributos fixos:

- **Route** — path exacto no router React
- **Face** — qual das três faces do sistema domina (`heaven_lab` / `bridge_nova` / `nexus_cria`)
- **Status** — `live` (dados reais, interacção activa) / `stub` (estrutura visível, comportamento pendente)
- **Session tracking** — o que a sessão regista ao entrar nesta superfície
- **Primary user action** — o que o utilizador soberano faz aqui

---

## 2. MAPA DE SUPERFÍCIES

| Superfície | Route | Face | Status | Session tracking | Primary user action |
|---|---|---|---|---|---|
| **Hero** | `/` | `heaven_lab` | live | `lastVisit`, `heroScrollDepth` | Ler a visão do sistema, explorar o globo interactivo |
| **Lab** | `/lab` | `heaven_lab` | live | `labEntry`, `activeProposal` | Inspeccionar propostas AI, rever o conselho de decisão |
| **School** | `/school` | `bridge_nova` | stub | `schoolEntry` | Aceder à camada educativa, explorar módulos de conhecimento |
| **Workshop** | `/workshop` | `nexus_cria` | stub | `workshopEntry` | Construir e configurar organismos Nexus, editar fluxos |
| **Globe** | `/globe` | `heaven_lab` | live | `globeProjectId`, `globeCameraState` | Explorar os 6 projectos no globo 3D, clicar em hotspots |
| **Atlas** | `/atlas` | `heaven_lab` | live | `atlasRegion`, `atlasLayer` | Navegar o mapa Cesium geopolítico, activar camadas de dados |
| **Nexus** | `/nexus` | `nexus_cria` | live | `nexusOrganId`, `nexusScrollDepth` | Interagir com os órgãos do sistema, explorar a arquitectura viva |
| **Dashboard** | `/dashboard` | `heaven_lab` | live | `dashboardProjectId`, `dashboardTab` | Monitorizar métricas em tempo real de projectos activos |
| **ProjectPage** | `/project/:id` | `heaven_lab` | live | `activeProjectId`, `projectScrollDepth` | Ler estado do projecto, ver métricas live, aceder ao inspector |
| **Owner Dashboard** | `/owner` | `heaven_lab` | live | `ownerSession`, `ownerTab` | Gerir o sistema, ver estado operacional, aceder a gates |
| **Founder** | `/founder` | `bridge_nova` | live | `founderEntry` | Ler visão do fundador, aceder a materiais de origem |

---

## 3. FACES DO SISTEMA

### Heaven Lab — `heaven_lab`
**Território:** Observatório. Máquina de resolução. Inteligência operacional.
Superfícies: Hero, Lab, Globe, Atlas, Dashboard, ProjectPage, Owner Dashboard.
Característica: dados em tempo real, visualizações 3D, decisão soberana.

### Bridge Nova — `bridge_nova`
**Território:** Aprendizagem. Transferência de conhecimento. Pontes cognitivas.
Superfícies: School, Founder.
Característica: estrutura didáctica, progressão de módulos, retenção de conhecimento.

### Nexus Cria — `nexus_cria`
**Território:** Criação. Construção de organismos. Forge do sistema.
Superfícies: Workshop, Nexus.
Característica: interacção construtiva, configuração, output activo.

---

## 4. SESSION TRACKING — CAMPOS CANÓNICOS

```typescript
// SessionContext — campos activos por superfície
interface SessionState {
  // Universal
  lastVisit: string;           // ISO timestamp da última sessão
  sessionId: string;           // UUID por sessão

  // Globe / Atlas
  globeProjectId: string | null;
  globeCameraState: CameraState | null;
  atlasRegion: string | null;
  atlasLayer: string | null;

  // Dashboard / Project
  dashboardProjectId: string | null;
  dashboardTab: string | null;
  activeProjectId: string | null;
  projectScrollDepth: number;

  // Lab
  activeProposal: string | null;

  // Nexus
  nexusOrganId: string | null;
}
```

Persistência: `localStorage` via `SessionBoot.tsx`. Restaurado ao montar.
TTL de sessão: sem expiração automática. Owner pode limpar manualmente.

---

## 5. ROUTING — REGRAS CANÓNICAS

```typescript
// App.tsx — estrutura de routing canónica
<Route path="/"           element={<Index />} />
<Route path="/lab"        element={<LabPage />} />
<Route path="/school"     element={<SchoolPage />} />
<Route path="/workshop"   element={<WorkshopPage />} />
<Route path="/globe"      element={<GlobePage />} />
<Route path="/atlas"      element={<AtlasPage />} />
<Route path="/nexus"      element={<NexusPage />} />
<Route path="/dashboard"  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
<Route path="/project/:id" element={<ProjectPage />} />
<Route path="/owner"      element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
<Route path="/founder"    element={<FounderPage />} />
```

Rotas protegidas (`/dashboard`, `/owner`) requerem autenticação Supabase via `ProtectedRoute`.

---

## 6. EVOLUÇÃO POR VERSÃO

| Versão | Superfície entregue | Estado |
|---|---|---|
| V1 | Hero (`/`) | closed |
| V2 | Nexus (`/nexus`), Founder (`/founder`) | closed |
| V3 | Globe (`/globe`), Atlas (`/atlas`) — estrutura visual | closed |
| V4 | ProjectPage (`/project/:id`), SessionBoot, motion surfaces | closed |
| V5 | Globe live data, touch mobile, AI proposals, camera fly | closed |
| V6 | Dashboard (`/dashboard`), Owner auth, User Sovereignty Layer | active |
| V7+ | School (`/school`), Workshop (`/workshop`) — a planear | sealed |

---

_PRODUCT_MAP.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_
