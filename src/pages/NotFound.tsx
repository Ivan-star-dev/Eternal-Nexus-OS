import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-mono text-[0.55rem] tracking-[0.25em] text-amber-500/60 uppercase mb-6">
            ■ Route Not Found
          </div>

          <motion.h1
            className="font-mono font-bold text-[6rem] leading-none mb-4 text-white"
            style={{
              textShadow:
                "0 0 20px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.15)",
            }}
            animate={{
              textShadow: [
                "0 0 20px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.15)",
                "0 0 30px rgba(251,191,36,0.6), 0 0 80px rgba(251,191,36,0.25)",
                "0 0 20px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.15)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.h1>

          <p className="font-mono text-sm text-neutral-300 mb-2 tracking-wide">
            Page not found
          </p>
          <p className="font-mono text-[0.7rem] text-neutral-500 mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link
            to="/"
            className="inline-block font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-amber-500/60 text-amber-400 px-8 py-3 rounded hover:border-amber-400 hover:text-amber-300 hover:bg-amber-500/5 transition-all duration-200"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
