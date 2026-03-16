import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";

// ── Data ──────────────────────────────────────────
const scenes = [
  { num: "01", title: "Integrated System Architecture", meta: "GeoCore + Terra Lenta", desc: "Vista completa do sistema auto-catalítico: GeoCore fornece 10¹⁷ joules para acionar o deslocamento de massa do Terra Lenta. Terra Lenta cria novos sites ótimos para poços GeoCore adicionais." },
  { num: "02", title: "Energy Flow: GeoCore → Terra Lenta", meta: "10¹⁷ joules", desc: "Fluxo energético contínuo dos poços geotérmicos ultra-profundos para os sistemas de bombeamento de massa polar. Integração não é opcional — é estrutural." },
  { num: "03", title: "Auto-Catalytic Cycle", meta: "Exponential acceleration", desc: "Cada avanço de um programa amplifica o outro. GeoCore alimenta Terra Lenta. Terra Lenta cria novos sites para GeoCore. Chip Fold otimiza ambos. Ciclo de aceleração exponencial." },
];

const systemDefs = [
  { key: "geocore", label: "GEOCORE WELLS", color: "#e74c3c" },
  { key: "terralenta", label: "TERRA LENTA PUMPS", color: "#3498db" },
  { key: "energy", label: "ENERGY FLOW", color: "#b8860b" },
  { key: "feedback", label: "FEEDBACK LOOP", color: "#1abc9c" },
  { key: "chipfold", label: "CHIP FOLD AI NODES", color: "#9b59b6" },
];

// ── 3D Components ─────────────────────────────────
const CoreEarth = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.1;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 48, 48]} />
      <meshStandardMaterial color="#1a2a3c" metalness={0.2} roughness={0.8} />
    </mesh>
  );
};

const MantleCore = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime) * 0.15;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.6, 24, 24]} />
      <meshStandardMaterial color="#8b2500" emissive="#ff4400" emissiveIntensity={0.3} transparent opacity={0.6} />
    </mesh>
  );
};

const GeoCoreWells = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 2 + i) * 0.3;
        }
      });
    }
  });

  const wellPositions: [number, number, number][] = [
    [0, 1.5, 0], [1.2, 0.8, 0.5], [-0.9, 0.9, 0.8],
    [0.5, -1.2, 0.7], [-0.7, -1.0, -0.9], [1.0, 0.2, -1.1],
  ];

  return (
    <group ref={ref}>
      {wellPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.04, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#e74c3c" emissive="#ff4400" emissiveIntensity={0.5} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const TerraLentaPumps = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.rotation.y = clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {/* Polar reservoirs */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3.5]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.5} emissive="#3498db" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.55, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3.5]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.5} emissive="#3498db" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Equatorial extraction ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.53, 0.025, 8, 48]} />
        <meshStandardMaterial color="#3498db" opacity={0.4} transparent />
      </mesh>
    </group>
  );
};

const EnergyFlowParticles = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Points>(null);
  const count = 400;
  const positions = useRef(new Float32Array(count * 3));
  const colors = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 1.0;
      positions.current[i * 3] = Math.cos(angle) * r;
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions.current[i * 3 + 2] = Math.sin(angle) * r;
      // Gold for GeoCore energy
      colors.current[i * 3] = 0.72;
      colors.current[i * 3 + 1] = 0.53;
      colors.current[i * 3 + 2] = 0.04;
    }
  }, []);

  useFrame(({ clock }) => {
    if (ref.current && visible) {
      ref.current.visible = true;
      const pos = ref.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const x = (pos.array as Float32Array)[i * 3];
        const z = (pos.array as Float32Array)[i * 3 + 2];
        const angle = Math.atan2(z, x) + 0.01;
        const r = Math.sqrt(x * x + z * z);
        (pos.array as Float32Array)[i * 3] = Math.cos(angle) * r;
        (pos.array as Float32Array)[i * 3 + 2] = Math.sin(angle) * r;
        // Radial pulsation
        let y = (pos.array as Float32Array)[i * 3 + 1];
        y += (Math.random() - 0.5) * 0.02;
        if (Math.abs(y) > 1.5) y *= -0.9;
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
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} />
    </points>
  );
};

const FeedbackLoops = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.rotation.y = -clock.elapsedTime * 0.2;
    }
  });

  const createLoopPoints = (startAngle: number): [number, number, number][] => {
    const pts: [number, number, number][] = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = startAngle + t * Math.PI;
      const r = 2.0 + Math.sin(t * Math.PI * 2) * 0.2;
      const y = Math.sin(t * Math.PI * 3) * 0.6;
      pts.push([r * Math.cos(angle), y, r * Math.sin(angle)]);
    }
    return pts;
  };

  return (
    <group ref={ref}>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <Line key={i} points={createLoopPoints(angle)} color="#1abc9c" lineWidth={1.5} transparent opacity={0.5} />
      ))}
    </group>
  );
};

const ChipFoldNodes = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const pulse = Math.sin(clock.elapsedTime * 4 + i * 1.5) > 0;
          (child.material as THREE.MeshStandardMaterial).opacity = pulse ? 0.9 : 0.2;
        }
      });
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 12 }).map((_, i) => {
        const phi = (i / 12) * Math.PI * 2;
        const r = 1.9;
        const theta = ((i % 3) - 1) * 0.4;
        return (
          <mesh key={i} position={[r * Math.cos(phi) * Math.cos(theta), r * Math.sin(theta), r * Math.sin(phi) * Math.cos(theta)]}>
            <octahedronGeometry args={[0.05]} />
            <meshStandardMaterial color="#9b59b6" transparent emissive="#9b59b6" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

const IntegrationRings = () => (
  <group>
    {/* GeoCore ring */}
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <torusGeometry args={[2.2, 0.008, 8, 64]} />
      <meshStandardMaterial color="#e74c3c" opacity={0.2} transparent />
    </mesh>
    {/* Terra Lenta ring */}
    <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}>
      <torusGeometry args={[2.2, 0.008, 8, 64]} />
      <meshStandardMaterial color="#3498db" opacity={0.2} transparent />
    </mesh>
    {/* Fusion ring */}
    <mesh rotation={[Math.PI / 2.5, Math.PI / 3, 0]}>
      <torusGeometry args={[2.2, 0.008, 8, 64]} />
      <meshStandardMaterial color="#b8860b" opacity={0.2} transparent />
    </mesh>
  </group>
);

const Scene3D = ({ layers }: { layers: Record<string, boolean> }) => (
  <>
    <ambientLight intensity={0.12} />
    <directionalLight position={[4, 3, 4]} intensity={0.5} color="#f2efe8" />
    <pointLight position={[0, 0, 0]} intensity={0.8} color="#ff4400" distance={3} />
    <pointLight position={[0, 2, 3]} intensity={0.3} color="#3498db" />
    <pointLight position={[2, -1, -2]} intensity={0.3} color="#b8860b" />
    <CoreEarth />
    <MantleCore />
    <IntegrationRings />
    <GeoCoreWells visible={layers.geocore} />
    <TerraLentaPumps visible={layers.terralenta} />
    <EnergyFlowParticles visible={layers.energy} />
    <FeedbackLoops visible={layers.feedback} />
    <ChipFoldNodes visible={layers.chipfold} />
    <OrbitControls enablePan={false} minDistance={3} maxDistance={10} target={[0, 0, 0]} autoRotate autoRotateSpeed={0.3} />
  </>
);

// ── Main Component ────────────────────────────────
const FusionCoreSimulation3D = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    geocore: true, terralenta: true, energy: true, feedback: true, chipfold: true,
  });
  const [telemetry, setTelemetry] = useState({
    geoOutput: "847", terraTransfer: "2.4", fusionEff: "94.2", chipLatency: "0.3", feedbackGain: "1.47", activeWells: "6", status: "SYNERGETIC",
  });

  const toggleLayer = (key: string) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        geoOutput: String(840 + Math.floor(Math.random() * 20)),
        terraTransfer: (2.3 + Math.random() * 0.3).toFixed(1),
        fusionEff: (93.5 + Math.random() * 1.5).toFixed(1),
        chipLatency: (0.2 + Math.random() * 0.2).toFixed(1),
        feedbackGain: (1.4 + Math.random() * 0.15).toFixed(2),
        activeWells: String(5 + Math.floor(Math.random() * 3)),
        status: "SYNERGETIC",
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-y border-border bg-background">
      <div className="flex flex-col lg:flex-row" style={{ minHeight: "min(100vh, 800px)" }}>
        {/* Side Panel */}
        <div className="w-full lg:w-[340px] xl:w-[380px] bg-card border-b lg:border-b-0 lg:border-r border-border p-5 sm:p-8 lg:p-10 flex flex-col gap-5 sm:gap-6 lg:overflow-y-auto lg:max-h-[calc(100vh-94px)] lg:sticky lg:top-[94px]">
          <h3 className="section-label text-[0.52rem] sm:text-[0.58rem] pb-3 border-b border-border">INTEGRATION SIMULATION — FC-2030</h3>

          {scenes.map((s, i) => (
            <button
              key={s.num}
              onClick={() => setActiveScene(i)}
              className={`block w-full text-left border-l-2 px-4 py-3 transition-all ${
                activeScene === i ? "border-accent-foreground bg-accent/10" : "border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              <span className={`font-mono text-[0.58rem] tracking-[0.2em] block mb-1 ${activeScene === i ? "text-teal" : "text-muted-foreground"}`}>
                SCENE {s.num}
              </span>
              <span className="font-sans text-[0.82rem] font-medium text-foreground block leading-[1.3]">{s.title}</span>
              <span className="font-mono text-[0.62rem] text-muted-foreground mt-1 block">{s.meta}</span>
            </button>
          ))}

          {/* System Toggles */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">Integration Layers</span>
            {systemDefs.map((l) => (
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

          {/* Telemetry */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">LIVE TELEMETRY</span>
            {[
              ["GEO OUTPUT", `${telemetry.geoOutput} GW`],
              ["MASS TRANSFER", `${telemetry.terraTransfer} Gt/yr`],
              ["FUSION EFF.", `${telemetry.fusionEff}%`],
              ["CHIP LATENCY", `${telemetry.chipLatency} ms`],
              ["FEEDBACK GAIN", `${telemetry.feedbackGain}x`],
              ["ACTIVE WELLS", telemetry.activeWells],
              ["SYSTEM MODE", telemetry.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-baseline py-1.5 border-b border-border/40">
                <span className="font-mono text-[0.6rem] tracking-[0.1em] text-muted-foreground">{k}</span>
                <span className="font-mono text-[0.72rem] text-teal">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative min-h-[350px] sm:min-h-[500px] bg-background">
          <Canvas camera={{ position: [3, 2, 4], fov: 45 }} dpr={[2, 3]} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ background: "#0d1117" }}>
            <Suspense fallback={null}>
              <Scene3D layers={layers} />
            </Suspense>
          </Canvas>

          <span className="absolute top-5 right-6 font-mono text-[0.6rem] text-muted-foreground tracking-[0.1em] opacity-70">
            FC-2030 · 3D SIMULATION v1.0 · SYNERGETIC CORE
          </span>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(13,17,23,0.97) 40%, transparent 100%)" }}>
            <span className="section-label block mb-2">FUSION CORE · AUTO-CATALYTIC SYSTEM · PHASE 1</span>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2.5 leading-[1.15]">
              {scenes[activeScene].title}
            </h3>
            <p className="font-sans text-[0.85rem] font-light text-foreground/65 max-w-[560px] leading-[1.65]">
              {scenes[activeScene].desc}
            </p>
            <div className="flex gap-6 mt-5">
              {[["1 TW", "clean energy"], ["10¹⁷ J", "integrated"], ["-40%", "global hunger"]].map(([val, lbl]) => (
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

export default FusionCoreSimulation3D;
