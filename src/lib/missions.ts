/**
 * missions.ts — K-07 IMPL
 * V6-MISSIONS-IMPL-001 | 2026-03-27
 *
 * Mission type system: interfaces, mock data, utility functions.
 * Missions represent structured impact operations the platform enables.
 */

export type MissionStatus = 'active' | 'planning' | 'completed' | 'paused';

export type MissionCategory = 'climate' | 'infrastructure' | 'research' | 'education' | 'health';

export interface Mission {
  id: string;
  title: string;
  category: MissionCategory;
  status: MissionStatus;
  description: string;
  location: string;
  startDate: string; // ISO date string
  progress: number;  // 0–100
  teamSize: number;
  budget: number;    // USD
}

export const MOCK_MISSIONS: Mission[] = [
  {
    id: "msn-001",
    title: "DeltaSpine Grid Stabilisation",
    category: "infrastructure",
    status: "active",
    description:
      "Deploy phase-2 magnetic coupling arrays across the Rotterdam test corridor to establish a self-healing power grid backbone.",
    location: "Rotterdam, Netherlands",
    startDate: "2026-01-15",
    progress: 67,
    teamSize: 18,
    budget: 4_200_000,
  },
  {
    id: "msn-002",
    title: "Sahel Reforestation Network",
    category: "climate",
    status: "active",
    description:
      "Coordinate drone-seeding operations and soil-moisture sensors across 120 km² of degraded Sahelian land.",
    location: "Burkina Faso / Mali Border",
    startDate: "2025-11-01",
    progress: 43,
    teamSize: 34,
    budget: 2_800_000,
  },
  {
    id: "msn-003",
    title: "GeoCore MHD Lab Expansion",
    category: "research",
    status: "active",
    description:
      "Scale graphene-MHD test chambers to 10 m³ and target 50%+ conversion efficiency for next field deployment.",
    location: "Fogo, Cabo Verde",
    startDate: "2026-02-08",
    progress: 29,
    teamSize: 11,
    budget: 1_650_000,
  },
  {
    id: "msn-004",
    title: "Nexus Literacy Programme — West Africa",
    category: "education",
    status: "planning",
    description:
      "Establish 40 off-grid digital learning hubs with AI-tutored curricula in Wolof, Bambara, and French.",
    location: "Senegal & Mali",
    startDate: "2026-06-01",
    progress: 12,
    teamSize: 7,
    budget: 900_000,
  },
  {
    id: "msn-005",
    title: "Terra Lenta Flood-Health Corridor",
    category: "health",
    status: "completed",
    description:
      "Deliver mobile clinics and clean-water stations to 18 riverside communities ahead of annual flood season.",
    location: "Amazônia, Brazil",
    startDate: "2025-07-20",
    progress: 100,
    teamSize: 22,
    budget: 1_100_000,
  },
  {
    id: "msn-006",
    title: "Fusion Core Nano-Grid Pilot",
    category: "research",
    status: "paused",
    description:
      "Prototype a 100 kW modular fusion micro-reactor for island grid decarbonisation. Paused pending safety certification.",
    location: "Azores, Portugal",
    startDate: "2025-09-03",
    progress: 55,
    teamSize: 9,
    budget: 3_500_000,
  },
];

/**
 * Returns missions filtered by status.
 */
export function getMissionsByStatus(status: MissionStatus): Mission[] {
  return MOCK_MISSIONS.filter((m) => m.status === status);
}

/**
 * Returns missions filtered by category.
 */
export function getMissionsByCategory(category: MissionCategory): Mission[] {
  return MOCK_MISSIONS.filter((m) => m.category === category);
}
