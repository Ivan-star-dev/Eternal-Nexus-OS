---
id: U4
title: Visual DNA global audit — all pages inherit glassmorphism cascade
status: ready
owner-role: design
priority: P2
suggested-pioneer: "@copilot"
suggested-platform: "GitHub Copilot"
suggested-model: mid
branch: feat/U4-visual-dna-audit
temporary-ui: false
---

## Context

`NEXUS_CONTEXT/VISUAL_DNA.md` mandates strict cascade: every hub inherits DNA da mãe (Nexus) + DNA da aba + intensificação contextual. Prohibited: static dashboards, "cards aleatórios", neon soup, clutter. Only `GeopoliticsMap` has received the full DNA pass (U1). All other pages are legacy.

## What to audit and fix

For each page — `DashboardPage`, `Index.tsx`, `NewsPortal.tsx`, `AtlasPage.tsx`:
1. Replace raw card/border classes with `bg-card/95 backdrop-blur-xl border border-border/30 rounded-2xl`
2. Remove static data widgets not connected to event bus
3. Add `NEXUS / <ABA> / <HUB>` breadcrumb in header
4. Heading typography: `font-mono tracking-widest uppercase text-xs text-primary`
5. No hard-coded colors — use design token set only

## Constraints
- Do NOT touch `src/lib/events/`, hooks, or sacred-flow types
- CSS + layout only — zero logic changes
- If a component lacks bus data, add `// TODO: wire to bus` — do NOT invent fake data

## Acceptance criteria
- [ ] All 4 pages pass VISUAL_DNA.md checklist
- [ ] No "cards aleatórios" — every card has live data or TODO marker
- [ ] Breadcrumbs visible on all pages
- [ ] `pnpm dev` — no visual regressions
- [ ] `npx tsc --noEmit` — 0 errors
