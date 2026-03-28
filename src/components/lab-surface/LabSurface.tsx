/**
 * LabSurface.tsx
 * Root wrapper for Creation Lab portal surface.
 * V10 upgrade: wires QuickCreate + real artifact flow + tool handlers.
 *
 * Identity: Dark deep blue (#060c14), electric blue accents (#00aaff).
 * Density: MEDIUM — focused work bay, tools dormant until needed.
 * Motion: moderate — purposeful, never decorative.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 3 · Creation Lab
 * @claude | 2026-03-28
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import LabWorkBay from "./LabWorkBay";
import LabToolSpine from "./LabToolSpine";
import LabQuickCreate from "./LabQuickCreate";
import type { LabToolId } from "./LabToolSpine";
import type { ArtifactKind } from "@/lib/artifacts/types";
import { saveArtifact } from "@/lib/artifacts/store";
import { useSession } from "@/contexts/SessionContext";
import { usePortalIdentity } from "@/hooks/usePortalIdentity";

const EASE = [0.22, 1, 0.36, 1] as const;

// Map tool IDs to artifact kinds
const TOOL_KIND_MAP: Partial<Record<LabToolId, ArtifactKind>> = {
  research: "research",
  simulate: "simulation",
  draft: "draft",
};

export default function LabSurface() {
  const [toolsVisible, setToolsVisible] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const { session } = useSession();
  const { isMotionAllowed, isDenseAllowed } = usePortalIdentity();

  const handleArtifactCreated = useCallback(() => {
    // Bump refresh signal so LabWorkBay reloads
    setRefreshSignal(s => s + 1);
  }, []);

  const handleToolSelect = useCallback((toolId: LabToolId) => {
    const kind = TOOL_KIND_MAP[toolId];
    if (!kind) return;

    const sessionId = session?.session_id ?? "lab-anon";
    const labels: Record<ArtifactKind, string> = {
      research: "New Research",
      note: "New Note",
      plan: "New Plan",
      simulation: "New Simulation",
      draft: "New Draft",
      code: "New Code",
      synthesis: "New Synthesis",
      decision: "New Decision",
    };

    saveArtifact({
      session_id: sessionId,
      kind,
      title: labels[kind],
      summary: `Created from Lab Tool Spine.`,
      content: "",
      tags: ["creation-lab", "tool-spine"],
      source: "lab",
    });

    setRefreshSignal(s => s + 1);
  }, [session]);

  return (
    <section
      id="lab-work-bay"
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
            "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(0,100,220,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Section label */}
      <motion.div
        initial={isMotionAllowed('moderate') ? { opacity: 0, y: 12 } : false}
        whileInView={isMotionAllowed('moderate') ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ marginBottom: "32px" }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(0,170,255,0.3)",
            display: "block",
          }}
        >
          Portal · Creation Lab
        </span>
        <div
          style={{
            height: "1px",
            width: "36px",
            background: "linear-gradient(90deg, rgba(0,170,255,0.35), transparent)",
            marginTop: "10px",
          }}
        />
      </motion.div>

      {/* Quick Create row — always visible, above the work bay */}
      <motion.div
        initial={isMotionAllowed('moderate') ? { opacity: 0, y: 8 } : false}
        whileInView={isMotionAllowed('moderate') ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
        style={{ maxWidth: "1100px", margin: "0 auto 8px" }}
      >
        <LabQuickCreate onCreated={handleArtifactCreated} />
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
        <LabWorkBay refreshSignal={refreshSignal} />

        {/* Tool spine — right side, dormant until hover */}
        <div style={{ flexShrink: 0, width: "160px" }}>
          <LabToolSpine
            visible={toolsVisible}
            onToolSelect={handleToolSelect}
          />
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
          background: "linear-gradient(90deg, rgba(0,170,255,0.1), transparent)",
        }}
      />
    </section>
  );
}
