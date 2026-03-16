import { useMemo } from "react";
import * as THREE from "three";

/**
 * Sustainability Layer — CO₂ emissions, renewable energy share, NDC pledges.
 * Data sources: IEA 2024, Climate Action Tracker, World Bank WDI.
 */

export interface SustainabilityPoint {
  country: string;
  lat: number;
  lon: number;
  co2PerCapita: number;      // tonnes CO₂/capita (IEA 2024)
  renewablePct: number;       // % of energy mix from renewables
  ndcTarget: number;          // NDC pledge reduction % by 2030
  circularityIndex: number;   // 0-100 circular economy score
}

export const SUSTAINABILITY_DATA: SustainabilityPoint[] = [
  { country: "Qatar", lat: 25.3, lon: 51.2, co2PerCapita: 32.8, renewablePct: 2, ndcTarget: 25, circularityIndex: 18 },
  { country: "Saudi Arabia", lat: 23.9, lon: 45.1, co2PerCapita: 15.3, renewablePct: 3, ndcTarget: 30, circularityIndex: 22 },
  { country: "Australia", lat: -25.3, lon: 133.8, co2PerCapita: 14.9, renewablePct: 32, ndcTarget: 43, circularityIndex: 45 },
  { country: "USA", lat: 37.1, lon: -95.7, co2PerCapita: 13.0, renewablePct: 21, ndcTarget: 50, circularityIndex: 42 },
  { country: "Canada", lat: 56.1, lon: -106.3, co2PerCapita: 14.2, renewablePct: 68, ndcTarget: 40, circularityIndex: 48 },
  { country: "Russia", lat: 61.5, lon: 105.3, co2PerCapita: 10.8, renewablePct: 20, ndcTarget: 30, circularityIndex: 25 },
  { country: "South Korea", lat: 35.9, lon: 127.8, co2PerCapita: 11.6, renewablePct: 9, ndcTarget: 40, circularityIndex: 55 },
  { country: "Japan", lat: 36.2, lon: 138.3, co2PerCapita: 8.0, renewablePct: 22, ndcTarget: 46, circularityIndex: 65 },
  { country: "Germany", lat: 51.2, lon: 10.4, co2PerCapita: 7.5, renewablePct: 52, ndcTarget: 65, circularityIndex: 72 },
  { country: "China", lat: 35.9, lon: 104.2, co2PerCapita: 7.4, renewablePct: 31, ndcTarget: 65, circularityIndex: 38 },
  { country: "UK", lat: 55.4, lon: -3.4, co2PerCapita: 4.7, renewablePct: 47, ndcTarget: 68, circularityIndex: 68 },
  { country: "Italy", lat: 41.9, lon: 12.5, co2PerCapita: 5.0, renewablePct: 41, ndcTarget: 55, circularityIndex: 60 },
  { country: "France", lat: 46.2, lon: 2.2, co2PerCapita: 4.2, renewablePct: 27, ndcTarget: 55, circularityIndex: 64 },
  { country: "Spain", lat: 40.5, lon: -3.7, co2PerCapita: 4.8, renewablePct: 50, ndcTarget: 55, circularityIndex: 58 },
  { country: "Turkey", lat: 38.9, lon: 35.2, co2PerCapita: 4.6, renewablePct: 54, ndcTarget: 21, circularityIndex: 30 },
  { country: "Brazil", lat: -14.2, lon: -51.9, co2PerCapita: 2.0, renewablePct: 83, ndcTarget: 50, circularityIndex: 40 },
  { country: "Mexico", lat: 23.6, lon: -102.6, co2PerCapita: 3.2, renewablePct: 28, ndcTarget: 35, circularityIndex: 32 },
  { country: "India", lat: 20.6, lon: 79.0, co2PerCapita: 1.9, renewablePct: 40, ndcTarget: 45, circularityIndex: 28 },
  { country: "Indonesia", lat: -0.8, lon: 113.9, co2PerCapita: 2.3, renewablePct: 23, ndcTarget: 31, circularityIndex: 24 },
  { country: "Nigeria", lat: 9.1, lon: 8.7, co2PerCapita: 0.6, renewablePct: 18, ndcTarget: 20, circularityIndex: 12 },
  { country: "Ethiopia", lat: 9.1, lon: 40.5, co2PerCapita: 0.2, renewablePct: 92, ndcTarget: 64, circularityIndex: 15 },
  { country: "Sweden", lat: 60.1, lon: 18.6, co2PerCapita: 3.4, renewablePct: 60, ndcTarget: 63, circularityIndex: 82 },
  { country: "Norway", lat: 60.5, lon: 8.5, co2PerCapita: 6.7, renewablePct: 98, ndcTarget: 55, circularityIndex: 78 },
  { country: "Denmark", lat: 56.3, lon: 9.5, co2PerCapita: 4.4, renewablePct: 80, ndcTarget: 70, circularityIndex: 80 },
  { country: "South Africa", lat: -30.6, lon: 22.9, co2PerCapita: 6.7, renewablePct: 11, ndcTarget: 28, circularityIndex: 20 },
];

function latLonToPos(lat: number, lon: number, radius = 6.25): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function co2ToColor(co2: number): string {
  if (co2 >= 12) return "#ff1111";    // Very high emitter
  if (co2 >= 8) return "#ff6633";     // High
  if (co2 >= 5) return "#ffaa22";     // Medium-high
  if (co2 >= 2) return "#cccc22";     // Medium
  if (co2 >= 1) return "#66cc22";     // Low
  return "#22cc66";                    // Very low
}

function renewableToRingColor(pct: number): string {
  if (pct >= 70) return "#22ffaa";
  if (pct >= 40) return "#44cc88";
  if (pct >= 20) return "#888844";
  return "#884422";
}

export default function SustainabilityLayer() {
  const markers = useMemo(() =>
    SUSTAINABILITY_DATA.map((d) => ({
      ...d,
      pos: latLonToPos(d.lat, d.lon),
      co2Color: co2ToColor(d.co2PerCapita),
      renewColor: renewableToRingColor(d.renewablePct),
      scale: 0.06 + (d.co2PerCapita / 35) * 0.12,
      ringScale: 0.2 + (d.renewablePct / 100) * 0.25,
    })),
    []
  );

  return (
    <>
      {markers.map((m) => (
        <group key={m.country} position={m.pos}>
          {/* CO₂ dot — size & color by emissions */}
          <mesh>
            <sphereGeometry args={[m.scale, 10, 10]} />
            <meshBasicMaterial
              color={m.co2Color}
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Renewable ring — green = clean */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[m.ringScale, 0.012, 8, 24]} />
            <meshBasicMaterial
              color={m.renewColor}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

export function buildSustainabilityContext(): string {
  const topEmitters = SUSTAINABILITY_DATA.sort((a, b) => b.co2PerCapita - a.co2PerCapita).slice(0, 5);
  const topRenewable = SUSTAINABILITY_DATA.sort((a, b) => b.renewablePct - a.renewablePct).slice(0, 5);
  return [
    `TOP CO₂/capita: ${topEmitters.map((e) => `${e.country} ${e.co2PerCapita}t`).join(", ")}`,
    `TOP Renewables: ${topRenewable.map((e) => `${e.country} ${e.renewablePct}%`).join(", ")}`,
  ].join(". ");
}
