import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Brain, Globe, Send, Users, HeartPulse, Cloud, DollarSign, Shield, Zap } from "lucide-react";

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
  const dialoguesRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const approveAndMigrate = useCallback(() => {
    const decision = activeDialogues.map((d) => {
      const agent = AGENTS.find((a) => a.id === d.agentId);
      return `${agent?.role}: ${d.text}`;
    }).join("\n");

    setMigrating(true);
    onDecisionApproved?.(decision);

    setTimeout(() => {
      onMigrateToAtlas?.();
      setMigrating(false);
    }, 3000);
  }, [activeDialogues, onDecisionApproved, onMigrateToAtlas]);

  const debateComplete = dialogueStep >= currentScript.length;

  return (
    <div className="bg-card border border-primary/20 rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
        <Brain className="h-4 w-4 text-primary" />
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-primary uppercase">
          AI Council — Parlamento Digital
        </span>
        <span className="font-mono text-[0.4rem] text-muted-foreground ml-auto">
          {AGENTS.length} ministros ativos
        </span>
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
            {activeDialogues.map((d, i) => {
              const agent = AGENTS.find((a) => a.id === d.agentId);
              return (
                <div key={i} className="flex gap-2 animate-fade-in">
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
                </div>
              );
            })}
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
        </div>
      </div>
    </div>
  );
}
