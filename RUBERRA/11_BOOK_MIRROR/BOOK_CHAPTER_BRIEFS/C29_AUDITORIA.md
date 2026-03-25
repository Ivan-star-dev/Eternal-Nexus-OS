# C29 — AUDITORIA, CONTENÇÃO, RECOVERY

**Parte:** VI — Defesa
**Tipo de página:** audit spread
**Fonte repo:** AUDIT_MODEL.md + RECOVERY_MODEL.md + INCIDENT_MODEL.md
**Páginas estimadas:** 3

---

## PERGUNTA QUE ESTE CAPÍTULO RESOLVE
O que acontece quando algo falha ou é comprometido?

## CONTEÚDO PRINCIPAL
- Audit model: o que é registrado, quando, por quem
- Incident model: classificação de incidentes (STOP-1 a STOP-5)
- Contenção: como o sistema isola um problema
- Recovery: como o sistema volta ao estado canônico

## HIERARQUIA VISUAL
MACRO → incident flow: deteção → classificação → contenção → recovery
MESO → tabela de classificação de incidentes
MICRO → recovery timeline tipo checklist

## ELEMENTOS VISUAIS
- Flow diagram de incidente: 4 fases com gates
- STOP-1 a STOP-5 em color coding (amarelo→vermelho)
- Recovery checklist em formato audit
- HANDOFF_LEDGER como prova de auditoria

## TOM
Claro e metódico. Incidentes são geridos, não temidos.

## CONEXÃO AO ANTERIOR / PRÓXIMO
Recebe as fronteiras dos agentes e mostra o que acontece quando são cruzadas.
Passa para C30 a última linha de defesa.
