/**
 * LabHero.tsx
 * Unique atmospheric entry for the Creation Lab portal.
 * Distinct identity from NexusSurface — focused, personal, precise.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 3 · Creation Lab
 * @claude + @framer | 2026-03-28
 */

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/contexts/SessionContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LabHero() {
  const { session } = useSession();
  const [showExplainer, setShowExplainer] = useState(false);

  const isResume =
    session?.is_resume &&
    (session.re_entry_point.startsWith('lab:') ||
      session.re_entry_point.startsWith('resume-swarm:'));

  const resumeSubject = isResume ? session?.subject : null;

  const handleOpenLab = () => {
    const target = document.getElementById("lab-work-bay");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      aria-label="Creation Lab entry"
      style={{
        position: "relative",
        background: "#060c14",
        minHeight: "72vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(64px, 12vh, 120px) clamp(20px, 5vw, 72px)",
        overflowX: "hidden",
      }}
    >
      {/* ── Ambient glow layers ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 55% 60% at 0% 80%, rgba(0,80,200,0.13) 0%, transparent 65%)",
            "radial-gradient(ellipse 45% 50% at 100% 20%, rgba(0,180,160,0.08) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* ── Engineering grid — subtle ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: [
            "linear-gradient(rgba(0,170,255,0.03) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(0,170,255,0.03) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)",
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
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(0,170,255,0.45)",
            }}
          >
            Heaven Lab · Creation Lab
          </span>
          {/* Live indicator */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.2em",
              color: "rgba(0,230,160,0.55)",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#00e5a0",
                boxShadow: "0 0 6px rgba(0,229,160,0.6)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            Active
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.08 }}
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 700,
            color: "rgba(220,232,245,0.94)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 20px",
          }}
        >
          Your{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00aaff 0%, #00e5a0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Creation Lab
          </span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(160,185,210,0.65)",
            lineHeight: 1.65,
            margin: "0 0 36px",
            maxWidth: "520px",
          }}
        >
          Where thought becomes executable form. Research, draft, simulate, and
          ship — everything you create lives here.
        </motion.p>

        {/* Resume badge — shown only on re-entry */}
        {isResume && resumeSubject && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.22 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(0,170,255,0.07)",
              border: "1px solid rgba(0,170,255,0.2)",
              borderRadius: "8px",
              padding: "9px 16px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#00aaff",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "rgba(0,170,255,0.75)",
              }}
            >
              Resume:{" "}
              <span style={{ color: "rgba(200,225,245,0.85)", fontStyle: "normal" }}>
                {resumeSubject}
              </span>
            </span>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
        >
          <motion.button
            onClick={handleOpenLab}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#060c14",
              background: "linear-gradient(135deg, #00aaff, #00c8d4)",
              border: "none",
              borderRadius: "8px",
              padding: "13px 28px",
              cursor: "pointer",
              boxShadow: "0 0 28px -4px rgba(0,170,255,0.35)",
            }}
          >
            {isResume ? "Continue Work" : "Open Work Bay"}
          </motion.button>

          <motion.button
            onClick={() => setShowExplainer(v => !v)}
            whileHover={{ borderColor: "rgba(0,170,255,0.35)", color: "rgba(0,170,255,0.85)" }}
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: showExplainer ? "rgba(0,170,255,0.85)" : "rgba(160,185,210,0.55)",
              background: "transparent",
              border: `1px solid ${showExplainer ? "rgba(0,170,255,0.35)" : "rgba(0,170,255,0.15)"}`,
              borderRadius: "8px",
              padding: "13px 24px",
              cursor: "pointer",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            {showExplainer ? "Got it" : "What is Creation Lab?"}
          </motion.button>
        </motion.div>

        {/* Inline explainer — answers the question */}
        <AnimatePresence>
          {showExplainer && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{
                marginTop: "20px",
                padding: "20px 24px",
                background: "rgba(0,170,255,0.04)",
                border: "1px solid rgba(0,170,255,0.12)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "500px",
              }}
            >
              {[
                ["Create", "Research, notes, plans, drafts, simulations — one click to start, one environment to hold them all."],
                ["Continue", "Every artifact remembers where you left off. Return tomorrow and pick up exactly where you were."],
                ["Own", "Your work lives here, not scattered across 12 tools. The lab is your sovereign workspace."],
              ].map(([label, text]) => (
                <div key={label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "8px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(0,170,255,0.55)",
                    flexShrink: 0,
                    marginTop: "3px",
                    minWidth: "44px",
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "13px",
                    color: "rgba(160,185,210,0.65)",
                    lineHeight: 1.6,
                  }}>
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom edge rule ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "clamp(20px, 5vw, 72px)",
          right: "clamp(20px, 5vw, 72px)",
          height: "1px",
          background: "linear-gradient(90deg, rgba(0,170,255,0.18), transparent 60%)",
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
