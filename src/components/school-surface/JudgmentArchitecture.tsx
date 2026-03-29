/**
 * JudgmentArchitecture.tsx — The Judgment Architecture
 * First true doctrine artifact for Bridge Nova / School portal.
 *
 * Full written content — not a template.
 * Lives above LearningPath in the Foundations track.
 *
 * Canon: RUBERRA-PODIUM-CONTENT-001 · @claude · 2026-03-29
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "hsl(42, 78%, 52%)";
const GOLD_MID = "hsla(42, 78%, 52%, 0.5)";
const GOLD_FAINT = "hsla(42, 78%, 52%, 0.08)";
const GOLD_BORDER = "hsla(42, 78%, 52%, 0.18)";
const EASE = [0.22, 1, 0.36, 1] as const;

interface DocSection {
  id: string;
  label: string;
  parts: { heading?: string; body: string }[];
}

const SECTIONS: DocSection[] = [
  {
    id: "problem",
    label: "Part 1 — The Judgment Problem",
    parts: [
      {
        body: "Knowledge and judgment are not the same thing. This distinction is almost universally ignored in education and almost universally felt in practice.",
      },
      {
        body: "You have met people with enormous knowledge who make consistently poor decisions. You have met people with narrow knowledge who exercise exceptional judgment in their domain. The difference is not what they know — it is how they reason.",
      },
      {
        body: "Judgment is the capacity to reason accurately about situations where information is incomplete, experts disagree, outcomes are uncertain, stakes are real, time pressure exists, and your interests may bias your conclusions.",
      },
      {
        body: "Most education optimizes for knowledge transmission. Almost none optimizes for judgment installation. The result: educated people who are confident and wrong in sophisticated ways.",
      },
      {
        body: "The question School is designed to answer is not \"what do I know?\" It is: how reliably do I reason when it matters?",
      },
    ],
  },
  {
    id: "anatomy",
    label: "Part 2 — Anatomy of a Good Call",
    parts: [
      {
        body: "When someone makes a genuinely good call under uncertainty, they are running an implicit process:",
      },
      {
        heading: "Classification",
        body: "They correctly identify what kind of problem this is. The first failure of judgment is applying the wrong framework to a situation because you haven't classified it correctly. A hiring decision is not a product decision. A market timing question is not an execution question.",
      },
      {
        heading: "Prior Formation",
        body: "They have a calibrated estimate of how likely different outcomes are, based on base-rate knowledge of similar situations. They are not starting from scratch — they are updating a prior with new evidence.",
      },
      {
        heading: "Evidence Evaluation",
        body: "They distinguish high-quality evidence from low-quality evidence. They are not equally swayed by a vivid anecdote and a robust empirical study.",
      },
      {
        heading: "Bias Recognition",
        body: "They identify when their own interests, fears, or desires are distorting their reasoning — and apply a correction.",
      },
      {
        heading: "Uncertainty Tolerance",
        body: "They hold multiple hypotheses simultaneously until evidence discriminates between them. They do not force premature closure.",
      },
      {
        heading: "Decision Rule Application",
        body: "They have a structured rule for when to decide and what to do given different evidence states. They are not deciding by feeling.",
      },
      {
        heading: "Error Recording",
        body: "They track decisions and outcomes. They compare what they predicted against what happened. They update.",
      },
    ],
  },
  {
    id: "capacities",
    label: "Part 3 — The 5 Judgment Capacities",
    parts: [
      {
        heading: "J1 — Calibration",
        body: "The ability to accurately estimate your own uncertainty.\n\nThe test: For 20 questions you're unsure about, assign confidence levels: 60%, 70%, 80%, 90%. If you say 80% confident, you should be right roughly 80% of the time. If you're right 95% on your \"80%\" answers, you're underconfident. If you're right 65%, you're overconfident by 30 points.\n\nMost intelligent people are systematically overconfident. Calibration is trainable.",
      },
      {
        heading: "J2 — Base Rate Respect",
        body: "The ability to anchor predictions to known statistics before adding individual evidence.\n\nThe failure: Your colleague starts a venture. You consider their capability, team, timing, and edge. You do not think: \"What fraction of ventures with this structure succeed in 3 years?\" The base rate is often the most important piece of information — and is most often ignored.\n\nThe test: Pick three domains where you make regular predictions. What is the actual base rate of success in each? Did you know it before this question?",
      },
      {
        heading: "J3 — Evidence Discrimination",
        body: "The ability to assess the quality of evidence, not just its content.\n\nThe failure: You read a testimonial. You read a study. You weight them similarly. One is cherry-picked anecdote. One is a controlled experiment with n=1800.\n\nEvidence quality simplified: personal anecdote → expert opinion → case study → survey → controlled experiment → independent replication → meta-analysis. Know where your evidence sits before updating beliefs.",
      },
      {
        heading: "J4 — Interest Separation",
        body: "The ability to reason about situations where you have a stake in the outcome.\n\nThe failure: You have invested two years building something. You evaluate evidence about whether it is working. You consistently find reasons to continue. Your interest has contaminated your evaluation.\n\nThe test: Name a belief you hold that, if proven false, would require you to abandon something you've invested in. When did you last actively seek disconfirming evidence for this belief?",
      },
      {
        heading: "J5 — Decision Finalization",
        body: "The ability to act decisively when you have sufficient evidence, without waiting for certainty that will never arrive.\n\nThe failure: You have enough information to decide. You continue gathering more. The information-gathering is a proxy for avoiding the commitment. The cost of delay is invisible. The cost of deciding feels real.\n\nThe test: What decision have you been delaying for more than 30 days that you have sufficient evidence to make today?",
      },
    ],
  },
  {
    id: "battery",
    label: "Part 4 — The Calibration Battery",
    parts: [
      { body: "Run this protocol quarterly." },
      {
        heading: "Exercise 1 — Confidence Calibration (30 min)",
        body: "Write 30 factual questions in your domain that you're uncertain about. Assign a confidence percentage to each. Check the answers. For all answers where you said X% confident: what fraction were correct?\n\nIf you said 80% confident on 10 questions and got 8 right: calibrated. 10 right: underconfident. 5 right: overconfident by 30 points.\n\nTarget: within ±10% calibration across confidence bands.",
      },
      {
        heading: "Exercise 2 — Prediction Log Review (20 min)",
        body: "Pull your last 10 significant predictions about markets, people, projects, or outcomes. Compare prediction against outcome. Calculate your hit rate. Note the failure pattern.\n\nCommon patterns: predicted fast when slow was base rate (optimism bias); predicted smooth when disruption is historically common (normalcy bias); predicted what you wanted (motivated reasoning).",
      },
      {
        heading: "Exercise 3 — Base Rate Audit (20 min)",
        body: "Pick three domains where you make regular predictions. Find the actual base rates. How often do projects like yours succeed? How often do negotiations like yours reach agreement? Compare to your actual predictions. Are you systematically above base rate in your optimism?",
      },
      {
        heading: "Exercise 4 — Interest Map (15 min)",
        body: "List your five most important current beliefs about your work or strategy. For each: \"If this belief is wrong, what would I have to change or give up?\" The beliefs with the highest personal cost of being wrong are most likely contaminated by interest. Flag them. Schedule deliberate disconfirmation attempts.",
      },
    ],
  },
  {
    id: "protocol",
    label: "Part 5 — The 9-Month Build Protocol",
    parts: [
      {
        body: "Judgment doesn't develop through reading about judgment. It develops through repeated exposure to judgment tasks with feedback.",
      },
      {
        heading: "Months 1–3: Calibration Installation",
        body: "Daily: Make three predictions with explicit confidence levels about things that resolve within 24 hours. Record and review.\nWeekly: Run Exercise 1 with domain-specific questions.\nMonthly: Calculate your calibration score.\n\nGoal: You can accurately estimate your own uncertainty. You know which domains you're systematically miscalibrated in.",
      },
      {
        heading: "Months 4–6: Evidence Discrimination",
        body: "Practice: Every time you update a belief, write one sentence about the evidence quality that triggered the update. Was it anecdote, case study, or controlled study? Develop an internal evidence quality rating. Notice when you're updating on low-quality signals.\n\nGoal: You can discriminate evidence quality in real time.",
      },
      {
        heading: "Months 7–9: Interest Separation",
        body: "Practice: Each month, identify one important decision where you have a stake in the outcome. Run a devil's advocate protocol — write the strongest possible case for the position you're not inclined toward. How good is it?\n\nGoal: You can identify your own motivated reasoning in real time and apply a correction before acting.",
      },
      {
        heading: "Months 10–12: Integration",
        body: "Keep a judgment journal. For every significant decision: options considered, confidence levels, evidence quality, base rates checked, interests identified, final reasoning.\n\nReview quarterly. Where did you get it right? Where wrong? What is the pattern?",
      },
    ],
  },
];

function DocPart({ heading, body }: { heading?: string; body: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      {heading && (
        <span
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: GOLD,
            display: "block",
            marginBottom: "4px",
            letterSpacing: "0.01em",
          }}
        >
          {heading}
        </span>
      )}
      {body.split("\n\n").map((paragraph, pi) => (
        <p
          key={pi}
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "13px",
            color: "var(--rx-text-dim)",
            margin: pi > 0 ? "8px 0 0" : "0",
            lineHeight: 1.7,
          }}
        >
          {paragraph.split("\n").map((line, li, arr) => (
            <span key={li}>
              {line}
              {li < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

function Section({ section, index }: { section: DocSection; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: EASE }}
      style={{
        border: `1px solid ${open ? GOLD_BORDER : "hsla(42,78%,52%,0.08)"}`,
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
          gap: "12px",
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: open ? "var(--rx-text-primary)" : "var(--rx-text-dim)",
            flex: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {section.label}
        </span>
        <span
          style={{
            color: GOLD_MID,
            fontSize: "10px",
            fontFamily: "JetBrains Mono, monospace",
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "none",
            flexShrink: 0,
          }}
        >
          →
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "16px 18px 20px",
                borderTop: `1px solid ${GOLD_BORDER}`,
              }}
            >
              {section.parts.map((part, pi) => (
                <DocPart key={pi} heading={part.heading} body={part.body} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function JudgmentArchitecture() {
  return (
    <section
      aria-label="The Judgment Architecture"
      style={{
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto clamp(40px, 6vh, 60px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{ marginBottom: "20px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: `${GOLD}55`,
            }}
          >
            Doctrine · Foundations
          </span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${GOLD_BORDER}, transparent)` }} />
        </div>
        <h2
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(20px, 2.8vw, 26px)",
            fontWeight: 700,
            color: "var(--rx-text-primary)",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          The Judgment Architecture
        </h2>
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "13px",
            color: "var(--rx-text-ghost)",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: "560px",
          }}
        >
          The operating system for reasoning accurately under uncertainty — the capacity that separates people who know things from people who consistently make good calls.
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {SECTIONS.map((section, i) => (
          <Section key={section.id} section={section} index={i} />
        ))}
      </div>
    </section>
  );
}
