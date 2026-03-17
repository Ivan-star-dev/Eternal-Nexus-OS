# ETERNAL NEXUS — THE PIONEER PIPELINE (Task Accumulator)

> **Rule:** Let tasks accumulate. If the pipeline runs low (under 3 tasks), the pioneer finishing their job MUST break down the current phase gate and generate new tasks. We do not wait for the user to assign work. **This is an autonomous loop of self-planning and execution.**

## Status: ACTIVE

### 🧱 CORE ARCHITECTURE (The Spine)
- [x] **Task C1:** ~~Wire Nervous System v2 (`bus.ts`) into `useNexusState.ts`. Must hit the pass/fail gate (Deterministic, Idempotent, Replayable).~~ ✅ DONE — Bridge pattern in `useNexusState.ts`, 23/23 gate tests pass (Deterministic, Idempotent, Replayable, Logged, Narratable). (Owner: `@claude`, PR #8)
- [ ] **Task C2:** Implement the `GeopoliticsMap.tsx` MapLibre shell using the new serverless `pmtiles://` registrar. Tie into the Tribunal data layer. (Owner tags: `@claude` + `@copilot`)

### 🎨 DESIGN & INTERFACE (The Flesh)
- [ ] **Task U1:** Apply the Dark Glassmorphism "Eternal Nexus" visual DNA directly to the Geopolitics Mapbox JSON styles. Hide unnecessary labels, prioritize glowing neon borders. (Owner tags: `@copilot` + `@ui`)

### ⚙️ OPS & AUDIT (The Machine)
- [ ] **Task A2:** Add PMTiles and MapLibre memory profiling to the CI performance gate. (Owner tags: `@codex`)
- [ ] **Task A3:** Create the automated Lab-Branch validation script that prevents PR merges if the lab hypothesis wasn't proven with a verified report. (Owner tags: `@antigravity`)

---
**Instructions for Pioneers:**
When you cross off your task, commit this file. If the backlog is empty, generate more tasks based on the `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md` gates.
