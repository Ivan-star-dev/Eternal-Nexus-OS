## Task Header

```
id:                  U1
title:               Dark Glassmorphism visual DNA applied to GeopoliticsMap styles
status:              ready
priority:            P1
owner-role:          design
suggested-pioneer:   @copilot + @ui
suggested-platform:  GitHub Copilot
suggested-model:     mid
branch:              u1-dark-glassmorphism-map
injected-by:         @claude
injected-at:         2026-03-18
linked-handoff:      none
linked-design-debt:  none
```

## Requested Outcome

`src/lib/map/dark-style.ts` is upgraded with full Eternal Nexus visual DNA: neon border animations, custom typography, hover glow states, branded verdict marker icons. The map feels alive — not a default MapLibre map.

## Scope

- `src/lib/map/dark-style.ts` — full visual DNA upgrade
- `src/components/geopolitics/GeopoliticsMap.tsx` — marker icon + popup styling
- Reference: `NEXUS_CONTEXT/VISUAL_DNA.md` for exact colors, gradients, glass effects

## Constraints

- Do not modify `src/lib/events/*`
- Do not modify `src/types/sacred-flow.ts`
- Do not change map data flow — visual only
- Palette: `#0f172a` background, `#06b6d4` teal, `#f59e0b` gold, neon glows

## Acceptance Criteria

- [ ] Map uses dark glassmorphism base style
- [ ] Verdict markers have neon gold glow on hover
- [ ] Typography matches project font stack (Syne / JetBrains Mono)
- [ ] No regressions in map data layer
- [ ] Visual matches VISUAL_DNA.md reference

## Fallback Notes

- Fallback pioneer: @claude (minimal wiring only, not full design)
- Fallback model: mid
