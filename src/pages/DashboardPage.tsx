import { useEffect } from "react";
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
  useProjectMetrics,
  useActivityLog,
  useSystemStatus,
  useProjectProgress,
} from "@/hooks/useDashboardData";

const ease = [0.16, 1, 0.3, 1] as const;

const DashboardPage = () => {
  useEffect(() => {
    document.title = "Dashboard — Mission Control · Eternal Nexus OS";
  }, []);

  const { data: metrics = [], isLoading: metricsLoading } = useProjectMetrics();
  const { data: activity = [], isLoading: activityLoading } = useActivityLog();
  const { data: services = [], isLoading: statusLoading } = useSystemStatus();
  const { data: progress = [], isLoading: progressLoading } = useProjectProgress();

  const isLoading = metricsLoading || activityLoading || statusLoading || progressLoading;

  return (
    <Layout>
      {/* Header */}
      <div
        className="relative border-b py-20 sm:py-24 px-4 sm:px-6 md:px-16 overflow-hidden"
        style={{ background: "#060c14", borderColor: "rgba(200,164,78,0.1)" }}
      >
        {/* Grid substrate */}
        <div className="absolute inset-0 engineering-grid pointer-events-none" style={{ opacity: 0.035 }} />
        {/* Gold orb */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 55% at 80% 40%, hsl(42 78% 45% / 0.1) 0%, transparent 65%)" }} />
        {/* Teal orb */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 45% at 5% 70%, hsl(172 55% 30% / 0.07) 0%, transparent 60%)" }} />

        <div className="relative max-w-[1400px] mx-auto flex items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[0.48rem] tracking-[0.32em] uppercase" style={{ color: "rgba(200,164,78,0.5)" }}>MISSION CONTROL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[0.48rem] tracking-[0.2em] uppercase" style={{ color: "rgba(52,211,153,0.8)" }}>LIVE</span>
            </div>
            <h1
              className="font-serif font-light leading-[0.9]"
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: "clamp(40px, 5vw, 64px)",
                color: "#e8eef4",
                letterSpacing: "-0.02em",
              }}
            >
              Realtime Dashboard
            </h1>
            <p className="mt-3 font-sans text-sm font-light" style={{ color: "rgba(200,218,232,0.5)" }}>
              Next Path Infra · Strategic Division
            </p>
          </div>
          <div className="hidden md:block text-right shrink-0">
            <span className="font-mono text-[0.48rem] tracking-[0.2em] uppercase block" style={{ color: "rgba(200,218,232,0.3)" }}>NEXT PATH INFRA · STRATEGIC</span>
            <span className="font-mono text-[0.48rem] tracking-[0.1em] block mt-1" style={{ color: "rgba(200,218,232,0.2)" }}>
              {new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-16 py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gold/60 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <span className="font-mono text-[0.48rem] tracking-[0.2em] text-paper-dim/50 uppercase">
                  Syncing realtime data…
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* KPI Grid */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
              >
                <DashboardKPIGrid metrics={metrics} progress={progress} />
              </motion.div>

              {/* 30-Day Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.6, ease }}
              >
                <MetricsChart />
              </motion.div>

              {/* Live Streaming Chart */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
              >
                <RealtimeStreamChart />
              </motion.div>

              {/* Canvas-based uPlot Stream (zero React overhead) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.105, duration: 0.6, ease }}
              >
                <UPlotStreamChart />
              </motion.div>

              {/* Frame Budget Monitor */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.11, duration: 0.6, ease }}
              >
                <FrameBudgetMonitor />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12, duration: 0.6, ease }}
                >
                  <ProjectMetricsBarChart metrics={metrics} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.16, duration: 0.6, ease }}
                >
                  <SystemRadarChart services={services} />
                </motion.div>
              </div>

              {/* Two-column: Progress + Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6, ease }}
                >
                  <ProjectProgressGrid progress={progress} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.24, duration: 0.6, ease }}
                >
                  <ActivityFeed entries={activity} />
                </motion.div>
              </div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
