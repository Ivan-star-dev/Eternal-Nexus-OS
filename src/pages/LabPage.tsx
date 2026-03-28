/**
 * LabPage.tsx — /lab route
 * Creation Lab portal — V10 REAL upgrade.
 *
 * Layout:
 *   1. LabEntryHeader — authenticated user badge (unchanged)
 *   2. LabHero — unique Creation Lab entry (replaces NexusSurface)
 *   3. LabSurface — work environment: QuickCreate + WorkBay + ToolSpine
 *   4. Research section — ResearchFeed
 *   5. WaitlistBanner — unauthenticated visitors
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 3 · Creation Lab
 * @claude | 2026-03-28
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import LabHero from "@/components/lab-surface/LabHero";
import LabSurface from "@/components/lab-surface/LabSurface";
import ResearchFeed from "@/components/research/ResearchFeed";
import LabEntryHeader from "@/components/lab-surface/LabEntryHeader";
import WaitlistBanner from "@/components/access/WaitlistBanner";
import { useEvolution } from "@/hooks/useEvolution";
import { useSession } from "@/contexts/SessionContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LabPage() {
  const { session, startSession } = useSession();

  // Ensure session is initialised when the Lab is visited cold (no prior session)
  useEffect(() => {
    if (!session) {
      startSession('Creation Lab', 'open-lab');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Record portal visit for evolution engine
  useEvolution();

  return (
    <>
      {/* ── Premium entry header — authenticated users only ── */}
      <LabEntryHeader />

      {/* ── Hero — Creation Lab identity (distinct from Nexus) ── */}
      <LabHero />

      {/* ── Lab Surface — work environment with QuickCreate + WorkBay + ToolSpine ── */}
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
              color: "rgba(0,170,255,0.4)",
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
              color: "rgba(228,235,240,0.85)",
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
    </>
  );
}
