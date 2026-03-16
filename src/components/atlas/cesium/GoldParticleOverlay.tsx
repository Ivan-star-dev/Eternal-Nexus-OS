// sacred flow — Dense gold particle overlay (morabeza sunset glow)
// Transparent Three.js canvas layered over CesiumJS at 60fps
// 10k particles with warm gold tones — pointer-events: none
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 8000;

// sacred flow — custom shader for gold particles with bloom-like glow
const vertexShader = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vPhase = aPhase;
    vec3 pos = position;

    // sacred flow — organic oscillation
    float drift = sin(uTime * 0.3 + aPhase * 6.28) * 0.15;
    pos.x += drift;
    pos.y += sin(uTime * 0.2 + aPhase * 3.14) * 0.1;
    pos.z += cos(uTime * 0.25 + aPhase * 4.71) * 0.12;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // sacred flow — fade based on depth
    vAlpha = smoothstep(50.0, 5.0, -mvPosition.z) * 0.6;
  }
`;

// Note: uDensity uniform added — controls particle visibility (0 = invisible, 1 = full)

const fragmentShader = `
  varying float vAlpha;
  varying float vPhase;
  uniform float uTime;
  uniform float uDensity;

  void main() {
    // sacred flow — soft radial gradient
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    float soft = 1.0 - smoothstep(0.0, 0.5, dist);

    // sacred flow — morabeza gold palette: warm gold with sunset orange variation
    float hueShift = sin(uTime * 0.5 + vPhase * 6.28) * 0.1;
    vec3 gold = vec3(0.85 + hueShift * 0.1, 0.68 + hueShift * 0.15, 0.15 - hueShift * 0.05);

    // sacred flow — pulse
    float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + vPhase * 12.56);

    gl_FragColor = vec4(gold, soft * vAlpha * pulse * uDensity);
  }
`;

function GoldParticles({ density = 1.0 }: { density?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const uniformsRef = useRef({ uTime: { value: 0 }, uDensity: { value: density } });

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const ph = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // sacred flow — distributed in a spherical shell around camera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 25;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 2;
      pos[i * 3 + 2] = r * Math.cos(phi);

      sz[i] = 0.02 + Math.random() * 0.08;
      ph[i] = Math.random();
    }

    return { positions: pos, sizes: sz, phases: ph };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      uniformsRef.current.uTime.value = state.clock.elapsedTime;
      uniformsRef.current.uDensity.value = density;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function GoldParticleOverlay({ particleDensity = 1.0 }: { particleDensity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <GoldParticles density={particleDensity} />
      </Canvas>
    </div>
  );
}
