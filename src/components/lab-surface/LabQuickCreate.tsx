/**
 * LabQuickCreate.tsx
 * Quick artifact creation row — 4 types in one action.
 * Clicking creates a real artifact via artifact memory layer.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 3 · Creation Lab
 * @claude | 2026-03-28
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveArtifact } from "@/lib/artifacts/store";
import type { ArtifactKind } from "@/lib/artifacts/types";
import { useSession } from "@/contexts/SessionContext";

const EASE = [0.22, 1, 0.36, 1] as const;

interface CreateOption {
  kind: ArtifactKind;
  label: string;
  icon: string;
  defaultTitle: string;
  defaultSummary: string;
}

const OPTIONS: CreateOption[] = [
  {
    kind: "research",
    label: "Research",
    icon: "⌖",
    defaultTitle: "New Research",
    defaultSummary: "Research thread started from Creation Lab.",
  },
  {
    kind: "note",
    label: "Note",
    icon: "◻",
    defaultTitle: "New Note",
    defaultSummary: "Quick note captured in Creation Lab.",
  },
  {
    kind: "plan",
    label: "Plan",
    icon: "◈",
    defaultTitle: "New Plan",
    defaultSummary: "Execution plan started in Creation Lab.",
  },
  {
    kind: "draft",
    label: "Draft",
    icon: "◎",
    defaultTitle: "New Draft",
    defaultSummary: "Draft document created in Creation Lab.",
  },
];

interface LabQuickCreateProps {
  onCreated?: (artifactId: string, kind: ArtifactKind) => void;
}

export default function LabQuickCreate({ onCreated }: LabQuickCreateProps) {
  const { session } = useSession();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [capMessage, setCapMessage] = useState<string | null>(null);

  const handleCreate = (opt: CreateOption) => {
    const sessionId = session?.session_id ?? "lab-anon";
    try {
      const result = saveArtifact({
        session_id: sessionId,
        kind: opt.kind,
        title: opt.defaultTitle,
        summary: opt.defaultSummary,
        content: "",
        tags: ["creation-lab"],
        source: "lab",
      });

      setCapMessage(null);
      setConfirming(opt.kind);
      setTimeout(() => setConfirming(null), 1800);

      if (onCreated) onCreated(result.artifact.artifact_id, opt.kind);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Artifact cap reached.";
      setCapMessage(msg);
      setTimeout(() => setCapMessage(null), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "32px",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "8px",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(0,170,255,0.35)",
        }}
      >
        Quick Create
      </span>

      {/* Governance cap message */}
      {capMessage && (
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: "rgba(230,100,80,0.85)",
            background: "rgba(230,100,80,0.06)",
            border: "1px solid rgba(230,100,80,0.2)",
            borderRadius: "6px",
            padding: "8px 14px",
          }}
        >
          {capMessage}
        </div>
      )}

      {/* Buttons row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {OPTIONS.map((opt) => {
          const isConfirming = confirming === opt.kind;
          return (
            <motion.button
              key={opt.kind}
              onClick={() => handleCreate(opt)}
              whileHover={{
                borderColor: "rgba(0,170,255,0.35)",
                backgroundColor: "rgba(0,170,255,0.08)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: isConfirming ? "rgba(0,229,160,0.85)" : "rgba(0,170,255,0.65)",
                background: isConfirming
                  ? "rgba(0,229,160,0.05)"
                  : "rgba(0,170,255,0.04)",
                border: isConfirming
                  ? "1px solid rgba(0,229,160,0.2)"
                  : "1px solid rgba(0,170,255,0.12)",
                borderRadius: "7px",
                padding: "8px 16px",
                cursor: "pointer",
                transition: "color 0.2s, background 0.2s, border-color 0.2s",
              }}
            >
              <span style={{ fontSize: "12px", opacity: 0.7 }}>
                {isConfirming ? "✓" : opt.icon}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={isConfirming ? "done" : "label"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isConfirming ? `${opt.label} created` : `+ ${opt.label}`}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
