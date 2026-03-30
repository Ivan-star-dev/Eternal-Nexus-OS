/**
 * LearningPath.tsx
 * Vertical learning path of 5 steps for Bridge Nova.
 *
 * Each step: number + title + 1-line description + status
 * Statuses: locked | available | done
 * Canon: V7-SURFACES-001 · K-04+K-06 · @framer+@cursor
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { saveArtifact, listArtifacts } from "@/lib/artifacts/store";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";

type StepStatus = "available" | "done";

interface LearningStep {
  id: string;
  number: number;
  title: string;
  description: string;
}

const GOLD = "hsl(42, 78%, 52%)";
const GOLD_FAINT = "hsla(42, 78%, 52%, 0.18)";
const GOLD_MUTED = "hsla(42, 78%, 52%, 0.45)";

type TrackId = "foundations" | "value-creation";

// Track: Foundations — sovereign intellectual base
const STEPS_FOUNDATIONS: LearningStep[] = [
  { id: "s1", number: 1, title: "Foundations",      description: "Core principles of structured thinking and system literacy." },
  { id: "s2", number: 2, title: "Systems Thinking", description: "How to read complex systems, feedback loops, and emergence." },
  { id: "s3", number: 3, title: "Research Methods", description: "Rigorous methods for inquiry, synthesis, and original insight." },
  { id: "s4", number: 4, title: "Simulation",       description: "Build and run scenario models to test hypotheses in context." },
  { id: "s5", number: 5, title: "Leadership",       description: "From vision to execution: orchestrating people, systems, and intent." },
];

// Track: Value Creation — practical digital intelligence (engine infusion)
const STEPS_VALUE_CREATION: LearningStep[] = [
  { id: "v1", number: 1, title: "Foundations of Value",   description: "What is value, how it's created, stored, and transmitted. Why most created value doesn't reach the people who need it." },
  { id: "v2", number: 2, title: "Offer Intelligence",     description: "What makes an offer structurally sound. Promise architecture, mechanism articulation, proof systems, pricing as positioning." },
  { id: "v3", number: 3, title: "Distribution Literacy",  description: "Why brilliant things go undiscovered. Channel strategy, positioning logic, and trust-building mechanics." },
  { id: "v4", number: 4, title: "Execution Architecture", description: "Systems that produce value reliably. SOPs, workflows, leverage. The difference between doing and systematizing." },
  { id: "v5", number: 5, title: "Mastery and Scaling",    description: "How competence and systems compound differently. Defensible positions. Scaling without losing sovereignty." },
];

const TRACK_STEPS: Record<TrackId, LearningStep[]> = {
  "foundations": STEPS_FOUNDATIONS,
  "value-creation": STEPS_VALUE_CREATION,
};

// Status is derived from real artifact presence — not an artificial maturity gate.
// A step is "done" if the user has created a lesson artifact tagged with that step id.
// All steps are always available — no progression lock.
function resolveStatus(stepId: string, completedIds: Set<string>): StepStatus {
  return completedIds.has(stepId) ? "done" : "available";
}

const EASE = [0.22, 1, 0.36, 1] as const;


function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <circle cx="6" cy="6" r="5.5" stroke={GOLD_MUTED} />
      <path
        d="M3.5 6.2l1.8 1.8 3.2-3.2"
        stroke={GOLD_MUTED}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepCard({ step, index, status, onBegin }: { step: LearningStep; index: number; status: StepStatus; onBegin: () => void }) {
  const isDone = status === "done";
  const isAvailable = status === "available";

  const borderColor = isDone ? GOLD_FAINT : isAvailable ? `${GOLD}55` : "hsla(var(--border))";
  const numberColor = isDone ? GOLD_MUTED : GOLD;
  const titleColor = isDone ? "var(--rx-text-ghost)" : "var(--rx-text-primary)";
  const descColor = isDone ? "var(--rx-text-ghost)" : "var(--rx-text-dim)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: EASE }}
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
        padding: "22px 24px",
        background: isDone ? "hsl(var(--muted) / 0.02)" : "hsla(42, 78%, 52%, 0.04)",
        border: `1px solid ${borderColor}`,
        borderRadius: "12px",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {/* Step number */}
      <span
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "28px",
          fontWeight: 700,
          color: numberColor,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          flexShrink: 0,
          minWidth: "36px",
        }}
      >
        {String(step.number).padStart(2, "0")}
      </span>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <h3
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            color: titleColor,
            margin: 0,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "13px",
            color: descColor,
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {step.description}
        </p>

        {/* CTA row */}
        {!isDone && (
          <motion.div style={{ marginTop: "10px" }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBegin}
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "hsl(var(--background))",
                background: GOLD,
                border: "none",
                borderRadius: "7px",
                padding: "7px 18px",
                cursor: "pointer",
              }}
            >
              Begin
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Status icon */}
      <div style={{ flexShrink: 0, marginTop: "3px" }}>
        {isDone && <CheckIcon />}
      </div>
    </motion.div>
  );
}

interface LearningPathProps {
  maturityLevel: 0 | 1 | 2 | 3;
  track?: TrackId;
}

export default function LearningPath({ track = "foundations" }: LearningPathProps) {
  const { session, updateReEntry } = useSession();
  const { user } = useAuth();
  const STEPS = TRACK_STEPS[track];
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const loadCompleted = useCallback(() => {
    const lessons = listArtifacts({ source: "school" });
    const ids = new Set<string>();
    for (const a of lessons) {
      for (const tag of a.tags) {
        // Step ids are like 's1', 's2', 'v1', 'v2' — match them
        if (STEPS.some(s => s.id === tag)) ids.add(tag);
      }
    }
    setCompletedIds(ids);
  }, [STEPS]);

  useEffect(() => { loadCompleted(); }, [loadCompleted]);

  const doneCount = STEPS.filter(s => completedIds.has(s.id)).length;
  const progressPct = Math.round((doneCount / STEPS.length) * 100);

  function handleBegin(step: LearningStep) {
    const sessionId = session?.session_id ?? 'anon';
    saveArtifact({
      session_id: sessionId,
      kind: 'lesson',
      title: `${step.title} — Study Session`,
      summary: `Began study of "${step.title}". ${step.description}`,
      content: `# ${step.title}\n\n${step.description}\n\n---\n_Started: ${new Date().toISOString()}_`,
      tags: ['school', track, 'lesson', step.id],
      source: 'school',
      userId: user?.id,
    });
    updateReEntry(`school:${track}:step-${step.number}`);
    loadCompleted();
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
      }}
      aria-label="Learning path"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ marginBottom: "8px" }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: `${GOLD}66`,
            display: "block",
            marginBottom: "10px",
          }}
        >
          Bridge Nova · {track === "value-creation" ? "Value Creation" : "Foundations"}
        </span>
        <h2
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 700,
            color: "var(--rx-text-primary)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Your path forward
        </h2>
        {/* Progression indicator — real completion from artifact store */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "14px" }}>
          <div style={{ flex: 1, height: "2px", background: "hsl(var(--muted) / 0.15)", borderRadius: "1px", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              style={{ height: "100%", background: GOLD, borderRadius: "1px" }}
            />
          </div>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: GOLD_MUTED, whiteSpace: "nowrap" }}>
            {doneCount}/{STEPS.length} complete
          </span>
        </div>
      </motion.div>

      {STEPS.map((step, i) => (
        <StepCard
          key={step.id}
          step={step}
          index={i}
          status={resolveStatus(step.id, completedIds)}
          onBegin={() => handleBegin(step)}
        />
      ))}
    </div>
  );
}
