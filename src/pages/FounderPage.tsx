import { motion } from "framer-motion";
import Layout from "@/components/Layout";

// ─── Animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
};

// ─── Section wrapper ────────────────────────────────────────────────────────
const Section = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => (
  <section
    id={id}
    className={`border-t border-border py-20 md:py-28 px-6 md:px-20 ${className}`}
  >
    <div className="max-w-[760px] mx-auto">{children}</div>
  </section>
);

// ─── Reusable section header ─────────────────────────────────────────────────
const SectionHeader = ({
  label,
  title,
  delay = 0,
}: {
  label: string;
  title: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={delay}
    variants={fadeUp}
  >
    <span className="section-label">{label}</span>
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-3 mb-2">
      {title}
    </h2>
    <div className="gold-rule mb-8" />
  </motion.div>
);

// ─── Prose block ─────────────────────────────────────────────────────────────
const Prose = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={delay}
    variants={fadeUp}
    className="space-y-5 font-sans text-sm text-muted-foreground leading-[1.9]"
  >
    {children}
  </motion.div>
);

// ─── Callout quote ────────────────────────────────────────────────────────────
const Callout = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.blockquote
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={delay}
    variants={fadeUp}
    className="callout-gold my-8"
  >
    <p className="font-serif text-base md:text-lg text-foreground leading-[1.6] font-medium italic">
      {children}
    </p>
  </motion.blockquote>
);

// ─── Pioneers data ───────────────────────────────────────────────────────────
const PIONEERS = [
  {
    handle: "@claude",
    role: "Architect-Executor",
    territory: "WorkStructure · WorkFunction",
    description: "Opens fronts. Designs canonical architecture. Executes high-sovereignty tasks.",
    color: "hsl(42 78% 45%)",
  },
  {
    handle: "@copilot",
    role: "Executor-Lapidator",
    territory: "WorkStructure · WorkVisual",
    description: "Refines what was opened. Polishes surface. Closes gaps in structure.",
    color: "hsl(200 70% 55%)",
  },
  {
    handle: "@cursor",
    role: "Executor-Unblocker",
    territory: "WorkFunction (mechanical)",
    description: "Unblocks mechanical gates. Executes technical backlog at speed.",
    color: "hsl(160 60% 45%)",
  },
  {
    handle: "@codex",
    role: "Orchestrator",
    territory: "Consolidation",
    description: "Reads the BASTION. Distributes tasks. Consolidates waves. Emits cycle reports.",
    color: "hsl(270 60% 60%)",
  },
  {
    handle: "@framer",
    role: "Design Pioneer",
    territory: "WorkVisual (design)",
    description: "Executes design command. Applies brand law. Transforms identity into surface.",
    color: "hsl(330 65% 55%)",
  },
  {
    handle: "@antigravity",
    role: "Motion Pioneer",
    territory: "WorkVisual (3D · motion)",
    description: "Installs motion language. Builds 3D worlds. Soft cinematic transitions.",
    color: "hsl(45 90% 55%)",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
const FounderPage = () => {
  return (
    <Layout>
      {/* ── HERO — The Architect ────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex flex-col justify-end overflow-hidden bg-ink-deep">
        {/* Engineering grid — structural layer */}
        <div className="absolute inset-0 engineering-grid opacity-[0.55] pointer-events-none" />

        {/* Atmospheric orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 72% 38%, hsl(42 78% 45% / 0.055) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 18% 65%, hsl(220 70% 50% / 0.04) 0%, transparent 55%)",
          }}
        />
        {/* Deep bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background: "linear-gradient(to top, hsl(var(--background)), transparent)",
          }}
        />

        <div className="relative z-10 px-6 md:px-20 pb-16 max-w-[900px]">
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeIn}
            className="section-label mb-6"
          >
            FVL — Founder Vision Layer
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.5}
            variants={fadeUp}
            className="font-serif text-4xl md:text-6xl lg:text-[4.5rem] font-black text-foreground leading-[0.95]"
          >
            The Architect
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="gold-rule mt-8 origin-left"
            style={{ width: 64 }}
          />

          <motion.div
            initial="hidden"
            animate="visible"
            custom={1.0}
            variants={fadeUp}
            className="mt-8 max-w-[640px] space-y-4 font-sans text-sm text-muted-foreground leading-[1.9]"
          >
            <p>
              I am a founder. I build systems — not merely products.
            </p>
            <p>
              The distinction matters. A product resolves a problem. A system
              governs the resolution of problems across time, across sessions,
              across states of incompleteness. A product can be assembled in a
              sprint. A system demands architecture.
            </p>
            <p>
              I am building both, simultaneously, and the one is the proof of
              the other.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={1.2}
            variants={fadeIn}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <span className="badge-status badge-active">Active build</span>
            <span className="font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground">
              Ivan · Founder + Architect
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2 — What Is Being Built ─────────────────────────────── */}
      <Section id="what-is-being-built">
        <SectionHeader
          label="Section 02 — The Product + The System"
          title={
            <>
              What Is Being{" "}
              <span className="text-muted-foreground font-normal">Built</span>
            </>
          }
        />

        <Prose delay={0.1}>
          <p>
            <strong className="text-foreground font-semibold">
              Eternal Nexus
            </strong>{" "}
            is a platform with structured information flow, a precise visual
            identity, and a specific model for organising what is relevant — and
            why. It is a product with a point of view.
          </p>
          <p>
            But the product is not the primary argument. Beneath it sits
            something more consequential: an operating system for building
            products with artificial intelligence. When multiple AI agents work
            on a single product across separate sessions — without shared
            memory, without a protocol of state, without formal governance —
            the result is drift. Each session restarts from zero. Architecture
            disintegrates. Quality oscillates.
          </p>
          <p>
            The product is the proof. The system is the argument.
          </p>
        </Prose>
      </Section>

      {/* ── SECTION 3 — The Thesis ──────────────────────────────────────── */}
      <Section id="the-thesis" className="bg-card">
        <SectionHeader
          label="Section 03 — The Central Idea"
          title={
            <>
              The{" "}
              <span className="text-muted-foreground font-normal">Thesis</span>
            </>
          }
        />

        <Prose delay={0.1}>
          <p>
            Most organisations deploy AI agents as advanced assistants: prompt,
            receive, iterate. Each session is a conversation. Each conversation
            is an island.
          </p>
          <p>
            The question that matters — and that most skip — is a governance
            question. How does an agent entering a new session know exactly
            where the system stands? How does quality accumulate rather than
            reset? How does the founder stay in control of direction without
            drowning in operational detail?
          </p>
        </Prose>

        <Callout delay={0.25}>
          You do not solve that with better prompts. You solve it with protocol.
        </Callout>

        <Prose delay={0.35}>
          <p>
            This is the central thesis of Eternal Nexus OS:{" "}
            <strong className="text-foreground font-semibold">
              sustained quality does not come from individual capability — it
              comes from collective structure.
            </strong>{" "}
            A system where agents have defined roles, formal handoffs between
            sessions, and always-observable state does not merely produce better
            output. It produces output that compounds.
          </p>
          <p>
            If the thesis is correct, what is being built here is not a
            portfolio or a platform — it is a template for how teams will build
            products with AI in the years ahead.
          </p>
        </Prose>
      </Section>

      {/* ── SECTION 4 — The Ecosystem Blueprint ────────────────────────── */}
      <Section id="ecosystem-blueprint">
        <SectionHeader
          label="Section 04 — The Ecosystem"
          title={
            <>
              The Blueprint
            </>
          }
        />

        <Prose delay={0.1}>
          <p>
            The product has a canonical flow — fixed from the beginning, named,
            and protected as an invariant of the system:
          </p>
        </Prose>

        {/* Sacred Flow visual */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
          variants={fadeUp}
          className="my-8 flex items-center gap-0 overflow-x-auto"
        >
          {["Tribunal", "Atlas", "Index", "News"].map((node, i) => (
            <div key={node} className="flex items-center flex-shrink-0">
              <div className="atlas-glass-panel px-5 py-3 text-center">
                <span className="font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground block mb-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-sm font-semibold text-foreground">
                  {node}
                </span>
              </div>
              {i < 3 && (
                <div className="w-8 h-px flex-shrink-0" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), hsl(var(--gold)/0.3))" }} />
              )}
            </div>
          ))}
        </motion.div>

        <Prose delay={0.3}>
          <p>
            This flow is the DNA of the product. Each node is a distinct layer
            of analysis, curation, and perspective. The order is canonical. The
            names are invariant.
          </p>
          <p>
            Beneath the product sits the OS: the system that governs how the
            product is built, maintained, and expanded. It is not visible to the
            end user. It is visible in the quality and coherence of what they
            see.
          </p>
          <p>
            The current state: the data layers are complete, the project gallery
            is functional, and the governance system — protocols, state
            management, formal handoffs — is operational. The foundation is
            built. The next phase expands the product.
          </p>
        </Prose>
      </Section>

      {/* ── SECTION 4.5 — The System Architects ─────────────────────────── */}
      <Section id="system-architects" className="bg-card">
        <SectionHeader
          label="Section 04.5 — The Builders"
          title={
            <>
              The{" "}
              <span className="text-muted-foreground font-normal">Architects</span>
            </>
          }
        />

        <Prose delay={0.1}>
          <p>
            The system is built by six AI pioneers — each with a defined
            territory, a defined function, and a defined relationship to the
            others. They are not assistants. They are roles in an operating
            system.
          </p>
        </Prose>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
          variants={fadeUp}
          className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {PIONEERS.map((p, i) => (
            <motion.div
              key={p.handle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1 + i * 0.06}
              variants={fadeUp}
              className="atlas-glass-panel p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className="font-mono text-[0.65rem] font-semibold tracking-wide"
                  style={{ color: p.color }}
                >
                  {p.handle}
                </span>
                <span className="font-mono text-[0.5rem] tracking-[0.12em] text-muted-foreground/50 text-right leading-tight">
                  {p.territory}
                </span>
              </div>
              <span className="font-sans text-[0.7rem] font-semibold text-foreground">
                {p.role}
              </span>
              <span className="font-sans text-[0.65rem] text-muted-foreground leading-[1.7]">
                {p.description}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <Callout delay={0.5}>
          Six pioneers. One canon. One branch. No drift.
        </Callout>
      </Section>

      {/* ── SECTION 5 — The Method ──────────────────────────────────────── */}
      <Section id="the-method">
        <SectionHeader
          label="Section 05 — How It Is Built"
          title={
            <>
              The{" "}
              <span className="text-muted-foreground font-normal">Method</span>
            </>
          }
        />

        <Prose delay={0.1}>
          <p>
            This is not how most products with AI are built. The distinction is
            structural, not cosmetic:
          </p>
        </Prose>

        {/* Method points */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
          variants={fadeUp}
          className="my-8 space-y-4"
        >
          {[
            {
              n: "01",
              title: "Defined roles.",
              body: "Each agent in the system has a specific function. One opens the path. Another refines what was opened. Another polishes what was refined. They are not interchangeable — they are a sequence.",
            },
            {
              n: "02",
              title: "Formal handoffs.",
              body: "No agent passes work to the next without a formal handoff: what was done, what was not done, what comes next. Transitions are gated, not assumed.",
            },
            {
              n: "03",
              title: "Observable state.",
              body: "The state of the system is visible at all times. Any agent entering a new session reads the artefacts and knows precisely where the system stands. There is no context loss. There is no drift.",
            },
            {
              n: "04",
              title: "Quality by design.",
              body: "Each layer passes through structural refinement before it is closed. This is not manual review — it is architectural sequencing. Functional, then correct, then precise.",
            },
            {
              n: "05",
              title: "The system describes itself.",
              body: "The artefacts that govern the system are part of the repository. Anyone who reads the code reads the protocol. Transparency is a structural property, not a communication effort.",
            },
          ].map((item) => (
            <div
              key={item.n}
              className="atlas-glass-panel p-5 flex gap-5"
            >
              <span className="font-mono text-[0.58rem] tracking-[0.2em] text-primary flex-shrink-0 mt-0.5">
                {item.n}
              </span>
              <div>
                <span className="font-sans text-sm font-semibold text-foreground">
                  {item.title}{" "}
                </span>
                <span className="font-sans text-sm text-muted-foreground leading-[1.8]">
                  {item.body}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        <Callout delay={0.4}>
          Multiple agents. Defined roles. Formal handoffs. Observable state.
          Quality by design, not by review.
        </Callout>
      </Section>

      {/* ── SECTION 6 — The Vision + Call ───────────────────────────────── */}
      <Section id="the-vision" className="bg-card">
        <SectionHeader
          label="Section 06 — Direction"
          title={
            <>
              The Vision
            </>
          }
        />

        <Prose delay={0.1}>
          <p>
            Eternal Nexus will be a platform with active curation of
            information flow — not an aggregator, but a system with a genuine
            perspective on what is relevant and why. Structured. Precise.
            Opinionated in the right places.
          </p>
          <p>
            The operating system beneath it will mature into a replicable
            template: a governance framework for any founder who wants to build
            with multiple AI agents without surrendering control, quality, or
            identity over time.
          </p>
          <p>
            The ambition is not scale for its own sake. It is{" "}
            <strong className="text-foreground font-semibold">
              solidity that then grows.
            </strong>{" "}
            Solidity without growth is stagnation. Growth without solidity is
            collapse. The system exists to guarantee both, simultaneously.
          </p>
        </Prose>

        {/* Closing note */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.25}
          variants={fadeUp}
          className="mt-12 pt-10 border-t border-border"
        >
          <p className="font-sans text-sm text-muted-foreground leading-[1.9] mb-6">
            I am not selling an idea. I am building a system that demonstrates
            the idea. The code is open. The protocol is documented. The history
            is recorded.
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-[1.9]">
            If you arrive here and want to understand better — read everything.
            Form your own opinion.
          </p>
          <p className="font-serif text-base text-foreground mt-6 font-medium">
            — Ivan
          </p>
        </motion.div>

        {/* Document seal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
          variants={fadeIn}
          className="mt-12 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4"
        >
          <p className="font-mono text-[0.58rem] tracking-[0.15em] text-muted-foreground/50">
            FOUNDER VISION LAYER v2 — FVL-IMPL-001 — Eternal Nexus OS
          </p>
          <p className="font-mono text-[0.55rem] tracking-[0.12em] text-muted-foreground/30">
            2026-03-22 · @claude · claude-sonnet-4-6
          </p>
        </motion.div>
      </Section>
    </Layout>
  );
};

export default FounderPage;
