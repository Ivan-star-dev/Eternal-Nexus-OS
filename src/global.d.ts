import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Ambient declarations for optional post-processing packages that may not be installed
declare module '@react-three/postprocessing' {
  import { ReactNode } from 'react';
  export const EffectComposer: React.FC<{ disableNormalPass?: boolean; children?: ReactNode }>;
  export const Bloom: React.FC<{ intensity?: number; luminanceThreshold?: number; luminanceSmoothing?: number; mipmapBlur?: boolean; radius?: number }>;
  export const DepthOfField: React.FC<{ focusDistance?: number; focalLength?: number; bokehScale?: number }>;
  export const Vignette: React.FC<{ eskil?: boolean; offset?: number; darkness?: number }>;
  export const Noise: React.FC<{ premultiply?: boolean; blendFunction?: unknown }>;
  export const ToneMapping: React.FC<{ mode?: unknown }>;
}

declare module 'postprocessing' {
  export enum ToneMappingMode {
    ACES_FILMIC = 'ACES_FILMIC',
    REINHARD = 'REINHARD',
    REINHARD2 = 'REINHARD2',
    OPTIMIZED_CINEON = 'OPTIMIZED_CINEON',
    LINEAR = 'LINEAR',
    NEUTRAL = 'NEUTRAL',
    AGXLOOK = 'AGXLOOK',
    NONE = 'NONE',
  }
  export enum BlendFunction {
    ADD = 'ADD',
    ALPHA = 'ALPHA',
    AVERAGE = 'AVERAGE',
    COLOR = 'COLOR',
    COLOR_BURN = 'COLOR_BURN',
    COLOR_DODGE = 'COLOR_DODGE',
    DARKEN = 'DARKEN',
    DIFFERENCE = 'DIFFERENCE',
    DIVIDE = 'DIVIDE',
    DST = 'DST',
    EXCLUSION = 'EXCLUSION',
    HARD_LIGHT = 'HARD_LIGHT',
    HARD_MIX = 'HARD_MIX',
    HUE = 'HUE',
    INVERT = 'INVERT',
    INVERT_RGB = 'INVERT_RGB',
    LIGHTEN = 'LIGHTEN',
    LINEAR_BURN = 'LINEAR_BURN',
    LINEAR_DODGE = 'LINEAR_DODGE',
    LINEAR_LIGHT = 'LINEAR_LIGHT',
    LUMINOSITY = 'LUMINOSITY',
    MULTIPLY = 'MULTIPLY',
    NEGATION = 'NEGATION',
    NORMAL = 'NORMAL',
    OVERLAY = 'OVERLAY',
    PIN_LIGHT = 'PIN_LIGHT',
    REFLECT = 'REFLECT',
    SATURATION = 'SATURATION',
    SCREEN = 'SCREEN',
    SET = 'SET',
    SKIP = 'SKIP',
    SOFT_LIGHT = 'SOFT_LIGHT',
    SRC = 'SRC',
    SUBTRACT = 'SUBTRACT',
    VIVID_LIGHT = 'VIVID_LIGHT',
  }
}
