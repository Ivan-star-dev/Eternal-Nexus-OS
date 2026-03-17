import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Radio, Globe, Brain, Play, Pause, Volume2, VolumeX,
  Activity, HeartPulse, Shield, Cloud, DollarSign, Newspaper,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import AIAnchor3D from "@/components/news/AIAnchor3D";
import BroadcastBar from "@/components/news/BroadcastBar";
import { useOrganismFlow } from "@/hooks/useOrganismFlow";
import type { IndexEntry } from "@/types/index-organ";

// ═══ Report types ═══
interface NewsReport {
  id: string;
  title: string;
  summary: string;
  category: "climate" | "health" | "security" | "economy" | "infra";
  severity: "critical" | "high" | "moderate" | "info";
  timestamp: string;
  source: string;
  fullAnalysis?: string;
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  climate: { icon: <Cloud className="h-3 w-3" />, color: "text-green-400", label: "CLIMA" },
  health: { icon: <HeartPulse className="h-3 w-3" />, color: "text-red-400", label: "SAÚDE" },
  security: { icon: <Shield className="h-3 w-3" />, color: "text-blue-400", label: "SEGURANÇA" },
  economy: { icon: <DollarSign className="h-3 w-3" />, color: "text-yellow-400", label: "ECONOMIA" },
  infra: { icon: <Activity className="h-3 w-3" />, color: "text-purple-400", label: "INFRA" },
};

// ═══ AI Anchor (ElevenLabs TTS with browser fallback) ═══
function useAIAnchor() {
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string) => {
    if (muted) return;

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setSpeaking(true);

    try {
      // Try ElevenLabs first
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/echo-vox-tts`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: text.slice(0, 2000) }),
      });

      if (!response.ok) throw new Error(`TTS ${response.status}`);

      // Check if response is JSON (fallback signal) vs audio
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (data.fallback) throw new Error("ElevenLabs unavailable, using browser TTS");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setSpeaking(false); URL.revokeObjectURL(audioUrl); };
      audioRef.current = audio;
      await audio.play();
    } catch (err) {
      console.warn("ElevenLabs TTS failed, falling back to browser:", err);
      // Browser TTS fallback
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = "pt-BR";
        utt.rate = 0.95;
        utt.pitch = 0.9;
        utt.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utt);
      } else {
        setSpeaking(false);
      }
    }
  }, [muted]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { speaking, muted, setMuted, speak, stop };
}

// ═══ Live ticker ═══
function NewsTicker({ reports }: { reports: NewsReport[] }) {
  return (
    <div className="bg-destructive/10 border-y border-destructive/20 overflow-hidden">
      <div className="flex items-center animate-[scroll_30s_linear_infinite] whitespace-nowrap py-1">
        {[...reports, ...reports].map((r, i) => {
          const meta = CATEGORY_META[r.category];
          return (
            <span key={i} className="inline-flex items-center gap-2 px-4">
              <span className={`font-mono text-[0.45rem] ${meta?.color}`}>■ {meta?.label}</span>
              <span className="font-mono text-[0.5rem] text-foreground/80">{r.title}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}


const mapIndexCategory = (category: IndexEntry['category']): NewsReport['category'] => {
  if (category === 'verdict') return 'security';
  return category;
};

const mapSeverity = (score: number): NewsReport['severity'] => {
  if (score >= 0.85) return 'critical';
  if (score >= 0.65) return 'high';
  if (score >= 0.4) return 'moderate';
  return 'info';
};

const mapIndexEntryToReport = (entry: IndexEntry): NewsReport => ({
  id: entry.id,
  title: entry.title,
  summary: entry.summary,
  category: mapIndexCategory(entry.category),
  severity: mapSeverity(entry.severity),
  timestamp: new Date(entry.timestamp).toISOString(),
  source: entry.sources.map((source) => source.organ).join('/'),
});

// ═══ Main Page ═══
export default function NewsPortal() {
  const { user } = useAuth();
  const { indexEntries, setNewsItems } = useOrganismFlow();
  const reports = useMemo<NewsReport[]>(() => indexEntries.map(mapIndexEntryToReport), [indexEntries]);
  const [selectedReport, setSelectedReport] = useState<NewsReport | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const anchor = useAIAnchor();

  useEffect(() => {
    setNewsItems(reports.map((report) => ({
      id: report.id,
      title: report.title,
      summary: report.summary,
      category: report.category,
      timestamp: report.timestamp,
      source: report.source,
    })));
  }, [reports, setNewsItems]);

  const readReport = useCallback((report: NewsReport) => {
    setSelectedReport(report);
    setAiAnalysis(report.fullAnalysis || null);
    anchor.speak(`${CATEGORY_META[report.category]?.label}. ${report.title}. ${report.summary}`);
  }, [anchor]);

  const generateAIAnalysis = useCallback(async (report: NewsReport) => {
    if (!user) return;
    setAnalysisLoading(true);
    try {
      const { data } = await supabase.functions.invoke("nexus-swarm", {
        body: {
          prompt: `Analise este evento e gere um relatório executivo completo com recomendações: ${report.title}. ${report.summary}. Considere impacto em saúde, economia, infraestrutura e segurança.`,
          stream: false,
        },
      });
      if (data?.synthesis?.response) {
        setAiAnalysis(data.synthesis.response);
      }
    } catch (err) {
      console.warn("AI analysis failed:", err);
    } finally {
      setAnalysisLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background" role="main" aria-label="Nexus News Portal">
      {/* ═══ HEADPHONES ADVISORY — Planetoño-style ═══ */}
      <div className="bg-gradient-to-r from-card via-secondary/50 to-card border-b border-border/20 py-2 px-4 text-center" role="status">
        <span className="font-mono text-[0.5rem] tracking-[0.2em] text-morabeza uppercase inline-flex items-center gap-2">
          <span className="text-base">🎧</span>
          Use headphones para experiência imersiva com áudio espacial Echo-Vox
          <span className="text-base">🎧</span>
        </span>
      </div>

      {/* ═══ TOP BAR ═══ */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/30" aria-label="News navigation">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2" aria-label="Voltar à página principal">
              <Radio className="h-4 w-4 text-destructive animate-pulse" aria-hidden="true" />
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-primary uppercase font-bold">
                NEXUS NEWS
              </span>
            </Link>
            <div className="w-px h-4 bg-border/50" aria-hidden="true" />
            <Newspaper className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            <span className="font-mono text-[0.45rem] text-muted-foreground tracking-wider">
              AI DAILY BRIEF — {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/nexus">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono" aria-label="Ir para Nexus">
                <Brain className="h-3 w-3" aria-hidden="true" /> NEXUS
              </Button>
            </Link>
            <Link to="/atlas">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono" aria-label="Ir para Atlas">
                <Globe className="h-3 w-3" aria-hidden="true" /> ATLAS
              </Button>
            </Link>
            <Button
              variant="ghost" size="icon" className="h-7 w-7"
              onClick={() => anchor.setMuted(!anchor.muted)}
              aria-label={anchor.muted ? "Ativar som" : "Silenciar"}
            >
              {anchor.muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* YouTube-style Broadcast Bar */}
      <BroadcastBar speaking={anchor.speaking} />

      {/* Ticker */}
      <NewsTicker reports={reports} />

      {reports.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-card border border-border/30 rounded-lg p-3">
            <span className="font-mono text-[0.5rem] text-muted-foreground">Aguardando fluxo do Index para publicação no News.</span>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ═══ AI ANCHOR 3D AVATAR ═══ */}
        <div className="mb-6">
          <AIAnchor3D
            speaking={anchor.speaking}
            reportTitle={selectedReport?.title}
            onToggleSpeak={() => {
              if (anchor.speaking) {
                anchor.stop();
              } else if (selectedReport) {
                anchor.speak(`${CATEGORY_META[selectedReport.category]?.label}. ${selectedReport.title}. ${selectedReport.summary}`);
              }
            }}
            muted={anchor.muted}
            onToggleMute={() => anchor.setMuted(!anchor.muted)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ═══ REPORTS LIST ═══ */}
          <div className="lg:col-span-2 space-y-3">
            {reports.map((r) => {
              const meta = CATEGORY_META[r.category];
              return (
                <div
                  key={r.id}
                  onClick={() => readReport(r)}
                  className={`bg-card border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/40 ${
                    selectedReport?.id === r.id ? "border-primary/50 ring-1 ring-primary/20" : "border-border/30"
                  } ${r.severity === "critical" ? "border-l-4 border-l-destructive" : r.severity === "high" ? "border-l-4 border-l-orange-400" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={meta?.color}>{meta?.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-[0.4rem] px-1.5 py-0.5 rounded ${
                          r.severity === "critical" ? "bg-destructive/20 text-destructive" :
                          r.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {r.severity.toUpperCase()}
                        </span>
                        <span className={`font-mono text-[0.4rem] ${meta?.color}`}>{meta?.label}</span>
                        <span className="font-mono text-[0.4rem] text-muted-foreground ml-auto">
                          {new Date(r.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <h3 className="font-mono text-sm text-foreground font-semibold mb-1">{r.title}</h3>
                      <p className="font-mono text-[0.55rem] text-muted-foreground leading-relaxed">{r.summary}</p>
                      <span className="font-mono text-[0.4rem] text-primary/60 mt-1 block">Fonte: {r.source}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => { e.stopPropagation(); readReport(r); }}>
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ DETAIL PANEL ═══ */}
          <div className="space-y-4">
            {selectedReport ? (
              <div className="bg-card border border-border/30 rounded-lg p-4 sticky top-16">
                <div className="flex items-center gap-2 mb-3">
                  {CATEGORY_META[selectedReport.category]?.icon}
                  <span className="font-mono text-[0.55rem] text-primary uppercase tracking-wider">
                    Análise Detalhada
                  </span>
                </div>

                <h3 className="font-mono text-sm text-foreground font-bold mb-3">{selectedReport.title}</h3>

                {aiAnalysis ? (
                  <div className="prose prose-sm prose-invert max-w-none font-mono text-[0.55rem] leading-relaxed">
                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Button
                      size="sm"
                      className="font-mono text-[0.5rem]"
                      onClick={() => generateAIAnalysis(selectedReport)}
                      disabled={analysisLoading || !user}
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      {analysisLoading ? "Analisando..." : "Gerar Análise AI"}
                    </Button>
                    {!user && (
                      <span className="font-mono text-[0.4rem] text-muted-foreground block mt-2">
                        Login necessário para análise AI
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card border border-border/30 rounded-lg p-6 text-center">
                <Newspaper className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <span className="font-mono text-[0.5rem] text-muted-foreground">
                  Selecione uma notícia para ver análise detalhada.
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <span className="font-mono text-[0.5rem] text-primary tracking-wider block mb-3">
                RESUMO DO DIA
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CATEGORY_META).map(([key, meta]) => {
                  const count = reports.filter((r) => r.category === key).length;
                  const critical = reports.filter((r) => r.category === key && r.severity === "critical").length;
                  return (
                    <div key={key} className="bg-muted/30 rounded px-2 py-1.5">
                      <div className="flex items-center gap-1">
                        {meta.icon}
                        <span className={`font-mono text-[0.45rem] ${meta.color}`}>{meta.label}</span>
                      </div>
                      <span className="font-mono text-sm text-foreground font-bold">{count}</span>
                      {critical > 0 && (
                        <span className="font-mono text-[0.4rem] text-destructive block">{critical} crítico</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
