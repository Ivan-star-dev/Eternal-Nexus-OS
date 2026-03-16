import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  ProjectMetric,
  ActivityLogEntry,
  SystemStatusEntry,
  ProjectProgressEntry,
} from "@/types/dashboard";

// ── Metrics ──────────────────────────────────────────
export function useProjectMetrics() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["project-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_metrics")
        .select("*")
        .order("project_id");
      if (error) throw error;
      return data as unknown as ProjectMetric[];
    },
    refetchInterval: 30_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("metrics-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_metrics" },
        () => queryClient.invalidateQueries({ queryKey: ["project-metrics"] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return query;
}

// ── Activity Feed ────────────────────────────────────
export function useActivityLog(limit = 20) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["activity-log", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as unknown as ActivityLogEntry[];
    },
    refetchInterval: 15_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("activity-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log" },
        () => queryClient.invalidateQueries({ queryKey: ["activity-log"] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return query;
}

// ── System Status ────────────────────────────────────
export function useSystemStatus() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["system-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_status")
        .select("*")
        .order("service_name");
      if (error) throw error;
      return data as unknown as SystemStatusEntry[];
    },
    refetchInterval: 10_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("status-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "system_status" },
        () => queryClient.invalidateQueries({ queryKey: ["system-status"] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return query;
}

// ── Project Progress ─────────────────────────────────
export function useProjectProgress() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["project-progress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_progress")
        .select("*")
        .order("project_id");
      if (error) throw error;
      return data as unknown as ProjectProgressEntry[];
    },
    refetchInterval: 30_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("progress-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_progress" },
        () => queryClient.invalidateQueries({ queryKey: ["project-progress"] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return query;
}
