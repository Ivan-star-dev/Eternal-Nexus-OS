# ARQUITETURA — ÁRVORE DO ECOSSISTEMA VIVO

> Documento canônico. Mapa estrutural do Ecossistema Vivo (Camada 2).

---

## VISÃO GERAL

O Ecossistema Vivo é a infraestrutura operacional da Máquina Universal de Fábrica. Cada nó é uma entidade funcional com responsabilidade definida. Nenhum nó existe de forma isolada — todos se relacionam em hierarquia e em malha.

---

## ÁRVORE HIERÁRQUICA

```
ECOSSISTEMA VIVO
│
├── PORTAL SOBERANO
│   ├── Pioneers
│   │   ├── Modelos
│   │   ├── Versions
│   │   └── Workspaces
│   └── Neural Mesh
│       └── Timeless Terminal
│
├── BLOCKS
│   └── Layers
│
└── [Produtos fabricados pelo ecossistema]
    └── Earth Lab (produto-manifesto)
```

---

## DEFINIÇÕES DOS NÓS

### PORTAL SOBERANO
A interface central do ecossistema. Ponto de entrada para agentes, usuários e sistemas externos. Orquestra o acesso às entidades internas e define a experiência operacional do ecossistema.

---

### PIONEERS
O conjunto de entidades-raiz do Portal Soberano. São os primeiros nós a serem instanciados e definem o caráter operacional do ecossistema. Cada Pioneer é um ator com papel específico na fabricação.

**Relação:** Pioneer é pai de Modelos, Versions e Workspaces. Um Pioneer sem Modelo é potencial não realizado.

---

### MODELOS
Definições canônicas de comportamento, estrutura e capacidade de um Pioneer. Um Modelo é o DNA funcional — descreve o que o Pioneer pode fazer, como opera e quais contratos respeita.

**Relação:** Modelo pertence a um Pioneer. Um Modelo pode ter múltiplas Versions.

---

### VERSIONS
Instâncias versionadas de um Modelo. Cada Version representa um estado específico e imutável do Modelo em um ponto do tempo. Versions permitem evolução sem destruição do histórico.

**Relação:** Version pertence a um Modelo. Uma Version pode ser ativada em um Workspace.

---

### BLOCKS
Unidades atômicas de construção do ecossistema. Um Block é a menor parte funcional que pode ser composta, reutilizada e empilhada. Blocks são os tijolos da Fábrica.

**Relação:** Blocks se agrupam em Layers. Um Block pode pertencer a múltiplas Layers.

---

### LAYERS
Camadas compostas de Blocks com um propósito funcional coeso. Uma Layer agrupa Blocks relacionados para formar uma capacidade maior. Layers são os andaimes sobre os quais Workspaces operam.

**Relação:** Layer é composta por Blocks. Uma Layer pode ser consumida por Workspaces.

---

### WORKSPACES
Ambientes operacionais onde Versions são ativadas e trabalho é executado. Um Workspace é o espaço de execução — onde agentes, modelos e camadas convergem para produzir resultado.

**Relação:** Workspace ativa uma Version de um Modelo dentro de um Pioneer. Workspace consome Layers.

---

### NEURAL MESH
A malha de inteligência distribuída que conecta todos os nós do ecossistema. Neural Mesh é o sistema nervoso — transmite contexto, decisões e estado entre Pioneers, Workspaces e o Timeless Terminal.

**Relação:** Neural Mesh é transversal. Todos os nós são conectados por ela. É a camada de comunicação soberana.

---

### TIMELESS TERMINAL
O registro histórico imutável do ecossistema. Tudo que acontece — decisões, versões, estados, closures — é gravado no Timeless Terminal. É a memória permanente do sistema.

**Relação:** Timeless Terminal recebe dados de todos os nós via Neural Mesh. Nenhum nó lê do Terminal sem autorização de arquitetura.

---

## RELAÇÕES ENTRE NÓS

| De | Para | Tipo de Relação |
|----|------|-----------------|
| Portal Soberano | Pioneers | Contém / Orquestra |
| Pioneer | Modelos | Define / Instancia |
| Modelo | Versions | Versiona / Evolui |
| Version | Workspace | Ativa / Executa |
| Blocks | Layers | Compõe / Agrupa |
| Layers | Workspaces | Fornece capacidade |
| Neural Mesh | Todos os nós | Conecta / Transmite contexto |
| Todos os nós | Timeless Terminal | Grava estado via Neural Mesh |
| Ecossistema Vivo | Fábrica de Produtos | Sustenta / Habilita fabricação |

---

## PRINCÍPIOS DE INTEGRIDADE DA ÁRVORE

1. **Nenhum nó é criado fora da hierarquia.** Todo elemento pertence a um pai canônico.
2. **Nenhum nó é destruído sem closure formal.** Deprecação segue protocolo de auditoria.
3. **A Neural Mesh é o único canal de comunicação entre nós.** Comunicação direta fora da malha é violação de arquitetura.
4. **O Timeless Terminal é somente-escrita para operações normais.** Leitura é privilegiada e auditada.
5. **Workspaces são efêmeros; Versions são permanentes.** O trabalho passa; o registro fica.
