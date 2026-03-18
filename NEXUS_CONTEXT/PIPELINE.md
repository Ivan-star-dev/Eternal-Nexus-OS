# ETERNAL NEXUS — THE PIONEER PIPELINE (Task Accumulator)

> **Rule:** Let tasks accumulate. If the pipeline runs low (under 3 tasks), the pioneer finishing their job MUST break down the current phase gate and generate new tasks. We do not wait for the user to assign work. **This is an autonomous loop of self-planning and execution.**

## Status: ACTIVE

### 🧱 CORE ARCHITECTURE (The Spine)
- [x] ~~**Task C1:** Wire Nervous System v2 (`bus.ts`) into `useNexusState.ts`. Must hit the pass/fail gate (Deterministic, Idempotent, Replayable). (Owner tags: `@claude`)~~ ✅ `@copilot` — `src/lib/events/bus.ts` created; wired into `useNexusState.ts`; 10/10 gate tests GREEN.
- [x] ~~**Task C2:** Implement the `GeopoliticsMap.tsx` MapLibre shell using the new serverless `pmtiles://` registrar. Tie into the Tribunal data layer. (Owner tags: `@claude` + `@copilot`)~~ ✅ `@copilot` — `src/components/atlas/GeopoliticsMap.tsx` + `src/lib/geo/pmtiles.ts` shipped.

### 🎨 DESIGN & INTERFACE (The Flesh)
- [x] ~~**Task U1:** Apply the Dark Glassmorphism "Eternal Nexus" visual DNA directly to the Geopolitics Mapbox JSON styles. Hide unnecessary labels, prioritize glowing neon borders. (Owner tags: `@copilot` + `@ui`)~~ ✅ `@copilot` — `src/lib/geo/nexus-map-style.ts` — neon cyan borders, deep-space background, no labels.

### ⚙️ OPS & AUDIT (The Machine)
- [x] ~~**Task A2:** Add PMTiles and MapLibre memory profiling to the CI performance gate. (Owner tags: `@codex`)~~ ✅ `@copilot` — Gate already implemented at `scripts/gates/performance/memory-budget.spec.ts`; CI workflow `performance-gates.yml` runs `npm run test:perf` on every PR. Gate confirmed active.
- [x] ~~**Task A3:** Create the automated Lab-Branch validation script that prevents PR merges if the lab hypothesis wasn't proven with a verified report. (Owner tags: `@antigravity`)~~

### 🔄 NEXT WAVE (auto-generated — pipeline rule: never < 3 tasks)
- [ ] **Task N1:** Integrate `GeopoliticsMap` into `AtlasPage` — replace static geopolitics-overview image with live MapLibre shell. Wire `tribunal:verdict` fly-to. (Owner: `@copilot`)
- [ ] **Task N2:** Index persistence — connect `bus.getLog()` to Supabase `index_events` table so events survive page refresh (Logged invariant, full phase gate). (Owner: `@claude`)
- [ ] **Task N3:** News narratable — subscribe `echo-vox` to `index:logged` bus events and generate `NewsBroadcast` entries (Narratable invariant). (Owner: `@claude` + `@codex`)

---
**Instructions for Pioneers:**
When you cross off your task, commit this file. If the backlog is empty, generate more tasks based on the `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md` gates.
