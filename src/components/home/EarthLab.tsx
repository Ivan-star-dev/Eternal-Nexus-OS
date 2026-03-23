/**
 * EarthLab.tsx — V5 Research Core
 * Scientific workspace: Hypotheses, Evidence Trails, Open Questions
 * sacred-flow: V5 | RESEARCH_CORE | 2026-03-23
 */

import { useState } from "react";
import { motion } from "framer-motion";

// ─── types ────────────────────────────────────────────────────────────────────

type TabId = "hypotheses" | "evidence" | "questions";

type HypothesisStatus = "VALIDATED" | "ACTIVE" | "TESTING";

interface Hypothesis {
  id: string;
  title: string;
  status: HypothesisStatus;
  domain: string;
  confidence: number;
  supporting: number;
  contradicting: number;
}

interface EvidenceEntry {
  date: string;
  type: "SUPPORTS" | "CONTRADICTS";
  hypothesis: string;
  description: string;
  domain: string;
}

type Priority = "CRITICAL" | "HIGH" | "MEDIUM";

interface OpenQuestion {
  id: string;
  question: string;
  domain: string;
  priority: Priority;
  posted: string;
  answers: number;
}

// ─── mock data ────────────────────────────────────────────────────────────────

const hypotheses: Hypothesis[] = [
  {
    id: "H1",
    title: "Countries with higher economic complexity outperform GDP-only metrics by 2030",
    status: "ACTIVE",
    domain: "Economics",
    confidence: 78,
    supporting: 5,
    contradicting: 1,
  },
  {
    id: "H2",
    title: "Carbon pricing above $80/tonne accelerates renewable adoption nonlinearly",
    status: "VALIDATED",
    domain: "Climate",
    confidence: 91,
    supporting: 9,
    contradicting: 2,
  },
  {
    id: "H3",
    title: "Multipolar trade blocks emerge as primary growth engine post-2025",
    status: "TESTING",
    domain: "Geopolitics",
    confidence: 61,
    supporting: 4,
    contradicting: 3,
  },
  {
    id: "H4",
    title: "AI productivity gains concentrate in top 20% income bracket first decade",
    status: "ACTIVE",
    domain: "Technology",
    confidence: 69,
    supporting: 6,
    contradicting: 4,
  },
  {
    id: "H5",
    title: "Sub-Saharan Africa urbanisation rate overtakes Asia by 2035",
    status: "ACTIVE",
    domain: "Demographics",
    confidence: 74,
    supporting: 7,
    contradicting: 2,
  },
];

const evidenceTrails: EvidenceEntry[] = [
  {
    date: "2026-03",
    type: "SUPPORTS",
    hypothesis: "H1",
    description: "IMF Economic Complexity Report confirms correlation r=0.84",
    domain: "Economics",
  },
  {
    date: "2026-02",
    type: "SUPPORTS",
    hypothesis: "H2",
    description: "EU Carbon Border Tax shows 23% renewable shift in Germany",
    domain: "Climate",
  },
  {
    date: "2026-01",
    type: "CONTRADICTS",
    hypothesis: "H3",
    description: "G7 trade volumes up 4.2% despite block formation narrative",
    domain: "Geopolitics",
  },
  {
    date: "2025-12",
    type: "SUPPORTS",
    hypothesis: "H4",
    description: "McKinsey AI Index: top quintile productivity +31%, bottom -2%",
    domain: "Technology",
  },
  {
    date: "2025-11",
    type: "SUPPORTS",
    hypothesis: "H5",
    description: "UN Habitat: Lagos, Nairobi, Kinshasa crossing 15M population",
    domain: "Demographics",
  },
  {
    date: "2025-10",
    type: "SUPPORTS",
    hypothesis: "H2",
    description: "IEA confirms carbon price threshold at $76 triggers inflection",
    domain: "Climate",
  },
];

const openQuestions: OpenQuestion[] = [
  {
    id: "Q1",
    question: "What is the causal mechanism between urban density and innovation output?",
    domain: "Urban Economics",
    priority: "HIGH",
    posted: "2026-02",
    answers: 0,
  },
  {
    id: "Q2",
    question: "Does digital currency adoption accelerate or retard financial inclusion in LMICs?",
    domain: "Finance",
    priority: "MEDIUM",
    posted: "2026-01",
    answers: 1,
  },
  {
    id: "Q3",
    question: "Can climate tipping points be delayed by regional rather than global coordination?",
    domain: "Climate",
    priority: "CRITICAL",
    posted: "2026-03",
    answers: 0,
  },
  {
    id: "Q4",
    question: "What threshold of AI penetration triggers structural unemployment vs. reallocation?",
    domain: "Technology",
    priority: "HIGH",
    posted: "2025-12",
    answers: 2,
  },
  {
    id: "Q5",
    question: "Is demographic dividend theory applicable in digital-first economies?",
    domain: "Demographics",
    priority: "MEDIUM",
    posted: "2025-11",
    answers: 3,
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function statusBadgeClass(status: HypothesisStatus): string {
  switch (status) {
    case "VALIDATED":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "ACTIVE":
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    case "TESTING":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
  }
}

function priorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case "CRITICAL":
      return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
    case "HIGH":
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    case "MEDIUM":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
  }
}

// ─── tab content ──────────────────────────────────────────────────────────────

function HypothesesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {hypotheses.map((h, i) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-sm p-4 flex flex-col gap-3"
        >
          {/* top row: status badge + domain tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-mono text-[0.42rem] tracking-[0.22em] uppercase px-2 py-0.5 rounded-sm ${statusBadgeClass(h.status)}`}
            >
              {h.status}
            </span>
            <span className="font-mono text-[0.42rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm bg-white/[0.04] text-white/40 border border-white/[0.06]">
              {h.domain}
            </span>
          </div>

          {/* title */}
          <p className="font-sans text-[0.72rem] text-paper/80 leading-relaxed">
            {h.title}
          </p>

          {/* confidence bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.42rem] tracking-[0.18em] text-white/30 uppercase">
                Confidence
              </span>
              <span className="font-mono text-[0.48rem] tracking-[0.12em] text-gold/70">
                {h.confidence}%
              </span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${h.confidence}%`,
                  background: "hsl(42 78% 45%)",
                }}
              />
            </div>
          </div>

          {/* supporting / contradicting */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.42rem] tracking-[0.14em] text-emerald-400/70">
              {h.supporting} supporting
            </span>
            <span className="text-white/20 text-[0.5rem]">·</span>
            <span className="font-mono text-[0.42rem] tracking-[0.14em] text-rose-400/70">
              {h.contradicting} contradicting
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function EvidenceTab() {
  return (
    <div className="p-4 pl-6">
      <div className="relative border-l border-white/[0.08] pl-6 flex flex-col gap-0">
        {evidenceTrails.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative pb-6 last:pb-0"
          >
            {/* dot */}
            <div
              className={`absolute -left-[1.625rem] top-1 w-3 h-3 rounded-full border-2 border-ink-deep ${
                entry.type === "SUPPORTS"
                  ? "bg-emerald-400"
                  : "bg-rose-400"
              }`}
            />

            <div className="flex flex-col gap-1.5">
              {/* meta row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[0.42rem] tracking-[0.18em] text-white/30 uppercase">
                  {entry.date}
                </span>
                <span
                  className={`font-mono text-[0.42rem] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-sm ${
                    entry.type === "SUPPORTS"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {entry.type}
                </span>
                <span className="font-mono text-[0.42rem] tracking-[0.18em] text-gold/50 uppercase">
                  {entry.hypothesis}
                </span>
                <span className="font-mono text-[0.42rem] tracking-[0.14em] text-white/20 uppercase px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded-sm">
                  {entry.domain}
                </span>
              </div>
              {/* description */}
              <p className="font-sans text-[0.72rem] text-paper/70 leading-relaxed">
                {entry.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QuestionsTab() {
  return (
    <div className="p-4 flex flex-col gap-3">
      {openQuestions.map((q, i) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-sm p-4 flex gap-3"
        >
          {/* icon */}
          <div className="shrink-0 w-6 h-6 rounded-sm bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mt-0.5">
            <span className="font-mono text-[0.55rem] tracking-[0.08em] text-gold/60">?</span>
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* question text */}
            <p className="font-sans text-[0.72rem] text-paper/80 leading-relaxed">
              {q.question}
            </p>

            {/* badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[0.42rem] tracking-[0.14em] uppercase px-1.5 py-0.5 rounded-sm bg-white/[0.04] text-white/40 border border-white/[0.06]">
                {q.domain}
              </span>
              <span
                className={`font-mono text-[0.42rem] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-sm ${priorityBadgeClass(q.priority)}`}
              >
                {q.priority}
              </span>
              <span className="font-mono text-[0.42rem] tracking-[0.14em] text-white/25 uppercase">
                {q.posted}
              </span>
              <span className="font-mono text-[0.42rem] tracking-[0.14em] text-white/25 uppercase">
                {q.answers === 0
                  ? "0 answers"
                  : `${q.answers} answer${q.answers > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

const tabs: { id: TabId; label: string }[] = [
  { id: "hypotheses", label: "Hypotheses" },
  { id: "evidence", label: "Evidence Trails" },
  { id: "questions", label: "Open Questions" },
];

export default function EarthLab() {
  const [activeTab, setActiveTab] = useState<TabId>("hypotheses");

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative py-16 px-4 sm:px-6 md:px-16 max-w-7xl mx-auto w-full"
      aria-label="EarthLab — V5 Research Core"
    >
      <div className="bg-ink-medium/60 border border-white/[0.05] rounded-sm overflow-hidden">
        {/* ── header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            {/* live indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold/80" />
            </span>
            <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/70 uppercase">
              Earth Lab · V5 Research Core
            </span>
          </div>
          <span className="hidden sm:block font-mono text-[0.42rem] tracking-[0.18em] text-white/20 uppercase">
            Research Cycle: Continuous
          </span>
        </div>

        {/* ── tabs ── */}
        <div className="flex items-center border-b border-white/[0.05] px-5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-mono text-[0.55rem] tracking-[0.18em] uppercase py-3 px-4 transition-all duration-200 border-b-2 -mb-px ${
                  isActive
                    ? "text-gold border-gold/70"
                    : "text-white/30 border-transparent hover:text-white/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── tab content ── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "hypotheses" && <HypothesesTab />}
          {activeTab === "evidence" && <EvidenceTab />}
          {activeTab === "questions" && <QuestionsTab />}
        </motion.div>

        {/* ── footer ── */}
        <div className="border-t border-white/[0.04] px-5 py-3 text-center">
          <span className="font-mono text-[0.48rem] tracking-[0.28em] text-paper-dim/30 uppercase">
            Earth Lab · 5 Active Hypotheses · 6 Evidence Trails · 5 Open Questions · Research Cycle: Continuous
          </span>
        </div>
      </div>
    </motion.section>
  );
}
