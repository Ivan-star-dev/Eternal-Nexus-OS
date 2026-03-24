import { motion } from "framer-motion";
import { useState } from "react";

interface HandoffEntry {
  id: string;
  date: string;
  executor: string;
  task: string;
  status: "CONCLUÍDA" | "PLANEJADA" | "EM EXECUÇÃO";
  files: string[];
}

const ENTRIES: HandoffEntry[] = [
  {
    id: "SYSTEM-FACE-CORE-001",
    date: "2026-03-23",
    executor: "@cursor",
    task: "SYSTEM FACE — cockpit soberano · implementação em código",
    status: "CONCLUÍDA",
    files: [
      "src/components/system/SystemShell.tsx",
      "src/components/system/LiveStateSurface.tsx",
      "src/components/system/HandoffLedger.tsx",
      "src/components/system/TaskControlRegion.tsx",
      "src/components/system/OrchestraPanel.tsx",
      "src/components/system/CommandLine.tsx",
      "src/pages/SystemFacePage.tsx",
    ],
  },
  {
    id: "FOUNDER-SIGNATURE-CANON-001",
    date: "2026-03-23",
    executor: "@claude",
    task: "Formalizar assinatura canônica do founder — 3 blocos + camada 0.5",
    status: "CONCLUÍDA",
    files: [
      "ops/FOUNDER_SIGNATURE_CANON.md",
      "ops/LIVE_STATE.md",
      "ops/HANDOFF_LEDGER.md",
    ],
  },
  {
    id: "FOUNDER-STORY-SPINE-001",
    date: "2026-03-23",
    executor: "@claude",
    task: "Espinha da história do founder — 2 blocos + FRASES_CANON + camada 0.6",
    status: "CONCLUÍDA",
    files: [
      "ops/FOUNDER_STORY_SPINE.md",
      "ops/LIVE_STATE.md",
      "ops/HANDOFF_LEDGER.md",
    ],
  },
  {
    id: "GREAT-STORY-OF-THE-PRODUCT-001",
    date: "2026-03-23",
    executor: "@claude",
    task: "Grande história Heaven Lab — 3 filhos + MOTHER_PHRASES + camada 0.7",
    status: "CONCLUÍDA",
    files: [
      "ops/GREAT_STORY_OF_THE_PRODUCT.md",
      "ops/LIVE_STATE.md",
      "ops/HANDOFF_LEDGER.md",
    ],
  },
  {
    id: "SYSTEM-FACE-CANON-001",
    date: "2026-03-23",
    executor: "@claude",
    task: "3 Faces Canónicas + Lei Tipográfica — SYSTEM_FACE_CANON + TYPOGRAPHY_LAW",
    status: "CONCLUÍDA",
    files: [
      "ops/SYSTEM_FACE_CANON.md",
      "ops/TYPOGRAPHY_LAW.md",
      "ops/NEXUS_LIVING_CANON.md",
    ],
  },
  {
    id: "NEXUS-V10-SOVEREIGN-DESTINY-001",
    date: "2026-03-23",
    executor: "@claude",
    task: "NEXUS V10 Sovereign Destiny — linha V1→V10 + Phase Tracker",
    status: "CONCLUÍDA",
    files: [
      "ops/NEXUS_V10_SOVEREIGN_DESTINY.md",
      "ops/BASTION.md",
      "ops/LIVE_STATE.md",
    ],
  },
  {
    id: "BASTION-2.0-CYCLE-START-001",
    date: "2026-03-21",
    executor: "@claude",
    task: "Iniciar ciclo contínuo de execução dos pioneiros pelo BASTION",
    status: "CONCLUÍDA",
    files: [
      "ops/BASTION.md",
      "ops/LIVE_STATE.md",
      "ops/HANDOFF_LEDGER.md",
    ],
  },
];

const statusColors: Record<HandoffEntry["status"], string> = {
  "CONCLUÍDA": "text-teal-light border-teal/20 bg-teal/5",
  "EM EXECUÇÃO": "text-[#c9870f] border-[#c9870f]/20 bg-[#c9870f]/5",
  "PLANEJADA": "text-paper-dim border-white/10 bg-white/[0.03]",
};

export default function HandoffLedger() {
  const [expanded, setExpanded] = useState<string | null>(null);

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
          HANDOFF LEDGER
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[0.1em] text-paper-dim/30 uppercase">
          ops/HANDOFF_LEDGER.md
        </span>
      </div>

      <div
        className="flex-1 overflow-y-auto rounded-sm border border-white/[0.06]"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        {ENTRIES.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="border-b border-white/[0.04] last:border-0"
          >
            <button
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              className="w-full px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
              aria-expanded={expanded === entry.id}
              aria-controls={`handoff-details-${entry.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] tracking-[0.06em] text-[#c9870f]/60">
                      {entry.date}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.06em] text-paper-dim/40">
                      {entry.executor}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] leading-snug text-paper/80 block truncate">
                    {entry.task}
                  </span>
                </div>
                <span className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-sans text-[9px] font-[500] tracking-[0.15em] uppercase ${statusColors[entry.status]}`}>
                  {entry.status}
                </span>
              </div>
            </button>

            {expanded === entry.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-white/[0.04] px-4 py-3"
                style={{ background: "rgba(255,255,255,0.015)" }}
              >
                <div className="mb-1.5">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-paper-dim/40 uppercase">
                    TASK_ID
                  </span>
                  <span className="ml-3 font-mono text-[10px] text-teal-light">
                    {entry.id}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[9px] tracking-[0.15em] text-paper-dim/40 uppercase block mb-1">
                    ALTERAÇÃO_REAL
                  </span>
                  <div className="space-y-0.5 pl-2">
                    {entry.files.map((f) => (
                      <div key={f} className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] text-paper-dim/30">›</span>
                        <span className="font-mono text-[10px] text-paper-dim/50">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
