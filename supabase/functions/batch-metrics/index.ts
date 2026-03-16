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

// Simple validation
function validateMetric(m: any, i: number) {
  const errors: string[] = [];
  if (!m.project_id || typeof m.project_id !== "string") errors.push("project_id required");
  if (!m.metric_key || typeof m.metric_key !== "string") errors.push("metric_key required");
  if (typeof m.metric_value !== "number" || !isFinite(m.metric_value)) errors.push("metric_value must be a finite number");
  if (m.unit !== undefined && typeof m.unit !== "string") errors.push("unit must be a string");
  return errors.length > 0 ? { index: i, errors } : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const start = performance.now();

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // Verify caller
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsErr } = await supabaseUser.auth.getUser();
    if (claimsErr || !claimsData?.user) {
      return json({ error: "Invalid or expired token" }, 401);
    }

    // Parse body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const metrics = body?.metrics;
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return json({ error: "metrics array required (1-500 items)" }, 422);
    }
    if (metrics.length > 500) {
      return json({ error: "Maximum 500 metrics per batch" }, 422);
    }

    // Validate each metric
    const validationErrors = metrics.map(validateMetric).filter(Boolean);
    if (validationErrors.length > 0) {
      return json({ error: "Validation failed", details: validationErrors }, 422);
    }

    const skipUnchanged = body?.options?.skip_unchanged !== false;
    const dryRun = body?.options?.dry_run === true;

    // Deduplicate — last wins
    const deduped = new Map<string, any>();
    for (const m of metrics) {
      deduped.set(`${m.project_id}::${m.metric_key}`, m);
    }
    const unique = Array.from(deduped.values());
    const skippedDupes = metrics.length - unique.length;

    if (dryRun) {
      return json({
        success: true, dry_run: true,
        processed: unique.length, inserted: 0, updated: 0,
        skipped: skippedDupes, errors: [],
        duration_ms: Math.round(performance.now() - start),
      });
    }

    // Fetch current values for skip_unchanged
    let currentMap = new Map<string, number>();
    if (skipUnchanged) {
      const projectIds = [...new Set(unique.map((m: any) => m.project_id))];
      const { data: existing } = await supabaseAdmin
        .from("project_metrics")
        .select("project_id, metric_key, metric_value")
        .in("project_id", projectIds);

      if (existing) {
        for (const r of existing) {
          currentMap.set(`${r.project_id}::${r.metric_key}`, Number(r.metric_value));
        }
      }
    }

    // Filter unchanged
    let toProcess = unique;
    let skippedUnchanged = 0;
    if (skipUnchanged) {
      toProcess = unique.filter((m: any) => {
        const cur = currentMap.get(`${m.project_id}::${m.metric_key}`);
        if (cur !== undefined && cur === m.metric_value) {
          skippedUnchanged++;
          return false;
        }
        return true;
      });
    }

    // Upsert in chunks of 50
    const errors: any[] = [];
    let inserted = 0, updated = 0;

    for (let i = 0; i < toProcess.length; i += 50) {
      const chunk = toProcess.slice(i, i + 50);
      const rows = chunk.map((m: any) => ({
        project_id: m.project_id,
        metric_key: m.metric_key,
        metric_value: m.metric_value,
        unit: m.unit || "",
      }));

      const { data, error } = await supabaseAdmin
        .from("project_metrics")
        .upsert(rows, { onConflict: "project_id,metric_key" })
        .select("project_id, metric_key");

      if (error) {
        for (const m of chunk) {
          errors.push({ project_id: m.project_id, metric_key: m.metric_key, message: error.message });
        }
      } else if (data) {
        for (const r of data) {
          if (currentMap.has(`${r.project_id}::${r.metric_key}`)) updated++;
          else inserted++;
        }
      }
    }

    // Log to activity
    if (toProcess.length > 0) {
      await supabaseAdmin.from("activity_log").insert({
        event_type: "batch_update",
        title: `Batch Metrics: ${toProcess.length} processed`,
        description: `${inserted} inserted, ${updated} updated, ${errors.length} errors`,
        severity: errors.length > 0 ? "warning" : "info",
      });
    }

    return json({
      success: errors.length === 0,
      processed: toProcess.length,
      inserted, updated,
      skipped: skippedDupes + skippedUnchanged,
      errors,
      duration_ms: Math.round(performance.now() - start),
      dry_run: false,
    }, errors.length > 0 ? 207 : 200);

  } catch (err) {
    console.error("[batch-metrics]", err);
    return json({
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown",
      duration_ms: Math.round(performance.now() - start),
    }, 500);
  }
});
