import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Eternal Nexus 2.0 — Connection Arcs with bidirectional data flow,
 * bandwidth visualization, and integrity verification pulses.
 */

function latLonToPos(lat: number, lon: number, r = 6.3): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

interface Hub {
  lat: number;
  lon: number;
  color: string;
  name: string;
  bandwidth: number; // Gbps simulated
}

const NPI_HUBS: Hub[] = [
  { lat: 53.2, lon: 5.5, color: "#a0e7e5", name: "NL", bandwidth: 400 },
  { lat: 39.5, lon: -8.0, color: "#d4a017", name: "PT", bandwidth: 200 },
  { lat: -22.9, lon: -43.17, color: "#22c55e", name: "BR", bandwidth: 320 },
  { lat: 40.71, lon: -74.01, color: "#4a90e2", name: "US", bandwidth: 800 },
  { lat: 25.2, lon: 55.27, color: "#c026d3", name: "AE", bandwidth: 280 },
  { lat: 34.5, lon: 136.0, color: "#ec4899", name: "JP", bandwidth: 600 },
];

function quadBezier(a: THREE.Vector3, b: THREE.Vector3, segments = 64): THREE.Vector3[] {
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  const elevation = a.distanceTo(b) * 0.45;
  mid.normalize().multiplyScalar(mid.length() + elevation);

  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mid.x + t * t * b.x;
    const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * mid.y + t * t * b.y;
    const z = (1 - t) * (1 - t) * a.z + 2 * (1 - t) * t * mid.z + t * t * b.z;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

const PARTICLES_PER_ARC = 12;

/** Animated arc with bidirectional data flow + integrity pulses */
function AnimatedArc({ points, color, index, bandwidth }: { points: THREE.Vector3[]; color: string; index: number; bandwidth: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const lineObj = useRef<THREE.Line | null>(null);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.12 + (bandwidth / 800) * 0.08,
    blending: THREE.AdditiveBlending,
  }), [color, bandwidth]);

  // Create line object once
  const line = useMemo(() => {
    const l = new THREE.Line(geometry, lineMat);
    lineObj.current = l;
    return l;
  }, [geometry, lineMat]);

  const particleGeo = useMemo(() => {
    const positions = new Float32Array(PARTICLES_PER_ARC * 3);
    const sizes = new Float32Array(PARTICLES_PER_ARC);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  const particleMat = useMemo(() => new THREE.PointsMaterial({
    color: new THREE.Color(color),
    size: 0.07,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  }), [color]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    // Throttle: skip ~30% of frames for performance
    if (Math.random() > 0.7 && index > 5) return;

    const t = state.clock.elapsedTime;
    const positions = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;

    const half = PARTICLES_PER_ARC / 2;
    for (let i = 0; i < PARTICLES_PER_ARC; i++) {
      // Bidirectional: first half goes forward, second half goes backward
      const direction = i < half ? 1 : -1;
      const speed = 0.25 + (bandwidth / 800) * 0.15;
      const baseProgress = (t * speed * direction + i / PARTICLES_PER_ARC + index * 0.07);
      const progress = ((baseProgress % 1) + 1) % 1;
      const idx = Math.floor(progress * (points.length - 1));
      const pt = points[Math.min(idx, points.length - 1)];

      // Integrity verification pulse: every 3rd particle pulses larger
      const isPulse = i % 3 === 0;
      const pulseScale = isPulse ? 1.0 + Math.sin(t * 4 + i) * 0.5 : 1.0;
      
      positions.setXYZ(i, pt.x * pulseScale * (isPulse ? 1.001 : 1), pt.y, pt.z);
    }
    positions.needsUpdate = true;
  });

  return (
    <group>
      <primitive object={line} />
      <points ref={particlesRef} geometry={particleGeo} material={particleMat} />
    </group>
  );
}

export default function ConnectionArcs() {
  const arcs = useMemo(() => {
    const result: { key: string; points: THREE.Vector3[]; color: string; bandwidth: number }[] = [];
    for (let i = 0; i < NPI_HUBS.length; i++) {
      for (let j = i + 1; j < NPI_HUBS.length; j++) {
        const a = new THREE.Vector3(...latLonToPos(NPI_HUBS[i].lat, NPI_HUBS[i].lon));
        const b = new THREE.Vector3(...latLonToPos(NPI_HUBS[j].lat, NPI_HUBS[j].lon));
        const color = NPI_HUBS[i].color;
        const bandwidth = (NPI_HUBS[i].bandwidth + NPI_HUBS[j].bandwidth) / 2;
        result.push({ key: `${i}-${j}`, points: quadBezier(a, b), color, bandwidth });
      }
    }
    return result;
  }, []);

  return (
    <>
      {arcs.map((arc, idx) => (
        <AnimatedArc key={arc.key} points={arc.points} color={arc.color} index={idx} bandwidth={arc.bandwidth} />
      ))}
    </>
  );
}
