/**
 * PersonalLens.tsx — V13 Personalized World Model
 * Full page for the user's personal research workspace.
 * sacred-flow: WorkFunction | personal-lens-pillar | 2026-03-23
 */

// ─── types ────────────────────────────────────────────────────────────────────

interface Hypothesis {
  id: number;
  text: string;
  confidence: number;
  status: "Active" | "Testing" | "Validated" | "Rejected";
}

interface TrailItem {
  id: number;
  name: string;
  dateStarted: string;
  status: "Active" | "Paused" | "Completed";
}

interface WorldModelStat {
  label: string;
  value: string;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const HYPOTHESES: Hypothesis[] = [
  {
    id: 1,
    text: "Carbon pricing accelerates green innovation by 2–3× when applied consistently over 10+ years.",
    confidence: 72,
    status: "Testing",
  },
  {
    id: 2,
    text: "Demographic inversion in aging societies is the most underpriced political risk of the 2030s.",
    confidence: 85,
    status: "Active",
  },
  {
    id: 3,
    text: "Urban density above 15k/km² correlates negatively with reported life satisfaction.",
    confidence: 61,
    status: "Active",
  },
];

const TRAILS: TrailItem[] = [
  { id: 1, name: "How carbon pricing affects innovation rates", dateStarted: "2026-01", status: "Active" },
  { id: 2, name: "Demographics as a leading indicator of political shift", dateStarted: "2026-02", status: "Active" },
  { id: 3, name: "AI labor displacement: net positive or negative?", dateStarted: "2025-11", status: "Paused" },
  { id: 4, name: "Urban density and mental health outcomes", dateStarted: "2026-03", status: "Active" },
  { id: 5, name: "Sovereign debt cycles and currency crises", dateStarted: "2025-12", status: "Completed" },
];

const STATS: WorldModelStat[] = [
  { label: "Saved Hypotheses", value: "3" },
  { label: "Research Trails", value: "5" },
  { label: "Evidence Reviewed", value: "24" },
  { label: "Confidence Average", value: "76%" },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: TrailItem["status"]): string {
  switch (status) {
    case "Active":
      return "bg-emerald-400";
    case "Paused":
      return "bg-amber-400";
    case "Completed":
      return "bg-paper-dim/40";
    default:
      return "bg-paper-dim/40";
  }
}

function hypothesisStatusColor(status: Hypothesis["status"]): string {
  switch (status) {
    case "Active":
      return "text-emerald-400/70";
    case "Testing":
      return "text-amber-400/70";
    case "Validated":
      return "text-gold/70";
    case "Rejected":
      return "text-red-400/70";
    default:
      return "text-paper-dim/50";
  }
}

// ─── sub-components ───────────────────────────────────────────────────────────

function MyHypotheses() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <p className="font-mono text-[0.45rem] tracking-[0.3em] uppercase text-gold/50">
        MY HYPOTHESES
      </p>

      <div className="flex flex-col gap-5 flex-1">
        {HYPOTHESES.map((h) => (
          <div
            key={h.id}
            className="border border-white/[0.06] rounded-sm p-4 flex flex-col gap-2 bg-ink-medium/20"
          >
            <p className="font-serif text-sm text-paper/75 leading-snug">{h.text}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="font-mono text-[0.42rem] tracking-[0.15em] uppercase text-paper-dim/50">
                CONFIDENCE
              </span>
              <div className="flex-1 h-px bg-white/[0.06]">
                <div
                  className="h-px bg-gold/50"
                  style={{ width: `${h.confidence}%` }}
                />
              </div>
              <span className="font-mono text-[0.45rem] tracking-[0.1em] text-gold/60">
                {h.confidence}%
              </span>
              <span className={`font-mono text-[0.42rem] tracking-[0.12em] uppercase ${hypothesisStatusColor(h.status)}`}>
                {h.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled
        className="w-full py-2 border border-gold/60 text-gold font-mono text-[0.55rem] tracking-[0.12em] uppercase rounded-sm opacity-60 cursor-default"
      >
        + Add Hypothesis
      </button>
    </div>
  );
}

function MyResearchTrails() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <p className="font-mono text-[0.45rem] tracking-[0.3em] uppercase text-gold/50">
        MY RESEARCH TRAILS
      </p>

      <div className="flex flex-col gap-3 flex-1">
        {TRAILS.map((trail) => (
          <div
            key={trail.id}
            className="border border-white/[0.06] rounded-sm p-3 flex items-start gap-3 bg-ink-medium/20"
          >
            <span
              className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${statusColor(trail.status)}`}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="font-mono text-[0.52rem] tracking-[0.08em] text-paper/70 leading-snug">
                {trail.name}
              </p>
              <p className="font-mono text-[0.42rem] tracking-[0.12em] uppercase text-paper-dim/40">
                Started {trail.dateStarted} · {trail.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorldModelStats() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <p className="font-mono text-[0.45rem] tracking-[0.3em] uppercase text-gold/50">
        WORLD MODEL STATS
      </p>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="border border-white/[0.06] rounded-sm p-4 flex flex-col justify-between bg-ink-medium/20"
          >
            <p className="font-mono text-[0.42rem] tracking-[0.12em] uppercase text-paper-dim/50 leading-snug">
              {stat.label}
            </p>
            <p className="font-mono text-2xl text-gold/80 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled
        className="w-full py-2 border border-white/20 text-paper-dim/50 font-mono text-[0.55rem] tracking-[0.12em] uppercase rounded-sm cursor-default"
      >
        Export World Model
      </button>
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function PersonalLens() {
  return (
    <div className="min-h-screen bg-ink-dark text-paper">
      {/* document title side-effect */}
      <title>Personal Lens — Eternal Nexus OS</title>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 md:px-12 lg:px-20 pt-20 pb-12">
        <p className="font-mono text-[0.45rem] tracking-[0.35em] uppercase text-gold/50 mb-6">
          MY LENS · V13 · PERSONALIZED WORLD MODEL
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-paper/90 leading-tight mb-4">
          "Your world. Your frame."
        </h1>
        <p className="font-mono text-[0.55rem] tracking-[0.1em] text-paper-dim/50 max-w-xl leading-relaxed">
          Track your hypotheses, save your research trails, build your personal world model over time.
        </p>
      </section>

      {/* ── Content (locked) ─────────────────────────────────────────────── */}
      <section className="relative w-full px-6 md:px-12 lg:px-20 pb-20">
        {/* 3-panel grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MyHypotheses />
          </div>
          <div className="lg:col-span-1">
            <MyResearchTrails />
          </div>
          <div className="lg:col-span-1">
            <WorldModelStats />
          </div>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 bg-ink-dark/70 backdrop-blur-sm flex items-center justify-center rounded-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="border border-gold/40 px-5 py-2 rounded-sm">
              <p className="font-mono text-[0.55rem] tracking-[0.25em] uppercase text-gold/70">
                V13 · COMING Q4 2026
              </p>
            </div>
            <p className="font-mono text-[0.42rem] tracking-[0.15em] uppercase text-paper-dim/30">
              Personal World Model — locked until V13 release
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PersonalLens;
