import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "@/data/projectLocations";

const GLOBE_RADIUS = 4.5;

// Static representative air quality data points (major cities / regions)
// aqi: 0–50 Good, 51–100 Moderate, 101–150 Unhealthy for Sensitive Groups,
//      151–200 Unhealthy, 201–300 Very Unhealthy, 301+ Hazardous
const AIR_QUALITY_POINTS = [
  { id: "beijing",    lat: 39.9,  lng: 116.4, aqi: 175, city: "Beijing" },
  { id: "delhi",      lat: 28.6,  lng: 77.2,  aqi: 220, city: "Delhi" },
  { id: "karachi",    lat: 24.8,  lng: 67.0,  aqi: 160, city: "Karachi" },
  { id: "lahore",     lat: 31.5,  lng: 74.3,  aqi: 190, city: "Lahore" },
  { id: "dhaka",      lat: 23.7,  lng: 90.4,  aqi: 170, city: "Dhaka" },
  { id: "cairo",      lat: 30.0,  lng: 31.2,  aqi: 145, city: "Cairo" },
  { id: "mumbai",     lat: 19.1,  lng: 72.9,  aqi: 130, city: "Mumbai" },
  { id: "chengdu",    lat: 30.7,  lng: 104.1, aqi: 155, city: "Chengdu" },
  { id: "jakarta",    lat: -6.2,  lng: 106.8, aqi: 120, city: "Jakarta" },
  { id: "mexico",     lat: 19.4,  lng: -99.1, aqi: 110, city: "Mexico City" },
  { id: "lagos",      lat: 6.5,   lng: 3.4,   aqi: 135, city: "Lagos" },
  { id: "london",     lat: 51.5,  lng: -0.1,  aqi: 55,  city: "London" },
  { id: "newyork",    lat: 40.7,  lng: -74.0, aqi: 45,  city: "New York" },
  { id: "sydney",     lat: -33.9, lng: 151.2, aqi: 30,  city: "Sydney" },
  { id: "toronto",    lat: 43.7,  lng: -79.4, aqi: 40,  city: "Toronto" },
  { id: "paris",      lat: 48.9,  lng: 2.3,   aqi: 60,  city: "Paris" },
  { id: "saopaulo",   lat: -23.5, lng: -46.6, aqi: 95,  city: "São Paulo" },
  { id: "tokyo",      lat: 35.7,  lng: 139.7, aqi: 50,  city: "Tokyo" },
  { id: "seoul",      lat: 37.6,  lng: 127.0, aqi: 105, city: "Seoul" },
  { id: "moscow",     lat: 55.8,  lng: 37.6,  aqi: 70,  city: "Moscow" },
];

function getAqiColor(aqi: number): string {
  if (aqi <= 50)  return "#22c55e"; // green — Good
  if (aqi <= 100) return "#eab308"; // yellow — Moderate
  if (aqi <= 150) return "#f97316"; // orange — Unhealthy for Sensitive
  if (aqi <= 200) return "#ef4444"; // red — Unhealthy
  if (aqi <= 300) return "#a855f7"; // purple — Very Unhealthy
  return "#be123c";                  // dark red — Hazardous
}

function getAqiOpacity(aqi: number): number {
  if (aqi <= 50)  return 0.55;
  if (aqi <= 100) return 0.65;
  if (aqi <= 150) return 0.75;
  if (aqi <= 200) return 0.85;
  return 1.0;
}

interface AirQualityDotProps {
  lat: number;
  lng: number;
  aqi: number;
}

function AirQualityDot({ lat, lng, aqi }: AirQualityDotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const pos = latLngToVector3(lat, lng, GLOBE_RADIUS * 1.018);
  const color = getAqiColor(aqi);
  const opacity = getAqiOpacity(aqi);
  // Scale dot size proportionally to AQI severity
  const size = 0.06 + (aqi / 300) * 0.1;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      const pulse = 1 + Math.sin(t * 1.8 + lat) * 0.2;
      meshRef.current.scale.setScalar(pulse);
    }
    if (haloRef.current) {
      const haloPulse = 1 + Math.sin(t * 1.8 + lat + 1.2) * 0.4;
      haloRef.current.scale.setScalar(haloPulse);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity * 0.35 * (0.5 + 0.5 * Math.sin(t * 1.8 + lat));
    }
  });

  return (
    <group position={pos}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.6, size * 2.4, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

interface AirQualityLayerProps {
  visible: boolean;
}

const AirQualityLayer = ({ visible }: AirQualityLayerProps) => {
  if (!visible) return null;

  return (
    <group>
      {AIR_QUALITY_POINTS.map((p) => (
        <AirQualityDot key={p.id} lat={p.lat} lng={p.lng} aqi={p.aqi} />
      ))}
    </group>
  );
};

export default AirQualityLayer;
