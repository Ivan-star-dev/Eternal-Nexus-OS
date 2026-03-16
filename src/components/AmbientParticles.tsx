// AmbientParticles — Gold floating particles + Blue Dot tribute meteor system + Morna pulse rhythm
import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 60;
const CONNECTION_DIST = 120;
const MORNA_BPM = 120; // Morna cabo-verdiana pulse — organismo respira neste ritmo

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulse: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  trail: { x: number; y: number; alpha: number }[];
  color: string;
  impactGlow: number;
}

const AmbientParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.25,
      size: 0.8 + Math.random() * 1.8,
      alpha: 0.15 + Math.random() * 0.25,
      pulse: Math.random() * Math.PI * 2,
    }));

    const meteors: Meteor[] = [];
    let lastMeteor = 0;

    const spawnMeteor = (now: number) => {
      if (now - lastMeteor < 2000 + Math.random() * 3000) return;
      lastMeteor = now;
      const fromLeft = Math.random() > 0.5;
      const colors = ["#D4AF37", "#ffdd88", "#22ffaa", "#4a90e2", "#ffaa22"];
      meteors.push({
        x: fromLeft ? -20 : w + 20,
        y: Math.random() * h * 0.4,
        vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 10),
        vy: 3 + Math.random() * 4,
        size: 1.5 + Math.random() * 2.5,
        life: 1,
        trail: [],
        color: colors[Math.floor(Math.random() * colors.length)],
        impactGlow: 0,
      });
    };

    let raf: number;
    const animate = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(42, 78%, 55%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Particles
      particles.forEach((p) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          const force = (1 - dist / 300) * 0.15;
          p.x += dx * force * 0.01;
          p.y += dy * force * 0.01;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // Morna BPM pulse — partículas respiram ao ritmo cabo-verdiano
        const mornaPulse = Math.sin(now * 0.001 * (MORNA_BPM / 60) * Math.PI);
        const glow = p.alpha * (0.65 + 0.35 * mornaPulse);

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(42, 78%, 55%, ${glow * 0.15})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(42, 78%, 65%, ${glow})`;
        ctx.fill();
      });

      // ═══ METEOR SYSTEM (Blue Dot tribute) ═══
      spawnMeteor(now);

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];

        // Store trail
        m.trail.push({ x: m.x, y: m.y, alpha: m.life });
        if (m.trail.length > 20) m.trail.shift();

        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.008;

        // Impact detection
        if (m.x > w + 50 || m.x < -50 || m.y > h + 50 || m.life <= 0) {
          // Impact glow burst
          if (m.life > 0.1) {
            m.impactGlow = 1;
          }
          if (m.impactGlow > 0) {
            ctx.beginPath();
            ctx.arc(m.x, m.y, 40 * m.impactGlow, 0, Math.PI * 2);
            ctx.fillStyle = m.color;
            ctx.globalAlpha = m.impactGlow * 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
            m.impactGlow -= 0.05;
            if (m.impactGlow <= 0) meteors.splice(i, 1);
          } else {
            meteors.splice(i, 1);
          }
          continue;
        }

        // Draw trail
        for (let t = 0; t < m.trail.length; t++) {
          const pt = m.trail[t];
          const trailAlpha = (t / m.trail.length) * pt.alpha * 0.4;
          const trailSize = m.size * (t / m.trail.length) * 0.8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.globalAlpha = trailAlpha;
          ctx.fill();
        }

        // Meteor head
        ctx.globalAlpha = m.life;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.fill();

        // Head glow
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.globalAlpha = m.life * 0.2;
        ctx.fill();

        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9970]"
      aria-hidden="true"
    />
  );
};

export default AmbientParticles;
