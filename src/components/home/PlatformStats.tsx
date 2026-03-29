/**
 * PlatformStats.tsx
 * Live-feeling platform activity stats strip — 8 stat cells, count-up on mount.
 * sacred-flow: PlatformStats | PLATFORM_ACTIVITY_1 | 2026-03-23
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCell {
  /** Numeric target (null = static display) */
  target: number | null;
  /** Static display value when count-up is not used */
  staticValue: string;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATS: StatCell[] = [
  { target: 194,  staticValue: "194",  label: "COUNTRIES INDEXED"  },
  { target: null, staticValue: "3.2B", label: "DATA POINTS"        },
  { target: 12,   staticValue: "12",   label: "LIVE INDICATORS"    },
  { target: 5,    staticValue: "5",    label: "ACTIVE HYPOTHESES"  },
  { target: 47,   staticValue: "47",   label: "MODULES PLANNED"    },
  { target: 9,    staticValue: "9",    label: "VERSIONS SHIPPED"   },
  { target: 6,    staticValue: "6",    label: "PIONEER MODELS"     },
  { target: null, staticValue: "∞",   label: "RESEARCH CYCLES"    },
];

const COUNT_UP_DURATION_MS = 1500;

// ─── Hook: useInView ──────────────────────────────────────────────────────────

function useInView(ref: React.RefObject<Element>, options?: IntersectionObserverInit): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);

  return inView;
}

// ─── Sub-component: AnimatedCount ────────────────────────────────────────────

interface AnimatedCountProps {
  target: number | null;
  staticValue: string;
  triggered: boolean;
}

function AnimatedCount({ target, staticValue, triggered }: AnimatedCountProps) {
  const [display, setDisplay] = useState<string>(target !== null ? "0" : staticValue);

  useEffect(() => {
    if (!triggered || target === null) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / COUNT_UP_DURATION_MS, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(String(current));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [triggered, target]);

  return (
    <span className="font-mono text-2xl md:text-3xl font-light text-paper tabular-nums">
      {display}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PlatformStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { threshold: 0.15 });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full border-y border-white/[0.04] py-10 px-6 md:px-16 bg-ink-medium/20"
    >
      {/* Label */}
      <p className="font-mono text-[0.45rem] tracking-[0.3em] text-gold/40 uppercase text-center mb-6">
        PLATFORM ACTIVITY · LIVE
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
        {STATS.map((stat, i) => {
          const isLast = i === STATS.length - 1;
          return (
            <div
              key={stat.label}
              className={[
                "flex flex-col items-center justify-center py-4 px-2",
                !isLast ? "border-r border-white/[0.04]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <AnimatedCount
                target={stat.target}
                staticValue={stat.staticValue}
                triggered={inView}
              />
              <span className="font-mono text-[0.42rem] tracking-[0.22em] uppercase text-paper-dim/35 mt-1 text-center">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
