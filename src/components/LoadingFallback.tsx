import { motion } from "framer-motion";

export default function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="relative w-16 h-16 mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
          <motion.div
            className="absolute inset-0 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border border-t-accent-foreground border-r-transparent border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase">
          Loading Module
        </span>
        <div className="flex justify-center gap-1 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-primary"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
