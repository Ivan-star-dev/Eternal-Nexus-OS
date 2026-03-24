/**
 * HeroFirstProof.tsx
 * First proof strip — the moment the visitor knows the system is real.
 *
 * Canon: HEAVEN_LAB_REFERENCE_SURFACE.md — BLOCO 5 FIRST PROOF
 *   - One mother phrase (editorial, centered)
 *   - Live counters: real metrics, JetBrains Mono, teal
 *   - No superlatives. No adjectives. Number + real object.
 *   - Elegant, not loud. Not dense.
 *
 * Typography law (PRODUCT_FACE_TYPE):
 *   - Phrase: Cormorant Garamond 300 italic · 22px · centered · paper 0.75
 *   - Counter values: JetBrains Mono 400 · 28px+ · teal · tabular-nums
 *   - Counter labels: Syne 400 · 10px · tracking 0.2em · paper-dim
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// Mother phrase — one sentence that is evidence, not promise
const MOTHER_PHRASE =
  "Não é um produto que aguarda lançamento. É um sistema que já governa.";

interface ProofMetric {
  value: number;
  label: string;
  suffix?: string;
}

const PROOF_METRICS: ProofMetric[] = [
  { value: 9, label: "Versions Shipped" },
  { value: 6, label: "Pioneer Models" },
  { value: 47, label: "Modules Planned" },
  { value: 194, label: "Countries Indexed" },
];

// Count-up hook
function useCountUp(target: number, duration: number, active: boolean): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return count;
}

interface MetricCellProps {
  metric: ProofMetric;
  delay: number;
  active: boolean;
}

function MetricCell({ metric, delay, active }: MetricCellProps) {
  const count = useCountUp(metric.value, 1400, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className="flex flex-col items-center text-center"
    >
      <span
        className="font-mono text-[28px] font-[400] tabular-nums leading-none"
        style={{
          color: "hsl(172 48% 52%)",
          fontFamily: "JetBrains Mono, monospace",
          letterSpacing: "-0.02em",
        }}
      >
        {count}
        {metric.suffix ?? ""}
      </span>
      <span
        className="mt-2 font-sans text-[10px] font-[400] uppercase"
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.18em",
        }}
      >
        {metric.label}
      </span>
    </motion.div>
  );
}

export default function HeroFirstProof() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <div ref={sectionRef} className="max-w-4xl mx-auto text-center">
      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: EASE }}
        className="mx-auto mb-12 h-px origin-center"
        style={{
          width: "80px",
          background: "rgba(255,255,255,0.12)",
        }}
      />

      {/* Mother phrase */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.9, ease: EASE }}
        className="font-serif italic font-[300] leading-[1.65]"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(17px, 2.2vw, 22px)",
          color: "rgba(228,235,240,0.72)",
          maxWidth: "620px",
          margin: "0 auto",
        }}
      >
        {MOTHER_PHRASE}
      </motion.p>

      {/* Metrics row */}
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-0">
        {PROOF_METRICS.map((metric, i) => (
          <MetricCell
            key={metric.label}
            metric={metric}
            delay={0.08 * i}
            active={inView}
          />
        ))}
      </div>

      {/* Canonical reference — restrained link, not a CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-12"
      >
        <span
          className="font-mono text-[10px]"
          style={{
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.14em",
          }}
        >
          Eternal Nexus OS · v9 · Heaven Lab · 2026
        </span>
      </motion.div>
    </div>
  );
}
