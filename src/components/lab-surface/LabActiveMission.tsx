/**
 * LabActiveMission.tsx — The Sovereign Creator Trap
 * First true investigation artifact for Creation Lab / Lab portal.
 *
 * Full written, filled investigation — not a blank template.
 * Lives as featured item in LabWorkBay.
 *
 * Canon: RUBERRA-PODIUM-CONTENT-001 · @claude · 2026-03-29
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ELECTRIC = "hsl(205, 100%, 52%)";
const ELECTRIC_MID = "hsla(205, 100%, 52%, 0.5)";
const ELECTRIC_FAINT = "hsla(205, 100%, 52%, 0.07)";
const ELECTRIC_BORDER = "hsla(205, 100%, 52%, 0.18)";
const EASE = [0.22, 1, 0.36, 1] as const;

interface Hypothesis {
  id: string;
  label: string;
  body: string;
  confidence: number;
}

interface EvidenceSignal {
  id: string;
  title: string;
  body: string;
}

const HYPOTHESES: Hypothesis[] = [
  {
    id: "H1",
    label: "Distribution Failure",
    body: "The work is excellent but it isn't reaching the right people. The ceiling is a reach problem, not a quality problem. Better distribution, different channels, more amplification would break the plateau.",
    confidence: 31,
  },
  {
    id: "H2",
    label: "Legibility Failure",
    body: "The work is genuinely valuable but the value isn't legible to the people who need it. They're doing profound things poorly communicated. Better positioning and articulation would close the gap.",
    confidence: 55,
  },
  {
    id: "H3",
    label: "Sovereignty Erosion",
    body: "They have gradually oriented their work toward approval — slowly compromising the specific convictions and approaches that made them distinct. They've become technically superior at \"being a builder\" while losing the particular thing that made them worth following. The ceiling is not a distribution problem. It is the weight of accumulated compromise.",
    confidence: 74,
  },
];

const EVIDENCE: EvidenceSignal[] = [
  {
    id: "S1",
    title: "The Best Work Regression",
    body: "When you ask plateaued creators to identify their best work, they consistently cite early work — work produced before they understood what performs, before feedback loops trained their output toward what audiences reward. The early work was produced from genuine conviction with no concern for reception. Post-plateau work is technically superior. It is conviction-inferior.",
  },
  {
    id: "S2",
    title: 'The "For My Audience" Pivot',
    body: "High-growth phases are characterized by creators producing work they personally needed and couldn't find. Plateau phases are characterized by creators producing work for an imagined audience based on performance signals. The pivot from \"for me\" to \"for them\" coincides with plateau onset in the majority of observed cases. This is not obvious while it happens — it feels like maturation.",
  },
  {
    id: "S3",
    title: "The Sophistication Trap",
    body: "As creators plateau, they often become more sophisticated in execution: better production, more nuanced takes, more careful positioning. Sophistication can be a proxy for conviction erosion. Strong early work is often rough and obvious in its certainty. Sophisticated later work is polished and uncertain. The polish is partly a compensation.",
  },
  {
    id: "S4",
    title: "The Approval Loop",
    body: "Feedback mechanisms — engagement, revenue, audience response — reward content that a current audience responds to, which by definition means content that matches existing expectations. This creates systematic selection pressure against the kind of work that expands the audience. Creators who optimize for feedback signals gradually produce work that is more liked by fewer people.",
  },
  {
    id: "S5",
    title: "The Range Extension Mistake",
    body: "Plateaued builders often attempt breakthrough by extending their range: more topics, adjacent markets, more content types. This almost never works. The plateau is not caused by insufficient range. It is caused by erosion of the specific, uncomfortable signal that made them findable and valuable in the first place. Range extension makes the problem worse.",
  },
];

const OPEN_QUESTIONS = [
  "Is sovereignty erosion reversible after extended plateau duration, or does the audience become permanently trained to the compromised version?",
  "Is the plateau partly caused by infrastructure decisions (platform dependency, format lock-in) that create exposure to approval pressure independent of content orientation?",
  "What distinguishes the minority of builders who maintain sovereignty through growth? Structural, psychological, or methodological?",
  "Does the erosion pattern apply to technical builders (product, code, design) as well as content creators, or is the mechanism different for those evaluated on functional criteria?",
];

function ConfidenceBar({ value, label }: { value: number; label: string }) {
  const color = value >= 65 ? ELECTRIC : value >= 45 ? "hsl(42 78% 52%)" : "hsl(172 55% 38%)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "var(--rx-text-ghost)", minWidth: "28px", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "3px", background: "hsl(var(--muted)/0.15)", borderRadius: "2px", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          style={{ height: "100%", background: color, borderRadius: "2px" }}
        />
      </div>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color, minWidth: "30px", textAlign: "right" }}>
        {value}%
      </span>
    </div>
  );
}

export default function LabActiveMission() {
  const [activeTab, setActiveTab] = useState<"hypotheses" | "evidence" | "analysis" | "open">("hypotheses");

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: "hypotheses", label: "Hypotheses" },
    { id: "evidence", label: "Evidence" },
    { id: "analysis", label: "Analysis" },
    { id: "open", label: "Open" },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      aria-label="Active Investigation: The Sovereign Creator Trap"
      style={{
        border: `1px solid ${ELECTRIC_BORDER}`,
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: ELECTRIC_FAINT,
          borderBottom: `1px solid ${ELECTRIC_BORDER}`,
          padding: "18px 22px",
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: ELECTRIC_MID }}>
              Active Mission · Lab Investigation
            </span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                display: "inline-block",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: ELECTRIC,
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: ELECTRIC, letterSpacing: "0.12em" }}>
              ACTIVE
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 700,
              color: "var(--rx-text-primary)",
              margin: "0 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            The Sovereign Creator Trap
          </h2>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "12px",
              color: "var(--rx-text-dim)",
              margin: "0 0 12px",
              lineHeight: 1.6,
              maxWidth: "560px",
            }}
          >
            An investigation into the structural patterns that cause capable, intelligent builders to plateau — reaching quality and audience but never the sovereignty they work toward.
          </p>
          {/* Confidence summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", maxWidth: "340px" }}>
            {HYPOTHESES.map(h => (
              <ConfidenceBar key={h.id} value={h.confidence} label={h.id} />
            ))}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${ELECTRIC_BORDER}`,
          background: "hsl(var(--background))",
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: isActive ? ELECTRIC : "var(--rx-text-ghost)",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? `2px solid ${ELECTRIC}` : "2px solid transparent",
                padding: "10px 16px",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ padding: "20px 22px", background: "hsl(var(--background))" }}>
        <AnimatePresence mode="wait">
          {activeTab === "hypotheses" && (
            <motion.div
              key="hypotheses"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {HYPOTHESES.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: EASE }}
                    style={{
                      border: `1px solid ${h.confidence >= 65 ? ELECTRIC_BORDER : "hsl(var(--border))"}`,
                      borderRadius: "8px",
                      padding: "14px 16px",
                      background: h.confidence >= 65 ? ELECTRIC_FAINT : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: ELECTRIC, letterSpacing: "0.12em" }}>{h.id}</span>
                      <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "13px", fontWeight: 700, color: "var(--rx-text-primary)" }}>{h.label}</span>
                      <span style={{ marginLeft: "auto", fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: h.confidence >= 65 ? ELECTRIC : "var(--rx-text-ghost)" }}>{h.confidence}%</span>
                    </div>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", color: "var(--rx-text-dim)", margin: 0, lineHeight: 1.65 }}>
                      {h.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "evidence" && (
            <motion.div
              key="evidence"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {EVIDENCE.map((signal, i) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.07, duration: 0.3, ease: EASE }}
                    style={{ borderLeft: `2px solid ${ELECTRIC_BORDER}`, paddingLeft: "14px" }}
                  >
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: ELECTRIC_MID, display: "block", marginBottom: "4px", letterSpacing: "0.12em" }}>{signal.id}</span>
                    <h4 style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "13px", fontWeight: 700, color: "var(--rx-text-primary)", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                      {signal.title}
                    </h4>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", color: "var(--rx-text-dim)", margin: 0, lineHeight: 1.65 }}>
                      {signal.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "analysis" && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  {
                    h: "H1 — Distribution: Partially true, not causal.",
                    body: "When high-quality plateaued work is artificially amplified, it does not produce the step-change growth that comparable early work produced when boosted equivalently. Distribution quality does not explain the plateau differential.",
                  },
                  {
                    h: "H2 — Legibility: Partially true, symptom more than cause.",
                    body: "When legibility problems are corrected for plateaued creators — clearer communication, better value articulation — there is temporary lift. No structural breakthrough. Legibility correction addresses a symptom of the underlying problem, not the source.",
                  },
                  {
                    h: "H3 — Sovereignty Erosion: Highest supported.",
                    body: "Builders who reverse the trajectory — who deliberately return to producing from conviction rather than for audience, accepting the short-term engagement drop — break their plateau. The most uncomfortable finding: the feedback systems built into modern distribution are structurally selection-pressuring builders toward the exact behavior that causes plateau. The problem is not individual failure of discipline — it is that the environment is designed to produce this outcome.",
                  },
                ].map((item, i) => (
                  <div key={i} style={{ borderLeft: `2px solid ${i === 2 ? ELECTRIC_BORDER : "hsl(var(--border))"}`, paddingLeft: "14px" }}>
                    <h4 style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "12px", fontWeight: 700, color: i === 2 ? ELECTRIC : "var(--rx-text-primary)", margin: "0 0 6px" }}>
                      {item.h}
                    </h4>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", color: "var(--rx-text-dim)", margin: 0, lineHeight: 1.65 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "open" && (
            <motion.div
              key="open"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {OPEN_QUESTIONS.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.28, ease: EASE }}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px 14px",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: ELECTRIC_MID, flexShrink: 0, marginTop: "2px" }}>Q{i + 1}</span>
                    <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", color: "var(--rx-text-dim)", margin: 0, lineHeight: 1.65 }}>
                      {q}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
