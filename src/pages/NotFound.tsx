import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "404 — Eternal Nexus OS";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-8">
            404 · COORDINATES NOT FOUND
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-light text-paper mb-5">
            This territory is uncharted.
          </h1>

          <p className="font-serif text-sm text-paper-dim/60 italic mb-12">
            The page you're looking for doesn't exist in this branch of the system.
          </p>

          <Link
            to="/"
            className="inline-block border border-gold/60 text-gold font-mono text-[0.6rem] tracking-[0.12em] uppercase px-8 py-3 hover:border-gold hover:bg-gold/5 transition-all duration-200"
          >
            Return to Base
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
