import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildTileUrl, type TileLayer } from "@/lib/atlas/tile-provider";

/**
 * Eternal Nexus 2.0 — Earth shader with ocean caustics, improved biomes,
 * atmospheric scattering, and volumetric coastline glow.
 */

const earthVertex = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  uniform float time;

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
      mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
          mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
          mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    
    float elevation = noise3D(position * 2.5) * 0.5 
                    + noise3D(position * 5.0) * 0.25 
                    + noise3D(position * 10.0) * 0.125;
    float landMask = smoothstep(0.42, 0.52, elevation);
    vec3 displaced = position + normal * landMask * 0.08;
    
    // Ocean wave displacement
    float wave1 = sin(position.x * 25.0 + time * 2.5) * cos(position.z * 18.0 + time * 1.8);
    float wave2 = sin(position.y * 30.0 - time * 3.0) * 0.5;
    displaced += normal * (wave1 + wave2) * 0.002 * (1.0 - landMask);
    
    vPosition = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const earthFragment = `
  uniform float time;
  uniform float terminator;
  uniform sampler2D satelliteTex;
  uniform float useSatellite;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

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
      mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
          mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
          mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
  }

  float fbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * noise3D(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  // Ocean caustics
  float caustic(vec2 p, float t) {
    float c = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      vec2 q = p * (2.0 + fi * 0.8);
      q += vec2(sin(t * 0.4 + fi * 1.3), cos(t * 0.5 + fi * 0.7));
      c += sin(q.x * 3.0 + sin(q.y * 4.0 + t * 0.3)) * 0.15;
      c += cos(q.y * 2.5 + cos(q.x * 3.5 - t * 0.2)) * 0.1;
    }
    return max(c, 0.0);
  }

  void main() {
    float elev = fbm(vPosition * 2.5);
    float landMask = smoothstep(0.42, 0.48, elev);
    
    // ═══ OCEAN ═══
    vec3 deepOcean = vec3(0.01, 0.04, 0.16);
    vec3 midOcean = vec3(0.03, 0.12, 0.30);
    vec3 shallowOcean = vec3(0.06, 0.22, 0.40);
    vec3 tropicalOcean = vec3(0.05, 0.30, 0.42);
    
    float depth = smoothstep(0.25, 0.42, elev);
    vec3 oceanColor = mix(deepOcean, midOcean, depth);
    oceanColor = mix(oceanColor, shallowOcean, smoothstep(0.38, 0.42, elev));
    
    // Tropical waters near equator
    float tropical = 1.0 - smoothstep(0.0, 0.35, abs(vPosition.y / 6.0));
    oceanColor = mix(oceanColor, tropicalOcean, tropical * 0.3 * depth);
    
    // Caustics on shallow water
    float causticsVal = caustic(vPosition.xz * 2.0, time) * smoothstep(0.35, 0.42, elev);
    oceanColor += vec3(0.08, 0.15, 0.25) * causticsVal * (1.0 - landMask);
    
    // Specular highlight on ocean
    vec3 lightDir = normalize(vec3(cos(terminator * 6.28), 0.3, sin(terminator * 6.28)));
    float specular = pow(max(dot(reflect(-lightDir, vNormal), normalize(-vPosition)), 0.0), 80.0);
    float specular2 = pow(max(dot(reflect(-lightDir, vNormal), normalize(-vPosition)), 0.0), 20.0);
    oceanColor += vec3(0.5, 0.6, 0.7) * specular * (1.0 - landMask) * 0.8;
    oceanColor += vec3(0.15, 0.2, 0.3) * specular2 * (1.0 - landMask) * 0.3;
    
    // ═══ LAND — biome system ═══
    vec3 rainforest = vec3(0.06, 0.22, 0.04);
    vec3 tempForest = vec3(0.12, 0.28, 0.08);
    vec3 savanna = vec3(0.32, 0.28, 0.12);
    vec3 desert = vec3(0.58, 0.45, 0.28);
    vec3 tundra = vec3(0.35, 0.38, 0.32);
    vec3 highland = vec3(0.38, 0.32, 0.24);
    vec3 snowcap = vec3(0.88, 0.90, 0.94);
    
    float heightNorm = smoothstep(0.48, 0.75, elev);
    float moistureNoise = noise3D(vPosition * 4.0 + 200.0);
    float tempZone = 1.0 - abs(vPosition.y / 6.0); // 0 at poles, 1 at equator
    
    // Biome selection based on temperature zone + moisture
    vec3 landColor;
    if (tempZone > 0.6) {
      // Tropical
      landColor = mix(savanna, rainforest, smoothstep(0.3, 0.6, moistureNoise));
    } else if (tempZone > 0.3) {
      // Temperate
      landColor = mix(desert, tempForest, smoothstep(0.25, 0.55, moistureNoise));
    } else {
      // Polar
      landColor = mix(tundra, snowcap, smoothstep(0.15, 0.5, 1.0 - tempZone));
    }
    
    // Altitude modifiers
    landColor = mix(landColor, highland, smoothstep(0.6, 0.8, heightNorm));
    landColor = mix(landColor, snowcap, smoothstep(0.85, 0.95, heightNorm));
    
    // Polar ice caps
    float polar = abs(vPosition.y / 6.0);
    landColor = mix(landColor, snowcap, smoothstep(0.72, 0.88, polar));
    oceanColor = mix(oceanColor, vec3(0.7, 0.82, 0.92), smoothstep(0.78, 0.92, polar) * 0.7);
    
    // ═══ COMBINE ═══
    vec3 baseColor = mix(oceanColor, landColor, landMask);
    
    // Coastline luminescence
    float coastline = 1.0 - smoothstep(0.0, 0.025, abs(elev - 0.45));
    vec3 coastGlow = vec3(0.15, 0.35, 0.55) * coastline * 0.6;
    baseColor += coastGlow;
    
    // ═══ DAY/NIGHT ═══
    float daylight = dot(vWorldNormal, lightDir);
    float dayFactor = smoothstep(-0.12, 0.12, daylight);
    
    // City lights — denser near known population centers
    float cityNoise = noise3D(vPosition * 40.0) * noise3D(vPosition * 80.0);
    float cityDensity = noise3D(vPosition * 8.0);
    float cityMask = smoothstep(0.55, 0.75, cityNoise) * smoothstep(0.4, 0.6, cityDensity) * landMask;
    vec3 cityLights = vec3(1.0, 0.88, 0.55) * cityMask * 0.9;
    // Some cities blue/white
    cityLights = mix(cityLights, vec3(0.7, 0.85, 1.0) * cityMask * 0.6, noise3D(vPosition * 15.0));
    
    vec3 nightSide = baseColor * 0.025 + cityLights;
    vec3 daySide = baseColor;
    
    // Diffuse + subsurface scatter on land
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float sss = pow(max(dot(vNormal, -lightDir), 0.0), 3.0) * 0.05 * landMask;
    daySide *= 0.35 + diffuse * 0.65;
    daySide += vec3(0.1, 0.08, 0.02) * sss;
    
    vec3 finalColor = mix(nightSide, daySide, dayFactor);
    
    // Twilight zone — golden/purple band
    float twilight = smoothstep(-0.12, 0.0, daylight) * smoothstep(0.12, 0.0, daylight);
    finalColor += vec3(0.4, 0.15, 0.1) * twilight * 0.3;
    
    // Atmospheric rim light
    vec3 viewDir = normalize(-vPosition);
    float rim = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 4.0);
    finalColor += vec3(0.15, 0.3, 0.6) * rim * 0.35;
    finalColor += vec3(0.95, 0.78, 0.32) * rim * 0.08;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface SatelliteGlobeProps {
  timeline?: number;
  tileLayer?: TileLayer;
}

export default function SatelliteGlobe({ timeline = 0, tileLayer = "procedural" }: SatelliteGlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const [satelliteTexture, setSatelliteTexture] = useState<THREE.Texture | null>(null);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    terminator: { value: 0 },
    satelliteTex: { value: new THREE.Texture() },
    useSatellite: { value: 0 },
  }), []);

  useEffect(() => {
    if (tileLayer === "procedural") {
      setSatelliteTexture(null);
      return;
    }
    const url = buildTileUrl(tileLayer, 1, 0, 0);
    if (!url) return;

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(
      url,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setSatelliteTexture(tex);
      },
      undefined,
      () => {
        console.warn("Satellite tile load failed, using procedural");
        setSatelliteTexture(null);
      }
    );
  }, [tileLayer]);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = state.clock.elapsedTime * 0.025;
    if (matRef.current) {
      matRef.current.uniforms.time.value = state.clock.elapsedTime;
      matRef.current.uniforms.terminator.value = timeline / 100;
      if (satelliteTexture) {
        matRef.current.uniforms.satelliteTex.value = satelliteTexture;
        matRef.current.uniforms.useSatellite.value = 1;
      } else {
        matRef.current.uniforms.useSatellite.value = 0;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[6, 96, 96]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={earthVertex}
        fragmentShader={earthFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}
