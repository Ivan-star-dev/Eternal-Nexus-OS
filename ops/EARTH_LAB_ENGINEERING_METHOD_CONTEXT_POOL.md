# EARTH_LAB_ENGINEERING_METHOD_CONTEXT_POOL.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** ENG-POOL-002
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Definir como software sério é construído em 2026 quando o objectivo não é output de hobby, mas desenvolvimento de produto digital premium, de alta qualidade, que se move rápido, assistido por IA e de grau de produção.

---

## LEI CENTRAL

O método de engenharia deve optimizar para:
- velocidade · qualidade · rollback safety · observabilidade · repetibilidade
- AI leverage · version control forte · evaluation e review loops

---

# FAMÍLIA 1 — COMPRESSÃO HISTÓRICA DA PRÁTICA DE ENGENHARIA

## Arco Histórico

Software engineering maturou de:
- coding manual e ops manual
- releases pouco frequentes
- ambientes frágeis
- rollback fraco
- automação limitada

para:
- CI/CD · infrastructure as code · automated testing · safe deployment patterns
- platform engineering · AI-assisted development · agentic workflows

## Regra de Compressão 2026

Não começar de métodos dos anos 90 ou início de 2010 a menos que a lição histórica importe.
Começar do padrão combinado mais forte actual:
- version control forte
- pipelines automatizados
- observabilidade de produção
- safe rollout / rollback
- platform primitives
- AI-assisted coding e review
- evaluation loops

---

# FAMÍLIA 2 — VERSION CONTROL E DISCIPLINA DE MUDANÇA

## Padrão Preferido 2026

Version control é um **sistema de segurança**, não apenas um histórico de ficheiros.
Num mundo assistido por IA, version control forte torna-se mais importante, não menos.

### Métodos Canônicos
- commits frequentes · branch discipline · diffs revisáveis · rollback awareness
- alinhamento branch/mission · rastreabilidade de mudança

## Porquê vence em 2026

DORA 2025 aponta version control forte e rollback como críticos em AI-assisted software delivery.
AWS Builders' Library centra safe delivery em testes automatizados e disciplina de deployment.

## Backup / Cooperação

Fluxo trunk-oriented mais estrito ou branch-per-mission, dependendo do risco de produto e estrutura de equipa.

---

# FAMÍLIA 3 — CI/CD E SAFE DELIVERY

## Padrão Preferido 2026

Continuous delivery com:
- testes unitários automatizados · testes de integração · pre-production checks
- load/security checks onde relevante · automação de deployment
- lógica de rollback automático · progressive rollout / safe exposure

## Porquê vence

AWS Builders' Library enfatiza testes automatizados em todo o pipeline e deployments safe e hands-off com verificação de rollback.

## Backup / Cooperação

Pipeline de staged release com gates de aprovação manual para mudanças de alto risco.

---

# FAMÍLIA 4 — TESTING E QUALIDADE NA ERA AGENTIC

## Padrão Preferido 2026

Testing não pode depender apenas de suites end-to-end lentas e mantidas manualmente.
O padrão mais forte actual mistura:
- cobertura unit/integration · targeted testing just-in-time
- AI-assisted review · policy checks
- eval flywheels para prompts/agents · sinais de saúde de produção

## Porquê vence

Meta defende que agentic development aumenta velocidade de software e força testing a ser mais rápido e adaptativo.
Microsoft reporta grandes ganhos de AI-powered PR review.
OpenAI empurra eval loops para sistemas AI robustos.

## Backup / Cooperação

Testing em camadas tradicional + AI-assisted review, mesmo que JIT testing ainda não esteja maduro.

---

# FAMÍLIA 5 — AI-NATIVE DEVELOPMENT METHOD

## Padrão Preferido 2026

Developers não devem apenas "usar IA".
Devem construir um ambiente onde IA consegue fazer trabalho útil de forma fiável.

### Métodos Canônicos
- prompt templates para tasks recorrentes
- agentes com ferramentas conectadas
- escopos de acesso claros
- long-horizon task routing
- prompts operacionais reutilizáveis
- estrutura de repo agent-friendly
- superfícies fortes de observabilidade e debugging

## Porquê vence

OpenAI defende que o progresso vem de construir o scaffolding, ferramentas e estrutura interna certos em torno dos agentes.

## Backup / Cooperação

Coding liderado por humanos com assistência IA para review, refactor, search e debugging antes de maior autonomia de agentes.

---

# FAMÍLIA 6 — PLATFORM ENGINEERING E ALAVANCAGEM INTERNA

## Padrão Preferido 2026

Não resolver o mesmo atrito de engenharia repetidamente à mão.
Construir ou usar platform primitives que aumentam alavancagem:
- templates reutilizáveis · ambientes standard · design systems
- observabilidade partilhada · rails de deployment standard
- padrões standard de auth / config

## Porquê vence

DORA 2025 destaca platform engineering e prioridades estáveis como factores-chave de sucesso organizacional.

## Backup / Cooperação

Uma plataforma interna de developer mais pequena com apenas os caminhos de maior atrito abstraídos primeiro.

---

# FAMÍLIA 7 — OBSERVABILIDADE E DEBUGGING

## Padrão Preferido 2026

Todo sistema significativo deve nascer observável:
- logs · traces · metrics · health checks · deployment history
- environment context · error clustering / analysis support

## Porquê vence

AWS Builders' Library trata health checks, rollback safety e deployment feedback como mecanismos core de fiabilidade.

## Backup / Cooperação

Structured logs + modelo metrics-first se full tracing for demasiado pesado inicialmente.

---

# FAMÍLIA 8 — QUALIDADE DE CÓDIGO E REVIEW

## Padrão Preferido 2026

Code review é agora aumentado por IA em escala, não substituído pelo caos.

### Métodos Canônicos
- AI-assisted PR review · policy enforcement
- style e complexity checks · architectural review em mudanças de alto risco
- review templates · human judgment em mudanças críticas de produto

## Porquê vence

Microsoft reporta AI-assisted code review a escalar para a maioria dos PRs internamente.

## Backup / Cooperação

Review manual + targeted AI review em áreas de risco ou repetitivas.

---

# FAMÍLIA 9 — LÓGICA DE SELECÇÃO DE STACK 2026

## Regra Canônica

A melhor stack não é "a ferramenta mais nova".
É o fit actual mais forte para:
- tipo de produto · requisitos de performance · constrains de deployment
- leverage do ecossistema · capacidade de team/agent de a manter

## Padrão Preferido 2026 para produtos como Earth Lab

- sistemas frontend/backend tipados
- UI component-driven
- camada geoespacial/runtime forte
- CI/CD e preview workflows
- observabilidade desde o início
- tooling e organização de codebase AI-compatible

## Backup / Cooperação

Stack de app tipada mais simples com menos partes móveis, desde que escalabilidade futura seja preservada.

---

# FAMÍLIA 10 — CHECKLIST DE ENGENHARIA PARA PIONEERS

Quando escolher como construir, perguntar:
1. É assim que equipas de alto desempenho ainda escolheriam trabalhar em 2026?
2. Melhora alavancagem, segurança ou velocidade de iteração?
3. Encaixa em AI-assisted / agentic development?
4. Melhora rollback, testing e observabilidade?
5. Reduz atrito futuro em vez de adicionar conveniência local?
6. Mantém o projecto mais próximo da ambição flagship?

---

```
earth_lab_engineering_method_context_pool_initialized   ✓
10_familias_de_engenharia_definidas                     ✓
padrao_2026_preferido_vs_backup_por_familia             ✓
identity_bias_preservado                                ✓
```

---

_EARTH_LAB_ENGINEERING_METHOD_CONTEXT_POOL v1.0 — cravado em 2026-03-22 | @claude | ENG-POOL-002_
