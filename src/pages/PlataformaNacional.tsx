import React, { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import * as THREE from "three";
import {
  ArrowRight,
  Globe,
  Scale,
  Activity,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";

/* ───────────────────────── Types ───────────────────────── */

interface ProjectNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  color: string;
  description: string;
}

interface ScenarioState {
  id: string;
  label: string;
  cost: number;
  environmental: number;
  resilience: number;
}

type Verdict = "Aprovado" | "Rejeitado" | "Em Análise";

/* ───────────────────────── Data ───────────────────────── */

const PROJECT_NODES: ProjectNode[] = [
  {
    id: "delta-spine",
    name: "DeltaSpine NL",
    lat: 52.37,
    lon: 4.89,
    color: "#a0e7e5",
    description: "Infraestrutura hídrica resiliente",
  },
  {
    id: "geocore-fogo",
    name: "GeoCore Pico do Fogo",
    lat: 14.95,
    lon: -24.35,
    color: "#f5c24a",
    description: "Geotermia vulcânica sustentável",
  },
  {
    id: "terra-lenta",
    name: "Terra Lenta Lisboa",
    lat: 38.72,
    lon: -9.14,
    color: "#8b6f47",
    description: "Regeneração territorial lenta",
  },
];

const FLOW_STAGES = ["Tribunal", "Atlas", "Index", "News", "Streams"];

/* ───── Helpers ───── */

function latLonToSphere(
  lat: number,
  lon: number,
  radius: number
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function getVerdict(s: ScenarioState): Verdict {
  if (s.cost < 200 && s.environmental > 60 && s.resilience > 70)
    return "Aprovado";
  if (s.cost >= 400 || s.environmental < 30 || s.resilience < 30)
    return "Rejeitado";
  return "Em Análise";
}

function verdictColor(v: Verdict): string {
  if (v === "Aprovado") return "#22c55e";
  if (v === "Rejeitado") return "#ef4444";
  return "#eab308";
}

function verdictIcon(v: Verdict) {
  if (v === "Aprovado") return <ShieldCheck className="w-4 h-4" />;
  if (v === "Rejeitado") return <AlertTriangle className="w-4 h-4" />;
  return <Clock className="w-4 h-4" />;
}

/* ───────────────────────── 3D Components ───────────────────────── */

function GlowingSphere({
  position,
  color,
  name,
}: {
  position: [number, number, number];
  color: string;
  name: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 + Math.sin(t * 3) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position}>
        {/* Core sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Glow halo */}
        <mesh ref={glowRef} scale={2.5}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Orbit trail ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.008, 8, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.55, 0.005, 8, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Local sparkles */}
        <Sparkles
          count={30}
          scale={1.2}
          size={1.5}
          speed={0.4}
          color={col}
          opacity={0.6}
        />
      </group>
    </Float>
  );
}

function ConnectionArc({
  from,
  to,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);
  const particlesRef = useRef<THREE.Points>(null!);
  const particleCount = 24;

  const curve = useMemo(() => {
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 1.5,
      (from[2] + to[2]) / 2,
    ];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to)
    );
  }, [from, to]);

  const lineGeom = useMemo(() => {
    const points = curve.getPoints(64);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [curve]);

  const particleGeom = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const frac = ((i / particleCount + t * 0.15) % 1.0 + 1.0) % 1.0;
        const p = curve.getPoint(frac);
        pos.setXYZ(i, p.x, p.y, p.z);
      }
      pos.needsUpdate = true;
    }
  });

  // Build a THREE.Line imperatively to avoid SVGLineElement JSX conflict
  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
    const l = new THREE.Line(lineGeom, mat);
    return l;
  }, [lineGeom, color]);

  return (
    <group>
      <primitive ref={lineRef} object={lineObj} />
      <points ref={particlesRef} geometry={particleGeom}>
        <pointsMaterial
          size={0.04}
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function InfrastructureScene() {
  const positions = useMemo(
    () =>
      PROJECT_NODES.map(
        (n) => latLonToSphere(n.lat, n.lon, 2.5) as [number, number, number]
      ),
    []
  );

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#c4b5fd" />

      {PROJECT_NODES.map((node, i) => (
        <GlowingSphere
          key={node.id}
          position={positions[i]}
          color={node.color}
          name={node.name}
        />
      ))}

      {/* Connection arcs between all pairs */}
      <ConnectionArc from={positions[0]} to={positions[1]} color="#c084fc" />
      <ConnectionArc from={positions[1]} to={positions[2]} color="#d4a257" />
      <ConnectionArc from={positions[0]} to={positions[2]} color="#7dd3c0" />

      {/* Global sparkle field */}
      <Sparkles
        count={80}
        scale={8}
        size={1}
        speed={0.2}
        color="#c4b5fd"
        opacity={0.3}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </>
  );
}

/* ───────────────────────── Tribunal Panel ───────────────────────── */

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="text-white/90 font-medium tabular-nums">
          {unit === "€"
            ? `€${value}M`
            : `${value}${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-white/10 rounded-full cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400
                   [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(167,139,250,0.6)]
                   [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                   [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-violet-400
                   [&::-moz-range-thumb]:border-0"
      />
    </div>
  );
}

function TribunalPanel() {
  const [scenarios, setScenarios] = useState<ScenarioState[]>([
    { id: "s1", label: "Cenário Alpha", cost: 150, environmental: 75, resilience: 80 },
    { id: "s2", label: "Cenário Beta", cost: 320, environmental: 45, resilience: 55 },
    { id: "s3", label: "Cenário Gamma", cost: 90, environmental: 82, resilience: 90 },
  ]);

  const updateScenario = useCallback(
    (id: string, field: keyof Omit<ScenarioState, "id" | "label">, value: number) => {
      setScenarios((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Scale className="w-5 h-5 text-violet-400" />
        <h2 className="text-sm font-semibold tracking-wide uppercase text-white/80">
          Tribunal de Cenários
        </h2>
      </div>

      {scenarios.map((scenario) => {
        const verdict = getVerdict(scenario);
        const vColor = verdictColor(verdict);

        return (
          <motion.div
            key={scenario.id}
            layout
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/90">
                {scenario.label}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={verdict}
                  initial={{ opacity: 0, scale: 0.8, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 4 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${vColor}18`,
                    color: vColor,
                    boxShadow: `0 0 12px ${vColor}20`,
                  }}
                >
                  {verdictIcon(verdict)}
                  {verdict}
                </motion.span>
              </AnimatePresence>
            </div>

            <SliderInput
              label="Custo"
              value={scenario.cost}
              min={0}
              max={500}
              step={10}
              unit="€"
              onChange={(v) => updateScenario(scenario.id, "cost", v)}
            />
            <SliderInput
              label="Impacto Ambiental"
              value={scenario.environmental}
              min={0}
              max={100}
              step={1}
              unit=""
              onChange={(v) => updateScenario(scenario.id, "environmental", v)}
            />
            <SliderInput
              label="Resiliência Climática"
              value={scenario.resilience}
              min={0}
              max={100}
              step={1}
              unit=""
              onChange={(v) => updateScenario(scenario.id, "resilience", v)}
            />

            {/* Score bar */}
            <div className="pt-1">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: vColor }}
                  animate={{
                    width: `${Math.min(
                      100,
                      ((500 - scenario.cost) / 500) * 33 +
                        (scenario.environmental / 100) * 33 +
                        (scenario.resilience / 100) * 34
                    )}%`,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Main Page ───────────────────────── */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function PlataformaNacional() {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundColor: "#04040e",
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col h-screen"
      >
        {/* ── Header ── */}
        <motion.header
          variants={itemVariants}
          className="relative z-10 px-6 pt-8 pb-4 lg:px-10"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-violet-400" />
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
                  Plataforma Nacional de Infraestrutura Viva
                </h1>
              </div>
              <p className="text-sm text-white/40 tracking-wide ml-9">
                Atlas + Tribunal &middot; Cabo Verde &amp; Países Baixos
              </p>
            </div>

            {/* Pilot badges */}
            <div className="hidden md:flex items-center gap-3">
              <motion.span
                variants={itemVariants}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                           bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                <Activity className="w-3 h-3" />
                Cabo Verde — Piloto Ativo
              </motion.span>
              <motion.span
                variants={itemVariants}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                           bg-violet-500/10 text-violet-400 border border-violet-500/20"
              >
                <Leaf className="w-3 h-3" />
                Países Baixos — Fase &beta;
              </motion.span>
            </div>
          </div>
        </motion.header>

        {/* ── Main Content ── */}
        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col lg:flex-row gap-4 px-4 lg:px-8 pb-4 min-h-0"
        >
          {/* 3D Canvas */}
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/[0.06] bg-black/30">
            <Canvas
              camera={{ position: [0, 2, 6], fov: 45 }}
              gl={{
                antialias: true,
                alpha: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.2,
              }}
              style={{ background: "transparent" }}
            >
              <InfrastructureScene />
            </Canvas>

            {/* Node legend overlay */}
            <div className="absolute bottom-4 left-4 space-y-2">
              {PROJECT_NODES.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md
                             border border-white/[0.06]"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: node.color,
                      boxShadow: `0 0 8px ${node.color}80`,
                    }}
                  />
                  <span className="text-xs text-white/70 font-medium">
                    {node.name}
                  </span>
                  <span className="text-[10px] text-white/30 hidden sm:inline">
                    {node.description}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Sidebar — Tribunal */}
          <motion.aside
            variants={itemVariants}
            className="w-full lg:w-80 xl:w-96 shrink-0 overflow-y-auto rounded-2xl
                       border border-white/[0.06] bg-white/[0.01] backdrop-blur-sm p-5"
          >
            <TribunalPanel />
          </motion.aside>
        </motion.div>

        {/* ── Bottom Status Bar ── */}
        <motion.footer
          variants={itemVariants}
          className="relative z-10 px-6 py-4 lg:px-10 border-t border-white/[0.04]"
        >
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {FLOW_STAGES.map((stage, i) => (
              <React.Fragment key={stage}>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  className="text-xs font-medium px-3 py-1 rounded-full
                             bg-white/[0.04] text-white/50 hover:text-white/80 hover:bg-white/[0.08]
                             transition-colors cursor-default"
                >
                  {stage}
                </motion.span>
                {i < FLOW_STAGES.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 0.4, x: 0 }}
                    transition={{ delay: 1.6 + i * 0.1 }}
                  >
                    <ArrowRight className="w-3 h-3 text-violet-400/60" />
                  </motion.span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile pilot badges */}
          <div className="flex md:hidden items-center justify-center gap-3 mt-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium
                         bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              <Activity className="w-2.5 h-2.5" />
              Cabo Verde — Piloto Ativo
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium
                         bg-violet-500/10 text-violet-400 border border-violet-500/20"
            >
              <Leaf className="w-2.5 h-2.5" />
              Países Baixos — Fase &beta;
            </span>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}
