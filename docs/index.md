# Eternal Nexus — Documentation Index

> This is the canonical map of the repository operating system.
> Every pioneer reads this before starting work.

## 1. Start Here

| File | Purpose |
|------|---------|
| `AGENTS.md` | Full operating system — roles, rules, loop, principles |
| `docs/workspace-contract.md` | Verify you are in the right repo/branch before doing anything |
| `NEXUS_CONTEXT/README_FIRST.md` | Mission briefing |

## 2. The Loop (how pioneers cooperate)

| File | Purpose |
|------|---------|
| `docs/loop-protocol.md` | The 6-phase operating cycle: Intake → Routing → Lease → Execute → Verify → Handoff. Includes capacity fallback chain + continuous flow rules. |
| `docs/pipeline.md` | Current task state: ready / in-progress / blocked / done. Includes queue philosophy, foundation-first policy, continuous flow rule. |
| `docs/capacity-routing.md` | How to choose the right model/platform. Fallback chain. |
| `docs/handoffs/README.md` | Handoff rules, allowed pioneer tags, route justification requirements. |

## 3. Task Queue (live board)

| Path | Purpose |
|------|---------|
| `docs/task-queue/ready/` | Tasks available to claim (after routing debate) |
| `docs/task-queue/in-progress/` | Tasks with active lease |
| `docs/task-queue/blocked/` | Tasks waiting for unblock |
| `docs/task-queue/done/` | Closed tasks with execution reports |
| `docs/task-leases/` | Active leases (one per task max) |
| `docs/handoffs/` | Pending handoffs by target role |

## 4. Templates

| File | Use when |
|------|---------|
| `docs/templates/task.md` | Injecting a new task |
| `docs/templates/lease.md` | Claiming a task |
| `docs/templates/handoff.md` | Passing work to another pioneer |

## 5. Architecture

| File | Purpose |
|------|---------|
| `docs/architecture/NERVOUS_SYSTEM.md` | Event bus architecture — spine design |
| `src/types/sacred-flow.ts` | Canonical event contract (source of truth) |
| `docs/DOC_FASE3.md` | Phase 3 product scope |

## 6. NEXUS_CONTEXT (living state)

| File | Purpose |
|------|---------|
| `NEXUS_CONTEXT/PROJECT_STATE.md` | Current reality snapshot (append-only) |
| `NEXUS_CONTEXT/INSIGHTS.md` | Cross-pioneer learnings (append-only) |
| `NEXUS_CONTEXT/PIPELINE.md` | Legacy pipeline summary (kept for backward compat) |
| `NEXUS_CONTEXT/VISUAL_DNA.md` | Design law — colors, typography, glass effects |
| `NEXUS_CONTEXT/DECISIONS.md` | Immutable decision log |
| `NEXUS_CONTEXT/STACK_REGISTRY.md` | Registered external tech |
| `NEXUS_CONTEXT/MODEL_ROUTING.md` | Model routing policy |
| `NEXUS_CONTEXT/LOGS/` | Session logs (one per pioneer session) |

## 7. Governance

| File | Purpose |
|------|---------|
| `AGENTS.md` | Full OS — Pioneer roles, branch discipline, autonomous loop |
| `.github/copilot-instructions.md` | @copilot-specific onboarding |
| `NEXUS_CONTEXT/ROLE_CHARTER.md` | Role definitions |
| `NEXUS_CONTEXT/DECISIONS.md` | Immutable decision log |
