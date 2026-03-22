# UNIVERSAL_DOMAIN_GRAPH.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** UDG-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Mapear todos os grandes domínios da máquina, os seus subdomínios, roteamentos canônicos, fronteiras e pontos de cooperação — de modo que qualquer fragmento de problema consiga encontrar o seu lugar exacto no grafo.

---

## FRASE CANÔNICA

> O grafo de domínios não é um organograma.
> É o mapa vivo onde cada fragmento de problema percorre até encontrar o núcleo que o resolve.

---

## LEI CENTRAL

O grafo é **orientado** e **adaptativo**:
- orientado: os fragmentos fluem em direcção ao domínio correcto
- adaptativo: o grafo pode crescer com novos domínios sem quebrar os existentes

---

# FAMÍLIA 1 — DOMÍNIOS PRIMÁRIOS

A máquina organiza todo o conhecimento e produção em 12 domínios primários:

| ID | Domínio | Território |
|----|---------|-----------|
| **D01** | Visual | design · UI · UX · identidade · motion · spatial · 3D |
| **D02** | Structural | protocolo · governança · docs canônicos · ops · infra lógica |
| **D03** | Functional | features · flows · dados · APIs · comportamentos · integrações |
| **D04** | Research | exploração · análise · descoberta · síntese · benchmarks |
| **D05** | Learning | formação · onboarding · playbooks · knowledge transfer |
| **D06** | Ecosystem | parceiros · comunidade · rede · ecossistema externo |
| **D07** | Corporate | empresa · entidade legal · estrutura corporativa · governança interna |
| **D08** | Infrastructure | hosting · CI/CD · deployment · runtime · observabilidade |
| **D09** | AI | modelos · prompts · agentes · evals · AI behaviour · pipelines |
| **D10** | Documentation | docs vivos · inventários · manifestos · histórico · ledgers |
| **D11** | Finance | orçamento · custos · pricing · revenue · métricas financeiras |
| **D12** | Security | autenticação · autorização · vulnerabilidades · compliance · privacy |

---

# FAMÍLIA 2 — SUBDOMÍNIOS POR DOMÍNIO PRIMÁRIO

## D01 — Visual

| Subdomínio | Território |
|-----------|-----------|
| D01.1 — Brand Identity | marca · logótipo · linguagem visual · cores · tipografia |
| D01.2 — UI Components | componentes · tokens · design system · primitivos |
| D01.3 — UX Flows | jornadas · interactions · estados · microflows |
| D01.4 — Motion | animação · transições · motion tokens · timing |
| D01.5 — Spatial / World | layout geoespacial · world workspace · 3D |

## D02 — Structural

| Subdomínio | Território |
|-----------|-----------|
| D02.1 — Protocols | leis de operação · guards · regras canônicas |
| D02.2 — Governance | decisões · votações · controlos · accountability |
| D02.3 — Ops Docs | LIVE_STATE · BASTION · HANDOFF_LEDGER |
| D02.4 — Config | ficheiros de configuração · env · settings |

## D03 — Functional

| Subdomínio | Território |
|-----------|-----------|
| D03.1 — Product Features | features do produto · user flows · comportamentos |
| D03.2 — Data Layer | modelos de dados · queries · persistência |
| D03.3 — API Layer | endpoints · contratos · integrações externas |
| D03.4 — State & Logic | state management · business logic · validações |

## D04 — Research

| Subdomínio | Território |
|-----------|-----------|
| D04.1 — Competitive | análise de mercado · benchmarks · comparações |
| D04.2 — Technical | investigação técnica · proof-of-concept · spikes |
| D04.3 — User | pesquisa de utilizadores · insights · feedback |

## D05 — Learning

| Subdomínio | Território |
|-----------|-----------|
| D05.1 — Pioneer Onboarding | como um pioneer entra no sistema |
| D05.2 — Playbooks | guias práticos de execução |
| D05.3 — Knowledge Transfer | handoffs · docs de transição |

## D06 — Ecosystem

| Subdomínio | Território |
|-----------|-----------|
| D06.1 — Partners | integrações · acordos · APIs externas |
| D06.2 — Community | utilizadores · contribuidores · rede |

## D07 — Corporate

| Subdomínio | Território |
|-----------|-----------|
| D07.1 — Legal Entity | entidade · jurisdição · contratos |
| D07.2 — Structure | organização interna · papéis · equipa |
| D07.3 — Policy | políticas internas · código de conduta |

## D08 — Infrastructure

| Subdomínio | Território |
|-----------|-----------|
| D08.1 — Hosting | servidores · cloud · regiões |
| D08.2 — CI/CD | pipelines · builds · deploys · testes |
| D08.3 — Observability | logs · traces · métricas · alertas |
| D08.4 — Runtime | containers · processos · scaling |

## D09 — AI

| Subdomínio | Território |
|-----------|-----------|
| D09.1 — Models | selecção · versioning · fallbacks |
| D09.2 — Prompts | templates · refinement · evals |
| D09.3 — Agents | architects · executors · roles |
| D09.4 — Pipelines | fluxos de AI · toolchains · evals |

## D10 — Documentation

| Subdomínio | Território |
|-----------|-----------|
| D10.1 — Canonical Docs | CLAUDE.md · DNA_PROTOCOL · manifestos |
| D10.2 — Inventories | registos de estado · históricos |
| D10.3 — Reference Pools | pools de contexto · bases de referência |

## D11 — Finance

| Subdomínio | Território |
|-----------|-----------|
| D11.1 — Costs | infraestrutura · ferramentas · modelos |
| D11.2 — Revenue | pricing · invoicing · metrics |
| D11.3 — Budget | alocação · runway · projecções |

## D12 — Security

| Subdomínio | Território |
|-----------|-----------|
| D12.1 — Auth | autenticação · sessões · tokens |
| D12.2 — Authz | permissões · roles · controlo de acesso |
| D12.3 — Compliance | GDPR · auditoria · regulação |
| D12.4 — Vulnerabilities | patches · scanning · incident response |

---

# FAMÍLIA 3 — FRONTEIRAS ENTRE DOMÍNIOS

As fronteiras não são muros.
São **pontos de cooperação** onde dois domínios se tocam.

| Fronteira | Domínios | Tensão | Resolução |
|---------|--------|--------|-----------|
| Visual ↔ Functional | D01 / D03 | design vs. lógica de produto | Framer define · Cursor realiza |
| Structural ↔ Corporate | D02 / D07 | protocolo vs. decisão empresarial | protocolo informa · owner decide |
| AI ↔ Functional | D09 / D03 | agente vs. feature viva | AI como capability dentro de feature |
| Infra ↔ Security | D08 / D12 | velocidade vs. compliance | gates de segurança no pipeline |
| Documentation ↔ Structural | D10 / D02 | docs vivos vs. protocolo fixo | docs confirmam protocolo · nunca substituem |
| Research ↔ Product | D04 / D03 | descoberta vs. entrega | spike → decision → feature |

---

# FAMÍLIA 4 — ROTEAMENTOS CANÔNICOS

Quando um fragmento de problema aparece com estes sinais, o grafo aponta para:

| Sinal no problema | Domínio | Bloco activation |
|------------------|---------|-----------------|
| "mudar cor / layout / identidade" | D01 | Visual pioneers |
| "protocolo / regra / operação" | D02 | @claude / @copilot |
| "feature / comportamento / dado" | D03 | @cursor / @codex |
| "pesquisar / investigar / comparar" | D04 | Research runner |
| "onboarding / playbook" | D05 | @claude / docs |
| "parceiro / integração externa" | D06 | Ecosystem block |
| "contrato / legal / entidade" | D07 | Corporate block |
| "deploy / infra / pipeline" | D08 | Infra block |
| "modelo / prompt / agente" | D09 | AI block |
| "doc canônico / inventário" | D10 | @claude / @copilot |
| "custo / orçamento / pricing" | D11 | Finance block |
| "auth / permissão / vulnerabilidade" | D12 | Security block |

---

# FAMÍLIA 5 — GRAFO DE DEPENDÊNCIAS COMUNS

Alguns domínios dependem estruturalmente de outros:

```
D12 (Security) ←── protege ──→ D08 (Infra) + D03 (Functional) + D07 (Corporate)

D10 (Documentation) ←── regista ──→ todos os outros domínios

D02 (Structural) ←── governa ──→ D03 + D09 + D08 + D07

D09 (AI) ←── potencia ──→ D03 + D04 + D01 + D05

D01 (Visual) ←── realiza ──→ D03 (para componentes de produto)

D04 (Research) ←── informa ──→ D03 + D01 + D09
```

---

# FAMÍLIA 6 — REGRAS DE CONFLITO DE DOMÍNIO

Quando um fragmento parece pertencer a 2 domínios ao mesmo tempo:

```
CONFLITO DE DOMÍNIO
1. Qual domínio define a NATUREZA do output? → dono soberano
2. Qual domínio define o CONTEXTO de execução? → cooperador
3. O owner soberano pode resolver sem o cooperador? → se sim, resolve local
4. Precisa de cooperação? → activar padrão de cooperação (ver PIONEER_ROLE_BINDINGS)
```

Exemplo:
- "redesenhar o ecrã de login com nova marca" → D01 soberano (visual) · D03 cooperador (auth flow)

---

# FAMÍLIA 7 — GRAFO DE CRESCIMENTO

O grafo pode crescer sem quebrar os domínios existentes.

## Regras de adição de novo domínio

1. O novo domínio tem território claramente distinto dos 12 existentes?
2. Tem subdomínios próprios?
3. Tem fronteiras definidas com domínios existentes?
4. Tem pioneer binding?
5. Owner aprovou?

Se todas as respostas forem sim → adicionar com ID D13+

---

# FAMÍLIA 8 — GRAFO VISUAL (REPRESENTAÇÃO TEXTUAL)

```
                         ┌───────────┐
                         │  INTAKE   │
                         └─────┬─────┘
                               │
              ┌────────────────▼─────────────────┐
              │        DOMAIN TRIAGE              │
              └──┬─────┬──────┬──────┬──────┬────┘
                 │     │      │      │      │
               D01   D02    D03    D04    D05
              Visual Struct Funct  Rsch  Learn
                 │     │      │      │      │
               D06   D07    D08    D09    D10
              Eco   Corp   Infra    AI    Docs
                              │      │
                            D11    D12
                           Finance  Sec
                 │     │      │      │      │
              ┌──▼─────▼──────▼──────▼──────▼──┐
              │     COOPERATIVE RESOLUTION       │
              └──────────────┬──────────────────┘
                             │
                    ┌────────▼────────┐
                    │  RECONCILIATION  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     OUTPUT       │
                    └─────────────────┘
```

---

# FAMÍLIA 9 — AUDIT RULE

O grafo deve ser auditado quando:
- um novo domínio é pedido com frequência não coberta
- um domínio existente parece demasiado grande para um só bloco
- dois domínios têm conflito repetido não resolvido

Audit executor: @claude / orquestrador
Frequência: por sprint ou quando detectado

---

# FAMÍLIA 10 — CHECKLIST DO DOMAIN GRAPH

1. Fragmento de problema tem domínio primário identificado?
2. Subdomínio confirmado?
3. Fronteiras com outros domínios mapeadas?
4. Roteamento canônico aplicado?
5. Conflito de domínio resolvido se existia?
6. Grafo de dependências verificado?
7. Output compatível com o domínio soberano?

---

```
universal_domain_graph_initialized          ✓
12_dominios_primarios_definidos             ✓
subdomínios_por_domínio                     ✓
fronteiras_e_pontos_de_cooperacao           ✓
roteamentos_canonicos_por_sinal             ✓
grafo_de_dependencias_comum                 ✓
regra_de_crescimento_do_grafo               ✓
```

---

_UNIVERSAL_DOMAIN_GRAPH v1.0 — cravado em 2026-03-22 | @claude | UDG-001_
