# AGENTS.md — Eternal Nexus Operating System

## Retention Lock
> Read NEXUS_CONTEXT first. Work only in your branch. PR to main only.
> Every commit includes LOG + evidence.
> Ask: **"Does this strengthen Sacred Flow and the current phase gate?"**
> If not, stop and propose a smaller aligned alternative.

---

## Source of Truth
- Use only versioned content from this repository.
- Mandatory references: `NEXUS_CONTEXT/README_FIRST.md`, `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md`, `docs/DOC_FASE3.md`.
- If specification is missing, do NOT infer. Register as limitation.

## Immutable DNA (non-negotiable)
- Never simplify the project.
- Never rename organs, agents, flows, or core structures.
- Never alter the Sacred Flow: **Tribunal → Atlas → Index → News**.
- Never introduce scope beyond what is requested.
- Never merge lab branches directly to main.

## Current Phase Gate (pass/fail)
**Nervous System v1:** Tribunal decision → deterministic Atlas consequence (same seed), idempotent (no duplicates), replayable (cursor), logged (Index), narratable (News).

## The 10 Operating Principles
1. One narrative document governs everything — Nervous System v1 is the spine
2. Contract-first systems — interfaces + invariants, not features
3. Proof over vibes — phase gates are pass/fail, no arguing
4. Repo-enforced collaboration — the machine enforces, not memory
5. Commit-as-Report — the unit of communication is PR + tests + log + evidence
6. Design considered always, executed last — structure first
7. Performance budgets are non-negotiable — target FPS per tier
8. Lab branches for innovation — isolated, never merged directly
9. State upgrades after merge — PROJECT_STATE.md + INSIGHTS.md (append-only)
10. Sustainable model supply — see `NEXUS_CONTEXT/MODEL_ROUTING.md`

## Execution Rules
1. Read `NEXUS_CONTEXT/README_FIRST.md` + `ROLE_CHARTER.md` + `PROJECT_KNOWLEDGE.md` first.
2. Confirm your role and branch.
3. Change only files necessary for the current requirement.
4. Validate with real scripts from `package.json`.
5. Deliver objective evidence (files changed + commands executed).
6. Every meaningful commit includes: `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`.

## Drift Rule
If a request conflicts with the invariants above, respond exactly:
**"Isso quebra o organismo vivo. Quer manter?"**

---

## War Room Prompt (for all pioneers)

```
ETERNAL NEXUS — WAR ROOM PROMPT (Critical Audit → Ideas → Team Sync)

Repo: Ivan-star-dev/Eternal-Nexus-OS
Everything happens in this one project brain. No random chats.
Read FIRST (mandatory): NEXUS_CONTEXT/README_FIRST.md + ROLE_CHARTER.md +
PROJECT_KNOWLEDGE.md + WORKSPACE_KNOWLEDGE.md + VISUAL_DNA.md.

Immutable DNA:
- Organs fixed: Nexus, Tribunal, Atlas, Index, News
- Sacred Flow: Tribunal → Atlas → Index → News → Streams
- No dashboards; hubs are living loops with evidence + next action
- Cascading inheritance UX (folder→folder) — visual DNA inherited, never reinvented
- Elite rule: pioneer + backup per task

Phase Gate (current):
Nervous System v1 must exist:
Tribunal decision → deterministic Atlas consequence (same seed), idempotent
(no duplicates), replayable (cursor), logged (Index), narratable (News).

Branch discipline:
- Work only in your assigned agent branch.
- Merge only via PR to main.
- You may use lab/<agent>/01..03 for experiments (never merged directly).
- Any lab success must be re-implemented cleanly in agent branch with tests/evidence.

Your output (PLAN MODE, do not implement unless requested):
1) FACTUAL STATUS NOW (cite repo paths)
   - What is implemented?
   - What is missing or fragile?
2) TOP 7 IDEAS (aligned + outstanding + makeable)
   For each idea:
   - Why it wins (user impact + award polish + uniqueness)
   - Cost (S/M/L)
   - What it replaces/cuts (anti-soup)
   - Proof plan (how we verify)
   - Which agent owns it
3) RISKS (top 5) + mitigations
4) YOUR WEEK PLAN (in your branch only)
   - what you will implement to hit the gate
   - what you will NOT touch (scope lock)
5) HANDOFF TO TEAM
   - 3 requests to other pioneers
   - 3 suggestions to other pioneers

Commit-as-Report (mandatory when implementing):
Every meaningful commit must include a log:
NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md
with: What changed (paths), Why (alignment), Evidence (commands + output),
Risks + rollback, Next 3 tasks, Suggestions to other pioneers.

Post-merge state upgrade:
- Append PROJECT_STATE.md (append-only)
- Append INSIGHTS.md (append-only)

Continuity (ethical + sustainable):
- See NEXUS_CONTEXT/MODEL_ROUTING.md for model routing policy.
- Do NOT bypass quotas via deceptive signups or trial harvesting.
- Cache everything. Check repo before asking a model.
```
