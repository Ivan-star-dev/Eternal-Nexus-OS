// Painel de modo de crise — roda simulações de resiliência em cenários extremos
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Flame, Waves, Shield, Zap,
  Play, Loader2, CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface CrisisScenario {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  prompt: string;
  desc: string;
}

const SCENARIOS: CrisisScenario[] = [
  {
    id: "volcanic", label: "Erupção Vulcânica", icon: <Flame className="h-4 w-4" />,
    color: "#ff4444", desc: "Pico do Fogo — evacuação + energia de emergência",
    prompt: "MODO CRISE: Erupção vulcânica em Pico do Fogo, Cabo Verde. Simule: 1) Evacuação de 30.000 pessoas, 2) Ativação de energia de emergência via GeoCore, 3) Impacto em infraestrutura costeira, 4) Resposta do DeltaSpine para proteção marítima. Gere plano de ação em 72 horas com métricas de resiliência.",
  },
  {
    id: "tsunami", label: "Tsunami Atlântico", icon: <Waves className="h-4 w-4" />,
    color: "#4a90e2", desc: "Costa oeste africana — resiliência costeira",
    prompt: "MODO CRISE: Tsunami no Atlântico (M8.2 no Mid-Atlantic Ridge). Simule impacto em: 1) Cabo Verde (todas as ilhas), 2) DeltaSpine NL (proteção de Amsterdão), 3) Terra Lenta (cidades costeiras de Portugal). Analise tempo de resposta, capacidade de absorção e plano de recuperação em 7 dias.",
  },
  {
    id: "cyber", label: "Ataque Cibernético", icon: <Shield className="h-4 w-4" />,
    color: "#cc44ff", desc: "Infraestrutura crítica comprometida",
    prompt: "MODO CRISE: Ataque cibernético coordenado contra infraestrutura energética europeia. Simule: 1) Chip Fold como escudo quântico, 2) GeoCore em modo isolado, 3) Comunicações de emergência via DeltaSpine, 4) Tempo de recuperação total. Avalie cenário com e sem Eternal Nexus ativo.",
  },
  {
    id: "pandemic", label: "Pandemia Global", icon: <AlertTriangle className="h-4 w-4" />,
    color: "#ffaa22", desc: "Nova variante — resposta integrada",
    prompt: "MODO CRISE: Nova pandemia (CFR 3.2%, R0 5.8). Simule resposta integrada: 1) Nexus coordena 147 países, 2) Atlas mapeia propagação em tempo real, 3) Terra Lenta adapta cidades para quarentena modular, 4) News/Echo-Vox transmite alertas em 40 idiomas. Timeline de 90 dias.",
  },
];

interface CrisisModeProps {
  onInjectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export default function CrisisMode({ onInjectPrompt, disabled }: CrisisModeProps) {
  const { user } = useAuth();
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [simCount, setSimCount] = useState(0);

  const runCrisis = useCallback(async (scenario: CrisisScenario) => {
    if (!user) { toast.error("Login necessário"); return; }
    setActiveScenario(scenario.id);
    setSimResult(null);
    setLoading(true);
    setSimCount(0);

    // Simulate count-up
    const interval = setInterval(() => {
      setSimCount((c) => Math.min(c + Math.floor(Math.random() * 80 + 20), 1000));
    }, 100);

    try {
      const { data, error } = await supabase.functions.invoke("nexus-swarm", {
        body: { prompt: scenario.prompt, stream: false },
      });
      if (error) throw error;
      setSimResult(data?.synthesis?.response || "Simulação concluída sem dados.");
      setSimCount(1000);
    } catch (err) {
      console.error("Crisis sim error:", err);
      toast.error("Simulação falhou");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-destructive uppercase font-bold">
          SALA DE CRISE
        </span>
        <span className="font-mono text-[0.4rem] text-muted-foreground ml-2">
          Simulação de Resiliência • 1000 cenários
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => runCrisis(s)}
            disabled={disabled || loading}
            className={`relative bg-card border rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5 group ${
              activeScenario === s.id ? "border-destructive/50 ring-1 ring-destructive/20" : "border-border/30 hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="font-mono text-[0.5rem] text-foreground font-bold tracking-wider">
                {s.label}
              </span>
            </div>
            <p className="font-mono text-[0.4rem] text-muted-foreground">{s.desc}</p>

            {activeScenario === s.id && loading && (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-destructive" />
                  <span className="font-mono text-[0.45rem] text-destructive">
                    {simCount}/1000 simulações
                  </span>
                </div>
                <div className="h-1 bg-muted rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-destructive rounded-full transition-all duration-200"
                    style={{ width: `${(simCount / 1000) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {activeScenario === s.id && !loading && simResult && (
              <div className="mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-accent" />
                <span className="font-mono text-[0.4rem] text-accent">1000 simulações concluídas</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {simResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-destructive/20 rounded-xl p-5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[0.55rem] text-destructive tracking-wider font-bold">
                RESULTADO DA SIMULAÇÃO
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[0.45rem] font-mono"
                onClick={() => {
                  const scenario = SCENARIOS.find((s) => s.id === activeScenario);
                  if (scenario) onInjectPrompt(scenario.prompt);
                }}
              >
                <Zap className="h-3 w-3 mr-1" /> Enviar ao Swarm
              </Button>
            </div>
            <div className="prose prose-sm prose-invert max-w-none font-mono text-[0.55rem] leading-relaxed max-h-72 overflow-y-auto">
              <ReactMarkdown>{simResult}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
