/**
 * ResearchTrails.tsx — V13 Research Trails Widget
 * Compact homepage widget showing personal research trails.
 * sacred-flow: WorkFunction | personal-lens-pillar | 2026-03-23
 */

// ─── types ────────────────────────────────────────────────────────────────────

interface Trail {
  id: number;
  name: string;
  status: "Active" | "Paused" | "Completed";
  dateStarted: string;
  nodes: number;
}

// ─── data ─────────────────────────────────────────────────────────────────────

const TRAILS: Trail[] = [
  {
    id: 1,
    name: "How carbon pricing affects innovation rates",
    status: "Active",
    dateStarted: "2026-01",
    nodes: 7,
  },
  {
    id: 2,
    name: "Demographics as a leading indicator of political shift",
    status: "Active",
    dateStarted: "2026-02",
    nodes: 4,
  },
  {
    id: 3,
    name: "AI labor displacement: net positive or negative?",
    status: "Paused",
    dateStarted: "2025-11",
    nodes: 12,
  },
  {
    id: 4,
    name: "Urban density and mental health outcomes",
    status: "Active",
    dateStarted: "2026-03",
    nodes: 2,
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function statusDotClass(status: Trail["status"]): string {
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

// ─── component ────────────────────────────────────────────────────────────────

export function ResearchTrails() {
  return (
    <div className="relative w-full border border-white/[0.05] rounded-sm bg-ink-medium/20 overflow-hidden">
      {/* Section label */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.05]">
        <p className="font-mono text-[0.45rem] tracking-[0.35em] uppercase text-gold/50">
          RESEARCH TRAILS · V13
        </p>
      </div>

      {/* Trail list */}
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {TRAILS.map((trail) => (
          <div key={trail.id} className="px-6 py-4 flex items-start gap-3">
            {/* Status dot */}
            <span
              className={`mt-[0.3rem] w-1.5 h-1.5 rounded-full shrink-0 ${statusDotClass(trail.status)}`}
              aria-hidden="true"
            />

            {/* Trail info */}
            <div className="flex flex-col gap-1 min-w-0">
              <p className="font-mono text-[0.52rem] tracking-[0.08em] text-paper/65 leading-snug">
                {trail.name}
              </p>
              <p className="font-mono text-[0.42rem] tracking-[0.12em] uppercase text-paper-dim/35">
                {trail.dateStarted} · {trail.nodes} nodes · {trail.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-white/[0.05]">
        <p className="font-mono text-[0.42rem] tracking-[0.2em] uppercase text-paper-dim/30">
          4 ACTIVE TRAILS · PERSONAL KNOWLEDGE GRAPH · V13
        </p>
      </div>

      {/* Lock overlay */}
      <div className="bg-ink-dark/60 backdrop-blur-sm absolute inset-0 flex items-center justify-center">
        <div className="border border-gold/40 px-4 py-2 rounded-sm">
          <p className="font-mono text-[0.5rem] tracking-[0.2em] uppercase text-gold/70">
            COMING Q4 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResearchTrails;
