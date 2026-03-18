# Eternal Nexus - LEARNING_LOOP

This file defines how the project learns continuously from work, results, and founder feedback.

## Learning principle
Learn in the open through repo artifacts.
Do not rely on hidden memory or vibes.

## Learning surfaces
### Session learning
- source: topic log in `NEXUS_CONTEXT/LOGS/`
- captures: what changed, why, proof, risks, next tasks

### Team learning
- source: `NEXUS_CONTEXT/INSIGHTS.md`
- captures: cross-pioneer lessons, requests, recurring patterns

### State learning
- source: `NEXUS_CONTEXT/PROJECT_STATE.md`
- captures: what is now true after merge

### Founder learning
- source: `NEXUS_CONTEXT/_private/FOUNDER_PROFILE.md`
- captures: preferences, taste, decision style, red lines, communication style

### Model and tool learning
- source: `NEXUS_CONTEXT/MODEL_STRATEGY.md`
- captures: routing decisions, model roles, privacy constraints, ownership path

## Closed learning cycle
1. Read the latest handoff and relevant state files.
2. Execute the queued task or a triaged next step.
3. Verify using gates, tests, benchmarks, or exact manual checks.
4. Write a report with evidence.
5. Update the handoff so the next pioneer can continue cleanly.
6. After merge, append durable truth to the shared state files.
7. If founder preferences changed, update the private founder profile instead of guessing next time.

## Update rules by file
- `NEXUS_CONTEXT/LOGS/YYYY-MM-DD_<agent>_<topic>.md`
  Use for every meaningful session or commit.
- `NEXUS_CONTEXT/HANDOFF.md`
  Update every time the current branch's next reader needs a new stable entrypoint.
- `NEXUS_CONTEXT/PROJECT_STATE.md`
  Update only after merge or when the branch changes the effective operating reality for all pioneers.
- `NEXUS_CONTEXT/INSIGHTS.md`
  Append lessons and requests after merge or when a cross-pioneer pattern must be preserved.
- `NEXUS_CONTEXT/_private/FOUNDER_PROFILE.md`
  Update only from explicit founder behavior, repeated feedback, or confirmed preference changes.
- `NEXUS_CONTEXT/MODEL_STRATEGY.md`
  Update when the AI stack, routing policy, ownership path, or privacy posture changes.

## Evidence rule
No learning update should claim a pattern unless one of these exists:
- a passing or failing test
- a gate result
- a benchmark score
- a merge outcome
- repeated founder feedback
- a documented production observation

## Founder adaptation rule
When the founder repeatedly prefers a certain style, pace, visual direction, risk posture, or output shape:
1. record it in the private founder profile
2. mention the effect in the session log if it changed execution
3. adjust future proposals and prioritization to match

## Weekly synthesis
When enough changes accumulate, produce a synthesis that answers:
- what repeatedly worked
- what repeatedly caused friction
- which benchmark tags are proving accurate
- which gates are missing
- which founder preferences became clearer

Write the synthesis as a normal topic log and then append the durable parts to `PROJECT_STATE.md` and `INSIGHTS.md`.

## Anti-patterns
- copying founder preferences into public-safe files if they are sensitive
- changing the queue without recording why
- mistaking one-off feedback for a permanent rule
- treating unverified opinions as learning
- "continuous learning" with no artifact trail

## Success condition
The project should feel easier to continue each day because:
- the next task is clearer
- the founder is better understood
- repeated mistakes shrink
- decisions become easier to verify
