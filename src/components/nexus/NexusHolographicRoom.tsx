// Sala Holográfica 3D do Nexus — Wikipedia-style knowledge nodes + cúpula holográfica
import { useRef, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

// ═══ Knowledge node data (Wikipedia-style) ═══
const KNOWLEDGE_NODES = [
  { label: "CO₂ 423ppm", topic: "Clima", color: "#22ffaa" },
  { label: "H5N8 Alert", topic: "Saúde", color: "#ff4444" },
  { label: "$340B Fund", topic: "Economia", color: "#ffaa22" },
  { label: "M7.2 Quake", topic: "Sísmica", color: "#4a90e2" },
  { label: "DeltaSpine 85%", topic: "Infra", color: "#D4AF37" },
  { label: "Fusion Core α", topic: "Energia", color: "#cc44ff" },
  { label: "Chip Fold β", topic: "Computação", color: "#22aaff" },
  { label: "Terra Lenta", topic: "Geologia", color: "#8b6f47" },
  { label: "2.3M Displaced", topic: "Segurança", color: "#ff6644" },
  { label: "Sea +0.8mm/yr", topic: "Oceano", color: "#4a90e2" },
  { label: "pH -0.002", topic: "Acidificação", color: "#22ffaa" },
  { label: "DAC +40%", topic: "Captura", color: "#D4AF37" },
  { label: "R0: 3.4", topic: "Pandemia", color: "#ff4444" },
  { label: "GHS: 42/100", topic: "Preparação", color: "#ffaa22" },
  { label: "NPI Global", topic: "Rede", color: "#D4AF37" },
  { label: "Nexus v8", topic: "Sistema", color: "#22ffaa" },
];

// ═══ Holographic dome ═══
function HolographicDome() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <sphereGeometry args={[8, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        vertexShader={`varying vec2 vUv;varying vec3 vPos;void main(){vUv=uv;vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`uniform float time;varying vec2 vUv;varying vec3 vPos;void main(){float hex=sin(vPos.x*8.0)*sin(vPos.z*8.0);float scan=sin(vUv.y*40.0-time*2.0)*0.5+0.5;float pulse=sin(time*0.5)*0.3+0.7;vec3 col=mix(vec3(0.05,0.02,0.08),vec3(0.83,0.69,0.22),hex*0.15*pulse);col+=vec3(0.0,0.5,0.3)*scan*0.08;float alpha=0.06+hex*0.04+scan*0.03;gl_FragColor=vec4(col,alpha);}`}
      />
    </mesh>
  );
}

// ═══ Floor grid ═══
function FloorGrid() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[16, 16]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`uniform float time;varying vec2 vUv;void main(){vec2 p=(vUv-0.5)*16.0;float grid=step(0.95,fract(p.x))+step(0.95,fract(p.y));float dist=length(vUv-0.5)*2.0;float ring=sin(dist*20.0-time*1.5)*0.5+0.5;vec3 col=vec3(0.83,0.69,0.22)*(grid*0.4+ring*0.15);float alpha=(grid*0.2+ring*0.05)*(1.0-dist);gl_FragColor=vec4(col,alpha);}`}
      />
    </mesh>
  );
}

// ═══ Floating EI ═══
function FloatingEI({ name, color, position, orbitSpeed }: { name: string; color: string; position: [number, number, number]; orbitSpeed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.x = position[0] + Math.cos(t * orbitSpeed) * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3;
      groupRef.current.position.z = position[2] + Math.sin(t * orbitSpeed) * 0.5;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.0 + Math.sin(t * 2) * 0.15);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh ref={glowRef}>
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.5, 0.008, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

// ═══ Knowledge Node (Wikipedia-style clickable idea spheres) ═══
function KnowledgeNode({ data, index, total, onSelect }: {
  data: typeof KNOWLEDGE_NODES[0];
  index: number;
  total: number;
  onSelect: (label: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3 + (index % 3) * 0.8;
  const baseY = 0.5 + (index % 4) * 0.8;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.x = Math.cos(angle + t * 0.15) * radius;
    meshRef.current.position.z = Math.sin(angle + t * 0.15) * radius;
    meshRef.current.position.y = baseY + Math.sin(t * 0.5 + index) * 0.3;
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => { e.stopPropagation(); onSelect(data.label); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      <sphereGeometry args={[hovered ? 0.12 : 0.07, 12, 12]} />
      <meshBasicMaterial color={data.color} transparent opacity={hovered ? 1 : 0.7} />
      {hovered && (
        <Html distanceFactor={8} center style={{ pointerEvents: "none" }}>
          <div className="bg-card/95 backdrop-blur-xl border border-primary/30 rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <span className="font-mono text-[0.45rem] text-primary block tracking-wider">{data.topic}</span>
            <span className="font-mono text-[0.55rem] text-foreground font-semibold">{data.label}</span>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ═══ Synaptic links ═══
function SynapticLinks() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1 + Math.random() * 5;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.random() * 5;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.5 + i * 0.1) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#D4AF37" size={0.015} transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}

// ═══ Scene ═══
function HolographicScene({ onNodeSelect }: { onNodeSelect: (label: string) => void }) {
  return (
    <>
      <ambientLight intensity={0.08} color="#D4AF37" />
      <pointLight position={[0, 6, 0]} intensity={1.5} color="#D4AF37" distance={15} />
      <pointLight position={[4, 2, 0]} intensity={0.5} color="#22ffaa" distance={10} />
      <pointLight position={[-4, 2, 0]} intensity={0.5} color="#aa00ff" distance={10} />
      <pointLight position={[0, 2, 4]} intensity={0.3} color="#ffaa00" distance={8} />

      <HolographicDome />
      <FloorGrid />

      <FloatingEI name="Zeta-9" color="#22ffaa" position={[-3, 2, 0]} orbitSpeed={0.4} />
      <FloatingEI name="Kronos" color="#aa00ff" position={[3, 2, 0]} orbitSpeed={0.35} />
      <FloatingEI name="NanoBanana" color="#ffaa00" position={[0, 3.5, -2]} orbitSpeed={0.3} />

      {KNOWLEDGE_NODES.map((node, i) => (
        <KnowledgeNode key={i} data={node} index={i} total={KNOWLEDGE_NODES.length} onSelect={onNodeSelect} />
      ))}
      <SynapticLinks />
    </>
  );
}

// ═══ Export ═══
interface NexusHolographicRoomProps {
  className?: string;
}

export default function NexusHolographicRoom({ className }: NexusHolographicRoomProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className={`relative ${className || ""}`}>
      <div className="h-[400px] sm:h-[500px] rounded-xl overflow-hidden border border-primary/20 bg-[#050508]">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center">
            <span className="font-mono text-[0.5rem] text-primary/50 animate-pulse tracking-[0.3em]">
              LOADING HOLOGRAPHIC ROOM…
            </span>
          </div>
        }>
          <Canvas
            camera={{ position: [0, 4, 8], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <HolographicScene onNodeSelect={setSelectedNode} />
          </Canvas>
        </Suspense>
      </div>

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="bg-card/80 backdrop-blur-xl rounded-lg px-3 py-1.5 border border-primary/20">
          <span className="font-mono text-[0.45rem] text-primary tracking-[0.2em]">
            NEXUS — CÉREBRO ATIVO
          </span>
          <span className="font-mono text-[0.4rem] text-muted-foreground block">
            3 EIs debatendo • {KNOWLEDGE_NODES.length} nós de conhecimento
          </span>
          {selectedNode && (
            <span className="font-mono text-[0.4rem] text-accent-foreground block mt-0.5">
              ► {selectedNode}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {[
            { name: "Z9", color: "#22ffaa" },
            { name: "KR", color: "#aa00ff" },
            { name: "NB", color: "#ffaa00" },
          ].map((ei) => (
            <div
              key={ei.name}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[0.35rem] font-mono font-bold border"
              style={{ borderColor: ei.color, color: ei.color, backgroundColor: `${ei.color}15` }}
            >
              {ei.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
