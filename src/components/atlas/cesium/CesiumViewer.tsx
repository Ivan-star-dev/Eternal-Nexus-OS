// sacred flow — Atlas organ: Heart/Factory of the Eternal Nexus
// Premium CesiumWidget with Apple-smooth camera + cinematic post-processing
import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import {
  Ion,
  CesiumWidget,
  Terrain,
  Cartesian3,
  Cartesian2,
  Cartographic,
  Color,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from "cesium";
import { configureCameraChoreography, playArrivalSequence, flyToLocation } from "@/lib/atlas/camera-choreography";
import type { AtlasMode, QualityTier } from "@/lib/atlas/atlas-state";
import { applyPreset, applyMotionReduction, restoreIdleQuality, createMotionDetector } from "@/lib/atlas/quality-manager";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || "";

export interface CesiumViewerHandle {
  widget: CesiumWidget | null;
  flyTo: (lat: number, lon: number, altitude?: number) => void;
  getCamera: () => import("cesium").Camera | null;
  applyMode: (mode: AtlasMode, quality: QualityTier) => void;
}

interface CesiumViewerProps {
  mode: AtlasMode;
  quality: QualityTier;
  onReady?: (widget: CesiumWidget) => void;
  onCameraChange?: (height: number) => void;
  onMotionChange?: (isMoving: boolean) => void;
  onClick?: (lat: number, lon: number) => void;
  className?: string;
}

const CesiumViewerComponent = forwardRef<CesiumViewerHandle, CesiumViewerProps>(
  ({ mode, quality, onReady, onCameraChange, onMotionChange, onClick, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<CesiumWidget | null>(null);
    const cleanupMotionRef = useRef<(() => void) | null>(null);

    const flyTo = useCallback((lat: number, lon: number, altitude = 500000) => {
      const widget = widgetRef.current;
      if (!widget) return;
      flyToLocation(widget, lat, lon, altitude);
    }, []);

    const getCamera = useCallback(() => widgetRef.current?.camera ?? null, []);

    const applyModeCallback = useCallback((m: AtlasMode, q: QualityTier) => {
      const widget = widgetRef.current;
      if (!widget) return;
      applyPreset(widget, m, q);
    }, []);

    useImperativeHandle(ref, () => ({
      widget: widgetRef.current,
      flyTo,
      getCamera,
      applyMode: applyModeCallback,
    }), [flyTo, getCamera, applyModeCallback]);

    // sacred flow — apply mode/quality changes
    useEffect(() => {
      const widget = widgetRef.current;
      if (!widget || widget.isDestroyed()) return;
      applyPreset(widget, mode, quality);
    }, [mode, quality]);

    useEffect(() => {
      if (!containerRef.current || widgetRef.current) return;

      // sacred flow — lean CesiumWidget, zero UI widgets
      const widget = new CesiumWidget(containerRef.current, {
        terrain: Terrain.fromWorldTerrain({
          requestWaterMask: true,
          requestVertexNormals: true,
        }),
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        msaaSamples: 4,
        creditContainer: document.createElement("div"),
      });

      widgetRef.current = widget;
      const scene = widget.scene;

      // sacred flow — HDR + cinematic lighting
      scene.highDynamicRange = true;
      scene.globe.enableLighting = true;
      scene.globe.dynamicAtmosphereLighting = true;
      scene.globe.dynamicAtmosphereLightingFromSun = true;

      // sacred flow — morabeza atmosphere: golden sunset tint
      scene.globe.atmosphereLightIntensity = 8.0;
      scene.globe.atmosphereRayleighCoefficient = new Cartesian3(8.5e-6, 12.0e-6, 28.4e-6);
      scene.globe.atmosphereMieCoefficient = new Cartesian3(21e-6, 21e-6, 21e-6);
      scene.fog.enabled = true;
      scene.fog.density = 2.0e-4;
      if (scene.skyAtmosphere) {
        scene.skyAtmosphere.hueShift = 0.05;
        scene.skyAtmosphere.saturationShift = 0.1;
        scene.skyAtmosphere.brightnessShift = 0.1;
      }

      // sacred flow — dark Nexus background
      scene.backgroundColor = Color.fromCssColorString("#0a0a0f");
      scene.globe.baseColor = Color.fromCssColorString("#0a0e1a");

      // sacred flow — enable shadows for terrain depth
      // terrainExaggeration was moved to Scene in CesiumJS 1.119+; cast to avoid stale type definition
      (widget.scene as unknown as { terrainExaggeration: number }).terrainExaggeration = 1.0;

      // sacred flow — Apple-smooth camera choreography
      configureCameraChoreography(widget);

      // sacred flow — initial post-processing (will be overridden by mode preset)
      scene.postProcessStages.fxaa.enabled = true;

      // sacred flow — camera change events for LOD
      widget.camera.changed.addEventListener(() => {
        const height = widget.camera.positionCartographic.height;
        onCameraChange?.(height);
        widget.scene.requestRender();
      });

      // sacred flow — motion detection for quality adaptation
      cleanupMotionRef.current = createMotionDetector(
        widget,
        () => {
          onMotionChange?.(true);
          applyMotionReduction(widget, quality);
        },
        () => {
          onMotionChange?.(false);
          restoreIdleQuality(widget, mode, quality);
        },
        500,
      );

      // sacred flow — click handler
      const handler = new ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction((movement: { position: Cartesian2 }) => {
        const cartesian = widget.camera.pickEllipsoid(movement.position, scene.globe.ellipsoid);
        if (cartesian) {
          const cartographic = Cartographic.fromCartesian(cartesian);
          onClick?.(CesiumMath.toDegrees(cartographic.latitude), CesiumMath.toDegrees(cartographic.longitude));
        }
      }, ScreenSpaceEventType.LEFT_CLICK);

      // sacred flow — continuous render for particle systems
      scene.postRender.addEventListener(() => {
        scene.requestRender();
      });

      // sacred flow — apply initial mode preset
      applyPreset(widget, mode, quality);

      // sacred flow — cinematic arrival sequence
      playArrivalSequence(widget);

      onReady?.(widget);

      return () => {
        handler.destroy();
        cleanupMotionRef.current?.();
        if (!widget.isDestroyed()) widget.destroy();
        widgetRef.current = null;
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}
      />
    );
  }
);

CesiumViewerComponent.displayName = "CesiumViewer";
export default CesiumViewerComponent;
