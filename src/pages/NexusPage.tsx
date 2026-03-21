import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity, Brain, Cloud, DollarSign, HeartPulse, Loader2,
  Radio, Send, ShieldCheck, Shield, Globe, Zap, Database, ChevronDown,
  RefreshCw, Terminal, CheckCircle2, Mic, MicOff,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import DataCharts from "@/components/nexus/DataCharts";
import GAOptimizationPanel from "@/components/nexus/GAOptimizationPanel";
import ScenarioSimulator from "@/components/nexus/ScenarioSimulator";
import NexusHolographicRoom from "@/components/nexus/NexusHolographicRoom";
import AlertMonitor from "@/components/nexus/AlertMonitor";
import AICouncil from "@/components/nexus/AICouncil";
import GuardiansDashboard from "@/components/nexus/GuardiansDashboard";
import CrisisMode from "@/components/nexus/CrisisMode";
import { WORKSPACE } from "@/config/workspace";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { fetchGlobalPollution, type PollutionPoint } from "@/lib/dataSources";
import { fetchRecentEarthquakes, type EarthquakePoint } from "@/lib/earthquakeData";
import { buildHealthContext } from "@/lib/healthData";
import { buildSecurityContext } from "@/lib/securityData";
import { buildSustainabilityContext } from "@/components/atlas/SustainabilityLayer";
import { toast } from "sonner";

interface AgentResult {
  agentId: string;
  status: string;
  response: string;
  latencyMs: number;
}

interface SwarmResult {
  status: string;
  agents: {
    climate: AgentResult;
    economy: AgentResult;
    health: AgentResult;
  };
  synthesis: AgentResult;
  integrityHash: string;
  timestamp: string;
}

interface DataOceanResult {
  timestamp: string;
  sources: Record<string, any>;
  health: Record<string, boolean>;
}

type AgentTab = "synthesis" | "climate" | "economy" | "health";

export default function NexusPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [result, setResult] = useState<SwarmResult | null>(null);
  const [dataOcean, setDataOcean] = useState<DataOceanResult | null>(null);
  const [activeTab, setActiveTab] = useState<AgentTab>("synthesis");
  const [history, setHistory] = useState<{ prompt: string; hash: string; date: string }[]>([]);
  const [showData, setShowData] = useState(false);
  const [streamingMeta, setStreamingMeta] = useState("");
  const [agentStatuses, setAgentStatuses] = useState<Record<string, "pending" | "done" | "error">>({});
  const [pollutionContext, setPollutionContext] = useState<PollutionPoint[]>([]);
  const [earthquakeContext, setEarthquakeContext] = useState<EarthquakePoint[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ═══ VOICE INPUT ═══
  const { listening, toggle: toggleVoice, supported: voiceSupported } = useVoiceInput(
    useCallback((text: string) => setPrompt((prev) => (prev ? prev + " " + text : text)), [])
  );

  const fetchDataOcean = useCallback(async () => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("data-ocean");
      if (error) throw error;
      setDataOcean(data as DataOceanResult);
    } catch (err) {
      console.error("Data Ocean error:", err);
      toast.error("Failed to fetch Data Ocean");
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => { fetchDataOcean(); }, [fetchDataOcean]);

  // Load pollution + earthquake context for swarm
  useEffect(() => {
    fetchGlobalPollution().then(setPollutionContext).catch(console.warn);
    fetchRecentEarthquakes().then(setEarthquakeContext).catch(console.warn);
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("nexus_simulations")
        .select("prompt, integrity_hash, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) {
        setHistory(data.map((d: any) => ({
          prompt: d.prompt, hash: d.integrity_hash ?? "", date: d.created_at,
        })));
      }
    };
    load();
  }, [user, result]);

  // ═══ SSE STREAMING SWARM ═══
  const runSwarmStreaming = useCallback(async () => {
    if (!prompt.trim() || !user) return;
    setLoading(true);
    setResult(null);
    setStreamingMeta("");
    setActiveTab("synthesis");
    setAgentStatuses({ climate: "pending", economy: "pending", health: "pending", meta: "pending" });

    const agents: Record<string, AgentResult> = {};

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nexus-swarm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            prompt,
            dataContext: {
              ...(dataOcean?.sources ?? {}),
              pollution: pollutionContext.length > 0
                ? pollutionContext.map((p) => `${p.city}: AQI ${p.aqi}, PM2.5 ${p.pm25}µg/m³`).join("; ")
                : undefined,
              earthquakes: earthquakeContext.length > 0
                ? earthquakeContext.slice(0, 10).map((q) => `M${q.mag} ${q.place} (${q.time})`).join("; ")
                : undefined,
              health: buildHealthContext(),
              security: buildSecurityContext(),
              sustainability: buildSustainabilityContext(),
            },
            stream: true,
          }),
        }
      );

      if (!res.ok) {
        if (res.status === 429) { toast.error("Rate limited — try again in a moment"); return; }
        if (res.status === 402) { toast.error("Credits exhausted — add funds in Settings"); return; }
        throw new Error(`HTTP ${res.status}`);
      }

      if (!res.body) throw new Error("No stream body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let integrityHash = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);

          if (line.startsWith("event: ")) {
            const eventType = line.slice(7).trim();
            const dataIdx = buffer.indexOf("\n");
            if (dataIdx === -1) { buffer = line + "\n" + buffer; break; }
            let dataLine = buffer.slice(0, dataIdx);
            buffer = buffer.slice(dataIdx + 1);
            if (dataLine.endsWith("\r")) dataLine = dataLine.slice(0, -1);

            if (!dataLine.startsWith("data: ")) continue;
            const jsonStr = dataLine.slice(6).trim();

            try {
              const payload = JSON.parse(jsonStr);

              if (eventType === "agent_complete") {
                const agentId = payload.agentId as string;
                agents[agentId] = payload;
                setAgentStatuses((prev) => ({ ...prev, [agentId]: payload.status === "ok" ? "done" : "error" }));

                if (agents.climate && agents.economy && agents.health) {
                  setResult((prev) => ({
                    status: "partial",
                    agents: {
                      climate: agents.climate,
                      economy: agents.economy,
                      health: agents.health,
                    },
                    synthesis: agents.meta ?? { agentId: "meta", status: "streaming", response: "", latencyMs: 0 },
                    integrityHash: integrityHash || "computing...",
                    timestamp: new Date().toISOString(),
                    ...prev,
                  }));
                }
              } else if (eventType === "meta_delta") {
                setStreamingMeta((prev) => prev + payload.content);
              } else if (eventType === "done") {
                integrityHash = payload.integrityHash;
                setResult({
                  status: "completed",
                  agents: {
                    climate: agents.climate,
                    economy: agents.economy,
                    health: agents.health,
                  },
                  synthesis: agents.meta ?? { agentId: "meta", status: "ok", response: "", latencyMs: 0 },
                  integrityHash: payload.integrityHash,
                  timestamp: payload.timestamp,
                });
              } else if (eventType === "error") {
                toast.error(payload.message || "Swarm error");
              }
            } catch { /* partial json */ }
          }
        }
      }
    } catch (err) {
      console.error("Swarm stream error:", err);
      toast.error("Swarm failed: " + (err instanceof Error ? err.message : "Unknown"));
    } finally {
      setLoading(false);
      setAgentStatuses({});
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [prompt, user, dataOcean]);

  const agentTabs: { id: AgentTab; label: string; icon: React.ReactNode }[] = [
    { id: "synthesis", label: "META", icon: <Brain className="h-3.5 w-3.5" /> },
    { id: "climate", label: "CLIMATE", icon: <Cloud className="h-3.5 w-3.5" /> },
    { id: "economy", label: "ECONOMY", icon: <DollarSign className="h-3.5 w-3.5" /> },
    { id: "health", label: "HEALTH", icon: <HeartPulse className="h-3.5 w-3.5" /> },
  ];

  const getAgentContent = (): string => {
    if (!result && !streamingMeta) return "";
    if (activeTab === "synthesis") {
      if (streamingMeta && loading) return streamingMeta;
      return result?.synthesis?.response ?? "";
    }
    return result?.agents?.[activeTab]?.response ?? "";
  };

  const getAgentLatency = (): number | null => {
    if (!result) return null;
    if (activeTab === "synthesis") return result.synthesis?.latencyMs ?? null;
    return result.agents?.[activeTab]?.latencyMs ?? null;
  };

  const content = getAgentContent();
  const hasOutput = Boolean(result || streamingMeta);
  const latency = getAgentLatency();
  const healthSources = dataOcean?.health ?? {};
  const healthCount = Object.values(healthSources).filter(Boolean).length;
  const terminalSurface =
    "rounded-xl border border-[#d8cfbe]/90 bg-[#fbf7ef]/95 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_18px_40px_-28px_rgba(89,78,66,0.45)]";

  const runtimeQueue = useMemo(() => {
    const getState = (id: "climate" | "economy" | "health" | "meta") => {
      if (loading) return agentStatuses[id] ?? "pending";
      if (!result && !streamingMeta) return "idle";
      if (id === "meta") return result?.synthesis?.status === "ok" ? "done" : "active";
      const agentState = result?.agents?.[id]?.status;
      if (agentState === "ok") return "done";
      if (agentState === "error") return "error";
      return "active";
    };

    return [
      { id: "climate", label: "CLIMATE", state: getState("climate") },
      { id: "economy", label: "ECONOMY", state: getState("economy") },
      { id: "health", label: "HEALTH", state: getState("health") },
      { id: "meta", label: "META", state: getState("meta") },
    ];
  }, [agentStatuses, loading, result, streamingMeta]);

  const statusTone = (state: string) => {
    if (state === "done") return "text-[#2f8f5b] bg-[#e9f6ee] border-[#9ecdb1]";
    if (state === "error") return "text-[#b4534f] bg-[#faecea] border-[#d7aca8]";
    if (state === "active") return "text-[#b8802f] bg-[#faf2e4] border-[#dfc299]";
    if (state === "pending") return "text-[#907a54] bg-[#f8f0e2] border-[#d8c3a1]";
    return "text-[#6b655c] bg-[#f4eee4] border-[#d3c9ba]";
  };

  return (
    <div className="relative min-h-screen bg-[linear-gradient(160deg,#f6f1e7_0%,#f2ecdf_48%,#efe8da_100%)] text-[#2f2b26]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:radial-gradient(#8b7f6e_0.55px,transparent_0.55px)] [background-size:4px_4px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(120%_85%_at_50%_0%,rgba(255,255,255,0.84),rgba(255,255,255,0)_72%)]" />
      {/* ═══ TOP BAR ═══ */}
      <div className="sticky top-0 z-50 border-b border-[#d9cfbf] bg-[#f7f1e4]/92 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#2f8f5b] animate-pulse" />
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-[#2f8f5b] uppercase font-bold">
                ETERNAL NEXUS
              </span>
            </Link>
            <div className="w-px h-4 bg-[#d7cebf]" />
            <span className="font-mono text-[0.45rem] text-[#6d665b] tracking-wider">AETHER CANON TERMINAL</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link to="/atlas">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono text-[#4f483f] hover:bg-[#efe7d8] hover:text-[#2f2b26]">
                <Globe className="h-3 w-3" /> ATLAS
              </Button>
            </Link>
            <Link to="/news">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono text-[#4f483f] hover:bg-[#efe7d8] hover:text-[#2f2b26]">
                <Activity className="h-3 w-3" /> NEWS
              </Button>
            </Link>
            <Link to="/tribunal">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono text-[#4f483f] hover:bg-[#efe7d8] hover:text-[#2f2b26]">
                <Shield className="h-3 w-3" /> TRIBUNAL
              </Button>
            </Link>
            <span className="rounded border border-[#d8c9ad] bg-[#f8efde] px-2 py-0.5 font-mono text-[0.42rem] tracking-[0.14em] text-[#9b7640] uppercase">
              WorkVisual
            </span>
            {user && (
              <span className="font-mono text-[0.45rem] text-[#7a7367]">
                {user.email?.split("@")[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-7">
        {/* ═══ CONTEXT / SEMAFORO / QUEUE ═══ */}
        <div className="mb-6 grid gap-3 lg:grid-cols-3">
          <div className={`${terminalSurface} p-4`}>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-[#2f8f5b]" />
              <span className="font-mono text-[0.56rem] tracking-[0.22em] text-[#5f5549] uppercase">Context Semaforo</span>
            </div>
            <div className="space-y-2 font-mono text-[0.55rem]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#6f685d]">CHAT</span>
                <span className="text-[0.5rem] text-[#4f483f]">front-end</span>
                <span className="rounded border border-[#9ecdb1] bg-[#ebf6ee] px-2 py-0.5 text-[#2f8f5b]">OK</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#6f685d]">BRANCH</span>
                <span className="max-w-[7.5rem] truncate text-[0.5rem] text-[#4f483f]">{WORKSPACE.canonicalBranch}</span>
                <span className="rounded border border-[#9ecdb1] bg-[#ebf6ee] px-2 py-0.5 text-[#2f8f5b]">CANON</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#6f685d]">WORKTREE</span>
                <span className="text-[0.5rem] text-[#4f483f]">WorkVisual</span>
                <span className="rounded border border-[#9ecdb1] bg-[#ebf6ee] px-2 py-0.5 text-[#2f8f5b]">LIVE</span>
              </div>
            </div>
          </div>

          <div className={`${terminalSurface} p-4`}>
            <div className="mb-3 flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-[#2f8f5b]" />
              <span className="font-mono text-[0.56rem] tracking-[0.22em] text-[#5f5549] uppercase">Assigned Queue</span>
            </div>
            <div className="space-y-1.5">
              {runtimeQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-[#ddd2c1] bg-[#f7f2e8] px-2.5 py-1.5">
                  <span className="font-mono text-[0.53rem] tracking-[0.14em] text-[#4f483f]">{item.label}</span>
                  <span className={`rounded border px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider ${statusTone(item.state)}`}>
                    {item.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${terminalSurface} p-4`}>
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-[#2f8f5b]" />
              <span className="font-mono text-[0.56rem] tracking-[0.22em] text-[#5f5549] uppercase">Metrics</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-[#ddd2c1] bg-[#f7f2e8] p-2 text-center">
                <div className="font-mono text-[0.45rem] tracking-wider text-[#756d62]">SOURCES</div>
                <div className="font-mono text-[0.75rem] font-semibold text-[#2f2b26]">{healthCount}/4</div>
              </div>
              <div className="rounded-lg border border-[#ddd2c1] bg-[#f7f2e8] p-2 text-center">
                <div className="font-mono text-[0.45rem] tracking-wider text-[#756d62]">HISTORY</div>
                <div className="font-mono text-[0.75rem] font-semibold text-[#2f2b26]">{history.length}</div>
              </div>
              <div className="rounded-lg border border-[#ddd2c1] bg-[#f7f2e8] p-2 text-center">
                <div className="font-mono text-[0.45rem] tracking-wider text-[#756d62]">LATENCY</div>
                <div className="font-mono text-[0.75rem] font-semibold text-[#2f2b26]">{latency ?? "—"}</div>
              </div>
            </div>
          </div>
        </div>
        {/* ═══ DATA OCEAN STATUS ═══ */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#2f8f5b]" />
              <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[#5f5549] uppercase">Data Ocean</span>
              <span className="font-mono text-[0.47rem] text-[#756d62]">
                {healthCount}/4 sources online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 gap-1 border border-[#ded3c2] bg-[#f7f2e8] text-[0.5rem] font-mono text-[#5b5348] hover:bg-[#efe6d6]" onClick={() => setShowData(!showData)}>
                <ChevronDown className={`h-3 w-3 transition-transform ${showData ? "rotate-180" : ""}`} />
                {showData ? "HIDE" : "SHOW"} RAW
              </Button>
              <Button variant="ghost" size="sm" className="h-6 gap-1 border border-[#ded3c2] bg-[#f7f2e8] text-[0.5rem] font-mono text-[#5b5348] hover:bg-[#efe6d6]" onClick={fetchDataOcean} disabled={dataLoading}>
                <RefreshCw className={`h-3 w-3 ${dataLoading ? "animate-spin" : ""}`} />
                REFRESH
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { key: "noaa", label: "NOAA Climate", icon: <Cloud className="h-3 w-3" /> },
              { key: "worldbank_co2", label: "World Bank CO2", icon: <Activity className="h-3 w-3" /> },
              { key: "worldbank_gdp", label: "World Bank GDP", icon: <DollarSign className="h-3 w-3" /> },
              { key: "nasa", label: "NASA DONKI", icon: <Zap className="h-3 w-3" /> },
            ].map((src) => (
              <div key={src.key}
                className={`rounded-xl border px-3 py-2.5 flex items-center gap-2.5 bg-[#fbf7ef]/95 ${
                  healthSources[src.key] ? "border-[#9ecdb1]" : "border-[#d7aca8]"
                }`}>
                {src.icon}
                <div>
                  <span className="font-mono text-[0.5rem] text-[#403a32] block">{src.label}</span>
                  <span className={`font-mono text-[0.42rem] ${healthSources[src.key] ? "text-[#2f8f5b]" : "text-[#b4534f]"}`}>
                    {healthSources[src.key] ? "● ONLINE" : "● OFFLINE"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {showData && dataOcean && (
            <div className={`${terminalSurface} mt-3 max-h-64 overflow-y-auto p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="h-3 w-3 text-[#2f8f5b]" />
                <span className="font-mono text-[0.5rem] text-[#5f5549] tracking-wider">RAW DATA FEED</span>
              </div>
              <pre className="font-mono text-[0.53rem] leading-relaxed text-[#6e665a] whitespace-pre-wrap break-all">
                {JSON.stringify(dataOcean.sources, null, 2).slice(0, 4000)}
              </pre>
            </div>
          )}
        </div>

        {/* ═══ DATA CHARTS ═══ */}
        {dataOcean?.sources && <DataCharts sources={dataOcean.sources} />}

        {/* ═══ HOLOGRAPHIC ROOM 3D ═══ */}
        <div className="mb-6">
          <NexusHolographicRoom />
        </div>

        {/* ═══ AI COUNCIL — PARLAMENTO DIGITAL ═══ */}
        <AICouncil
          onDecisionApproved={(decision) => {
            setPrompt(`DECISÃO DO CONSELHO AI APROVADA:\n${decision}\n\nExecute análise de viabilidade completa.`);
          }}
          onMigrateToAtlas={() => {
            toast.success("Agentes migraram para o Atlas — execução em andamento.");
          }}
        />

        {/* ═══ ALERT MONITOR (CLOSED LOOP) ═══ */}
        <AlertMonitor
          earthquakes={earthquakeContext}
          pollution={pollutionContext}
          onTriggerSwarm={(p) => { setPrompt(p); }}
          disabled={loading}
        />

        {/* ═══ SCENARIO SIMULATOR 2100 ═══ */}
        <ScenarioSimulator
          onRunScenario={(p) => { setPrompt(p); }}
          disabled={loading}
        />

        {/* ═══ SALA DE CRISE ═══ */}
        <CrisisMode
          onInjectPrompt={(p) => { setPrompt(p); }}
          disabled={loading}
        />

        {/* ═══ GA OPTIMIZER ═══ */}
        <GAOptimizationPanel />

        {/* ═══ AI GUARDIANS DASHBOARD ═══ */}
        <GuardiansDashboard />

        {/* ═══ PROMPT INPUT ═══ */}
        <div className={`${terminalSurface} mb-6 p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-[#2f8f5b]" />
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[#5f5549] uppercase">Prompt Master</span>
          </div>

          {!user ? (
            <div className="text-center py-6">
              <span className="font-mono text-xs text-muted-foreground block mb-2">
                Autenticação necessária para ativar o swarm
              </span>
              <Link to="/access">
                <Button variant="default" size="sm" className="font-mono text-xs">Login / Signup</Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && runSwarmStreaming()}
                placeholder="Simule crise hídrica global, 100 anos, otimize com tech atual + inovações..."
                className="font-mono text-sm bg-[#f8f3ea] border-[#d5cab7] text-[#2f2b26] placeholder:text-[#8a8175] focus-visible:ring-[#b9a88e]/40"
                disabled={loading}
              />
              {voiceSupported && (
                <Button
                  variant={listening ? "destructive" : "outline"}
                  size="icon"
                  className="shrink-0"
                  onClick={toggleVoice}
                  disabled={loading}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Button
                onClick={runSwarmStreaming}
                disabled={loading || !prompt.trim()}
                className="gap-2 border border-[#2a7f52] bg-[#2f8f5b] font-mono text-xs tracking-wider text-[#f5f2ea] px-6 hover:bg-[#27794d]"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "STREAMING" : "DEPLOY SWARM"}
              </Button>
            </div>
          )}

          {/* Voice indicator */}
          {listening && (
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#b4534f] animate-pulse" />
              <span className="font-mono text-[0.5rem] text-[#b4534f]">ESCUTANDO... fale seu prompt</span>
            </div>
          )}

          {/* Live agent status during streaming */}
          {loading && Object.keys(agentStatuses).length > 0 && (
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {(["climate", "economy", "health", "meta"] as const).map((a) => {
                const status = agentStatuses[a];
                return (
                  <span key={a} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f6f0e4] border border-[#d8cebd]">
                    {status === "done" ? (
                      <CheckCircle2 className="h-2.5 w-2.5 text-[#2f8f5b]" />
                    ) : status === "error" ? (
                      <Activity className="h-2.5 w-2.5 text-[#b4534f]" />
                    ) : (
                      <Loader2 className="h-2.5 w-2.5 animate-spin text-[#b8802f]" />
                    )}
                    <span className="font-mono text-[0.45rem] text-[#6d665a] uppercase">{a}</span>
                  </span>
                );
              })}
              <span className="font-mono text-[0.42rem] text-[#756d62] animate-pulse">
                {streamingMeta ? "Meta-agent streaming..." : "Agents analyzing..."}
              </span>
            </div>
          )}
        </div>

        {/* ═══ RESULTS ═══ */}
        <div className="mb-6">
          {hasOutput ? (
            <>
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {agentTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[0.55rem] tracking-wider transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#2f8f5b] text-[#f4f1ea] border border-[#2a7f52]"
                      : "bg-[#f8f2e8] border border-[#d8cebe] text-[#6a6358] hover:text-[#2f2b26] hover:bg-[#efe6d8]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {latency !== null && activeTab === tab.id && (
                    <span className="text-[0.4rem] opacity-70">{latency}ms</span>
                  )}
                </button>
              ))}

              {result?.integrityHash && result.integrityHash !== "computing..." && (
                <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#eaf6ee] border border-[#9ecdb1]">
                  <ShieldCheck className="h-3 w-3 text-[#2f8f5b]" />
                  <span className="font-mono text-[0.42rem] text-[#2f8f5b]">
                    SHA-256: {result.integrityHash.slice(0, 16)}...
                  </span>
                </div>
              )}
            </div>

            {content && (
              <div className={`${terminalSurface} p-6`}>
                <div className="mb-4 flex items-center justify-between border-b border-[#ddd2c1] pb-2">
                  <span className="font-mono text-[0.52rem] tracking-[0.18em] text-[#5f5549] uppercase">Document Block</span>
                  <span className="rounded border border-[#d8c3a1] bg-[#faf2e4] px-2 py-0.5 font-mono text-[0.45rem] tracking-wider text-[#b8802f]">LONG-READ</span>
                </div>
                <div className="prose prose-sm max-w-none text-[#2f2b26] prose-p:leading-7 prose-p:text-[#3f392f] prose-headings:text-[#2b261f] prose-strong:text-[#2f2b26] prose-code:text-[#2f8f5b] font-mono text-sm leading-relaxed">
                  <ReactMarkdown>{content}</ReactMarkdown>
                  {loading && activeTab === "synthesis" && (
                    <span className="inline-block w-2 h-4 bg-[#2f8f5b] animate-pulse ml-1" />
                  )}
                </div>
              </div>
            )}
            </>
          ) : (
            <div className={`${terminalSurface} p-6`}>
              <div className="mb-4 flex items-center justify-between border-b border-[#ddd2c1] pb-2">
                <span className="font-mono text-[0.52rem] tracking-[0.18em] text-[#5f5549] uppercase">Document Block</span>
                <span className="rounded border border-[#d8c3a1] bg-[#faf2e4] px-2 py-0.5 font-mono text-[0.45rem] tracking-wider text-[#b8802f]">READY</span>
              </div>
              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-[#d9cdb9] bg-[#f7f1e6] px-2.5 py-2">
                  <p className="font-mono text-[0.45rem] tracking-[0.18em] text-[#7f7668] uppercase">HANDOFF_TABLE</p>
                  <p className="mt-1 font-mono text-[0.55rem] text-[#4f483f]">estrutura pronta para continuidade do elo</p>
                </div>
                <div className="rounded-lg border border-[#d9cdb9] bg-[#f7f1e6] px-2.5 py-2">
                  <p className="font-mono text-[0.45rem] tracking-[0.18em] text-[#7f7668] uppercase">EVIDENCE_BLOCK</p>
                  <p className="mt-1 font-mono text-[0.55rem] text-[#4f483f]">prova objetiva de alteração e execução</p>
                </div>
              </div>
              <p className="font-mono text-[0.68rem] leading-relaxed text-[#6e665a]">
                Handoff/document stream pronto para leitura longa. Execute um prompt para materializar synthesis, evidência e trilha operacional.
              </p>
            </div>
          )}
        </div>

        {/* ═══ HISTORY ═══ */}
        {history.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-[#2f8f5b]" />
              <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[#5f5549] uppercase">Simulation Log</span>
            </div>
            <div className="space-y-1">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#ddd2c1] bg-[#fbf7ef]/95">
                  <span className="font-mono text-[0.5rem] text-[#756d62] shrink-0">
                    {new Date(h.date).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="font-mono text-xs text-[#2f2b26] truncate flex-1">{h.prompt}</span>
                  {h.hash && (
                    <span className="font-mono text-[0.42rem] text-[#2f8f5b] shrink-0">
                      #{h.hash.slice(0, 8)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
