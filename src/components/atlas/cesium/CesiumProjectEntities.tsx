// sacred flow — Atlas project hotspots rendered as Cesium entities
// Beams rise from surface, NPI projects pulse with gold rings
import { useEffect, useRef } from "react";
import {
  CesiumWidget,
  CustomDataSource,
  Cartesian3,
  Cartesian2,
  Color,
  HeightReference,
  NearFarScalar,
  VerticalOrigin,
  LabelStyle,
  DistanceDisplayCondition,
  PolylineGlowMaterialProperty,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  JulianDate,
  defined,
} from "cesium";

export interface GeoProject {
  id: number;
  name: string;
  lat: number;
  lon: number;
  color: string;
  desc: string;
  status: string;
}

interface CesiumProjectEntitiesProps {
  viewer: CesiumWidget | null;
  projects: GeoProject[];
  onSelect?: (project: GeoProject) => void;
}

const BEAM_HEIGHT = 200000; // sacred flow — 200km beam altitude

export default function CesiumProjectEntities({
  viewer,
  projects,
  onSelect,
}: CesiumProjectEntitiesProps) {
  const dataSourceRef = useRef<CustomDataSource | null>(null);
  const handlerRef = useRef<ScreenSpaceEventHandler | null>(null);

  useEffect(() => {
    if (!viewer || viewer.isDestroyed()) return;

    // sacred flow — create dedicated data source for project entities
    const ds = new CustomDataSource("atlas-projects");
    dataSourceRef.current = ds;
    viewer.dataSources.add(ds);

    projects.forEach((project) => {
      const isNPI = project.status === "\u03A9 CLEARANCE"; // sacred flow — omega projects
      const cesiumColor = Color.fromCssColorString(project.color);
      const surfacePos = Cartesian3.fromDegrees(project.lon, project.lat, 0);
      const beamTopPos = Cartesian3.fromDegrees(project.lon, project.lat, BEAM_HEIGHT);

      // sacred flow — project marker (point + label)
      ds.entities.add({
        id: `project-${project.id}`,
        name: project.name,
        position: Cartesian3.fromDegrees(project.lon, project.lat, isNPI ? 5000 : 3000),
        point: {
          pixelSize: isNPI ? 14 : 10,
          color: cesiumColor,
          outlineColor: Color.WHITE.withAlpha(0.6),
          outlineWidth: 2,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new NearFarScalar(1.0e3, 1.5, 1.0e7, 0.5),
        },
        label: {
          text: project.name,
          font: "11px monospace",
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(0, -20),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new NearFarScalar(1.0e3, 1.0, 8.0e6, 0.3),
          distanceDisplayCondition: new DistanceDisplayCondition(0, 1.5e7),
        },
        description: `<div style="font-family:monospace;padding:8px;">
          <h3 style="color:${project.color};margin:0 0 4px;">${project.name}</h3>
          <p style="margin:0;color:#999;font-size:11px;">${project.desc}</p>
          <span style="color:${project.color};font-size:10px;">${project.status}</span>
        </div>`,
        properties: {
          projectId: project.id,
          projectData: project,
        },
      });

      // sacred flow — vertical beam from surface to sky
      ds.entities.add({
        id: `beam-${project.id}`,
        polyline: {
          positions: [surfacePos, beamTopPos],
          width: isNPI ? 3 : 2,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.3,
            taperPower: 0.8,
            color: cesiumColor.withAlpha(0.6),
          }),
          distanceDisplayCondition: new DistanceDisplayCondition(0, 2.0e7),
        },
      });

      // sacred flow — NPI projects get gold pulsing ring
      if (isNPI) {
        ds.entities.add({
          id: `ring-${project.id}`,
          position: Cartesian3.fromDegrees(project.lon, project.lat),
          ellipse: {
            semiMajorAxis: 80000,
            semiMinorAxis: 80000,
            material: Color.fromCssColorString("#ffd700").withAlpha(0.15),
            outline: true,
            outlineColor: Color.fromCssColorString("#ffd700").withAlpha(0.5),
            outlineWidth: 2,
            height: 100,
            heightReference: HeightReference.RELATIVE_TO_GROUND,
          },
        });
      }
    });

    // sacred flow — click handler for project selection
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handlerRef.current = handler;

    handler.setInputAction((click: { position: Cartesian2 }) => {
      const picked = viewer.scene.pick(click.position);
      if (defined(picked) && picked.id && picked.id.properties) {
        const projectData = picked.id.properties.projectData?.getValue(JulianDate.now());
        if (projectData && onSelect) {
          onSelect(projectData);
        }
      }
      viewer.scene.requestRender();
    }, ScreenSpaceEventType.LEFT_CLICK);

    viewer.scene.requestRender();

    return () => {
      if (handlerRef.current) {
        handlerRef.current.destroy();
        handlerRef.current = null;
      }
      if (dataSourceRef.current && viewer && !viewer.isDestroyed()) {
        viewer.dataSources.remove(dataSourceRef.current, true);
        dataSourceRef.current = null;
      }
    };
  }, [viewer, projects, onSelect]);

  return null;
}
