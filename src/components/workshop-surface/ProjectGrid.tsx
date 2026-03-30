/**
 * ProjectGrid.tsx
 * Live project grid for Nexus Cria / Workshop.
 *
 * Pulls real plan/draft artifacts with source='workshop' from the artifact store.
 * "New Project" creates a plan artifact and auto-expands it for naming.
 * Empty state guides the founder to create their first project.
 *
 * Canon: V7-SURFACES-001 · GAP-CLOSURE-V10-001 · @claude · 2026-03-30
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { listArtifacts, saveArtifact, updateArtifact } from "@/lib/artifacts/store";
import type { ArtifactMeta } from "@/lib/artifacts/types";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";

const TEAL = "hsl(172, 55%, 38%)";
const TEAL_MID = "hsla(172, 55%, 38%, 0.55)";
const TEAL_FAINT = "hsla(172, 55%, 38%, 0.12)";
const TEAL_BORDER = "hsla(172, 55%, 38%, 0.2)";
const EASE = [0.22, 1, 0.36, 1] as const;

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

function kindLabel(kind: ArtifactMeta["kind"]): string {
  const MAP: Partial<Record<ArtifactMeta["kind"], string>> = {
    plan: "Plan",
    draft: "Draft",
    synthesis: "Synthesis",
    decision: "Decision",
    code: "Code",
    research: "Research",
  };
  return MAP[kind] ?? kind;
}

function kindColor(kind: ArtifactMeta["kind"]): string {
  const MAP: Partial<Record<ArtifactMeta["kind"], string>> = {
    plan: TEAL,
    draft: "hsla(220, 75%, 62%, 0.75)",
    synthesis: "hsla(42, 78%, 52%, 0.8)",
    decision: "hsla(0, 72%, 58%, 0.75)",
    code: "hsla(280, 60%, 62%, 0.75)",
    research: "hsla(172, 48%, 52%, 0.75)",
  };
  return MAP[kind] ?? TEAL_MID;
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.5, ease: EASE },
  }),
};

// ─── ProjectCard ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  artifact: ArtifactMeta;
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onUpdated: () => void;
}

function ProjectCard({ artifact, index, isExpanded, onExpand, onCollapse, onUpdated }: ProjectCardProps) {
  const { user } = useAuth();
  const [editTitle, setEditTitle] = useState(artifact.title);
  const [editContent, setEditContent] = useState(artifact.content);
  const [saved, setSaved] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = kindColor(artifact.kind);

  useEffect(() => {
    setEditTitle(artifact.title);
    setEditContent(artifact.content);
  }, [artifact.artifact_id, artifact.title, artifact.content]);

  useEffect(() => {
    if (isExpanded) setTimeout(() => titleRef.current?.focus(), 80);
  }, [isExpanded]);

  const persistSave = useCallback(() => {
    updateArtifact(
      artifact.artifact_id,
      {
        title: editTitle.trim() || artifact.title,
        content: editContent,
        summary: editContent.slice(0, 140) || artifact.summary,
      },
      user?.id
    );
    setSaved(true);
    onUpdated();
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(false), 1800);
  }, [artifact.artifact_id, artifact.title, artifact.summary, editTitle, editContent, onUpdated, user?.id]);

  const isUntitled = artifact.title === "New Project" || artifact.title === "Untitled Project";

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      style={{
        background: isExpanded ? "hsl(var(--muted) / 0.35)" : "hsl(var(--muted) / 0.04)",
        border: `1px solid ${isExpanded ? TEAL_MID : TEAL_BORDER}`,
        borderRadius: "12px",
        padding: "22px 22px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "border-color 0.2s, background 0.2s",
        gridColumn: isExpanded ? "1 / -1" : undefined,
      }}
    >
      {/* Kind tag + timestamp */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color,
          }}
        >
          {kindLabel(artifact.kind)}
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            letterSpacing: "0.04em",
            color: "var(--rx-text-ghost)",
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
          placeholder="Name your project..."
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--rx-text-primary)",
            letterSpacing: "-0.01em",
            background: "hsl(var(--muted) / 0.15)",
            border: `1px solid ${TEAL_BORDER}`,
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
            color: isUntitled ? "var(--rx-text-ghost)" : "var(--rx-text-primary)",
            margin: 0,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            fontStyle: isUntitled ? "italic" : "normal",
          }}
        >
          {artifact.title}
        </h3>
      )}

      {/* Expanded content editor */}
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
              placeholder="Describe the project, goals, mechanism, or next steps."
              rows={6}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "13px",
                color: "var(--rx-text-dim)",
                lineHeight: 1.7,
                background: "hsl(var(--muted) / 0.08)",
                border: `1px solid ${TEAL_BORDER}`,
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
                color: saved ? "hsl(172 55% 44% / 0.65)" : "var(--rx-text-ghost)",
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

      {/* Summary — collapsed only */}
      {!isExpanded && artifact.summary && (
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "12px",
            color: "var(--rx-text-ghost)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {artifact.summary.length > 90 ? artifact.summary.slice(0, 87) + "..." : artifact.summary}
        </p>
      )}

      {/* Action row */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "4px" }}>
        {isExpanded ? (
          <motion.button
            onClick={onCollapse}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--rx-text-ghost)",
              background: "transparent",
              border: `1px solid ${TEAL_BORDER}`,
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
            whileTap={{ scale: 0.96 }}
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: TEAL,
              background: TEAL_FAINT,
              border: `1px solid ${TEAL_BORDER}`,
              borderRadius: "6px",
              padding: "5px 14px",
              cursor: "pointer",
            }}
          >
            Open
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "14px",
        padding: "40px 24px",
        border: `1px dashed ${TEAL_BORDER}`,
        borderRadius: "12px",
      }}
    >
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "24px", opacity: 0.18 }}>◻</span>
      <p
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--rx-text-dim)",
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        No projects yet
      </p>
      <p
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "13px",
          color: "var(--rx-text-ghost)",
          margin: 0,
          lineHeight: 1.6,
          maxWidth: "360px",
        }}
      >
        Use the artifacts above to design your offer, then create a project to track your build.
      </p>
      <motion.button
        onClick={onCreate}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: TEAL,
          background: TEAL_FAINT,
          border: `1px solid ${TEAL_BORDER}`,
          borderRadius: "8px",
          padding: "9px 20px",
          cursor: "pointer",
          marginTop: "4px",
        }}
      >
        + New Project
      </motion.button>
    </motion.div>
  );
}

// ─── NewProjectButton ─────────────────────────────────────────────────────────

function NewProjectButton({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      onClick={onCreate}
      whileHover={{ borderColor: TEAL_MID, backgroundColor: TEAL_FAINT, transition: { duration: 0.2 } }}
      style={{
        background: "transparent",
        border: `1.5px dashed ${TEAL_BORDER}`,
        borderRadius: "12px",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: "pointer",
        minHeight: "140px",
        width: "100%",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      <span
        aria-hidden
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          border: `1.5px solid ${TEAL_BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: TEAL_MID,
          fontSize: "16px",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        +
      </span>
      <span
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--rx-text-dim)",
          letterSpacing: "0.02em",
        }}
      >
        New Project
      </span>
    </motion.button>
  );
}

// ─── ProjectGrid ──────────────────────────────────────────────────────────────

export interface ProjectGridHandle {
  projectCount: number;
  activeCount: number;
}

export default function ProjectGrid() {
  const { session } = useSession();
  const { user } = useAuth();
  const [projects, setProjects] = useState<ArtifactMeta[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(() => {
    const all = listArtifacts({ source: "workshop" });
    setProjects(all.sort((a, b) => new Date(b.ts_updated).getTime() - new Date(a.ts_updated).getTime()));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = useCallback(() => {
    const sessionId = session?.session_id ?? "workshop-anon";
    const result = saveArtifact({
      session_id: sessionId,
      kind: "plan",
      title: "New Project",
      summary: "Workshop project — define your offer, mechanism, and build plan.",
      content: "",
      tags: ["workshop", "project"],
      source: "workshop",
      userId: user?.id,
    });
    load();
    setExpandedId(result.artifact.artifact_id);
  }, [session, user, load]);

  const handleExpand = useCallback((artifact: ArtifactMeta) => {
    updateArtifact(artifact.artifact_id, { ts_last_accessed: new Date().toISOString() }, user?.id);
    setExpandedId(artifact.artifact_id);
  }, [user?.id]);

  const handleCollapse = useCallback(() => setExpandedId(null), []);
  const handleUpdated = useCallback(() => load(), [load]);

  return (
    <section aria-label="Projects">
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: TEAL_MID,
          }}
        >
          Projects
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: `linear-gradient(90deg, ${TEAL_BORDER}, transparent)`,
          }}
        />
        {projects.length > 0 && (
          <motion.button
            onClick={handleCreate}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: TEAL,
              background: "transparent",
              border: `1px solid ${TEAL_BORDER}`,
              borderRadius: "6px",
              padding: "4px 12px",
              cursor: "pointer",
            }}
          >
            + New
          </motion.button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          gap: "16px",
        }}
      >
        {projects.length === 0 ? (
          <EmptyState onCreate={handleCreate} />
        ) : (
          <>
            {projects.map((artifact, i) => (
              <ProjectCard
                key={artifact.artifact_id}
                artifact={artifact}
                index={i}
                isExpanded={expandedId === artifact.artifact_id}
                onExpand={() => handleExpand(artifact)}
                onCollapse={handleCollapse}
                onUpdated={handleUpdated}
              />
            ))}
            <NewProjectButton onCreate={handleCreate} />
          </>
        )}
      </div>
    </section>
  );
}
