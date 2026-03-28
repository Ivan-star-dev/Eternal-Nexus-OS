/**
 * LabWorkBay.tsx
 * Central work area for Creation Lab — real artifact data, not mock.
 *
 * V10 upgrade: loads from artifact memory layer (localStorage → Supabase).
 * Shows real ArtifactMeta cards with kind badge, summary, last access.
 * Empty state guides user to QuickCreate.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 3+6 · Creation Lab
 * @claude | 2026-03-28
 */

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getRecentArtifacts } from "@/lib/artifacts/store";
import type { ArtifactMeta, ArtifactKind } from "@/lib/artifacts/types";
import { useSession } from "@/contexts/SessionContext";
import { buildReEntryPoint } from "@/lib/spawn/entry-pipeline";

const EASE = [0.22, 1, 0.36, 1] as const;

const KIND_LABELS: Record<ArtifactKind, string> = {
  research: "Research",
  note: "Note",
  plan: "Plan",
  simulation: "Simulation",
  draft: "Draft",
  code: "Code",
  synthesis: "Synthesis",
  decision: "Decision",
};

const KIND_COLORS: Record<ArtifactKind, string> = {
  research: "#00aaff",
  note: "rgba(0,170,255,0.55)",
  plan: "#00c8d4",
  simulation: "#00e5a0",
  draft: "rgba(0,200,212,0.5)",
  code: "#9b59b6",
  synthesis: "#e67e22",
  decision: "#e74c3c",
};

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: EASE },
  }),
};

interface ArtifactCardProps {
  artifact: ArtifactMeta;
  index: number;
  onContinue: (artifact: ArtifactMeta) => void;
}

function ArtifactCard({ artifact, index, onContinue }: ArtifactCardProps) {
  const kindColor = KIND_COLORS[artifact.kind] ?? "#00aaff";
  const summary = artifact.summary.length > 90
    ? artifact.summary.slice(0, 87) + "..."
    : artifact.summary;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{
        background: "rgba(0,170,255,0.03)",
        border: "1px solid rgba(0,170,255,0.1)",
        borderRadius: "12px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
      }}
      whileHover={{
        borderColor: "rgba(0,170,255,0.28)",
        backgroundColor: "rgba(0,170,255,0.06)",
        transition: { duration: 0.2 },
      }}
    >
      {/* Kind badge + time */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: kindColor,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: kindColor,
            }}
          >
            {KIND_LABELS[artifact.kind]}
          </span>
        </div>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            color: "rgba(140,170,195,0.45)",
            letterSpacing: "0.04em",
          }}
        >
          {formatRelativeTime(artifact.ts_last_accessed)}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "rgba(220,232,240,0.9)",
          margin: 0,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {artifact.title}
      </h3>

      {/* Summary */}
      {summary && (
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "12px",
            color: "rgba(140,170,195,0.55)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {summary}
        </p>
      )}

      {/* Tags */}
      {artifact.tags.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {artifact.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "8px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(0,170,255,0.35)",
                background: "rgba(0,170,255,0.05)",
                border: "1px solid rgba(0,170,255,0.1)",
                borderRadius: "4px",
                padding: "2px 7px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Continue action */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
        <motion.button
          onClick={(e) => { e.stopPropagation(); onContinue(artifact); }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#00aaff",
            background: "rgba(0,170,255,0.08)",
            border: "1px solid rgba(0,170,255,0.22)",
            borderRadius: "6px",
            padding: "5px 14px",
            cursor: "pointer",
          }}
        >
          Continue →
        </motion.button>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "14px",
        padding: "36px 0",
      }}
    >
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "28px",
          opacity: 0.15,
        }}
      >
        ◻
      </span>
      <p
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "rgba(180,205,225,0.5)",
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        Your lab is empty
      </p>
      <p
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "13px",
          color: "rgba(140,170,195,0.4)",
          margin: 0,
          lineHeight: 1.6,
          maxWidth: "320px",
        }}
      >
        Use Quick Create above to start your first research, note, plan, or
        draft. Everything you create lives here.
      </p>
    </motion.div>
  );
}

interface LabWorkBayProps {
  refreshSignal?: number; // increment to trigger a reload
}

export default function LabWorkBay({ refreshSignal }: LabWorkBayProps) {
  const { session, updateReEntry } = useSession();
  const [artifacts, setArtifacts] = useState<ArtifactMeta[]>([]);

  const loadArtifacts = useCallback(() => {
    const recent = getRecentArtifacts(12);
    setArtifacts(recent);
  }, []);

  useEffect(() => {
    loadArtifacts();
  }, [loadArtifacts, refreshSignal]);

  const handleContinue = (artifact: ArtifactMeta) => {
    const reEntry = buildReEntryPoint("lab", artifact.artifact_id);
    updateReEntry(reEntry);
    // Future: open artifact detail panel or navigate to it
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: EASE }}
      style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* Header */}
      <div>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(0,170,255,0.38)",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Creation Lab · Work Bay
        </span>
        <h2
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 700,
            color: "rgba(220,232,240,0.88)",
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          {session?.subject
            ? `${session.subject}`
            : "Your Work"}
        </h2>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "13px",
            color: "rgba(150,180,205,0.5)",
            margin: "7px 0 0",
            lineHeight: 1.5,
          }}
        >
          {artifacts.length > 0
            ? `${artifacts.length} artifact${artifacts.length > 1 ? "s" : ""} — most recently accessed first`
            : "Your active artifacts, ready to continue"}
        </p>
      </div>

      {/* Artifact grid or empty state */}
      {artifacts.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "14px",
          }}
        >
          {artifacts.map((artifact, i) => (
            <ArtifactCard
              key={artifact.artifact_id}
              artifact={artifact}
              index={i}
              onContinue={handleContinue}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
