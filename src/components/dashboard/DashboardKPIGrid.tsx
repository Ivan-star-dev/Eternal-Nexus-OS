import { motion } from "framer-motion";
import { Activity, Zap, Shield, TrendingUp } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import type { ProjectMetric, ProjectProgressEntry } from "@/types/dashboard";

interface DashboardKPIGridProps {
  metrics: ProjectMetric[];
  progress: ProjectProgressEntry[];
}

export default function DashboardKPIGrid({ metrics, progress }: DashboardKPIGridProps) {
  const activeProjects = new Set(progress.filter((p) => p.status === "active").map((p) => p.project_id)).size;
  const totalPhases = progress.length;
  const completedPhases = progress.filter((p) => p.status === "complete").length;
  const avgProgress = progress.length
    ? Math.round(progress.reduce((sum, p) => sum + Number(p.progress), 0) / progress.length)
    : 0;

  const kpis = [
    { label: "ACTIVE PROJECTS", value: activeProjects, suffix: "", icon: Activity, color: "text-primary" },
    { label: "PHASES TRACKED", value: totalPhases, suffix: "", icon: Shield, color: "text-accent-foreground" },
    { label: "COMPLETED", value: completedPhases, suffix: "", icon: Zap, color: "text-green-400" },
    { label: "AVG PROGRESS", value: avgProgress, suffix: "%", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="bg-card p-5 md:p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            <span className="font-mono text-[0.5rem] tracking-[0.15em] text-muted-foreground uppercase">
              {kpi.label}
            </span>
          </div>
          <div className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            <AnimatedCounter value={`${kpi.value}${kpi.suffix}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
