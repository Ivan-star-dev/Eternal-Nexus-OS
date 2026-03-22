# Eternal Nexus - MODEL_STRATEGY

This file defines the path to having an Eternal Nexus AI system inside the website without jumping too early into expensive or unnecessary model training.

## Core principle
Own the system before trying to own a frontier model.

In practice, "your own AI" means:
- your product experience
- your orchestration and routing
- your memory and retrieval layer
- your tools and actions
- your policies and gates
- your evals and success criteria
- your founder-aligned behavior

It does not require training a new large model from scratch on day one.

## Recommended ownership ladder
### Stage 1 - Product-owned AI system
- use strong external models behind your own orchestration layer
- add founder-aware memory, task routing, and verification gates
- keep the user experience, data model, and behavior rules under project control

### Stage 2 - Specialist intelligence
- add small bounded components such as classifiers, rerankers, summarizers, or extractors
- train or fine-tune only where benchmarks justify it
- keep each specialist measurable and replaceable

### Stage 3 - Private or self-hosted task models
- self-host open models for bounded jobs when privacy, latency, or cost justify it
- good candidates: classification, structured extraction, internal copilots, retrieval-side helpers

### Stage 4 - Fine-tunes and adapters
- fine-tune for format stability, domain tone, or narrow decision support
- use adapters or LoRA-style tuning before considering a large bespoke training effort

### Stage 5 - From-scratch training
- consider only if you have:
  - a truly differentiated dataset
  - clear eval wins unavailable through fine-tuning or orchestration
  - budget, infrastructure, and team maturity
  - a product reason stronger than "it feels cool"

## Website AI architecture
The long-term website stack should include:
1. Model gateway and router
2. Retrieval and memory layer
3. Tool execution layer
4. Policy and gate layer
5. Evaluation and analytics layer
6. UI shell that expresses the Eternal Nexus DNA

## Pioneer lanes
- `@claude`: system architecture, contracts, state flow, agent coordination
- `@codex`: evals, CI, regression gates, benchmark harnesses
- `@antigravity`: deployment, secret handling, model serving, routing infrastructure
- `@ui`: interaction layer, motion, trust cues, and user-facing intelligence surfaces
- `@copilot`: review, security checks, and risk spotting

## What should be trained first
The first things worth training or tuning are usually:
- task classifiers
- ranking models
- entity extraction helpers
- style or format adapters
- bounded copilots for internal workflows

These are cheaper, safer, and easier to benchmark than a new general model.

## What should not be rushed
- a from-scratch frontier model
- broad autonomous action without evals
- memory systems that store sensitive founder or user data in public-safe files
- product claims that the system can "run itself" without strategic oversight

## Decision criteria
Any new model or provider choice should be judged on:
- measured quality on project tasks
- privacy and security fit
- latency
- cost
- operational complexity
- fallback behavior
- vendor lock-in risk

## Success condition
The project owns a living AI system when:
- the experience feels native to Eternal Nexus
- the system remembers useful context safely
- the stack can improve without chaos
- model swaps do not break the product identity
- founder taste still guides the high-level direction
