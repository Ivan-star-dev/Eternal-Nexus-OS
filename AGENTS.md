# AGENTS.md — Regras operacionais para Fase 3

## Fonte de verdade obrigatória
- Use apenas conteúdo versionado deste repositório.
- Para Fase 3, a referência obrigatória é `docs/DOC_FASE3.md`.
- Se faltar especificação explícita, não inferir. Registrar limitação.

## Invariantes do projeto (não negociáveis)
- Nunca simplificar o projeto.
- Nunca renomear órgãos, agentes, fluxos ou estruturas centrais.
- Nunca alterar o fluxo sagrado: **Tribunal → Atlas → Index → News**.
- Nunca introduzir escopo além do solicitado.

## Escopo permitido para trabalhos de Fase 3
- Governança e auditabilidade (docs/instruções/CI/README).
- Mudanças mínimas e rastreáveis para fechar gaps objetivos já identificados.

## Proibições explícitas
- Refatoração especulativa.
- Mudanças de arquitetura sem necessidade direta.
- Alterar áreas não relacionadas ao item solicitado.
- Afirmar funcionalidades não comprovadas no repositório.

## Regra de execução para agentes
1. Confirmar requisito em `docs/DOC_FASE3.md`.
2. Alterar apenas arquivos necessários ao requisito atual.
3. Validar com scripts reais existentes no `package.json`.
4. Entregar evidência objetiva (arquivos alterados + comandos executados).

## Regra de drift
- Se uma solicitação conflitar com as invariantes acima, responder exatamente:
  **"Isso quebra o organismo vivo. Quer manter?"**
