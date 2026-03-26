# BRAND CORE — RUBERRA CORP / Eternal Nexus OS

> Identidade de marca canónica. Não é um guia de estilo — é a lei visual e verbal do sistema.
> Toda superfície, todo texto, todo componente obedece a esta lei.

_BRAND_CORE.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_

---

## 1. IDENTIDADE SOBERANA

**RUBERRA CORP** é uma corporação soberana de infra-estrutura planetária.
**Eternal Nexus OS** é o sistema operativo de inteligência que a sustenta.

A marca não compete com SaaS. Não imita startups. Não busca adopção de massa.

A marca comunica para um único perfil: o soberano operacional — o fundador que constrói sobre o mundo real com responsabilidade de escala e permanência.

---

## 2. PALETA DE CORES CANÓNICA

### Base — O Vazio Operacional

```css
/* Base — dark, profundo, sem ruído */
--color-base:         hsl(216, 50%, 5%);    /* fundo primário — quase preto azulado */
--color-base-subtle:  hsl(216, 40%, 8%);    /* painéis, cards, superfícies elevadas */
--color-base-muted:   hsl(216, 35%, 12%);   /* bordas, divisores, elementos secundários */
```

### Ouro — O Acento Soberano

```css
/* Gold — reservado para decisão, acção, destaque máximo */
--color-gold:         #C9A84C;              /* accent primário — botões, badges, CTAs */
--color-gold-dim:     rgba(201, 168, 76, 0.15);  /* fundos gold subtis, hover states */
--color-gold-border:  rgba(201, 168, 76, 0.3);   /* bordas douradas, linhas de separação premium */
```

### Texto — Hierarquia de Papel

```css
/* Text — papel, não branco */
--color-paper:        hsl(45, 20%, 88%);    /* texto primário — papel envelhecido, não branco puro */
--color-paper-muted:  hsl(45, 15%, 65%);   /* texto secundário, labels, metadados */
--color-paper-dim:    hsl(45, 10%, 45%);   /* texto terciário, placeholders, subtítulos */
```

### Status — Sinais Operacionais

```css
/* Status — sparingly, apenas onde o sistema fala */
--color-live:         hsl(142, 70%, 45%);   /* LIVE badge — projecto activo em tempo real */
--color-warning:      hsl(38, 92%, 50%);    /* alerta operacional */
--color-critical:     hsl(0, 72%, 51%);     /* estado crítico — raramente usado */
```

---

## 3. TIPOGRAFIA CANÓNICA

### Escala de Fontes

| Papel | Font family | Token TailwindCSS | Uso |
|---|---|---|---|
| **Headings soberanos** | Serif (ex: Playfair Display, EB Garamond) | `font-serif` | Títulos de página, declarações de visão, nomes de projecto |
| **Corpo e parágrafos** | Sans-serif (ex: Inter, DM Sans) | `font-sans` | Parágrafos, descrições, texto de suporte |
| **Labels e dados** | Monospace (ex: JetBrains Mono, Fira Code) | `font-mono` | Métricas, coordenadas, timestamps, IDs de sistema, código |

### Hierarquia Visual

```
H1 — font-serif, 3xl–5xl, paper, tracking-tight
  Uso: nome do sistema, visão do fundador, declaração principal da superfície

H2 — font-serif, xl–2xl, paper, tracking-normal
  Uso: secções de página, nomes de projecto, títulos de card

H3 — font-sans, lg, paper-muted, tracking-wide, uppercase
  Uso: sub-secções, labels de grupo, categorias

Body — font-sans, base, paper-muted
  Uso: parágrafos, descrições, conteúdo operacional

Label / Data — font-mono, sm, paper-dim
  Uso: timestamps, coordenadas, IDs, métricas brutas, status codes
```

---

## 4. FEEL DA MARCA — HEAVEN LAB

O sistema tem uma identidade de lugar: **o observatório soberano**.

```
HEAVEN LAB FEEL
═══════════════════════════════════════════════════════════

OBSERVATÓRIO: A superfície vê o mundo. Dados reais. Globo 3D.
              Luz dourada num fundo de vazio operacional.
              Cada elemento tem peso e propósito.

MÁQUINA: Não é decorativo. Cada componente existe porque resolve.
         Motion funcional — não ornamental.
         Framer Motion: entrance com propósito, não exibicionismo.

MARAVILHA: O sistema é impressionante — mas não por ser bonito.
           É impressionante porque revela algo real.
           O globo gira com dados vivos. Os projectos pulsam.
           A câmara voa para o hotspot que o owner seleccionou.

PRECISÃO: Cada pixel tem intenção. Espaçamento rigoroso.
          Bordas douradas onde há decisão. Sem ornamento supérfluo.
          A hierarquia é visível e imediata.
═══════════════════════════════════════════════════════════
```

---

## 5. VOZ E TOM

### O que RUBERRA diz

| Dimensão | Sim | Não |
|---|---|---|
| **Registo** | Soberano, preciso, ganho | Casual, coloquial, íntimo |
| **Complexidade** | Alta — não simplifica para adopção de massa | Condescendente, explicativo demais |
| **Confiança** | Declarativa — não pede permissão | Tentativa, hedging, "talvez" |
| **Emoção** | Contida, gravidade, permanência | Entusiasmo excessivo, exclamações |
| **Novidade** | Não é novidade — é inevitabilidade | Hype, "revolucionário", "disruptivo" |

### Exemplos de voz

**Certo:**
> "Eternal Nexus OS opera sobre seis projectos no mundo real. Não é uma demonstração."

> "O sistema recorda o que foi decidido. A sessão não se perde."

> "A proposta foi gerada sobre dados reais. Aceite ou rejeite."

**Errado:**
> "Bem-vindo ao futuro da gestão de projectos! Experimente agora!"

> "Esta incrível plataforma vai revolucionar a forma como gere os seus projectos."

> "É fácil de usar e acessível a todos."

---

## 6. MOTION — PRINCÍPIOS CANÓNICOS

O movimento no sistema tem três leis:

**Lei 1 — Motion tem propósito.**
Nenhuma animação existe por estética. Cada transição comunica estado, hierarquia, ou direcção de atenção.

**Lei 2 — Entrance é uma declaração.**
Componentes entram com peso. Duração 0.4–0.8s. Easing ease-out ou spring. Nunca pop — sempre deslize ou emergência.

**Lei 3 — Exit é resoluto.**
Componentes saem rapidamente. Duração 0.2–0.3s. Sem bounce. O sistema avança.

```typescript
// Entrance canónico — elemento soberano
{
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

// Stagger canónico — lista de elementos
{
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
}

// Exit canónico — elemento que sai
{
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
}
```

---

## 7. O QUE RUBERRA NÃO É

| Não é | Porque |
|---|---|
| **SaaS** | Não serve o mercado de massa. Não tem planos de preço. |
| **Startup** | Não está a crescer para ser adquirido. Constrói permanência. |
| **Corporate genérico** | Não usa stock photography, azuis corporativos, ou linguagem de compliance. |
| **Dashboard de métricas** | O sistema é inteligência soberana — não apenas visualização de dados. |
| **Produto de consumo** | O utilizador soberano não é um consumidor. É o construtor. |

---

## 8. IDENTIDADE DOS TRÊS ROSTOS

| Face | Território | Feel |
|---|---|---|
| **Heaven Lab** | Resolução — o observatório vê e decide | Dark, precision, gold, dados em tempo real |
| **Bridge Nova** | Aprendizagem — a ponte transfere conhecimento | Mais espaço, leitura, progressão clara |
| **Nexus Cria** | Criação — a forge constrói organismos | Interactividade, configuração, output activo |

Cada face usa a mesma paleta e tipografia. O que muda é a densidade de informação, a natureza do motion, e a intenção do espaço.

---

_BRAND_CORE.md v1.0 · 2026-03-26 · @claude · branch: claude/rebuild-bastion-core-rihGX_
