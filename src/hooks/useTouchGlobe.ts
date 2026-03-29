/**
 * useTouchGlobe — V5-MOBILE-IMMERSION-001
 *
 * Touch gesture system for the hero globe:
 *   - 1 finger drag  → orbit camera around globe (swipe-rotate)
 *   - 2 finger pinch → zoom in/out
 *   - tap            → forwarded as pointer click (tap-to-inspect)
 *
 * Returns refs so changes are visible inside Three.js useFrame without
 * triggering React re-renders on every frame.
 */

import { useEffect, useRef, useCallback } from "react";

export interface TouchGlobeRefs {
  /** Accumulated azimuth orbit angle (radians) — updated in place */
  orbitTheta: React.MutableRefObject<number>;
  /** Accumulated zoom delta (world units added to camera radius) */
  zoomDelta: React.MutableRefObject<number>;
}

export function useTouchGlobe(
  containerRef: React.RefObject<HTMLDivElement>,
): TouchGlobeRefs {
  const orbitTheta = useRef(0);
  const zoomDelta  = useRef(0);

  // Drag momentum
  const velocityRef     = useRef(0);
  const lastDragRef     = useRef<{ x: number; time: number } | null>(null);
  const lastPinchRef    = useRef<number | null>(null);
  const tapStartRef     = useRef<{ x: number; y: number; time: number } | null>(null);
  const isDraggingRef   = useRef(false);
  const rafRef          = useRef<number>(0);

  // ── Momentum decay loop ─────────────────────────────────────────────────────
  const startMomentum = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const step = () => {
      if (Math.abs(velocityRef.current) > 0.0002) {
        orbitTheta.current += velocityRef.current;
        velocityRef.current *= 0.93;
        rafRef.current = requestAnimationFrame(step);
      } else {
        velocityRef.current = 0;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ── touchstart ─────────────────────────────────────────────────────────
    const onTouchStart = (e: TouchEvent) => {
      cancelAnimationFrame(rafRef.current);
      velocityRef.current = 0;

      if (e.touches.length === 1) {
        const t = e.touches[0];
        lastDragRef.current = { x: t.clientX, time: performance.now() };
        tapStartRef.current = { x: t.clientX, y: t.clientY, time: performance.now() };
        isDraggingRef.current = false;
      } else if (e.touches.length === 2) {
        tapStartRef.current = null;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchRef.current = Math.hypot(dx, dy);
      }
    };

    // ── touchmove ──────────────────────────────────────────────────────────
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && lastDragRef.current) {
        const t = e.touches[0];
        const dx = t.clientX - lastDragRef.current.x;
        const dt = performance.now() - lastDragRef.current.time;

        if (Math.abs(dx) > 4) {
          isDraggingRef.current = true;
          tapStartRef.current = null; // cancel tap once movement detected
          e.preventDefault();        // prevent page scroll only when we're handling it
        }

        if (isDraggingRef.current) {
          const sensitivity = 0.007;
          orbitTheta.current += dx * sensitivity;
          velocityRef.current = dt > 0 ? (dx * sensitivity) / (dt / 16) : 0;
          lastDragRef.current = { x: t.clientX, time: performance.now() };
        }
      } else if (e.touches.length === 2 && lastPinchRef.current !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const delta = (lastPinchRef.current - dist) * 0.05;
        zoomDelta.current = Math.max(-5, Math.min(8, zoomDelta.current + delta));
        lastPinchRef.current = dist;
      }
    };

    // ── touchend ───────────────────────────────────────────────────────────
    const onTouchEnd = (e: TouchEvent) => {
      lastPinchRef.current = null;

      // Detect tap: short duration (<250ms) + minimal movement (<12px)
      if (tapStartRef.current && e.changedTouches.length === 1) {
        const t = e.changedTouches[0];
        const elapsed = performance.now() - tapStartRef.current.time;
        const dist = Math.hypot(
          t.clientX - tapStartRef.current.x,
          t.clientY - tapStartRef.current.y,
        );
        if (elapsed < 250 && dist < 12) {
          // Forward as a synthetic pointer event — R3F picks it up
          const synthClick = new PointerEvent("pointermove", {
            bubbles: true,
            cancelable: true,
            clientX: t.clientX,
            clientY: t.clientY,
            pointerType: "touch",
          });
          el.dispatchEvent(synthClick);
        }
      }
      tapStartRef.current = null;
      lastDragRef.current = null;

      // Start momentum if moving fast enough
      if (Math.abs(velocityRef.current) > 0.002) {
        startMomentum();
      }
      isDraggingRef.current = false;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    el.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, startMomentum]);

  return { orbitTheta, zoomDelta };
}
