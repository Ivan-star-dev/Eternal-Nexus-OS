/**
 * USGS Earthquake Feed — live M4.5+ events from the last 24h.
 * Free, no API key required.
 */

export interface EarthquakePoint {
  id: string;
  mag: number;
  place: string;
  lat: number;
  lon: number;
  depth: number;
  time: string;
  tsunami: boolean;
}

export async function fetchRecentEarthquakes(): Promise<EarthquakePoint[]> {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features ?? []).map((f: any) => ({
      id: f.id,
      mag: f.properties.mag,
      place: f.properties.place ?? "Unknown",
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2],
      time: new Date(f.properties.time).toISOString(),
      tsunami: !!f.properties.tsunami,
    }));
  } catch {
    return [];
  }
}
