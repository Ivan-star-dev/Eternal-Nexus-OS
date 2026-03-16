import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Data Ocean — Unified data fetcher for NOAA, World Bank, NASA.
 * Retry with exponential backoff. Returns unified JSON.
 */

async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
      if (res.status === 429 && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      return res;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

// ═══ NOAA — Global climate anomalies ═══
async function fetchNOAA() {
  try {
    // NOAA Global Monitoring monthly report API (public, no key)
    const res = await fetchWithRetry(
      "https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/globe/land_ocean/1/0/2020-2026.json"
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[NOAA] HTTP ${res.status}: ${body}`);
      return { source: "noaa", status: "error", error: `HTTP ${res.status}`, data: null };
    }
    const json = await res.json();
    
    // Extract recent data points
    const dataEntries = json?.data ? Object.entries(json.data).slice(-24) : [];
    const records = dataEntries.map(([key, val]: [string, any]) => ({
      period: key,
      anomaly: parseFloat(val?.value ?? "0"),
    }));

    return {
      source: "noaa",
      status: "ok",
      label: "Global Temperature Anomaly (°C vs 20th century avg)",
      records,
      updated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[NOAA] Fetch failed:", err);
    return { source: "noaa", status: "error", error: String(err), data: null };
  }
}

// ═══ World Bank — CO2 emissions per capita ═══
async function fetchWorldBank() {
  try {
    const res = await fetchWithRetry(
      "https://api.worldbank.org/v2/country/WLD;USA;CHN;IND;BRA;DEU;NLD;PRT;JPN/indicator/EN.ATM.CO2E.PC?format=json&per_page=200&date=2015:2023&source=2"
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[WorldBank] HTTP ${res.status}: ${body}`);
      return { source: "worldbank", status: "error", error: `HTTP ${res.status}`, data: null };
    }
    const json = await res.json();
    const entries = json?.[1] ?? [];

    const records = entries
      .filter((e: any) => e.value !== null)
      .map((e: any) => ({
        country: e.country?.value ?? e.countryiso3code,
        countryCode: e.countryiso3code,
        year: parseInt(e.date),
        co2PerCapita: e.value,
      }));

    return {
      source: "worldbank",
      status: "ok",
      label: "CO2 Emissions Per Capita (metric tons)",
      indicator: "EN.ATM.CO2E.PC",
      records,
      updated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[WorldBank] Fetch failed:", err);
    return { source: "worldbank", status: "error", error: String(err), data: null };
  }
}

// ═══ NASA — DONKI (Space Weather Notifications) ═══
async function fetchNASA() {
  try {
    // NASA DONKI API — free with DEMO_KEY (30 req/hr, 50/day)
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
    
    const res = await fetchWithRetry(
      `https://api.nasa.gov/DONKI/notifications?startDate=${thirtyDaysAgo}&endDate=${today}&type=all&api_key=DEMO_KEY`
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[NASA] HTTP ${res.status}: ${body}`);
      return { source: "nasa", status: "error", error: `HTTP ${res.status}`, data: null };
    }
    const json = await res.json();

    const records = (json ?? []).slice(0, 20).map((n: any) => ({
      messageType: n.messageType,
      messageID: n.messageID,
      messageBody: (n.messageBody ?? "").slice(0, 300),
      messageIssueTime: n.messageIssueTime,
    }));

    return {
      source: "nasa",
      status: "ok",
      label: "NASA Space Weather Notifications (DONKI)",
      records,
      updated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[NASA] Fetch failed:", err);
    return { source: "nasa", status: "error", error: String(err), data: null };
  }
}

// ═══ World Bank — GDP per capita ═══
async function fetchWorldBankGDP() {
  try {
    const res = await fetchWithRetry(
      "https://api.worldbank.org/v2/country/WLD;USA;CHN;IND;BRA;DEU;NLD;PRT;JPN/indicator/NY.GDP.PCAP.CD?format=json&per_page=200&date=2018:2023&source=2"
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[WorldBank GDP] HTTP ${res.status}: ${body}`);
      return { source: "worldbank_gdp", status: "error", error: `HTTP ${res.status}`, data: null };
    }
    const json = await res.json();
    const entries = json?.[1] ?? [];

    const records = entries
      .filter((e: any) => e.value !== null)
      .map((e: any) => ({
        country: e.country?.value ?? e.countryiso3code,
        countryCode: e.countryiso3code,
        year: parseInt(e.date),
        gdpPerCapita: e.value,
      }));

    return {
      source: "worldbank_gdp",
      status: "ok",
      label: "GDP Per Capita (current US$)",
      indicator: "NY.GDP.PCAP.CD",
      records,
      updated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[WorldBank GDP] Fetch failed:", err);
    return { source: "worldbank_gdp", status: "error", error: String(err), data: null };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parallel fetch — all sources at once
    const [noaa, worldbankCO2, worldbankGDP, nasa] = await Promise.allSettled([
      fetchNOAA(),
      fetchWorldBank(),
      fetchWorldBankGDP(),
      fetchNASA(),
    ]);

    const result = {
      timestamp: new Date().toISOString(),
      sources: {
        noaa: noaa.status === "fulfilled" ? noaa.value : { source: "noaa", status: "error", error: "Promise rejected" },
        worldbank_co2: worldbankCO2.status === "fulfilled" ? worldbankCO2.value : { source: "worldbank", status: "error", error: "Promise rejected" },
        worldbank_gdp: worldbankGDP.status === "fulfilled" ? worldbankGDP.value : { source: "worldbank_gdp", status: "error", error: "Promise rejected" },
        nasa: nasa.status === "fulfilled" ? nasa.value : { source: "nasa", status: "error", error: "Promise rejected" },
      },
      health: {
        noaa: noaa.status === "fulfilled" && (noaa.value as any).status === "ok",
        worldbank_co2: worldbankCO2.status === "fulfilled" && (worldbankCO2.value as any).status === "ok",
        worldbank_gdp: worldbankGDP.status === "fulfilled" && (worldbankGDP.value as any).status === "ok",
        nasa: nasa.status === "fulfilled" && (nasa.value as any).status === "ok",
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
    });
  } catch (err) {
    console.error("[data-ocean]", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
