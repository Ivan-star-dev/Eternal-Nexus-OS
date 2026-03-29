/**
 * EarthquakeLayer.tsx — Seismic Activity Layer
 *
 * Real-time seismic pulse rings on the globe surface.
 * Driven by static seed data; wires to live API when gateway is ready.
 *
 * Visual law: subtle pulsing rings at seismic coordinates.
 * Color: teal hsl(172 55% 45%) — distinct from gold project hotspots.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GLOBE_RADIUS = 4.5;

interface SeismicEvent {
  lat: number;
  lng: number;
  magnitude: number; // 1–9
}

// Seed dataset — real major seismic zones
const SEISMIC_SEEDS: SeismicEvent[] = [
  { lat: 35.6762, lng: 139.6503, magnitude: 6.2 },  // Tokyo
  { lat: 37.7749, lng: -122.4194, magnitude: 5.8 }, // San Francisco
  { lat: -33.8688, lng: 151.2093, magnitude: 4.9 }, // Sydney
  { lat: -9.1900, lng: -75.0152, magnitude: 6.5 },  // Peru
  { lat: 38.9637, lng: 35.2433, magnitude: 5.2 },   // Turkey
  { lat: 13.1589, lng: 144.8688, magnitude: 7.1 },  // Guam
  { lat: -2.8858, lng: -79.0045, magnitude: 5.6 },  // Ecuador
  { lat: 41.9028, lng: 12.4964, magnitude: 4.2 },   // Italy
];

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

interface PulseRingProps {
  event: SeismicEvent;
  index: number;
}

function PulseRing({ event, index }: PulseRingProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(
    () => latLngToVec3(event.lat, event.lng, GLOBE_RADIUS * 1.01),
    [event.lat, event.lng]
  );

  // Orient ring to face outward from globe centre
  const quaternion = useMemo(() => {
    const normal = pos.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [pos]);

  // Phase offset so rings pulse at different times
  const phaseOffset = index * 0.8;
  const scale = 0.04 + (event.magnitude / 9) * 0.1;

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = (clock.getElapsedTime() + phaseOffset) % 3.0;
    const progress = t / 3.0;
    const s = scale * (1 + progress * 3.5);
    ringRef.current.scale.setScalar(s);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.5 * (1 - progress) * Math.max(0, 1 - progress * 1.5);
  });

  return (
    <mesh
      ref={ringRef}
      position={pos}
      quaternion={quaternion}
    >
      <ringGeometry args={[0.9, 1.0, 32]} />
      <meshBasicMaterial
        color="#2dd4bf"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function EarthquakeLayer() {
  return (
    <group>
      {SEISMIC_SEEDS.map((event, i) => (
        <PulseRing key={i} event={event} index={i} />
      ))}
    </group>
  );
}
