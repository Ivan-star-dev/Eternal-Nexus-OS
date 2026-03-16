import deltaSpineRender from "@/assets/deltaspine-render.png";
import geocoreHero from "@/assets/geocore-power-hero.jpg";
import terraLentaHero from "@/assets/terra-lenta-hero.jpg";
import fusionCoreHero from "@/assets/fusion-core-hero.jpg";
import chipFoldHero from "@/assets/chip-fold-hero.jpg";

export interface HomeProject {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  image: string;
  status: string;
}

export const homeProjects: HomeProject[] = [
  {
    id: "deltaspine-nl",
    title: "DeltaSpine NL",
    subtitle: "Sub-canal modular reversível",
    summary: "Frame magnético 300 km/h sob canais holandeses. Tratamento de nitrogénio em tempo real + produção H₂ onboard. Payback 8-12 anos.",
    tags: ["Mobilidade", "Energia", "Ambiente"],
    image: deltaSpineRender,
    status: "ACTIVE",
  },
  {
    id: "geocore-power",
    title: "GeoCore Power",
    subtitle: "Volcanic EGS — Graphene MHD",
    summary: "80-120 MW por poço geotérmico em Cabo Verde. MHD com grafeno dopado, eficiência 40-60%. Custo $0.08/kWh, payback 3.5 anos.",
    tags: ["Energia", "Geotérmica", "Clima"],
    image: geocoreHero,
    status: "ACTIVE",
  },
  {
    id: "terra-lenta",
    title: "Terra Lenta",
    subtitle: "Redução rotacional controlada",
    summary: "Redução de 10% na rotação terrestre: dia de 26.4h, +876 horas/ano. -20% furacões, +8% PIB global. Fase de investigação.",
    tags: ["Planetary Eng.", "Clima", "Geopolítica"],
    image: terraLentaHero,
    status: "RESEARCH",
  },
  {
    id: "fusion-core",
    title: "Fusion Core",
    subtitle: "Sistema auto-catalítico 1 TW",
    summary: "Integração GeoCore + Terra Lenta: 1 TW energia limpa, +10% PIB global, -40% fome. Sistema que se retroalimenta.",
    tags: ["Integração", "Energia", "AI"],
    image: fusionCoreHero,
    status: "PLANNING",
  },
  {
    id: "chip-fold",
    title: "Chip Fold",
    subtitle: "Computação por celulose nanofibrilada",
    summary: "100x performance vs silício, 10x mais barato, -70% energia, 100% reciclável. Computação sustentável de próxima geração.",
    tags: ["Computing", "Deep Tech", "Sustentabilidade"],
    image: chipFoldHero,
    status: "ACTIVE",
  },
];
