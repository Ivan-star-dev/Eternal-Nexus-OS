import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Globe, Waves, Users, Factory, Play, AlertTriangle, HeartPulse, Bug } from "lucide-react";

interface ScenarioConfig {
  year: number;
  seaLevelRise: number;
  tempAnomaly: number;
  co2ppm: number;
  pop65pct: number;
  pandemicCFR: number;       // case fatality rate %
  pandemicSpread: number;    // % global pop infected
}

interface ScenarioSimulatorProps {
  onRunScenario: (prompt: string) => void;
  disabled?: boolean;
}

const SCENARIOS: { label: string; config: ScenarioConfig }[] = [
  {
    label: "SSP1-2.6 (Low Emission)",
    config: { year: 2100, seaLevelRise: 0.44, tempAnomaly: 1.8, co2ppm: 420, pop65pct: 28, pandemicCFR: 0.5, pandemicSpread: 15 },
  },
  {
    label: "SSP2-4.5 (Moderate)",
    config: { year: 2100, seaLevelRise: 0.56, tempAnomaly: 2.7, co2ppm: 530, pop65pct: 28, pandemicCFR: 1.2, pandemicSpread: 30 },
  },
  {
    label: "SSP5-8.5 (Worst Case)",
    config: { year: 2100, seaLevelRise: 0.81, tempAnomaly: 4.4, co2ppm: 940, pop65pct: 28, pandemicCFR: 2.5, pandemicSpread: 45 },
  },
  {
    label: "Pandemic X (WHO)",
    config: { year: 2035, seaLevelRise: 0.2, tempAnomaly: 1.6, co2ppm: 440, pop65pct: 18, pandemicCFR: 5.0, pandemicSpread: 40 },
  },
];

export default function ScenarioSimulator({ onRunScenario, disabled }: ScenarioSimulatorProps) {
  const [config, setConfig] = useState<ScenarioConfig>({
    year: 2100,
    seaLevelRise: 0.56,
    tempAnomaly: 2.7,
    co2ppm: 530,
    pop65pct: 28,
    pandemicCFR: 1.2,
    pandemicSpread: 30,
  });

  const buildPrompt = useCallback((c: ScenarioConfig) => {
    const estimatedDeaths = Math.round((c.pandemicSpread / 100) * 10e9 * (c.pandemicCFR / 100) / 1e6);
    return `Simule cenário ${c.year}: Elevação do mar ${c.seaLevelRise}m, anomalia térmica +${c.tempAnomaly}°C, CO₂ ${c.co2ppm}ppm, ${c.pop65pct}% da população mundial acima de 65 anos. PANDEMIA: CFR ${c.pandemicCFR}%, ${c.pandemicSpread}% da população infectada (~${estimatedDeaths}M mortes estimadas). Analise: 1) Quais megacidades ficam submersas? 2) Impacto na saúde de idosos com ondas de calor + pandemia simultânea? 3) Capacidade hospitalar vs demanda (camas/1000 hab)? 4) Custo econômico de adaptação + resposta pandémica? 5) Estratégia de evacuação otimizada (GA) considerando idosos e doentes crônicos. 6) Projeção de resistência antimicrobiana. Use dados reais IPCC AR6 + UN WPP 2024 + WHO GHS Index. Considere lições de COVID-19, H1N1, Ebola.`;
  }, []);

  const applyPreset = useCallback((preset: ScenarioConfig) => {
    setConfig(preset);
  }, []);

  return (
    <div className="bg-card border border-border/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-primary uppercase">
          Scenario Simulator 2100
        </span>
        <span className="font-mono text-[0.4rem] text-muted-foreground ml-auto">IPCC AR6 + UN WPP + WHO</span>
      </div>

      {/* Presets */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {SCENARIOS.map((s) => (
          <Button
            key={s.label}
            variant="outline"
            size="sm"
            className="h-6 text-[0.5rem] font-mono"
            onClick={() => applyPreset(s.config)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Waves className="h-3 w-3 text-blue-400" />
            <span className="font-mono text-[0.5rem] text-muted-foreground">
              Sea Level Rise: {config.seaLevelRise.toFixed(2)}m
            </span>
          </div>
          <Slider
            value={[config.seaLevelRise * 100]}
            onValueChange={([v]) => setConfig((c) => ({ ...c, seaLevelRise: v / 100 }))}
            min={10} max={200} step={1}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-red-400" />
            <span className="font-mono text-[0.5rem] text-muted-foreground">
              Temp Anomaly: +{config.tempAnomaly.toFixed(1)}°C
            </span>
          </div>
          <Slider
            value={[config.tempAnomaly * 10]}
            onValueChange={([v]) => setConfig((c) => ({ ...c, tempAnomaly: v / 10 }))}
            min={10} max={60} step={1}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Factory className="h-3 w-3 text-orange-400" />
            <span className="font-mono text-[0.5rem] text-muted-foreground">
              CO₂: {config.co2ppm} ppm
            </span>
          </div>
          <Slider
            value={[config.co2ppm]}
            onValueChange={([v]) => setConfig((c) => ({ ...c, co2ppm: v }))}
            min={400} max={1200} step={10}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-purple-400" />
            <span className="font-mono text-[0.5rem] text-muted-foreground">
              Pop 65+: {config.pop65pct}%
            </span>
          </div>
          <Slider
            value={[config.pop65pct]}
            onValueChange={([v]) => setConfig((c) => ({ ...c, pop65pct: v }))}
            min={10} max={45} step={1}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bug className="h-3 w-3 text-pink-400" />
            <span className="font-mono text-[0.5rem] text-muted-foreground">
              Pandemic CFR: {config.pandemicCFR.toFixed(1)}%
            </span>
          </div>
          <Slider
            value={[config.pandemicCFR * 10]}
            onValueChange={([v]) => setConfig((c) => ({ ...c, pandemicCFR: v / 10 }))}
            min={1} max={100} step={1}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <HeartPulse className="h-3 w-3 text-red-400" />
            <span className="font-mono text-[0.5rem] text-muted-foreground">
              Pandemic Spread: {config.pandemicSpread}% pop
            </span>
          </div>
          <Slider
            value={[config.pandemicSpread]}
            onValueChange={([v]) => setConfig((c) => ({ ...c, pandemicSpread: v }))}
            min={5} max={80} step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Summary + Run */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-muted/50 rounded-lg p-2">
          <span className="font-mono text-[0.45rem] text-muted-foreground block">
            {config.year} — {config.seaLevelRise}m rise · +{config.tempAnomaly}°C · {config.co2ppm}ppm CO₂ · {config.pop65pct}% elderly · Pandemic CFR {config.pandemicCFR}% / {config.pandemicSpread}% infected
          </span>
        </div>
        <Button
          size="sm"
          className="gap-1.5 font-mono text-[0.55rem]"
          onClick={() => onRunScenario(buildPrompt(config))}
          disabled={disabled}
        >
          <Play className="h-3 w-3" />
          SIMULATE
        </Button>
      </div>
    </div>
  );
}
