## Task Header

```
id:                  A4
title:               Self-hosted PMTiles on Cloudflare R2 or Supabase Storage
status:              ready
priority:            P2
owner-role:          research
suggested-pioneer:   @antigravity
suggested-platform:  Claude Code / terminal
suggested-model:     mid
branch:              a4-self-hosted-pmtiles
injected-by:         @claude
injected-at:         2026-03-18
linked-handoff:      none
linked-design-debt:  none
```

## Requested Outcome

Research and document the best route for self-hosted PMTiles serving. Evaluate Cloudflare R2 vs Supabase Storage. Evaluate Protomaps free planet tiles (~70GB). Produce a decision doc and (if feasible) a working prototype configuration.

## Scope

- `NEXUS_CONTEXT/STACK_REGISTRY.md` — register final choice
- `docs/architecture/pmtiles-hosting.md` — decision doc (new)
- Lab branch: `lab/antigravity/01` for prototype

## Constraints

- This is research + decision, not production deployment
- Do not change product source code
- Do not commit credentials or API keys

## Acceptance Criteria

- [ ] Decision doc written with comparison (R2 vs Supabase vs other)
- [ ] Cost estimate included
- [ ] Prototype config documented (even if not deployed)
- [ ] STACK_REGISTRY.md updated with chosen tech
- [ ] No product code changes

## Fallback Notes

- Fallback pioneer: @claude (can research if @antigravity unavailable, but cannot deploy)
- This is P2 — not blocking anything current
