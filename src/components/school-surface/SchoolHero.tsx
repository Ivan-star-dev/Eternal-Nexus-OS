/**
 * SchoolHero.tsx — School / Bridge Nova sovereign entry.
 *
 * Mirrors LabHero structure and dignity.
 * Gold/amber DNA — mastery, progression, warmth.
 * Resume badge: cross-visit aware via returnTracker.
 * Maturity indicator: real level from useEvolution.
 *
 * Canon: TRI-CORE-PARITY-001 · School sovereign entry
 * @claude | 2026-03-28
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEvolution } from "@/hooks/useEvolution";
import { getReturnMetrics } from "@/lib/spawn/returnTracker";

const GOLD = "hsl(42, 78%, 52%)";
const GOLD_DIM = "hsla(42, 78%, 52%, 0.55)";
const GOLD_FAINT = "hsla(42, 78%, 52%, 0.15)";
const GOLD_BORDER = "hsla(42, 78%, 52%, 0.22)";
const EASE = [0.22, 1, 0.36, 1] as const;

const MATURITY_LABELS: Record<0 | 1 | 2 | 3, string> = {
  0: "Starting",
  1: "Familiar",
  2: "Practiced",
  3: "Expert",
};

export default function SchoolHero() {
  const { maturity, recordPortalVisit } = useEvolution();
  const [showExplainer, setShowExplainer] = useState(false);

  // Record portal visit for evolution engine
  useEffect(() => {
    recordPortalVisit('school');
  }, [recordPortalVisit]);

  const metrics = typeof window !== 'undefined' ? getReturnMetrics('school') : null;
  const isResume = metrics !== null && metrics.return_count > 0;

  const handleScrollToPath = () => {
    const target = document.getElementById("school-learning-path");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      aria-label="School entry"
      style={{
        position: "relative",
        minHeight: "68vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(64px, 12vh, 120px) clamp(20px, 5vw, 72px)",
        overflowX: "hidden",
      }}
    >
      {/* Ambient warm glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 50% 55% at 0% 75%, rgba(160,100,20,0.10) 0%, transparent 65%)",
            "radial-gradient(ellipse 40% 45% at 100% 25%, rgba(212,175,55,0.06) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: [
            `linear-gradient(${GOLD_FAINT.replace("0.15", "0.025")} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${GOLD_FAINT.replace("0.15", "0.025")} 1px, transparent 1px)`,
          ].join(", "),
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "760px" }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}
        >
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD_DIM }}>
            Bridge Nova · School
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.2em", color: GOLD_DIM, textTransform: "uppercase" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: GOLD, boxShadow: `0 0 6px ${GOLD}99`, animation: "pulse-gold 2s ease-in-out infinite" }} />
            {MATURITY_LABELS[maturity.level]}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.08 }}
          style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 700, color: "rgba(228,235,240,0.94)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 20px" }}
        >
          Your{" "}
          <span style={{ background: `linear-gradient(135deg, ${GOLD} 0%, hsl(35, 90%, 68%) 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Mastery Path
          </span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
          style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(200,185,160,0.60)", lineHeight: 1.65, margin: "0 0 36px", maxWidth: "520px" }}
        >
          Not courses. Not content. A sovereign progression system — every session builds on the last, every level earned by doing, not watching.
        </motion.p>

        {/* Maturity progress bar + resume state */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.20 }}
          style={{ marginBottom: "28px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}
        >
          {/* Level label row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD_DIM }}>
              Mastery Level {maturity.level} — {MATURITY_LABELS[maturity.level]}
            </span>
            {isResume && metrics && (
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.15em", color: "rgba(200,185,155,0.45)", textTransform: "uppercase" }}>
                Visit {metrics.visit_count}
              </span>
            )}
          </div>
          {/* Progress bar */}
          <div style={{ height: "3px", borderRadius: "2px", background: "rgba(212,175,55,0.12)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.min(100, (maturity.totalSessions / Math.max(1, (maturity.level + 1) * 4)) * 100)}%`,
              background: `linear-gradient(90deg, ${GOLD}, hsl(35,90%,68%))`,
              borderRadius: "2px",
              transition: "width 1s ease",
            }} />
          </div>
          {/* Session stat */}
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.18em", color: "rgba(200,185,155,0.38)", textTransform: "uppercase" }}>
            {maturity.totalSessions} session{maturity.totalSessions !== 1 ? "s" : ""} recorded
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
        >
          <motion.button
            onClick={handleScrollToPath}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: `linear-gradient(135deg, ${GOLD}, hsl(35, 90%, 65%))`, border: "none", borderRadius: "8px", padding: "13px 28px", cursor: "pointer", boxShadow: `0 0 28px -4px ${GOLD}55` }}
          >
            {isResume ? "Continue Path" : "Start Learning"}
          </motion.button>

          <motion.button
            onClick={() => setShowExplainer(v => !v)}
            whileHover={{ borderColor: GOLD_BORDER, color: GOLD_DIM }}
            style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: showExplainer ? GOLD_DIM : "rgba(200,185,160,0.45)", background: "transparent", border: `1px solid ${showExplainer ? GOLD_BORDER : "hsla(42,78%,52%,0.10)"}`, borderRadius: "8px", padding: "13px 24px", cursor: "pointer", transition: "color 0.2s, border-color 0.2s" }}
          >
            {showExplainer ? "Got it" : "How it works"}
          </motion.button>
        </motion.div>

        {/* Inline explainer */}
        <AnimatePresence>
          {showExplainer && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ marginTop: "20px", padding: "20px 24px", background: GOLD_FAINT, border: `1px solid ${GOLD_BORDER}`, borderRadius: "10px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}
            >
              {[
                ["Progress", "Each level unlocks the next. You advance by using, not by reading."],
                ["Depth",    "Real methods, real frameworks — not summaries. Mastery requires friction."],
                ["Carry",    "Your progress lives here. Return tomorrow at exactly your level."],
              ].map(([label, text]) => (
                <div key={label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD_DIM, flexShrink: 0, marginTop: "3px", minWidth: "48px" }}>{label}</span>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "13px", color: "rgba(200,185,160,0.55)", lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom rule */}
      <div aria-hidden style={{ position: "absolute", bottom: 0, left: "clamp(20px, 5vw, 72px)", right: "clamp(20px, 5vw, 72px)", height: "1px", background: `linear-gradient(90deg, ${GOLD_BORDER}, transparent 60%)` }} />

      <style>{`@keyframes pulse-gold { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
    </section>
  );
}
