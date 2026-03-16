/**
 * CustomCursor — Premium gold glow cursor (Eternal Nexus prototype).
 * Inner dot 9px + outer ring 34px with trailing lerp.
 */
import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4.5}px, ${mouseY - 4.5}px)`;
    };

    const onMouseEnterInteractive = () => {
      ring.style.width = "48px";
      ring.style.height = "48px";
      ring.style.borderColor = "hsl(42 78% 45% / 0.6)";
      ring.style.boxShadow = "0 0 18px hsl(42 78% 45% / 0.25)";
      dot.style.transform = `translate(${mouseX - 4.5}px, ${mouseY - 4.5}px) scale(1.4)`;
    };

    const onMouseLeaveInteractive = () => {
      ring.style.width = "34px";
      ring.style.height = "34px";
      ring.style.borderColor = "hsl(42 78% 45% / 0.4)";
      ring.style.boxShadow = "none";
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX - 17}px, ${ringY - 17}px)`;
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
      document.body.style.cursor = "";
      styleTag.remove();
    };
  }, []);

  return (
    <>
      {/* Inner dot — gold with glow */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[9px] h-[9px] rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          background: "hsl(42 78% 55%)",
          boxShadow: "0 0 14px hsl(42 78% 55% / 0.55), 0 0 32px hsl(28 80% 50% / 0.35)",
          transition: "transform 0.06s ease-out",
        }}
      />
      {/* Outer ring — trailing with gold border */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[34px] h-[34px] rounded-full pointer-events-none z-[9998]"
        style={{
          border: "1px solid hsl(42 78% 45% / 0.4)",
          transition: "width 0.18s ease, height 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
