// Transição de partículas entre órgãos — CERN-style click-position burst + desintegração + voo + whoosh orbital
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

// ═══ WHOOSH PROCEDURAL — Web Audio API com reverb espacial (sem ficheiros áudio) ═══
const createImpulseResponse = (ac: AudioContext, duration: number, decay: number): AudioBuffer => {
  const length = ac.sampleRate * duration;
  const impulse = ac.createBuffer(2, length, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
};

const playWhoosh = () => {
  try {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ac = new AudioContext();

    // Main oscillator — frequency sweep
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.4);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2000, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.4);
    filter.Q.value = 2;
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ac.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);

    // Sub-bass layer — morabeza warmth
    const sub = ac.createOscillator();
    const subGain = ac.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(120, ac.currentTime);
    sub.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.5);
    subGain.gain.setValueAtTime(0, ac.currentTime);
    subGain.gain.linearRampToValueAtTime(0.04, ac.currentTime + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);

    // Algorithmic reverb — spatial depth
    const convolver = ac.createConvolver();
    convolver.buffer = createImpulseResponse(ac, 1.2, 3.5);
    const reverbGain = ac.createGain();
    reverbGain.gain.value = 0.25;

    // Stereo panner — direction based on randomness
    const panner = ac.createStereoPanner();
    panner.pan.setValueAtTime(-0.3, ac.currentTime);
    panner.pan.linearRampToValueAtTime(0.3, ac.currentTime + 0.4);

    // Dry path: osc → filter → gain → panner → destination
    osc.connect(filter).connect(gain).connect(panner).connect(ac.destination);
    // Wet path: gain → convolver → reverbGain → destination
    gain.connect(convolver).connect(reverbGain).connect(ac.destination);
    // Sub-bass: sub → subGain → destination
    sub.connect(subGain).connect(ac.destination);

    osc.start(ac.currentTime);
    sub.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.55);
    sub.stop(ac.currentTime + 0.55);
    osc.onended = () => setTimeout(() => ac.close(), 1200); // let reverb tail finish
  } catch { /* silently fail if AudioContext blocked */ }
};

const ORGAN_COLORS: Record<string, string> = {
  "/": "#D4AF37",
  "/nexus": "#22ffaa",
  "/atlas": "#4a90e2",
  "/system": "#cc44ff",
  "/founder": "#D4AF37",
  "/news": "#ff4444",
  "/projects": "#D4AF37",
  "/dashboard": "#4a90e2",
  "/owner": "#cc44ff",
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  trail: { x: number; y: number }[];
}

export default function OrganTransitionParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animIdRef = useRef<number>(0);
  const prevPathRef = useRef<string>("");
  const clickPosRef = useRef<{ x: number; y: number } | null>(null);
  const location = useLocation();

  // Track click position globally (CERN-style: burst from where you clicked)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a") || target.closest("button") || target.closest("[role='link']")) {
        clickPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  const burst = useCallback((fromColor: string, toColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const origin = clickPosRef.current || { x: w / 2, y: h / 2 };
    const particles: Particle[] = [];

    // Phase 1: Disintegration burst from click position (CERN hyperlink explosion)
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      particles.push({
        x: origin.x + (Math.random() - 0.5) * 30,
        y: origin.y + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 3.5,
        alpha: 1,
        color: i < 40 ? fromColor : toColor,
        life: 1,
        trail: [],
      });
    }

    // Phase 2: Convergence ring (particles fly to center then scatter)
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 200 + Math.random() * 150;
      particles.push({
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius,
        vx: -Math.cos(angle) * (4 + Math.random() * 3),
        vy: -Math.sin(angle) * (4 + Math.random() * 3),
        size: 0.8 + Math.random() * 1.5,
        alpha: 0.8,
        color: toColor,
        life: 1,
        trail: [],
      });
    }

    clickPosRef.current = null;
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    if (prevPathRef.current && prevPathRef.current !== currentPath) {
      const fromColor = ORGAN_COLORS[prevPathRef.current] || "#D4AF37";
      const toColor = ORGAN_COLORS[currentPath] || "#D4AF37";
      burst(fromColor, toColor);
      playWhoosh();
    }
    prevPathRef.current = currentPath;
  }, [location.pathname, burst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Store trail position
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 0.012;
        p.alpha = Math.max(0, p.life);

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw trail (CERN particle track)
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.15;
          ctx.lineWidth = p.size * p.alpha * 0.5;
          ctx.stroke();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.8;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.alpha * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.12;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
