import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type SignalType = "CORRELATION" | "ANOMALY" | "TREND" | "FORECAST" | "PATTERN";
type FilterTab = "ALL" | SignalType;

interface IntelCard {
  id: number;
  type: SignalType;
  confidence: number;
  headline: string;
  analysis: string;
  domain: string;
  source: string;
  period: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CARDS: IntelCard[] = [
  {
    id: 1,
    type: "CORRELATION",
    confidence: 94,
    headline: "Interest rate spikes correlate with 18-month lag in startup formation",
    analysis:
      "Across 22 markets (2010–2025), rate hike cycles precede 30–40% formation drops with consistent 18-month lag. Current cycle implies trough in Q3 2026.",
    domain: "Economics",
    source: "World Bank",
    period: "2026-03",
  },
  {
    id: 2,
    type: "TREND",
    confidence: 87,
    headline: "Carbon credit markets showing institutional accumulation not seen since 2019",
    analysis:
      "Volume-weighted buying pressure from pension funds now exceeds retail 4:1. Previous analogues preceded 60–80% price appreciation within 24 months.",
    domain: "Climate",
    source: "BloombergNEF",
    period: "2026-02",
  },
  {
    id: 3,
    type: "ANOMALY",
    confidence: 78,
    headline: "AI compute demand growing faster than historical tech adoption S-curves",
    analysis:
      "Current trajectory exceeds all prior tech adoption curves including mobile (2007) and cloud (2012). Inflection point or dataset artefact — under investigation.",
    domain: "Technology",
    source: "Epoch AI",
    period: "2026-02",
  },
  {
    id: 4,
    type: "FORECAST",
    confidence: 82,
    headline: "Southeast Asia supply chain density expected to surpass China Pearl River Delta by 2031",
    analysis:
      "Vietnam, Indonesia, Malaysia attracting sequential FDI at compounding rates. 5-year projection window opens policy leverage for early positioning.",
    domain: "Geopolitics",
    source: "UNCTAD",
    period: "2026-01",
  },
  {
    id: 5,
    type: "PATTERN",
    confidence: 91,
    headline: "Democratic backsliding index correlates strongly with trade deficit expansion",
    analysis:
      "17 of last 20 democratic regression events preceded by sustained trade deficit >6% of GDP for 3+ years. Causal pathway under active modeling.",
    domain: "Geopolitics",
    source: "Freedom House",
    period: "2026-01",
  },
  {
    id: 6,
    type: "ANOMALY",
    confidence: 91,
    headline: "Sovereign debt issuance pace exceeds 2008–2010 crisis levels in 4 G20 economies",
    analysis:
      "Structural shift or cyclical? Pattern ambiguous — flagged for hypothesis formation.",
    domain: "Finance",
    source: "IMF",
    period: "2026-03",
  },
  {
    id: 7,
    type: "TREND",
    confidence: 76,
    headline: "Renewable energy LCOE reaches parity with fossil in 31 additional markets",
    analysis:
      "Rate of parity crossings doubled YoY. Tipping point dynamics now visible in emerging markets.",
    domain: "Climate",
    source: "IRENA",
    period: "2026-02",
  },
  {
    id: 8,
    type: "CORRELATION",
    confidence: 88,
    headline: "University density predicts startup ecosystem quality with 6-year lag",
    analysis:
      "Validated across 40 cities. Policy implication: education investment = future innovation infrastructure.",
    domain: "Education",
    source: "OECD",
    period: "2026-01",
  },
];

const FILTER_TABS: FilterTab[] = ["ALL", "CORRELATION", "ANOMALY", "TREND", "FORECAST", "PATTERN"];

const ACTIVE_DOMAINS = [
  { name: "Geopolitical Shifts", progress: 72 },
  { name: "Climate Tipping Points", progress: 48 },
  { name: "AI Compute Markets", progress: 91 },
];

const CONFIDENCE_TIERS = [
  { label: ">90%", count: CARDS.filter((c) => c.confidence > 90).length, color: "bg-gold" },
  { label: "70–90%", count: CARDS.filter((c) => c.confidence >= 70 && c.confidence <= 90).length, color: "bg-teal-400" },
  {
    label: "50–70%",
    count: CARDS.filter((c) => c.confidence >= 50 && c.confidence < 70).length,
    color: "bg-paper-dim/40",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const typeColor: Record<SignalType, string> = {
  CORRELATION: "text-blue-400 border-blue-400/30",
  ANOMALY: "text-rose-400 border-rose-400/30",
  TREND: "text-emerald-400 border-emerald-400/30",
  FORECAST: "text-purple-400 border-purple-400/30",
  PATTERN: "text-amber-400 border-amber-400/30",
};

const typeDot: Record<SignalType, string> = {
  CORRELATION: "bg-blue-400",
  ANOMALY: "bg-rose-400",
  TREND: "bg-emerald-400",
  FORECAST: "bg-purple-400",
  PATTERN: "bg-amber-400",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterBar({
  active,
  onChange,
}: {
  active: FilterTab;
  onChange: (t: FilterTab) => void;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={[
            "px-3 py-1.5 font-mono text-[0.5rem] tracking-[0.18em] uppercase transition-all duration-150",
            active === tab
              ? "text-gold border-b-2 border-gold/60"
              : "text-paper-dim/40 hover:text-paper-dim border-b-2 border-transparent",
          ].join(" ")}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function IntelCardItem({ card, index }: { card: IntelCard; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.55, ease }}
      className="border border-border bg-card/60 backdrop-blur-sm p-5 hover:border-gold/20 transition-colors duration-200 group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={[
              "font-mono text-[0.45rem] tracking-[0.22em] uppercase border px-2 py-0.5",
              typeColor[card.type],
            ].join(" ")}
          >
            {card.type}
          </span>
          <span className="font-mono text-[0.45rem] tracking-[0.15em] text-paper-dim/40 uppercase">
            {card.domain}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="font-mono text-[0.55rem] tracking-[0.1em] text-gold font-medium">
            {card.confidence}%
          </span>
          <span className="font-mono text-[0.4rem] tracking-[0.1em] text-paper-dim/30">
            CONFIDENCE
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="w-full h-px bg-border mb-3 relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-px bg-gold/50 transition-all duration-700"
          style={{ width: `${card.confidence}%` }}
        />
      </div>

      {/* Headline */}
      <h3 className="text-sm font-light text-paper leading-snug mb-2 group-hover:text-paper/90 transition-colors">
        {card.headline}
      </h3>

      {/* Analysis */}
      <p className="text-xs text-paper-dim/55 font-light leading-relaxed mb-4">
        {card.analysis}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={["w-1.5 h-1.5 rounded-full shrink-0", typeDot[card.type]].join(" ")}
          />
          <span className="font-mono text-[0.42rem] tracking-[0.12em] text-paper-dim/35 uppercase">
            Source: {card.source}
          </span>
        </div>
        <span className="font-mono text-[0.42rem] tracking-[0.1em] text-paper-dim/30">
          {card.period}
        </span>
      </div>
    </motion.article>
  );
}

function ActiveAnalysisPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease }}
      className="border border-border bg-card/60 backdrop-blur-sm p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[0.48rem] tracking-[0.22em] text-paper-dim/50 uppercase">
          Active Analysis
        </span>
      </div>

      <div className="space-y-4">
        {ACTIVE_DOMAINS.map((d, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-light text-paper/80">{d.name}</span>
              <span className="font-mono text-[0.45rem] tracking-[0.1em] text-gold/60">
                {d.progress}%
              </span>
            </div>
            <div className="w-full h-px bg-border relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-px bg-gold/40"
                initial={{ width: 0 }}
                whileInView={{ width: `${d.progress}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.3, duration: 0.8, ease }}
              />
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[...Array(4)].map((_, j) => (
                <span
                  key={j}
                  className={[
                    "inline-block w-1 h-1 rounded-full animate-pulse",
                    j === 0 ? "bg-emerald-400" : "bg-paper-dim/20",
                  ].join(" ")}
                  style={{ animationDelay: `${j * 0.25}s` }}
                />
              ))}
              <span className="font-mono text-[0.4rem] tracking-[0.1em] text-paper-dim/30 uppercase ml-1">
                Processing
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ConfidenceDistribution() {
  const max = Math.max(...CONFIDENCE_TIERS.map((t) => t.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.08, duration: 0.55, ease }}
      className="border border-border bg-card/60 backdrop-blur-sm p-5"
    >
      <span className="font-mono text-[0.48rem] tracking-[0.22em] text-paper-dim/50 uppercase block mb-4">
        Confidence Distribution
      </span>

      <div className="space-y-3">
        {CONFIDENCE_TIERS.map((tier, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="font-mono text-[0.45rem] tracking-[0.1em] text-paper-dim/40 w-12 shrink-0">
              {tier.label}
            </span>
            <div className="flex-1 h-2 bg-border rounded-sm overflow-hidden">
              <motion.div
                className={["h-full rounded-sm", tier.color].join(" ")}
                initial={{ width: 0 }}
                whileInView={{ width: `${(tier.count / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.7, ease }}
              />
            </div>
            <span className="font-mono text-[0.48rem] tracking-[0.1em] text-paper-dim/50 w-4 text-right shrink-0">
              {tier.count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SignalFeedStats() {
  const stats = [
    { label: "Active Signals", value: "8" },
    { label: "Domains Monitored", value: "6" },
    { label: "Update Frequency", value: "Continuous" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.14, duration: 0.55, ease }}
      className="border border-border bg-card/60 backdrop-blur-sm p-5"
    >
      <span className="font-mono text-[0.48rem] tracking-[0.22em] text-paper-dim/50 uppercase block mb-4">
        Signal Feed Stats
      </span>

      <div className="space-y-3">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
            <span className="font-mono text-[0.45rem] tracking-[0.12em] text-paper-dim/40 uppercase">
              {s.label}
            </span>
            <span className="font-mono text-[0.6rem] tracking-[0.08em] text-gold font-medium">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const IntelligenceFeed = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");

  useEffect(() => {
    document.title = "Intelligence Feed — Eternal Nexus OS";
  }, []);

  const filtered =
    activeFilter === "ALL" ? CARDS : CARDS.filter((c) => c.type === activeFilter);

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm py-16 sm:py-20 px-4 sm:px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[0.5rem] tracking-[0.28em] text-gold/60 uppercase">
              INTELLIGENCE FEED · V11 · AI ANALYSIS
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-paper mt-4 mb-5"
          >
            The world, interpreted.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm text-paper-dim/60 font-light leading-relaxed max-w-[620px]"
          >
            Continuous pattern detection across economics, geopolitics, climate, and technology.
            Every signal is traceable to data.
          </motion.p>
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-[60px] z-30 px-4 sm:px-6 md:px-16 py-3">
        <div className="max-w-[1400px] mx-auto">
          <FilterBar active={activeFilter} onChange={setActiveFilter} />
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 md:px-16 py-10 md:py-14">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — intelligence cards (2/3) */}
            <div className="lg:col-span-2 space-y-4">
              {filtered.length === 0 ? (
                <div className="border border-border bg-card/40 p-10 text-center">
                  <span className="font-mono text-[0.5rem] tracking-[0.2em] text-paper-dim/30 uppercase">
                    No signals match this filter
                  </span>
                </div>
              ) : (
                filtered.map((card, i) => (
                  <IntelCardItem key={card.id} card={card} index={i} />
                ))
              )}
            </div>

            {/* Right — sidebar panels (1/3) */}
            <div className="space-y-5">
              <ActiveAnalysisPanel />
              <ConfidenceDistribution />
              <SignalFeedStats />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IntelligenceFeed;
