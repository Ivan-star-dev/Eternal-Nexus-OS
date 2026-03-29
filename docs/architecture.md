---
title: "Architecture Policy"
slug: architecture-policy
date: 2026-03-20
category: architecture
excerpt: "Core architecture policy and constraints."
---

# Architecture Policy

## Product intent
The project is operated as an ambitious, high-quality product system.
Current mode is **Foundation-first**: structural integrity, boundaries, correctness, and execution discipline come before visual polish.

## Change policy
Allowed without escalation:
- bug fixes inside existing boundaries
- local refactors with zero public behavior drift
- verification improvements
- docs updates that align docs to code reality

Requires Architecture Note first:
- framework migration
- rendering model changes
- state architecture changes
- data layer changes
- cross-cutting refactors
- any change that alters boundaries or invariants

## Invariants
- Do not invent architecture.
- Do not expand scope silently.
- Do not couple unrelated concerns in the same change.
- Do not trade clarity for cleverness.
- Smallest coherent unit wins.
- Verification is mandatory.
- Design debt must be recorded, not buried — see `docs/design-backlog.md`.

## Definition of done
A task is not done until:
1. the requested outcome exists
2. verification requirements are satisfied
3. architectural drift is avoided
4. any visual/interaction debt created is written to `docs/design-backlog.md`