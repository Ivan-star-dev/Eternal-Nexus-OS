import { motion } from "framer-motion";

interface StateRow {
  key: string;
  value: string;
  accent?: "teal" | "gold" | "red" | "dim";
}

export const BRANCH_CANONICO = "claude/rebuild-bastion-core-rihGX";
export const BRANCH_SISTEMA = "cursor/system-face-core-d9db";

const STATE_ROWS: StateRow[] = [
  { key: "FASE_ATIVA", value: "Bulking Controlado do Produto", accent: "teal" },
  { key: "BRANCH_CANÔNICO", value: BRANCH_CANONICO, accent: "teal" },
  { key: "BRANCH_SISTEMA", value: BRANCH_SISTEMA, accent: "gold" },
  { key: "EXECUTOR_ATIVO", value: "@claude + todos os pioneiros (sprint V5/V6)", accent: "dim" },
  { key: "CAMADA_ATUAL", value: "V4 done · V5 EarthLab em exec · V6 preview", accent: "dim" },
  { key: "ESTADO_GERAL", value: "SPRINT ATIVO — V5 Research Core + V6 preview", accent: "gold" },
  { key: "IGNIÇÃO", value: "ATIVA — ciclo contínuo", accent: "teal" },
  { key: "MODO_AUTO", value: "SELADO — sem instrução manual entre tasks", accent: "dim" },
  { key: "DERIVA", value: "IMPERMITIDA", accent: "red" },
];

const GATE_ROWS = [
  { gate: "GATE_FRAMER", status: "AGUARDA GATE OWNER", note: "WorkVisual" },
  { gate: "GATE_ANTIGRAVITY", status: "AGUARDA GATE OWNER", note: "WorkVisual" },
  { gate: "PLv6.2-b", status: "AGUARDA GATE OWNER", note: "próxima camada" },
  { gate: "FVL-IMPL-001", status: "AGUARDA GATE", note: "/founder blueprint pronto" },
];

function accentClass(accent?: StateRow["accent"]) {
  switch (accent) {
    case "teal": return "text-teal-light";
    case "gold": return "text-[#c9870f]";
    case "red": return "text-red-400";
    default: return "text-paper-dim";
  }
}

export default function LiveStateSurface() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="block h-1 w-1 rounded-full bg-teal animate-pulse" />
        <span className="font-sans text-[10px] font-[500] tracking-[0.18em] text-paper-dim/60 uppercase">
          LIVE STATE
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[0.1em] text-paper-dim/30 uppercase">
          ops/LIVE_STATE.md
        </span>
      </div>

      <div
        className="flex-1 overflow-y-auto rounded-sm border border-white/[0.06] p-4"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="space-y-0.5">
          {STATE_ROWS.map((row, i) => (
            <motion.div
              key={row.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.06 * i, duration: 0.3 }}
              className="grid grid-cols-[180px_1fr] gap-4 border-b border-white/[0.04] py-2 last:border-0"
            >
              <span className="font-mono text-[11px] tracking-[0.06em] text-paper-dim/40">
                {row.key}
              </span>
              <span className={`font-mono text-[11px] leading-relaxed ${accentClass(row.accent)}`}>
                {row.value}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-sans text-[9px] font-[500] tracking-[0.2em] text-paper-dim/40 uppercase">
              GATES FECHADOS
            </span>
          </div>
          <div className="space-y-0.5">
            {GATE_ROWS.map((g) => (
              <div
                key={g.gate}
                className="grid grid-cols-[140px_1fr_160px] gap-3 py-1.5 border-b border-white/[0.03] last:border-0"
              >
                <span className="font-mono text-[10px] tracking-[0.06em] text-[#c9870f]/70">
                  {g.gate}
                </span>
                <span className="font-mono text-[10px] text-paper-dim/50">
                  {g.status}
                </span>
                <span className="font-mono text-[10px] text-paper-dim/30">
                  {g.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
