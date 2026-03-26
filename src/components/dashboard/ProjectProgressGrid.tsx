import { motion } from "framer-motion";
import type { ProjectProgressEntry } from "@/types/dashboard";
import { EASE_OUT } from "@/lib/motion/config";

interface ProjectProgressGridProps {
  progress: ProjectProgressEntry[];
}

const projectMeta: Record<string, { label: string; color: string }> = {
  deltaspine: { label: "DeltaSpine NL", color: "hsl(42 78% 45%)" },
  geocore: { label: "GeoCore Power", color: "hsl(172 55% 28%)" },
  terralenta: { label: "Terra Lenta", color: "hsl(16 25% 46%)" },
  chipfold: { label: "Chip Fold", color: "hsl(174 60% 41%)" },
  fusion: { label: "Fusion Core", color: "hsl(232 48% 56%)" },
};

const statusColor: Record<string, string> = {
  active: "text-primary",
  complete: "text-green-400",
  pending: "text-muted-foreground",
  blocked: "text-destructive",
};

export default function ProjectProgressGrid({ progress }: ProjectProgressGridProps) {
  // Group by project
  const grouped = progress.reduce<Record<string, ProjectProgressEntry[]>>((acc, p) => {
    (acc[p.project_id] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-5 py-3">
        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary uppercase">
          Project Progress
        </span>
      </div>
      <div className="divide-y divide-border/50">
        {Object.entries(grouped).map(([projectId, phases], gi) => {
          const meta = projectMeta[projectId] || { label: projectId, color: "hsl(var(--primary))" };
          return (
            <motion.div
              key={projectId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: gi * 0.06 }}
              className="px-5 py-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="font-serif text-sm font-bold text-foreground">
                  {meta.label}
                </span>
              </div>
              <div className="space-y-2.5">
                {phases.map((phase) => (
                  <div key={phase.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[0.55rem] tracking-[0.08em] text-muted-foreground">
                        {phase.phase}
                      </span>
                      <span className={`font-mono text-[0.5rem] tracking-[0.1em] uppercase ${statusColor[phase.status]}`}>
                        {phase.status} · {Number(phase.progress)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary overflow-hidden rounded-full">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: meta.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Number(phase.progress)}%` }}
                        transition={{ duration: 1, ease: EASE_OUT }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
