/**
 * LabBlueprintTemplates.tsx
 * Value Engine Phase 2 — Creation Hub infusion.
 * Sovereign blueprint templates for product, offer, leverage, authority, value ladder.
 *
 * These are not forms. They are sovereign structured artifacts.
 * Canon: VALUE_ENGINE_INFUSION_MAP.md · P-01→P-05 · M-01→M-03
 * @claude · 2026-03-29
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveArtifact } from "@/lib/artifacts/store";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";

const EASE = [0.22, 1, 0.36, 1] as const;
const BLUE = "hsl(210, 100%, 56%)";
const BLUE_FAINT = "hsla(210, 100%, 56%, 0.10)";
const BLUE_MUTED = "hsla(210, 100%, 56%, 0.45)";

interface Blueprint {
  id: string;
  label: string;
  category: string;
  artifactKind: "plan" | "synthesis" | "decision" | "research" | "experiment";
  titleTemplate: string;
  contentTemplate: string;
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: "L-01",
    label: "Market Gap Investigation",
    category: "Active Mission",
    artifactKind: "research",
    titleTemplate: "Market Gap Mission: [territory you are investigating]",
    contentTemplate: `# Market Gap Investigation

## Mission Brief
Territory: [what market/domain are you investigating?]
Trigger: [what made you think there's a gap here?]
Time budget: [how many hours will you spend before deciding?]

## Competing Hypotheses (require exactly 3)
H1: [state the first candidate gap]
H2: [state a competing explanation]
H3: [state the null — maybe there is no real gap]

## Evidence to Collect
E1: [what would confirm H1?]
E2: [what would confirm H2?]
E3: [what would confirm H3?]
E4: [what would eliminate all three and require new hypotheses?]

## Active Investigation Log
Date | Source | Finding | Hypothesis affected
-----|--------|---------|--------------------
[  ] | [    ] | [     ] | [                ]

## Confidence Threshold
What level of evidence is required before acting on a hypothesis?
[ ] One strong signal
[ ] Three independent signals
[ ] Published + anecdotal convergence

## Decision Gate
Condition to proceed: [state it]
Condition to abandon: [state it]
Review date: [when will you force a decision?]

## Status
[ ] Open  [ ] Active  [ ] Closed → Decision: [what did you decide?]`,
  },
  {
    id: "L-02",
    label: "Competitor Intelligence Dossier",
    category: "Intelligence",
    artifactKind: "synthesis",
    titleTemplate: "Dossier: [name of entity, product, or participant]",
    contentTemplate: `# Competitor Intelligence Dossier

Subject: [name of entity/product]
Filed: ${new Date().toISOString().slice(0, 10)}
Status: [ ] Active monitoring  [ ] Historical reference

## Identity Layer
What they claim to be: [stated positioning]
What they actually are: [real mechanism — what they actually do]
Gap between claim and reality: [where do they overstate?]

## Mechanics Layer
Core mechanism: [how do they actually deliver value?]
Distribution method: [how do they reach buyers?]
Revenue model: [how do they make money?]

## Strengths (real, not obvious)
→ [What would take 3+ years to replicate?]
→ [What do their best customers reference most?]

## Weaknesses (exploitable)
→ [What do their best customers complain about?]
→ [What do they systematically avoid doing?]
→ [What assumption are they making that may be false?]

## Positioning Gap
→ [What do they leave completely unclaimed?]
→ [Who do they systematically underserve?]
→ [What angle would make them irrelevant?]

## Threat Assessment
Threat level: [ ] Existential  [ ] Significant  [ ] Manageable  [ ] Irrelevant
What would make them dangerous: [specific trigger]
What would neutralize them: [specific move]`,
  },
  {
    id: "L-03",
    label: "Hypothesis Testing Kit",
    category: "Investigation",
    artifactKind: "experiment",
    titleTemplate: "Hypothesis Test: [state the hypothesis in one line]",
    contentTemplate: `# Hypothesis Testing Kit

## Hypothesis
Precise statement: [If X is true, then Y will happen when Z]
Source of belief: [where did this idea come from?]
Prior confidence: [1–10 before evidence]

## Null Hypothesis
What would prove this wrong? [specific condition]
What evidence would you refuse to accept as disproof? [name your blind spots]

## Test Design
What will you actually do? [one specific action]
Who will you observe? [define the test subject precisely]
Time boundary: [when does this test end?]

## Evidence Threshold
Confirms hypothesis: [specific observable result]
Disconfirms hypothesis: [specific observable result]
Inconclusive — needs redesign: [what would trigger a redesign?]

## Results (fill after test)
What actually happened: [record after test]
Evidence match: [ ] Confirmed  [ ] Disconfirmed  [ ] Inconclusive
Updated confidence: [1–10 after evidence]
Next action: [ ] Proceed  [ ] Pivot  [ ] Investigate further  [ ] Abandon

## Upstream Effect
What does this result change about your build plan?
What other hypotheses does this affect?`,
  },
  {
    id: "P-01",
    label: "Product System Map",
    category: "Value Creation",
    artifactKind: "plan",
    titleTemplate: "Product System: [what are you building?]",
    contentTemplate: `# Product System Map

## Product Category
→ Type: [ ] Info product  [ ] Teaching product  [ ] Tool  [ ] Service  [ ] Authority product

## The Problem
Who has it: [describe the specific person]
What it costs them: [what does this problem cost them — time / money / opportunity / pain?]
How they currently solve it: [what are they doing now?]
Why current solutions fall short: [what gap exists?]

## The Solution
What it delivers: [specific outcome — measurable where possible]
How it delivers it: [the mechanism — why this works when others fail]
What makes it durable: [why will this remain valuable in 10 years?]

## Leverage Assessment
→ Creator presence required per delivery: [ ] High  [ ] Medium  [ ] Low  [ ] Zero
→ Leverage type: [ ] 1→many teaching  [ ] 1→many media  [ ] 1→many tools  [ ] Network
→ Scale ceiling: [what limits how many people this can reach?]

## Validation Gate (required before building)
→ V-01 Offer validation: [ ] Run  [ ] Passed
→ V-06 Prototype validation: [ ] Run  [ ] Passed

## Status
[ ] Concept  [ ] Validated  [ ] Building  [ ] Live`,
  },
  {
    id: "P-02",
    label: "Offer Design Blueprint",
    category: "Offer Architecture",
    artifactKind: "plan",
    titleTemplate: "Offer: [name of offer] — Design Blueprint",
    contentTemplate: `# Offer Design Blueprint

## Promise
What specific outcome does this offer deliver?
[State it in one sentence. Measurable where possible. Time-bounded where honest.]

## Mechanism
Why does this work when other approaches fail?
[Name the specific method, system, or approach. This is what makes the offer distinct.]

## Proof
What evidence exists that this produces the promised outcome?
[ ] Case study / testimonial
[ ] Personal documented result
[ ] Logical derivation from established principles
[ ] None yet — prototype validation required first (V-06)

## Price Architecture
Target buyer: [describe]
Reference price in buyer's mind: [what do they currently pay for this problem?]
Positioning intent: [ ] Luxury  [ ] Premium  [ ] Value  [ ] Access
Proposed price: [amount]
Price anchor: [what makes this price feel right in context?]

## Risk Reversal
What makes saying yes feel safe for a skeptical buyer?
[Money-back guarantee / outcome guarantee / free first session / proof before payment]

## Boundary (what is excluded)
[Be precise. An offer with no boundary has no definition.]

## Skeptic Test
Would a brilliant, skeptical buyer who has read all competitor offers find a logical hole here?
[ ] No logical holes → offer is structurally sound
[ ] Found: [describe the hole] → revise before publishing

## Validation Status
→ V-01 Offer validation: [ ] Run  [ ] Passed
→ V-02 Positioning validation: [ ] Run  [ ] Passed
→ V-03 Pricing validation: [ ] Run  [ ] Passed`,
  },
  {
    id: "P-03",
    label: "Leverage System Map",
    category: "Leverage",
    artifactKind: "plan",
    titleTemplate: "Leverage Map: [system or product name]",
    contentTemplate: `# Leverage System Map

## Current State
What am I doing now that requires my presence every time?
[List the 1→1 activities that do not scale]

## Leverage Opportunity
Which of these can be converted to 1→many?
Activity: [name it]
Leverage type: [ ] Teaching product  [ ] Media asset  [ ] Tool  [ ] Framework  [ ] Template

## Build Specification
Input: [what goes in each time the system runs?]
Transformation: [what does the system do to the input?]
Output: [what comes out — and for whom?]
Creator presence required: [ ] Always  [ ] Setup only  [ ] Never

## Leverage Ratio
Current: 1 hour of work → [N] people served
Target: 1 hour of work → [N] people served
How to get there: [what needs to be built?]

## Dependencies
What must be true before this leverage system works?
[ ] Validated demand (V-01)
[ ] Documented process (SOP)
[ ] Delivery mechanism built
[ ] Feedback loop closed

## Timeline
Build phase: [when]
Validation phase: [when]
Live: [when]`,
  },
  {
    id: "P-04",
    label: "Authority System Blueprint",
    category: "Authority",
    artifactKind: "synthesis",
    titleTemplate: "Authority Architecture: [domain or territory]",
    contentTemplate: `# Authority System Blueprint

## Intellectual Territory
What specific domain does this entity own a distinct perspective on?
[Be precise. "Business" is not a territory. "Why most digital products fail at the offer layer" is.]

Owned territory: [state it]
Adjacent territories: [what connects to this without diluting it?]
Forbidden zones: [what must not be claimed — would dilute the territory?]

## Named Framework
What proprietary model or method is associated with this entity?
Framework name: [name it — own the language]
What problem it solves: [one sentence]
How it differs from existing frameworks: [specific contrast]
Falsifiable claim: [what would prove this framework wrong?]

## Consistent Signal
What is the recurring output that accumulates trust over time?
Type: [ ] Writing  [ ] Teaching  [ ] Research  [ ] Demonstration  [ ] System-building
Cadence: [how often?]
Platform: [where does it live?]
Signal law: consistency over 18+ months creates authority. Bursts create attention.

## Proof Chain
What external signals confirm authority in this territory?
[ ] Work produced: [specific examples]
[ ] Results achieved: [specific results]
[ ] Recognition: [citations, references, mentions]
[ ] Track record: [length and nature of experience]
[ ] Intellectual contribution: [what did this entity add to the field?]

## Content Spine
What is the central idea that everything else connects to?
One sentence: [state it]
Everything else must strengthen or extend this — or it doesn't belong in the authority system.

## Degradation Checks
[ ] No income claim framing
[ ] No lifestyle-result positioning
[ ] No trend dependency in the central claim
[ ] Structural superiority demonstrated, not asserted`,
  },
  {
    id: "P-05",
    label: "Value Ladder Architecture",
    category: "Monetization",
    artifactKind: "plan",
    titleTemplate: "Value Ladder: [entity or product family name]",
    contentTemplate: `# Value Ladder Architecture

## Design Law
Each level must deliver genuine transformation.
Each level must create incompleteness that naturally pulls toward the next.
No level exists only to upsell — it must stand on its own.

## Level 0 — Free Tier (trust-building)
What it is: [specific content or tool]
What transformation it creates: [what changes for someone who consumes this?]
Incompleteness it creates: [what do they now understand they're missing?]
Natural pull toward: Level 1

## Level 1 — Entry Tier (first exchange)
What it is: [specific product or service]
Price: [amount]
Promise: [specific outcome]
Who it's for: [describe the buyer at this stage]
Incompleteness it creates: [what do they now understand they need?]
Natural pull toward: Level 2

## Level 2 — Core Tier (primary offer)
What it is: [main product or service]
Price: [amount]
Promise: [specific outcome — full delivery]
Who it's for: [describe the buyer ready for this]
Incompleteness it creates: [what do they want after this?]
Natural pull toward: Level 3

## Level 3 — Premium Tier (accelerated)
What it is: [done-with-you, cohort, intensive]
Price: [amount]
What makes it worth the premium: [closer access, faster results, direct support]
Who it's for: [describe]

## Level 4 — Sovereign Tier (by invitation only)
What it is: [advisory, custom, intimate]
Access: [ ] Application required  [ ] Invitation only
Price: [amount or "not published"]
What it provides that no other tier does: [describe]

## Continuity Layer
Which level(s) have recurring revenue potential?
Level: [which one?]
Type: [ ] Subscription to access  [ ] Service retainer  [ ] Ongoing program  [ ] Community
Retention law: recurring revenue is earned by continuous delivery, not by friction.

## Validation Status
→ Level 0 validated: [ ]
→ Level 1 validated (V-01): [ ]
→ Level 2 validated (V-01 + V-03): [ ]`,
  },
];

interface LabBlueprintTemplatesProps {
  onCreated?: (artifactId: string) => void;
}

export default function LabBlueprintTemplates({ onCreated }: LabBlueprintTemplatesProps) {
  const { session, updateReEntry } = useSession();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  function handleCreate(bp: Blueprint) {
    if (creating) return;
    setCreating(bp.id);
    try {
      const result = saveArtifact({
        session_id: session?.session_id ?? "lab-anon",
        kind: bp.artifactKind,
        title: bp.titleTemplate,
        summary: `${bp.label} — sovereign blueprint from Value Engine.`,
        content: bp.contentTemplate,
        tags: ["creation-lab", "blueprint", bp.id, bp.category.toLowerCase().replace(/\s+/g, "-")],
        source: "lab",
        userId: user?.id,
      });
      updateReEntry(`lab:blueprint:${bp.id}`);
      setCreated(bp.id);
      setExpanded(false);
      setTimeout(() => setCreated(null), 2200);
      if (onCreated) onCreated(result.artifact.artifact_id);
    } catch (e: unknown) {
      // governance cap or storage failure — surface nothing silently here
      console.warn("Blueprint save failed:", e);
    } finally {
      setCreating(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "8px",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: BLUE_MUTED,
        }}>
          Blueprint Templates
        </span>
        <motion.button
          whileHover={{ opacity: 1 }}
          onClick={() => setExpanded(v => !v)}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            color: BLUE_MUTED,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.08em",
            opacity: 0.7,
          }}
        >
          {expanded ? "hide" : "show"}
        </motion.button>
      </div>

      {/* Created confirmation */}
      <AnimatePresence>
        {created && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              color: "rgba(0,229,160,0.75)",
              padding: "6px 0",
            }}
          >
            ✓ Blueprint created as {BLUEPRINTS.find(b => b.id === created)?.artifactKind}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blueprint list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="blueprints"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {BLUEPRINTS.map(bp => (
                <motion.button
                  key={bp.id}
                  whileHover={{ x: 3, borderColor: `${BLUE}33` }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleCreate(bp)}
                  disabled={creating === bp.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    background: BLUE_FAINT,
                    border: `1px solid ${BLUE}18`,
                    borderRadius: "9px",
                    padding: "12px 16px",
                    cursor: creating ? "not-allowed" : "pointer",
                    textAlign: "left",
                    transition: "border-color 0.15s",
                  }}
                >
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "8px",
                    color: BLUE,
                    letterSpacing: "0.15em",
                    minWidth: "36px",
                    flexShrink: 0,
                  }}>
                    {bp.id}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{
                      fontFamily: "Syne, system-ui, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "rgba(210,225,235,0.88)",
                    }}>
                      {bp.label}
                    </span>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "8px",
                      color: "rgba(150,165,180,0.4)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}>
                      {bp.category} · {bp.artifactKind}
                    </span>
                  </div>
                  <span style={{
                    marginLeft: "auto",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "9px",
                    color: BLUE_MUTED,
                    flexShrink: 0,
                  }}>
                    {creating === bp.id ? "creating..." : "→ create"}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
