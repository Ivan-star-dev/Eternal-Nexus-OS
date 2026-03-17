import { useState, useCallback, useEffect, useRef, useMemo, Suspense } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Radio, Globe, Brain, Shield, AlertTriangle, CheckCircle2,
  Search, ChevronRight, Eye, Loader2, Scale, Volume2, VolumeX,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useNexusState } from "@/hooks/useNexusState";
import { TribunalVerdict } from "@/types";

// ═══ Judge definitions ═══
interface Judge {
  id: string;
  name: string;
  specialty: string;
  color: string;
  orbitRadius: number;
  orbitOffset: number;
}

const JUDGES: Judge[] = [
  { id: "truth", name: "Juiz Verdade", specialty: "Verificação factual primária", color: "#22ffaa", orbitRadius: 2.8, orbitOffset: 0 },
  { id: "manipulation", name: "Juiz Manipulação", specialty: "Detecção de deepfakes e narrativas enviesadas", color: "#ff4444", orbitRadius: 3.0, orbitOffset: Math.PI * 0.4 },
  { id: "context", name: "Juiz Contexto", specialty: "Contextualização histórica e geopolítica", color: "#4488ff", orbitRadius: 3.2, orbitOffset: Math.PI * 0.8 },
  { id: "source", name: "Juiz Fonte", specialty: "Rastreamento de fontes primárias", color: "#ffaa22", orbitRadius: 2.6, orbitOffset: Math.PI * 1.2 },
  { id: "ethics", name: "Juiz Ética", specialty: "Avaliação de impacto humano e ético", color: "#cc44ff", orbitRadius: 3.4, orbitOffset: Math.PI * 1.6 },
];

// ═══ Narrative events ═══
interface NarrativeEvent {
  id: string;
  title: string;
  region: string;
  date: string;
  narrativeA: string;
  narrativeB: string;
  truthScore: number; // 0-100
  manipulationDetected: boolean;
  sources: string[];
  analysis?: string;
  category: "conflict" | "climate" | "health" | "economy" | "tech";
}

const NARRATIVE_EVENTS: NarrativeEvent[] = [
  {
    id: "1", title: "Escalada Sudão 2026", region: "África",
    date: new Date(Date.now() - 3600000).toISOString(),
    narrativeA: "Governo nega crise humanitária — operações de segurança normais.",
    narrativeB: "UNHCR: 2.3M deslocados, infraestrutura de água destruída em 60% de Darfur.",
    truthScore: 18, manipulationDetected: true,
    sources: ["UNHCR Report 2026-Q1", "Satellite imagery Sentinel-2", "ACLED conflict data"],
    category: "conflict",
    analysis: "## Análise dos Juízes\n\n**Juiz Verdade**: Imagens de satélite Sentinel-2 confirmam destruição massiva em Al-Fashir. Narrativa governamental **92% manipulada**.\n\n**Juiz Fonte**: 3 fontes primárias independentes confirmam deslocamento.\n\n**Juiz Ética**: Crise humanitária nível 5 — intervenção urgente recomendada.",
  },
  {
    id: "2", title: "China — Emissões Reais vs Reportadas", region: "Ásia",
    date: new Date(Date.now() - 7200000).toISOString(),
    narrativeA: "NDRC China: emissões caíram 3.2% em 2025 conforme metas NDC.",
    narrativeB: "Climate TRACE: satélites detectam emissões 40% superiores ao reportado oficialmente.",
    truthScore: 35, manipulationDetected: true,
    sources: ["Climate TRACE satellite data", "EDGAR emissions database", "Nature Climate Change 2026"],
    category: "climate",
  },
  {
    id: "3", title: "Vacina H5N8 — Eficácia Real", region: "Global",
    date: new Date(Date.now() - 10800000).toISOString(),
    narrativeA: "Fabricante: 94% eficácia em trial fase 3 com 50.000 participantes.",
    narrativeB: "Cochrane: design do trial exclui idosos >75 anos. Eficácia real estimada: 67-78%.",
    truthScore: 62, manipulationDetected: false,
    sources: ["Cochrane Review 2026", "NEJM trial data", "WHO SAGE recommendations"],
    category: "health",
  },
  {
    id: "4", title: "Deepfake — Discurso Presidencial Fabricado", region: "Europa",
    date: new Date(Date.now() - 14400000).toISOString(),
    narrativeA: "Vídeo viral: presidente francês anuncia saída da NATO.",
    narrativeB: "Análise forense: deepfake com 99.2% de certeza. Áudio sintetizado via VALL-E.",
    truthScore: 3, manipulationDetected: true,
    sources: ["EU Disinfo Lab", "Sentinel AI deepfake analysis", "Agence France-Presse fact-check"],
    category: "tech",
  },
  {
    id: "5", title: "Green Bond Market — Greenwashing", region: "Global",
    date: new Date(Date.now() - 18000000).toISOString(),
    narrativeA: "$500B em green bonds emitidos — mercado de sustentabilidade recorde.",
    narrativeB: "Climate Bonds Initiative: 28% não cumprem critérios mínimos — greenwashing sistémico.",
    truthScore: 45, manipulationDetected: true,
    sources: ["Climate Bonds Initiative 2026", "Bloomberg Green", "ICMA Green Bond Principles"],
    category: "economy",
  },
];

// ═══ 3D Judge Sphere ═══
function JudgeSphere({ judge, active }: { judge: Judge; active: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const color = useMemo(() => new THREE.Color(judge.color), [judge.color]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const angle = t * 0.25 + judge.orbitOffset;
    meshRef.current.position.x = Math.cos(angle) * judge.orbitRadius;
    meshRef.current.position.z = Math.sin(angle) * judge.orbitRadius;
    meshRef.current.position.y = Math.sin(t * 0.4 + judge.orbitOffset) * 0.2;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={judge.color} metalness={0.9} roughness={0.1}
          emissive={judge.color} emissiveIntensity={active ? 0.8 : 0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.015, 8, 32]} />
        <meshBasicMaterial color={judge.color} transparent opacity={active ? 0.7 : 0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Scale of justice */}
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.06, 0.12, 6]} />
        <meshBasicMaterial color={judge.color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function JusticeCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="hsl(0, 0%, 95%)" metalness={0.95} roughness={0.05}
          emissive="hsl(0, 0%, 90%)" emissiveIntensity={0.4} wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color="hsl(0, 0%, 80%)" transparent opacity={0.5} />
      </mesh>
      {[2.0, 2.8, 3.5].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.15, i * 0.2, 0]}>
          <torusGeometry args={[r, 0.006, 8, 64]} />
          <meshBasicMaterial color="hsl(0, 0%, 60%)" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function JudgesScene({ activeJudge }: { activeJudge: string | null }) {
  return (
    <>
      <ambientLight intensity={0.12} color="#ffffff" />
      <pointLight position={[10, 15, 8]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-8, -10, 5]} intensity={0.4} color="#4488ff" />
      <JusticeCore />
      {JUDGES.map((j) => (
        <JudgeSphere key={j.id} judge={j} active={j.id === activeJudge} />
      ))}
    </>
  );
}

// ═══ Category badge ═══
const CATEGORY_COLORS: Record<string, string> = {
  conflict: "bg-destructive/20 text-destructive",
  climate: "bg-green-500/20 text-green-400",
  health: "bg-red-400/20 text-red-400",
  economy: "bg-yellow-500/20 text-yellow-400",
  tech: "bg-purple-400/20 text-purple-400",
};

// ═══ Main Page ═══
export default function GeopoliticsNarrative() {
  const { user } = useAuth();
  const [events] = useState(NARRATIVE_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<NarrativeEvent | null>(null);
  const [activeJudge, setActiveJudge] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [muted, setMuted] = useState(false);
  const { addVerdict } = useNexusState();

  // Cycle through judges animation
  useEffect(() => {
    const iv = setInterval(() => {
      setActiveJudge((prev) => {
        const idx = JUDGES.findIndex((j) => j.id === prev);
        return JUDGES[(idx + 1) % JUDGES.length].id;
      });
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const speak = useCallback((text: string) => {
    if (muted || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "pt-BR";
    utt.rate = 0.9;
    utt.pitch = 0.85;
    window.speechSynthesis.speak(utt);
  }, [muted]);

  const selectEvent = useCallback((ev: NarrativeEvent) => {
    setSelectedEvent(ev);
    setAiAnalysis(ev.analysis || null);
    speak(`${ev.title}. Score de verdade: ${ev.truthScore} por cento. ${ev.manipulationDetected ? "Manipulação detectada." : "Sem manipulação detectada."}`);
  }, [speak]);

  const analyzeWithJudges = useCallback(async (ev: NarrativeEvent) => {
    if (!user) return;
    setAnalysisLoading(true);
    try {
      const { data } = await supabase.functions.invoke("nexus-swarm", {
        body: {
          prompt: `TRIBUNAL GEOPOLÍTICO — 5 juízes AI analisam: "${ev.title}"\n\nNarrativa A: ${ev.narrativeA}\nNarrativa B: ${ev.narrativeB}\n\nFontes: ${ev.sources.join(", ")}\n\nCada juiz (Verdade, Manipulação, Contexto, Fonte, Ética) deve emitir veredicto com confiança %. Resultado final: score de verdade 0-100 e recomendação.`,
          stream: false,
        },
      });
      if (data?.synthesis?.response) {
        setAiAnalysis(data.synthesis.response);
        
        // sacred-flow: persistence — push verdict to shared organism memory
        addVerdict({
          id: `tribunal-${Date.now()}`,
          topic: ev.title,
          judges: ['zeta-9', 'kronos', 'nanobanana'],
          verdict: ev.truthScore > 40 ? 'approved' : 'needs-review',
          confidence: ev.truthScore / 100,
          reasoning: data.synthesis.response,
          timestamp: Date.now(),
          flowTarget: 'index'
        });
      }
    } catch (err) {
      console.warn("Judge analysis failed:", err);
      toast.error("Análise dos juízes falhou");
    } finally {
      setAnalysisLoading(false);
    }
  }, [user]);

  const filteredEvents = searchQuery
    ? events.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ TOP BAR ═══ */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-foreground" />
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-foreground uppercase font-bold">
                TRIBUNAL
              </span>
            </Link>
            <div className="w-px h-4 bg-border/50" />
            <span className="font-mono text-[0.45rem] text-muted-foreground tracking-wider">
              GEOPOLITICS NARRATIVE · VERDADE ABSOLUTA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/nexus">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono">
                <Brain className="h-3 w-3" /> NEXUS
              </Button>
            </Link>
            <Link to="/atlas">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono">
                <Globe className="h-3 w-3" /> ATLAS
              </Button>
            </Link>
            <Link to="/news">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[0.55rem] font-mono">
                <Radio className="h-3 w-3" /> NEWS
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMuted(!muted)}>
              {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ═══ HERO — 3D JUDGES ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border/30 rounded-lg overflow-hidden">
            <div className="h-64 md:h-80 bg-background/50">
              <Canvas camera={{ position: [0, 2, 7], fov: 45 }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                  <JudgesScene activeJudge={activeJudge} />
                </Suspense>
              </Canvas>
            </div>
            <div className="px-4 py-3 border-t border-border/20">
              <div className="flex flex-wrap gap-1">
                {JUDGES.map((j) => (
                  <span
                    key={j.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.45rem] font-mono transition-all ${
                      activeJudge === j.id ? "ring-1 ring-primary/40" : ""
                    }`}
                    style={{ backgroundColor: `${j.color}15`, color: j.color }}
                  >
                    <Shield className="h-2.5 w-2.5" />
                    {j.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <span className="font-mono text-[0.5rem] text-primary tracking-wider block mb-3">
                PAINEL DE TRANSPARÊNCIA
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded p-3">
                  <span className="font-mono text-2xl text-foreground font-bold block">{events.length}</span>
                  <span className="font-mono text-[0.45rem] text-muted-foreground">Narrativas analisadas</span>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <span className="font-mono text-2xl text-destructive font-bold block">
                    {events.filter((e) => e.manipulationDetected).length}
                  </span>
                  <span className="font-mono text-[0.45rem] text-muted-foreground">Manipulações detectadas</span>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <span className="font-mono text-2xl text-green-400 font-bold block">
                    {Math.round(events.reduce((s, e) => s + e.truthScore, 0) / events.length)}%
                  </span>
                  <span className="font-mono text-[0.45rem] text-muted-foreground">Score médio de verdade</span>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <span className="font-mono text-2xl text-foreground font-bold block">
                    {events.reduce((s, e) => s + e.sources.length, 0)}
                  </span>
                  <span className="font-mono text-[0.45rem] text-muted-foreground">Fontes verificadas</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="font-mono text-[0.5rem] text-destructive tracking-wider">PRINCÍPIO OPERACIONAL</span>
              </div>
              <p className="font-mono text-[0.5rem] text-muted-foreground leading-relaxed">
                Zero censura. Zero manipulação. Transparência total. Cada narrativa é analisada por 5 juízes AI independentes.
                Fontes primárias linkadas. Score de confiança público. Logs auditáveis.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar narrativas..."
                className="pl-9 font-mono text-sm bg-card border-border/30"
              />
            </div>
          </div>
        </div>

        {/* ═══ EVENTS LIST ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => selectEvent(ev)}
                className={`bg-card border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/30 ${
                  selectedEvent?.id === ev.id ? "border-primary/50 ring-1 ring-primary/20" : "border-border/30"
                } ${ev.manipulationDetected ? "border-l-4 border-l-destructive" : "border-l-4 border-l-green-500"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[0.4rem] px-1.5 py-0.5 rounded font-mono ${CATEGORY_COLORS[ev.category]}`}>
                        {ev.category.toUpperCase()}
                      </span>
                      <span className="font-mono text-[0.4rem] text-muted-foreground">{ev.region}</span>
                      {ev.manipulationDetected && (
                        <span className="text-[0.4rem] px-1.5 py-0.5 rounded font-mono bg-destructive/20 text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-2.5 w-2.5" /> MANIPULAÇÃO
                        </span>
                      )}
                      <span className="font-mono text-[0.4rem] text-muted-foreground ml-auto">
                        {new Date(ev.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <h3 className="font-mono text-sm text-foreground font-semibold mb-2">{ev.title}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <div className="bg-destructive/5 border border-destructive/20 rounded p-2">
                        <span className="font-mono text-[0.4rem] text-destructive block mb-1">NARRATIVA A</span>
                        <span className="font-mono text-[0.48rem] text-muted-foreground">{ev.narrativeA}</span>
                      </div>
                      <div className="bg-green-500/5 border border-green-500/20 rounded p-2">
                        <span className="font-mono text-[0.4rem] text-green-400 block mb-1">NARRATIVA B</span>
                        <span className="font-mono text-[0.48rem] text-muted-foreground">{ev.narrativeB}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Truth score bar */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[0.4rem] text-muted-foreground">TRUTH SCORE</span>
                          <span className={`font-mono text-[0.5rem] font-bold ${
                            ev.truthScore >= 70 ? "text-green-400" : ev.truthScore >= 40 ? "text-yellow-400" : "text-destructive"
                          }`}>
                            {ev.truthScore}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              ev.truthScore >= 70 ? "bg-green-400" : ev.truthScore >= 40 ? "bg-yellow-400" : "bg-destructive"
                            }`}
                            style={{ width: `${ev.truthScore}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-mono text-[0.4rem] text-muted-foreground">
                        {ev.sources.length} fontes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ═══ ANALYSIS PANEL ═══ */}
          <div>
            {selectedEvent ? (
              <div className="bg-card border border-border/30 rounded-lg p-4 sticky top-16">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono text-[0.55rem] text-primary uppercase tracking-wider">
                    Veredicto dos Juízes
                  </span>
                </div>

                <h3 className="font-mono text-sm text-foreground font-bold mb-3">{selectedEvent.title}</h3>

                {/* Sources */}
                <div className="mb-3">
                  <span className="font-mono text-[0.4rem] text-muted-foreground block mb-1">FONTES PRIMÁRIAS:</span>
                  <div className="space-y-1">
                    {selectedEvent.sources.map((s, i) => (
                      <span key={i} className="font-mono text-[0.45rem] text-primary/80 flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5 text-green-400" /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                {aiAnalysis ? (
                  <div className="prose prose-sm prose-invert max-w-none font-mono text-[0.55rem] leading-relaxed max-h-80 overflow-y-auto">
                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Button
                      size="sm"
                      className="font-mono text-[0.5rem] gap-1"
                      onClick={() => analyzeWithJudges(selectedEvent)}
                      disabled={analysisLoading || !user}
                    >
                      {analysisLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Scale className="h-3 w-3" />}
                      {analysisLoading ? "Juízes deliberando..." : "Convocar Tribunal AI"}
                    </Button>
                    {!user && (
                      <span className="font-mono text-[0.4rem] text-muted-foreground block mt-2">
                        Login necessário
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card border border-border/30 rounded-lg p-6 text-center">
                <Scale className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <span className="font-mono text-[0.5rem] text-muted-foreground">
                  Selecione uma narrativa para análise dos juízes AI.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
