import { useRef, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FlyToCameraProps {
  targetLat: number | null;
  targetLon: number | null;
  onArrived?: () => void;
}

function latLonToPos(lat: number, lon: number, radius = 18): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

export default function FlyToCamera({ targetLat, targetLon, onArrived }: FlyToCameraProps) {
  const { camera } = useThree();
  const curve = useRef<THREE.CatmullRomCurve3 | null>(null);
  const progress = useRef(1);

  useEffect(() => {
    if (targetLat == null || targetLon == null) return;

    const start = camera.position.clone();
    const [ex, ey, ez] = latLonToPos(targetLat, targetLon, 16);
    const end = new THREE.Vector3(ex, ey, ez);

    // Arc midpoint — lift camera above globe for cinematic sweep
    const mid = start.clone().lerp(end, 0.5);
    const lift = Math.max(mid.length() * 1.35, 22);
    mid.normalize().multiplyScalar(lift);

    // Catmull-Rom spline for smooth cinematic path
    curve.current = new THREE.CatmullRomCurve3(
      [start, mid, end],
      false,
      "centripetal",
      0.5
    );
    progress.current = 0;
  }, [targetLat, targetLon, camera]);

  useFrame(() => {
    if (!curve.current || progress.current >= 1) return;

    progress.current = Math.min(1, progress.current + 0.008);
    const t = progress.current;
    // Smooth ease-in-out
    const ease = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const pos = curve.current.getPointAt(ease);
    camera.position.copy(pos);
    camera.lookAt(0, 0, 0);

    if (progress.current >= 1) {
      curve.current = null;
      onArrived?.();
    }
  });

  return null;
}
