import { useRef, useMemo, useState, useCallback, Component, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

// Silent error boundary for the 3D canvas
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: Error) { console.warn('[AIAnchor3D] Canvas failed:', e.message); }
  render() {
    if (this.state.failed) return (
      <div className="h-full flex items-center justify-center">
        <span className="font-mono text-[0.5rem] text-muted-foreground tracking-widest uppercase">
          NEXUS AI ANCHOR — MODO OFFLINE
        </span>
      </div>
    );
    return this.props.children;
  }
}

// ═══ Holographic head with lip-sync ═══
function AnchorHead({ speaking }: { speaking: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Mesh>(null);
  const eyeGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Subtle head sway
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.08;
      headRef.current.rotation.x = Math.sin(t * 0.3) * 0.03;
    }
    // Lip-sync: jaw opens/closes when speaking
    if (jawRef.current) {
      const jawOpen = speaking
        ? Math.abs(Math.sin(t * 12)) * 0.06 + Math.abs(Math.sin(t * 7.3)) * 0.04
        : 0;
      jawRef.current.position.y = -0.35 - jawOpen;
      jawRef.current.scale.y = 1 + jawOpen * 2;
    }
    // Eye glow pulse
    if (eyeGlowRef.current) {
      const mat = eyeGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.8, 0]}>
      {/* Skull */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.95}
          roughness={0.1}
          emissive="#D4AF37"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Face plate */}
      <mesh position={[0, -0.05, 0.35]}>
        <planeGeometry args={[0.55, 0.65]} />
        <meshStandardMaterial
          color="#0f0f1a"
          metalness={0.8}
          roughness={0.2}
          emissive="#D4AF37"
          emissiveIntensity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Left eye */}
      <mesh position={[-0.15, 0.08, 0.48]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#4a90e2" />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.15, 0.08, 0.48]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#4a90e2" />
      </mesh>
      {/* Eye glow ring */}
      <mesh ref={eyeGlowRef} position={[0, 0.08, 0.47]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.25, 0.32, 32]} />
        <meshBasicMaterial color="#4a90e2" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Jaw / mouth area */}
      <mesh ref={jawRef} position={[0, -0.35, 0.42]}>
        <boxGeometry args={[0.25, 0.04, 0.06]} />
        <meshBasicMaterial color={speaking ? "#D4AF37" : "#666"} />
      </mesh>
      {/* Ear pieces */}
      <mesh position={[-0.48, 0, 0]}>
        <boxGeometry args={[0.08, 0.15, 0.12]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.48, 0, 0]}>
        <boxGeometry args={[0.08, 0.15, 0.12]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// ═══ Torso with suit ═══
function AnchorTorso() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.04;
    }
  });

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 1.2, 16]} />
        <meshStandardMaterial color="#0a0a14" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Collar / tie */}
      <mesh position={[0, 0.3, 0.25]}>
        <boxGeometry args={[0.08, 0.35, 0.02]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#D4AF37" emissiveIntensity={0.3} />
      </mesh>
      {/* NPI badge */}
      <mesh position={[-0.2, 0.15, 0.38]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      {/* Shoulders */}
      <mesh position={[-0.45, 0.25, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#0a0a14" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.45, 0.25, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#0a0a14" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ═══ Holographic screen behind anchor ═══
function HoloScreen({ speaking }: { speaking: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    active: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = clock.getElapsedTime();
      matRef.current.uniforms.active.value = speaking ? 1.0 : 0.3;
    }
  });

  const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
  const fragmentShader = `
    uniform float time;
    uniform float active;
    varying vec2 vUv;
    void main() {
      float scan = sin(vUv.y * 80.0 - time * 4.0) * 0.5 + 0.5;
      float grid = step(0.98, fract(vUv.x * 20.0)) + step(0.98, fract(vUv.y * 12.0));
      float wave = sin(vUv.x * 30.0 + time * 3.0) * 0.5 + 0.5;
      float bar = smoothstep(0.3, 0.7, vUv.y) * wave * active;
      vec3 col = mix(vec3(0.05, 0.05, 0.12), vec3(0.83, 0.69, 0.22), grid * 0.3 + bar * 0.4);
      col += vec3(0.0, 0.3, 0.8) * scan * 0.1 * active;
      float alpha = 0.15 + grid * 0.15 + bar * 0.2 + scan * 0.05;
      gl_FragColor = vec4(col, alpha);
    }
  `;

  return (
    <mesh position={[0, 0.3, -1.2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[3.5, 2.2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ═══ Floating particles around anchor ═══
function AnchorParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 60;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 3;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2 - 0.5;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t + i) * 0.001;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#D4AF37" size={0.02} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// ═══ Full scene ═══
function AnchorScene({ speaking }: { speaking: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} color="#ffd700" />
      <pointLight position={[2, 3, 3]} intensity={1.2} color="#D4AF37" />
      <pointLight position={[-2, -1, 2]} intensity={0.4} color="#4a90e2" />
      <spotLight position={[0, 5, 5]} angle={0.3} penumbra={0.5} intensity={1} color="#ffffff" />

      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group position={[0, -0.3, 0]}>
          <AnchorHead speaking={speaking} />
          <AnchorTorso />
        </group>
      </Float>

      <HoloScreen speaking={speaking} />
      <AnchorParticles />

      {/* Platform */}
      <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.8, 32]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// Detect WebGL support at module level
const hasWebGL = (() => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch { return false; }
})();

// ═══ Exported component ═══
interface AIAnchor3DProps {
  speaking: boolean;
  reportTitle?: string;
  onToggleSpeak: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export default function AIAnchor3D({ speaking, reportTitle, onToggleSpeak, muted, onToggleMute }: AIAnchor3DProps) {
  return (
    <div className="relative bg-card border border-primary/20 rounded-lg overflow-hidden">
      {/* 3D Canvas */}
      <div className="h-[280px] sm:h-[320px]">
        {hasWebGL ? (
          <CanvasBoundary>
            <Canvas
              camera={{ position: [0, 0.5, 3], fov: 40 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              style={{ background: "transparent" }}
            >
              <AnchorScene speaking={speaking} />
            </Canvas>
          </CanvasBoundary>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="font-mono text-[0.5rem] text-muted-foreground tracking-widest uppercase">
              NEXUS AI ANCHOR — MODO OFFLINE
            </span>
          </div>
        )}
      </div>

      {/* Overlay controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/80 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
              speaking ? "border-primary bg-primary/20 animate-pulse" : "border-border bg-card"
            }`}>
              <span className="font-mono text-[0.5rem] text-primary font-bold">AI</span>
            </div>
            {speaking && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <span className="font-mono text-[0.55rem] text-primary block tracking-wider">
              NEXUS AI ANCHOR — ECHO-VOX
            </span>
            <span className="font-mono text-[0.45rem] text-muted-foreground truncate block">
              {speaking ? `Transmitindo: ${reportTitle || "..."}` : "Pronto para transmissão"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleSpeak}>
              {speaking ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleMute}>
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* Waveform visualization */}
        {speaking && (
          <div className="flex items-end gap-0.5 h-4 mt-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/60 rounded-t-sm"
                style={{
                  height: `${20 + Math.sin(Date.now() * 0.01 + i * 0.5) * 60 + Math.random() * 20}%`,
                  transition: "height 0.1s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
