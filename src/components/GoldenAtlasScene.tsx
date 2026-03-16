import { useRef, useState, useMemo, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useSoundManager } from "@/hooks/useSoundManager";
import ProjectInspector from "./ProjectInspector";
import OscillatingGoldParticles from "./OscillatingGoldParticles";
import RightClickPrompt from "./RightClickPrompt";
import { continentCoastlines } from "@/data/continentCoastlines";

// ═══ Project data — original + Next Path Infra hubs ═══
const geoProjects = [
  { id: 1, name: "Pico do Fogo", lat: 14.95, lon: -24.35, color: "#f5c24a", desc: "Geotérmica em Cabo Verde", status: "α CLEARANCE" },
  { id: 2, name: "Delta Spine NL", lat: 52.37, lon: 4.89, color: "#a0e7e5", desc: "Infraestrutura modular na Holanda", status: "β CLEARANCE" },
  { id: 3, name: "Geocore Power", lat: 41.39, lon: 2.17, color: "#d4a017", desc: "Fusion Core em Barcelona", status: "γ CLEARANCE" },
  { id: 4, name: "Terra Lenta", lat: 38.72, lon: -9.14, color: "#8b6f47", desc: "Projeto de terra lenta em Lisboa", status: "δ CLEARANCE" },
  { id: 5, name: "Fusion Core", lat: 48.85, lon: 2.35, color: "#4a90e2", desc: "Núcleo de fusão em Paris", status: "ε CLEARANCE" },
  { id: 6, name: "Chip Fold", lat: 35.68, lon: 139.77, color: "#c026d3", desc: "Chip Fold em Tóquio", status: "ζ CLEARANCE" },
  { id: 7, name: "Next Path Infra NL", lat: 53.2, lon: 5.5, color: "#a0e7e5", desc: "Plataforma modular Holanda", status: "Ω CLEARANCE" },
  { id: 8, name: "Next Path Infra PT", lat: 39.5, lon: -8.0, color: "#d4a017", desc: "Hub Lisboa", status: "Ω CLEARANCE" },
  { id: 9, name: "Next Path Infra BR", lat: -22.90, lon: -43.17, color: "#22c55e", desc: "Rio de Janeiro Core", status: "Ω CLEARANCE" },
  { id: 10, name: "Next Path Infra US", lat: 40.71, lon: -74.01, color: "#4a90e2", desc: "Nova York Resilience", status: "Ω CLEARANCE" },
  { id: 11, name: "Next Path Infra AE", lat: 25.20, lon: 55.27, color: "#c026d3", desc: "Dubai Floating Hub", status: "Ω CLEARANCE" },
  { id: 12, name: "Next Path Infra JP", lat: 34.5, lon: 136.0, color: "#ec4899", desc: "Tokyo Sky Infra", status: "Ω CLEARANCE" },
];

export type GeoProject = (typeof geoProjects)[0];

function latLonToPos(lat: number, lon: number, radius = 6): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

// ═══ Liquid Gold Ocean shader — enhanced 8K procedural ═══
const liquidGoldVertex = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float time;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    // Stronger vertex displacement — liquid surface deformation
    vec3 p = position + normal * (
      sin(position.x * 12.0 + time * 2.0) * 0.018 +
      cos(position.z * 10.0 + time * 1.5) * 0.012 +
      sin(position.y * 8.0 + time * 3.0) * 0.009
    );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const liquidGoldFragment = `
  uniform float time;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vec3 brightGold = vec3(0.98, 0.82, 0.38);
    vec3 deepGold = vec3(0.35, 0.22, 0.04);
    vec3 warmHighlight = vec3(1.0, 0.92, 0.55);

    float n1 = noise3D(vPosition * 4.0 + time * 0.8) * 0.5;
    float n2 = noise3D(vPosition * 8.0 + time * 1.2) * 0.25;
    float n3 = noise3D(vPosition * 16.0 + time * 2.0) * 0.125;
    float noiseFBM = n1 + n2 + n3;

    float ripple = sin(vPosition.x * 12.0 + time * 3.0) * sin(vPosition.z * 10.0 + time * 2.2) * 0.04;
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.5);
    float glow = pow(1.0 - length(vUv - 0.5) * 1.6, 4.0);

    vec3 base = mix(deepGold, brightGold, 0.4 + noiseFBM + ripple);
    vec3 color = base + warmHighlight * fresnel * 0.8 + brightGold * glow * 0.3;

    float cracks = sin(vPosition.x * 25.0) * sin(vPosition.y * 18.0) * 0.5 + 0.5;
    color = mix(color, warmHighlight, cracks * 0.08);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ═══ Beam shader for NPI hubs ═══
const beamVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragment = `
  uniform float time;
  uniform vec3 beamColor;
  varying vec2 vUv;
  void main() {
    float core = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 4.0);
    float fade = pow(1.0 - vUv.y, 1.5);
    float pulse = 0.7 + 0.3 * sin(time * 3.0 + vUv.y * 12.0);
    float scanline = 0.85 + 0.15 * sin(vUv.y * 60.0 - time * 8.0);
    float alpha = core * fade * pulse * scanline;
    gl_FragColor = vec4(beamColor, alpha * 0.65);
  }
`;

// ═══ Scroll-driven camera ═══
function ScrollCamera({ scrollProgress }: { scrollProgress: number }) {
  useFrame((state) => {
    const targetZ = THREE.MathUtils.lerp(16, -55, scrollProgress);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
  });
  return null;
}

// ═══ Globe with Liquid Gold shader ═══
function GlobeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    if (matRef.current) matRef.current.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[6, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={liquidGoldVertex}
        fragmentShader={liquidGoldFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ═══ Procedural continents from coastline data ═══
function GlobeContinents() {
  const continentLines = useMemo(() => {
    return continentCoastlines.map((continent) => {
      const points = continent.points.map(([lat, lon]) => latLonToPos(lat, lon, 6.08));
      return { name: continent.name, points };
    });
  }, []);

  return (
    <>
      {continentLines.map((c) => (
        <Line key={c.name} points={c.points} color="#D4AF37" transparent opacity={0.45} lineWidth={1.2} />
      ))}
      {continentLines.map((c) => {
        const innerPoints = c.points.map(([x, y, z]) => [x * 0.998, y * 0.998, z * 0.998] as [number, number, number]);
        return <Line key={`${c.name}-inner`} points={innerPoints} color="#D4AF37" transparent opacity={0.2} lineWidth={0.6} />;
      })}
    </>
  );
}

// ═══ Grid lines on globe ═══
function GlobeGrid() {
  const lineData = useMemo(() => {
    const result: { key: string; points: [number, number, number][] }[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: [number, number, number][] = [];
      for (let lon = 0; lon <= 360; lon += 5) points.push(latLonToPos(lat, lon - 180, 6.05));
      result.push({ key: `lat-${lat}`, points });
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const points: [number, number, number][] = [];
      for (let lat = -90; lat <= 90; lat += 5) points.push(latLonToPos(lat, lon, 6.05));
      result.push({ key: `lon-${lon}`, points });
    }
    return result;
  }, []);

  return (
    <>
      {lineData.map((l) => (
        <Line key={l.key} points={l.points} color="#D4AF37" transparent opacity={0.1} lineWidth={0.5} />
      ))}
    </>
  );
}

// ═══ NPI Light Beam ═══
function NPIBeam({ position, color, id }: { position: [number, number, number]; color: string; id: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const beamColor = useMemo(() => new THREE.Color(color), [color]);
  const uniforms = useMemo(() => ({ time: { value: 0 }, beamColor: { value: beamColor } }), [beamColor]);

  const direction = useMemo(() => new THREE.Vector3(...position).normalize(), [position]);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    return q;
  }, [direction]);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.time.value = state.clock.elapsedTime + id * 0.5;
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh position={[0, 1.8, 0]}>
        <planeGeometry args={[0.12, 3.6]} />
        <shaderMaterial ref={matRef} vertexShader={beamVertex} fragmentShader={beamFragment} uniforms={uniforms} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.12, 3.6]} />
        <shaderMaterial vertexShader={beamVertex} fragmentShader={beamFragment} uniforms={uniforms} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.15, 0.35, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ═══ Project hotspot island ═══
function ProjectIsland({ project, onSelect }: { project: GeoProject; onSelect: (p: GeoProject) => void }) {
  const isNPI = project.status === "Ω CLEARANCE";
  const pos = useMemo(() => latLonToPos(project.lat, project.lon, 6.4), [project.lat, project.lon]);
  const sound = useSoundManager();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isNPI ? 0.14 : 0.08;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + project.id) * pulse);
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); sound.playNavigate(); onSelect(project); }}
        onPointerOver={() => { sound.playHover(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "auto"; }}
      >
        <boxGeometry args={[isNPI ? 0.45 : 0.35, isNPI ? 0.22 : 0.18, isNPI ? 0.45 : 0.35]} />
        <meshStandardMaterial color={project.color} metalness={0.92} roughness={0.12} emissive={project.color} emissiveIntensity={isNPI ? 0.7 : 0.4} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[isNPI ? 0.1 : 0.06, 12, 12]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.9} />
      </mesh>
      {isNPI && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.018, 12, 48]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// ═══ Cursor follower avatar ═══
function CursorAvatar() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const targetX = (state.pointer.x * viewport.width) / 2;
    const targetY = (state.pointer.y * viewport.height) / 2;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX * 0.6, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY * 0.6, 0.04);
    groupRef.current.position.z = 8;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color="#f5c24a" metalness={0.95} roughness={0.08} emissive="#ffdd77" emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.015, 12, 48]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ═══ Scene composition ═══
function AtlasSceneContent({
  onSelectProject,
  customProjects,
  scrollProgress,
}: {
  onSelectProject: (p: GeoProject) => void;
  customProjects: GeoProject[];
  scrollProgress: number;
}) {
  const npiBeams = useMemo(() => {
    return geoProjects
      .filter((p) => p.status === "Ω CLEARANCE")
      .map((p) => ({ id: p.id, position: latLonToPos(p.lat, p.lon, 6.4), color: p.color }));
  }, []);

  const allProjects = useMemo(() => [...geoProjects, ...customProjects], [customProjects]);

  return (
    <>
      <ambientLight intensity={0.35} color="#ffd700" />
      <pointLight position={[15, 20, 10]} intensity={2.0} color="#ffdd88" />
      <pointLight position={[-10, -15, 8]} intensity={0.6} color="#D4AF37" />
      <pointLight position={[0, 0, 20]} intensity={0.3} color="#fff8e1" />

      <ScrollCamera scrollProgress={scrollProgress} />
      <GlobeSphere />
      <GlobeContinents />
      <GlobeGrid />
      <OscillatingGoldParticles />

      {npiBeams.map((beam) => (
        <NPIBeam key={beam.id} position={beam.position} color={beam.color} id={beam.id} />
      ))}

      {allProjects.map((proj) => (
        <ProjectIsland key={proj.id} project={proj} onSelect={onSelectProject} />
      ))}

      <CursorAvatar />
    </>
  );
}

// ═══ Main exported component ═══
export default function GoldenAtlasScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const [selectedProject, setSelectedProject] = useState<GeoProject | null>(null);
  const [customProjects, setCustomProjects] = useState<GeoProject[]>([]);
  const [rightClick, setRightClick] = useState<{ x: number; y: number } | null>(null);
  const sound = useSoundManager();

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    sound.playParticle(680);
    setRightClick({ x: e.clientX, y: e.clientY });
  }, [sound]);

  const handleAddProject = useCallback((name: string) => {
    const newProject: GeoProject = {
      id: Date.now(),
      name,
      lat: Math.random() * 120 - 60,
      lon: Math.random() * 360 - 180,
      color: "#ffd700",
      desc: `Projeto criado: ${name}`,
      status: "Ω CLEARANCE",
    };
    setCustomProjects((prev) => [...prev, newProject]);
    setRightClick(null);
    sound.playNavigate();
  }, [sound]);

  return (
    <>
      <div className="absolute inset-0" style={{ zIndex: 0 }} onContextMenu={handleContextMenu}>
        <Canvas
          camera={{ position: [0, 2, 16], fov: 42 }}
          dpr={[2, 3]}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.3,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <AtlasSceneContent
              onSelectProject={setSelectedProject}
              customProjects={customProjects}
              scrollProgress={scrollProgress}
            />
          </Suspense>
        </Canvas>
      </div>

      {rightClick && (
        <RightClickPrompt
          x={rightClick.x}
          y={rightClick.y}
          onSubmit={handleAddProject}
          onCancel={() => setRightClick(null)}
        />
      )}

      {selectedProject && (
        <ProjectInspector
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
