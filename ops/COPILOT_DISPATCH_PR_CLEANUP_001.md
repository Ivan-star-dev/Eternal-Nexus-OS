# COPILOT_DISPATCH — PR_CLEANUP_001

**Para:** @copilot
**Emitido por:** @claude (instrução direta do owner)
**Data:** 2026-03-22
**Branch canónico:** `claude/rebuild-bastion-core-rihGX`
**Prioridade:** P1 — executar imediatamente

---

## MISSÃO

Fechar todas as PRs marcadas como **KILL** na lista abaixo.
As PRs marcadas como **MANTER** não devem ser tocadas.

---

## LISTA 1 — KILL (fechar estas PRs agora)

| PR | Título | Motivo |
|----|--------|--------|
| **#51** | feat(spine): ReplayCursor type filter + Phase 1 close | Auditado como KILL — arquitectura Phase 1/A5 incompatível com BASTION |
| **#73** | [copilot] backlog triage — classify 6 PRs + 12 issues | Supersedida pelo OPEN_PR_AUDIT_001.md — trabalho já feito |
| **#113** | fix(ledger): replace placeholder commit id with N/A in EVIDENCE block | Draft — duplicado de #107 |
| **#107** | fix: replace stale commit id placeholder in HANDOFF_LEDGER EVIDENCE block | Draft — duplicado de #113 |
| **#112** | fix: normalize CANALIZACAO_TABLE NATUREZA to single canonical category | Draft — duplicado de #105 |
| **#106** | fix: PROVA_MINIMA in HANDOFF_LEDGER.md missing explicit section refs | Duplicado de #104 |
| **#83** | Validate Fase 3 operational hygiene baseline | BULK-01.2 L-001/L-002 já CONCLUÍDA no LIVE_STATE |
| **#84** | chore: validate and confirm L-001 + L-002 operational hygiene (F7) | Supersedida — task concluída |
| **#91** | BULK-02.2: Operational surface smoothing — FOL editorial cleanup | BULK-02.2 já CONCLUÍDA no LIVE_STATE |
| **#96** | ops: propagate BASTION v1.2 artifacts to canonical live branch | BASTION v1.2 já propagado — stale |

**Acção:** Fechar cada PR com comentário: `KILL — supersedida/duplicada. Fechada por ordem do owner via COPILOT_DISPATCH_PR_CLEANUP_001.`

---

## LISTA 2 — MANTER (não tocar)

| PR | Título | Motivo |
|----|--------|--------|
| **#65** | feat(deps): upgrade React Three Fiber v8→v9 + Drei v9→v10 | SALVAGE — upgrade válido para extrair no canónico |
| **#74** | C6 codex eslint audit | SALVAGE — regras ESLint para extrair |
| **#105** | fix(ops): normalize NATUREZA field to single canonical category in LIVE_STATE.md | Fix válida — avaliar se já aplicada |
| **#104** | fix: PROVA_MINIMA no EVIDENCE block com seção/campo e commit id real | Fix válida — avaliar se já aplicada |
| **#101** | ops: iniciar ciclo contínuo BASTION 2.0 | Avaliar alinhamento com sprint atual |
| **#100** | ops: BASTION 2.0 cycle start + @cursor mechanical backlog (01.3 a/b/c) | Avaliar se #101 é duplicado — fechar um se for |

---

## REGRAS DE EXECUÇÃO

1. Fechar PRs da Lista 1 uma a uma com comentário explicativo
2. Não mergear nenhuma PR — apenas fechar
3. Não apagar branches (permissões limitadas) — só fechar a PR
4. Após fechar todas as 10, reportar status ao owner
5. Não actuar sobre a Lista 2 sem instrução adicional do owner

---

## EVIDENCE BLOCK ESPERADO

```
COPILOT_EVIDENCE
TASK            │ PR_CLEANUP_001
PRs_FECHADAS    │ [lista dos números fechados]
PRs_MANTIDAS    │ #65 #74 #105 #104 #101 #100
ERROS           │ [se alguma PR não pôde ser fechada, listar aqui]
STATUS          │ CONCLUÍDA / PARCIAL
```

---

_Dispatch emitido por @claude — 2026-03-22 | BRANCH: claude/rebuild-bastion-core-rihGX_
