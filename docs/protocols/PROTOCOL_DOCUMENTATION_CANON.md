---
title: "Protocol Documentation Canon"
slug: protocol-documentation-canon
date: 2026-03-20
category: protocol
excerpt: "Canonical documentation protocol."
---

# PROTOCOLO — DOCUMENTAÇÃO CANÔNICA

> Documento canônico. Define como o conhecimento é materializado, organizado e preservado no ecossistema.

---

## FRASE CANÔNICA

> **"Nada entra no ecossistema como ideia solta; tudo entra como sistema, família, protocolo, grupo ou camada canônica."**

---

## 1. ESSÊNCIA

O sistema de documentação canônica é o mecanismo pelo qual avanços estruturais deixam de ser conhecimento tácito e se tornam infraestrutura permanente do ecossistema. Documento não é burocracia — é código de segunda ordem. Define o que o ecossistema sabe sobre si mesmo.

---

## 2. LEI DE ENTREGA

**Todo avanço estrutural deve ser materializado em documento canônico antes de ser considerado completo.**

Avanço estrutural inclui:
- Decisões de arquitetura.
- Criação de novos protocolos ou leis.
- Definição de identidade, marca ou linguagem.
- Conclusão de força-tarefa com aprendizados.
- Lançamento de produto ou feature significativa.
- Mudança de direção estratégica.

**Não** inclui:
- Correções de bug sem impacto sistêmico.
- Tarefas operacionais rotineiras.
- Experimentos não concluídos.

---

## 3. OS 3 RASTROS OBRIGATÓRIOS

Todo avanço estrutural deixa exatamente 3 rastros no ecossistema:

### Rastro 1 — Documento Canônico
O registro formal e definitivo. Segue o padrão de 8 seções (ver seção 5). Vive em `/docs/` na pasta correspondente ao tipo. É imutável após aprovação — novas versões são documentos novos, não edições do original.

### Rastro 2 — Matéria Didática
A explicação acessível do avanço para agentes e colaboradores que precisam entender sem precisar ler o documento canônico completo. Vive em `/docs/didactic/`. Pode ser um resumo, um tutorial ou uma explicação de "por que isso importa".

### Rastro 3 — Registro Histórico
A entrada no Timeless Terminal que marca o momento do avanço. Inclui: data, contexto, decisão tomada, agentes envolvidos e referência ao documento canônico. Vive em `/docs/history/`. É o log do ecossistema.

---

## 4. ESTRUTURA DE PASTAS

```
/docs
├── manifestos/          # Manifestos de sistema, produto e identidade
├── architecture/        # Arquitetura técnica, árvores de sistema, mapas de componentes
├── protocols/           # Protocolos operacionais canônicos
├── didactic/            # Matéria didática e explicações acessíveis
├── history/             # Registro histórico de avanços e decisões
└── strategy/            # Documentos de direção estratégica e posicionamento
```

**Regras de pasta:**
- Cada arquivo vai para uma única pasta. Sem duplicatas.
- Nenhum documento vive na raiz de `/docs/` sem aprovação soberana.
- Subpastas dentro de cada categoria são permitidas para organização, mas não para criar hierarquia de autoridade.

---

## 5. PADRÃO DE ESCRITA — 8 SEÇÕES

Todo documento canônico segue esta estrutura. Seções podem ser omitidas apenas se genuinamente não aplicáveis — nunca por economia de esforço.

| # | Seção | Conteúdo |
|---|-------|----------|
| 1 | **Essência** | O que é. Uma frase definitiva + expansão. Sem ambiguidade. |
| 2 | **Objetivo** | Para que serve. O que muda no ecossistema por causa deste documento. |
| 3 | **Definições** | Termos técnicos e conceitos usados. Sem assumir conhecimento prévio. |
| 4 | **Leis** | Regras não negociáveis. O que sempre é verdade dentro deste sistema. |
| 5 | **Aplicação prática** | Como usar. Exemplos concretos. O que fazer e o que não fazer. |
| 6 | **O que não é** | Limites explícitos. Confusões comuns eliminadas. |
| 7 | **Estado atual** | Onde o sistema está hoje em relação a este documento. |
| 8 | **Próximos refinamentos** | O que ainda precisa evoluir. Não pendências — direções. |

---

## 6. PADRÕES DE QUALIDADE DE ESCRITA

- **Densidade sobre extensão.** Cada parágrafo carrega informação. Sem padding.
- **Precisão sobre generalidade.** Termos vagos são proibidos em documentos canônicos.
- **Ativo sobre passivo.** Voz ativa sempre que possível.
- **Estrutura antes de prosa.** Use tabelas, listas e hierarquias antes de parágrafos longos.
- **Idioma:** Português. Termos técnicos em inglês quando não há equivalente preciso em português.

---

## 7. CICLO DE VIDA DE UM DOCUMENTO CANÔNICO

```
RASCUNHO → REVISÃO → APROVAÇÃO → PUBLICAÇÃO → [ATIVO]
                                                    ↓
                                              DEPRECAÇÃO (se necessário)
                                                    ↓
                                              ARQUIVO em /docs/history/
```

- **Rascunho:** existe no branch de trabalho. Pode ser editado livremente.
- **Revisão:** passa pelo Auditor da força-tarefa ou arquiteto responsável.
- **Aprovação:** Arquiteto de Missão ou autoridade soberana assina.
- **Publicação:** merge para branch principal. Documento é imutável a partir daqui.
- **Deprecação:** novo documento substitui o anterior. Original arquivado, nunca deletado.

---

## 8. O QUE NÃO É DOCUMENTAÇÃO CANÔNICA

- Comentários em código (são rastros de implementação, não conhecimento sistêmico).
- Mensagens de commit (são rastros de mudança, não definições).
- Issues ou tickets (são rastros de trabalho, não leis).
- Conversas e notas de reunião (são insumos para documentação, não a documentação).
- READMEs de repositório (são orientações de uso, não documentos canônicos — salvo exceção declarada).

---

## 9. ESTADO ATUAL

- Estrutura de pastas: criada e operacional.
- Padrão de 8 seções: canônico e em uso.
- Processo de aprovação: em implantação — atualmente revisado por Arquiteto de Missão.
- Timeless Terminal: integração com rastro histórico em desenvolvimento.
- Matéria didática: subproduzida — prioridade de próximo ciclo.

---

## 10. PRÓXIMOS REFINAMENTOS

- Automatizar geração de rastro histórico a partir de merge de documentos canônicos.
- Criar template de documento canônico como arquivo base no repositório.
- Definir processo de deprecação com notificação aos agentes que referenciam o documento.
- Produzir matéria didática para os primeiros 5 documentos canônicos publicados.