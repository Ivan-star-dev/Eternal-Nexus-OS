/**
 * LabWorkBay.tsx
 * Central work area for Creation Lab — real artifact data, not mock.
 *
 * V10 upgrade: loads from artifact memory layer (localStorage → Supabase).
 * Shows real ArtifactMeta cards with kind badge, summary, last access.
 * Empty state guides user to QuickCreate.
 *
 * FIX-2 (wedge): "Continue →" expands card inline — title + content editable,
 *   auto-saves on blur, gives artifacts life beyond display.
 * FIX-1 (wedge): autoExpandId prop — new artifact from QuickCreate auto-expands
 *   with cursor in title field, turning creation into a naming moment.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 3+6 · Creation Lab
 * @claude | 2026-03-28
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecentArtifacts, updateArtifact } from "@/lib/artifacts/store";
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
  experiment: "Experiment",
  evidence: "Evidence",
  hypothesis: "Hypothesis",
  lesson: "Lesson",
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
  experiment: "hsl(172,55%,36%)",
  evidence: "hsl(172,48%,52%)",
  hypothesis: "hsl(172,40%,44%)",
  lesson: "hsl(42,78%,52%)",
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

// ─── New: derive a placeholder title from the kind
const NEW_TITLES: Record<ArtifactKind, string> = {
  research: "New Research",
  note: "New Note",
  plan: "New Plan",
  simulation: "New Simulation",
  draft: "New Draft",
  code: "New Code",
  synthesis: "New Synthesis",
  decision: "New Decision",
  experiment: "New Experiment",
  evidence: "New Evidence",
  hypothesis: "New Hypothesis",
  lesson: "New Lesson",
};

function isGenericTitle(title: string, kind: ArtifactKind): boolean {
  return title === NEW_TITLES[kind];
}

// ─── ArtifactCard ─────────────────────────────────────────────────────────────

interface ArtifactCardProps {
  artifact: ArtifactMeta;
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onUpdated: () => void;
}

function ArtifactCard({
  artifact,
  index,
  isExpanded,
  onExpand,
  onCollapse,
  onUpdated,
}: ArtifactCardProps) {
  const kindColor = KIND_COLORS[artifact.kind] ?? "#00aaff";
  const summary = artifact.summary.length > 90
    ? artifact.summary.slice(0, 87) + "..."
    : artifact.summary;

  const [editTitle, setEditTitle] = useState(artifact.title);
  const [editContent, setEditContent] = useState(artifact.content);
  const [saved, setSaved] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when artifact changes externally
  useEffect(() => {
    setEditTitle(artifact.title);
    setEditContent(artifact.content);
  }, [artifact.artifact_id, artifact.title, artifact.content]);

  // Auto-focus title on expand — especially for new (generic-titled) artifacts
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [isExpanded]);

  const persistSave = useCallback(() => {
    updateArtifact(artifact.artifact_id, {
      title: editTitle.trim() || artifact.title,
      content: editContent,
      summary: editContent.slice(0, 140) || artifact.summary,
    });
    setSaved(true);
    onUpdated();
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(false), 1800);
  }, [artifact.artifact_id, artifact.title, artifact.summary, editTitle, editContent, onUpdated]);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      style={{
        background: isExpanded ? "rgba(0,170,255,0.06)" : "rgba(0,170,255,0.03)",
        border: `1px solid ${isExpanded ? "rgba(0,170,255,0.28)" : "rgba(0,170,255,0.1)"}`,
        borderRadius: "12px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "border-color 0.2s, background 0.2s",
        gridColumn: isExpanded ? "1 / -1" : undefined,
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

      {/* Title — editable when expanded */}
      {isExpanded ? (
        <input
          ref={titleRef}
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={persistSave}
          placeholder={isGenericTitle(artifact.title, artifact.kind) ? "Name your work..." : artifact.title}
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "rgba(220,232,240,0.95)",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            background: "rgba(0,170,255,0.05)",
            border: "1px solid rgba(0,170,255,0.2)",
            borderRadius: "6px",
            padding: "8px 12px",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      ) : (
        <h3
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            color: isGenericTitle(artifact.title, artifact.kind)
              ? "rgba(220,232,240,0.45)"
              : "rgba(220,232,240,0.9)",
            margin: 0,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            fontStyle: isGenericTitle(artifact.title, artifact.kind) ? "italic" : "normal",
          }}
        >
          {isGenericTitle(artifact.title, artifact.kind)
            ? `Untitled ${KIND_LABELS[artifact.kind]}`
            : artifact.title}
        </h3>
      )}

      {/* Content area — only when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              onBlur={persistSave}
              placeholder="Start writing. Everything here persists."
              rows={6}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "13px",
                color: "rgba(180,205,225,0.8)",
                lineHeight: 1.7,
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(0,170,255,0.12)",
                borderRadius: "6px",
                padding: "12px 14px",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
                minHeight: "120px",
              }}
            />
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "8px",
                color: saved ? "rgba(0,229,160,0.6)" : "rgba(100,130,160,0.3)",
                letterSpacing: "0.2em",
                marginTop: "6px",
                transition: "color 0.3s",
              }}
            >
              {saved ? "✓ SAVED" : "AUTO-SAVES ON BLUR"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary — only when collapsed */}
      {!isExpanded && summary && (
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
      {!isExpanded && artifact.tags.length > 0 && (
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

      {/* Actions row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
        {isExpanded && (
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              color: "rgba(0,170,255,0.35)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {artifact.artifact_id}
          </span>
        )}
        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          {isExpanded ? (
            <motion.button
              onClick={onCollapse}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(160,185,210,0.55)",
                background: "transparent",
                border: "1px solid rgba(0,170,255,0.12)",
                borderRadius: "6px",
                padding: "5px 14px",
                cursor: "pointer",
              }}
            >
              Close
            </motion.button>
          ) : (
            <motion.button
              onClick={onExpand}
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
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

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

// ─── LabWorkBay ───────────────────────────────────────────────────────────────

interface LabWorkBayProps {
  refreshSignal?: number;    // increment to trigger a reload
  autoExpandId?: string;     // artifact_id to auto-expand on mount/change (new artifact from QuickCreate)
}

export default function LabWorkBay({ refreshSignal, autoExpandId }: LabWorkBayProps) {
  const { session, updateReEntry } = useSession();
  const [artifacts, setArtifacts] = useState<ArtifactMeta[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadArtifacts = useCallback(() => {
    const recent = getRecentArtifacts(12);
    setArtifacts(recent);
  }, []);

  useEffect(() => {
    loadArtifacts();
  }, [loadArtifacts, refreshSignal]);

  // Auto-expand freshly created artifact
  useEffect(() => {
    if (autoExpandId) {
      setExpandedId(autoExpandId);
    }
  }, [autoExpandId]);

  const handleExpand = (artifact: ArtifactMeta) => {
    const reEntry = buildReEntryPoint("lab", artifact.artifact_id);
    updateReEntry(reEntry);
    setExpandedId(artifact.artifact_id);
    // A4: record view time — improves return intelligence and maturity scoring
    updateArtifact(artifact.artifact_id, { ts_last_accessed: new Date().toISOString() });
  };

  const handleCollapse = () => setExpandedId(null);

  const handleUpdated = useCallback(() => {
    loadArtifacts();
  }, [loadArtifacts]);

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
          {session?.subject ? `${session.subject}` : "Your Work"}
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
              isExpanded={expandedId === artifact.artifact_id}
              onExpand={() => handleExpand(artifact)}
              onCollapse={handleCollapse}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
