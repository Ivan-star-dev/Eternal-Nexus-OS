---
title: "Stack Snapshot"
slug: stack-snapshot
date: 2026-03-20
category: architecture
excerpt: "Current technology stack snapshot."
---

# Stack Snapshot

**Generated:** 2026-03-18 12:03:00
**Repository:** vite_react_shadcn_ts
**Detected package manager:** npm
**Detected stack markers:** React, Vite, TypeScript, Tailwind CSS, Framer Motion, Three.js / R3F, Cesium stack, shadcn/Radix-style UI

## Source of truth
- package.json, lockfiles, tsconfig files, and actual code win over documentation when there is a mismatch.
- Agents must verify stack assumptions against the repository before proposing changes.
- Do not migrate framework, package manager, rendering stack, or UI primitives without Architecture Note + Reality Pass.

## Key packages detected
- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **vite**: ^8.0.0
- **typescript**: ^5.8.3
- **tailwindcss**: ^4.2.1
- **framer-motion**: ^12.35.1
- **three**: ^0.183.2
- **@react-three/fiber**: ^8.18.0
- **@react-three/drei**: ^9.122.0
- **cesium**: ^1.139.1
- **class-variance-authority**: ^0.7.1
- **@radix-ui/react-dialog**: ^1.1.14
- **@radix-ui/react-popover**: ^1.1.14

## package.json scripts detected
- **dev** -> vite
- **build** -> vite build
- **build:dev** -> vite build --mode development
- **lint** -> eslint .
- **preview** -> vite preview
- **test** -> vitest run
- **test:watch** -> vitest
- **test:perf** -> playwright test
- **watch:pipeline** -> node scripts/ops/pipeline-watcher.mjs
- **hibernate** -> node scripts/ops/wake-organism.mjs
- **typecheck** -> tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.node.json
- **ops:doctor** -> bash ./.ops/doctor.sh
- **ops:bootstrap** -> bash ./.ops/bootstrap.sh
- **ops:check** -> bash ./.ops/check.sh
- **ops:snapshot** -> bash ./.ops/snapshot.sh quick
- **ops:merge** -> bash ./.ops/merge-safe.sh origin/main
- **ops:review** -> bash ./.ops/review.sh
- **ops:rollback** -> bash ./.ops/rollback.sh HEAD~1
- **ops:repair** -> bash ./.ops/repair-install.sh
- **ops:cache** -> bash ./.ops/repair-cache.sh
- **ops:conflicts** -> bash ./.ops/find-conflicts.sh
- **ops:guard** -> bash ./.ops/guard.sh guarded-change

## Operational guidance
- Use existing commands; do not invent build/test/lint commands.
- If commands are missing, state that clearly instead of hallucinating them.
- If the stack detector missed something, update this file after verifying it from code/package manifests.