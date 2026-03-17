# ETERNAL NEXUS — PIONEER HANDOFF: CLAUDE

> **Context:** You (Claude) were working on integrating **Nervous System v2** but the session was interrupted. The ops agent (antigravity) has audited the repo and deployed the formal **Collaboration OS**. Project rules have strictly changed. Read this document before doing anything else.

---

## 1. What was implemented while you were away?
The project now runs on a strict Big-Tech governance model (NVIDIA/Apple style). The following core rules have been pushed to `main`:

**A. The 10 Operating Principles** (See `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md`)
- Contract-first design.
- Proof-over-vibes (Phase Gates are pass/fail).
- Repo-enforced collaboration (`.github/pull_request_template.md`).
- "Commit-as-Report" protocol.

**B. The ETERNAL NEXUS WAR ROOM PROMPT** (See `AGENTS.md`)
- A strict master instruction. Every time you start a task, you must output a PLAN MODE response: Factual status → Top ideas → Risks → Week plan → Handoff.

**C. Environmental Audit (A1)**
- `npm ci` passes successfully.
- `npm run lint` and `npm run typecheck` are failing mainly due to missing `@react-three/fiber` JSX types and ESLint scanning worktree directories.

---

## 2. Your Exact Entrypoint (Task C1)

You have two disconnected Nervous Systems that need unification:

1. **Current Spine (Main):** `src/hooks/useNexusState.ts` uses TanStack query. Manages Tribunal verdicts but lacks strict event sourcing properties.
2. **New Engine (Your recent work):** `src/lib/events/bus.ts` and `src/types/sacred-flow.ts`. A robust typed event bus supporting idempotency, replay, and deterministic IDs.

**Your Goal:** Complete task **C1: Wire Nervous System v2**. You must replace or wire `useNexusState.ts` so that it seamlessly uses `bus.ts` under the hood without breaking the existing Sacred Flow.

---

## 3. The Non-Negotiable Phase Gate (Pass/Fail)

You cannot consider this task "done" until you prove you hit this exact gate:

> **Nervous System v1 Gate:** Tribunal decision → deterministic Atlas consequence (same seed), idempotent (no duplicates), replayable (cursor), logged (Index), narratable (News).

You must provide a test (e.g., `src/test/nexus-flow.test.tsx` or a new test file) or exact commands verifying:
1. **Deterministic:** Same seed → same output.
2. **Idempotent:** Emitting same event ID twice → stored/processed only once.
3. **Replayable:** Client reconnects → replays missed events from a cursor.

---

## 4. Next Steps for Claude

To begin, do **NOT** modify code immediately. First, read `AGENTS.md` and `PROJECT_KNOWLEDGE.md` to understand your DNA constraints. Then, reply with the **WAR ROOM PROMPT** format exactly as specified in `AGENTS.md`:

1. **FACTUAL STATUS NOW:** Summarize your understanding of `useNexusState.ts` vs `bus.ts`.
2. **TOP IDEAS:** How will you safely bind them together?
3. **RISKS:** What could break (e.g., `GeopoliticsNarrative.tsx` which relies on the hook)?
4. **WEEK PLAN:** What files will you edit? (Bonus: you are required to fix the missing `@react-three/fiber` types in `tsconfig.app.json` or `global.d.ts` as a quick P0 fix).
5. **HANDOFF TO TEAM:** Provide suggestions for antigravity or codex.

Start your response now using the exact War Room format.
