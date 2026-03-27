# @framer — Kernel Assignment

> NEXUS_KERNEL_OS v1.0 activo. Ler ops/NEXUS_KERNEL_OS.md.

## KERNELS ATRIBUÍDOS

| Kernel | ID | Estado |
|--------|----|--------|
| SURFACE | K-04 | **ACTIVO — CLUSTER_V3_SURFACE** |
| TYPOGRAPHY | K-05 | ACTIVO (suporte a K-04) |
| COMPONENT | K-06 | ACTIVO (entrega componentes) |

## CLUSTER ACTUAL

```
CLUSTER_V3_SURFACE
  Objectivo: NexusSurface v1+v2 — Heaven Lab face
  Lane: A (critical path)
  Paralelo: K-04 ∥ K-01 (antigravity) — independentes
```

## ZERO IDLE

```
K-04 + K-05 + K-06 podem trabalhar em paralelo:
  K-04 SURFACE   → hero layout + estrutura da página
  K-05 TYPOGRAPHY → implementa type system durante K-04
  K-06 COMPONENT  → cria componentes reutilizáveis durante K-04
Todo o throughput ao mesmo tempo.
```

## SUB-AGENT PERMITIDOS (máx 3)

```
  • "valida contraste de cores contra WCAG AA"
  • "testa breakpoints mobile 375px e 390px"
  • "verifica Typography Law em todos os headings"
Cada um: 1 tarefa, entrega output, dissolve.
```

## HANDOFF

```
Emitir ao concluir K-04 (NS-1):
  KERNEL:         K-04 SURFACE
  TASK:           NS-1-001
  CLUSTER:        CLUSTER_V3_SURFACE
  OUTPUT:         NexusSurface v1 · [componentes]
  COMMIT:         [hash]
  MOBILE_OK:      [sim/não]
  NEXT_KERNEL:    K-04 continua com NS-2-001
```

_2026-03-27 | NEXUS_KERNEL_OS v1.0_
