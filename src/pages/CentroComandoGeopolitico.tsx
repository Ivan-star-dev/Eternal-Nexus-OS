import { useState, useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Float, Text, MeshDistortMaterial, Line } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Radio, AlertTriangle, Clock, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

// ═══════════════════════════════════════════════════
// Centro de Comando Geopolítico — Holographic War Room
// ═══════════════════════════════════════════════════

// ── Types ──
interface EIAgent {
  name: string;
  role: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
}

interface GeoPoint {
  name: string;
  lat: number;
  lon: number;
}

interface Scenario {
  id: string;
  label: string;
  verdict: string;
  confidence: number;
}

// ── Constants ──
const EI_AGENTS: EIAgent[] = [
  { name: "Zeta-9", role: "Estrategista", color: "#00ffcc", orbitRadius: 2.8, orbitSpeed: 0.4, orbitOffset: 0 },
  { name: "Kronos", role: "Temporal", color: "#ff6600", orbitRadius: 3.2, orbitSpeed: 0.3, orbitOffset: (Math.PI * 2) / 3 },
  { name: "NanoBanana", role: "Caos", color: "#ffee00", orbitRadius: 3.6, orbitSpeed: 0.5, orbitOffset: (Math.PI * 4) / 3 },
];

const GEOPOINTS: GeoPoint[] = [
  { name: "Cabo Verde", lat: 14.95, lon: -24.35 },
  { name: "Netherlands", lat: 52.37, lon: 4.89 },
  { name: "Lisboa", lat: 38.72, lon: -9.14 },
  { name: "Paris", lat: 48.85, lon: 2.35 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
];

const SCENARIOS: Scenario[] = [
  { id: "alpha", label: "Cenário Alpha", verdict: "Rota HVDC Norte: Cabo Verde → Lisboa → Paris. Viabilidade: 94%. Tempo de deploy: 18 meses.", confidence: 94 },
  { id: "beta", label: "Cenário Beta", verdict: "Eixo Atlântico reforçado: Netherlands como hub redundante. Risco geopolítico: BAIXO. ROI projetado: 340%.", confidence: 87 },
  { id: "gamma", label: "Cenário Gamma", verdict: "Corredor Leste ativado: Dubai como nó de distribuição Golfo-Índico. Alerta: pressão diplomática China. Confiança parcial.", confidence: 72 },
];

const HVDC_ROUTES: [number, number][] = [
  [0, 2], // Cabo Verde → Lisboa
  [2, 3], // Lisboa → Paris
  [3, 1], // Paris → Netherlands
  [2, 1], // Lisboa → Netherlands
  [0, 4], // Cabo Verde → Dubai
  [3, 4], // Paris → Dubai
];

// ── Coordinate conversion: lat/lon → flat table XZ ──
function geoToTable(lat: number, lon: number): [number, number, number] {
  const x = ((lon + 30) / 90) * 8 - 4;
  const z = ((55 - lat) / 50) * 8 - 4;
  return [x, 0.15, z];
}

// ═══════════ 3D Components ═══════════

function HolographicTable() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.rotation.y += delta * 0.02;
    }
  });

  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    const count = 20;
    const size = 5;
    for (let i = 0; i <= count; i++) {
      const pos = (i / count) * size * 2 - size;
      lines.push(
        <Line
          key={`gx-${i}`}
          points={[[-size, 0, pos], [size, 0, pos]]}
          color="#00ffcc"
          opacity={0.12}
          transparent
          lineWidth={0.5}
        />,
        <Line
          key={`gz-${i}`}
          points={[[pos, 0, -size], [pos, 0, size]]}
          color="#00ffcc"
          opacity={0.12}
          transparent
          lineWidth={0.5}
        />
      );
    }
    return lines;
  }, []);

  return (
    <group>
      {/* Table disc */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <cylinderGeometry args={[5.2, 5.2, 0.08, 64]} />
        <meshStandardMaterial color="#020210" transparent opacity={0.85} />
      </mesh>
      {/* Glowing edge ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]}>
        <torusGeometry args={[5.2, 0.04, 8, 128]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.7} />
      </mesh>
      {/* Inner ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.06, 0]}>
        <torusGeometry args={[3.5, 0.02, 8, 96]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.3} />
      </mesh>
      {/* Grid */}
      <group ref={gridRef} position={[0, 0.07, 0]}>
        {gridLines}
      </group>
    </group>
  );
}

function EIOrbiters({ agents }: { agents: EIAgent[] }) {
  return (
    <>
      {agents.map((agent) => (
        <EIOrbiter key={agent.name} agent={agent} />
      ))}
    </>
  );
}

function EIOrbiter({ agent }: { agent: EIAgent }) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const trailPoints = useRef<THREE.Vector3[]>([]);
  const [trail, setTrail] = useState<[number, number, number][]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * agent.orbitSpeed + agent.orbitOffset;
    const x = Math.cos(t) * agent.orbitRadius;
    const z = Math.sin(t) * agent.orbitRadius;
    const y = 1.5 + Math.sin(t * 2) * 0.3;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }

    if (haloRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 3 + agent.orbitOffset) * 0.3;
      haloRef.current.scale.setScalar(pulse);
    }

    // Trail
    const newPoint = new THREE.Vector3(x, y, z);
    trailPoints.current.push(newPoint);
    if (trailPoints.current.length > 60) {
      trailPoints.current.shift();
    }
    if (trailPoints.current.length > 2) {
      setTrail(trailPoints.current.map((p) => [p.x, p.y, p.z] as [number, number, number]));
    }
  });

  const col = new THREE.Color(agent.color);

  return (
    <>
      <group ref={groupRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          {/* Core sphere */}
          <mesh>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshBasicMaterial color={agent.color} />
          </mesh>
          {/* Glow halo */}
          <mesh ref={haloRef}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <MeshDistortMaterial
              color={agent.color}
              transparent
              opacity={0.15}
              distort={0.3}
              speed={4}
            />
          </mesh>
          {/* Name label */}
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.18}
            color={agent.color}
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {agent.name}
          </Text>
        </Float>
      </group>
      {/* Orbital trail */}
      {trail.length > 2 && (
        <Line
          points={trail}
          color={col}
          lineWidth={1.5}
          transparent
          opacity={0.25}
        />
      )}
    </>
  );
}

function GeoNodes() {
  return (
    <>
      {GEOPOINTS.map((gp) => {
        const pos = geoToTable(gp.lat, gp.lon);
        return (
          <group key={gp.name} position={pos}>
            {/* Node marker */}
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#00ffcc" />
            </mesh>
            {/* Vertical beam */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
              <meshBasicMaterial color="#00ffcc" transparent opacity={0.4} />
            </mesh>
            {/* Label */}
            <Text
              position={[0, 0.95, 0]}
              fontSize={0.13}
              color="#88ffee"
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              {gp.name}
            </Text>
          </group>
        );
      })}
    </>
  );
}

function EnergyRoutes() {
  const positions = useMemo(
    () => GEOPOINTS.map((gp) => geoToTable(gp.lat, gp.lon)),
    []
  );

  return (
    <>
      {HVDC_ROUTES.map(([from, to], idx) => (
        <EnergyRouteLine key={idx} from={positions[from]} to={positions[to]} index={idx} />
      ))}
    </>
  );
}

function EnergyRouteLine({
  from,
  to,
  index,
}: {
  from: [number, number, number];
  to: [number, number, number];
  index: number;
}) {
  const midY = 0.15 + 0.6;
  const curvePoints = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3((from[0] + to[0]) / 2, midY, (from[2] + to[2]) / 2),
      new THREE.Vector3(...to)
    );
    return curve.getPoints(40).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [from, to, midY]);

  return (
    <group>
      <Line
        points={curvePoints}
        color="#00ccaa"
        lineWidth={1.2}
        transparent
        opacity={0.35}
      />
      <ParticleFlow curvePoints={curvePoints} index={index} />
    </group>
  );
}

function ParticleFlow({ curvePoints, index }: { curvePoints: [number, number, number][]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = ((clock.getElapsedTime() * 0.3 + index * 0.17) % 1);
    const pointIndex = Math.floor(t * (curvePoints.length - 1));
    const p = curvePoints[Math.min(pointIndex, curvePoints.length - 1)];
    meshRef.current.position.set(p[0], p[1], p[2]);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#00ffee" transparent opacity={0.9} />
    </mesh>
  );
}

function WarRoomScene() {
  return (
    <>
      <color attach="background" args={["#02020a"]} />
      <fog attach="fog" args={["#02020a", 8, 25]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#00ffcc" />
      <pointLight position={[3, 3, 3]} intensity={0.3} color="#ff6600" />
      <pointLight position={[-3, 3, -3]} intensity={0.3} color="#ffee00" />

      <HolographicTable />
      <EIOrbiters agents={EI_AGENTS} />
      <GeoNodes />
      <EnergyRoutes />

      <Sparkles
        count={300}
        scale={12}
        size={1.5}
        speed={0.3}
        opacity={0.3}
        color="#00ffcc"
      />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ═══════════ UI Panels ═══════════

function StatusDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

function LeftPanel() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-4 top-20 z-10 w-72 space-y-4"
    >
      {/* EI Status */}
      <div className="rounded-xl border border-white/5 bg-black/60 p-4 backdrop-blur-xl">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
          <Radio className="h-3.5 w-3.5" />
          Análise Estratégica
        </h3>
        <div className="space-y-3">
          {EI_AGENTS.map((agent) => (
            <div key={agent.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot color={agent.color} />
                <div>
                  <p className="text-xs font-semibold text-white">{agent.name}</p>
                  <p className="text-[10px] text-white/40">{agent.role}</p>
                </div>
              </div>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                ONLINE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Count */}
      <div className="rounded-xl border border-white/5 bg-black/60 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-xs font-medium text-white/70">Ameaças Ativas</span>
          </div>
          <motion.span
            key="threats"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20 text-sm font-bold text-red-400"
          >
            7
          </motion.span>
        </div>
      </div>

      {/* Routes Count */}
      <div className="rounded-xl border border-white/5 bg-black/60 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-white/70">Rotas de Influência</span>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-400">
            {HVDC_ROUTES.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function RightPanel() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const handleScenarioClick = useCallback((scenario: Scenario) => {
    setActiveScenario(null);
    setTimeout(() => setActiveScenario(scenario), 150);
  }, []);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-4 top-20 z-10 w-80 space-y-4"
    >
      <div className="rounded-xl border border-white/5 bg-black/60 p-4 backdrop-blur-xl">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
          <Crosshair className="h-3.5 w-3.5" />
          Decisão Estratégica
        </h3>

        <div className="space-y-2">
          {SCENARIOS.map((scenario) => (
            <Button
              key={scenario.id}
              variant="outline"
              className="w-full justify-start border-white/10 bg-white/5 text-xs text-white/80 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30"
              onClick={() => handleScenarioClick(scenario)}
            >
              <Shield className="mr-2 h-3.5 w-3.5 text-cyan-500/60" />
              {scenario.label}
            </Button>
          ))}
        </div>

        {/* Verdict Display */}
        <AnimatePresence mode="wait">
          {activeScenario && (
            <motion.div
              key={activeScenario.id}
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 space-y-3"
            >
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/60 mb-1.5">
                  Veredito EI
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xs leading-relaxed text-white/80"
                >
                  {activeScenario.verdict}
                </motion.p>
              </div>

              {/* Confidence Meter */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Confiança
                  </span>
                  <span className="text-xs font-bold text-cyan-400">
                    {activeScenario.confidence}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeScenario.confidence}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, #00ffcc, ${
                        activeScenario.confidence > 85 ? "#00ff88" : activeScenario.confidence > 70 ? "#ffcc00" : "#ff6644"
                      })`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TopBar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString("pt-PT"));

  // Update clock every second
  useState(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString("pt-PT")), 1000);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-white/5 bg-black/70 px-6 py-3 backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <Shield className="h-5 w-5 text-cyan-400" />
        <h1 className="text-sm font-bold uppercase tracking-[0.25em] text-white/90">
          Centro de Comando Geopolítico
        </h1>
        <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-red-400">
          CLASSIFICADO
        </span>
      </div>
      <div className="flex items-center gap-3 text-white/40">
        <Clock className="h-3.5 w-3.5" />
        <span className="font-mono text-xs">{time}</span>
      </div>
    </motion.div>
  );
}

// ═══════════ Main Page ═══════════

export default function CentroComandoGeopolitico() {
  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ backgroundColor: "#02020a" }}>
      <TopBar />
      <LeftPanel />
      <RightPanel />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        className="absolute inset-0"
      >
        <WarRoomScene />
      </Canvas>

      {/* Bottom gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#02020a] to-transparent" />
    </div>
  );
}
