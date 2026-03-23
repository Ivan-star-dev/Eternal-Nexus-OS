import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Float, MeshDistortMaterial, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BroadcastItem {
  id: number;
  title: string;
  category: string;
  categoryColor: string;
  time: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const BROADCAST_ITEMS: BroadcastItem[] = [
  {
    id: 1,
    title: "Atlas gerou nova fase do DeltaSpine NL",
    category: "INFRA",
    categoryColor: "#06b6d4",
    time: "2min atrás",
  },
  {
    id: 2,
    title: "GeoCore Pico do Fogo: perfuração atingiu 2.4km",
    category: "ENERGIA",
    categoryColor: "#f59e0b",
    time: "15min atrás",
  },
  {
    id: 3,
    title: "Tribunal aprovou cenário Terra Lenta Lisboa",
    category: "DECISÃO",
    categoryColor: "#a78bfa",
    time: "1h atrás",
  },
  {
    id: 4,
    title: "Investidores UE confirmaram €50M para fase piloto",
    category: "ECONOMIA",
    categoryColor: "#34d399",
    time: "3h atrás",
  },
  {
    id: 5,
    title: "NanoBanana detectou anomalia no fluxo Atlas",
    category: "ALERTA",
    categoryColor: "#f87171",
    time: "5h atrás",
  },
];

const PLATFORMS = [
  { name: "YouTube", connected: true },
  { name: "X", connected: true },
  { name: "LinkedIn", connected: true },
  { name: "Gov.cv", connected: true },
  { name: "TCV", connected: true },
];

/* ------------------------------------------------------------------ */
/*  3D Components                                                      */
/* ------------------------------------------------------------------ */

function ParticleRing() {
  const ref = useRef<THREE.Points>(null!);
  const count = 120;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.8;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial color="#06b6d4" size={0.04} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function EchoVoxHead({ isSpeaking }: { isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geoRef = useRef<THREE.IcosahedronGeometry>(null!);
  const originalPositions = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (geoRef.current && !originalPositions.current) {
      originalPositions.current = new Float32Array(
        geoRef.current.attributes.position.array
      );
    }
  }, []);

  useFrame(({ clock }) => {
    if (!geoRef.current || !originalPositions.current) return;

    const posAttr = geoRef.current.attributes.position;
    const orig = originalPositions.current;
    const t = clock.getElapsedTime();

    for (let i = 0; i < posAttr.count; i++) {
      const oy = orig[i * 3 + 1];
      // animate bottom vertices when speaking
      if (oy < -0.3 && isSpeaking) {
        const offset = Math.sin(t * 12 + i) * 0.08;
        posAttr.setY(i, oy + offset);
      } else {
        posAttr.setY(i, oy);
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        <mesh ref={meshRef}>
          <icosahedronGeometry ref={geoRef} args={[1, 4]} />
          <MeshDistortMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.85}
            distort={0.15}
            speed={2}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh scale={0.7}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.6}
            transparent
            opacity={0.15}
          />
        </mesh>

        <ParticleRing />

        <Text
          position={[0, -1.6, 0]}
          fontSize={0.25}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          ECHO-VOX
        </Text>
      </group>
    </Float>
  );
}

function BroadcastScene({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#f59e0b" />

      <EchoVoxHead isSpeaking={isSpeaking} />

      <Sparkles
        count={80}
        scale={8}
        size={1.5}
        speed={0.4}
        color="#06b6d4"
        opacity={0.5}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/*  UI Sub-components                                                  */
/* ------------------------------------------------------------------ */

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
      </span>
      <span className="text-sm font-bold tracking-widest text-red-500">
        AO VIVO
      </span>
    </div>
  );
}

function PlatformBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((p) => (
        <span
          key={p.name}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {p.name}
        </span>
      ))}
    </div>
  );
}

function TrustMeter({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-serif text-sm text-paper-dim/80">{label}</span>
        <span className="font-mono text-2xl font-light text-gold">
          {value}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-sm bg-white/10">
        <motion.div
          className="h-full rounded-sm"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function BroadcastFeed() {
  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto pr-1">
      {BROADCAST_ITEMS.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 * i, duration: 0.5 }}
          className="bg-ink-medium/60 border border-white/[0.05] rounded-sm p-4 hover:border-white/[0.12] transition-all duration-200"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded px-2 py-0.5 font-mono text-[0.48rem] tracking-[0.28em] uppercase"
              style={{
                backgroundColor: item.categoryColor + "22",
                color: item.categoryColor,
              }}
            >
              {item.category}
            </span>
            <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">{item.time}</span>
          </div>
          <p className="mb-3 font-serif text-sm text-paper-dim/80 leading-relaxed">
            {item.title}
          </p>
          <button className="border border-gold/60 text-gold font-mono text-[0.6rem] tracking-[0.12em] px-3 py-1 transition-all duration-200 hover:bg-gold/10">
            Ler mais &rarr;
          </button>
        </motion.div>
      ))}
    </div>
  );
}

function NewsTicker() {
  const tickerText = BROADCAST_ITEMS.map(
    (item) => `${item.category}: ${item.title}`
  ).join("   ●   ");
  const doubled = `${tickerText}   ●   ${tickerText}`;

  return (
    <div className="overflow-hidden border-t border-white/[0.04] bg-black/40 py-2">
      <div
        className="whitespace-nowrap text-xs text-cyan-300/70"
        style={{
          animation: "ticker-scroll 40s linear infinite",
        }}
      >
        {doubled}
      </div>
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function CanalTransparencia() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePlayPause = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const text =
      "Bem-vindos ao Canal de Transparência e Morabeza. Aqui apresentamos as últimas atualizações da infraestrutura Atlas e dos projetos nacionais de Cabo Verde. Mantenham-se informados, mantenham-se conectados.";

    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "pt-PT";
      utter.rate = 0.95;
      utter.pitch = 0.85;
      utter.volume = isMuted ? 0 : 1;
      utter.onend = () => setIsSpeaking(false);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
      setIsSpeaking(true);
    }
  }, [isSpeaking, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // document.title
  useEffect(() => {
    document.title = "Canal de Transparência · Morabeza";
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col" style={{ background: "#04040e" }}>
      {/* ---- Header ---- */}
      <header className="flex flex-col gap-3 border-b border-white/[0.04] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
            Transparência · Cabo Verde
          </span>
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-3xl md:text-4xl font-light text-paper">
              Canal de Transparência{" "}
              <span className="text-gold/80">· Morabeza</span>
            </h1>
            <LiveIndicator />
          </div>
          <p className="text-sm text-paper-dim/70 font-light">
            Transmissão em tempo real — plataformas nacionais e internacionais
          </p>
        </div>
        <PlatformBadges />
      </header>

      {/* ---- Main content ---- */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* 3D Broadcast area */}
        <div className="relative flex flex-1 flex-col">
          <div className="flex-1" style={{ minHeight: 420 }}>
            <BroadcastScene isSpeaking={isSpeaking} />
          </div>

          {/* Voice controls + Trust meters */}
          <div className="flex flex-col gap-4 border-t border-white/[0.04] bg-black/30 px-6 py-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Voice controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                className="gap-2 border border-gold/60 text-gold font-mono text-[0.6rem] tracking-[0.12em] bg-transparent hover:bg-gold/10"
              >
                {isSpeaking ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isSpeaking ? "Pausar" : "Reproduzir"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-gray-400 hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Trust meters */}
            <div className="flex w-full max-w-sm flex-col gap-2">
              <TrustMeter label="Confiança Nacional" value={87} color="#06b6d4" />
              <TrustMeter label="Morabeza Index" value={94} color="#f59e0b" />
            </div>
          </div>
        </div>

        {/* Broadcast Feed */}
        <aside className="flex w-full flex-col border-l border-white/[0.04] bg-black/20 lg:w-[380px]">
          <div className="border-b border-white/[0.04] px-5 py-3">
            <h2 className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
              Feed de Transmissão
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <BroadcastFeed />
          </div>
        </aside>
      </div>

      {/* ---- Bottom ticker ---- */}
      <NewsTicker />
    </div>
  );
}
