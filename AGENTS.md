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

## Micro Team Paralela de Refinamento
O projeto opera com uma linha paralela de refinamento. Protocolo completo em `docs/DOC_MICRO_TEAM.md`.

Regras obrigatórias para qualquer agente que opere nessa linha:
- Branches de trabalho usam prefixo `mt-*`
- Nenhuma mudança entra no core sem aprovação do Tribunal
- Arquivos protegidos (`vite.config.ts`, `src/types/index.ts`, `data/projects.ts`, `tailwind.config.ts`) exigem handoff explícito ao owner antes de qualquer ação
- Estados válidos: `EM OBSERVAÇÃO` → `EM RESEARCH` → `EM REFINAMENTO` → `EM TESTE` → `PRONTA PARA TRIBUNAL` → `APROVADA PARA ENTRAR` | `ADIADA` | `REJEITADA`
- A linha principal nunca depende da micro team para avançar

## Nomenclatura wt-* — semântica de sessão, não worktree Git

Os identificadores com prefixo `wt-*` usados nos prompts e handoffs deste projeto são **rótulos operacionais de sessão**, não worktrees Git físicos.

Regras obrigatórias ao encontrar um identificador `wt-*`:
- Não assumir que existe um diretório correspondente no disco.
- Não tentar criar ou navegar para um worktree Git com esse nome.
- Tratar o rótulo como coordenada cognitiva: indica a frente operacional da sessão, não a localização no sistema de arquivos.
- A frente real é determinada por: **pilar + classe + fase + branch + natureza da tarefa**.
- Nomes `wt-*` diferentes dentro do mesmo pilar/fase/branch **não mudam a frente** — são detalhamentos nominais da mesma linha operacional.
- Só existe mudança real de frente quando muda o miolo operacional: pilar, classe, fase, dependência ou branch canônico.

Evidência técnica registrada (E9, 2026-03-20): `git worktree list` retorna um único worktree real. Nenhum diretório `wt-*` existe no disco. O sistema de nomes é protocolo de coordenação semântica.

## Regra de drift
- Se uma solicitação conflitar com as invariantes acima, responder exatamente:
  **"Isso quebra o organismo vivo. Quer manter?"**
