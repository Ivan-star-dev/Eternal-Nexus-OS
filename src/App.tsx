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

const Index = lazy(() => import("./pages/Index"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const GovAuth = lazy(() => import("./pages/GovAuth"));
const InvestorBriefing = lazy(() => import("./pages/InvestorBriefing"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const Geopolitics = lazy(() => import("./pages/Geopolitics"));
const Gallery = lazy(() => import("./pages/Gallery"));
const AtlasPage = lazy(() => import("./pages/AtlasPage"));
const NexusPage = lazy(() => import("./pages/NexusPage"));
const NewsPortal = lazy(() => import("./pages/NewsPortal"));
const GeopoliticsNarrative = lazy(() => import("./pages/GeopoliticsNarrative"));
const NexusOrganismBuilder = lazy(() => import("./pages/NexusOrganismBuilder"));
const PlataformaNacional = lazy(() => import("./pages/PlataformaNacional"));
const CentroComandoGeopolitico = lazy(() => import("./pages/CentroComandoGeopolitico"));
const CanalTransparencia = lazy(() => import("./pages/CanalTransparencia"));
const InvestorNexusPortal = lazy(() => import("./pages/InvestorNexusPortal"));
const SalaDeCrise = lazy(() => import("./pages/SalaDeCrise"));
const EducacaoNacional = lazy(() => import("./pages/EducacaoNacional"));
const IndexPage = lazy(() => import("./pages/IndexPage"));
const FounderPage = lazy(() => import("./pages/FounderPage"));
const Projects = lazy(() => import("./pages/Projects"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SystemFacePage = lazy(() => import("./pages/SystemFacePage"));

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
                <Route path="/investor/deltaspine-nl" element={<InvestorBriefing />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/access" element={<GovAuth />} />
                <Route path="/owner" element={<ProtectedRoute ownerOnly><OwnerDashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/geopolitics" element={<Geopolitics />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/atlas" element={
                  <OrganErrorBoundary organName="Atlas">
                    <Suspense fallback={<OrganSuspenseFallback organName="Atlas" />}>
                      <AtlasPage />
                    </Suspense>
                  </OrganErrorBoundary>
                } />
                <Route path="/nexus" element={<NexusPage />} />
                <Route path="/news" element={
                  <OrganErrorBoundary organName="News">
                    <Suspense fallback={<OrganSuspenseFallback organName="News" />}>
                      <NewsPortal />
                    </Suspense>
                  </OrganErrorBoundary>
                } />
                <Route path="/organism-index" element={
                  <OrganErrorBoundary organName="Index">
                    <Suspense fallback={<OrganSuspenseFallback organName="Index" />}>
                      <IndexPage />
                    </Suspense>
                  </OrganErrorBoundary>
                } />
                <Route path="/tribunal" element={
                  <OrganErrorBoundary organName="Tribunal">
                    <Suspense fallback={<OrganSuspenseFallback organName="Tribunal" />}>
                      <GeopoliticsNarrative />
                    </Suspense>
                  </OrganErrorBoundary>
                } />
                <Route path="/nexus-organism" element={<NexusOrganismBuilder />} />
                <Route path="/plataforma-nacional" element={<PlataformaNacional />} />
                <Route path="/comando-geopolitico" element={<CentroComandoGeopolitico />} />
                <Route path="/canal-transparencia" element={<CanalTransparencia />} />
                <Route path="/investor-portal" element={<InvestorNexusPortal />} />
                <Route path="/sala-de-crise" element={<SalaDeCrise />} />
                <Route path="/educacao" element={<EducacaoNacional />} />
                <Route path="/founder" element={<FounderPage />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/system" element={<SystemFacePage />} />
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
