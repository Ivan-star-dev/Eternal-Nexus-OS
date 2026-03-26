import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import projectLocations, { latLngToVector3 } from "@/data/projectLocations";
import EarthquakeLayer from "./EarthquakeLayer";

const GLOBE_RADIUS = 4.5;
const NODE_COUNT = 90;
const CONNECTION_DISTANCE = 2.8;

interface GlobeSceneProps {
  focusedProject: string | null;
  onHotspotClick: (id: string) => void;
  showProjects?: boolean;
  showSeismic?: boolean;
}

// Wireframe globe sphere + network nodes — elevated density and glow
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
      // Slow sovereign rotation — authority, not spectacle
      groupRef.current.rotation.y += delta * 0.022;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00008) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner sphere — slightly more visible bedrock */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.98, 48, 24]} />
        <meshBasicMaterial color="#0c1f38" wireframe transparent opacity={0.09} />
      </mesh>
      {/* Connection network — gold, elevated presence */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#c8a44e" transparent opacity={0.18} />
      </lineSegments>
      {/* Node points — brighter, more distinct */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#d4af5a" size={0.055} transparent opacity={0.7} sizeAttenuation />
      </points>
      {/* Equatorial ring — refined presence */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 1.03, GLOBE_RADIUS * 1.042, 128]} />
        <meshBasicMaterial color="#c8a44e" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Project hotspot markers — elevated glow on hover
function ProjectHotspot({ id, lat, lng, title, subtitle, number, color, status, onClick }: {
  id: string; lat: number; lng: number; title: string; subtitle: string;
  number: string; color: string; status: string; onClick: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pos = latLngToVector3(lat, lng, GLOBE_RADIUS * 1.02);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 2.5 + lat) * 0.3;
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
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.9} />
      </mesh>
      {/* Glow ring — stronger on hover */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.22, 32]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.65 : 0.25} side={THREE.DoubleSide} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div style={{
            background: "rgba(6,12,20,0.94)",
            border: "0.5px solid rgba(200,164,78,0.3)",
            backdropFilter: "blur(16px)",
            padding: "14px 18px",
            minWidth: "180px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(200,164,78,0.8)" }}>{number}</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.1em", color: "rgba(228,235,240,0.35)" }}>{status}</span>
            </div>
            <h3 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "14px", fontWeight: 500, color: "rgba(228,235,240,0.92)", margin: 0 }}>{title}</h3>
            <p style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "9px", color: "rgba(228,235,240,0.4)", marginTop: "4px", letterSpacing: "0.06em" }}>{subtitle}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Atmospheric particle field — elevated count and gold warmth
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 280;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = GLOBE_RADIUS * (1.04 + Math.random() * 0.22);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.12;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const x = posArr[i * 3];
      const z = posArr[i * 3 + 2];
      const cos = Math.cos(t * 0.018);
      const sin = Math.sin(t * 0.018);
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
      <pointsMaterial color="#d4af37" size={0.03} transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

// Primary orbital breathing ring — sovereign, calm, precise
function OrbitalBreathingRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    const breath = 1 + Math.sin(t * 0.52) * 0.018;
    ringRef.current.scale.setScalar(breath);
    ringRef.current.rotation.z = t * 0.008;
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI * 0.12, 0, 0]}>
      <ringGeometry args={[GLOBE_RADIUS * 1.18, GLOBE_RADIUS * 1.198, 128]} />
      <meshBasicMaterial color="#c8a44e" transparent opacity={0.14} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Secondary orbital ring — teal, offset plane, depth signal
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
      <ringGeometry args={[GLOBE_RADIUS * 1.3, GLOBE_RADIUS * 1.312, 96]} />
      <meshBasicMaterial color="#20937a" transparent opacity={0.09} side={THREE.DoubleSide} />
    </mesh>
  );
}

const GlobeScene = ({ focusedProject, onHotspotClick, showProjects = true, showSeismic = true }: GlobeSceneProps) => {
  return (
    <>
      {/* Lighting — elevated warmth and presence */}
      <ambientLight intensity={0.32} />
      <pointLight position={[10, 8, 10]} intensity={0.55} color="#d4af37" />
      <pointLight position={[-8, -4, 6]} intensity={0.18} color="#1a7a64" />
      <pointLight position={[0, 12, 0]} intensity={0.08} color="#c8a44e" />
      <NetworkSphere />
      <OrbitalBreathingRing />
      <OrbitalRingOuter />
      <ParticleField />
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
        autoRotateSpeed={0.2}
        target={[0, 0, 0]}
      />
    </>
  );
};

export default GlobeScene;
