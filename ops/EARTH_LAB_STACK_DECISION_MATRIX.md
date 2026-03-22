# EARTH_LAB_STACK_DECISION_MATRIX.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** STACK-MATRIX-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Definir as escolhas de stack mais fortes para Earth Lab e para o ecossistema mais alargado, sempre usando:
- padrão primeira escolha 2026
- padrão segunda escolha backup / cooperação
- alinhamento de identidade
- realismo de escala e manutenção

---

## LEI CENTRAL

A melhor stack não é a stack mais trendy.
É a stack que melhor serve:
- ambição de categoria
- interacção à escala mundial
- workflows da era IA
- necessidades geoespaciais / de simulação
- performance
- observabilidade
- manutenibilidade a longo prazo
- qualidade de execução dos pioneers / agentes

---

# FAMÍLIA 1 — CAMADA DE APLICAÇÃO FRONTEND

## Padrão Preferido

**Arquitectura de aplicação React / Next.js-class tipada** com:
- App Router / server rendering onde benéfico
- UI component-driven
- code splitting ao nível de route
- ergonomia forte de preview/deploy
- contratos tipados
- compatibilidade com design-system

## Porquê

Encaixa perfeitamente em delivery de produto web premium, iteração rápida, preview workflows e ergonomia de coding assistido por IA.

## Backup / Cooperação

Shell de aplicação React tipada mais simples quando features heavy de server ainda não são necessárias.

---

# FAMÍLIA 2 — RUNTIME GEOESPACIAL / WORLD

## Padrão Preferido

**World runtime CesiumJS-class** com suporte para:
- terrain streaming
- 3D Tiles / camadas geoespaciais fotorrealistas onde apropriado
- coreografia de câmara
- sobreposições de dados em camadas
- vistas de mundo temporais e comparativas

## Porquê

Earth Lab é um world workspace, não um dashboard plano.

## Backup / Cooperação

Fallback geoespacial híbrido 2D/2.5D com superfícies 3D focais selectivas.

---

# FAMÍLIA 3 — CAMADA UI / DESIGN SYSTEM

## Padrão Preferido

Um sistema de componentes tokenizado com:
- escala tipográfica
- semântica de cores
- escala de espaçamento
- motion tokens
- primitivos de painel / HUD
- estados acessíveis
- componentes específicos de world-workspace

## Porquê

Necessário para preservar identidade canônica e acelerar implementação.

## Backup / Cooperação

Biblioteca de componentes compacta cobrindo apenas os primitivos críticos mais repetidos em primeiro lugar.

---

# FAMÍLIA 4 — CAMADA BACKEND / API

## Padrão Preferido

Serviços backend tipados com:
- contratos explícitos
- endpoints auth-aware
- persistência de cenário / sessão / memória
- fronteiras de integração IA
- serviços de camada geoespacial / dados
- hooks de observabilidade

### Tecnologias Recomendadas

Usar um backend/runtime tipado moderno apropriado ao deployment e ergonomia da equipa.
Preferir fiabilidade sólida em vez de novidade.

## Backup / Cooperação

Backend-as-a-service mais gateways API tipados para aceleração inicial, se não travar escalabilidade futura.

---

# FAMÍLIA 5 — CAMADA DE DADOS / PERSISTÊNCIA

## Padrão Preferido

Um modelo de persistência em camadas:
- dados relacionais para utilizadores, permissões, cenários, trilhos, boards
- armazenamento de objectos/blobs para artefactos mais pesados
- camada de search/index onde necessário
- caminho de storage/query geoespacialmente consciente onde necessário
- stream de analytics/eventos para compreensão do produto

## Backup / Cooperação

Stack relational-first mais armazenamento externo para assets world/simulation mais pesados.

---

# FAMÍLIA 6 — CAMADA IA / AGENTE

## Padrão Preferido

Serviços IA com ferramentas conectadas com:
- permissões com escopo
- prompt templates
- eval paths
- observabilidade
- task runners reutilizáveis
- bindings específicos por pioneer
- superfícies de assistente contextuais

## Porquê

IA deve funcionar como capability, não decoração desligada.

## Backup / Cooperação

Assistentes task-específicos em primeiro lugar, maior autonomia a seguir.

---

# FAMÍLIA 7 — CAMADA DE COLABORAÇÃO / REAL-TIME

## Padrão Preferido

Arquitectura real-time incremental:
- colaboração async-first
- boards / trilhos partilhados
- upgrades de live room
- lógica de role/permission
- presença apenas onde adiciona valor

## Backup / Cooperação

Colaboração assíncrona e persistência de sessão antes de sessões de world-state totalmente sincronizadas.

---

# FAMÍLIA 8 — CAMADA DE DEPLOYMENT / INFRAESTRUTURA

## Padrão Preferido

Um modelo de deployment acelerado por plataforma com:
- preview environments
- CI/CD forte
- safe rollouts
- rollback paths
- controlos de ambiente
- observabilidade

## Backup / Cooperação

Pipeline de delivery staged mais manual com gates estritos.

---

# FAMÍLIA 9 — CAMADA DE OBSERVABILIDADE / FIABILIDADE

## Padrão Preferido

Stack born-observable:
- logs · traces · metrics
- deployment history · health checks
- visibilidade feature/runtime
- visibilidade do comportamento IA onde relevante

## Backup / Cooperação

Structured logs + modelo metrics-first até tracing mais profundo ser justificado.

---

# FAMÍLIA 10 — MATRIZ DE REGRAS DE DECISÃO

Quando escolher qualquer peça de stack, perguntar:
1. Suporta Earth Lab como world workspace?
2. Mantém-se forte sob desenvolvimento assistido por IA?
3. Preserva performance e safe delivery?
4. Escala em direcção ao V10?
5. O caminho backup também é canônico se necessário?
6. Esta escolha é sólida nos sítios certos e excepcional apenas onde o produto precisa?

---

```
earth_lab_stack_decision_matrix_initialized   ✓
9_familias_de_stack_definidas                 ✓
preferido_2026_vs_backup_por_familia          ✓
boring_where_boring_exceptional_where_needed  ✓
```

---

_EARTH_LAB_STACK_DECISION_MATRIX v1.0 — cravado em 2026-03-22 | @claude | STACK-MATRIX-001_
