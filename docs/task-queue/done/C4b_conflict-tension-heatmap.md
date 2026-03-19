## Task Header

```
id:                  C4b
title:               Conflict tension heatmap layer for GeopoliticsMap
status:              done
priority:            P1
owner-role:          builder
suggested-pioneer:   @claude + @copilot
suggested-platform:  Claude Code
suggested-model:     mid
branch:              c4b-conflict-heatmap
injected-by:         @claude
injected-at:         2026-03-18
linked-handoff:      none
linked-design-debt:  none
```

## Requested Outcome

GeopoliticsMap renders a color-gradient heatmap fill layer driven by `RealtimeDataPoint` with `source: 'geopolitics'` and `conflictLevel` field. Colors transition teal → orange → red based on intensity. Layer is togglable and does not break existing verdict marker layer.

## Scope

- `src/lib/map/dark-style.ts` — add heatmap layer definition
- `src/hooks/useGeopoliticsMap.ts` — consume atlas.marker events with source=geopolitics
- `src/components/geopolitics/GeopoliticsMap.tsx` — wire heatmap layer

## Constraints

- Do not modify `src/types/sacred-flow.ts`
- Do not modify `src/lib/events/*`
- Do not break existing verdict marker rendering
- Color gradient: teal (#06b6d4) → orange (#f97316) → red (#ef4444)

## Acceptance Criteria

- [ ] Heatmap layer renders when geopolitics data is present
- [ ] Color gradient matches: teal → orange → red
- [ ] Layer is independently togglable
- [ ] Existing verdict markers still render correctly
- [ ] `npx vitest run` → all green
- [ ] `npx -p typescript tsc --noEmit` → 0 errors

## Risk

- MapLibre heatmap layer requires specific GeoJSON FeatureCollection format
- `conflictLevel` field may be missing in simulated data — needs fallback

## Fallback Notes

- Fallback pioneer: @copilot (UI rendering)
- Fallback platform: GitHub Copilot
- Fallback model class: mid
