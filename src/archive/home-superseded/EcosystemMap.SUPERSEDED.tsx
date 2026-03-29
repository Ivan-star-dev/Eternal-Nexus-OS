/**
 * EcosystemMap.tsx — V8 Ecosystem Convergence
 * Shows Eternal Nexus OS as one node in a shared multi-product infrastructure.
 * sacred-flow: V8 | CONVERGENCE_LAYER | 2026-03-23
 */

import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeStatus = "ACTIVE" | "CONNECTED" | "IN DEVELOPMENT";

interface ProductNode {
  id: string;
  name: string;
  tagline: string;
  status: NodeStatus;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRODUCT_NODES: ProductNode[] = [
  {
    id: "eternal-nexus-os",
    name: "ETERNAL NEXUS OS",
    tagline: "World Operating System",
    status: "ACTIVE",
    position: "center",
  },
  {
    id: "timeless-terminal",
    name: "TIMELESS TERMINAL",
    tagline: "Chronicle of human progress. Temporal intelligence layer.",
    status: "CONNECTED",
    position: "top-left",
  },
  {
    id: "neural-mesh",
    name: "NEURAL MESH",
    tagline: "Distributed intelligence network. Cross-product knowledge graph.",
    status: "CONNECTED",
    position: "top-right",
  },
  {
    id: "atlas-engine",
    name: "ATLAS ENGINE",
    tagline: "Geographic computation. World data at resolution.",
    status: "IN DEVELOPMENT",
    position: "bottom-left",
  },
  {
    id: "nexus-parliament",
    name: "NEXUS PARLIAMENT",
    tagline: "AI-assisted democratic deliberation. Collective intelligence.",
    status: "IN DEVELOPMENT",
    position: "bottom-right",
  },
];

const DNA_PILLS: string[] = [
  "BRANCH PROTOCOL",
  "PIONEER MATRIX",
  "CANONICAL IDENTITY",
  "OUTPUT STANDARD",
  "V10 LINE",
  "DNA PROTOCOL",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNodeClasses(status: NodeStatus): string {
  const base = "rounded-sm p-4 flex flex-col gap-2 transition-colors duration-300";
  if (status === "ACTIVE") {
    return `${base} bg-gold/[0.04] border border-gold/40`;
  }
  if (status === "CONNECTED") {
    return `${base} bg-ink-medium/60 border border-white/[0.12]`;
  }
  // IN DEVELOPMENT
  return `${base} bg-ink-medium/60 border border-white/[0.05] opacity-70`;
}

function getStatusBadgeClasses(status: NodeStatus): string {
  const base = "inline-block font-mono text-[0.42rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm border";
  if (status === "ACTIVE") {
    return `${base} text-gold bg-gold/10 border-gold/30`;
  }
  if (status === "CONNECTED") {
    return `${base} text-emerald-400 bg-emerald-500/10 border-emerald-500/30`;
  }
  return `${base} text-blue-400 bg-blue-500/10 border-blue-500/30`;
}

function getStatusDot(status: NodeStatus): string {
  if (status === "ACTIVE") return "text-gold";
  if (status === "CONNECTED") return "text-emerald-400";
  return "text-blue-400";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NodeCard({ node, index }: { node: ProductNode; index: number }) {
  const isCenter = node.position === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={`${getNodeClasses(node.status)} ${isCenter ? "md:col-start-2 md:row-start-2" : ""}`}
    >
      {/* Status dot + badge row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[0.6rem] leading-none ${getStatusDot(node.status)}`}>●</span>
        <span className={getStatusBadgeClasses(node.status)}>{node.status}</span>
      </div>

      {/* Product name */}
      <p
        className={`font-mono text-[0.55rem] tracking-[0.22em] uppercase font-medium ${
          isCenter ? "text-gold" : "text-paper"
        }`}
      >
        {node.name}
      </p>

      {/* Tagline */}
      <p className="text-[0.65rem] font-light text-paper-dim/60 leading-relaxed">
        {node.tagline}
      </p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EcosystemMap() {
  // Separate center node from surrounding nodes for layout purposes
  const centerNode = PRODUCT_NODES.find((n) => n.position === "center")!;
  const surroundingNodes = PRODUCT_NODES.filter((n) => n.position !== "center");

  return (
    <section className="w-full bg-black/80 border-y border-white/[0.04] py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 flex flex-col gap-4"
        >
          {/* Section label + badge */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-mono text-[0.5rem] tracking-[0.28em] text-paper-dim/40 uppercase">
              ECOSYSTEM · V8
            </span>
            <span className="font-mono text-[0.42rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm border border-gold/30 text-gold bg-gold/10">
              CONVERGENCE LAYER
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-3xl md:text-4xl font-light text-paper leading-tight">
            "One DNA. Many Expressions."
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-paper-dim/60 font-light leading-relaxed max-w-2xl">
            Eternal Nexus OS is one node in a shared infrastructure. Each product carries the same
            canonical identity, protocol, and intelligence.
          </p>
        </motion.div>

        {/* ── Product Nodes — Desktop: cross grid / Mobile: single column ── */}

        {/* Mobile layout */}
        <div className="flex flex-col gap-3 md:hidden">
          {[centerNode, ...surroundingNodes].map((node, index) => (
            <NodeCard key={node.id} node={node} index={index} />
          ))}
        </div>

        {/* Desktop layout: 3×3 grid, center in (2,2), corners in (1,1)(1,3)(3,1)(3,3) */}
        <div className="hidden md:grid grid-cols-3 grid-rows-3 gap-3">
          {/* Top-left: TIMELESS TERMINAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 1 * 0.08, ease: "easeOut" }}
            className={`${getNodeClasses(surroundingNodes[0].status)} col-start-1 row-start-1`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[0.6rem] leading-none ${getStatusDot(surroundingNodes[0].status)}`}>●</span>
              <span className={getStatusBadgeClasses(surroundingNodes[0].status)}>{surroundingNodes[0].status}</span>
            </div>
            <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase font-medium text-paper">
              {surroundingNodes[0].name}
            </p>
            <p className="text-[0.65rem] font-light text-paper-dim/60 leading-relaxed">
              {surroundingNodes[0].tagline}
            </p>
          </motion.div>

          {/* Top-center: spacer */}
          <div className="col-start-2 row-start-1" />

          {/* Top-right: NEURAL MESH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 2 * 0.08, ease: "easeOut" }}
            className={`${getNodeClasses(surroundingNodes[1].status)} col-start-3 row-start-1`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[0.6rem] leading-none ${getStatusDot(surroundingNodes[1].status)}`}>●</span>
              <span className={getStatusBadgeClasses(surroundingNodes[1].status)}>{surroundingNodes[1].status}</span>
            </div>
            <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase font-medium text-paper">
              {surroundingNodes[1].name}
            </p>
            <p className="text-[0.65rem] font-light text-paper-dim/60 leading-relaxed">
              {surroundingNodes[1].tagline}
            </p>
          </motion.div>

          {/* Middle-left: spacer */}
          <div className="col-start-1 row-start-2" />

          {/* Center: ETERNAL NEXUS OS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0 * 0.08, ease: "easeOut" }}
            className={`${getNodeClasses(centerNode.status)} col-start-2 row-start-2`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[0.6rem] leading-none ${getStatusDot(centerNode.status)}`}>●</span>
              <span className={getStatusBadgeClasses(centerNode.status)}>{centerNode.status}</span>
            </div>
            <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase font-medium text-gold">
              {centerNode.name}
            </p>
            <p className="text-[0.65rem] font-light text-paper-dim/60 leading-relaxed">
              {centerNode.tagline}
            </p>
          </motion.div>

          {/* Middle-right: spacer */}
          <div className="col-start-3 row-start-2" />

          {/* Bottom-left: ATLAS ENGINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 3 * 0.08, ease: "easeOut" }}
            className={`${getNodeClasses(surroundingNodes[2].status)} col-start-1 row-start-3`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[0.6rem] leading-none ${getStatusDot(surroundingNodes[2].status)}`}>●</span>
              <span className={getStatusBadgeClasses(surroundingNodes[2].status)}>{surroundingNodes[2].status}</span>
            </div>
            <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase font-medium text-paper">
              {surroundingNodes[2].name}
            </p>
            <p className="text-[0.65rem] font-light text-paper-dim/60 leading-relaxed">
              {surroundingNodes[2].tagline}
            </p>
          </motion.div>

          {/* Bottom-center: spacer */}
          <div className="col-start-2 row-start-3" />

          {/* Bottom-right: NEXUS PARLIAMENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 4 * 0.08, ease: "easeOut" }}
            className={`${getNodeClasses(surroundingNodes[3].status)} col-start-3 row-start-3`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[0.6rem] leading-none ${getStatusDot(surroundingNodes[3].status)}`}>●</span>
              <span className={getStatusBadgeClasses(surroundingNodes[3].status)}>{surroundingNodes[3].status}</span>
            </div>
            <p className="font-mono text-[0.55rem] tracking-[0.22em] uppercase font-medium text-paper">
              {surroundingNodes[3].name}
            </p>
            <p className="text-[0.65rem] font-light text-paper-dim/60 leading-relaxed">
              {surroundingNodes[3].tagline}
            </p>
          </motion.div>
        </div>

        {/* ── Shared DNA Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-12 flex flex-col gap-4"
        >
          <p className="font-mono text-[0.45rem] tracking-[0.24em] text-paper-dim/40 uppercase text-center">
            SHARED INFRASTRUCTURE · CANONICAL ACROSS ALL PRODUCTS
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DNA_PILLS.map((pill) => (
              <span
                key={pill}
                className="font-mono text-[0.45rem] tracking-[0.2em] border border-white/[0.08] px-3 py-1 text-paper-dim/50 uppercase rounded-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Section Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          className="mt-10"
        >
          <p className="font-mono text-[0.48rem] tracking-[0.28em] text-paper-dim/30 uppercase text-center">
            ETERNAL NEXUS ECOSYSTEM · 5 PRODUCTS · 1 DNA · NEXT PATH INFRASTRUCTURE AUTHORITY
          </p>
        </motion.div>
      </div>
    </section>
  );
}
