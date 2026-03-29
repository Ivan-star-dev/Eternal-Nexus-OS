/**
 * TestBay.tsx
 * Core work zone for the Lab tri-core portal.
 * Three artifact kinds: hypothesis · experiment · evidence.
 *
 * Canon: TRI-CORE-PARITY-001 · @claude · 2026-03-29
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveArtifact, getRecentArtifacts } from "@/lib/artifacts/store";
import { useSession } from "@/contexts/SessionContext";
import type { ArtifactKind } from "@/lib/artifacts/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const TEAL = "hsl(172, 55%, 36%)";
const TEAL_LIGHT = "hsl(172, 48%, 55%)";
const TEAL_FAINT = "hsla(172, 55%, 36%, 0.12)";

type LabKind = "hypothesis" | "experiment" | "evidence";

const KIND_META: Record<LabKind, { label: string; prompt: string; titlePlaceholder: string; contentPlaceholder: string }> = {
  hypothesis: {
    label: "Hypothesis",
    prompt: "State a falsifiable claim.",
    titlePlaceholder: "If X then Y because Z...",
    contentPlaceholder: "Conditions: ...\nExpected outcome: ...\nFalsifiable if: ...",
  },
  experiment: {
    label: "Experiment",
    prompt: "Define the test procedure.",
    titlePlaceholder: "Test: [what you're testing]",
    contentPlaceholder: "Method: ...\nVariables: ...\nSuccess criteria: ...\nObservations: ...",
  },
  evidence: {
    label: "Evidence",
    prompt: "Capture what you observed — no interpretation.",
    titlePlaceholder: "Observed: [exact observation]",
    contentPlaceholder: "Raw data: ...\nContext: ...\nSource: ...",
  },
};

interface QuickCreateProps {
  onCreated: () => void;
}

function QuickCreate({ onCreated }: QuickCreateProps) {
  const { session, updateReEntry } = useSession();
  const [active, setActive] = useState<LabKind | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openKind(kind: LabKind) {
    setActive(kind);
    setTitle("");
    setContent("");
    setError(null);
  }

  function handleSave() {
    if (!active || !title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      saveArtifact({
        session_id: session?.session_id ?? "anon",
        kind: active as ArtifactKind,
        title: title.trim(),
        summary: content.slice(0, 120),
        content,
        tags: ["lab", "test", active],
        source: "test",
      });
      updateReEntry(`test:${active}`);
      setActive(null);
      onCreated();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Kind selector */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {(Object.keys(KIND_META) as LabKind[]).map(kind => (
          <motion.button
            key={kind}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openKind(kind)}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: active === kind ? "#05100d" : TEAL_LIGHT,
              background: active === kind ? TEAL : TEAL_FAINT,
              border: `1px solid ${active === kind ? TEAL : TEAL + "44"}`,
              borderRadius: "7px",
              padding: "8px 18px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            + {KIND_META[kind].label}
          </motion.button>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${TEAL}33`,
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: `${TEAL}99`, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {KIND_META[active].prompt}
            </span>

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={KIND_META[active].titlePlaceholder}
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(228,235,240,0.88)",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${TEAL}33`,
                outline: "none",
                padding: "6px 0",
                width: "100%",
              }}
            />

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={KIND_META[active].contentPlaceholder}
              rows={4}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "rgba(170,190,210,0.7)",
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "vertical",
                lineHeight: 1.6,
                width: "100%",
              }}
            />

            {error && (
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "hsl(0,52%,52%)" }}>
                {error}
              </span>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!title.trim() || saving}
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#05100d",
                  background: !title.trim() ? `${TEAL}66` : TEAL,
                  border: "none",
                  borderRadius: "7px",
                  padding: "8px 20px",
                  cursor: title.trim() ? "pointer" : "not-allowed",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </motion.button>
              <button
                onClick={() => setActive(null)}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                  color: "rgba(150,165,180,0.5)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ArtifactRowProps {
  title: string;
  kind: string;
  ts: string;
}

function ArtifactRow({ title, kind, ts }: ArtifactRowProps) {
  const date = new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", minWidth: "80px" }}>
          {kind}
        </span>
        <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "13px", color: "rgba(210,225,235,0.8)" }}>
          {title}
        </span>
      </div>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "rgba(150,165,180,0.4)" }}>
        {date}
      </span>
    </div>
  );
}

export default function TestBay() {
  const [refreshKey, setRefreshKey] = useState(0);

  const recentLabArtifacts = getRecentArtifacts(6).filter(
    a => a.kind === "experiment" || a.kind === "evidence" || a.kind === "hypothesis"
  );

  return (
    <section
      id="test-bay"
      aria-label="Test Bay"
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "clamp(32px, 6vh, 64px) clamp(20px, 5vw, 72px)",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      {/* Header */}
      <div>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: `${TEAL}66`, display: "block", marginBottom: "10px" }}>
          Lab · Test Bay
        </span>
        <h2 style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "rgba(228,235,240,0.88)", margin: 0, letterSpacing: "-0.02em" }}>
          Run your next experiment
        </h2>
      </div>

      {/* Quick create */}
      <QuickCreate onCreated={() => setRefreshKey(k => k + 1)} />

      {/* Recent lab artifacts */}
      {recentLabArtifacts.length > 0 && (
        <div key={refreshKey}>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(150,165,180,0.4)", display: "block", marginBottom: "8px" }}>
            Recent experiments
          </span>
          {recentLabArtifacts.map(a => (
            <ArtifactRow key={a.artifact_id} title={a.title} kind={a.kind} ts={a.ts_last_accessed} />
          ))}
        </div>
      )}
    </section>
  );
}
