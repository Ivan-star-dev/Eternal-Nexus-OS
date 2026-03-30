/**
 * HeroFirstProof.tsx
 * First evidence chamber after sovereign entry.
 * Editorial, restrained, unmistakably product-real.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const MOTHER_PHRASE =
  "Not a promise surface. A governing organism already in motion.";

interface ProofMetric {
  value: number;
  label: string;
  suffix?: string;
}

const PROOF_METRICS: ProofMetric[] = [
  { value: 10, label: "Versions Shipped" },
  { value: 3, label: "Sovereign Portals" },
  { value: 1, label: "Living Operating System" },
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
    <div ref={sectionRef} className="mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-8 flex items-center justify-center gap-4 sm:mb-10 sm:gap-5"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.1, duration: 1.0, ease: EASE }}
          className="block h-px origin-right"
          style={{
            width: "52px",
            background: "linear-gradient(to right, transparent, rgba(200,164,78,0.35))",
          }}
        />
        <span
          className="font-sans text-[8px] uppercase tracking-[0.34em] sm:text-[9px]"
          style={{ fontFamily: "Syne, system-ui, sans-serif", color: "rgba(200,164,78,0.5)" }}
        >
          First Evidence
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.1, duration: 1.0, ease: EASE }}
          className="block h-px origin-left"
          style={{
            width: "52px",
            background: "linear-gradient(to left, transparent, rgba(200,164,78,0.35))",
          }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 1.0, ease: EASE }}
        className="font-serif italic leading-[1.5]"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(20px, 4.8vw, 34px)",
          fontWeight: 300,
          color: "hsl(var(--rx-text-prime) / 0.86)",
          maxWidth: "760px",
          margin: "0 auto",
          letterSpacing: "-0.01em",
        }}
      >
        {MOTHER_PHRASE}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
        className="relative mt-10 overflow-hidden sm:mt-14"
        style={{
          padding: "34px 18px",
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.28) 0%, hsl(var(--background) / 0.44) 100%)",
          border: "0.5px solid hsl(42 78% 52% / 0.16)",
          boxShadow: "0 24px 80px -50px hsl(205 100% 52% / 0.35)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, hsl(42 78% 52% / 0.08) 0%, transparent 68%)",
          }}
        />
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: "rgba(200,164,78,0.25)" }} aria-hidden="true" />
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: "rgba(200,164,78,0.25)" }} aria-hidden="true" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: "rgba(200,164,78,0.25)" }} aria-hidden="true" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: "rgba(200,164,78,0.25)" }} aria-hidden="true" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8 md:gap-y-0">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-8 sm:mt-10"
      >
        <span
          className="font-mono text-[9px]"
          style={{
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.16em",
          }}
        >
          Eternal Nexus OS · v10 · Heaven Lab · 2026
        </span>
      </motion.div>
    </div>
  );
}
