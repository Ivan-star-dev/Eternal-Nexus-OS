/**
 * LabPage.tsx — /lab route
 * Creation Lab face — NexusSurface hero + LabSurface work environment.
 *
 * Layout:
 *   1. NexusSurface — hero (unchanged, owns its own nav)
 *   2. LabSurface — actual work environment below hero (V7-SURFACES-001)
 *   3. Research section — ResearchFeed
 *
 * Canon: NS-1-001 + V7-SURFACES-001 · K-04+K-05+K-06+K-07
 * @framer+@cursor | 2026-03-28
 */

import { motion } from "framer-motion";
import NexusSurface from "@/components/nexus-surface/NexusSurface";
import LabSurface from "@/components/lab-surface/LabSurface";
import ResearchFeed from "@/components/research/ResearchFeed";
import LabEntryHeader from "@/components/lab-surface/LabEntryHeader";
import WaitlistBanner from "@/components/access/WaitlistBanner";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LabPage() {
  return (
    <div style={{ background: "#0a0a1a", minHeight: "100svh" }}>
      {/* ── Premium entry header — authenticated users only ── */}
      <LabEntryHeader />
      {/* ── Hero — NexusSurface unchanged ── */}
      <NexusSurface />

      {/* ── Lab Surface — actual work environment ── */}
      <LabSurface />

      {/* ── Research section — below work environment ── */}
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

      {/* ── Waitlist banner — unauthenticated visitors ── */}
      <WaitlistBanner />
    </div>
  );
}
