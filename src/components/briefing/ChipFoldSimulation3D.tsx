import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const scenes = [
  { num: "01", title: "Cellulose Nanofibril Structure", meta: "CNF Matrix", desc: "Nanofibras de celulose derivadas de cabaço e papel reciclado, organizadas em rede tridimensional com diâmetro de 5–20nm e comprimento de 1–10μm. Base orgânica para computação pós-silício." },
  { num: "02", title: "Molecular Folding — Logic Gates", meta: "Quantum-Classical Interference", desc: "Nanofibras dobradas em configurações 3D específicas criam portas lógicas por interferência quântica-clássica. Precisão de angstroms, velocidade de femtossegundos. Densidade 100x superior ao silício 2nm." },
  { num: "03", title: "Chip Assembly — Layered Architecture", meta: "3D Stacked Compute", desc: "Múltiplas camadas de CNF dobradas formam um chip 3D completo. Cada camada processa em paralelo, com interconexões por túnel quântico entre dobras adjacentes." },
];

const layerToggles = [
  { key: "fibers", label: "CNF FIBERS", color: "#8B7355" },
  { key: "folds", label: "FOLD POINTS", color: "#D4AF37" },
  { key: "gates", label: "LOGIC GATES", color: "#0A9396" },
  { key: "signals", label: "SIGNAL FLOW", color: "#9b59b6" },
];

// Cellulose nanofibrils as curved tubes
const CelluloseFibers = React.forwardRef<THREE.Group, { visible: boolean }>(({ visible }, fwdRef) => {
  const ref = useRef<THREE.Group>(null);
  const fibers = useMemo(() => {
    const result: { points: THREE.Vector3[]; color: string }[] = [];
    for (let i = 0; i < 24; i++) {
      const pts: THREE.Vector3[] = [];
      const baseX = (Math.random() - 0.5) * 4;
      const baseY = (Math.random() - 0.5) * 3;
      const baseZ = (Math.random() - 0.5) * 4;
      const angle = Math.random() * Math.PI * 2;
      for (let j = 0; j < 20; j++) {
        const t = j / 19;
        pts.push(new THREE.Vector3(
          baseX + Math.cos(angle) * t * 2 + Math.sin(t * 6 + i) * 0.15,
          baseY + Math.sin(angle) * t * 2 + Math.cos(t * 4 + i * 0.5) * 0.12,
          baseZ + t * 0.8 - 0.4 + Math.sin(t * 8 + i * 0.3) * 0.1
        ));
      }
      const hue = 25 + Math.random() * 15;
      result.push({ points: pts, color: `hsl(${hue}, 40%, ${35 + Math.random() * 15}%)` });
    }
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.05;
    }
  });

  if (!visible) return null;

  return (
    <group ref={ref}>
      {fibers.map((fiber, i) => {
        const curve = new THREE.CatmullRomCurve3(fiber.points);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.025, 6, false);
        return (
          <mesh key={i} geometry={tubeGeo}>
            <meshStandardMaterial color={fiber.color} roughness={0.7} metalness={0.1} transparent opacity={0.85} />
          </mesh>
        );
      })}
    </group>
  );
});
CelluloseFibers.displayName = "CelluloseFibers";

// Fold points — where fibers bend to create logic
const FoldPoints = React.forwardRef<THREE.Group, { visible: boolean }>(({ visible }, fwdRef) => {
  const ref = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 40; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 4
      ));
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const s = 1 + Math.sin(clock.getElapsedTime() * 2 + i * 0.5) * 0.3;
        child.scale.setScalar(s);
      });
    }
  });

  if (!visible) return null;

  return (
    <group ref={ref}>
      {points.map((pt, i) => (
        <mesh key={i} position={pt}>
          <octahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.5} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
});
FoldPoints.displayName = "FoldPoints";

// Logic gates — glowing tetrahedra at intersection points
const LogicGates = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  const gates = useMemo(() => {
    const g: { pos: THREE.Vector3; type: string }[] = [];
    const types = ["AND", "OR", "NOT", "XOR", "NAND"];
    for (let i = 0; i < 16; i++) {
      g.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.5) * 3.5
        ),
        type: types[i % types.length],
      });
    }
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  if (!visible) return null;

  return (
    <group ref={ref}>
      {gates.map((gate, i) => (
        <group key={i} position={gate.pos}>
          <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <tetrahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color="#0A9396" emissive="#0A9396" emissiveIntensity={0.6} transparent opacity={0.8} wireframe />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <tetrahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial color="#0A9396" emissive="#0A9396" emissiveIntensity={0.8} />
          </mesh>
          <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
            <span className="font-mono text-[7px] text-teal-light bg-background/80 px-1 py-0.5 border border-teal/30 whitespace-nowrap">{gate.type}</span>
          </Html>
        </group>
      ))}
    </group>
  );
};

// Signal flow — particles moving through the fiber network
const SignalFlow = ({ visible }: { visible: boolean }) => {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.005 + Math.random() * 0.01;
      vel[i * 3] = Math.cos(angle) * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * speed * 0.5;
      vel[i * 3 + 2] = Math.sin(angle) * speed;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!ref.current || !visible) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3];
      posArr[i * 3 + 1] += velocities[i * 3 + 1];
      posArr[i * 3 + 2] += velocities[i * 3 + 2];
      // Wrap around
      if (Math.abs(posArr[i * 3]) > 2.5) velocities[i * 3] *= -1;
      if (Math.abs(posArr[i * 3 + 1]) > 1.8) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posArr[i * 3 + 2]) > 2.5) velocities[i * 3 + 2] *= -1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9b59b6" size={0.04} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
};

const ChipFoldScene = ({ layers }: { layers: Record<string, boolean> }) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-3, 2, -3]} intensity={0.3} color="#D4AF37" />
      <pointLight position={[3, -1, 3]} intensity={0.2} color="#0A9396" />

      {/* Base substrate — organic chip platform */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshStandardMaterial color="#1a1510" roughness={0.9} metalness={0.05} transparent opacity={0.4} />
      </mesh>

      {/* Layer rings */}
      {[0, 0.6, 1.2].map((y, i) => (
        <mesh key={i} position={[0, y - 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5 + i * 0.3, 1.55 + i * 0.3, 64]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      ))}

      <CelluloseFibers visible={layers.fibers} />
      <FoldPoints visible={layers.folds} />
      <LogicGates visible={layers.gates} />
      <SignalFlow visible={layers.signals} />

      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} target={[0, 0, 0]} autoRotate autoRotateSpeed={0.3} />
    </>
  );
};

const ChipFoldSimulation3D = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    fibers: true, folds: true, gates: true, signals: true,
  });
  const [telemetry, setTelemetry] = useState({
    fiberCount: "24,000",
    foldAngle: "72.4°",
    gateLatency: "0.8 fs",
    density: "2.4×10¹²",
    power: "0.3 mW",
    yield: "94.2%",
  });
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="border-t border-border py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
      <div className="max-w-[1200px] mx-auto">
        <span className="section-label">SECTION 07 · INTERACTIVE 3D SIMULATION</span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
          Dobramento <span className="text-primary">Molecular</span> <span className="text-muted-foreground font-light italic">— CNF Logic</span>
        </h2>
        <p className="font-sans text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed mt-2 mb-3">
          Simulação interativa do dobramento de celulose nanofibrilada e formação de portas lógicas por interferência quântica-clássica.
        </p>
        <div className="gold-rule mb-8 sm:mb-10" />

        {/* Scene selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mb-6 border border-border">
          {scenes.map((s, i) => (
            <button
              key={s.num}
              onClick={() => setActiveScene(i)}
              className={`text-left p-4 sm:p-5 transition-colors ${activeScene === i ? "bg-primary/10 border-l-2 border-l-primary" : "bg-background hover:bg-card"}`}
            >
              <span className="font-mono text-[0.5rem] tracking-[0.2em] text-primary">{s.num} · {s.meta}</span>
              <h3 className="font-serif text-sm font-bold text-foreground mt-1">{s.title}</h3>
              <p className="font-mono text-[0.5rem] text-muted-foreground mt-1 line-clamp-2">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Canvas + controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 doc-border bg-background overflow-hidden relative" style={{ height: 420 }}>
            <Canvas camera={{ position: [4, 2.5, 4], fov: 45 }} dpr={[2, 3]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
              <ChipFoldScene layers={layers} />
            </Canvas>

            {/* Telemetry overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              {Object.entries(telemetry).map(([k, v]) => (
                <div key={k} className="bg-background/85 backdrop-blur-sm border border-border px-2.5 py-1.5">
                  <span className="font-mono text-[0.45rem] tracking-[0.12em] text-muted-foreground uppercase block">{k.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className="font-serif text-sm font-bold text-primary">{v}</span>
                </div>
              ))}
            </div>

            {/* Play/pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm border border-border p-2 hover:bg-card transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-primary" /> : <Play className="w-3.5 h-3.5 text-primary" />}
            </button>
          </div>

          {/* Layer toggles */}
          <div className="space-y-3">
            <span className="font-mono text-[0.52rem] tracking-[0.18em] text-primary uppercase block mb-2">LAYER CONTROL</span>
            {layerToggles.map((lt) => (
              <button
                key={lt.key}
                onClick={() => setLayers((p) => ({ ...p, [lt.key]: !p[lt.key] }))}
                className={`w-full text-left px-4 py-3 border transition-colors ${layers[lt.key] ? "border-border bg-card" : "border-border/30 bg-background opacity-50"}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: layers[lt.key] ? lt.color : "#333" }} />
                  <span className="font-mono text-[0.55rem] tracking-[0.12em] text-foreground">{lt.label}</span>
                </div>
              </button>
            ))}

            {/* Scene description */}
            <div className="border border-border bg-background p-4 mt-4">
              <span className="font-mono text-[0.48rem] tracking-[0.15em] text-primary block mb-2">ACTIVE VIEW</span>
              <p className="font-sans text-[0.62rem] text-muted-foreground leading-relaxed">{scenes[activeScene].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChipFoldSimulation3D;
