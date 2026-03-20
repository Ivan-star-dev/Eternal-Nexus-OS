# NEXUS LIVE FABRIC — Definição Canônica

**Versão:** v1 — primeira camada
**Data:** 2026-03-20
**Fase:** Fase 3 — Governança e Auditabilidade
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Task:** E17

> O Nexus Live Fabric (NLF) é o tecido operacional vivo do Eternal Nexus OS.
> Ele não é a soberania — ele serve a soberania.
> Registra, organiza, propõe e encaminha. Nunca decide sozinho.

---

## 1. O QUE É

O NLF é a camada operacional viva que transforma o protocolo estático em estado observável em tempo real.

**Função:** dar ao sistema a capacidade de responder, a qualquer momento:
- Qual é o estado atual do sistema?
- Quem está ativo e em qual frente?
- Qual é a fila de cada executor?
- Qual foi o último handoff emitido?
- O que entra a seguir e por quê?

**Não é:**
- Uma reescrita do NEXUS_OS
- Uma camada de automação sem trava
- Um substituto do Tribunal ou do owner
- Uma fonte de decisão autônoma

---

## 2. SOBERANIA

O NLF opera **abaixo** da soberania do protocolo.

| Operação | Quem decide |
|---|---|
| Mudar uma lei fundamental | Owner + Tribunal |
| Mudar o protocolo canônico | Owner + Tribunal |
| Atualizar o estado vivo | Pioneiro ao emitir handoff |
| Atualizar a fila | Pioneiro ou owner |
| Registrar um handoff | Pioneiro que conclui a task |
| Propor uma transição | NLF registra a proposta; Tribunal ou owner aprova |

**Regra inviolável:** O NLF nunca edita `docs/NEXUS_OS.md`, `docs/DOC_FASE3.md` nem nenhum documento soberano por conta própria. Qualquer proposta de mudança canônica passa pelo Tribunal.

---

## 3. ESTRUTURA DO NLF

O NLF consiste de 3 arquivos vivos em `ops/`:

| Arquivo | Conteúdo | Atualizado por |
|---|---|---|
| `ops/LIVE_STATE.md` | Estado atual do sistema, fila viva por executor, estado de canalização | Pioneiro ao emitir handoff |
| `ops/HANDOFF_LEDGER.md` | Ledger cronológico de todos os handoffs emitidos | Pioneiro ao emitir handoff |
| `ops/NLF.md` | Este documento — definição, soberania, transições, regras | Só com aprovação do Tribunal |

---

## 4. REGRAS DE TRANSIÇÃO

Quando atualizar cada arquivo:

### LIVE_STATE.md
- **Quando:** ao final de qualquer sessão que emita um handoff
- **Quem:** o pioneiro que encerra a sessão
- **O que muda:** estado atual, fila do executor, estado de canalização
- **O que não muda:** definições, regras, protocolos

### HANDOFF_LEDGER.md
- **Quando:** ao emitir qualquer handoff formal
- **Quem:** o pioneiro que emite o handoff
- **Formato:** entrada nova no topo (nunca editar entradas existentes)
- **Regra:** o ledger é append-only — sem edição retroativa

### NLF.md (este documento)
- **Quando:** nunca por conta de uma sessão operacional
- **Quem:** só via Tribunal ou instrução explícita do owner
- **Motivo:** é a definição canônica — mudá-la requer julgamento

---

## 5. COMO OS PIONEIROS ALIMENTAM E CONSOMEM O NLF

### Claude — Abridor de Caminho
- **Alimenta:** ao final de cada task, atualiza `LIVE_STATE.md` com estado atual e próximo passo
- **Alimenta:** registra entrada no `HANDOFF_LEDGER.md`
- **Consome:** lê `LIVE_STATE.md` ao iniciar nova sessão para confirmar frente ativa e fila

### Codex — Refinador Técnico
- **Alimenta:** atualiza sua linha na fila viva ao receber ou concluir uma camada
- **Alimenta:** registra handoff de refinamento no ledger
- **Consome:** lê fila de Codex em `LIVE_STATE.md` para saber qual camada refinar

### Copilot — Lapidador
- **Alimenta:** atualiza sua linha na fila ao receber ou concluir lapidação
- **Alimenta:** registra handoff de lapidação no ledger
- **Consome:** lê fila de Copilot em `LIVE_STATE.md` para saber qual camada lapidar

**Regra comum:** Todo pioneiro que lê o NLF ao iniciar uma sessão e não encontra o estado esperado deve **parar e emitir alerta** — não agir sobre estado desconhecido.

---

## 6. RELAÇÃO COM O PROTOCOLO EXISTENTE

| Protocolo | Relação com o NLF |
|---|---|
| `docs/NEXUS_OS.md` | Soberano acima do NLF — NLF serve o NEXUS_OS |
| `docs/DOC_FASE3.md` | Define o escopo — NLF opera dentro dele |
| Handoff blueprint | NLF formaliza o registro dos handoffs em ledger cronológico |
| Semáforo | NLF reflete o estado do semáforo em LIVE_STATE |
| Tribunal | Tribunal decide o que muda no canon; NLF registra decisões |
| Bulking em escada | LIVE_STATE rastreia em qual camada cada pioneiro está |
| Micro Team | Futura entrada na fila viva — slot reservado na seção 2 de LIVE_STATE |

---

*NLF v1 — implantado em 2026-03-20 | claude-sonnet-4-6 | E17 | Fase 3*
