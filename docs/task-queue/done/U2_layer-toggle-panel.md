## Task Header

```
id:                  U2
title:               MapLibre layer toggle panel for GeopoliticsMap
status:              done
priority:            P2
owner-role:          builder
suggested-pioneer:   @copilot
suggested-platform:  GitHub Copilot
suggested-model:     mid
branch:              u2-layer-toggle-panel
injected-by:         @claude
injected-at:         2026-03-18
linked-handoff:      none
linked-design-debt:  none
```

## Requested Outcome

A panel component lets users enable/disable map layers: conflict tension heatmap, migration routes, energy grid, verdict markers. Follow the `EnvironmentPanel.tsx` pattern from AtlasPage exactly.

## Scope

- `src/components/geopolitics/LayerTogglePanel.tsx` — new component
- `src/components/geopolitics/GeopoliticsMap.tsx` — integrate panel
- Pattern reference: `src/components/atlas/EnvironmentPanel.tsx`

## Constraints

- Do not modify `src/lib/events/*`
- Follow existing EnvironmentPanel pattern exactly — no new UI patterns
- Panel must be visually consistent with Dark Glassmorphism DNA

## Acceptance Criteria

- [ ] Panel toggles conflict heatmap layer on/off
- [ ] Panel toggles verdict markers on/off
- [ ] Panel uses glassmorphism style
- [ ] No regressions in map rendering
- [ ] Follows EnvironmentPanel.tsx pattern

## Fallback Notes

- Fallback pioneer: @claude (minimal toggle wiring)
- C4b (heatmap) should be done before U2 (requires the layer to exist)
