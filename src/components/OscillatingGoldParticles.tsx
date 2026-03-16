import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 95000;
const BATCH_SIZE = Math.ceil(PARTICLE_COUNT / 3); // stagger: 1/3 per frame

/**
 * 95K oscillating gold particle ocean — procedural 8K-feel
 * Staggered update: only 1/3 of particles updated per frame for 60fps
 */
export default function OscillatingGoldParticles({ radius = 6.3 }: { radius?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const frameIndex = useRef(0);

  // Pre-compute base positions on a sphere shell
  const basePositions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + Math.random() * 1.2;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [radius]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const batch = frameIndex.current % 3;
    const start = batch * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, PARTICLE_COUNT);

    for (let i = start; i < end; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      // Multi-frequency oscillation for organic feel
      const ox = Math.sin(t * 2.8 + i * 0.003) * 0.12 + Math.cos(t * 1.6 + i * 0.007) * 0.06;
      const oy = Math.sin(t * 1.4 + i * 0.005) * 0.08 + Math.cos(t * 3.1 + i * 0.002) * 0.04;
      const oz = Math.sin(t * 3.1 + i * 0.004) * 0.1 + Math.cos(t * 0.9 + i * 0.006) * 0.05;

      dummy.position.set(bx + ox, by + oy, bz + oz);
      dummy.scale.setScalar(0.38 + Math.sin(t * 4.0 + i) * 0.18);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    frameIndex.current++;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.018, 4, 4]} />
      <meshStandardMaterial
        color="#ffd700"
        metalness={1}
        roughness={0.03}
        emissive="#ffcc33"
        emissiveIntensity={1.15}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}
