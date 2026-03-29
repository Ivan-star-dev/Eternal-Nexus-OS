/**
 * RoadmapTimeline.tsx — V1→V10 Visual Progress Roadmap
 * Ten phases, one canonical DNA. Staggered entrance, status indicators.
 * sacred-flow: WorkStructure | ROADMAP | 2026-03-23
 */

import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type PhaseStatus = "COMPLETE" | "IN_PROGRESS" | "PLANNED" | "ACTIVE";

interface Phase {
  version: string;
  name: string;
  description: string;
  status: PhaseStatus;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PHASES: Phase[] = [
  {
    version: "V1",
    name: "FOUNDATION",
    description: "Branch discipline, protocols, canonical base",
    status: "COMPLETE",
  },
  {
    version: "V2",
    name: "FUNCTIONAL COHERENCE",
    description: "Core flows, features, basic interaction",
    status: "COMPLETE",
  },
  {
    version: "V3",
    name: "FLAGSHIP SURFACE",
    description: "Design command, visual hierarchy, motion",
    status: "COMPLETE",
  },
  {
    version: "V4",
    name: "LIVING WORLD",
    description: "Real data, globe, comparative view, world pulse",
    status: "COMPLETE",
  },
  {
    version: "V5",
    name: "RESEARCH CORE",
    description: "Hypothesis engine, evidence trails, open questions",
    status: "COMPLETE",
  },
  {
    version: "V6",
    name: "LEARNING & MASTERY",
    description: "Guided labs, mastery map, AI tutor",
    status: "IN_PROGRESS",
  },
  {
    version: "V7",
    name: "COLLABORATION",
    description: "Shared labs, professor mode, reputation",
    status: "PLANNED",
  },
  {
    version: "V8",
    name: "ECOSYSTEM",
    description: "Product convergence, shared DNA, Neural Mesh",
    status: "PLANNED",
  },
  {
    version: "V9",
    name: "CATEGORY POWER",
    description: "World-class presence, manifesto, award contender",
    status: "COMPLETE",
  },
  {
    version: "V10",
    name: "UNIVERSAL PROOF",
    description: "The product proves itself. No demo needed.",
    status: "ACTIVE",
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  nameColor: string;
  badgeCls: string;
  dotCls: string;
  pulse: boolean;
  ring: boolean;
}

const STATUS_CONFIG: Record<PhaseStatus, StatusConfig> = {
  COMPLETE: {
    label: "COMPLETE ✓",
    nameColor: "text-emerald-400",
    badgeCls: "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400",
    dotCls: "bg-emerald-400",
    pulse: false,
    ring: false,
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    nameColor: "text-gold",
    badgeCls: "bg-gold/10 border border-gold/30 text-gold",
    dotCls: "bg-gold",
    pulse: true,
    ring: false,
  },
  PLANNED: {
    label: "PLANNED",
    nameColor: "text-paper-dim/40",
    badgeCls:
      "bg-white/[0.03] border border-white/[0.06] text-paper-dim/40",
    dotCls: "bg-white/20",
    pulse: false,
    ring: false,
  },
  ACTIVE: {
    label: "ACTIVE",
    nameColor: "text-gold",
    badgeCls: "bg-gold/20 border border-gold/50 text-gold",
    dotCls: "bg-gold",
    pulse: false,
    ring: true,
  },
};

// ─── PhaseNode ────────────────────────────────────────────────────────────────

interface PhaseNodeProps {
  phase: Phase;
  index: number;
  isLast: boolean;
}

function PhaseNode({ phase, index, isLast }: PhaseNodeProps) {
  const cfg = STATUS_CONFIG[phase.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className="relative flex flex-col items-center"
    >
      {/* ── Desktop connector line (left side, before node) ── */}
      {index > 0 && (
        <div className="hidden lg:block absolute top-[1.35rem] right-full w-full border-t border-white/[0.06]" />
      )}

      {/* ── Mobile connector line (top, before node) ── */}
      {index > 0 && (
        <div className="lg:hidden absolute bottom-full left-1/2 -translate-x-1/2 h-6 border-l border-white/[0.06]" />
      )}

      {/* ── Node card ── */}
      <div
        className={[
          "relative flex flex-col gap-2 p-3 rounded-lg w-full max-w-[140px] lg:max-w-[120px] xl:max-w-[130px]",
          "bg-white/[0.02] border transition-colors duration-300",
          phase.status === "ACTIVE"
            ? "border-gold/30 shadow-[0_0_16px_rgba(var(--gold-rgb),0.08)]"
            : phase.status === "IN_PROGRESS"
            ? "border-gold/20"
            : phase.status === "COMPLETE"
            ? "border-emerald-500/20"
            : "border-white/[0.06]",
        ].join(" ")}
      >
        {/* Version label */}
        <span className="font-mono text-[0.48rem] tracking-[0.2em] text-gold/50 uppercase leading-none">
          {phase.version}
        </span>

        {/* Phase name */}
        <span
          className={[
            "font-mono text-[0.55rem] tracking-[0.15em] uppercase leading-tight",
            cfg.nameColor,
          ].join(" ")}
        >
          {phase.name}
        </span>

        {/* Description */}
        <p className="font-mono text-[0.44rem] tracking-[0.05em] text-paper-dim/40 leading-relaxed">
          {phase.description}
        </p>

        {/* Status badge */}
        <div
          className={[
            "flex items-center gap-1 self-start px-1.5 py-0.5 rounded-sm",
            cfg.badgeCls,
          ].join(" ")}
        >
          {/* Status dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            {cfg.pulse && (
              <span
                className={[
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  cfg.dotCls,
                ].join(" ")}
              />
            )}
            {cfg.ring && (
              <span
                className={[
                  "absolute -inset-0.5 rounded-full border border-gold/60 animate-pulse",
                ].join(" ")}
              />
            )}
            <span
              className={[
                "relative inline-flex rounded-full h-1.5 w-1.5",
                cfg.dotCls,
              ].join(" ")}
            />
          </span>

          <span className="font-mono text-[0.42rem] tracking-[0.15em] uppercase leading-none">
            {cfg.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── RoadmapTimeline ──────────────────────────────────────────────────────────

export default function RoadmapTimeline() {
  return (
    <section className="relative w-full py-20 px-4 overflow-hidden">
      {/* Background grain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(var(--gold-rgb),0.04),transparent)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 items-center text-center"
        >
          <span className="font-mono text-[0.5rem] tracking-[0.35em] text-gold/60 uppercase">
            PRODUCT ROADMAP · V1 → V10
          </span>
          <p className="font-mono text-[0.6rem] tracking-[0.1em] text-paper-dim/50 italic">
            &ldquo;Ten versions. One destination. Every phase builds on the last.&rdquo;
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-gold/20 mt-1" />
        </motion.div>

        {/* ── Mobile layout: vertical stack ── */}
        <div className="lg:hidden flex flex-col items-center gap-6 pt-2">
          {PHASES.map((phase, index) => (
            <PhaseNode
              key={phase.version}
              phase={phase}
              index={index}
              isLast={index === PHASES.length - 1}
            />
          ))}
        </div>

        {/* ── Desktop layout: horizontal scroll strip ── */}
        <div className="hidden lg:block w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <div className="flex flex-row items-start gap-0 min-w-max px-2">
            {PHASES.map((phase, index) => (
              <div key={phase.version} className="relative flex items-start">
                {/* Connector line between nodes */}
                {index > 0 && (
                  <div className="w-4 xl:w-6 border-t border-white/[0.06] mt-[1.35rem] shrink-0" />
                )}
                <PhaseNode
                  phase={phase}
                  index={index}
                  isLast={index === PHASES.length - 1}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Progress bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col gap-2"
        >
          <div className="flex justify-between font-mono text-[0.44rem] tracking-[0.15em] text-paper-dim/30 uppercase">
            <span>V1</span>
            <span>V10</span>
          </div>
          <div className="relative h-px w-full bg-white/[0.06] rounded-full overflow-visible">
            {/* Completed fill */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 origin-left rounded-full"
              style={{ width: "90%", background: "linear-gradient(90deg, hsl(var(--gold)/0.6), hsl(var(--gold)/0.15))" }}
            />
            {/* Active pulse marker */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(var(--gold-rgb),0.8)] -translate-x-1/2"
              style={{ left: "90%" }}
            />
          </div>
          <div className="flex justify-between font-mono text-[0.44rem] tracking-[0.12em] text-paper-dim/30">
            <span>COMPLETE</span>
            <span>DESTINATION</span>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <span className="font-mono text-[0.42rem] tracking-[0.3em] text-paper-dim/25 uppercase">
            V1 → V10 · ETERNAL NEXUS OS · 10 PHASES · 1 CANONICAL DNA
          </span>
        </motion.div>
      </div>
    </section>
  );
}
