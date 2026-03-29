import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import projectLocations, { latLngToVector3 } from "@/data/projectLocations";
import EarthquakeLayer from "./EarthquakeLayer";

const GLOBE_RADIUS = 4.5;
const NODE_COUNT = 80;
const CONNECTION_DISTANCE = 2.6;

interface GlobeSceneProps {
  focusedProject: string | null;
  onHotspotClick: (id: string) => void;
  showProjects?: boolean;
  showSeismic?: boolean;
}

// Deep cosmic void — sparse anchor points at extreme distance
// Not a star wallpaper. A sense that space exists beyond the globe.
function CosmicVoid() {
  const positions = useMemo(() => {
    // Seed for determinism — same field every render
    const arr = new Float32Array(32 * 3);
    const seed = [0.12,0.87,0.34,0.65,0.23,0.91,0.47,0.78,0.05,0.56,
                  0.39,0.72,0.18,0.83,0.61,0.29,0.94,0.42,0.67,0.15,
                  0.88,0.33,0.54,0.76,0.09,0.48,0.81,0.26,0.63,0.97,0.37,0.70];
    for (let i = 0; i < 32; i++) {
      const phi   = Math.acos(2 * seed[i % 32] - 1);
      const theta = seed[(i + 11) % 32] * Math.PI * 2;
      const r     = GLOBE_RADIUS * (4.8 + seed[(i + 7) % 32] * 2.8); // 22–35 units out
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* Fixed screen-size points — they behave like real stars, not particles */}
      <pointsMaterial color="#c8d8e8" size={1.2} transparent opacity={0.14} sizeAttenuation={false} />
    </points>
  );
}

// Atmospheric shell — Earth-from-space effect
// Three concentric translucent layers: ionosphere, stratosphere, electric corona
// Uses BackSide rendering so the glow wraps the globe from behind
function AtmosphericShell() {
  const innerRef  = useRef<THREE.Mesh>(null);
  const midRef    = useRef<THREE.Mesh>(null);
  const outerRef  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Independent breathing — layers pulse at different rates, never in sync
    if (innerRef.current)  innerRef.current.scale.setScalar(1 + Math.sin(t * 0.31) * 0.004);
    if (midRef.current)    midRef.current.scale.setScalar(1 + Math.sin(t * 0.22 + 1.1) * 0.007);
    if (outerRef.current)  outerRef.current.scale.setScalar(1 + Math.sin(t * 0.17 + 2.3) * 0.010);
  });

  return (
    <group>
      {/* Ionosphere — warm teal scatter, closest to surface */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.042, 64, 32]} />
        <meshBasicMaterial color="#14c8a0" transparent opacity={0.032} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Stratosphere — electric blue, the dominant corona ring */}
      <mesh ref={midRef}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.085, 64, 32]} />
        <meshBasicMaterial color="#0a9cff" transparent opacity={0.022} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Outer corona — near-invisible electric whisper, defines the edge of space */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.15, 48, 24]} />
        <meshBasicMaterial color="#1a6adf" transparent opacity={0.009} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
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
      // slow authority rotation — sovereign, not performative
      groupRef.current.rotation.y += delta * 0.022;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00008) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Globe mass — dark interior gives the sphere actual weight */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.995, 64, 32]} />
        <meshBasicMaterial color="#060e1c" transparent opacity={0.88} depthWrite />
      </mesh>
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.998, 48, 24]} />
        <meshBasicMaterial color="#0a1628" wireframe transparent opacity={0.07} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#c8a44e" transparent opacity={0.12} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#c8a44e" size={0.04} transparent opacity={0.55} sizeAttenuation />
      </points>
      {/* Equator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 1.03, GLOBE_RADIUS * 1.04, 96]} />
        <meshBasicMaterial color="#c8a44e" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Project hotspot markers
function ProjectHotspot({ id, lat, lng, title, subtitle, number, color, status, onClick }: {
  id: string; lat: number; lng: number; title: string; subtitle: string;
  number: string; color: string; status: string; onClick: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pos = latLngToVector3(lat, lng, GLOBE_RADIUS * 1.02);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 3 + lat) * 0.25;
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(id); }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; }}
      >
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.85} />
      </mesh>
      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.14, 0.2, 24]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.5 : 0.2} side={THREE.DoubleSide} />
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

// Particle flow between hotspots
function ParticleFlow() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = GLOBE_RADIUS * (1.04 + Math.random() * 0.15);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.15;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const x = posArr[i * 3];
      const z = posArr[i * 3 + 2];
      const cos = Math.cos(t * 0.02);
      const sin = Math.sin(t * 0.02);
      posArr[i * 3] = x * cos - z * sin;
      posArr[i * 3 + 2] = x * sin + z * cos;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#D4AF37" size={0.025} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}



// Orbital breathing ring — calm authority, not decoration
function OrbitalBreathingRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    // Breathing: scale pulses between 1.0 and 1.035 over ~6s
    const breath = 1 + Math.sin(t * 0.52) * 0.018;
    ringRef.current.scale.setScalar(breath);
    // Very slow independent tilt
    ringRef.current.rotation.z = t * 0.008;
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI * 0.12, 0, 0]}>
      <ringGeometry args={[GLOBE_RADIUS * 1.18, GLOBE_RADIUS * 1.195, 128]} />
      <meshBasicMaterial color="#c8a44e" transparent opacity={0.07} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Second orbital ring — offset plane for depth
function OrbitalRingOuter() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    const breath = 1 + Math.sin(t * 0.38 + 1.2) * 0.012;
    ringRef.current.scale.setScalar(breath);
    ringRef.current.rotation.z = -t * 0.005;
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI * 0.08, Math.PI * 0.15, 0]}>
      <ringGeometry args={[GLOBE_RADIUS * 1.28, GLOBE_RADIUS * 1.29, 96]} />
      <meshBasicMaterial color="#206358" transparent opacity={0.05} side={THREE.DoubleSide} />
    </mesh>
  );
}

const GlobeScene = ({ focusedProject, onHotspotClick, showProjects = true, showSeismic = true }: GlobeSceneProps) => {
  return (
    <>
      {/* Cosmic void — rendered first, deepest layer */}
      <CosmicVoid />

      {/* Lighting — sun from upper-right, cold fill from rear */}
      <ambientLight intensity={0.18} />
      <pointLight position={[12, 9, 8]}  intensity={0.55} color="#e8d4a0" /> {/* warm sun side */}
      <pointLight position={[-10, -5, -8]} intensity={0.08} color="#1a4a8a" /> {/* cold space fill */}
      <pointLight position={[0, 6, -12]} intensity={0.10} color="#0a9cff" />  {/* electric backlight */}

      {/* Globe + atmosphere */}
      <NetworkSphere />
      <AtmosphericShell />
      <OrbitalBreathingRing />
      <OrbitalRingOuter />
      <ParticleFlow />
      {showProjects !== false && projectLocations.map((p) => (
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
          onClick={onHotspotClick}
        />
      ))}
      <EarthquakeLayer visible={showSeismic} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.18}
        target={[0, 0, 0]}
      />
    </>
  );
};

export default GlobeScene;
