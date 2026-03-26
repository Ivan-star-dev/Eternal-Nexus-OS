/**
 * TrinityRow.tsx — MONUMENTAL PORTALS v3 · PREMIUM REBUILD
 *
 * Three sovereign entrances. Each a world.
 * All children of the same mother — the Globe.
 *
 * @antigravity — architecture and presence
 * @framer — motion language and atmosphere
 * @cursor — technical fidelity
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { TrinityFace } from "@/lib/memory/types";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Portal {
  id: string;
  face: TrinityFace;
  index: number;
  pillarLabel: string;
  regimeWord: string;
  identity: string;
  subtext: string;
  tags: string;
  path: string;
  atmosphereA: string;
  atmosphereB: string;
  atmosphereC: string;
  accentColor: string;
  accentRgb: string;
  borderAccent: string;
  name: string;
}

const PORTALS: Portal[] = [
  {
    id: "heaven-lab",
    face: "heaven_lab",
    index: 1,
    pillarLabel: "SCHOOL",
    regimeWord: "Past",
    identity: "Where memory becomes understanding.",
    subtext: "The archive of what was studied, observed, and retained. Knowledge distilled into system.",
    tags: "study · understand · remember · archive",
    path: "/nexus",
    atmosphereA: "radial-gradient(ellipse 80% 60% at 20% 15%, hsl(42 78% 45% / 0.18) 0%, transparent 65%)",
    atmosphereB: "radial-gradient(ellipse 60% 80% at 85% 90%, hsl(36 65% 35% / 0.12) 0%, transparent 60%)",
    atmosphereC: "radial-gradient(ellipse 100% 40% at 50% 50%, hsl(42 78% 45% / 0.04) 0%, transparent 70%)",
    accentColor: "hsl(42 78% 58%)",
    accentRgb: "200,164,78",
    borderAccent: "rgba(200,164,78,0.35)",
    name: "Heaven Lab",
  },
  {
    id: "bridge-nova",
    face: "bridge_nova",
    index: 2,
    pillarLabel: "LAB",
    regimeWord: "Present",
    identity: "Where reality is placed under examination.",
    subtext: "Active investigation. Live data. Models that reflect the world as it moves right now.",
    tags: "observe · investigate · model · verify",
    path: "/atlas",
    atmosphereA: "radial-gradient(ellipse 80% 60% at 20% 15%, hsl(172 55% 28% / 0.18) 0%, transparent 65%)",
    atmosphereB: "radial-gradient(ellipse 60% 80% at 85% 90%, hsl(172 48% 20% / 0.1) 0%, transparent 60%)",
    atmosphereC: "radial-gradient(ellipse 100% 40% at 50% 50%, hsl(190 60% 20% / 0.06) 0%, transparent 70%)",
    accentColor: "hsl(172 55% 55%)",
    accentRgb: "38,190,150",
    borderAccent: "rgba(32,153,120,0.35)",
    name: "Bridge Nova",
  },
  {
    id: "nexus-cria",
    face: "nexus_cria",
    index: 3,
    pillarLabel: "CREATION HUB",
    regimeWord: "Future",
    identity: "Where systems gain form and authorship takes root.",
    subtext: "The construction layer. Ideas enter here as possibility; they leave as architecture.",
    tags: "design · build · ship · author",
    path: "/founder",
    atmosphereA: "radial-gradient(ellipse 80% 60% at 20% 15%, hsl(38 80% 42% / 0.16) 0%, transparent 65%)",
    atmosphereB: "radial-gradient(ellipse 60% 80% at 85% 90%, hsl(28 60% 30% / 0.12) 0%, transparent 60%)",
    atmosphereC: "radial-gradient(ellipse 100% 40% at 50% 50%, hsl(38 80% 38% / 0.05) 0%, transparent 70%)",
    accentColor: "hsl(38 80% 58%)",
    accentRgb: "200,150,60",
    borderAccent: "rgba(180,130,50,0.35)",
    name: "Nexus Cria",
  },
];

function PortalNode({ portal, delay, isActive }: { portal: Portal; delay: number; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || isActive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 1.1, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col select-none overflow-hidden cursor-pointer"
      style={{
        minHeight: "clamp(600px, 78vh, 900px)",
        padding: "clamp(36px, 4.5vw, 68px) clamp(28px, 4.5vw, 64px)",
        background: "#060c14",
      }}
    >
      {/* ── Rich atmosphere ── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: lit ? 1 : 0.45 }}
        transition={{ duration: 0.7 }}
        aria-hidden="true"
        style={{ background: `${portal.atmosphereA}, ${portal.atmosphereB}, ${portal.atmosphereC}` }}
      />

      {/* ── Noise texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Top border with animated progress ── */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 overflow-hidden" aria-hidden="true" style={{ height: "1px" }}>
        <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${portal.borderAccent}, transparent)`, opacity: 0.5 }} />
        <motion.div
          animate={{ scaleX: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "1px",
            background: `linear-gradient(to right, transparent 0%, ${portal.accentColor} 40%, ${portal.accentColor} 60%, transparent 100%)`,
            transformOrigin: "left",
            boxShadow: `0 0 12px 0 rgba(${portal.accentRgb}, 0.6)`,
          }}
        />
      </div>

      {/* ── Corner marks ── */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: portal.borderAccent, opacity: lit ? 0.8 : 0.3, transition: "opacity 0.4s" }} aria-hidden="true" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: portal.borderAccent, opacity: lit ? 0.4 : 0.12, transition: "opacity 0.4s" }} aria-hidden="true" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: portal.borderAccent, opacity: lit ? 0.3 : 0.08, transition: "opacity 0.4s" }} aria-hidden="true" />

      {/* ── Index + pillar label ── */}
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: `rgba(${portal.accentRgb}, 0.3)`, letterSpacing: "0.1em" }}>
          {String(portal.index).padStart(2, "0")}
        </span>
        <motion.span
          animate={{ color: lit ? portal.accentColor : `rgba(${portal.accentRgb}, 0.5)` }}
          transition={{ duration: 0.4 }}
          style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase" }}
        >
          {portal.pillarLabel}
        </motion.span>
      </div>

      {/* ── Separator ── */}
      <motion.div
        animate={{ opacity: lit ? 0.4 : 0.1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-14"
        style={{ height: "0.5px", background: `linear-gradient(to right, rgba(${portal.accentRgb}, 0.5), transparent 70%)` }}
      />

      {/* ── REGIME WORD — the monument ── */}
      <motion.span
        animate={{ opacity: lit ? 0.9 : 0.32, x: lit ? 0 : -4 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative z-10 block leading-none"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: "clamp(80px, 10vw, 120px)",
          fontWeight: 300,
          fontStyle: "italic",
          color: "#e8eef4",
          letterSpacing: "-0.03em",
          marginBottom: "clamp(28px, 3.5vw, 48px)",
          textShadow: lit ? `0 0 80px rgba(${portal.accentRgb}, 0.15)` : "none",
          transition: "text-shadow 0.6s",
        }}
      >
        {portal.regimeWord}
      </motion.span>

      {/* ── Identity ── */}
      <motion.p
        animate={{ opacity: lit ? 0.88 : 0.5 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 leading-relaxed"
        style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "clamp(13px, 1.4vw, 16px)", fontWeight: 400, color: "#dde6ef", maxWidth: "360px", marginBottom: "14px" }}
      >
        {portal.identity}
      </motion.p>

      {/* ── Subtext ── */}
      <motion.p
        animate={{ opacity: lit ? 0.52 : 0.22 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 leading-relaxed"
        style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "12px", color: "#c5d4df", maxWidth: "320px", lineHeight: "1.85", marginBottom: "auto" }}
      >
        {portal.subtext}
      </motion.p>

      {/* ── Tags ── */}
      <motion.span
        animate={{ opacity: lit ? 0.6 : 0.22 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 block mt-10"
        style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", letterSpacing: "0.2em", color: portal.accentColor, marginBottom: "28px" }}
      >
        {portal.tags}
      </motion.span>

      {/* ── CTA ── */}
      <Link to={portal.path} className="relative z-10 inline-flex items-center gap-3 group" tabIndex={0}>
        <motion.div
          animate={{ width: lit ? 48 : 28, opacity: lit ? 1 : 0.4 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ height: "0.5px", background: portal.accentColor }}
        />
        <motion.span
          animate={{ color: lit ? portal.accentColor : `rgba(${portal.accentRgb}, 0.5)`, x: lit ? 2 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          Enter {portal.index === 3 ? "Creation Hub" : portal.pillarLabel.charAt(0) + portal.pillarLabel.slice(1).toLowerCase()}
        </motion.span>
        <motion.span
          animate={{ x: lit ? 4 : 0, opacity: lit ? 1 : 0.4 }}
          transition={{ duration: 0.35 }}
          style={{ fontSize: "16px", color: portal.accentColor, lineHeight: 1 }}
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  );
}

function PortalDivider() {
  return (
    <div
      className="hidden md:block flex-shrink-0 self-stretch"
      style={{ width: "0.5px", background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.05) 80%, transparent 100%)" }}
      aria-hidden="true"
    />
  );
}

interface TrinityRowProps {
  activeFace?: TrinityFace | null;
}

export default function TrinityRow({ activeFace }: TrinityRowProps) {
  return (
    <div>
      {/* ── Section label ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2 }}
        className="mb-6 flex items-center justify-center gap-6"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 1.0, ease: EASE }}
          className="block h-px origin-right"
          style={{ width: "120px", background: "linear-gradient(to right, transparent, rgba(200,164,78,0.2))" }}
        />
        <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(200,164,78,0.3)", whiteSpace: "nowrap" }}>
          OS TRÊS PILARES
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 1.0, ease: EASE }}
          className="block h-px origin-left"
          style={{ width: "120px", background: "linear-gradient(to left, transparent, rgba(200,164,78,0.2))" }}
        />
      </motion.div>

      {/* ── Three monumental portals ── */}
      <div className="relative flex flex-col md:flex-row w-full overflow-hidden" style={{ background: "#060c14" }}>
        {PORTALS.map((portal, i) => (
          <div key={portal.id} className="flex-1 flex flex-col md:flex-row">
            <PortalNode
              portal={portal}
              delay={0.12 * i}
              isActive={activeFace ? portal.face === activeFace : false}
            />
            {i < PORTALS.length - 1 && <PortalDivider />}
          </div>
        ))}
      </div>
    </div>
  );
}
