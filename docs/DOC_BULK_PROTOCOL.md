# DOC_BULK_PROTOCOL — Protocolo Operacional de Bulk em Cascata

**Pilar:** Estrutura
**Fase:** Fase 3 — Governança e Auditabilidade / Pré-bulk
**Task:** E18 — Selar versão final do protocolo para bulk
**Branch:** `claude/expose-workspace-config-yt4Km`
**Modelo:** claude-sonnet-4-6
**Data:** 2026-03-20
**Dependência:** `docs/DOC_BULKING_ESCADA.md` (estratégia e papéis dos pioneiros)

> Este documento é o protocolo **operacional** do bulk em cascata.
> Define os blueprints obrigatórios para execução: execution map, preflight gate, canalization guard e linha temporal visual.
> Não substitui DOC_BULKING_ESCADA — é o seu complemento operacional.

---

## 1. RELAÇÃO COM DOC_BULKING_ESCADA

| Documento | O que cobre |
|---|---|
| `docs/DOC_BULKING_ESCADA.md` | Estratégia, papéis, ciclo de vida, critérios de liberação, red lines |
| `docs/DOC_BULK_PROTOCOL.md` | Blueprints operacionais: execution map, preflight, canalization guard, linha temporal |

Os dois documentos são complementares. Leia os dois antes de qualquer execução em escada.

---

## 2. EXECUTION MAP BLUEPRINT

O Execution Map é um bloco obrigatório no topo de todo prompt de execução em bulk. Ele dá a qualquer agente, em 7 campos, o mapa completo da sua posição operacional.

### Formato canônico

```
EXECUTION MAP:
MACROFASE:           [Fase 3 | Fase 4 | ...]
CAMADA-MÃE:          [N — nome da camada]
POSIÇÃO DA TASK:     [N.X — subtask dentro da camada]
EXECUTOR DESTA TASK: [@pioneiro]
ESCADA ATUAL:        Claude:[N+1] | Codex:[N] | Copilot:[N-1] | Cursor:[slot]
AÇÃO VÁLIDA AGORA:   [descrição precisa da ação permitida nesta task]
AÇÕES BLOQUEADAS:    [lista do que não pode entrar — sem exceção]
```

### Regras de uso

- **Obrigatório** em todo prompt de bulk, preflight de sessão ou gate de camada
- Se o Execution Map estiver ausente, o agente **não executa** — solicita o mapa antes de qualquer ação
- Os campos `AÇÃO VÁLIDA AGORA` e `AÇÕES BLOQUEADAS` são o "allowed now / blocked now" operacional
- O campo `ESCADA ATUAL` deve ser preenchido com base em `ops/LIVE_STATE.md` — nunca estimado

### Exemplo real

```
EXECUTION MAP:
MACROFASE:           Fase 3 — Governança e Auditabilidade
CAMADA-MÃE:          Camada 1 — Nexus Live Fabric
POSIÇÃO DA TASK:     1.1 — Definição canônica do NLF
EXECUTOR DESTA TASK: @claude
ESCADA ATUAL:        Claude:[1] | Codex:[aguarda] | Copilot:[aguarda] | Cursor:[sem camada ativa]
AÇÃO VÁLIDA AGORA:   Criar ops/NLF.md, ops/LIVE_STATE.md, ops/HANDOFF_LEDGER.md
AÇÕES BLOQUEADAS:    Iniciar bulk, tocar produto, abrir Fase 4, modificar arquivos protegidos
```

---

## 3. PREFLIGHT GATE

O Preflight Gate é uma verificação obrigatória antes de qualquer escrita no repositório. Não é sugerida — é trava.

### Checklist canônico

```
PREFLIGHT GATE:
[ ] Repositório: Ivan-star-dev/Eternal-Nexus-OS
[ ] Branch: claude/expose-workspace-config-yt4Km
[ ] Remote acessível (push/pull operacional)
[ ] Worktree/posto: [wt-* esperado para este executor]
[ ] Natureza da task alinhada com esta sessão
[ ] Escopo dentro da fase ativa (Fase 3)
[ ] Nenhum arquivo protegido no escopo sem razão explícita

SE QUALQUER ITEM FALHAR:
→ não executar
→ bloquear imediatamente
→ reportar o item divergente
→ aguardar correção ou instrução do owner
→ nunca improvisar para contornar o bloqueio
```

### Quando executar

- Ao início de qualquer sessão de execução em bulk
- Antes do primeiro write em uma sessão nova
- Quando o semáforo indicar mudança de contexto (amarelo ou vermelho)
- Quando o agente não encontrar `ops/LIVE_STATE.md` atualizado

### O que fazer se falhar

| Falha | Ação |
|---|---|
| Repo errado | Parar completamente — não há recovery automático |
| Branch errado | Parar — confirmar branch com owner antes de qualquer ação |
| Remote inacessível | Registrar no handoff, aguardar resolução — não commitar sem push possível |
| Natureza divergente | Emitir alerta, solicitar Execution Map atualizado |
| Arquivo protegido no escopo | Bloquear ação específica, continuar resto se possível |

---

## 4. CANALIZATION GUARD

O Canalization Guard é a defesa contínua durante a execução — ativa após o preflight, durante toda a sessão.

### Regra central

> Se o agente detectar drift de contexto **durante** a execução, ele para imediatamente.
> Não termina o arquivo. Não fecha o PR. Não tenta corrigir sozinho.
> Emite handoff parcial e aguarda.

### Situações de ativação

| Trigger | Ação |
|---|---|
| Contexto diverge do Execution Map | Parar, emitir alerta, aguardar Execution Map atualizado |
| Arquivo fora do escopo declarado aparece | Bloquear aquela ação, continuar o resto |
| Handoff anterior não encontrado | Não avançar para próxima camada — solicitar handoff |
| Dois agentes no mesmo miolo detectados | Aguardar handoff de conclusão do outro |
| Estado em LIVE_STATE desatualizado | Atualizar antes de continuar |

### Formato de alerta de guard

```
CANALIZATION GUARD ATIVADO:
MOTIVO:    [descrição do drift ou bloqueio detectado]
POSIÇÃO:   [task N.X — onde o guard foi ativado]
AÇÃO:      [parado | bloqueio pontual | aguardando]
REQUER:    [o que precisa ser resolvido antes de continuar]
```

---

## 5. LINHA TEMPORAL VISUAL

A Linha Temporal é um snapshot curto e legível da posição atual de cada pioneiro na escada.

### Formato canônico

```
LINHA TEMPORAL:
─────────────────────────────────────────────
MACROFASE: [Fase 3 — Governança e Auditabilidade]
─────────────────────────────────────────────
Claude:  camada [N]   — [EM ENTREGA | CONCLUÍDA]
Codex:   camada [N-1] — [EM REFINAMENTO | AGUARDANDO | CONCLUÍDA]
Copilot: camada [N-2] — [EM LAPIDAÇÃO | AGUARDANDO | CONCLUÍDA]
Cursor:  [sem camada ativa | desbloqueando: item X]
─────────────────────────────────────────────
PRÓXIMA TRANSIÇÃO: [próximo gate a abrir]
```

### Regras

- A Linha Temporal é lida de `ops/LIVE_STATE.md` — nunca estimada
- Declarada no início de cada sessão de bulk com mais de 1 pioneiro
- Não substitui o Execution Map — os dois coexistem
- `PRÓXIMA TRANSIÇÃO` indica o próximo gate a abrir na escada

---

## 6. CLAREZA FINAL: BRANCH / WORKTREE / CHAT / NATUREZA / EXECUTOR

| Dimensão | Regra |
|---|---|
| **Branch** | Elo comum de todos os pioneiros — não muda entre camadas sem decisão do owner |
| **Worktree (wt-*)** | Específico por executor — rótulo semântico de sessão, não Git físico |
| **Chat** | Específico por executor + natureza dominante + continuidade de contexto |
| **Natureza** | Define a frente real — implementação, refinamento técnico, lapidação, desbloqueio |
| **Executor** | Define o posto operacional — quem está ativo nesta task |
| **Camada nova** | Nunca muda o branch por padrão — mantém o branch canônico da fase |

**Regra de ouro:** um executor pode trocar de worktree ou chat, mas nunca perde o branch canônico sem instrução explícita do owner.

---

## 7. RED LINES — COMPLEMENTO

> As red lines primárias estão em `docs/DOC_BULKING_ESCADA.md` seção 6.
> Abaixo: adições específicas do bulk operacional.

| Red Line adicional | Por que destrói |
|---|---|
| **Bulk sem natureza clara** | Executores sem saber se estão entregando, refinando ou lapidando — sobreposição e retrabalho |
| **Bulk sem executor claro** | Task sem dono = task sem handoff = task invisível para o sistema |
| **Executar em repo/branch errado** | Entrega no lugar errado — irrecuperável sem purge |
| **Execution Map ausente em prompt de bulk** | Agente sem mapa = agente sem contexto = delivery sem rastreabilidade |
| **Preflight Gate ignorado** | Primeira defesa desativada — qualquer drift passa sem detecção |
| **Canalization Guard desativado mid-session** | Drift silencioso durante execução — regressão garantida |
| **Handoff emitido sem canalização** | Fechamento incompleto — sessão invisível para o sistema |

---

## 8. CRITÉRIO DE SISTEMA PRONTO PARA BULK

O sistema está pronto para bulk quando todas as condições abaixo forem verdadeiras:

| Critério | Evidência |
|---|---|
| Protocolo de escada formalizado | `docs/DOC_BULKING_ESCADA.md` presente e completo |
| Execution Map Blueprint definido | `docs/DOC_BULK_PROTOCOL.md` seção 2 |
| Preflight Gate definido | `docs/DOC_BULK_PROTOCOL.md` seção 3 |
| Canalization Guard definido | `docs/DOC_BULK_PROTOCOL.md` seção 4 |
| Linha Temporal definida | `docs/DOC_BULK_PROTOCOL.md` seção 5 |
| NLF v1 operacional | `ops/LIVE_STATE.md` atualizado e acessível |
| Red Lines completas | `docs/DOC_BULKING_ESCADA.md` seção 6 + `docs/DOC_BULK_PROTOCOL.md` seção 7 |
| Pioneiros com papéis claros | `docs/DOC_BULKING_ESCADA.md` seções 2 e 8 |

---

*DOC_BULK_PROTOCOL — selado em 2026-03-20 | claude-sonnet-4-6 | E18 | Fase 3*
