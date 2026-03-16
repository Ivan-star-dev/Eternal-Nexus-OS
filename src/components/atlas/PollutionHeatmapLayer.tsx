import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PollutionPoint } from "@/lib/dataSources";

function latLonToPos(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function PollutionDot({ position, intensity, color, label }: {
  position: [number, number, number];
  intensity: number;
  color: THREE.Color;
  label: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && (state.clock.elapsedTime * 60) % 5 < 1) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      ref.current.scale.setScalar(pulse);
    }
  });

  const size = intensity * 0.25 + 0.06;

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[size * 2.5, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Core dot */}
      <mesh ref={ref}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface PollutionHeatmapLayerProps {
  pollutionData?: PollutionPoint[];
}

export default function PollutionHeatmapLayer({ pollutionData }: PollutionHeatmapLayerProps) {
  const dots = useMemo(() => {
    if (!pollutionData?.length) return [];

    const maxAqi = Math.max(...pollutionData.map((p) => p.aqi), 1);

    return pollutionData.map((p) => {
      const norm = p.aqi / maxAqi;
      // Purple for critical, orange for high, yellow for moderate, cyan for low
      let hue = 0.5; // cyan
      if (norm > 0.8) hue = 0.83; // purple
      else if (norm > 0.5) hue = 0.08; // orange
      else if (norm > 0.3) hue = 0.15; // yellow

      const color = new THREE.Color().setHSL(hue, 0.9, 0.55);
      return {
        key: p.city,
        position: latLonToPos(p.lat, p.lon, 6.55) as [number, number, number],
        intensity: norm,
        color,
        label: `${p.city}: AQI ${p.aqi}`,
      };
    });
  }, [pollutionData]);

  if (!dots.length) return null;

  return (
    <group>
      {dots.map((d) => (
        <PollutionDot key={d.key} position={d.position} intensity={d.intensity} color={d.color} label={d.label} />
      ))}
    </group>
  );
}
