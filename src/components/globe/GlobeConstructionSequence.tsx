// Sequência de construção procedural do globo — Amazon-style layered build
// Fluxo sagrado: Atlas absorve camadas uma a uma antes de revelar o organismo vivo
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = [
  { label: "OCEAN SHELL", duration: 800 },
  { label: "CONTINENT GRID", duration: 800 },
  { label: "DATA HOTSPOTS", duration: 800 },
  { label: "PARTICLE FIELD", duration: 600 },
];

const TOTAL_DURATION = PHASES.reduce((sum, p) => sum + p.duration, 0);

interface GlobeConstructionSequenceProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

export default function GlobeConstructionSequence({ children, onComplete }: GlobeConstructionSequenceProps) {
  const [phase, setPhase] = useState(0);
  const [complete, setComplete] = useState(false);
  const [shouldSkip, setShouldSkip] = useState(false);

  // Play only once per session
  useEffect(() => {
    if (sessionStorage.getItem("globe-constructed")) {
      setShouldSkip(true);
      setComplete(true);
    }
  }, []);

  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      const next = prev + 1;
      if (next >= PHASES.length) {
        setTimeout(() => {
          setComplete(true);
          sessionStorage.setItem("globe-constructed", "1");
          onComplete?.();
        }, 400);
        return prev;
      }
      return next;
    });
  }, [onComplete]);

  useEffect(() => {
    if (shouldSkip || complete) return;
    const timer = setTimeout(advancePhase, PHASES[phase].duration);
    return () => clearTimeout(timer);
  }, [phase, shouldSkip, complete, advancePhase]);

  // Check reduced motion
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (shouldSkip || prefersReduced) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Globe content — fades in progressively */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: complete ? 1 : 0.15 + (phase / PHASES.length) * 0.6,
          scale: complete ? 1 : 0.92 + (phase / PHASES.length) * 0.06,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      {/* Construction overlay */}
      <AnimatePresence>
        {!complete && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Phase indicator */}
            <div className="flex flex-col items-center gap-4">
              {/* Progress ring */}
              <svg width="64" height="64" viewBox="0 0 64 64" className="mb-2">
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="hsl(var(--gold-dim))"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <motion.circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="hsl(var(--gold))"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={176}
                  initial={{ strokeDashoffset: 176 }}
                  animate={{ strokeDashoffset: 176 - (176 * ((phase + 1) / PHASES.length)) }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                />
              </svg>

              {/* Phase label */}
              <motion.span
                key={phase}
                className="font-mono text-[0.55rem] tracking-[0.3em] text-primary"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                BUILDING LAYER {phase + 1}/{PHASES.length}
              </motion.span>

              <motion.span
                key={`label-${phase}`}
                className="font-mono text-[0.48rem] tracking-[0.2em] text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                {PHASES[phase].label}
              </motion.span>

              {/* Phase dots */}
              <div className="flex gap-2 mt-2">
                {PHASES.map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: i <= phase
                        ? "hsl(var(--gold))"
                        : "hsl(var(--muted-foreground))",
                    }}
                    animate={{
                      scale: i === phase ? [1, 1.4, 1] : 1,
                      opacity: i <= phase ? 1 : 0.3,
                    }}
                    transition={{
                      scale: { duration: 0.8, repeat: Infinity },
                      opacity: { duration: 0.3 },
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
