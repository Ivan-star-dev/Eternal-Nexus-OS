# LOG — 2026-03-18 · @copilot · tasks-U1-U2-C4

## What changed

### Task U1 — Dark Glassmorphism Visual DNA
- `src/lib/map/dark-style.ts` — Full visual treatment applied:
  - Triple-layer neon border glow (outer diffuse + inner focused + crisp golden line)
  - Teal pulsing capital city dot markers
  - Country labels enabled (gold, uppercase, monospace tracking)
  - Capital city labels (teal accent at zoom 4+)
  - Water depth multi-layer (deep ocean base + water fill)
  - Coastline with teal glow + crisp edge
  - Sub-national dashed borders (dimmer gold, zoom 4+)
  - Major road grid visible at zoom 8+ (barely visible, intelligence mode)
  - Expanded COLORS palette (`textMuted`, `waterDeep`, `landBorderDim`, `tealDim`, `glass`, `roadMajor`, `textHaloGlow`, `primaryDim`)
- `src/components/geopolitics/GeopoliticsMap.tsx` — Glassmorphism popup and controls:
  - `injectMapCSS()` function injects MapLibre control overrides once per session
  - Navigation controls styled: dark glass bg, gold border, tinted icons
  - Attribution: dark glass bg with gold link color
  - Scale bar: dark glass with gold border
  - Verdict popup: full glassmorphism (backdrop-blur, dark bg, gold neon border, no `border-radius`)
  - Verdict markers: aura + glow + core (3-layer neon effect) + mono uppercase labels
  - `nexus-border-pulse` CSS animation on map container

### Task U2 — MapLibre Layer Toggle Panel
- `src/components/geopolitics/LayerTogglePanel.tsx` — New component:
  - Follows `EnvironmentPanel.tsx` pattern (self-contained, no external deps beyond lucide-react)
  - 4 toggleable layers: conflict heatmap, migration routes, energy grid, verdict markers
  - Dark glassmorphism styling (backdrop-blur-xl, gold border, box-shadow neon)
  - Each toggle shows icon + label + sublabel + active dot indicator
  - Color-coded active states (red for conflict, teal for migration, yellow for energy, gold for verdicts)
  - Active count footer ("2/4 ACTIVE")
  - Exported `LayerVisibility` interface for external use
- `src/components/geopolitics/index.ts` — Added exports for `LayerTogglePanel` + `LayerVisibility`
- `src/components/geopolitics/GeopoliticsMap.tsx`:
  - `useState<LayerVisibility>` manages panel state
  - `setLayersVisible()` helper toggles MapLibre layer visibility
  - Panel rendered as top-left absolute overlay on map
  - Layer init on `map.on('load')` adds migration + energy grid sources/layers
  - `addMigrationLayer()` + `addEnergyGridLayer()` scaffolded (data feeding pending @claude C3)

### Task C4 — Conflict Tension Heatmap Layer
- `src/hooks/useGeopoliticsMap.ts`:
  - Added `ConflictFeature` + `ConflictGeoJSON` interfaces (exported)
  - Added `conflictGeoJSON` state (initialized empty)
  - Added `updateConflictData(points: RealtimeDataPoint[])` method on return — filters `source === 'geopolitics'` + `conflictLevel !== undefined`, maps to GeoJSON
  - Imported `RealtimeDataPoint` from `@/types`
- `src/components/geopolitics/GeopoliticsMap.tsx`:
  - `addConflictHeatmapLayer()` — MapLibre heatmap layer:
    - `heatmap-weight` driven by `conflictLevel`
    - `heatmap-color` gradient: teal (0.2) → orange (0.5) → red (0.8–1.0) matching COLORS conflict palette
    - `heatmap-intensity` increases with zoom
    - `heatmap-radius` scales with zoom
    - Separate `conflict-points` circle layer visible at zoom 6+ for individual hotspot dots
  - Seeded with `conflictGeoJSON` on load
  - `useEffect` updates heatmap when `conflictGeoJSON` changes
  - Inserted below verdict layers (correct z-order)

## Why (alignment)

These tasks directly strengthen the **Atlas organ** of the Sacred Flow:
- U1: Visual DNA compliance (VISUAL_DNA.md) — dark glassmorphism is the backbone of the UI contract
- U2: User interaction layer for Atlas — toggles let operators focus on relevant signals
- C4: Conflict heatmap is the primary signal of the Geopolitics Atlas view

All changes are **additive** — no existing contracts (event bus types, sacred-flow.ts) were modified.

## How to verify

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to /geopolitics
# 3. Verify:
#    - Map renders with dark glassmorphism style (dark bg, gold borders)
#    - Country labels are visible in gold monospace
#    - Navigation controls styled (dark glass, not white)
#    - LayerTogglePanel visible top-left (Layers icon + 4 toggles)
#    - Toggle "CONFLICT HEAT" — heatmap appears/disappears
#    - Toggle "VERDICTS" — verdict markers appear/disappear

# Typecheck (passes with no new errors):
npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -E "GeopoliticsMap|LayerToggle|dark-style|useGeopolitics"
# Expected: no output (no errors in changed files)
```

## Risks + rollback

- **Risks:** CSS injection (`injectMapCSS`) uses `document.head.appendChild` — SSR-incompatible, but this component is already client-only (MapLibre requires browser). No risk.
- **Rollback:** `git revert` this commit. All changes isolated to 4 files + 1 new file.

## Next 3 tasks (ranked)

1. **@claude Task C3** — Wire Atlas sensor data through event bus so `updateConflictData()` receives live `RealtimeDataPoint[]` from the geopolitics source. Currently the heatmap is seeded empty.
2. **@claude Task C5** — Event bus persistence (localStorage/IndexedDB) so verdict markers survive page refresh.
3. **@copilot / @ui** — Animate migration route arcs on the map using a WebGL arc layer (d3-geo or deck.gl-lite). Layer infrastructure is ready in `addMigrationLayer()`.

## Suggestions to other pioneers

- **@claude**: `useGeopoliticsMap.updateConflictData()` is ready — call it from `useRealtimeData` whenever geopolitics data refreshes (filter `source === 'geopolitics'`).
- **@codex**: Consider adding a Playwright visual regression test for the GeopoliticsMap to catch style regressions.
- **@antigravity**: The `LayerTogglePanel` state (`layerVisibility`) could be persisted to localStorage for user preference retention — low-effort UX win.
