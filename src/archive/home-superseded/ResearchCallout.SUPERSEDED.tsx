/**
 * ResearchCallout.tsx — Methodology callout block
 * Full-width featured block explaining how research works.
 * sacred-flow: WorkFunction | methodology-pillar | 2026-03-23
 */

// ─── types ────────────────────────────────────────────────────────────────────

interface MethodologyPillar {
  number: string;
  title: string;
  description: string;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const PILLARS: MethodologyPillar[] = [
  {
    number: "01",
    title: "SOURCE FIRST",
    description: "Every data point links to a primary source.",
  },
  {
    number: "02",
    title: "MODEL TRANSPARENCY",
    description: "Every model exposes its assumptions.",
  },
  {
    number: "03",
    title: "CONTINUOUS REVISION",
    description: "Truth is updated when evidence demands it.",
  },
];

const CYCLE_STEPS = ["OBSERVE", "HYPOTHESIZE", "TEST", "EVIDENCE", "VALIDATE"];

// ─── component ────────────────────────────────────────────────────────────────

export function ResearchCallout() {
  return (
    <section className="w-full bg-ink-medium/30 border border-white/[0.05] rounded-sm py-16 px-8 md:px-16">
      {/* Eyebrow label */}
      <p className="font-mono text-[0.45rem] tracking-[0.35em] text-gold/40 uppercase mb-10">
        METHODOLOGY · HOW WE WORK
      </p>

      <div className="flex flex-col md:flex-row gap-12 md:gap-0">
        {/* ── Left side (60%) ─────────────────────────────────────────────── */}
        <div className="md:w-[60%] md:pr-12 flex flex-col gap-10">
          {/* Main quote */}
          <blockquote className="font-serif text-2xl md:text-3xl font-light text-paper/80 leading-snug italic">
            "Evidence before opinion.
            <br />
            Data before narrative.
            <br />
            Proof before claim."
          </blockquote>

          {/* Methodology pillars */}
          <div className="flex flex-col gap-4">
            {PILLARS.map(({ number, title, description }) => (
              <div key={number} className="flex items-start gap-3">
                <span className="font-mono text-[0.48rem] tracking-[0.18em] uppercase text-paper-dim/60 shrink-0 pt-px">
                  {number} · {title}
                </span>
                <span className="font-mono text-[0.48rem] tracking-[0.18em] uppercase text-paper-dim/60">
                  — &quot;{description}&quot;
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right side (40%) ────────────────────────────────────────────── */}
        <div className="md:w-[40%] flex flex-col justify-center items-start md:items-center gap-6">
          {/* Live research cycle label */}
          <p className="font-mono text-[0.45rem] tracking-[0.3em] uppercase text-paper-dim/30">
            LIVE RESEARCH CYCLE
          </p>

          {/* ASCII-style cycle diagram */}
          <div className="flex flex-col gap-2">
            {CYCLE_STEPS.map((step, index) => (
              <div key={step} className="flex flex-col items-start">
                <span className="font-mono text-[0.5rem] tracking-[0.15em] text-gold/50 uppercase">
                  {step}
                </span>
                {index < CYCLE_STEPS.length - 1 && (
                  <span
                    className="font-mono text-[0.5rem] tracking-[0.15em] text-gold/30 ml-2"
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Inline horizontal variant for wide viewports */}
          <p className="hidden lg:block font-mono text-[0.5rem] tracking-[0.15em] text-gold/50 mt-2">
            {CYCLE_STEPS.join(" → ")}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ResearchCallout;
