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
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // Check if user is owner
    const { data: isOwner } = await supabaseAdmin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "owner",
    });

    if (!isOwner) {
      return json({ error: "Owner access required" }, 403);
    }

    // ── Gather health metrics in parallel ──

    const [
      systemStatusResult,
      projectMetricsResult,
      projectProgressResult,
      metricHistoryCountResult,
      recentActivityResult,
      chatCountResult,
    ] = await Promise.all([
      // 1. System status
      supabaseAdmin
        .from("system_status")
        .select("service_name, status, uptime_pct, latency_ms, last_check")
        .order("service_name"),

      // 2. Project metrics summary
      supabaseAdmin
        .from("project_metrics")
        .select("project_id, metric_key, metric_value, prev_value, unit, updated_at")
        .order("updated_at", { ascending: false })
        .limit(50),

      // 3. Project progress
      supabaseAdmin
        .from("project_progress")
        .select("project_id, phase, progress, status, updated_at")
        .order("project_id"),

      // 4. Metric history row count (for compression/aggregation insight)
      supabaseAdmin
        .from("metric_history")
        .select("id", { count: "exact", head: true }),

      // 5. Recent activity
      supabaseAdmin
        .from("activity_log")
        .select("title, event_type, severity, project_id, created_at")
        .order("created_at", { ascending: false })
        .limit(20),

      // 6. Chat messages count
      supabaseAdmin
        .from("chat_messages")
        .select("id", { count: "exact", head: true }),
    ]);

    // ── Aggregated metrics (materialized view) ──
    const { data: aggData } = await supabaseAdmin
      .from("metrics_daily_agg")
      .select("bucket, project_id, metric_key, avg_value, sample_count")
      .order("bucket", { ascending: false })
      .limit(10);

    // ── Compute health score ──
    const services = systemStatusResult.data ?? [];
    const operationalCount = services.filter((s) => s.status === "operational").length;
    const totalServices = services.length || 1;
    const avgUptime = services.reduce((sum, s) => sum + (Number(s.uptime_pct) || 0), 0) / totalServices;
    const avgLatency = services.reduce((sum, s) => sum + (Number(s.latency_ms) || 0), 0) / totalServices;

    const progressData = projectProgressResult.data ?? [];
    const avgProgress = progressData.length > 0
      ? progressData.reduce((sum, p) => sum + Number(p.progress), 0) / progressData.length
      : 0;

    // Overall health: weighted score
    const healthScore = Math.round(
      (operationalCount / totalServices) * 40 +
      Math.min(avgUptime, 100) * 0.4 +
      Math.max(0, 20 - avgLatency / 50) // Low latency bonus
    );

    const healthStatus = healthScore >= 85 ? "healthy" : healthScore >= 60 ? "degraded" : "critical";

    // ── Detect anomalies ──
    const anomalies: string[] = [];
    for (const svc of services) {
      if (svc.status !== "operational") anomalies.push(`${svc.service_name}: ${svc.status}`);
      if (Number(svc.latency_ms) > 500) anomalies.push(`${svc.service_name}: high latency (${svc.latency_ms}ms)`);
      if (Number(svc.uptime_pct) < 99) anomalies.push(`${svc.service_name}: uptime below 99% (${svc.uptime_pct}%)`);
    }

    // Recent critical activity
    const criticalEvents = (recentActivityResult.data ?? []).filter(
      (a) => a.severity === "critical" || a.severity === "error"
    );
    if (criticalEvents.length > 0) {
      anomalies.push(`${criticalEvents.length} critical event(s) in recent activity`);
    }

    return json({
      generated_at: new Date().toISOString(),
      health: {
        status: healthStatus,
        score: healthScore,
        anomalies,
      },
      services: {
        total: totalServices,
        operational: operationalCount,
        degraded: totalServices - operationalCount,
        avg_uptime_pct: Math.round(avgUptime * 100) / 100,
        avg_latency_ms: Math.round(avgLatency * 100) / 100,
        details: services,
      },
      projects: {
        avg_progress_pct: Math.round(avgProgress * 100) / 100,
        phases: progressData,
      },
      metrics: {
        total_history_rows: metricHistoryCountResult.count ?? 0,
        recent_aggregations: aggData ?? [],
        latest_values: (projectMetricsResult.data ?? []).slice(0, 20),
      },
      activity: {
        recent: recentActivityResult.data ?? [],
        critical_count: criticalEvents.length,
      },
      chat: {
        total_messages: chatCountResult.count ?? 0,
      },
      duration_ms: Math.round(performance.now() - start),
    });
  } catch (err) {
    console.error("[health-check]", err);
    return json({
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown",
      duration_ms: Math.round(performance.now() - start),
    }, 500);
  }
});
