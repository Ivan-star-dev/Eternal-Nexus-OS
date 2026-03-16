import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ═══ AI Agent definitions ═══
interface AIAgent {
  id: string;
  name: string;
  role: string;
  color: string;
  targetLat: number;
  targetLon: number;
  projectName: string;
}

const AI_AGENTS: AIAgent[] = [
  { id: "sora", name: "Sora-Prime", role: "3D Constructor", color: "#22c55e", targetLat: -22.9, targetLon: -43.17, projectName: "NPI Brasil" },
  { id: "gemini", name: "Gemini", role: "Infra Engineer", color: "#4a90e2", targetLat: 52.37, targetLon: 4.89, projectName: "Delta Spine NL" },
  { id: "claude", name: "Claude", role: "Health Systems", color: "#a855f7", targetLat: 14.95, targetLon: -24.35, projectName: "Pico do Fogo" },
  { id: "grok", name: "Grok", role: "Cyber Defense", color: "#ef4444", targetLat: 40.71, targetLon: -74.01, projectName: "NPI US" },
  { id: "deepseek", name: "DeepSeek", role: "Resource Optimizer", color: "#f59e0b", targetLat: 25.2, targetLon: 55.27, projectName: "NPI Dubai" },
  { id: "qwen", name: "Qwen", role: "Data Analyst", color: "#06b6d4", targetLat: 35.68, targetLon: 139.77, projectName: "Chip Fold" },
];

function latLonToPos(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

// ═══ Construction particles — lines growing upward from project sites ═══
function ConstructionParticles({ position, color, progress }: {
  position: [number, number, number];
  color: string;
  progress: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const count = 30;

  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 0.1 + Math.random() * 0.15;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.random() * 0.8 * progress;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, [progress]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = (Math.sin(t * 2 + i * 0.5) * 0.5 + 0.5) * 0.8 * progress;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const direction = useMemo(() => new THREE.Vector3(...position).normalize(), [position]);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction), [direction]);

  return (
    <group position={position} quaternion={quaternion}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[basePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.03} transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      {/* Progress ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.2, 0.25, 32, 1, 0, Math.PI * 2 * progress]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ═══ Agent orb — flies between sites ═══
function AgentOrb({ agent, progress }: { agent: AIAgent; progress: number }) {
  const ref = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  const targetPos = useMemo(() => latLonToPos(agent.targetLat, agent.targetLon, 6.6), [agent]);
  const orbitPos = useMemo(() => latLonToPos(agent.targetLat, agent.targetLon, 7.2 + Math.sin(progress * Math.PI) * 0.5), [agent, progress]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Orbit around target
    const orbitAngle = t * 0.8 + AI_AGENTS.indexOf(agent) * Math.PI / 3;
    const orbitRadius = 0.4 + Math.sin(t * 0.5) * 0.1;
    ref.current.position.set(
      targetPos[0] + Math.cos(orbitAngle) * orbitRadius,
      targetPos[1] + Math.sin(t * 1.2) * 0.15,
      targetPos[2] + Math.sin(orbitAngle) * orbitRadius,
    );
  });

  return (
    <group ref={ref}>
      {/* Core orb */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={agent.color} />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0.2} />
      </mesh>
      {/* Work beam to surface */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.005, 0.02, 0.6, 8]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0.4 * progress} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ═══ Main auto-working system ═══
export default function AutoWorkingAgents() {
  const progressRef = useRef<Record<string, number>>({});

  // Initialize progress
  useMemo(() => {
    AI_AGENTS.forEach(a => {
      progressRef.current[a.id] = Math.random() * 0.5 + 0.3;
    });
  }, []);

  // Auto-advance progress
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    AI_AGENTS.forEach(a => {
      // Sinusoidal progress that cycles 0→1 over ~60s per agent
      progressRef.current[a.id] = (Math.sin(t * 0.1 + AI_AGENTS.indexOf(a) * 1.5) * 0.5 + 0.5);
    });
  });

  return (
    <group>
      {AI_AGENTS.map(agent => {
        const pos = latLonToPos(agent.targetLat, agent.targetLon, 6.45);
        const progress = progressRef.current[agent.id] || 0.5;
        return (
          <group key={agent.id}>
            <AgentOrb agent={agent} progress={progress} />
            <ConstructionParticles position={pos} color={agent.color} progress={progress} />
          </group>
        );
      })}
    </group>
  );
}

// Export agent data for UI overlay
export { AI_AGENTS };
export type { AIAgent };
