/**
 * MechanismDocument.tsx — The Mechanism Document
 * First true build-doctrine artifact for Nexus Cria / Creation portal.
 *
 * Full written content — not a template.
 * Lives as primary article in WorkshopArtifactPanel.
 *
 * Canon: RUBERRA-PODIUM-CONTENT-001 · @claude · 2026-03-29
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEAL = "hsl(172, 55%, 38%)";
const TEAL_MID = "hsla(172, 55%, 38%, 0.55)";
const TEAL_FAINT = "hsla(172, 55%, 38%, 0.08)";
const TEAL_BORDER = "hsla(172, 55%, 38%, 0.2)";
const EASE = [0.22, 1, 0.36, 1] as const;

interface DocPart {
  heading?: string;
  body: string;
}

interface Section {
  id: string;
  label: string;
  parts: DocPart[];
}

const SECTIONS: Section[] = [
  {
    id: "what",
    label: "Part 1 — What a Mechanism Is",
    parts: [
      {
        body: "A mechanism is not a feature. A feature is something the product has. A mechanism is something the product does — specifically, the process by which a cause produces an effect.",
      },
      {
        body: "The promise of any offer is: \"This will produce outcome X for person Y.\"\nThe mechanism answers: \"Because of specific process Z, which works by [specific causal chain].\"",
      },
      {
        body: "Without the mechanism, the promise is an assertion. With the mechanism, it is an argument. An assertion can only be doubted or trusted based on credentials and social proof. An argument can be evaluated on its own logic. A serious buyer evaluates arguments. Assertions make them suspicious.",
      },
      {
        body: "The mechanism also makes your offer distinct. Most offers in any category promise similar outcomes: more revenue, better health, faster growth, deeper learning. The outcomes are interchangeable. The mechanisms are not. Two offers with identical outcomes and different mechanisms are selling different things to anyone who's paying attention.",
      },
    ],
  },
  {
    id: "anatomy",
    label: "Part 2 — The Mechanism Anatomy",
    parts: [
      {
        body: "Every mechanism has four components. Most creators can name two. The gap is almost always in the transformation.",
      },
      {
        heading: "The Input",
        body: "What condition, resource, or information does this mechanism require to operate? Who provides it? In what form must it arrive?",
      },
      {
        heading: "The Transformation",
        body: "What specific process converts the input into the output? This is where the mechanism actually lives. Most creators can state the input and the output. Almost none can describe the transformation with precision. The transformation is the work the mechanism does — it is why the output is different from the input.",
      },
      {
        heading: "The Output",
        body: "What specific state, asset, capability, or result does the transformation produce? Note: \"improved performance\" is not a specific output. \"A written authority architecture with named framework and content spine\" is a specific output.",
      },
      {
        heading: "The Activation Condition",
        body: "Under what conditions does this mechanism produce results? Under what conditions does it fail? Stating the failure conditions is not weakness — it is mechanism mastery. A mechanism that works under any conditions is not specific enough to be credible. A mechanism that works specifically for [this person] under [these conditions] is believable.",
      },
    ],
  },
  {
    id: "protocol",
    label: "Part 3 — The Mechanism Identification Protocol",
    parts: [
      {
        body: "Most creators don't know their own mechanism clearly. The logic of work you do intuitively is invisible to you. This protocol surfaces it.",
      },
      {
        heading: "Step 1 — The \"Because\" Test",
        body: "Complete this sentence: \"This works because ___.\"",
      },
      {
        body: "Not: \"This works because I have 15 years of experience.\"\nNot: \"This works because clients see results.\"\nThose are authority claims and proof claims. Neither is a mechanism.\n\nA mechanism sounds like: \"This works because [specific process] converts [specific input] into [specific output] by [specific transformation logic that is non-obvious].\"\n\nIf you can't complete that sentence without becoming vague, the mechanism has not been identified yet.",
      },
      {
        heading: "Step 2 — The \"Even When\" Extension",
        body: "Add: \"This works even when ___.\" This forces identification of boundary conditions.\n\nWeak: \"This works when the client is motivated.\"\nStrong: \"This works even when the client isn't motivated, because the process creates structured obligation points that operate independently of motivation state.\"",
      },
      {
        heading: "Step 3 — The \"Unlike\" Contrast",
        body: "Add: \"Unlike [the dominant approach in this category], this works by ___.\" This forces differentiation at the mechanism level, not the marketing level. Anyone can claim better outcomes. Mechanism contrast is evaluable — the buyer can think: \"That's a real distinction.\"",
      },
      {
        heading: "Step 4 — The \"Therefore\" Chain",
        body: "Construct: \"[Specific input] + [specific process] = [specific output], therefore [buyer achieves specific result under specific conditions].\"\n\nIf you can't complete this chain without vagueness in any of the four positions, the mechanism is not yet clearly identified. The vague position is where the work is.",
      },
    ],
  },
  {
    id: "naming",
    label: "Part 4 — The Naming Method",
    parts: [
      {
        body: "A mechanism needs a name. The name should be proprietary, describe the transformation not just the output, be memorable without being constructed, and be accurate enough that someone who hears the name can predict the method.",
      },
      {
        heading: "Naming formats that work",
        body: "The [Process] Method — describes what is done: \"The Inversion Method\", \"The Elimination Protocol\"\nThe [Result] Architecture — describes the structure: \"The Authority Architecture\", \"The Value Ladder System\"\nThe [Structural Metaphor] — uses an accurate analogy: \"The Flywheel\", \"The Bridge\"\nThe [Specific Problem] Solution — names what it uniquely solves: \"The Legibility Protocol\", \"The Mechanism Document\"",
      },
      {
        heading: "What to avoid",
        body: "Acronyms that exist to spell a motivating word. Names that could describe any product in your category. Names that over-promise. Generic nouns like \"framework\" or \"system\" used without a distinguishing modifier.\n\nA name that works passes this test: a person who has never heard of your offer can, after hearing only the name, make an accurate guess about the transformation it performs.",
      },
    ],
  },
  {
    id: "test",
    label: "Part 5 — The Legibility Test Battery",
    parts: [
      {
        body: "A mechanism is legible when a thoughtful person who doesn't already believe in you can evaluate it.",
      },
      {
        heading: "Test 1 — The Playback Test",
        body: "Can they accurately describe your mechanism back to you in one sentence after hearing it once? If not: the articulation is unclear, or the mechanism needs simplified articulation without simplifying the mechanism itself.",
      },
      {
        heading: "Test 2 — The Skeptic Test",
        body: "Can they identify where the mechanism could fail? If they cannot find a plausible failure condition, the mechanism isn't specific enough. Paradoxically, a mechanism that can't fail also can't convince.",
      },
      {
        heading: "Test 3 — The Contrast Test",
        body: "Can they explain specifically how your mechanism differs from the most obvious alternative approach? If not: the differentiation is not yet in the mechanism — it may only be in your positioning language.",
      },
      {
        heading: "Test 4 — The Buyer Fit Test",
        body: "Ask a real potential buyer, after hearing the mechanism: \"Do you understand why this would work for someone in your specific situation?\" If uncertain: the transformation step is not yet translated to their context, or the activation conditions haven't been stated.",
      },
    ],
  },
  {
    id: "failures",
    label: "Part 6 — The Six Mechanism Failures",
    parts: [
      {
        heading: "Failure 1 — Mechanism-by-Authority",
        body: "\"This works because of my credentials.\" Authority is a reason to evaluate the mechanism. It is not the mechanism. State them separately.",
      },
      {
        heading: "Failure 2 — Mechanism-by-Popularity",
        body: "\"This works because it worked for 500 clients.\" Social proof is evidence of past mechanism output. It is not the mechanism. What specifically caused those results?",
      },
      {
        heading: "Failure 3 — Mechanism-by-Effort",
        body: "\"This works because we work harder and care more.\" Effort is not a mechanism. What specifically do you do differently that produces different outputs?",
      },
      {
        heading: "Failure 4 — Mechanism-by-Technology",
        body: "\"This works because we use AI / software / proprietary tool.\" The tool is not the mechanism. The mechanism is what you do with the tool that produces a specific transformation unavailable without that usage pattern.",
      },
      {
        heading: "Failure 5 — Mechanism-by-Category",
        body: "\"This works because it's evidence-based / research-backed / proven.\" These are quality signals, not mechanisms. Evidence of what? Research into which causal chain? Proven how, under what conditions?",
      },
      {
        heading: "Failure 6 — Mechanism-by-Outcome",
        body: "\"This works because people who use it achieve [outcome].\" The outcome is the effect of the mechanism. Stating the effect does not explain the cause. This is the most common failure, and the most invisible to the creator, because the outcome is real — they're just not explaining why.",
      },
    ],
  },
];

function Part({ heading, body }: DocPart) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {heading && (
        <span style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          color: TEAL,
          display: "block",
          marginBottom: "4px",
          letterSpacing: "0.01em",
        }}>
          {heading}
        </span>
      )}
      {body.split("\n\n").map((paragraph, pi) => (
        <p key={pi} style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "13px",
          color: "var(--rx-text-dim)",
          margin: pi > 0 ? "7px 0 0" : "0",
          lineHeight: 1.7,
        }}>
          {paragraph.split("\n").map((line, li, arr) => (
            <span key={li}>{line}{li < arr.length - 1 && <br />}</span>
          ))}
        </p>
      ))}
    </div>
  );
}

function DocSection({ section, index }: { section: Section; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.38, ease: EASE }}
      style={{
        border: `1px solid ${open ? TEAL_BORDER : "hsla(172,55%,38%,0.09)"}`,
        borderRadius: "10px",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          background: open ? TEAL_FAINT : "transparent",
          border: "none",
          padding: "13px 18px",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "background 0.2s",
        }}
      >
        <span style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          color: open ? "var(--rx-text-primary)" : "var(--rx-text-dim)",
          flex: 1,
          letterSpacing: "-0.01em",
        }}>
          {section.label}
        </span>
        <span style={{
          color: TEAL_MID,
          fontSize: "10px",
          fontFamily: "JetBrains Mono, monospace",
          transition: "transform 0.2s",
          transform: open ? "rotate(90deg)" : "none",
          flexShrink: 0,
        }}>
          →
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "14px 18px 18px", borderTop: `1px solid ${TEAL_BORDER}` }}>
              {section.parts.map((part, pi) => (
                <Part key={pi} heading={part.heading} body={part.body} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MechanismDocument() {
  return (
    <section aria-label="The Mechanism Document" style={{ marginBottom: "clamp(32px, 5vh, 48px)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: EASE }}
        style={{ marginBottom: "16px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: TEAL_MID,
          }}>
            Build Doctrine · Creation
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${TEAL_BORDER}, transparent)` }} />
        </div>
        <h2 style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "clamp(18px, 2.4vw, 22px)",
          fontWeight: 700,
          color: "var(--rx-text-primary)",
          margin: "0 0 6px",
          letterSpacing: "-0.02em",
        }}>
          The Mechanism Document
        </h2>
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "13px",
          color: "var(--rx-text-ghost)",
          margin: 0,
          lineHeight: 1.6,
          maxWidth: "560px",
        }}>
          A complete system for identifying, naming, and articulating the core mechanism of any product or offer — the specific process that makes it work when everything else fails.
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {SECTIONS.map((section, i) => (
          <DocSection key={section.id} section={section} index={i} />
        ))}
      </div>
    </section>
  );
}
