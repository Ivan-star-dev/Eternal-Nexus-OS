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
