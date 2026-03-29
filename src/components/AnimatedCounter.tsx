import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  className?: string;
}

const AnimatedCounter = ({ value, duration = 1200, className }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const numericValue = typeof value === "number" ? value : null;
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView || numericValue === null) return;

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * numericValue));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isInView, numericValue, duration]);

  return (
    <span
      ref={ref}
      className={["font-mono tabular-nums", className].filter(Boolean).join(" ")}
    >
      {numericValue !== null ? displayValue : value}
    </span>
  );
};

export default AnimatedCounter;
