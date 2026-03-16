import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ActivityLogEntry } from "@/types/dashboard";

interface ActivityFeedProps {
  entries: ActivityLogEntry[];
}

const severityConfig = {
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  success: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  warning: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  error: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

const projectLabel: Record<string, string> = {
  deltaspine: "DeltaSpine",
  geocore: "GeoCore",
  terralenta: "Terra Lenta",
  fusion: "Fusion Core",
  chipfold: "Chip Fold",
};

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-5 py-3 flex items-center justify-between">
        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary uppercase">
          Activity Feed
        </span>
        <span className="font-mono text-[0.48rem] tracking-[0.1em] text-muted-foreground uppercase">
          LIVE · {entries.length} events
        </span>
      </div>
      <div className="max-h-[420px] overflow-y-auto divide-y divide-border/50">
        {entries.map((entry, i) => {
          const config = severityConfig[entry.severity] || severityConfig.info;
          const Icon = config.icon;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="px-5 py-4 hover:bg-primary/[0.02] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-sm ${config.bg} ${config.border} border`}>
                  <Icon className={`w-3 h-3 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-sm font-bold text-foreground truncate">
                      {entry.title}
                    </span>
                    {entry.project_id && (
                      <span className="font-mono text-[0.48rem] tracking-[0.1em] text-primary border border-primary/30 px-1.5 py-0.5 flex-shrink-0">
                        {projectLabel[entry.project_id] || entry.project_id}
                      </span>
                    )}
                  </div>
                  {entry.description && (
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {entry.description}
                    </p>
                  )}
                  <span className="font-mono text-[0.48rem] text-muted-foreground/60 mt-1 block">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {entries.length === 0 && (
          <div className="p-10 text-center">
            <span className="font-mono text-sm text-muted-foreground">No activity recorded</span>
          </div>
        )}
      </div>
    </div>
  );
}
