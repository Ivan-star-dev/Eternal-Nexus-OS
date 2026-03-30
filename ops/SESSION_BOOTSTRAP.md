# SESSION_BOOTSTRAP — Contexto Instantâneo

> Ler no início de cada sessão. Substitui leitura manual de 6+ ficheiros.
> **Actualizado:** 2026-03-27 | SYSTEM-UPGRADE-001

---

```
SESSION_BOOTSTRAP ════════════════════════════════════════════════════════
DATA:           2026-03-30
BRANCH:         claude/setup-ruberra-nexus-IL7Tg
FASE:           V4 LIVING WORLD — FORCE_TASK_003 ACTIVA
LÍDER:          @claude
ESTADO:         V4 em execução · SITE-CONVERGENCE-001 ✅ · homepage 100% theme-aware

ARQUITECTURA (NEXUS_KERNEL_OS v1.0):
  8 layers: L0 Sovereign → L8 Bridge Agent
  18 kernels: K-01 a K-18 (ver ops/NEXUS_KERNEL_OS.md)
  Clusters dinâmicos por problema · Parallel lanes A/B/C
  Zero Idle Law: nenhum kernel parado com trabalho disponível
  Sub-agents nativos: @claude/@cursor ilimitado · @codex ~5

BRIDGE AGENT (ops/NEXUS_BRIDGE_AGENT.md):
  GitHub Action: .github/workflows/nexus-bridge.yml
  Trigger: push agent/* → detecta BRIDGE_HANDOFF em <60s
  Emite gates automaticamente · Stall detect cada 4h
  Owner só chamado em stall real

KERNELS ACTIVOS AGORA:
  K-07  @cursor        V4-WORLD-PULSE-001       Lane A crítica (activo)
  K-07  @cursor        V4-TIMELINE-BASE-001     Lane A crítica (fila após pulse)
  K-04  @framer        NS-3-FRAMER-UI-001       Lane A paralelo
  K-10  @codex         ORCHESTRATE + CI verify  Background
  K-15  @copilot       OPS-SURFACE-FINAL-001    Lane B
  K-17  @claude        V4 oversight + V5 spec   Zero Idle

GATES (automáticos V3→V7):
  GATE_V4: ✅ EMITIDO 2026-03-27 (score 0.91)
  GATE_V5: V4 > 70% → em progresso (FORCE_TASK_003 activa)
  GATE_V6: V5 > 60%
  GATE_V7: V6 > 60%

SEQUÊNCIA IMUTÁVEL: V3→V4→V5→V6→V7→V8→V9→V10
CRITÉRIO V4: World Pulse vivo · Timeline navegável · NS-3 5 componentes

ALIGNMENT_DEBT:
  DEBT_1  produto público        NEXUS_PRODUCT_PROOF.md ✓
  DEBT_2  memória persistente    NEXUS_RUNTIME_MEMORY_ARCH.md ✓
  DEBT_3  runtime autónomo       Kernel OS + Bridge Agent activos
  DEBT_4  stack retroengenh.     NEXUS_STACK_INVENTORY.md ✓
  DEBT_5  ecossistema/corp.      aguarda produto V4+

BLOQUEIOS OWNER (não travam V4):
  B-001  .env histórico · B-002  npm/bun · B-003  legacy-html/

FICHEIROS CHAVE:
  ops/NEXUS_KERNEL_OS.md         arquitectura kernel completa
  ops/NEXUS_BRIDGE_AGENT.md      bridge spec + handoff format
  ops/MAX_VELOCITY_PROTOCOL.md   fila por pioneer
  ops/FORCE_TASK_ACTIVATION_003.md  V4 Living World activation
  ops/BASTION.md                 lei de elegibilidade
  ops/LIVE_STATE.md              estado live
  scripts/bridge/bridge.mjs      código do bridge
  .github/workflows/nexus-bridge.yml  automação

HANDOFF FORMAT OBRIGATÓRIO:
  BRIDGE_HANDOFF
    KERNEL:           K-XX NOME
    TASK_ID:          [id]
    PIONEER:          @[nome]
    STATUS:           concluída
    HEAVEN_LAB_SCORE: [0.00–1.00] (se aplicável)
    COMMIT:           [hash]
    EVIDENCE:         [o que foi criado]
    CLUSTER:          [cluster_id]
══════════════════════════════════════════════════════════════════════════
```

---

*SESSION_BOOTSTRAP.md — 2026-03-27 | @claude | SYSTEM-UPGRADE-001*
