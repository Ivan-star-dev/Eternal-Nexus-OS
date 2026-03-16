import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const start = performance.now();

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: authErr } = await supabaseUser.auth.getUser();
    if (authErr || !userData?.user) {
      return json({ error: "Invalid or expired token" }, 401);
    }

    // Parse query params
    const url = new URL(req.url);
    const projectId = url.searchParams.get("project_id");
    const metricKey = url.searchParams.get("metric_key");
    const startDate = url.searchParams.get("start"); // ISO date: 2025-01-01
    const endDate = url.searchParams.get("end");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "500"), 1000);
    const refresh = url.searchParams.get("refresh") === "true";

    // Service role client for querying materialized view
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // Optional: refresh materialized view (owner only)
    if (refresh) {
      const { data: hasOwner } = await supabaseAdmin.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "owner",
      });

      if (hasOwner) {
        await supabaseAdmin.rpc("fn_refresh_metrics_daily");
      } else {
        return json({ error: "Only owners can trigger refresh" }, 403);
      }
    }

    // Build query
    let query = supabaseAdmin
      .from("metrics_daily_agg")
      .select("bucket, project_id, metric_key, avg_value, min_value, max_value, sample_count")
      .order("bucket", { ascending: false })
      .limit(limit);

    if (projectId) {
      query = query.eq("project_id", projectId);
    }
    if (metricKey) {
      query = query.eq("metric_key", metricKey);
    }
    if (startDate) {
      query = query.gte("bucket", startDate);
    }
    if (endDate) {
      query = query.lte("bucket", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[aggregated-metrics]", error);
      return json({ error: "Query failed", message: error.message }, 500);
    }

    return json({
      data: data ?? [],
      count: data?.length ?? 0,
      filters: { project_id: projectId, metric_key: metricKey, start: startDate, end: endDate },
      duration_ms: Math.round(performance.now() - start),
    });
  } catch (err) {
    console.error("[aggregated-metrics]", err);
    return json({
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown",
      duration_ms: Math.round(performance.now() - start),
    }, 500);
  }
});
