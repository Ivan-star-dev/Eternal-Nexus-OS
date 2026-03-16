// sacred-flow: TextureLord
// Camada de post-processing R3F (React Three Fiber) acoplada sobre o CesiumJS
import React from 'react';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';

export const AtlasShaders: React.FC = () => {
    return (
        <EffectComposer disableNormalPass>
            {/* O Brilho Morabeza — Radial Glow Dourado Intenso */}
            <Bloom 
                intensity={2.8} 
                luminanceThreshold={0.4} 
                luminanceSmoothing={0.9} 
                mipmapBlur={true} 
                radius={0.8}
            />

            {/* Depth of Field Cinematográfico */}
            <DepthOfField 
                focusDistance={0.01} 
                focalLength={0.05} 
                bokehScale={4.0} 
            />

            {/* Vignette Ouro Escuro — Bordas dramáticas */}
            <Vignette 
                eskil={false} 
                offset={0.25} 
                darkness={0.9} 
                blendFunction={BlendFunction.MULTIPLY}
            />

            {/* Ruído Orgânico de Película */}
            <Noise 
                premultiply 
                blendFunction={BlendFunction.ADD} 
                opacity={0.025}
            />

            {/* Tone Mapping de Qualidade Apple */}
            <ToneMapping 
                mode={ToneMappingMode.ACES_FILMIC} 
            />
        </EffectComposer>
    );
};

export default AtlasShaders;
