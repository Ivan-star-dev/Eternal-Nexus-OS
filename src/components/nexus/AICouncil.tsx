import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Globe, Send, Users, HeartPulse, Cloud, DollarSign, Shield, Zap, CheckCircle2, Clock, AlertTriangle, Archive, Inbox } from "lucide-react";
import { useProposalQueue } from "@/hooks/useProposalQueue";
import { audioEngine } from "@/lib/audioEngine";

// ═══ Agent definitions ═══
interface Agent {
  id: string;
  label: string;
  role: string;
  color: string;
  icon: React.ReactNode;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
}

const AGENTS: Agent[] = [
  { id: "climate", label: "Min. Clima", role: "Ministro do Clima", color: "#22cc66", icon: <Cloud className="h-3 w-3" />, orbitRadius: 3.2, orbitSpeed: 0.3, orbitOffset: 0 },
  { id: "economy", label: "Min. Economia", role: "Ministro da Economia", color: "#f5c24a", icon: <DollarSign className="h-3 w-3" />, orbitRadius: 3.0, orbitSpeed: 0.35, orbitOffset: Math.PI * 0.4 },
  { id: "health", label: "Min. Saúde", role: "Ministro da Saúde", color: "#ff4466", icon: <HeartPulse className="h-3 w-3" />, orbitRadius: 3.4, orbitSpeed: 0.28, orbitOffset: Math.PI * 0.8 },
  { id: "security", label: "Min. Defesa", role: "Ministro da Defesa", color: "#4488ff", icon: <Shield className="h-3 w-3" />, orbitRadius: 2.8, orbitSpeed: 0.32, orbitOffset: Math.PI * 1.2 },
  { id: "infra", label: "Min. Infra", role: "Ministro de Infraestrutura", color: "#cc88ff", icon: <Zap className="h-3 w-3" />, orbitRadius: 3.6, orbitSpeed: 0.25, orbitOffset: Math.PI * 1.6 },
];

// ═══ Dialogue system ═══
interface Dialogue {
  agentId: string;
  text: string;
  timestamp: number;
}

const DEBATE_SCRIPTS: Dialogue[][] = [
  [
    { agentId: "climate", text: "Prioridade: emissões em São Paulo aumentaram 12% — precisamos cortar transporte fóssil.", timestamp: 0 },
    { agentId: "economy", text: "Corte abrupto custa 4.2bi. Proponho transição em 18 meses com subsídio EV.", timestamp: 3000 },
    { agentId: "health", text: "AQI acima de 100 por 30 dias = +15% internações respiratórias em idosos.", timestamp: 6000 },
    { agentId: "security", text: "Infraestrutura de grid não suporta 100% EV. Risco de blackout.", timestamp: 9000 },
    { agentId: "infra", text: "Solução: micro-grids solares descentralizados. Custo: 800M, ROI 3 anos.", timestamp: 12000 },
  ],
  [
    { agentId: "health", text: "Alerta: variante pandémica detectada — CFR 3.2%, R0 estimado 6.1.", timestamp: 0 },
    { agentId: "security", text: "Fronteiras: recomendo screening em 48 portos principais.", timestamp: 3000 },
    { agentId: "economy", text: "Lockdown custaria 1.8% do GDP global. Preferível vacinação massiva.", timestamp: 6000 },
    { agentId: "climate", text: "Paradoxo: lockdowns reduziram emissões 17% em 2020. Oportunidade?", timestamp: 9000 },
    { agentId: "infra", text: "Hospitais precisam +200k camas em 60 dias. Mobilizo construção modular.", timestamp: 12000 },
  ],
  [
    { agentId: "climate", text: "Mar subiu 0.44m na projeção SSP2. Jakarta, Shanghai em risco crítico.", timestamp: 0 },
    { agentId: "infra", text: "Barreiras costeiras: 12bi para proteger 50M pessoas. Delta Spine tech.", timestamp: 3000 },
    { agentId: "health", text: "Evacuação de idosos: 30% da pop de Tóquio acima de 65 anos.", timestamp: 6000 },
    { agentId: "economy", text: "Seguro catastrófico: 340bi em risco. Proposta de fundo soberano global.", timestamp: 9000 },
    { agentId: "security", text: "Migrações climáticas: 200M refugiados projetados. Preparem corredores.", timestamp: 12000 },
  ],
];

// ═══ Parliament Proposal — structured output ═══

export interface ParliamentProposal {
  id: string;
  title: string;
  scenario: string;
  recommendation: string;
  votes: Record<string, string>;
  impact: { cost: string; roi: string; riskLevel: "BAIXO" | "MÉDIO" | "ALTO" | "CRÍTICO" };
  approvedAt: string;
  consensusHash: string;
}

const PARLIAMENT_LEDGER_KEY = "nexus:parliament-ledger";

const PROPOSAL_METADATA: Array<{
  title: string;
  scenario: string;
  recommendation: string;
  votes: Record<string, string>;
  impact: { cost: string; roi: string; riskLevel: "BAIXO" | "MÉDIO" | "ALTO" | "CRÍTICO" };
}> = [
  {
    title: "Transição Energética Urbana — São Paulo 2026",
    scenario: "AQI crítico · emissões +12% · risco de blackout por adoção abrupta de EV",
    recommendation: "Micro-grids solares descentralizados · transição faseada 18 meses · subsídio EV 800M USD",
    votes: { climate: "FAVOR", economy: "FAVOR (subsídio)", health: "FAVOR (AQI)", security: "FAVOR (grid)", infra: "FAVOR (lidera)" },
    impact: { cost: "800M USD", roi: "3 anos", riskLevel: "MÉDIO" },
  },
  {
    title: "Resposta de Emergência — Variante Pandémica Alpha-7",
    scenario: "CFR 3.2% · R0 6.1 detectado · pressão hospitalar iminente",
    recommendation: "Vacinação massiva + screening 48 portos + 200k camas modulares em 60 dias",
    votes: { climate: "FAVOR (emissões -17%)", economy: "FAVOR (evita lockdown)", health: "FAVOR (lidera)", security: "FAVOR (fronteiras)", infra: "FAVOR (camas)" },
    impact: { cost: "1.2B USD", roi: "5 anos", riskLevel: "CRÍTICO" },
  },
  {
    title: "Escudo Costeiro Global — Crise de Nível do Mar SSP2",
    scenario: "+0.44m projetado · Jakarta + Shanghai em risco · 200M migrantes climáticos",
    recommendation: "Fundo soberano global 340bi · barreiras Delta Spine 12bi · corredores de migração formalizados",
    votes: { climate: "FAVOR", economy: "FAVOR (fundo soberano)", health: "FAVOR (evacuação 65+)", security: "FAVOR (corredores)", infra: "FAVOR (lidera)" },
    impact: { cost: "352B USD", roi: "20 anos", riskLevel: "CRÍTICO" },
  },
];

function readProposalLedger(): ParliamentProposal[] {
  try {
    const raw = localStorage.getItem(PARLIAMENT_LEDGER_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ParliamentProposal[];
  } catch {
    return [];
  }
}

function appendToProposalLedger(proposal: ParliamentProposal): void {
  // localStorage — always works
  try {
    const existing = readProposalLedger();
    const next = [proposal, ...existing.filter((p) => p.id !== proposal.id)].slice(0, 10);
    localStorage.setItem(PARLIAMENT_LEDGER_KEY, JSON.stringify(next));
  } catch { /* quota — fail silently */ }

  // Supabase — V6-COUNCIL-LIVE-001: persist to proposal_ledger table
  // Graceful: if table doesn't exist yet, fails silently
  import("@/integrations/supabase/client").then(({ supabase }) => {
    supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("proposal_ledger" as any)
      .upsert({
        id: proposal.id,
        title: proposal.title,
        proposal_text: proposal.proposalText,
        risk_level: proposal.impact.riskLevel,
        roi: proposal.impact.roi,
        timeline: proposal.impact.timeline,
        approved_at: new Date().toISOString(),
      }, { onConflict: "id" })
      .then(({ error }) => {
        if (error && !error.message?.includes("does not exist")) {
          // Only log unexpected errors — missing table is expected until migration runs
          console.warn("[AICouncil] proposal_ledger upsert:", error.message);
        }
      });
  }).catch(() => { /* module load fail — silent */ });
}

function makeProposalId(debateIndex: number, ts: string): string {
  return `parl-${debateIndex % PROPOSAL_METADATA.length}-${ts.slice(0, 10).replace(/-/g, "")}`;
}

// ─── ProposalCard — shown when debate completes, before approve ───

function ProposalCard({ debateIndex, onApprove, migrating }: {
  debateIndex: number;
  onApprove: () => void;
  migrating: boolean;
}) {
  const meta = PROPOSAL_METADATA[debateIndex % PROPOSAL_METADATA.length];
  const riskColor = meta.impact.riskLevel === "CRÍTICO"
    ? "text-destructive border-destructive/40 bg-destructive/5"
    : meta.impact.riskLevel === "ALTO"
      ? "text-orange-400 border-orange-400/40 bg-orange-400/5"
      : meta.impact.riskLevel === "MÉDIO"
        ? "text-yellow-400 border-yellow-400/40 bg-yellow-400/5"
        : "text-accent-foreground border-accent/40 bg-accent/5";

  const cardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as number[] } },
    exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.2 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -6 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.07, duration: 0.28, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={migrating ? "exit" : "visible"}
      className="mt-3 border border-primary/20 rounded-lg bg-primary/5 p-3 space-y-2"
    >
      <motion.div variants={rowVariants} custom={0} initial="hidden" animate="visible" className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-[0.5rem] tracking-[0.2em] text-primary/60 uppercase block">
            PROPOSTA APROVÁVEL
          </span>
          <span className="font-mono text-[0.65rem] text-foreground font-semibold leading-tight block mt-0.5">
            {meta.title}
          </span>
        </div>
        <span className={`shrink-0 font-mono text-[0.4rem] px-1.5 py-0.5 rounded border ${riskColor}`}>
          {meta.impact.riskLevel}
        </span>
      </motion.div>

      <motion.p variants={rowVariants} custom={1} initial="hidden" animate="visible" className="font-mono text-[0.5rem] text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-2">
        {meta.scenario}
      </motion.p>

      <motion.div variants={rowVariants} custom={2} initial="hidden" animate="visible" className="bg-background/60 border border-border/20 rounded p-2">
        <span className="font-mono text-[0.4rem] text-primary/60 uppercase tracking-widest block mb-1">
          Recomendação do Conselho
        </span>
        <span className="font-mono text-[0.5rem] text-foreground leading-relaxed">
          {meta.recommendation}
        </span>
      </motion.div>

      <motion.div variants={rowVariants} custom={3} initial="hidden" animate="visible" className="grid grid-cols-3 gap-1">
        <div className="bg-background/40 rounded p-1.5 text-center">
          <span className="font-mono text-[0.4rem] text-muted-foreground block">CUSTO</span>
          <span className="font-mono text-[0.5rem] text-foreground font-semibold">{meta.impact.cost}</span>
        </div>
        <div className="bg-background/40 rounded p-1.5 text-center">
          <span className="font-mono text-[0.4rem] text-muted-foreground block">ROI</span>
          <span className="font-mono text-[0.5rem] text-foreground font-semibold">{meta.impact.roi}</span>
        </div>
        <div className="bg-background/40 rounded p-1.5 text-center">
          <span className="font-mono text-[0.4rem] text-muted-foreground block">VOTOS</span>
          <span className="font-mono text-[0.5rem] text-accent-foreground font-semibold">
            {Object.keys(meta.votes).length}/{AGENTS.length} ✓
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ProposalLedger — persisted approved decisions ───

function ProposalLedger() {
  const [proposals, setProposals] = useState<ParliamentProposal[]>([]);

  useEffect(() => {
    setProposals(readProposalLedger());
  }, []);

  if (proposals.length === 0) return null;

  return (
    <div className="border-t border-border/20 px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <Archive className="h-3.5 w-3.5 text-primary/60" />
        <span className="font-mono text-[0.5rem] tracking-[0.2em] text-primary/60 uppercase">
          Ledger do Parlamento — {proposals.length} proposta{proposals.length > 1 ? "s" : ""} aprovada{proposals.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-1.5">
        {proposals.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" }}
            className="flex items-start gap-2 px-2 py-1.5 bg-card/50 border border-border/20 rounded"
          >
            <CheckCircle2 className="h-3 w-3 text-accent-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-mono text-[0.5rem] text-foreground font-medium block truncate">
                {p.title}
              </span>
              <span className="font-mono text-[0.4rem] text-muted-foreground block mt-0.5 line-clamp-1">
                {p.recommendation}
              </span>
            </div>
            <div className="shrink-0 text-right">
              <span className={`font-mono text-[0.38rem] px-1 py-0.5 rounded border ${
                p.impact.riskLevel === "CRÍTICO"
                  ? "text-destructive border-destructive/30"
                  : p.impact.riskLevel === "ALTO"
                    ? "text-orange-400 border-orange-400/30"
                    : "text-yellow-400 border-yellow-400/30"
              }`}>
                {p.impact.riskLevel}
              </span>
              <span className="font-mono text-[0.38rem] text-muted-foreground/60 block mt-0.5">
                {new Date(p.approvedAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══ 3D Agent Sphere ═══
function AgentSphere({ agent, speaking, migrating }: { agent: Agent; speaking: boolean; migrating: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(agent.color), [agent.color]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    if (migrating) {
      // Fly outward — migrating to Atlas
      meshRef.current.position.z -= 0.08;
      meshRef.current.position.y += 0.02;
      meshRef.current.scale.multiplyScalar(0.995);
    } else {
      // Orbit around center
      const angle = t * agent.orbitSpeed + agent.orbitOffset;
      meshRef.current.position.x = Math.cos(angle) * agent.orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * agent.orbitRadius;
      meshRef.current.position.y = Math.sin(t * 0.5 + agent.orbitOffset) * 0.3;
    }

    // Pulse when speaking
    if (glowRef.current) {
      const s = speaking ? 1.4 + Math.sin(t * 8) * 0.3 : 1.0;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial
          color={agent.color}
          metalness={0.85}
          roughness={0.15}
          emissive={agent.color}
          emissiveIntensity={speaking ? 0.8 : 0.3}
        />
      </mesh>
      {/* Glow ring */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.02, 8, 32]} />
        <meshBasicMaterial color={agent.color} transparent opacity={speaking ? 0.8 : 0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Eye dots */}
      <mesh position={[-0.08, 0.06, 0.24]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.08, 0.06, 0.24]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// ═══ Central Nexus Core ═══
function NexusCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color="hsl(45, 80%, 55%)"
          metalness={0.95}
          roughness={0.05}
          emissive="hsl(45, 80%, 55%)"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="hsl(45, 80%, 55%)"
          metalness={0.9}
          roughness={0.1}
          emissive="hsl(45, 80%, 55%)"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Orbital rings */}
      {[1.5, 2.2, 3.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, i * 0.3, 0]}>
          <torusGeometry args={[r, 0.008, 8, 64]} />
          <meshBasicMaterial color="hsl(45, 80%, 55%)" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

// ═══ Connection lines between agents and core ═══
function ConnectionLines({ speakingAgent }: { speakingAgent: string | null }) {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.children.forEach((child, i) => {
      const agent = AGENTS[i];
      if (!agent) return;
      const t = state.clock.elapsedTime;
      const angle = t * agent.orbitSpeed + agent.orbitOffset;
      const x = Math.cos(angle) * agent.orbitRadius;
      const z = Math.sin(angle) * agent.orbitRadius;
      const y = Math.sin(t * 0.5 + agent.orbitOffset) * 0.3;

      // Update line geometry
      const geo = (child as THREE.Line).geometry as THREE.BufferGeometry;
      const pos = geo.getAttribute("position");
      if (pos) {
        pos.setXYZ(0, 0, 0, 0);
        pos.setXYZ(1, x, y, z);
        pos.needsUpdate = true;
      }
    });
  });

  return (
    <group ref={linesRef}>
      {AGENTS.map((agent) => (
        <line key={agent.id}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, 0, 0, agent.orbitRadius, 0, 0]), 3]}
              count={2}
              array={new Float32Array([0, 0, 0, agent.orbitRadius, 0, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={agent.color}
            transparent
            opacity={agent.id === speakingAgent ? 0.6 : 0.15}
          />
        </line>
      ))}
    </group>
  );
}

// ═══ Scene ═══
function CouncilScene({ speakingAgent, migrating }: { speakingAgent: string | null; migrating: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} color="#ffd700" />
      <pointLight position={[0, 5, 5]} intensity={1.2} color="#ffd700" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#4488ff" />
      <NexusCore />
      <ConnectionLines speakingAgent={speakingAgent} />
      {AGENTS.map((a) => (
        <AgentSphere key={a.id} agent={a} speaking={a.id === speakingAgent} migrating={migrating} />
      ))}
    </>
  );
}

// ═══ Main Component ═══
interface AICouncilProps {
  onDecisionApproved?: (decision: string) => void;
  onMigrateToAtlas?: () => void;
}

export default function AICouncil({ onDecisionApproved, onMigrateToAtlas }: AICouncilProps) {
  const [debateIndex, setDebateIndex] = useState(0);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [activeDialogues, setActiveDialogues] = useState<Dialogue[]>([]);
  const [speakingAgent, setSpeakingAgent] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [debateActive, setDebateActive] = useState(false);
  const [ledgerVersion, setLedgerVersion] = useState(0);
  const [autoProposal, setAutoProposal] = useState<ParliamentProposal | null>(null);
  const dialoguesRef = useRef<HTMLDivElement>(null);

  // V5-AI-PROPOSALS-001: auto-generated proposals from project registry
  const { pendingCount, dequeue, isLive } = useProposalQueue();

  const currentScript = DEBATE_SCRIPTS[debateIndex % DEBATE_SCRIPTS.length];

  // Auto-advance dialogue
  useEffect(() => {
    if (!debateActive || dialogueStep >= currentScript.length) return;

    const timer = setTimeout(() => {
      const d = currentScript[dialogueStep];
      setActiveDialogues((prev) => [...prev.slice(-4), d]);
      setSpeakingAgent(d.agentId);
      setDialogueStep((s) => s + 1);

      // Stop speaking after 2.5s
      setTimeout(() => setSpeakingAgent(null), 2500);
    }, dialogueStep === 0 ? 500 : 3500);

    return () => clearTimeout(timer);
  }, [debateActive, dialogueStep, currentScript]);

  // Auto-scroll dialogues
  useEffect(() => {
    dialoguesRef.current?.scrollTo({ top: dialoguesRef.current.scrollHeight, behavior: "smooth" });
  }, [activeDialogues]);

  const startDebate = useCallback(() => {
    setActiveDialogues([]);
    setDialogueStep(0);
    setSpeakingAgent(null);
    setMigrating(false);
    setDebateActive(true);
  }, []);

  const nextDebate = useCallback(() => {
    setDebateIndex((i) => i + 1);
    setActiveDialogues([]);
    setDialogueStep(0);
    setSpeakingAgent(null);
    setMigrating(false);
    setDebateActive(true);
    setAutoProposal(null);
  }, []);

  // V5-AI-PROPOSALS-001: pull next auto-generated proposal from queue
  const loadAutoProposal = useCallback(() => {
    const p = dequeue();
    if (p) {
      setAutoProposal(p);
      setActiveDialogues([]);
      setDialogueStep(0);
      setSpeakingAgent(null);
      setMigrating(false);
      setDebateActive(false);
    }
  }, [dequeue]);

  const approveAutoProposal = useCallback(() => {
    if (!autoProposal) return;
    audioEngine.init();
    audioEngine.play("uiConfirm");
    appendToProposalLedger(autoProposal);
    setLedgerVersion((v) => v + 1);
    onDecisionApproved?.(autoProposal.recommendation);
    setAutoProposal(null);
    setTimeout(() => onMigrateToAtlas?.(), 2000);
  }, [autoProposal, onDecisionApproved, onMigrateToAtlas]);

  const approveAndMigrate = useCallback(() => {
    const meta = PROPOSAL_METADATA[debateIndex % PROPOSAL_METADATA.length];
    const ts = new Date().toISOString();

    // Build structured proposal
    const proposal: ParliamentProposal = {
      id: makeProposalId(debateIndex, ts),
      title: meta.title,
      scenario: meta.scenario,
      recommendation: meta.recommendation,
      votes: meta.votes,
      impact: meta.impact,
      approvedAt: ts,
      consensusHash: `0x${Array.from(meta.title).reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0).toString(16).padStart(8, "0")}`,
    };

    // Persist to ledger
    appendToProposalLedger(proposal);
    setLedgerVersion((v) => v + 1);

    // Legacy string handoff for swarm prompt
    const decision = activeDialogues.map((d) => {
      const agent = AGENTS.find((a) => a.id === d.agentId);
      return `${agent?.role}: ${d.text}`;
    }).join("\n");

    audioEngine.init();
    audioEngine.play("projectClick");
    setMigrating(true);
    onDecisionApproved?.(decision);

    setTimeout(() => {
      onMigrateToAtlas?.();
      setMigrating(false);
    }, 3000);
  }, [activeDialogues, debateIndex, onDecisionApproved, onMigrateToAtlas]);

  const debateComplete = dialogueStep >= currentScript.length;

  return (
    <div className="bg-card border border-primary/20 rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
        <Brain className="h-4 w-4 text-primary" />
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-primary uppercase">
          AI Council — Parlamento Digital
        </span>
        <div className="ml-auto flex items-center gap-2">
          {/* V5: auto-proposal queue badge */}
          {pendingCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={loadAutoProposal}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-primary/30 bg-primary/8 hover:bg-primary/15 transition-colors cursor-pointer"
              title="Carregar proposta automática do registo de projetos"
            >
              <Inbox className="h-2.5 w-2.5 text-primary/70" />
              <span className="font-mono text-[0.38rem] text-primary/70 tracking-widest">
                {pendingCount} AUTO
              </span>
              {!isLive && (
                <span className="font-mono text-[0.3rem] text-muted-foreground/50 ml-0.5">
                  stub
                </span>
              )}
            </motion.button>
          )}
          <span className="font-mono text-[0.4rem] text-muted-foreground">
            {AGENTS.length} ministros ativos
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* 3D Canvas */}
        <div className="w-full md:w-1/2 h-64 md:h-80 bg-background/50">
          <Canvas camera={{ position: [0, 3, 8], fov: 45 }} dpr={[1, 1.5]}>
            <CouncilScene speakingAgent={speakingAgent} migrating={migrating} />
          </Canvas>
        </div>

        {/* Dialogue Panel */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Agent labels */}
          <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-border/20">
            {AGENTS.map((a) => (
              <span
                key={a.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.45rem] font-mono transition-all ${
                  speakingAgent === a.id
                    ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {a.icon}
                {a.label}
              </span>
            ))}
          </div>

          {/* Dialogue bubbles */}
          <div ref={dialoguesRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2 max-h-48 min-h-[8rem]">
            {activeDialogues.length === 0 && !debateActive && (
              <div className="flex items-center justify-center h-full">
                <span className="font-mono text-[0.5rem] text-muted-foreground">
                  Clique "Iniciar Debate" para ver os ministros AI discutirem.
                </span>
              </div>
            )}
            <AnimatePresence initial={false}>
              {activeDialogues.map((d, i) => {
                const agent = AGENTS.find((a) => a.id === d.agentId);
                return (
                  <motion.div
                    key={`${d.agentId}-${i}`}
                    initial={{ opacity: 0, x: -10, y: 4 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex gap-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: agent?.color }}
                    />
                    <div>
                      <span className="font-mono text-[0.45rem] font-bold block" style={{ color: agent?.color }}>
                        {agent?.role}
                      </span>
                      <span className="font-mono text-[0.5rem] text-foreground/90 leading-relaxed">
                        {d.text}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {debateActive && !debateComplete && (
              <div className="flex items-center gap-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[0.4rem] text-muted-foreground animate-pulse">
                  Agente analisando dados...
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-border/20">
            {!debateActive ? (
              <Button size="sm" className="gap-1.5 font-mono text-[0.5rem]" onClick={startDebate}>
                <Users className="h-3 w-3" />
                Iniciar Debate
              </Button>
            ) : debateComplete ? (
              <>
                <Button size="sm" variant="default" className="gap-1.5 font-mono text-[0.5rem]" onClick={approveAndMigrate} disabled={migrating}>
                  <Globe className="h-3 w-3" />
                  {migrating ? "Migrando..." : "Aprovar → Atlas"}
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 font-mono text-[0.5rem]" onClick={nextDebate}>
                  Próximo Tema
                </Button>
              </>
            ) : (
              <span className="font-mono text-[0.45rem] text-muted-foreground">
                Debate em andamento... ({dialogueStep}/{currentScript.length})
              </span>
            )}
          </div>

          {/* Structured proposal — appears when debate is complete */}
          <AnimatePresence>
            {debateComplete && !autoProposal && (
              <div className="px-3 pb-3">
                <ProposalCard
                  debateIndex={debateIndex}
                  onApprove={approveAndMigrate}
                  migrating={migrating}
                />
              </div>
            )}
          </AnimatePresence>

          {/* V5: Auto-generated proposal from project registry */}
          <AnimatePresence>
            {autoProposal && (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="px-3 pb-3"
              >
                <div className="mt-3 border border-primary/30 rounded-lg bg-primary/8 p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[0.4rem] tracking-[0.2em] text-primary/50 uppercase block">
                        PROPOSTA AUTOMÁTICA · {isLive ? "SUPABASE LIVE" : "REGISTO ESTÁTICO"}
                      </span>
                      <span className="font-mono text-[0.65rem] text-foreground font-semibold leading-tight block mt-0.5">
                        {autoProposal.title}
                      </span>
                    </div>
                    <span className={`shrink-0 font-mono text-[0.4rem] px-1.5 py-0.5 rounded border ${
                      autoProposal.impact.riskLevel === "CRÍTICO"
                        ? "text-destructive border-destructive/40 bg-destructive/5"
                        : autoProposal.impact.riskLevel === "ALTO"
                          ? "text-orange-400 border-orange-400/40 bg-orange-400/5"
                          : "text-yellow-400 border-yellow-400/40 bg-yellow-400/5"
                    }`}>
                      {autoProposal.impact.riskLevel}
                    </span>
                  </div>
                  <p className="font-mono text-[0.5rem] text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-2">
                    {autoProposal.scenario}
                  </p>
                  <div className="bg-background/60 border border-border/20 rounded p-2">
                    <span className="font-mono text-[0.4rem] text-primary/60 uppercase tracking-widest block mb-1">
                      Recomendação
                    </span>
                    <span className="font-mono text-[0.5rem] text-foreground leading-relaxed">
                      {autoProposal.recommendation}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1.5 font-mono text-[0.5rem]"
                      onClick={approveAutoProposal}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Ratificar → Ledger
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 font-mono text-[0.5rem] text-muted-foreground"
                      onClick={() => { audioEngine.init(); audioEngine.play("uiDismiss"); setAutoProposal(null); }}
                    >
                      Rejeitar
                    </Button>
                    <span className="font-mono text-[0.38rem] text-muted-foreground/50 ml-auto">
                      {autoProposal.impact.cost} · {autoProposal.impact.roi}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Parliament Ledger — persisted approved decisions */}
      <ProposalLedger key={ledgerVersion} />
    </div>
  );
}
