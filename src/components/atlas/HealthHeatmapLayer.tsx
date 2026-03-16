import { useMemo } from "react";
import * as THREE from "three";
import { HEALTH_INDICATORS, PANDEMIC_HISTORY, type HealthIndicator } from "@/lib/healthData";

/**
 * Health heatmap on globe — dots colored by pandemic readiness (GHS index).
 * Red = low readiness, green = high readiness.
 * Pandemic origin points shown as pulsing markers.
 */

function latLonToPos(lat: number, lon: number, radius = 6.25): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function readinessToColor(ghs: number): string {
  if (ghs >= 65) return "#22cc66";
  if (ghs >= 45) return "#88cc22";
  if (ghs >= 30) return "#ffcc22";
  if (ghs >= 20) return "#ff8844";
  return "#ff2222";
}

export default function HealthHeatmapLayer() {
  const healthDots = useMemo(() =>
    HEALTH_INDICATORS.map((h) => ({
      ...h,
      pos: latLonToPos(h.lat, h.lon),
      color: readinessToColor(h.pandemicReadiness),
      scale: 0.06 + (1 - h.pandemicReadiness / 100) * 0.1,
    })),
    []
  );

  const pandemicOrigins = useMemo(() =>
    PANDEMIC_HISTORY.map((p) => ({
      ...p,
      pos: latLonToPos(p.lat, p.lon, 6.3),
      scale: Math.min(0.3, 0.08 + (p.deaths / 7000000) * 0.25),
    })),
    []
  );

  return (
    <>
      {/* Health readiness dots */}
      {healthDots.map((d) => (
        <mesh key={d.country} position={d.pos}>
          <sphereGeometry args={[d.scale, 8, 8]} />
          <meshBasicMaterial
            color={d.color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Pandemic origin markers — biohazard rings */}
      {pandemicOrigins.map((p) => (
        <group key={p.name} position={p.pos}>
          <mesh>
            <sphereGeometry args={[p.scale * 0.3, 8, 8]} />
            <meshBasicMaterial color="#ff0066" transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[p.scale * 0.5, p.scale, 20]} />
            <meshBasicMaterial
              color="#ff0066"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
