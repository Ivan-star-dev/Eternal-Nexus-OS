import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * DataHeatmapLayer — renders translucent glowing spheres on the globe
 * at country coordinates, sized/colored by CO2 emissions data.
 */

// Country centroids (lat, lon) for World Bank country codes
const COUNTRY_COORDS: Record<string, [number, number]> = {
  USA: [39.8, -98.5],
  CHN: [35.9, 104.2],
  IND: [20.6, 78.9],
  BRA: [-14.2, -51.9],
  DEU: [51.2, 10.4],
  NLD: [52.1, 5.3],
  PRT: [39.4, -8.2],
  JPN: [36.2, 138.3],
  WLD: [0, 0], // skip world aggregate
};

function latLonToPos(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

interface CO2Record {
  countryCode: string;
  co2PerCapita: number;
  year: number;
  country: string;
}

interface DataHeatmapLayerProps {
  co2Records?: CO2Record[];
}

function HeatDot({ position, intensity, color }: {
  position: [number, number, number];
  intensity: number;
  color: THREE.Color;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && (state.clock.elapsedTime * 60) % 4 < 1) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      ref.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[intensity * 0.3 + 0.08, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function DataHeatmapLayer({ co2Records }: DataHeatmapLayerProps) {
  const dots = useMemo(() => {
    if (!co2Records?.length) return [];

    // Get latest year per country
    const latest: Record<string, CO2Record> = {};
    for (const r of co2Records) {
      if (r.countryCode === "WLD") continue;
      if (!latest[r.countryCode] || r.year > latest[r.countryCode].year) {
        latest[r.countryCode] = r;
      }
    }

    const entries = Object.values(latest);
    const maxCo2 = Math.max(...entries.map((e) => e.co2PerCapita), 1);

    return entries
      .filter((e) => COUNTRY_COORDS[e.countryCode])
      .map((e) => {
        const [lat, lon] = COUNTRY_COORDS[e.countryCode];
        const norm = e.co2PerCapita / maxCo2;
        // Red for high, green for low
        const color = new THREE.Color().setHSL(0.33 - norm * 0.33, 0.9, 0.5);
        return {
          key: e.countryCode,
          position: latLonToPos(lat, lon, 6.5) as [number, number, number],
          intensity: norm,
          color,
        };
      });
  }, [co2Records]);

  if (!dots.length) return null;

  return (
    <group>
      {dots.map((d) => (
        <HeatDot key={d.key} position={d.position} intensity={d.intensity} color={d.color} />
      ))}
    </group>
  );
}
