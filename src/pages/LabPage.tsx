/**
 * LabPage.tsx — /lab route
 * Heaven Lab face — NexusSurface v1 (NS-1-001) + Research feed section.
 *
 * Layout:
 *   1. NexusSurface — hero (unchanged, owns its own nav)
 *   2. Research section — "Latest Research" with ResearchFeed
 *
 * Canon: NS-1-001 · K-04 SURFACE · K-05 TYPOGRAPHY · K-06 COMPONENT
 *        V5-RESEARCH-IMPL-001 · K-07 IMPL · K-08 PIPELINE
 * @framer | @cursor | 2026-03-27
 */

import { motion } from "framer-motion";
import NexusSurface from "@/components/nexus-surface/NexusSurface";
import ResearchFeed from "@/components/research/ResearchFeed";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LabPage() {
  return (
    <div style={{ background: "#0a0a1a", minHeight: "100svh" }}>
      {/* ── Hero — NexusSurface unchanged ── */}
      <NexusSurface />

      {/* ── Research section — first content section below hero ── */}
      <section
        style={{
          padding: "clamp(64px, 10vh, 120px) clamp(16px, 4vw, 60px)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
        aria-label="Latest Research"
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: EASE }}
          style={{ marginBottom: "40px" }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.28em",
              color: "rgba(0,170,255,0.45)",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Heaven Lab · Research Feed
          </span>
          <h2
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 700,
              color: "rgba(228,235,240,0.88)",
              letterSpacing: "-0.02em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Latest{" "}
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
              Research
            </span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            style={{
              height: "1px",
              width: "48px",
              background: "linear-gradient(90deg, #00aaff, transparent)",
              marginTop: "16px",
              transformOrigin: "left",
            }}
          />
        </motion.div>

        {/* Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
        >
          <ResearchFeed />
        </motion.div>
      </section>
    </div>
  );
}
