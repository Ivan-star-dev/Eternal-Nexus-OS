import { useEffect, useRef, useCallback } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type PostgresEvent = "INSERT" | "UPDATE" | "DELETE";

interface RealtimeCallbacks<T> {
  onInsert?: (record: T, old: T[] | undefined) => T[];
  onUpdate?: (record: T, old: T[] | undefined) => T[];
  onDelete?: (oldRecord: Partial<T>, old: T[] | undefined) => T[];
}

interface UseSupabaseRealtimeOptions<T extends { id: string }> {
  queryKey: QueryKey;
  table: string;
  events?: PostgresEvent[];
  filter?: string;
  callbacks?: RealtimeCallbacks<T>;
  maxItems?: number;
  enabled?: boolean;
}

function defaultInsert<T extends { id: string }>(record: T, old: T[] | undefined, max: number): T[] {
  const current = old ?? [];
  if (current.some((item) => item.id === record.id)) return current;
  const updated = [record, ...current];
  return max > 0 ? updated.slice(0, max) : updated;
}

function defaultUpdate<T extends { id: string }>(record: T, old: T[] | undefined): T[] {
  if (!old) return [record];
  const idx = old.findIndex((item) => item.id === record.id);
  if (idx === -1) return [record, ...old];
  const next = [...old];
  next[idx] = { ...next[idx], ...record };
  return next;
}

function defaultDelete<T extends { id: string }>(oldRecord: Partial<T>, old: T[] | undefined): T[] {
  if (!old || !oldRecord.id) return old ?? [];
  return old.filter((item) => item.id !== oldRecord.id);
}

export function useSupabaseRealtime<T extends { id: string }>({
  queryKey,
  table,
  events = ["INSERT", "UPDATE", "DELETE"],
  filter,
  callbacks,
  maxItems = 200,
  enabled = true,
}: UseSupabaseRealtimeOptions<T>) {
  const qc = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const reconnectRef = useRef(0);
  const queryKeyStr = JSON.stringify(queryKey);

  const handleChange = useCallback(
    (payload: any) => {
      qc.setQueryData<T[]>(queryKey, (old) => {
        switch (payload.eventType) {
          case "INSERT": {
            const record = payload.new as T;
            return callbacks?.onInsert
              ? callbacks.onInsert(record, old)
              : defaultInsert(record, old, maxItems);
          }
          case "UPDATE": {
            const record = payload.new as T;
            return callbacks?.onUpdate
              ? callbacks.onUpdate(record, old)
              : defaultUpdate(record, old);
          }
          case "DELETE": {
            const deleted = payload.old as Partial<T>;
            return callbacks?.onDelete
              ? callbacks.onDelete(deleted, old)
              : defaultDelete(deleted, old);
          }
          default:
            return old ?? [];
        }
      });
      reconnectRef.current = 0;
    },
    [queryKeyStr, maxItems]
  );

  useEffect(() => {
    if (!enabled) return;

    const channelName = `rt:${table}:${queryKeyStr}`;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase.channel(channelName);

    channel.on(
      "postgres_changes" as any,
      { event: "*", schema: "public", table, ...(filter ? { filter } : {}) },
      handleChange
    );

    channel.subscribe((status) => {
      if (status === "CHANNEL_ERROR" && reconnectRef.current < 5) {
        reconnectRef.current++;
        const delay = Math.min(1000 * 2 ** reconnectRef.current, 30000);
        setTimeout(() => channel.subscribe(), delay);
      }
      if (status === "SUBSCRIBED") reconnectRef.current = 0;
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, queryKeyStr, filter, enabled, handleChange]);
}
