import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 120;
const CONNECTION_DISTANCE = 2.8;
const GLOBE_RADIUS = 4.5;

function NetworkGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, connections } = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = GLOBE_RADIUS * (0.95 + Math.random() * 0.1);
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }

    const conn: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < CONNECTION_DISTANCE) {
          conn.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return {
      positions: new Float32Array(pos),
      connections: new Float32Array(conn),
    };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {/* Wireframe globe sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.98, 36, 18]} />
        <meshBasicMaterial
          color="#1a2744"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Network connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#c8a44e" transparent opacity={0.12} />
      </lineSegments>

      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c8a44e"
          size={0.06}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 1.05, GLOBE_RADIUS * 1.06, 64]} />
        <meshBasicMaterial color="#c8a44e" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

const GlobeBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        dpr={[2, 3]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <NetworkGlobe />
      </Canvas>
    </div>
  );
};

export default GlobeBackground;
