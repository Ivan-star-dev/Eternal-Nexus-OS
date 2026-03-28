/**
 * LearningPath.tsx
 * Vertical learning path of 5 steps for Bridge Nova.
 *
 * Each step: number + title + 1-line description + status
 * Statuses: locked | available | done
 * Canon: V7-SURFACES-001 · K-04+K-06 · @framer+@cursor
 */

import { motion } from "framer-motion";

type StepStatus = "locked" | "available" | "done";

interface LearningStep {
  id: string;
  number: number;
  title: string;
  description: string;
  status: StepStatus;
}

const GOLD = "hsl(42, 78%, 52%)";
const GOLD_FAINT = "hsla(42, 78%, 52%, 0.18)";
const GOLD_MUTED = "hsla(42, 78%, 52%, 0.45)";

const STEPS: LearningStep[] = [
  {
    id: "s1",
    number: 1,
    title: "Foundations",
    description: "Core principles of structured thinking and system literacy.",
    status: "done",
  },
  {
    id: "s2",
    number: 2,
    title: "Systems Thinking",
    description: "How to read complex systems, feedback loops, and emergence.",
    status: "done",
  },
  {
    id: "s3",
    number: 3,
    title: "Research Methods",
    description: "Rigorous methods for inquiry, synthesis, and original insight.",
    status: "available",
  },
  {
    id: "s4",
    number: 4,
    title: "Simulation",
    description: "Build and run scenario models to test hypotheses in context.",
    status: "locked",
  },
  {
    id: "s5",
    number: 5,
    title: "Leadership",
    description: "From vision to execution: orchestrating people, systems, and intent.",
    status: "locked",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <rect x="2" y="5.5" width="8" height="5.5" rx="1.5" fill="rgba(150,165,180,0.3)" />
      <path
        d="M4 5.5V4a2 2 0 0 1 4 0v1.5"
        stroke="rgba(150,165,180,0.3)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

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

function StepCard({ step, index }: { step: LearningStep; index: number }) {
  const isDone = step.status === "done";
  const isAvailable = step.status === "available";
  const isLocked = step.status === "locked";

  const borderColor = isAvailable
    ? GOLD
    : isDone
    ? GOLD_FAINT
    : "rgba(150,165,180,0.1)";

  const numberColor = isAvailable
    ? GOLD
    : isDone
    ? GOLD_MUTED
    : "rgba(150,165,180,0.25)";

  const titleColor = isLocked
    ? "rgba(160,175,190,0.35)"
    : isDone
    ? "rgba(200,215,230,0.55)"
    : "rgba(228,235,240,0.9)";

  const descColor = isLocked
    ? "rgba(150,165,180,0.25)"
    : isDone
    ? "rgba(170,185,200,0.4)"
    : "rgba(170,185,200,0.65)";

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
        background: isAvailable
          ? "rgba(212,160,40,0.05)"
          : "rgba(255,255,255,0.02)",
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
        {isAvailable && (
          <motion.div style={{ marginTop: "10px" }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#060c14",
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
        {isLocked && <LockIcon />}
      </div>
    </motion.div>
  );
}

export default function LearningPath() {
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
          Bridge Nova · Learning Path
        </span>
        <h2
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 700,
            color: "rgba(228,235,240,0.88)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Your path forward
        </h2>
      </motion.div>

      {STEPS.map((step, i) => (
        <StepCard key={step.id} step={step} index={i} />
      ))}
    </div>
  );
}
