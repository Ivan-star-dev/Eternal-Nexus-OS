# DATA AND CONTROL FLOWS — Eternal Nexus OS

> Mapa canónico de todos os fluxos de dados e controlo do sistema.
> Cada fluxo tem origem, transformação, destino, e o componente responsável.

_DATA_AND_CONTROL_FLOWS.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_

---

## 1. PRINCÍPIO DE FLUXO

O sistema tem quatro categorias de fluxo:

| Categoria | Origem | Destino | Natureza |
|---|---|---|---|
| **Dados de projecto** | Supabase `globe_projects` | GoldenAtlasScene | Realtime + inicial |
| **Métricas de dashboard** | Supabase `project_metrics` | DashboardPage | Query + Realtime invalidation |
| **Sessão e estado local** | localStorage / SessionContext | Toda a árvore React | Persistência entre visitas |
| **Auth e protecção** | Supabase Auth | ProtectedRoute → páginas | Event-driven |
| **Propostas AI** | `globe_projects` + `proposalGenerator` | AICouncil → `proposal_ledger` | Pipeline local + Supabase write |

---

## 2. FLUXO: GLOBE PROJECTS → GLOBO 3D

```
Supabase DB: globe_projects
  │
  ├── [inicial] fetchSupabaseProjects()
  │     └── ENRICHMENT_REGISTRY.enrich(projects)
  │           └── GoldenAtlasScene recebe: GlobeProject[]
  │
  └── [realtime] useGlobeRealtime()
        └── Supabase Realtime channel('globe_projects')
              → INSERT/UPDATE/DELETE event
              └── setProjects(updatedList)
                    └── GoldenAtlasScene re-render pontual
                          └── ProjectHotspot atualizado no globo
```

**Hooks envolvidos:** `useGlobeRealtime`, `fetchSupabaseProjects`
**Componentes consumidores:** `GoldenAtlasScene`, `ProjectHotspot`, `EventPulseRings`
**Estado derivado:** `focusedProjectId` (click no hotspot → ProjectBottomSheet / ProjectFocusPanel)

---

## 3. FLUXO: DASHBOARD DATA

```
React Query → queryKey: ['project_metrics', projectId]
  │
  ├── [cache válido] serve do cache (staleTime: 30s)
  │
  └── [cache stale / miss] fetchProjectMetrics(projectId)
        └── Supabase: SELECT * FROM project_metrics WHERE project_id = ?
              └── DashboardPage recebe: ProjectMetrics
                    ├── MetricCard components
                    ├── Recharts charts (séries temporais)
                    └── uPlot (gráficos de alta frequência)

Supabase Realtime channel('project_metrics')
  → UPDATE event para projectId activo
  └── queryClient.invalidateQueries(['project_metrics', projectId])
        └── React Query re-fetch automático → UI atualizada
```

**Hooks envolvidos:** `useDashboardData`, `useRealtimeMetrics`
**Componentes consumidores:** `DashboardPage`, `MetricCard`, `PortfolioChart`
**Acesso:** `ProtectedRoute` — requer autenticação Supabase

---

## 4. FLUXO: SESSÃO E ESTADO LOCAL

```
SessionBoot.tsx (monta ao iniciar App)
  │
  ├── localStorage.getItem('nexus_session')
  │     └── parse JSON → SessionState
  │           └── dispatch(restoreSession(state))
  │                 └── SessionContext actualizado → árvore React notificada
  │
  └── [sem sessão prévia] estado inicial vazio
        └── SessionContext com defaults

Owner interage (ex: clica hotspot no globo)
  │
  └── SessionContext.setGlobeProjectId(id)
        └── useEffect → localStorage.setItem('nexus_session', JSON.stringify(state))
              └── estado persiste entre reloads e visitas futuras
```

**Campos persistidos:**
- `lastVisit` — ISO timestamp
- `sessionId` — UUID gerado por visita
- `globeProjectId` — último projecto seleccionado no globo
- `globeCameraState` — posição da câmara no globo
- `activeProjectId` — projecto activo em ProjectPage
- `dashboardProjectId` — projecto no dashboard
- `dashboardTab` — tab activa no dashboard
- `activeProposal` — proposta AI em revisão no Lab

**Ficheiros:** `src/contexts/SessionContext.tsx`, `src/components/SessionBoot.tsx`

---

## 5. FLUXO: AUTENTICAÇÃO

```
Owner acede a /dashboard ou /owner
  │
  └── ProtectedRoute avalia AuthContext.user
        │
        ├── [autenticado] renderiza página protegida
        │
        └── [não autenticado] navigate('/login')
              └── LoginPage → Supabase Auth (email/password ou magic link)
                    │
                    └── Supabase Auth emite: onAuthStateChange('SIGNED_IN')
                          └── AuthContext.setUser(user)
                                └── ProtectedRoute reavalia → acesso concedido
                                      └── navigate(redirectPath || '/dashboard')
```

**Sign out:**
```
Owner clica "Sair"
  └── supabase.auth.signOut()
        └── onAuthStateChange('SIGNED_OUT')
              └── AuthContext.setUser(null)
                    └── ProtectedRoute bloqueia → /login
```

**Ficheiros:** `src/contexts/AuthContext.tsx`, `src/components/ProtectedRoute.tsx`, `src/hooks/useCurrentUser.ts`

---

## 6. FLUXO: PROPOSTAS AI

```
GlobeProjects (Supabase) + SessionContext
  │
  └── proposalGenerator(projects: GlobeProject[]) → ProposalQueue[]
        │  (função pura — sem side effects — determinística sobre dados reais)
        │
        └── useProposalQueue()
              ├── estado: queue[], activeProposal, proposalHistory[]
              └── AICouncil component consome
                    ├── renderiza proposta activa com badge AUTO
                    ├── [aceite] → supabase.from('proposal_ledger').insert(proposal)
                    │               └── queue.shift() → próxima proposta
                    └── [rejeitado] → queue.shift() → próxima proposta (sem write)
```

**Ficheiros:** `src/utils/proposalGenerator.ts`, `src/hooks/useProposalQueue.ts`, `src/components/AICouncil.tsx`
**Tabela Supabase:** `proposal_ledger` — histórico imutável de propostas aceites

---

## 7. FLUXO: PROJECT PAGE

```
URL: /project/:id
  │
  └── ProjectPage monta → useProjectData(id)
        │
        └── React Query: fetchProjectDetail(id)
              └── Supabase: globe_projects WHERE id = ?
                    └── ProjectPage renderiza:
                          ├── Cabeçalho com status LIVE badge
                          ├── Métricas do projecto (overlay Supabase)
                          ├── Inspector CTA → /lab?project=id
                          └── SessionContext.setActiveProjectId(id)
                                └── persiste em localStorage
```

**Estado carregado via SessionContext:** ao navegar de volta, `activeProjectId` restaura o último projecto visto.

---

## 8. FLUXO: GLOBE EVENTS (REALTIME VISUAL)

```
GlobeEventBus (singleton em memória)
  │
  ├── emitEvent(type: GlobeEventType, projectId: string)
  │     └── subscribers.forEach(cb => cb(event))
  │
  └── EventPulseRings (Three.js)
        └── useEffect → subscribe ao GlobeEventBus
              → novo evento → criar anel de pulso na coordenada do projecto
              → animação Three.js: escala 0→3, opacidade 1→0, 2s, remove
```

**Ficheiros:** `src/utils/GlobeEventBus.ts`, `src/components/EventPulseRings.tsx`

---

## 9. DIAGRAMA DE DEPENDÊNCIAS DE FLUXO

```
Supabase (fonte de verdade)
  ├── globe_projects ──→ useGlobeRealtime ──→ GoldenAtlasScene
  ├── project_metrics ──→ useDashboardData ──→ DashboardPage
  ├── proposal_ledger ←── useProposalQueue (write)
  └── Auth ──→ AuthContext ──→ ProtectedRoute ──→ /dashboard, /owner

SessionContext (estado de sessão)
  ├── ←── SessionBoot (restaura do localStorage)
  ├── ──→ GlobePage (focusedProjectId)
  ├── ──→ ProjectPage (activeProjectId)
  └── ──→ DashboardPage (dashboardProjectId, dashboardTab)
```

---

_DATA_AND_CONTROL_FLOWS.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_
