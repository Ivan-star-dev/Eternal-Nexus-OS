import { useMemo } from "react";
import * as THREE from "three";

/**
 * Coastal flood overlay — shows areas at risk of submersion
 * based on IPCC AR6 sea level rise projections (0.44m–2m).
 * Blue translucent arcs along vulnerable coastlines.
 */

interface CoastalCity {
  name: string;
  lat: number;
  lon: number;
  elevationM: number; // average coastal elevation
  populationM: number; // millions at risk
}

// Cities most vulnerable to sea level rise (Climate Central / IPCC data)
const COASTAL_RISK_CITIES: CoastalCity[] = [
  { name: "Shanghai", lat: 31.2, lon: 121.5, elevationM: 4, populationM: 17.5 },
  { name: "Mumbai", lat: 19.1, lon: 72.9, elevationM: 8, populationM: 12.5 },
  { name: "Dhaka", lat: 23.8, lon: 90.4, elevationM: 4, populationM: 14.0 },
  { name: "Jakarta", lat: -6.2, lon: 106.8, elevationM: 3, populationM: 10.0 },
  { name: "Ho Chi Minh", lat: 10.8, lon: 106.7, elevationM: 2, populationM: 8.2 },
  { name: "Bangkok", lat: 13.8, lon: 100.5, elevationM: 1.5, populationM: 5.6 },
  { name: "Miami", lat: 25.8, lon: -80.2, elevationM: 2, populationM: 2.7 },
  { name: "New York", lat: 40.7, lon: -74.0, elevationM: 6, populationM: 8.3 },
  { name: "Lagos", lat: 6.5, lon: 3.4, elevationM: 3, populationM: 15.0 },
  { name: "Tokyo", lat: 35.7, lon: 139.8, elevationM: 5, populationM: 13.0 },
  { name: "Alexandria", lat: 31.2, lon: 29.9, elevationM: 1, populationM: 5.2 },
  { name: "Amsterdam", lat: 52.4, lon: 4.9, elevationM: -2, populationM: 1.1 },
  { name: "Rotterdam", lat: 51.9, lon: 4.5, elevationM: -6, populationM: 0.65 },
  { name: "Kolkata", lat: 22.6, lon: 88.4, elevationM: 5, populationM: 14.9 },
  { name: "Guangzhou", lat: 23.1, lon: 113.3, elevationM: 6, populationM: 15.0 },
  { name: "Osaka", lat: 34.7, lon: 135.5, elevationM: 3, populationM: 2.7 },
  { name: "New Orleans", lat: 30.0, lon: -90.1, elevationM: -2, populationM: 0.39 },
  { name: "Venice", lat: 45.4, lon: 12.3, elevationM: 1, populationM: 0.26 },
  { name: "Basra", lat: 30.5, lon: 47.8, elevationM: 2, populationM: 2.9 },
  { name: "Maputo", lat: -25.9, lon: 32.6, elevationM: 3, populationM: 1.1 },
];

function latLonToPos(lat: number, lon: number, radius = 6.18): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

interface CoastalFloodLayerProps {
  seaLevelRise?: number; // meters, default 0.56 (SSP2-4.5)
}

export default function CoastalFloodLayer({ seaLevelRise = 0.56 }: CoastalFloodLayerProps) {
  const floodZones = useMemo(() => {
    return COASTAL_RISK_CITIES
      .filter((c) => c.elevationM <= seaLevelRise * 4) // at-risk if elevation < 4x sea level rise
      .map((c) => {
        const submersionRisk = Math.min(1, seaLevelRise / Math.max(c.elevationM, 0.5));
        const scale = 0.15 + submersionRisk * 0.25 + (c.populationM / 20) * 0.1;
        return {
          ...c,
          pos: latLonToPos(c.lat, c.lon),
          submersionRisk,
          scale,
          color: submersionRisk > 0.7 ? "#0044ff" : submersionRisk > 0.4 ? "#0088ff" : "#00bbff",
          opacity: 0.25 + submersionRisk * 0.35,
        };
      });
  }, [seaLevelRise]);

  return (
    <>
      {floodZones.map((zone) => (
        <group key={zone.name} position={zone.pos}>
          {/* Flood ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[zone.scale * 0.4, zone.scale, 24]} />
            <meshBasicMaterial
              color={zone.color}
              transparent
              opacity={zone.opacity}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Core dot */}
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color="#0066ff"
              transparent
              opacity={zone.opacity + 0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

export { COASTAL_RISK_CITIES, type CoastalCity };
