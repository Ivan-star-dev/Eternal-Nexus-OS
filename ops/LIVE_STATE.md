# LIVE_STATE — Estado Vivo do Sistema

> Este arquivo é vivo. Atualizado ao final de cada sessão com handoff.
> Não é canon. Reflete o estado operacional atual do sistema.
> Em caso de conflito com `docs/NEXUS_OS.md`, o NEXUS_OS prevalece.

**Última atualização:** 2026-03-20
**Atualizado por:** @claude | claude-sonnet-4-6 | PLv5.1

---

## 1. ESTADO ATUAL DO SISTEMA

| Dimensão | Valor atual |
|---|---|
| **Fase ativa** | Bulking Controlado do Produto |
| **Branch canônico** | `claude/expose-workspace-config-yt4Km` |
| **Executor ativo** | @claude (PLv5.1 handoff emitido) |
| **Frente ativa** | Produto / wt-estrutura-nucleo-vivo |
| **Camada atual** | PLv5.1 — DATA_LAYER_1 completa / 7/7 órgãos vivos |
| **Estado geral** | PLv5.1 concluída; 7/7 órgãos com Layer 1 activa (NEXUS: session timer; INVESTOR: World Bank NL GDP); DATA_LAYER_STRATEGY.md criado; Layer 2 (NewsAPI, Supabase projects) aguarda gate owner |

---

## 2. FILA VIVA POR EXECUTOR

### @claude (Abridor de Caminho)

| # | Task | Estado | Próximo gate |
|---|---|---|---|
| E17 | Implantar primeira camada do NLF | CONCLUÍDA | handoff emitido |
| E18 | Selar versão final do protocolo pré-bulk | CONCLUÍDA | handoff emitido |
| BULK-01.1 | Abertura oficial do bulk em escada — camada 1 | CONCLUÍDA | handoff emitido |
| BULK-02.1 | FOL v1 — Factory Operating Layer | CONCLUÍDA | handoff emitido |
| BULK-03.1 | PLv1 — Workspace Config Layer | CONCLUÍDA | handoff emitido |
| BULK-03.2 | PLv2 — OrganStatusGrid conectada à config canônica | CONCLUÍDA | handoff emitido |
| BULK-04.1 | PLv3 — Live Organ Status Layer | CONCLUÍDA | handoff emitido |
| SUPER-BULK-A | PLv4 — Live Organ Status: escala total (5/7 órgãos vivos) | CONCLUÍDA | handoff emitido |
| PLv5.1 | DATA_LAYER_1 completa — 7/7 órgãos vivos (NEXUS + INVESTOR) | CONCLUÍDA | handoff emitido |
| PLv6.1 | Próxima camada | AGUARDA GATE | owner: Layer 2 (NewsAPI? projects table?) ou Layer 3 (owner data)? |

### @codex (Refinador Técnico)

| # | Task | Estado | Aguarda |
|---|---|---|---|
| F6 | Casca técnica executável | EM ANDAMENTO | frente independente |
| BULK-01-Codex | Refinamento da camada BULK-01 | BLOQUEADA | branch não alinhado ao canônico — entra na próxima onda após alinhamento |

### @cursor (Desbloqueador / Backlog Mecânico)

| # | Task | Estado | Aguarda |
|---|---|---|---|
| BULK-01.3-a | Remover `vite.config.ts.timestamp-*` (arquivo gerado, não versionável) | GATE ABERTO | pode executar agora — mecânico, seguro, não-soberano |
| BULK-01.3-b | Avaliar duplicação `bun.lock` + `package-lock.json` — ambos no repo | GATE ABERTO | confirmar PM canônico (B-002) ou limpar se for residual óbvio |
| BULK-01.3-c | Verificar `antigravity/legacy-html/` — se é lixo mecânico sem decisão soberana | GATE ABERTO | checar se é apenas conteúdo obsoleto removível sem impacto |

### @copilot (Lapidador)

| # | Task | Estado | Aguarda |
|---|---|---|---|
| BULK-01.2 / L-001 | Higiene `.gitignore` — cobrir gaps mapeados pelo Tribunal (E4) | GATE ABERTO | pode executar agora |
| BULK-01.2 / L-002 | `rm --cached` do timestamp file já rastreado | GATE ABERTO | pode executar agora |
| BULK-02.2 | Operational Surface Smoothing v1 — suavização de ops/ | GATE ABERTO | FOL v1 criado por Claude — pode iniciar |
| — | Lapidação da camada NLF | PLANEJADA | handoff de @codex sobre E17/BULK-01-Codex |

### Micro Team

| Estado | Frente |
|---|---|
| EM OBSERVAÇÃO | Acompanhando abertura da camada viva |

---

## 3. ESTADO DE CANALIZAÇÃO ATUAL

```
SEMÁFORO:
🟢 CHAT: mesmo
🟢 BRANCH: claude/expose-workspace-config-yt4Km
🟢 WORKTREE: wt-estrutura-nucleo-vivo
NATUREZA: produto / PLv5.1 — DATA_LAYER_1 completa / 7/7 órgãos vivos
EXECUTOR: @claude (PLv5.1 done)
ESTADO: done (Claude — PLv1 + PLv2 + PLv3 + PLv4 + PLv5.1)
CANALIZAÇÃO ATIVA: PLv5.1 concluída; 7/7 órgãos vivos — ATLAS (Open-Meteo), TRIBUNAL (TanStack), INDEX (useIndexOrgan), NEWS (derivado do Index), GEOPOLITICS (USGS), NEXUS (session timer), INVESTOR (World Bank NL GDP); DATA_LAYER_1 completa; Layer 2 aguarda gate owner
```

---

## 3.1 LINHA TEMPORAL

```
LINHA TEMPORAL:
─────────────────────────────────────────────
MACROFASE: Fase 3 → Bulking Controlado do Produto
─────────────────────────────────────────────
Claude:  PLv5.1 — HANDOFF EMITIDO (DATA_LAYER_1 completa: 7/7 órgãos vivos; NEXUS+INVESTOR conectados)
Copilot: BULK-02.2 — GATE ABERTO (suavização de ops/ + rastos de PLv4/PLv5 para limpar)
Cursor:  timeout auxiliar — fora da trava desta onda
Codex:   F6 — EM ANDAMENTO (frente independente) | branch desalinhado
─────────────────────────────────────────────
PRÓXIMA TRANSIÇÃO: owner lê handoff PLv5.1 → decide Layer 2 (NewsAPI? projects table?) ou Layer 3 (owner data)
```

---

## 4. BLOQUEIOS ATIVOS

| ID | Bloqueio | Aguarda | Estado |
|---|---|---|---|
| B-001 | `.env` no histórico git | Owner: segredos reais ou placeholders? | BLOQUEADO — owner |
| B-002 | PM canônico: npm vs bun | Owner: confirmar npm definitivo | BLOQUEADO — owner |
| B-003 | `antigravity/legacy-html/` | Owner: manter ou remover? | BLOQUEADO — owner |

---

## 5. PRÓXIMOS PASSOS (ordem recomendada)

1. **Owner lê handoff PLv5.1** → confirma DATA_LAYER_1 aceite → decide PLv6: Layer 2 (NewsAPI? projects table?) ou Layer 3 (owner proprietary data)?
2. **@copilot executa BULK-02.2** — gate aberto; suavizar rastos de PLv4+PLv5 em ops/ e hooks imediatamente
3. **@codex avança F6** — frente independente, não bloqueia onda atual
4. **Owner responde B-001** — `.env`: segredos reais ou placeholders?
5. **Owner responde B-002** — confirmar npm como PM canônico
6. **@codex alinha branch** — condição para entrar na escada principal na onda 5
7. **@codex alinha branch** — condição para entrar na escada principal na onda 3

---

## COMO ATUALIZAR ESTE ARQUIVO

Ao final de cada sessão com handoff:
1. Atualizar cabeçalho (data + executor)
2. Atualizar seção 1 (estado atual)
3. Atualizar fila do executor ativo na seção 2
4. Atualizar seção 3 (estado de canalização)
5. Manter seção 4 — adicionar novos bloqueios, remover os resolvidos
6. Atualizar seção 5 (próximos passos)

**Nunca:** editar a fila de outro executor retroativamente sem seu handoff.
