import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TRINITY = [
  {
    num: "01",
    name: "Heaven Lab",
    line: "Observatório e dossiê estratégico",
    detail: "Node-01 · referência viva",
    href: "#dossiers",
  },
  {
    num: "02",
    name: "Bridge Nova",
    line: "Atlas e ponte entre sistemas",
    detail: "Globo vivo · Layer 2",
    href: "/atlas",
  },
  {
    num: "03",
    name: "Nexus Cria",
    line: "Parlamento AI e síntese",
    detail: "Órgão cérebro · fluxo sagrado",
    href: "/nexus",
  },
] as const;

function TrinityCell({
  num,
  name,
  line,
  detail,
  href,
  index,
}: (typeof TRINITY)[number] & { index: number }) {
  const inner = (
    <>
      {/* Reference number — mono, quiet, system ID */}
      <span className="font-mono text-[0.48rem] tracking-[0.28em] text-primary/50">
        {num}
      </span>

      {/* Name — Cormorant light italic; commanding through restraint */}
      <span className="mt-2 block font-serif text-lg font-light italic tracking-[0.015em] text-foreground md:text-xl">
        {name}
      </span>

      {/* Detail line — always in DOM on desktop, uncovered on hover via opacity only.
          No max-height animation: cells hold their shape; text is revealed, not revealed by expansion. */}
      <span className="mt-2 hidden font-serif text-[0.78rem] font-light italic leading-snug text-foreground/48 opacity-0 transition-opacity duration-500 ease-out md:block md:group-hover:opacity-100">
        {line}
      </span>
      <span className="mt-1.5 hidden font-mono text-[0.44rem] leading-relaxed tracking-[0.2em] text-teal/55 opacity-0 transition-opacity duration-500 delay-75 ease-out md:block md:group-hover:opacity-100">
        {detail}
      </span>

      {/* Mobile: always visible, no hover dependency */}
      <span className="mt-2 block font-serif text-[0.78rem] italic text-muted-foreground/65 md:hidden">
        {line}
      </span>
      <span className="mt-1 block font-mono text-[0.44rem] tracking-[0.16em] text-teal/55 md:hidden">
        {detail}
      </span>
    </>
  );

  const shellClass = cn(
    "group flex flex-1 flex-col items-center px-6 py-6 text-center",
    "transition-colors duration-500 hover:bg-primary/[0.04]",
    "md:items-start md:text-left md:py-8 md:px-7",
    index > 0 && "md:border-l md:border-border/[0.14]",
  );

  if (href.startsWith("#")) {
    return <a href={href} className={shellClass}>{inner}</a>;
  }

  return <Link to={href} className={shellClass}>{inner}</Link>;
}

/** Canonical trinity panel — equal dignity, glass recessive, hover uncovers not expands. */
const TrinityRow = () => (
  <div className="relative z-10 mt-10 w-full max-w-5xl px-4 sm:px-6 md:mt-14">
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-border/[0.16] bg-background/[0.16] shadow-[0_0_0_1px_hsl(var(--foreground)/0.025)_inset] backdrop-blur-xl md:flex-row"
      role="list"
      aria-label="Tríade de produto: Heaven Lab, Bridge Nova, Nexus Cria"
    >
      {TRINITY.map((item, index) => (
        <TrinityCell key={item.name} {...item} index={index} />
      ))}
    </div>
  </div>
);

export default TrinityRow;
/**
 * TrinityRow.tsx
 * The three named children of the Heaven Lab system.
 *
 * Canon: HEAVEN_LAB_REFERENCE_SURFACE.md — BLOCO 2 TRINITY
 *   - 3 nós with equal visual dignity
 *   - horizontal row, coordinated unit (not random sections)
 *   - explicit labels: Heaven Lab · Bridge Nova · Nexus Cria
 *   - staggered reveal after globe loads
 *   - hover: expand identity line
 *
 * Typography law (PRODUCT_FACE_TYPE):
 *   - Title: Syne 400 · 13px · tracking 0.14em · uppercase · gold
 *   - Identity line: Cormorant Garamond 300 italic · paper · opacity 0.72
 *   - Micro-detail: JetBrains Mono 10px · teal (hover only)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TrinityFace } from "@/lib/memory/types";

// Primary regime per face — sourced directly from routing.ts surface_hint strings.
// These are not labels; they are the operative regime of each child.
const FACE_REGIME: Record<TrinityFace, string> = {
  heaven_lab:  "hypothesis · model · evidence",
  bridge_nova: "milestone · guidance · progression",
  nexus_cria:  "artefact · produce · ship",
};

const EASE = [0.22, 1, 0.36, 1] as const;

interface Child {
  id: string;
  name: string;
  role: string;         // one-liner identity
  micro: string;        // JetBrains micro-detail (visible on hover)
  face: TrinityFace;    // maps to routing regime
  index: number;        // 1 · 2 · 3
}

const TRINITY: Child[] = [
  {
    id: "heaven-lab",
    face: "heaven_lab",
    name: "Heaven Lab",
    role: "O sistema que governa tudo",
    micro: "machine_intelligence · governance_core",
    index: 1,
  },
  {
    id: "bridge-nova",
    face: "bridge_nova",
    name: "Bridge Nova",
    role: "A ponte entre o sistema e o mundo",
    micro: "product_layer · proof_of_system",
    index: 2,
  },
  {
    id: "nexus-cria",
    face: "nexus_cria",
    name: "Nexus Cria",
    role: "O legado aberto · template replicável",
    micro: "open_architecture · autonomous_spawn",
    index: 3,
  },
];

// Map TRINITY node id → TrinityFace key (heaven-lab → heaven_lab)
function nodeIdToFace(id: string): TrinityFace {
  return id.replace(/-/g, "_") as TrinityFace;
}

interface ChildNodeProps {
  child: Child;
  delay: number;
  isActive: boolean;
}

function ChildNode({ child, delay, isActive }: ChildNodeProps) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || isActive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.7, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      className="group relative flex-1 flex flex-col items-center text-center cursor-default select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {/* Active-face ring — appears when this face is the current session face */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute inset-0 pointer-events-none"
          style={{
            border: "0.5px solid rgba(200,164,78,0.28)",
            boxShadow: "0 0 24px -8px rgba(200,164,78,0.18)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Orbital index dot */}
      <motion.div
        animate={{ opacity: lit ? 1 : 0.35 }}
        transition={{ duration: 0.3 }}
        className="mb-4 flex items-center justify-center"
      >
        <span
          className="block h-px"
          style={{
            width: "32px",
            background: hovered
              ? "hsl(42 78% 45% / 0.6)"
              : "rgba(255,255,255,0.12)",
            transition: "background 0.4s",
          }}
        />
        <span
          className="mx-3 font-mono text-[9px] tabular-nums"
          style={{
            color: hovered ? "hsl(42 78% 45% / 0.9)" : "rgba(255,255,255,0.25)",
            letterSpacing: "0.12em",
            transition: "color 0.3s",
          }}
        >
          {String(child.index).padStart(2, "0")}
        </span>
        <span
          className="block h-px"
          style={{
            width: "32px",
            background: hovered
              ? "hsl(42 78% 45% / 0.6)"
              : "rgba(255,255,255,0.12)",
            transition: "background 0.4s",
          }}
        />
      </motion.div>

      {/* Name — Syne, gold, elevated size; brightens on active face */}
      <motion.span
        animate={{ color: lit ? "hsl(42 78% 52%)" : "hsl(42 78% 45% / 0.82)" }}
        transition={{ duration: 0.35 }}
        className="block font-sans uppercase"
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.18em",
        }}
      >
        {child.name}
      </motion.span>

      {/* Identity line — Cormorant italic, more present */}
      <motion.span
        animate={{ opacity: lit ? 0.9 : 0.65 }}
        transition={{ duration: 0.35 }}
        className="mt-2.5 block font-serif leading-snug"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "15px",
          fontWeight: 300,
          fontStyle: "italic",
          color: "#e4ebf0",
          maxWidth: "200px",
        }}
      >
        {child.role}
      </motion.span>

      {/* Regime string — always visible when active; hover-only otherwise */}
      <AnimatePresence>
        {(hovered || isActive) && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-3 block font-mono text-[9px]"
            style={{
              color: isActive ? "hsl(172 48% 52% / 0.9)" : "hsl(172 48% 52% / 0.7)",
              letterSpacing: "0.06em",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {FACE_REGIME[child.face]}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Micro-detail — JetBrains Mono, hover only (deeper layer) */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="mt-1 block font-mono text-[9px]"
            style={{
              color: "rgba(200,164,78,0.45)",
              letterSpacing: "0.04em",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {child.micro}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Glass separator bottom — appears on hover */}
      <motion.div
        animate={{ scaleX: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mt-4 origin-center"
        style={{
          height: "0.5px",
          width: "60px",
          background: "hsl(42 78% 45% / 0.4)",
        }}
      />
    </motion.div>
  );
}

// Organism connector — the single visible signal that these are not three separate nodes
// but three regimes of one body. Pulses slowly; never dominates.
function OrganismConnector() {
  return (
    <div className="hidden md:flex shrink-0 flex-col items-center justify-center self-stretch" style={{ margin: "0 4px" }} aria-hidden="true">
      {/* Static glass line */}
      <div style={{ width: "0.5px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
      {/* Pulsing node — middle of the line */}
      <motion.div
        animate={{ opacity: [0.2, 0.55, 0.2], scaleY: [0.6, 1.1, 0.6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          background: "rgba(200,164,78,0.45)",
          margin: "4px 0",
          flexShrink: 0,
        }}
      />
      <div style={{ width: "0.5px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

interface TrinityRowProps {
  activeFace?: TrinityFace | null;
}

export default function TrinityRow({ activeFace }: TrinityRowProps) {
  return (
    <div>
      {/* Section anchor — orbital label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.0 }}
        className="mb-10 flex items-center justify-center gap-5"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          className="block h-px origin-right"
          style={{
            width: "80px",
            background: "linear-gradient(to right, transparent, rgba(200,164,78,0.3))",
          }}
        />
        <span
          className="font-sans text-[9px] font-[500] uppercase tracking-[0.32em]"
          style={{
            fontFamily: "Syne, system-ui, sans-serif",
            color: "rgba(200,164,78,0.55)",
          }}
        >
          Os três filhos
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          className="block h-px origin-left"
          style={{
            width: "80px",
            background: "linear-gradient(to left, transparent, rgba(200,164,78,0.3))",
          }}
        />
      </motion.div>

      {/* Trinity row — horizontal, equal dignity, elevated presence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-0 py-10 px-6 md:px-12"
        style={{
          background: "linear-gradient(135deg, rgba(200,164,78,0.03) 0%, rgba(26,107,90,0.03) 100%)",
          border: "0.5px solid rgba(200,164,78,0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 0 80px -20px rgba(200,164,78,0.06), inset 0 0.5px 0 rgba(200,164,78,0.08)",
        }}
      >
        {/* Ambient corner marks */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: "rgba(200,164,78,0.2)" }} aria-hidden="true" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: "rgba(200,164,78,0.2)" }} aria-hidden="true" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: "rgba(200,164,78,0.2)" }} aria-hidden="true" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: "rgba(200,164,78,0.2)" }} aria-hidden="true" />

        {TRINITY.map((child, i) => [
          <ChildNode
            key={child.id}
            child={child}
            delay={0.12 * i}
            isActive={activeFace ? child.face === activeFace : false}
          />,
          i < TRINITY.length - 1 && <OrganismConnector key={`conn-${i}`} />,
        ])}
      </motion.div>
    </div>
  );
}
