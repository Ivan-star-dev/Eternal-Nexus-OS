/**
 * ManifestoSection.tsx — V9 Category Definition
 * The manifesto: cinematic typography, category power, three pillars
 * sacred-flow: V9 | CATEGORY_DEFINITION | 2026-03-23
 */

import { motion } from "framer-motion";

// ─── types ────────────────────────────────────────────────────────────────────

interface Pillar {
  number: string;
  title: string;
  body: string;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const PILLARS: Pillar[] = [
  {
    number: "01",
    title: "Scientific Rigour",
    body: "Every claim traces to evidence. Every model exposes its assumptions. We do not present opinions as facts.",
  },
  {
    number: "02",
    title: "Canonical Identity",
    body: "One system of truth. Shared protocols, shared vocabulary, shared DNA. No drift. No contradiction. No duplication.",
  },
  {
    number: "03",
    title: "World Scale",
    body: "Built for São Paulo, Lagos, Oslo, and Mumbai simultaneously. No single frame. No default country. The world is the canvas.",
  },
];

const HEADLINE_LINES = [
  { text: "This is not a dashboard.", dim: true, delay: 0 },
  { text: "This is not a data tool.", dim: true, delay: 0.15 },
  { text: "This is a world operating system.", dim: false, delay: 0.3 },
];

// ─── animation variants ───────────────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

const lineVariants = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  },
});

const pillarVariants = (delay: number) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  },
});

const quoteVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.5, ease: "easeOut" },
  },
};

// ─── component ────────────────────────────────────────────────────────────────

export function ManifestoSection() {
  return (
    <motion.section
      className="relative w-full bg-ink-deep py-32 px-6 md:px-16 lg:px-20 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* Subtle grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* ── Eyebrow label ─────────────────────────────────────────────── */}
        <p className="font-mono text-[0.45rem] tracking-[0.35em] text-gold/40 uppercase text-center mb-16">
          V9 · Category Definition
        </p>

        {/* ── Main headline ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-2 mb-16">
          {HEADLINE_LINES.map(({ text, dim, delay }) => (
            <motion.h2
              key={text}
              className={[
                "font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-tight",
                dim ? "text-paper/60" : "text-paper",
              ].join(" ")}
              variants={lineVariants(delay)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {dim ? (
                text
              ) : (
                <span className="relative inline-block">
                  {text}
                  {/* Gold underline decoration */}
                  <span
                    className="absolute left-0 -bottom-1 h-px w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.6) 35%, hsl(var(--gold) / 0.6) 65%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                </span>
              )}
            </motion.h2>
          ))}
        </div>

        {/* ── Horizontal divider ────────────────────────────────────────── */}
        <div className="border-t border-white/[0.06] my-12" />

        {/* ── Three pillars ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-20">
          {PILLARS.map(({ number, title, body }, index) => (
            <motion.div
              key={number}
              className="flex flex-col"
              variants={pillarVariants(index * 0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="font-mono text-[2rem] font-light text-gold/30 leading-none">
                {number}
              </span>
              <span className="font-mono text-[0.55rem] tracking-[0.25em] uppercase text-paper/80 mt-2 mb-4">
                {title}
              </span>
              <p className="font-serif text-sm text-paper-dim/60 italic leading-relaxed">
                "{body}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Horizontal divider ────────────────────────────────────────── */}
        <div className="border-t border-white/[0.06] my-12" />

        {/* ── Quote block ───────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col items-center gap-4"
          variants={quoteVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <blockquote className="font-serif text-xl md:text-2xl text-paper/70 italic text-center max-w-2xl mx-auto leading-relaxed">
            "The world does not need another analytics platform.
            <br />
            It needs a place to think."
          </blockquote>
          <p className="font-mono text-[0.45rem] tracking-[0.25em] text-gold/40 uppercase">
            — Eternal Nexus OS, 2026
          </p>
        </motion.div>

        {/* ── Bottom section footer ─────────────────────────────────────── */}
        <p className="font-mono text-[0.45rem] tracking-[0.3em] text-paper-dim/20 uppercase text-center mt-20">
          Eternal Nexus OS · World Operating System · Est. 2026 · Next Path
          Infrastructure Authority
        </p>
      </div>
    </motion.section>
  );
}

export default ManifestoSection;
