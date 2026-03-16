import { useEffect, useRef, useState } from "react";
import { useInView, motion, useSpring, useMotionValue } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

const AnimatedCounter = ({ value, className }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(value);

  // Extract numeric part for animation
  const numericMatch = value.match(/^([€$]?)([\d,.]+)(.*)/);
  const prefix = numericMatch?.[1] || "";
  const numStr = numericMatch?.[2] || "";
  const suffix = numericMatch?.[3] || "";
  const targetNum = parseFloat(numStr.replace(/,/g, ""));
  const hasDecimals = numStr.includes(".");
  const decimalPlaces = hasDecimals ? (numStr.split(".")[1]?.length || 0) : 0;
  const hasCommas = numStr.includes(",") && !hasDecimals;
  const isAnimatable = !isNaN(targetNum) && numericMatch;

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20, mass: 1 });

  useEffect(() => {
    if (!isAnimatable) return;

    const unsubscribe = spring.on("change", (latest) => {
      let formatted: string;
      if (hasDecimals) {
        formatted = latest.toFixed(decimalPlaces);
      } else if (hasCommas) {
        formatted = Math.round(latest).toLocaleString("en-US");
      } else {
        formatted = Math.round(latest).toString();
      }
      setDisplayValue(`${prefix}${formatted}${suffix}`);
    });

    if (isInView) {
      motionValue.set(targetNum);
    }

    return unsubscribe;
  }, [isInView, isAnimatable]);

  if (!isAnimatable) {
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      {displayValue}
    </motion.span>
  );
};

export default AnimatedCounter;
