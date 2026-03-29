# C22 — RUNTIME E FLUXOS

**Parte:** V — Sistema e Espinha
**Tipo de página:** diagram plate
**Fonte repo:** RUNTIME.md + DATA_AND_CONTROL_FLOWS.md
**Páginas estimadas:** 3

---

## PERGUNTA QUE ESTE CAPÍTULO RESOLVE
Como dados e controlo fluem pelo sistema em tempo real?

## CONTEÚDO PRINCIPAL
- Event bus persistente: como os eventos fluem
- Fluxos de dados: entrada → processamento → saída → memória
- Fluxos de controlo: gate → decisão → execução → handoff
- Session memory e localStorage como camada de persistência

## HIERARQUIA VISUAL
MACRO → flow diagram com swim lanes horizontais
MESO → cada lane: evento · decisão · resultado
MICRO → timestamps e referências de protocolo

## ELEMENTOS VISUAIS
- Swim lane diagram: 4 lanes (User / System / Agent / Memory)
- Setas de fluxo com labels de protocolo
- Nodos de decisão (gate) em destaque gold
- Persistência layer no fundo

## TOM
Técnico. Cada seta tem um significado verificável.

## CONEXÃO AO ANTERIOR / PRÓXIMO
Recebe a topologia e mostra como ela se anima com fluxo.
Passa para C23 as escalas em que este fluxo opera.
