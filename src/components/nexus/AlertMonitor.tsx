import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, Wind, Users, HeartPulse, Bug, Shield } from "lucide-react";
import type { EarthquakePoint } from "@/lib/earthquakeData";
import type { PollutionPoint } from "@/lib/dataSources";
import { COUNTRY_AGES } from "@/components/atlas/PopulationAgingLayer";
import { HEALTH_INDICATORS, assessPandemicRisk } from "@/lib/healthData";
import { SECURITY_DATA } from "@/lib/securityData";

interface AlertMonitorProps {
  earthquakes: EarthquakePoint[];
  pollution: PollutionPoint[];
  onTriggerSwarm: (prompt: string) => void;
  disabled?: boolean;
}

interface Alert {
  id: string;
  severity: "critical" | "high" | "moderate";
  icon: React.ReactNode;
  title: string;
  detail: string;
  prompt: string;
}

export default function AlertMonitor({ earthquakes, pollution, onTriggerSwarm, disabled }: AlertMonitorProps) {
  const alerts = useMemo(() => {
    const result: Alert[] = [];

    // Critical earthquakes (M6+)
    earthquakes
      .filter((q) => q.mag >= 6)
      .slice(0, 3)
      .forEach((q) => {
        const nearbyAging = COUNTRY_AGES.find(
          (c) => Math.abs(c.lat - q.lat) < 10 && Math.abs(c.lon - q.lon) < 15
        );
        const agingNote = nearbyAging
          ? ` (${nearbyAging.country}: ${nearbyAging.pop65pct}% idosos — risco elevado)`
          : "";
        result.push({
          id: `eq-${q.id}`,
          severity: q.mag >= 7 ? "critical" : "high",
          icon: <Zap className="h-3 w-3" />,
          title: `M${q.mag.toFixed(1)} — ${q.place}`,
          detail: `Profundidade ${q.depth}km${q.tsunami ? " ⚠️ TSUNAMI" : ""}${agingNote}`,
          prompt: `ALERTA CRÍTICO: Terremoto M${q.mag} em ${q.place}. ${agingNote}. Analise: 1) Estimativa de vítimas considerando população idosa 2) Custo de reconstrução 3) Plano de evacuação otimizado (GA) 4) Impacto em infraestrutura local. Use dados USGS reais.`,
        });
      });

    // Critical pollution (AQI > 100)
    pollution
      .filter((p) => p.aqi > 100)
      .slice(0, 3)
      .forEach((p) => {
        result.push({
          id: `pol-${p.city}`,
          severity: p.aqi > 150 ? "critical" : "high",
          icon: <Wind className="h-3 w-3" />,
          title: `${p.city} — AQI ${p.aqi}`,
          detail: `PM2.5: ${p.pm25}µg/m³ — ${p.aqi > 150 ? "PERIGO" : "INSALUBRE"}`,
          prompt: `ALERTA POLUIÇÃO: ${p.city} com AQI ${p.aqi}, PM2.5 ${p.pm25}µg/m³. Analise: 1) Impacto na saúde respiratória (idosos e crianças) 2) Custo econômico de paralisação 3) Medidas de mitigação imediata 4) Projeção se tendência continuar 10 anos.`,
        });
      });

    // Cross-reference: earthquake + aging population
    const agingCountries = COUNTRY_AGES.filter((c) => c.pop65pct > 20);
    if (agingCountries.length > 0 && earthquakes.length > 0) {
      const criticalCombos = agingCountries.filter((c) =>
        earthquakes.some(
          (q) => q.mag >= 5 && Math.abs(c.lat - q.lat) < 15 && Math.abs(c.lon - q.lon) < 20
        )
      );
      criticalCombos.slice(0, 2).forEach((c) => {
        result.push({
          id: `cross-${c.country}`,
          severity: "critical",
          icon: <Users className="h-3 w-3" />,
          title: `${c.country} — Risco Cruzado`,
          detail: `${c.pop65pct}% idosos + atividade sísmica recente`,
          prompt: `RISCO CRUZADO: ${c.country} com ${c.pop65pct}% população acima de 65 anos + atividade sísmica recente na região. Analise: 1) Vulnerabilidade de idosos em terremoto 2) Capacidade hospitalar 3) Plano de evacuação prioritária 4) Custo de preparação vs custo de desastre.`,
        });
      });
    }

    // Health alerts — low pandemic readiness countries
    const pandemicRisk = assessPandemicRisk();
    if (pandemicRisk.highRiskCountries.length > 0) {
      const weakest = HEALTH_INDICATORS
        .filter((h) => pandemicRisk.highRiskCountries.includes(h.country))
        .slice(0, 2);
      weakest.forEach((h) => {
        result.push({
          id: `health-${h.country}`,
          severity: h.pandemicReadiness < 20 ? "critical" : "high",
          icon: <Bug className="h-3 w-3" />,
          title: `${h.country} — Pandemic Readiness ${h.pandemicReadiness}/100`,
          detail: `${h.hospitalBeds} camas/1k, LE ${h.lifeExpectancy}y, CVD ${h.cardiovascularRate}/100k`,
          prompt: `ALERTA SAÚDE: ${h.country} com GHS Index ${h.pandemicReadiness}/100, apenas ${h.hospitalBeds} camas/1000 hab, expectativa de vida ${h.lifeExpectancy} anos. Analise: 1) Vulnerabilidade a nova pandemia (COVID-like CFR 2%) 2) Capacidade de resposta vs demanda 3) Custo de upgratar infraestrutura hospitalar 4) Impacto de resistência antimicrobiana 5) Plano de stockpiling de vacinas/antivirais. Use dados WHO GHS + lições COVID-19/Ebola.`,
        });
      });
    }

    // Cardiovascular crisis alert — countries with highest CVD rates + aging
    const cvdCrisis = HEALTH_INDICATORS
      .filter((h) => h.cardiovascularRate > 250)
      .slice(0, 2);
    cvdCrisis.forEach((h) => {
      const aging = COUNTRY_AGES.find((c) => c.country === h.country);
      if (aging && aging.pop65pct > 10) {
        result.push({
          id: `cvd-${h.country}`,
          severity: "high",
          icon: <HeartPulse className="h-3 w-3" />,
          title: `${h.country} — CVD Crisis`,
          detail: `${h.cardiovascularRate}/100k mortalidade cardiovascular, ${aging.pop65pct}% idosos`,
          prompt: `CRISE CARDIOVASCULAR: ${h.country} com ${h.cardiovascularRate} mortes/100k por doenças cardiovasculares + ${aging.pop65pct}% população idosa. Analise: 1) Projeção de mortalidade CVD até 2050 com envelhecimento 2) Custo de programas de prevenção 3) Impacto de poluição na CVD 4) Tecnologias de telemedicina para monitoramento remoto.`,
        });
      }
    });

    // Security alerts — active conflict zones
    SECURITY_DATA
      .filter((s) => s.conflictIntensity >= 3)
      .slice(0, 3)
      .forEach((s) => {
        result.push({
          id: `sec-${s.country}`,
          severity: s.conflictIntensity >= 4 ? "critical" : "high",
          icon: <Shield className="h-3 w-3" />,
          title: `${s.country} — ${s.riskLevel}`,
          detail: `FSI ${s.fsi}/120, infra ${s.infraQuality}/7, critical: ${s.criticalInfra.slice(0, 3).join(", ")}`,
          prompt: `ALERTA SEGURANÇA: ${s.country} com FSI ${s.fsi}/120, conflito nível ${s.conflictIntensity}/4, infraestrutura crítica: ${s.criticalInfra.join(", ")}. Analise: 1) Impacto em infraestrutura crítica (${s.criticalInfra.join(", ")}) 2) Fluxos migratórios projetados 3) Custo de reconstrução pós-conflito 4) Impacto em cadeias de suprimento globais 5) Estratégia de estabilização otimizada (GA).`,
        });
      });

    return result.sort((a, b) => {
      const sev = { critical: 0, high: 1, moderate: 2 };
      return sev[a.severity] - sev[b.severity];
    });
  }, [earthquakes, pollution]);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-card border border-destructive/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-destructive uppercase">
          Live Alerts — Closed Loop
        </span>
        <span className="font-mono text-[0.4rem] text-muted-foreground ml-auto">
          {alerts.length} active
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
              a.severity === "critical"
                ? "bg-destructive/10 border-destructive/30"
                : a.severity === "high"
                  ? "bg-orange-500/10 border-orange-500/30"
                  : "bg-yellow-500/10 border-yellow-500/30"
            }`}
          >
            <div className={a.severity === "critical" ? "text-destructive" : "text-orange-400"}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-[0.55rem] text-foreground block truncate">{a.title}</span>
              <span className="font-mono text-[0.4rem] text-muted-foreground block truncate">{a.detail}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[0.45rem] font-mono shrink-0"
              onClick={() => onTriggerSwarm(a.prompt)}
              disabled={disabled}
            >
              ANALYZE
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
