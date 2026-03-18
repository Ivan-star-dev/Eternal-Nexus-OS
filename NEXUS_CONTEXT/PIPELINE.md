# ETERNAL NEXUS — THE PIONEER PIPELINE (Task Accumulator)

> **Rule:** Let tasks accumulate. If the pipeline runs low (under 3 tasks), the pioneer finishing their job MUST break down the current phase gate and generate new tasks. We do not wait for the user to assign work. **This is an autonomous loop of self-planning and execution.**

## Status: ACTIVE

### 🧱 CORE ARCHITECTURE (The Spine)
- [x] **Task C1:** ~~Wire Nervous System v2 (`bus.ts`) into `useNexusState.ts`. Must hit the pass/fail gate (Deterministic, Idempotent, Replayable).~~ ✅ DONE — Bridge pattern in `useNexusState.ts`, 23/23 gate tests pass (Deterministic, Idempotent, Replayable, Logged, Narratable). (Owner: `@claude`, PR #8)
- [x] **Task C2:** ~~Implement the `GeopoliticsMap.tsx` MapLibre shell using the new serverless `pmtiles://` registrar. Tie into the Tribunal data layer.~~ ✅ DONE — MapLibre GL v5 + PMTiles v4, dark style, useGeopoliticsMap hook bridges event bus → GeoJSON, verdict markers with glow/popup, lazy-loaded into Geopolitics page. 25/25 tests pass. (Owner: `@claude`, PR #8)
- [x] **Task C3:** ~~Wire Atlas sensor data (climate, earthquake, pollution) through event bus.~~ ✅ DONE — `useRealtimeData` publishes `atlas.marker` events, `useNexusState.addAtlasData()` bridge. Gate 5b: 5 new tests. (Owner: `@claude`, PR #8)
- [x] **Task C4:** ~~Nervous System observability layer — bounded event ledger + dev inspector + deterministic replay.~~ ✅ DONE — `ledger.ts` ring buffer, `useEventLedger` hook, `EventInspector` dev overlay, 24 gate tests. Also fixed Tailwind v4 + tsconfig issues. (Owner: `@claude`, PR #26)
- [ ] **Task C4b:** Add geopolitics conflict tension heatmap layer to GeopoliticsMap — consume `RealtimeDataPoint` with `source: 'geopolitics'` and `conflictLevel` field, render as color-gradient fill layer (teal→orange→red). (Owner: `@claude` + `@copilot`)
- [ ] **Task C5:** Implement event bus persistence layer — localStorage or IndexedDB adapter so replay survives page refresh. Currently in-memory only. Must maintain deterministic ID + idempotency guarantees. (Owner: `@claude`)

### 🎨 DESIGN & INTERFACE (The Flesh)
- [ ] **Task U1:** Apply the Dark Glassmorphism "Eternal Nexus" visual DNA directly to the Geopolitics MapLibre styles. Base style is in `src/lib/map/dark-style.ts`. Add: neon border animations, label typography, hover states, custom verdict markers. (Owner tags: `@copilot` + `@ui`)
- [ ] **Task U2:** Build a MapLibre layer toggle panel for GeopoliticsMap — let users enable/disable conflict tension, migration routes, energy grid overlays. Follow EnvironmentPanel.tsx pattern from Atlas. (Owner: `@copilot`)

### ⚙️ OPS & AUDIT (The Machine)
- [ ] **Task A2:** Add PMTiles and MapLibre memory profiling to the CI performance gate. (Owner tags: `@codex`)
- [x] ~~**Task A3:** Create the automated Lab-Branch validation script that prevents PR merges if the lab hypothesis wasn't proven with a verified report. (Owner tags: `@antigravity`)~~ ✅ DONE — `@antigravity` shipped it on main.
- [ ] **Task A4:** Set up self-hosted PMTiles on Cloudflare R2 or Supabase Storage for offline-capable map tile serving. Evaluate Protomaps free planet tiles (~70GB). (Owner: `@antigravity`)

---
**Instructions for Pioneers:**
When you cross off your task, commit this file. If the backlog is empty, generate more tasks based on the `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md` gates.
