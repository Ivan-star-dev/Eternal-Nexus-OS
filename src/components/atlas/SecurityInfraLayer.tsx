import { useMemo } from "react";
import * as THREE from "three";
import { SECURITY_DATA, type SecurityIndicator } from "@/lib/securityData";

/**
 * Security & Infrastructure layer on globe.
 * - Red pulsing = conflict zones
 * - Orange = elevated/critical
 * - Yellow = warning
 * - Green = stable
 * Diamond shape for conflict, sphere for others.
 */

function latLonToPos(lat: number, lon: number, radius = 6.22): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function riskToColor(risk: SecurityIndicator["riskLevel"]): string {
  switch (risk) {
    case "CONFLICT": return "#ff0033";
    case "CRITICAL": return "#ff4400";
    case "ELEVATED": return "#ff8800";
    case "WARNING": return "#ffcc00";
    case "STABLE": return "#22cc66";
    default: return "#888888";
  }
}

export default function SecurityInfraLayer() {
  const markers = useMemo(() =>
    SECURITY_DATA.map((s) => ({
      ...s,
      pos: latLonToPos(s.lat, s.lon),
      color: riskToColor(s.riskLevel),
      scale: 0.05 + (s.fsi / 120) * 0.12,
      isConflict: s.conflictIntensity >= 3,
    })),
    []
  );

  return (
    <>
      {markers.map((m) => (
        <group key={m.country} position={m.pos}>
          {/* Main marker */}
          {m.isConflict ? (
            // Diamond shape for conflict zones
            <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
              <boxGeometry args={[m.scale, m.scale, m.scale]} />
              <meshBasicMaterial
                color={m.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ) : (
            <mesh>
              <sphereGeometry args={[m.scale * 0.7, 8, 8]} />
              <meshBasicMaterial
                color={m.color}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )}
          {/* Infrastructure ring — size = infra quality */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[m.infraQuality * 0.03, m.infraQuality * 0.04, 16]} />
            <meshBasicMaterial
              color={m.infraQuality > 4 ? "#44aaff" : "#ff8844"}
              transparent
              opacity={0.35}
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
