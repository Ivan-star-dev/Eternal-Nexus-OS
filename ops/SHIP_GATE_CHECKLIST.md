# SHIP GATE CHECKLIST — V10 REAL
> Cravado em 2026-03-28 | @claude | Branch: claude/setup-ruberra-nexus-IL7Tg
> Lei de aceitação. Só pilotar quando TODOS os itens P0 estão ✅.
> Fonte: GAP_CLOSURE_MATRIX.md § Gap 18 · ACCEPTANCE / SHIP GATE

---

## DEFINIÇÃO DE PRONTO PARA PILOT

**Minimum Viable Pilot = MV-Pilot:**
- Spawn/Entry funciona end-to-end
- Session persiste entre reloads
- Utilizador cria pelo menos 1 artefacto que sobrevive ao reload
- Creation Lab reconhece o utilizador na reentrada
- Governance não deixa caos entrar
- Performance não degrada abaixo de 30fps em balanced tier

---

## CHECKLIST GERAL (sistema-wide)

### P0 — BLOQUEIA PILOT

| # | Item | Responsável | Como verificar | Status |
|---|------|-------------|----------------|--------|
| G-01 | Branch canónico está correto | @claude | `git branch --show-current` = `claude/setup-ruberra-nexus-IL7Tg` | ✅ 2026-03-28 |
| G-02 | Build sem erros TypeScript | @codex | `npm run typecheck` → 0 errors novos (26 pre-existentes, nenhum desta sessão) | ✅ 2026-03-28 |
| G-03 | Build sem erros de lint | @codex | `npm run lint` → 0 errors novos (3 pre-existentes em scripts/*.cjs) | ✅ 2026-03-28 |
| G-04 | Build de produção compila | @cursor | `npm run build` → ✓ built in 1.75s · LabPage 9.1KB gzip | ✅ 2026-03-28 |
| G-05 | Testes unitários passam | @codex | `npm run test` → 84 passed, 1 skipped, 0 failed | ✅ 2026-03-28 |
| G-06 | Entrada cold-start funciona | @cursor | Visitar `/lab` sem sessão → hero carrega, CTA visível | ⬜ |
| G-07 | Criação de artefacto funciona | @cursor | Clicar QuickCreate → artefacto aparece em LabWorkBay | ⬜ |
| G-08 | Artefacto persiste no reload | @cursor | Criar artefacto → reload → artefacto ainda visível | ⬜ |
| G-09 | Session TTL funciona | @cursor | Criar sessão → forçar `ts_last_active` antiga → reload → sessão expirada | ⬜ |
| G-10 | Resume badge aparece na reentrada | @cursor | Criar sessão → reload → LabHero mostra badge "Resume:" | ⬜ |
| G-11 | Governance guard bloqueia portal inválido | @claude | `guardPortalRoute('invalid')` → `allowed: false` | ✅ 2026-03-28 |
| G-12 | Fidelity tier resolve sem crash | @cursor | `resolveFidelityTier()` retorna um tier válido em todos os browsers | ✅ 2026-03-28 |
| G-13 | Transição de portal não congela | @framer | Navegar Nexus → Lab → Atlas → sem freeze, sem flash branco | ⬜ |
| G-14 | Mobile não quebra (375px) | @cursor | Abrir `/lab` em iPhone SE viewport → layout intacto | ⬜ |
| G-15 | Sem console errors em cold start | @codex | Abrir DevTools → 0 red errors em `/`, `/lab`, `/nexus` | ⬜ |

---

### P1 — FORTEMENTE RECOMENDADO ANTES DE PILOT

| # | Item | Responsável | Como verificar | Status |
|---|------|-------------|----------------|--------|
| P-01 | Route intelligence retorna sugestão | @claude | `resolveRouteIntelligence({...})` → `primary !== null` com artefactos existentes | ⬜ |
| P-02 | Scroll restore funciona | @cursor | Scroll page → reload → página abre no mesmo Y | ⬜ |
| P-03 | Open panels persistem na sessão | @cursor | Abrir painel → reload → painel volta aberto | ⬜ |
| P-04 | LabToolSpine: tool click cria artefacto | @cursor | Hover Work Bay → clicar Research → artefacto criado | ⬜ |
| P-05 | Fidelity light mode sem 3D ativo | @codex | Forçar tier `light` → sem partículas, sem bloom, sem 3D pesado | ⬜ |
| P-06 | Transition `instant` em reduced-motion | @framer | `prefers-reduced-motion: reduce` → transitions instantâneas | ⬜ |
| P-07 | Portal identity visualmente distinta | @framer | Abrir Lab → Nexus → Atlas → cada um tem atmosfera diferente | ⬜ |
| P-08 | Sem memory leaks em long session | @codex | Profile 30min session → heap não cresce indefinidamente | ⬜ |
| P-09 | Supabase auth flui sem erro | @cursor | Sign in → sign out → sign in → sem erros de sessão | ⬜ |
| P-10 | WaitlistBanner só aparece para anon | @cursor | Unauthenticated `/lab` → banner visível. Authenticated → banner oculto | ⬜ |

---

### P2 — DESEJÁVEL, NÃO BLOQUEIA

| # | Item | Status |
|---|------|--------|
| P2-01 | Owner Control Layer mínimo funcional | ✅ 2026-03-28 |
| P2-02 | Evolution Engine v1 ativo | ✅ 2026-03-28 |
| P2-03 | Guidance model não intrusivo em uso real | ⬜ |
| P2-04 | Repo docs zero-drift (task → canon → teste linkados) | ⬜ |
| P2-05 | WCAG AA contrast pass em todos os portais | ⬜ |

---

## CHECKLIST POR PORTAL

### Portal: Creation Lab (`/lab`)

| # | Item | Como verificar | Status |
|---|------|----------------|--------|
| L-01 | LabHero renderiza com identidade única | Visual distinto do Nexus hero | ⬜ |
| L-02 | QuickCreate cria artefacto real | Clicar → LabWorkBay atualiza | ⬜ |
| L-03 | LabWorkBay empty state visível sem artefactos | Limpar localStorage → `/lab` → empty state | ⬜ |
| L-04 | LabWorkBay mostra artefactos reais | Criar artefacto → reload → aparece | ⬜ |
| L-05 | Continue → re_entry_point atualizado | Click Continue → `localStorage nxos_session` tem re_entry_point | ⬜ |
| L-06 | LabToolSpine revela no hover | Hover work area → spine aparece com animação | ⬜ |
| L-07 | Collaborate mostra tooltip solo-first | Hover Collaborate → tooltip visível | ⬜ |
| L-08 | ResearchFeed carrega abaixo do fold | Scroll down → ResearchFeed visível | ⬜ |

### Portal: Nexus (`/nexus`)

| # | Item | Como verificar | Status |
|---|------|----------------|--------|
| N-01 | Streaming input aceita prompt | Escrever prompt → resposta aparece | ⬜ |
| N-02 | Session swarm re-entry funciona | Iniciar swarm → reload → resume disponível | ⬜ |
| N-03 | L4 execution deck carrega | `/nexus` → deck visível sem crash | ⬜ |

### Portal: Atlas (`/atlas`)

| # | Item | Como verificar | Status |
|---|------|----------------|--------|
| A-01 | Mapa carrega sem erro | `/atlas` → Cesium globe visível | ⬜ |
| A-02 | Modo switch funciona | TopBar mode toggle → muda atmosfera | ⬜ |
| A-03 | Layers toggle funciona | RightPanel → toggle layer → layer aparece/desaparece | ⬜ |

---

## PILOT GATE FINAL

Antes de abrir pilot a utilizadores reais:

```
PILOT-GATE-CHECK
════════════════════════════════════
[ ] Todos os P0 items ✅
[ ] Mínimo 8/10 P1 items ✅
[ ] Lab portal: todos L-01 a L-08 ✅
[ ] Nexus portal: todos N-01 a N-03 ✅
[ ] Atlas portal: todos A-01 a A-03 ✅
[ ] Owner fez revisão visual em dispositivo real
[ ] Owner emite GATE_PILOT_OPEN
════════════════════════════════════
Só depois de GATE_PILOT_OPEN: convidar utilizadores reais.
```

---

_SHIP_GATE_CHECKLIST.md v1.0 — cravado em 2026-03-28 | @claude | branch: claude/setup-ruberra-nexus-IL7Tg_
