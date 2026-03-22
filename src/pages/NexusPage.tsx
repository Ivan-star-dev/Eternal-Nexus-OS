import { useState, useCallback, useEffect, useRef } from "react";
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
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { fetchGlobalPollution, type PollutionPoint } from "@/lib/dataSources";
import { fetchRecentEarthquakes, type EarthquakePoint } from "@/lib/earthquakeData";
import { buildHealthContext } from "@/lib/healthData";
import { buildSecurityContext } from "@/lib/securityData";
import { buildSustainabilityContext } from "@/components/atlas/SustainabilityLayer";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const PHASE = "PHASE-3";
const BRANCH = "claude/rebuild-bastion-core";
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const DATA_SOURCES = [
  { key: "noaa", label: "NOAA Climate", icon: <Cloud className="h-3 w-3" /> },
  { key: "worldbank_co2", label: "World Bank CO2", icon: <Activity className="h-3 w-3" /> },
  { key: "worldbank_gdp", label: "World Bank GDP", icon: <DollarSign className="h-3 w-3" /> },
  { key: "nasa", label: "NASA DONKI", icon: <Zap className="h-3 w-3" /> },
] as const;

// ─────────────────────────────────────────────
// L1 — Corporate Header
// ─────────────────────────────────────────────

interface L1CorporateHeaderProps {
  userEmail?: string;
  executorActive: boolean;
}

function L1CorporateHeader({ userEmail, executorActive }: L1CorporateHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Identity + Phase */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            <span className="font-mono text-[0.6rem] tracking-[0.3em] text-primary uppercase font-bold">
              ETERNAL NEXUS
            </span>
          </Link>
          <div className="w-px h-4 bg-border/50" />
          <span className="font-mono text-[0.45rem] text-muted-foreground tracking-wider">WAR ROOM</span>
          <div className="w-px h-4 bg-border/50" />
          <span className="font-mono text-[0.4rem] text-primary/60 tracking-widest">{PHASE}</span>
          <div className="w-px h-4 bg-border/50" />
          <span className="font-mono text-[0.4rem] text-muted-foreground/60 tracking-widest">{BRANCH}</span>
        </div>

        {/* Nav + Executor State */}
        <div className="flex items-center gap-3">
          <Link to="/atlas">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono">
              <Globe className="h-3 w-3" /> ATLAS
            </Button>
          </Link>
          <Link to="/news">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono">
              <Activity className="h-3 w-3" /> NEWS
            </Button>
          </Link>
          <Link to="/tribunal">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono">
              <Shield className="h-3 w-3" /> TRIBUNAL
            </Button>
          </Link>
          <div className="w-px h-4 bg-border/50" />
          {/* Executor state badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[0.4rem] tracking-widest border ${
            executorActive
              ? "border-primary/40 text-primary bg-primary/10"
              : "border-border/30 text-muted-foreground"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${executorActive ? "bg-primary animate-pulse" : "bg-muted-foreground/40"}`} />
            {executorActive ? "EXECUTOR ACTIVE" : "EXECUTOR IDLE"}
          </span>
          {userEmail && (
            <span className="font-mono text-[0.4rem] text-muted-foreground">
              {userEmail.split("@")[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// L2 — Context Rail
// ─────────────────────────────────────────────

interface L2ContextRailProps {
  healthSources: Record<string, boolean>;
  healthCount: number;
  dataLoading: boolean;
  showData: boolean;
  dataOcean: DataOceanResult | null;
  onToggleData: () => void;
  onRefresh: () => void;
  agentStatuses: Record<string, "pending" | "done" | "error">;
  loading: boolean;
  streamingMeta: string;
}

function L2ContextRail({
  healthSources,
  healthCount,
  dataLoading,
  showData,
  dataOcean,
  onToggleData,
  onRefresh,
  agentStatuses,
  loading,
  streamingMeta,
}: L2ContextRailProps) {
  return (
    <section className="mb-4 border border-border/20 rounded-lg bg-card/40">
      {/* Semaphore + gate header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/20">
        <div className="flex items-center gap-3">
          <Database className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">Context Rail</span>
          <span className="font-mono text-[0.4rem] text-muted-foreground">
            {healthCount}/4 gates online
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 text-[0.5rem] font-mono"
            onClick={onToggleData}
          >
            <ChevronDown className={`h-3 w-3 transition-transform ${showData ? "rotate-180" : ""}`} />
            {showData ? "HIDE" : "SHOW"} RAW
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 text-[0.5rem] font-mono"
            onClick={onRefresh}
            disabled={dataLoading}
          >
            <RefreshCw className={`h-3 w-3 ${dataLoading ? "animate-spin" : ""}`} />
            REFRESH
          </Button>
        </div>
      </div>

      {/* Semaphore status grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3">
        {DATA_SOURCES.map((src) => (
          <div
            key={src.key}
            className={`bg-card border rounded-lg px-3 py-2 flex items-center gap-2 ${
              healthSources[src.key] ? "border-accent/30" : "border-destructive/30"
            }`}
          >
            {src.icon}
            <div>
              <span className="font-mono text-[0.5rem] text-foreground block">{src.label}</span>
              <span className={`font-mono text-[0.4rem] ${healthSources[src.key] ? "text-accent-foreground" : "text-destructive"}`}>
                {healthSources[src.key] ? "● ONLINE" : "● OFFLINE"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Agent gate status during streaming */}
      {loading && Object.keys(agentStatuses).length > 0 && (
        <div className="flex items-center gap-3 flex-wrap px-4 py-2 border-t border-border/20">
          <span className="font-mono text-[0.45rem] text-muted-foreground tracking-widest uppercase">Agent Gates:</span>
          {(["climate", "economy", "health", "meta"] as const).map((a) => {
            const status = agentStatuses[a];
            return (
              <span key={a} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted border border-border/30">
                {status === "done" ? (
                  <CheckCircle2 className="h-2.5 w-2.5 text-accent-foreground" />
                ) : status === "error" ? (
                  <Activity className="h-2.5 w-2.5 text-destructive" />
                ) : (
                  <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                )}
                <span className="font-mono text-[0.45rem] text-muted-foreground uppercase">{a}</span>
              </span>
            );
          })}
          <span className="font-mono text-[0.4rem] text-muted-foreground animate-pulse ml-2">
            {streamingMeta ? "Meta-agent streaming..." : "Agents analyzing..."}
          </span>
        </div>
      )}

      {/* Raw data feed */}
      {showData && dataOcean && (
        <div className="mx-3 mb-3 bg-card/80 border border-border/30 rounded-lg p-4 max-h-64 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-3 w-3 text-primary" />
            <span className="font-mono text-[0.5rem] text-primary tracking-wider">RAW DATA FEED</span>
          </div>
          <pre className="font-mono text-[0.5rem] text-muted-foreground whitespace-pre-wrap break-all">
            {JSON.stringify(dataOcean.sources, null, 2).slice(0, 4000)}
          </pre>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// L3 — Long Read Core
// ─────────────────────────────────────────────

interface L3LongReadCoreProps {
  result: SwarmResult | null;
  streamingMeta: string;
  loading: boolean;
  activeTab: AgentTab;
  onSetActiveTab: (tab: AgentTab) => void;
  agentTabs: { id: AgentTab; label: string; icon: React.ReactNode }[];
  content: string;
  latency: number | null;
}

function L3LongReadCore({
  result,
  streamingMeta,
  loading,
  activeTab,
  onSetActiveTab,
  agentTabs,
  content,
  latency,
}: L3LongReadCoreProps) {
  if (!result && !streamingMeta) return null;

  return (
    <section className="mb-4 border border-border/20 rounded-lg bg-card/40">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/20">
        <Brain className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">Reasoning Core</span>
        <span className="font-mono text-[0.4rem] text-muted-foreground">— decisions · narrative · analysis</span>
      </div>

      {/* Agent tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border/20 flex-wrap">
        {agentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSetActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[0.55rem] tracking-wider transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border/30 text-muted-foreground hover:text-foreground"
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
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20">
            <ShieldCheck className="h-3 w-3 text-accent-foreground" />
            <span className="font-mono text-[0.4rem] text-accent-foreground">
              SHA-256: {result.integrityHash.slice(0, 16)}...
            </span>
          </div>
        )}
      </div>

      {/* Reasoning content */}
      {content && (
        <div className="p-6">
          <div className="prose prose-sm prose-invert max-w-none font-mono text-sm leading-relaxed">
            <ReactMarkdown>{content}</ReactMarkdown>
            {loading && activeTab === "synthesis" && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// L4 — Execution Deck
// ─────────────────────────────────────────────

interface L4ExecutionDeckProps {
  user: { email?: string | null } | null;
  prompt: string;
  loading: boolean;
  listening: boolean;
  voiceSupported: boolean;
  onPromptChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onToggleVoice: () => void;
  onDeploy: () => void;
  dataOcean: DataOceanResult | null;
}

function L4ExecutionDeck({
  user,
  prompt,
  loading,
  listening,
  voiceSupported,
  onPromptChange,
  onKeyDown,
  onToggleVoice,
  onDeploy,
  dataOcean,
}: L4ExecutionDeckProps) {
  return (
    <section className="mb-4 border border-border/20 rounded-lg bg-card/40">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/20">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">Execution Deck</span>
          <span className="font-mono text-[0.4rem] text-muted-foreground">— commands · diffs · evidence</span>
        </div>
        {dataOcean?.timestamp && (
          <span className="font-mono text-[0.4rem] text-muted-foreground">
            last sync: {new Date(dataOcean.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Holographic room */}
      <div className="p-4 border-b border-border/20">
        <NexusHolographicRoom />
      </div>

      {/* Charts */}
      {dataOcean?.sources && (
        <div className="p-4 border-b border-border/20">
          <DataCharts sources={dataOcean.sources} />
        </div>
      )}

      {/* Prompt / command input */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">Prompt Master</span>
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
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Simule crise hídrica global, 100 anos, otimize com tech atual + inovações..."
              className="font-mono text-sm bg-background/50 border-border/30"
              disabled={loading}
            />
            {voiceSupported && (
              <Button
                variant={listening ? "destructive" : "outline"}
                size="icon"
                className="shrink-0"
                onClick={onToggleVoice}
                disabled={loading}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            <Button
              onClick={onDeploy}
              disabled={loading || !prompt.trim()}
              className="gap-2 font-mono text-xs tracking-wider px-6"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "STREAMING" : "DEPLOY SWARM"}
            </Button>
          </div>
        )}

        {/* Voice indicator */}
        {listening && (
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <span className="font-mono text-[0.5rem] text-destructive">ESCUTANDO... fale seu prompt</span>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// L5 — Pioneer Signature Band
// ─────────────────────────────────────────────

function L5PioneerSignatureBand() {
  return (
    <div className="mb-4 border border-primary/10 rounded-lg bg-primary/5 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Radio className="h-3.5 w-3.5 text-primary/60" />
        <span className="font-mono text-[0.45rem] text-primary/60 tracking-[0.3em] uppercase">
          Agent: Eternal Nexus OS — Aether Canon Terminal
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-[0.4rem] text-muted-foreground/60">build: {BUILD_DATE}</span>
        <span className="font-mono text-[0.4rem] text-muted-foreground/60">arch: 6-layer</span>
        <span className="font-mono text-[0.4rem] text-primary/50 tracking-widest">{PHASE}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// L6 — Handoff Chain Block
// ─────────────────────────────────────────────

interface L6HandoffChainBlockProps {
  history: { prompt: string; hash: string; date: string }[];
}

function L6HandoffChainBlock({ history }: L6HandoffChainBlockProps) {
  if (history.length === 0) return null;

  return (
    <section className="mb-6 border border-border/20 rounded-lg bg-card/40">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/20">
        <Activity className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">Handoff Chain</span>
        <span className="font-mono text-[0.4rem] text-muted-foreground">— simulation log · next actor</span>
      </div>

      {/* Chain entries */}
      <div className="p-3 space-y-1">
        {history.map((h, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 bg-card/50 border border-border/20 rounded-lg">
            <span className="font-mono text-[0.45rem] text-muted-foreground/60 shrink-0 tabular-nums">
              #{String(history.length - i).padStart(3, "0")}
            </span>
            <span className="font-mono text-[0.5rem] text-muted-foreground shrink-0">
              {new Date(h.date).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="font-mono text-xs text-foreground truncate flex-1">{h.prompt}</span>
            {h.hash && (
              <span className="font-mono text-[0.4rem] text-accent-foreground shrink-0">
                #{h.hash.slice(0, 8)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Next actor hint */}
      <div className="px-4 py-2 border-t border-border/20 flex items-center gap-2">
        <span className="font-mono text-[0.4rem] text-muted-foreground/50 tracking-widest">NEXT ACTOR →</span>
        <span className="font-mono text-[0.4rem] text-primary/50">swarm-executor / atlas-layer / tribunal-gate</span>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────

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
  }, [prompt, user, dataOcean, pollutionContext, earthquakeContext]);

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
  const latency = getAgentLatency();
  const healthSources = dataOcean?.health ?? {};
  const healthCount = Object.values(healthSources).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════
          L1 — CORPORATE HEADER
          Identity, phase, branch, executor state
      ═══════════════════════════════════════════ */}
      <L1CorporateHeader
        userEmail={user?.email ?? undefined}
        executorActive={loading}
      />

      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* ═══════════════════════════════════════════
            L2 — CONTEXT RAIL
            Semaphore status, gate status, dependencies
        ═══════════════════════════════════════════ */}
        <L2ContextRail
          healthSources={healthSources}
          healthCount={healthCount}
          dataLoading={dataLoading}
          showData={showData}
          dataOcean={dataOcean}
          onToggleData={() => setShowData(!showData)}
          onRefresh={fetchDataOcean}
          agentStatuses={agentStatuses}
          loading={loading}
          streamingMeta={streamingMeta}
        />

        {/* ═══════════════════════════════════════════
            L3 — LONG READ CORE
            Reasoning, decisions, narrative section
        ═══════════════════════════════════════════ */}
        <L3LongReadCore
          result={result}
          streamingMeta={streamingMeta}
          loading={loading}
          activeTab={activeTab}
          onSetActiveTab={setActiveTab}
          agentTabs={agentTabs}
          content={content}
          latency={latency}
        />

        {/* ═══════════════════════════════════════════
            L4 — EXECUTION DECK
            Commands, diffs, evidence output
            (also hosts sub-panels: council, alerts,
             simulator, crisis, GA, guardians)
        ═══════════════════════════════════════════ */}
        <L4ExecutionDeck
          user={user}
          prompt={prompt}
          loading={loading}
          listening={listening}
          voiceSupported={voiceSupported}
          onPromptChange={setPrompt}
          onKeyDown={(e) => e.key === "Enter" && !loading && runSwarmStreaming()}
          onToggleVoice={toggleVoice}
          onDeploy={runSwarmStreaming}
          dataOcean={dataOcean}
        />

        {/* Sub-panels housed in the Execution Deck layer */}
        <div className="mb-4 space-y-4">
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
        </div>

        {/* ═══════════════════════════════════════════
            L5 — PIONEER SIGNATURE BAND
            Agent identity band
        ═══════════════════════════════════════════ */}
        <L5PioneerSignatureBand />

        {/* ═══════════════════════════════════════════
            L6 — HANDOFF CHAIN BLOCK
            Handoff + next actor block
        ═══════════════════════════════════════════ */}
        <L6HandoffChainBlock history={history} />

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
