import { useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { Activity, TrendingUp, DollarSign } from "lucide-react";

interface DataOceanSources {
  noaa?: { status: string; records?: { period: string; anomaly: number }[] };
  worldbank_co2?: { status: string; records?: { country: string; countryCode: string; year: number; co2PerCapita: number }[] };
  worldbank_gdp?: { status: string; records?: { country: string; countryCode: string; year: number; gdpPerCapita: number }[] };
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--destructive))",
  "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
];

const chartTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "0.6rem",
  fontFamily: "monospace",
  color: "hsl(var(--foreground))",
};

export default function DataCharts({ sources }: { sources: DataOceanSources }) {
  const noaaData = useMemo(() => {
    if (sources.noaa?.status !== "ok" || !sources.noaa.records) return [];
    return sources.noaa.records.map((r) => ({
      period: r.period,
      anomaly: r.anomaly,
    }));
  }, [sources.noaa]);

  const co2Data = useMemo(() => {
    if (sources.worldbank_co2?.status !== "ok" || !sources.worldbank_co2.records) return [];
    const latest: Record<string, { country: string; co2: number }> = {};
    for (const r of sources.worldbank_co2.records) {
      if (!latest[r.countryCode] || r.year > (latest[r.countryCode] as any).year) {
        latest[r.countryCode] = { country: r.country, co2: r.co2PerCapita };
        (latest[r.countryCode] as any).year = r.year;
      }
    }
    return Object.values(latest).sort((a, b) => b.co2 - a.co2);
  }, [sources.worldbank_co2]);

  const gdpData = useMemo(() => {
    if (sources.worldbank_gdp?.status !== "ok" || !sources.worldbank_gdp.records) return [];
    const latest: Record<string, { country: string; gdp: number }> = {};
    for (const r of sources.worldbank_gdp.records) {
      if (!latest[r.countryCode] || r.year > (latest[r.countryCode] as any).year) {
        latest[r.countryCode] = { country: r.country, gdp: Math.round(r.gdpPerCapita) };
        (latest[r.countryCode] as any).year = r.year;
      }
    }
    return Object.values(latest).sort((a, b) => b.gdp - a.gdp);
  }, [sources.worldbank_gdp]);

  if (!noaaData.length && !co2Data.length && !gdpData.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {/* NOAA Temperature Anomaly */}
      {noaaData.length > 0 && (
        <div className="bg-card border border-border/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-destructive" />
            <span className="font-mono text-[0.5rem] tracking-wider text-muted-foreground uppercase">
              Global Temp Anomaly (°C)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={noaaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="period" tick={{ fontSize: 8, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} interval={Math.floor(noaaData.length / 5)} />
              <YAxis tick={{ fontSize: 8, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} domain={["auto", "auto"]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line type="monotone" dataKey="anomaly" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* CO2 Emissions by Country */}
      {co2Data.length > 0 && (
        <div className="bg-card border border-border/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[0.5rem] tracking-wider text-muted-foreground uppercase">
              CO₂ Per Capita (tons)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={co2Data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" tick={{ fontSize: 8, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 7, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} width={80} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="co2" radius={[0, 4, 4, 0]}>
                {co2Data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* GDP Per Capita */}
      {gdpData.length > 0 && (
        <div className="bg-card border border-border/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[0.5rem] tracking-wider text-muted-foreground uppercase">
              GDP Per Capita (US$)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={gdpData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" tick={{ fontSize: 8, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 7, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} width={80} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="gdp" radius={[0, 4, 4, 0]}>
                {gdpData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
