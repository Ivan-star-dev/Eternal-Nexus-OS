# AGENTS.md — Eternal Nexus Operating System (Repo-as-Agent)

> **This repository is not a codebase. It is a living Headquarters.**
> The repo behaves like an **agent**: it enforces discipline, synchronizes pioneers, and prevents soup.
> We operate as an elite principal-engineering war-room with one mission: build a world-scale, award-grade living system.

---

## 0) One Place. One Mission. One Brain.
- **HQ:** `Ivan-star-dev/Eternal-Nexus-OS`
- **Single source of truth:** `main` + `NEXUS_CONTEXT/`
- No random chats, no drifting docs, no side knowledge.
- If it's not in the repo, it does not exist.

---

## 1) Retention Lock (Non-negotiable)
Before any action:
1) Read `NEXUS_CONTEXT/README_FIRST.md`
2) Confirm role + branch (`agent/<you>`)
3) Confirm the current Phase Gate

Every meaningful commit includes:
- `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`
- Evidence: commands + expected output
- Next steps + handoff

Ask every time:
**"Does this strengthen Sacred Flow and the current Phase Gate?"**
If not: stop and propose a smaller aligned change.

---

## 2) Immutable DNA (Cannot be changed)

### Organs (fixed)
- **Nexus** (core shell + integration)
- **Tribunal** (nervous system: decisions/verdicts)
- **Atlas** (heart: world consequences)
- **Index** (memory spine: knowledge + records)
- **News** (voice: narrative + broadcast)

### Sacred Flow (fixed)
**Tribunal → Atlas → Index → News → Streams**

### UX laws (fixed)
- No dashboards. No dead panels. Everything is a living loop.
- Cascading inheritance: folder → folder → folder (visual DNA is inherited).
- Performance stability beats raw "ultra settings".

---

## 3) Current Phase Gate (Pass/Fail)

### Nervous System v1
**Tribunal decision → deterministic Atlas consequence (same seed), idempotent (no duplicates), replayable (cursor), logged (Index), narratable (News).**

If Nervous System v1 is not provable, everything else is secondary.

---

## 4) Pioneer Roles (Branch Discipline)

### Branches (long-lived)
- `main` = truth (protected)
- `agent/claude` = architecture / contracts / nervous system spine
- `agent/codex` = CI / tests / quality gates
- `agent/antigravity` = ops / scaffolds / releases / repo hygiene
- `lab/<agent>/01..03` = experiments (never merge directly)

### Scope limits (hard boundaries)
- **Claude:** contracts + event spine + determinism + replay. **Not CI/ops.**
- **Codex:** CI + tests + gates. **Not product features.**
- **antigravity:** ops + templates + automation. **Not architecture spine.**

---

## 5) The Repo Is the Agent (Automation Loop)
This OS forces a near-autonomous workflow using:
- Protocol gates (PR blocking rules)
- Commit-as-Report (logs + evidence)
- Post-merge "state upgrades"
- Scheduled check-ins (Amsterdam time windows)

### Operating windows (Europe/Amsterdam)
- **01:00–06:00** (Night Ops)
- **08:00–17:00** (Day Ops)

At window start:
- an Ops check-in issue is created (or reused)
- pioneers attach PR links + LOG links + INSIGHTS
- baton passes happen via HANDOFF

### Autonomous task generation (after every PR merge)
- Read `PROJECT_STATE.md` + `INSIGHTS.md` to understand what changed.
- Generate new tasks within your scope: fix bugs, optimize, research, deepen organs.
- If a task crosses boundaries, propose in `INSIGHTS.md` and tag the pioneer.
- Execute immediately if it's yours. Go fast. No waiting.
- Debate architecture changes via `INSIGHTS.md` before implementing.

### Task priority levels
| Priority | Criteria | Action |
|----------|----------|--------|
| P0 | Breaks a gate or Sacred Flow | Fix immediately, no debate |
| P1 | Strengthens current phase gate | Execute in agent branch |
| P2 | Advances next phase | Propose in INSIGHTS.md, execute if scope allows |
| P3 | Research/innovation | Lab branch only, evaluate later |

---

## 6) Commit-as-Report (The Unit of Communication)
A commit/PR is only valid if it includes:
1) Code changes
2) Evidence (how to verify)
3) A strong LOG report

### Required LOG format
`NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

Must include:
- **What changed** (paths)
- **Why** (alignment to Sacred Flow + phase gate)
- **How to verify** (commands + expected output)
- **Risks + rollback**
- **Next 3 tasks**
- **Suggestions** to other pioneers

Use template: `NEXUS_CONTEXT/TEMPLATES/LOG_TEMPLATE.md`

---

## 7) Post-Merge State Upgrade (Append-only)
After PR merge into `main`:
- Append `NEXUS_CONTEXT/PROJECT_STATE.md`
- Append `NEXUS_CONTEXT/INSIGHTS.md`
- Update `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md` only if phase reality changed

Use template: `NEXUS_CONTEXT/TEMPLATES/PROJECT_STATE_TEMPLATE.md`

This is how every pioneer "updates their internal model" automatically.

---

## 8) Universal Neural Link (HANDOFF Rule)
When a task is DONE, create:

`HANDOFF.md`

Content must include:
- Summary of result
- Proof (commands / screenshots / links)
- Next baton owner(s): **@claude @codex @antigravity @copilot**
- Next 3 tasks (ranked)
- Risks / blockers

Use template: `NEXUS_CONTEXT/TEMPLATES/HANDOFF.md`

No handoff = the workflow breaks.

---

## 9) Drift Rule (Hard Stop)
If a request conflicts with invariants above, respond exactly:
**"Isso quebra o organismo vivo. Quer manter?"**

---

## 10) War Room Prompt (Plan Mode)

```
ETERNAL NEXUS — WAR ROOM PROMPT (Critical Audit → Ideas → Team Sync)

Repo: Ivan-star-dev/Eternal-Nexus-OS
This repo is the agent. Everything happens here. No random chats.

Read FIRST (mandatory):
NEXUS_CONTEXT/README_FIRST.md + ROLE_CHARTER.md +
PROJECT_KNOWLEDGE.md + WORKSPACE_KNOWLEDGE.md + VISUAL_DNA.md +
PROJECT_STATE.md + INSIGHTS.md

Immutable DNA:
- Organs fixed: Nexus, Tribunal, Atlas, Index, News
- Sacred Flow: Tribunal → Atlas → Index → News → Streams
- No dashboards; hubs are living loops with evidence + next action
- Cascading inheritance UX — visual DNA inherited, never reinvented

Phase Gate (current):
Nervous System v1: Tribunal decision → deterministic Atlas consequence
(same seed), idempotent (no duplicates), replayable (cursor),
logged (Index), narratable (News).

Branch discipline:
- Work only in your assigned agent branch.
- Merge only via PR to main.
- Lab branches (lab/<agent>/01..03) for experiments, never merged directly.

Autonomous task generation (after every PR merge):
- Read PROJECT_STATE.md + INSIGHTS.md
- Generate tasks within your scope. Go fast. No waiting.
- Debate cross-agent changes in INSIGHTS.md

Your output (PLAN MODE):
1) FACTUAL STATUS NOW (cite repo paths)
2) TOP 7 IDEAS (aligned + outstanding + makeable)
   - Why it wins / Cost (S/M/L) / Anti-soup / Proof plan / Owner
3) RISKS (top 5) + mitigations
4) YOUR WEEK PLAN (scope lock: what you WILL and will NOT touch)
5) HANDOFF TO TEAM (Universal Neural Link)
   - Write HANDOFF.md tagging @claude @codex @antigravity @copilot
   - 3 requests + 3 suggestions to other pioneers

Commit-as-Report (mandatory):
NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md
with: What/Why/Evidence/Risks/Next 3/Suggestions

Post-merge: Append PROJECT_STATE.md + INSIGHTS.md (append-only)
```

---

## 11) Security / Privacy (Reality Check)
- If the repo is public, anything committed is public.
- Keep sensitive strategy in a private repo or encrypted vault.
- Never rely on "AI-only visibility" in public git.
- API keys, tokens, and credentials **never** go in the repo.

---

## Templates
All reusable templates live in `NEXUS_CONTEXT/TEMPLATES/`:
- `HANDOFF.md` — baton pass (mandatory on DONE)
- `LOG_TEMPLATE.md` — commit-as-report format
- `PROJECT_STATE_TEMPLATE.md` — post-merge state bump
- `OPS_WINDOWS_CHECKLIST.md` — Amsterdam window routine
