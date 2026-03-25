import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import projectLocations, { latLngToVector3 } from "@/data/projectLocations";
import EarthquakeLayer from "./EarthquakeLayer";
import ParticleFlow from "./ParticleFlow";

// ── Aurora Rim Shaders ─────────────────────────────────────────────────────────
const AURORA_VERT = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal    = normalize(normalMatrix * normal);
    vViewDir   = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const AURORA_FRAG = /* glsl */`
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float facing  = max(dot(vNormal, vViewDir), 0.0);
    float fresnel = pow(1.0 - facing, 3.2);
    float band    = 0.5 + 0.5 * sin(uTime * 0.35 + vNormal.y * 3.8);
    vec3 teal = vec3(0.14, 0.74, 0.60);
    vec3 gold = vec3(0.82, 0.67, 0.22);
    vec3 color = mix(teal, gold, band);
    gl_FragColor = vec4(color * fresnel, fresnel * 0.55);
  }
`;

const GLOBE_RADIUS = 4.5;
const NODE_COUNT = 80;
const CONNECTION_DISTANCE = 2.6;

interface GlobeSceneProps {
  focusedProject: string | null;
  onHotspotClick: (id: string) => void;
  onFocusChange?: (id: string | null) => void;
  showProjects?: boolean;
  showSeismic?: boolean;
}

// Atmospheric glow sphere — gives the globe its planetary presence
function AtmosphereSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    // Subtle breathing opacity
    mat.opacity = 0.06 + Math.sin(clock.getElapsedTime() * 0.4) * 0.012;
  });

  return (
    <mesh ref={meshRef}>
      {/* Slightly larger than globe — creates edge glow */}
      <sphereGeometry args={[GLOBE_RADIUS * 1.08, 48, 24]} />
      <meshBasicMaterial
        color="#1a4a4a"
        transparent
        opacity={0.06}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Aurora rim — fresnel shader sphere: teal↔gold breathing at planet edge
function AuroraRimSphere() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.14, 64, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={AURORA_VERT}
        fragmentShader={AURORA_FRAG}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Outer corona — very faint gold rim, defines presence in the scene
function CoronaSphere() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.18, 32, 16]} />
      <meshBasicMaterial
        color="#c8a44e"
        transparent
        opacity={0.018}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Wireframe globe sphere + network nodes
function NetworkSphere() {
  const groupRef = useRef<THREE.Group>(null);

  const { positions, connections } = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = GLOBE_RADIUS * (0.97 + Math.random() * 0.06);
      pos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    }
    const conn: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < CONNECTION_DISTANCE) {
          conn.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }
    return { positions: new Float32Array(pos), connections: new Float32Array(conn) };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0001) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.98, 48, 24]} />
        <meshBasicMaterial color="#0a1628" wireframe transparent opacity={0.06} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#c8a44e" transparent opacity={0.1} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#c8a44e" size={0.04} transparent opacity={0.5} sizeAttenuation />
      </points>
      {/* Equator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 1.03, GLOBE_RADIUS * 1.04, 96]} />
        <meshBasicMaterial color="#c8a44e" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Project hotspot markers
function ProjectHotspot({ id, lat, lng, title, subtitle, number, color, status, focused, onClick, onHover }: {
  id: string; lat: number; lng: number; title: string; subtitle: string;
  number: string; color: string; status: string; focused: boolean;
  onClick: (id: string) => void; onHover?: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const focusRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pos = latLngToVector3(lat, lng, GLOBE_RADIUS * 1.02);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      const s = focused
        ? 1 + Math.sin(t * 6 + lat) * 0.35
        : 1 + Math.sin(t * 3 + lat) * 0.25;
      meshRef.current.scale.setScalar(s);
    }
    if (focusRingRef.current) {
      const pulse = (t * 0.8) % 1.0;
      focusRingRef.current.scale.setScalar(1 + pulse * 2.5);
      const mat = focusRingRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = focused ? 0.5 * (1 - pulse) : 0;
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(id); }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; onHover?.(id); }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; onHover?.(null); }}
      >
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color={focused ? "#fff" : color} transparent opacity={hovered || focused ? 1 : 0.85} />
      </mesh>
      {/* Static glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.14, 0.2, 24]} />
        <meshBasicMaterial color={color} transparent opacity={hovered || focused ? 0.6 : 0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Focus pulse ring */}
      <mesh ref={focusRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div className="bg-background/95 backdrop-blur-sm border border-border px-4 py-3 min-w-[180px] shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
              <span className="font-mono text-[0.5rem] tracking-[0.15em] text-primary">{number}</span>
              <span className="font-mono text-[0.45rem] tracking-[0.1em] text-muted-foreground">{status}</span>
            </div>
            <h3 className="font-serif text-sm font-bold text-foreground">{title}</h3>
            <p className="font-mono text-[0.5rem] text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </Html>
      )}
    </group>
  );
}


const GlobeScene = ({
  focusedProject,
  onHotspotClick,
  onFocusChange,
  showProjects = true,
  showSeismic = true,
}: GlobeSceneProps) => {
  return (
    <>
      {/* 3-point lighting: ambient + warm key + cool fill */}
      <ambientLight intensity={0.2} />
      <pointLight position={[12, 8, 10]} intensity={0.45} color="#D4AF37" />
      <pointLight position={[-10, -6, -8]} intensity={0.18} color="#2dd4bf" />
      <hemisphereLight args={["#1a2a4a", "#0a0a14", 0.15]} />

      <AtmosphereSphere />
      <AuroraRimSphere />
      <CoronaSphere />
      <NetworkSphere />
      {/* Canonical particle field — 2000 particles, orbital physics, mobile-responsive */}
      <ParticleFlow count={2000} radius={GLOBE_RADIUS * 1.1} color="#D4AF37" />

      {showProjects && projectLocations.map((p) => (
        <ProjectHotspot
          key={p.id}
          id={p.id}
          lat={p.lat}
          lng={p.lng}
          title={p.title}
          subtitle={p.subtitle}
          number={p.number}
          color={p.color}
          status={p.status}
          focused={focusedProject === p.id}
          onClick={onHotspotClick}
          onHover={onFocusChange}
        />
      ))}

      {showSeismic && <EarthquakeLayer />}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.3}
        target={[0, 0, 0]}
      />
    </>
  );
};

export default GlobeScene;
