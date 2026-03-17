# Eternal Nexus — INSIGHTS (append-only, cross-agent learnings)

> This file is a **living handoff surface** between all pioneers.
> After every PR merge, the responsible agent appends learnings + requests.
> Never edit existing entries. Only append.

---

## Format

```
### YYYY-MM-DD — <agent> — <topic>
**Learnings:**
1. ...
2. ...

**Requests to other pioneers:**
- @<agent>: <specific ask>

**Open questions:**
- ...
```

---

## Entries

### 2026-03-17 — antigravity — Collaboration OS bootstrap
**Learnings:**
1. The seed script (`seed-nexus-context.ps1`) had encoding issues — PowerShell `@"` heredocs with `Out-File` produced corrupted UTF-8 in `ROLE_CHARTER.md`, `VISUAL_DNA.md`, and `WORKSPACE_KNOWLEDGE.md`. All files have been rebuilt manually with correct encoding.
2. The `agent/antigravity` branch was fully merged into `main` already (via PR #3), so commits on it are just fast-forward of main. The branch carries the "ops" role correctly.
3. `NEXUS_CONTEXT/LOGS/` was in `.gitignore` (caught by the `logs` pattern). Logs need `-f` flag or a `.gitignore` adjustment to track them.

**Requests to other pioneers:**
- @codex: The `.gitignore` has a blanket `logs` rule that blocks `NEXUS_CONTEXT/LOGS/`. Consider adding `!NEXUS_CONTEXT/LOGS/` exception so session logs are always tracked.
- @claude: Nervous System v1 (`src/lib/events/*`) is merged but not yet wired into the existing TanStack-based nervous system (`useNexusState.ts`). Clarify if these are complementary or one replaces the other.

**Open questions:**
- Should lab branches be created preemptively, or only when a pioneer has an experiment to run?

### 2026-03-17 — antigravity — Soul infusion (10 Principles + War Room + Model Routing)
**Learnings:**
1. Elite engineering orgs (Tesla/NVIDIA/Apple) scale on: contract-first systems, proof-over-vibes gates, and repo-enforced collaboration. We codified these as the 10 Operating Principles.
2. The War Room Prompt is the universal instruction that forces PLAN MODE output: factual status → top ideas → risks → week plan → handoff. Every pioneer reads it before acting.
3. Model routing prevents burnout and trial farming. Tier 1 (frontier) for architecture, Tier 2 (mid) for implementation, Tier 3 (local OSS) for bulk, Tier 4 (cached artifacts) for zero-cost.
4. PR template at `.github/pull_request_template.md` is the enforcement layer: every PR must declare gate alignment, include a session log, and suggest next actions for other pioneers.

**Requests to other pioneers:**
- @claude: Read `PROJECT_KNOWLEDGE.md` — the 10 principles and Nervous System v1 gate are now your contract. Your first PR should prove deterministic + idempotent + replayable.
- @codex: Read `AGENTS.md` — the War Room Prompt is now the standard. Your CI should validate that PR descriptions follow the template (optional future gate).
- @all: Read `MODEL_ROUTING.md` — use the correct model tier for your task. Don't burn frontier tokens on bulk work.

**Open questions:**
- Should we add a CI step that validates PR descriptions against the template?
- Do we need a `NEXUS_CONTEXT/RFCS/` directory for longer-form proposals before implementation?
