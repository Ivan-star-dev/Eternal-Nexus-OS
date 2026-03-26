// GlobalBackground — Meteors + Gold Particles for the site-wide background layer
// Pure CSS animations, zero Three.js overhead at layout level. pointer-events: none.
import { useEffect, useRef } from "react";

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface GoldParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  pulse: number;
}

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    // ── Gold particles ─────────────────────────────────────
    const PARTICLE_COUNT = 240;
    const particles: GoldParticle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.05,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.42 + 0.06,
      phase: Math.random() * Math.PI * 2,
      pulse: Math.random() * 0.022 + 0.005,
    }));

    // ── Meteors ────────────────────────────────────────────
    const meteors: Meteor[] = [];
    const METEOR_MAX = 8;

    function spawnMeteor() {
      if (meteors.length >= METEOR_MAX) return;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 7 + 7;
      const startX = Math.random() * W * 1.2 - W * 0.1;
      meteors.push({
        x: startX,
        y: -20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: Math.random() * 160 + 90,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 65 + 50,
        hue: Math.random() * 25 + 35,
      });
    }

    let spawnTimer = 0;
    const SPAWN_INTERVAL = 38; // frames

    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;
      spawnTimer++;

      if (spawnTimer >= SPAWN_INTERVAL + Math.random() * 30) {
        spawnMeteor();
        spawnTimer = 0;
      }

      // ── Draw meteors ──────────────────────────────────────
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;

        const progress = m.life / m.maxLife;
        const fade = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
        m.alpha = fade * 0.75;

        const tailX = m.x - (m.vx / Math.sqrt(m.vx * m.vx + m.vy * m.vy)) * m.len;
        const tailY = m.y - (m.vy / Math.sqrt(m.vx * m.vx + m.vy * m.vy)) * m.len;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, `hsla(${m.hue}, 90%, 65%, 0)`);
        grad.addColorStop(0.4, `hsla(${m.hue}, 88%, 72%, ${m.alpha * 0.3})`);
        grad.addColorStop(0.8, `hsla(${m.hue}, 85%, 80%, ${m.alpha * 0.6})`);
        grad.addColorStop(1, `hsla(${m.hue}, 95%, 90%, ${m.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.random() * 0.6 + 0.8;
        ctx.lineCap = "round";
        ctx.stroke();

        // head glow
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 5);
        glow.addColorStop(0, `hsla(${m.hue}, 100%, 92%, ${m.alpha * 0.9})`);
        glow.addColorStop(1, `hsla(${m.hue}, 80%, 65%, 0)`);
        ctx.beginPath();
        ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        if (m.life >= m.maxLife || m.x > W + 100 || m.y > H + 100) {
          meteors.splice(i, 1);
        }
      }

      // ── Draw gold particles ───────────────────────────────
      for (const p of particles) {
        p.x += p.vx + Math.sin(t * 0.4 + p.phase) * 0.08;
        p.y += p.vy;
        p.phase += p.pulse;

        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const pulse = 0.65 + 0.35 * Math.sin(t * 1.8 + p.phase * 3);
        const a = p.alpha * pulse;

        const hue = 40 + Math.sin(p.phase) * 10; // 30–50° warm gold
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        pGrad.addColorStop(0, `hsla(${hue}, 88%, 72%, ${a})`);
        pGrad.addColorStop(1, `hsla(${hue}, 75%, 55%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.85,
      }}
      aria-hidden="true"
    />
  );
}
