# RUNTIME — Eternal Nexus OS

> Como o sistema corre em produção. Stack, ciclo de sessão, fluxo de dados em tempo real,
> budgets de performance e arquitectura de error boundaries.

_RUNTIME.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_

---

## 1. STACK TÉCNICO DE RUNTIME

| Camada | Tecnologia | Versão | Papel |
|---|---|---|---|
| **UI Framework** | React | 18 | Rendering declarativo, concurrent features |
| **Build** | Vite | 5.x | Dev server HMR + production bundle |
| **Tipos** | TypeScript | 5.x | Type safety zero-compromise — TS 0 errors obrigatório |
| **Motion** | Framer Motion | 11.x | Animações declarativas, AnimatePresence, useScroll |
| **3D Globe** | Three.js + React Three Fiber | r167 + 8.x | GoldenAtlasScene, PulseRings, CameraController |
| **Geo** | Cesium / Resium | 1.x | AtlasPage — mapa geopolítico com camadas de dados |
| **Charts** | Recharts + uPlot | latest | DashboardPage — métricas de projecto, séries temporais |
| **Backend** | Supabase | 2.x | Postgres + Auth + Realtime + Storage |
| **Data fetching** | React Query (TanStack) | 5.x | Cache, revalidação, estados de loading/error |
| **State local** | React Context | — | SessionContext, AuthContext, LanguageContext |
| **Persistência** | localStorage | — | SessionBoot — restauração de estado entre visitas |
| **E2E Tests** | Playwright | 1.x | Protocol gates, performance gates em CI |
| **Styling** | TailwindCSS | 3.x | Utility-first, dark base, tokens customizados |

---

## 2. ARRANQUE DA APLICAÇÃO

```
index.html
  └── main.tsx
        └── App.tsx
              ├── QueryClientProvider (React Query)
              ├── AuthProvider (Supabase Auth)
              ├── SessionProvider (SessionContext)
              └── Router
                    ├── SessionBoot (restaura localStorage ao montar)
                    └── Rotas declaradas (ver PRODUCT_MAP.md)
```

**Ordem de inicialização:**
1. `QueryClientProvider` inicializa — stale time 60s, retry 1
2. `AuthProvider` inicializa — lê sessão Supabase do cookie/localStorage
3. `SessionProvider` inicializa — carrega `SessionState` do localStorage
4. `SessionBoot` monta — restaura `globeProjectId`, `dashboardProjectId`, `activeProjectId`
5. Router renderiza a rota activa

---

## 3. CICLO DE SESSÃO

```
VISITA DO OWNER
─────────────────────────────────────────────────────────────────
1. Browser carrega index.html → Vite bundle serve assets
2. React monta → SessionBoot lê localStorage
3. SessionContext disponível em toda a árvore
4. Supabase Auth verifica token → AuthContext atualizado
5. ProtectedRoute avalia → redireciona para /login se não autenticado
6. Página activa monta → hooks de dados inicializam
7. React Query verifica cache → stale? → fetch Supabase
8. Realtime channels subscrevem (globe, dashboard)
9. Owner interage → estado atualizado → localStorage persiste
10. Navegação → SessionContext preserva estado entre rotas
11. Saída → sessionStorage limpa; localStorage persiste para próxima visita
─────────────────────────────────────────────────────────────────
```

**TTL de sessão:** sem expiração automática.
**Auth token:** gerido por Supabase (refresh automático via `onAuthStateChange`).
**Estado de sessão:** `lastVisit`, `sessionId`, `globeProjectId`, `activeProjectId` — persistidos.

---

## 4. FLUXO DE DADOS EM TEMPO REAL

### 4.1 Globe Realtime

```typescript
// useGlobeRealtime.ts
Supabase Realtime → channel('globe_projects')
  → INSERT / UPDATE / DELETE → callback
  → setProjects(prev => [...])        // state update
  → GoldenAtlasScene recebe nova lista → Three.js re-render pontual
```

### 4.2 Dashboard Realtime

```typescript
// useDashboardData.ts
React Query → queryFn: fetchProjectMetrics(projectId)
  → staleTime: 30s
  → refetchInterval: 60s
  → Supabase Realtime: channel('project_metrics')
      → UPDATE → invalidateQueries(['project_metrics', projectId])
```

### 4.3 AI Proposals

```typescript
// useProposalQueue.ts
proposalGenerator(projects) → ProposalQueue[]
  → estado local + sessionStorage
  → AICouncil component consome
  → aceite → insert into proposal_ledger (Supabase)
  → rejeitado → queue.shift() → próxima proposta
```

---

## 5. BUDGETS DE PERFORMANCE

| Métrica | Alvo | Critério de falha |
|---|---|---|
| **FPS Globe (desktop)** | 60 fps constante | < 55 fps em interacção activa |
| **FPS Globe (mobile)** | 30 fps constante | < 25 fps em toque activo |
| **DPR desktop** | nativo (1–2x) | — |
| **DPR mobile** | cap 1.5x | > 1.5x bloqueado por `useTouchGlobe` |
| **LCP (Largest Contentful Paint)** | < 2.5s | > 3s → falha CI performance gate |
| **TTI (Time to Interactive)** | < 4s | > 5s → falha CI performance gate |
| **Bundle size (gzip)** | < 500KB initial | > 600KB → alerta |
| **TS errors em build** | 0 | qualquer erro → bloqueia PR |
| **E2E Playwright** | 100% pass | qualquer falha → bloqueia merge |

**DPR mobile cap — implementação:**
```typescript
// useTouchGlobe.ts
const dpr = Math.min(window.devicePixelRatio, 1.5);
gl.setPixelRatio(dpr);
```

---

## 6. ARQUITECTURA DE ERROR BOUNDARIES

```
App.tsx
  └── GlobalErrorBoundary
        ├── GlobePage
        │     └── GlobeErrorBoundary → fallback: GlobeUnavailable
        ├── AtlasPage
        │     └── AtlasErrorBoundary → fallback: AtlasUnavailable
        ├── DashboardPage
        │     └── DashboardErrorBoundary → fallback: MetricsUnavailable
        └── ProjectPage
              └── ProjectErrorBoundary → fallback: ProjectUnavailable
```

**Princípio:** erro numa superfície não propaga para outra.
**Fallback:** mensagem soberana, sem stack trace exposto ao owner.
**Log:** erros capturados por `console.error` em desenvolvimento; em produção, silent fail + fallback UI.

---

## 7. AMBIENTE DE VARIÁVEIS OBRIGATÓRIAS

```bash
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```

Ausência de qualquer variável → build falha com mensagem explícita no `supabase.ts` client init.

---

## 8. MODO DE DESENVOLVIMENTO

```bash
npm install          # instalar dependências
npm run dev          # Vite HMR em localhost:8080
npm run build        # build de produção (TypeScript check + Vite bundle)
npm run typecheck    # tsc --noEmit (zero errors obrigatório)
npm run test:e2e     # Playwright E2E suite
```

**Hot reload:** Vite HMR — componentes React recarregam sem perder estado de React Query.
**Three.js:** recarrega sem perder câmara se `useRef` mantiver a instância.

---

_RUNTIME.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_
