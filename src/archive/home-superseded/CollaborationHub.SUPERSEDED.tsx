/**
 * CollaborationHub.tsx — V7 Collaboration Intelligence Preview
 * Locked teaser: shared labs, professor mode, silent collab, reputation by proof
 * sacred-flow: V7 | COLLABORATION_LAYER | 2026-03-23
 */

import { motion } from "framer-motion";
import { Users, GraduationCap, Eye, Award, LucideIcon } from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

interface FeatureCard {
  icon: LucideIcon;
  name: string;
  description: string;
}

interface Collaborator {
  initials: string;
  gradientFrom: string;
  gradientTo: string;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const FEATURES: FeatureCard[] = [
  {
    icon: Users,
    name: "SHARED LIVE LABS",
    description:
      "Co-author research in real time. Shared data, shared hypotheses, divergent perspectives.",
  },
  {
    icon: GraduationCap,
    name: "PROFESSOR MODE",
    description:
      "Lead structured investigations. Assign evidence trails, review hypotheses, grade reasoning.",
  },
  {
    icon: Eye,
    name: "SILENT COLLABORATION",
    description:
      "Follow another researcher's trail without interrupting. Learn by observation.",
  },
  {
    icon: Award,
    name: "REPUTATION BY PROOF",
    description:
      "Your standing is built on validated hypotheses and cited evidence — not follower count.",
  },
];

const COLLABORATORS: Collaborator[] = [
  { initials: "AR", gradientFrom: "#6366f1", gradientTo: "#8b5cf6" },
  { initials: "MO", gradientFrom: "#0ea5e9", gradientTo: "#6366f1" },
  { initials: "TK", gradientFrom: "#f59e0b", gradientTo: "#ef4444" },
  { initials: "LB", gradientFrom: "#10b981", gradientTo: "#0ea5e9" },
  { initials: "CF", gradientFrom: "#ec4899", gradientTo: "#8b5cf6" },
];

// ─── sub-components ───────────────────────────────────────────────────────────

function LockedCard({
  feature,
  index,
}: {
  feature: FeatureCard;
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group overflow-hidden rounded-sm
                 border border-white/[0.05] hover:border-white/[0.12]
                 bg-ink-medium/30 p-5
                 transition-colors duration-300"
    >
      {/* blur overlay — locked state */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ backdropFilter: "blur(1.5px)" }}
      />

      {/* card content — dimmed */}
      <div className="relative z-0 opacity-60">
        <div className="mb-4 flex items-center gap-2">
          <Icon
            size={18}
            strokeWidth={1.4}
            className="text-gold/60 shrink-0"
          />
          <span className="font-mono text-[0.6rem] tracking-[0.22em] text-paper-dim/70 uppercase">
            {feature.name}
          </span>
        </div>
        <p className="text-xs text-paper-dim/55 font-light leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* lock badge */}
      <div
        className="absolute top-3 right-3 z-20
                    font-mono text-[0.45rem] tracking-[0.18em]
                    text-paper-dim/30 uppercase border border-white/[0.06]
                    rounded-sm px-1.5 py-0.5"
      >
        LOCKED
      </div>
    </motion.div>
  );
}

function CollaboratorStrip() {
  return (
    <div className="flex items-center gap-4 py-4 px-1">
      {/* avatars */}
      <div className="flex items-center -space-x-2">
        {COLLABORATORS.map((c) => (
          <div
            key={c.initials}
            className="w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})`,
            }}
          >
            <span className="font-mono text-[0.42rem] tracking-widest text-white/90 font-medium">
              {c.initials}
            </span>
          </div>
        ))}
      </div>

      {/* pulse dot + label */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <span className="font-mono text-[0.55rem] tracking-[0.12em] text-paper-dim/50">
          3 researchers active now · São Paulo · London · Lagos
        </span>
      </div>
    </div>
  );
}

// ─── main export ──────────────────────────────────────────────────────────────

export default function CollaborationHub() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-t-2 border-t-gold/20
                 bg-ink-medium/40 border border-white/[0.05] rounded-sm
                 px-6 py-8 space-y-6"
    >
      {/* header row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.5rem] tracking-[0.28em] text-paper-dim/40 uppercase mb-2">
            COLLABORATION LAYER · V7
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-paper leading-tight">
            Research Together. Think in Parallel.
          </h2>
        </div>

        {/* coming badge */}
        <div
          className="shrink-0 self-start
                      font-mono text-[0.5rem] tracking-[0.22em] uppercase
                      border border-gold/20 text-gold/50
                      rounded-sm px-2.5 py-1"
        >
          COMING Q4 2026
        </div>
      </div>

      {/* subtitle */}
      <p className="text-sm text-paper-dim/70 font-light max-w-xl leading-relaxed">
        Shared live labs, professor-student workflows, silent collaboration, and
        reputation built by proof — not credentials.
      </p>

      {/* feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FEATURES.map((feature, index) => (
          <LockedCard key={feature.name} feature={feature} index={index} />
        ))}
      </div>

      {/* active collaborators strip */}
      <div className="border-t border-white/[0.04] border-b border-b-white/[0.04]">
        <CollaboratorStrip />
      </div>

      {/* section footer */}
      <p className="font-mono text-[0.48rem] tracking-[0.28em] text-paper-dim/30 uppercase text-center pt-1">
        NEXUS COLLABORATION ENGINE · MULTI-USER RESEARCH · REPUTATION PROTOCOL ·
        Q4 2026
      </p>
    </motion.section>
  );
}
