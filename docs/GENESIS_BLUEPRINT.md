# GENESIS BLUEPRINT — Memória do Arquiteto

**Classificação:** PRIVADO — cofre interno do sistema
**Versão:** v1
**Data de selagem:** 2026-03-20
**Task:** GENESIS-FOUNDER-001
**Modelo:** claude-sonnet-4-6

> Este documento é a memória viva do arquiteto.
> Não é apresentação. Não é marketing. É cofre.
> Contém a história da ideia, o blueprint de reconstrução, e o mapa da evolução.
> Se o sistema precisar ser reconstruído do zero, este é o ponto de partida.

---

## PARTE I — A ORIGEM DA VISÃO

### O que o sistema queria resolver

O problema não era técnico. Era de governança.

Quando múltiplos agentes de IA trabalham num mesmo produto em sessões separadas, sem memória partilhada, sem protocolo de estado, sem controle de quem fez o quê — o resultado inevitável é deriva. Cada sessão começa do zero. Cada agente reinventa o contexto. A qualidade oscila. A arquitetura desintegra.

A visão fundadora foi simples e decisiva: **se agentes de IA vão operar como um time, eles precisam de um sistema operacional — não de ferramentas isoladas.**

O que se queria construir não era um projeto. Era um sistema que governa projetos. Um OS que corre por baixo do produto, garantindo que:
- o estado é sempre observável
- as decisões são sempre rastreáveis
- a qualidade cresce a cada camada
- a linha principal nunca para
- o owner decide sobre o que importa — não sobre o que é ruído

### A ideia refinada ao longo do tempo

A ideia não nasceu completa. Foi sendo destilada por decisões:

1. **Primeiro insight:** sem handoff formal, cada sessão é uma ilha. Solução: handoff obrigatório antes de qualquer transição.

2. **Segundo insight:** agentes diferentes têm papéis diferentes. Um abre caminho; outro refina o que foi aberto; outro poli o que foi refinado. Não são iguais — são uma escada.

3. **Terceiro insight:** o estado do sistema não pode viver só na cabeça do owner. Precisa de um artefato vivo, observável, atualizado pelos próprios executores. Solução: LIVE_STATE.md + HANDOFF_LEDGER.md como camada NLF.

4. **Quarto insight:** com volume crescente de handoffs, o owner não pode ler N sessões separadas. Precisa de um consolidador. Solução: Codex como consolidador de fase/onda — emite um relatório-mãe único.

5. **Quinto insight:** a forma de saída é parte da identidade do sistema. Se cada agente emite num formato diferente, a legibilidade colapsa com escala. Solução: OUTPUT_STANDARD — blocos copiáveis únicos, layout fixo.

Cada insight fechou um buraco de governança. O sistema foi sendo construído de dentro para fora.

---

## PARTE II — GRANDES VIRADAS E DESCOBERTAS

### Virada 1 — O Protocolo como Entidade

A descoberta mais importante: **o protocolo não é uma regra escrita. É uma entidade que reside nos artefatos e é executada pelos agentes.**

A diferença entre "guidelines no README" e "10 Leis Absolutas com consequências explícitas" é a diferença entre sugestão e soberania. O sistema passou a tratar o protocolo como o código que roda o OS — não como documentação de apoio.

### Virada 2 — Worktrees Semânticos, Não Físicos

Descoberta operacional crítica: `wt-*` são rótulos cognitivos, não diretórios Git reais. O sistema usa um único worktree físico. A semântica de `wt-estrutura-nucleo-vivo` identifica a frente cognitiva do executor — não um espaço físico separado. Isso simplifica radicalmente a gestão de branches sem sacrificar a clareza de estado.

### Virada 3 — O Fluxo Sagrado é a Identidade do Produto

`Tribunal → Atlas → Index → News` não é apenas uma ordem de navegação. É o DNA do produto. Dar um nome a esse fluxo e protegê-lo por Lei (Lei 3 das 10 Leis Absolutas) foi transformador: criou um centro de gravidade imutável em torno do qual tudo o resto orbita.

### Virada 4 — O Owner como Árbitro, Não como Blocador

O sistema foi projetado para que o owner decida sobre o que importa — e apenas sobre isso. As 3 decisões bloqueantes (B-001, B-002, B-003) são as únicas onde o owner é o gargalo. Tudo o resto avança com autonomia. Essa separação foi deliberada: **o owner não gerencia sessões — aprova direções.**

### Virada 5 — A Saída Copiável como Protocolo de Interface

A realização de que o formato de output de cada agente é uma interface — não um estilo pessoal. Se a interface varia por agente, o owner paga o custo de adaptação a cada sessão. O OUTPUT_STANDARD selou isso: estrutura imutável, beleza pode variar.

---

## PARTE III — PRINCÍPIOS ARQUITETURAIS CONSOLIDADOS

### 1. Protocolo Primeiro, Entrega Segundo

Nenhum agente entrega sem confirmar que opera dentro do protocolo. Entrega sem protocolo é ruído. Protocolo sem entrega é burocracia. O sistema existe para ser os dois simultaneamente.

### 2. Linha Principal Inquebrável

A linha principal (Claude → Codex → Copilot) nunca para. Cada pioneiro tem uma camada de gap em relação ao anterior. Isso garante que o atraso de um não trava o avanço do próximo.

### 3. Qualidade Crescente por Camada

Não se poli o que não foi refinado. Não se refina o que não foi entregue. A escada impõe ordem natural de qualidade: funcional → correto → belo.

### 4. Rastreabilidade Total

Cada decisão tem evidência. O ledger é append-only — nunca edita entradas existentes. O LIVE_STATE é atualizado pelo próprio executor após cada sessão. O sistema é auditável sem esforço extra.

### 5. Identidade Preservada por Lei

O fluxo sagrado, os nomes dos órgãos centrais, os arquivos protegidos — todos têm proteção por lei explícita (NEXUS_OS.md, 10 Leis). Não são convenções. São invariantes do sistema.

### 6. Escalabilidade sem Caos

Volume crescente de agentes e sessões não aumenta caos — aumenta capacidade. O Codex consolida sem bloquear. A Micro Team refina sem bloquear. Os gates de handoff garantem sequência sem congestionamento.

---

## PARTE IV — MAPA DO SISTEMA COMPLETO

### Camadas do sistema

```
CAMADA 0 — SOBERANIA
  docs/NEXUS_OS.md         → Constituição do sistema (10 Leis, 24 seções)
  docs/DOC_FASE3.md        → Escopo da Fase 3 ativa

CAMADA 1 — PROTOCOLO
  docs/DOC_BULKING_ESCADA.md   → Como os pioneiros se movem em escada
  docs/DOC_BULK_PROTOCOL.md    → 4 blueprints operacionais (mapa, preflight, guard, timeline)
  docs/DOC_MICRO_TEAM.md       → Linha paralela de refinamento
  docs/DOC_TRIBUNAL_E4.md      → O único portão para o core

CAMADA 2 — OPERAÇÃO VIVA
  ops/NLF.md               → Definição do Nexus Live Fabric (soberano, só muda via Tribunal)
  ops/FOL.md               → Factory Operating Layer (protocolo de leitura/escrita por executor)
  ops/LIVE_STATE.md        → Estado vivo atual — a única fonte de verdade em tempo real
  ops/HANDOFF_LEDGER.md    → Ledger append-only de todos os handoffs

CAMADA 3 — PADRÃO DE OUTPUT
  ops/OUTPUT_STANDARD.md  → HANDOFF_TABLE + CANALIZACAO_TABLE + RELATORIO_MAE_TABLE
  ops/CODEX_CONSOLIDATOR.md → Blueprint do relatório-mãe do Codex

CAMADA 4 — PRODUTO
  src/                    → Código do produto (React/Vite/Supabase)
  .github/                → CI/CD (quality gate, database tests)

CAMADA 5 — INSTRUÇÕES AOS AGENTES
  AGENTS.md               → Regras operacionais para todos os pioneiros
  .github/copilot-instructions.md → Instruções específicas para Copilot
```

### Os Pioneiros e seus Papéis

| Pioneiro | Papel | Momento na Escada | Restrição |
|---|---|---|---|
| **@claude** | Desbravador | Abre camadas N | Entrega antes de ir para N+1 |
| **@codex** | Refinador Técnico | Refina camada N-1 | Só entra após handoff de Claude |
| **@copilot** | Polidor | Poli camada N-2 | Só entra após handoff de Codex |
| **@cursor** | Desbloqueador | Slots variáveis fora da escada | Atua em backlog mecânico |
| **Micro Team** | Observação + Pesquisa | Linha paralela | Nunca entra no core sem Tribunal |

### O Fluxo Sagrado

```
Tribunal → Atlas → Index → News
```

Inviolável. Nome canônico. Ordem canônica. Qualquer alteração viola Lei 3.

### As 10 Leis Absolutas (resumo)

1. Nunca simplificar o projeto
2. Nunca renomear Tribunal, Atlas, Index, News
3. Nunca alterar o fluxo sagrado
4. Nunca quebrar `vite.config.ts`
5. Nunca tocar `src/types/index.ts` sem aprovação explícita
6. Nunca tocar `data/projects.ts` sem instrução do owner
7. Nunca tocar `tailwind.config.ts` (cores/fontes)
8. Nunca operar fora da fase ativa
9. Nunca entregar sem handoff
10. Nunca entrar no core sem julgamento do Tribunal

### Os Bloqueadores Ativos (estado em 2026-03-20)

| ID | Bloqueio | Decide |
|---|---|---|
| B-001 | `.env` no histórico git — secrets reais ou placeholders? | Owner |
| B-002 | PM canônico: npm vs bun? | Owner |
| B-003 | `antigravity/legacy-html/` — manter ou remover? | Owner |

---

## PARTE V — O QUE FOI APRENDIDO

### Sobre governança de agentes IA

- **Agentes de IA não precisam de mais ferramentas — precisam de protocolo.** A diferença entre uma sessão produtiva e uma sessão que deriva não é o modelo. É a estrutura que o cerca.
- **Estado externo bate memória interna.** Agentes operam em sessões discretas. O estado que importa precisa estar nos artefatos — não na expectativa de continuidade de contexto.
- **Handoff é uma tecnologia.** Não é cortesia. É o mecanismo que abre gates, transfere contexto, garante rastreabilidade e define quando uma camada fecha.
- **Consolidação reduz carga cognitiva do owner.** Com múltiplos agentes e sessões, o owner não pode ler tudo. O Codex como consolidador resolve isso com um relatório-mãe.

### Sobre identidade de sistema

- **A forma de saída é parte da identidade.** OUTPUT_STANDARD v1 selou isso.
- **Nomes são invariantes.** Renomear um órgão é mudar o DNA. O sistema protege nomes com lei.
- **Beleza varia; estrutura não.** Pioneiros podem decorar o output — mas os campos e a ordem são fixos.

### Sobre o owner

- **O owner não deve gerenciar sessões — deve aprovar direções.** O sistema existe para que o owner leia um relatório e decida próximos passos, não para que depure handoffs individuais.
- **Decisões do owner são gates, não dependências.** O sistema avança sem o owner até chegar num gate. O gate espera. O resto não.

---

## PARTE VI — COMO RECONSTRUIR DO ZERO

Se o sistema precisar ser reconstruído em novo repositório ou com novos agentes, seguir esta ordem:

### Passo 1 — Constituição
Criar `docs/NEXUS_OS.md` com:
- Missão e princípio-mãe
- Fluxo sagrado (definido com nomes canônicos desde o início)
- 10 Leis Absolutas
- Definição dos 4 Pilares (Estrutura, Produto, Qualidade, Lapidação)
- Definição das Fases

### Passo 2 — Protocolo da Escada
Criar `docs/DOC_BULKING_ESCADA.md` com:
- Diagrama da escada no tempo
- Papéis de cada pioneiro
- Regra do gap (1 camada de distância)
- Ciclo de vida da camada
- 13 Linhas Vermelhas

### Passo 3 — Protocolo de Execução
Criar `docs/DOC_BULK_PROTOCOL.md` com:
- Mapa de Execução (obrigatório antes de qualquer escrita)
- Preflight Gate (verificação pré-commit)
- Canalization Guard (parar se drift)
- Timeline Visual

### Passo 4 — Camada Viva
Criar a pasta `ops/` com:
1. `ops/NLF.md` — definição do Nexus Live Fabric
2. `ops/FOL.md` — protocolo de leitura/escrita dos executores
3. `ops/LIVE_STATE.md` — estado vivo inicial (zerável)
4. `ops/HANDOFF_LEDGER.md` — ledger vazio (append-only a partir daqui)

### Passo 5 — Consolidação
Criar `ops/CODEX_CONSOLIDATOR.md` com:
- Papel do Codex como consolidador sem branch alinhado
- Blueprint do relatório-mãe
- Frequência de consolidação

### Passo 6 — Padrão de Output
Criar `ops/OUTPUT_STANDARD.md` com:
- HANDOFF_TABLE (13 campos)
- CANALIZACAO_TABLE (7 campos)
- RELATORIO_MAE_TABLE (Codex)
- Identidade operacional (estrutura imutável)

### Passo 7 — Instruções aos Agentes
Criar `AGENTS.md` com:
- Quem são os pioneiros e seus papéis
- Onde ler antes de escrever
- Anti-drift explícito
- Referência a todos os documentos de protocolo

### Passo 8 — CI/CD
Criar `.github/workflows/app-quality.yml` com:
- Lint, typecheck, test, build
- Gate de qualidade que bloqueia merge sem passa

### Após reconstrução
O sistema está pronto quando:
- `ops/LIVE_STATE.md` tem estado inicial correto
- `AGENTS.md` tem todos os pioneiros mapeados
- CI passa no branch canônico
- Owner confirmou os bloqueadores iniciais (equivalentes a B-001/B-002/B-003)

---

## PARTE VII — ESTADO FUTURO VISADO

### O sistema maduro

Um sistema Eternal Nexus OS maduro tem:
- Fase 3 fechada por Tribunal com relatório-mãe
- Fase 4 aprovada com escopo definido (expansão produto)
- Micro Team alimentando sugestões ao roadmap sem bloquear a linha principal
- Codex consolidando ondas automaticamente com RELATORIO_MAE_TABLE
- Todos os pioneiros emitindo no mesmo OUTPUT_STANDARD
- Owner lendo apenas o relatório-mãe para decidir

### O produto maduro

O Eternal Nexus (o produto dentro do OS) tem:
- Fluxo sagrado completo (Tribunal → Atlas → Index → News) com todas as telas funcionais
- Layer de Dados completa (7/7 órgãos)
- Galeria de Projetos funcional (PLv6.2-a done)
- Integração com NewsAPI (PLv6.2-b — aguarda gate owner)
- CI verde em todos os merges
- Supabase rodando em produção com autenticação

### O princípio que nunca muda

> Protocolo Primeiro. Entrega Segundo.

Não é uma fase. É a identidade do sistema.

---

*GENESIS_BLUEPRINT.md v1 — selado em 2026-03-20 | claude-sonnet-4-6 | GENESIS-FOUNDER-001*
*Classificação: PRIVADO — cofre do arquiteto*
