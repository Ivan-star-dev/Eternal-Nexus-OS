// sacred flow — Atlas connection arcs between project locations
// Gold glowing polylines tracing the Nexus network
import { useEffect, useRef } from "react";
import {
  CesiumWidget,
  CustomDataSource,
  Cartesian3,
  Color,
  PolylineGlowMaterialProperty,
  DistanceDisplayCondition,
} from "cesium";
import type { GeoProject } from "./CesiumProjectEntities";

interface CesiumConnectionArcsProps {
  viewer: CesiumWidget | null;
  projects: GeoProject[];
  visible: boolean;
}

// sacred flow — connection pairs (hub projects connect to their regional nodes)
function generateConnections(projects: GeoProject[]): [GeoProject, GeoProject][] {
  const npiProjects = projects.filter((p) => p.status === "\u03A9 CLEARANCE");
  const coreProjects = projects.filter((p) => p.status !== "\u03A9 CLEARANCE");
  const pairs: [GeoProject, GeoProject][] = [];

  coreProjects.forEach((core) => {
    let nearest = npiProjects[0];
    let minDist = Infinity;
    npiProjects.forEach((npi) => {
      const d = Math.hypot(core.lat - npi.lat, core.lon - npi.lon);
      if (d < minDist) {
        minDist = d;
        nearest = npi;
      }
    });
    if (nearest) pairs.push([core, nearest]);
  });

  for (let i = 0; i < npiProjects.length; i++) {
    for (let j = i + 1; j < npiProjects.length; j++) {
      const d = Math.hypot(
        npiProjects[i].lat - npiProjects[j].lat,
        npiProjects[i].lon - npiProjects[j].lon
      );
      if (d < 120) {
        pairs.push([npiProjects[i], npiProjects[j]]);
      }
    }
  }

  return pairs;
}

export default function CesiumConnectionArcs({
  viewer,
  projects,
  visible,
}: CesiumConnectionArcsProps) {
  const dataSourceRef = useRef<CustomDataSource | null>(null);

  useEffect(() => {
    if (!viewer || viewer.isDestroyed() || projects.length < 2) return;

    const ds = new CustomDataSource("connection-arcs");
    dataSourceRef.current = ds;
    viewer.dataSources.add(ds);

    const connections = generateConnections(projects);

    connections.forEach(([a, b], i) => {
      const midLat = (a.lat + b.lat) / 2;
      const midLon = (a.lon + b.lon) / 2;
      const dist = Math.hypot(a.lat - b.lat, a.lon - b.lon);
      const arcHeight = Math.min(dist * 15000, 500000);

      ds.entities.add({
        id: `arc-${i}`,
        polyline: {
          positions: [
            Cartesian3.fromDegrees(a.lon, a.lat, 1000),
            Cartesian3.fromDegrees(midLon, midLat, arcHeight),
            Cartesian3.fromDegrees(b.lon, b.lat, 1000),
          ],
          width: 2,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.25,
            taperPower: 0.5,
            color: Color.fromCssColorString("#D4AF37").withAlpha(0.4),
          }),
          distanceDisplayCondition: new DistanceDisplayCondition(0, 2.5e7),
        },
      });
    });

    ds.show = visible;
    viewer.scene.requestRender();

    return () => {
      if (dataSourceRef.current && viewer && !viewer.isDestroyed()) {
        viewer.dataSources.remove(dataSourceRef.current, true);
        dataSourceRef.current = null;
      }
    };
  }, [viewer, projects]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dataSourceRef.current) {
      dataSourceRef.current.show = visible;
    }
    if (viewer && !viewer.isDestroyed()) {
      viewer.scene.requestRender();
    }
  }, [visible, viewer]);

  return null;
}
