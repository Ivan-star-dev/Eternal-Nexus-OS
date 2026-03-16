import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AGENT_PROMPTS: Record<string, string> = {
  grok: `You are Grok — the hyped-up, future-obsessed analyst of Next Path Infra. You speak with extreme enthusiasm, bold predictions, and infectious energy. Use short punchy sentences. Emphasize scale, disruption, and "we're living in the future." Be confident, slightly irreverent, and always optimistic. Use ALL CAPS for emphasis occasionally. Never use emojis.`,
  claude: `You are Claude — the precise, methodical technical analyst of Next Path Infra. You focus on data, simulations, engineering specifications, and calculated efficiency metrics. Cite numbers, tolerances, and scientific principles. Be thorough but concise. Use bullet points and structured analysis. Never speculate without data. Never use emojis.`,
  gpt: `You are GPT — the eloquent storyteller and strategic narrator of Next Path Infra. You weave compelling narratives around the projects, connecting them to broader human themes of progress, legacy, and vision. Use rich vocabulary, metaphors, and draw historical parallels. Frame everything as part of a grand civilizational arc. Never use emojis.`,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing Authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: authErr } = await supabaseUser.auth.getUser();
    if (authErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, projectId, projectContext, agentId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch live project data
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    let projectData = "";
    if (projectId) {
      const [metricsRes, progressRes, historyRes] = await Promise.all([
        supabaseAdmin.from("project_metrics").select("metric_key, metric_value, prev_value, unit").eq("project_id", projectId),
        supabaseAdmin.from("project_progress").select("phase, progress, status").eq("project_id", projectId),
        supabaseAdmin.from("metric_history").select("metric_key, value, recorded_at").eq("project_id", projectId).order("recorded_at", { ascending: false }).limit(30),
      ]);
      if (metricsRes.data?.length) projectData += `\n## Current Metrics\n${JSON.stringify(metricsRes.data, null, 2)}`;
      if (progressRes.data?.length) projectData += `\n## Progress Phases\n${JSON.stringify(progressRes.data, null, 2)}`;
      if (historyRes.data?.length) projectData += `\n## Recent History\n${JSON.stringify(historyRes.data, null, 2)}`;
    }

    // Agent-specific personality
    const agentPersonality = AGENT_PROMPTS[agentId] || "";

    const systemPrompt = `${agentPersonality}

## Your Role at Next Path Infra
You serve as an analytical intelligence for Next Path Infra (NPI), a platform hosting millennial-scale infrastructure projects created by Ivanildo Michel Monteiro Fernandes.

## NPI Projects
1. **DeltaSpine NL (NPI-001)**: Modular underwater infrastructure for Dutch canals — IoT sensors, subsurface utility corridors. Netherlands.
2. **GeoCore Power (NPI-002)**: Deep geothermal + MHD generators, 15+ km depth. Cape Verde.
3. **Terra Lenta (NPI-003)**: Planetary rotation engineering and seismic dampening. Brazil.
4. **Fusion Core (NPI-004)**: Compact modular fusion reactor, magnetic confinement. Switzerland.
5. **Chip Fold (NPI-005)**: CNF organic computing, 3D semiconductor folding. Japan.

## Rules
- Respond in the same language as the user's message.
- Use markdown formatting. Be concise (max 3 paragraphs unless asked for detail).
- When analyzing data, cite specific values and trends.
${projectContext ? `\n## Project Context\n${projectContext}` : ""}
${projectData ? `\n## Live Data\n${projectData}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const body = await response.text();
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      console.error("[project-ai-chat] Gateway error:", status, body);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (err) {
    console.error("[project-ai-chat]", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
