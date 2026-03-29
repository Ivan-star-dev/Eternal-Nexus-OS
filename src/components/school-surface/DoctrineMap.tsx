/**
 * DoctrineMap.tsx — The Sovereignty Stack
 * S-01 founder artifact for Bridge Nova / School portal.
 *
 * 7 mandatory layers of sovereign intelligence.
 * Appears above the LearningPath steps in the Foundations track.
 *
 * Canon: RUBERRA-QUINTILLION-CONTENT-001 · @claude · 2026-03-29
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "hsl(42, 78%, 52%)";
const GOLD_MID = "hsla(42, 78%, 52%, 0.5)";
const GOLD_FAINT = "hsla(42, 78%, 52%, 0.10)";
const GOLD_BORDER = "hsla(42, 78%, 52%, 0.2)";
const EASE = [0.22, 1, 0.36, 1] as const;

interface StackLayer {
  number: string;
  name: string;
  what: string;
  broken: string;
  diagnostic: string;
  practice: string;
}

const LAYERS: StackLayer[] = [
  {
    number: "L1",
    name: "Perception",
    what: "The quality and breadth of what you notice before you interpret it.",
    broken: "You miss important signals. Your decisions are made on incomplete inputs. You optimize for things that don't matter.",
    diagnostic: "In the last important decision I made, what did I not notice until it was too late?",
    practice: "Each week, identify one thing you had been not noticing in your environment, your work, or your thinking.",
  },
  {
    number: "L2",
    name: "Mental Models",
    what: "The operating system through which you interpret what you perceive. Your collection of frameworks for understanding how things work.",
    broken: "You misread situations. You apply the wrong framework. You see what you expect to see rather than what is.",
    diagnostic: "Which mental model do I apply most automatically — and when was the last time it led me wrong?",
    practice: "Learn one new mental model per month from outside your primary domain. Apply it to a current problem.",
  },
  {
    number: "L3",
    name: "Research Capacity",
    what: "The ability to investigate questions rigorously — to distinguish signal from noise, primary from secondary, and correlation from causation.",
    broken: "You accumulate opinions instead of evidence. You stop inquiring when you find something that confirms what you already believe.",
    diagnostic: "What am I treating as fact that I have not actually verified with primary sources?",
    practice: "For one important belief you hold, trace it back to its primary source. If you cannot, investigate.",
  },
  {
    number: "L4",
    name: "Synthesis",
    what: "The ability to extract patterns and principles from disparate signals — to produce original insight from accumulated observation.",
    broken: "You accumulate information without producing understanding. You have exposure without depth.",
    diagnostic: "What is the most original idea I have produced in the last 90 days that did not exist before I formulated it?",
    practice: "After consuming any significant input, write one synthesis paragraph: what does this imply that was not stated?",
  },
  {
    number: "L5",
    name: "Decision Architecture",
    what: "A structured approach to making choices under uncertainty — covering information thresholds, reversibility, and second-order effects.",
    broken: "Your decisions are reactive. You optimize for what feels right under pressure rather than what is structurally sound.",
    diagnostic: "What is a recent decision I would make differently if I had used a structured decision process?",
    practice: "For any significant decision, write down: the options, the reversibility of each, the information you need before deciding, and the decision rule.",
  },
  {
    number: "L6",
    name: "Execution Systems",
    what: "The infrastructure that converts intention into reliable output — without requiring constant willpower or reinvention.",
    broken: "Your output is inconsistent. Your best work is produced under pressure rather than by system. You rebuild the same workflows repeatedly.",
    diagnostic: "Which important activity in my work is dependent on me being in the right state to do it, rather than a system that runs regardless?",
    practice: "Systematize one recurring task this week. Convert it from a decision into a protocol.",
  },
  {
    number: "L7",
    name: "Compound Leverage",
    what: "The design of work and assets that return value without proportional input — where past effort reduces future cost.",
    broken: "Your output does not compound. Each unit of work produces roughly the same return regardless of your history.",
    diagnostic: "What have I built in the last year that is working for me right now without my active attention?",
    practice: "Identify one thing you do repeatedly that could be converted into a permanent asset. Build the asset.",
  },
];

function LayerRow({ layer, index }: { layer: StackLayer; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: EASE }}
      style={{
        border: `1px solid ${open ? GOLD_BORDER : "hsla(42, 78%, 52%, 0.09)"}`,
        borderRadius: "10px",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          background: open ? GOLD_FAINT : "transparent",
          border: "none",
          padding: "14px 18px",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.18em",
            color: GOLD_MID,
            flexShrink: 0,
            minWidth: "22px",
          }}
        >
          {layer.number}
        </span>
        <span
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--rx-text-primary)",
            flex: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {layer.name}
        </span>
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "11px",
            color: "var(--rx-text-ghost)",
            display: open ? "none" : "block",
            flex: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {layer.what}
        </span>
        <span
          style={{
            color: GOLD_MID,
            fontSize: "10px",
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "none",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          →
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="layer-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 18px 18px",
                borderTop: `1px solid ${GOLD_BORDER}`,
                paddingTop: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", color: "var(--rx-text-dim)", margin: 0, lineHeight: 1.65 }}>
                {layer.what}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: "hsl(0 65% 52% / 0.6)" }}>
                  When underdeveloped
                </span>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", color: "var(--rx-text-ghost)", margin: 0, lineHeight: 1.6 }}>
                  {layer.broken}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: `${GOLD}66` }}>
                  Diagnostic question
                </span>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", color: "var(--rx-text-dim)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
                  {layer.diagnostic}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: `${GOLD}66` }}>
                  Build practice
                </span>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", color: "var(--rx-text-dim)", margin: 0, lineHeight: 1.6 }}>
                  {layer.practice}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DoctrineMap() {
  return (
    <section
      aria-label="The Sovereignty Stack"
      style={{
        marginBottom: "clamp(36px, 6vh, 56px)",
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto clamp(36px, 6vh, 56px)",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ marginBottom: "18px" }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: `${GOLD}55`,
            display: "block",
            marginBottom: "8px",
          }}
        >
          S-01 · Doctrine Map
        </span>
        <h2
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            fontWeight: 700,
            color: "var(--rx-text-primary)",
            margin: "0 0 6px",
            letterSpacing: "-0.02em",
          }}
        >
          The Sovereignty Stack
        </h2>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "12px",
            color: "var(--rx-text-ghost)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          7 mandatory layers of sovereign intelligence. Locate yourself. Build what is weak.
        </p>
      </motion.div>

      {/* Layers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {LAYERS.map((layer, i) => (
          <LayerRow key={layer.number} layer={layer} index={i} />
        ))}
      </div>
    </section>
  );
}
