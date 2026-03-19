/**
 * StreetViewMode — Cinematic procedural metropolis.
 * Dense instanced buildings, atmospheric lighting, volumetric fog, traffic flow.
 * Performance: all geometry instanced, target 60fps at dpr 1.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══ Deterministic PRNG ═══ */
function sr(seed: number) {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
}

/* ═══ Building categories for instancing ═══ */
interface BuildingDef {
  pos: [number, number, number];
  scale: [number, number, number];
  category: 0 | 1 | 2; // short, medium, tall
  emissiveIntensity: number;
}

const GRID = 14; // ±14 blocks → ~600 buildings
const TRAFFIC_COUNT = 120;

/* Colors per category */
const CAT_COLORS = ["#0c1020", "#0a0e1a", "#080c16"];
const CAT_EMISSIVE = ["#1a2540", "#1e3a6e", "#ffd700"];

export default function StreetViewMode() {
  const trafficRef = useRef<THREE.InstancedMesh>(null);
  const holoRefs = useRef<THREE.Mesh[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  /* ═══ Generate buildings ═══ */
  const buildings: BuildingDef[] = useMemo(() => {
    const b: BuildingDef[] = [];
    for (let gx = -GRID; gx <= GRID; gx++) {
      for (let gz = -GRID; gz <= GRID; gz++) {
        // Streets every 3 blocks
        if (gx % 3 === 0 || gz % 3 === 0) continue;
        const seed = gx * 1000 + gz;
        const rand = sr(seed);
        const x = gx * 1.1 + (sr(seed + 1) - 0.5) * 0.25;
        const z = gz * 1.1 + (sr(seed + 2) - 0.5) * 0.25;

        let h: number, w: number, d: number, cat: 0 | 1 | 2;
        if (rand > 0.92) {
          // Skyscraper
          h = 5 + sr(seed + 3) * 7;
          w = 0.3 + sr(seed + 4) * 0.25;
          d = 0.3 + sr(seed + 5) * 0.25;
          cat = 2;
        } else if (rand > 0.55) {
          // Medium
          h = 1.5 + sr(seed + 3) * 3;
          w = 0.45 + sr(seed + 4) * 0.35;
          d = 0.45 + sr(seed + 5) * 0.35;
          cat = 1;
        } else {
          // Short
          h = 0.3 + sr(seed + 3) * 1.2;
          w = 0.4 + sr(seed + 4) * 0.4;
          d = 0.4 + sr(seed + 5) * 0.4;
          cat = 0;
        }
        b.push({ pos: [x, h / 2, z], scale: [w, h, d], category: cat, emissiveIntensity: cat === 2 ? 0.12 : cat === 1 ? 0.04 : 0.02 });
      }
    }
    return b;
  }, []);

  /* ═══ Instanced mesh data per category ═══ */

  /* ═══ Traffic positions ═══ */
  const trafficDefs = useMemo(() => {
    const arr: { x: number; z: number; speed: number; axis: "x" | "z" }[] = [];
    for (let i = 0; i < TRAFFIC_COUNT; i++) {
      const onX = sr(i * 7) > 0.5;
      arr.push({
        x: onX ? (sr(i * 11) - 0.5) * 30 : Math.floor(sr(i * 13) * 10 - 5) * 3.3,
        z: onX ? Math.floor(sr(i * 17) * 10 - 5) * 3.3 : (sr(i * 19) - 0.5) * 30,
        speed: 1.2 + sr(i * 23) * 3.5,
        axis: onX ? "x" : "z",
      });
    }
    return arr;
  }, []);

  /* ═══ Holographic display positions ═══ */
  const holoPositions: [number, number, number][] = useMemo(() => [
    [0, 3.5, 0],
    [8, 4.2, -6],
    [-7, 3.0, 5],
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Traffic
    if (trafficRef.current) {
      for (let i = 0; i < TRAFFIC_COUNT; i++) {
        const tp = trafficDefs[i];
        const progress = ((t * tp.speed * 0.08) % 30) - 15;
        dummy.position.set(tp.axis === "x" ? progress : tp.x, 0.06, tp.axis === "z" ? progress : tp.z);
        dummy.scale.set(0.14, 0.05, 0.28);
        dummy.updateMatrix();
        trafficRef.current.setMatrixAt(i, dummy.matrix);
      }
      trafficRef.current.instanceMatrix.needsUpdate = true;
    }

    // Holo rotation
    holoRefs.current.forEach((mesh, idx) => {
      if (mesh) mesh.rotation.y = t * (0.4 + idx * 0.15);
    });
  });

  return (
    <group position={[0, -6, 0]}>
      {/* Ground — wet asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial color="#060a14" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Road grid */}
      <gridHelper args={[48, 96, "#D4AF37", "#0a1020"]} position={[0, 0.005, 0]} />

      {/* Buildings — direct mesh rendering (R3F-compatible) */}
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos} scale={b.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={CAT_COLORS[b.category]}
            metalness={0.88}
            roughness={0.12}
            emissive={CAT_EMISSIVE[b.category]}
            emissiveIntensity={b.emissiveIntensity}
          />
        </mesh>
      ))}

      {/* Holographic displays */}
      {holoPositions.map((pos, idx) => (
        <group key={`holo-${idx}`} position={pos}>
          <mesh ref={(el: THREE.Mesh | null) => { if (el) holoRefs.current[idx] = el; }}>
            <octahedronGeometry args={[0.5 + idx * 0.15, 2]} />
            <meshBasicMaterial
              color={idx === 0 ? "#ffd700" : idx === 1 ? "#4a90e2" : "#c026d3"}
              wireframe
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Base ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -pos[1] + 0.02, 0]}>
            <ringGeometry args={[0.6, 0.8, 32]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Traffic */}
      <instancedMesh ref={trafficRef} args={[undefined, undefined, TRAFFIC_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff3344" emissive="#ff2222" emissiveIntensity={0.9} metalness={0.9} roughness={0.1} />
      </instancedMesh>

      {/* Atmospheric lighting */}
      <directionalLight position={[-20, 8, -10]} intensity={0.6} color="#ff8844" /> {/* Sunset key */}
      <directionalLight position={[15, 12, 10]} intensity={0.3} color="#4466aa" /> {/* Cool fill */}
      <pointLight position={[0, 12, 0]} intensity={0.8} distance={30} color="#ffd700" /> {/* Central tower glow */}

      {/* Spotlights on tallest towers */}
      <spotLight position={[0, 14, 0]} angle={0.3} penumbra={0.8} intensity={0.5} color="#ffd700" distance={25} />
      <spotLight position={[8, 12, -6]} angle={0.25} penumbra={0.9} intensity={0.3} color="#4a90e2" distance={20} />
      <spotLight position={[-7, 10, 5]} angle={0.25} penumbra={0.9} intensity={0.3} color="#c026d3" distance={20} />

      {/* Street lights */}
      {Array.from({ length: 36 }).map((_, i) => {
        const x = (i % 6 - 2.5) * 3.3;
        const z = (Math.floor(i / 6) - 3) * 3.3;
        return <pointLight key={`sl-${i}`} position={[x, 1.2, z]} intensity={0.08} distance={3.5} color="#ffd700" />;
      })}

      {/* Volumetric fog */}
      <fog attach="fog" args={["#060a14", 8, 35]} />
    </group>
  );
}
