/**
 * CustomCursor — Premium gold glow cursor + canvas micro-trail.
 * Inner dot 9px + outer ring 36px with trailing lerp.
 * Trail: last 18 positions drawn as fading gold circles on canvas.
 */
import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;

    // ── Canvas setup ─────────────────────────────
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Trail buffer
    const TRAIL = 22;
    const trail: { x: number; y: number }[] = [];

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4.5}px, ${mouseY - 4.5}px)`;
      trail.push({ x: mouseX, y: mouseY });
      if (trail.length > TRAIL) trail.shift();
    };

    const onMouseEnterInteractive = () => {
      isHovering = true;
      ring.style.width = "52px";
      ring.style.height = "52px";
      ring.style.borderColor = "hsl(42 78% 55% / 0.7)";
      ring.style.boxShadow = "0 0 20px hsl(42 78% 45% / 0.3), inset 0 0 8px hsl(42 78% 45% / 0.1)";
      dot.style.background = "hsl(42 78% 72%)";
      dot.style.boxShadow = "0 0 18px hsl(42 78% 72% / 0.7), 0 0 36px hsl(28 80% 50% / 0.5)";
    };

    const onMouseLeaveInteractive = () => {
      isHovering = false;
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.borderColor = "hsl(42 78% 45% / 0.4)";
      ring.style.boxShadow = "none";
      dot.style.background = "hsl(42 78% 55%)";
      dot.style.boxShadow = "0 0 14px hsl(42 78% 55% / 0.55), 0 0 32px hsl(28 80% 50% / 0.35)";
    };

    const animate = () => {
      // Lerp ring
      ringX += (mouseX - ringX) * 0.11;
      ringY += (mouseY - ringY) * 0.11;
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

      // Draw trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < trail.length; i++) {
        const t = i / trail.length;
        const alpha = t * (isHovering ? 0.32 : 0.18);
        const radius = t * (isHovering ? 4.5 : 3.2);
        const hue = 38 + t * 8; // warm gold to amber
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 88%, 65%, ${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(animate);

    const attachHover = () => {
      document.querySelectorAll("a, button, [role='button'], input, select, textarea, .hover-scale").forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };

    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    document.body.style.cursor = "none";
    const styleTag = document.createElement("style");
    styleTag.textContent = "a,button,[role='button'],input,select,textarea{cursor:none!important}";
    document.head.appendChild(styleTag);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.body.style.cursor = "";
      styleTag.remove();
    };
  }, []);

  return (
    <>
      {/* Canvas trail layer */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9996, mixBlendMode: "screen" }}
        aria-hidden="true"
      />
      {/* Inner dot — gold with glow */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[9px] h-[9px] rounded-full pointer-events-none"
        style={{
          zIndex: 9999,
          background: "hsl(42 78% 55%)",
          boxShadow: "0 0 14px hsl(42 78% 55% / 0.55), 0 0 32px hsl(28 80% 50% / 0.35)",
          transition: "transform 0.06s ease-out, background 0.18s ease, box-shadow 0.18s ease",
          mixBlendMode: "screen",
        }}
      />
      {/* Outer ring — trailing with gold border */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[36px] h-[36px] rounded-full pointer-events-none"
        style={{
          zIndex: 9998,
          border: "0.5px solid hsl(42 78% 45% / 0.4)",
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
