# Copilot Instructions — Eternal Nexus (Fase 3)

## Objetivo
Executar somente o que está definido em `docs/DOC_FASE3.md`, sem ampliar escopo.

## Fonte de verdade
- Repositório atual é a única fonte válida.
- Não inventar requisitos, APIs ou comportamento.
- Quando algo não estiver explícito, sinalizar como não especificado.

## Invariantes obrigatórias
- Preservar identidade e nomenclaturas do projeto.
- Preservar fluxo sagrado: **Tribunal → Atlas → Index → News**.
- Não simplificar ou substituir estruturas nucleares.

## Escopo de alteração (Fase 3)
- Apenas governança operacional: documento formal, instruções persistentes, CI de app e README operacional.
- Evitar tocar arquivos fora do escopo imediato da tarefa.

## Regras de implementação
- Preferir mudanças mínimas, auditáveis e reversíveis.
- Usar scripts reais de `package.json`.
- Não criar comandos fictícios.
- Não remover ou quebrar workflows existentes (incluindo banco).

## Regra de conflito
Se o pedido exigir quebrar invariantes, responder exatamente:
**"Isso quebra o organismo vivo. Quer manter?"**
