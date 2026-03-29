/**
 * PortfolioMetricsPanel — V6-PORTFOLIO-DASHBOARD-001
 *
 * Aggregate portfolio KPIs: investment · CO₂ · jobs · SDG score
 * Real-time from Supabase via usePortfolioData.
 *
 * Visual law: dark base · gold mono · serif headings · same mother species as hero
 */

import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Wind, Users, Star, Activity, Clock } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { EASE_OUT } from "@/lib/motion/config";

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimCounter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 40, damping: 16, mass: 1 });
  const display = useTransform(spring, v =>
    `${prefix}${decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()}${suffix}`
  );

  if (inView) mv.set(target);

  return (
    <motion.span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </motion.span>
  );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color: string;
  subLabel?: string;
  index: number;
}

function KPICard({ icon: Icon, label, value, prefix, suffix, decimals, color, subLabel, index }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: EASE_OUT }}
      className="relative p-5 rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden group"
    >
      {/* Subtle corner accent */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at top right, ${color}18 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-md shrink-0"
          style={{ background: `${color}14`, border: `1px solid ${color}22` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[0.46rem] tracking-[0.18em] text-white/30 uppercase mb-2">
            {label}
          </p>
          <p className="font-mono text-2xl font-bold leading-none" style={{ color }}>
            <AnimCounter
              target={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          </p>
          {subLabel && (
            <p className="font-mono text-[0.42rem] tracking-[0.1em] text-white/20 uppercase mt-1.5">
              {subLabel}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Status bar ────────────────────────────────────────────────────────────────
function StatusBar({ active, pilot, planning, total }: { active: number; pilot: number; planning: number; total: number }) {
  const pctActive = total > 0 ? (active / total) * 100 : 0;
  const pctPilot = total > 0 ? (pilot / total) * 100 : 0;
  const pctPlan = total > 0 ? (planning / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
        {pctActive > 0 && (
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${pctActive}%` }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          />
        )}
        {pctPilot > 0 && (
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            style={{ width: `${pctPilot}%` }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          />
        )}
        {pctPlan > 0 && (
          <motion.div
            className="h-full bg-white/20 rounded-full"
            style={{ width: `${pctPlan}%` }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
          />
        )}
      </div>
      <div className="flex gap-4">
        {[
          { label: "Active", count: active, color: "text-emerald-400", dot: "bg-emerald-500" },
          { label: "Pilot", count: pilot, color: "text-amber-400", dot: "bg-amber-500" },
          { label: "Planning", count: planning, color: "text-white/30", dot: "bg-white/20" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <span className={`font-mono text-[0.46rem] tracking-[0.1em] uppercase ${s.color}`}>
              {s.label} {s.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PortfolioMetricsPanel() {
  const { data: kpis, isLoading, dataUpdatedAt } = usePortfolioData();

  const safe = kpis ?? {
    projectCount: 0, activeCount: 0, pilotCount: 0, planningCount: 0,
    totalInvestmentUSD: 0, totalCO2Tonnes: 0, totalJobsCreated: 0,
    avgSDGScore: 0, lastUpdated: null,
  };

  const updatedLabel = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  const kpiCards: KPICardProps[] = [
    {
      icon: TrendingUp,
      label: "Total Investment",
      value: safe.totalInvestmentUSD,
      prefix: "$",
      suffix: "M",
      decimals: 1,
      color: "#C9A84C",
      subLabel: "USD millions committed",
      index: 0,
    },
    {
      icon: Wind,
      label: "CO₂ Avoided",
      value: safe.totalCO2Tonnes,
      suffix: "t",
      decimals: 0,
      color: "#34d399",
      subLabel: "tonnes per year",
      index: 1,
    },
    {
      icon: Users,
      label: "Jobs Created",
      value: safe.totalJobsCreated,
      suffix: "",
      decimals: 0,
      color: "#60a5fa",
      subLabel: "direct employment",
      index: 2,
    },
    {
      icon: Star,
      label: "SDG Score",
      value: safe.avgSDGScore,
      suffix: "/100",
      decimals: 0,
      color: "#a78bfa",
      subLabel: "composite SDG alignment",
      index: 3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Activity className="w-3.5 h-3.5 text-gold/60" />
          <span className="font-mono text-[0.48rem] tracking-[0.24em] text-white/30 uppercase">
            Portfolio Impact
          </span>
          <span className="flex items-center gap-1 font-mono text-[0.4rem] tracking-[0.14em] uppercase px-1.5 py-0.5"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>
            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
        </div>
        {updatedLabel && (
          <div className="flex items-center gap-1 text-white/20">
            <Clock className="w-2.5 h-2.5" />
            <span className="font-mono text-[0.4rem] tracking-[0.08em]">{updatedLabel}</span>
          </div>
        )}
      </div>

      {/* KPI grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-lg bg-white/[0.02] border border-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiCards.map(card => (
            <KPICard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Project count + status bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.36, duration: 0.5, ease: EASE_OUT }}
        className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.46rem] tracking-[0.16em] text-white/30 uppercase">
            {safe.projectCount} project{safe.projectCount !== 1 ? "s" : ""} · portfolio overview
          </span>
        </div>
        <StatusBar
          active={safe.activeCount}
          pilot={safe.pilotCount}
          planning={safe.planningCount}
          total={safe.projectCount}
        />
      </motion.div>
    </motion.div>
  );
}
