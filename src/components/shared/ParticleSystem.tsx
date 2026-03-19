// sacred-flow: TextureLord — ParticleSystem base para TODO o organismo
// Glow dourado morabeza + bloom radial + 60fps via Web Worker
// Integra: Razorfish Blue Dot (60k+ particles) + Figma (Web Workers)

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color?: string;
  size?: number;
  opacity?: number;
  spread?: number;
  speed?: number;
  glow?: boolean;
}

// sacred-flow: morabeza golden — Mindelo sunset in every particle
const MORABEZA_GOLD = new THREE.Color('#FFB347');

export default function ParticleSystem({
  count = 10000,
  color = '#FFB347',
  size = 1.5,
  opacity = 0.8,
  spread = 100,
  speed = 0.3,
  glow = true,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const workerRef = useRef<Worker | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);

  const particleColor = useMemo(() => new THREE.Color(color), [color]);

  // sacred-flow: init Web Worker for 60fps offload
  useEffect(() => {
    const worker = new Worker(
      new URL('../../workers/particleWorker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.postMessage({ type: 'init', payload: { count } });

    worker.onmessage = (e) => {
      if (e.data.type === 'frame') {
        bufferRef.current = new Float32Array(e.data.data);
      }
    };

    workerRef.current = worker;
    return () => worker.terminate();
  }, [count]);

  // sacred-flow: positions buffer
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = size * (0.5 + Math.random());
    }
    return arr;
  }, [count, size]);

  // sacred-flow: cada frame pede update ao worker
  useFrame((_, delta) => {
    workerRef.current?.postMessage({
      type: 'update',
      payload: { delta: Math.min(delta, 0.05), targetCount: count },
    });

    // Apply worker data to geometry
    if (bufferRef.current && pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
      const buf = bufferRef.current;
      const len = Math.min(buf.length / 8, count);

      for (let i = 0; i < len; i++) {
        const idx = i * 8;
        posAttr.array[i * 3] = buf[idx];
        posAttr.array[i * 3 + 1] = buf[idx + 1];
        posAttr.array[i * 3 + 2] = buf[idx + 2];
      }
      posAttr.needsUpdate = true;
    }
  });

  // sacred-flow: spawn meteor burst on click — CERN particle disintegration
  const spawnMeteors = useCallback(() => {
    workerRef.current?.postMessage({
      type: 'spawn-meteor',
      payload: { count: 200 },
    });
  }, []);

  return (
    <points ref={pointsRef} onClick={spawnMeteors}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={particleColor}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}  // sacred-flow: glow aditivo morabeza
      />
    </points>
  );
}
