/**
 * ScenarioComparison.tsx — PLv8
 * Side-by-side country metrics comparison using World Bank Open Data.
 * sacred-flow: PLv8 | DATA_LAYER_1 | 2026-03-22
 */

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { fetchWorldBankIndicator, formatUSD, WorldBankEntry } from "@/lib/worldBankData";

// ─── constants ───────────────────────────────────────────────────────────────

const COUNTRIES: { code: string; label: string }[] = [
  { code: "US", label: "United States" },
  { code: "CN", label: "China" },
  { code: "DE", label: "Germany" },
  { code: "JP", label: "Japan" },
  { code: "GB", label: "United Kingdom" },
  { code: "FR", label: "France" },
  { code: "BR", label: "Brazil" },
  { code: "IN", label: "India" },
  { code: "NL", label: "Netherlands" },
  { code: "ZA", label: "South Africa" },
  { code: "SG", label: "Singapore" },
  { code: "PT", label: "Portugal" },
];

interface Indicators {
  gdp: WorldBankEntry | null;
  pop: WorldBankEntry | null;
  co2: WorldBankEntry | null;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatPop(value: number | null): string {
  if (value === null) return "—";
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  return value.toLocaleString();
}

function formatCO2(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(2)} t/cap`;
}

// ─── skeleton metric ─────────────────────────────────────────────────────────

function SkeletonMetric() {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
      <div className="w-20 h-3 rounded animate-pulse bg-white/[0.03]" />
      <div className="w-16 h-3 rounded animate-pulse bg-white/[0.03]" />
    </div>
  );
}

// ─── single country column ────────────────────────────────────────────────────

interface CountryColumnProps {
  countryCode: string;
  onCountryChange: (code: string) => void;
  indicators: Indicators | null;
  loading: boolean;
  higherGdp: boolean;
  higherPop: boolean;
  higherCO2: boolean;
}

function CountryColumn({
  countryCode,
  onCountryChange,
  indicators,
  loading,
  higherGdp,
  higherPop,
  higherCO2,
}: CountryColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* selector */}
      <select
        value={countryCode}
        onChange={(e) => onCountryChange(e.target.value)}
        className="w-full font-mono text-[0.6rem] tracking-[0.1em] uppercase bg-white/[0.03] border border-white/[0.08] text-paper/80 px-3 py-2 rounded-sm focus:outline-none focus:border-gold/30 transition-colors cursor-pointer"
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-[hsl(var(--background))]">
            {c.label}
          </option>
        ))}
      </select>

      {/* metrics */}
      <div className="space-y-0">
        {loading ? (
          <>
            <SkeletonMetric />
            <SkeletonMetric />
            <SkeletonMetric />
          </>
        ) : (
          <>
            <MetricRow
              label="GDP"
              value={formatUSD(indicators?.gdp?.value ?? null)}
              year={indicators?.gdp?.date}
              highlight={higherGdp}
            />
            <MetricRow
              label="Population"
              value={formatPop(indicators?.pop?.value ?? null)}
              year={indicators?.pop?.date}
              highlight={higherPop}
            />
            <MetricRow
              label="CO₂ / capita"
              value={formatCO2(indicators?.co2?.value ?? null)}
              year={indicators?.co2?.date}
              highlight={higherCO2}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ─── metric row ───────────────────────────────────────────────────────────────

interface MetricRowProps {
  label: string;
  value: string;
  year?: string;
  highlight: boolean;
}

function MetricRow({ label, value, year, highlight }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.03]">
      <div className="flex items-center gap-1.5">
        {highlight && (
          <span className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0" />
        )}
        {!highlight && <span className="w-1.5 h-1.5 shrink-0" />}
        <span className="font-mono text-[0.5rem] tracking-[0.15em] text-white/40 uppercase">
          {label}
        </span>
        {year && (
          <span className="font-mono text-[0.4rem] tracking-[0.1em] text-white/20">
            {year}
          </span>
        )}
      </div>
      <span className="font-mono text-sm text-paper">{value}</span>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ScenarioComparison() {
  const [countryA, setCountryA] = useState("US");
  const [countryB, setCountryB] = useState("CN");

  const [dataA, setDataA] = useState<Indicators | null>(null);
  const [dataB, setDataB] = useState<Indicators | null>(null);
  const [loadingA, setLoadingA] = useState(true);
  const [loadingB, setLoadingB] = useState(true);

  const loadCountry = useCallback(
    async (code: string, setter: (d: Indicators) => void, setLoading: (v: boolean) => void) => {
      setLoading(true);
      try {
        const [gdp, pop, co2] = await Promise.all([
          fetchWorldBankIndicator(code, "NY.GDP.MKTP.CD"),
          fetchWorldBankIndicator(code, "SP.POP.TOTL"),
          fetchWorldBankIndicator(code, "EN.ATM.CO2E.PC"),
        ]);
        setter({ gdp, pop, co2 });
      } catch {
        setter({ gdp: null, pop: null, co2: null });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadCountry(countryA, setDataA, setLoadingA);
  }, [countryA, loadCountry]);

  useEffect(() => {
    loadCountry(countryB, setDataB, setLoadingB);
  }, [countryB, loadCountry]);

  // determine which column wins each metric
  const gdpA = dataA?.gdp?.value ?? null;
  const gdpB = dataB?.gdp?.value ?? null;
  const popA = dataA?.pop?.value ?? null;
  const popB = dataB?.pop?.value ?? null;
  const co2A = dataA?.co2?.value ?? null;
  const co2B = dataB?.co2?.value ?? null;

  const higherGdpA = gdpA !== null && gdpB !== null && gdpA > gdpB;
  const higherGdpB = gdpA !== null && gdpB !== null && gdpB > gdpA;
  const higherPopA = popA !== null && popB !== null && popA > popB;
  const higherPopB = popA !== null && popB !== null && popB > popA;
  const higherCO2A = co2A !== null && co2B !== null && co2A > co2B;
  const higherCO2B = co2A !== null && co2B !== null && co2B > co2A;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-ink-medium/60 border border-white/[0.05] rounded-sm backdrop-blur-sm overflow-hidden"
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
          Scenario Comparison
        </span>
        <span className="font-mono text-[0.4rem] tracking-[0.18em] text-white/20 uppercase">
          World Bank
        </span>
      </div>

      {/* columns */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <CountryColumn
          countryCode={countryA}
          onCountryChange={setCountryA}
          indicators={dataA}
          loading={loadingA}
          higherGdp={higherGdpA}
          higherPop={higherPopA}
          higherCO2={higherCO2A}
        />

        {/* divider */}
        <CountryColumn
          countryCode={countryB}
          onCountryChange={setCountryB}
          indicators={dataB}
          loading={loadingB}
          higherGdp={higherGdpB}
          higherPop={higherPopB}
          higherCO2={higherCO2B}
        />
      </div>

      {/* legend */}
      <div className="px-4 pb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
        <span className="font-mono text-[0.4rem] tracking-[0.15em] text-white/20 uppercase">
          higher value
        </span>
      </div>
    </motion.div>
  );
}
