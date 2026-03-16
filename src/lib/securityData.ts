/**
 * Global security & infrastructure data — FSI, infrastructure quality, conflict zones.
 * Sources: Fragile States Index (Fund for Peace), World Bank infrastructure,
 * ACLED/Uppsala conflict data (embedded estimates 2024-2026).
 */

export interface SecurityIndicator {
  country: string;
  lat: number;
  lon: number;
  fsi: number;              // Fragile States Index (0-120, higher = more fragile)
  infraQuality: number;     // Infrastructure quality index (1-7, WEF GCI)
  conflictIntensity: number; // 0=none, 1=low, 2=moderate, 3=high, 4=war
  criticalInfra: string[];  // types of critical infrastructure
  riskLevel: "STABLE" | "WARNING" | "ELEVATED" | "CRITICAL" | "CONFLICT";
}

// FSI 2024 + WEF GCI infrastructure + ACLED conflict estimates
export const SECURITY_DATA: SecurityIndicator[] = [
  { country: "Somalia", lat: 5.2, lon: 46.2, fsi: 111.9, infraQuality: 1.8, conflictIntensity: 4, criticalInfra: ["ports", "telecom"], riskLevel: "CONFLICT" },
  { country: "Yemen", lat: 15.6, lon: 48.5, fsi: 111.7, infraQuality: 1.5, conflictIntensity: 4, criticalInfra: ["water", "ports"], riskLevel: "CONFLICT" },
  { country: "South Sudan", lat: 6.9, lon: 31.3, fsi: 110.8, infraQuality: 1.3, conflictIntensity: 3, criticalInfra: ["roads", "water"], riskLevel: "CONFLICT" },
  { country: "Syria", lat: 35.0, lon: 38.0, fsi: 108.4, infraQuality: 2.0, conflictIntensity: 3, criticalInfra: ["energy", "water", "hospitals"], riskLevel: "CONFLICT" },
  { country: "DR Congo", lat: -4.0, lon: 21.8, fsi: 107.3, infraQuality: 1.7, conflictIntensity: 3, criticalInfra: ["mining", "roads"], riskLevel: "CRITICAL" },
  { country: "Sudan", lat: 12.9, lon: 30.2, fsi: 106.5, infraQuality: 1.9, conflictIntensity: 4, criticalInfra: ["oil", "water", "telecom"], riskLevel: "CONFLICT" },
  { country: "Afghanistan", lat: 33.9, lon: 67.7, fsi: 105.2, infraQuality: 1.6, conflictIntensity: 3, criticalInfra: ["roads", "energy"], riskLevel: "CRITICAL" },
  { country: "Myanmar", lat: 19.8, lon: 96.1, fsi: 100.2, infraQuality: 2.4, conflictIntensity: 3, criticalInfra: ["energy", "telecom", "ports"], riskLevel: "CRITICAL" },
  { country: "Nigeria", lat: 9.1, lon: 8.7, fsi: 97.0, infraQuality: 2.7, conflictIntensity: 2, criticalInfra: ["oil", "energy", "telecom"], riskLevel: "ELEVATED" },
  { country: "Ethiopia", lat: 9.1, lon: 40.5, fsi: 95.3, infraQuality: 2.6, conflictIntensity: 2, criticalInfra: ["dams", "roads", "telecom"], riskLevel: "ELEVATED" },
  { country: "Haiti", lat: 19.0, lon: -72.3, fsi: 94.1, infraQuality: 1.8, conflictIntensity: 2, criticalInfra: ["water", "energy", "ports"], riskLevel: "CRITICAL" },
  { country: "Pakistan", lat: 30.4, lon: 69.3, fsi: 88.0, infraQuality: 3.1, conflictIntensity: 2, criticalInfra: ["energy", "water", "nuclear"], riskLevel: "ELEVATED" },
  { country: "Iraq", lat: 33.2, lon: 43.7, fsi: 88.5, infraQuality: 2.8, conflictIntensity: 2, criticalInfra: ["oil", "water", "energy"], riskLevel: "ELEVATED" },
  { country: "Ukraine", lat: 48.4, lon: 31.2, fsi: 85.0, infraQuality: 3.4, conflictIntensity: 4, criticalInfra: ["energy", "nuclear", "grain", "ports"], riskLevel: "CONFLICT" },
  { country: "Libya", lat: 26.3, lon: 17.2, fsi: 85.8, infraQuality: 2.5, conflictIntensity: 2, criticalInfra: ["oil", "water", "ports"], riskLevel: "ELEVATED" },
  { country: "Egypt", lat: 26.8, lon: 30.8, fsi: 78.0, infraQuality: 3.5, conflictIntensity: 1, criticalInfra: ["Suez Canal", "energy", "dams"], riskLevel: "WARNING" },
  { country: "India", lat: 20.6, lon: 79.0, fsi: 72.0, infraQuality: 4.0, conflictIntensity: 1, criticalInfra: ["IT", "energy", "railways", "nuclear"], riskLevel: "WARNING" },
  { country: "Russia", lat: 61.5, lon: 105.3, fsi: 73.0, infraQuality: 4.0, conflictIntensity: 2, criticalInfra: ["oil/gas", "nuclear", "pipelines", "military"], riskLevel: "ELEVATED" },
  { country: "China", lat: 35.9, lon: 104.2, fsi: 68.0, infraQuality: 4.7, conflictIntensity: 1, criticalInfra: ["manufacturing", "ports", "energy", "5G", "dams"], riskLevel: "WARNING" },
  { country: "Brazil", lat: -14.2, lon: -51.9, fsi: 65.0, infraQuality: 3.7, conflictIntensity: 1, criticalInfra: ["Amazon", "hydropower", "agro", "ports"], riskLevel: "WARNING" },
  { country: "Turkey", lat: 38.9, lon: 35.2, fsi: 67.0, infraQuality: 4.3, conflictIntensity: 1, criticalInfra: ["Bosphorus", "energy", "military"], riskLevel: "WARNING" },
  { country: "Mexico", lat: 23.6, lon: -102.6, fsi: 69.0, infraQuality: 3.8, conflictIntensity: 2, criticalInfra: ["oil", "ports", "manufacturing"], riskLevel: "WARNING" },
  { country: "USA", lat: 37.1, lon: -95.7, fsi: 38.0, infraQuality: 5.7, conflictIntensity: 0, criticalInfra: ["grid", "military", "IT", "nuclear", "finance"], riskLevel: "STABLE" },
  { country: "Germany", lat: 51.2, lon: 10.4, fsi: 28.0, infraQuality: 5.6, conflictIntensity: 0, criticalInfra: ["manufacturing", "energy", "autobahn", "finance"], riskLevel: "STABLE" },
  { country: "Japan", lat: 36.2, lon: 138.3, fsi: 31.0, infraQuality: 6.2, conflictIntensity: 0, criticalInfra: ["Shinkansen", "nuclear", "ports", "IT"], riskLevel: "STABLE" },
  { country: "South Korea", lat: 35.9, lon: 127.8, fsi: 33.0, infraQuality: 5.8, conflictIntensity: 1, criticalInfra: ["semiconductor", "5G", "nuclear", "military"], riskLevel: "WARNING" },
  { country: "UK", lat: 55.4, lon: -3.4, fsi: 32.0, infraQuality: 5.5, conflictIntensity: 0, criticalInfra: ["finance", "energy", "military", "NHS"], riskLevel: "STABLE" },
  { country: "Australia", lat: -25.3, lon: 133.8, fsi: 22.0, infraQuality: 5.3, conflictIntensity: 0, criticalInfra: ["mining", "energy", "ports", "telecom"], riskLevel: "STABLE" },
  { country: "France", lat: 46.2, lon: 2.2, fsi: 30.0, infraQuality: 5.9, conflictIntensity: 0, criticalInfra: ["nuclear", "TGV", "military", "finance"], riskLevel: "STABLE" },
  { country: "Canada", lat: 56.1, lon: -106.3, fsi: 20.0, infraQuality: 5.5, conflictIntensity: 0, criticalInfra: ["oil sands", "hydro", "Arctic", "telecom"], riskLevel: "STABLE" },
];

/**
 * Build security context string for AI swarm.
 */
export function buildSecurityContext(): string {
  const conflicts = SECURITY_DATA
    .filter((s) => s.conflictIntensity >= 3)
    .map((s) => `${s.country} (FSI ${s.fsi}, conflict level ${s.conflictIntensity}): ${s.criticalInfra.join(", ")}`)
    .join("\n");

  const fragile = SECURITY_DATA
    .filter((s) => s.fsi > 90)
    .map((s) => `${s.country}: FSI ${s.fsi}, infra ${s.infraQuality}/7`)
    .join("; ");

  return `ACTIVE CONFLICTS:\n${conflicts}\n\nMOST FRAGILE STATES: ${fragile}`;
}
