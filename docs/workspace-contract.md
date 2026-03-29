---
title: "Workspace Contract"
slug: workspace-contract
date: 2026-03-20
category: governance
excerpt: "Eternal Nexus workspace contract and rules."
---

# Eternal Nexus — Workspace Contract

> Every pioneer must verify this contract at the start of every session.
> If any check fails, **stop and report**. Do not proceed.

## Verification Checklist

Before doing anything, run through this list:

```
[ ] 1. I am in the correct repository (Ivan-star-dev/Eternal-Nexus-OS)
[ ] 2. The repo is a valid git repo (git status returns without error)
[ ] 3. I am on my assigned branch or creating one from main
[ ] 4. AGENTS.md is present and readable
[ ] 5. NEXUS_CONTEXT/README_FIRST.md is present
[ ] 6. docs/pipeline.md is present
[ ] 7. docs/task-queue/ready/ directory exists
[ ] 8. My role is clear (architect / builder / auditor / research / design)
[ ] 9. I have read the pipeline and know which tasks are ready
[ ] 10. I have checked docs/handoffs/to-{my-role}/ for pending handoffs
```

## Branch Policy

| Pioneer | Branch pattern |
|---------|---------------|
| @claude | `claude/{feature}` or `c{N}-{slug}` |
| @copilot | `copilot/{feature}` or `u{N}-{slug}` |
| @codex | `codex/{feature}` or `a{N}-{slug}` |
| @antigravity | `antigravity/{feature}` or `a{N}-{slug}` |
| Lab work | `lab/{pioneer}/{N}` |

**Never work directly on `main`.** Always PR. Always.

## Source of Truth Files

These files are authoritative. If they contradict your memory or instructions, trust the file.

| File | Authority |
|------|-----------|
| `AGENTS.md` | Full operating system |
| `docs/pipeline.md` | Task state |
| `docs/loop-protocol.md` | Operating cycle |
| `docs/capacity-routing.md` | Model/platform decisions |
| `NEXUS_CONTEXT/PROJECT_STATE.md` | Current reality snapshot |
| `NEXUS_CONTEXT/VISUAL_DNA.md` | Design law |
| `src/types/sacred-flow.ts` | Event contract |

## What This Contract Cannot Do

This contract:
- **cannot** force your IDE to reopen a specific workspace
- **cannot** change which model is loaded in your platform
- **cannot** automatically launch another pioneer's session
- **cannot** prevent merge if CI is not configured to enforce it

This contract **can**:
- require you to verify before proceeding
- require you to stop and write a handoff if something is wrong
- require you to declare your platform/model choice in the lease
- serve as the refusal point when wrong workspace is detected

## Mismatch Protocol

If you detect any of the following, **stop immediately and write a blocked report**:

- You are in the wrong repo
- You are on someone else's branch without a sidecar lease
- Source of truth files are missing or corrupted
- The sacred flow types have been modified without a gate test update
- A lease exists for a task you were about to claim

Write the blocked report to `docs/task-queue/blocked/{TASK_ID}_blocked.md` and stop.