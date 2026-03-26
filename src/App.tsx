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
import ProtectedRoute from "@/components/ProtectedRoute";
import OrganErrorBoundary from "./components/shared/OrganErrorBoundary";
import OrganSuspenseFallback from "./components/shared/OrganSuspenseFallback";
import { NexusFlowInspector } from "./components/shared/NexusFlowInspector";
import LoadingFallback from "./components/LoadingFallback";
import ErrorBoundary from "./components/ErrorBoundary";
import SessionBoot from "./components/SessionBoot";

function SystemAwareInspector() {
  const location = useLocation();
  if (location.pathname === "/system") return null;
  return <NexusFlowInspector />;
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
const LabPage = lazy(() => import("./pages/LabPage"));
const SchoolPage = lazy(() => import("./pages/SchoolPage"));
const WorkshopPage = lazy(() => import("./pages/WorkshopPage"));

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
            <SessionBoot />
            <OrganTransitionParticles />
            <SystemAwareInspector />
            <CommandPalette />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/project/:id" element={<ProjectPage />} />
                <Route path="/globe" element={<GlobePage />} />
                <Route path="/nexus" element={<NexusPage />} />
                <Route path="/founder" element={<FounderPage />} />
                <Route path="/lab" element={<LabPage />} />
                <Route path="/school" element={<SchoolPage />} />
                <Route path="/workshop" element={<WorkshopPage />} />
                <Route path="/access" element={<GovAuth />} />
                <Route path="/owner" element={<ProtectedRoute ownerOnly><OwnerDashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/investor/deltaspine-nl" element={<InvestorBriefing />} />
                <Route path="/system" element={<SystemFacePage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
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
