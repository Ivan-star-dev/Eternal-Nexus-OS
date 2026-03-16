// sacred-flow: Sora-Prime — CesiumJS 1.139+ config para Atlas
// O Coração do organismo vivo — zoom infinito, terrain real, 3D tiles

import { Ion, Viewer, Terrain, Cartesian3, Math as CesiumMath } from 'cesium';

// IMPORTANTE: Ivan coloca a tua key no .env
export const CESIUM_CONFIG = {
  ionToken: import.meta.env.VITE_CESIUM_ION_TOKEN || '',
  defaultView: {
    destination: Cartesian3.fromDegrees(-23.6, 15.0, 15000000), // Cabo Verde — morabeza origin
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-90),
      roll: 0,
    },
  },
  terrain: {
    requestWaterMask: true,
    requestVertexNormals: true,
  },
  performance: {
    targetFrameRate: 60,
    maximumScreenSpaceError: 2,    // Qualidade máxima
    tileCacheSize: 1000,
    resolutionScale: 1.0,
    useBrowserRecommendedResolution: true,
    shadows: false,                 // Performance — ativamos depois
  },
  morabeza: {
    glowColor: '#FFB347',          // Pôr do sol de Mindelo
    glowIntensity: 2.5,
    particleDensity: 60000,        // 60k+ partículas Razorfish Blue Dot
    bloomStrength: 1.8,
    bloomRadius: 0.6,
    vignetteIntensity: 0.3,
  },
} as const;

export const initCesiumViewer = (container: string | HTMLElement): Viewer | null => {
  try {
    if (CESIUM_CONFIG.ionToken) {
      Ion.defaultAccessToken = CESIUM_CONFIG.ionToken;
    }

    const viewer = new Viewer(container, {
      terrain: Terrain.fromWorldTerrain(CESIUM_CONFIG.terrain),
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      scene3DOnly: true,
      targetFrameRate: CESIUM_CONFIG.performance.targetFrameRate,
      maximumScreenSpaceError: CESIUM_CONFIG.performance.maximumScreenSpaceError,
      requestRenderMode: false,     // Sempre render — organismo VIVO
      useBrowserRecommendedResolution: CESIUM_CONFIG.performance.useBrowserRecommendedResolution,
    });

    // sacred-flow: câmera voa para Cabo Verde — ponto de origem morabeza
    viewer.camera.flyTo(CESIUM_CONFIG.defaultView);

    return viewer;
  } catch (error) {
    console.error('[sacred-flow] CesiumJS init failed:', error);
    return null;
  }
};

export type { Viewer };
