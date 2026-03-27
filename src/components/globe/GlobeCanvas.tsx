/**
 * GlobeCanvas.tsx — GLOBE-3D-001
 * Real 3D Earth: solid sphere + atmosphere glow + deep-space background.
 *
 * Palette: deep space dark (#0a0a1a) + electric blue glow (#00aaff)
 * Target: 60 fps, min 30 fps
 * Technique: procedural land/ocean shader on ShaderMaterial,
 *             two additive atmosphere shells, OrbitControls orbital camera.
 *
 * @antigravity + @cursor | GLOBE-3D-001 | 2026-03-27
 */

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────
const EARTH_RADIUS = 4.5;
const ATM_INNER = EARTH_RADIUS * 1.04;   // thin glow shell
const ATM_OUTER = EARTH_RADIUS * 1.14;  // wide diffuse shell

// ─── Procedural Earth vertex/fragment shaders ─────────────────────────────────
// Simple but vivid: ocean + landmass noise based on position hash,
// with specular-like sheen on the lit side.
const EARTH_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform vec3  uSunDir;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vPosition;

  // Fast pseudo-random
  float hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  // Smooth noise
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // smoothstep
    return mix(
      mix(mix(hash(i),               hash(i+vec3(1,0,0)), f.x),
          mix(hash(i+vec3(0,1,0)),   hash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i+vec3(0,0,1)),   hash(i+vec3(1,0,1)), f.x),
          mix(hash(i+vec3(0,1,1)),   hash(i+vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  // Fractal noise — gives continent-like shapes
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p  = p * 2.03 + vec3(1.7, 9.2, 1.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 n = normalize(vNormal);

    // ── Diffuse lighting ─────────────────────────────────────────────
    float diff  = max(dot(n, normalize(uSunDir)), 0.0);
    float amb   = 0.18;                         // night-side glow
    float light = amb + (1.0 - amb) * diff;

    // ── Land / ocean from fbm ────────────────────────────────────────
    // Normalise position to unit sphere for stable sampling
    vec3 sp = normalize(vPosition) * 2.2;
    float land = fbm(sp);

    // threshold: ~40% land, ~60% ocean
    float isLand = smoothstep(0.495, 0.52, land);

    // ── Ocean colour ─────────────────────────────────────────────────
    // Deep midnight navy → electric blue highlights
    vec3 oceanDeep    = vec3(0.02, 0.055, 0.18);
    vec3 oceanShallow = vec3(0.04, 0.22, 0.54);
    float oceanDepth  = fbm(sp * 1.6 + 3.1);
    vec3  ocean       = mix(oceanDeep, oceanShallow, oceanDepth * 0.6);

    // Electric-blue specular sheen on lit ocean
    float spec = pow(max(dot(reflect(-normalize(uSunDir), n), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);
    ocean += vec3(0.0, 0.45, 1.0) * spec * diff * 0.4;

    // ── Land colour ──────────────────────────────────────────────────
    // Dark forest green + highland tones
    vec3 landLow  = vec3(0.06, 0.18, 0.08);
    vec3 landHigh = vec3(0.14, 0.26, 0.14);
    float landVar = fbm(sp * 2.8 + 5.7);
    vec3 landCol  = mix(landLow, landHigh, landVar);

    // Polar ice — fade to white near poles
    float lat       = abs(normalize(vPosition).y); // 0 equator → 1 pole
    float iceBlend  = smoothstep(0.7, 0.92, lat);
    vec3  iceColor  = vec3(0.75, 0.85, 0.95);

    // ── Composite ────────────────────────────────────────────────────
    vec3 surface = mix(ocean, landCol, isLand);
    surface      = mix(surface, iceColor, iceBlend);

    // Apply lighting
    surface *= light;

    // Subtle electric-blue tint on terminator (lit/dark boundary)
    float terminator = smoothstep(0.0, 0.25, diff) * (1.0 - smoothstep(0.25, 0.7, diff));
    surface += vec3(0.0, 0.12, 0.35) * terminator * 0.45;

    gl_FragColor = vec4(surface, 1.0);
  }
`;

// ─── Atmosphere shader — two shells, additive blending ────────────────────────
const ATM_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vec4 mvp = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvp.xyz);
    gl_Position = projectionMatrix * mvp;
  }
`;

const ATM_FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform vec3  uColor;
  uniform vec3  uSunDir;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Fresnel: bright at grazing angles (limb glow)
    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    fresnel = pow(fresnel, 3.2);

    // Dim the night side
    float sun = max(dot(vNormal, normalize(uSunDir)), 0.0);
    float intensity = fresnel * (0.18 + 0.82 * sun);

    gl_FragColor = vec4(uColor * intensity, intensity * uOpacity);
  }
`;

// ─── Earth sphere ─────────────────────────────────────────────────────────────
function EarthSphere() {
  const meshRef  = useRef<THREE.Mesh>(null);
  const sunDir   = useMemo(() => new THREE.Vector3(1.4, 0.5, 1.2).normalize(), []);

  const uniforms = useMemo(
    () => ({
      uSunDir: { value: sunDir },
      uTime:   { value: 0 },
    }),
    [sunDir]
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smooth auto-rotation ~12 s/rev at 60 fps
      meshRef.current.rotation.y += delta * 0.08;
    }
    uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[EARTH_RADIUS, 128, 64]} />
      <shaderMaterial
        vertexShader={EARTH_VERT}
        fragmentShader={EARTH_FRAG}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ─── Atmosphere shell ─────────────────────────────────────────────────────────
function AtmosphereShell({
  radius,
  color,
  opacity,
}: {
  radius: number;
  color: string;
  opacity: number;
}) {
  const sunDir = useMemo(() => new THREE.Vector3(1.4, 0.5, 1.2).normalize(), []);
  const uniforms = useMemo(
    () => ({
      uOpacity: { value: opacity },
      uColor:   { value: new THREE.Color(color) },
      uSunDir:  { value: sunDir },
    }),
    [opacity, color, sunDir]
  );

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 32]} />
      <shaderMaterial
        vertexShader={ATM_VERT}
        fragmentShader={ATM_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

// ─── Starfield ────────────────────────────────────────────────────────────────
function Starfield({ count = 1400 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Uniform sphere distribution, far away
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 90 + Math.random() * 30;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c8e0ff"
        size={0.12}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene root ───────────────────────────────────────────────────────────────
function GlobeScene3D() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.12} color="#0a1840" />
      <pointLight
        position={[14, 5, 12]}
        intensity={2.2}
        color="#ffffff"
        distance={80}
        decay={2}
      />
      {/* Blue rim light — electric glow from the dark side */}
      <pointLight
        position={[-10, -3, -8]}
        intensity={0.7}
        color="#00aaff"
        distance={40}
        decay={2}
      />

      <Starfield />
      <EarthSphere />

      {/* Inner atmosphere — bright blue limb */}
      <AtmosphereShell radius={ATM_INNER} color="#00aaff" opacity={1.6} />
      {/* Outer haze — soft deep blue */}
      <AtmosphereShell radius={ATM_OUTER} color="#0044cc" opacity={0.55} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={7}
        maxDistance={22}
        autoRotate={false}       // Earth sphere self-rotates in shader loop
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.45}
      />
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
interface GlobeCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

const GlobeCanvas = ({ className, style }: GlobeCanvasProps) => {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 14], fov: 42, near: 0.5, far: 200 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{
        background: "#0a0a1a",
        width: "100%",
        height: "100%",
        ...style,
      }}
      className={className}
    >
      <GlobeScene3D />
    </Canvas>
  );
};

export default GlobeCanvas;
