/**
 * useWorldBankProject — V4-ATLAS-001
 *
 * Fetches World Bank macro indicators (GDP, population, FDI) for the country
 * of a selected Atlas project. Graceful degradation: returns null on any failure.
 */

import { useState, useEffect } from "react";
import type { GeoProject } from "@/components/atlas/cesium/CesiumProjectEntities";
import { fetchWorldBankIndicator, type WorldBankEntry } from "@/lib/worldBankData";

// ---------------------------------------------------------------------------
// Country code map — keyed by canonical project ID (1–12)
// ---------------------------------------------------------------------------

const PROJECT_COUNTRY_MAP: Record<number, string> = {
  1: "cv",  // Pico do Fogo — Cabo Verde
  2: "nl",  // Delta Spine NL
  3: "es",  // Geocore Power — Spain
  4: "pt",  // Terra Lenta — Portugal
  5: "fr",  // Fusion Core — France
  6: "jp",  // Chip Fold — Japan
  7: "nl",  // Next Path Infra NL
  8: "pt",  // Next Path Infra PT
  9: "br",  // Next Path Infra BR
  10: "us", // Next Path Infra US
  11: "ae", // Next Path Infra AE
  12: "jp", // Next Path Infra JP
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WorldBankProjectData {
  countryCode: string;
  countryName: string;
  gdp: WorldBankEntry | null;
  population: WorldBankEntry | null;
  fdi: WorldBankEntry | null;
  loading: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWorldBankProject(project: GeoProject | null): WorldBankProjectData | null {
  const [data, setData] = useState<WorldBankProjectData | null>(null);

  useEffect(() => {
    if (!project) {
      setData(null);
      return;
    }

    const iso = PROJECT_COUNTRY_MAP[project.id];
    if (!iso) {
      setData(null);
      return;
    }

    let cancelled = false;
    setData({
      countryCode: iso.toUpperCase(),
      countryName: project.name,
      gdp: null,
      population: null,
      fdi: null,
      loading: true,
    });

    Promise.all([
      fetchWorldBankIndicator(iso, "NY.GDP.MKTP.CD"),
      fetchWorldBankIndicator(iso, "SP.POP.TOTL"),
      fetchWorldBankIndicator(iso, "BX.KLT.DINV.CD.WD"),
    ]).then(([gdp, population, fdi]) => {
      if (cancelled) return;
      setData({
        countryCode: iso.toUpperCase(),
        countryName: gdp?.country ?? iso.toUpperCase(),
        gdp,
        population,
        fdi,
        loading: false,
      });
    }).catch(() => {
      if (cancelled) return;
      setData(null);
    });

    return () => { cancelled = true; };
  }, [project?.id]);

  return data;
}
