import { useMemo } from "react";
import * as THREE from "three";

/**
 * Population Aging Heatmap — color-coded dots by median age.
 * Red = old (Japan, Italy, Germany), Green = young (Nigeria, Niger, Uganda).
 * Data: UN World Population Prospects 2024 median ages.
 */

interface CountryAge {
  country: string;
  lat: number;
  lon: number;
  medianAge: number;
  pop65pct: number; // % over 65
}

// UN WPP 2024 representative data
const COUNTRY_AGES: CountryAge[] = [
  { country: "Japan", lat: 36.2, lon: 138.3, medianAge: 49.1, pop65pct: 30.0 },
  { country: "Italy", lat: 41.9, lon: 12.5, medianAge: 47.3, pop65pct: 24.1 },
  { country: "Germany", lat: 51.2, lon: 10.4, medianAge: 45.7, pop65pct: 22.4 },
  { country: "South Korea", lat: 35.9, lon: 127.8, medianAge: 44.6, pop65pct: 18.4 },
  { country: "Spain", lat: 40.5, lon: -3.7, medianAge: 44.9, pop65pct: 20.3 },
  { country: "Portugal", lat: 39.4, lon: -8.2, medianAge: 44.7, pop65pct: 23.7 },
  { country: "France", lat: 46.2, lon: 2.2, medianAge: 42.3, pop65pct: 21.7 },
  { country: "UK", lat: 55.4, lon: -3.4, medianAge: 40.5, pop65pct: 19.0 },
  { country: "USA", lat: 37.1, lon: -95.7, medianAge: 38.5, pop65pct: 17.3 },
  { country: "China", lat: 35.9, lon: 104.2, medianAge: 39.0, pop65pct: 14.3 },
  { country: "Russia", lat: 61.5, lon: 105.3, medianAge: 39.6, pop65pct: 16.0 },
  { country: "Brazil", lat: -14.2, lon: -51.9, medianAge: 33.5, pop65pct: 10.2 },
  { country: "India", lat: 20.6, lon: 79.0, medianAge: 28.4, pop65pct: 7.0 },
  { country: "Indonesia", lat: -0.8, lon: 113.9, medianAge: 30.2, pop65pct: 6.7 },
  { country: "Mexico", lat: 23.6, lon: -102.6, medianAge: 29.3, pop65pct: 8.2 },
  { country: "Egypt", lat: 26.8, lon: 30.8, medianAge: 24.1, pop65pct: 5.4 },
  { country: "Nigeria", lat: 9.1, lon: 8.7, medianAge: 18.1, pop65pct: 2.7 },
  { country: "Ethiopia", lat: 9.1, lon: 40.5, medianAge: 19.5, pop65pct: 3.5 },
  { country: "DR Congo", lat: -4.0, lon: 21.8, medianAge: 17.0, pop65pct: 2.6 },
  { country: "Niger", lat: 17.6, lon: 8.1, medianAge: 15.2, pop65pct: 2.5 },
  { country: "Uganda", lat: 1.4, lon: 32.3, medianAge: 15.7, pop65pct: 2.1 },
  { country: "Pakistan", lat: 30.4, lon: 69.3, medianAge: 22.8, pop65pct: 4.8 },
  { country: "Bangladesh", lat: 23.7, lon: 90.4, medianAge: 27.6, pop65pct: 5.8 },
  { country: "Philippines", lat: 12.9, lon: 121.8, medianAge: 25.7, pop65pct: 5.5 },
  { country: "Australia", lat: -25.3, lon: 133.8, medianAge: 37.9, pop65pct: 16.8 },
  { country: "Canada", lat: 56.1, lon: -106.3, medianAge: 41.1, pop65pct: 19.0 },
  { country: "Turkey", lat: 38.9, lon: 35.2, medianAge: 32.2, pop65pct: 9.5 },
  { country: "Thailand", lat: 15.9, lon: 100.9, medianAge: 40.1, pop65pct: 14.0 },
  { country: "Saudi Arabia", lat: 23.9, lon: 45.1, medianAge: 31.8, pop65pct: 3.6 },
  { country: "South Africa", lat: -30.6, lon: 22.9, medianAge: 27.6, pop65pct: 5.6 },
];

function latLonToPos(lat: number, lon: number, radius = 6.2): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function ageToColor(medianAge: number): string {
  if (medianAge >= 45) return "#ff2222"; // Very old
  if (medianAge >= 38) return "#ff8844"; // Aging
  if (medianAge >= 30) return "#ffcc22"; // Middle
  if (medianAge >= 22) return "#88cc22"; // Young
  return "#22cc66";                       // Very young
}

export default function PopulationAgingLayer() {
  const dots = useMemo(() =>
    COUNTRY_AGES.map((c) => ({
      ...c,
      pos: latLonToPos(c.lat, c.lon),
      color: ageToColor(c.medianAge),
      scale: 0.08 + (c.pop65pct / 30) * 0.12,
    })),
    []
  );

  return (
    <>
      {dots.map((d) => (
        <mesh key={d.country} position={d.pos}>
          <sphereGeometry args={[d.scale, 10, 10]} />
          <meshBasicMaterial
            color={d.color}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

export { COUNTRY_AGES, type CountryAge };
