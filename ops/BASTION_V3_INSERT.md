# BASTION — Suplemento V3 Constellation

> Este ficheiro é um INSERT formal ao BASTION principal.
> Autoridade igual ao BASTION — fonte: owner + @claude, 2026-03-27.
> Estas tasks são ELEGÍVEIS e EXECUTÁVEIS agora.
> Referência completa: ops/BASTION.md

---

## AUTORIDADE DE EXECUÇÃO

```
ORDEM_SOBERANA: 2026-03-27 | owner
OPERAÇÃO:       CONSTELLATION_DISPATCH — 6 pioneiros activos
BRANCH:         claude/setup-ruberra-nexus-IL7Tg
PRIORIDADE:     MÁXIMA — V3 fecha antes de qualquer outra frente
```

---

## TASKS V3 ELEGÍVEIS — @antigravity

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ GLOBE-3D-001                                            │
│ PILAR              │ WorkVisual — Superfície V3                              │
│ WORKTREE_ALIAS     │ WorkVisual                                              │
│ DONO_PRINCIPAL     │ @antigravity                                            │
│ APOIO_SECUNDARIO   │ @cursor (implementação técnica após spec)               │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1 — CRÍTICA                                            │
│ GATE               │ ABERTO — 2026-03-27                                     │
│ NEXT_ACTOR         │ @antigravity → depois @cursor (GLOBE-EXPERIENCE-IMPL)   │
│ NEXT_TASK          │ ORBITAL-CHAMBER-001                                     │
│ EVIDENCIA_MINIMA   │ GLOBE 3D funcional · commit · branch agent/antigravity  │
│ NOTAS_DO_OWNER     │ GLOBE dominante na viewport · atmosfera · 3D vivo       │
│                    │ Referência: ops/ANTIGRAVITY_DISPATCH_001.md             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ ORBITAL-CHAMBER-001                                     │
│ PILAR              │ WorkVisual — Superfície V3                              │
│ WORKTREE_ALIAS     │ WorkVisual                                              │
│ DONO_PRINCIPAL     │ @antigravity                                            │
│ STATUS             │ elegível (após GLOBE-3D-001)                            │
│ DEPENDENCIA_STATUS │ pendente → GLOBE-3D-001                                 │
│ DEPENDE_DE         │ GLOBE-3D-001                                            │
│ PODE_ENTRAR_SOZINHO│ sim (sequência natural)                                 │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ ABERTO após GLOBE-3D                                    │
│ NEXT_TASK          │ MOTION-SYSTEM-001                                       │
│ EVIDENCIA_MINIMA   │ câmara orbital · contentor imersivo · commit            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ MOTION-SYSTEM-001                                       │
│ PILAR              │ WorkVisual — Motion                                     │
│ DONO_PRINCIPAL     │ @antigravity                                            │
│ STATUS             │ elegível (após ORBITAL-CHAMBER-001)                     │
│ DEPENDENCIA_STATUS │ pendente → ORBITAL-CHAMBER-001                         │
│ PRIORIDADE         │ P2                                                      │
│ NEXT_TASK          │ SUBSTRATE-LAYER-001                                     │
│ EVIDENCIA_MINIMA   │ sistema de motion base · transições · commit            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ SUBSTRATE-LAYER-001                                     │
│ PILAR              │ WorkVisual — Depth                                      │
│ DONO_PRINCIPAL     │ @antigravity                                            │
│ STATUS             │ elegível (após MOTION-SYSTEM-001)                       │
│ DEPENDENCIA_STATUS │ pendente → MOTION-SYSTEM-001                            │
│ PRIORIDADE         │ P3                                                      │
│ NEXT_TASK          │ → @codex QUALITY-AUDIT-001 (trigger)                   │
│ EVIDENCIA_MINIMA   │ substrate layer · depth visual · commit                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## TASKS V3 ELEGÍVEIS — @framer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NS-1-001                                                │
│ PILAR              │ WorkVisual — NexusSurface                               │
│ WORKTREE_ALIAS     │ WorkVisual                                              │
│ DONO_PRINCIPAL     │ @framer                                                 │
│ APOIO_SECUNDARIO   │ @copilot (revisão Typography Law)                       │
│ STATUS             │ elegível                                                │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ DEPENDE_DE         │ nenhum                                                  │
│ PODE_ENTRAR_SOZINHO│ sim                                                     │
│ PRIORIDADE         │ P1 — CRÍTICA                                            │
│ GATE               │ ABERTO — 2026-03-27                                     │
│ NEXT_ACTOR         │ @framer                                                 │
│ NEXT_TASK          │ NS-2-001                                                │
│ EVIDENCIA_MINIMA   │ NexusSurface v1 · hero + nav + 1ª dobra · commit        │
│ NOTAS_DO_OWNER     │ Heaven Lab face · Typography Law · System Face Canon   │
│                    │ Referência: ops/FRAMER_ACTIVATION_001.md                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ NS-2-001                                                │
│ PILAR              │ WorkVisual — NexusSurface                               │
│ DONO_PRINCIPAL     │ @framer                                                 │
│ STATUS             │ elegível (após NS-1-001)                                │
│ DEPENDENCIA_STATUS │ pendente → NS-1-001                                     │
│ PRIORIDADE         │ P1                                                      │
│ NEXT_TASK          │ → @codex QUALITY-AUDIT-001 (trigger NS-1+GLOBE-3D)     │
│ EVIDENCIA_MINIMA   │ NexusSurface v2 · proof section · CTAs · footer · commit│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## TASKS V3 ELEGÍVEIS — @cursor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ GLOBE-EXPERIENCE-IMPL-001                               │
│ PILAR              │ WorkFunction — Implementação Técnica V3                 │
│ WORKTREE_ALIAS     │ WorkFunction                                            │
│ DONO_PRINCIPAL     │ @cursor                                                 │
│ STATUS             │ elegível (aguarda GLOBE-3D-001 spec)                    │
│ DEPENDENCIA_STATUS │ pendente → GLOBE-3D-001 (spec, não necessariamente done)│
│ DEPENDE_DE         │ GLOBE-3D-001                                            │
│ PODE_ENTRAR_SOZINHO│ sim (quando spec GLOBE-3D disponível)                   │
│ PRIORIDADE         │ P1                                                      │
│ GATE               │ ABERTO após spec GLOBE-3D                               │
│ NEXT_ACTOR         │ @cursor                                                 │
│ NEXT_TASK          │ V4-WORLD-FEATURES-001 (após GATE_V4_OPEN)              │
│ EVIDENCIA_MINIMA   │ GLOBE vivo no produto · Three.js/R3F · commit           │
│ NOTAS_DO_OWNER     │ Pipeline completo: V3→V4→V5→V6 pré-carregado           │
│                    │ Referência: ops/CURSOR_ACTIVATION_001.md                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## TASKS V3 ELEGÍVEIS — @codex

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ QUALITY-AUDIT-001                                       │
│ PILAR              │ Consolidação / Qualidade V3                             │
│ WORKTREE_ALIAS     │ WorkStructure                                           │
│ DONO_PRINCIPAL     │ @codex                                                  │
│ STATUS             │ elegível (trigger: NS-1-001 ✓ + GLOBE-3D-001 ✓)        │
│ DEPENDENCIA_STATUS │ pendente → NS-1-001 + GLOBE-3D-001                      │
│ DEPENDE_DE         │ NS-1-001 + GLOBE-3D-001                                 │
│ PODE_ENTRAR_SOZINHO│ sim (trigger automático)                                │
│ PRIORIDADE         │ P1 — determina gate V4                                  │
│ GATE               │ ABERTO após dependências                                │
│ NEXT_ACTOR         │ @codex                                                  │
│ NEXT_TASK          │ GATE_V4_OPEN emission (se score > 0.85)                │
│ EVIDENCIA_MINIMA   │ score Heaven Lab · gaps listados · PASS/FAIL · commit   │
│ NOTAS_DO_OWNER     │ Referência: ops/CODEX_ACTIVATION_001.md                 │
│                    │ Protocolo gate: ops/GATE_EMITTER_PROTOCOL.md            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK_ID            │ CLUSTER-ORCHESTRATE-001                                 │
│ PILAR              │ Orquestração Contínua                                   │
│ DONO_PRINCIPAL     │ @codex                                                  │
│ STATUS             │ elegível — CONTÍNUO                                     │
│ DEPENDENCIA_STATUS │ livre                                                   │
│ PRIORIDADE         │ P1 — background permanente                              │
│ GATE               │ ABERTO                                                  │
│ EVIDENCIA_MINIMA   │ handoffs recebidos consolidados · estado por pioneiro   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## CADEIA DE GATE AUTOMÁTICO

```
V3 FECHA
  → @codex: QUALITY-AUDIT-001 → score > 0.85 → emit GATE_V4_OPEN
  → ops/GATE_V4_OPEN.md criado no branch canônico
  → @cursor activa V4-WORLD-FEATURES-001 automaticamente
  → specs já em ops/V4_MINIMUM_SPEC.md

V4 > 70%
  → @codex emite GATE_V5_OPEN
  → @claude activa V5-RESEARCH-ARCH-001
  → @cursor activa V5-RESEARCH-IMPL-001
  → specs em ops/EARTH_LAB_RESEARCH_CORE_ARCH.md

V5 > 60%  → @codex emite GATE_V6_OPEN  → specs em ops/V6_MINIMUM_SPEC.md
V6 > 60%  → @codex emite GATE_V7_OPEN  → specs em ops/V7_MINIMUM_SPEC.md
```

**Nenhum gate requer intervenção do owner. Sistema fecha sozinho V3→V7.**

---

_BASTION_V3_INSERT v1.0 — 2026-03-27 | @claude | CONSTELLATION_DISPATCH_001_
