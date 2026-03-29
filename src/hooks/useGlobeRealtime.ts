/**
 * useGlobeRealtime — V5-LIVE-DATA-001
 *
 * Subscribes to Supabase realtime on `globe_projects`.
 * On INSERT/UPDATE: emits PROJECT_UPDATE to globeEventBus → globe reacts.
 * On DELETE:        removes hotspot from active list.
 *
 * Returns:
 *   liveProjects  — current list of projects from Supabase
 *   isConnected   — realtime channel status
 */

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { globeEventBus } from "@/lib/eventBus";

export interface LiveProject {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lon: number;
  color: string;
  status: string;
}

interface UseGlobeRealtimeResult {
  liveProjects: LiveProject[];
  isConnected: boolean;
}

export function useGlobeRealtime(): UseGlobeRealtimeResult {
  const [liveProjects, setLiveProjects] = useState<LiveProject[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    // Initial load
    supabase
      .from("globe_projects")
      .select("id, name, description, lat, lon, color, status")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setLiveProjects(data as LiveProject[]);
      });

    // Realtime subscription
    const channel = supabase
      .channel("globe_projects_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "globe_projects" },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const row = payload.new as LiveProject;

            // Update local project list
            setLiveProjects((prev) => {
              const existing = prev.findIndex((p) => p.id === row.id);
              if (existing >= 0) {
                const next = [...prev];
                next[existing] = row;
                return next;
              }
              return [...prev, row];
            });

            // Emit to globe event bus → EventPulseRings react
            globeEventBus.emit(
              globeEventBus.fromProjectUpdate({
                id: row.id,
                name: row.name,
                lat: row.lat,
                lon: row.lon,
              }),
            );
          } else if (payload.eventType === "DELETE") {
            const id = (payload.old as { id: string }).id;
            setLiveProjects((prev) => prev.filter((p) => p.id !== id));
          }
        },
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { liveProjects, isConnected };
}
