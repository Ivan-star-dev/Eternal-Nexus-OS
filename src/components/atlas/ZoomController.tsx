import { useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type LODLevel = "orbital" | "regional" | "street";

interface ZoomControllerProps {
  onLODChange?: (level: LODLevel) => void;
  enabled?: boolean;
}

function getLOD(distance: number): LODLevel {
  if (distance < 8) return "street";
  if (distance < 14) return "regional";
  return "orbital";
}

export default function ZoomController({ onLODChange, enabled = true }: ZoomControllerProps) {
  const { camera, gl } = useThree();
  const targetDistance = useRef(18);
  const currentLOD = useRef<LODLevel>("orbital");
  const rotY = useRef(0);
  const rotX = useRef(0.2);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Scroll zoom
  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetDistance.current = THREE.MathUtils.clamp(
        targetDistance.current + e.deltaY * 0.008,
        7, 40
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [gl, enabled]);

  // Drag rotation
  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    const onDown = (e: PointerEvent) => {
      if (e.button === 0) {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      rotY.current -= dx * 0.004;
      rotX.current = THREE.MathUtils.clamp(rotX.current - dy * 0.004, -1.2, 1.2);
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { isDragging.current = false; };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
    };
  }, [gl, enabled]);

  useFrame(() => {
    if (!enabled) return;
    const d = THREE.MathUtils.lerp(camera.position.length(), targetDistance.current, 0.06);
    camera.position.x = d * Math.sin(rotY.current) * Math.cos(rotX.current);
    camera.position.y = d * Math.sin(rotX.current);
    camera.position.z = d * Math.cos(rotY.current) * Math.cos(rotX.current);
    camera.lookAt(0, 0, 0);

    const lod = getLOD(d);
    if (lod !== currentLOD.current) {
      currentLOD.current = lod;
      onLODChange?.(lod);
    }
  });

  return null;
}
