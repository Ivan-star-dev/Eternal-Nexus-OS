// sacred flow — Atlas meteor particles entering the globe atmosphere
// Gold/orange streaks that impact and fade — cinematic 60fps
import { useEffect, useRef } from "react";
import {
  CesiumWidget,
  ParticleSystem,
  ConeEmitter,
  Cartesian3,
  Cartesian2,
  Color,
  Math as CesiumMath,
  Transforms,
} from "cesium";

interface CesiumMeteorParticlesProps {
  viewer: CesiumWidget | null;
  enabled?: boolean;
}

const METEOR_INTERVAL = 3000; // sacred flow — new meteor every 3 seconds
const METEOR_ALTITUDE = 800000; // 800km — upper atmosphere entry

export default function CesiumMeteorParticles({
  viewer,
  enabled = true,
}: CesiumMeteorParticlesProps) {
  const systemsRef = useRef<ParticleSystem[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!viewer || viewer.isDestroyed() || !enabled) return;

    const scene = viewer.scene;

    // sacred flow — spawn a meteor particle system at a random position
    function spawnMeteor() {
      if (!viewer || viewer.isDestroyed()) return;

      const lat = Math.random() * 120 - 60;
      const lon = Math.random() * 360 - 180;
      const entryPosition = Cartesian3.fromDegrees(lon, lat, METEOR_ALTITUDE);
      const modelMatrix = Transforms.eastNorthUpToFixedFrame(entryPosition);

      const particleSystem = new ParticleSystem({
        image: createMeteorImage(),
        startColor: Color.fromCssColorString("#ffd700").withAlpha(1.0),
        endColor: Color.fromCssColorString("#ff6600").withAlpha(0.0),
        startScale: 1.5,
        endScale: 0.2,
        minimumParticleLife: 1.5,
        maximumParticleLife: 3.0,
        minimumSpeed: 50000,
        maximumSpeed: 120000,
        emissionRate: 40,
        emitter: new ConeEmitter(CesiumMath.toRadians(15)),
        modelMatrix,
        lifetime: 4.0,
        loop: false,
        sizeInMeters: true,
        minimumImageSize: new Cartesian2(800, 800),
        maximumImageSize: new Cartesian2(1600, 1600),
      });

      scene.primitives.add(particleSystem);
      systemsRef.current.push(particleSystem);

      setTimeout(() => {
        if (!viewer.isDestroyed() && !particleSystem.isDestroyed) {
          scene.primitives.remove(particleSystem);
        }
        systemsRef.current = systemsRef.current.filter((s) => s !== particleSystem);
      }, 5000);

      scene.requestRender();
    }

    spawnMeteor();
    intervalRef.current = setInterval(spawnMeteor, METEOR_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      systemsRef.current.forEach((sys) => {
        if (viewer && !viewer.isDestroyed() && !sys.isDestroyed) {
          viewer.scene.primitives.remove(sys);
        }
      });
      systemsRef.current = [];
    };
  }, [viewer, enabled]);

  return null;
}

// sacred flow — generate a soft gold particle texture via canvas
function createMeteorImage(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 215, 0, 1.0)");
  gradient.addColorStop(0.3, "rgba(255, 180, 0, 0.8)");
  gradient.addColorStop(0.6, "rgba(255, 102, 0, 0.4)");
  gradient.addColorStop(1, "rgba(255, 60, 0, 0.0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return canvas.toDataURL();
}
