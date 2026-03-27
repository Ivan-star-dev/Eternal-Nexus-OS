/**
 * useProjectPulse.ts — K-08 PIPELINE
 * V4-WORLD-FEATURES-001 | 2026-03-27
 *
 * Polls/subscribes to project activity.
 * Uses Supabase realtime if available; falls back to mock pulse data.
 * Returns per-project pulse state: isLive, lastActivity, activityCount.
 */

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectPulse {
  projectId: string;
  isLive: boolean;
  lastActivity: Date;
  activityCount: number;
  trend: "up" | "stable" | "down";
}

// Mock pulse data for fallback
const MOCK_PULSES: Record<string, Omit<ProjectPulse, "lastActivity">> = {
  "deltaspine-nl": { projectId: "deltaspine-nl", isLive: true, activityCount: 14, trend: "up" },
  "geocore-power": { projectId: "geocore-power", isLive: true, activityCount: 9, trend: "up" },
  "terra-lenta": { projectId: "terra-lenta", isLive: false, activityCount: 3, trend: "stable" },
  "fusion-core": { projectId: "fusion-core", isLive: false, activityCount: 2, trend: "stable" },
  "chip-fold": { projectId: "chip-fold", isLive: true, activityCount: 21, trend: "up" },
};

function buildMockPulses(): ProjectPulse[] {
  return Object.values(MOCK_PULSES).map((p) => ({
    ...p,
    lastActivity: new Date(Date.now() - Math.random() * 1000 * 60 * 30),
  }));
}

export function useProjectPulse(projectIds?: string[]): {
  pulses: ProjectPulse[];
  isConnected: boolean;
} {
  const [pulses, setPulses] = useState<ProjectPulse[]>(buildMockPulses());
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Attempt Supabase realtime subscription
    if (supabase) {
      const channel = supabase
        .channel("project-pulse")
        .on("postgres_changes", { event: "*", schema: "public" }, () => {
          setIsConnected(true);
          setPulses((prev) =>
            prev.map((p) => ({
              ...p,
              lastActivity: new Date(),
              activityCount: p.activityCount + 1,
            }))
          );
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Fallback: simulate pulse ticks every 8 seconds
    intervalRef.current = setInterval(() => {
      setPulses((prev) =>
        prev.map((p) => {
          const ids = projectIds ?? Object.keys(MOCK_PULSES);
          if (!ids.includes(p.projectId)) return p;
          if (Math.random() > 0.6) {
            return {
              ...p,
              lastActivity: new Date(),
              activityCount: p.activityCount + 1,
              isLive: true,
            };
          }
          return p;
        })
      );
    }, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [projectIds]);

  return { pulses, isConnected };
}

export function useSingleProjectPulse(projectId: string): ProjectPulse | null {
  const { pulses } = useProjectPulse([projectId]);
  return pulses.find((p) => p.projectId === projectId) ?? null;
}
