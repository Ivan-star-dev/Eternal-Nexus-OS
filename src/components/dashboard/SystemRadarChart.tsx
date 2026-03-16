import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SystemStatusEntry } from "@/types/dashboard";

interface SystemRadarChartProps {
  services: SystemStatusEntry[];
}

export default function SystemRadarChart({ services }: SystemRadarChartProps) {
  const chartData = services.map((s) => ({
    service: s.service_name.replace(" / ", "/"),
    uptime: Number(s.uptime_pct),
    latency: Math.max(0, 100 - Number(s.latency_ms) * 0.3), // Normalize: lower latency = higher score
  }));

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
          System Health Radar
        </span>
        <span className="font-mono text-[0.48rem] tracking-[0.1em] text-muted-foreground uppercase">
          UPTIME + LATENCY
        </span>
      </div>
      <div className="p-4 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(216 30% 15%)" />
            <PolarAngleAxis
              dataKey="service"
              tick={{
                fontSize: 8,
                fill: "hsl(210 15% 50%)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[90, 100]}
              tick={{ fontSize: 8, fill: "hsl(210 15% 40%)", fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
            />
            <Radar
              name="Uptime %"
              dataKey="uptime"
              stroke="hsl(172 55% 28%)"
              fill="hsl(172 55% 28%)"
              fillOpacity={0.2}
              strokeWidth={1.5}
            />
            <Radar
              name="Perf Score"
              dataKey="latency"
              stroke="hsl(42 78% 45%)"
              fill="hsl(42 78% 45%)"
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
            <Tooltip
              contentStyle={{
                background: "hsl(216 50% 8%)",
                border: "1px solid hsl(216 30% 20%)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.6rem",
              }}
              itemStyle={{ color: "hsl(210 25% 80%)" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
