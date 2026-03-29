// src/components/AdvancedProjectInterface.tsx
// V6.0 — Procedural Globe + Real AI Streaming + Persistent Chat

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Sphere } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Zap, FlaskConical, BookOpen, Bot, Mic, Paperclip, Send, X, Volume2, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import * as THREE from "three";
import projectLocations, { latLngToVector3 } from "@/data/projectLocations";
import { EASE_OUT } from "@/lib/motion/config";

// ====================== PROCEDURAL GLOBE ======================
function ProceduralGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Ocean base
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, 2048, 1024);

    // Procedural continents using noise-like patterns
    const drawContinent = (cx: number, cy: number, w: number, h: number, detail: number) => {
      ctx.beginPath();
      for (let i = 0; i <= detail; i++) {
        const angle = (i / detail) * Math.PI * 2;
        const rx = w * (0.6 + Math.sin(angle * 3.7 + cx) * 0.25 + Math.sin(angle * 7.1) * 0.15);
        const ry = h * (0.6 + Math.cos(angle * 2.9 + cy) * 0.25 + Math.cos(angle * 5.3) * 0.15);
        const x = cx + Math.cos(angle) * rx;
        const y = cy + Math.sin(angle) * ry;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
      grad.addColorStop(0, "#1a3a2a");
      grad.addColorStop(0.5, "#0f2a1f");
      grad.addColorStop(1, "#0a2018");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(200, 164, 78, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    // Major landmasses (approximate positions on equirectangular projection)
    drawContinent(400, 280, 180, 150, 40);   // Europe/Africa
    drawContinent(500, 200, 140, 100, 35);   // Europe
    drawContinent(450, 450, 120, 120, 30);   // Africa
    drawContinent(700, 300, 250, 180, 45);   // Asia
    drawContinent(800, 500, 120, 80, 28);    // Southeast Asia
    drawContinent(1500, 280, 200, 150, 40);  // North America
    drawContinent(1550, 500, 100, 180, 35);  // South America
    drawContinent(900, 700, 140, 80, 30);    // Australia

    // Grid lines
    ctx.strokeStyle = "rgba(200, 164, 78, 0.06)";
    ctx.lineWidth = 0.5;
    for (let lat = 0; lat < 1024; lat += 64) {
      ctx.beginPath();
      ctx.moveTo(0, lat);
      ctx.lineTo(2048, lat);
      ctx.stroke();
    }
    for (let lng = 0; lng < 2048; lng += 64) {
      ctx.beginPath();
      ctx.moveTo(lng, 0);
      ctx.lineTo(lng, 1024);
      ctx.stroke();
    }

    // Subtle atmospheric scatter dots
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const brightness = Math.random() * 0.12;
      ctx.fillStyle = `rgba(200, 164, 78, ${brightness})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      {/* Solid globe */}
      <Sphere ref={meshRef} args={[3.8, 64, 48]}>
        <meshStandardMaterial
          map={texture}
          metalness={0.2}
          roughness={0.7}
          emissive="#0a1628"
          emissiveIntensity={0.15}
        />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[3.95, 48, 32]}>
        <meshStandardMaterial
          color="#c8a44e"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </Sphere>
    </>
  );
}

interface AdvancedProjectInterfaceProps {
  project: { id: string; title: string; subtitle: string };
}

interface Message {
  id: string;
  agent: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AGENTS = [
  { id: "grok", name: "Grok", Icon: Zap, personality: "hype", voiceRate: 1.15, voicePitch: 1.08 },
  { id: "claude", name: "Claude", Icon: FlaskConical, personality: "technical", voiceRate: 0.92, voicePitch: 0.88 },
  { id: "gpt", name: "GPT", Icon: BookOpen, personality: "narrative", voiceRate: 1.0, voicePitch: 1.02 },
] as const;

// ====================== CLOUD PHYSICS ======================
function CloudPhysicsScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const count = 380;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 42;
      pos[i3 + 1] = 8 + Math.random() * 18;
      pos[i3 + 2] = (Math.random() - 0.5) * 42;
      vel[i3] = (Math.random() - 0.5) * 0.04;
      vel[i3 + 1] = -0.02 - Math.random() * 0.04;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.04;
      life[i] = Math.random() * 160 + 80;
    }
    return { pos, vel, life, count };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const p = particles.pos, v = particles.vel, l = particles.life;
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;
      v[i3 + 1] -= 0.0009;
      v[i3] += Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.0008;
      v[i3 + 2] += Math.cos(state.clock.elapsedTime * 0.8 + i * 1.3) * 0.0007;
      p[i3] += v[i3]; p[i3 + 1] += v[i3 + 1]; p[i3 + 2] += v[i3 + 2];
      l[i] -= delta * 20;
      const dist = Math.sqrt(p[i3] ** 2 + p[i3 + 1] ** 2 + p[i3 + 2] ** 2);
      if (dist < 4.2) {
        const nx = p[i3] / dist, nz = p[i3 + 2] / dist;
        v[i3] = -v[i3] * 0.5 + nx * 0.015;
        v[i3 + 1] = Math.abs(v[i3 + 1]) * 0.4;
        v[i3 + 2] = -v[i3 + 2] * 0.5 + nz * 0.015;
      }
      if (l[i] <= 0 || p[i3 + 1] < 2) {
        p[i3] = (Math.random() - 0.5) * 42; p[i3 + 1] = 20; p[i3 + 2] = (Math.random() - 0.5) * 42;
        v[i3] = (Math.random() - 0.5) * 0.04; v[i3 + 1] = -0.02 - Math.random() * 0.04; v[i3 + 2] = (Math.random() - 0.5) * 0.04;
        l[i] = Math.random() * 200 + 100;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c8a44e" size={0.11} transparent opacity={0.3} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ====================== NEURAL NETWORK ======================
function NeuralNetworkOverlay() {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => Array.from({ length: 22 }, () => ({
    pos: [(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 14] as [number, number, number],
  })), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.scale.setScalar(0.88 + Math.sin(state.clock.elapsedTime * 2.5 + i) * 0.12);
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#c8a44e" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ====================== HOTSPOT ======================
function ProjectHotspot({ position, project, onClick }: {
  position: [number, number, number];
  project: { title: string; color: string };
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      <Sphere args={[0.06, 12, 12]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={onClick}>
        <meshBasicMaterial color={project.color} />
      </Sphere>
      {hovered && (
        <Html distanceFactor={10} center>
          <div className="bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 pointer-events-none whitespace-nowrap">
            <span className="font-mono text-[0.5rem] tracking-[0.12em] text-foreground uppercase">{project.title}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// ====================== SSE STREAM HELPER ======================
async function streamChat({
  messages,
  projectId,
  agentId,
  projectContext,
  onDelta,
  onDone,
  onError,
}: {
  messages: { role: string; content: string }[];
  projectId: string;
  agentId: string;
  projectContext?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { onError("Faça login para usar o chat AI."); return; }

  const resp = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-ai-chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ messages, projectId, agentId, projectContext }),
    }
  );

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({ error: "Network error" }));
    onError(data.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) { onError("No stream body"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

// ====================== MAIN COMPONENT ======================
export default function AdvancedProjectInterface({ project }: AdvancedProjectInterfaceProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiWindowOpen, setAiWindowOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthenticated(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setIsAuthenticated(!!session));
    return () => subscription.unsubscribe();
  }, []);

  // Load persisted messages when agent changes
  useEffect(() => {
    if (!selectedAgent || !isAuthenticated) return;
    (async () => {
      const { data } = await supabase
        .from("ai_chat_messages")
        .select("*")
        .eq("project_id", project.id)
        .eq("agent_id", selectedAgent)
        .order("created_at", { ascending: true })
        .limit(50);
      if (data) {
        setMessages(data.map((m: any) => ({
          id: m.id,
          agent: m.agent_id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at),
        })));
      }
    })();
  }, [selectedAgent, project.id, isAuthenticated]);

  const scrollToBottom = () => setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const persistMessage = useCallback(async (agentId: string, role: string, content: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from("ai_chat_messages").insert({
      user_id: session.user.id,
      project_id: project.id,
      agent_id: agentId,
      role,
      content,
    });
  }, [project.id]);

  const speak = (text: string) => {
    if (isSpeaking || !window.speechSynthesis || !selectedAgent) return;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    const agent = AGENTS.find((a) => a.id === selectedAgent);
    utterance.rate = agent?.voiceRate || 1;
    utterance.pitch = agent?.voicePitch || 1;
    utterance.lang = language === "pt" ? "pt-BR" : "en-US";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text: string) => {
    if (!selectedAgent || !text.trim() || isStreaming) return;

    const userMsg: Message = { id: crypto.randomUUID(), agent: selectedAgent, role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsStreaming(true);
    scrollToBottom();

    // Persist user message
    await persistMessage(selectedAgent, "user", text.trim());

    // Build history for context
    const history = messages
      .filter((m) => m.agent === selectedAgent)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));
    history.push({ role: "user", content: text.trim() });

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    await streamChat({
      messages: history,
      projectId: project.id,
      agentId: selectedAgent,
      projectContext: `Project: ${project.title}. ${project.subtitle}.`,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.id === assistantId) {
            return prev.map((m) => m.id === assistantId ? { ...m, content: assistantContent } : m);
          }
          return [...prev, { id: assistantId, agent: selectedAgent!, role: "assistant", content: assistantContent, timestamp: new Date() }];
        });
        scrollToBottom();
      },
      onDone: async () => {
        setIsStreaming(false);
        if (assistantContent) await persistMessage(selectedAgent!, "assistant", assistantContent);
      },
      onError: (err) => {
        setIsStreaming(false);
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), agent: selectedAgent!, role: "assistant", content: `**Erro:** ${err}`, timestamp: new Date() }]);
      },
    });
  };

  const startVoiceInput = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = language === "pt" ? "pt-BR" : "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => { const t = e.results[0][0].transcript; setInputText(t); sendMessage(t); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    setIsListening(true);
    rec.start();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAgent) return;
    sendMessage(`[Arquivo: ${file.name}] Analise este arquivo no contexto do projeto ${project.title}.`);
  };

  const agentMessages = messages.filter((m) => m.agent === selectedAgent);

  return (
    <div className="relative w-full">
      {/* 3D SIMULATION */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] border border-border bg-background overflow-hidden">
        <div className="absolute inset-0 sand-noise pointer-events-none z-[1]" />
        <Canvas camera={{ position: [0, 3, 14], fov: 45 }} dpr={[2, 3]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: "high-performance" }} style={{ background: "transparent" }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={0.6} color="#c8a44e" />
          <pointLight position={[-8, 5, -5]} intensity={0.3} color="#0A9396" />
          <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.3} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} minDistance={8} maxDistance={20} />
          <CloudPhysicsScene />
          <NeuralNetworkOverlay />
          <ProceduralGlobe />
          {projectLocations.map((loc) => (
            <ProjectHotspot key={loc.id} position={latLngToVector3(loc.lat, loc.lng, 3.9)} project={loc} onClick={() => navigate(`/project/${loc.id}`)} />
          ))}
        </Canvas>
        <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
      </div>

      {/* AGENT BUTTONS */}
      <div className="flex justify-center gap-3 py-6">
        {AGENTS.map(({ id, name, Icon }) => (
          <button
            key={id}
            onClick={() => { setSelectedAgent(id); setAiWindowOpen(true); }}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
              selectedAgent === id ? "border-primary bg-primary/20 text-primary" : "border-border hover:border-primary bg-secondary/30 text-muted-foreground hover:text-foreground"
            }`}
            title={`Chat with ${name}`}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <button
          onClick={() => setAiWindowOpen(!aiWindowOpen)}
          className="w-10 h-10 rounded-full border-2 border-primary/50 hover:border-primary flex items-center justify-center transition-all hover:scale-110 bg-primary/10 text-primary"
          title="AI Panel"
        >
          <Bot className="w-4 h-4" />
        </button>
      </div>

      {/* AI CHAT WINDOW */}
      <AnimatePresence>
        {aiWindowOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="mx-auto max-w-2xl border border-border bg-card/95 backdrop-blur-xl mb-6 flex flex-col"
            style={{ maxHeight: "70vh" }}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-mono text-[0.65rem] tracking-[0.15em] text-foreground uppercase font-bold">
                    {selectedAgent
                      ? (() => { const a = AGENTS.find((a) => a.id === selectedAgent); return a ? <span className="inline-flex items-center gap-1.5"><a.Icon className="w-3 h-3" /> {a.name}</span> : null; })()
                      : "AI Agents"
                    }
                    {" "}· {project.title}
                  </p>
                  <p className="font-mono text-[0.5rem] tracking-[0.1em] text-muted-foreground">
                    {isAuthenticated ? "Streaming em tempo real" : "Faça login para usar o chat"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { window.speechSynthesis.cancel(); setAiWindowOpen(false); setIsSpeaking(false); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AGENT TABS */}
            <div className="flex gap-1 px-4 py-3 border-b border-border">
              {AGENTS.map(({ id, name, Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedAgent(id)}
                  className={`flex-1 py-2 font-mono text-[0.55rem] tracking-[0.1em] uppercase transition-all border flex items-center justify-center gap-1.5 ${
                    selectedAgent === id
                      ? "border-primary bg-primary/10 text-foreground font-bold"
                      : "border-transparent bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="w-3 h-3" /> {name}
                </button>
              ))}
              {selectedAgent && agentMessages.length > 0 && (
                <button
                  onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) return;
                    await supabase
                      .from("ai_chat_messages")
                      .delete()
                      .eq("user_id", session.user.id)
                      .eq("project_id", project.id)
                      .eq("agent_id", selectedAgent);
                    setMessages((prev) => prev.filter((m) => m.agent !== selectedAgent));
                  }}
                  className="px-2 py-2 font-mono text-[0.55rem] tracking-[0.1em] uppercase transition-all border border-transparent text-destructive hover:border-destructive hover:bg-destructive/10 flex items-center justify-center gap-1"
                  title="Limpar histórico"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

      {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ minHeight: 180, maxHeight: 320 }}>
              {agentMessages.length === 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center font-mono text-[0.5rem] tracking-[0.1em] text-muted-foreground py-8"
                >
                  {selectedAgent
                    ? `Converse com ${AGENTS.find((a) => a.id === selectedAgent)?.name} sobre ${project.title}`
                    : "Selecione um agente para começar"}
                </motion.p>
              )}
              <AnimatePresence initial={false}>
                {agentMessages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: i === agentMessages.length - 1 ? 0 : 0,
                    }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed transition-shadow duration-300 hover:shadow-lg ${
                        msg.role === "user"
                          ? "bg-primary/15 text-foreground border border-primary/20 hover:shadow-primary/5"
                          : "bg-secondary/40 text-foreground border border-border hover:shadow-accent/5"
                      }`}
                    >
                      {msg.role === "assistant" && (() => {
                        const a = AGENTS.find((ag) => ag.id === msg.agent);
                        return a ? (
                          <span className="font-mono text-[0.48rem] tracking-[0.12em] text-muted-foreground uppercase flex items-center gap-1 mb-1">
                            <a.Icon className="w-3 h-3" /> {a.name}
                          </span>
                        ) : null;
                      })()}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isStreaming && agentMessages.length > 0 && agentMessages[agentMessages.length - 1].role === "user" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary/40 border border-border px-4 py-3 flex items-center gap-2">
                    <motion.span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    />
                    <motion.span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                    />
                    <motion.span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                    />
                    <span className="font-mono text-[0.5rem] text-muted-foreground ml-1">Pensando...</span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT BAR */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(inputText)}
                  placeholder={selectedAgent ? `Pergunte ao ${AGENTS.find((a) => a.id === selectedAgent)?.name}...` : "Selecione um agente..."}
                  disabled={!selectedAgent || !isAuthenticated || isStreaming}
                  className="flex-1 bg-secondary/30 border border-border px-4 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={startVoiceInput}
                  disabled={!selectedAgent || !isAuthenticated || isStreaming}
                  className={`w-10 h-10 border flex items-center justify-center transition-all disabled:opacity-30 ${
                    isListening ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:border-primary text-muted-foreground hover:text-foreground bg-secondary/30"
                  }`}
                  title="Entrada por voz"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <label className={`w-10 h-10 border border-border hover:border-primary flex items-center justify-center cursor-pointer transition-all bg-secondary/30 text-muted-foreground hover:text-foreground ${(!selectedAgent || !isAuthenticated || isStreaming) ? "opacity-30 pointer-events-none" : ""}`} title="Anexar arquivo">
                  <Paperclip className="w-4 h-4" />
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg,.txt,.csv" />
                </label>
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!selectedAgent || !inputText.trim() || !isAuthenticated || isStreaming}
                  className="w-10 h-10 border border-primary bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* VOICE PLAYBACK */}
            {agentMessages.filter((m) => m.role === "assistant").length > 0 && (
              <div className="px-4 pb-3 flex gap-2">
                <button
                  onClick={() => {
                    const last = agentMessages.filter((m) => m.role === "assistant").pop();
                    if (last) speak(last.content);
                  }}
                  disabled={isSpeaking}
                  className="font-mono text-[0.48rem] tracking-[0.12em] text-primary hover:text-foreground transition-colors uppercase border border-border px-3 py-1.5 bg-secondary/30 hover:bg-secondary/60 disabled:opacity-30 flex items-center gap-1.5"
                >
                  <Volume2 className="w-3 h-3" /> Ouvir última resposta
                </button>
                {isSpeaking && (
                  <button
                    onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }}
                    className="font-mono text-[0.48rem] tracking-[0.12em] text-destructive hover:text-foreground transition-colors uppercase border border-border px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <Square className="w-3 h-3" /> Parar
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
