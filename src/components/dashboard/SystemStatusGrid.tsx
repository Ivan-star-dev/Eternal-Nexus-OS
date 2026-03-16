import { motion } from "framer-motion";
import type { SystemStatusEntry } from "@/types/dashboard";

interface SystemStatusGridProps {
  services: SystemStatusEntry[];
}

const statusStyle: Record<string, { dot: string; text: string; label: string }> = {
  operational: { dot: "bg-green-400", text: "text-green-400", label: "OPERATIONAL" },
  degraded: { dot: "bg-yellow-400 animate-pulse", text: "text-yellow-400", label: "DEGRADED" },
  down: { dot: "bg-destructive animate-pulse", text: "text-destructive", label: "DOWN" },
};

export default function SystemStatusGrid({ services }: SystemStatusGridProps) {
  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-5 py-3 flex items-center justify-between">
        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary uppercase">
          System Status
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
          <span className="font-mono text-[0.48rem] tracking-[0.1em] text-green-400 uppercase">
            ALL SYSTEMS
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
        {services.map((service, i) => {
          const style = statusStyle[service.status] || statusStyle.operational;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <span className="font-mono text-[0.55rem] tracking-[0.08em] text-foreground">
                  {service.service_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[0.48rem] tracking-[0.1em] uppercase ${style.text}`}>
                  {style.label}
                </span>
                <span className="font-mono text-[0.48rem] text-muted-foreground">
                  {Number(service.latency_ms)}ms · {Number(service.uptime_pct)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
