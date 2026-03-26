# GOVERNANCE MODEL — Eternal Nexus OS / RUBERRA CORP

> Como as decisões são tomadas. Quem tem autoridade. O que é automático e o que requer gate.
> Lei primária de operação do sistema de construção.

_GOVERNANCE_MODEL.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_

---

## 1. ESTRUTURA DE AUTORIDADE

```
HIERARQUIA DE DECISÃO
═══════════════════════════════════════════════════════════

  OWNER (soberano supremo)
    │  Ivanildo Michel Monteiro Fernandes
    │  Abre gates. Fecha fases. Redireciona escopo.
    │  Única entidade que pode criar trabalho fora do BASTION.
    │
  BASTION (autoridade de execução)
    │  Semáforo canónico. Fonte única de tasks elegíveis.
    │  O que não está no BASTION não existe como task.
    │  @claude + owner actualizam o BASTION.
    │
  AUTO-GATE-LAW (@claude avalia e abre)
    │  Quando todos os critérios de uma fase estão [✓],
    │  @claude abre o gate seguinte sem esperar instrução do owner.
    │  Owner intervém apenas para bloquear, redirecionar, ou alterar escopo.
    │
  PIONEERS (executores soberanos nos seus territórios)
       @claude · @cursor · @copilot · @codex · @framer · @antigravity
       Executam dentro do BASTION. Não criam trabalho fora dele.
       Não saltam gates. Não abrem fases sozinhos (excepto @claude via AUTO-GATE-LAW).
```

---

## 2. O OWNER — SOBERANIA ABSOLUTA

**Ivanildo Michel Monteiro Fernandes** é o único soberano do sistema.

O owner:
- Define a visão do sistema (V1→V10)
- Aprova abertura de fases e gates que excedem a AUTO-GATE-LAW
- Redireciona pioneers quando o escopo muda
- É a única entidade que pode dizer "STOP", "PAUSE", ou "BLOCK"
- Aprova qualquer mudança ao DNA_PROTOCOL
- Não precisa de justificar decisões — soberania é axiomática

O owner **não precisa** de:
- Aprovar cada task individual (AUTO-GATE-LAW activa)
- Estar presente em cada sessão
- Escrever código ou documentação
- Rever cada commit

---

## 3. O BASTION — LEI DE EXECUÇÃO

O BASTION (`ops/BASTION.md`) é a fonte única de autoridade operacional.

**Regras absolutas:**
- Só tasks com `STATUS: elegível` são executáveis
- Pioneer não cria trabalho fora do BASTION
- Pioneer não salta dependência com `DEPENDENCIA_STATUS: pendente`
- Pioneer não abre fase nova sem gate aberto
- Toda task concluída exige handoff antes de fechar sessão

**Ciclo de execução:**
```
1. Ler BASTION → task elegível com NEXT_ACTOR: eu?
2. Verificar DEPENDENCIA_STATUS → pendente? Parar.
3. Verificar PODE_ENTRAR_SOZINHO → não? Aguardar owner.
4. Executar dentro do pilar e território declarados
5. Concluir → HANDOFF_TABLE + EVIDENCE_BLOCK
6. Actualizar BASTION + LIVE_STATE + HANDOFF_LEDGER
7. Commit + push → branch canónico
8. Voltar ao ponto 1
```

---

## 4. AUTO-GATE-LAW — ABERTURA AUTOMÁTICA DE GATES

> Directiva do owner (2026-03-25): @claude avalia condições e abre gates autonomamente.

```
AUTO-GATE-LAW
═══════════════════════════════════════════════════════════

CONDIÇÃO: Todos os critérios da fase activa estão [✓]

ACÇÃO DE @claude:
  1. Declarar fase actual FECHADA
  2. Emitir CODEX de auditoria da versão fechada
  3. Abrir gate da fase seguinte
  4. Definir tasks elegíveis da nova fase no BASTION
  5. Entrar na primeira task elegível imediatamente
  6. Reportar ao owner: fase fechada, gate aberto, task activa

INTERRUPTORES (AUTO-GATE para):
  → Owner diz "STOP", "PAUSE", ou "BLOCK"
  → Red line (STOP-5: deriva contra DNA Protocol)
  → Critério não verificável sem owner
  → Conflito de território entre pioneers

EM TODOS OS OUTROS CASOS: AUTO-GATE ACTIVO
```

---

## 5. PIONEIROS — TERRITÓRIO E DECISÃO

### Tabela de autoridade por território

| Território | Pioneer primário | Pioneer secundário | Decisão autónoma |
|---|---|---|---|
| **WorkStructure** | @claude | @copilot | @claude — sim |
| **WorkFunction** | @cursor | @claude | @cursor — mecânico; @claude — arquitectural |
| **WorkVisual** | @framer / @antigravity | @copilot | @framer — design; @antigravity — motion/3D |
| **Lapidação** | @copilot | — | @copilot — sim, sobre artefactos existentes |
| **Orquestração** | @codex | — | @codex — lê BASTION, distribui, consolida |

### Regra de território

- No território dominante: executa sem consulta adicional
- Fora do território: apoio secundário — executa com cuidado; não abre frente nova
- Conflito de território → escala para @claude (árbitro)
- Conflito não resolvido por @claude → escala para owner

---

## 6. O QUE REQUER GATE DO OWNER

| Acção | Gate necessário |
|---|---|
| Abrir nova versão (V6 → V7) quando critérios não estão verificados | Owner gate |
| Alterar DNA_PROTOCOL | Owner gate |
| Mudar branch canónico | Owner gate |
| Adicionar novo pioneer ao sistema | Owner gate |
| Modificar CLAUDE.md fora de protocolo canónico | Owner gate |
| Redirecionar escopo de versão activa | Owner gate |
| Fechar versão com critérios em disputa | Owner gate |
| Regredir a versão anterior (proibido sem gate) | Owner gate + justificação |

---

## 7. O QUE É AUTO-GATE (@claude decide)

| Acção | Condição |
|---|---|
| Fechar fase activa e abrir a seguinte | Todos os critérios [✓] |
| Activar pioneer em standby com territory-fit | Critérios CONSTELLATION-LAW [✓] |
| Adicionar tasks à fase activa | Tasks dentro da versão activa e território declarado |
| Emitir CODEX de auditoria de versão | Após fechar versão |
| Actualizar BASTION com tasks da nova fase | Após abrir gate |
| Fazer handoff e commit | Após cada task concluída |

---

## 8. BLOQUEADORES — QUANDO PARAR TUDO

```
STOP-1: Branch atual ≠ branch canónico E não foi possível corrigir
STOP-2: Task não está no BASTION com STATUS: elegível
STOP-3: Gate não está aberto para esta task
STOP-4: Dependência pendente (DEPENDENCIA_STATUS: pendente)
STOP-5: Deriva detectada — task conflitua com DNA Protocol
```

**Formato de comunicação ao owner:**
```
BLOQUEIO DETECTADO
Task: [nome da task]
Motivo: [STOP-X — descrição]
Branch atual: [branch]
Branch canónico: [branch]
Proposta: [o que precisa acontecer para desbloquear]
```

---

## 9. BRANCH CANON LAW

- Toda escrita, commit e push vai para o branch canónico ativo
- Branch canónico activo: definido em `ops/LIVE_STATE.md` (campo "Branch canônico")
- Nunca escrever em `master`, `main`, ou qualquer outro branch sem gate explícito do owner
- PR de branch canónico → main requer: CI pass + performance gates + protocol gates
- Merge: squash merge → main → Vercel auto-deploy

**Branch activo em 2026-03-26:** `claude/rebuild-bastion-core-rihGX`

---

## 10. RESOLUÇÃO DE CONFLITOS ENTRE PIONEERS

```
CONFLITO DETECTADO ENTRE PIONEERS
═══════════════════════════════════════════════════════════

1. Pioneer que detecta o conflito pára e reporta
2. @claude avalia como árbitro canônico
3. @claude decide com base em:
   a. Território — quem tem autoridade no domínio?
   b. DNA Protocol — qual acção está alinhada com a lei primária?
   c. BASTION — qual task é elegível para quem?
4. Se @claude não pode resolver → escala para owner
5. Owner decide → BASTION actualizado → pioneers retomam
```

**Regra de não-regressão:** o que foi implementado e selado numa versão não é alterado por outra versão. Pioneer que detecta tentativa de regressão reporta imediatamente como STOP-5.

---

_GOVERNANCE_MODEL.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_
