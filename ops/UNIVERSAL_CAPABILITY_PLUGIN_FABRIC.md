# UNIVERSAL_CAPABILITY_PLUGIN_FABRIC.md

**Versão:** v1.0
**Data:** 2026-03-22
**Task:** UCPF-001
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (instrução direta)

---

## MISSÃO

Formalizar a camada universal que permite à máquina receber novos plugins, formatos, modelos, integrações e runtimes sem quebrar os núcleos existentes.

---

## FRASE CANÔNICA

> A máquina não muda de natureza quando recebe novos plugins.
> A sua natureza é exactamente a capacidade de absorver o novo sem perder coerência.

---

## LEI CENTRAL

O núcleo fixo da máquina **nunca muda** para acomodar um plugin.
O plugin **adapta-se ao núcleo** através de um interface canônico.

Núcleo fixo → imutável
Plugin → adaptado ao contrato do núcleo

---

# FAMÍLIA 1 — MODELO INTERNO NEUTRO

A máquina entende problemas em termos de:

| Conceito | Descrição |
|---------|-----------|
| **Domínio** | a área de conhecimento do problema |
| **Operação** | o que precisa de ser feito |
| **Constraints** | regras que limitam a solução |
| **Output** | o que deve ser produzido |
| **Maturidade** | o nível V1–V10 esperado |

A máquina **nunca** entende problemas em termos de ferramenta específica.

Isso significa: se a ferramenta muda, o modelo interno não muda.

---

# FAMÍLIA 2 — INTERFACE UNIVERSAL DE PLUGIN / CAPABILITY

Todo plugin que entra na máquina deve implementar o seguinte contrato:

```
PLUGIN CONTRACT v1.0
─────────────────────────────────────────────
id:            [identificador único]
nome:          [nome legível]
versão:        [semver]
domínios:      [lista de domínios D01–D12+ que este plugin serve]
operações:     [lista de operações que este plugin executa]
inputs:        [formatos de input aceites]
outputs:       [formatos de output produzidos]
constraints:   [limitações ou dependências]
maturidade:    [V1–V10 que este plugin suporta]
pioneer:       [qual pioneer pode activar este plugin]
activation:    [condições de activação canónica]
─────────────────────────────────────────────
```

Se o plugin não preenche este contrato → não entra na máquina.

---

# FAMÍLIA 3 — TIPOS DE PLUGIN

| Tipo | Descrição | Exemplos |
|------|-----------|---------|
| **Model Plugin** | integra um modelo de IA novo | GPT-5 · Gemini · modelo open-source |
| **Format Plugin** | adiciona suporte a novo formato de output | PDF · CAD · video · audio · hologramas |
| **Integration Plugin** | conecta serviço externo | Stripe · Figma · GitHub · Salesforce |
| **Runtime Plugin** | adiciona novo ambiente de execução | WASM · edge runtime · mobile native |
| **Domain Plugin** | adiciona novo domínio ao domain graph | D13+ |
| **Pioneer Plugin** | adiciona novo pioneer / surface | novo agente especializado |
| **Capability Extension** | expande capacidade de núcleo existente | geospatial v2 · realtime layer v2 |

---

# FAMÍLIA 4 — ADAPTER PATTERN

Cada plugin entra através de um adapter que faz a tradução entre:
- o contrato universal da máquina
- a API / interface específica do plugin

```
ADAPTER STRUCTURE
─────────────────────────────────────────
adapter_id:      [plugin_id + "_adapter"]
entrada_máquina: [formato canônico da máquina]
saída_plugin:    [chamada específica ao plugin]
retorno_plugin:  [output raw do plugin]
retorno_máquina: [output traduzido para formato canônico]
tratamento_erro: [como o adapter trata falhas do plugin]
─────────────────────────────────────────
```

## Regra

O adapter protege o núcleo da máquina de dependências directas em plugins externos.
Se o plugin mudar de API → apenas o adapter muda.

---

# FAMÍLIA 5 — CAPABILITY BRIDGE

Quando um plugin estende uma capability existente (em vez de adicionar uma nova), usa-se o Capability Bridge:

```
CAPABILITY BRIDGE
────────────────────────────────────────────
capability_base:   [capability original que está a ser estendida]
extension:         [o que a extensão acrescenta]
compatibilidade:   [é backwards-compatible?]
activação:         [feature flag / versão / gate]
rollback:          [como reverter se a extensão falhar]
────────────────────────────────────────────
```

---

# FAMÍLIA 6 — RUNTIME EXTENSION

Para novos ambientes de execução (edge, mobile, WASM, etc.):

```
RUNTIME EXTENSION
────────────────────────────────────────────
runtime_id:      [identificador único]
ambiente:        [edge / mobile / WASM / desktop / other]
constraints:     [o que este runtime não suporta]
activação:       [quando é activado automaticamente?]
fallback:        [qual runtime é usado se este falhar?]
observability:   [como é monitorizado?]
────────────────────────────────────────────
```

---

# FAMÍLIA 7 — CICLO DE VIDA DE UM PLUGIN

```
1. PROPOSTA
   → descrever plugin com contrato completo
   → identificar domínio(s) que serve
   → identificar adapter necessário

2. VALIDAÇÃO
   → contrato preenche o interface universal?
   → conflito com plugins existentes?
   → impacto no núcleo fixo?

3. APROVAÇÃO
   → owner aprova
   → gate canônico aberto

4. IMPLEMENTAÇÃO
   → adapter criado
   → testes de integração
   → observabilidade configurada

5. ACTIVAÇÃO
   → feature flag ou gate
   → rollout gradual
   → monitorização activa

6. MATURAÇÃO
   → mede impacto real
   → estabiliza
   → sobe de V1 para maturidade alvo

7. DEPRECAÇÃO (se necessário)
   → notificação antecipada
   → fallback garantido
   → remoção limpa do adapter
```

---

# FAMÍLIA 8 — REGRAS DE IMUTABILIDADE DO NÚCLEO

O núcleo fixo da máquina inclui:

| Elemento | Regra |
|---------|-------|
| **Problem Intake Schema** | nunca muda por causa de plugin |
| **Domain Graph** | cresce mas nunca perde domínios existentes |
| **Triage Engine** | camadas são adicionadas, nunca removidas sem aprovação |
| **Pioneer Role Bindings** | bindings existentes são imutáveis; novos bindings são adicionados |
| **V10 Upgrade Rule** | sempre se aplica, independente do plugin |
| **Branch Guard** | plugins nunca mudam a lógica de branch |

---

# FAMÍLIA 9 — PLUGIN REGISTRY

A máquina mantém um registo de todos os plugins activos:

```
PLUGIN REGISTRY
─────────────────────────────────────────────────────
id          | nome         | tipo      | estado   | versão | maturidade
────────────────────────────────────────────────────
core-visual | Visual Layer | Capability | activo   | 1.0    | V4
core-struct | Struct Layer | Capability | activo   | 1.0    | V4
core-funct  | Funct Layer  | Capability | activo   | 1.0    | V4
cesium-geo  | CesiumJS     | Runtime    | activo   | 1.0    | V3
[futuro]    | [novo]       | [tipo]     | proposto | 0.x    | V1
─────────────────────────────────────────────────────
```

---

# FAMÍLIA 10 — CHECKLIST DE PLUGIN FABRIC

1. Plugin preenche o contrato universal?
2. Adapter criado e testado?
3. Domínios servidos identificados no domain graph?
4. Conflito com plugins existentes verificado?
5. Núcleo fixo intacto?
6. Observabilidade configurada?
7. Rollback definido?
8. Aprovação do owner confirmada?
9. Plugin Registry actualizado?

---

```
universal_capability_plugin_fabric_initialized   ✓
modelo_interno_neutro_definido                   ✓
plugin_contract_v1_definido                      ✓
7_tipos_de_plugin_definidos                      ✓
adapter_pattern_formalizado                      ✓
capability_bridge_definido                       ✓
runtime_extension_definido                       ✓
ciclo_vida_plugin_7_passos                       ✓
regras_imutabilidade_nucleo                      ✓
plugin_registry_iniciado                         ✓
```

---

_UNIVERSAL_CAPABILITY_PLUGIN_FABRIC v1.0 — cravado em 2026-03-22 | @claude | UCPF-001_
