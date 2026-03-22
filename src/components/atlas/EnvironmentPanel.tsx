import { useState, useEffect } from "react";
import { Wind, Droplets, Thermometer, AlertTriangle, Loader2, Cloud, Waves } from "lucide-react";
import { fetchAirQuality, fetchWaterQuality, type AirQualityData, type WaterQualityData } from "@/lib/dataSources";
import type { GeoProject } from "@/components/atlas/cesium/CesiumProjectEntities";

interface EnvironmentPanelProps {
  project: GeoProject;
}

export default function EnvironmentPanel({ project }: EnvironmentPanelProps) {
  const [aq, setAq] = useState<AirQualityData | null>(null);
  const [wq, setWq] = useState<WaterQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"air" | "water">("air");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setAq(null);
    setWq(null);

    Promise.all([
      fetchAirQuality(project.lat, project.lon),
      fetchWaterQuality(project.lat, project.lon),
    ]).then(([airData, waterData]) => {
      if (cancelled) return;
      setAq(airData);
      setWq(waterData);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [project.lat, project.lon]);

  const riskColor = (risk: string) => {
    if (risk === "CRITICAL") return "text-red-500";
    if (risk === "HIGH") return "text-orange-400";
    if (risk === "MODERATE") return "text-yellow-400";
    return "text-emerald-400";
  };

  return (
    <div className="bg-card/95 backdrop-blur-xl border border-border/30 rounded-lg p-3 w-72">
      <div className="flex items-center gap-2 mb-2">
        <Cloud className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">
          Env Monitor — {project.name}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setTab("air")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[0.5rem] font-mono tracking-wider transition-colors ${
            tab === "air" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wind className="h-3 w-3" /> AR
        </button>
        <button
          onClick={() => setTab("water")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[0.5rem] font-mono tracking-wider transition-colors ${
            tab === "water" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Waves className="h-3 w-3" /> ÁGUA
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="font-mono text-[0.45rem] text-muted-foreground ml-2">Fetching data...</span>
        </div>
      )}

      {/* AIR QUALITY */}
      {!loading && tab === "air" && (
        <div className="space-y-2">
          {aq ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.5rem] text-muted-foreground">European AQI</span>
                <span className={`font-mono text-sm font-bold ${riskColor(aq.risk)}`}>{aq.aqi}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className={`h-3 w-3 ${riskColor(aq.risk)}`} />
                <span className={`font-mono text-[0.5rem] font-bold ${riskColor(aq.risk)}`}>{aq.risk}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {[
                  { label: "PM2.5", value: `${aq.pm25} µg/m³`, warn: aq.pm25 > 25 },
                  { label: "PM10", value: `${aq.pm10} µg/m³`, warn: aq.pm10 > 50 },
                  { label: "NO₂", value: `${aq.no2} µg/m³`, warn: aq.no2 > 40 },
                  { label: "O₃", value: `${aq.ozone} µg/m³`, warn: aq.ozone > 120 },
                  { label: "CO", value: `${aq.co} µg/m³`, warn: aq.co > 10000 },
                  { label: "SO₂", value: `${aq.so2} µg/m³`, warn: aq.so2 > 20 },
                ].map((m) => (
                  <div key={m.label} className={`bg-muted/50 rounded px-2 py-1.5 border ${m.warn ? "border-orange-500/30" : "border-border/20"}`}>
                    <span className="font-mono text-[0.4rem] text-muted-foreground block">{m.label}</span>
                    <span className={`font-mono text-[0.55rem] ${m.warn ? "text-orange-400" : "text-foreground"}`}>{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-[0.4rem] font-mono text-muted-foreground">
                Fonte: Open-Meteo AQ (Sentinel-5P / CAMS) · {new Date(aq.timestamp).toLocaleString("pt-BR")}
              </div>
            </>
          ) : (
            <span className="font-mono text-[0.45rem] text-muted-foreground">Dados indisponíveis</span>
          )}
        </div>
      )}

      {/* WATER QUALITY */}
      {!loading && tab === "water" && wq && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.5rem] text-muted-foreground">Risco Hídrico</span>
            <span className={`font-mono text-[0.55rem] font-bold ${riskColor(wq.risk)}`}>{wq.risk}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: "pH", value: `${wq.ph}`, icon: <Droplets className="h-2.5 w-2.5" />, warn: wq.ph < 6.5 || wq.ph > 8.5 },
              { label: "O₂ Dissolvido", value: `${wq.dissolvedOxygen} mg/L`, icon: <Wind className="h-2.5 w-2.5" />, warn: wq.dissolvedOxygen < 5 },
              { label: "Turbidez", value: `${wq.turbidity} NTU`, icon: <Waves className="h-2.5 w-2.5" />, warn: wq.turbidity > 5 },
              { label: "Temperatura", value: `${wq.temperature} °C`, icon: <Thermometer className="h-2.5 w-2.5" />, warn: false },
            ].map((m) => (
              <div key={m.label} className={`bg-muted/50 rounded px-2 py-1.5 border ${m.warn ? "border-orange-500/30" : "border-border/20"}`}>
                <div className="flex items-center gap-1 mb-0.5">
                  {m.icon}
                  <span className="font-mono text-[0.4rem] text-muted-foreground">{m.label}</span>
                </div>
                <span className={`font-mono text-[0.55rem] ${m.warn ? "text-orange-400" : "text-foreground"}`}>{m.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 text-[0.4rem] font-mono text-muted-foreground">
            Fonte: {wq.source} · Dados representativos
          </div>
        </div>
      )}
    </div>
  );
}
