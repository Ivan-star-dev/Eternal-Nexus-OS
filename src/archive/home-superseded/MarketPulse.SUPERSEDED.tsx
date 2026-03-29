/**
 * MarketPulse.tsx — V12 Real-Time World
 * Live-feeling macro market indicators strip with simulated price fluctuations.
 * Updates every 3 seconds with ±0.1–0.5% random fluctuation per indicator.
 * sacred-flow: V12 | MARKET_LAYER | 2026-03-23
 */

"use client";

import { useEffect, useState, useRef } from "react";

// ─── types ────────────────────────────────────────────────────────────────────

interface Indicator {
  id: string;
  name: string;
  base: number;
  value: number;
  change: number;
  history: number[];
  decimals: number;
  prefix?: string;
  suffix?: string;
}

// ─── initial data ─────────────────────────────────────────────────────────────

const INITIAL_INDICATORS: Omit<Indicator, "value" | "change" | "history">[] = [
  { id: "sp500",    name: "S&P 500",   base: 5847.23,  decimals: 2 },
  { id: "eurusd",   name: "EUR/USD",   base: 1.0832,   decimals: 4 },
  { id: "gold",     name: "Gold (XAU)", base: 2341.50, decimals: 2 },
  { id: "btc",      name: "BTC/USD",   base: 67420.00, decimals: 2 },
  { id: "oil",      name: "Crude Oil", base: 78.34,    decimals: 2 },
  { id: "ust10y",   name: "10Y UST",   base: 4.28,     decimals: 2, suffix: "%" },
  { id: "vix",      name: "VIX",       base: 18.4,     decimals: 1 },
  { id: "dxy",      name: "DXY",       base: 104.2,    decimals: 1 },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildInitialIndicator(
  def: Omit<Indicator, "value" | "change" | "history">
): Indicator {
  const history = Array.from({ length: 8 }, () => def.base);
  return {
    ...def,
    value: def.base,
    change: 0,
    history,
  };
}

function randomFluctuation(base: number): number {
  const pct = (Math.random() * 0.4 + 0.1) / 100; // 0.1–0.5%
  const sign = Math.random() > 0.5 ? 1 : -1;
  return base * pct * sign;
}

function formatValue(ind: Indicator): string {
  const prefix = ind.prefix ?? "";
  const suffix = ind.suffix ?? "";
  return `${prefix}${ind.value.toFixed(ind.decimals)}${suffix}`;
}

// ─── sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const W = 40;
  const H = 16;
  const step = W / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── indicator card ───────────────────────────────────────────────────────────

function IndicatorCard({ ind }: { ind: Indicator }) {
  const isPositive = ind.change >= 0;
  const changeColor = isPositive ? "text-emerald-400" : "text-rose-400";
  const changeSign = isPositive ? "+" : "";

  return (
    <div className="flex flex-col gap-1 min-w-[130px] px-4 py-3 border-r border-white/[0.04] last:border-r-0">
      <span className="text-[10px] font-medium tracking-wider text-white/40 uppercase">
        {ind.name}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-semibold text-white/90 tabular-nums">
          {formatValue(ind)}
        </span>
        <Sparkline values={ind.history} />
      </div>
      <span className={`text-[10px] font-mono tabular-nums ${changeColor}`}>
        {changeSign}{ind.change.toFixed(2)}%
      </span>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function MarketPulse() {
  const [indicators, setIndicators] = useState<Indicator[]>(() =>
    INITIAL_INDICATORS.map(buildInitialIndicator)
  );

  const prevValuesRef = useRef<number[]>(
    INITIAL_INDICATORS.map((d) => d.base)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators((prev) =>
        prev.map((ind, i) => {
          const prevValue = prevValuesRef.current[i];
          const delta = randomFluctuation(ind.base);
          const newValue = prevValue + delta;
          const change = ((newValue - ind.base) / ind.base) * 100;

          const newHistory = [...ind.history.slice(1), newValue];
          prevValuesRef.current[i] = newValue;

          return {
            ...ind,
            value: newValue,
            change,
            history: newHistory,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      aria-label="Market Pulse"
      className="border-y border-white/[0.04] bg-ink-medium/10 py-4 px-6 md:px-16"
    >
      {/* header label */}
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase">
          MARKET PULSE · V12 · LIVE SIMULATION
        </span>
      </div>

      {/* indicators — horizontal scroll on mobile, grid on desktop */}
      <div className="overflow-x-auto">
        <div className="flex md:grid md:grid-cols-4 divide-x divide-white/[0.04] min-w-max md:min-w-0">
          {indicators.map((ind) => (
            <IndicatorCard key={ind.id} ind={ind} />
          ))}
        </div>
      </div>
    </section>
  );
}
