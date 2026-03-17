# Eternal Nexus — PROJECT_STATE (current reality snapshot)

> This file is the **single source of truth** for "where are we right now."
> Updated after every PR merge. Each entry is append-only with a timestamp.

---

## Current Phase: B — Nervous System

### Phase checklist
| Phase | Status | Gate |
|-------|--------|------|
| A — Atlas premium (globo vivo) | ✅ Exists | Globe renders, layers active, Cesium integrated |
| B — Nervous System (Tribunal→Atlas propagation) | 🔧 In progress | 2 clients see same event (id/geo/time) propagating equally |
| C — Index spine (knowledge nodes) | ⏳ Not started | Index consumes events, ranks, persists |
| D — News voice (broadcast) | ⏳ Not started | News subscriber broadcasts verdicts |
| E — Lab + Space hubs | ⏳ Not started | — |
| F — Awards polish | ⏳ Not started | — |

---

## State log (append after each merged PR)

### 2026-03-17 — Bootstrap
- **What:** NEXUS_CONTEXT seeded (README_FIRST, ROLE_CHARTER, PROJECT_KNOWLEDGE, WORKSPACE_KNOWLEDGE, VISUAL_DNA, DECISIONS)
- **State:** Repo has Atlas UI (Cesium globe + layers), Tribunal UI (3 judges), basic pages. No event system. No tests. No CI.
- **Agents active:** Claude (architecture), antigravity (ops)

### 2026-03-17 — Nervous System v1 (PR #8, agent/claude)
- **What:** Event bus spine — `src/lib/events/*` + `src/types/sacred-flow.ts`
- **Delivers:** Canonical NexusEvent schema, deterministic IDs (FNV-1a), idempotent in-memory bus, cursor-based replay, typed organ clients
- **Gate progress:** Bus publishes + subscribers receive + replay works. Atlas rendering integration pending (UI scope).
- **State:** Tribunal can emit → Atlas can subscribe. In-memory only (no persistence yet).

---

## What each agent should know right now

### Claude (architecture)
- Nervous System v1 spine is done. Next: wire Atlas subscriber rendering, then Index/News subscribers.
- Bus interface is stable — transport can be swapped without touching consumers.

### Codex (tests/CI)
- No tests exist yet for `src/lib/events/*`. Priority: bus idempotency, replay cursor, validation.
- No CI pipeline exists. Priority: TypeScript check + test runner in GitHub Actions.

### antigravity (ops)
- Worktree structure defined but not automated. Priority: scaffold script for worktree creation.
- No release pipeline exists yet.

### UI specialist (when active)
- Atlas components exist but don't consume NexusEvents yet. Wire `createNexusClient({ organ: 'atlas' })` into Atlas rendering.
- Visual DNA must be respected: no new styles at bottom of stack.
