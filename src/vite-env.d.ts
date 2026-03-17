/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />
/// <reference types="three" />

// sacred-flow: global type declarations
declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.worker.ts' {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}
