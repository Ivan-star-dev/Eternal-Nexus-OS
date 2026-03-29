import { motion } from "framer-motion";

interface Pioneer {
  id: string;
  name: string;
  role: string;
  territory: string;
  state: "ATIVO" | "AGUARDA" | "DONE" | "BLOQUEADO";
  lastTask?: string;
}

const PIONEERS: Pioneer[] = [
  {
    id: "claude",
    name: "@claude",
    role: "Arquiteto-Executor",
    territory: "WorkStructure · alta soberania",
    state: "AGUARDA",
    lastTask: "FOUNDER-SIGNATURE-CANON-001",
  },
  {
    id: "cursor",
    name: "@cursor",
    role: "Executor-Desbloqueador",
    territory: "WorkFunction · mecânico",
    state: "DONE",
    lastTask: "SYSTEM-FACE-CORE-001",
  },
  {
    id: "copilot",
    name: "@copilot",
    role: "Executor-Lapidador",
    territory: "WorkStructure · lapidação",
    state: "DONE",
    lastTask: "BULK-02.2",
  },
  {
    id: "codex",
    name: "@codex",
    role: "Cérebro-Orquestrador",
    territory: "WorkFunction · consolidação",
    state: "ATIVO",
    lastTask: "NEXUS-WORKFUNCTION-NEXT",
  },
  {
    id: "framer",
    name: "@framer",
    role: "Designer-Executor",
    territory: "WorkVisual · design / UI",
    state: "AGUARDA",
    lastTask: "—",
  },
  {
    id: "antigravity",
    name: "@antigravity",
    role: "Motion-Executor",
    territory: "WorkVisual · motion / 3D",
    state: "AGUARDA",
    lastTask: "—",
  },
];

const stateConfig = {
  ATIVO: { dot: "bg-teal animate-pulse", label: "ATIVO", text: "text-teal-light", border: "border-teal/20 bg-teal/[0.05]" },
  AGUARDA: { dot: "bg-paper-dim/40", label: "AGUARDA", text: "text-paper-dim/50", border: "border-white/[0.06] bg-transparent" },
  DONE: { dot: "bg-teal/40", label: "DONE", text: "text-teal-light/50", border: "border-teal/10 bg-transparent" },
  BLOQUEADO: { dot: "bg-red-500/60", label: "BLOQ", text: "text-red-400/70", border: "border-red-500/15 bg-red-500/[0.03]" },
};

export default function OrchestraPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="flex h-full flex-col"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="block h-1 w-1 rounded-full bg-paper-dim/40" />
        <span className="font-sans text-[10px] font-[500] tracking-[0.18em] text-paper-dim/60 uppercase">
          PIONEER MATRIX
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[0.1em] text-paper-dim/30 uppercase">
          ops/PIONEER_MATRIX.md
        </span>
      </div>

      <div
        className="flex-1 overflow-y-auto rounded-sm border border-white/[0.06]"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="grid grid-cols-2 gap-px p-px" style={{ background: "rgba(255,255,255,0.04)" }}>
          {PIONEERS.map((p, i) => {
            const cfg = stateConfig[p.state];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.06 * i }}
                className="flex flex-col p-3"
                style={{ background: "#060c14" }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    <span className="font-mono text-[11px] tracking-[0.04em] text-paper/80">
                      {p.name}
                    </span>
                  </div>
                  <span className={`rounded-sm border px-1.5 py-0.5 font-sans text-[8px] font-[500] tracking-[0.15em] uppercase ${cfg.text} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                </div>
                <span className="font-mono text-[10px] leading-snug text-paper-dim/50 mb-1">
                  {p.role}
                </span>
                <span className="font-mono text-[9px] text-paper-dim/30">
                  {p.territory}
                </span>
                {p.lastTask && p.lastTask !== "—" && (
                  <div className="mt-2 border-t border-white/[0.04] pt-2">
                    <span className="font-mono text-[9px] text-paper-dim/25">
                      last: {p.lastTask}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
