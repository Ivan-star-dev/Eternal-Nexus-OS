import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono text-[0.55rem] tracking-[0.25em] text-red-500/70 uppercase mb-6">
            ■ System Fault
          </div>

          <motion.h1
            className="font-mono font-bold text-[5rem] leading-none mb-4 text-white"
            style={{
              textShadow:
                "0 0 20px rgba(239,68,68,0.4), 0 0 60px rgba(239,68,68,0.15)",
            }}
            animate={{
              textShadow: [
                "0 0 20px rgba(239,68,68,0.4), 0 0 60px rgba(239,68,68,0.15)",
                "0 0 30px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.25)",
                "0 0 20px rgba(239,68,68,0.4), 0 0 60px rgba(239,68,68,0.15)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            500
          </motion.h1>

          <p className="font-mono text-sm text-neutral-300 mb-2 tracking-wide">
            Something went wrong
          </p>
          <p className="font-mono text-[0.7rem] text-neutral-500 mb-10 leading-relaxed">
            An unexpected error occurred on our end. The organism is recovering.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-red-500/60 text-red-400 px-6 py-2.5 rounded hover:border-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
            >
              Retry
            </button>
            <Link
              to="/"
              className="font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-amber-500/60 text-amber-400 px-6 py-2.5 rounded hover:border-amber-400 hover:text-amber-300 hover:bg-amber-500/5 transition-all duration-200"
            >
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
