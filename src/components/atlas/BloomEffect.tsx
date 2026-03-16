import { useRef, useEffect } from "react";
import { useThree, useFrame, extend } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as THREE from "three";

extend({ EffectComposer, RenderPass, UnrealBloomPass });

export default function BloomEffect() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.4,   // strength — subtle
      0.6,   // radius
      0.85   // threshold — only bright things glow
    );
    c.addPass(bloom);
    composer.current = c;

    return () => {
      c.dispose();
    };
  }, [gl, scene, camera, size.width, size.height]);

  useFrame(() => {
    composer.current?.render();
  }, 1);

  return null;
}
