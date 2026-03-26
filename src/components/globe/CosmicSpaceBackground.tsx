// CosmicSpaceBackground — 4K-quality sideral space backdrop for the Hero Globe
// Runs inside the existing @react-three/fiber Canvas as a scene background layer
// GPU-rendered: star field (4000+), nebula clouds, parallax nebula, distant galaxies, shooting stars
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ══════════════════════════════════════════════════════════════════════════════
// NEBULA CLOUD — volumetric soft gas cloud via shader
// ══════════════════════════════════════════════════════════════════════════════
const nebulaVertex = `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragment = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vPos;

  // hash + FBM noise
  float hash(vec2 p) {
    p = fract(p * vec2(443.8975, 397.2973));
    p += dot(p.yx, p.xy + 19.19);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 7; i++) {
      v += a * noise(p);
      p = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.52;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float t = uTime * 0.04;

    float n1 = fbm(uv * 2.8 + t * 0.7);
    float n2 = fbm(uv * 4.2 - t * 0.4 + vec2(3.1, 5.7));
    float n3 = fbm(uv * 1.6 + t * 0.2 + vec2(7.3, 2.1));

    float cloud = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    cloud = pow(cloud, 1.8);

    // Radial fade from center-edges
    float radial = 1.0 - smoothstep(0.2, 0.7, length(uv));
    cloud *= radial;

    // Color blending
    vec3 col = mix(uColor1, uColor2, n1);
    col = mix(col, uColor3, n2 * 0.6);

    // Subtle animation pulse
    float pulse = 0.82 + 0.18 * sin(uTime * 0.3 + n1 * 6.28);
    cloud *= pulse;

    gl_FragColor = vec4(col, cloud * uOpacity);
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// STAR FIELD — 4000 stars with size/brightness variation + twinkle
// ══════════════════════════════════════════════════════════════════════════════
const starVertex = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aBrightness;
  uniform float uTime;
  varying float vBrightness;
  varying float vPhase;

  void main() {
    vPhase = aPhase;
    vBrightness = aBrightness;
    // subtle parallax drift
    vec3 pos = position;
    pos.x += sin(uTime * 0.08 + aPhase * 2.3) * 0.12;
    pos.y += cos(uTime * 0.06 + aPhase * 1.7) * 0.08;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    // twinkle size
    float twinkle = 0.7 + 0.3 * sin(uTime * (1.5 + aPhase * 3.0) + aPhase * 12.566);
    gl_PointSize = aSize * twinkle * (280.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const starFragment = `
  uniform float uTime;
  varying float vBrightness;
  varying float vPhase;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    // Core glow
    float core = 1.0 - smoothstep(0.0, 0.12, d);
    float halo = (1.0 - smoothstep(0.1, 0.5, d)) * 0.35;
    float soft = core + halo;

    // Star color spectrum: blue-white → warm white → gold
    float t = vPhase;
    vec3 blueWhite = vec3(0.72, 0.82, 1.0);
    vec3 pureWhite = vec3(1.0, 0.98, 0.95);
    vec3 warmGold  = vec3(1.0, 0.88, 0.55);
    vec3 col = t < 0.5 ? mix(blueWhite, pureWhite, t * 2.0) : mix(pureWhite, warmGold, (t - 0.5) * 2.0);

    float twinkle = 0.65 + 0.35 * sin(uTime * (2.0 + vPhase * 2.0) + vPhase * 12.566);

    gl_FragColor = vec4(col, soft * vBrightness * twinkle);
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// SHOOTING STAR — animated streak
// ══════════════════════════════════════════════════════════════════════════════
const shootVertex = `
  attribute float aProgress;
  uniform float uTime;
  uniform vec3 uStart;
  uniform vec3 uEnd;
  varying float vProgress;
  varying float vAlpha;

  void main() {
    vProgress = aProgress;
    float t = mod(uTime * 0.18, 1.0);
    vec3 pos = mix(uStart, uEnd, t + aProgress * 0.12);
    float fade = t < 0.1 ? t / 0.1 : 1.0 - (t - 0.1) / 0.9;
    vAlpha = fade * (1.0 - aProgress * 0.8);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (1.0 - aProgress) * 4.0;
    gl_Position = projectionMatrix * mv;
  }
`;

const shootFragment = `
  varying float vAlpha;
  varying float vProgress;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.0, 0.5, d);
    vec3 gold = vec3(1.0, 0.88, 0.5);
    vec3 white = vec3(1.0, 0.98, 0.95);
    vec3 col = mix(white, gold, vProgress);
    gl_FragColor = vec4(col, soft * vAlpha * 0.85);
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// Components
// ══════════════════════════════════════════════════════════════════════════════

function StarField() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 22000;

  const { positions, sizes, phases, brightness } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const sz  = new Float32Array(COUNT);
    const ph  = new Float32Array(COUNT);
    const br  = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // distribute in a big sphere shell around the scene
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 60 + Math.random() * 80;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      sz[i] = 0.015 + Math.random() * 0.055;
      ph[i] = Math.random();
      // brightness: most are dim, few bright
      br[i] = Math.pow(Math.random(), 2.2) * 0.85 + 0.15;
    }
    return { positions: pos, sizes: sz, phases: ph, brightness: br };
  }, []);

  const uniforms = useRef({ uTime: { value: 0 } });

  useFrame((s) => {
    uniforms.current.uTime.value = s.clock.elapsedTime;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase"   args={[phases, 1]} />
        <bufferAttribute attach="attributes-aBrightness" args={[brightness, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starVertex}
        fragmentShader={starFragment}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function NebulaMesh({ position, color1, color2, color3, opacity, scale, rotation }: {
  position: [number, number, number];
  color1: string; color2: string; color3: string;
  opacity: number; scale: number; rotation?: [number, number, number];
}) {
  const uniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(color1) },
    uColor2: { value: new THREE.Color(color2) },
    uColor3: { value: new THREE.Color(color3) },
    uOpacity: { value: opacity },
  });

  useFrame((s) => {
    uniforms.current.uTime.value = s.clock.elapsedTime;
  });

  return (
    <mesh position={position} rotation={rotation ?? [0, 0, 0]} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ShootingStar({ start, end, delay }: {
  start: [number, number, number];
  end: [number, number, number];
  delay: number;
}) {
  const TRAIL = 22;
  const progress = useMemo(() => {
    const arr = new Float32Array(TRAIL);
    for (let i = 0; i < TRAIL; i++) arr[i] = i / TRAIL;
    return arr;
  }, []);

  // simple trail positions — all at start, shader animates via uTime
  const positions = useMemo(() => {
    const arr = new Float32Array(TRAIL * 3);
    for (let i = 0; i < TRAIL; i++) {
      arr[i * 3]     = start[0];
      arr[i * 3 + 1] = start[1];
      arr[i * 3 + 2] = start[2];
    }
    return arr;
  }, [start]);

  const uniforms = useRef({
    uTime: { value: 0 },
    uStart: { value: new THREE.Vector3(...start) },
    uEnd:   { value: new THREE.Vector3(...end) },
  });

  useFrame((s) => {
    uniforms.current.uTime.value = s.clock.elapsedTime + delay;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position"  args={[positions, 3]} />
        <bufferAttribute attach="attributes-aProgress" args={[progress, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={shootVertex}
        fragmentShader={shootFragment}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════════════════
export default function CosmicSpaceBackground() {
  const { scene } = useThree();

  // Set deep space background color inside the canvas
  useMemo(() => {
    scene.background = new THREE.Color("#020510");
  }, [scene]);

  return (
    <>
      {/* ── STAR FIELD ──────────────────────────────────────── */}
      <StarField />

      {/* ── NEBULAE — multiple overlapping clouds ────────────── */}
      {/* Main blue-purple nebula — top-left of globe */}
      <NebulaMesh
        position={[-18, 12, -55]}
        color1="#0d1a4a" color2="#1a0e3a" color3="#050a28"
        opacity={0.92} scale={62}
        rotation={[0.1, 0.2, 0.4]}
      />
      {/* Teal-cyan nebula — right side */}
      <NebulaMesh
        position={[22, -8, -50]}
        color1="#041a1a" color2="#062820" color3="#032210"
        opacity={0.78} scale={55}
        rotation={[-0.2, 0.1, -0.3]}
      />
      {/* Deep crimson nebula — bottom */}
      <NebulaMesh
        position={[4, -22, -60]}
        color1="#1a0505" color2="#250a12" color3="#0e0320"
        opacity={0.72} scale={58}
        rotation={[0.3, -0.1, 0.5]}
      />
      {/* Gold accent nebula — behind globe */}
      <NebulaMesh
        position={[0, 2, -48]}
        color1="#1a1200" color2="#0a0a00" color3="#120a00"
        opacity={0.65} scale={44}
        rotation={[0, 0, 0.2]}
      />
      {/* Wide diffuse purple — full-screen wrap */}
      <NebulaMesh
        position={[-5, 5, -70]}
        color1="#08052a" color2="#120828" color3="#040212"
        opacity={0.95} scale={100}
        rotation={[0.05, 0.05, 0]}
      />
      {/* Extra: violet-blue ring nebula mid-right */}
      <NebulaMesh
        position={[30, 0, -58]}
        color1="#0a0535" color2="#180a40" color3="#050218"
        opacity={0.65} scale={50}
        rotation={[0.15, -0.3, 0.6]}
      />
      {/* Extra: deep teal bottom-left */}
      <NebulaMesh
        position={[-28, -18, -52]}
        color1="#01100f" color2="#021a18" color3="#010808"
        opacity={0.6} scale={46}
        rotation={[-0.1, 0.25, -0.4]}
      />

      {/* ── SHOOTING STARS ────────────────────────────────────── */}
      <ShootingStar start={[-45, 30, -35]} end={[20, -10, -20]}  delay={0} />
      <ShootingStar start={[30, 25, -30]}  end={[-15, -20, -25]} delay={3.2} />
      <ShootingStar start={[-20, -15, -40]} end={[40, 10, -30]}  delay={7.1} />
      <ShootingStar start={[10, 35, -35]}  end={[-30, 5, -20]}   delay={12.5} />
      <ShootingStar start={[-35, 8, -30]}  end={[25, -30, -25]}  delay={5.8} />
      <ShootingStar start={[15, -28, -40]} end={[-40, 18, -30]}  delay={9.4} />
      <ShootingStar start={[-10, 40, -45]} end={[35, -15, -35]}  delay={15.7} />
      <ShootingStar start={[40, -10, -38]} end={[-20, 32, -28]}  delay={2.1} />

      {/* ── AMBIENT LIGHT ──────────────────────────────────────── */}
      <ambientLight intensity={0.04} color="#1a1060" />
    </>
  );
}
