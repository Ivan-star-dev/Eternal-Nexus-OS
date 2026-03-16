import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const IPProtectionBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="border-t border-border py-8 px-6 md:px-20 bg-destructive/5"
    >
      <div className="max-w-[1200px] mx-auto flex items-center gap-4">
        <Shield className="w-5 h-5 text-destructive flex-shrink-0" />
        <p className="font-mono text-[0.62rem] tracking-[0.08em] text-muted-foreground leading-relaxed">
          <span className="text-destructive font-medium">INTELLECTUAL PROPERTY NOTICE</span> — All concepts, designs, and documentation 
          are the exclusive property of Ivanildo Michel Monteiro Fernandes. Protected under international copyright law. 
          All access is monitored and traceable. Unauthorized use will be prosecuted.
        </p>
      </div>
    </motion.div>
  );
};

export default IPProtectionBanner;
