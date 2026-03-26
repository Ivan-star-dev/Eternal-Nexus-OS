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
  const count = useCountUp(metric.value, 1600, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: EASE }}
      className="flex flex-col items-center text-center"
    >
      <span
        className="font-mono tabular-nums leading-none"
        style={{
          fontSize: "clamp(32px, 3.5vw, 44px)",
          fontWeight: 400,
          color: "hsl(172 52% 58%)",
          fontFamily: "JetBrains Mono, monospace",
          letterSpacing: "-0.03em",
          textShadow: "0 0 32px hsl(172 52% 58% / 0.25)",
        }}
      >
        {count}
        {metric.suffix ?? ""}
      </span>
      <span
        className="mt-3 uppercase"
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "9px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.32)",
          letterSpacing: "0.22em",
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
          fontSize: "clamp(22px, 3vw, 32px)",
          fontWeight: 300,
          color: "rgba(228,238,248,0.85)",
          maxWidth: "680px",
          margin: "0 auto",
          lineHeight: 1.65,
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
          padding: "44px 40px",
          background: "linear-gradient(135deg, rgba(200,164,78,0.04) 0%, rgba(26,107,90,0.035) 100%)",
          border: "0.5px solid rgba(200,164,78,0.15)",
          boxShadow: "0 0 60px rgba(200,164,78,0.04), inset 0 0 40px rgba(26,107,90,0.03)",
          backdropFilter: "blur(4px)",
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
