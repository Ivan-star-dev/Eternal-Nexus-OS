# TASK_POOL — Relay Task Pool

**Versão:** v1.0
**Data:** 2026-03-24
**Task:** TASK-POOL-MATERIALIZATION-001 (DUAL_AI_RELAY_POOL-001)
**Branch:** `claude/rebuild-bastion-core-rihGX`

> Pool canónico de tasks do relay entre agentes (Claude, ChatGPT, Cursor, Framer, Antigravity).
> Append-friendly. Um bloco por task. Statuses: pending | in_progress | blocked | done.
> Nenhuma task de execução direta — toda task referencia o BASTION como fonte de autoridade.

---

## SCHEMA

```
task_id:       TASK-{date}-{short-id}
status:        pending | in_progress | blocked | done
title:         [título curto]
pillar:        WorkStructure | WorkFunction | WorkVisual
assigned_to:   @claude | @cursor | @copilot | @framer | @antigravity | @codex
priority:      P0 | P1 | P2
context_ref:   [ficheiro ops/ ou src/ relevante]
deliverable:   [output concreto esperado]
branch:        [branch canónico]
result_ref:    [entrada em RESULT_POOL ou n/a]
```

---

## POOL

```
────────────────────────────────────────────────────────────────────────
task_id:      TASK-2026-03-24-memory-core
status:       done
title:        ORGANISM_MINIMUM_MEMORY-001 — Session backbone + provenance spine
pillar:       WorkFunction
assigned_to:  @claude
priority:     P0
context_ref:  src/lib/memory/types.ts · src/lib/memory/client.ts · ops/sessions/
deliverable:  SessionEntity + ProvenanceNode + ReentryGrace + RelayCoupling types and I/O
branch:       claude/rebuild-bastion-core-rihGX
result_ref:   RESULT-2026-03-24-memory-core
────────────────────────────────────────────────────────────────────────

────────────────────────────────────────────────────────────────────────
task_id:      TASK-2026-03-24-swmr-runtime
status:       done
title:        SWMR_MINIMUM_RUNTIME-001 — Classifier + trinity routing + fruit detection
pillar:       WorkFunction
assigned_to:  @claude
priority:     P0
context_ref:  src/lib/memory/classifier.ts · src/lib/memory/routing.ts · src/lib/memory/fruit.ts
deliverable:  SWMR 3-input proof: heaven_lab · bridge_nova · nexus_cria confirmed
branch:       claude/rebuild-bastion-core-rihGX
result_ref:   RESULT-2026-03-24-swmr-runtime
────────────────────────────────────────────────────────────────────────

────────────────────────────────────────────────────────────────────────
task_id:      TASK-2026-03-24-relay-pool
status:       done
title:        DUAL_AI_RELAY_POOL-001 — TASK_POOL + RESULT_POOL + AI_SESSION_LOG
pillar:       WorkStructure
assigned_to:  @claude
priority:     P0
context_ref:  ops/relay/TASK_POOL.md · ops/relay/RESULT_POOL.md · ops/relay/AI_SESSION_LOG.md
deliverable:  3 relay files live with schema + real seeded data
branch:       claude/rebuild-bastion-core-rihGX
result_ref:   RESULT-2026-03-24-relay-pool
────────────────────────────────────────────────────────────────────────
```

---

*TASK_POOL v1.0 — cravado 2026-03-24 | CORE-SPINE-RUNTIME-RELAY-001 | @claude*
