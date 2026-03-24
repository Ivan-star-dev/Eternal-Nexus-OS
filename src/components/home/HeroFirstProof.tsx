import { useEffect, useRef, useState } from "react";

const METRICS = [
  { end: 5, label: "MEGAPROJETOS" },
  { end: 7, label: "ÓRGÃOS NEXUS" },
  { end: 3, label: "FACES PRODUTO" },
  { end: 2, label: "ÂNCORAS GEO" },
] as const;

function CountCell({ end, label }: { end: number; label: string }) {
  // Initial display at 60% of end — instrument calibrating to final reading, not counting from zero.
  // useState is seeded once on mount; the effect drives all subsequent updates.
  const [n, setN] = useState(() => Math.floor(end * 0.6));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Compute start inside the effect so the closure always sees the current `end`
    // value, and `start` is not a separate reactive dependency.
    const start = Math.floor(end * 0.6);
    let rafId = 0;
    let started = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        obs.disconnect();
        const dur = 1800;
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          // Cubic ease-out: rapid acquisition, slow precise settling
          const eased = 1 - (1 - t) ** 3;
          setN(Math.min(end, Math.round(start + (end - start) * eased)));
          if (t < 1) rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      {/* Number: foreground, carved — the reading itself */}
      <div className="font-mono text-[2.6rem] leading-none tabular-nums text-foreground/88 md:text-[3.4rem]">
        {n}
      </div>
      {/* Label: teal annotation — the instrument name */}
      <div className="mt-2.5 font-mono text-[0.4rem] tracking-[0.28em] text-teal/65 md:text-[0.42rem]">
        {label}
      </div>
    </div>
  );
}

/** Mother phrase + instrument readings + canonical stamp — prop-free for Framer handoff. */
const HeroFirstProof = () => (
  <div className="relative z-10 mt-14 w-full max-w-3xl px-4 pb-12 text-center sm:px-6 md:mt-20 md:pb-20">
    {/* Mother phrase — quiet, certain */}
    <p className="font-serif text-base italic leading-relaxed text-primary/68 sm:text-lg md:text-xl">
      Projetos para o Futuro — <span className="text-morabeza">com morabeza</span>
    </p>

    {/* Separator */}
    <div className="mx-auto mt-8 h-px w-10 bg-border/35" />

    {/* Instrument readings — large, carved, inevitable */}
    <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-10 md:max-w-none md:grid-cols-4 md:gap-x-4 md:gap-y-0">
      {METRICS.map((m) => (
        <CountCell key={m.label} end={m.end} label={m.label} />
      ))}
    </div>

    {/* Canonical stamp — watermark opacity, no border */}
    <div
      className="mx-auto mt-16 font-mono text-[0.36rem] tracking-[0.38em] text-foreground/[0.12]"
      aria-hidden
    >
      NPI · CANONICAL PRODUCT FACE · HERO-v1
    </div>
  </div>
);

export default HeroFirstProof;
