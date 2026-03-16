import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Float, Text, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import {
  AlertTriangle,
  Shield,
  Zap,
  Activity,
  Clock,
  Users,
  Flame,
  Globe,
  Radio,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// ═══════════════════════════════════════════════════════════
// Sala de Crise · Simulação de Resiliência
// Crisis Simulation Room — Emergency Operations Interface
// ═══════════════════════════════════════════════════════════

type AlertLevel = "VERDE" | "AMARELO" | "VERMELHO";
type CrisisType = "climatica" | "vulcanica" | "geopolitica" | null;

interface CityStatus {
  name: string;
  resilience: number;
  populationAffected: string;
  evacuationTime: string;
}

interface PowerSource {
  name: string;
  location: string;
  capacityMW: number;
  status: "Online" | "Standby" | "Critical";
  outputPercent: number;
}

// ── Alert level color config ──
const ALERT_CONFIG: Record<AlertLevel, { bg: string; border: string; text: string; glow: string }> = {
  VERDE: { bg: "bg-green-950/60", border: "border-green-500/50", text: "text-green-400", glow: "shadow-green-500/20" },
  AMARELO: { bg: "bg-amber-950/60", border: "border-amber-500/50", text: "text-amber-400", glow: "shadow-amber-500/20" },
  VERMELHO: { bg: "bg-red-950/60", border: "border-red-500/50", text: "text-red-400", glow: "shadow-red-500/20" },
};

// ═══════════════════════════════════════
// 3D Components
// ═══════════════════════════════════════

function CrisisParticleCloud({
  position,
  color,
  count,
  isActive,
  label,
}: {
  position: [number, number, number];
  color: string;
  count: number;
  isActive: boolean;
  label: string;
}) {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = isActive ? count * 2 : count;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = (isActive ? 2.5 : 1.5) * Math.random();
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions: pos, velocities: vel };
  }, [particleCount, isActive]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.getAttribute("position");
    if (!posAttr) return;
    const arr = posAttr.array as Float32Array;
    const t = clock.getElapsedTime();
    const speed = isActive ? 3.0 : 1.0;

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const noise = Math.sin(t * speed + i * 0.1) * 0.01;
      arr[ix] += velocities[ix] + noise;
      arr[ix + 1] += velocities[ix + 1] + Math.cos(t * speed + i * 0.05) * 0.01;
      arr[ix + 2] += velocities[ix + 2] + noise * 0.5;

      const dist = Math.sqrt(arr[ix] ** 2 + arr[ix + 1] ** 2 + arr[ix + 2] ** 2);
      const maxR = isActive ? 3.0 : 1.8;
      if (dist > maxR) {
        arr[ix] *= 0.95;
        arr[ix + 1] *= 0.95;
        arr[ix + 2] *= 0.95;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group position={position}>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={particleCount}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={isActive ? 0.06 : 0.035}
          transparent
          opacity={isActive ? 0.95 : 0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <Float speed={2} floatIntensity={isActive ? 1.5 : 0.5}>
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.3}
          color={color}
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {label}
        </Text>
      </Float>
      {/* Glow sphere at cluster center */}
      <mesh>
        <sphereGeometry args={[isActive ? 0.35 : 0.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.5 : 0.2} />
      </mesh>
    </group>
  );
}

function NexusCore({ alertLevel }: { alertLevel: AlertLevel }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreColor = alertLevel === "VERMELHO" ? "#ff2020" : alertLevel === "AMARELO" ? "#ffaa00" : "#00ff88";

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    const scale = 1 + Math.sin(t * 2) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <Float speed={1.5} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.5, 4]} />
        <MeshDistortMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
          distort={0.4}
          speed={3}
          roughness={0.2}
        />
      </mesh>
      {/* Connection lines to clusters */}
      {[[-4, 0, 0], [0, 0, 0], [4, 0, 0]].map((target, i) => {
        const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(target[0], target[1], target[2])];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <lineSegments key={i} geometry={lineGeo}>
            <lineBasicMaterial color={coreColor} transparent opacity={0.15} />
          </lineSegments>
        );
      })}
    </Float>
  );
}

function SimulationScene({
  alertLevel,
  selectedCrisis,
}: {
  alertLevel: AlertLevel;
  selectedCrisis: CrisisType;
}) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -2, -3]} intensity={0.4} color="#4488ff" />
      <pointLight position={[5, -2, -3]} intensity={0.4} color="#ff4444" />

      {/* Crisis clusters */}
      <CrisisParticleCloud
        position={[-4, 0, 0]}
        color="#2288ff"
        count={600}
        isActive={selectedCrisis === "climatica"}
        label="CRISE CLIMÁTICA"
      />
      <CrisisParticleCloud
        position={[0, 0, 0]}
        color="#ff4422"
        count={600}
        isActive={selectedCrisis === "vulcanica"}
        label="CRISE VULCÂNICA"
      />
      <CrisisParticleCloud
        position={[4, 0, 0]}
        color="#aa44ff"
        count={600}
        isActive={selectedCrisis === "geopolitica"}
        label="CRISE GEOPOLÍTICA"
      />

      {/* Central nexus */}
      <NexusCore alertLevel={alertLevel} />

      {/* Background sparkles */}
      <Sparkles
        count={300}
        size={1.5}
        scale={20}
        speed={0.4}
        opacity={0.3}
        color="#ffffff"
      />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ═══════════════════════════════════════
// Animated Counter Hook
// ═══════════════════════════════════════

function useAnimatedCounter(target: number, duration: number = 2000): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const initial = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(initial + (target - initial) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// ═══════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════

function ResilienceColor({ value }: { value: number }) {
  if (value > 70) return "text-green-400";
  if (value > 40) return "text-amber-400";
  return "text-red-400";
}

function resilienceBarColor(value: number): string {
  if (value > 70) return "bg-green-500";
  if (value > 40) return "bg-amber-500";
  return "bg-red-500";
}

function statusColor(status: string): string {
  if (status === "Online") return "text-green-400";
  if (status === "Standby") return "text-amber-400";
  return "text-red-400";
}

function statusDot(status: string): string {
  if (status === "Online") return "bg-green-400";
  if (status === "Standby") return "bg-amber-400";
  return "bg-red-400 animate-pulse";
}

// ═══════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════

export default function SalaDeCrise() {
  const [alertLevel, setAlertLevel] = useState<AlertLevel>("AMARELO");
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisType>(null);
  const simulationCount = useAnimatedCounter(1000, 3000);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cfg = ALERT_CONFIG[alertLevel];

  // ── Data ──
  const cities: CityStatus[] = [
    { name: "Lisboa", resilience: 78, populationAffected: "2.1M", evacuationTime: "6.2h" },
    { name: "Rotterdam", resilience: 45, populationAffected: "1.4M", evacuationTime: "3.8h" },
    { name: "Dubai", resilience: 32, populationAffected: "3.6M", evacuationTime: "8.1h" },
  ];

  const powerSources: PowerSource[] = [
    { name: "Geotérmica", location: "Pico do Fogo", capacityMW: 4200, status: "Online", outputPercent: 87 },
    { name: "Solar", location: "Sahara Grid", capacityMW: 8500, status: "Standby", outputPercent: 42 },
    { name: "Fusion", location: "Paris Core", capacityMW: 12000, status: "Critical", outputPercent: 18 },
  ];

  const totalCapacity = powerSources.reduce((sum, s) => sum + s.capacityMW, 0);

  const kpis = [
    { label: "Sobrevivência Média", value: "87.3%", color: "bg-green-500", width: "87%" },
    { label: "Tempo de Resposta", value: "4.2h", color: "bg-amber-500", width: "58%" },
    { label: "Custo Estimado", value: "€2.1B", color: "bg-red-500", width: "72%" },
    { label: "Cenários Aprovados", value: "847/1000", color: "bg-blue-500", width: "85%" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Pulsing border for critical */}
      {alertLevel === "VERMELHO" && (
        <motion.div
          className="fixed inset-0 border-2 border-red-500/50 pointer-events-none z-50"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
        }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        {/* ═══ HEADER ═══ */}
        <motion.header
          className={`px-6 py-3 border-b ${cfg.border} ${cfg.bg} backdrop-blur-sm`}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={alertLevel === "VERMELHO" ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <AlertTriangle className={`w-6 h-6 ${cfg.text}`} />
              </motion.div>
              <div>
                <h1 className="text-sm font-bold tracking-[0.3em] text-gray-200 uppercase">
                  Sala de Crise · Simulação de Resiliência
                </h1>
                <p className="text-xs text-gray-500 font-mono">
                  NEXUS EMERGENCY OPERATIONS CENTER v3.7
                </p>
              </div>
            </div>

            {/* Alert level selector */}
            <div className="flex items-center gap-2">
              {(["VERDE", "AMARELO", "VERMELHO"] as AlertLevel[]).map((level) => {
                const lvlCfg = ALERT_CONFIG[level];
                const isSelected = alertLevel === level;
                return (
                  <Button
                    key={level}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`text-xs font-mono tracking-wider transition-all duration-300 ${
                      isSelected
                        ? `${lvlCfg.bg} ${lvlCfg.text} border ${lvlCfg.border} shadow-lg ${lvlCfg.glow}`
                        : "border-gray-700 text-gray-500 hover:text-gray-300"
                    }`}
                    onClick={() => setAlertLevel(level)}
                  >
                    <CircleDot className="w-3 h-3 mr-1" />
                    {level}
                  </Button>
                );
              })}
            </div>

            {/* Simulation count + timestamp */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${cfg.text}`} />
                  <span className={`text-lg font-mono font-bold ${cfg.text}`}>
                    {simulationCount}
                  </span>
                  <span className="text-xs text-gray-500">Simulações Ativas</span>
                </div>
              </div>
              <div className="text-right border-l border-gray-800 pl-4">
                <div className="text-xs font-mono text-gray-400">
                  {currentTime.toLocaleDateString("pt-BR")}
                </div>
                <div className={`text-sm font-mono font-bold ${cfg.text}`}>
                  {currentTime.toLocaleTimeString("pt-BR")}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── LEFT PANEL: Terra Lenta ── */}
          <motion.aside
            className="w-80 border-r border-gray-800/60 bg-gray-950/80 backdrop-blur-sm overflow-y-auto"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">
                  Terra Lenta · Cidades Flutuantes
                </h2>
              </div>

              <div className="space-y-4">
                {cities.map((city, i) => {
                  const colorClass = city.resilience > 70 ? "text-green-400" : city.resilience > 40 ? "text-amber-400" : "text-red-400";
                  const barColor = resilienceBarColor(city.resilience);
                  return (
                    <motion.div
                      key={city.name}
                      className="bg-gray-900/60 border border-gray-800/60 rounded-lg p-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-200">{city.name}</span>
                        <span className={`text-lg font-mono font-bold ${colorClass}`}>
                          {city.resilience}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                        <motion.div
                          className={`h-2 rounded-full ${barColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${city.resilience}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="w-3 h-3" />
                          <span>{city.populationAffected}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{city.evacuationTime}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Crisis type selector */}
              <div className="mt-6">
                <h3 className="text-xs font-bold tracking-[0.15em] text-gray-500 uppercase mb-3">
                  Selecionar Cenário
                </h3>
                <div className="space-y-2">
                  {[
                    { id: "climatica" as CrisisType, label: "Crise Climática", icon: Globe, color: "text-blue-400 border-blue-500/40 bg-blue-950/30" },
                    { id: "vulcanica" as CrisisType, label: "Crise Vulcânica", icon: Flame, color: "text-red-400 border-red-500/40 bg-red-950/30" },
                    { id: "geopolitica" as CrisisType, label: "Crise Geopolítica", icon: Shield, color: "text-purple-400 border-purple-500/40 bg-purple-950/30" },
                  ].map(({ id, label, icon: Icon, color }) => (
                    <Button
                      key={id}
                      variant="outline"
                      size="sm"
                      className={`w-full justify-start text-xs font-mono transition-all duration-300 ${
                        selectedCrisis === id
                          ? `${color} border shadow-lg`
                          : "border-gray-800 text-gray-500 hover:text-gray-300"
                      }`}
                      onClick={() => setSelectedCrisis(selectedCrisis === id ? null : id)}
                    >
                      <Icon className="w-3.5 h-3.5 mr-2" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ── CENTER: 3D Canvas ── */}
          <motion.main
            className="flex-1 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Canvas overlay label */}
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded border border-gray-800/60">
                <Radio className={`w-3 h-3 ${cfg.text} animate-pulse`} />
                <span className="text-xs font-mono text-gray-400">
                  SIMULAÇÃO 3D · {selectedCrisis ? selectedCrisis.toUpperCase() : "PANORÂMICA"}
                </span>
              </div>
            </div>

            <Canvas
              camera={{ position: [0, 3, 12], fov: 55 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "radial-gradient(ellipse at center, #0a0a0f 0%, #000000 100%)" }}
            >
              <SimulationScene alertLevel={alertLevel} selectedCrisis={selectedCrisis} />
            </Canvas>
          </motion.main>

          {/* ── RIGHT PANEL: GeoCore Emergency Power ── */}
          <motion.aside
            className="w-80 border-l border-gray-800/60 bg-gray-950/80 backdrop-blur-sm overflow-y-auto"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
                  GeoCore · Energia de Emergência
                </h2>
              </div>

              <div className="space-y-4">
                {powerSources.map((source, i) => (
                  <motion.div
                    key={source.name}
                    className="bg-gray-900/60 border border-gray-800/60 rounded-lg p-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-200">{source.name}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${statusDot(source.status)}`} />
                        <span className={`text-xs font-mono ${statusColor(source.status)}`}>
                          {source.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 font-mono">{source.location}</p>

                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Capacidade</span>
                      <span className="text-gray-300 font-mono">
                        {source.capacityMW.toLocaleString()} MW
                      </span>
                    </div>

                    {/* Output bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          source.outputPercent > 70
                            ? "bg-green-500"
                            : source.outputPercent > 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${source.outputPercent}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.15 }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-xs font-mono text-gray-500">
                        {source.outputPercent}% output
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total capacity */}
              <motion.div
                className={`mt-4 p-3 rounded-lg border ${cfg.border} ${cfg.bg}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Total Emergência
                  </span>
                  <span className={`text-lg font-mono font-bold ${cfg.text}`}>
                    {totalCapacity.toLocaleString()} MW
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </div>

        {/* ═══ BOTTOM: KPI Results ═══ */}
        <motion.footer
          className="px-6 py-4 border-t border-gray-800/60 bg-gray-950/90 backdrop-blur-sm"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
              Resultados da Simulação
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                className="bg-gray-900/60 border border-gray-800/50 rounded-lg p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ borderColor: "rgba(255,255,255,0.15)", scale: 1.02 }}
              >
                <p className="text-xs text-gray-500 mb-1 font-mono">{kpi.label}</p>
                <p className="text-xl font-mono font-bold text-gray-100">{kpi.value}</p>
                {/* Sparkline bar */}
                <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${kpi.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: kpi.width }}
                    transition={{ duration: 1.2, delay: 0.7 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
