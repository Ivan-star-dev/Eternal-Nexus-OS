/**
 * ResearchPage.tsx — /research route
 * Research Intelligence — ResearchFeed (60%) + KnowledgeGraphStub (40%) on desktop.
 * Mobile: stacked, feed above, graph below.
 *
 * Canon: V5-RESEARCH-IMPL-001 · K-07 IMPL · K-08 PIPELINE
 * @cursor | 2026-03-27
 */

import { motion } from "framer-motion";
import ResearchFeed from "@/components/research/ResearchFeed";
import KnowledgeGraphStub from "@/components/research/KnowledgeGraphStub";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Page header ──────────────────────────────────────────────────────────────

function ResearchPageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: EASE }}
      style={{ marginBottom: "48px" }}
    >
      <motion.span
        initial={{ opacity: 0, letterSpacing: "0.5em" }}
        animate={{ opacity: 1, letterSpacing: "0.28em" }}
        transition={{ delay: 0.15, duration: 0.8 }}
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.28em",
          color: "rgba(0,170,255,0.5)",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "12px",
        }}
      >
        Eternal Nexus OS · Research Platform
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 700,
          color: "rgba(228,235,240,0.92)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        Research{" "}
        <span
          style={{
            background: "linear-gradient(90deg, #00aaff, #00e5a0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          Intelligence
        </span>
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
        style={{
          height: "1px",
          width: "60px",
          background: "linear-gradient(90deg, #00aaff, transparent)",
          marginTop: "20px",
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
}

// ─── ResearchPage ─────────────────────────────────────────────────────────────

export default function ResearchPage() {
  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#0a0a1a",
        overflowX: "hidden",
      }}
    >
      {/* Top navigation bar — minimal chrome */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          background: "rgba(10,10,26,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            letterSpacing: "0.28em",
            color: "rgba(200,164,78,0.5)",
            textTransform: "uppercase",
          }}
        >
          ETERNAL NEXUS OS
        </span>
        <a
          href="/"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            letterSpacing: "0.18em",
            color: "rgba(228,235,240,0.3)",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(228,235,240,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(228,235,240,0.3)";
          }}
        >
          ← Back
        </a>
      </motion.div>

      {/* Main content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(80px, 10vh, 120px) clamp(16px, 4vw, 60px) 80px",
        }}
      >
        <ResearchPageHeader />

        {/* Two-column layout: feed 60% / graph 40% on desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
            gap: "32px",
            alignItems: "start",
          }}
          className="research-layout"
        >
          {/* Feed column */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.75, ease: EASE }}
            aria-label="Research feed"
          >
            <h2
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.25em",
                color: "rgba(228,235,240,0.25)",
                textTransform: "uppercase",
                marginBottom: "24px",
                marginTop: 0,
              }}
            >
              Latest Research
            </h2>
            <ResearchFeed />
          </motion.section>

          {/* Graph column */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.75, ease: EASE }}
            aria-label="Knowledge graph"
            style={{ position: "sticky", top: "80px" }}
          >
            <h2
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.25em",
                color: "rgba(228,235,240,0.25)",
                textTransform: "uppercase",
                marginBottom: "24px",
                marginTop: 0,
              }}
            >
              Nexus Map
            </h2>
            <KnowledgeGraphStub />
          </motion.section>
        </div>
      </div>

      {/* Mobile responsive styles injected as style tag */}
      <style>{`
        @media (max-width: 768px) {
          .research-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
