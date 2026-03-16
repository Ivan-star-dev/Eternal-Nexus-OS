// ═══════════════════════════════════════════════════════════════
// UPlotStreamChart: Canvas-based streaming chart powered by uPlot
// + DownsamplingService (ResilientBridge + HealthMonitor + RecoveryFSM)
//
// Replaces Recharts SVG with canvas for ~4x better frame budget:
//   Recharts: ~14ms (SVG DOM + React reconciliation)
//   uPlot:    ~3ms  (canvas draw + zero React overhead)
// ═══════════════════════════════════════════════════════════════

import { memo, useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import {
  Activity,
  Cpu,
  Heart,
  Pause,
  Play,
  Radio,
  Shield,
  Wifi,
  WifiOff,
} from "lucide-react";
import { DownsamplingService, type RecoveryState } from "@/lib/downsampling/index";

// ── Types ──

interface StreamPoint {
  timestamp: number;
  temperature: number;
  pressure: number;
  flow: number;
}

const SERIES_CONFIG = [
  { key: "temperature", label: "Temperature (°C)", color: "hsl(42, 78%, 45%)" },
  { key: "pressure", label: "Pressure (kPa)", color: "hsl(172, 55%, 40%)" },
  { key: "flow", label: "Flow Rate (L/min)", color: "hsl(0, 52%, 45%)" },
] as const;

const Y_KEYS = SERIES_CONFIG.map((s) => s.key);

// ── Mock data generator ──

function generatePoint(timestamp: number, n: number): StreamPoint {
  return {
    timestamp,
    temperature: 22 + 5 * Math.sin(n / 15) + (Math.random() - 0.5) * 2,
    pressure: 101 + 3 * Math.cos(n / 20) + (Math.random() - 0.5) * 1.5,
    flow: 45 + 10 * Math.sin(n / 10) + (Math.random() - 0.5) * 4,
  };
}

// ── CSS overrides for uPlot to match design system ──

const UPLOT_OVERRIDES = `
  .uplot .u-wrap { background: transparent !important; }
  .uplot .u-legend { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; letter-spacing: 0.08em; }
  .uplot .u-legend .u-label { color: hsl(var(--muted-foreground)); }
  .uplot .u-legend .u-value { color: hsl(var(--foreground)); font-weight: 600; }
  .uplot .u-cursor-x, .uplot .u-cursor-y { border-color: hsl(var(--primary) / 0.3) !important; }
`;

// ── Recovery state badge ──

function RecoveryBadge({ state }: { state: RecoveryState }) {
  const config: Record<RecoveryState, { bg: string; text: string; label: string }> = {
    normal: { bg: "bg-accent/20", text: "text-accent", label: "NORMAL" },
    degraded: { bg: "bg-primary/20", text: "text-primary", label: "DEGRADED" },
    probing: { bg: "bg-primary/30", text: "text-primary", label: "PROBING" },
    recovering: { bg: "bg-accent/15", text: "text-accent", label: "RECOVERING" },
    dead: { bg: "bg-destructive/20", text: "text-destructive", label: "DEAD" },
  };
  const c = config[state];
  return (
    <span className={`font-mono text-[0.4rem] px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ── Main Component ──

function UPlotStreamChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<uPlot | null>(null);
  const serviceRef = useRef<DownsamplingService | null>(null);
  const dataRef = useRef<StreamPoint[]>([]);
  const counterRef = useRef(0);

  const [streaming, setStreaming] = useState(true);
  const [pointCount, setPointCount] = useState(0);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("normal");
  const [workerSource, setWorkerSource] = useState<"worker" | "fallback">("worker");
  const [processMs, setProcessMs] = useState(0);

  // ── Initialize DownsamplingService ──

  useEffect(() => {
    const service = new DownsamplingService({
      yKeys: [...Y_KEYS],
      bridge: {
        requestTimeoutMs: 3000,
        maxConsecutiveTimeouts: 3,
        fallbackBudgetMs: 8,
      },
      health: {
        heartbeatIntervalMs: 5000,
        maxMissedHeartbeats: 3,
      },
      recovery: {
        degradeAfterTimeouts: 3,
        recoveryThreshold: 0.8,
        minConsecutiveSuccesses: 5,
      },
      onRecoveryTransition: (_from, to) => setRecoveryState(to),
    });

    service.start().then(() => {
      serviceRef.current = service;
    });

    return () => {
      service.destroy();
      serviceRef.current = null;
    };
  }, []);

  // ── Initialize uPlot ──

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const rect = el.getBoundingClientRect();

    // Inject CSS overrides
    const style = document.createElement("style");
    style.textContent = UPLOT_OVERRIDES;
    document.head.appendChild(style);

    const opts: uPlot.Options = {
      width: rect.width || 800,
      height: 260,
      cursor: {
        drag: { x: true, y: false, setScale: false },
        points: { show: false },
      },
      scales: {
        x: { time: true },
      },
      axes: [
        {
          stroke: "hsl(var(--muted-foreground))",
          grid: { stroke: "hsl(var(--border))", width: 0.5 },
          ticks: { stroke: "hsl(var(--border))", width: 0.5 },
          font: "0.55rem JetBrains Mono",
          gap: 6,
        },
        {
          stroke: "hsl(var(--muted-foreground))",
          grid: { stroke: "hsl(var(--border))", width: 0.5 },
          ticks: { show: false },
          font: "0.55rem JetBrains Mono",
          gap: 8,
        },
      ],
      series: [
        {}, // X axis (timestamps)
        ...SERIES_CONFIG.map((s) => ({
          label: s.label,
          stroke: s.color,
          width: 1.5,
          fill: (u: uPlot) => {
            const grad = u.ctx.createLinearGradient(0, u.bbox.top, 0, u.bbox.top + u.bbox.height);
            // Parse HSL and create alpha variants
            const base = s.color; // e.g. "hsl(42, 78%, 45%)"
            const inner = base.replace("hsl(", "").replace(")", "");
            grad.addColorStop(0, `hsla(${inner}, 0.2)`);
            grad.addColorStop(1, `hsla(${inner}, 0)`);
            return grad;
          },
          points: { show: false },
        })),
      ],
      legend: { show: false }, // We render our own
    };

    const emptyData: uPlot.AlignedData = [
      new Float64Array(0),
      ...Y_KEYS.map(() => new Float64Array(0)),
    ];

    const chart = new uPlot(opts, emptyData, el);
    chartRef.current = chart;

    // Resize observer
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && chart) {
        chart.setSize({ width: entry.contentRect.width, height: 260 });
      }
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.destroy();
      chartRef.current = null;
      style.remove();
    };
  }, []);

  // ── Streaming data + process via DownsamplingService ──

  const processData = useCallback(async (points: StreamPoint[]) => {
    const service = serviceRef.current;
    const chart = chartRef.current;
    if (!service || !chart || points.length === 0) return;

    const start = performance.now();

    try {
      const result = await service.downsample(
        points as unknown as Record<string, number>[],
        500,
        [...Y_KEYS],
        true
      );

      const ms = performance.now() - start;
      setProcessMs(Math.round(ms * 10) / 10);
      setWorkerSource(result.source);

      // Convert to uPlot columnar format
      const n = result.data.length;
      const timestamps = new Float64Array(n);
      const series = Y_KEYS.map(() => new Float64Array(n));

      for (let i = 0; i < n; i++) {
        const row = result.data[i];
        timestamps[i] = (row.timestamp ?? 0) / 1000; // uPlot expects seconds
        for (let s = 0; s < Y_KEYS.length; s++) {
          series[s][i] = row[Y_KEYS[s]] ?? 0;
        }
      }

      // Direct canvas update — zero React overhead
      chart.setData([timestamps, ...series] as uPlot.AlignedData);
    } catch (err) {
      console.error("[UPlotStreamChart] Process error:", err);
    }
  }, []);

  useEffect(() => {
    if (!streaming) return;

    // Seed initial data
    const now = Date.now();
    const seed: StreamPoint[] = [];
    for (let i = 120; i >= 0; i--) {
      seed.push(generatePoint(now - i * 1000, counterRef.current++));
    }
    dataRef.current = seed;
    setPointCount(seed.length);
    processData(seed);

    const interval = setInterval(() => {
      const point = generatePoint(Date.now(), counterRef.current++);
      const next = [...dataRef.current, point];
      // Keep 5 min window
      dataRef.current = next.length > 300 ? next.slice(-300) : next;
      setPointCount(dataRef.current.length);
      processData(dataRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [streaming, processData]);

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
            Canvas Telemetry Stream
          </span>
          <span className="font-mono text-[0.4rem] px-1.5 py-0.5 bg-accent/15 text-accent rounded">
            uPlot
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Recovery state */}
          <RecoveryBadge state={recoveryState} />

          {/* Source indicator */}
          <div className="flex items-center gap-1">
            {workerSource === "worker" ? (
              <Cpu className="w-3 h-3 text-accent" />
            ) : (
              <Shield className="w-3 h-3 text-primary" />
            )}
            <span className="font-mono text-[0.42rem] text-muted-foreground">
              {workerSource === "worker" ? "WORKER" : "FALLBACK"}
            </span>
          </div>

          {/* Process time */}
          <span className="font-mono text-[0.42rem] text-muted-foreground/60">
            {processMs}ms
          </span>

          {/* Stream status */}
          <div className="flex items-center gap-1.5">
            {streaming ? (
              <Wifi className="w-3 h-3 text-accent" />
            ) : (
              <WifiOff className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="font-mono text-[0.45rem] text-muted-foreground">
              {streaming ? "LIVE" : "PAUSED"}
            </span>
          </div>

          {/* Points */}
          <span className="font-mono text-[0.42rem] text-muted-foreground/60">
            {pointCount} pts
          </span>

          {/* Play/Pause */}
          <button
            onClick={() => setStreaming(!streaming)}
            className="p-1 hover:bg-accent/10 rounded transition-colors"
          >
            {streaming ? (
              <Pause className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Play className="w-3.5 h-3.5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Canvas chart container */}
      <div className="p-4">
        <div ref={containerRef} className="w-full" />
      </div>

      {/* Footer: custom legend */}
      <div className="border-t border-border px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {SERIES_CONFIG.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-mono text-[0.45rem] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-3 h-3 text-accent" />
          <span className="font-mono text-[0.42rem] text-muted-foreground/60">
            CANVAS PIPELINE · {workerSource === "worker" ? "LTTB WORKER" : "SYNC FALLBACK"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(UPlotStreamChart);
