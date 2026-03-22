/**
 * worldBankData.ts — World Bank Open Data API (DATA_LAYER_1)
 *
 * Source: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 * Free, no API key required, CORS-enabled, stable REST API.
 * High uptime, normalised data, maintained by the World Bank Group.
 *
 * Used in: useOrganLiveStatus → INVESTOR organ (NL macro context)
 *
 * Fallback contract: returns null on any failure — callers must handle null
 * without crashing. Layer 1 rule: graceful degradation always.
 *
 * sacred-flow: PLv5.1 | DATA_LAYER_1 | 2026-03-20
 */

const WB_API = 'https://api.worldbank.org/v2';

export interface WorldBankEntry {
  /** Human-readable country name (e.g. "Netherlands") */
  country: string;
  /** ISO 2-letter code (uppercased, e.g. "NL") */
  countryCode: string;
  /** Human-readable indicator name (e.g. "GDP (current US$)") */
  indicator: string;
  /** Numeric value — null if the World Bank has no data for that year */
  value: number | null;
  /** Year of the most recent data point (e.g. "2022") */
  date: string;
}

/**
 * Fetch the most recent value for a World Bank indicator.
 *
 * @param iso2Code  ISO 3166-1 alpha-2 country code (e.g. "nl", "pt", "us")
 * @param indicatorCode  World Bank indicator code (e.g. "NY.GDP.MKTP.CD")
 * @returns The most recent entry, or null on any failure.
 *
 * Common indicators:
 *   NY.GDP.MKTP.CD  — GDP, current USD
 *   BX.KLT.DINV.CD.WD — FDI net inflows, BoP current USD
 *   SP.POP.TOTL     — Total population
 *   NY.GNP.PCAP.CD  — GNI per capita, Atlas method (current USD)
 */
export async function fetchWorldBankIndicator(
  iso2Code: string,
  indicatorCode: string
): Promise<WorldBankEntry | null> {
  try {
    const url =
      `${WB_API}/country/${encodeURIComponent(iso2Code)}` +
      `/indicator/${encodeURIComponent(indicatorCode)}` +
      `?format=json&mrv=1&per_page=1`;

    const res = await fetch(url);
    if (!res.ok) return null;

    // World Bank returns [{ pages, total, ... }, [entries]] — a 2-element array
    const payload: [unknown, unknown[]] = await res.json();
    const entries = Array.isArray(payload[1]) ? payload[1] : [];
    const entry = entries[0] as any;
    if (!entry) return null;

    return {
      country: entry.country?.value ?? iso2Code.toUpperCase(),
      countryCode: iso2Code.toUpperCase(),
      indicator: entry.indicator?.value ?? indicatorCode,
      value: typeof entry.value === 'number' ? entry.value : null,
      date: entry.date ?? '',
    };
  } catch {
    return null;
  }
}

/**
 * Format a USD value into a short, human-readable string.
 * Examples: 990_000_000_000 → "$990B" | 1_100_000_000_000 → "$1.1T"
 */
export function formatUSD(value: number | null): string {
  if (value === null || isNaN(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (abs >= 1e9)  return `$${Math.round(value / 1e9)}B`;
  if (abs >= 1e6)  return `$${Math.round(value / 1e6)}M`;
  return `$${value.toLocaleString()}`;
}
