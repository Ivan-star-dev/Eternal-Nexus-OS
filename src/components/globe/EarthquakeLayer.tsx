import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fetchRecentEarthquakes, EarthquakePoint } from "@/lib/earthquakeData";
import { latLngToVector3 } from "@/data/projectLocations";

const GLOBE_RADIUS = 4.5;

interface EarthquakeLayerProps {
  visible: boolean;
}

function getMagColor(mag: number): string {
  if (mag >= 6) return "#ef4444"; // red
  if (mag >= 5) return "#f97316"; // orange
  return "#D4AF37"; // gold/amber for 4-5
}

function getMagOpacity(mag: number): number {
  if (mag >= 6) return 1.0;
  if (mag >= 5) return 0.8;
  return 0.6;
}

interface EarthquakeDotProps {
  quake: EarthquakePoint;
}

function EarthquakeDot({ quake }: EarthquakeDotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pos = latLngToVector3(quake.lat, quake.lon, GLOBE_RADIUS * 1.015);
  const color = getMagColor(quake.mag);
  const opacity = getMagOpacity(quake.mag);
  const size = quake.mag * 0.025;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 2.5 + quake.lat) * 0.3;
      meshRef.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      const t = clock.getElapsedTime();
      const ringPulse = 1 + Math.sin(t * 2.5 + quake.lat + 1) * 0.5;
      ringRef.current.scale.setScalar(ringPulse);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity * 0.4 * (0.5 + 0.5 * Math.sin(t * 2.5 + quake.lat));
    }
  });

  return (
    <group position={pos}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.5, size * 2.2, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

const EarthquakeLayer = ({ visible }: EarthquakeLayerProps) => {
  const [quakes, setQuakes] = useState<EarthquakePoint[]>([]);

  useEffect(() => {
    if (!visible) return;
    fetchRecentEarthquakes().then(setQuakes).catch(() => setQuakes([]));
  }, [visible]);

  if (!visible) return null;

  return (
    <group>
      {quakes.map((q) => (
        <EarthquakeDot key={q.id} quake={q} />
      ))}
    </group>
  );
};

export default EarthquakeLayer;
