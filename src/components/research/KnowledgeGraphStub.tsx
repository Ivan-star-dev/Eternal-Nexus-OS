/**
 * KnowledgeGraphStub.tsx
 * Designed stub for the Knowledge Graph — visual placeholder with 8 connected nodes.
 * Full interactive graph deferred to V6.
 *
 * Canon: V5-RESEARCH-IMPL-001 · K-07 IMPL · K-08 PIPELINE
 * @cursor | 2026-03-27
 */

import { motion } from "framer-motion";

// ─── Node definitions ─────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  cx: number;
  cy: number;
  radius: number;
  color: string;
}

interface GraphEdge {
  from: string;
  to: string;
}

const NODES: GraphNode[] = [
  { id: "climate",        label: "Climate",        cx: 200, cy: 90,  radius: 28, color: "#00aaff" },
  { id: "water",          label: "Water",           cx: 320, cy: 155, radius: 22, color: "#00e5a0" },
  { id: "energy",         label: "Energy",          cx: 290, cy: 270, radius: 26, color: "#fbbf24" },
  { id: "food",           label: "Food",            cx: 170, cy: 310, radius: 22, color: "#a78bfa" },
  { id: "health",         label: "Health",          cx: 75,  cy: 230, radius: 24, color: "#ff6b35" },
  { id: "education",      label: "Education",       cx: 95,  cy: 130, radius: 20, color: "#f472b6" },
  { id: "infrastructure", label: "Infra",           cx: 330, cy: 60,  radius: 20, color: "#60a5fa" },
  { id: "governance",     label: "Governance",      cx: 200, cy: 200, radius: 30, color: "#c8a44e" },
];

// Hub-and-spoke + cross connections
const EDGES: GraphEdge[] = [
  { from: "governance", to: "climate" },
  { from: "governance", to: "water" },
  { from: "governance", to: "energy" },
  { from: "governance", to: "food" },
  { from: "governance", to: "health" },
  { from: "governance", to: "education" },
  { from: "governance", to: "infrastructure" },
  { from: "climate",    to: "water" },
  { from: "climate",    to: "infrastructure" },
  { from: "water",      to: "food" },
  { from: "energy",     to: "infrastructure" },
  { from: "health",     to: "food" },
  { from: "education",  to: "health" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNode(id: string): GraphNode | undefined {
  return NODES.find((n) => n.id === id);
}

// ─── Animated edge ────────────────────────────────────────────────────────────

interface EdgeProps {
  edge: GraphEdge;
  index: number;
}

function GraphEdgeEl({ edge, index }: EdgeProps) {
  const from = getNode(edge.from);
  const to = getNode(edge.to);
  if (!from || !to) return null;

  return (
    <motion.line
      x1={from.cx}
      y1={from.cy}
      x2={to.cx}
      y2={to.cy}
      stroke="rgba(0,170,255,0.14)"
      strokeWidth={0.8}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.7, ease: "easeOut" }}
    />
  );
}

// ─── Animated node ────────────────────────────────────────────────────────────

interface NodeProps {
  node: GraphNode;
  index: number;
}

function GraphNodeEl({ node, index }: NodeProps) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.1 + index * 0.07,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
    >
      {/* Outer glow ring */}
      <circle
        cx={node.cx}
        cy={node.cy}
        r={node.radius + 7}
        fill="none"
        stroke={node.color}
        strokeWidth={0.5}
        opacity={0.18}
      />
      {/* Core circle */}
      <circle
        cx={node.cx}
        cy={node.cy}
        r={node.radius}
        fill={`${node.color}18`}
        stroke={node.color}
        strokeWidth={1}
        opacity={0.85}
      />
      {/* Pulse ring — animated */}
      <motion.circle
        cx={node.cx}
        cy={node.cy}
        r={node.radius}
        fill="none"
        stroke={node.color}
        strokeWidth={1.5}
        opacity={0}
        animate={{
          r: [node.radius, node.radius + 14],
          opacity: [0.35, 0],
        }}
        transition={{
          delay: 0.8 + index * 0.15,
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeOut",
        }}
      />
      {/* Label */}
      <text
        x={node.cx}
        y={node.cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: node.radius > 24 ? "7px" : "6.5px",
          fill: node.color,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
          pointerEvents: "none",
        }}
      >
        {node.label}
      </text>
    </motion.g>
  );
}

// ─── KnowledgeGraphStub ───────────────────────────────────────────────────────

export default function KnowledgeGraphStub() {
  return (
    <div
      style={{
        background: "#060c14",
        border: "1px solid rgba(0,170,255,0.1)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
        minHeight: "420px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.28em",
              color: "rgba(0,170,255,0.5)",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Knowledge Graph
          </span>
          <span
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "rgba(228,235,240,0.7)",
            }}
          >
            Nexus Intelligence Map
          </span>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#00aaff",
            }}
          />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              letterSpacing: "0.2em",
              color: "rgba(228,235,240,0.2)",
              textTransform: "uppercase",
            }}
          >
            8 nodes
          </span>
        </motion.div>
      </div>

      {/* SVG canvas */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,170,255,0.03) 0%, transparent 70%)",
        }}
      >
        {/* Subtle grid */}
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="kg-grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="rgba(255,255,255,0.018)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kg-grid)" />
        </svg>

        {/* Graph SVG */}
        <svg
          viewBox="0 0 410 370"
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          role="img"
          aria-label="Knowledge graph: 8 interconnected nodes representing research domains"
        >
          {/* Edges — rendered first (below nodes) */}
          <g>
            {EDGES.map((edge, i) => (
              <GraphEdgeEl key={`${edge.from}-${edge.to}`} edge={edge} index={i} />
            ))}
          </g>

          {/* Nodes */}
          <g>
            {NODES.map((node, i) => (
              <GraphNodeEl key={node.id} node={node} index={i} />
            ))}
          </g>
        </svg>
      </div>

      {/* Footer label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "12px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(200,164,78,0.5)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.2em",
            color: "rgba(228,235,240,0.2)",
            textTransform: "uppercase",
          }}
        >
          Full Graph Coming in V6
        </span>
      </motion.div>
    </div>
  );
}
