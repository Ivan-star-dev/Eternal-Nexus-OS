# ANTI_LOOP_LAW — Lei Anti-Loop do Sistema

> Lei operacional canónica. Aplicada por todos os pioneiros em todas as sessões.
> Cravada em: 2026-03-26 | @claude | ANTI-LOOP-LAW-QWGUU

---

## LEI PRIMÁRIA

**Todo loop detectado é um sinal de deriva. Parar imediatamente.**

---

## 7 REGRAS ABSOLUTAS

### 1. DOIS FALHANÇOS → PARAR
Se um comando terminal falha duas vezes seguidas, **parar**.
Não repetir o mesmo comando. Não aguardar. Não tentar de novo.

### 2. SEM HIPÓTESE NOVA → SEM RETRY
Só repetir um comando falhado se existir uma **hipótese nova e diferente**.
Repetir sem hipótese alterada = loop = deriva.

### 3. CONTEXTO GRANDE → COMPRIMIR SÓ O BLOCO ATIVO
Se o contexto crescer demasiado, comprimir **apenas o bloco ativo em execução**.
Nunca comprimir o projeto inteiro. Nunca comprimir blocos selados.

### 4. DECISÃO SELADA → NÃO REABRIR PLAN MODE
Se uma decisão está canonicamente selada no BASTION ou em artefacto canónico,
**não reabrir plan mode**. A decisão está feita. Executar.

### 5. CONFIRMAÇÃO JÁ FIXADA → NÃO PEDIR DE NOVO
Se uma confirmação já está cravada num artefacto canónico ou gate aberto,
**não pedir confirmação ao owner de novo**. Avançar.

### 6. OUTPUT CURTO E DELIMITADO
Preferir outputs curtos, delimitados, com escopo claro.
Nunca iniciar execução aberta sem critério de paragem definido.

### 7. FIM DE SESSÃO — 3 ENTREGAS OBRIGATÓRIAS
Toda sessão termina com:
- **Decisões seladas** — o que foi decidido e não se reabre
- **Artefactos produzidos** — lista do que foi criado/actualizado
- **Próxima task única** — uma única próxima acção, não uma lista

---

## DIAGNÓSTICO DE LOOP

Sintomas que indicam loop ativo:

| Sintoma | Diagnóstico | Acção |
|---------|-------------|-------|
| Mesmo comando falhado 2× | Loop de comando | Parar · mudar hipótese |
| Plan mode reaberto para decisão selada | Loop de deliberação | Fechar · executar |
| Confirmação pedida já dada | Loop de confirmação | Avançar sem pedir |
| Output crescendo sem critério de paragem | Loop de geração | Delimitar scope · parar |
| Contexto inteiro a ser reprocessado | Loop de contexto | Comprimir só bloco ativo |

---

## ACTIVAÇÃO

Esta lei está sempre activa. Não requer gate. Não requer instrução manual.
Qualquer pioneiro que detecte um loop aplica esta lei imediatamente.

---

## REFERÊNCIA CRUZADA

| Artefacto | Relação |
|-----------|---------|
| `ops/BASTION.md` | Gates de execução — lei anti-loop complementa |
| `ops/PROTOCOL_BRANCH_GUARD.md` | Guard de branch — deriva de branch é um loop |
| `ops/BLOCK_MATURATION_OS.md` | Maturação por blocos — bloco ativo é o scope a comprimir |
| `CLAUDE.md` | Lei primária de sessão — anti-loop é lei de execução |

---

_ANTI_LOOP_LAW v1.0 — cravado em 2026-03-26 | @claude | ANTI-LOOP-LAW-QWGUU_
