/**
 * TestHero.tsx
 * Sovereign entry for the Lab tri-core (test / evidence / experiment) portal.
 * Distinct identity: emerald-green / teal — clinical, precise, falsifiable.
 *
 * Tri-core law: equal dignity with Creation Lab and School.
 * Canon: TRI-CORE-PARITY-001 · @claude · 2026-03-29
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/contexts/SessionContext";
import { getReturnMetrics } from "@/lib/spawn/returnTracker";
import { getRecentArtifacts } from "@/lib/artifacts/store";

const EASE = [0.22, 1, 0.36, 1] as const;
const TEAL = "hsl(172, 55%, 36%)";
const TEAL_LIGHT = "hsl(172, 48%, 55%)";
const TEAL_FAINT = "hsla(172, 55%, 36%, 0.18)";

export default function TestHero() {
  const { session, startSession } = useSession();
  const [showGuide, setShowGuide] = useState(false);
  const [lastArtifactTitle, setLastArtifactTitle] = useState<string | null>(null);

  const metrics = typeof window !== "undefined" ? getReturnMetrics("test") : null;
  const isReturn = (metrics?.return_count ?? 0) > 0;

  useEffect(() => {
    if (!session) {
      startSession("Lab Test Portal", "open-test");
    }
    const recent = getRecentArtifacts(1).filter(
      a => a.kind === "experiment" || a.kind === "evidence" || a.kind === "hypothesis"
    );
    if (recent.length > 0) setLastArtifactTitle(recent[0].title);
  }, []);

  const resumeLabel = isReturn && metrics
    ? `Visit ${metrics.visit_count}${lastArtifactTitle ? ` · ${lastArtifactTitle}` : ""}`
    : null;

  return (
    <section
      aria-label="Lab test portal entry"
      style={{
        position: "relative",
        minHeight: "72vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(64px, 12vh, 120px) clamp(20px, 5vw, 72px)",
        overflowX: "hidden",
      }}
    >
      {/* Ambient glow — emerald depth */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 50% 55% at 0% 70%, hsla(172,55%,20%,0.18) 0%, transparent 65%)",
            "radial-gradient(ellipse 40% 45% at 100% 30%, hsla(172,48%,30%,0.10) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Portal label */}
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "clamp(7px, 1vw, 9px)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: `${TEAL}99`,
          marginBottom: "28px",
          display: "block",
        }}
      >
        Lab · Test Reality
      </motion.span>

      {/* Resume badge */}
      <AnimatePresence>
        {resumeLabel && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: TEAL_FAINT,
              border: `1px solid ${TEAL}44`,
              borderRadius: "6px",
              padding: "5px 12px",
              marginBottom: "28px",
              width: "fit-content",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL_LIGHT, flexShrink: 0 }} />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: TEAL_LIGHT, letterSpacing: "0.04em" }}>
              {resumeLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.08 }}
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "clamp(36px, 7vw, 72px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: "rgba(228,235,240,0.92)",
          margin: 0,
          maxWidth: "720px",
        }}
      >
        {isReturn ? "Continue testing." : "Test your assumptions."}
      </motion.h1>

      {/* Subline */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "clamp(14px, 2vw, 17px)",
          color: "rgba(170,190,210,0.7)",
          maxWidth: "480px",
          marginTop: "18px",
          marginBottom: 0,
          lineHeight: 1.6,
        }}
      >
        Hypothesize. Test. Capture evidence. Nothing counts until it survives proof.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.24 }}
        style={{ display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap", alignItems: "center" }}
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => document.getElementById("test-bay")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "#05100d",
            background: TEAL,
            border: "none",
            borderRadius: "8px",
            padding: "12px 28px",
            cursor: "pointer",
          }}
        >
          {isReturn ? "Continue experiment" : "New experiment"}
        </motion.button>

        <motion.button
          whileHover={{ opacity: 1 }}
          onClick={() => setShowGuide(v => !v)}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: `${TEAL}aa`,
            background: "transparent",
            border: `1px solid ${TEAL}33`,
            borderRadius: "8px",
            padding: "11px 20px",
            cursor: "pointer",
            opacity: 0.8,
          }}
        >
          How it works
        </motion.button>
      </motion.div>

      {/* Guide explainer */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: "hidden", marginTop: "28px", maxWidth: "480px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "4px" }}>
              {[
                { label: "Hypothesize", desc: "State a falsifiable claim before testing." },
                { label: "Experiment", desc: "Run a structured test with defined conditions." },
                { label: "Evidence", desc: "Capture what you observed — exact, no interpretation." },
              ].map(({ label, desc }) => (
                <div key={label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: TEAL, letterSpacing: "0.12em", textTransform: "uppercase", paddingTop: "2px", minWidth: "90px" }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "13px", color: "rgba(170,190,210,0.65)", lineHeight: 1.5 }}>
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
