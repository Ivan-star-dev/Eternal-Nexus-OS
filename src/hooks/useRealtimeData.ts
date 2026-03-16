import { useState, useEffect } from "react";
import { fetchGlobalPollution, type PollutionPoint } from "@/lib/dataSources";
import { supabase } from "@/integrations/supabase/client";

export interface RealtimeData {
  pollution: PollutionPoint[];
  weather: any;
  co2: any[];
}

export function useRealtimeData() {
  const [data, setData] = useState<RealtimeData>({
    pollution: [],
    weather: null,
    co2: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [pollutionData, oceanData] = await Promise.all([
          fetchGlobalPollution(),
          supabase.functions.invoke("data-ocean").catch(() => ({ data: null })),
        ]);

        if (mounted) {
          setData({
            pollution: pollutionData || [],
            co2: oceanData?.data?.sources?.worldbank_co2?.records || [],
            weather: null, // Weather can be fetched per-project or globally as needed
          });
        }
      } catch (error) {
        console.error("Error fetching realtime data:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    // Poll every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading };
}
