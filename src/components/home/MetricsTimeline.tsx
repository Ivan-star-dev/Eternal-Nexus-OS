/**
 * MetricsTimeline.tsx — PLv8.1 · Historical World Bank data chart
 * Builds a custom SVG line chart (no external chart libs) for country-level
 * macro indicators over the last 30 years.
 *
 * sacred-flow: PLv8.1 | WorkFunction | 2026-03-22
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DataPoint {
  year: string;
  value: number | null;
}

interface TooltipState {
  x: number;
  y: number;
  year: string;
  value: number;
  visible: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COUNTRIES: Array<{ iso2: string; label: string }> = [
  { iso2: "us", label: "United States" },
  { iso2: "cn", label: "China" },
  { iso2: "de", label: "Germany" },
  { iso2: "jp", label: "Japan" },
  { iso2: "gb", label: "United Kingdom" },
  { iso2: "fr", label: "France" },
  { iso2: "in", label: "India" },
  { iso2: "br", label: "Brazil" },
  { iso2: "ng", label: "Nigeria" },
  { iso2: "za", label: "South Africa" },
  { iso2: "pt", label: "Portugal" },
  { iso2: "nl", label: "Netherlands" },
];

const INDICATORS: Array<{ code: string; label: string; unit: string }> = [
  { code: "NY.GDP.MKTP.CD", label: "GDP (current USD)", unit: "USD" },
  { code: "EN.ATM.CO2E.PC", label: "CO₂ per capita", unit: "t/cap" },
  { code: "SP.POP.TOTL", label: "Population", unit: "people" },
];

const CHART_W = 580;
const CHART_H = 160;
const PADDING = { top: 16, right: 16, bottom: 28, left: 42 };

// ─── Fetch helper ────────────────────────────────────────────────────────────

async function fetchHistoricalIndicator(
  iso2: string,
  indicator: string
): Promise<DataPoint[]> {
  try {
    const url =
      `https://api.worldbank.org/v2/country/${encodeURIComponent(iso2)}` +
      `/indicator/${encodeURIComponent(indicator)}` +
      `?format=json&mrv=30&per_page=30`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const payload: [unknown, unknown[]] = await res.json();
    const entries = Array.isArray(payload[1]) ? payload[1] : [];

    const points: DataPoint[] = (entries as Array<{ date: string; value: number | null }>)
      .map((e) => ({
        year: e.date ?? "",
        value: typeof e.value === "number" ? e.value : null,
      }))
      .filter((d) => d.year !== "")
      .sort((a, b) => Number(a.year) - Number(b.year));

    return points;
  } catch {
    return [];
  }
}

// ─── Format helper ────────────────────────────────────────────────────────────

function formatValue(value: number, unit: string): string {
  if (unit === "USD") {
    const abs = Math.abs(value);
    if (abs >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (abs >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
    if (abs >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  }
  if (unit === "people") {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    return value.toLocaleString();
  }
  return `${value.toFixed(2)} ${unit}`;
}

// ─── SVG Chart ───────────────────────────────────────────────────────────────

interface ChartProps {
  data: DataPoint[];
  unit: string;
  onHover: (tip: TooltipState) => void;
}

function LineChart({ data, unit, onHover }: ChartProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [animated, setAnimated] = useState(false);

  const validPoints = data.filter((d): d is { year: string; value: number } => d.value !== null);

  const maxVal = validPoints.length > 0 ? Math.max(...validPoints.map((d) => d.value)) : 1;
  const minVal = validPoints.length > 0 ? Math.min(...validPoints.map((d) => d.value)) : 0;
  const range = maxVal - minVal || 1;

  const plotW = CHART_W - PADDING.left - PADDING.right;
  const plotH = CHART_H - PADDING.top - PADDING.bottom;

  const xScale = (idx: number, total: number) =>
    PADDING.left + (idx / Math.max(total - 1, 1)) * plotW;

  const yScale = (value: number) =>
    PADDING.top + plotH - ((value - minVal) / range) * plotH;

  const allYears = validPoints.map((d) => d.year);
  const firstYear = allYears.length > 0 ? Number(allYears[0]) : 1994;
  const lastYear = allYears.length > 0 ? Number(allYears[allYears.length - 1]) : 2023;

  const xFromYear = (year: string) => {
    const span = lastYear - firstYear || 1;
    return PADDING.left + ((Number(year) - firstYear) / span) * plotW;
  };

  // Build SVG path
  const pathD =
    validPoints.length < 2
      ? ""
      : validPoints
          .map((d, i) => {
            const x = xFromYear(d.year);
            const y = yScale(d.value);
            return `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ");

  // Measure path length after mount/update
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      setAnimated(false);
      // Small delay to trigger animation
      const t = requestAnimationFrame(() => setAnimated(true));
      return () => cancelAnimationFrame(t);
    }
  }, [pathD]);

  // Y-axis gridlines (3 lines: 25%, 50%, 75%)
  const gridLines = [0.25, 0.5, 0.75].map((frac) => ({
    y: PADDING.top + plotH * (1 - frac),
    label: formatValue(minVal + range * frac, unit),
  }));

  // X-axis year labels (every 5 years)
  const xLabels: string[] = [];
  for (let yr = Math.ceil(firstYear / 5) * 5; yr <= lastYear; yr += 5) {
    xLabels.push(String(yr));
  }

  const handleCircleEnter = useCallback(
    (e: React.MouseEvent<SVGCircleElement>, d: { year: string; value: number }) => {
      const svgEl = (e.currentTarget as SVGElement).closest("svg");
      if (!svgEl) return;
      const rect = svgEl.getBoundingClientRect();
      const cx = xFromYear(d.year);
      const cy = yScale(d.value);
      const scaleX = rect.width / CHART_W;
      const scaleY = rect.height / CHART_H;
      onHover({
        visible: true,
        x: cx * scaleX,
        y: cy * scaleY - 8,
        year: d.year,
        value: d.value,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validPoints]
  );

  const handleCircleLeave = useCallback(() => {
    onHover({ visible: false, x: 0, y: 0, year: "", value: 0 });
  }, [onHover]);

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      width="100%"
      height={CHART_H}
      style={{ overflow: "visible" }}
      aria-label="Historical indicator line chart"
      role="img"
    >
      {/* Gridlines */}
      {gridLines.map((gl) => (
        <g key={gl.y}>
          <line
            x1={PADDING.left}
            y1={gl.y}
            x2={CHART_W - PADDING.right}
            y2={gl.y}
            stroke="hsl(var(--border) / 0.3)"
            strokeWidth="0.5"
            strokeDasharray="3 4"
          />
          <text
            x={PADDING.left - 4}
            y={gl.y}
            textAnchor="end"
            dominantBaseline="middle"
            fill="hsl(var(--muted-foreground) / 0.45)"
            fontSize="7"
            fontFamily="var(--font-mono, monospace)"
          >
            {gl.label}
          </text>
        </g>
      ))}

      {/* X-axis base line */}
      <line
        x1={PADDING.left}
        y1={PADDING.top + plotH}
        x2={CHART_W - PADDING.right}
        y2={PADDING.top + plotH}
        stroke="hsl(var(--border) / 0.25)"
        strokeWidth="0.5"
      />

      {/* X-axis year labels */}
      {xLabels.map((yr) => (
        <text
          key={yr}
          x={xFromYear(yr)}
          y={PADDING.top + plotH + 10}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground) / 0.4)"
          fontSize="7"
          fontFamily="var(--font-mono, monospace)"
        >
          {yr}
        </text>
      ))}

      {/* Line path — animated dash */}
      {pathD && (
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="hsl(42 78% 45%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength > 0 ? pathLength : undefined}
          strokeDashoffset={
            pathLength > 0 ? (animated ? 0 : pathLength) : undefined
          }
          style={{
            transition: pathLength > 0 ? "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)" : undefined,
          }}
        />
      )}

      {/* Data circles */}
      {validPoints.map((d) => (
        <circle
          key={d.year}
          cx={xFromYear(d.year)}
          cy={yScale(d.value)}
          r="2"
          fill="hsl(42 78% 45%)"
          stroke="hsl(var(--background))"
          strokeWidth="0.8"
          style={{ cursor: "pointer" }}
          onMouseEnter={(e) => handleCircleEnter(e, d)}
          onMouseLeave={handleCircleLeave}
        />
      ))}
    </svg>
  );
}

// ─── MetricsTimeline component ───────────────────────────────────────────────

export default function MetricsTimeline() {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0]);
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    year: "",
    value: 0,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData([]);

    fetchHistoricalIndicator(selectedCountry.iso2, selectedIndicator.code).then(
      (points) => {
        if (!cancelled) {
          setData(points);
          setLoading(false);
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [selectedCountry, selectedIndicator]);

  const validCount = data.filter((d) => d.value !== null).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="bg-ink-medium/60 border border-white/[0.05] rounded-sm backdrop-blur-sm p-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
          Historical Indicators · World Bank
        </span>

        <div className="flex flex-wrap items-center gap-3">
          {/* Country selector */}
          <div className="relative">
            <select
              value={selectedCountry.iso2}
              onChange={(e) => {
                const c = COUNTRIES.find((c) => c.iso2 === e.target.value);
                if (c) setSelectedCountry(c);
              }}
              className="appearance-none font-mono text-[0.6rem] tracking-[0.1em] bg-background/60 border border-white/[0.08] text-muted-foreground px-3 py-1.5 pr-6 rounded-sm focus:outline-none focus:border-gold/40 transition-colors duration-200 cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.iso2} value={c.iso2}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-[0.5rem]">
              ▾
            </span>
          </div>

          {/* Indicator selector */}
          <div className="relative">
            <select
              value={selectedIndicator.code}
              onChange={(e) => {
                const ind = INDICATORS.find((i) => i.code === e.target.value);
                if (ind) setSelectedIndicator(ind);
              }}
              className="appearance-none font-mono text-[0.6rem] tracking-[0.1em] bg-background/60 border border-white/[0.08] text-muted-foreground px-3 py-1.5 pr-6 rounded-sm focus:outline-none focus:border-gold/40 transition-colors duration-200 cursor-pointer"
            >
              {INDICATORS.map((ind) => (
                <option key={ind.code} value={ind.code}>
                  {ind.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-[0.5rem]">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="font-mono text-[0.52rem] tracking-[0.2em] text-muted-foreground/50 uppercase animate-pulse">
              Fetching historical record…
            </span>
          </div>
        )}

        {!loading && validCount === 0 && (
          <div className="flex items-center justify-center h-[160px]">
            <span className="font-mono text-[0.52rem] tracking-[0.2em] text-muted-foreground/40 uppercase">
              No observable data · indicator absent
            </span>
          </div>
        )}

        {!loading && validCount > 0 && (
          <div className="relative" style={{ opacity: loading ? 0.3 : 1 }}>
            <LineChart
              data={data}
              unit={selectedIndicator.unit}
              onHover={setTooltip}
            />

            {/* Tooltip */}
            {tooltip.visible && (
              <div
                className="pointer-events-none absolute z-20 bg-background/90 border border-white/[0.1] backdrop-blur-sm px-2 py-1 rounded-sm -translate-x-1/2 -translate-y-full"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                <div className="font-mono text-[0.52rem] tracking-[0.1em] text-gold/80">
                  {tooltip.year}
                </div>
                <div className="font-mono text-[0.55rem] text-foreground">
                  {formatValue(tooltip.value, selectedIndicator.unit)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer meta */}
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[0.44rem] tracking-[0.18em] text-muted-foreground/30 uppercase">
          Source · World Bank Open Data
        </span>
        {validCount > 0 && (
          <span className="font-mono text-[0.44rem] tracking-[0.18em] text-muted-foreground/30 uppercase">
            {validCount} data points
          </span>
        )}
      </div>
    </motion.div>
  );
}
