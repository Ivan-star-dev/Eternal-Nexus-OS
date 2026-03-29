import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import projectLocations, { latLngToVector3 } from "@/data/projectLocations";

const GLOBE_RADIUS = 4.5;
const NODE_COUNT = 80;
const CONNECTION_DISTANCE = 2.6;

interface GlobeSceneProps {
  focusedProject: string | null;
  onHotspotClick: (id: string) => void;
  showProjects?: boolean;
}

// Deterministic pseudo-random in [0,1) — same value every render for given inputs
function dRand(i: number, salt: number): number {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

// Deep cosmic void — 80 stars in 3 size tiers
// Tier 1: 40 dim dust | Tier 2: 28 mid field | Tier 3: 12 bright anchors
function CosmicVoid() {
  const { tier1, tier2, tier3 } = useMemo(() => {
    const makeField = (count: number, rMin: number, rMax: number, offset: number) => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const phi   = Math.acos(2 * dRand(i + offset, 1) - 1);
        const theta = dRand(i + offset, 2) * Math.PI * 2;
        const r     = rMin + dRand(i + offset, 3) * (rMax - rMin);
        arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = r * Math.cos(phi);
      }
      return arr;
    };
    return {
      tier1: makeField(40, GLOBE_RADIUS * 5.5, GLOBE_RADIUS * 8.2, 0),   // dim far dust
      tier2: makeField(28, GLOBE_RADIUS * 4.2, GLOBE_RADIUS * 6.5, 100), // mid field
      tier3: makeField(12, GLOBE_RADIUS * 3.6, GLOBE_RADIUS * 5.8, 200), // bright anchors
    };
  }, []);

  return (
    <group>
      {/* Tier 1 — dim far dust */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[tier1, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8898aa" size={0.9} transparent opacity={0.09} sizeAttenuation={false} />
      </points>
      {/* Tier 2 — mid field */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[tier2, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#b0bec8" size={1.5} transparent opacity={0.15} sizeAttenuation={false} />
      </points>
      {/* Tier 3 — bright anchor stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[tier3, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#d4dde4" size={2.2} transparent opacity={0.24} sizeAttenuation={false} />
      </points>
    </group>
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
        <lineBasicMaterial color="#1a3a5c" transparent opacity={0.06} />
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

// ── OrbitalMesh helpers ────────────────────────────────────────────────────────

// Generate 96-point great-circle arc from a normal vector at radius r
function greatCircleArc(nx: number, ny: number, nz: number, r: number): Float32Array {
  const n = new THREE.Vector3(nx, ny, nz).normalize();
  const ref = Math.abs(n.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(n, ref).normalize();
  const v = new THREE.Vector3().crossVectors(n, u).normalize();
  const segs = 96;
  const pts = new Float32Array(segs * 3);
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    pts[i * 3]     = (u.x * Math.cos(a) + v.x * Math.sin(a)) * r;
    pts[i * 3 + 1] = (u.y * Math.cos(a) + v.y * Math.sin(a)) * r;
    pts[i * 3 + 2] = (u.z * Math.cos(a) + v.z * Math.sin(a)) * r;
  }
  return pts;
}

// Generate equidistant node positions along a great circle (for intersection markers)
function arcNodes(nx: number, ny: number, nz: number, r: number, count = 6): Float32Array {
  const n = new THREE.Vector3(nx, ny, nz).normalize();
  const ref = Math.abs(n.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(n, ref).normalize();
  const v = new THREE.Vector3().crossVectors(n, u).normalize();
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    pts[i * 3]     = (u.x * Math.cos(a) + v.x * Math.sin(a)) * r;
    pts[i * 3 + 1] = (u.y * Math.cos(a) + v.y * Math.sin(a)) * r;
    pts[i * 3 + 2] = (u.z * Math.cos(a) + v.z * Math.sin(a)) * r;
  }
  return pts;
}

// 7 great-circle planes — normal vectors define each arc's orbital plane
// Group A (3): slow forward rotation | Group B (4): slower counter-rotation
const ORBITAL_ARCS_A: [number, number, number][] = [
  [1,     0,     0    ], // polar meridian — N-S through prime meridian
  [0.5,   0.866, 0    ], // 60° inclined orbit
  [0,     0.643, 0.766], // 50° from equatorial, different azimuth
];
const ORBITAL_ARCS_B: [number, number, number][] = [
  [0,     1,     0    ], // equatorial great circle
  [0.707, 0,     0.707], // 45° diagonal through poles
  [-0.5,  0.5,   0.707], // opposite diagonal — counter-lattice
  [0.259, 0.966, 0    ], // 15° inclined near-equatorial ring
];

// OrbitalMesh — sovereign cybernetic lattice
// Golden great-circle arcs in two counter-rotating groups
// Node points at equidistant positions, breathing opacity
function OrbitalMesh() {
  const groupA = useRef<THREE.Group>(null); // 3 arcs — forward
  const groupB = useRef<THREE.Group>(null); // 4 arcs — counter

  const R = GLOBE_RADIUS * 1.055; // hugs just above the ionosphere

  const arcGeomsA  = useMemo(() => ORBITAL_ARCS_A.map(([x, y, z]) => greatCircleArc(x, y, z, R)), [R]);
  const arcGeomsB  = useMemo(() => ORBITAL_ARCS_B.map(([x, y, z]) => greatCircleArc(x, y, z, R)), [R]);
  const nodeGeomsA = useMemo(() => ORBITAL_ARCS_A.map(([x, y, z]) => arcNodes(x, y, z, R, 6)), [R]);
  const nodeGeomsB = useMemo(() => ORBITAL_ARCS_B.map(([x, y, z]) => arcNodes(x, y, z, R, 6)), [R]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const breath = 0.22 + Math.sin(t * 0.28) * 0.05; // 0.17–0.27 range

    if (groupA.current) {
      groupA.current.rotation.y = t * 0.009;
      groupA.current.traverse((obj) => {
        if (obj instanceof THREE.Line) {
          (obj.material as THREE.LineBasicMaterial).opacity = breath;
        } else if (obj instanceof THREE.Points) {
          (obj.material as THREE.PointsMaterial).opacity = Math.min(0.65, breath + 0.28);
        }
      });
    }
    if (groupB.current) {
      groupB.current.rotation.y = -t * 0.006;
      groupB.current.traverse((obj) => {
        if (obj instanceof THREE.Line) {
          (obj.material as THREE.LineBasicMaterial).opacity = breath * 0.82;
        } else if (obj instanceof THREE.Points) {
          (obj.material as THREE.PointsMaterial).opacity = Math.min(0.55, breath * 0.82 + 0.20);
        }
      });
    }
  });

  return (
    <>
      {/* Group A — forward rotation */}
      <group ref={groupA}>
        {arcGeomsA.map((pts, i) => (
          <lineLoop key={`al${i}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pts, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#c8a44e" transparent opacity={0.22} depthWrite={false} />
          </lineLoop>
        ))}
        {nodeGeomsA.map((pts, i) => (
          <points key={`an${i}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pts, 3]} />
            </bufferGeometry>
            <pointsMaterial color="#d4b86a" size={0.065} transparent opacity={0.50} sizeAttenuation depthWrite={false} />
          </points>
        ))}
      </group>

      {/* Group B — counter-rotation */}
      <group ref={groupB}>
        {arcGeomsB.map((pts, i) => (
          <lineLoop key={`bl${i}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pts, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#c8a44e" transparent opacity={0.18} depthWrite={false} />
          </lineLoop>
        ))}
        {nodeGeomsB.map((pts, i) => (
          <points key={`bn${i}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pts, 3]} />
            </bufferGeometry>
            <pointsMaterial color="#d4b86a" size={0.055} transparent opacity={0.40} sizeAttenuation depthWrite={false} />
          </points>
        ))}
      </group>
    </>
  );
}

const GlobeScene = ({ focusedProject, onHotspotClick, showProjects = true }: GlobeSceneProps) => {
  return (
    <>
      {/* Cosmic void — rendered first, deepest layer */}
      <CosmicVoid />

      {/* Lighting — sun from upper-right, cold fill from rear */}
      <ambientLight intensity={0.18} />
      <pointLight position={[12, 9, 8]}  intensity={0.55} color="#e8d4a0" /> {/* warm sun side */}
      <pointLight position={[-10, -5, -8]} intensity={0.08} color="#1a4a8a" /> {/* cold space fill */}
      <pointLight position={[0, 6, -12]} intensity={0.10} color="#0a9cff" />  {/* electric backlight */}

      {/* Globe + atmosphere + sovereign lattice */}
      <NetworkSphere />
      <AtmosphericShell />
      <OrbitalMesh />
      <OrbitalBreathingRing />
      <OrbitalRingOuter />
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
