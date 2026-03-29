/**
 * TestBay.tsx
 * Core work zone for the Lab tri-core portal.
 * Three artifact kinds: hypothesis · experiment · evidence.
 *
 * Canon: TRI-CORE-PARITY-001 · @claude · 2026-03-29
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveArtifact, getRecentArtifacts } from "@/lib/artifacts/store";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import type { ArtifactKind } from "@/lib/artifacts/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const TEAL = "hsl(172, 55%, 36%)";
const TEAL_LIGHT = "hsl(172, 48%, 55%)";
const TEAL_FAINT = "hsla(172, 55%, 36%, 0.12)";

type LabKind = "hypothesis" | "experiment" | "evidence";

const KIND_META: Record<LabKind, { label: string; prompt: string; titlePlaceholder: string; contentPlaceholder: string }> = {
  hypothesis: {
    label: "Hypothesis",
    prompt: "State a falsifiable claim.",
    titlePlaceholder: "If X then Y because Z...",
    contentPlaceholder: "Conditions: ...\nExpected outcome: ...\nFalsifiable if: ...",
  },
  experiment: {
    label: "Experiment",
    prompt: "Define the test procedure.",
    titlePlaceholder: "Test: [what you're testing]",
    contentPlaceholder: "Method: ...\nVariables: ...\nSuccess criteria: ...\nObservations: ...",
  },
  evidence: {
    label: "Evidence",
    prompt: "Capture what you observed — no interpretation.",
    titlePlaceholder: "Observed: [exact observation]",
    contentPlaceholder: "Raw data: ...\nContext: ...\nSource: ...",
  },
};

interface QuickCreateProps {
  onCreated: () => void;
  prefill?: { kind: LabKind; title: string; content: string } | null;
}

function QuickCreate({ onCreated, prefill }: QuickCreateProps) {
  const { session, updateReEntry } = useSession();
  const { user } = useAuth();
  const [active, setActive] = useState<LabKind | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When a validation framework is selected, prefill the form
  useEffect(() => {
    if (prefill) {
      setActive(prefill.kind);
      setTitle(prefill.title);
      setContent(prefill.content);
      setError(null);
    }
  }, [prefill]);

  function openKind(kind: LabKind) {
    setActive(kind);
    setTitle("");
    setContent("");
    setError(null);
  }

  function handleSave() {
    if (!active || !title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      saveArtifact({
        session_id: session?.session_id ?? "anon",
        kind: active as ArtifactKind,
        title: title.trim(),
        summary: content.slice(0, 120),
        content,
        tags: ["lab", "test", active],
        source: "test",
        userId: user?.id,
      });
      updateReEntry(`test:${active}`);
      setActive(null);
      onCreated();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Kind selector */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {(Object.keys(KIND_META) as LabKind[]).map(kind => (
          <motion.button
            key={kind}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openKind(kind)}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: active === kind ? "#05100d" : TEAL_LIGHT,
              background: active === kind ? TEAL : TEAL_FAINT,
              border: `1px solid ${active === kind ? TEAL : TEAL + "44"}`,
              borderRadius: "7px",
              padding: "8px 18px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            + {KIND_META[kind].label}
          </motion.button>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${TEAL}33`,
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: `${TEAL}99`, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {KIND_META[active].prompt}
            </span>

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={KIND_META[active].titlePlaceholder}
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(228,235,240,0.88)",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${TEAL}33`,
                outline: "none",
                padding: "6px 0",
                width: "100%",
              }}
            />

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={KIND_META[active].contentPlaceholder}
              rows={4}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "rgba(170,190,210,0.7)",
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "vertical",
                lineHeight: 1.6,
                width: "100%",
              }}
            />

            {error && (
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "hsl(0,52%,52%)" }}>
                {error}
              </span>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!title.trim() || saving}
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#05100d",
                  background: !title.trim() ? `${TEAL}66` : TEAL,
                  border: "none",
                  borderRadius: "7px",
                  padding: "8px 20px",
                  cursor: title.trim() ? "pointer" : "not-allowed",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </motion.button>
              <button
                onClick={() => setActive(null)}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "10px",
                  color: "rgba(150,165,180,0.5)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Validation Frameworks ────────────────────────────────────────────────────

interface ValidationFrame {
  id: string;
  label: string;
  domain: string;
  kind: LabKind;
  titleTemplate: string;
  contentTemplate: string;
}

const VALIDATION_FRAMES: ValidationFrame[] = [
  {
    id: "V-01",
    label: "Offer Validation",
    domain: "Value Creation",
    kind: "hypothesis",
    titleTemplate: "Offer hypothesis: [target] will exchange [price] to solve [problem]",
    contentTemplate:
      "Target: [describe the specific person]\nProblem: [state the problem they have]\nSolution offered: [what you offer]\nPrice: [price point]\nHypothesis: [target] experiences [problem] acutely enough to pay [price] without needing to be convinced the problem exists.\n\nFalsifiable if: 3 out of 5 qualified prospects signal genuine purchase intent without prompting.\n\nTest method: direct conversation — no pitch, only questions about the problem.\nSuccess signal: they ask how to buy before you mention it.",
  },
  {
    id: "V-02",
    label: "Positioning Validation",
    domain: "Distribution",
    kind: "experiment",
    titleTemplate: "Positioning test: does this message land without explanation?",
    contentTemplate:
      "Message being tested:\n[paste the exact message or headline]\n\nTarget respondent: [describe the ideal person]\nMethod: show message cold to 5 ideal prospects — ask them to describe what it offers in their own words.\n\nSuccess criteria: description matches intent without prompting or clarification needed.\nFail criteria: confusion, misattribution, or 'what do you mean by X?' responses.\n\nObservations:\n[record verbatim responses here]",
  },
  {
    id: "V-03",
    label: "Pricing Validation",
    domain: "Monetization",
    kind: "experiment",
    titleTemplate: "Pricing test: does [price] reflect perceived value for [segment]?",
    contentTemplate:
      "Offer: [name of offer]\nPrice being tested: [price]\nTarget segment: [describe]\n\nTest method: Van Westendorp — ask 5+ qualified prospects:\n1. At what price would this feel too cheap (suspicious)?\n2. At what price would this feel expensive but worth it?\n3. At what price would this feel too expensive (would not buy)?\n\nResults:\nToo cheap threshold: \nExpensive but worth it: \nToo expensive: \n\nConclusion:\n[does the tested price sit in the acceptable zone?]",
  },
  {
    id: "V-04",
    label: "Channel Validation",
    domain: "Distribution",
    kind: "experiment",
    titleTemplate: "Channel test: does [channel] reach [ideal person] efficiently?",
    contentTemplate:
      "Channel: [name of channel / platform]\nIdeal person: [describe]\nTest duration: 30 days\nInput: [what will you post / do / participate in?]\n\nMetric: qualified signal rate (qualified responses per hour invested)\nThreshold: [define what counts as a qualified response]\n\nObservations:\nDay 7: \nDay 14: \nDay 21: \nDay 30: \n\nVerdict:\n[did this channel reach the right people efficiently, or did it generate volume without qualification?]",
  },
  {
    id: "V-05",
    label: "Traction Hypothesis",
    domain: "Market Testing",
    kind: "hypothesis",
    titleTemplate: "Traction hypothesis: if [X] then we observe [Y] within [Z]",
    contentTemplate:
      "Claim: [state the specific belief about the market]\nHypothesis: if [X] is true, we will observe [Y] within [Z time period].\n\nMinimum observable signal: [what is the smallest piece of evidence that would confirm X?]\nTimeframe: [Z]\n\nTest conditions:\n[what exactly will you do to create the conditions for the signal to appear?]\n\nResult:\n[what was actually observed?]\n\nVerdict:\n□ Hypothesis confirmed — X appears to be true\n□ Hypothesis rejected — X does not appear to be true at this time\n□ Inconclusive — redesign the test",
  },
  {
    id: "V-06",
    label: "Prototype Validation",
    domain: "Value Creation",
    kind: "experiment",
    titleTemplate: "Prototype test: does this minimum version deliver the promised outcome?",
    contentTemplate:
      "Prototype: [describe the minimum version]\nPromised outcome: [what should users achieve?]\nEarly users: [3+ people — describe who they are]\nDelivery method: [how will they experience the prototype?]\nSupport provided: [none / minimal / guided — be honest]\n\nSuccess criteria: users achieve the promised outcome without creator intervention.\nFail criteria: users need significant creator support to get results — product gap.\n\nUser observations:\nUser 1: \nUser 2: \nUser 3: \n\nVerdict:\n[does the prototype deliver the outcome without the creator?]",
  },
  {
    id: "V-07",
    label: "Benchmark Comparison",
    domain: "Benchmark Tribunal",
    kind: "experiment",
    titleTemplate: "Benchmark: does this surpass [reference standard] on [dimension]?",
    contentTemplate:
      "System being benchmarked: [name]\nReference standard: [the category leader or accepted baseline]\nDimension: [the specific dimension being compared — must be precisely defined]\n\nMethod: [how will you compare these two on this dimension?]\nMeasurement: [what is the unit of measurement?]\n\nResults:\nThis system: \nReference standard: \n\nVerdict:\n□ Measurable superiority — surpasses benchmark on this dimension\n□ Parity — matches benchmark\n□ Inferiority — does not yet surpass benchmark\n\nNext action if inferior:\n[what specific change would close the gap?]",
  },
];

interface ValidationFrameworksProps {
  onSelect: (frame: ValidationFrame) => void;
}

function ValidationFrameworks({ onSelect }: ValidationFrameworksProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: `${TEAL}66` }}>
          Validation Frameworks
        </span>
        <button
          onClick={() => setExpanded(v => !v)}
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: `${TEAL}88`, background: "transparent", border: "none", cursor: "pointer", letterSpacing: "0.08em" }}
        >
          {expanded ? "hide" : "show all"}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {VALIDATION_FRAMES.map(frame => (
                <motion.button
                  key={frame.id}
                  whileHover={{ x: 4 }}
                  onClick={() => { onSelect(frame); setExpanded(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${TEAL}22`,
                    borderRadius: "8px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: TEAL, letterSpacing: "0.15em", minWidth: "32px" }}>
                    {frame.id}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(210,225,235,0.85)" }}>
                      {frame.label}
                    </span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: "rgba(150,165,180,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {frame.domain}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ArtifactRowProps {
  title: string;
  kind: string;
  ts: string;
}

function ArtifactRow({ title, kind, ts }: ArtifactRowProps) {
  const date = new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", minWidth: "80px" }}>
          {kind}
        </span>
        <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "13px", color: "rgba(210,225,235,0.8)" }}>
          {title}
        </span>
      </div>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "rgba(150,165,180,0.4)" }}>
        {date}
      </span>
    </div>
  );
}

export default function TestBay() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [prefill, setPrefill] = useState<{ kind: LabKind; title: string; content: string } | null>(null);

  const recentLabArtifacts = getRecentArtifacts(6).filter(
    a => a.kind === "experiment" || a.kind === "evidence" || a.kind === "hypothesis"
  );

  function handleFrameworkSelect(frame: ValidationFrame) {
    setPrefill({ kind: frame.kind, title: frame.titleTemplate, content: frame.contentTemplate });
    document.getElementById("test-bay-create")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="test-bay"
      aria-label="Test Bay"
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "clamp(32px, 6vh, 64px) clamp(20px, 5vw, 72px)",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      {/* Header */}
      <div>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: `${TEAL}66`, display: "block", marginBottom: "10px" }}>
          Lab · Test Bay
        </span>
        <h2 style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "rgba(228,235,240,0.88)", margin: 0, letterSpacing: "-0.02em" }}>
          Run your next experiment
        </h2>
      </div>

      {/* Validation frameworks — value engine infusion */}
      <ValidationFrameworks onSelect={handleFrameworkSelect} />

      {/* Quick create */}
      <div id="test-bay-create">
        <QuickCreate onCreated={() => { setRefreshKey(k => k + 1); setPrefill(null); }} prefill={prefill} />
      </div>

      {/* Recent lab artifacts */}
      {recentLabArtifacts.length > 0 && (
        <div key={refreshKey}>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(150,165,180,0.4)", display: "block", marginBottom: "8px" }}>
            Recent experiments
          </span>
          {recentLabArtifacts.map(a => (
            <ArtifactRow key={a.artifact_id} title={a.title} kind={a.kind} ts={a.ts_last_accessed} />
          ))}
        </div>
      )}
    </section>
  );
}
