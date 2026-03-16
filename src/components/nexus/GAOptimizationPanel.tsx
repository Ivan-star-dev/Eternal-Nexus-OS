import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dna, Play, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { runGAOptimization, type GAIndividual } from "@/lib/quantum-security";

export default function GAOptimizationPanel() {
  const [result, setResult] = useState<{
    best: GAIndividual;
    history: { gen: number; bestFitness: number; avgFitness: number }[];
  } | null>(null);
  const [running, setRunning] = useState(false);

  const run = useCallback(() => {
    setRunning(true);
    // Run in next tick to allow UI update
    setTimeout(() => {
      const r = runGAOptimization({ populationSize: 80, generations: 50 });
      setResult({ best: r.best, history: r.history });
      setRunning(false);
    }, 50);
  }, []);

  return (
    <div className="bg-card border border-border/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Dna className="h-4 w-4 text-primary" />
          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-primary uppercase">
            GA Multi-Objective Optimizer
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-[0.55rem] font-mono"
          onClick={run}
          disabled={running}
        >
          <Play className="h-3 w-3" />
          {running ? "COMPUTING..." : "RUN GA"}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Best individual */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "ENERGY", value: result.best.energy.toFixed(0), unit: "MW", color: "text-primary" },
              { label: "CO₂", value: result.best.co2.toFixed(0), unit: "kt", color: "text-accent-foreground" },
              { label: "COST", value: result.best.cost.toFixed(0), unit: "M$", color: "text-muted-foreground" },
            ].map((m) => (
              <div key={m.label} className="bg-muted/50 rounded-lg p-3 text-center">
                <span className="font-mono text-[0.45rem] text-muted-foreground block">{m.label}</span>
                <span className={`font-mono text-lg font-bold ${m.color}`}>{m.value}</span>
                <span className="font-mono text-[0.4rem] text-muted-foreground ml-1">{m.unit}</span>
              </div>
            ))}
          </div>

          {/* Fitness convergence */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="font-mono text-[0.5rem] text-muted-foreground">FITNESS CONVERGENCE</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.history}>
                  <XAxis dataKey="gen" tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 10 }}
                  />
                  <Line type="monotone" dataKey="bestFitness" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} name="Best" />
                  <Line type="monotone" dataKey="avgFitness" stroke="hsl(var(--muted-foreground))" dot={false} strokeWidth={1} name="Avg" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
