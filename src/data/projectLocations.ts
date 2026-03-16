export interface ProjectLocation {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  status: "ACTIVE" | "RESEARCH" | "PLANNING";
  color: string;
}

const projectLocations: ProjectLocation[] = [
  {
    id: "deltaspine-nl",
    number: "NPI-001",
    title: "DeltaSpine NL",
    subtitle: "Modular Underwater Infrastructure",
    lat: 52.37,
    lng: 4.9,
    status: "ACTIVE",
    color: "#D4AF37",
  },
  {
    id: "geocore-power",
    number: "NPI-002",
    title: "GeoCore Power",
    subtitle: "Volcanic EGS — Graphene MHD",
    lat: 14.95,
    lng: -24.34,
    status: "ACTIVE",
    color: "#e74c3c",
  },
  {
    id: "terra-lenta",
    number: "NPI-003",
    title: "Terra Lenta",
    subtitle: "Planetary Rotation Engineering",
    lat: -15.78,
    lng: -47.93,
    status: "RESEARCH",
    color: "#0A9396",
  },
  {
    id: "fusion-core",
    number: "NPI-004",
    title: "Fusion Core",
    subtitle: "Systemic Integration Platform",
    lat: 46.23,
    lng: 6.05,
    status: "PLANNING",
    color: "#9b59b6",
  },
  {
    id: "chip-fold",
    number: "NPI-005",
    title: "Chip Fold",
    subtitle: "CNF Organic Computing",
    lat: 35.68,
    lng: 139.69,
    status: "ACTIVE",
    color: "#2ecc71",
  },
];

export function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

export default projectLocations;
