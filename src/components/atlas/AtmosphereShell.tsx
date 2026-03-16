import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * V99 Volumetric Atmosphere — multi-layer Fresnel with Rayleigh scattering,
 * golden horizon glow, and animated aurora borealis bands.
 */

const atmosphereVertex = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vWorldPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = `
  uniform float time;
  uniform float terminator;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPos;

  float hash(vec2 p) {
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p.yx + 19.19);
    return fract((p.x + p.y) * p.x);
  }

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
    
    // Rayleigh scattering — blue at top, orange at horizon
    vec3 zenithColor = vec3(0.08, 0.20, 0.65);
    vec3 horizonColor = vec3(0.85, 0.45, 0.12);
    vec3 goldHighlight = vec3(0.95, 0.82, 0.38);
    
    float horizonFactor = pow(fresnel, 1.5);
    vec3 atmoColor = mix(zenithColor, horizonColor, horizonFactor);
    
    // Sun glow on terminator side
    vec3 lightDir = normalize(vec3(cos(terminator * 6.28), 0.0, sin(terminator * 6.28)));
    float sunAngle = dot(normalize(vWorldPos), lightDir);
    float sunGlow = pow(max(sunAngle, 0.0), 8.0);
    atmoColor += goldHighlight * sunGlow * 0.6;
    
    // Aurora borealis at polar regions
    float polar = abs(vWorldPos.y / 6.6);
    float auroraBase = smoothstep(0.7, 0.9, polar);
    float auroraWave = sin(vWorldPos.x * 8.0 + time * 2.0) * 0.5 + 0.5;
    auroraWave *= sin(vWorldPos.z * 6.0 + time * 1.5) * 0.5 + 0.5;
    vec3 auroraGreen = vec3(0.1, 0.9, 0.4);
    vec3 auroraPurple = vec3(0.5, 0.1, 0.8);
    vec3 auroraColor = mix(auroraGreen, auroraPurple, auroraWave);
    atmoColor += auroraColor * auroraBase * 0.3 * fresnel;
    
    // Volumetric scatter pulse
    float scatter = pow(fresnel, 2.0) * (0.8 + 0.2 * sin(time * 1.5));
    
    // Edge glow intensification
    float edgeGlow = pow(fresnel, 5.0);
    atmoColor += goldHighlight * edgeGlow * 0.3;
    
    gl_FragColor = vec4(atmoColor, scatter * 0.5 + edgeGlow * 0.2);
  }
`;

// Inner atmosphere for volumetric depth
const innerAtmoFragment = `
  uniform float time;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 5.0);
    vec3 color = vec3(0.15, 0.35, 0.85) * fresnel;
    gl_FragColor = vec4(color, fresnel * 0.15);
  }
`;

export default function AtmosphereShell({ terminator = 0 }: { terminator?: number }) {
  const outerRef = useRef<THREE.ShaderMaterial>(null);
  const innerRef = useRef<THREE.ShaderMaterial>(null);

  const outerUniforms = useMemo(() => ({
    time: { value: 0 },
    terminator: { value: 0 },
  }), []);

  const innerUniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.uniforms.time.value = t;
      outerRef.current.uniforms.terminator.value = terminator;
    }
    if (innerRef.current) {
      innerRef.current.uniforms.time.value = t;
    }
  });

  return (
    <>
      {/* Outer atmosphere — Rayleigh + aurora */}
      <mesh>
        <sphereGeometry args={[6.8, 48, 48]} />
        <shaderMaterial
          ref={outerRef}
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={outerUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Inner haze */}
      <mesh>
        <sphereGeometry args={[6.3, 32, 32]} />
        <shaderMaterial
          ref={innerRef}
          vertexShader={atmosphereVertex}
          fragmentShader={innerAtmoFragment}
          uniforms={innerUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}
