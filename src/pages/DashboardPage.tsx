import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import DashboardKPIGrid from "@/components/dashboard/DashboardKPIGrid";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProjectProgressGrid from "@/components/dashboard/ProjectProgressGrid";
import SystemStatusGrid from "@/components/dashboard/SystemStatusGrid";
import MetricsChart from "@/components/dashboard/MetricsChart";
import RealtimeStreamChart from "@/components/dashboard/RealtimeStreamChart";
import UPlotStreamChart from "@/components/dashboard/UPlotStreamChart";
import FrameBudgetMonitor from "@/components/dashboard/FrameBudgetMonitor";
import ProjectMetricsBarChart from "@/components/dashboard/ProjectMetricsBarChart";
import SystemRadarChart from "@/components/dashboard/SystemRadarChart";
import {
import { EASE_OUT } from "@/lib/motion/config";
  useProjectMetrics,
  useActivityLog,
  useSystemStatus,
  useProjectProgress,
} from "@/hooks/useDashboardData";

const ease = EASE_OUT;

const DashboardPage = () => {
  const { data: metrics = [], isLoading: metricsLoading } = useProjectMetrics();
  const { data: activity = [], isLoading: activityLoading } = useActivityLog();
  const { data: services = [], isLoading: statusLoading } = useSystemStatus();
  const { data: progress = [], isLoading: progressLoading } = useProjectProgress();

  const isLoading = metricsLoading || activityLoading || statusLoading || progressLoading;

  return (
    <Layout>
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 sm:px-6 md:px-12 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">
                MISSION CONTROL
              </span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
              <span className="font-mono text-[0.48rem] tracking-[0.1em] text-green-400 uppercase">
                LIVE
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Realtime <span className="text-primary">Dashboard</span>
            </h1>
          </div>
          <div className="hidden md:block text-right">
            <span className="font-mono text-[0.5rem] tracking-[0.1em] text-muted-foreground block">
              NEXT PATH INFRA · STRATEGIC DIVISION
            </span>
            <span className="font-mono text-[0.48rem] tracking-[0.1em] text-muted-foreground/60 block">
              {new Date().toLocaleString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit", second: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-12 py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase">
                  Syncing realtime data…
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* KPI Grid */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <DashboardKPIGrid metrics={metrics} progress={progress} />
              </motion.div>

              {/* 30-Day Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.6, ease }}
              >
                <MetricsChart />
              </motion.div>

              {/* Live Streaming Chart */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
              >
                <RealtimeStreamChart />
              </motion.div>

              {/* Canvas-based uPlot Stream (zero React overhead) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.105, duration: 0.6, ease }}
              >
                <UPlotStreamChart />
              </motion.div>

              {/* Frame Budget Monitor */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.11, duration: 0.6, ease }}
              >
                <FrameBudgetMonitor />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.6, ease }}
                >
                  <ProjectMetricsBarChart metrics={metrics} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.6, ease }}
                >
                  <SystemRadarChart services={services} />
                </motion.div>
              </div>

              {/* Two-column: Progress + Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease }}
                >
                  <ProjectProgressGrid progress={progress} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, duration: 0.6, ease }}
                >
                  <ActivityFeed entries={activity} />
                </motion.div>
              </div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease }}
              >
                <SystemStatusGrid services={services} />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
