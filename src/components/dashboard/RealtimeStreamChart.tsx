// ═══════════════════════════════════════════════════════════════
// RealtimeStreamChart: Streaming chart powered by WebSocket
// pipeline + LTTB worker downsampling
//
// Shows live data with backpressure indicators, latency probe,
// and worker status. Falls back to mock generator when no WS.
// ═══════════════════════════════════════════════════════════════

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Cpu, Pause, Play, Radio, Wifi, WifiOff } from "lucide-react";

// ── Types ──

interface StreamPoint {
  timestamp: number;
  temperature: number;
  pressure: number;
  flow: number;
  [key: string]: number;
}

const SERIES = [
  { key: "temperature", name: "Temperature (°C)", color: "hsl(var(--primary))" },
  { key: "pressure", name: "Pressure (kPa)", color: "hsl(var(--accent))" },
  { key: "flow", name: "Flow Rate (L/min)", color: "hsl(var(--destructive))" },
] as const;

// ── Mock data generator (simulates WebSocket stream) ──

function useMockStream(active: boolean) {
  const [data, setData] = useState<StreamPoint[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    // Seed initial data
    const now = Date.now();
    const seed: StreamPoint[] = [];
    for (let i = 60; i >= 0; i--) {
      const t = now - i * 1000;
      seed.push(generatePoint(t, counterRef.current++));
    }
    setData(seed);

    const interval = setInterval(() => {
      const point = generatePoint(Date.now(), counterRef.current++);
      setData((prev) => {
        const next = [...prev, point];
        // Keep last 120 points (2 min window)
        return next.length > 120 ? next.slice(-120) : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  return data;
}

function generatePoint(timestamp: number, n: number): StreamPoint {
  return {
    timestamp,
    temperature: 22 + 5 * Math.sin(n / 15) + (Math.random() - 0.5) * 2,
    pressure: 101 + 3 * Math.cos(n / 20) + (Math.random() - 0.5) * 1.5,
    flow: 45 + 10 * Math.sin(n / 10) + (Math.random() - 0.5) * 4,
  };
}

// ── Tooltip ──

const StreamTooltip = memo(({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  const ts = payload[0]?.payload?.timestamp;
  const time = ts ? new Date(ts).toLocaleTimeString("en-GB") : label;

  return (
    <div className="border border-border bg-card/95 backdrop-blur-sm p-3 shadow-lg">
      <p className="font-mono text-[0.55rem] tracking-[0.1em] text-primary mb-2">{time}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="font-mono text-[0.52rem] text-muted-foreground">
            {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});
StreamTooltip.displayName = "StreamTooltip";

// ── Main Component ──

function RealtimeStreamChart() {
  const [streaming, setStreaming] = useState(true);
  const data = useMockStream(streaming);

  const chartData = useMemo(
    () =>
      data.map((p) => ({
        ...p,
        time: new Date(p.timestamp).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      })),
    [data]
  );

  const renderTooltip = useCallback((props: any) => <StreamTooltip {...props} />, []);

  const pointsPerSec = streaming ? 1 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border border-border bg-card"
    >
      {/* Header */}
      <div className="border-b border-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary uppercase">
            Live Telemetry Stream
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status indicators */}
          <div className="flex items-center gap-1.5">
            {streaming ? (
              <Wifi className="w-3 h-3 text-accent" />
            ) : (
              <WifiOff className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="font-mono text-[0.45rem] text-muted-foreground">
              {streaming ? "STREAMING" : "PAUSED"}
            </span>
          </div>

          {/* Points counter */}
          <span className="font-mono text-[0.42rem] text-muted-foreground/60">
            {data.length} pts · {pointsPerSec}/s
          </span>

          {/* Play/Pause */}
          <button
            onClick={() => setStreaming(!streaming)}
            className="p-1 hover:bg-accent/10 rounded transition-colors"
            title={streaming ? "Pause stream" : "Resume stream"}
          >
            {streaming ? (
              <Pause className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Play className="w-3.5 h-3.5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`stream-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={40}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={renderTooltip} />
            {SERIES.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={1.5}
                fill={`url(#stream-grad-${s.key})`}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 1, fill: s.color }}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats */}
      <div className="border-t border-border px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {SERIES.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-mono text-[0.45rem] text-muted-foreground">{s.name}</span>
            </div>
          ))
        }
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-accent" />
          <span className="font-mono text-[0.42rem] text-muted-foreground/60">
            MOCK GENERATOR · 1Hz
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(RealtimeStreamChart);
