import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EarthquakePoint } from "@/lib/earthquakeData";

function latLonToPos(lat: number, lon: number, radius = 6.15): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function EarthquakeDot({ quake }: { quake: EarthquakePoint }) {
  const ref = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLonToPos(quake.lat, quake.lon), [quake.lat, quake.lon]);
  const scale = useMemo(() => Math.max(0.06, (quake.mag - 4) * 0.08), [quake.mag]);
  const color = useMemo(() => {
    if (quake.mag >= 7) return "#ff0000";
    if (quake.mag >= 6) return "#ff4400";
    if (quake.mag >= 5) return "#ff8800";
    return "#ffaa44";
  }, [quake.mag]);

  useFrame((state) => {
    if (!ref.current) return;
    // Pulse effect — stronger for higher magnitude
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + quake.mag) * 0.4;
    ref.current.scale.setScalar(scale * pulse);
  });

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

interface EarthquakeLayerProps {
  earthquakes: EarthquakePoint[];
}

export default function EarthquakeLayer({ earthquakes }: EarthquakeLayerProps) {
  return (
    <>
      {earthquakes.map((q) => (
        <EarthquakeDot key={q.id} quake={q} />
      ))}
    </>
  );
}
