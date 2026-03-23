import { motion } from "framer-motion";

type TaskStatus = "CONCLUÍDA" | "ELEGÍVEL" | "AGUARDA GATE" | "PLANEJADA" | "EM EXECUÇÃO" | "BLOQUEADA";

interface Task {
  id: string;
  executor: string;
  title: string;
  status: TaskStatus;
  priority?: "P1" | "P2" | "P3";
  gate?: string;
}

const TASKS: Task[] = [
  {
    id: "SYSTEM-FACE-CORE-001",
    executor: "@cursor",
    title: "SYSTEM FACE — cockpit soberano em código",
    status: "EM EXECUÇÃO",
    priority: "P1",
  },
  {
    id: "PLv6.2-b",
    executor: "@claude",
    title: "Próxima camada Product Layer — NewsAPI / metrics",
    status: "AGUARDA GATE",
    priority: "P2",
    gate: "owner",
  },
  {
    id: "FVL-IMPL-001",
    executor: "@claude",
    title: "Founder Vision Layer — implementar /founder no site",
    status: "PLANEJADA",
    priority: "P2",
    gate: "owner",
  },
  {
    id: "GATE_FRAMER",
    executor: "@framer",
    title: "Product Face — globe 3D + trinity orbital",
    status: "AGUARDA GATE",
    priority: "P1",
    gate: "owner",
  },
  {
    id: "GATE_ANTIGRAVITY",
    executor: "@antigravity",
    title: "Product Face — motion + 3D atmospheric layer",
    status: "AGUARDA GATE",
    priority: "P1",
    gate: "owner",
  },
  {
    id: "NEXUS-WORKFUNCTION-NEXT",
    executor: "@codex",
    title: "WorkFunction consolidação — relatório-mãe + wave audit",
    status: "ELEGÍVEL",
    priority: "P2",
  },
  {
    id: "BULK-01-Codex",
    executor: "@codex",
    title: "Codex branch — audit + resolução",
    status: "BLOQUEADA",
    priority: "P3",
  },
];

const statusConfig: Record<TaskStatus, { label: string; dotClass: string; textClass: string; borderClass: string; bgClass: string }> = {
  "CONCLUÍDA": {
    label: "DONE",
    dotClass: "bg-teal/60",
    textClass: "text-teal-light/70",
    borderClass: "border-teal/15",
    bgClass: "bg-teal/[0.04]",
  },
  "ELEGÍVEL": {
    label: "ELEGÍVEL",
    dotClass: "bg-teal animate-pulse",
    textClass: "text-teal-light",
    borderClass: "border-teal/30",
    bgClass: "bg-teal/[0.06]",
  },
  "EM EXECUÇÃO": {
    label: "EXEC",
    dotClass: "bg-[#c9870f] animate-pulse",
    textClass: "text-[#c9870f]",
    borderClass: "border-[#c9870f]/30",
    bgClass: "bg-[#c9870f]/[0.06]",
  },
  "AGUARDA GATE": {
    label: "GATE",
    dotClass: "bg-paper-dim/40",
    textClass: "text-paper-dim/60",
    borderClass: "border-white/10",
    bgClass: "bg-white/[0.02]",
  },
  "PLANEJADA": {
    label: "PLAN",
    dotClass: "bg-paper-dim/30",
    textClass: "text-paper-dim/40",
    borderClass: "border-white/[0.06]",
    bgClass: "bg-transparent",
  },
  "BLOQUEADA": {
    label: "BLOQ",
    dotClass: "bg-red-500/60",
    textClass: "text-red-400/70",
    borderClass: "border-red-500/20",
    bgClass: "bg-red-500/[0.04]",
  },
};

const priorityClass: Record<string, string> = {
  P1: "text-[#c9870f]",
  P2: "text-paper-dim/50",
  P3: "text-paper-dim/30",
};

export default function TaskControlRegion() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
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
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        {TASKS.map((task, i) => {
          const cfg = statusConfig[task.status];
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className={`border-b border-white/[0.04] px-4 py-3 last:border-0 ${cfg.bgClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-2.5 pt-0.5">
                  <span className={`mt-1 block h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dotClass}`} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="font-mono text-[10px] tracking-[0.06em] text-paper-dim/40">
                        {task.id}
                      </span>
                      {task.priority && (
                        <span className={`font-mono text-[9px] tracking-[0.1em] ${priorityClass[task.priority]}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] leading-snug text-paper/70 block">
                      {task.title}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-[9px] text-paper-dim/30">
                        {task.executor}
                      </span>
                      {task.gate && (
                        <>
                          <span className="font-mono text-[9px] text-paper-dim/20">·</span>
                          <span className="font-mono text-[9px] text-paper-dim/30">
                            gate: {task.gate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-sans text-[9px] font-[500] tracking-[0.15em] uppercase ${cfg.textClass} ${cfg.borderClass}`}
                >
                  {cfg.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
