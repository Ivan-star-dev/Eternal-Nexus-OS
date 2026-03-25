// sacred flow — Atlas organ: Heart/Factory of the Eternal Nexus
// CesiumJS globe with real terrain + Three.js gold particle overlay + mode system
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import type { CesiumWidget } from "cesium";
import { useSoundManager } from "@/hooks/useSoundManager";
import ProjectInspector from "@/components/ProjectInspector";
import RightClickPrompt from "@/components/RightClickPrompt";
import type { LODLevel } from "@/components/atlas/ZoomController";
import WeatherOverlay from "@/components/atlas/WeatherOverlay";
import EnvironmentPanel from "@/components/atlas/EnvironmentPanel";
import AgentStatusOverlay from "@/components/atlas/AgentStatusOverlay";
import FlyModeHint from "@/components/atlas/FlyModeHint";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { fetchGlobalPollution, type PollutionPoint } from "@/lib/dataSources";
import { fetchRecentEarthquakes, type EarthquakePoint } from "@/lib/earthquakeData";
import VignetteOverlay from "@/components/atlas/VignetteOverlay";
import AtlasStatusBar from "@/components/atlas/AtlasStatusBar";
import GrainOverlay from "@/components/GrainOverlay";
import StreetViewMode from "@/components/atlas/StreetViewMode";
import { Canvas } from "@react-three/fiber";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { useWorldBankProject } from "@/hooks/useWorldBankProject";
import WorldBankBar from "@/components/atlas/WorldBankBar";
import { useSessionMemory } from "@/hooks/useSessionMemory";
import { geoIdToRoute, hasProjectPage } from "@/lib/projectBridge";
import { useNavigate } from "react-router-dom";

// sacred flow — Atlas mode system
import type { AtlasMode, QualityTier } from "@/lib/atlas/atlas-state";
import { MODE_PRESETS } from "@/lib/atlas/presets";
import { detectDeviceTier, tierToQuality } from "@/lib/atlas/quality-manager";

// sacred flow — CesiumJS components
import CesiumViewerComponent, { type CesiumViewerHandle } from "@/components/atlas/cesium/CesiumViewer";
import CesiumProjectEntities, { type GeoProject } from "@/components/atlas/cesium/CesiumProjectEntities";
import CesiumMeteorParticles from "@/components/atlas/cesium/CesiumMeteorParticles";
import CesiumDataLayers from "@/components/atlas/cesium/CesiumDataLayers";
import CesiumConnectionArcs from "@/components/atlas/cesium/CesiumConnectionArcs";
import GoldParticleOverlay from "@/components/atlas/cesium/GoldParticleOverlay";

// sacred flow — new UI shell
import AtlasTopBar from "@/components/atlas/shell/AtlasTopBar";
import AtlasModeBar from "@/components/atlas/shell/AtlasModeBar";
import AtlasRightPanel from "@/components/atlas/shell/AtlasRightPanel";

// ═══ sacred flow — Project data (immutable) ═══
const geoProjects: GeoProject[] = [
  { id: 1, name: "Pico do Fogo", lat: 14.95, lon: -24.35, color: "#f5c24a", desc: "Geotérmica em Cabo Verde", status: "\u03B1 CLEARANCE" },
  { id: 2, name: "Delta Spine NL", lat: 52.37, lon: 4.89, color: "#a0e7e5", desc: "Infraestrutura modular na Holanda", status: "\u03B2 CLEARANCE" },
  { id: 3, name: "Geocore Power", lat: 41.39, lon: 2.17, color: "#d4a017", desc: "Fusion Core em Barcelona", status: "\u03B3 CLEARANCE" },
  { id: 4, name: "Terra Lenta", lat: 38.72, lon: -9.14, color: "#8b6f47", desc: "Projeto de terra lenta em Lisboa", status: "\u03B4 CLEARANCE" },
  { id: 5, name: "Fusion Core", lat: 48.85, lon: 2.35, color: "#4a90e2", desc: "Núcleo de fusão em Paris", status: "\u03B5 CLEARANCE" },
  { id: 6, name: "Chip Fold", lat: 35.68, lon: 139.77, color: "#c026d3", desc: "Chip Fold em Tóquio", status: "\u03B6 CLEARANCE" },
  { id: 7, name: "Next Path Infra NL", lat: 53.2, lon: 5.5, color: "#a0e7e5", desc: "Plataforma modular Holanda", status: "\u03A9 CLEARANCE" },
  { id: 8, name: "Next Path Infra PT", lat: 39.5, lon: -8.0, color: "#d4a017", desc: "Hub Lisboa", status: "\u03A9 CLEARANCE" },
  { id: 9, name: "Next Path Infra BR", lat: -22.90, lon: -43.17, color: "#22c55e", desc: "Rio de Janeiro Core", status: "\u03A9 CLEARANCE" },
  { id: 10, name: "Next Path Infra US", lat: 40.71, lon: -74.01, color: "#4a90e2", desc: "Nova York Resilience", status: "\u03A9 CLEARANCE" },
  { id: 11, name: "Next Path Infra AE", lat: 25.20, lon: 55.27, color: "#c026d3", desc: "Dubai Floating Hub", status: "\u03A9 CLEARANCE" },
  { id: 12, name: "Next Path Infra JP", lat: 34.5, lon: 136.0, color: "#ec4899", desc: "Tokyo Sky Infra", status: "\u03A9 CLEARANCE" },
];

// sacred flow — LOD thresholds based on camera altitude
function altitudeToLOD(height: number): LODLevel {
  if (height < 5000) return "street";
  if (height < 500000) return "regional";
  return "orbital";
}

// ═══ sacred flow — Main Atlas Page with CesiumJS + Mode System ═══
export default function AtlasPage() {
  // sacred flow — mode system state
  const [mode, setMode] = useState<AtlasMode>("clean");
  const [quality] = useState<QualityTier>(() => tierToQuality(detectDeviceTier()));
  const [isMoving, setIsMoving] = useState(false);
  const [isFlyMode, setIsFlyMode] = useState(false);

  // useRealtimeData implementation
  const { data: realtimeData } = useRealtimeData();

  // sacred flow — core state
  const [cesiumViewer, setCesiumViewer] = useState<CesiumWidget | null>(null);
  const [selectedProject, setSelectedProject] = useState<GeoProject | null>(null);
  const [customProjects, setCustomProjects] = useState<GeoProject[]>([]);
  const [rightClick, setRightClick] = useState<{ x: number; y: number } | null>(null);
  const [lod, setLod] = useState<LODLevel>("orbital");
  const [co2Records, setCo2Records] = useState<any[] | undefined>(undefined);
  const [pollutionData, setPollutionData] = useState<PollutionPoint[] | undefined>(undefined);
  const [earthquakes, setEarthquakes] = useState<EarthquakePoint[]>([]);
  const cesiumRef = useRef<CesiumViewerHandle>(null);
  const sound = useSoundManager();
  const { user } = useAuth();

  // V4-ATLAS-001: WorldBank macro data for selected project's country
  const worldBankData = useWorldBankProject(selectedProject);

  // V4-PROJECT-PAGE-001: session memory + navigation bridge
  const { setGlobeFocus } = useSessionMemory();
  const navigate = useNavigate();

  // sacred flow — layer visibility (controlled by right panel)
  const [layers, setLayers] = useState({
    connections: true,
    co2: true,
    pollution: true,
    earthquakes: true,
    meteors: true,
  });

  const handleLayerChange = useCallback((key: keyof typeof layers, value: boolean) => {
    setLayers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const allProjects = useMemo(() => [...geoProjects, ...customProjects], [customProjects]);

  // sacred flow — CesiumWidget ready
  const handleViewerReady = useCallback((widget: CesiumWidget) => {
    setCesiumViewer(widget);
  }, []);

  // sacred flow — camera height → LOD
  const handleCameraChange = useCallback((height: number) => {
    setLod(altitudeToLOD(height));
  }, []);

  // sacred flow — project selection with fly-to + session memory
  const handleSelectProject = useCallback((p: GeoProject) => {
    setSelectedProject(p);
    sound.playNavigate();
    cesiumRef.current?.flyTo(p.lat, p.lon, 500000);
    // V4-PROJECT-PAGE-001: persist globe focus to session
    setGlobeFocus(`geo:${p.id}`);
  }, [sound, setGlobeFocus]);

  // V4-PROJECT-PAGE-001: navigate to full project page from globe
  const handleOpenProjectPage = useCallback((p: GeoProject) => {
    const route = geoIdToRoute(p.id);
    if (route) navigate(route);
  }, [navigate]);

  useEffect(() => {
    if (realtimeData?.length) {
      // Map the new RealtimeDataPoint[] to the co2Records and pollutionData states
      // Or simply pass them down. For now, we update co2Records with the raw array
      setCo2Records(realtimeData);
    }
  }, [realtimeData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle FlyMode when SPACE is pressed, if not in an input
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setIsFlyMode(prev => !prev);
        sound.playParticle(300);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sound]);

  // sacred flow — load persisted projects from Supabase
  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await supabase
        .from("globe_projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        setCustomProjects(
          data.map((p) => ({
            id: typeof p.id === "string" ? parseInt(p.id.replace(/-/g, "").slice(0, 8), 16) : 0,
            name: p.name,
            lat: Number(p.lat),
            lon: Number(p.lon),
            color: p.color,
            desc: p.description || "",
            status: p.status,
          }))
        );
      }
    };
    loadProjects();
  }, []);

  // sacred flow — right-click to add project
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      sound.playParticle(680);
      setRightClick({ x: e.clientX, y: e.clientY });
    },
    [sound]
  );

  const handleAddProject = useCallback(
    async (name: string) => {
      const lat = Math.random() * 120 - 60;
      const lon = Math.random() * 360 - 180;
      const newProject: GeoProject = {
        id: Date.now(),
        name,
        lat,
        lon,
        color: "#ffd700",
        desc: `Projeto criado: ${name}`,
        status: "\u03A9 CLEARANCE",
      };
      setCustomProjects((prev) => [...prev, newProject]);
      setRightClick(null);
      sound.playNavigate();
      if (user) {
        await supabase.from("globe_projects").insert({
          name,
          lat,
          lon,
          color: "#ffd700",
          description: `Projeto criado: ${name}`,
          status: "\u03A9 CLEARANCE",
          user_id: user.id,
        });
      }
    },
    [sound, user]
  );

  return (
    <div className="fixed inset-0 bg-background">
      {/* sacred flow — CSS overlays (cinematic vignette + grain) */}
      <VignetteOverlay />
      <GrainOverlay />

      {/* sacred flow — new UI shell */}
      {!isFlyMode && (
        <>
          <AtlasTopBar mode={mode} lod={lod} isMoving={isMoving} />
          <AtlasModeBar mode={mode} onModeChange={setMode} />
          <AtlasRightPanel
            projects={allProjects}
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
            layers={layers}
            onLayerChange={handleLayerChange}
            earthquakes={earthquakes}
          />

          <AgentStatusOverlay />
          
          <div className="fixed bottom-4 left-4 z-40">
            <WeatherOverlay
              projectName={selectedProject?.name}
              lat={selectedProject?.lat}
              lon={selectedProject?.lon}
            />
          </div>

          {/* V4-ATLAS-001 — WorldBank macro bar: GDP · population · FDI */}
          <WorldBankBar
            data={worldBankData}
            projectName={selectedProject?.name ?? ""}
          />
        </>
      )}

      {!isFlyMode && <FlyModeHint />}

      {/* sacred flow — CesiumJS globe (terrain, 3D tiles, infinite zoom) */}
      <div className="absolute inset-0" onContextMenu={handleContextMenu}>
        <CesiumViewerComponent
          ref={cesiumRef}
          mode={mode}
          quality={quality}
          onReady={handleViewerReady}
          onCameraChange={handleCameraChange}
          onMotionChange={setIsMoving}
        />

        {/* sacred flow — Street View rendering when fully zoomed in */}
        {lod === "street" && (
          <div className="absolute inset-0 z-[5] pointer-events-none">
            <Canvas camera={{ position: [0, 2, 12], fov: 60 }} dpr={[1, 1.5]}>
              <StreetViewMode />
            </Canvas>
          </div>
        )}

        {/* sacred flow — gold particle overlay (Three.js, 60fps, density from mode preset) */}
        {!isFlyMode && <GoldParticleOverlay particleDensity={MODE_PRESETS[mode].particleDensity} />}
      </div>

      {/* sacred flow — CesiumJS entity layers (render when viewer ready) */}
      <CesiumProjectEntities
        viewer={cesiumViewer}
        projects={allProjects}
        onSelect={handleSelectProject}
      />
      <CesiumMeteorParticles viewer={cesiumViewer} enabled={layers.meteors && lod !== "street"} />
      <CesiumConnectionArcs
        viewer={cesiumViewer}
        projects={allProjects}
        visible={layers.connections}
      />
      <CesiumDataLayers
        viewer={cesiumViewer}
        visible={layers.co2 || layers.pollution || layers.earthquakes}
        co2Records={layers.co2 ? co2Records : undefined}
        pollutionData={layers.pollution ? pollutionData : undefined}
        earthquakes={layers.earthquakes ? earthquakes : []}
      />

      {/* sacred flow — right-click project creation */}
      {rightClick && !isFlyMode && (
        <RightClickPrompt
          x={rightClick.x}
          y={rightClick.y}
          onSubmit={handleAddProject}
          onCancel={() => setRightClick(null)}
        />
      )}

      {/* sacred flow — project detail panels */}
      {selectedProject && !isFlyMode && (
        <div className="fixed bottom-4 right-4 z-40">
          <EnvironmentPanel project={selectedProject} />
        </div>
      )}

      {selectedProject && !isFlyMode && (
        <ProjectInspector
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenPage={handleOpenProjectPage}
        />
      )}

      {!isFlyMode && <AtlasStatusBar projectCount={allProjects.length} lod={lod} />}
    </div>
  );
}
