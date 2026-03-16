// sacred flow — Atlas camera choreography
// Apple-smooth inertia, cinematic fly-tos, arrival sequence

import {
  CesiumWidget,
  Cartesian3,
  Math as CesiumMath,
  EasingFunction,
  ScreenSpaceEventType,
} from "cesium";

// sacred flow — inertia config (heavy, predictable momentum)
export const CAMERA_INERTIA = {
  inertiaSpin: 0.92,
  inertiaTranslate: 0.92,
  inertiaZoom: 0.85,
  bounceAnimationTime: 1.5,
  minimumZoomDistance: 500,
  maximumZoomDistance: 50_000_000,
} as const;

// sacred flow — fly-to timings by distance
export const FLY_TIMINGS = {
  regional: { duration: 1.8, pitch: -35 },
  continental: { duration: 2.8, pitch: -45 },
  intercontinental: { duration: 3.5, pitch: -50 },
  arrival: { duration: 5.0, pitch: -90 },
} as const;

// sacred flow — apply Apple-smooth camera config
export function configureCameraChoreography(widget: CesiumWidget): void {
  if (!widget || widget.isDestroyed()) return;

  const controller = widget.scene.screenSpaceCameraController;

  controller.inertiaSpin = CAMERA_INERTIA.inertiaSpin;
  controller.inertiaTranslate = CAMERA_INERTIA.inertiaTranslate;
  controller.inertiaZoom = CAMERA_INERTIA.inertiaZoom;
  controller.bounceAnimationTime = CAMERA_INERTIA.bounceAnimationTime;
  controller.minimumZoomDistance = CAMERA_INERTIA.minimumZoomDistance;
  controller.maximumZoomDistance = CAMERA_INERTIA.maximumZoomDistance;

  // Disable double-click zoom-to-home (prevents twitchy jumps)
  widget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}

// sacred flow — cinematic arrival sequence
export function playArrivalSequence(widget: CesiumWidget, onComplete?: () => void): void {
  if (!widget || widget.isDestroyed()) return;

  // Start from far orbital view
  widget.camera.setView({
    destination: Cartesian3.fromDegrees(0, 20, 30_000_000),
    orientation: {
      heading: 0,
      pitch: CesiumMath.toRadians(-90),
      roll: 0,
    },
  });

  // Cinematic fly-in to Cabo Verde / Atlantic hub region
  setTimeout(() => {
    if (widget.isDestroyed()) return;
    widget.camera.flyTo({
      destination: Cartesian3.fromDegrees(-15, 25, 12_000_000),
      orientation: {
        heading: CesiumMath.toRadians(10),
        pitch: CesiumMath.toRadians(-60),
        roll: 0,
      },
      duration: FLY_TIMINGS.arrival.duration,
      easingFunction: EasingFunction.CUBIC_IN_OUT,
      complete: onComplete,
    });
  }, 800); // brief pause for scene to stabilize
}

// sacred flow — fly to a project location with appropriate timing
export function flyToLocation(
  widget: CesiumWidget,
  lat: number,
  lon: number,
  altitude = 500_000,
  onComplete?: () => void,
): void {
  if (!widget || widget.isDestroyed()) return;

  // Calculate distance to determine timing
  const currentHeight = widget.camera.positionCartographic.height;
  const isIntercontinental = currentHeight > 5_000_000;
  const timing = isIntercontinental ? FLY_TIMINGS.intercontinental : FLY_TIMINGS.regional;

  widget.camera.flyTo({
    destination: Cartesian3.fromDegrees(lon, lat, altitude),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(timing.pitch),
      roll: 0,
    },
    duration: timing.duration,
    easingFunction: EasingFunction.CUBIC_IN_OUT,
    complete: onComplete,
  });
}
