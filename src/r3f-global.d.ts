/**
 * Global R3F JSX namespace augmentation.
 * Needed because @react-three/fiber@8 does not auto-augment JSX.IntrinsicElements
 * when used with the bundler moduleResolution strategy.
 * This file must be referenced by tsconfig.app.json via "types" or "include".
 */
import type { extend } from '@react-three/fiber';
import type * as THREE from 'three';

// Re-export ThreeElements to augment JSX
declare global {
  namespace JSX {
    interface IntrinsicElements extends import('@react-three/fiber').ThreeElements {}
  }
}
