/**
 * useResearchFeed.ts
 * Research feed data hook — mock data with Supabase-ready query shape.
 *
 * Canon: V5-RESEARCH-IMPL-001 · K-07 IMPL · K-08 PIPELINE
 * @cursor | 2026-03-27
 */

export type ResearchCategory =
  | "Climate"
  | "Seismic"
  | "Infrastructure"
  | "AI"
  | "Social";

export interface ResearchItem {
  id: string;
  title: string;
  category: ResearchCategory;
  abstract: string;
  date: string; // ISO date string
  readTime: number; // minutes
  tags: string[];
}

// ─── Mock data — 6 research items ────────────────────────────────────────────
// Shape mirrors the Supabase query result: SELECT id, title, category, abstract, date, read_time, tags FROM research_items ORDER BY date DESC
const MOCK_RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: "ri-001",
    title: "Cascading Climate Tipping Points: A Systems-Level Risk Model",
    category: "Climate",
    abstract:
      "An integrated model mapping interdependencies between nine confirmed climate tipping points, quantifying the probability of cascade activation under 1.5°C, 2°C, and 3°C warming scenarios. Results indicate non-linear acceleration above 1.8°C.",
    date: "2026-03-20",
    readTime: 12,
    tags: ["tipping-points", "systems-model", "IPCC", "risk"],
  },
  {
    id: "ri-002",
    title: "Deep-Focus Seismicity Patterns in the Iberian Peninsula: 2020–2026",
    category: "Seismic",
    abstract:
      "High-resolution seismograph data from 142 stations reveals a 23% increase in micro-seismic events along the Azores–Gibraltar fault line. New clustering algorithm isolates precursor signatures with 89% precision.",
    date: "2026-03-14",
    readTime: 9,
    tags: ["seismograph", "fault-lines", "Iberia", "clustering"],
  },
  {
    id: "ri-003",
    title:
      "Resilience Scoring for Critical Infrastructure Under Compound Hazards",
    category: "Infrastructure",
    abstract:
      "A composite resilience index applied to 340 water, energy, and transport nodes across 18 countries. Infrastructure built before 1990 scores 41% lower under compound hazard scenarios combining flood, heat, and cyber stress.",
    date: "2026-03-08",
    readTime: 15,
    tags: ["resilience", "compound-hazards", "water", "energy"],
  },
  {
    id: "ri-004",
    title: "Autonomous Knowledge Graphs as Planetary Sensor Networks",
    category: "AI",
    abstract:
      "We propose an architecture where distributed LLM agents continuously update a shared knowledge graph by processing satellite feeds, sensor telemetry, and open-source intelligence. Latency benchmarks show 94ms median update cycles.",
    date: "2026-02-28",
    readTime: 11,
    tags: ["knowledge-graph", "LLM", "satellite", "edge-AI"],
  },
  {
    id: "ri-005",
    title:
      "Migration Pressure Indices and Social Cohesion in Mid-Sized European Cities",
    category: "Social",
    abstract:
      "Longitudinal study across 28 cities (2018–2025) correlating migration pressure indices with social cohesion indicators. Cities with proactive integration policies show 2.3× higher cohesion scores, independent of pressure magnitude.",
    date: "2026-02-15",
    readTime: 14,
    tags: ["migration", "social-cohesion", "urban", "policy"],
  },
  {
    id: "ri-006",
    title:
      "Solar Forcing Anomalies and Their Interaction with Anthropogenic Warming",
    category: "Climate",
    abstract:
      "Analysis of 47-year solar irradiance records alongside CMIP6 forcing datasets reveals that current solar minimum conditions are masking up to 0.18°C of anthropogenic warming, with rebound risk projected for Solar Cycle 26.",
    date: "2026-01-30",
    readTime: 10,
    tags: ["solar-cycle", "irradiance", "CMIP6", "forcing"],
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseResearchFeedOptions {
  category?: ResearchCategory | "All";
}

interface UseResearchFeedResult {
  items: ResearchItem[];
  filterByCategory: (category: ResearchCategory | "All") => ResearchItem[];
  allCategories: ResearchCategory[];
}

/**
 * useResearchFeed
 *
 * Returns research items filtered by category.
 * Supabase-ready: when backend is wired, replace MOCK_RESEARCH_ITEMS
 * with: `const { data } = await supabase.from('research_items').select('*').order('date', { ascending: false })`
 */
export function useResearchFeed(
  options: UseResearchFeedOptions = {}
): UseResearchFeedResult {
  const { category = "All" } = options;

  const filterByCategory = (cat: ResearchCategory | "All"): ResearchItem[] => {
    if (cat === "All") return MOCK_RESEARCH_ITEMS;
    return MOCK_RESEARCH_ITEMS.filter((item) => item.category === cat);
  };

  const items = filterByCategory(category);

  const allCategories: ResearchCategory[] = [
    "Climate",
    "Seismic",
    "Infrastructure",
    "AI",
    "Social",
  ];

  return { items, filterByCategory, allCategories };
}
