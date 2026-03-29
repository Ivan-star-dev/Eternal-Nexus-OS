/**
 * useProjectData — V6-PROJECT-DETAIL-001
 *
 * Enriches static project data with live fields from Supabase globe_projects.
 * The static shell (hero, metrics, timeline, tabs) is preserved — Supabase
 * overlays real-time status, description, and live badge.
 *
 * Flow:
 *   1. Resolve project key → Supabase project name via PROJECT_KEY_TO_NAME
 *   2. Query globe_projects WHERE name = <name>
 *   3. Merge live fields over static data
 *   4. Return enriched project + isLive flag
 *
 * Fallback: if Supabase unavailable or no row found → static data unchanged.
 */

import { useState, useEffect } from "react";
import projectData from "@/data/projects";
import { PROJECT_KEY_TO_GEO_ID } from "@/lib/projectBridge";

// ---------------------------------------------------------------------------
// Name bridge — project key → Supabase globe_projects.name
// Canonical: matches ENRICHMENT_REGISTRY keys in proposalGenerator.ts
// ---------------------------------------------------------------------------
const PROJECT_KEY_TO_NAME: Record<string, string> = {
  "deltaspine-nl":  "Delta Spine NL",
  "geocore-power":  "Geocore Power",
  "terra-lenta":    "Terra Lenta",
  "fusion-core":    "Fusion Core",
  "chip-fold":      "Chip Fold",
  "pico-do-fogo":   "Pico do Fogo",
};

export interface LiveProjectRow {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lon: number;
  color: string;
  status: string;
}

export type EnrichedProject = NonNullable<ReturnType<typeof useProjectData>["project"]>;

export function useProjectData(projectKey: string | undefined): {
  project: (typeof projectData)[string] | null;
  liveRow: LiveProjectRow | null;
  isLive: boolean;
  isLoading: boolean;
} {
  const staticProject = projectKey ? (projectData[projectKey] ?? null) : null;
  const [liveRow, setLiveRow] = useState<LiveProjectRow | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectKey) {
      setIsLoading(false);
      return;
    }

    const supabaseName = PROJECT_KEY_TO_NAME[projectKey];
    if (!supabaseName) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase
          .from("globe_projects")
          .select("id, name, description, lat, lon, color, status")
          .eq("name", supabaseName)
          .maybeSingle();

        if (cancelled) return;

        if (!error && data) {
          setLiveRow(data as LiveProjectRow);
          setIsLive(true);
        }
      } catch {
        // Supabase unavailable — static data serves as fallback
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [projectKey]);

  return { project: staticProject, liveRow, isLive, isLoading };
}
