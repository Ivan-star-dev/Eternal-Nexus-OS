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
    <div ref={sectionRef} className="max-w-3xl mx-auto text-center">
      {/* Orbital label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-10 flex items-center justify-center gap-5"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.1, duration: 1.0, ease: EASE }}
          className="block h-px origin-right"
          style={{
            width: "56px",
            background: "linear-gradient(to right, transparent, rgba(200,164,78,0.35))",
          }}
        />
        <span
          className="font-sans text-[9px] uppercase tracking-[0.32em]"
          style={{ fontFamily: "Syne, system-ui, sans-serif", color: "rgba(200,164,78,0.5)" }}
        >
          Primeira prova
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.1, duration: 1.0, ease: EASE }}
          className="block h-px origin-left"
          style={{
            width: "56px",
            background: "linear-gradient(to left, transparent, rgba(200,164,78,0.35))",
          }}
        />
      </motion.div>

      {/* Mother phrase — larger, more present */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 1.0, ease: EASE }}
        className="font-serif italic leading-[1.7]"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(19px, 2.5vw, 26px)",
          fontWeight: 300,
          color: "rgba(228,235,240,0.8)",
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        {MOTHER_PHRASE}
      </motion.p>

      {/* Metrics row — inside a dignified container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
        className="mt-14 relative"
        style={{
          padding: "40px 32px",
          background: "linear-gradient(135deg, rgba(200,164,78,0.025) 0%, rgba(26,107,90,0.025) 100%)",
          border: "0.5px solid rgba(200,164,78,0.1)",
        }}
      >
        {/* Corner marks */}
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: "rgba(200,164,78,0.25)" }} aria-hidden="true" />
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: "rgba(200,164,78,0.25)" }} aria-hidden="true" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: "rgba(200,164,78,0.25)" }} aria-hidden="true" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: "rgba(200,164,78,0.25)" }} aria-hidden="true" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-0">
          {PROOF_METRICS.map((metric, i) => (
            <MetricCell
              key={metric.label}
              metric={metric}
              delay={0.1 * i}
              active={inView}
            />
          ))}
        </div>
      </motion.div>

      {/* Canonical reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-10"
      >
        <span
          className="font-mono text-[9px]"
          style={{
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.16em",
          }}
        >
          Eternal Nexus OS · v9 · Heaven Lab · 2026
        </span>
      </motion.div>
    </div>
  );
}
