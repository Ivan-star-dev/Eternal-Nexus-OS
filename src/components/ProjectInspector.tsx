import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundManager } from "@/hooks/useSoundManager";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface InspectorProject {
  id: number;
  name: string;
  lat: number;
  lon: number;
  color: string;
  desc: string;
  status: string;
}

// ═══ Luxo 3D preview with emissive glow + floating particles ═══
function InspectorPreview3D({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      meshRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={2.0} color="#ffd700" />
      <pointLight position={[-3, -3, 3]} intensity={0.6} color="#D4AF37" />
      <pointLight position={[0, -5, 0]} intensity={0.3} color={color} />

      {/* Main object */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 0.8, 1.5]} />
        <meshStandardMaterial
          color={color}
          metalness={0.95}
          roughness={0.08}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.8, 0.012, 16, 64]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.3} />
      </mesh>

      {/* Base glow disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <circleGeometry args={[1.2, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={3} />
    </>
  );
}

export default function ProjectInspector({
  project,
  onClose,
}: {
  project: InspectorProject;
  onClose: () => void;
}) {
  const sound = useSoundManager();
  const isNPI = project.status === "Ω CLEARANCE";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl"
        style={{ background: "rgba(3, 3, 3, 0.88)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            sound.playClose();
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.75, opacity: 0, y: 60 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.75, opacity: 0, y: 60 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[94vw] max-w-4xl overflow-hidden"
          style={{
            border: "1px solid rgba(212, 175, 55, 0.25)",
            background: "linear-gradient(145deg, rgba(8, 6, 2, 0.97), rgba(15, 12, 5, 0.97), rgba(8, 8, 8, 0.97))",
            boxShadow: "0 0 120px rgba(212, 175, 55, 0.12), 0 0 40px rgba(212, 175, 55, 0.06), inset 0 1px 0 rgba(212, 175, 55, 0.12)",
          }}
        >
          {/* Header — ultra luxo gold gradient */}
          <div
            className="flex items-center justify-between px-6 sm:px-8 py-5"
            style={{
              borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
              background: "linear-gradient(90deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.02), transparent)",
            }}
          >
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground tracking-wide">
                {project.name}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className="font-mono text-[0.5rem] tracking-[0.3em] uppercase font-medium"
                  style={{ color: isNPI ? "#ffd700" : "hsl(var(--primary))" }}
                >
                  {project.status}
                </span>
                {isNPI && (
                  <span className="font-mono text-[0.45rem] tracking-[0.15em] px-2 py-0.5"
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid rgba(255, 215, 0, 0.2)",
                      color: "#ffd700",
                    }}
                  >
                    NEXT PATH INFRA
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClose();
                onClose();
              }}
              className="p-2.5 transition-all hover:bg-muted/20 rounded"
              style={{ border: "1px solid rgba(212, 175, 55, 0.12)" }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Content — 3D + details */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* 3D Preview — heavy luxo */}
            <div
              className="md:col-span-3 h-72 md:h-96 relative"
              style={{
                borderRight: "1px solid rgba(212, 175, 55, 0.08)",
                background: "radial-gradient(ellipse at 50% 40%, rgba(212, 175, 55, 0.05), transparent 70%)",
              }}
            >
              <Canvas
                camera={{ position: [0, 0, 4.5], fov: 42 }}
                dpr={[2, 3]}
                gl={{ antialias: true, powerPreference: "high-performance" }}
              >
                <InspectorPreview3D color={project.color} />
              </Canvas>
              <div className="absolute bottom-0 left-0 right-0 px-4 py-2 flex items-center justify-between"
                style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.5), transparent)" }}
              >
                <span className="font-mono text-[0.42rem] tracking-[0.25em] uppercase"
                  style={{ color: "rgba(212, 175, 55, 0.4)" }}
                >
                  INSPEÇÃO 3D — ARRASTE PARA GIRAR
                </span>
                <span className="font-mono text-[0.38rem] tracking-[0.15em]"
                  style={{ color: "rgba(212, 175, 55, 0.25)" }}
                >
                  4K RENDER
                </span>
              </div>
            </div>

            {/* Details panel — luxo pesado */}
            <div className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-center gap-6"
              style={{
                background: "linear-gradient(180deg, transparent, rgba(212, 175, 55, 0.02))",
              }}
            >
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                {project.desc}
              </p>

              <div className="space-y-4">
                {/* Coordinates */}
                <div className="font-mono text-[0.58rem] tracking-[0.12em]"
                  style={{ color: "rgba(212, 175, 55, 0.65)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
                    <span>LAT {project.lat.toFixed(3)}°{project.lat >= 0 ? "N" : "S"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.color, opacity: 0.5 }} />
                    <span>LON {Math.abs(project.lon).toFixed(3)}°{project.lon >= 0 ? "E" : "W"}</span>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px w-full"
                  style={{ background: "linear-gradient(90deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.05), transparent)" }}
                />

                {/* Classification stamp */}
                <div className="space-y-1.5">
                  <p className="font-mono text-[0.48rem] tracking-[0.25em] uppercase"
                    style={{ color: "rgba(212, 175, 55, 0.3)" }}
                  >
                    NEXT PATH INFRA — CLASSIFIED
                  </p>
                  <p className="font-mono text-[0.42rem] tracking-[0.15em]"
                    style={{ color: "rgba(212, 175, 55, 0.18)" }}
                  >
                    KENSHO LAYER 5.5 · 4K PROCEDURAL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
