# SESSION_BOOTSTRAP — Contexto Instantâneo

> Ler no início de cada sessão. Substitui leitura manual de 6+ ficheiros.
> **Actualizado:** 2026-03-27 | SYSTEM-UPGRADE-001

---

```
SESSION_BOOTSTRAP ════════════════════════════════════════════════════════
DATA:           2026-03-27
BRANCH:         claude/setup-ruberra-nexus-IL7Tg
FASE:           V3 FLAGSHIP SURFACE — P0 CRÍTICO
LÍDER:          @claude
ESTADO:         6 pioneers GO_NOW · Kernel OS activo · Bridge Agent live

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
  K-01  @antigravity   GLOBE-3D-001             Lane A crítica
  K-04  @framer        NS-1-001                 Lane A paralelo
  K-09  @cursor        GLOBE-INFRA-PREP-001     Zero Idle
  K-10  @codex         ORCHESTRATE + rubric     Background
  K-13  @copilot       BRAND-DOCS-001           Lane B
  K-17  @claude        V6/V7 gaps              Zero Idle

GATES (automáticos V3→V7):
  GATE_V4: NS-1 ✓ + GLOBE-3D ✓ + score ≥ 0.85
  GATE_V5: V4 > 70%
  GATE_V6: V5 > 60%
  GATE_V7: V6 > 60%

SEQUÊNCIA IMUTÁVEL: V3→V4→V5→V6→V7→V8→V9→V10
CRITÉRIO V3: Heaven Lab Test > 0.85

ALIGNMENT_DEBT:
  DEBT_1  produto público        NEXUS_PRODUCT_PROOF.md ✓
  DEBT_2  memória persistente    NEXUS_RUNTIME_MEMORY_ARCH.md ✓
  DEBT_3  runtime autónomo       Kernel OS + Bridge Agent activos
  DEBT_4  stack retroengenh.     NEXUS_STACK_INVENTORY.md ✓
  DEBT_5  ecossistema/corp.      aguarda produto V3+

BLOQUEIOS OWNER (não travam V3):
  B-001  .env histórico · B-002  npm/bun · B-003  legacy-html/

FICHEIROS CHAVE:
  ops/NEXUS_KERNEL_OS.md         arquitectura kernel completa
  ops/NEXUS_BRIDGE_AGENT.md      bridge spec + handoff format
  ops/MAX_VELOCITY_PROTOCOL.md   fila por pioneer
  ops/BASTION_V3_INSERT.md       tasks V3 formais (autoridade)
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
