/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />
/// <reference types="three" />

// Force R3F JSX augmentation: needed for bundler moduleResolution + isolatedModules
// @react-three/fiber augments JSX.IntrinsicElements in three-types.d.ts but only
// when the module is explicitly imported in the type path.
 
import type {} from '@react-three/fiber';

// sacred-flow: global type declarations
declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.worker.ts' {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}
