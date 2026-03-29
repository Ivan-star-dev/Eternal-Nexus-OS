# COPILOT_DISPATCH — PR_CLEANUP_002

**Para:** @copilot
**Emitido por:** @claude (instrução direta do owner)
**Data:** 2026-03-22
**Branch canónico:** `claude/rebuild-bastion-core-rihGX`
**Prioridade:** P1 — executar imediatamente
**Supersede:** COPILOT_DISPATCH_PR_CLEANUP_001.md (inclui tudo + branches zombie)

---

## MISSÃO

Limpeza total de PRs e branches:
1. **FECHAR** PRs mortas/caducadas (sem merge)
2. **APAGAR** branches zombie no remote
3. **REPORTAR** PRs válidas ao owner para decisão de merge

---

## BLOCO 1 — PRs A FECHAR (sem merge)

Comentário padrão a usar em cada: `KILL — supersedida/duplicada/caducada. Fechada por ordem do owner via COPILOT_DISPATCH_PR_CLEANUP_002.`

| PR | Título | Motivo |
|----|--------|--------|
| **#51** | feat(spine): ReplayCursor type filter + Phase 1 close | Arquitectura Phase 1/A5 incompatível com BASTION |
| **#73** | [copilot] backlog triage — classify 6 PRs + 12 issues | Supersedida — trabalho já feito |
| **#113** | fix(ledger): replace placeholder commit id with N/A | Draft — duplicado de #107 |
| **#107** | fix: replace stale commit id placeholder in HANDOFF_LEDGER | Draft — duplicado de #113 |
| **#112** | fix: normalize CANALIZACAO_TABLE NATUREZA | Draft — duplicado de #105 |
| **#106** | fix: PROVA_MINIMA in HANDOFF_LEDGER.md missing section refs | Duplicado de #104 |
| **#83** | Validate Fase 3 operational hygiene baseline | BULK-01.2 L-001/L-002 CONCLUÍDA |
| **#84** | chore: validate and confirm L-001 + L-002 (F7) | Task concluída — stale |
| **#91** | BULK-02.2: Operational surface smoothing | BULK-02.2 CONCLUÍDA |
| **#96** | ops: propagate BASTION v1.2 artifacts | BASTION v1.2 já propagado |

**Total: 10 PRs a fechar**

---

## BLOCO 2 — BRANCHES ZOMBIE A APAGAR NO REMOTE

Estes branches são tentativas falhadas ou duplicados confirmados. Nenhum tem trabalho vivo.

```bash
# Retry/duplicate copilot branches
git push origin --delete copilot/sub-pr-101-again
git push origin --delete copilot/sub-pr-101-another-one
git push origin --delete copilot/sub-pr-101-one-more-time
git push origin --delete copilot/sub-pr-101-please-work
git push origin --delete copilot/sub-pr-101-yet-again
git push origin --delete copilot/sub-pr-65-again
git push origin --delete copilot/claudefechar-casca-grossa-higiene-operacional-again
git push origin --delete copilot/claudereset-all-001

# Codex duplicate branches
git push origin --delete codex/fix-typescript-jsx-typing-errors-2t96kx
git push origin --delete codex/create-executable-technical-layer-for-nexus_os-mxusht

# Old claude session branches (sessões encerradas sem trabalho activo)
git push origin --delete claude/blissful-benz
git push origin --delete claude/cranky-ride
git push origin --delete claude/expose-workspace-config-yt4Km
git push origin --delete claude/hungry-hertz
git push origin --delete claude/jolly-austin
git push origin --delete claude/magical-goodall
git push origin --delete claude/magical-napier
git push origin --delete claude/sleepy-leakey
```

**Total: 18 branches a apagar**

---

## BLOCO 3 — PRs VÁLIDAS (reportar ao owner — NÃO mergear sem aprovação)

| PR | Branch | Estado | Recomendação |
|----|--------|--------|--------------|
| **#65** | `feat/r3f-v9-clean` | R3F v8→v9 upgrade | SALVAGE — extrair patches para canónico |
| **#74** | `C6-codex-eslint-audit` | ESLint rules | SALVAGE — extrair regras |
| **#105** | fix NATUREZA field | Fix válida | Verificar se já aplicada; fechar se sim |
| **#104** | fix PROVA_MINIMA | Fix válida | Verificar se já aplicada; fechar se sim |
| **#101** | BASTION 2.0 cycle start | Avaliar vs #100 | Fechar o duplicado |
| **#100** | BASTION 2.0 + cursor backlog | Avaliar vs #101 | Fechar o duplicado |

**Acção para estes:** Reportar estado ao owner. Não mergear. Não fechar sem instrução.

---

## BRANCHES A MANTER (não tocar)

```
origin/main                          — base canónica
origin/claude/rebuild-bastion-core-rihGX  — sprint activo
origin/agent/*  (6 branches)         — infra de pioneers
origin/feat/r3f-v9-clean             — trabalho válido
origin/fix/replay-cursor-types-and-C5-close — fix activa
origin/lab/antigravity/01-pmtiles    — lab activo
origin/A2-ci-baseline-gate           — CI pipeline
origin/C6-codex-eslint-audit         — ESLint activo
origin/C6-streams-organ              — streams activo
```

---

## ORDEM DE EXECUÇÃO

```
1. Fechar as 10 PRs do Bloco 1 com comentário padrão
2. Apagar os 18 branches zombie do Bloco 2
3. Auditar as 6 PRs do Bloco 3 e reportar estado ao owner
4. Emitir EVIDENCE BLOCK abaixo
```

---

## EVIDENCE BLOCK ESPERADO

```
COPILOT_EVIDENCE
TASK              │ PR_CLEANUP_002
PRs_FECHADAS      │ [listar números fechados]
BRANCHES_APAGADOS │ [listar branches removidos]
PRs_AUDITADAS     │ #65 #74 #105 #104 #101 #100 — estado de cada
ERROS             │ [PRs ou branches que não foi possível processar]
STATUS            │ CONCLUÍDA / PARCIAL
```

---

_Dispatch emitido por @claude — 2026-03-22 | BRANCH: claude/rebuild-bastion-core-rihGX | PR_CLEANUP_002_
