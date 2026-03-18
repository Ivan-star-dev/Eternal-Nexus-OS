import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Sparkles,
  Float,
  MeshDistortMaterial,
  Text,
  Line,
} from "@react-three/drei";
import * as THREE from "three";
import {
  createSeededRandom,
  createSeededNoise,
  NEXUS_EIS,
  type NexusParameters,
} from "@/lib/nexus/seededRandom";

// ═══════════════════════════════════════════════
// GPU Particle System — The Neural Cortex
// ═══════════════════════════════════════════════

function NeuralParticles({ params }: { params: NexusParameters }) {
  const meshRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const colorsRef = useRef<Float32Array | null>(null);
  const sizesRef = useRef<Float32Array | null>(null);

  const noise = useMemo(
    () => createSeededNoise(params.seed),
    [params.seed]
  );
  const rng = useMemo(
    () => createSeededRandom(params.seed),
    [params.seed]
  );

  const { positions, velocities, colors, sizes } = useMemo(() => {
    const count = params.particleCount;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const localRng = createSeededRandom(params.seed);
    const hueShift = params.colorHueShift / 360;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute in spherical shell — the brain's volume
      const theta = localRng() * Math.PI * 2;
      const phi = Math.acos(2 * localRng() - 1);
      const r = 1.5 + localRng() * 3.5;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      vel[i3] = (localRng() - 0.5) * 0.02;
      vel[i3 + 1] = (localRng() - 0.5) * 0.02;
      vel[i3 + 2] = (localRng() - 0.5) * 0.02;

      // Color based on position + hue shift — synaptic spectrum
      const hue = ((Math.atan2(pos[i3 + 1], pos[i3]) / Math.PI + 1) * 0.5 + hueShift) % 1;
      const color = new THREE.Color().setHSL(hue, 0.85, 0.6);
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;

      siz[i] = 0.02 + localRng() * 0.06;
    }

    positionsRef.current = pos;
    velocitiesRef.current = vel;
    colorsRef.current = col;
    sizesRef.current = siz;

    return { positions: pos, velocities: vel, colors: col, sizes: siz };
  }, [params.seed, params.particleCount, params.colorHueShift]);

  useFrame((state) => {
    if (!meshRef.current || !positionsRef.current || !velocitiesRef.current)
      return;

    const pos = positionsRef.current;
    const vel = velocitiesRef.current;
    const t = state.clock.elapsedTime;
    const count = params.particleCount;
    const speed = params.flowSpeed;
    const scale = params.noiseScale;
    const turb = params.turbulence;
    const trail = params.trailLength;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Noise-driven flow field — the synaptic current
      const nx = noise(pos[i3] * scale + t * 0.1, pos[i3 + 1] * scale);
      const ny = noise(
        pos[i3 + 1] * scale + 100,
        pos[i3 + 2] * scale + t * 0.1
      );
      const nz = noise(pos[i3 + 2] * scale + 200, pos[i3] * scale);

      // Apply flow + turbulence
      vel[i3] = vel[i3] * trail + nx * speed * 0.01 + (rng() - 0.5) * turb * 0.005;
      vel[i3 + 1] = vel[i3 + 1] * trail + ny * speed * 0.01 + (rng() - 0.5) * turb * 0.005;
      vel[i3 + 2] = vel[i3 + 2] * trail + nz * speed * 0.01 + (rng() - 0.5) * turb * 0.005;

      pos[i3] += vel[i3];
      pos[i3 + 1] += vel[i3 + 1];
      pos[i3 + 2] += vel[i3 + 2];

      // Contain within spherical bounds — the skull
      const dist = Math.sqrt(
        pos[i3] ** 2 + pos[i3 + 1] ** 2 + pos[i3 + 2] ** 2
      );
      if (dist > 5.5) {
        const factor = 5.0 / dist;
        pos[i3] *= factor;
        pos[i3 + 1] *= factor;
        pos[i3 + 2] *= factor;
      }
      if (dist < 0.8) {
        const factor = 1.0 / dist;
        pos[i3] *= factor;
        pos[i3 + 1] *= factor;
        pos[i3 + 2] *= factor;
      }
    }

    const geom = meshRef.current.geometry;
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ═══════════════════════════════════════════════
// Emergent Intelligence Orbiters
// ═══════════════════════════════════════════════

function EINode({
  ei,
  params,
  index,
}: {
  ei: (typeof NEXUS_EIS)[number];
  params: NexusParameters;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const trailPositions = useRef(new Float32Array(90)); // 30 trail points

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * 0.5;
    let x: number, y: number, z: number;

    switch (ei.orbitType) {
      case "lissajous": {
        const { a, b, delta } = ei.orbitParams as {
          a: number;
          b: number;
          delta: number;
        };
        const radius = params.eiInfluenceRadius;
        x = radius * Math.sin(a * t + delta);
        y = radius * Math.sin(b * t) * 0.8;
        z = radius * Math.cos(a * t) * 0.6;
        break;
      }
      case "spiral": {
        const { radius, verticalAmplitude } = ei.orbitParams as {
          radius: number;
          verticalAmplitude: number;
        };
        x = radius * Math.cos(t + index * 2.1);
        y = verticalAmplitude * Math.sin(t * 0.7 + index);
        z = radius * Math.sin(t + index * 2.1);
        break;
      }
      case "chaotic": {
        // Simplified Lorenz-inspired orbit
        const scale = 0.12;
        x = Math.sin(t * 1.3) * 3 * scale * params.eiInfluenceRadius;
        y = Math.cos(t * 0.9) * 2.8 * scale * params.eiInfluenceRadius + Math.sin(t * 2.1) * 1.5;
        z = Math.sin(t * 1.7 + 1) * 3 * scale * params.eiInfluenceRadius;
        break;
      }
      default:
        x = y = z = 0;
    }

    meshRef.current.position.set(x, y, z);

    // Pulsing glow
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * params.synapticPulseRate * 4 + index * 2) * 0.3;
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.scale.setScalar(pulse * 0.8);
    }

    // Update trail
    if (trailRef.current) {
      const tp = trailPositions.current;
      // Shift trail points
      for (let i = tp.length - 3; i >= 3; i -= 3) {
        tp[i] = tp[i - 3];
        tp[i + 1] = tp[i - 2];
        tp[i + 2] = tp[i - 1];
      }
      tp[0] = x;
      tp[1] = y;
      tp[2] = z;
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const color = new THREE.Color(ei.color);

  return (
    <>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={ei.color}
          emissive={ei.color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshBasicMaterial
          color={ei.color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbital trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions.current, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={ei.color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* EI label */}
      <Float speed={2} floatIntensity={0.3}>
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.12}
          color={ei.color}
          anchorX="center"
          anchorY="bottom"
          font="/fonts/Poppins-Bold.ttf"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {ei.name}
        </Text>
      </Float>
    </>
  );
}

// ═══════════════════════════════════════════════
// Central Nexus Core — The Brain Stem
// ═══════════════════════════════════════════════

function NexusCore({ params }: { params: NexusParameters }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.15;
      coreRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <>
      {/* Distorted core sphere — beating heart of the brain */}
      <Float speed={1.5} floatIntensity={0.2}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.8, 4]} />
          <MeshDistortMaterial
            color="#0a0a2e"
            emissive="#4400ff"
            emissiveIntensity={params.bloomIntensity * 0.5}
            distort={0.3 + Math.sin(Date.now() * 0.001) * 0.1}
            speed={2}
            roughness={0.1}
            metalness={0.8}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Synaptic ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#6644ff"
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Second ring — cross-axis */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[1.0, 0.015, 16, 80]} />
        <meshBasicMaterial
          color="#00ccff"
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#2200aa"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

// ═══════════════════════════════════════════════
// Synaptic Connections — Neural Dendrites
// ═══════════════════════════════════════════════

function SynapticWeb({ params }: { params: NexusParameters }) {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const rng = createSeededRandom(params.seed + 777);
    const count = Math.min(params.neuralBranchDepth * 8, 60);
    const conns: Array<{
      start: [number, number, number];
      end: [number, number, number];
      color: string;
    }> = [];

    for (let i = 0; i < count; i++) {
      const theta1 = rng() * Math.PI * 2;
      const phi1 = Math.acos(2 * rng() - 1);
      const r1 = 0.9 + rng() * 0.5;
      const theta2 = theta1 + (rng() - 0.5) * 1.5;
      const phi2 = phi1 + (rng() - 0.5) * 1.0;
      const r2 = 2.5 + rng() * 2;

      const hue = (rng() + params.colorHueShift / 360) % 1;
      const color = new THREE.Color().setHSL(hue, 0.7, 0.5).getStyle();

      conns.push({
        start: [
          r1 * Math.sin(phi1) * Math.cos(theta1),
          r1 * Math.sin(phi1) * Math.sin(theta1),
          r1 * Math.cos(phi1),
        ],
        end: [
          r2 * Math.sin(phi2) * Math.cos(theta2),
          r2 * Math.sin(phi2) * Math.sin(theta2),
          r2 * Math.cos(phi2),
        ],
        color,
      });
    }
    return conns;
  }, [params.seed, params.neuralBranchDepth, params.colorHueShift]);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => {
        // Create bezier midpoint for organic curve
        const mid: [number, number, number] = [
          (conn.start[0] + conn.end[0]) * 0.5 + (Math.sin(i) * 0.8),
          (conn.start[1] + conn.end[1]) * 0.5 + (Math.cos(i * 1.3) * 0.8),
          (conn.start[2] + conn.end[2]) * 0.5 + (Math.sin(i * 0.7) * 0.5),
        ];

        return (
          <Line
            key={i}
            points={[conn.start, mid, conn.end]}
            color={conn.color}
            lineWidth={0.5}
            transparent
            opacity={0.25}
          />
        );
      })}
    </group>
  );
}

// ═══════════════════════════════════════════════
// Flow Direction Indicators — Organism Pathways
// Tribunal → Atlas → Index → News → streams
// ═══════════════════════════════════════════════

function OrganFlowIndicators({ params }: { params: NexusParameters }) {
  const organs = [
    { name: "Tribunal", subtitle: "Sistema Nervoso", position: [0, 4.5, 0] as [number, number, number], color: "#ff4444" },
    { name: "Atlas", subtitle: "Coração/Fábrica", position: [4, 1.5, 0] as [number, number, number], color: "#44ff44" },
    { name: "Index", subtitle: "Rosto", position: [0, -1.5, 4] as [number, number, number], color: "#4488ff" },
    { name: "News", subtitle: "Boca", position: [-4, -1.5, 0] as [number, number, number], color: "#ffaa00" },
  ];

  return (
    <group>
      {organs.map((organ) => (
        <Float key={organ.name} speed={1} floatIntensity={0.15}>
          <group position={organ.position}>
            <mesh>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshBasicMaterial
                color={organ.color}
                transparent
                opacity={0.7}
                toneMapped={false}
              />
            </mesh>
            <Text
              position={[0, 0.25, 0]}
              fontSize={0.15}
              color={organ.color}
              anchorX="center"
              font="/fonts/Poppins-Bold.ttf"
              outlineWidth={0.008}
              outlineColor="#000000"
            >
              {organ.name}
            </Text>
            <Text
              position={[0, 0.08, 0]}
              fontSize={0.07}
              color="#aaaaaa"
              anchorX="center"
            >
              {organ.subtitle}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════
// Main Scene Composition
// ═══════════════════════════════════════════════

function SceneContent({ params }: { params: NexusParameters }) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6644ff" />
      <pointLight position={[-10, -5, 5]} intensity={0.3} color="#00ccff" />

      {/* Central nexus core */}
      <NexusCore params={params} />

      {/* Neural particle system */}
      <NeuralParticles params={params} />

      {/* Synaptic dendrite web */}
      <SynapticWeb params={params} />

      {/* Emergent Intelligence orbiters */}
      {NEXUS_EIS.map((ei, i) => (
        <EINode key={ei.id} ei={ei} params={params} index={i} />
      ))}

      {/* Organ flow indicators */}
      <OrganFlowIndicators params={params} />

      {/* Background sparkles — ambient neural dust */}
      <Sparkles
        count={200}
        scale={12}
        size={1.5}
        speed={0.3}
        opacity={0.3}
        color="#6644ff"
      />
      <Sparkles
        count={100}
        scale={8}
        size={2}
        speed={0.5}
        opacity={0.2}
        color="#00ccff"
      />

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// ═══════════════════════════════════════════════
// Exported Canvas Component
// ═══════════════════════════════════════════════

export default function NexusOrganismScene({
  params,
}: {
  params: NexusParameters;
}) {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <SceneContent params={params} />
    </Canvas>
  );
}
