import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

interface ParticleFlowProps {
  count?: number;
  radius?: number;
  color?: string;
}

export default function ParticleFlow({
  count = 2000,
  radius = 8,
  color = "#D4AF37",
}: ParticleFlowProps) {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? Math.floor(count * 0.4) : count;

  const pointsRef = useRef<THREE.Points>(null);
  const posAttrRef = useRef<THREE.BufferAttribute>(null!);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + (Math.random() - 0.5) * 4;

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      const speed = 0.003 + Math.random() * 0.008;
      vel[i3] = Math.cos(theta + Math.PI / 2) * speed;
      vel[i3 + 1] = (Math.random() - 0.5) * speed * 0.5;
      vel[i3 + 2] = Math.sin(theta + Math.PI / 2) * speed;
    }

    return { positions: pos, velocities: vel };
  }, [particleCount, radius]);

  const sizes = useMemo(() => {
    const s = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      s[i] = Math.random() * 0.4 + 0.1;
    }
    return s;
  }, [particleCount]);

  useFrame((state) => {
    if (!posAttrRef.current) return;
    const arr = posAttrRef.current.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      let x = arr[i3] + velocities[i3] + Math.sin(t * 0.5 + i * 0.01) * 0.001;
      let y = arr[i3 + 1] + velocities[i3 + 1] + Math.cos(t * 0.3 + i * 0.02) * 0.001;
      let z = arr[i3 + 2] + velocities[i3 + 2] + Math.sin(t * 0.4 + i * 0.015) * 0.001;

      const dist = Math.sqrt(x * x + y * y + z * z);
      const targetR = radius + Math.sin(t * 0.8 + i * 0.05) * 1.2;
      const factor = targetR / (dist || 1);

      arr[i3] = x * factor;
      arr[i3 + 1] = y * factor;
      arr[i3 + 2] = z * factor;
    }

    posAttrRef.current.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttrRef}
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.15} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}
