import { useState, useRef, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sparkles,
  Float,
  MeshDistortMaterial,
  Text,
} from "@react-three/drei";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  Clock,
  Shield,
  Globe,
  DollarSign,
  ChevronRight,
  Zap,
  BarChart3,
  FileText,
} from "lucide-react";

// ═══════════════════════════════════════════════
// Living Project Renders — 3D Investment View
// ═══════════════════════════════════════════════

interface InvestmentProject {
  id: string;
  name: string;
  region: string;
  color: string;
  investment: string;
  roi: string;
  timeline: string;
  status: "active" | "pilot" | "planning";
  progress: number;
  position: [number, number, number];
}

const PROJECTS: InvestmentProject[] = [
  {
    id: "deltaspine-nl",
    name: "DeltaSpine NL",
    region: "Netherlands",
    color: "#a0e7e5",
    investment: "€200M",
    roi: "8-12 yr",
    timeline: "2026-2034",
    status: "pilot",
    progress: 35,
    position: [-3, 1, 0],
  },
  {
    id: "geocore",
    name: "GeoCore",
    region: "Cabo Verde",
    color: "#f5c24a",
    investment: "€85M",
    roi: "5-8 yr",
    timeline: "2026-2031",
    status: "active",
    progress: 48,
    position: [0, 2, -1],
  },
  {
    id: "fusion-core",
    name: "Fusion Core",
    region: "Paris",
    color: "#4a90e2",
    investment: "€1.2B",
    roi: "15-20 yr",
    timeline: "2027-2045",
    status: "planning",
    progress: 12,
    position: [3, 0.5, 0.5],
  },
  {
    id: "chip-fold",
    name: "Chip Fold",
    region: "Tokyo",
    color: "#c026d3",
    investment: "€350M",
    roi: "4-6 yr",
    timeline: "2026-2030",
    status: "planning",
    progress: 8,
    position: [1, -1.5, 2],
  },
  {
    id: "terra-lenta",
    name: "Terra Lenta",
    region: "Lisboa",
    color: "#8b6f47",
    investment: "€150M",
    roi: "10-15 yr",
    timeline: "2026-2038",
    status: "pilot",
    progress: 22,
    position: [-2, -1, 1.5],
  },
];

// ── Living Project Node ──

function ProjectNode({ project, selected, onClick }: {
  project: InvestmentProject;
  selected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particlePositions = useMemo(() => {
    const count = 80;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.4 + Math.random() * 0.6;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      const scale = selected ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        0.1
      );
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      glowRef.current.scale.setScalar(selected ? pulse * 1.8 : pulse * 1.2);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.3;
      particlesRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.2}>
      <group position={project.position} onClick={onClick}>
        {/* Core sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={selected ? 3 : 1.5}
            toneMapped={false}
          />
        </mesh>

        {/* Glow halo */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={selected ? 0.2 : 0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Orbiting particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color={project.color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Label */}
        <Text
          position={[0, 0.45, 0]}
          fontSize={0.1}
          color={project.color}
          anchorX="center"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {project.name}
        </Text>
        <Text
          position={[0, 0.32, 0]}
          fontSize={0.06}
          color="#888888"
          anchorX="center"
        >
          {project.investment}
        </Text>
      </group>
    </Float>
  );
}

// ── Central Nexus Hub ──

function NexusHub() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1} floatIntensity={0.1}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.5, 3]} />
        <MeshDistortMaterial
          color="#0a0a2e"
          emissive="#6644ff"
          emissiveIntensity={1.5}
          distort={0.25}
          speed={2}
          roughness={0.2}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color="#4400ff"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </Float>
  );
}

// ── Scene ──

function InvestorScene({
  selectedProject,
  onSelectProject,
}: {
  selectedProject: string | null;
  onSelectProject: (id: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#6644ff" />
      <pointLight position={[-8, 5, -5]} intensity={0.3} color="#f5c24a" />

      <NexusHub />

      {PROJECTS.map((p) => (
        <ProjectNode
          key={p.id}
          project={p}
          selected={selectedProject === p.id}
          onClick={() => onSelectProject(p.id)}
        />
      ))}

      <Sparkles
        count={150}
        scale={10}
        size={1}
        speed={0.2}
        opacity={0.2}
        color="#6644ff"
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={4}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </>
  );
}

// ═══════════════════════════════════════════════
// Tribunal Auto-Report Generator
// ═══════════════════════════════════════════════

function TribunalReport({ project }: { project: InvestmentProject }) {
  const riskScore = project.status === "active" ? 28 : project.status === "pilot" ? 45 : 67;
  const impactScore = Math.round(project.progress * 0.8 + 30);
  const feasibility = project.status === "active" ? 92 : project.status === "pilot" ? 78 : 55;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-violet-400" />
        <h3 className="text-sm font-semibold">Relatório do Tribunal</h3>
      </div>

      {/* Scores */}
      {[
        { label: "Risco", value: riskScore, color: riskScore < 40 ? "bg-green-500" : riskScore < 60 ? "bg-amber-500" : "bg-red-500" },
        { label: "Impacto Ambiental", value: impactScore, color: "bg-cyan-500" },
        { label: "Viabilidade", value: feasibility, color: "bg-violet-500" },
      ].map((s) => (
        <div key={s.label}>
          <div className="flex justify-between text-[0.6rem] text-white/50 mb-1">
            <span>{s.label}</span>
            <span className="font-mono">{s.value}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s.value}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${s.color}`}
            />
          </div>
        </div>
      ))}

      {/* Verdict */}
      <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <div className="text-[0.55rem] uppercase tracking-[0.15em] text-white/30 mb-1">
          Veredicto
        </div>
        <div className={`text-sm font-bold ${
          feasibility > 75 ? "text-green-400" : feasibility > 50 ? "text-amber-400" : "text-red-400"
        }`}>
          {feasibility > 75 ? "APROVADO" : feasibility > 50 ? "EM ANÁLISE" : "PENDENTE"}
        </div>
        <p className="text-[0.6rem] text-white/40 mt-1">
          ROI estimado: {project.roi} · Timeline: {project.timeline}
        </p>
      </div>

      {/* Link to full briefing */}
      {project.id === "deltaspine-nl" && (
        <Link
          to="/investor/deltaspine-nl"
          className="flex items-center gap-1 text-[0.6rem] text-violet-400 hover:text-violet-300 transition-colors mt-2"
        >
          Ver Briefing Completo <ChevronRight className="h-3 w-3" />
        </Link>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════

export default function InvestorNexusPortal() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const selected = PROJECTS.find((p) => p.id === selectedProject);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#04040e] text-white">
      {/* ═══ LEFT PANEL — Portfolio Overview ═══ */}
      <aside className="w-[300px] min-w-[300px] h-full flex flex-col border-r border-white/5 bg-[#08081a]/95 backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h1 className="text-sm font-bold tracking-tight">
              Investor Portal
            </h1>
          </div>
          <p className="text-[0.55rem] text-white/30 tracking-wide uppercase">
            Nexus Living Renders · Real-Time ROI
          </p>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="text-[0.55rem] uppercase tracking-[0.15em] text-white/30 px-1 mb-2">
            Portfolio ({PROJECTS.length} projects)
          </div>

          {PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedProject === p.id
                  ? "bg-white/[0.06] border border-white/10"
                  : "hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-[0.7rem] font-medium">{p.name}</span>
                <span
                  className={`ml-auto text-[0.5rem] uppercase px-1.5 py-0.5 rounded-full ${
                    p.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : p.status === "pilot"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {p.status === "active" ? "Ativo" : p.status === "pilot" ? "Piloto" : "Planeamento"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[0.55rem] text-white/40">
                <span className="flex items-center gap-0.5">
                  <DollarSign className="h-2.5 w-2.5" /> {p.investment}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" /> {p.roi}
                </span>
                <span className="flex items-center gap-0.5">
                  <Globe className="h-2.5 w-2.5" /> {p.region}
                </span>
              </div>
              <div className="mt-2">
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${p.progress}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
                <span className="text-[0.5rem] text-white/30 font-mono">
                  {p.progress}% complete
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Aggregate Stats */}
        <div className="p-4 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <DollarSign className="h-3 w-3" />, label: "Total", value: "€1.985B" },
              { icon: <BarChart3 className="h-3 w-3" />, label: "Avg ROI", value: "8.6 yr" },
              { icon: <Globe className="h-3 w-3" />, label: "Regions", value: "5" },
              { icon: <Shield className="h-3 w-3" />, label: "Risk", value: "Moderate" },
            ].map((s) => (
              <div key={s.label} className="p-2 rounded bg-white/[0.02]">
                <div className="flex items-center gap-1 text-white/30 mb-0.5">
                  {s.icon}
                  <span className="text-[0.5rem]">{s.label}</span>
                </div>
                <span className="text-[0.65rem] font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ═══ MAIN — 3D Living Renders ═══ */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#04040e] via-[#0a0a1e] to-[#04040e]" />

        {/* Top info */}
        <div className="absolute top-4 left-4 z-10">
          <div className="text-[0.55rem] uppercase tracking-[0.2em] text-white/20">
            Nexus Living Investment Renders
          </div>
          <div className="text-[0.5rem] font-mono text-violet-400/40">
            {PROJECTS.length} projects · €1.985B total · Real-time
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-6 w-6 text-violet-400 animate-pulse mx-auto mb-2" />
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/30">
                    Loading investment renders…
                  </span>
                </div>
              </div>
            }
          >
            <Canvas
              camera={{ position: [0, 2, 7], fov: 55 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              dpr={[1, 2]}
              style={{ background: "transparent" }}
            >
              <InvestorScene
                selectedProject={selectedProject}
                onSelectProject={setSelectedProject}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* Flow indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {["Tribunal", "Atlas", "Index", "News", "Streams"].map((organ, i, arr) => (
            <div key={organ} className="flex items-center gap-2">
              <span className={`text-[0.5rem] uppercase tracking-[0.15em] ${
                organ === "Tribunal" ? "text-red-400/60" : organ === "Atlas" ? "text-green-400/60" :
                organ === "Index" ? "text-blue-400/60" : organ === "News" ? "text-amber-400/60" : "text-white/30"
              }`}>
                {organ}
              </span>
              {i < arr.length - 1 && <span className="text-white/10 text-[0.5rem]">→</span>}
            </div>
          ))}
        </div>
      </main>

      {/* ═══ RIGHT PANEL — Tribunal Report ═══ */}
      <aside className="w-[280px] min-w-[280px] h-full flex flex-col border-l border-white/5 bg-[#08081a]/95 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold">Tribunal Report</h2>
          </div>
          <p className="text-[0.55rem] text-white/30 mt-0.5">
            Auto-generated analysis
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <TribunalReport key={selected.id} project={selected} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <p className="text-[0.6rem] text-white/20 text-center">
                  Select a project to view<br />Tribunal analysis
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Investor Partners */}
        <div className="p-4 border-t border-white/5">
          <div className="text-[0.5rem] uppercase tracking-[0.15em] text-white/30 mb-2">
            Target Investors
          </div>
          <div className="flex flex-wrap gap-1">
            {["EU Fund", "World Bank", "Banco Africano", "Emirates IA", "China Dev"].map((inv) => (
              <span
                key={inv}
                className="text-[0.5rem] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/5"
              >
                {inv}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
