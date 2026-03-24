import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  type: "prompt" | "output" | "comment" | "error" | "gate" | "section";
  content: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getBootDate() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function makeBootSequence(): TerminalLine[] {
  return [
    { type: "comment", content: "# ETERNAL NEXUS OS — SYSTEM FACE v1.0" },
    { type: "comment", content: `# ${getBootDate()} — IGNIÇÃO_ATIVA` },
    { type: "output", content: "" },
    { type: "output", content: "Loading BASTION v2.2 ..................... OK" },
    { type: "output", content: "Loading LIVE_STATE ....................... OK" },
    { type: "output", content: "Loading PIONEER_MATRIX ................... OK" },
    { type: "output", content: "Loading HANDOFF_LEDGER ................... OK" },
    { type: "output", content: "Loading SYSTEM_FACE_CANON ................ OK" },
    { type: "output", content: "" },
    { type: "gate", content: "GATE_SYSTEM_FACE: ABERTO — cockpit soberano ativo" },
    { type: "output", content: "" },
  ];
}

const COMMANDS: Record<string, TerminalLine[]> = {
  help: [
    { type: "output", content: "" },
    { type: "section", content: "COMANDOS:" },
    { type: "output", content: "  status      estado geral do sistema" },
    { type: "output", content: "  gates        gates abertos / fechados" },
    { type: "output", content: "  pioneers     matrix de pioneiros" },
    { type: "output", content: "  tasks        fila ativa por território" },
    { type: "output", content: "  face         identidade da System Face" },
    { type: "output", content: "  branch       branch canônico ativo" },
    { type: "output", content: "  law          lei primária do sistema" },
    { type: "output", content: "  canon        artefactos canônicos" },
    { type: "output", content: "  clear        limpar terminal" },
    { type: "output", content: "" },
  ],

  status: [
    { type: "output", content: "" },
    { type: "gate", content: "FASE_ATIVA:  Bulking Controlado do Produto" },
    { type: "output", content: "EXECUTOR:   @claude + todos os pioneiros" },
    { type: "output", content: "CAMADA:     V4 done · V5 EarthLab em exec · V6 preview" },
    { type: "output", content: "IGNIÇÃO:    ATIVA — ciclo contínuo" },
    { type: "output", content: "MODO_AUTO:  SELADO" },
    { type: "error", content: "DERIVA:     IMPERMITIDA" },
    { type: "output", content: "" },
  ],

  gates: [
    { type: "output", content: "" },
    { type: "section", content: "GATES CONCLUÍDOS:" },
    { type: "gate", content: "  SYSTEM-FACE-CORE-001 · @cursor · DONE" },
    { type: "output", content: "" },
    { type: "section", content: "GATES FECHADOS (aguardam owner):" },
    { type: "output", content: "  PLv6.2-b        · @claude · NewsAPI / project_metrics" },
    { type: "output", content: "  FVL-IMPL-001    · @claude · /founder implementation" },
    { type: "output", content: "  GATE_FRAMER     · @framer · Product Face globe 3D" },
    { type: "output", content: "  GATE_ANTIGRAVITY · @antigravity · motion + atmospheric" },
    { type: "output", content: "" },
  ],

  pioneers: [
    { type: "output", content: "" },
    { type: "section", content: "PIONEER MATRIX:" },
    { type: "output", content: "  @claude       AGUARDA GATE   Arquiteto-Executor" },
    { type: "gate", content: "  @cursor       DONE            Executor-Desbloqueador" },
    { type: "output", content: "  @copilot      DONE            Executor-Lapidador" },
    { type: "output", content: "  @codex        ELEGÍVEL        Cérebro-Orquestrador" },
    { type: "output", content: "  @framer       AGUARDA GATE   Designer-Executor" },
    { type: "output", content: "  @antigravity  AGUARDA GATE   Motion-Executor" },
    { type: "output", content: "" },
  ],

  tasks: [
    { type: "output", content: "" },
    { type: "section", content: "WorkStructure:" },
    { type: "gate", content: "  SYSTEM-FACE-CORE-001    DONE" },
    { type: "output", content: "  FVL-IMPL-001            GATE     @claude" },
    { type: "output", content: "" },
    { type: "section", content: "WorkFunction:" },
    { type: "output", content: "  PLv6.2-b                GATE     @claude" },
    { type: "gate", content: "  NEXUS-WORKFUNCTION-NEXT ELEGÍVEL @codex" },
    { type: "error", content: "  BULK-01-Codex            BLOQ     @codex" },
    { type: "output", content: "" },
    { type: "section", content: "WorkVisual:" },
    { type: "output", content: "  GATE_FRAMER             GATE     @framer" },
    { type: "output", content: "  GATE_ANTIGRAVITY        GATE     @antigravity" },
    { type: "output", content: "" },
  ],

  face: [
    { type: "output", content: "" },
    { type: "section", content: "SYSTEM FACE — identidade:" },
    { type: "output", content: "" },
    { type: "gate", content: "O_QUE_E: motor de governança · cockpit soberano" },
    { type: "gate", content: "         Bloomberg Terminal + Claude Code" },
    { type: "output", content: "" },
    { type: "output", content: "EMOCAO:  soberano · calmo · técnico · poder silencioso" },
    { type: "output", content: "VISUAL:  JetBrains dominante · grid técnico · teal ops" },
    { type: "output", content: "         navy permanente · gold em autoridade" },
    { type: "output", content: "" },
    { type: "error", content: "NUNCA:   landing page · SaaS · hacker · cyberpunk" },
    { type: "output", content: "" },
  ],

  branch: [
    { type: "output", content: "" },
    { type: "gate", content: `BRANCH CANÔNICO:  ${process.env.NEXT_PUBLIC_CANONICAL_BRANCH ?? "claude/rebuild-bastion-core-rihGX"}` },
    { type: "output", content: `BRANCH SISTEMA:   ${process.env.NEXT_PUBLIC_SYSTEM_BRANCH ?? "cursor/system-face-core-d9db"}` },
    { type: "comment", content: "# toda escrita, commit e push → branch canônico" },
    { type: "output", content: "" },
  ],

  law: [
    { type: "output", content: "" },
    { type: "section", content: "LEI PRIMÁRIA — excertos:" },
    { type: "output", content: "" },
    { type: "comment", content: "# ops/SYSTEM_FACE_CANON.md + TYPOGRAPHY_LAW.md" },
    { type: "output", content: "" },
    { type: "output", content: "TIPOGRAFIA:  JetBrains Mono dominante em dados/IDs" },
    { type: "output", content: "             Syne 300–400 apenas em framing de UI" },
    { type: "output", content: "             bold reservado para autoridade real" },
    { type: "output", content: "" },
    { type: "output", content: "PALETA:      navy #060c14 · teal #206358 · gold #c9870f" },
    { type: "output", content: "             paper #e4ebf0 · paper-dim #7e8ea0" },
    { type: "output", content: "" },
    { type: "gate", content: "HERANÇA:     BRAND_MOTHER_SYSTEM.md → 3 faces" },
    { type: "output", content: "" },
  ],

  canon: [
    { type: "output", content: "" },
    { type: "section", content: "ARTEFACTOS CANÔNICOS:" },
    { type: "output", content: "" },
    { type: "gate", content: "  ops/SYSTEM_FACE_CANON.md    lei das 3 faces" },
    { type: "gate", content: "  ops/TYPOGRAPHY_LAW.md       lei tipográfica" },
    { type: "gate", content: "  ops/BRAND_MOTHER_SYSTEM.md  identidade mãe" },
    { type: "output", content: "  ops/BASTION.md             coração de execução" },
    { type: "output", content: "  ops/LIVE_STATE.md          estado vivo" },
    { type: "output", content: "  ops/PIONEER_MATRIX.md      papéis + territórios" },
    { type: "output", content: "  ops/HANDOFF_LEDGER.md      histórico imutável" },
    { type: "output", content: "  ops/DNA_PROTOCOL.md        espinha canônica" },
    { type: "output", content: "" },
  ],
};

function lineClass(type: TerminalLine["type"]): string {
  switch (type) {
    case "prompt": return "text-paper/75";
    case "output": return "text-paper-dim/55";
    case "comment": return "text-paper-dim/30";
    case "section": return "text-paper-dim/40";
    case "error": return "text-red-400/65";
    case "gate": return "text-teal-light/90";
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
    const BOOT = makeBootSequence();
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < BOOT.length) {
        setLines((prev) => [...prev, BOOT[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setBooted(true);
      }
    }, 55);
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
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next]);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="flex h-full flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="block h-1 w-1 rounded-full bg-teal" />
        <span className="font-sans text-[10px] font-[500] tracking-[0.18em] text-paper-dim/60 uppercase">
          COMMAND LINE
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-[0.1em] text-paper-dim/25">
          help
        </span>
      </div>

      <div
        className="flex flex-1 cursor-text flex-col overflow-hidden rounded-sm border border-white/[0.06] p-4"
        style={{ background: "rgba(255,255,255,0.018)" }}
      >
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {lines.filter((l) => l && l.type).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.08 }}
              >
                <span
                  className={`block font-mono text-[11px] leading-[1.6] whitespace-pre-wrap break-all ${lineClass(line.type)}`}
                >
                  {line.content || "\u00A0"}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {booted && (
          <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
            <span className="font-mono text-[11px] text-teal-light/80">▸</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent font-mono text-[11px] text-paper/75 outline-none placeholder:text-paper-dim/20"
              placeholder=""
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
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
      className="font-mono text-[11px] text-paper-dim/35"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.05s" }}
    >
      █
    </span>
  );
}
