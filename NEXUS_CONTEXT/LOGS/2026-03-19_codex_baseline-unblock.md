# 2026-03-19 — codex — baseline unblock (idempotency gate)

## What changed
- Updated `src/lib/events/id.ts` to exclude `createdAt` from the event ID composite key.
- Clarified comments to reflect idempotency behavior.

## Why
`src/test/nervous-system.test.ts` expected duplicate Atlas emits with identical payload/options to be rejected. IDs previously included timestamp, so each emit got a new ID and bypassed bus dedup.

## How to verify
- `npx vitest run src/test/nervous-system.test.ts`
- `npx vitest run`
- `npx -p typescript tsc --noEmit`

## Risks
- Identical payload events now collapse to same ID even if emitted at different times.
- If this is too aggressive for production semantics, follow-up should introduce explicit idempotency keys or sequence metadata.

## Next steps
1. Confirm desired domain semantics for repeated same-payload events over time.
2. If needed, add optional `idempotencyKey` support and update factories/tests.
3. Keep CI lane focused on failing-gate-first triage.
