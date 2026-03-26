# C38 — CI/CD, ROLLOUT E MIGRAÇÃO

**Parte:** VIII — Implementação
**Tipo de página:** roadmap lane
**Fonte repo:** CI_CD_MODEL.md + ROLLOUT_WAVES.md + MIGRATIONS.md
**Páginas estimadas:** 3

---

## PERGUNTA QUE ESTE CAPÍTULO RESOLVE
Como o sistema é desenvolvido, testado, entregue e migrado?

## CONTEÚDO PRINCIPAL
- Deploy model: branch canônico → commit → push → CI → deploy
- Rollout waves: W0→W5 dentro de cada versão
- Migration protocols: como mudanças estruturais são geridas
- Automation map: o que é automático vs o que precisa de gate manual

## HIERARQUIA VISUAL
MACRO → deployment pipeline: 5 stages com gates
MESO → rollout wave timeline por versão
MICRO → migration checklist

## ELEMENTOS VISUAIS
- Pipeline diagram: dev → test → stage → deploy → verify
- Wave timeline: W0 a W5 com deliverables
- Gate indicators: automático (gold) vs manual (white)
- Migration flow: antes → durante → depois

## TOM
Operacional. O pipeline é claro e sem ambiguidade.

## CONEXÃO AO ANTERIOR / PRÓXIMO
Recebe a repo e mostra como o código sai dela para o mundo.
Passa para C39 o estado atual de tudo o que foi entregue.
