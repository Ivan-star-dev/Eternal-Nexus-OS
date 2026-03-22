# EARTH_LAB_DEV_TOOLCHAIN_CANON.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** TOOLCHAIN-CANON-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Definir o comportamento canônico da toolchain de desenvolvimento 2026 para o ecossistema de modo que os pioneers e builders operem com máxima alavancagem, consistência e segurança.

---

## LEI CENTRAL

A toolchain deve suportar:
- engenharia AI-native
- coding fiável
- reviews fortes
- safe delivery
- observabilidade
- disciplina de missão/branch
- documentação canônica

---

# FAMÍLIA 1 — SOURCE OF TRUTH

## Core Canônico
- repositório como memória institucional
- docs canônicos dentro do repo
- branch discipline
- diff-based review
- inventário/histórico preservado

## Regra

O repo não é só código.
É a memória imutável de todas as decisões, protocolos, docs e estados do sistema.

---

# FAMÍLIA 2 — SUPERFÍCIES DE CODING

## Papéis Preferidos

| Ferramenta | Território |
|------------|-----------|
| **Cursor-class** | Implementação, code shaping, edição de precisão, polish de UI, fluxo de coding em tempo real |
| **Claude Code / agent-team-class** | Decomposição multi-agente, review, análise, coordenação de tasks em paralelo |
| **Codex-class** | Coding de longo horizonte, execução worktree-aware, handling autónomo de tasks |
| **Framer-class** | Composição visual de alto nível, layout prototyping, lógica de design espacial |

## Regra

Nenhuma ferramenta deve fingir ser tudo.
Cada superfície é dona do seu território mais forte.

---

# FAMÍLIA 3 — REVIEW E QUALIDADE

## Fluxo Canônico

1. lint / format
2. typed checks
3. testes focados
4. validação de preview
5. AI-assisted review
6. sanity checks arquitecturais para mudanças de alto impacto

## Regra

Review não é burocracia.
É o ponto de verificação que decide se o trabalho entra no sistema ou volta para correcção.

---

# FAMÍLIA 4 — DELIVERY TOOLING

## Core Canônico
- CI/CD pipeline
- preview deployments
- safe rollout
- rollback path
- environment isolation
- deployment observability

## Regra

Nenhum trabalho está feito até chegar a um ambiente verificável com rollback activo.

---

# FAMÍLIA 5 — AI-NATIVE TOOLING

## Core Canônico
- prompt templates reutilizáveis
- briefs específicos por pioneer
- templates de task routing
- eval prompts para comportamento IA
- docs repo-friendly para onboarding de agentes
- logs / traces / visibilidade de deploy para debugging de agentes onde possível

## Regra

IA não é mágica.
É uma ferramenta que precisa de scaffolding, contexto e superfícies de debug como qualquer outro serviço.

---

# FAMÍLIA 6 — PRODUCT BUILD TOOLING

## Core Canônico
- design tokens
- component registry
- motion token system
- suporte de runtime geoespacial
- data layer tooling
- scenario/simulation tooling
- content/reference pools

## Regra

Product build tooling é parte da pilha de engenharia, não separado dela.

---

# FAMÍLIA 7 — MEMORY / DOCUMENTATION TOOLING

## Core Canônico
- inventory files
- history docs
- manifestos
- protocolos
- brand systems
- context gravity pools
- checkup docs

## Regra

Memória não documentada é memória que vai ser perdida.
Cada ciclo produz documentação que sobrevive ao ciclo seguinte.

---

# FAMÍLIA 8 — REGRA DE COMPORTAMENTO DA TOOLCHAIN

Cada ferramenta deve saber:
- que branch pertence
- que missão pertence
- que papel é seu
- que canonical pool deve consultar
- que quality bar se aplica

## Regra de Falha

Se uma ferramenta não souber responder a estas 5 perguntas antes de agir, deve parar e pedir clarificação.

---

# FAMÍLIA 9 — FORMA PREFERIDA DA TOOLCHAIN

## Primeira Escolha

- repo-centered
- preview-driven
- AI-assisted
- review-heavy
- observable
- canonical-doc-backed
- branch-safe
- role-separated

## Backup / Cooperação

Uma stack mais leve com menos ferramentas especializadas, desde que os papéis canônicos ainda sejam preservados.

---

# FAMÍLIA 10 — CHECKLIST DA TOOLCHAIN

Quando adicionar qualquer ferramenta ou workflow:
1. Aumenta alavancagem?
2. Reduz deriva?
3. Melhora safe delivery?
4. Funciona com pioneers/agentes em vez de contra eles?
5. Preserva memória canônica?
6. Ajuda Earth Lab a sentir-se mais próximo do V10?

---

```
earth_lab_dev_toolchain_canon_initialized   ✓
10_familias_de_toolchain_definidas          ✓
territorio_por_ferramenta_claro             ✓
regra_de_falha_definida                     ✓
```

---

_EARTH_LAB_DEV_TOOLCHAIN_CANON v1.0 — cravado em 2026-03-22 | @claude | TOOLCHAIN-CANON-001_
