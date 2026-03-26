import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { EASE_OUT } from "@/lib/motion/config";
import {
import { EASE_OUT } from "@/lib/motion/config";
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  DollarSign,
  BarChart3,
} from "lucide-react";

// ═══════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════

interface InvestmentProject {
  id: string;
  name: string;
  region: string;
  color: string;
  investment: string;
  roi: string;
  timeline: string;
  status: "active" | "pilot" | "planning";
  progress: number;
}

interface ProjectMetricsProps {
  projects: InvestmentProject[];
}

// ═══════════════════════════════════════════════
// Animated Stat Counter (inline — minimal, dark-theme)
// ═══════════════════════════════════════════════

interface StatCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

function StatCounter({ target, suffix = "", prefix = "", decimals = 0, className }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 45, damping: 18, mass: 1 });
  const display = useTransform(spring, (v) => {
    const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    return `${prefix}${formatted}${suffix}`;
  });

  if (isInView) {
    motionValue.set(target);
  }

  return (
    <motion.span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </motion.span>
  );
}

// ═══════════════════════════════════════════════
// Recharts custom tooltip — dark theme
// ═══════════════════════════════════════════════

interface TooltipPayloadItem {
  payload: {
    name: string;
    progress: number;
    investment: string;
    status: string;
    color: string;
  };
  value: number;
}

function DarkTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d0d24]/95 backdrop-blur-md p-3 shadow-xl text-xs">
      <p className="font-semibold text-white mb-1" style={{ color: d.color }}>
        {d.name}
      </p>
      <p className="font-mono text-[0.6rem] text-white/50">
        Progress: <span className="text-white/80">{d.progress}%</span>
      </p>
      <p className="font-mono text-[0.6rem] text-white/50">
        Investment: <span className="text-white/80">{d.investment}</span>
      </p>
      <p className="font-mono text-[0.6rem] text-white/50">
        Status:{" "}
        <span
          className={
            d.status === "active"
              ? "text-green-400"
              : d.status === "pilot"
              ? "text-amber-400"
              : "text-white/40"
          }
        >
          {d.status}
        </span>
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Status Donut — pure CSS/Tailwind
// ═══════════════════════════════════════════════

interface StatusDonutProps {
  active: number;
  pilot: number;
  planning: number;
  total: number;
}

function StatusDonut({ active, pilot, planning, total }: StatusDonutProps) {
  const segments: { label: string; count: number; color: string; bg: string }[] = [
    { label: "Active", count: active, color: "text-green-400", bg: "bg-green-500" },
    { label: "Pilot", count: pilot, color: "text-amber-400", bg: "bg-amber-500" },
    { label: "Planning", count: planning, color: "text-white/40", bg: "bg-white/20" },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* CSS segmented bar as donut substitute */}
      <div className="h-2 rounded-full overflow-hidden flex w-full gap-0.5">
        {segments.map((seg) => {
          const pct = total > 0 ? (seg.count / total) * 100 : 0;
          return pct > 0 ? (
            <motion.div
              key={seg.label}
              className={`h-full rounded-full ${seg.bg}`}
              style={{ width: `${pct}%` }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            />
          ) : null;
        })}
      </div>
      {/* Legend */}
      <div className="flex gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${seg.bg}`} />
            <span className={`text-[0.55rem] font-mono ${seg.color}`}>
              {seg.label} ({seg.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Recent Activity Timeline
// ═══════════════════════════════════════════════

interface TimelineEntry {
  id: string;
  name: string;
  status: "active" | "pilot" | "planning";
  progress: number;
  color: string;
  region: string;
}

function ActivityTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.07, duration: 0.45 }}
          className="flex items-start gap-3 group"
        >
          {/* Timeline dot + line */}
          <div className="flex flex-col items-center pt-1 shrink-0">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: entry.color,
                boxShadow: `0 0 0 2px #08081a, 0 0 0 3px ${entry.color}`,
              }}
            />
            {i < entries.length - 1 && (
              <div className="w-px h-6 mt-1 bg-white/5" />
            )}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[0.65rem] font-medium text-white/80 truncate">
                {entry.name}
              </span>
              <span className="text-[0.55rem] font-mono text-white/30 shrink-0">
                {entry.region}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {/* Mini progress bar */}
              <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: entry.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${entry.progress}%` }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.6 }}
                />
              </div>
              <span className="text-[0.5rem] font-mono text-white/30">{entry.progress}%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// Main ProjectMetrics Component
// ═══════════════════════════════════════════════

export default function ProjectMetrics({ projects }: ProjectMetricsProps) {
  // Derive aggregate stats
  const total = projects.length;
  const activeCount = projects.filter((p) => p.status === "active").length;
  const pilotCount = projects.filter((p) => p.status === "pilot").length;
  const planningCount = projects.filter((p) => p.status === "planning").length;
  const avgProgress =
    total > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / total)
      : 0;

  // Chart data — progress per project
  const chartData = projects.map((p) => ({
    name: p.name,
    progress: p.progress,
    investment: p.investment,
    status: p.status,
    color: p.color,
  }));

  // Timeline — sorted by progress descending (most active first)
  const timelineEntries: TimelineEntry[] = [...projects]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      progress: p.progress,
      color: p.color,
      region: p.region,
    }));

  // KPI cards config
  const kpis = [
    {
      icon: BarChart3,
      label: "Total",
      value: total,
      suffix: "",
      prefix: "",
      decimals: 0,
      color: "text-violet-400",
    },
    {
      icon: Activity,
      label: "Active",
      value: activeCount,
      suffix: "",
      prefix: "",
      decimals: 0,
      color: "text-green-400",
    },
    {
      icon: Clock,
      label: "Pilot",
      value: pilotCount,
      suffix: "",
      prefix: "",
      decimals: 0,
      color: "text-amber-400",
    },
    {
      icon: TrendingUp,
      label: "Avg %",
      value: avgProgress,
      suffix: "%",
      prefix: "",
      decimals: 0,
      color: "text-cyan-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="space-y-4"
    >
      {/* ── Section header ── */}
      <div className="flex items-center gap-2 px-1">
        <DollarSign className="h-3.5 w-3.5 text-violet-400" />
        <span className="text-[0.55rem] uppercase tracking-[0.2em] text-white/30 font-mono">
          Portfolio Analytics
        </span>
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[0.5rem] font-mono text-white/20">
          {total} projects · live
        </span>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-4 gap-1.5">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <kpi.icon className={`h-3 w-3 ${kpi.color}`} />
              <span className="text-[0.5rem] uppercase tracking-[0.12em] text-white/30 font-mono">
                {kpi.label}
              </span>
            </div>
            <div className={`text-xl font-bold font-mono ${kpi.color}`}>
              <StatCounter
                target={kpi.value}
                suffix={kpi.suffix}
                prefix={kpi.prefix}
                decimals={kpi.decimals}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Status Distribution ── */}
      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="h-3 w-3 text-white/30" />
          <span className="text-[0.5rem] uppercase tracking-[0.12em] text-white/30 font-mono">
            Status Distribution
          </span>
        </div>
        <StatusDonut
          active={activeCount}
          pilot={pilotCount}
          planning={planningCount}
          total={total}
        />
      </div>

      {/* ── Progress Bar Chart ── */}
      <div className="rounded-lg bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/5">
          <BarChart3 className="h-3 w-3 text-violet-400" />
          <span className="text-[0.5rem] uppercase tracking-[0.12em] text-white/30 font-mono">
            Progress by Project
          </span>
        </div>
        <div className="h-[140px] px-1 py-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 7,
                  fill: "rgba(255,255,255,0.25)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 7,
                  fill: "rgba(255,255,255,0.25)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                content={<DarkTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="progress" radius={[2, 2, 0, 0]} maxBarSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Activity Timeline ── */}
      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-1.5 mb-3">
          <Activity className="h-3 w-3 text-white/30" />
          <span className="text-[0.5rem] uppercase tracking-[0.12em] text-white/30 font-mono">
            Recent Activity
          </span>
        </div>
        <ActivityTimeline entries={timelineEntries} />
      </div>
    </motion.div>
  );
}
