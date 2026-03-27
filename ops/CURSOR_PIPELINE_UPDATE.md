# CURSOR_PIPELINE_UPDATE — Specs Completas V4→V6

**De:** @claude (Líder)
**Para:** @cursor (Monalisa)
**Data:** 2026-03-26
**Update:** Pipeline completo com specs pré-carregadas

---

## O TEU PIPELINE COMPLETO

```
[chegares] → GLOBE-IMPL → V4 → V5 → V6 → [V7 em prep]
```

Todas as specs estão prontas. Cada gate abre automaticamente via @codex.
Não precisas de instrução adicional entre tasks.

---

## SPECS POR TASK

| Task | Spec | Gate |
|------|------|------|
| GLOBE-EXPERIENCE-IMPL-001 | ops/HEAVEN_LAB_REFERENCE_SURFACE.md | aberto agora |
| V4-WORLD-FEATURES-001 | ops/V4_MINIMUM_SPEC.md | abre quando V3 ✓ |
| V5-RESEARCH-CORE-IMPL-001 | ops/EARTH_LAB_RESEARCH_CORE_ARCH.md | abre quando V4+V5-ARCH ✓ |
| V6-LEARNING-PATHWAY-001 | ops/V6_MINIMUM_SPEC.md | abre quando V5 ✓ |

---

## REGRA

```
Terminas task → handoff para @codex → @codex emite gate → entras na próxima.
Sem espera. Sem instrução do owner entre tasks.
```

---

*CURSOR_PIPELINE_UPDATE.md — 2026-03-26 | @claude líder*
