# NEXUS_HARDWARE_HORIZON_MAP — Mapa de Horizonte Hardware

**Task:** NEXUS-HARDWARE-HORIZON-MAP-001
**Executor:** @claude
**Data:** 2026-03-26
**Propósito:** Mapear requisitos de hardware para escala plena — não construir agora, mapear agora

---

## PRINCÍPIO

```
O hardware não é construído agora.
É mapeado agora para não ser surpresa depois.
Cada camada de hardware segue o mesmo critério:
brain-first · retroengenharia · JVF ≥ 0.85
```

---

## HORIZONTE POR VERSÃO

| Versão | Requisito Hardware | Tipo | Prazo |
|--------|-------------------|------|-------|
| V3 | Servidor com GPU para R3F em produção | Cloud GPU | agora |
| V4 | CDN global para dados geo em tempo real | Edge CDN | V4 |
| V5 | Vector DB para pesquisa semântica | Cloud DB | V5 |
| V6 | Modelo AI tutor — inferência rápida | API/Cloud | V6 |
| V7 | Infra real-time distribuída (WebSocket escala) | Cloud WS | V7 |
| V8 | Edge compute para latência < 50ms global | Edge nodes | V8 |
| V9 | Inferência local (WebLLM / ONNX no browser) | Client-side | V9 |
| V10 | Hardware dedicado — edge + sensores + rede física | Owned infra | V10 |

---

## DECISÕES IMEDIATAS (V3/V4)

```
V3 — GLOBE 3D EM PRODUÇÃO
  Requisito: rendering R3F sem lag em produção
  Solução actual: Vercel Edge (adequado para V3)
  Monitorizar: performance do globe em mobile
  Decisão owner: confirmar plataforma de deploy

V4 — DADOS GEO EM TEMPO REAL
  Requisito: PostGIS + dados geográficos vivos
  Solução: Supabase com extensão PostGIS
  Decisão owner: confirmar Supabase PostGIS activo
```

---

## HARDWARE V10 — VISÃO COMPLETA

```
COMPUTAÇÃO EDGE:
  · Nodes distribuídos globalmente
  · Latência < 20ms para qualquer utilizador
  · Inferência AI local nos nodes

INFERÊNCIA LOCAL:
  · Modelo compresso no browser (WebLLM)
  · Zero latência para AI tutor
  · Privacidade total para dados de investigação

SENSORES (horizonte):
  · Integração com sensores reais de campo
  · Dados de investigação directamente no globe
  · IoT científico conectado ao Earth Lab

REDE FÍSICA:
  · Mesh de investigadores conectados
  · Data sharing P2P entre labs
  · Infraestrutura própria em escala plena
```

---

## DECISÕES OWNER NECESSÁRIAS

```
  1. Confirmar plataforma de deploy (Vercel · Netlify · própria)
  2. Confirmar Supabase PostGIS para V4
  3. Definir estratégia de inferência AI (API vs local) para V6
  4. Definir horizonte de escala (10K · 100K · 1M users) para dimensionar
```

---

*NEXUS_HARDWARE_HORIZON_MAP.md — 2026-03-26 | @claude | NEXUS-HARDWARE-HORIZON-MAP-001*
