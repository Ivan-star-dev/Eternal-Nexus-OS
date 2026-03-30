/**
 * ValueCreationDoctrine.tsx — The Value Creation Architecture
 * First true doctrine artifact for Bridge Nova / Value Creation track.
 *
 * Full written content — not a template.
 * Lives above LearningPath when Value Creation track is active.
 *
 * Canon: RUBERRA-PODIUM-CONTENT-002 · @claude · 2026-03-30
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
    id: "what",
    label: "Part 1 — What Value Actually Is",
    parts: [
      {
        body: "Value is not a feature. It is not a price. It is not quality. Value is the degree to which something closes a specific gap in a specific person's situation.",
      },
      {
        body: "The gap is always between a current state and a desired state. The desired state contains something the person cares about: a result they want, a problem they want resolved, a capability they want to gain, an identity they want to inhabit. If your output closes that gap reliably, you have created value. If it doesn't, you haven't — regardless of how sophisticated, costly, or well-intentioned it is.",
      },
      {
        body: "This means value is not inherent in what you make. It is relational — it exists in the encounter between your output and a person whose gap it closes. The same thing has radically different value for different people. A map of a city you've never visited has almost no value. A map of the city you're lost in right now has enormous value. Nothing about the map changed.",
      },
      {
        body: "The implication is uncomfortable: building better things does not automatically create more value. Creating more value requires understanding whose gap you are closing, what that gap actually is, and whether your mechanism reliably closes it. Excellence in production is necessary but not sufficient. This is why technically superior products lose to simpler ones — the simpler one closed the actual gap.",
      },
    ],
  },
  {
    id: "transmission",
    label: "Part 2 — The Value Transmission Problem",
    parts: [
      {
        body: "Value that exists but cannot be transmitted does not function as value. This is the failure mode that kills most serious work.",
      },
      {
        heading: "The Legibility Gap",
        body: "Value must be legible before it can be trusted, before it can be bought, before it can spread. Legibility means: a person who has not yet experienced your output can understand what it does, why it works, and why it's relevant to them — from what you say and show, before they pay. If they cannot, the value is locked inside your work and invisible to everyone outside it.",
      },
      {
        heading: "The Trust Gap",
        body: "Legibility creates understanding. Trust creates willingness to act. These are different things. A person can understand exactly what your offer does and still not buy it — because they don't yet believe it will work for them specifically, or that you will deliver. Trust is built through mechanism clarity (they understand why it works), social proof (they see it working for others like them), and credibility (they believe you can execute). All three compound. None alone is sufficient.",
      },
      {
        heading: "The Reach Gap",
        body: "Even legible, trusted value reaches no one without reach. Reach is the number of people in your target gap whose attention you can command. Most serious builders chronically underinvest in reach — not because they don't know it matters, but because creating value feels like real work and acquiring reach feels like performance. The distinction is false. Reach is infrastructure. Without it, every unit of value you create sits in a room with no door.",
      },
      {
        body: "The Value Transmission Problem is the intersection of all three gaps. Great work that isn't legible doesn't transmit. Legible work that isn't trusted doesn't transmit. Trusted work without reach doesn't scale. V10 requires solving all three — not sequentially, but in parallel, as a single integrated system.",
      },
    ],
  },
  {
    id: "offer",
    label: "Part 3 — Offer Architecture",
    parts: [
      {
        body: "An offer is the structured interface between your value and a buyer's decision. It is not the thing you build — it is the case you make for why the thing you build closes their gap better than any alternative.",
      },
      {
        heading: "The Five Structural Elements",
        body: "Every structurally sound offer requires five elements:\n\n1. Promise — What specific outcome does this produce for what specific person? If two different people would describe the promise differently after hearing it, it isn't clear yet.\n\n2. Mechanism — Why does this produce that outcome? What is the specific process that converts input into result? Without a mechanism, the promise is an assertion. With one, it is an argument.\n\n3. Proof — What evidence exists that the mechanism works? Not social proof alone — mechanism evidence. Demonstrations, documented results, logic that can be evaluated.\n\n4. Price — Is the cost anchored to the buyer's reference frame? Price is not a number — it is a ratio between what the buyer gives up and what they gain. An offer with a correct price feels obvious. An offer with a wrong price generates friction regardless of quality.\n\n5. Boundary — What is explicitly excluded? An offer without stated limits produces fear of scope creep in the buyer and scope creep in reality. State what you won't do as clearly as what you will.",
      },
      {
        heading: "The Offer Is Not the Product",
        body: "The product is what you build and deliver. The offer is what you communicate before the transaction. Most builders confuse these and produce products without offers — they build things that work and assume the value is self-evident. It is not. Even when the product is excellent, the offer is the thing that produces the decision to engage. A weaker product with a stronger offer usually wins against a stronger product with a weaker offer. This is not a moral argument — it is a mechanical description of how buying decisions are made.",
      },
    ],
  },
  {
    id: "distribution",
    label: "Part 4 — Distribution Logic",
    parts: [
      {
        body: "Distribution is the system through which your offer reaches the people whose gap it closes. It is not marketing. It is not promotion. It is architecture.",
      },
      {
        heading: "Channel Selection",
        body: "A channel is a method of reaching attention. Channels have different properties: reach (how many people), trust (how much credibility transfers), cost (time, money, effort), and fit (how well the channel matches your buyer's behavior). Channel selection should be driven by where your specific buyer already pays attention — not by what channels you find comfortable or what channels are culturally valued in your domain.",
      },
      {
        heading: "The Trust Ladder",
        body: "Buyers move from awareness → interest → trust → decision. These are not the same moment. Distribution that generates awareness without building trust produces attention with no conversion. The most durable distribution systems accelerate trust, not just awareness. They do this by providing real value before asking for a decision — articles, demonstrations, conversations, documented results that show the mechanism working before anyone pays.",
      },
      {
        heading: "Positioning",
        body: "Positioning is the specific slot your offer occupies in a buyer's mental landscape. It answers: compared to what? When someone encounters your offer, they will automatically compare it to the nearest alternative they know. If you don't control the comparison set, they will create one and you may lose. Strong positioning defines the comparison explicitly, on ground where your offer is strongest. Not \"better than everything\" — better than the specific alternatives your buyer considers, on the dimensions your buyer actually values.",
      },
      {
        heading: "The Compounding Channel",
        body: "Most distribution effort produces linear returns: you put in effort, you get attention, the effort stops and so does the attention. Compounding channels produce returns that persist and grow after the effort is made. Content is a compounding channel. Reputation is a compounding channel. Systems that produce referrals are compounding channels. Building even one compounding channel changes the economics of distribution permanently. The question is not whether to build one — it is which one and when.",
      },
    ],
  },
  {
    id: "execution",
    label: "Part 5 — Execution Architecture",
    parts: [
      {
        body: "Execution is not working hard. Execution is designing and operating systems that reliably produce the outcomes you intend — at quality, on schedule, under the real conditions you actually face.",
      },
      {
        heading: "The Doing-Systematizing Gap",
        body: "Most builders who are excellent at their craft are excellent at doing — performing the craft themselves under optimal conditions. They are rarely excellent at systematizing — designing the process so the craft is performed reliably by the system, including by other people and by their future selves under non-optimal conditions. This gap is the primary ceiling on scale. A creator who can only produce excellent work when they personally do every step has not built a system. They have built a job for themselves.",
      },
      {
        heading: "The Bottleneck Map",
        body: "Every value creation system has bottlenecks — the points where throughput is constrained. Improving non-bottleneck parts produces no increase in output. Only improving the bottleneck improves the system. The practical discipline is: before adding new capability, identify the current binding constraint. Add capacity there first. Everything else is the illusion of progress.",
      },
      {
        heading: "The Quality Floor",
        body: "Quality is not the ceiling — it is the floor. The question is not \"how good can this be\" but \"what is the minimum quality below which this stops working, and how do we guarantee we always stay above it?\" This reframe matters because optimizing for ceiling produces inconsistency. Guaranteeing a floor produces reliability. Buyers trust reliability. Occasional excellence cannot compensate for structural inconsistency.",
      },
      {
        heading: "Leverage Points",
        body: "Some inputs produce disproportionate outputs. These are leverage points: the actions that, if improved, compound across the entire system. Identifying your leverage points is more valuable than working harder at everything. The discipline is finding the 20% of activity that produces 80% of meaningful output — then investing in those specifically, protecting them from dilution, and systematizing them first.",
      },
    ],
  },
  {
    id: "compounding",
    label: "Part 6 — The Compounding Map",
    parts: [
      {
        body: "Value creation at scale does not follow the same mechanics as value creation in isolation. Understanding the difference is the difference between building a business and building a ceiling.",
      },
      {
        heading: "Effort Scales Linearly",
        body: "If your value creation depends primarily on your personal effort, your output is bounded by your time, energy, and presence. These are real constraints with real ceilings. More effort produces more output up to a hard limit — then it stops. Most early-stage creators operate in this mode without realizing it. They confuse work ethic with leverage.",
      },
      {
        heading: "Systems Scale Nonlinearly",
        body: "Systems — documented processes, codified knowledge, infrastructure, trained people, software — can operate independent of your personal presence. Once built, they produce output whether or not you are working. The ratio of output to personal effort increases as systems mature. This is compounding. It only activates after the investment to build the system, which is why most creators never reach it — they stop before the inflection point.",
      },
      {
        heading: "Reputation and Authority Scale Exponentially",
        body: "The highest-compounding asset in value creation is not a system or a product — it is a clearly defined, credibly demonstrated position of authority in a specific domain. A person or entity that is recognized as the best at solving a specific problem for a specific person attracts buyers, reduces the cost of distribution, enables premium pricing, and produces referrals that compound. Authority is not claimed — it is built through documented mechanism, demonstrated results, and consistent public evidence over time.",
      },
      {
        heading: "The Sovereign Creator Position",
        body: "The destination of value creation mastery is the sovereign position: a business built on a defensible mechanism, transmitted through a compounding distribution system, delivered via a systematized process, priced at the value it creates rather than the effort it costs, and recognized through undeniable authority in the domain it serves. No element alone produces this. All elements together create something that cannot be easily replicated — because the combination, once assembled with enough time and evidence, is the most durable competitive position available.",
      },
    ],
  },
];

function Part({ heading, body }: { heading?: string; body: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
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
            margin: pi > 0 ? "7px 0 0" : "0",
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

function DocSection({ section, index }: { section: DocSection; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.38, ease: EASE }}
      style={{
        border: `1px solid ${open ? GOLD_BORDER : "hsla(42,78%,52%,0.09)"}`,
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
          padding: "13px 18px",
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
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{ padding: "14px 18px 18px", borderTop: `1px solid ${GOLD_BORDER}` }}
            >
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

export default function ValueCreationDoctrine() {
  return (
    <section
      aria-label="The Value Creation Architecture"
      style={{ marginBottom: "clamp(32px, 5vh, 48px)" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: EASE }}
        style={{ marginBottom: "16px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: GOLD_MID,
            }}
          >
            Doctrine · Value Creation
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(90deg, ${GOLD_BORDER}, transparent)`,
            }}
          />
        </div>
        <h2
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            fontSize: "clamp(18px, 2.4vw, 22px)",
            fontWeight: 700,
            color: "var(--rx-text-primary)",
            margin: "0 0 6px",
            letterSpacing: "-0.02em",
          }}
        >
          The Value Creation Architecture
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
          The foundational theory of how value is created, transmitted, and compounded — the doctrinal base for every offer, distribution system, and execution architecture you will build.
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
