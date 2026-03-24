import { motion } from "framer-motion";

type TaskStatus = "CONCLUÍDA" | "ELEGÍVEL" | "AGUARDA GATE" | "PLANEJADA" | "EM EXECUÇÃO" | "BLOQUEADA";
type Territory = "WorkStructure" | "WorkFunction" | "WorkVisual";

interface Task {
  id: string;
  executor: string;
  title: string;
  status: TaskStatus;
  territory: Territory;
  priority?: "P1" | "P2" | "P3";
  gate?: string;
}

const TASKS: Task[] = [
  // WorkStructure
  {
    id: "SYSTEM-FACE-CORE-001",
    executor: "@cursor",
    title: "SYSTEM FACE — cockpit soberano em código",
    status: "CONCLUÍDA",
    territory: "WorkStructure",
    priority: "P1",
  },
  {
    id: "FVL-IMPL-001",
    executor: "@claude",
    title: "Founder Vision Layer — implementar /founder no site",
    status: "AGUARDA GATE",
    territory: "WorkStructure",
    priority: "P2",
    gate: "owner",
  },
  // WorkFunction
  {
    id: "PLv6.2-b",
    executor: "@claude",
    title: "Próxima camada Product Layer — NewsAPI / metrics",
    status: "AGUARDA GATE",
    territory: "WorkFunction",
    priority: "P2",
    gate: "owner",
  },
  {
    id: "NEXUS-WORKFUNCTION-NEXT",
    executor: "@codex",
    title: "WorkFunction consolidação — relatório-mãe + wave audit",
    status: "ELEGÍVEL",
    territory: "WorkFunction",
    priority: "P2",
  },
  {
    id: "BULK-01-Codex",
    executor: "@codex",
    title: "Codex branch — audit + resolução",
    status: "BLOQUEADA",
    territory: "WorkFunction",
    priority: "P3",
  },
  // WorkVisual
  {
    id: "GATE_FRAMER",
    executor: "@framer",
    title: "Product Face — globe 3D + trinity orbital",
    status: "AGUARDA GATE",
    territory: "WorkVisual",
    priority: "P1",
    gate: "owner",
  },
  {
    id: "GATE_ANTIGRAVITY",
    executor: "@antigravity",
    title: "Product Face — motion + 3D atmospheric layer",
    status: "AGUARDA GATE",
    territory: "WorkVisual",
    priority: "P1",
    gate: "owner",
  },
];

const statusConfig: Record<TaskStatus, {
  label: string;
  dotClass: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
}> = {
  "CONCLUÍDA": {
    label: "DONE",
    dotClass: "bg-teal/50",
    textClass: "text-teal-light/60",
    borderClass: "border-teal/10",
    bgClass: "",
  },
  "ELEGÍVEL": {
    label: "ELEGÍVEL",
    dotClass: "bg-teal animate-pulse",
    textClass: "text-teal-light",
    borderClass: "border-teal/25",
    bgClass: "bg-teal/[0.04]",
  },
  "EM EXECUÇÃO": {
    label: "EXEC",
    dotClass: "bg-[#c9870f] animate-pulse",
    textClass: "text-[#c9870f]",
    borderClass: "border-[#c9870f]/25",
    bgClass: "bg-[#c9870f]/[0.04]",
  },
  "AGUARDA GATE": {
    label: "GATE",
    dotClass: "bg-paper-dim/30",
    textClass: "text-paper-dim/50",
    borderClass: "border-white/[0.08]",
    bgClass: "",
  },
  "PLANEJADA": {
    label: "PLAN",
    dotClass: "bg-paper-dim/20",
    textClass: "text-paper-dim/35",
    borderClass: "border-white/[0.05]",
    bgClass: "",
  },
  "BLOQUEADA": {
    label: "BLOQ",
    dotClass: "bg-red-500/50",
    textClass: "text-red-400/60",
    borderClass: "border-red-500/15",
    bgClass: "bg-red-500/[0.03]",
  },
};

const priorityClass: Record<string, string> = {
  P1: "text-[#c9870f]/80",
  P2: "text-paper-dim/40",
  P3: "text-paper-dim/25",
};

const territoryOrder: Territory[] = ["WorkStructure", "WorkFunction", "WorkVisual"];

const territoryAccent: Record<Territory, string> = {
  WorkStructure: "text-paper-dim/35",
  WorkFunction: "text-paper-dim/35",
  WorkVisual: "text-paper-dim/35",
};

export default function TaskControlRegion() {
  const grouped = territoryOrder.map((t) => ({
    territory: t,
    tasks: TASKS.filter((task) => task.territory === t),
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="flex h-full flex-col"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="block h-1 w-1 rounded-full bg-[#c9870f]" />
        <span className="font-sans text-[10px] font-[500] tracking-[0.18em] text-paper-dim/60 uppercase">
          BASTION · TASK CONTROL
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[0.1em] text-paper-dim/30 uppercase">
          ops/BASTION.md
        </span>
      </div>

      <div
        className="flex-1 overflow-y-auto rounded-sm border border-white/[0.06]"
        style={{ background: "rgba(255,255,255,0.015)" }}
      >
        {grouped.map(({ territory, tasks }, gi) => (
          <div key={territory}>
            {/* Territory header */}
            <div
              className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04]"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <span className={`font-sans text-[9px] font-[500] tracking-[0.2em] uppercase ${territoryAccent[territory]}`}>
                {territory}
              </span>
              <span className="font-mono text-[9px] text-paper-dim/20">
                · {tasks.length}
              </span>
            </div>

            {/* Tasks */}
            {tasks.map((task, i) => {
              const cfg = statusConfig[task.status];
              const globalIdx = gi * 10 + i;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * globalIdx, duration: 0.25 }}
                  className={`border-b border-white/[0.035] px-4 py-2.5 last:border-0 ${cfg.bgClass}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-2 pt-0.5">
                      <span className={`mt-[3px] block h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dotClass}`} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center gap-2">
                          <span className="font-mono text-[9px] tracking-[0.04em] text-paper-dim/35">
                            {task.id}
                          </span>
                          {task.priority && (
                            <span className={`font-mono text-[8px] tracking-[0.08em] ${priorityClass[task.priority]}`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] leading-snug text-paper/65 block">
                          {task.title}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-[9px] text-paper-dim/25">
                            {task.executor}
                          </span>
                          {task.gate && (
                            <>
                              <span className="font-mono text-[8px] text-paper-dim/15">·</span>
                              <span className="font-mono text-[9px] text-paper-dim/25">
                                gate: {task.gate}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-sans text-[8px] font-[500] tracking-[0.14em] uppercase ${cfg.textClass} ${cfg.borderClass}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
