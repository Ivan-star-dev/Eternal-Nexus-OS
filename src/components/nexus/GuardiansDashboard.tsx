import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain, Cloud, DollarSign, HeartPulse, Shield, Zap,
  Activity, CheckCircle2, Clock, AlertTriangle, Radio,
} from "lucide-react";

// ═══ Guardian Agent definitions ═══
interface Guardian {
  id: string;
  name: string;
  domain: string;
  icon: React.ReactNode;
  color: string;
  status: "active" | "analyzing" | "idle" | "alert";
  lastAction: string;
  decisionsToday: number;
  dataSourcesActive: number;
  currentTask: string;
}

const INITIAL_GUARDIANS: Guardian[] = [
  {
    id: "climate", name: "Guardian Clima", domain: "Clima & Sustentabilidade",
    icon: <Cloud className="h-4 w-4" />, color: "text-green-400",
    status: "active", lastAction: "Monitorando CO₂ Mauna Loa — 423ppm",
    decisionsToday: 12, dataSourcesActive: 4,
    currentTask: "Análise de anomalia térmica +1.8°C no Atlântico Norte",
  },
  {
    id: "economy", name: "Guardian Economia", domain: "Economia Global",
    icon: <DollarSign className="h-4 w-4" />, color: "text-yellow-400",
    status: "analyzing", lastAction: "Projeção GDP 2030 — cenário SSP2",
    decisionsToday: 8, dataSourcesActive: 3,
    currentTask: "Calculando impacto de $340B Green Climate Fund",
  },
  {
    id: "health", name: "Guardian Saúde", domain: "Saúde & Pandemias",
    icon: <HeartPulse className="h-4 w-4" />, color: "text-red-400",
    status: "alert", lastAction: "Alerta WHO — H5N8 em 12 países",
    decisionsToday: 15, dataSourcesActive: 5,
    currentTask: "Cross-referencing GHS Index + aging population + hospital capacity",
  },
  {
    id: "security", name: "Guardian Defesa", domain: "Segurança & Conflitos",
    icon: <Shield className="h-4 w-4" />, color: "text-blue-400",
    status: "active", lastAction: "Monitorando FSI — Sudão escalada",
    decisionsToday: 6, dataSourcesActive: 3,
    currentTask: "Projeção de fluxos migratórios de zonas de conflito ativo",
  },
  {
    id: "infra", name: "Guardian Infra", domain: "Infraestrutura Crítica",
    icon: <Zap className="h-4 w-4" />, color: "text-purple-400",
    status: "active", lastAction: "Delta Spine NL — fase 2 concluída",
    decisionsToday: 4, dataSourcesActive: 3,
    currentTask: "Avaliação de resiliência de grid energético na Europa",
  },
];

// ═══ Decision log ═══
interface Decision {
  id: string;
  guardianId: string;
  timestamp: string;
  action: string;
  outcome: string;
  confidence: number;
}

const MOCK_DECISIONS: Decision[] = [
  { id: "1", guardianId: "health", timestamp: new Date(Date.now() - 600000).toISOString(), action: "Ativou protocolo de preparação pandémica", outcome: "Screening em 200 aeroportos recomendado", confidence: 87 },
  { id: "2", guardianId: "climate", timestamp: new Date(Date.now() - 1200000).toISOString(), action: "Detectou anomalia térmica Atlântico Norte", outcome: "Alerta transmitido ao Council", confidence: 92 },
  { id: "3", guardianId: "security", timestamp: new Date(Date.now() - 1800000).toISOString(), action: "Escalada Sudão — FSI 111.5", outcome: "Corredor migratório proposto ao Council", confidence: 78 },
  { id: "4", guardianId: "economy", timestamp: new Date(Date.now() - 2400000).toISOString(), action: "Modelou impacto de taxa carbono $85/ton", outcome: "GDP -0.3% vs benefício climático +1.2°C evitado", confidence: 81 },
  { id: "5", guardianId: "infra", timestamp: new Date(Date.now() - 3000000).toISOString(), action: "Validou Delta Spine NL fase 2", outcome: "4.2M habitantes protegidos de inundação costeira", confidence: 95 },
  { id: "6", guardianId: "health", timestamp: new Date(Date.now() - 3600000).toISOString(), action: "Cross-ref CVD + envelhecimento + poluição", outcome: "Alerta cardiovascular para Rússia/Ucrânia", confidence: 84 },
];

const STATUS_META: Record<string, { label: string; icon: React.ReactNode; bg: string }> = {
  active: { label: "ATIVO", icon: <CheckCircle2 className="h-2.5 w-2.5" />, bg: "bg-green-500/20 text-green-400" },
  analyzing: { label: "ANALISANDO", icon: <Activity className="h-2.5 w-2.5 animate-pulse" />, bg: "bg-yellow-500/20 text-yellow-400" },
  idle: { label: "IDLE", icon: <Clock className="h-2.5 w-2.5" />, bg: "bg-muted text-muted-foreground" },
  alert: { label: "ALERTA", icon: <AlertTriangle className="h-2.5 w-2.5" />, bg: "bg-destructive/20 text-destructive" },
};

export default function GuardiansDashboard() {
  const [guardians, setGuardians] = useState(INITIAL_GUARDIANS);
  const [decisions] = useState(MOCK_DECISIONS);
  const [selectedGuardian, setSelectedGuardian] = useState<string | null>(null);

  // Simulate guardian activity
  useEffect(() => {
    const iv = setInterval(() => {
      setGuardians((prev) =>
        prev.map((g) => ({
          ...g,
          decisionsToday: g.decisionsToday + (Math.random() > 0.7 ? 1 : 0),
        }))
      );
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const totalDecisions = useMemo(() => guardians.reduce((s, g) => s + g.decisionsToday, 0), [guardians]);
  const totalSources = useMemo(() => guardians.reduce((s, g) => s + g.dataSourcesActive, 0), [guardians]);
  const alertCount = useMemo(() => guardians.filter((g) => g.status === "alert").length, [guardians]);

  const filteredDecisions = selectedGuardian
    ? decisions.filter((d) => d.guardianId === selectedGuardian)
    : decisions;

  return (
    <div className="bg-card border border-primary/20 rounded-lg p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Radio className="h-4 w-4 text-primary animate-pulse" />
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-primary uppercase">
          AI Guardians — Painel de Comando
        </span>
        <div className="flex items-center gap-3 ml-auto font-mono text-[0.45rem] text-muted-foreground">
          <span>{totalDecisions} decisões hoje</span>
          <span>{totalSources} fontes ativas</span>
          {alertCount > 0 && (
            <span className="text-destructive">{alertCount} alertas</span>
          )}
        </div>
      </div>

      {/* Guardian Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
        {guardians.map((g) => {
          const statusMeta = STATUS_META[g.status];
          const isSelected = selectedGuardian === g.id;
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGuardian(isSelected ? null : g.id)}
              className={`bg-background/50 border rounded-lg p-3 cursor-pointer transition-all ${
                isSelected ? "border-primary/50 ring-1 ring-primary/20" : "border-border/30 hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={g.color}>{g.icon}</span>
                <span className="font-mono text-[0.5rem] text-foreground font-semibold truncate">{g.name}</span>
              </div>

              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.4rem] font-mono ${statusMeta.bg}`}>
                {statusMeta.icon}
                {statusMeta.label}
              </span>

              <div className="mt-2 space-y-1">
                <span className="font-mono text-[0.4rem] text-muted-foreground block truncate">
                  {g.currentTask}
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.4rem] text-muted-foreground">
                    {g.decisionsToday} decisões
                  </span>
                  <span className="font-mono text-[0.4rem] text-muted-foreground">
                    {g.dataSourcesActive} fontes
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Log */}
      <div className="bg-background/30 border border-border/20 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-3 w-3 text-primary" />
          <span className="font-mono text-[0.5rem] text-primary tracking-wider">
            DECISION LOG {selectedGuardian ? `— ${guardians.find((g) => g.id === selectedGuardian)?.name}` : ""}
          </span>
          {selectedGuardian && (
            <Button variant="ghost" size="sm" className="h-5 text-[0.4rem] font-mono ml-auto" onClick={() => setSelectedGuardian(null)}>
              SHOW ALL
            </Button>
          )}
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {filteredDecisions.map((d) => {
            const guardian = guardians.find((g) => g.id === d.guardianId);
            return (
              <div key={d.id} className="flex items-start gap-2 px-2 py-1.5 rounded bg-muted/20 border border-border/10">
                <span className={guardian?.color}>{guardian?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[0.45rem] text-foreground font-semibold">{d.action}</span>
                    <span className="font-mono text-[0.4rem] text-muted-foreground ml-auto shrink-0">
                      {new Date(d.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span className="font-mono text-[0.4rem] text-muted-foreground block">{d.outcome}</span>
                </div>
                <span className={`font-mono text-[0.4rem] px-1 py-0.5 rounded shrink-0 ${
                  d.confidence >= 90 ? "bg-green-500/20 text-green-400" :
                  d.confidence >= 75 ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-orange-500/20 text-orange-400"
                }`}>
                  {d.confidence}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
