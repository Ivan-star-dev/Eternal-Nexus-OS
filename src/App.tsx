import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "@/contexts/SessionContext";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import OrganTransitionParticles from "@/components/OrganTransitionParticles";
import CommandPalette from "@/components/CommandPalette";
import { lazy, Suspense } from "react";
import { NexusFlowInspector } from "./components/shared/NexusFlowInspector";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";

function SystemAwareInspector() {
  const location = useLocation();
  if (location.pathname === "/system") return null;
  return <NexusFlowInspector />;
}

// ─── Active routes — canonical organism post-purge 2026-03-26 ────────────────
// Sacred flow: Tribunal → Atlas → Index → News (NEXUS_OS.md Law 3)
// Faces: System · Product (Nexus) · Ecosystem (Atlas)
const Index = lazy(() => import("./pages/Index"));
const NexusPage = lazy(() => import("./pages/NexusPage"));
const FounderPage = lazy(() => import("./pages/FounderPage"));
const SystemFacePage = lazy(() => import("./pages/SystemFacePage"));
const AtlasPage = lazy(() => import("./pages/AtlasPage"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));
const NewsPortal = lazy(() => import("./pages/NewsPortal"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SessionProvider>
      <AuthProvider>
        <TooltipProvider>
          <CustomCursor />
          <GrainOverlay />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OrganTransitionParticles />
            <SystemAwareInspector />
            <CommandPalette />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* ── HOME ── */}
                <Route path="/" element={<Index />} />

                {/* ── SACRED FLOW: Tribunal → Atlas → Index → News ── */}
                <Route path="/atlas" element={<AtlasPage />} />
                <Route path="/news" element={<NewsPortal />} />

                {/* ── PRODUCT FACES ── */}
                <Route path="/nexus" element={<NexusPage />} />
                <Route path="/system" element={<SystemFacePage />} />
                <Route path="/founder" element={<FounderPage />} />

                {/* ── PROJECTS ECOSYSTEM ── */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/project/:id" element={<ProjectPage />} />

                {/* ── INTERNAL / OWNER ── */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/owner" element={<OwnerDashboard />} />

                {/* ── LEGAL ── */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />

                {/* ── FALLBACK ── */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
      </SessionProvider>
    </LanguageProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
