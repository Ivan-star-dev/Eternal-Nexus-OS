# ECOSYSTEM_SELF_EVOLUTION_ROUTINE.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** ESER-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Formalizar a rotina pela qual o ecossistema se autotesta, se autorevisita e se autoatualiza — de modo que cada produto fabricado torne a máquina mais poderosa para o produto seguinte.

---

## FRASE CANÔNICA

> O ecossistema deixa de ser apenas o meio de produção e passa a ser também
> objeto contínuo de refinamento, para que cada produto fabricado
> torne a própria máquina mais poderosa.

---

## LEI CENTRAL

O ecossistema não é uma fotografia. É um organismo.
Ele deve:
- se autoentender
- se autotestar
- se autoatualizar
- se autoelevar

E fazê-lo **sem perder identidade** e **sem drift por modismo**.

---

# FAMÍLIA 1 — DOIS NÍVEIS DE EVOLUÇÃO

## Nível 1 — Evolução Contínua (per sprint)

Pequenas melhorias distribuídas em cada ciclo:
- qualidade de protocolo
- clareza de doc canônico
- routing mais preciso
- pools mais ricos
- binding mais alinhado

## Nível 2 — Evolução Sistémica (per major cycle)

Revisão profunda do ecossistema como um todo:
- reavaliação de stack
- reavaliação de capability
- reavaliação de toolchain
- reavaliação de pioneer roles
- reavaliação de context pools
- reavaliação de pulses
- gap audit contra V10 target

---

# FAMÍLIA 2 — ROTINA DE AUTO-TESTE

O ecossistema realiza auto-teste nas seguintes dimensões:

```
ECOSYSTEM AUTO-TEST
───────────────────────────────────────────────────────────────
DIMENSÃO             | PERGUNTA DE TESTE
─────────────────────|─────────────────────────────────────────
Protocol Coherence   | Os protocolos soberanos ainda são coerentes entre si?
Domain Graph         | O domain graph ainda cobre todos os problemas que chegam?
Routing Accuracy     | As tasks estão a ir para os núcleos certos?
Pulse Health         | Os pulses estão a ser aplicados e a produzir resultado?
Pioneer Alignment    | Os pioneers estão a operar nos seus territórios?
Context Pool Quality | Os pools contêm o contexto relevante actual?
Capability Coverage  | A máquina consegue resolver todos os tipos de task pedidos?
Plugin Fabric Fit    | Os plugins activos continuam a ser os mais adequados?
V10 Line Sync        | O ecossistema está na maturidade certa para o produto actual?
Block Maturation     | Os blocos activos estão a amadurecer em paralelo com o produto?
───────────────────────────────────────────────────────────────
```

---

# FAMÍLIA 3 — ROTINA DE AUTO-REVISÃO

Após cada auto-teste, o sistema executa uma revisão dirigida:

```
ECOSYSTEM AUTO-REVIEW
──────────────────────────────────────────────────────────
Resultado do auto-teste → gap detectado?
  → sim: abrir task de upgrade canônico
  → não: registar saúde confirmada no LIVE_STATE

Para cada gap:
  1. Qual dimensão está em défice?
  2. Qual é o custo de não corrigir?
  3. Qual é o esforço de corrigir?
  4. Qual pioneer pode contribuir?
  5. Qual gate precisa de ser aberto?
──────────────────────────────────────────────────────────
```

---

# FAMÍLIA 4 — ROTINA DE AUTO-ATUALIZAÇÃO

Regras para que um upgrade entre no ecossistema:

```
ECOSYSTEM UPGRADE GATE
───────────────────────────────────────────────────────────
CRITÉRIO                              | PASSA?
──────────────────────────────────────|────────────────────
Melhora o sistema (não só o produto)  | obrigatório
É identity-aligned                    | obrigatório
É 2026-realista (não futurismo)       | obrigatório
Não quebra núcleo fixo                | obrigatório
Owner aprovou                         | obrigatório
Tem rollback definido                 | obrigatório
Tem observability                     | recomendado
───────────────────────────────────────────────────────────
Rejeitar se:
- upgrade por modismo
- upgrade sem benefício mensurável
- upgrade que viola soberania de protocolo
- upgrade que cria dependência não sustentável
───────────────────────────────────────────────────────────
```

---

# FAMÍLIA 5 — REAVALIAÇÃO DE STACK E CAPABILITY

## Frequência

| Tipo | Frequência |
|------|-----------|
| Stack spot-check | por sprint |
| Stack deep review | por major cycle |
| Capability audit | por major cycle |
| Tool/plugin audit | por major cycle ou quando detectado gap |

## Critérios de reavaliação de stack

```
STACK EVALUATION CRITERIA
1. Ainda resolve o problema para o qual foi adoptado?
2. Alternativa actual é materialmente melhor?
3. Custo de migração é justificado pelo ganho?
4. É identity-aligned?
5. Owner aprovou mudança?
```

---

# FAMÍLIA 6 — EXPANSÃO DO SCOPE DOS PULSES

Os pulses existentes aplicam-se agora a **produto e ecossistema em paralelo**:

| Pulse | Aplicação ao Produto | Aplicação ao Ecossistema |
|-------|---------------------|--------------------------|
| Identity Pulse | produto tem identidade coerente? | ecossistema tem identidade interna coerente? |
| Dev Excellence Pulse | código do produto está no nível certo? | toolchain · CI/CD · engineering do ecossistema está no nível certo? |
| Product Fidelity Pulse | produto está fiel à visão? | ecossistema está fiel à verdade funcional? |
| Execution Pulse | delivery do produto é eficiente? | delivery do ecossistema é eficiente? |
| Refinement Pulse | produto está a ser lapidado? | protocolos · docs · routing estão a ser lapidados? |
| Cascade Memory Pulse | produto herda contexto correcto? | ecossistema herda sessões anteriores correctamente? |
| Multi-Block Maturation Pulse | blocos do produto amadurecem juntos? | blocos do ecossistema amadurecem junto com o produto? |
| AI/Pioneer Role Pulse | pioneers estão no papel correcto no produto? | pioneers estão no papel correcto no ecossistema? |
| Current-State/Final-State Pulse | onde está o produto vs. onde deve estar? | onde está o ecossistema vs. onde deve estar? |

---

# FAMÍLIA 7 — TECHNOLOGY EVOLUTION LINE

```
TECHNOLOGY EVOLUTION LINE — 2026
────────────────────────────────────────────────────────────
Princípio: o ecossistema observa o que há de melhor em 2026
           mas só adopta o que é real, útil e identity-aligned.

LINHA CONTÍNUA:
  → Observar estado da arte em cada domínio técnico
  → Comparar com capacidades actuais
  → Identificar gap genuíno (não modismo)
  → Avaliar adopção pelo ECOSYSTEM UPGRADE GATE
  → Adoptar ou rejeitar com registo formal

ÁREAS DE OBSERVAÇÃO:
  - frontend / UI tech
  - AI models e capabilities
  - data infra
  - deployment / edge / runtime
  - toolchain / DX
  - security / compliance
  - design tools
  - world / geospatial rendering

TRAVA CANÔNICA:
  Nenhum upgrade entra por curiosidade.
  Entra por necessidade demonstrável de melhoria.
────────────────────────────────────────────────────────────
```

---

# FAMÍLIA 8 — ROTINA DE AUTO-ELEVAÇÃO

A auto-elevação é a progressão da máquina na V10 line do ecossistema:

```
V10 ECOSYSTEM LINE
V1  → ecossistema existe e opera
V2  → protocolos básicos estabelecidos
V3  → machine funcional e consistente
V4  → routing preciso e pools saudáveis
V5  → identidade interna clara; pioneers alinhados
V6  → capability fabric madura; plugins estáveis
V7  → ecossistema referência interno para qualidade de produto
V8  → autoconstrução activa e formalizada
V9  → ecossistema produz produto V9+ autonomamente
V10 → ecossistema canônico — organismo de fabricação máximo
```

Para subir de nível, o ecossistema precisa de:
- confirmar todos os critérios do nível anterior
- mostrar evidência de operação no nível alvo
- ter aprovação do owner para a elevação

---

# FAMÍLIA 9 — CADÊNCIA OPERACIONAL

```
PER SPRINT
  ✓ Cloned sequence check (produto → ecossistema)
  ✓ Pulse check em ambas as frentes
  ✓ Stack spot-check
  ✓ LIVE_STATE actualizado

PER MAJOR CYCLE
  ✓ Auto-teste completo em 10 dimensões
  ✓ Auto-revisão de gaps
  ✓ Stack + capability deep review
  ✓ Plugin fabric audit
  ✓ Technology evolution line review
  ✓ V10 ecosystem line position confirmed
  ✓ Owner review + aprovação de upgrades

PER V10 TRANSITION
  ✓ Full ecosystem audit
  ✓ Todas as dimensões de auto-teste confirmadas
  ✓ V10 criteria checklist completa
  ✓ Owner sign-off
```

---

# FAMÍLIA 10 — CHECKLIST DE SELF-EVOLUTION ROUTINE

1. Auto-teste das 10 dimensões executado?
2. Gaps registados e abertos no BASTION?
3. Upgrades avaliados pelo ECOSYSTEM UPGRADE GATE?
4. Pulses aplicados a produto e ecossistema?
5. Technology evolution line revista?
6. Stack spot-check ou deep review conforme cadência?
7. V10 ecosystem line position actualizada?
8. LIVE_STATE reflecte estado actual?

---

```
ecosystem_self_evolution_routine_initialized     ✓
auto_teste_10_dimensoes                          ✓
auto_revisao_gap_detection                       ✓
ecosystem_upgrade_gate                           ✓
pulse_scope_expandido_produto_ecossistema        ✓
technology_evolution_line_2026                   ✓
v10_ecosystem_line                               ✓
cadencia_operacional_definida                    ✓
```

---

_ECOSYSTEM_SELF_EVOLUTION_ROUTINE v1.0 — cravado em 2026-03-22 | @claude | ESER-001_
