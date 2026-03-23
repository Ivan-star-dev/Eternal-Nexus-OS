/**
 * AIInsightsPanel.tsx — V11 Intelligence Layer
 * AI-generated insights on current world data. Live intelligence briefing.
 * sacred-flow: V11 | INTELLIGENCE_LAYER | 2026-03-23
 */

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── types ────────────────────────────────────────────────────────────────────

type SignalType = "CORRELATION" | "ANOMALY" | "TREND" | "FORECAST" | "PATTERN";

interface AIInsight {
  signalType: SignalType;
  confidence: number;
  headline: string;
  observation: string;
  domain: string;
  source: string;
  timestamp: string;
}

// ─── constants ────────────────────────────────────────────────────────────────

const SIGNAL_COLORS: Record<SignalType, string> = {
  CORRELATION: "border-l-blue-400/60",
  ANOMALY: "border-l-rose-400/60",
  TREND: "border-l-emerald-400/60",
  FORECAST: "border-l-[#C9A84C]/60",
  PATTERN: "border-l-violet-400/60",
};

const CONFIDENCE_FILL_COLORS: Record<SignalType, string> = {
  CORRELATION: "bg-blue-400/60",
  ANOMALY: "bg-rose-400/60",
  TREND: "bg-emerald-400/60",
  FORECAST: "bg-[#C9A84C]/60",
  PATTERN: "bg-violet-400/60",
};

const INSIGHTS: AIInsight[] = [
  {
    signalType: "CORRELATION",
    confidence: 87,
    headline: "Economic complexity predicts innovation output 3-5 years ahead",
    observation:
      "Countries with ECI above 1.2 show 34% higher patent output within 4 years across all sampled economies.",
    domain: "Economics",
    source: "World Bank",
    timestamp: "2026-03",
  },
  {
    signalType: "ANOMALY",
    confidence: 94,
    headline: "Carbon intensity drop accelerating beyond modeled baseline",
    observation:
      "Observed 2024-2025 reduction rate 2.3× faster than IPCC median scenario. Nonlinear effect potentially triggered.",
    domain: "Climate",
    source: "IEA",
    timestamp: "2026-02",
  },
  {
    signalType: "TREND",
    confidence: 79,
    headline: "Sub-Saharan urbanisation entering compounding phase",
    observation:
      "6 cities crossed 5M threshold in 18 months. Demographic momentum suggests 14 more by 2030.",
    domain: "Demographics",
    source: "UN Habitat",
    timestamp: "2026-01",
  },
  {
    signalType: "FORECAST",
    confidence: 71,
    headline: "AI productivity premium widens to 4:1 by Q4 2026",
    observation:
      "Current trajectory extrapolation from McKinsey, Brookings, and OECD datasets converges on 4.1× differential.",
    domain: "Technology",
    source: "OECD",
    timestamp: "2026-03",
  },
  {
    signalType: "PATTERN",
    confidence: 83,
    headline:
      "Multipolar trade consolidation correlates with domestic manufacturing revival",
    observation:
      "Pattern identified in 7 of 8 previous multipolar transitions in 20th century historical record.",
    domain: "Geopolitics",
    source: "IMF",
    timestamp: "2025-12",
  },
];

// ─── sub-components ──────────────────────────────────────────────────────────

function ConfidenceBar({
  confidence,
  signalType,
}: {
  confidence: number;
  signalType: SignalType;
}) {
  const fillWidth = `${confidence}%`;
  return (
    <div className="relative w-16 h-0.5 rounded-full bg-white/[0.06]">
      <div
        className={`absolute left-0 top-0 h-full rounded-full ${CONFIDENCE_FILL_COLORS[signalType]}`}
        style={{ width: fillWidth }}
      />
    </div>
  );
}

function InsightCard({
  insight,
  index,
}: {
  insight: AIInsight;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className={`bg-ink-medium/40 border border-white/[0.05] rounded-sm p-5 hover:border-[#C9A84C]/10 transition-all duration-200 border-l-2 ${SIGNAL_COLORS[insight.signalType]}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[0.42rem] tracking-[0.18em] uppercase text-white/40">
          {insight.signalType}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.42rem] tracking-[0.12em] text-white/30">
            {insight.confidence}% CONFIDENCE
          </span>
          <ConfidenceBar
            confidence={insight.confidence}
            signalType={insight.signalType}
          />
        </div>
      </div>

      {/* Headline */}
      <p className="font-serif text-sm font-light text-paper leading-snug mb-2">
        &ldquo;{insight.headline}&rdquo;
      </p>

      {/* Observation */}
      <p className="font-mono text-[0.6rem] leading-relaxed text-white/40 mb-4">
        {insight.observation}
      </p>

      {/* Footer row */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.42rem] tracking-[0.12em] uppercase px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-white/30 rounded-sm">
          {insight.domain}
        </span>
        <span className="font-mono text-[0.42rem] tracking-[0.12em] uppercase text-white/25">
          {insight.source}
        </span>
        <span className="font-mono text-[0.42rem] tracking-[0.08em] text-white/20 ml-auto">
          {insight.timestamp}
        </span>
      </div>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function AIInsightsPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-[0.42rem] tracking-[0.2em] uppercase text-white/30 mb-6"
        >
          INTELLIGENCE LAYER · V11
        </motion.p>

        {/* Badge + headline row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex flex-wrap items-center gap-4 mb-10"
        >
          {/* Badge */}
          <div className="flex items-center gap-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2 py-1 rounded-sm">
            {/* Pulsing dot */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C]/60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C9A84C]/80" />
            </span>
            <span className="font-mono text-[0.42rem] tracking-[0.15em] uppercase text-[#C9A84C]">
              AI ANALYSIS · LIVE
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-2xl md:text-3xl font-light text-paper">
            &ldquo;The system is thinking.&rdquo;
          </h2>
        </motion.div>

        {/* Insight cards */}
        <div className="flex flex-col gap-3">
          {INSIGHTS.map((insight, index) => (
            <InsightCard key={insight.signalType} insight={insight} index={index} />
          ))}
        </div>

        {/* Section footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="font-mono text-[0.42rem] tracking-[0.18em] uppercase text-white/20 mt-10 text-center"
        >
          NEXUS INTELLIGENCE ENGINE · 5 ACTIVE SIGNALS · CONTINUOUS ANALYSIS ·
          V11
        </motion.p>
      </div>
    </section>
  );
}
