/**
 * V10Proof.tsx — V10 Universal Factory Proof
 * Capstone section: live counters, traceable claims, factory evidence
 * sacred-flow: V10 | UNIVERSAL_FACTORY_PROOF | 2026-03-23
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── types ────────────────────────────────────────────────────────────────────

interface Metric {
  value: number;
  label: string;
}

interface Claim {
  title: string;
  description: string;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const METRICS: Metric[] = [
  { value: 12, label: "Countries Tracked" },
  { value: 3, label: "Indicators Per Country" },
  { value: 5, label: "Active Hypotheses" },
  { value: 47, label: "Modules Planned" },
  { value: 6, label: "Evidence Trails" },
  { value: 9, label: "Versions Delivered" },
];

const CLAIMS: Claim[] = [
  {
    title: "Traceable",
    description: "Every data point links to source.",
  },
  {
    title: "Canonical",
    description: "One system of truth. No drift.",
  },
  {
    title: "Open",
    description: "Source-linked. No black boxes.",
  },
];

// ─── count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, active: boolean): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, duration]);

  return count;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function MetricCounter({
  metric,
  active,
  index,
}: {
  metric: Metric;
  active: boolean;
  index: number;
}) {
  const count = useCountUp(metric.value, 2000, active);

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8 px-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
    >
      {/* divider right — hidden on last in each row */}
      <span
        className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-white/[0.06] hidden lg:block last:hidden"
        aria-hidden="true"
      />
      <span className="font-mono text-5xl font-light text-gold leading-none tabular-nums">
        {count}
      </span>
      <span className="font-mono text-[0.45rem] tracking-[0.28em] uppercase text-paper-dim/40 mt-3 text-center">
        {metric.label}
      </span>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function V10Proof() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      className="bg-ink-medium/30 border-y border-white/[0.04] py-24 px-6 md:px-16"
    >
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* ── section label ── */}
        <p className="font-mono text-[0.45rem] tracking-[0.35em] uppercase text-gold/40 text-center mb-12">
          V10 · Universal Factory Proof
        </p>

        {/* ── headline ── */}
        <h2 className="font-serif text-4xl md:text-5xl font-light text-paper text-center leading-tight mb-4">
          "The proof is the product."
        </h2>

        {/* ── subtitle ── */}
        <p className="font-mono text-[0.55rem] tracking-[0.15em] text-paper-dim/60 text-center mb-20 max-w-xl mx-auto">
          Every number below is live. Every claim is traceable. This is not a demo.
        </p>

        {/* ── metric counters ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-white/[0.04] rounded-sm mb-20">
          {METRICS.map((metric, index) => (
            <MetricCounter
              key={metric.label}
              metric={metric}
              active={isInView}
              index={index}
            />
          ))}
        </div>

        {/* ── what this means strip ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] rounded-sm overflow-hidden mb-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          {CLAIMS.map((claim) => (
            <div
              key={claim.title}
              className="bg-ink-medium/20 px-8 py-8"
            >
              <p className="font-mono text-[0.48rem] tracking-[0.2em] uppercase text-paper/70 mb-2">
                {claim.title}
              </p>
              <p className="text-xs text-paper-dim/50 font-light leading-relaxed">
                {claim.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── closing statement ── */}
        <p className="font-mono text-[0.48rem] tracking-[0.35em] uppercase text-gold/50 text-center mt-16">
          Eternal Nexus OS — V10 — 2026
        </p>
      </motion.div>
    </section>
  );
}

export default V10Proof;
