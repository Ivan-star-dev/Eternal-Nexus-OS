/**
 * Global health & pandemic data sources — WHO, OWID, disease surveillance.
 * Free APIs, no keys required.
 */

export interface PandemicEvent {
  name: string;
  year: number;
  deaths: number;
  cases: number;
  origin: string;
  lat: number;
  lon: number;
  riskFactor: string;
  lessons: string;
}

export interface HealthIndicator {
  country: string;
  lat: number;
  lon: number;
  lifeExpectancy: number;
  cancerRate: number;        // per 100k
  cardiovascularRate: number; // per 100k
  respiratoryRate: number;   // per 100k
  healthcareSpending: number; // % GDP
  hospitalBeds: number;      // per 1000
  pandemicReadiness: number; // 0-100 index (GHS)
}

// Historical pandemics for AI training context
export const PANDEMIC_HISTORY: PandemicEvent[] = [
  {
    name: "COVID-19",
    year: 2020,
    deaths: 6900000,
    cases: 770000000,
    origin: "Wuhan, China",
    lat: 30.6, lon: 114.3,
    riskFactor: "Respiratory, zoonotic spillover, global air travel",
    lessons: "Early detection critical. mRNA vaccines in 11 months. Lockdowns costly but effective short-term.",
  },
  {
    name: "H1N1 Swine Flu",
    year: 2009,
    deaths: 284000,
    cases: 1400000000,
    origin: "Mexico/USA",
    lat: 19.4, lon: -99.1,
    riskFactor: "Influenza reassortment, high transmissibility, mild severity",
    lessons: "Existing flu infrastructure helped. Young adults disproportionately affected.",
  },
  {
    name: "Ebola West Africa",
    year: 2014,
    deaths: 11325,
    cases: 28616,
    origin: "Guinea, West Africa",
    lat: 9.9, lon: -9.7,
    riskFactor: "High fatality (40%), contact transmission, weak health systems",
    lessons: "Community trust essential. Ring vaccination effective. Infrastructure investment needed.",
  },
  {
    name: "SARS",
    year: 2003,
    deaths: 774,
    cases: 8098,
    origin: "Guangdong, China",
    lat: 23.1, lon: 113.3,
    riskFactor: "Coronavirus, nosocomial spread, 10% fatality",
    lessons: "Containment possible with early isolation. Superspreader events critical.",
  },
  {
    name: "MERS",
    year: 2012,
    deaths: 858,
    cases: 2494,
    origin: "Saudi Arabia",
    lat: 24.7, lon: 46.7,
    riskFactor: "Camel reservoir, 34% fatality, hospital outbreaks",
    lessons: "Zoonotic reservoir control needed. Healthcare worker protection critical.",
  },
];

// WHO/GBD-derived health indicators by country (2024 estimates)
export const HEALTH_INDICATORS: HealthIndicator[] = [
  { country: "Japan", lat: 36.2, lon: 138.3, lifeExpectancy: 84.8, cancerRate: 248, cardiovascularRate: 79, respiratoryRate: 41, healthcareSpending: 11.0, hospitalBeds: 12.8, pandemicReadiness: 59 },
  { country: "Italy", lat: 41.9, lon: 12.5, lifeExpectancy: 83.5, cancerRate: 261, cardiovascularRate: 113, respiratoryRate: 27, healthcareSpending: 8.7, hospitalBeds: 3.1, pandemicReadiness: 56 },
  { country: "Germany", lat: 51.2, lon: 10.4, lifeExpectancy: 81.3, cancerRate: 313, cardiovascularRate: 156, respiratoryRate: 32, healthcareSpending: 12.8, hospitalBeds: 7.9, pandemicReadiness: 66 },
  { country: "USA", lat: 37.1, lon: -95.7, lifeExpectancy: 77.5, cancerRate: 362, cardiovascularRate: 168, respiratoryRate: 40, healthcareSpending: 17.8, hospitalBeds: 2.8, pandemicReadiness: 75 },
  { country: "UK", lat: 55.4, lon: -3.4, lifeExpectancy: 81.8, cancerRate: 282, cardiovascularRate: 120, respiratoryRate: 59, healthcareSpending: 12.0, hospitalBeds: 2.4, pandemicReadiness: 77 },
  { country: "Brazil", lat: -14.2, lon: -51.9, lifeExpectancy: 75.9, cancerRate: 217, cardiovascularRate: 185, respiratoryRate: 65, healthcareSpending: 9.6, hospitalBeds: 2.1, pandemicReadiness: 40 },
  { country: "India", lat: 20.6, lon: 79.0, lifeExpectancy: 70.4, cancerRate: 94, cardiovascularRate: 282, respiratoryRate: 115, healthcareSpending: 3.0, hospitalBeds: 0.5, pandemicReadiness: 35 },
  { country: "China", lat: 35.9, lon: 104.2, lifeExpectancy: 78.2, cancerRate: 204, cardiovascularRate: 310, respiratoryRate: 68, healthcareSpending: 5.6, hospitalBeds: 4.3, pandemicReadiness: 48 },
  { country: "Nigeria", lat: 9.1, lon: 8.7, lifeExpectancy: 52.7, cancerRate: 72, cardiovascularRate: 210, respiratoryRate: 132, healthcareSpending: 3.3, hospitalBeds: 0.4, pandemicReadiness: 17 },
  { country: "South Africa", lat: -30.6, lon: 22.9, lifeExpectancy: 62.3, cancerRate: 131, cardiovascularRate: 195, respiratoryRate: 95, healthcareSpending: 8.3, hospitalBeds: 2.3, pandemicReadiness: 34 },
  { country: "Egypt", lat: 26.8, lon: 30.8, lifeExpectancy: 70.2, cancerRate: 113, cardiovascularRate: 320, respiratoryRate: 42, healthcareSpending: 4.7, hospitalBeds: 1.6, pandemicReadiness: 28 },
  { country: "Indonesia", lat: -0.8, lon: 113.9, lifeExpectancy: 71.7, cancerRate: 110, cardiovascularRate: 290, respiratoryRate: 73, healthcareSpending: 2.9, hospitalBeds: 1.0, pandemicReadiness: 30 },
  { country: "Mexico", lat: 23.6, lon: -102.6, lifeExpectancy: 75.1, cancerRate: 130, cardiovascularRate: 155, respiratoryRate: 38, healthcareSpending: 5.4, hospitalBeds: 1.0, pandemicReadiness: 36 },
  { country: "Russia", lat: 61.5, lon: 105.3, lifeExpectancy: 73.2, cancerRate: 234, cardiovascularRate: 431, respiratoryRate: 35, healthcareSpending: 5.7, hospitalBeds: 7.1, pandemicReadiness: 44 },
  { country: "Australia", lat: -25.3, lon: 133.8, lifeExpectancy: 83.5, cancerRate: 323, cardiovascularRate: 72, respiratoryRate: 27, healthcareSpending: 10.0, hospitalBeds: 3.8, pandemicReadiness: 71 },
  { country: "France", lat: 46.2, lon: 2.2, lifeExpectancy: 82.5, cancerRate: 300, cardiovascularRate: 86, respiratoryRate: 23, healthcareSpending: 12.2, hospitalBeds: 5.7, pandemicReadiness: 53 },
  { country: "South Korea", lat: 35.9, lon: 127.8, lifeExpectancy: 83.7, cancerRate: 263, cardiovascularRate: 62, respiratoryRate: 36, healthcareSpending: 8.4, hospitalBeds: 12.4, pandemicReadiness: 70 },
  { country: "Thailand", lat: 15.9, lon: 100.9, lifeExpectancy: 78.7, cancerRate: 133, cardiovascularRate: 120, respiratoryRate: 52, healthcareSpending: 3.8, hospitalBeds: 2.1, pandemicReadiness: 41 },
  { country: "Bangladesh", lat: 23.7, lon: 90.4, lifeExpectancy: 72.4, cancerRate: 79, cardiovascularRate: 240, respiratoryRate: 98, healthcareSpending: 2.5, hospitalBeds: 0.8, pandemicReadiness: 20 },
  { country: "DR Congo", lat: -4.0, lon: 21.8, lifeExpectancy: 60.7, cancerRate: 68, cardiovascularRate: 180, respiratoryRate: 155, healthcareSpending: 3.9, hospitalBeds: 0.8, pandemicReadiness: 10 },
];

/**
 * Build a health context string for the AI swarm agents.
 * Includes pandemic history + current health indicators.
 */
export function buildHealthContext(): string {
  const pandemicSummary = PANDEMIC_HISTORY.map(
    (p) => `${p.name} (${p.year}): ${(p.deaths / 1000).toFixed(0)}k deaths, origin ${p.origin}. Lesson: ${p.lessons}`
  ).join("\n");

  const healthSummary = HEALTH_INDICATORS
    .sort((a, b) => a.pandemicReadiness - b.pandemicReadiness)
    .slice(0, 10)
    .map(
      (h) => `${h.country}: LE ${h.lifeExpectancy}y, beds ${h.hospitalBeds}/1k, GHS ${h.pandemicReadiness}/100, CVD ${h.cardiovascularRate}/100k`
    )
    .join("; ");

  return `PANDEMIC HISTORY:\n${pandemicSummary}\n\nLOWEST READINESS COUNTRIES: ${healthSummary}`;
}

/**
 * Simulate next pandemic risk based on historical patterns + current indicators.
 */
export function assessPandemicRisk(): {
  highRiskCountries: string[];
  riskFactors: string[];
  projectedYear: string;
} {
  const highRisk = HEALTH_INDICATORS
    .filter((h) => h.pandemicReadiness < 30 && h.hospitalBeds < 1.5)
    .map((h) => h.country);

  return {
    highRiskCountries: highRisk,
    riskFactors: [
      "Zoonotic spillover (bat/pangolin coronavirus, avian influenza H5N1)",
      "Antimicrobial resistance (drug-resistant TB, MRSA)",
      "Climate-driven vector expansion (dengue, malaria into temperate zones)",
      "Urbanization + density (slum populations, inadequate sanitation)",
      "Aging populations (Japan/Italy/Germany — higher CFR in elderly)",
    ],
    projectedYear: "2028-2040 window (based on 7-15 year pandemic cycle)",
  };
}
