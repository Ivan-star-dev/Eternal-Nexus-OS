import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateMockChartData } from "@/data/mockDashboard";
import { useWorkerDownsample } from "@/hooks/useWorkerDownsample";
import { Activity, Cpu } from "lucide-react";

const CHART_LINES = [
  { key: "drilling", name: "GeoCore Depth (km)", color: "hsl(var(--accent))" },
  { key: "eiaProgress", name: "DeltaSpine EIA (%)", color: "hsl(var(--primary))" },
  { key: "conductivity", name: "Chip Conductivity (S/m)", color: "hsl(var(--teal-light))" },
] as const;

interface HistoryRow {
  project_id: string;
  metric_key: string;
  value: number;
  recorded_at: string;
}

const METRIC_MAP: Record<string, { project: string; key: string }> = {
  drilling: { project: "geocore", key: "drilling_depth" },
  eiaProgress: { project: "deltaspine", key: "eia_progress" },
  conductivity: { project: "chipfold", key: "conductivity" },
};

async function fetchRawChartData() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  const { data, error } = await supabase
    .from("metric_history")
    .select("project_id, metric_key, value, recorded_at")
    .gte("recorded_at", thirtyDaysAgo)
    .order("recorded_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return generateMockChartData();
  }

  const rows = data as unknown as HistoryRow[];

  // Group by timestamp for multi-series
  const byDate = new Map<string, Record<string, number | string>>();
  for (const row of rows) {
    const dateLabel = new Date(row.recorded_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    if (!byDate.has(dateLabel)) byDate.set(dateLabel, { date: dateLabel });
    const entry = byDate.get(dateLabel)!;

    for (const [chartKey, mapping] of Object.entries(METRIC_MAP)) {
      if (row.project_id === mapping.project && row.metric_key === mapping.key) {
        entry[chartKey] = Number(row.value);
      }
    }
  }

  return Array.from(byDate.values());
}

// Memoized tooltip
const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="border border-border bg-card/95 backdrop-blur-sm p-3 shadow-lg">
      <p className="font-mono text-[0.55rem] tracking-[0.1em] text-primary mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-mono text-[0.52rem] text-muted-foreground">
            {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(3) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});
CustomTooltip.displayName = "CustomTooltip";

function MetricsChart() {
  // Fetch raw data
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["metric-history-chart"],
    queryFn: fetchRawChartData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  // Worker-based downsampling with circuit breaker + fallback
  const { data: downsampledData, status } = useWorkerDownsample(rawData ?? [], {
    targetSize: 150,
    yKeys: ["drilling", "eiaProgress", "conductivity"],
    enabled: !!rawData && rawData.length > 150,
  });

  const renderTooltip = useCallback((props: any) => <CustomTooltip {...props} />, []);

  // Use downsampled data if available, otherwise raw
  const chartData = useMemo(() => {
    if (rawData && rawData.length <= 150) return rawData;
    if (downsampledData.length > 0) return downsampledData;
    return rawData ?? [];
  }, [rawData, downsampledData]);

  if (isLoading || chartData.length === 0) {
    return (
      <div className="border border-border bg-card p-6 h-[380px] flex items-center justify-center">
        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-muted-foreground uppercase animate-pulse">
          Loading chart…
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border border-border bg-card"
    >
      <div className="border-b border-border px-5 py-3 flex items-center justify-between">
        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary uppercase">
          30-Day Metrics Trend
        </span>
        <div className="flex items-center gap-3">
          {/* Worker status indicator */}
          {status.phase !== "idle" && status.phase !== "done" && (
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-accent animate-pulse" />
              <span className="font-mono text-[0.45rem] text-accent">
                {status.phase === "processing" ? `${status.percent}%` : status.phase}
              </span>
            </div>
          )}
          {status.usedFallback && (
            <div className="flex items-center gap-1" title="Worker unavailable — processed on main thread">
              <Activity className="w-3 h-3 text-primary/50" />
              <span className="font-mono text-[0.42rem] text-primary/50">FALLBACK</span>
            </div>
          )}
          {status.stats && (
            <span className="font-mono text-[0.42rem] text-muted-foreground/60" title={`${status.stats.originalSize} → ${status.stats.resultSize} points in ${status.stats.processingTimeMs}ms`}>
              {status.stats.reductionRatio > 0
                ? `↓${Math.round(status.stats.reductionRatio * 100)}%`
                : ""}
            </span>
          )}
          <span className="font-mono text-[0.48rem] text-muted-foreground">
            {chartData.length} points
          </span>
          <span className="font-mono text-[0.48rem] tracking-[0.1em] text-muted-foreground uppercase">
            METRIC HISTORY
          </span>
        </div>
      </div>

      <div className="p-4 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              {CHART_LINES.map((line) => (
                <linearGradient key={line.key} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={renderTooltip} />
            <Legend
              wrapperStyle={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.08em",
              }}
            />
            {CHART_LINES.map((line) => (
              <Area
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={1.5}
                fill={`url(#gradient-${line.key})`}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 1, fill: line.color }}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default memo(MetricsChart);
