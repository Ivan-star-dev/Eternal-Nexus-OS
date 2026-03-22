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
  Leaf,
  Users,
  Target,
} from "lucide-react";
import ProjectMetrics from "@/components/ProjectMetrics";

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
  // Expanded metrics — PLv6.2-b
  co2ReductionKt: number;       // CO₂ reduction in kilotons/year
  jobsCreated: number;          // direct + indirect jobs
  sdgGoals: number[];           // UN SDG numbers aligned
  riskBreakdown: {
    technical: number;
    regulatory: number;
    financial: number;
    environmental: number;
  };
  impactScore: number;          // 0–100
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
    co2ReductionKt: 420,
    jobsCreated: 3800,
    sdgGoals: [11, 13, 14, 17],
    riskBreakdown: { technical: 28, regulatory: 35, financial: 22, environmental: 15 },
    impactScore: 78,
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
    co2ReductionKt: 310,
    jobsCreated: 1200,
    sdgGoals: [7, 9, 13],
    riskBreakdown: { technical: 20, regulatory: 18, financial: 32, environmental: 10 },
    impactScore: 85,
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
    co2ReductionKt: 8500,
    jobsCreated: 22000,
    sdgGoals: [7, 9, 13, 17],
    riskBreakdown: { technical: 65, regulatory: 45, financial: 38, environmental: 8 },
    impactScore: 96,
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
    co2ReductionKt: 95,
    jobsCreated: 5400,
    sdgGoals: [9, 12, 17],
    riskBreakdown: { technical: 42, regulatory: 22, financial: 30, environmental: 6 },
    impactScore: 71,
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
    co2ReductionKt: 180,
    jobsCreated: 2100,
    sdgGoals: [11, 13, 15],
    riskBreakdown: { technical: 35, regulatory: 28, financial: 25, environmental: 12 },
    impactScore: 74,
  },
];

// ── Portfolio-level computed metrics ──────────────────────────────────────────
function computePortfolioStats(projects: InvestmentProject[]) {
  const totalCo2 = projects.reduce((a, p) => a + p.co2ReductionKt, 0);
  const totalJobs = projects.reduce((a, p) => a + p.jobsCreated, 0);
  const allSdg = [...new Set(projects.flatMap((p) => p.sdgGoals))].sort((a, b) => a - b);
  const avgImpact = Math.round(projects.reduce((a, p) => a + p.impactScore, 0) / projects.length);
  return { totalCo2, totalJobs, allSdg, avgImpact };
}

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
              count={80}
              array={particlePositions}
              itemSize={3}
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
// Tribunal Auto-Report Generator — PLv6.2-b expanded
// ═══════════════════════════════════════════════

function TribunalReport({ project }: { project: InvestmentProject }) {
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
        <h3 className="text-sm font-semibold">{project.name}</h3>
      </div>

      {/* Risk breakdown */}
      <div>
        <div className="text-[0.55rem] uppercase tracking-[0.15em] text-white/30 mb-2">
          Risk Breakdown
        </div>
        {[
          { label: "Technical", value: project.riskBreakdown.technical, color: "bg-blue-500" },
          { label: "Regulatory", value: project.riskBreakdown.regulatory, color: "bg-amber-500" },
          { label: "Financial", value: project.riskBreakdown.financial, color: "bg-red-500" },
          { label: "Environmental", value: project.riskBreakdown.environmental, color: "bg-green-500" },
        ].map((s) => (
          <div key={s.label} className="mb-1.5">
            <div className="flex justify-between text-[0.58rem] text-white/40 mb-1">
              <span>{s.label}</span>
              <span className="font-mono">{s.value}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`h-full rounded-full ${s.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Environmental impact */}
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-2">
        <div className="text-[0.55rem] uppercase tracking-[0.15em] text-white/30 mb-1">
          Environmental Impact
        </div>
        <div className="flex items-center gap-2">
          <Leaf className="h-3 w-3 text-green-400 flex-shrink-0" />
          <span className="text-[0.65rem] font-mono text-green-400">
            -{project.co2ReductionKt.toLocaleString()} kt CO₂/yr
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-cyan-400 flex-shrink-0" />
          <span className="text-[0.65rem] font-mono text-cyan-400">
            {project.jobsCreated.toLocaleString()} jobs
          </span>
        </div>
      </div>

      {/* SDG alignment */}
      <div>
        <div className="text-[0.55rem] uppercase tracking-[0.15em] text-white/30 mb-2">
          SDG Alignment
        </div>
        <div className="flex flex-wrap gap-1">
          {project.sdgGoals.map((sdg) => (
            <span
              key={sdg}
              className="font-mono text-[0.55rem] px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/20"
            >
              SDG {sdg}
            </span>
          ))}
        </div>
      </div>

      {/* Impact score + verdict */}
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[0.55rem] uppercase tracking-[0.15em] text-white/30">
            Impact Score
          </div>
          <span className="font-mono text-[0.65rem] font-bold text-emerald-400">
            {project.impactScore}/100
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.impactScore}%` }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>
        <div className={`text-sm font-bold ${
          feasibility > 75 ? "text-green-400" : feasibility > 50 ? "text-amber-400" : "text-red-400"
        }`}>
          {feasibility > 75 ? "APROVADO" : feasibility > 50 ? "EM ANÁLISE" : "PENDENTE"}
        </div>
        <p className="text-[0.58rem] text-white/40 mt-1">
          ROI: {project.roi} · {project.timeline}
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
// Portfolio Impact Summary — PLv6.2-b new panel
// ═══════════════════════════════════════════════

function PortfolioImpactSummary() {
  const stats = computePortfolioStats(PROJECTS);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <Target className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-semibold">Portfolio Impact</h3>
      </div>
      <p className="text-[0.58rem] text-white/30 leading-relaxed">
        Aggregate environmental and social metrics across all 5 projects.
      </p>

      {/* CO₂ reduction */}
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="h-3 w-3 text-green-400" />
          <span className="text-[0.55rem] uppercase tracking-[0.12em] text-white/30">
            Total CO₂ Reduction
          </span>
        </div>
        <span className="font-mono text-lg font-bold text-green-400">
          {(stats.totalCo2 / 1000).toFixed(1)}Mt
        </span>
        <span className="text-[0.58rem] text-white/30 ml-1">per year</span>
      </div>

      {/* Jobs */}
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-3 w-3 text-cyan-400" />
          <span className="text-[0.55rem] uppercase tracking-[0.12em] text-white/30">
            Jobs Created
          </span>
        </div>
        <span className="font-mono text-lg font-bold text-cyan-400">
          {stats.totalJobs.toLocaleString()}
        </span>
        <span className="text-[0.58rem] text-white/30 ml-1">direct + indirect</span>
      </div>

      {/* SDG coverage */}
      <div>
        <div className="text-[0.55rem] uppercase tracking-[0.12em] text-white/30 mb-2">
          SDG Coverage ({stats.allSdg.length} goals)
        </div>
        <div className="flex flex-wrap gap-1">
          {stats.allSdg.map((sdg) => (
            <span
              key={sdg}
              className="font-mono text-[0.52rem] px-1.5 py-0.5 rounded bg-violet-500/12 text-violet-300 border border-violet-500/20"
            >
              {sdg}
            </span>
          ))}
        </div>
      </div>

      {/* Avg impact score */}
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[0.55rem] uppercase tracking-[0.12em] text-white/30">
            Avg Impact Score
          </span>
          <span className="font-mono text-[0.7rem] font-bold text-emerald-400">
            {stats.avgImpact}/100
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.avgImpact}%` }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>
      </div>

      <p className="text-[0.55rem] text-white/20 text-center pt-2">
        Select a project for detailed analysis
      </p>
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
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[0.5rem] text-white/30 font-mono">
                    {p.progress}% complete
                  </span>
                  <span className="text-[0.5rem] text-emerald-400/60 font-mono">
                    ↓{p.co2ReductionKt}kt CO₂
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Portfolio Analytics */}
        <div className="p-3 border-t border-white/5">
          <ProjectMetrics projects={PROJECTS} />
        </div>

        {/* Aggregate Stats */}
        <div className="p-4 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <DollarSign className="h-3 w-3" />, label: "Total", value: "€1.985B" },
              { icon: <BarChart3 className="h-3 w-3" />, label: "Avg ROI", value: "8.6 yr" },
              { icon: <Leaf className="h-3 w-3" />, label: "CO₂/yr", value: "9.5Mt" },
              { icon: <Users className="h-3 w-3" />, label: "Jobs", value: "34.5K" },
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

      {/* ═══ RIGHT PANEL — Tribunal Report / Portfolio Impact ═══ */}
      <aside className="w-[280px] min-w-[280px] h-full flex flex-col border-l border-white/5 bg-[#08081a]/95 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold">
              {selected ? "Tribunal Report" : "Portfolio Impact"}
            </h2>
          </div>
          <p className="text-[0.55rem] text-white/30 mt-0.5">
            {selected ? "Auto-generated analysis" : "Aggregate environmental + social metrics"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <TribunalReport key={selected.id} project={selected} />
            ) : (
              <PortfolioImpactSummary key="portfolio" />
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
