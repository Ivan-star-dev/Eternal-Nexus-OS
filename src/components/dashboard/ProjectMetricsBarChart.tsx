import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ProjectMetric } from "@/types/dashboard";

interface ProjectMetricsBarChartProps {
  metrics: ProjectMetric[];
}

const PROJECT_COLORS: Record<string, string> = {
  deltaspine: "hsl(42 78% 45%)",
  geocore: "hsl(172 55% 28%)",
  terralenta: "hsl(16 25% 46%)",
  chipfold: "hsl(174 60% 41%)",
  fusion: "hsl(232 48% 56%)",
};

const PROJECT_LABELS: Record<string, string> = {
  deltaspine: "DeltaSpine",
  geocore: "GeoCore",
  terralenta: "Terra Lenta",
  chipfold: "Chip Fold",
  fusion: "Fusion Core",
};

// Key metrics to display (one per project for the bar chart)
const KEY_METRICS: Record<string, { key: string; label: string }> = {
  deltaspine: { key: "eia_progress", label: "EIA Progress" },
  geocore: { key: "drilling_depth", label: "Drilling Depth" },
  terralenta: { key: "model_runs", label: "Model Runs" },
  chipfold: { key: "flex_cycles", label: "Flex Cycles" },
  fusion: { key: "integration_score", label: "Integration" },
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="border border-border bg-card/95 backdrop-blur-sm p-3 shadow-lg">
      <p className="font-serif text-sm font-bold text-foreground mb-1">{d.project}</p>
      <p className="font-mono text-[0.55rem] text-muted-foreground">
        {d.metricLabel}: <span className="text-primary">{d.displayValue}</span>
      </p>
    </div>
  );
}

export default function ProjectMetricsBarChart({ metrics }: ProjectMetricsBarChartProps) {
  const chartData = Object.entries(KEY_METRICS)
    .map(([projectId, info]) => {
      const metric = metrics.find(
        (m) => m.project_id === projectId && m.metric_key === info.key
      );
      if (!metric) return null;
      return {
        project: PROJECT_LABELS[projectId] || projectId,
        projectId,
        value: Number(metric.metric_value),
        displayValue: `${Number(metric.metric_value)} ${metric.unit}`,
        metricLabel: info.label,
        color: PROJECT_COLORS[projectId] || "hsl(var(--primary))",
      };
    })
    .filter(Boolean);

  if (chartData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border border-border bg-card"
    >
      <div className="border-b border-border px-5 py-3 flex items-center justify-between">
        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary uppercase">
          Key Metrics by Project
        </span>
        <span className="font-mono text-[0.48rem] tracking-[0.1em] text-muted-foreground uppercase">
          PRIMARY KPI
        </span>
      </div>
      <div className="p-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(216 30% 15%)"
              vertical={false}
            />
            <XAxis
              dataKey="project"
              tick={{ fontSize: 9, fill: "hsl(210 15% 50%)", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={{ stroke: "hsl(216 30% 15%)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(210 15% 50%)", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(216 30% 15% / 0.3)" }} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={48}>
              {chartData.map((entry: any, index: number) => (
                <Cell key={index} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
