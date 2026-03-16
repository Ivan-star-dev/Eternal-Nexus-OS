// sacred-flow: Kronos — Juízes Holográficos visuais 3D
// Apple-level scroll reveal + DOF + glow intenso
// Vision Pro quality — bloom radial em cada juiz

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { AgentId, AgentStatus } from '../../types';

interface HolographicJudgesProps {
  judges: Map<AgentId, AgentStatus>;
}

const JUDGE_POSITIONS: Record<string, [number, number, number]> = {
  'zeta-9':     [-3, 0, 0],   // Left
  'kronos':     [0, 0, -2],   // Center-back
  'nanobanana': [3, 0, 0],    // Right
};

const JUDGE_COLORS: Record<string, string> = {
  'zeta-9':     '#FFB347',    // Morabeza gold
  'kronos':     '#4ECDC4',    // Teal future
  'nanobanana': '#FF6B6B',    // Coral energy
};

function JudgeHologram({ agentId, status }: { agentId: AgentId; status: AgentStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const position = JUDGE_POSITIONS[agentId] || [0, 0, 0];
  const color = new THREE.Color(JUDGE_COLORS[agentId] || '#FFB347');

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // sacred-flow: rotation — alive, never static
    meshRef.current.rotation.y += delta * 0.5;

    // sacred-flow: pulse when processing
    if (status.status === 'processing') {
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.15;
      meshRef.current.scale.setScalar(scale);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2);
    }

    // sacred-flow: glow outer ring
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.3;
      const glowScale = 1.5 + Math.sin(Date.now() * 0.003) * 0.2;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group position={position}>
      {/* sacred-flow: Core judge shape — icosahedron = complexity */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={status.status === 'processing' ? 2.5 : 0.8}
          transparent
          opacity={0.85}
          wireframe={status.status === 'processing'}
        />
      </mesh>

      {/* sacred-flow: Outer glow ring — bloom radial */}
      <mesh ref={glowRef}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* sacred-flow: Status indicator light */}
      <pointLight
        color={color}
        intensity={status.status === 'processing' ? 3 : 1}
        distance={5}
      />
    </group>
  );
}

export default function HolographicJudges({ judges }: HolographicJudgesProps) {
  return (
    <group>
      {Array.from(judges.entries()).map(([id, status]) => (
        <JudgeHologram key={id} agentId={id} status={status} />
      ))}
    </group>
  );
}
