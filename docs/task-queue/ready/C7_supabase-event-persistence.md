---
id: C7
title: Supabase persistence — verdicts + atlas markers survive server restart
status: ready
owner-role: architect
priority: P1
suggested-pioneer: "@claude"
suggested-platform: "Claude Code"
suggested-model: frontier
branch: feat/C7-supabase-persistence
temporary-ui: false
---

## Context

Supabase client is live at `src/integrations/supabase/client.ts`. Sacred flow events are in-memory only (localStorage for dev via C5). For production: `tribunal.verdict` + `atlas.marker` must persist to Supabase so they survive page refresh and are queryable across sessions.

## What to build

1. `src/lib/events/supabase-adapter.ts` — wraps existing bus, writes events to Supabase `nexus_events` table on `publish()`
2. Supabase table `nexus_events` — columns: `id (text PK)`, `type (text)`, `source (text)`, `created_at (timestamptz)`, `payload (jsonb)`, `severity (float)`, `confidence (float)`, `geo (jsonb)`, `seed (int)`, `version (int)`
3. Rehydrate on boot: query last 100 events from `nexus_events`, publish into in-memory bus (idempotency enforced)
4. Only write `tribunal.verdict` + `atlas.marker` — avoid write amplification
5. Gate tests with mocked Supabase client

## Constraints
- Do NOT change `NexusEventBus` interface
- Do NOT break C5 localStorage persistence — Supabase adapter is additive
- Supabase calls non-blocking (fire-and-forget with error logging)
- Use existing `src/integrations/supabase/client.ts`

## Acceptance criteria
- [ ] `createSupabaseBus()` writes verdict + atlas events to Supabase on publish
- [ ] Rehydrate: last 100 events loaded from `nexus_events` on init
- [ ] Idempotency preserved during rehydration
- [ ] Gate tests pass with mocked client
- [ ] `npx vitest run` — all tests green
- [ ] `npx tsc --noEmit` — 0 errors
