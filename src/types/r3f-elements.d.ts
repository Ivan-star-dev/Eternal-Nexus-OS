import type { Object3DNode } from "@react-three/fiber";
import type { Line } from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeLine: Object3DNode<Line, typeof Line>;
  }
}
