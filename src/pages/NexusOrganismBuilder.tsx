import { useState, useCallback, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Dices,
  Download,
  Hash,
  RefreshCw,
  RotateCcw,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DEFAULT_PARAMS,
  NEXUS_EIS,
  type NexusParameters,
} from "@/lib/nexus/seededRandom";
import {
  synthesizeSpeech,
  createTTSPlayer,
} from "@/lib/nexus/ttsWorker";
import NexusOrganismScene from "@/components/nexus/NexusOrganismScene";

// ═══════════════════════════════════════════════
// Nexus Organism Builder — Living Brain Interface
// ═══════════════════════════════════════════════

export default function NexusOrganismBuilder() {
  const [params, setParams] = useState<NexusParameters>({ ...DEFAULT_PARAMS });
  const [seedInput, setSeedInput] = useState(String(DEFAULT_PARAMS.seed));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const ttsPlayerRef = useRef(createTTSPlayer());

  // ── Seed navigation ──
  const setSeed = useCallback((newSeed: number) => {
    const clamped = Math.max(0, Math.min(999999, newSeed));
    setParams((p) => ({ ...p, seed: clamped }));
    setSeedInput(String(clamped));
  }, []);

  const prevSeed = () => setSeed(params.seed - 1);
  const nextSeed = () => setSeed(params.seed + 1);
  const randomSeed = () => setSeed(Math.floor(Math.random() * 999999));
  const jumpToSeed = () => {
    const val = parseInt(seedInput, 10);
    if (!isNaN(val)) setSeed(val);
  };

  // ── Parameter update helper ──
  const updateParam = useCallback(
    <K extends keyof NexusParameters>(key: K, value: NexusParameters[K]) => {
      setParams((p) => ({ ...p, [key]: value }));
    },
    []
  );

  // ── Actions ──
  const regenerate = () => {
    setParams((p) => ({ ...p })); // force re-render
    toast.success("Organism regenerated");
  };

  const resetParams = () => {
    setParams({ ...DEFAULT_PARAMS });
    setSeedInput(String(DEFAULT_PARAMS.seed));
    toast.success("Parameters reset to defaults");
  };

  const downloadSnapshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `nexus-organism-seed-${params.seed}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Snapshot downloaded");
  };

  const toggleVoice = async () => {
    if (voiceEnabled) {
      ttsPlayerRef.current.stop();
      setVoiceEnabled(false);
      toast.info("Voice synthesis disabled");
    } else {
      setVoiceEnabled(true);
      toast.info("ElevenLabs TTS enabled — Grok speaks first");
      // Demo voice
      const result = await synthesizeSpeech(
        "The Nexus organism awakens. All neural pathways are online.",
        "grok"
      );
      if (result.type === "audio" && result.data) {
        ttsPlayerRef.current.play(result.data);
      } else if (result.type === "error") {
        toast.error(result.error);
      }
    }
  };

  // ── Slider config ──
  const sliders: Array<{
    key: keyof NexusParameters;
    label: string;
    min: number;
    max: number;
    step: number;
  }> = [
    { key: "particleCount", label: "Particle Density", min: 1000, max: 20000, step: 500 },
    { key: "flowSpeed", label: "Flow Speed", min: 0.1, max: 3, step: 0.1 },
    { key: "noiseScale", label: "Noise Scale", min: 0.001, max: 0.05, step: 0.001 },
    { key: "trailLength", label: "Trail Persistence", min: 0.5, max: 0.99, step: 0.01 },
    { key: "bloomIntensity", label: "Bloom Intensity", min: 0.5, max: 4, step: 0.1 },
    { key: "neuralBranchDepth", label: "Neural Branches", min: 1, max: 10, step: 1 },
    { key: "eiInfluenceRadius", label: "EI Influence Radius", min: 1, max: 5, step: 0.1 },
    { key: "synapticPulseRate", label: "Synaptic Pulse Rate", min: 0.1, max: 2, step: 0.1 },
    { key: "colorHueShift", label: "Color Hue Shift", min: 0, max: 360, step: 1 },
    { key: "turbulence", label: "Turbulence", min: 0, max: 1, step: 0.05 },
    { key: "attractorStrength", label: "Attractor Strength", min: 0, max: 1, step: 0.05 },
  ];

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#04040e] text-white">
      {/* ═══ SIDEBAR ═══ */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[320px] min-w-[320px] h-full flex flex-col border-r border-white/5 bg-[#08081a]/95 backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-5 w-5 text-violet-400" />
                <h1
                  className="text-lg font-bold tracking-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Nexus Organism
                </h1>
              </div>
              <p
                className="text-[0.65rem] text-white/40 tracking-wide uppercase"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Cérebro — Living Neural Architecture
              </p>
            </div>

            {/* Seed Controls */}
            <div className="p-4 border-b border-white/5">
              <label className="text-[0.6rem] uppercase tracking-[0.15em] text-white/40 mb-2 block">
                Seed
              </label>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex-1 flex items-center gap-1 bg-white/5 rounded-md px-2 py-1.5">
                  <Hash className="h-3 w-3 text-violet-400/60" />
                  <Input
                    value={seedInput}
                    onChange={(e) => setSeedInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && jumpToSeed()}
                    className="h-6 bg-transparent border-none text-sm font-mono p-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevSeed}
                  className="flex-1 h-7 text-[0.6rem] hover:bg-white/5"
                >
                  <ChevronLeft className="h-3 w-3 mr-0.5" /> Prev
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSeed}
                  className="flex-1 h-7 text-[0.6rem] hover:bg-white/5"
                >
                  Next <ChevronRight className="h-3 w-3 ml-0.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={randomSeed}
                  className="flex-1 h-7 text-[0.6rem] hover:bg-white/5"
                >
                  <Dices className="h-3 w-3 mr-0.5" /> Random
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={jumpToSeed}
                  className="flex-1 h-7 text-[0.6rem] hover:bg-white/5"
                >
                  Jump
                </Button>
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              <div className="flex items-center gap-1.5 mb-2">
                <Sliders className="h-3.5 w-3.5 text-violet-400/60" />
                <span className="text-[0.6rem] uppercase tracking-[0.15em] text-white/40">
                  Parameters
                </span>
              </div>

              {sliders.map((s) => (
                <div key={s.key}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[0.65rem] text-white/60">
                      {s.label}
                    </label>
                    <span className="text-[0.6rem] font-mono text-violet-300/80">
                      {typeof params[s.key] === "number"
                        ? Number(params[s.key]).toFixed(
                            s.step < 1 ? (s.step < 0.01 ? 3 : 2) : 0
                          )
                        : params[s.key]}
                    </span>
                  </div>
                  <Slider
                    value={[params[s.key] as number]}
                    onValueChange={([v]) => updateParam(s.key, v)}
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    className="cursor-pointer"
                  />
                </div>
              ))}

              {/* EI Status */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 mb-3">
                  <Eye className="h-3.5 w-3.5 text-violet-400/60" />
                  <span className="text-[0.6rem] uppercase tracking-[0.15em] text-white/40">
                    Emergent Intelligences
                  </span>
                </div>
                {NEXUS_EIS.map((ei) => (
                  <div
                    key={ei.id}
                    className="flex items-center gap-2 py-1.5 px-2 rounded bg-white/[0.02] mb-1"
                  >
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: ei.color }}
                    />
                    <span className="text-[0.65rem] font-medium">{ei.name}</span>
                    <span className="text-[0.55rem] text-white/30 ml-auto">
                      {ei.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/5 space-y-1.5">
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={regenerate}
                  className="flex-1 h-8 text-[0.6rem] hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetParams}
                  className="flex-1 h-8 text-[0.6rem] hover:bg-white/5"
                >
                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                </Button>
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadSnapshot}
                  className="flex-1 h-8 text-[0.6rem] hover:bg-white/5"
                >
                  <Download className="h-3 w-3 mr-1" /> Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoice}
                  className="flex-1 h-8 text-[0.6rem] hover:bg-white/5"
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-3 w-3 mr-1 text-green-400" />
                  ) : (
                    <VolumeX className="h-3 w-3 mr-1" />
                  )}
                  Voice
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-violet-500/10 hover:bg-violet-500/20 border border-white/5 rounded-r-lg p-1.5 transition-colors"
        style={{ left: sidebarOpen ? "320px" : "0px" }}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-3 w-3 text-violet-300" />
        ) : (
          <ChevronRight className="h-3 w-3 text-violet-300" />
        )}
      </button>

      {/* ═══ MAIN CANVAS ═══ */}
      <main className="flex-1 relative">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#04040e] via-[#0a0a2e] to-[#04040e]" />

        {/* Organism info overlay */}
        <div className="absolute top-4 right-4 z-10 text-right">
          <div className="text-[0.55rem] uppercase tracking-[0.2em] text-white/20 mb-0.5">
            Organ: Nexus — Cérebro
          </div>
          <div className="text-[0.5rem] font-mono text-violet-400/40">
            Seed #{params.seed} · {params.particleCount.toLocaleString()}{" "}
            particles · 60fps
          </div>
        </div>

        {/* Flow pathway indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {["Tribunal", "Atlas", "Index", "News", "Streams"].map(
            (organ, i, arr) => (
              <div key={organ} className="flex items-center gap-2">
                <span
                  className={`text-[0.55rem] uppercase tracking-[0.15em] ${
                    organ === "Tribunal"
                      ? "text-red-400/60"
                      : organ === "Atlas"
                      ? "text-green-400/60"
                      : organ === "Index"
                      ? "text-blue-400/60"
                      : organ === "News"
                      ? "text-amber-400/60"
                      : "text-white/30"
                  }`}
                >
                  {organ}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-white/10 text-[0.5rem]">→</span>
                )}
              </div>
            )
          )}
        </div>

        {/* Three.js Canvas */}
        <div className="absolute inset-0">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-6 w-6 text-violet-400 animate-pulse mx-auto mb-2" />
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/30">
                    Awakening neural cortex…
                  </span>
                </div>
              </div>
            }
          >
            <NexusOrganismScene params={params} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
