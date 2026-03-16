// Bruno Simon-style fly mode hint overlay
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Mouse, Keyboard } from "lucide-react";

export default function FlyModeHint() {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
          onClick={() => setDismissed(true)}
        >
          <div className="bg-card/90 backdrop-blur-xl border border-primary/30 rounded-2xl px-6 py-3 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.3)] flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors">
            <Plane className="w-4 h-4 text-primary animate-pulse" />
            <div>
              <span className="font-mono text-[0.55rem] text-foreground font-semibold block">
                FLY MODE AVAILABLE
              </span>
              <span className="font-mono text-[0.4rem] text-muted-foreground flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Mouse className="w-2.5 h-2.5" /> Drag to orbit
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Keyboard className="w-2.5 h-2.5" /> Scroll to zoom
                </span>
                <span>•</span>
                <span>Right-click to add project</span>
              </span>
            </div>
            <span className="font-mono text-[0.35rem] text-muted-foreground/50 ml-2">
              click to dismiss
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
