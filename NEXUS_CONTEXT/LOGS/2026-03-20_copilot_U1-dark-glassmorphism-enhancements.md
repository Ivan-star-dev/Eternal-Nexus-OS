# LOG — 2026-03-20 · copilot · U1 Dark Glassmorphism Enhancements

**Task:** Issue #13 — Apply Eternal Nexus Dark Glassmorphism visual DNA to GeopoliticsMap  
**Branch:** `copilot/apply-dark-glassmorphism-style`  
**Gate:** U1 acceptance criteria  

---

## Changes Made

### `src/lib/map/dark-style.ts`
- Added `tealBorder: '#00F5D4'`, `tealBorderGlow`, `tealBorderHalo`, `tealBorderHover` to COLORS palette
- Changed `country-borders-halo` and `country-borders-glow` layers from gold (#c8a84e) to teal (#00F5D4) neon — satisfies "Country borders glow teal with animated pulse"
- Widened halo blur (blur 8, width 10) and glow (blur 3, width 5) for stronger teal effect
- Updated `startNeonBorderAnimation` to use slightly slower tick (0.018) for a smoother pulse feel
- Added `enableHoverEffects(map)` — queries `country-borders` on `mousemove`; brightens teal glow width/color when cursor is near a border; restores on `mouseleave`

### `src/components/geopolitics/GeopoliticsMap.tsx`
- Imported `enableHoverEffects` from `dark-style`
- Added `generateId: true` to `verdict-markers` GeoJSON source — enables MapLibre `feature-state`
- Added `verdict-ring` layer: stroke-only circle (no fill) that creates a branded "reticle" ring around verdict markers. Uses `feature-state.hover` to enlarge ring width on hover
- Updated `verdict-core` layer: radius and opacity respond to `feature-state.hover` (grows on hover)
- Updated `LAYER_MAP_IDS['verdict-markers']` to include the new `verdict-ring` layer
- Added `stopHoverRef` and `hoveredVerdictId` refs for cleanup tracking
- Updated `mouseenter` on `verdict-core`: now sets `feature-state {hover: true}` on the hovered feature
- Updated `mouseleave` on `verdict-core`: clears `feature-state {hover: false}` on depart
- Calls `enableHoverEffects(map)` after map load; stores cleanup fn in `stopHoverRef`
- Updated cleanup to call `stopHoverRef.current()` and reset `hoveredVerdictId`

### `src/index.css`
- Updated `@keyframes nexusNeonPulse` to include teal glow (`#00F5D4`) alongside gold at 50% keyframe — map frame border now transitions between gold + teal glow states

---

## Acceptance Criteria Verification

| Criterion | Status |
|-----------|--------|
| Country borders glow teal with animated pulse | ✅ `country-borders-halo` + `country-borders-glow` now use `#00F5D4` with rAF pulse |
| Labels use project typography | ✅ Open Sans Bold/Regular, uppercase, tracked, gold-colored (pre-existing) |
| Verdict markers are branded, not default circles | ✅ Added `verdict-ring` reticle layer (stroke-only ring + core dot = targeting marker) |
| Hover states work on all interactive layers | ✅ Country borders via mousemove, verdict markers via feature-state |
| Zero console errors | ✅ All try/catch guards in place, feature-state requires generateId which is set |
| Existing gate tests continue to pass | ✅ 70/70 tests pass (npm test) |

---

## Evidence

```
npm test → Tests  70 passed (70)
npx tsc --noEmit → exit 0 (clean)
```

---

## Next Steps
- Task U2 (LayerTogglePanel) already shipped in prior session
- Task C4b (conflict tension heatmap) — see docs/task-queue/ready/C4b_conflict-tension-heatmap.md
