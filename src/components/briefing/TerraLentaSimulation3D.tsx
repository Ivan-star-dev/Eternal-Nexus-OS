import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";

// ── Data ──────────────────────────────────────────
const scenes = [
  { num: "01", title: "Planetary Mass Redistribution", meta: "Equatorial → Polar transfer", desc: "Transferência de volumes hídricos massivos de latitudes equatoriais para reservatórios polares artificiais. Aumento do momento de inércia reduz a velocidade angular de ω para 0.9ω ao longo de 30-50 anos." },
  { num: "02", title: "Coriolis Force Reduction", meta: "Hurricane freq. −20%", desc: "A redução de 10% na velocidade angular diminui a força de Coriolis proporcionalmente, reduzindo a intensidade e frequência de ciclones tropicais Cat 4+ em 15-20%." },
  { num: "03", title: "Day Extension — 26.4h", meta: "+876 hours/year", desc: "Cada ser humano ganha 876 horas anuais — 36,5 dias de vida produtiva. Impacto económico direto de +8-10% no PIB global acumulado em 30 anos." },
];

const systemDefs = [
  { key: "reservoirs", label: "POLAR RESERVOIRS", color: "#3498db" },
  { key: "pumps", label: "MASS TRANSFER PUMPS", color: "#e74c3c" },
  { key: "coriolis", label: "CORIOLIS VECTORS", color: "#1abc9c" },
  { key: "monitoring", label: "ROTATION MONITORS", color: "#f1c40f" },
  { key: "geocore", label: "GEOCORE ENERGY FEED", color: "#b8860b" },
];

// ── 3D Components ─────────────────────────────────
const Earth = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.15;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial color="#1a3a5c" metalness={0.3} roughness={0.7} />
    </mesh>
  );
};

const AxisTilt = () => (
  <group rotation={[0, 0, 0.41]}>
    <Line points={[[0, -2.5, 0], [0, 2.5, 0]]} color="#f2efe8" lineWidth={0.5} transparent opacity={0.2} />
    <mesh position={[0, 2.6, 0]}>
      <coneGeometry args={[0.05, 0.15, 6]} />
      <meshStandardMaterial color="#f2efe8" opacity={0.3} transparent />
    </mesh>
  </group>
);

const EquatorialBand = () => (
  <mesh rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[1.82, 0.015, 8, 64]} />
    <meshStandardMaterial color="#e74c3c" opacity={0.5} transparent emissive="#e74c3c" emissiveIntensity={0.3} />
  </mesh>
);

const PolarReservoirs = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshStandardMaterial).opacity = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.15;
        }
      });
    }
  });
  return (
    <group ref={ref}>
      {/* North polar cap */}
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 4]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.6} emissive="#3498db" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* South polar cap */}
      <mesh position={[0, -1.75, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 4]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.6} emissive="#3498db" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const MassTransferArcs = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.visible = visible;
  });

  const createArcPoints = (startAngle: number, toNorth: boolean): [number, number, number][] => {
    const pts: [number, number, number][] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = 1.85 + Math.sin(t * Math.PI) * 0.4;
      const lat = toNorth ? t * (Math.PI / 2.2) : -t * (Math.PI / 2.2);
      const lon = startAngle + t * 0.5;
      pts.push([r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), r * Math.cos(lat) * Math.sin(lon)]);
    }
    return pts;
  };

  return (
    <group ref={ref}>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group key={i}>
          <Line points={createArcPoints(angle, true)} color="#e74c3c" lineWidth={1.5} transparent opacity={0.6} />
          <Line points={createArcPoints(angle + 0.3, false)} color="#e74c3c" lineWidth={1.5} transparent opacity={0.6} />
        </group>
      ))}
    </group>
  );
};

const CoriolisVectors = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.rotation.y = clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 8 }).map((_, i) => {
        const lat = ((i / 8) - 0.5) * Math.PI * 0.8;
        const r = 2.1;
        const y = r * Math.sin(lat) * 0.9;
        const xr = r * Math.cos(lat) * 0.95;
        return (
          <group key={i}>
            <Line
              points={[[xr, y, 0], [xr + 0.3, y + 0.1, 0.15]]}
              color="#1abc9c"
              lineWidth={2}
              transparent
              opacity={0.7}
            />
            <mesh position={[xr + 0.3, y + 0.1, 0.15]}>
              <sphereGeometry args={[0.03, 6, 6]} />
              <meshStandardMaterial color="#1abc9c" emissive="#1abc9c" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const RotationMonitors = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const blink = Math.sin(clock.elapsedTime * 3 + i * 0.8) > 0;
          (child.material as THREE.MeshStandardMaterial).opacity = blink ? 1 : 0.15;
        }
      });
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 16 }).map((_, i) => {
        const phi = (i / 16) * Math.PI * 2;
        const theta = (Math.random() - 0.5) * Math.PI * 0.8;
        const r = 1.85;
        return (
          <mesh key={i} position={[r * Math.cos(theta) * Math.cos(phi), r * Math.sin(theta), r * Math.cos(theta) * Math.sin(phi)]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#f1c40f" transparent emissive="#f1c40f" emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
};

const GeoCoreEnergyBeams = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.visible = visible;
      ref.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {[0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3].map((angle, i) => {
        const x = Math.cos(angle) * 1.82;
        const z = Math.sin(angle) * 1.82;
        return (
          <Line key={i} points={[[x * 0.6, -0.5, z * 0.6], [x, 0, z]]} color="#b8860b" lineWidth={1.5} transparent opacity={0.5} />
        );
      })}
    </group>
  );
};

const RotationRing = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.15;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.3, 0.01, 8, 64]} />
      <meshStandardMaterial color="#b8860b" opacity={0.25} transparent />
    </mesh>
  );
};

const Scene3D = ({ layers }: { layers: Record<string, boolean> }) => (
  <>
    <ambientLight intensity={0.15} />
    <directionalLight position={[5, 3, 3]} intensity={0.5} color="#f2efe8" />
    <pointLight position={[0, 2, 3]} intensity={0.3} color="#3498db" />
    <pointLight position={[0, -2, -3]} intensity={0.3} color="#3498db" />
    <Earth />
    <AxisTilt />
    <EquatorialBand />
    <RotationRing />
    <PolarReservoirs visible={layers.reservoirs} />
    <MassTransferArcs visible={layers.pumps} />
    <CoriolisVectors visible={layers.coriolis} />
    <RotationMonitors visible={layers.monitoring} />
    <GeoCoreEnergyBeams visible={layers.geocore} />
    <OrbitControls enablePan={false} minDistance={3} maxDistance={10} target={[0, 0, 0]} />
  </>
);

// ── Main Component ────────────────────────────────
const TerraLentaSimulation3D = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    reservoirs: true, pumps: true, coriolis: true, monitoring: true, geocore: false,
  });
  const [telemetry, setTelemetry] = useState({
    omega: "0.9342", dayLen: "25.71", massTransfer: "2.4", coriolis: "-6.8", seismic: "0.01", reservoirs: "4/8", status: "PHASE 1",
  });

  const toggleLayer = (key: string) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const interval = setInterval(() => {
      const omega = (0.93 + Math.random() * 0.01).toFixed(4);
      setTelemetry({
        omega,
        dayLen: (24 / parseFloat(omega)).toFixed(2),
        massTransfer: (2.3 + Math.random() * 0.3).toFixed(1),
        coriolis: (-6.5 - Math.random() * 0.5).toFixed(1),
        seismic: (Math.random() * 0.03).toFixed(2),
        reservoirs: `${4 + Math.floor(Math.random() * 2)}/8`,
        status: "PHASE 1",
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-y border-border bg-background">
      <div className="flex flex-col lg:flex-row" style={{ minHeight: "min(100vh, 800px)" }}>
        {/* Side Panel */}
        <div className="w-full lg:w-[340px] xl:w-[380px] bg-card border-b lg:border-b-0 lg:border-r border-border p-5 sm:p-8 lg:p-10 flex flex-col gap-5 sm:gap-6 lg:overflow-y-auto lg:max-h-[calc(100vh-94px)] lg:sticky lg:top-[94px]">
          <h3 className="section-label text-[0.52rem] sm:text-[0.58rem] pb-3 border-b border-border">ROTATION SIMULATION — TL-2036</h3>

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
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">System Layers</span>
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
              ["ω RATIO", `${telemetry.omega} ω₀`],
              ["DAY LENGTH", `${telemetry.dayLen} h`],
              ["MASS TRANSFER", `${telemetry.massTransfer} Gt/yr`],
              ["CORIOLIS Δ", `${telemetry.coriolis}%`],
              ["SEISMIC ACT.", `${telemetry.seismic} Mw`],
              ["RESERVOIRS", telemetry.reservoirs],
              ["PROGRAM PHASE", telemetry.status],
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
            TL-2036 · 3D SIMULATION v1.0 · PLANETARY ROTATION
          </span>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(13,17,23,0.97) 40%, transparent 100%)" }}>
            <span className="section-label block mb-2">GLOBAL SYSTEM · 30-50 YEAR PROGRAM · PHASE 1</span>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2.5 leading-[1.15]">
              {scenes[activeScene].title}
            </h3>
            <p className="font-sans text-[0.85rem] font-light text-foreground/65 max-w-[560px] leading-[1.65]">
              {scenes[activeScene].desc}
            </p>
            <div className="flex gap-6 mt-5">
              {[["26.4h", "new day"], ["+876h", "per year"], ["-20%", "hurricanes"]].map(([val, lbl]) => (
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

export default TerraLentaSimulation3D;
