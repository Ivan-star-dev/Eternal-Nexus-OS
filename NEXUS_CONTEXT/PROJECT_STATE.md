# Eternal Nexus — PROJECT_STATE (current state snapshot)

> This file is the **single source of truth** for where the project stands right now.
> Updated after every PR merge to `main`. Each entry is append-only.

---

## Current phase: Phase 3 — Internal Flow (Plumbing)

### State as of 2026-03-17

**Sacred Flow status:**
| Organ | Status | Evidence |
|---|---|---|
| Tribunal (Neural) | ✅ Session-level decisions persist | `src/pages/GeopoliticsNarrative.tsx`, `src/components/tribunal/` |
| Atlas (Perception) | ✅ Live sensor data (Open-Meteo) | `src/pages/AtlasPage.tsx`, `src/lib/atlas/` |
| Index (Memory) | ✅ Aggregates verdicts + sensor data | `src/pages/Index.tsx`, `src/hooks/useIndexOrgan.ts` |
| News (Broadcast) | ✅ Consumes Index output | `src/pages/NewsPortal.tsx` |
| Nervous System (event bus) | ✅ v1 spine implemented | `src/lib/events/*`, `src/types/sacred-flow.ts` |

**Propagation path verified:**
Tribunal → Shared Session State → Index → News

**Mechanism:** TanStack Query as shared "nervous system" (`src/hooks/useNexusState.ts`)

**Verification tools:**
- `src/components/shared/NexusFlowInspector.tsx` — dev-only flow visibility
- `src/test/nexus-flow.test.ts` — propagation path validation

**Audit-safe boundaries (what is NOT done):**
- ❌ Backend persistence (no DB/Cloud — session-only state)
- ❌ API authenticity (simulation fallbacks for some feeds)
- ❌ AI deliberation redesign (swarm logic unchanged from Phase 2)

**Governance artifacts:**
- `docs/DOC_FASE3.md` — Phase 3 source of truth (F3-REQ-001..004)
- `AGENTS.md` — anti-drift rules
- `.github/copilot-instructions.md` — Copilot guardrails
- `.github/workflows/app-quality.yml` — CI quality gate
- `.github/workflows/ci.yml` — CI + sacred flow gate
- `scripts/gates/sacred-flow-gate.cjs` — programmatic flow validation

---

## State bump log

### 2026-03-17 — Bootstrap
- Phase 3 plumbing merged (PR #3: gravity-branch)
- NEXUS_CONTEXT brain seeded
- Nervous System v1 implemented (PR #8: claude/magical-goodall)
- CI + Sacred Flow Gate added (PR #7: agent/codex)
- Collaboration OS ("Commit-as-Report") protocol established
