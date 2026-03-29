# CURRENT STACK — Eternal Nexus OS

> Stack técnico completo do sistema em produção.
> Actualizado a cada versão activa. Fonte de verdade para escolhas técnicas.

_CURRENT_STACK.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_

---

## 1. FRONTEND

| Tecnologia | Versão | Papel no sistema |
|---|---|---|
| **React** | 18.x | Framework UI — concurrent features, Suspense, portals |
| **TypeScript** | 5.x | Type safety absoluta — zero errors em CI obrigatório |
| **Vite** | 5.x | Build tool — HMR em dev, bundle optimizado em prod |
| **TailwindCSS** | 3.x | Utility-first styling — dark base, tokens customizados |
| **Framer Motion** | 11.x | Animações declarativas — AnimatePresence, useScroll, useTransform |
| **Three.js** | r167 | 3D runtime — GoldenAtlasScene, PulseRings, câmara cinemática |
| **React Three Fiber** | 8.x | Wrapper React para Three.js — componentes declarativos 3D |
| **@react-three/drei** | 9.x | Helpers R3F — OrbitControls, Html, useTexture |
| **Cesium / Resium** | 1.x | Mapa geopolítico 3D — AtlasPage, camadas de dados geo |
| **Recharts** | 2.x | Charts declarativos React — séries temporais, área, linha |
| **uPlot** | 1.x | Gráficos de alta performance — dados de alta frequência |
| **React Router DOM** | 6.x | Client-side routing — rotas, ProtectedRoute, navigate |

---

## 2. BACKEND — SUPABASE

| Serviço Supabase | Papel no sistema |
|---|---|
| **Postgres** | Base de dados relacional — `globe_projects`, `project_metrics`, `proposal_ledger` |
| **Auth** | Autenticação soberana — email/password, magic link, sessão persistente |
| **Realtime** | Canais de subscrição — `globe_projects`, `project_metrics` em tempo real |
| **Storage** | Armazenamento de assets — imagens de projectos, documentos |
| **Edge Functions** | (reservado para V7+) — lógica serverless próxima do dado |

**Tabelas canónicas:**

| Tabela | Dados | Acesso |
|---|---|---|
| `globe_projects` | 6 projectos RUBERRA — nome, coordenadas, status, métricas base | público (read) |
| `project_metrics` | Séries temporais por projecto — energia, progresso, indicadores | protegido |
| `proposal_ledger` | Histórico de propostas AI aceites pelo owner | protegido |
| `users` | Gerida por Supabase Auth | interno |

---

## 3. STATE MANAGEMENT

| Camada | Tecnologia | Papel |
|---|---|---|
| **Server state** | TanStack React Query v5 | Cache, revalidação, loading/error states para dados Supabase |
| **Auth state** | React Context (`AuthContext`) | User autenticado, status da sessão Supabase |
| **Session state** | React Context (`SessionContext`) | Estado de sessão do owner — projectos activos, câmara, tabs |
| **Persistência** | localStorage | Restauração de SessionState entre visitas |
| **UI state local** | useState / useReducer | Estado efémero de componente — hover, open/close, tabs |

**React Query config:**
```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,      // 60s antes de considerar stale
      retry: 1,               // 1 retry em caso de falha
      refetchOnWindowFocus: false,
    }
  }
})
```

---

## 4. CI/CD — GITHUB ACTIONS

| Workflow | Ficheiro | Função |
|---|---|---|
| **Performance Gates** | `.github/workflows/performance-gates.yml` | LCP, TTI, bundle size — falha bloqueia merge |
| **App Quality** | `.github/workflows/app-quality.yml` | TypeScript zero errors, build pass |
| **Protocol Gates** | `.github/workflows/protocol-gates.yml` | Verificação de protocolo canónico — branch guard |
| **CI** | `.github/workflows/ci.yml` | Pipeline principal — type check + build + E2E |
| **Deploy Readiness** | `.github/workflows/deploy-readiness.yml` | Verifica pré-condições antes de deploy |
| **Auto PR** | `.github/workflows/auto-pr.yml` | Abre PR automático do branch canónico para main |
| **Auto Merge** | `.github/workflows/auto-merge.yml` | Merge automático após todos os gates passarem |
| **Database Tests** | `.github/workflows/database-tests.yml` | Valida schema Supabase e queries |

**Gate de bloqueio:** qualquer falha em performance-gates, app-quality, ou protocol-gates bloqueia o merge para main.

---

## 5. TESTES

| Tipo | Tecnologia | Scope |
|---|---|---|
| **E2E** | Playwright | Fluxos críticos — globe, dashboard, auth, project navigation |
| **Type check** | `tsc --noEmit` | Zero TypeScript errors — obrigatório em CI |
| **Build check** | `vite build` | Build de produção sem erros — obrigatório em CI |

**Playwright targets:**
- `/` — hero carrega, globo interactivo visível
- `/globe` — GoldenAtlasScene monta, hotspots clicáveis
- `/dashboard` — ProtectedRoute redireciona para /login sem auth
- `/project/:id` — ProjectPage carrega dados do projecto

---

## 6. MODELO DE BRANCH

```
Branch canónico ativo (ex: claude/rebuild-bastion-core-rihGX)
  │
  ├── Toda a escrita vai aqui (nunca para main directamente)
  │
  └── PR → main
        ├── CI gates devem passar (typecheck + build + E2E)
        ├── Performance gates devem passar (LCP, TTI)
        ├── Protocol gates devem passar (branch guard)
        └── Squash merge → main → Vercel auto-deploy

Branches de pioneers:
  - Não há branches por pioneer — todos escrevem no branch canónico
  - Branch canónico muda por sprint (gate do owner)
  - Branch anterior é arquivado — nunca deletado
```

---

## 7. VARIÁVEIS DE AMBIENTE

| Variável | Obrigatória | Uso |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim | Client Supabase — URL do projecto |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Sim | Client Supabase — anon key pública |

Ausência de qualquer variável → excepção explícita no `src/integrations/supabase/client.ts` antes de montar a aplicação.

---

## 8. DEPLOY

| Ambiente | Host | Trigger |
|---|---|---|
| **Produção** | Vercel | Merge squash para `main` |
| **Preview** | Vercel | Push para qualquer branch |
| **Dev local** | localhost:8080 | `npm run dev` |

---

_CURRENT_STACK.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_
