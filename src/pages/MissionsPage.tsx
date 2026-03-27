/**
 * MissionsPage.tsx — /missions route
 * V6-MISSIONS-IMPL-001 | K-07 IMPL | 2026-03-27
 *
 * Full-page view of all missions.
 * Dark theme (#0a0a1a), consistent with rest of the platform.
 */

import { motion } from "framer-motion";
import MissionsDashboard from "@/components/missions/MissionsDashboard";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MissionsPage() {
  return (
    <div
      style={{
        background: "#0a0a1a",
        minHeight: "100svh",
        padding: "clamp(48px, 8vh, 100px) clamp(16px, 4vw, 60px)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          style={{ marginBottom: "48px" }}
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ delay: 0.15, duration: 0.75 }}
            style={{
              display: "block",
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(228,235,240,0.35)",
              marginBottom: "12px",
            }}
          >
            Eternal Nexus · Structured Impact
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.75, ease: EASE }}
            style={{
              fontFamily: "serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              color: "rgba(228,235,240,0.92)",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Active{" "}
            <span
              style={{
                color: "#00aaff",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              Missions
            </span>
          </motion.h1>

          {/* Gold rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.38, duration: 0.75, ease: EASE }}
            style={{
              height: "1px",
              width: "60px",
              marginTop: "20px",
              background: "linear-gradient(90deg, #c8a44e 0%, transparent 100%)",
              transformOrigin: "left",
            }}
          />
        </motion.div>

        {/* ── Dashboard (full width, no "View All" link since we are on that page) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
        >
          <MissionsDashboard showViewAll={false} />
        </motion.div>
      </div>
    </div>
  );
}
