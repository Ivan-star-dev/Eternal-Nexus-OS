# DOC_F6 — Casca Grossa Técnica Executável

**Pilar:** Funcionalidade  
**Classe:** funcionalidade, comportamento, lógica, integração, fluxo real, dados, motor operacional  
**Fase:** Fase 3 — Governança e Auditabilidade  
**Task:** F6 — Fechar a casca grossa técnica executável a partir do NEXUS_OS  
**Data:** 2026-03-20  
**Documento soberano de referência:** `docs/NEXUS_OS.md`  
**Fonte de fase obrigatória:** `docs/DOC_FASE3.md`

---

## 1) Leitura técnica do NEXUS_OS para execução real

### 1.1 O que já é acionável imediatamente
1. **Protocolo de operação já está definido e versionado** em `docs/NEXUS_OS.md`, `docs/DOC_FASE3.md` e `AGENTS.md`.
2. **Escopo de Fase 3 é restrito a governança/auditabilidade**, com rastreabilidade e validação por scripts reais.
3. **Fluxo sagrado obrigatório** (`Tribunal → Atlas → Index → News`) está declarado como invariante e não pode ser alterado.
4. **Gate técnico mínimo já existe** via scripts do `package.json`: `lint`, `typecheck`, `test`, `build`.
5. **Arquivos protegidos já estão definidos** (`vite.config.ts`, `src/types/index.ts`, `data/projects.ts`, `tailwind.config.ts`) com restrições explícitas.

### 1.2 O que ainda precisa de trilha operacional técnica
1. **Sequenciamento técnico por família de dívida** (lint, any, hooks, libs sensíveis, supabase/functions) sem virar guerra global.
2. **Critério de entrada por recorte** (o que corrige já, o que vai para bulk, o que sobe Tribunal/owner).
3. **Mapa objetivo de bloqueios** com destino explícito (`fazer agora`, `bloqueado`, `Tribunal`, `owner`).
4. **Papel operacional do Codex** como executor técnico pós-camada soberana, mantendo handoff + canalização.

### 1.3 Limitação registrada
Este documento **não redefine arquitetura soberana** e **não executa correções de código nesta task**; ele estabelece a camada técnica executável imediatamente posterior ao soberano.

---

## 2) Mapa técnico executável mínimo (canônico)

## 2.1 Classes de decisão técnica

| Classe | Definição operacional | Pode executar agora? | Gate obrigatório |
|---|---|---|---|
| **A0 — Correção segura imediata** | Ajuste localizado, baixo risco, sem tocar arquivo protegido, sem alterar fluxo sagrado | Sim | PR normal + handoff |
| **A1 — Bulk com travão** | Conjunto encadeado de correções técnicas por família com checkpoint por etapa | Sim, com travão | Handoff parcial por etapa |
| **A2 — Tribunal** | Mudança que encosta em protocolo, estrutura sensível, integração transversal, ou dúvida de fronteira | Não direto | Julgamento do Tribunal |
| **A3 — Owner** | Qualquer ação em arquivo protegido por regra explícita, ou decisão de política do projeto | Não direto | Confirmação do owner |
| **A4 — Bloqueado por fase** | Tudo que for Fase 4/feature nova/refatoração global fora da task | Não | Arquivar para fase correta |

## 2.2 Matriz “pode corrigir já” vs “depende de gate”

| Tema | Estado | Observação |
|---|---|---|
| Lint hardening seguro por pasta/família | **Executável (A0/A1)** | Sem global sweep; por recorte técnico fechado |
| `any` por família (substituição tipada incremental) | **Executável (A1)** | Começar pelas famílias de menor acoplamento |
| Hook rules críticos (`rules-of-hooks`, deps perigosas) | **Executável (A0)** | Prioridade alta por risco funcional |
| Workers/libs sensíveis | **Tribunal (A2)** quando mudar contrato | Ajustes locais são A0; mudança de contrato sobe |
| `supabase/functions` | **A1 ou A2** conforme impacto | Refino local pode entrar; mudança de interface vai ao Tribunal |
| Warnings cosméticos | **Posterior** | Entram depois de erros e críticos |
| Arquivos protegidos | **Owner (A3)** | Sem exceção nesta fase |

## 2.3 Hardening seguro (ordem técnica)
1. **Falhas que quebram execução/CI local** (`lint error`, `type error`, `test break`) por recorte.
2. **Regras de hook críticas** e efeitos colaterais de runtime.
3. **`any` de fronteira de integração** (IO, adapters, workers).
4. **Warnings não bloqueantes** apenas após estabilizar os três níveis acima.

---

## 3) Trilhas técnicas iniciais (v1, sem executar correção nesta task)

## T1 — Lint Hardening Seguro
- **Objetivo:** reduzir erros bloqueantes sem guerra global.
- **Estratégia:** executar lint por famílias de arquivos e abrir lotes curtos.
- **Entrada:** erro reproduzível + arquivo fora da lista protegida.
- **Saída:** lote com diff pequeno, rastreável e reversível.

## T2 — Any-by-Family
- **Objetivo:** diminuir `any` começando por fronteiras com baixo risco.
- **Estratégia:** família por família (ex.: utilitários, adapters, camada lib específica), sem atravessar o core todo.
- **Entrada:** ocorrência comprovada e tipo alvo definido.
- **Saída:** tipagem explícita e testes/checagens mantendo comportamento.

## T3 — Hook-Rules Críticos
- **Objetivo:** eliminar violações que possam gerar bug intermitente.
- **Estratégia:** tratar primeiro regras críticas de hooks e dependências de efeitos com risco funcional.
- **Entrada:** erro de lint/hook com impacto potencial em execução.
- **Saída:** componente estável e regra atendida.

## T4 — Workers / Libs Sensíveis
- **Objetivo:** endurecer pontos de integração que podem propagar falha.
- **Estratégia:** separar correções locais (A0) de mudanças de contrato (A2).
- **Entrada:** incidente técnico ou gap de robustez comprovado.
- **Saída:** correção localizada ou dossiê para Tribunal.

## T5 — Supabase / Functions
- **Objetivo:** aumentar previsibilidade operacional na borda de dados/funções.
- **Estratégia:** priorizar validação de entradas/saídas, erros explícitos e consistência de chamadas.
- **Entrada:** ponto de falha observável ou inconsistência de contrato.
- **Saída:** melhoria local rastreável; alteração estrutural sobe para Tribunal.

## T6 — Warnings Depois
- **Objetivo:** tratar ruído residual sem competir com bloqueadores.
- **Estratégia:** somente após T1..T5 estabilizados no recorte atual.
- **Entrada:** backlog de warning consolidado.
- **Saída:** redução de ruído com baixo risco.

---

## 4) Papel operacional do Codex dentro do NEXUS_OS

### 4.1 Onde o Codex entra
- **Depois da camada soberana**: recebe o protocolo pronto e converte em trilha técnica executável.
- **Dentro da Fase 3**: governa execução técnica por recorte auditável (não por varredura indiscriminada).

### 4.2 O que o Codex pode fazer
- Construir mapas técnicos mínimos e operáveis.
- Executar correções A0/A1 com travão.
- Produzir handoff e registro de canalização em toda conclusão.
- Escalar A2/A3 com evidência objetiva.

### 4.3 O que o Codex não pode fazer
- Reescrever documento soberano.
- Alterar fluxo sagrado ou nomenclaturas centrais.
- Tocar arquivo protegido sem gate exigido.
- Puxar tarefa para Fase 4 ou criar feature nova fora do recorte.

### 4.4 Interação com bulk, Tribunal e handoff
- **Bulk:** permitido apenas com travão etapa a etapa.
- **Tribunal:** obrigatório para mudanças de classe A2.
- **Handoff:** obrigatório sempre; sem handoff + canalização a sessão é inválida para o sistema.

---

## 5) Quadro de bloqueios e encaminhamento

| Situação | Encaminhamento |
|---|---|
| Mudança encosta em `vite.config.ts`, `src/types/index.ts`, `data/projects.ts`, `tailwind.config.ts` | Subir para owner (A3) |
| Mudança altera contrato transversal entre órgãos/fluxos | Subir para Tribunal (A2) |
| Demanda é Fase 4/feature nova | Arquivar como A4 |
| Escopo difuso sem evidência no repositório | Registrar limitação, não inferir |

---

## 6) Definição de pronto desta casca técnica
Este F6 é considerado pronto quando houver:
1. leitura técnica executável do soberano,
2. mapa técnico mínimo com classes de decisão,
3. trilhas iniciais priorizadas,
4. papel do Codex explícito,
5. lista de bloqueios/encaminhamentos sem ambiguidade.
