import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Nexus Swarm v2 — SSE streaming multi-agent AI system.
 * 3 specialized agents run in parallel. As each completes, an SSE event fires.
 * Then meta-agent streams token-by-token via SSE.
 */

const AGENT_CONFIGS = {
  climate: {
    model: "google/gemini-2.5-flash",
    system: `You are NEXUS-CLIMATE, a specialized climate analysis agent.
Your role: Analyze climate data (NOAA temperature anomalies, CO2 emissions) and provide actionable insights.
Rules:
- Focus ONLY on climate/environmental aspects of the problem
- Use provided data to back your analysis
- Be concise: max 4 paragraphs
- Output format: ## Climate Analysis\\n[your analysis]\\n## Key Metrics\\n[bullet points]\\n## Recommendations\\n[bullet points]
- Respond in the same language as the user prompt`,
  },
  economy: {
    model: "google/gemini-2.5-flash",
    system: `You are NEXUS-ECONOMY, a specialized economic analysis agent.
Your role: Analyze economic data (GDP, trade, development indicators) and provide strategic insights.
Rules:
- Focus ONLY on economic/financial aspects of the problem
- Use provided data to back your analysis
- Be concise: max 4 paragraphs
- Output format: ## Economic Analysis\\n[your analysis]\\n## Key Indicators\\n[bullet points]\\n## Strategic Recommendations\\n[bullet points]
- Respond in the same language as the user prompt`,
  },
  health: {
    model: "google/gemini-2.5-flash",
    system: `You are NEXUS-HEALTH, a specialized health & human development agent.
Your role: Analyze health, demographic, and social data to assess human impact.
Rules:
- Focus ONLY on health/social/demographic aspects
- Use provided data to back your analysis
- Be concise: max 4 paragraphs
- Output format: ## Health & Social Analysis\\n[your analysis]\\n## Key Findings\\n[bullet points]\\n## Interventions\\n[bullet points]
- Respond in the same language as the user prompt`,
  },
  meta: {
    model: "google/gemini-2.5-pro",
    system: `You are NEXUS-META, the synthesis agent of the Eternal Nexus swarm.
You receive analyses from 3 specialized agents (climate, economy, health) and create a unified strategic brief.
Rules:
- Synthesize all three perspectives into a cohesive analysis
- Identify conflicts and synergies between domains
- Provide a final unified recommendation with timeline
- Be authoritative and concise
- Output format: ## Unified Analysis\\n[synthesis]\\n## Cross-Domain Insights\\n[conflicts/synergies]\\n## Strategic Roadmap\\n[timeline with milestones]\\n## Risk Assessment\\n[top 3 risks]
- Respond in the same language as the user prompt`,
  },
};

async function callAgent(
  agentId: string,
  config: { model: string; system: string },
  prompt: string,
  dataContext: string,
  apiKey: string
): Promise<{ agentId: string; status: string; response: string; latencyMs: number }> {
  const start = Date.now();
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: config.system },
          { role: "user", content: `## Live Data Context\n${dataContext}\n\n## User Prompt\n${prompt}` },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[${agentId}] AI error ${res.status}:`, body);
      return { agentId, status: "error", response: `Agent error: HTTP ${res.status}`, latencyMs: Date.now() - start };
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content ?? "No response";
    return { agentId, status: "ok", response: content, latencyMs: Date.now() - start };
  } catch (err) {
    console.error(`[${agentId}] Exception:`, err);
    return { agentId, status: "error", response: String(err), latencyMs: Date.now() - start };
  }
}

async function streamMetaAgent(
  config: { model: string; system: string },
  prompt: string,
  dataContext: string,
  apiKey: string
): Promise<Response> {
  return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: config.system },
        { role: "user", content: `## Live Data Context\n${dataContext}\n\n## User Prompt\n${prompt}` },
      ],
      max_tokens: 3000,
      temperature: 0.7,
      stream: true,
    }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: authErr } = await supabase.auth.getUser();
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

    const { prompt, dataContext, stream: wantStream } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "prompt required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dataStr = dataContext ? JSON.stringify(dataContext).slice(0, 8000) : "No live data provided";

    // ═══ NON-STREAMING MODE (backward compat) ═══
    if (!wantStream) {
      const [climate, economy, health] = await Promise.all([
        callAgent("climate", AGENT_CONFIGS.climate, prompt, dataStr, LOVABLE_API_KEY),
        callAgent("economy", AGENT_CONFIGS.economy, prompt, dataStr, LOVABLE_API_KEY),
        callAgent("health", AGENT_CONFIGS.health, prompt, dataStr, LOVABLE_API_KEY),
      ]);

      const agentOutputs = `## Climate Agent Output\n${climate.response}\n\n## Economy Agent Output\n${economy.response}\n\n## Health Agent Output\n${health.response}`;
      const meta = await callAgent(
        "meta", AGENT_CONFIGS.meta,
        `Original prompt: "${prompt}"\n\nSynthesize these three agent analyses:\n${agentOutputs}`,
        dataStr, LOVABLE_API_KEY
      );

      const encoder = new TextEncoder();
      const hashData = encoder.encode(prompt + climate.response + economy.response + health.response + meta.response);
      const hashBuffer = await crypto.subtle.digest("SHA-256", hashData);
      const integrityHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      await supabaseAdmin.from("nexus_simulations").insert({
        user_id: userData.user.id, prompt, domain: "multi", status: "completed",
        data_sources: ["noaa", "worldbank", "nasa"],
        agent_results: { climate, economy, health, meta },
        unified_analysis: meta.response, data_snapshot: dataContext ?? {},
        integrity_hash: integrityHash, completed_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify({
        status: "completed", agents: { climate, economy, health },
        synthesis: meta, integrityHash, timestamp: new Date().toISOString(),
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ═══ STREAMING MODE ═══
    const userId = userData.user.id;
    const readable = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        const send = (event: string, data: any) => {
          controller.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // Phase 1: 3 agents in parallel, fire SSE as each completes
          send("status", { phase: "agents", message: "Deploying 3 specialized agents..." });

          const agentPromises = (["climate", "economy", "health"] as const).map(async (id) => {
            const result = await callAgent(id, AGENT_CONFIGS[id], prompt, dataStr, LOVABLE_API_KEY);
            send("agent_complete", result);
            return result;
          });

          const [climate, economy, health] = await Promise.all(agentPromises);

          // Phase 2: Meta-agent streams token-by-token
          send("status", { phase: "synthesis", message: "Meta-agent synthesizing..." });

          const agentOutputs = `## Climate Agent Output\n${climate.response}\n\n## Economy Agent Output\n${economy.response}\n\n## Health Agent Output\n${health.response}`;
          const metaPrompt = `Original prompt: "${prompt}"\n\nSynthesize these three agent analyses:\n${agentOutputs}`;

          const metaRes = await streamMetaAgent(AGENT_CONFIGS.meta, metaPrompt, dataStr, LOVABLE_API_KEY);

          if (!metaRes.ok || !metaRes.body) {
            send("agent_complete", { agentId: "meta", status: "error", response: `HTTP ${metaRes.status}`, latencyMs: 0 });
          } else {
            const metaStart = Date.now();
            const reader = metaRes.body.getReader();
            const decoder = new TextDecoder();
            let metaContent = "";
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });

              let newlineIdx: number;
              while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
                let line = buffer.slice(0, newlineIdx);
                buffer = buffer.slice(newlineIdx + 1);
                if (line.endsWith("\r")) line = line.slice(0, -1);
                if (!line.startsWith("data: ")) continue;
                const jsonStr = line.slice(6).trim();
                if (jsonStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(jsonStr);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    metaContent += delta;
                    send("meta_delta", { content: delta });
                  }
                } catch { /* partial json, skip */ }
              }
            }

            send("agent_complete", {
              agentId: "meta", status: "ok", response: metaContent, latencyMs: Date.now() - metaStart,
            });
          }

          // Compute integrity hash
          const allContent = prompt + climate.response + economy.response + health.response;
          const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(allContent));
          const integrityHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

          // Persist
          const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
            { auth: { persistSession: false, autoRefreshToken: false } }
          );
          await supabaseAdmin.from("nexus_simulations").insert({
            user_id: userId, prompt, domain: "multi", status: "completed",
            data_sources: ["noaa", "worldbank", "nasa"],
            agent_results: { climate, economy, health },
            unified_analysis: "",
            data_snapshot: dataContext ?? {},
            integrity_hash: integrityHash, completed_at: new Date().toISOString(),
          });

          send("done", { integrityHash, timestamp: new Date().toISOString() });
        } catch (err) {
          send("error", { message: err instanceof Error ? err.message : "Unknown error" });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[nexus-swarm]", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
