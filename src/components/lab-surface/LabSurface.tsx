/**
 * LabSurface.tsx
 * Root wrapper for Creation Lab portal surface.
 *
 * Identity: Dark deep blue (#060c14), electric blue accents (#00aaff).
 * Density: MEDIUM — focused work bay, tools dormant until needed.
 * Motion: moderate — purposeful, never decorative.
 *
 * Canon: V7-SURFACES-001 · K-04 SURFACE · K-06 COMPONENT · K-07 IMPL
 * @framer+@cursor | 2026-03-28
 */

import { useState } from "react";
import { motion } from "framer-motion";
import LabWorkBay from "./LabWorkBay";
import LabToolSpine from "./LabToolSpine";
import { usePortalIdentity } from "@/hooks/usePortalIdentity";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LabSurface() {
  const [toolsVisible, setToolsVisible] = useState(false);
  const { isMotionAllowed, isDenseAllowed } = usePortalIdentity();

  return (
    <section
      aria-label="Creation Lab"
      data-portal-dense={isDenseAllowed ? "true" : "false"}
      style={{
        background: "#060c14",
        minHeight: "100vh",
        padding: "clamp(48px, 8vh, 96px) clamp(16px, 4vw, 60px)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Subtle ambient radial — electric blue, very low opacity */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(0,100,220,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Section label */}
      <motion.div
        initial={isMotionAllowed('moderate') ? { opacity: 0, y: 12 } : false}
        whileInView={isMotionAllowed('moderate') ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ marginBottom: "40px" }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(0,170,255,0.35)",
            display: "block",
          }}
        >
          Portal · Creation Lab
        </span>
        <div
          style={{
            height: "1px",
            width: "36px",
            background: "linear-gradient(90deg, rgba(0,170,255,0.4), transparent)",
            marginTop: "10px",
          }}
        />
      </motion.div>

      {/* Main work area — hover triggers tool spine reveal */}
      <motion.div
        initial={isMotionAllowed('moderate') ? { opacity: 0 } : false}
        whileInView={isMotionAllowed('moderate') ? { opacity: 1 } : undefined}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
        onHoverStart={() => setToolsVisible(true)}
        onHoverEnd={() => setToolsVisible(false)}
        style={{
          display: "flex",
          gap: "clamp(24px, 4vw, 48px)",
          alignItems: "flex-start",
          maxWidth: "1100px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Work bay — main content */}
        <LabWorkBay />

        {/* Tool spine — right side, dormant until hover */}
        <div
          style={{
            flexShrink: 0,
            width: "160px",
            /* Hidden on small mobile to preserve density cap */
          }}
        >
          <LabToolSpine visible={toolsVisible} />
        </div>
      </motion.div>

      {/* Bottom line marker */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "clamp(16px, 4vw, 60px)",
          right: "clamp(16px, 4vw, 60px)",
          height: "1px",
          background: "linear-gradient(90deg, rgba(0,170,255,0.12), transparent)",
        }}
      />
    </section>
  );
}
