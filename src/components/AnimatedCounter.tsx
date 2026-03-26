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

  // Parse numeric value from both number and string inputs, preserving format metadata
  const { numericValue, formatDisplay } = (() => {
    if (typeof value === "number") {
      return {
        numericValue: value,
        formatDisplay: (n: number) => String(Math.round(n)),
      };
    }
    if (typeof value === "string") {
      // Extract optional non-numeric prefix (e.g. "$", "€") and suffix
      const prefixMatch = value.match(/^([^0-9]*)[\d]/);
      const suffixMatch = value.match(/[\d]([^0-9]*)$/);
      const prefix = prefixMatch ? prefixMatch[1] : "";
      const suffix = suffixMatch ? suffixMatch[1] : "";

      // Strip formatting characters to get the raw numeric string
      const cleaned = value.replace(/,/g, "").replace(/[^0-9.+-]/g, "");
      const parsed = Number(cleaned);
      if (Number.isNaN(parsed)) {
        return { numericValue: null, formatDisplay: () => value };
      }

      // Preserve decimal places from the original
      const dotIndex = cleaned.indexOf(".");
      const decimalPlaces = dotIndex >= 0 ? cleaned.length - dotIndex - 1 : 0;
      const useCommas = value.includes(",");

      return {
        numericValue: parsed,
        formatDisplay: (n: number) => {
          const rounded = decimalPlaces > 0 ? n : Math.round(n);
          const formatted = useCommas
            ? rounded.toLocaleString("en-US", {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              })
            : decimalPlaces > 0
            ? rounded.toFixed(decimalPlaces)
            : String(Math.round(n));
          return `${prefix}${formatted}${suffix}`;
        },
      };
    }
    return { numericValue: null, formatDisplay: () => String(value) };
  })();

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
      setDisplayValue(eased * numericValue);

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
      {numericValue !== null ? formatDisplay(displayValue) : value}
    </span>
  );
};

export default AnimatedCounter;
