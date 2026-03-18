import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Torus, Box } from "@react-three/drei";
import * as THREE from "three";

interface MiniProjectSceneProps {
  projectId: string;
  color: string;
}

function RotatingShape({ projectId, color }: { projectId: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  const mat = <meshStandardMaterial color={color} transparent opacity={0.85} wireframe />;

  const shapes: Record<string, React.JSX.Element> = {
    "deltaspine-nl": (
      <Torus ref={meshRef} args={[1, 0.35, 16, 48]}>{mat}</Torus>
    ),
    "geocore-power": (
      <Sphere ref={meshRef} args={[1.1, 24, 16]}>{mat}</Sphere>
    ),
    "terra-lenta": (
      <Sphere ref={meshRef} args={[1.2, 32, 32]}>{mat}</Sphere>
    ),
    "fusion-core": (
      <group ref={meshRef as any}>
        <Box args={[0.7, 0.7, 0.7]}>{mat}</Box>
        <Torus args={[1, 0.1, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>{mat}</Torus>
        <Torus args={[1, 0.1, 8, 32]} rotation={[0, 0, Math.PI / 4]}>{mat}</Torus>
      </group>
    ),
    "chip-fold": (
      <Box ref={meshRef} args={[1.4, 0.15, 1]}>{mat}</Box>
    ),
  };

  return shapes[projectId] || shapes["geocore-power"];
}

const MiniProjectScene = ({ projectId, color }: MiniProjectSceneProps) => {
  const [active, setActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="w-full h-full"
    >
      <Canvas
        frameloop={active ? "always" : "demand"}
        dpr={1}
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 3, 3]} intensity={0.6} color={color} />
          <RotatingShape projectId={projectId} color={color} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MiniProjectScene;
