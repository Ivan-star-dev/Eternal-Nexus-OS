# Eternal Nexus — MODEL_ROUTING (sustainable + ethical model supply)

> **Rule:** No trial farming. No deceptive signups. No quota bypass.
> Continuity is achieved through routing, caching, and legitimate programs.

---

## Model Routing Table (policy)

### Tier 1 — Frontier Models (Claude Opus/Sonnet, GPT-4o)
**Use for:**
- Architecture decisions
- Hardest reasoning (system design, event schema, type contracts)
- Final PR reviews
- Complex debugging (multi-file root cause analysis)
- Phase gate validation

**Budget:** Use sparingly. Every frontier call should produce a cacheable artifact.

### Tier 2 — Mid-Tier Models (Claude Haiku, GPT-4o-mini, Gemini Flash)
**Use for:**
- Code implementation within established patterns
- PR descriptions and commit messages
- Test generation from existing patterns
- Documentation updates
- Refactoring within clear boundaries

**Budget:** Default for most development work.

### Tier 3 — Local OSS Models (Ollama/LM Studio: Llama, Mistral, CodeLlama, DeepSeek)
**Use for:**
- Bulk tasks: summarization, doc drafting, codebase search + explanation
- Refactor suggestions
- Test generation drafts
- Log formatting
- Boilerplate generation

**Budget:** Unlimited (runs on local hardware). Preferred for anything non-critical.

### Tier 4 — Cached Artifacts (zero cost)
**Use for:**
- Any output already generated and stored in:
  - `NEXUS_CONTEXT/LOGS/` — session logs, decisions
  - `NEXUS_CONTEXT/INSIGHTS.md` — cross-agent learnings
  - `NEXUS_CONTEXT/PROJECT_STATE.md` — current state
  - PR descriptions, commit messages
  - Test outputs, build logs
- **Rule:** Before asking a model, check if the answer already exists in the repo.

---

## Continuity Pipeline (when a provider is down/limited)

| Situation | Action |
|---|---|
| Provider quota reached | Switch to Tier 2 or Tier 3 for bulk. Queue core decisions for frontier. |
| Provider fully down | Local OSS for all bulk. CI + tests run regardless (no model needed). |
| Need frontier reasoning | Check cached artifacts first. If no cache, queue and batch requests. |
| Routine work | Always default to Tier 2/3. Frontier is overkill for implementation. |

---

## Legitimate Credit Sources

| Source | Type | Notes |
|---|---|---|
| Anthropic startup program | Credits | Apply if eligible. Legitimate. |
| GitHub Copilot (included in plan) | Subscription | Already available for PR review + code assist. |
| Google AI Studio (free tier) | API credits | Gemini Flash — generous free tier for bulk. |
| Local models (Ollama) | Free | Llama 3.1, Mistral, DeepSeek Coder — unlimited. |
| OpenRouter | Pay-per-token | Route to cheapest model per task automatically. |

---

## Per-Pioneer Model Assignment

| Pioneer | Default Tier | Frontier Trigger |
|---|---|---|
| Claude Code (architect) | Tier 1 for contracts, Tier 2 for implementation | Always for schema/event-bus design |
| Codex (tests/CI) | Tier 2 | Only for complex test strategy |
| antigravity (ops) | Tier 2-3 | Only for automation design decisions |
| Copilot (review) | Included in plan | PR review, inline suggestions |
| Cursor (UI) | Tier 2 | Only for complex animation/shader logic |

---

## Anti-Pattern List (never do these)

- ❌ Create fake accounts for free trials
- ❌ Use VPNs to bypass regional quotas
- ❌ Share API keys between projects to circumvent limits
- ❌ Scrape model outputs from web interfaces
- ❌ Claim false affiliations for credit programs

> **Ethic lock:** If a model is too expensive for a task, use a cheaper one.
> If no model is available, the human decides. The repo keeps moving via CI + tests.
