# GO NOW — @codex

> Ordem directa do owner: 2026-03-27
> Executar imediatamente. Sem pausa. Sem espera.

---

## MODO ACTIVO

```
K-10 ORCHESTRATE  → CONTÍNUO — background permanente
K-11 AUDIT        → STANDBY — trigger: NS-1-001 ✓ + GLOBE-3D-001 ✓
K-12 GATE_EMIT    → STANDBY — trigger: AUDIT score > 0.85
```

---

## O QUE FAZER AGORA (K-10 Zero Idle)

```
PREPAR A QUALITY-AUDIT rubric completa AGORA:

1. HEAVEN LAB TEST (score 0–1.0):
   · [0.00–0.25] GLOBE visualmente dominante (>60% viewport)
   · [0.00–0.20] Trinity clara e legível
   · [0.00–0.20] Motion fluido (não causa estranhamento)
   · [0.00–0.20] Performance (>30 FPS, LCP <2.5s, CLS <0.1)
   · [0.00–0.15] Proof section digna de produto real
   TOTAL máximo: 1.0 | threshold: 0.85

2. TYPOGRAPHY LAW checklist (18 regras — ver ops/TYPOGRAPHY_LAW.md):
   · Família canónica respeitada em todos os headings
   · Weight matrix seguida (H1/H2/body/caption)
   · Escala proporcional (não quebrada)
   · [lista as 18 regras na rubric]

3. SYSTEM FACE CANON compliance:
   · Heaven Lab face isolada (sem elementos Bridge Nova)
   · 3 faces não se misturam
   · Tokens por face respeitados

4. PERFORMANCE metrics:
   · FPS globe > 30 (target 60)
   · First Contentful Paint < 1.5s
   · Largest Contentful Paint < 2.5s
   · Cumulative Layout Shift < 0.1
```

## QUANDO TRIGGER ACTIVAR

```
TRIGGER: NS-1-001 ✓ + GLOBE-3D-001 ✓ (detectado no BRIDGE_STATE.md)

ACÇÃO K-11 AUDIT:
  1. Correr rubric completa contra outputs de @framer + @antigravity
  2. Calcular score (0–1.0) com breakdown por critério
  3. Listar gaps encontrados com severidade (blocker/warning/minor)
  4. Decisão: PASS (≥0.85) ou FAIL (<0.85)
  5. Emitir handoff com evidência

SE PASS → K-12 GATE_EMIT:
  Criar ops/GATE_V4_OPEN.md no branch canónico
  (protocolo exacto: ops/GATE_EMITTER_PROTOCOL.md)
  Nunca aguardar owner — emite automaticamente

SE FAIL:
  Listar gaps específicos para @antigravity e @framer corrigirem
  Emitir ops/AUDIT_FAIL_V3_[timestamp].md com lista exacta
  Cluster V3 reabre para correcções
```

## CONVERGENCE MONITORING (contínuo)

```
A cada handoff detectado no BRIDGE_STATE.md:
  · Calcular convergence_score por cluster
  · Se cresce → saudável → continua
  · Se estagna > 2 ciclos → emitir STALL_REPORT
  · Se desce → emitir REBOOT_CLUSTER

Pioneiros a monitorizar:
  @antigravity → GLOBE-3D-001
  @framer      → NS-1-001
  @cursor      → GLOBE-INFRA-PREP-001
  @copilot     → BRAND-DOCS-001
```

## HANDOFF

```
BRIDGE_HANDOFF
  KERNEL:             K-11 AUDIT
  TASK_ID:            QUALITY-AUDIT-001
  PIONEER:            @codex
  STATUS:             concluída
  HEAVEN_LAB_SCORE:   [score]
  COMMIT:             [hash]
  EVIDENCE:           score [X] · gaps [n] · decisão: PASS/FAIL
  CLUSTER:            CLUSTER_V3_AUDIT
```

## REFERÊNCIAS

```
ops/CODEX_ACTIVATION_001.md       → activação completa
ops/GATE_EMITTER_PROTOCOL.md      → como emitir gates
ops/NEXUS_KERNEL_OS.md            → protocolo kernel
ops/BRIDGE_STATE.md               → estado live
ops/TYPOGRAPHY_LAW.md             → checklist tipografia
ops/SYSTEM_FACE_CANON.md          → compliance faces
```

---

**K-10 AGORA — prepara rubric. K-11 activa quando trigger chegar. K-12 emite gate automaticamente se PASS.**

_GO_NOW | 2026-03-27 | owner order_
