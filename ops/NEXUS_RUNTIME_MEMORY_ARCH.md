# NEXUS_RUNTIME_MEMORY_ARCH — Arquitectura de Memória Viva

**Task:** NEXUS-RUNTIME-MEMORY-001
**Executor:** @claude
**Data:** 2026-03-26
**Gate:** GATE_RUNTIME — aberto
**Fecha:** DEBT_2 (memória viva não persistente entre sessões)

---

## PROBLEMA

```
ESTADO ACTUAL:
  Pioneiros recomeçam do zero a cada nova sessão.
  O contexto acumula-se apenas em ficheiros externos
  (HANDOFF_LEDGER · LIVE_STATE · BASTION).
  Leitura manual obrigatória no início de cada sessão.
  Sem memória semântica · sem estado indexado · sem recall selectivo.

SINTOMA:
  Pioneer abre sessão → lê 4 ficheiros → reconstrói contexto → executa.
  Tempo perdido. Risco de contexto desactualizado.
  Sistema inteligente a operar como sistema amnésico.
```

---

## ARQUITECTURA PROPOSTA — 4 CAMADAS

```
CAMADA 1 — MEMÓRIA ESTRUTURAL (já existe ✓)
  Ficheiros: BASTION · LIVE_STATE · HANDOFF_LEDGER · DNA_PROTOCOL
  Tipo: memória externa declarativa
  Acesso: leitura manual no início de cada sessão
  Latência: alta (requer leitura completa)
  Melhorar: índice semântico + resumo compresso por sessão

CAMADA 2 — MEMÓRIA DE SESSÃO (parcialmente implementada ✓)
  Ficheiros: ops/sessions/*.json (SESSION-BACKBONE-MINIMUM-001)
  Tipo: estado de sessão vivo em localStorage + ficheiro
  Acesso: automático via SessionContext
  Cobertura: face · next · reentry · fruit · prompt hash
  Melhorar: persistência cross-device · backup em repo

CAMADA 3 — MEMÓRIA DE PROVENIÊNCIA (implementada ✓)
  Ficheiros: ops/runtime/provenance/*.json
  Tipo: rastreio de origem por sessão + task
  Acesso: PROVENANCE-SPINE-MINIMUM-001
  Cobertura: quem fez o quê · quando · em que branch · com que evidência
  Melhorar: query semântica sobre proveniência

CAMADA 4 — MEMÓRIA SEMÂNTICA VIVA (a construir)
  Ficheiros: ops/memory/semantic_index.json (novo)
  Tipo: embeddings compressos das decisões canónicas
  Acesso: automático no início de cada sessão
  Cobertura: decisões soberanas · leis cravadas · estados de gate
  Implementação: digest por artefacto → índice de 3 linhas por lei
```

---

## PROTOCOLO DE BOOTSTRAP DE SESSÃO

```
ACTUAL (manual · 4 passos):
  1. Ler CLAUDE.md
  2. Ler LIVE_STATE.md
  3. Ler BASTION.md
  4. Reconstruir contexto mentalmente

PROPOSTO (automático · 1 passo):
  1. Ler SESSION_BOOTSTRAP.md (gerado automaticamente)
     → estado actual em 20 linhas
     → gates abertos por pioneer
     → última decisão soberana
     → próximas 3 tasks críticas
     → alignment debt summary
```

---

## SESSION_BOOTSTRAP — FORMATO

```
SESSION_BOOTSTRAP ════════════════════════════════════════════════
GERADO:         [timestamp]
BRANCH:         [branch canónico]
FASE_ACTIVA:    [V1|V2|V3|...]
ESTADO:         [resumo 1 linha]
GATES_ABERTOS:  [lista por pioneer]
ÚLTIMA_LEI:     [última decisão soberana do owner]
TASK_CRÍTICA_1: [id · pioneer · critério]
TASK_CRÍTICA_2: [id · pioneer · critério]
TASK_CRÍTICA_3: [id · pioneer · critério]
ALIGNMENT_DEBT: [DEBT_1..5 status]
══════════════════════════════════════════════════════════════════
```

---

## CAMADAS DE PERSISTÊNCIA

| Camada | Tipo | Latência | Cobertura | Estado |
|--------|------|----------|-----------|--------|
| Estrutural | ficheiros md | alta | total | ✓ existe |
| Sessão | json+localStorage | baixa | sessão actual | ✓ existe |
| Proveniência | json por sessão | baixa | rastreio de origem | ✓ existe |
| Semântica | digest compresso | zero | decisões canónicas | a construir |
| Bootstrap | md gerado auto | zero | resumo executivo | a construir |

---

## PRÓXIMAS TASKS PARA FECHAR DEBT_2

```
  1. MEMORY-BOOTSTRAP-001  — criar SESSION_BOOTSTRAP.md auto-gerado
  2. MEMORY-SEMANTIC-001   — criar semantic_index.json por artefacto
  3. MEMORY-CROSS-001      — sincronizar localStorage → repo (cross-device)
```

---

*NEXUS_RUNTIME_MEMORY_ARCH.md — 2026-03-26 | @claude | NEXUS-RUNTIME-MEMORY-001 | DEBT_2 arquitectura definida*
