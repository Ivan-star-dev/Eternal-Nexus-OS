import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * V99 Cloud Layer — dual-layer clouds (high cirrus + low cumulus),
 * shadow casting, and timeline-driven speed + density.
 */

const cloudVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragment = `
  uniform float time;
  uniform float timelinePos;
  uniform float density;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
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
      p = p * 2.1 + vec2(0.1, 0.15);
      a *= 0.48;
    }
    return v;
  }

  void main() {
    float speed = 0.015 + timelinePos * 0.06;
    
    // High altitude cirrus
    vec2 uv1 = vUv * 12.0 + vec2(time * speed, time * speed * 0.4);
    float cirrus = fbm(uv1);
    cirrus = smoothstep(0.45, 0.75, cirrus);
    
    // Low cumulus — slower, denser
    vec2 uv2 = vUv * 8.0 + vec2(time * speed * 0.6, time * speed * 0.2);
    float cumulus = fbm(uv2 + 50.0);
    cumulus = smoothstep(0.35, 0.65, cumulus);
    
    // Storm cells (localized dense patches)
    float storm = fbm(vUv * 4.0 + time * 0.005);
    storm = smoothstep(0.6, 0.8, storm) * 0.4;
    
    float combined = max(cirrus * 0.5, cumulus * 0.8) + storm;
    combined *= density;
    
    // Edge fading
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    float edge = pow(1.0 - abs(dot(viewDir, vNormal)), 2.5);
    combined *= (1.0 - edge * 0.6);
    
    // Cloud color — slightly blue-white
    vec3 cloudColor = mix(vec3(0.95, 0.97, 1.0), vec3(0.7, 0.75, 0.85), storm);
    
    // Shadow on underside
    float shadow = smoothstep(0.0, 0.5, vWorldPos.y / 6.2 + 0.5);
    cloudColor *= 0.7 + shadow * 0.3;
    
    gl_FragColor = vec4(cloudColor, combined * 0.3);
  }
`;

interface CloudLayerProps {
  timelinePosition?: number;
  density?: number;
}

export default function CloudLayer({ timelinePosition = 0, density = 1.0 }: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    timelinePos: { value: 0 },
    density: { value: 1.0 },
  }), []);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = state.clock.elapsedTime;
      matRef.current.uniforms.timelinePos.value = timelinePosition;
      matRef.current.uniforms.density.value = density;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.006;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[6.18, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={cloudVertex}
        fragmentShader={cloudFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
