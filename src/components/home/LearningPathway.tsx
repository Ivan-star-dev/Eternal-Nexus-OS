/**
 * LearningPathway.tsx — V6 Learning & Mastery Preview
 * Locked teaser: 8 tracks, mastery grid, Q3 2026
 * sacred-flow: V6 | LEARNING_LAYER | 2026-03-23
 */

import { motion } from "framer-motion";
import {
  TrendingUp,
  Globe,
  Wind,
  Zap,
  Users,
  BarChart2,
  Building2,
  Database,
  Lock,
  LucideIcon,
} from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Track {
  icon: LucideIcon;
  name: string;
  description: string;
  modules: number;
  difficulty: Difficulty;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const TRACKS: Track[] = [
  {
    icon: TrendingUp,
    name: "GLOBAL ECONOMICS",
    description: "Monetary systems, trade flows, and economic complexity",
    modules: 8,
    difficulty: "Intermediate",
  },
  {
    icon: Globe,
    name: "GEOPOLITICAL THEORY",
    description: "Power structures, alliance formations, conflict resolution",
    modules: 6,
    difficulty: "Advanced",
  },
  {
    icon: Wind,
    name: "CLIMATE SYSTEMS",
    description: "Tipping points, carbon cycles, and intervention models",
    modules: 7,
    difficulty: "Intermediate",
  },
  {
    icon: Zap,
    name: "INNOVATION DYNAMICS",
    description: "Technology diffusion, disruption theory, R&D economics",
    modules: 5,
    difficulty: "Beginner",
  },
  {
    icon: Users,
    name: "DEMOGRAPHIC TRENDS",
    description: "Population shifts, urbanisation, and social mobility",
    modules: 6,
    difficulty: "Beginner",
  },
  {
    icon: BarChart2,
    name: "FINANCIAL MARKETS",
    description: "Asset pricing, systemic risk, and capital allocation",
    modules: 9,
    difficulty: "Advanced",
  },
  {
    icon: Building2,
    name: "INSTITUTIONAL DESIGN",
    description: "Governance, rule of law, institutional efficiency",
    modules: 5,
    difficulty: "Intermediate",
  },
  {
    icon: Database,
    name: "DATA & EVIDENCE",
    description: "Statistical thinking, research methods, causal inference",
    modules: 6,
    difficulty: "Intermediate",
  },
];

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Beginner: "text-emerald-400/70",
  Intermediate: "text-blue-400/70",
  Advanced: "text-gold/70",
};

// ─── sub-components ───────────────────────────────────────────────────────────

interface TrackCardProps {
  track: Track;
  index: number;
}

function TrackCard({ track, index }: TrackCardProps) {
  const Icon = track.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="relative bg-ink-medium/40 border border-white/[0.05] rounded-sm p-5 hover:border-gold/20 hover:bg-ink-medium/60 transition-all duration-300 backdrop-blur-sm overflow-hidden"
    >
      {/* Card content */}
      <Icon className="w-5 h-5 text-paper/40" />

      <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/80 mt-3 mb-2">
        {track.name}
      </p>

      <p className="text-xs text-paper-dim/60 font-light leading-relaxed">
        {track.description}
      </p>

      {/* Progress bar — locked */}
      <div className="w-full h-0.5 bg-white/[0.05] rounded-full mt-4" />

      {/* Module count + difficulty */}
      <p className="font-mono text-[0.45rem] tracking-[0.15em] mt-2">
        <span className="text-paper-dim/40">{track.modules} MODULES · </span>
        <span className={DIFFICULTY_COLOR[track.difficulty]}>
          {track.difficulty.toUpperCase()}
        </span>
      </p>

      {/* Locked overlay */}
      <motion.div
        animate={{ opacity: [0.7, 0.9, 0.7] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute inset-0 bg-ink-dark/50 backdrop-blur-[1px] flex items-center justify-center"
      >
        <Lock className="w-4 h-4 text-gold/30" />
      </motion.div>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function LearningPathway() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-20 px-6 md:px-12"
    >
      {/* Section header */}
      <div className="mb-10">
        {/* Label row */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-[0.48rem] tracking-[0.28em] uppercase text-paper-dim/40">
            LEARNING PATHWAY · V6
          </span>
          <span className="font-mono text-[0.48rem] tracking-[0.18em] uppercase border border-gold/30 text-gold/70 px-3 py-1 rounded-sm">
            COMING Q3 2026
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl md:text-4xl font-light text-paper mb-3">
          Master the World System
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-paper-dim/70 font-light max-w-xl">
          Structured learning across economics, geopolitics, climate dynamics,
          and innovation theory. Built for researchers, analysts, and curious
          minds.
        </p>
      </div>

      {/* Track grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TRACKS.map((track, index) => (
          <TrackCard key={track.name} track={track} index={index} />
        ))}
      </div>

      {/* Section footer */}
      <p className="font-mono text-[0.48rem] tracking-[0.28em] text-paper-dim/30 uppercase text-center mt-12">
        NEXUS LEARNING ENGINE · 47 MODULES PLANNED · 8 TRACKS · Q3 2026
      </p>
    </motion.section>
  );
}
