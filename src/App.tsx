import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { PortalProvider } from "@/contexts/PortalContext";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import OrganTransitionParticles from "@/components/OrganTransitionParticles";
import CommandPalette from "@/components/CommandPalette";
import { lazy, Suspense, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import OrganErrorBoundary from "./components/shared/OrganErrorBoundary";
import OrganSuspenseFallback from "./components/shared/OrganSuspenseFallback";
import { NexusFlowInspector } from "./components/shared/NexusFlowInspector";
import LoadingFallback from "./components/LoadingFallback";
import ErrorBoundary from "./components/ErrorBoundary";
import SessionBoot from "./components/SessionBoot";
import { getPortalByRoute } from "@/lib/portal/portalRegistry";
import { usePortal } from "@/contexts/PortalContext";
import { useSessionSpawn } from "@/hooks/useSessionSpawn";
import NextStepHint from "@/components/intelligence/NextStepHint";
import ControlTower from "@/components/owner/ControlTower";
import { useAuth } from "@/contexts/AuthContext";
import PageTransitionLayer from "@/components/shell/PageTransitionLayer";
import RouteAtmosphereLayer from "@/components/shell/RouteAtmosphereLayer";
import { useOrganism } from "@/hooks/useOrganism";

function SystemAwareInspector() {
  const location = useLocation();
  if (location.pathname === "/system") return null;
  return <NexusFlowInspector />;
}

/** Renders NextStepHint only outside of owner/dashboard routes */
function GlobalIntelligenceLayer() {
  const location = useLocation();
  const noHintRoutes = ['/owner', '/dashboard', '/system', '/access'];
  if (noHintRoutes.includes(location.pathname)) return null;
  return <NextStepHint minConfidence={0.65} />;
}

/**
 * Mounts useOrganism app-wide — bridges SessionContext + useEvolution → NexusRuntime.
 * Must live inside BrowserRouter (needs useLocation) and SessionProvider.
 * Renders nothing; side-effects only.
 */
function OrganismBridge() {
  useOrganism();
  return null;
}

/** Renders ControlTower only for owner users */
function OwnerLayer() {
  const { isOwner } = useAuth();
  if (!isOwner) return null;
  return <ControlTower />;
}

/**
 * Silently restores last portal + route on app mount.
 * Placed inside BrowserRouter so useNavigate() is available.
 * Runs once; if isReturning, navigates to lastPortal route with no flash.
 */
function SessionSpawnGate() {
  const { isReturning, lastPortal } = useSessionSpawn();
  const navigate = useNavigate();
  const { portalConfig } = usePortal();

  useEffect(() => {
    if (isReturning && lastPortal) {
      navigate(portalConfig.route, { replace: true });
    }
    // Intentionally run once — spawn is a one-shot on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturning]);

  return null;
}

/**
 * Syncs the active portal when the route changes.
 * Placed inside BrowserRouter so useLocation() is available.
 */
function PortalRouteSync() {
  const location = useLocation();
  const { transition } = usePortal();

  useEffect(() => {
    const config = getPortalByRoute(location.pathname);
    if (config) {
      transition(config.id, location.pathname);
    }
  }, [location.pathname, transition]);

  return null;
}

// ─── Active routes — clean organism post-purge 2026-03-26 ─────────────────────
const Index = lazy(() => import("./pages/Index"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const GovAuth = lazy(() => import("./pages/GovAuth"));
const InvestorBriefing = lazy(() => import("./pages/InvestorBriefing"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NexusPage = lazy(() => import("./pages/NexusPage"));
const FounderPage = lazy(() => import("./pages/FounderPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SystemFacePage = lazy(() => import("./pages/SystemFacePage"));
const GlobePage = lazy(() => import("./pages/GlobePage"));
const WorldPage = lazy(() => import("./pages/WorldPage"));
const LabPage = lazy(() => import("./pages/LabPage"));
const ResearchPage = lazy(() => import("./pages/ResearchPage"));
const SchoolPage = lazy(() => import("./pages/SchoolPage"));
const WorkshopPage = lazy(() => import("./pages/WorkshopPage"));
const MissionsPage = lazy(() => import("./pages/MissionsPage"));
const TestPage = lazy(() => import("./pages/TestPage"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SessionProvider>
      <AuthProvider>
        <PortalProvider>
        <TooltipProvider>
          <CustomCursor />
          <GrainOverlay />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SessionSpawnGate />
            <PortalRouteSync />
            <SessionBoot />
            <OrganismBridge />
            <OrganTransitionParticles />
            <SystemAwareInspector />
            <CommandPalette />
            <GlobalIntelligenceLayer />
            <OwnerLayer />
            <Suspense fallback={<LoadingFallback />}>
            <PageTransitionLayer>
            <RouteAtmosphereLayer>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/project/:id" element={<ProjectPage />} />
                <Route path="/globe" element={<GlobePage />} />
                <Route path="/world" element={<WorldPage />} />
                <Route path="/nexus" element={<NexusPage />} />
                <Route path="/founder" element={<FounderPage />} />
                <Route path="/lab" element={<LabPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/school" element={<SchoolPage />} />
                <Route path="/workshop" element={<WorkshopPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/access" element={<GovAuth />} />
                <Route path="/owner" element={<ProtectedRoute ownerOnly><OwnerDashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/investor/deltaspine-nl" element={<InvestorBriefing />} />
                <Route path="/system" element={<SystemFacePage />} />
                <Route path="/missions" element={<MissionsPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </RouteAtmosphereLayer>
            </PageTransitionLayer>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
        </PortalProvider>
      </AuthProvider>
      </SessionProvider>
    </LanguageProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
