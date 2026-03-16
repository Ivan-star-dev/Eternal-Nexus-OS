import { useState, useRef, useEffect, Suspense, forwardRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";

// ── Data — Raiz Fogo / Pico do Fogo Blueprint ──
const scenes = [
  {
    num: "01",
    title: "Perfil Geológico — Pico do Fogo",
    meta: "Chã das Caldeiras · 0–5 km",
    desc: "Perfil vertical completo do estratovulcão: desde a superfície da caldeira a 1.700 m de altitude, através de basalto e câmara magmática a 4–5 km de profundidade. Gradiente térmico de 80–100°C/km — top 1% mundial.",
  },
  {
    num: "02",
    title: "Tubo Híbrido SiC + Grafeno",
    meta: "Stack Tecnológico · Fase 1",
    desc: "Seção A (0–3 km): cerâmica SiC reforçada suportando até 1.200°C. Seção B (3–5 km): grafeno multi-layer dopado com YBCO supercondutor + nanopartículas de prata — condutividade térmica de 10.000 W/m·K.",
  },
  {
    num: "03",
    title: "Gerador MHD + Ciclo Fechado",
    meta: "Conversão Direta · 40–60% eficiência",
    desc: "Fluido de grafeno dopado a 800–900°C entra em estado de plasma ionizado. Sob campo magnético de 0,5 Tesla, a força de Lorentz separa cargas e gera corrente elétrica — sem turbinas, sem partes mecânicas, sem desgaste.",
  },
];

const layerDefs = [
  { key: "caldera", label: "CALDEIRA SUPERFÍCIE (0–0.5 km)", color: "#8b8b6b", depth: [0, 0.5] },
  { key: "basalt_upper", label: "BASALTO SUPERIOR (0.5–2 km)", color: "#4a4a3a", depth: [0.5, 2] },
  { key: "basalt_deep", label: "BASALTO PROFUNDO (2–3.5 km)", color: "#3a2a1a", depth: [2, 3.5] },
  { key: "transition", label: "ZONA TRANSIÇÃO (3.5–4.5 km)", color: "#8b3a00", depth: [3.5, 4.5] },
  { key: "magma", label: "CÂMARA MAGMÁTICA (4.5–5 km)", color: "#ff4500", depth: [4.5, 5] },
];

const techSpecs = [
  { label: "GRADIENTE", value: "80–100°C/km" },
  { label: "TEMP. A 5 KM", value: "~900°C" },
  { label: "FLUIDO K", value: "10.000 W/m·K" },
  { label: "MHD EFF.", value: "40–60%" },
  { label: "CAMPO B", value: "0,5 Tesla" },
  { label: "OUTPUT/POÇO", value: "80–120 MW" },
];

// ── 3D Components ─────────────────────────────────
const VolcanicLayers = ({ layers }: { layers: Record<string, boolean> }) => {
  const configs = [
    { key: "caldera", y: 2.0, height: 0.5, color: "#8b8b6b", opacity: 0.6 },
    { key: "basalt_upper", y: 1.2, height: 1.2, color: "#4a4a3a", opacity: 0.65 },
    { key: "basalt_deep", y: -0.1, height: 1.4, color: "#3a2a1a", opacity: 0.6 },
    { key: "transition", y: -1.3, height: 1.0, color: "#8b3a00", opacity: 0.55 },
    { key: "magma", y: -2.2, height: 0.8, color: "#ff4500", opacity: 0.85 },
  ];

  return (
    <group>
      {/* Volcanic cone shape at surface */}
      <mesh position={[0, 2.8, 0]} visible={layers.caldera}>
        <coneGeometry args={[2.2, 1.2, 8]} />
        <meshStandardMaterial color="#6b6b5a" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {configs.map((cfg) => (
        <mesh key={cfg.key} position={[0, cfg.y, 0]} visible={layers[cfg.key]}>
          <boxGeometry args={[3.5, cfg.height, 2.5]} />
          <meshStandardMaterial color={cfg.color} transparent opacity={cfg.opacity} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Layer boundary lines */}
      {configs.slice(0, -1).map((cfg, i) => {
        const boundaryY = cfg.y - cfg.height / 2;
        return (
          <Line
            key={`boundary-${i}`}
            points={[
              [-1.76, boundaryY, 1.26],
              [1.76, boundaryY, 1.26],
              [1.76, boundaryY, -1.26],
              [-1.76, boundaryY, -1.26],
              [-1.76, boundaryY, 1.26],
            ]}
            color="#f2efe8"
            lineWidth={0.5}
            transparent
            opacity={0.3}
          />
        );
      })}
      {/* Magma glow */}
      <pointLight position={[0, -2.2, 0]} color="#ff4500" intensity={1.5} distance={3} decay={2} />
    </group>
  );
};

const HybridTube = ({ showSiC, showGraphene }: { showSiC: boolean; showGraphene: boolean }) => {
  return (
    <group>
      {/* Section A: SiC Ceramic (0-3 km) — upper part */}
      {showSiC && (
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 2.8, 16]} />
          <meshStandardMaterial color="#7a8a9a" metalness={0.3} roughness={0.7} transparent opacity={0.85} />
        </mesh>
      )}
      {/* Section B: Graphene multi-layer (3-5 km) — lower part */}
      {showGraphene && (
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.2, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} transparent opacity={0.9} />
        </mesh>
      )}
      {/* Junction ring between SiC and Graphene */}
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[0.12, 0.025, 8, 16]} />
        <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} emissive="#b8860b" emissiveIntensity={0.3} />
      </mesh>
      {/* Depth segment rings */}
      {[1.8, 1.2, 0.6, 0.0, -0.6, -1.2, -1.8, -2.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.12, 0.015, 8, 16]} />
          <meshStandardMaterial color="#b8860b" metalness={0.6} roughness={0.3} opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
};

const GrapheneFluidFlow = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Points>(null);
  const count = 400;
  const positions = useRef(new Float32Array(count * 3));
  const colors = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Two streams: down (cold ~80°C) and up (hot ~900°C)
      const isUpstream = i < count / 2;
      const radius = isUpstream ? 0.04 + Math.random() * 0.03 : 0.06 + Math.random() * 0.03;
      positions.current[i * 3] = Math.cos(angle) * radius;
      positions.current[i * 3 + 1] = Math.random() * 5.0 - 2.6;
      positions.current[i * 3 + 2] = Math.sin(angle) * radius;
      // Hot (ascending): orange-red. Cold (descending): blue-cyan
      if (isUpstream) {
        colors.current[i * 3] = 1.0;
        colors.current[i * 3 + 1] = 0.3 + Math.random() * 0.2;
        colors.current[i * 3 + 2] = 0.0;
      } else {
        colors.current[i * 3] = 0.0;
        colors.current[i * 3 + 1] = 0.4 + Math.random() * 0.3;
        colors.current[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }
    }
  }, []);

  useFrame(() => {
    if (ref.current && visible) {
      ref.current.visible = true;
      const pos = ref.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = (pos.array as Float32Array)[i * 3 + 1];
        const isUpstream = i < count / 2;
        y += isUpstream ? 0.02 : -0.02;
        if (isUpstream && y > 2.4) y = -2.6;
        if (!isUpstream && y < -2.6) y = 2.4;
        (pos.array as Float32Array)[i * 3 + 1] = y;
      }
      pos.needsUpdate = true;
    } else if (ref.current) {
      ref.current.visible = false;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors.current, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.8} />
    </points>
  );
};

const MHDGenerator = ({ active }: { active: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  const coilRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (coilRef.current && active) {
      coilRef.current.rotation.y = clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={ref} position={[0, 2.5, 0]}>
      {/* MHD chamber */}
      <mesh>
        <boxGeometry args={[0.6, 0.35, 0.4]} />
        <meshStandardMaterial color="#2a3a4a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Superconducting coil */}
      <mesh ref={coilRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.25, 0.03, 16, 32]} />
        <meshStandardMaterial
          color={active ? "#4a9eff" : "#3a4a5a"}
          emissive={active ? "#2060ff" : "#000000"}
          emissiveIntensity={active ? 1.2 : 0}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* 0.5 Tesla field indicator */}
      {active && (
        <pointLight color="#4a9eff" intensity={1.5} distance={2} decay={2} />
      )}
      {/* Output cables */}
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#b8860b" metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const SurfacePlatform = forwardRef<THREE.Group>((_, ref) => (
  <group ref={ref} position={[0, 2.6, 0]}>
    {/* Main platform */}
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.5, 0.6, 0.15, 8]} />
      <meshStandardMaterial color="#4a5a6a" metalness={0.5} roughness={0.4} />
    </mesh>
    {/* Control building */}
    <mesh position={[0.3, 0.2, 0.2]}>
      <boxGeometry args={[0.2, 0.25, 0.2]} />
      <meshStandardMaterial color="#3a4a5a" metalness={0.3} />
    </mesh>
    {/* Antenna */}
    <mesh position={[0.35, 0.5, 0.25]}>
      <cylinderGeometry args={[0.008, 0.008, 0.4, 4]} />
      <meshStandardMaterial color="#aaa" metalness={0.8} />
    </mesh>
    {/* Steam vents */}
    {[0.3, 0.6, 0.9, 1.2].map((h) => (
      <mesh key={h} position={[0, h, 0]}>
        <boxGeometry args={[0.35, 0.015, 0.015]} />
        <meshStandardMaterial color="#b8860b" opacity={0.5} transparent />
      </mesh>
    ))}
    {/* Cooling units */}
    {[-0.6, 0.6].map((x) => (
      <mesh key={x} position={[x, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.35, 8]} />
        <meshStandardMaterial color="#3a4a5a" metalness={0.4} />
      </mesh>
    ))}
    {/* Substation */}
    <mesh position={[0.8, 0.15, 0.5]}>
      <boxGeometry args={[0.3, 0.25, 0.25]} />
      <meshStandardMaterial color="#2a4a3a" metalness={0.3} />
    </mesh>
  </group>
));

const SeismicSensors = forwardRef<THREE.Group, { visible: boolean }>(({ visible }, fwdRef) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const pulse = Math.sin(clock.elapsedTime * 4 + i * 1.5) > 0;
          (child.material as THREE.MeshStandardMaterial).opacity = pulse ? 1 : 0.15;
        }
      });
    }
  });

  return (
    <group ref={ref}>
      {[2.0, 1.2, 0.4, -0.3, -1.0, -1.7, -2.2].map((y, i) => (
        <mesh key={i} position={[0.22, y, 0.22]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#f1c40f" transparent emissive="#f1c40f" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
});

const DepthMarkers = forwardRef<THREE.Group>((_, ref) => (
  <group ref={ref} position={[1.9, 0, 0]}>
    {[
      { y: 2.3, label: "0 km" },
      { y: 1.5, label: "1 km" },
      { y: 0.5, label: "2 km" },
      { y: -0.3, label: "3 km" },
      { y: -1.3, label: "4 km" },
      { y: -2.2, label: "5 km" },
    ].map((m) => (
      <Line key={m.label} points={[[-0.1, m.y, 0], [0.1, m.y, 0]]} color="#b8860b" lineWidth={1} opacity={0.5} transparent />
    ))}
  </group>
));

const TempGradient = forwardRef<THREE.Group>((_, ref) => (
  <group ref={ref} position={[-2.0, 0, 0]}>
    {[
      { y: 2.0, label: "~30°C", color: "#4a9eff" },
      { y: 1.0, label: "~150°C", color: "#7a7aff" },
      { y: 0.0, label: "~300°C", color: "#aa5a5a" },
      { y: -1.0, label: "~500°C", color: "#cc4400" },
      { y: -2.0, label: "~900°C", color: "#ff4500" },
    ].map((m) => (
      <mesh key={m.label} position={[0, m.y, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={m.color} emissive={m.color} emissiveIntensity={0.5} />
      </mesh>
    ))}
  </group>
));

const Scene3D = ({
  layers,
  mhdActive,
  showSiC,
  showGraphene,
  showFluid,
}: {
  layers: Record<string, boolean>;
  mhdActive: boolean;
  showSiC: boolean;
  showGraphene: boolean;
  showFluid: boolean;
}) => (
  <>
    <ambientLight intensity={0.15} />
    <directionalLight position={[3, 5, 3]} intensity={0.5} color="#f2efe8" />
    <pointLight position={[0, -2, 2]} intensity={0.8} color="#ff4400" />
    <pointLight position={[0, 3, 2]} intensity={0.3} color="#4a9eff" />
    <VolcanicLayers layers={layers} />
    <HybridTube showSiC={showSiC} showGraphene={showGraphene} />
    <GrapheneFluidFlow visible={showFluid} />
    <MHDGenerator active={mhdActive} />
    <SurfacePlatform />
    <SeismicSensors visible={true} />
    <DepthMarkers />
    <TempGradient />
    <OrbitControls enablePan={false} minDistance={3} maxDistance={12} target={[0, 0, 0]} />
  </>
);

// ── Main Component ────────────────────────────────
const GeoCoreSimulation3D = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    caldera: true, basalt_upper: true, basalt_deep: true, transition: true, magma: true,
  });
  const [mhdActive, setMhdActive] = useState(true);
  const [showSiC, setShowSiC] = useState(true);
  const [showGraphene, setShowGraphene] = useState(true);
  const [showFluid, setShowFluid] = useState(true);
  const [telemetry, setTelemetry] = useState({
    depth: "4.8", temp: "892", pressure: "0.48", mhdEff: "52", flowRate: "12.4", seismic: "0.01", gradient: "86", status: "NOMINAL",
  });

  const toggleLayer = (key: string) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        depth: (4.6 + Math.random() * 0.4).toFixed(1),
        temp: String(880 + Math.floor(Math.random() * 30)),
        pressure: (0.45 + Math.random() * 0.08).toFixed(2),
        mhdEff: String(48 + Math.floor(Math.random() * 10)),
        flowRate: (11.8 + Math.random() * 1.5).toFixed(1),
        seismic: (Math.random() * 0.03).toFixed(2),
        gradient: String(82 + Math.floor(Math.random() * 12)),
        status: "NOMINAL",
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-y border-border bg-background">
      <div className="flex flex-col lg:flex-row" style={{ minHeight: "min(100vh, 850px)" }}>
        {/* Side Panel */}
        <div className="w-full lg:w-[360px] xl:w-[400px] bg-card border-b lg:border-b-0 lg:border-r border-border p-5 sm:p-8 lg:p-10 flex flex-col gap-4 sm:gap-5 lg:overflow-y-auto lg:max-h-[calc(100vh-94px)] lg:sticky lg:top-[94px]">
          <h3 className="section-label text-[0.52rem] sm:text-[0.58rem] pb-3 border-b border-border">
            RAIZ FOGO · SIMULAÇÃO 3D — PICO DO FOGO
          </h3>

          {/* Scene selector */}
          {scenes.map((s, i) => (
            <button
              key={s.num}
              onClick={() => setActiveScene(i)}
              className={`block w-full text-left border-l-2 px-4 py-3 transition-all ${
                activeScene === i ? "border-accent-foreground bg-accent/10" : "border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              <span className={`font-mono text-[0.58rem] tracking-[0.2em] block mb-1 ${activeScene === i ? "text-teal" : "text-muted-foreground"}`}>
                CENA {s.num}
              </span>
              <span className="font-sans text-[0.82rem] font-medium text-foreground block leading-[1.3]">{s.title}</span>
              <span className="font-mono text-[0.62rem] text-muted-foreground mt-1 block">{s.meta}</span>
            </button>
          ))}

          {/* System Toggles */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">Sistema</span>
            {[
              { label: "GERADOR MHD", active: mhdActive, toggle: () => setMhdActive(!mhdActive), color: "#4a9eff" },
              { label: "TUBO SiC (0–3 km)", active: showSiC, toggle: () => setShowSiC(!showSiC), color: "#7a8a9a" },
              { label: "TUBO GRAFENO (3–5 km)", active: showGraphene, toggle: () => setShowGraphene(!showGraphene), color: "#1a1a4e" },
              { label: "FLUIDO DOPADO", active: showFluid, toggle: () => setShowFluid(!showFluid), color: "#ff6600" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.toggle}
                className="flex items-center gap-2.5 py-2 w-full text-left"
              >
                <div
                  className="w-2 h-2 rounded-full border transition-all"
                  style={{
                    borderColor: item.active ? item.color : "hsl(210 10% 50%)",
                    backgroundColor: item.active ? item.color : "transparent",
                  }}
                />
                <span className={`font-mono text-[0.68rem] tracking-[0.1em] transition-colors ${item.active ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Layer Toggles */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">Camadas Vulcânicas</span>
            {layerDefs.map((l) => (
              <button
                key={l.key}
                onClick={() => toggleLayer(l.key)}
                className="flex items-center gap-2.5 py-2 border-b border-border/50 w-full text-left last:border-b-0"
              >
                <div
                  className="w-2 h-2 rounded-full border transition-all"
                  style={{
                    borderColor: layers[l.key] ? l.color : "hsl(210 10% 50%)",
                    backgroundColor: layers[l.key] ? l.color : "transparent",
                  }}
                />
                <span className={`font-mono text-[0.68rem] tracking-[0.1em] transition-colors ${layers[l.key] ? "text-foreground" : "text-muted-foreground"}`}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>

          {/* Live Telemetry */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">TELEMETRIA LIVE</span>
            {[
              ["PROFUNDIDADE", `${telemetry.depth} km`],
              ["TEMP. FUNDO", `${telemetry.temp} °C`],
              ["PRESSÃO", `${telemetry.pressure} GPa`],
              ["MHD EFICIÊNCIA", `${telemetry.mhdEff}%`],
              ["FLUXO GRAFENO", `${telemetry.flowRate} L/min`],
              ["GRADIENTE", `${telemetry.gradient} °C/km`],
              ["ACT. SÍSMICA", `${telemetry.seismic} Mw`],
              ["ESTADO", telemetry.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-baseline py-1.5 border-b border-border/40">
                <span className="font-mono text-[0.6rem] tracking-[0.1em] text-muted-foreground">{k}</span>
                <span className="font-mono text-[0.72rem] text-teal">{v}</span>
              </div>
            ))}
          </div>

          {/* Tech Specs Card */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">SPECS RAIZ FOGO</span>
            <div className="grid grid-cols-2 gap-2">
              {techSpecs.map((spec) => (
                <div key={spec.label} className="bg-background border border-border/50 px-3 py-2">
                  <span className="font-mono text-[0.5rem] tracking-[0.1em] text-muted-foreground block">{spec.label}</span>
                  <span className="font-mono text-[0.72rem] text-primary font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative min-h-[350px] sm:min-h-[500px] bg-background">
          <Canvas camera={{ position: [5, 1.5, 5], fov: 42 }} dpr={[2, 3]} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ background: "#0d1117" }}>
            <Suspense fallback={null}>
              <Scene3D layers={layers} mhdActive={mhdActive} showSiC={showSiC} showGraphene={showGraphene} showFluid={showFluid} />
            </Suspense>
          </Canvas>

          <span className="absolute top-5 right-6 font-mono text-[0.6rem] text-muted-foreground tracking-[0.1em] opacity-70">
            RAIZ FOGO · PICO DO FOGO · CABO VERDE
          </span>

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(13,17,23,0.97) 40%, transparent 100%)" }}>
            <span className="section-label block mb-2">CHÃ DAS CALDEIRAS · ILHA DO FOGO · EGS VULCÂNICO</span>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2.5 leading-[1.15]">
              {scenes[activeScene].title}
            </h3>
            <p className="font-sans text-[0.85rem] font-light text-foreground/65 max-w-[560px] leading-[1.65]">
              {scenes[activeScene].desc}
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-5">
              {[
                ["4–5 km", "profundidade"],
                ["~900°C", "temp. fundo"],
                ["80–120 MW", "por poço"],
                ["40–60%", "eficiência MHD"],
                ["$150–200M", "investimento"],
              ].map(([val, lbl]) => (
                <span key={lbl} className="font-mono text-[0.68rem]">
                  <span className="text-teal font-medium">{val}</span>
                  <span className="text-muted-foreground ml-1.5">{lbl}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeoCoreSimulation3D;
