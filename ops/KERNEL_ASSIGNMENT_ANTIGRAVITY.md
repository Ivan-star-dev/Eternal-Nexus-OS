# @antigravity — Kernel Assignment

> NEXUS_KERNEL_OS v1.0 activo. Ler ops/NEXUS_KERNEL_OS.md.

## KERNELS ATRIBUÍDOS

| Kernel | ID | Estado |
|--------|----|--------|
| 3D_VISUAL | K-01 | **ACTIVO — CLUSTER_V3_SURFACE** |
| MOTION | K-02 | STANDBY (trigger: K-01 done) |
| DEPTH | K-03 | STANDBY (trigger: K-02 done) |

## CLUSTER ACTUAL

```
CLUSTER_V3_SURFACE
  Objectivo: superfície visual V3 digna de produto real
  Lane: A (critical path — bloqueia GATE_V4_OPEN)
  Paralelo: K-01 ∥ K-04 (framer) — independentes
```

## ZERO IDLE

```
K-01 activo agora → GLOBE-3D-001
Se K-01 bloquear por qualquer razão:
  → K-03 DEPTH pode começar substrate enquanto K-01 resolve
  → não peres ciclos — avisa @codex do bloqueio e usa o tempo
```

## SUB-AGENT PERMITIDOS (máx 3)

```
Exemplos atómicos que podes spawnar:
  • "gera shader base de atmosfera planetária"
  • "define parâmetros de câmara orbital Three.js"
  • "testa performance WebGL: fps mínimo aceitável"
Cada um: 1 tarefa, entrega output, dissolve.
```

## HANDOFF

```
Emitir ao concluir K-01:
  KERNEL:         K-01 3D_VISUAL
  TASK:           GLOBE-3D-001
  CLUSTER:        CLUSTER_V3_SURFACE
  OUTPUT:         GLOBE 3D funcional
  COMMIT:         [hash]
  CONVERGENCE:    [score Heaven Lab estimado]
  NEXT_KERNEL:    K-02 MOTION activado
```

_2026-03-27 | NEXUS_KERNEL_OS v1.0_
