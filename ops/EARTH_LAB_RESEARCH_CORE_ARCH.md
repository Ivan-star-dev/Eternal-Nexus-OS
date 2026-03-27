# EARTH_LAB_RESEARCH_CORE_ARCH — Arquitectura Research Core

**Task:** V5-RESEARCH-ARCH-001
**Executor:** @claude
**Data:** 2026-03-26
**Gate:** fechado — abre quando V3+V4 done
**Propósito:** Pré-carregar V5 para entrada instantânea quando V4 fechar

---

## MISSÃO V5

```
Earth Lab vira laboratório de verdade.
O utilizador não apenas observa o planeta — investiga-o.
Hipóteses · evidências · trilhos de pesquisa · salas de problema.
Metodologia investigativa nativa ao produto.
```

---

## 4 PILARES DO RESEARCH CORE

### PILAR 1 — HYPOTHESIS BOARDS

```
O QUÊ:
  Espaço onde o utilizador formula e testa hipóteses sobre o planeta.
  Cada hipótese é uma entidade: título · evidência · estado · confiança.

DATA MODEL:
  hypothesis {
    id, title, description,
    evidence: Evidence[],
    status: 'open'|'testing'|'confirmed'|'rejected',
    confidence: 0-1,
    region: GlobeRegion | null,
    created_at, updated_at
  }

UI:
  Board visual com cards · drag-to-test · ligação ao globe
  Ao confirmar hipótese → marca região no globe
```

### PILAR 2 — RESEARCH TRAILS

```
O QUÊ:
  Trilhos de pesquisa — sequência de descobertas ligadas.
  O utilizador navega pelo conhecimento como navega pelo planeta.

DATA MODEL:
  trail {
    id, name, description,
    nodes: TrailNode[],
    status: 'active'|'complete'|'archived',
    created_by, created_at
  }
  TrailNode {
    id, type: 'hypothesis'|'evidence'|'insight'|'question',
    content, linked_to: TrailNode[]
  }

UI:
  Timeline vertical · nodes ligaáveis · breadcrumb de descoberta
```

### PILAR 3 — CONCEPT LENS

```
O QUÊ:
  Lupa conceptual — zoom semântico sobre um tema do planeta.
  Entra em "energia solar" → vê todos os projectos, hipóteses e dados ligados.

DATA MODEL:
  concept {
    id, name, aliases: string[],
    linked_projects: Project[],
    linked_hypotheses: Hypothesis[],
    related_concepts: Concept[],
    globe_regions: GlobeRegion[]
  }

UI:
  Search → Lens view · graph de relações · ligação ao globe
```

### PILAR 4 — PROBLEM ROOMS

```
O QUÊ:
  Salas de problema — espaço focado para atacar um problema específico.
  Cada sala é um contexto fechado: problema · constraints · soluções · veredicto.

DATA MODEL:
  problem_room {
    id, title, problem_statement,
    constraints: string[],
    solutions: Solution[],
    verdict: string | null,
    status: 'open'|'in_progress'|'solved'|'abandoned',
    participants: User[]
  }

UI:
  Room view imersivo · whiteboard mínimo · veredicto selado
```

---

## SUPABASE SCHEMA V5

```sql
-- Hypothesis Boards
CREATE TABLE hypotheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  confidence FLOAT DEFAULT 0,
  region_id UUID REFERENCES globe_regions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Research Trails
CREATE TABLE research_trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trail_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID REFERENCES research_trails(id),
  type TEXT NOT NULL,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Problem Rooms
CREATE TABLE problem_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  problem_statement TEXT,
  status TEXT DEFAULT 'open',
  verdict TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## CRITÉRIO DE FECHO V5

```
PASSA se:
  ✓ Hypothesis Boards — criar · testar · confirmar/rejeitar hipótese
  ✓ Research Trails — criar trilho · adicionar nodes · navegar
  ✓ Problem Rooms — abrir sala · adicionar soluções · selar veredicto
  ✓ Pelo menos 3 features ligadas ao globe (regiões visíveis)
  ✓ Dados reais no Supabase (não mockados)
```

---

## ENTRADA INSTANTÂNEA

```
Quando @codex emitir GATE_V5_OPEN:
  @claude  → este ficheiro já existe → brief para @cursor imediatamente
  @cursor  → lêr EARTH_LAB_RESEARCH_CORE_ARCH.md → começar V5-RESEARCH-CORE-IMPL-001
  Sem espera. Sem instrução adicional.
```

---

*EARTH_LAB_RESEARCH_CORE_ARCH.md — 2026-03-26 | @claude | V5-RESEARCH-ARCH-001 | pré-carregado*
