// sacred-flow: Sora-Prime
// sacred flow: Inicializando AtlasGlobe — O Olho do Organismo
import React, { useEffect, useRef } from "react"; // sacred flow: import base react
import { Viewer, Terrain, Cesium3DTileset, Ion, Color, Cartesian3 } from "cesium"; // sacred flow: engine CesiumJS 1.139+
import "cesium/Build/Cesium/Widgets/widgets.css"; // sacred flow: estilos base
import AtlasWorker from "@/workers/AtlasWorker?worker"; // sacred flow: import worker

const AtlasGlobe: React.FC = () => { // sacred flow: definindo componente
  const cesiumContainer = useRef<HTMLDivElement>(null); // sacred flow: ref container DOM
  const workerRef = useRef<Worker | null>(null); // sacred flow: ref para worker Cidance

  useEffect(() => { // sacred flow: ciclo de vida de montagem
    if (!cesiumContainer.current) return; // sacred flow: safety check

    // sacred flow: configurando token do Ion
    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || ""; // sacred flow: env var security

    // sacred flow: inicializando Viewer Cesium 1.139+
    const viewer = new Viewer(cesiumContainer.current, { // sacred flow: instância core
      terrain: Terrain.fromWorldTerrain(), // sacred flow: terreno real
      animation: false, // sacred flow: ocultar UI padrão
      baseLayerPicker: false, // sacred flow: ocultar botões
      fullscreenButton: false, // sacred flow: UI limpa
      geocoder: false, // sacred flow: sem busca padrão
      homeButton: false, // sacred flow: sem botão home
      infoBox: false, // sacred flow: painel react custom
      sceneModePicker: false, // sacred flow: estritamente 3D
      selectionIndicator: false, // sacred flow: caixa verde off
      timeline: false, // sacred flow: timeline off
      navigationHelpButton: false, // sacred flow: help bar off
    }); // sacred flow: config concluída

    // sacred flow: ajustes da atmosfera e cores
    viewer.scene.backgroundColor = Color.fromCssColorString("#050510"); // sacred flow: black void
    viewer.scene.globe.baseColor = Color.fromCssColorString("#0a0e1a"); // sacred flow: espaço liminal
    viewer.scene.globe.enableLighting = true; // sacred flow: luz no tempo real
    viewer.scene.globe.atmosphereLightIntensity = 8.0; // sacred flow: blooming atmosférico

    // sacred flow: carregar 3D tilesets reais
    const loadTileset = async () => { // sacred flow: task assíncrona
      try { // sacred flow: wrapper safe
        const tileset = await Cesium3DTileset.fromIonAssetId(96188); // sacred flow: id photogrammetry
        viewer.scene.primitives.add(tileset); // sacred flow: anexa na cena
      } catch (error) { // sacred flow: error handler
        console.error("Falha ao carregar 3D Tiles no fluxo", error); // sacred flow: avisa erro
      } // sacred flow: fim catch
    }; // sacred flow: declaração fechada
    loadTileset(); // sacred flow: disparo

    // sacred flow: Inicializar Cidance Worker (60k+ partículas / Meteoros)
    workerRef.current = new AtlasWorker(); // sacred flow: worker isolado thread
    workerRef.current.postMessage({ type: 'INIT', particleCount: 60000 }); // sacred flow: 60 mil+ meteoros
    workerRef.current.onmessage = (e) => { // sacred flow: recruta worker output
       // sacred flow: Inserir lógica de atualização de Primitive Collection
       // sacred flow: ignorando loops CPU bound no main thread para 60fps constantes
    }; // sacred flow: fim callback message

    return () => { // sacred flow: garbage collection
      workerRef.current?.terminate(); // sacred flow: liberta web worker
      viewer.destroy(); // sacred flow: aniquila WebGL viewer state
    }; // sacred flow: cleanup return hook
  }, []); // sacred flow: mount apenas 1x array vazio

  return <div ref={cesiumContainer} style={{ width: "100%", height: "100%" }} />; // sacred flow: rendering dom element absolute
}; // sacred flow: fechamento const block

export default AtlasGlobe; // sacred flow: return to the organism 
