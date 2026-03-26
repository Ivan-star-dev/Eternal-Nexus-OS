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

// ─── Purged routes (2026-03-26) — capability archived, routes removed ─────────
// AtlasPage             → absorbed into Lab (Cesium geospatial module)
// Geopolitics           → absorbed into Lab (investigation layer)
// GeopoliticsNarrative  → absorbed into Lab (tribunal/narrative)
// Gallery               → absorbed into Projects layer
// NewsPortal            → absorbed into Lab (intelligence feed)
// NexusOrganismBuilder  → absorbed into Workshop/Creation Hub
// PlataformaNacional    → absorbed into Projects layer
// CentroComandoGeopolitico → absorbed into Lab
// CanalTransparencia    → absorbed into Projects layer
// InvestorNexusPortal   → absorbed into Projects/Dashboard
// SalaDeCrise           → absorbed into Nexus (CrisisMode exists there)
// EducacaoNacional      → absorbed into School
// IndexPage             → internal dev reference only
// Projects              → absorbed into homepage projects section
// About                 → demoted to footer link only

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
                {/* ── Core organism surfaces ──────────────────────────── */}
                <Route path="/" element={<Index />} />
                <Route path="/project/:id" element={<ProjectPage />} />
                <Route path="/globe" element={<GlobePage />} />
                <Route path="/nexus" element={<NexusPage />} />
                <Route path="/founder" element={<FounderPage />} />

                {/* ── Trinity portals — V7 ──────────────────────────────*/}
                <Route path="/lab" element={<LabPage />} />
                <Route path="/school" element={<SchoolPage />} />
                <Route path="/workshop" element={<WorkshopPage />} />

                {/* ── Owner layer (protected) ──────────────────────────── */}
                <Route path="/access" element={<GovAuth />} />
                <Route path="/owner" element={<ProtectedRoute ownerOnly><OwnerDashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

                {/* ── Private / internal ──────────────────────────────── */}
                <Route path="/investor/deltaspine-nl" element={<InvestorBriefing />} />
                <Route path="/system" element={<SystemFacePage />} />

                {/* ── Legal (footer links) ─────────────────────────────── */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />

                {/* ── Catch-all ────────────────────────────────────────── */}
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
