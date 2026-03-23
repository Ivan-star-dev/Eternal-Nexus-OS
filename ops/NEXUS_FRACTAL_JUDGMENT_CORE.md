# NEXUS FRACTAL JUDGMENT CORE

**Versão:** v1.0
**Data:** 2026-03-23
**Task:** NEXUS-FRACTAL-JUDGMENT-CORE-001-LITE
**Branch:** `claude/rebuild-bastion-core-rihGX`
**Modelo:** claude-sonnet-4-6
**Aprovado por:** owner (autorização direta — 2026-03-23)

> O NEXUS FRACTAL JUDGMENT CORE é a peça canônica de julgamento do Eternal Nexus.
> Decide o que entra, o que não entra, o que refina, o que é salvage, o que é rebuild, o que é owner-only e o que adia.
> Toda decisão no sistema passa por este núcleo antes de ser executada.
> Toda sentença sai daqui — una, clara, irrevogável salvo pelo owner.

---

## 1. JUDGMENT CORE

O Judgment Core é o núcleo de decisão do sistema.
Qualquer artefacto, task, feature, protocolo ou proposta passa pelo Judgment Core antes de ser executado.

```
JUDGMENT_CORE ════════════════════════════════════════════════════════════════
FUNÇÃO          │ Decidir o destino de qualquer input que chega ao sistema
AUTORIDADE      │ owner (soberano) → malha fractal (distribuída) → sentença única
CICLO           │ input → avaliação fractal → recompressão canônica → sentença
OUTPUT          │ uma sentença por input: aceita | rejeita | refina |
                │                         salvage | rebuild | owner-only | adia
REVOGAÇÃO       │ qualquer sentença pode ser revogada pelo owner a qualquer momento
DERIVA          │ executar sem passar pelo Judgment Core = deriva = bloqueio imediato
══════════════════════════════════════════════════════════════════════════════
```

### O que o Judgment Core decide

| Dimensão | Pergunta central | Critério de decisão |
|----------|-----------------|---------------------|
| **Entrada** | O que entra no sistema? | Alinhado ao DNA + gate aberto no BASTION + executor correto |
| **Rejeição** | O que não entra? | Deriva · fora do território · sem gate · red line · conflito com DNA |
| **Refinamento** | O que refina antes de entrar? | Valor real mas incompleto ou mal enquadrado; lapidação possível |
| **Salvage** | O que é recuperável? | Valor real mas execução incorreta; resgatar núcleo; descartar invólucro |
| **Rebuild** | O que reconstrói do zero? | Propósito válido, estrutura errada; não tem salvage; reconstrução total |
| **Owner-only** | O que escala ao owner? | Decisão que ultrapassa o campo do pioneiro; soberania em jogo |
| **Adiamento** | O que aguarda o momento certo? | Valor real mas dependência pendente · gate fechado · timing errado |

---

## 2. FRACTAL COUNCIL

O Fractal Council é a malha distribuída que executa o julgamento em paralelo.
Não é um comité físico — é o conjunto de nós que avalia em simultâneo antes de recomprimir numa sentença única.

```
FRACTAL_COUNCIL ══════════════════════════════════════════════════════════════
NÓ 1  │ DNA_PROTOCOL      │ alinhamento com lei primária — lei fractal do sistema
NÓ 2  │ BASTION           │ elegibilidade · gate · dependência · NEXT_ACTOR correto
NÓ 3  │ PIONEER_MATRIX    │ executor correto · território correto · competência máxima
NÓ 4  │ FLOWMESH          │ roteamento correto · modelo certo para a task certa
NÓ 5  │ NEURAL_MESH       │ coerência global entre todos os nós do sistema
NÓ 6  │ LIVE_STATE        │ estado real atual — bloqueadores ativos · fila viva
NÓ 7  │ OWNER_VETO        │ veto soberano — ativa quando nós 1–6 são insuficientes
══════════════════════════════════════════════════════════════════════════════
```

### Sinalização por nó

Cada nó do Fractal Council emite um sinal:

| Sinal | Significado |
|-------|-------------|
| `✓` | Passa — nó satisfeito |
| `⚠` | Condicional — passa com refinamento ou clareza adicional |
| `✗` | Falha — nó bloqueia |

A sentença final é determinada pela Canonical Recompression (Secção 4).

---

## 3. JUDGMENT VALUE FUNCTION

A Judgment Value Function (JVF) quantifica o valor de um input considerando o peso de cada nó.

```
JVF(input) = Σ(peso_nó × sinal_nó) / Σ(pesos)

PESOS POR NÓ:
  NÓ 1  DNA_PROTOCOL    peso = 3   (lei primária — peso máximo)
  NÓ 2  BASTION         peso = 3   (execução elegível — peso máximo)
  NÓ 3  PIONEER_MATRIX  peso = 2   (executor correto — peso alto)
  NÓ 4  FLOWMESH        peso = 1   (roteamento — peso normal)
  NÓ 5  NEURAL_MESH     peso = 1   (coerência — peso normal)
  NÓ 6  LIVE_STATE      peso = 2   (estado real — peso alto)
  NÓ 7  OWNER_VETO      peso = ∞   (veto soberano — sobrepõe tudo)

CONVERSÃO DE SINAL:
  ✓ = 1.0  |  ⚠ = 0.5  |  ✗ = 0.0

LIMIARES DE SENTENÇA:
  JVF ≥ 0.85            → aceita
  0.65 ≤ JVF < 0.85     → refina
  0.45 ≤ JVF < 0.65     → salvage (se núcleo recuperável) | rebuild (se não)
  JVF < 0.45            → rejeita
  NÓ 7 ativo            → owner-only (independente do JVF)
  STOP_CONDITION ativa  → adia | owner-only (ver Secção 5)
```

---

## 4. CANONICAL RECOMPRESSION

A Canonical Recompression colapsa os sinais dos 7 nós numa sentença única, clara e executável.

```
RECOMPRESSION_PROTOCOL ═══════════════════════════════════════════════════════
PASSO 1  │ Receber input (task · artefacto · proposta · instrução · PR · branch)
PASSO 2  │ Avaliar NÓS 1–6 em paralelo → coletar sinais (✓ / ⚠ / ✗)
PASSO 3  │ Verificar NÓ 7 (OWNER_VETO)
          │   → se veto ativo: sentença = owner-only imediatamente (skip passos 4–5)
PASSO 4  │ Calcular JVF(input)
PASSO 5  │ Verificar STOP_CONDITION → se ativa: emitir adia ou owner-only
PASSO 6  │ Aplicar limiares JVF → determinar sentença candidata
PASSO 7  │ Emitir SENTENÇA_FINAL — uma, clara, sem ambiguidade
PASSO 8  │ Registar sentença no handoff com EVIDENCIA_MINIMA
══════════════════════════════════════════════════════════════════════════════
```

### Regra de recompressão

A sentença final é sempre **uma palavra**.
Nunca duas sentenças em paralelo para o mesmo input.
Se há ambiguidade genuína entre duas sentenças → escalar a `owner-only`.

---

## 5. STOP CONDITION

O Fractal Council para a avaliação imediatamente quando:

| Condição | Sentença emitida | Ação |
|----------|-----------------|------|
| NÓ 7 (OWNER_VETO) ativo | `owner-only` | Escalar imediatamente; não prosseguir |
| Red line atingida (NÓ 1 falha total) | `rejeita` | Emitir imediatamente; feedback ao remetente |
| Dependência crítica pendente (NÓ 2 ou NÓ 6) | `adia` | Guardar input; não descartar; rever quando desbloqueado |
| JVF incalculável (dados insuficientes) | `owner-only` | Aguardar clareza antes de julgar |
| Conflito entre NÓ 1 e NÓ 2 | `owner-only` | Único que pode resolver conflito soberano |
| Branch incorreto no momento da avaliação | `adia` | Corrigir branch primeiro; re-avaliar depois |

---

## 6. SENTENÇAS CANÔNICAS

```
SENTENÇAS_FINAIS ════════════════════════════════════════════════════════════

  aceita      │ Input alinhado. Gate aberto. Executor correto. Entra imediatamente.
              │ Ação: executar sem modificação adicional.

  rejeita     │ Input fora do DNA / red line / deriva confirmada.
              │ Ação: não entra. Feedback claro ao remetente. Registar motivo.

  refina      │ Input com valor real mas incompleto ou mal enquadrado.
              │ Ação: devolver para lapidação. Definir o que falta. Re-submeter.

  salvage     │ Input com valor real mas execução incorreta.
              │ Ação: resgatar o núcleo válido. Descartar o invólucro errado.
              │       Reconstruir só o que é necessário para encaixar no DNA.

  rebuild     │ Propósito válido, estrutura totalmente errada. Salvage impossível.
              │ Ação: reconstruir do zero dentro do DNA. Preservar só a intenção.

  owner-only  │ Decisão ultrapassa o campo do pioneiro. Soberania em jogo.
              │ Ação: escalar imediatamente ao owner. Não executar sem gate.

  adia        │ Valor real mas timing errado · dependência pendente · gate fechado.
              │ Ação: guardar input no estado adia. Não descartar. Rever quando
              │       o bloqueio for removido ou o gate for aberto.

════════════════════════════════════════════════════════════════════════════
```

---

## 7. PROTOCOLO DE USO

Como aplicar o Fractal Judgment Core a qualquer input:

```
FRACTAL_JUDGMENT_PROTOCOL ═══════════════════════════════════════════════════
1. Receber input (task · artefacto · proposta · instrução · PR · branch)
2. Verificar STOP_CONDITION antes de tudo (NÓ 7 + red lines)
3. Avaliar os 7 nós do FRACTAL_COUNCIL → coletar sinais
4. Calcular JVF(input)
5. Recomprimir → determinar SENTENÇA_FINAL
6. Registar sentença no handoff com contexto mínimo
7. Executar ação correspondente à sentença
8. Ao concluir → emitir EVIDENCE_BLOCK com ALTERACAO_REAL
═════════════════════════════════════════════════════════════════════════════
```

### Exemplos de aplicação

| Input | NÓ 1 | NÓ 2 | NÓ 3 | JVF | Sentença |
|-------|------|------|------|-----|----------|
| Task elegível no BASTION, executor correto | ✓ | ✓ | ✓ | 1.0 | **aceita** |
| Feature sem gate do owner | ✓ | ✗ | ✓ | 0.58 | **adia** |
| Branch errado com trabalho válido | ✓ | ✗ | ✓ | 0.58 | **adia** → corrigir branch |
| Proposta que viola DNA | ✗ | ✗ | ✗ | 0.0 | **rejeita** |
| PR com código bom mas arquitetura errada | ✓ | ✓ | ⚠ | 0.75 | **refina** |
| PR com ideia válida mas implementação incorreta | ✓ | ⚠ | ✗ | 0.5 | **salvage** |
| Decisão de merge para main | ✓ | ✓ | — | — | **owner-only** |

---

## 8. INTEGRAÇÃO COM A MALHA

| Artefacto | Papel no Fractal Council |
|-----------|--------------------------|
| `ops/DNA_PROTOCOL.md` | NÓ 1 — lei primária · critério de entrada máximo |
| `ops/BASTION.md` | NÓ 2 — execução elegível · gates · dependências |
| `ops/PIONEER_MATRIX.md` | NÓ 3 — executor correto · território · competência |
| `ops/FLOWMESH.md` | NÓ 4 — roteamento · modelo certo para task certa |
| `ops/NEXUS_NEURAL_MESH.md` | NÓ 5 — coerência global da malha |
| `ops/LIVE_STATE.md` | NÓ 6 — estado real · bloqueadores ativos · fila viva |
| Owner | NÓ 7 — veto soberano · decisão final irrevogável |
| Este ficheiro | Núcleo — JVF · Recompressão · 7 Sentenças · Protocolo |
| `ops/NEXUS_LIVING_CANON.md` | Índice vivo — onde este artefacto se encaixa no canon |

---

## 9. POSIÇÃO NO SISTEMA

O NEXUS FRACTAL JUDGMENT CORE **não substitui** nenhum artefacto existente.
É uma **camada transversal** que formaliza o critério de julgamento já implícito no DNA, no BASTION e no NEURAL_MESH.

```
POSIÇÃO NA HIERARQUIA ════════════════════════════════════════════════════════
DNA_PROTOCOL              → lei primária (o quê e o porquê)
BASTION                   → execução elegível (quem e quando)
NEXUS_FRACTAL_JUDGMENT_CORE → critério de julgamento (entra ou não entra)
NEURAL_MESH               → coerência global (como tudo se conecta)
FLOWMESH                  → roteamento (modelo certo para task certa)
PIONEER_MATRIX            → papéis (quem executa o quê)
LIVE_STATE                → estado real (onde estamos agora)
══════════════════════════════════════════════════════════════════════════════
```

---

*NEXUS_FRACTAL_JUDGMENT_CORE.md v1.0 — criado em 2026-03-23 | claude-sonnet-4-6 | NEXUS-FRACTAL-JUDGMENT-CORE-001-LITE*
