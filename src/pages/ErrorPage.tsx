import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  useEffect(() => {
    document.title = "Error — Eternal Nexus OS";
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-8">
            SYSTEM FAULT · ERROR
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-light text-paper mb-5">
            Something broke in the mesh.
          </h1>

          <p className="font-serif text-sm text-paper-dim/60 italic mb-12">
            An unexpected fault has been registered. The system is attempting to recover.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="border border-gold/60 text-gold font-mono text-[0.6rem] tracking-[0.12em] uppercase px-8 py-3 hover:border-gold hover:bg-gold/5 transition-all duration-200"
            >
              Retry
            </button>
            <Link
              to="/"
              className="border border-gold/30 text-gold/60 font-mono text-[0.6rem] tracking-[0.12em] uppercase px-8 py-3 hover:border-gold/60 hover:text-gold hover:bg-gold/5 transition-all duration-200"
            >
              Return to Base
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
