# 2026-03-18 — copilot — Governance Summary (Read Order · Routing · Reality Parasite · Done)

> **Task:** Read the repository instructions and governance context. Do not write code.
> Summarize the four points below.

---

## 1. What changed
No code was written. This file is the sole deliverable — a session log summarising the governance
context as requested.

## 2. Why (alignment with Sacred Flow + phase gate)
The Copilot role per `ROLE_CHARTER.md` is *review / security / lint — acts at PR level*.
Reading and surfacing governance knowledge is squarely within that charter.
The log follows the *Commit-as-Report* obligation from `WORKSPACE_KNOWLEDGE.md`.

---

## SUMMARY A — Read Order

All platforms/agents must start a session by reading these files **in order**
(source: `NEXUS_CONTEXT/README_FIRST.md` §3 "Neural Link"):

| # | File | Purpose |
|---|---|---|
| 1 | `NEXUS_CONTEXT/README_FIRST.md` | **Entry point.** DNA, branch rules, session protocol |
| 2 | `NEXUS_CONTEXT/ROLE_CHARTER.md` | Pioneer roles, limits, commit-as-report obligation |
| 3 | `NEXUS_CONTEXT/DECISIONS.md` | Append-only decision log — immutable history |
| 4 | `NEXUS_CONTEXT/PROJECT_KNOWLEDGE.md` | Vision, 11 Operating Principles, Sacred Flow, phase gates |
| 5 | `NEXUS_CONTEXT/PROJECT_STATE.md` | Real-time state snapshot (what is and is not done today) |
| 6 | `NEXUS_CONTEXT/WORKSPACE_KNOWLEDGE.md` | Branch/worktree/log/PR structure |
| 7 | `NEXUS_CONTEXT/VISUAL_DNA.md` | Cascading visual inheritance rules |
| — | `NEXUS_CONTEXT/INSIGHTS.md` *(post-merge)* | Cross-agent learnings (read after every PR merge) |
| — | `NEXUS_CONTEXT/STACK_REGISTRY.md` *(post-merge)* | External tech candidates (read when adopting new tech) |

The session protocol (same source, §4) then requires:
1. Confirm your **role** and **branch**.
2. Read `PROJECT_STATE.md` + `INSIGHTS.md` for current state.
3. Propose your top 3 ideas aligned to the current phase gate.

---

## SUMMARY B — Routing Philosophy

Source: `NEXUS_CONTEXT/MODEL_ROUTING.md`

Core rule: *"No trial farming. No deceptive signups. No quota bypass.
Continuity is achieved through routing, caching, and legitimate programs."*

### The 4-tier model

| Tier | Models | When to use | Budget |
|---|---|---|---|
| **1 — Frontier** | Claude Opus/Sonnet, GPT-4o | Architecture decisions, hardest reasoning, event-schema design, final PR reviews, phase-gate validation | Sparingly. Every call must produce a cacheable artifact. |
| **2 — Mid-tier** | Claude Haiku, GPT-4o-mini, Gemini Flash | Implementation inside established patterns, PR descriptions, commit messages, test generation, docs, bounded refactors | Default for most development work. |
| **3 — Local OSS** | Ollama (Llama 3.1, Mistral, CodeLlama, DeepSeek) | Bulk: summarisation, doc drafts, codebase search, boilerplate, log formatting | Unlimited (runs locally). Preferred for non-critical tasks. |
| **4 — Cached Artifacts** | Any prior output in `LOGS/`, `INSIGHTS.md`, `PROJECT_STATE.md`, PR bodies | Anything already computed and stored in the repo | Zero cost. **Always check here first before calling any model.** |

### Per-pioneer defaults

| Pioneer | Default tier | Frontier trigger |
|---|---|---|
| Claude Code (architect) | Tier 1 for contracts / Tier 2 for implementation | Always for schema/event-bus design |
| Codex (tests/CI) | Tier 2 | Only for complex test strategy |
| antigravity (ops) | Tier 2–3 | Only for automation design decisions |
| Copilot (review) | Included in plan | PR review, inline suggestions |
| Cursor (UI) | Tier 2 | Only for complex animation/shader logic |

### Anti-patterns (never do)
- ❌ Fake accounts for free trials
- ❌ VPNs to bypass regional quotas
- ❌ Sharing API keys across projects
- ❌ Scraping model outputs from web UIs
- ❌ Claiming false affiliations for credits

---

## SUMMARY C — Role of the Reality Parasite

> **Finding: The term "Reality Parasite" does not exist anywhere in this repository.**

A comprehensive search across all files (including all `NEXUS_CONTEXT/` documents, `AGENTS.md`,
`AGENT_PROTOCOL.md`, `DORMANT_PROTOCOL.md`, `src/`, `docs/`, and all logs) returned **zero matches**
for "Reality Parasite", "reality parasite", or "RealityParasite".

This concept is **not defined, not referenced, and not used** in the Eternal Nexus OS governance or
codebase as of the current state of the repository. It may be a future concept, a concept from
another project, or it may have been referenced by mistake in the problem statement.

**Recommendation:** If "Reality Parasite" is an intended concept, it must be formally defined and
registered — either in `PROJECT_KNOWLEDGE.md` (as an organ or flow component) or in
`NEXUS_CONTEXT/DECISIONS.md` (as a ratified decision) — before any pioneer builds against it.
Inferring its role without a repo-canonical definition would violate the governance rule:
*"If specification is missing, do NOT infer. Register as limitation."*

---

## SUMMARY D — What Must Happen Before a Task Is Considered Done

Multiple governance documents converge on the same answer.

### At the commit / PR level (Commit-as-Report — `WORKSPACE_KNOWLEDGE.md`, `ROLE_CHARTER.md`)

Every meaningful commit must include:

1. **Code change** (or explicit "no code written" note, as in this task)
2. **Test / evidence** (where possible)
3. **Session log** at `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`

The log must contain all six of:

| # | Field | Description |
|---|---|---|
| 1 | **What changed** | File paths affected |
| 2 | **Why** | Alignment with Sacred Flow + phase gate |
| 3 | **How to verify** | Commands + expected output |
| 4 | **Risks + rollback** | What could go wrong and how to revert |
| 5 | **Next 3 tasks** | Forward-planning the pipeline |
| 6 | **Suggestions to other pioneers** | Cross-agent requests and learnings |

### At the phase gate level (`PROJECT_KNOWLEDGE.md`)

The current gate (Nervous System v1) passes only when ALL five properties hold:

| Property | Gate condition |
|---|---|
| **Deterministic** | Same Tribunal verdict + same seed → identical Atlas visual output |
| **Idempotent** | Same event ID published twice → stored/processed only once |
| **Replayable** | Disconnected client reconnects and replays missed events from cursor |
| **Logged** | Every event through the bus is persisted in Index |
| **Narratable** | News can construct a human-readable narrative from Index entries |

### At the pipeline / handoff level (`AGENTS.md`, `PROJECT_KNOWLEDGE.md` §11)

After finishing a task, the pioneer **must**:

1. Write `NEXUS_CONTEXT/HANDOFF.md` tagging the next pioneers (`@claude`, `@antigravity`, `@copilot`, `@codex`).
2. Strike out the completed task in `NEXUS_CONTEXT/PIPELINE.md`.
3. If the pipeline drops below 3 open tasks, **generate new tasks** (do not wait for user instructions).
4. Post-merge: append a state bump to `PROJECT_STATE.md` (append-only).
5. Post-merge: append learnings to `INSIGHTS.md` (append-only).
6. Post-merge: update `PROJECT_KNOWLEDGE.md` only if the phase reality actually changed.

### Phase 3 specific (`docs/DOC_FASE3.md` §10)

> *"A Fase 3 é considerada concluída quando F3-REQ-001..004 estiverem implementados e verificáveis
> por inspeção de arquivos e execução de CI."*

That is:
- `docs/DOC_FASE3.md` exists with all required sections ✅
- `AGENTS.md` + `.github/copilot-instructions.md` enforce anti-drift rules ✅
- App CI workflow in `.github/workflows/app-quality.yml` runs install/lint/typecheck/test/build ✅
- `README.md` has no placeholders and references the governance documents ✅

---

## 3. How to verify
This log is pure documentation. Verification = read the file. No commands to run.

## 4. Risks + rollback
No code was changed. Zero risk. Rollback = delete this file.

## 5. Next 3 tasks
1. Proceed with **Task C1** (Wire `bus.ts` into `useNexusState.ts`) — owner `@claude`
2. Proceed with **Task C2** (MapLibre shell + pmtiles + Tribunal data layer) — owner `@claude` + `@copilot`
3. Proceed with **Task U1** (Dark Glassmorphism visual DNA to Geopolitics map styles) — owner `@copilot`

## 6. Suggestions to other pioneers
- **@claude**: "Reality Parasite" is absent from the repo. If it is a planned concept, define it in
  `PROJECT_KNOWLEDGE.md` (or `DECISIONS.md`) before any pioneer builds it.
- **@codex**: Consider adding a CI lint rule that rejects commits missing a
  `NEXUS_CONTEXT/LOGS/` entry (extends the existing `protocol-gates.yml`).
- **@antigravity**: `DORMANT_PROTOCOL.md` still references a past hibernation window. Consider
  archiving it or moving it into `NEXUS_CONTEXT/LOGS/` to keep the root clean.
