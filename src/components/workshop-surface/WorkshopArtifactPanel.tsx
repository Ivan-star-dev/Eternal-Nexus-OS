/**
 * WorkshopArtifactPanel.tsx
 * Founder-grade content body for Nexus Cria / Workshop portal.
 *
 * 3 live artifacts:
 *   C-01 — Minimum Viable Mechanism (build blueprint)
 *   C-02 — Offer Clarity Matrix (diagnostic system)
 *   C-03 — Build-to-Live Sprint Map (execution sequence)
 *
 * Canon: RUBERRA-QUINTILLION-CONTENT-001 · @claude · 2026-03-29
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MechanismDocument from "./MechanismDocument";

const TEAL = "hsl(172, 55%, 38%)";
const TEAL_MID = "hsla(172, 55%, 38%, 0.55)";
const TEAL_FAINT = "hsla(172, 55%, 38%, 0.10)";
const TEAL_BORDER = "hsla(172, 55%, 38%, 0.22)";
const EASE = [0.22, 1, 0.36, 1] as const;

interface ArtifactSection {
  title: string;
  items: string[];
}

interface Artifact {
  id: string;
  label: string;
  type: string;
  positioning: string;
  sections: ArtifactSection[];
}

const ARTIFACTS: Artifact[] = [
  {
    id: "C-01",
    label: "Minimum Viable Mechanism",
    type: "Build Blueprint",
    positioning: "Design the smallest version of your product that actually tests the core mechanism — not stripped features, but isolated proof.",
    sections: [
      {
        title: "Part 1 — Mechanism Isolation",
        items: [
          "What is the core mechanism? (the specific thing that makes this work)",
          "What is the minimal proof of that mechanism?",
          "What does the mechanism NOT require to be proven?",
        ],
      },
      {
        title: "Part 2 — Delivery Proof Design",
        items: [
          "Who receives the mechanism? (one specific person)",
          "How is it delivered? (minimum viable delivery vehicle)",
          "What does success look like for them? (specific, observable)",
        ],
      },
      {
        title: "Part 3 — Feedback Instrumentation",
        items: [
          "What will you observe? (leading indicators)",
          "How will you capture it? (method)",
          "What threshold triggers iteration? (decision rule)",
        ],
      },
      {
        title: "Part 4 — Exit Criteria",
        items: [
          "Condition A — proceed to full build: [state it]",
          "Condition B — pivot mechanism: [state it]",
          "Condition C — abandon: [state it]",
          "Decision timeline: [when will you decide?]",
        ],
      },
    ],
  },
  {
    id: "C-02",
    label: "Offer Clarity Matrix",
    type: "Diagnostic System",
    positioning: "A diagnostic matrix for the 6 most common offer architecture failures — detection test, root cause, fix path for each.",
    sections: [
      {
        title: "Failure 01 — Unclear Promise",
        items: [
          "Detection: Can a stranger say back what you deliver in one sentence?",
          "Root cause: Promise stated in features, not outcomes",
          "Fix: Restate as [specific person] achieves [specific outcome] by [specific mechanism]",
        ],
      },
      {
        title: "Failure 02 — Mechanism Not Named",
        items: [
          "Detection: Does your offer sound like others in the market?",
          "Root cause: No proprietary mechanism named",
          "Fix: Name the method. Own the language.",
        ],
      },
      {
        title: "Failure 03 — Proof Absent",
        items: [
          "Detection: What would a skeptic say?",
          "Root cause: Assertions without evidence",
          "Fix: Find or create one undeniable proof artifact",
        ],
      },
      {
        title: "Failure 04 — Pricing Misaligned",
        items: [
          "Detection: Does the price feel arbitrary?",
          "Root cause: Price not anchored to buyer's reference frame",
          "Fix: Find what the buyer currently spends on this problem",
        ],
      },
      {
        title: "Failure 05 — Boundary Undefined",
        items: [
          "Detection: What would you NOT do for this price?",
          "Root cause: No scope definition",
          "Fix: State exactly what is excluded",
        ],
      },
      {
        title: "Failure 06 — Wrong Buyer",
        items: [
          "Detection: Are people interested but not buying?",
          "Root cause: Right offer, wrong person targeted",
          "Fix: Define the buyer who already feels this pain acutely",
        ],
      },
    ],
  },
  {
    id: "C-03",
    label: "Build-to-Live Sprint Map",
    type: "Execution Sequence",
    positioning: "A 4-week execution sequence from designed offer to first live sale. Ends with a gate that requires human response — not content published.",
    sections: [
      {
        title: "Week 1 — Offer Finalization",
        items: [
          "Day 1–2: Apply Offer Clarity Matrix (C-02). Fix all failures.",
          "Day 3–4: Write the offer statement: mechanism, promise, proof, price, boundary.",
          "Day 5–7: Assemble proof — collect existing results, testimonials, or documented logic.",
          "Gate: Written offer passes skeptic test.",
        ],
      },
      {
        title: "Week 2 — Delivery Mechanism Build",
        items: [
          "Build only what is required to deliver the promise once.",
          "Do not build infrastructure. Build the first delivery.",
          "Gate: You could deliver this today if a buyer appeared.",
        ],
      },
      {
        title: "Week 3 — Distribution Activation",
        items: [
          "Identify the 10 people most likely to need this now.",
          "Write the specific message for each.",
          "Activate exactly one channel.",
          "Gate: 10 specific people have been reached.",
        ],
      },
      {
        title: "Week 4 — First Sale Execution",
        items: [
          "Have real conversations. Not broadcast. Not content.",
          "Conversations with the 10 people.",
          "Gate: At least one person has said yes, no, or given a real objection.",
          "Post-sprint: Update your Build Blueprint based on real evidence.",
        ],
      },
    ],
  },
];

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        border: `1px solid ${open ? TEAL_BORDER : "hsla(172, 55%, 38%, 0.12)"}`,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* Card header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          background: open ? TEAL_FAINT : "transparent",
          border: "none",
          padding: "20px 22px",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.2em",
            color: TEAL,
            flexShrink: 0,
            minWidth: "36px",
          }}
        >
          {artifact.id}
        </span>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--rx-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {artifact.label}
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: TEAL_MID,
            }}
          >
            {artifact.type}
          </span>
        </div>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            color: TEAL_MID,
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "none",
          }}
        >
          →
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 22px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                borderTop: `1px solid ${TEAL_BORDER}`,
                paddingTop: "18px",
              }}
            >
              {/* Positioning */}
              <p
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "13px",
                  color: "var(--rx-text-dim)",
                  margin: 0,
                  lineHeight: 1.65,
                  fontStyle: "italic",
                }}
              >
                {artifact.positioning}
              </p>

              {/* Sections */}
              {artifact.sections.map((section, si) => (
                <div key={si} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span
                    style={{
                      fontFamily: "Syne, system-ui, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      color: TEAL,
                      textTransform: "uppercase",
                    }}
                  >
                    {section.title}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "12px" }}>
                    {section.items.map((item, ii) => (
                      <span
                        key={ii}
                        style={{
                          fontFamily: "Inter, system-ui, sans-serif",
                          fontSize: "12px",
                          color: "var(--rx-text-dim)",
                          lineHeight: 1.6,
                          display: "flex",
                          gap: "8px",
                          alignItems: "flex-start",
                        }}
                      >
                        <span style={{ color: TEAL_MID, flexShrink: 0, marginTop: "1px" }}>·</span>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WorkshopArtifactPanel() {
  return (
    <section
      aria-label="Workshop Artifacts"
      style={{
        marginBottom: "clamp(40px, 6vh, 64px)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: TEAL_MID,
          }}
        >
          Founder Artifacts
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: `linear-gradient(90deg, ${TEAL_BORDER}, transparent)`,
          }}
        />
      </div>

      <MechanismDocument />
      {ARTIFACTS.map(artifact => (
        <ArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </section>
  );
}
