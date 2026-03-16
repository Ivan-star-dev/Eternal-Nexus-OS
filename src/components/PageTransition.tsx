// PageTransition — Whoosh orbital com blur + scale + partículas gold
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    filter: "blur(8px) brightness(1.3)",
    y: 24,
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px) brightness(1)",
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(6px) brightness(0.8)",
    y: -16,
  },
};

const pageTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as const,
};

/** Burst de partículas gold no mount */
function GoldBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; life: number; size: number; alpha: number }[] = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 1 + Math.random() * 2.5,
        alpha: 0.6 + Math.random() * 0.4,
      });
    }

    let frame = 0;
    const animate = () => {
      if (frame > 50) return; // auto-stop
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(42, 78%, 55%, ${p.life * p.alpha})`;
        ctx.fill();
      });
      frame++;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9980]"
      style={{ opacity: 0.7 }}
    />
  );
}

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <>
    <GoldBurst />
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  </>
);

export default PageTransition;
