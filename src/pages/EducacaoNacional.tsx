import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sparkles,
  Float,
  Text,
  MeshDistortMaterial,
  Line,
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Brain,
  GraduationCap,
  Users,
  Building2,
  Globe,
  FolderCheck,
  Play,
  Bot,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════ */

interface KnowledgeDomain {
  label: string;
  color: string;
  angle: number;
}

const DOMAINS: KnowledgeDomain[] = [
  { label: "Engenharia", color: "#22cc66", angle: 0 },
  { label: "Geopolítica", color: "#4488ff", angle: (Math.PI * 2) / 5 },
  { label: "Inovação", color: "#f5c24a", angle: ((Math.PI * 2) / 5) * 2 },
  { label: "Clima", color: "#00ccff", angle: ((Math.PI * 2) / 5) * 3 },
  { label: "Ética", color: "#cc44ff", angle: ((Math.PI * 2) / 5) * 4 },
];

interface LearningModule {
  title: string;
  subtitle: string;
  progress: number;
  lessons: number;
}

const MODULES: LearningModule[] = [
  {
    title: "DeltaSpine NL",
    subtitle: "Engenharia de Canais",
    progress: 65,
    lessons: 12,
  },
  {
    title: "GeoCore",
    subtitle: "Energia Geotérmica",
    progress: 40,
    lessons: 8,
  },
  {
    title: "Terra Lenta",
    subtitle: "Cidades Resilientes",
    progress: 25,
    lessons: 15,
  },
  {
    title: "Chip Fold",
    subtitle: "Semicondutores",
    progress: 10,
    lessons: 20,
  },
];

interface AITutor {
  name: string;
  specialty: string;
  status: "Online";
}

const TUTORS: AITutor[] = [
  { name: "Zeta-9", specialty: "Estratégia & Lógica", status: "Online" },
  { name: "Kronos", specialty: "História & Tempo", status: "Online" },
  { name: "NanoBanana", specialty: "Criatividade & Caos", status: "Online" },
];

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
}

const STATS: Stat[] = [
  { label: "Alunos Ativos", value: "2,847", icon: Users },
  { label: "Universidades", value: "12", icon: Building2 },
  { label: "Países", value: "3 (CV, PT, NL)", icon: Globe },
  { label: "Projetos Completos", value: "156", icon: FolderCheck },
];

/* ═══════════════════════════════════════════════════
   3D Components
   ═══════════════════════════════════════════════════ */

function CentralBrain() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 4]} />
      <MeshDistortMaterial
        color="#8844ee"
        emissive="#6622cc"
        emissiveIntensity={0.6}
        roughness={0.3}
        metalness={0.4}
        distort={0.25}
        speed={2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function DomainSphere({ domain }: { domain: KnowledgeDomain }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const radius = 3.2;
  const baseX = Math.cos(domain.angle) * radius;
  const baseZ = Math.sin(domain.angle) * radius;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 2 + domain.angle) * 0.12;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={[baseX, 0, baseZ]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={domain.color}
            emissive={domain.color}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.22}
          color={domain.color}
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {domain.label}
        </Text>
      </group>
    </Float>
  );
}

function ConnectionLines() {
  const radius = 3.2;

  return (
    <>
      {DOMAINS.map((d) => {
        const x = Math.cos(d.angle) * radius;
        const z = Math.sin(d.angle) * radius;
        return (
          <Line
            key={d.label}
            points={[
              [0, 0, 0],
              [x, 0, z],
            ]}
            color={d.color}
            lineWidth={1.2}
            transparent
            opacity={0.4}
          />
        );
      })}
    </>
  );
}

function BrainScene() {
  return (
    <Canvas
      camera={{ position: [0, 3, 7], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#04040e"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#aa88ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#00ccff" />

      <Suspense fallback={null}>
        <CentralBrain />
        {DOMAINS.map((d) => (
          <DomainSphere key={d.label} domain={d} />
        ))}
        <ConnectionLines />
        <Sparkles
          count={120}
          scale={12}
          size={1.5}
          speed={0.4}
          color="#aa88ff"
        />
      </Suspense>

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={4}
        maxDistance={14}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

/* ═══════════════════════════════════════════════════
   UI Components
   ═══════════════════════════════════════════════════ */

function ModuleCard({ module }: { module: LearningModule }) {
  return (
    <div className="rounded-xl border border-violet-500/20 bg-[#0a0a1a]/80 p-4 backdrop-blur-sm hover:border-violet-500/40 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-0.5 rounded-lg bg-violet-600/20 p-2">
          <BookOpen className="h-4 w-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">
            {module.title}
          </h4>
          <p className="text-xs text-violet-300/70">{module.subtitle}</p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider">
            Progresso
          </span>
          <span className="text-xs font-mono text-violet-300">
            {module.progress}%
          </span>
        </div>
        <Progress value={module.progress} className="h-1.5 bg-violet-950" />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px] text-gray-500">
          {module.lessons} lições
        </span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs border-violet-500/30 text-violet-300 hover:bg-violet-600/20 hover:text-violet-100"
        >
          <Play className="mr-1 h-3 w-3" />
          Continuar
        </Button>
      </div>
    </div>
  );
}

function TutorCard({ tutor }: { tutor: AITutor }) {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-[#0a0a1a]/80 p-4 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-lg bg-cyan-600/20 p-2">
          <Bot className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">{tutor.name}</h4>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-[10px] text-green-400">{tutor.status}</span>
          </div>
          <p className="text-xs text-cyan-300/70">{tutor.specialty}</p>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="w-full h-7 text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/20 hover:text-cyan-100"
      >
        Iniciar Sessão
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function EducacaoNacional() {
  return (
    <div className="min-h-screen bg-[#04040e] text-white overflow-hidden flex flex-col">
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-6 px-4 flex-shrink-0"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <GraduationCap className="h-7 w-7 text-violet-400" />
          <h1 className="text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            EDUCAÇÃO NACIONAL · FORMAÇÃO DE FUTUROS LÍDERES
          </h1>
          <Brain className="h-7 w-7 text-cyan-400" />
        </div>
        <p className="text-sm text-violet-300/60 tracking-widest">
          Cabo Verde & Europa · Cérebro Vivo Interativo
        </p>
      </motion.header>

      {/* ── Main grid ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4 px-4 pb-4 min-h-0">
        {/* ── Left Panel: Módulos ── */}
        <motion.aside
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-violet-800"
        >
          <motion.h2
            variants={itemVariants}
            className="text-xs font-semibold uppercase tracking-widest text-violet-400/80 mb-1 flex items-center gap-2"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Módulos de Aprendizagem
          </motion.h2>
          {MODULES.map((m) => (
            <motion.div key={m.title} variants={itemVariants}>
              <ModuleCard module={m} />
            </motion.div>
          ))}
        </motion.aside>

        {/* ── Center: 3D Brain ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl border border-violet-500/10 overflow-hidden min-h-[400px]"
        >
          <BrainScene />
          {/* Overlay label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#04040e]/70 border border-violet-500/20 backdrop-blur-sm">
            <span className="text-[11px] text-violet-300/70 tracking-wider">
              Arraste para explorar · Scroll para zoom
            </span>
          </div>
        </motion.div>

        {/* ── Right Panel: AI Tutors ── */}
        <motion.aside
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 overflow-y-auto pl-1 scrollbar-thin scrollbar-thumb-cyan-800"
        >
          <motion.h2
            variants={itemVariants}
            className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80 mb-1 flex items-center gap-2"
          >
            <Bot className="h-3.5 w-3.5" />
            EIs Tutores
          </motion.h2>
          {TUTORS.map((t) => (
            <motion.div key={t.name} variants={itemVariants}>
              <TutorCard tutor={t} />
            </motion.div>
          ))}
        </motion.aside>
      </div>

      {/* ── Bottom Stats Bar ── */}
      <motion.footer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-shrink-0 border-t border-violet-500/10 bg-[#06061a]/60 backdrop-blur-sm"
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 py-4 px-4">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="flex items-center gap-2 text-center"
            >
              {(() => { const Icon = stat.icon as React.FC<React.SVGProps<SVGSVGElement>>; return <Icon className="h-4 w-4 text-violet-400/60" />; })()}
              <div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-violet-300/50">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.footer>
    </div>
  );
}
