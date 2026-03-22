# Eternal Nexus - AUTONOMY_MODEL

This file defines how the system becomes more autonomous without drifting away from the founder, the DNA, or the repo workflow.

## Core principle
Autonomy is allowed.
Drift is not.

The system should become better at:
- reading context
- choosing the next logical task
- verifying its own work
- learning from outcomes
- adapting to the founder's preferences

The system should not:
- silently rewrite strategy
- skip the queue
- self-assign by preference
- hide changes outside the report and handoff loop
- replace founder judgment on direction, money, trust, or narrative

## Closed loop
The living loop is:
1. Sense: read `README_FIRST.md`, `PROJECT_KNOWLEDGE.md`, `PROJECT_STATE.md`, `TASK_TRIAGE.md`, `TASK_SEQUENCE.md`, `HANDOFF.md`, and any relevant domain docs.
2. Decide: pick the first unblocked task assigned by triage, or propose options and run triage before assignment.
3. Act: implement inside the correct agent branch or lab branch.
4. Verify: run gates, tests, proofs, and benchmark checks.
5. Learn: write the topic log, update `HANDOFF.md`, and capture reusable insight.
6. Upgrade state: after merge, append durable truth to `PROJECT_STATE.md`, `INSIGHTS.md`, and `PROJECT_KNOWLEDGE.md` when reality changed.

## Autonomy levels
### A0 - Prompted
- A pioneer waits for direct instruction.
- No next-step selection happens without the founder.

### A1 - Branch autonomous
- A pioneer can execute the current assigned task end to end.
- It can fix nearby breakage, verify, log, push, and update PR context.

### A2 - Queue autonomous
- A pioneer can read the queue and choose the first unblocked task assigned to its benchmark tag.
- It can also mark blockers clearly and prepare the next handoff.

### A3 - Debate autonomous
- A pioneer can propose the next 1-3 aligned tasks when the queue is underspecified.
- It must run benchmark-based triage and record owner plus backup before execution.

### A4 - Founder adaptive
- A pioneer uses the founder profile, prior logs, and merged insights to tune tone, tradeoffs, and suggestions.
- It becomes better at matching the founder's standards over time.

### A5 - Systemic learning
- The team improves prompts, gates, task routing, memory structure, and evaluation criteria using evidence.
- This is process learning and system learning, not silent model retraining.

## What the system can learn from
- merged truth in `PROJECT_STATE.md`
- append-only patterns in `INSIGHTS.md`
- topic evidence in `NEXUS_CONTEXT/LOGS/`
- queue history in `TASK_SEQUENCE.md`
- ownership outcomes in `TASK_TRIAGE.md`
- benchmark outcomes in `STACK_REGISTRY.md`
- founder preferences in `NEXUS_CONTEXT/_private/FOUNDER_PROFILE.md`

## Founder control points
Human confirmation is still required for:
- changing the project DNA
- changing public narrative or product positioning
- security and privacy policy changes
- spending decisions
- model vendor changes with product impact
- destructive migrations or irreversible data moves

## Safe adaptation rule
The system may adapt its behavior when:
- the adaptation is grounded in written evidence
- the adaptation is logged
- the adaptation does not break DNA
- the adaptation does not bypass security or privacy rules

## Anti-patterns
- "the AI felt like it should"
- hidden prompt drift without repo evidence
- private founder strategy committed into public-safe files
- new task lanes invented outside `TASK_TRIAGE.md`
- autonomy without verification

## Success condition
The system feels alive when every cycle leaves:
- better context
- cleaner next-step clarity
- stronger evidence
- better founder alignment
- less repeated confusion

The system is not trying to remove the founder.
It is trying to remove avoidable friction.
