import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  type: "prompt" | "output" | "comment" | "error" | "gate";
  content: string;
}

const BOOT_SEQUENCE: TerminalLine[] = [
  { type: "comment", content: "# ETERNAL NEXUS OS — SYSTEM FACE v1.0" },
  { type: "comment", content: "# Branch: cursor/system-face-core-d9db" },
  { type: "comment", content: "# 2026-03-23 — IGNIÇÃO_ATIVA" },
  { type: "output", content: "" },
  { type: "output", content: "Loading BASTION v2.2 .................. OK" },
  { type: "output", content: "Loading LIVE_STATE .................... OK" },
  { type: "output", content: "Loading PIONEER_MATRIX ................ OK" },
  { type: "output", content: "Loading HANDOFF_LEDGER ................ OK" },
  { type: "output", content: "" },
  { type: "gate", content: "GATE_SYSTEM_FACE: ABERTO — cockpit soberano ativo" },
  { type: "output", content: "" },
];

const COMMANDS: Record<string, TerminalLine[]> = {
  help: [
    { type: "output", content: "" },
    { type: "comment", content: "COMANDOS DISPONÍVEIS:" },
    { type: "output", content: "  status     — estado geral do sistema" },
    { type: "output", content: "  gates      — listar gates abertos e fechados" },
    { type: "output", content: "  pioneers   — matrix de pioneiros" },
    { type: "output", content: "  branch     — branch canônico ativo" },
    { type: "output", content: "  law        — lei primária do sistema" },
    { type: "output", content: "  clear      — limpar terminal" },
    { type: "output", content: "" },
  ],
  status: [
    { type: "output", content: "" },
    { type: "gate", content: "FASE_ATIVA: Bulking Controlado do Produto" },
    { type: "output", content: "EXECUTOR:  @claude + todos os pioneiros" },
    { type: "output", content: "IGNIÇÃO:   ATIVA — ciclo contínuo" },
    { type: "output", content: "MODO_AUTO: SELADO" },
    { type: "error", content: "DERIVA:    IMPERMITIDA" },
    { type: "output", content: "" },
  ],
  gates: [
    { type: "output", content: "" },
    { type: "comment", content: "GATES ABERTOS:" },
    { type: "gate", content: "  SYSTEM-FACE-CORE-001 · @cursor · EM EXECUÇÃO" },
    { type: "output", content: "" },
    { type: "comment", content: "GATES FECHADOS (aguardam owner):" },
    { type: "output", content: "  PLv6.2-b · NewsAPI / project_metrics" },
    { type: "output", content: "  FVL-IMPL-001 · /founder implementation" },
    { type: "output", content: "  GATE_FRAMER · Product Face globe 3D" },
    { type: "output", content: "  GATE_ANTIGRAVITY · motion + atmospheric" },
    { type: "output", content: "" },
  ],
  pioneers: [
    { type: "output", content: "" },
    { type: "output", content: "@claude     AGUARDA GATE  · Arquiteto-Executor" },
    { type: "gate", content: "@cursor     ATIVO          · Executor-Desbloqueador" },
    { type: "output", content: "@copilot    DONE           · Executor-Lapidador" },
    { type: "output", content: "@codex      AGUARDA        · Cérebro-Orquestrador" },
    { type: "output", content: "@framer     AGUARDA GATE  · Designer-Executor" },
    { type: "output", content: "@antigravity AGUARDA GATE · Motion-Executor" },
    { type: "output", content: "" },
  ],
  branch: [
    { type: "output", content: "" },
    { type: "gate", content: "BRANCH CANÔNICO: claude/rebuild-bastion-core-rihGX" },
    { type: "output", content: "BRANCH SISTEMA:  cursor/system-face-core-d9db" },
    { type: "comment", content: "# Toda escrita, commit e push → branch canônico" },
    { type: "output", content: "" },
  ],
  law: [
    { type: "output", content: "" },
    { type: "comment", content: "# LEI PRIMÁRIA — excerto" },
    { type: "output", content: "" },
    { type: "output", content: 'O_QUE_E: motor de governança · cockpit soberano' },
    { type: "output", content: '         Bloomberg Terminal + Claude Code' },
    { type: "output", content: "" },
    { type: "gate", content: "NUNCA_PODE_VIRAR: landing page · SaaS · hacker · cyberpunk" },
    { type: "output", content: "" },
    { type: "comment", content: "# Fonte: ops/SYSTEM_FACE_CANON.md" },
    { type: "output", content: "" },
  ],
};

function lineClass(type: TerminalLine["type"]): string {
  switch (type) {
    case "prompt": return "text-paper/80";
    case "output": return "text-paper-dim/60";
    case "comment": return "text-paper-dim/35";
    case "error": return "text-red-400/70";
    case "gate": return "text-teal-light";
  }
}

export default function CommandLine() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [booted, setBooted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < BOOT_SEQUENCE.length) {
        setLines((prev) => [...prev, BOOT_SEQUENCE[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setBooted(true);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      const cmd = input.trim().toLowerCase();
      const promptLine: TerminalLine = { type: "prompt", content: `▸ ${input.trim()}` };
      setHistory((h) => [input.trim(), ...h]);
      setHistIdx(-1);

      if (cmd === "clear") {
        setLines([]);
        setInput("");
        return;
      }

      const response = COMMANDS[cmd] ?? [
        { type: "output", content: "" },
        { type: "error", content: `comando não reconhecido: ${cmd}` },
        { type: "output", content: 'digite "help" para ver comandos disponíveis' },
        { type: "output", content: "" },
      ];

      setLines((prev) => [...prev, promptLine, ...response]);
      setInput("");
    }

    if (e.key === "ArrowUp") {
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    }

    if (e.key === "ArrowDown") {
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next]);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className="flex h-full flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="block h-1 w-1 rounded-full bg-teal" />
        <span className="font-sans text-[10px] font-[500] tracking-[0.18em] text-paper-dim/60 uppercase">
          COMMAND LINE
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[0.1em] text-paper-dim/30 uppercase">
          type "help"
        </span>
      </div>

      <div
        className="flex flex-1 cursor-text flex-col overflow-hidden rounded-sm border border-white/[0.06] p-4"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex-1 overflow-y-auto space-y-0.5">
          <AnimatePresence initial={false}>
            {lines.filter(line => line && line.type).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <span className={`font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all ${lineClass(line.type)}`}>
                  {line.content || "\u00A0"}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {booted && (
          <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
            <span className="font-mono text-[11px] text-teal-light">▸</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent font-mono text-[11px] text-paper/80 outline-none placeholder:text-paper-dim/25"
              placeholder="comando..."
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
            />
            <BlinkCursor />
          </div>
        )}
      </div>
    </motion.section>
  );
}

function BlinkCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="font-mono text-[11px] text-paper-dim/40 transition-opacity"
      style={{ opacity: visible ? 1 : 0 }}
    >
      █
    </span>
  );
}
