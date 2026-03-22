// sacred flow — Atlas data visualization layers on CesiumJS globe
// Pollution, earthquakes, CO2 — real data rendered as entities
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
} from "cesium";
import type { PollutionPoint } from "@/lib/dataSources";
import type { EarthquakePoint } from "@/lib/earthquakeData";

interface CesiumDataLayersProps {
  viewer: CesiumWidget | null;
  visible: boolean;
  co2Records?: any[];
  pollutionData?: PollutionPoint[];
  earthquakes?: EarthquakePoint[];
}

export default function CesiumDataLayers({
  viewer,
  visible,
  co2Records,
  pollutionData,
  earthquakes,
}: CesiumDataLayersProps) {
  const co2SourceRef = useRef<CustomDataSource | null>(null);
  const pollutionSourceRef = useRef<CustomDataSource | null>(null);
  const earthquakeSourceRef = useRef<CustomDataSource | null>(null);

  // sacred flow — CO2 heatmap layer
  useEffect(() => {
    if (!viewer || viewer.isDestroyed() || !co2Records?.length) return;

    const ds = new CustomDataSource("co2-heatmap");
    co2SourceRef.current = ds;
    viewer.dataSources.add(ds);

    co2Records.slice(0, 200).forEach((record, i) => {
      if (!record.lat || !record.lon || !record.value) return;
      const intensity = Math.min(record.value / 15, 1);
      const color = Color.fromHsl(0.08 - intensity * 0.08, 0.9, 0.5 + intensity * 0.2, 0.4);

      ds.entities.add({
        id: `co2-${i}`,
        position: Cartesian3.fromDegrees(record.lon, record.lat),
        ellipse: {
          semiMajorAxis: 150000 + intensity * 200000,
          semiMinorAxis: 150000 + intensity * 200000,
          material: color,
          height: 50,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
        },
      });
    });

    ds.show = visible;
    viewer.scene.requestRender();

    return () => {
      if (co2SourceRef.current && viewer && !viewer.isDestroyed()) {
        viewer.dataSources.remove(co2SourceRef.current, true);
        co2SourceRef.current = null;
      }
    };
  }, [viewer, co2Records]); // eslint-disable-line react-hooks/exhaustive-deps

  // sacred flow — pollution layer
  useEffect(() => {
    if (!viewer || viewer.isDestroyed() || !pollutionData?.length) return;

    const ds = new CustomDataSource("pollution");
    pollutionSourceRef.current = ds;
    viewer.dataSources.add(ds);

    pollutionData.slice(0, 300).forEach((point, i) => {
      const intensity = Math.min((point.aqi || 50) / 300, 1);
      const color = Color.fromHsl(0.33 - intensity * 0.33, 0.8, 0.5, 0.35);

      ds.entities.add({
        id: `pollution-${i}`,
        position: Cartesian3.fromDegrees(point.lon, point.lat),
        point: {
          pixelSize: 6 + intensity * 10,
          color,
          outlineColor: color.withAlpha(0.2),
          outlineWidth: 3,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new NearFarScalar(1.0e3, 1.2, 1.0e7, 0.3),
        },
      });
    });

    ds.show = visible;
    viewer.scene.requestRender();

    return () => {
      if (pollutionSourceRef.current && viewer && !viewer.isDestroyed()) {
        viewer.dataSources.remove(pollutionSourceRef.current, true);
        pollutionSourceRef.current = null;
      }
    };
  }, [viewer, pollutionData]); // eslint-disable-line react-hooks/exhaustive-deps

  // sacred flow — earthquake layer with magnitude-scaled circles
  useEffect(() => {
    if (!viewer || viewer.isDestroyed() || !earthquakes?.length) return;

    const ds = new CustomDataSource("earthquakes");
    earthquakeSourceRef.current = ds;
    viewer.dataSources.add(ds);

    earthquakes.slice(0, 200).forEach((quake, i) => {
      const mag = quake.mag || 3;
      const radius = Math.pow(2, mag) * 5000;
      const color = mag > 6
        ? Color.RED.withAlpha(0.5)
        : mag > 4
        ? Color.ORANGE.withAlpha(0.4)
        : Color.YELLOW.withAlpha(0.3);

      ds.entities.add({
        id: `quake-${i}`,
        position: Cartesian3.fromDegrees(quake.lon, quake.lat),
        ellipse: {
          semiMajorAxis: radius,
          semiMinorAxis: radius,
          material: color,
          outline: true,
          outlineColor: color.withAlpha(0.8),
          outlineWidth: 1,
          height: 100,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
        },
        label: {
          text: `M${mag.toFixed(1)}`,
          font: "9px monospace",
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 1,
          style: LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(0, -10),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new NearFarScalar(1.0e3, 1.0, 5.0e6, 0.2),
          distanceDisplayCondition: new DistanceDisplayCondition(0, 5.0e6),
        },
      });
    });

    ds.show = visible;
    viewer.scene.requestRender();

    return () => {
      if (earthquakeSourceRef.current && viewer && !viewer.isDestroyed()) {
        viewer.dataSources.remove(earthquakeSourceRef.current, true);
        earthquakeSourceRef.current = null;
      }
    };
  }, [viewer, earthquakes]); // eslint-disable-line react-hooks/exhaustive-deps

  // sacred flow — toggle visibility
  useEffect(() => {
    [co2SourceRef, pollutionSourceRef, earthquakeSourceRef].forEach((ref) => {
      if (ref.current) {
        ref.current.show = visible;
      }
    });
    if (viewer && !viewer.isDestroyed()) {
      viewer.scene.requestRender();
    }
  }, [visible, viewer]);

  return null;
}
