import { useState, useCallback, useRef, Suspense, useEffect } from "react";
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

  useEffect(() => {
    document.title = "Nexus Organism Builder — Eternal Nexus OS";
  }, []);

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
            className="w-[320px] min-w-[320px] h-full flex flex-col border-r border-white/[0.06] bg-[#08081a]/95 backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-violet-400/70" />
                <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-0 mb-0">
                  Nexus Organism Builder
                </span>
              </div>
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
                Cérebro · Living Neural Architecture
              </p>
            </div>

            {/* Seed Controls */}
            <div className="p-4 border-b border-white/[0.06]">
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-3">
                Seed
              </p>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex-1 flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded px-2 py-1.5">
                  <Hash className="h-3 w-3 text-violet-400/50" />
                  <Input
                    value={seedInput}
                    onChange={(e) => setSeedInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && jumpToSeed()}
                    className="h-6 bg-transparent border-none font-mono text-[0.6rem] text-paper-dim p-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="flex gap-1">
                {[
                  { label: "Prev", action: prevSeed, icon: <ChevronLeft className="h-3 w-3 mr-0.5" /> },
                  { label: "Next", action: nextSeed, iconRight: <ChevronRight className="h-3 w-3 ml-0.5" /> },
                  { label: "Random", action: randomSeed, icon: <Dices className="h-3 w-3 mr-0.5" /> },
                  { label: "Jump", action: jumpToSeed },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className="flex-1 h-7 border border-white/[0.12] text-paper-dim font-mono text-[0.55rem] tracking-[0.1em] uppercase px-2 hover:border-gold/40 hover:text-gold transition-all duration-200 flex items-center justify-center"
                  >
                    {btn.icon}{btn.label}{btn.iconRight}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Sliders className="h-3.5 w-3.5 text-violet-400/50" />
                <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
                  Parameters
                </span>
              </div>

              {sliders.map((s) => (
                <div key={s.key} className="border-b border-white/[0.04] pb-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-mono text-[0.6rem] text-paper-dim">
                      {s.label}
                    </label>
                    <span className="font-mono text-[0.6rem] text-violet-300/70">
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
              <div className="mt-2 pt-2">
                <div className="flex items-center gap-1.5 mb-3">
                  <Eye className="h-3.5 w-3.5 text-violet-400/50" />
                  <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
                    Emergent Intelligences
                  </span>
                </div>
                {NEXUS_EIS.map((ei) => (
                  <div
                    key={ei.id}
                    className="flex items-center gap-2 py-1.5 px-2 border-b border-white/[0.04] font-mono text-[0.6rem] text-paper-dim"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                      style={{ backgroundColor: ei.color }}
                    />
                    <span>{ei.name}</span>
                    <span className="text-white/30 ml-auto text-[0.52rem]">
                      {ei.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/[0.06] space-y-1.5">
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-2">
                Actions
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={regenerate}
                  className="flex-1 border border-white/[0.12] text-paper-dim font-mono text-[0.55rem] tracking-[0.1em] uppercase px-4 py-2 hover:border-gold/40 hover:text-gold transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Regenerate
                </button>
                <button
                  onClick={resetParams}
                  className="flex-1 border border-white/[0.12] text-paper-dim font-mono text-[0.55rem] tracking-[0.1em] uppercase px-4 py-2 hover:border-gold/40 hover:text-gold transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={downloadSnapshot}
                  className="flex-1 border border-white/[0.12] text-paper-dim font-mono text-[0.55rem] tracking-[0.1em] uppercase px-4 py-2 hover:border-gold/40 hover:text-gold transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Download className="h-3 w-3" /> Download
                </button>
                <button
                  onClick={toggleVoice}
                  className={`flex-1 border font-mono text-[0.55rem] tracking-[0.1em] uppercase px-4 py-2 transition-all duration-200 flex items-center justify-center gap-1 ${
                    voiceEnabled
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "border-white/[0.12] text-paper-dim hover:border-gold/40 hover:text-gold"
                  }`}
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-3 w-3" />
                  ) : (
                    <VolumeX className="h-3 w-3" />
                  )}
                  Voice
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-r px-1.5 py-2 transition-colors"
        style={{ left: sidebarOpen ? "320px" : "0px" }}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-3 w-3 text-white/40" />
        ) : (
          <ChevronRight className="h-3 w-3 text-white/40" />
        )}
      </button>

      {/* ═══ MAIN CANVAS ═══ */}
      <main className="flex-1 relative">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#04040e] via-[#0a0a2e] to-[#04040e]" />

        {/* Organism info overlay */}
        <div className="absolute top-4 right-4 z-10 text-right">
          <div className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-0.5">
            Organ: Nexus — Cérebro
          </div>
          <div className="font-mono text-[0.6rem] text-paper-dim">
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
                  className={`font-mono text-[0.55rem] uppercase tracking-[0.15em] ${
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
                  <Sparkles className="h-5 w-5 text-violet-400/60 animate-pulse mx-auto mb-2" />
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/30">
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
