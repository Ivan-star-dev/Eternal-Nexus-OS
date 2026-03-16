import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import OrganTransitionParticles from "@/components/OrganTransitionParticles";
import { lazy, Suspense } from "react";

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
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase">Loading…</span>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <CustomCursor />
          <GrainOverlay />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OrganTransitionParticles />
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/project/:id" element={<ProjectPage />} />
                <Route path="/investor/deltaspine-nl" element={<InvestorBriefing />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/access" element={<GovAuth />} />
                <Route path="/owner" element={<OwnerDashboard />} />
                <Route path="/dashboard" element={<DashboardPage />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
