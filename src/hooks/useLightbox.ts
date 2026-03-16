import { useState, useCallback, useEffect, useRef } from "react";

export interface UseLightboxReturn {
  lightboxIndex: number | null;
  direction: 1 | -1;
  open: (idx: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  swipeHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

const SWIPE_THRESHOLD = 50;

export function useLightbox(totalItems: number): UseLightboxReturn {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef(0);

  const close = useCallback(() => setLightboxIndex(null), []);

  const open = useCallback((idx: number) => {
    setDirection(1);
    setLightboxIndex(idx);
  }, []);

  const next = useCallback(() => {
    if (lightboxIndex === null || totalItems === 0) return;
    setDirection(1);
    setLightboxIndex((lightboxIndex + 1) % totalItems);
  }, [lightboxIndex, totalItems]);

  const prev = useCallback(() => {
    if (lightboxIndex === null || totalItems === 0) return;
    setDirection(-1);
    setLightboxIndex((lightboxIndex - 1 + totalItems) % totalItems);
  }, [lightboxIndex, totalItems]);

  // Keyboard
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, close, next, prev]);

  // Lock body scroll
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [lightboxIndex]);

  // Swipe handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDelta.current = 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current.x;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta.current) > SWIPE_THRESHOLD) {
      if (touchDelta.current < 0) next();
      else prev();
    }
    touchStart.current = null;
    touchDelta.current = 0;
  }, [next, prev]);

  return {
    lightboxIndex,
    direction,
    open,
    close,
    next,
    prev,
    swipeHandlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
