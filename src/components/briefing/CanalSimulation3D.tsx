import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";

// ── Data ──────────────────────────────────────────
const scenes = [
  { num: "01", title: "Cross-Section — Full System", meta: "All 5 layers active", desc: "Ø 1.9m modular frame installed at canal bed. Bio-active Reefy surface (Coastruction). Self-healing bacterial concrete (TU Delft). All five functional layers active." },
  { num: "02", title: "Cargo Capsule Transit", meta: "Phase 1 · 2027", desc: "500 kg cargo capsules propelled by Linear Induction Motors at 60 km/h. PostNL and Amazon integration." },
  { num: "03", title: "Passenger Mobility", meta: "Phase 2 · 2029+", desc: "1–4 passenger capsules at 140 km/h cruise. Amsterdam–Rotterdam in 27 minutes." },
];

const layerDefs = [
  { key: "cargo", label: "CARGO CAPSULES", color: "#b8860b" },
  { key: "passenger", label: "PASSENGER CAPSULES", color: "#1abc9c" },
  { key: "nRecovery", label: "N-RECOVERY FLOW", color: "#3498db" },
  { key: "energy", label: "ENERGY VECTORS", color: "#e74c3c" },
  { key: "sensors", label: "SENSOR NETWORK", color: "#f1c40f" },
];

// ── 3D Components ─────────────────────────────────
const DeltaSpineFrame = () => {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.x += delta * 0.05;
  });
  return (
    <group ref={meshRef} position={[0, -1.5, 0]}>
      <mesh>
        <torusGeometry args={[0.95, 0.06, 16, 32]} />
        <meshStandardMaterial color="#b8860b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Inner structural ribs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.95, 0.03, 0.03]} />
            <meshStandardMaterial color="#b8860b" opacity={0.5} transparent />
          </mesh>
        );
      })}
      {/* Inner ring */}
      <mesh>
        <torusGeometry args={[0.45, 0.03, 12, 24]} />
        <meshStandardMaterial color="#b8860b" opacity={0.6} transparent metalness={0.5} />
      </mesh>
    </group>
  );
};

const CargoCapsule = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current && visible) {
      ref.current.position.x = Math.sin(clock.elapsedTime * 0.8) * 0.4;
      ref.current.position.y = -1.3;
      ref.current.visible = true;
    } else if (ref.current) {
      ref.current.visible = false;
    }
  });
  return (
    <mesh ref={ref}>
      <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
      <meshStandardMaterial color="#b8860b" metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

const PassengerCapsule = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current && visible) {
      ref.current.position.x = Math.cos(clock.elapsedTime * 0.6) * 0.35;
      ref.current.position.y = -1.7;
      ref.current.rotation.z = Math.PI / 2;
      ref.current.visible = true;
    } else if (ref.current) {
      ref.current.visible = false;
    }
  });
  return (
    <mesh ref={ref}>
      <capsuleGeometry args={[0.1, 0.4, 8, 16]} />
      <meshStandardMaterial color="#1abc9c" metalness={0.5} roughness={0.4} />
    </mesh>
  );
};

const NRecoveryParticles = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Points>(null);
  const count = 200;
  const positions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 3;
      positions.current[i * 3 + 1] = Math.random() * 3 - 2.5;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 1;
    }
  }, []);

  useFrame(({ clock }) => {
    if (ref.current && visible) {
      ref.current.visible = true;
      const geo = ref.current.geometry;
      const pos = geo.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = (pos.array as Float32Array)[i * 3 + 1];
        y += 0.005;
        if (y > 1) y = -2.5;
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
      </bufferGeometry>
      <pointsMaterial color="#3498db" size={0.03} transparent opacity={0.6} />
    </points>
  );
};

const EnergyVectors = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.rotation.z = clock.elapsedTime * 0.2;
    }
  });
  return (
    <group ref={ref} position={[0, -1.5, 0]}>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x1 = Math.cos(angle) * 0.95;
        const y1 = Math.sin(angle) * 0.95;
        const x2 = Math.cos(angle) * 1.5;
        const y2 = Math.sin(angle) * 1.5;
        return (
          <Line key={i} points={[[x1, y1, 0], [x2, y2, 0]]} color="#e74c3c" lineWidth={1} transparent opacity={0.5} />
        );
      })}
    </group>
  );
};

const SensorNodes = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const blink = Math.sin(clock.elapsedTime * 3 + i) > 0;
          (child.material as THREE.MeshStandardMaterial).opacity = blink ? 1 : 0.2;
        }
      });
    }
  });
  return (
    <group ref={ref} position={[0, -1.5, 0]}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.1, Math.sin(angle) * 1.1, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#f1c40f" transparent emissive="#f1c40f" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

const CanalWalls = () => (
  <group>
    {/* Water surface */}
    <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4, 3]} />
      <meshStandardMaterial color="#0a3d62" transparent opacity={0.25} side={THREE.DoubleSide} />
    </mesh>
    {/* Canal bed */}
    <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.5, 3]} />
      <meshStandardMaterial color="#1a2332" />
    </mesh>
    {/* Left wall */}
    <mesh position={[-1.8, -1, 0]} rotation={[0, 0, -0.3]}>
      <planeGeometry args={[0.1, 3.5]} />
      <meshStandardMaterial color="#2a3a4a" side={THREE.DoubleSide} />
    </mesh>
    {/* Right wall */}
    <mesh position={[1.8, -1, 0]} rotation={[0, 0, 0.3]}>
      <planeGeometry args={[0.1, 3.5]} />
      <meshStandardMaterial color="#2a3a4a" side={THREE.DoubleSide} />
    </mesh>
  </group>
);

const Scene3D = ({ layers }: { layers: Record<string, boolean> }) => (
  <>
    <ambientLight intensity={0.3} />
    <directionalLight position={[3, 5, 3]} intensity={0.8} color="#f2efe8" />
    <pointLight position={[0, -1.5, 2]} intensity={0.5} color="#b8860b" />
    <CanalWalls />
    <DeltaSpineFrame />
    <CargoCapsule visible={layers.cargo} />
    <PassengerCapsule visible={layers.passenger} />
    <NRecoveryParticles visible={layers.nRecovery} />
    <EnergyVectors visible={layers.energy} />
    <SensorNodes visible={layers.sensors} />
    <OrbitControls enablePan={false} minDistance={2} maxDistance={8} target={[0, -1, 0]} />
  </>
);

// ── Main Component ────────────────────────────────
const CanalSimulation3D = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    cargo: true, passenger: true, nRecovery: true, energy: false, sensors: true,
  });
  const [telemetry, setTelemetry] = useState({
    depth: "4.2", temp: "12.4", ph: "7.18", nLoad: "847", energy: "71.3", capsules: "3", flood: "LOW",
  });

  const toggleLayer = (key: string) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        depth: (4.0 + Math.random() * 0.4).toFixed(1),
        temp: (12.0 + Math.random() * 0.8).toFixed(1),
        ph: (7.1 + Math.random() * 0.15).toFixed(2),
        nLoad: String(840 + Math.floor(Math.random() * 15)),
        energy: (70 + Math.random() * 3).toFixed(1),
        capsules: String(2 + Math.floor(Math.random() * 3)),
        flood: "LOW",
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-y border-border bg-background">
      <div className="flex flex-col lg:flex-row" style={{ minHeight: "min(100vh, 800px)" }}>
        {/* Side Panel */}
        <div className="w-full lg:w-[340px] xl:w-[380px] bg-card border-b lg:border-b-0 lg:border-r border-border p-5 sm:p-8 lg:p-10 flex flex-col gap-5 sm:gap-6 lg:overflow-y-auto lg:max-h-[calc(100vh-94px)] lg:sticky lg:top-[94px]">
          <h3 className="section-label text-[0.52rem] sm:text-[0.58rem] pb-3 border-b border-border">OPERATIONAL SIMULATION — DSN-2026</h3>

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

          {/* Layer Toggles */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">Display Layers</span>
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

          {/* Telemetry */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">LIVE TELEMETRY</span>
            {[
              ["FRAME DEPTH", `${telemetry.depth} m`],
              ["WATER TEMP", `${telemetry.temp} °C`],
              ["CANAL pH", telemetry.ph],
              ["N LOAD TODAY", `${telemetry.nLoad} kg`],
              ["ENERGY REC.", `${telemetry.energy}%`],
              ["ACTIVE CAPSULES", telemetry.capsules],
              ["FLOOD RISK", telemetry.flood],
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
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[2, 3]} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ background: "#0d1117" }}>
            <Suspense fallback={null}>
              <Scene3D layers={layers} />
            </Suspense>
          </Canvas>

          <span className="absolute top-5 right-6 font-mono text-[0.6rem] text-muted-foreground tracking-[0.1em] opacity-70">
            DSN-2026 · 3D SIMULATION v2.0 · CANAL SECTION ΔA-04
          </span>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(13,17,23,0.97) 40%, transparent 100%)" }}>
            <span className="section-label block mb-2">SECTION ΔA-04 · UTRECHT–AMSTERDAM · PHASE 1</span>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2.5 leading-[1.15]">
              {scenes[activeScene].title}
            </h3>
            <p className="font-sans text-[0.85rem] font-light text-foreground/65 max-w-[560px] leading-[1.65]">
              {scenes[activeScene].desc}
            </p>
            <div className="flex gap-6 mt-5">
              {[["4 km", "pilot length"], ["Ø 1.9m", "frame diameter"], ["+150 yr", "service life"]].map(([val, lbl]) => (
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

export default CanalSimulation3D;
