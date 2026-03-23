import { useEffect, useRef, useState } from "react";

const METRICS = [
  { end: 5, suffix: "", label: "MEGAPROJETOS" },
  { end: 7, suffix: "", label: "ÓRGÃOS NEXUS" },
  { end: 3, suffix: "", label: "FACES PRODUTO" },
  { end: 2, suffix: "", label: "ÂNCORAS GEO" },
] as const;

function CountCell({
  end,
  label,
  suffix,
}: {
  end: number;
  label: string;
  suffix: string;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        const dur = 1400;
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          const eased = 1 - (1 - t) ** 2;
          setN(Math.min(end, Math.round(end * eased)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-2xl tabular-nums text-teal md:text-3xl md:text-teal-light md:leading-none">
        {n}
        {suffix}
      </div>
      <div className="mt-1 font-mono text-[0.42rem] tracking-[0.18em] text-teal/90 md:text-[0.45rem]">{label}</div>
    </div>
  );
}

/** Mother phrase, count-up proof grid, canonical stamp — prop-free for Framer handoff. */
const HeroFirstProof = () => (
  <div className="relative z-10 mt-10 w-full max-w-3xl px-4 pb-8 text-center sm:px-6 md:pb-12">
    <p className="font-serif text-lg italic leading-relaxed text-primary/90 sm:text-xl md:text-2xl">
      Projetos para o Futuro — <span className="text-morabeza">com morabeza</span>
    </p>

    <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-8 md:max-w-none md:grid-cols-4 md:gap-6">
      {METRICS.map((m) => (
        <CountCell key={m.label} end={m.end} suffix={m.suffix} label={m.label} />
      ))}
    </div>

    <div
      className="mx-auto mt-10 inline-block border border-primary/35 bg-background/40 px-5 py-2.5 font-mono text-[0.42rem] tracking-[0.28em] text-muted-foreground backdrop-blur-sm"
      aria-hidden
    >
      NPI · CANONICAL PRODUCT FACE · HERO-v1
    </div>
  </div>
);

export default HeroFirstProof;
