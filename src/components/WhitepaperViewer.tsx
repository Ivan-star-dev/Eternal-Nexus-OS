import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, BookOpen, FileText, Shield } from "lucide-react";
import WhitepaperDownload from "./WhitepaperDownload";

const ease = [0.16, 1, 0.3, 1] as const;

interface WPSection {
  num: string;
  title: string;
  content: string[];
  highlight?: string;
}

const wpSections: WPSection[] = [
  {
    num: "0",
    title: "Resumo Executivo",
    highlight: "O sistema não substitui infraestruturas existentes (comboios, metro, estradas). Ele complementa, reduz pressão urbana, cria eficiência sistémica e reforça a liderança holandesa em engenharia hídrica, sustentabilidade e planeamento de longo prazo.",
    content: [
      "Este documento propõe a criação de uma infraestrutura subaquática modular, instalada de forma reversível no fundo dos canais holandeses, que funciona como espinha dorsal nacional multifuncional.",
      "O sistema serve simultaneamente: Mobilidade privada de alta velocidade (cápsulas humanas); Logística automatizada de encomendas e bens críticos; Tratamento contínuo, regeneração e monitorização da água dos canais; Recuperação e redistribuição energética; Backbone de sensores, dados e comunicações.",
    ],
  },
  {
    num: "1",
    title: "Contexto Holandês",
    content: [
      "Os Países Baixos possuem uma das redes de canais mais densas e bem mantidas do mundo — mais de 6,500 km de corredores navegáveis que atravessam o país inteiro.",
      "A forte cultura de planeamento hídrico, modularidade e pragmatismo institucional holandês cria o ambiente perfeito para esta inovação. O projeto utiliza canais existentes como corredor, evitando grandes escavações, expropriações, impacto urbano visível e risco político elevado.",
    ],
  },
  {
    num: "2",
    title: "Problemas Atuais",
    content: [
      "Mobilidade: Comboios eficientes mas não privados nem on-demand — saturação em horários críticos. Falta de alternativa premium de alta velocidade.",
      "Logística: Crescimento exponencial de entregas. Dependência de carrinhas e motoristas. Congestionamento urbano e emissões crescentes.",
      "Canais: Tratamento maioritariamente reativo. Qualidade da água variável e inconsistente. Falta de monitorização contínua e distribuída.",
      "Os Países Baixos enfrentam obrigações legais urgentes sob a Water Framework Directive e a sentença KRW 2027.",
    ],
  },
  {
    num: "3",
    title: "O Frame Subaquático Modular",
    highlight: "Um frame estrutural tubular, modular e reversível, ancorado no fundo dos canais com diâmetro de ≈ 1,8–2,2 m em segmentos de 8–12 m.",
    content: [
      "Instalação faseada sem alteração do fluxo da água. O frame não é apenas um túnel — é uma plataforma de serviços integrada que aproveita a infraestrutura existente como corredor.",
      "Materiais: Betão auto-reparável bacteriano (TU Delft), superfície bio-activa Reefy (Coastruction), ancorado por estacas de sucção reversíveis.",
      "Combina cinco funções críticas numa única estrutura soberana.",
    ],
  },
  {
    num: "4",
    title: "Pilar 1 — Mobilidade Privada",
    content: [
      "Cápsulas de 1 a 5 passageiros com espaço para bagagem, bicicleta ou scooter. Cabines de entrada/saída em zonas urbanas. Operação on-demand sem horários fixos.",
      "Velocidade de cruzeiro projectada: até 140 km/h. Aceleração longitudinal ≤ 0,25 g. Assentos com suspensão activa e estabilização.",
      "Rotterdam ↔ Amsterdam: 26–30 minutos porta-a-porta. Zero filas. Zero paragens intermédias forçadas.",
    ],
  },
  {
    num: "5",
    title: "Pilar 2 — Logística Automatizada",
    content: [
      "Corredor logístico dedicado integrado no frame. Cápsulas ou esteiras automatizadas. Operação 24/7 sem motoristas.",
      "Aplicações: encomendas e-commerce, medicamentos, documentos críticos, peças industriais. Integração PostNL e Amazon.",
      "Impacto: redução de carrinhas urbanas, redução de custos logísticos, eliminação de congestionamento.",
    ],
  },
  {
    num: "6",
    title: "Pilar 3 — Regeneração Ambiental",
    highlight: "Alinha com obrigações judiciais 2025 (Greenpeace v. Netherlands — redução de nitrogénio 50% até 2030). Cumpre 100% a Directiva-Quadro da Água (WFD).",
    content: [
      "Sistema distribuído de tratamento: tubulações internas, válvulas inteligentes, sensores contínuos, módulos locais de intervenção.",
      "Recuperação de azoto (15–25% canal N load), fósforo e microplásticos. Monitorização em tempo real da qualidade da água.",
      "Integra-se ao Delta Programme e ao Programa NAPSEA.",
    ],
  },
  {
    num: "7",
    title: "Pilar 4 — Energia Distribuída",
    content: [
      "Recuperação de 65–75% da energia cinética e térmica ao longo da rede. Produção de hidrogénio verde distribuído.",
      "Integração com rede energética nacional. Distribuição de energia ao longo dos corredores dos canais.",
    ],
  },
  {
    num: "8",
    title: "Pilar 5 — Backbone de Dados",
    content: [
      "Rede de sensores distribuída ao longo de 6,500 km de canais. Dados ambientais, estruturais e operacionais em tempo real.",
      "Monitorização contínua de pH, temperatura, N-load, fluxo, integridade estrutural.",
    ],
  },
  {
    num: "9",
    title: "Modelo de Financiamento",
    highlight: "Rijkswaterstaat 40% · National Growth Fund 30% · UE Innovation Fund + Privados 30% · Fundos Stikstof (≈ €25B existentes)",
    content: [
      "Investimento piloto: €180–240 milhões (faseado em 3 anos).",
      "Retorno estimado: redução de €400–600 milhões/ano em custos de tratamento de água + multas UE + logística (Deltares/Rijkswaterstaat 2026).",
      "Payback estimado: 8–12 anos.",
    ],
  },
];

interface WhitepaperViewerProps {
  projectId: string;
  documentName: string;
}

const WhitepaperViewer = ({ projectId, documentName }: WhitepaperViewerProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["0"]));

  const toggleSection = (num: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  };

  const expandAll = () => setExpandedSections(new Set(wpSections.map((s) => s.num)));
  const collapseAll = () => setExpandedSections(new Set());

  return (
    <section className="border-t border-border py-16 md:py-24 px-4 sm:px-6 md:px-16 lg:px-20 bg-card/50">
      <div className="max-w-[1200px] mx-auto">
        <span className="section-label">SECTION 07 · WHITE PAPER</span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
          White <span className="text-primary">Paper</span>{" "}
          <span className="text-muted-foreground font-light italic">v2.0</span>
        </h2>
        <div className="gold-rule mb-4" />
        <p className="font-sans text-sm text-muted-foreground max-w-xl leading-relaxed mb-10">
          Documento técnico completo — navegue as secções abaixo ou descarregue o PDF completo.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Document viewer */}
          <div className="lg:col-span-3">
            <div className="border border-border bg-background overflow-hidden doc-border">
              {/* Doc header */}
              <div className="bg-secondary/60 px-4 sm:px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-mono text-[0.65rem] tracking-[0.12em] text-foreground uppercase font-medium block">
                      Infraestrutura Subaquática Modular
                    </span>
                    <span className="font-mono text-[0.5rem] text-muted-foreground">DSN-WP-2026-002 · CONFIDENTIAL</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={expandAll} className="font-mono text-[0.55rem] tracking-[0.1em] text-primary hover:text-primary/80 transition-colors px-2 py-1 border border-border hover:border-primary/30">
                    EXPAND ALL
                  </button>
                  <button onClick={collapseAll} className="font-mono text-[0.55rem] tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 border border-border">
                    COLLAPSE
                  </button>
                </div>
              </div>

              {/* Sections */}
              <div className="max-h-[700px] overflow-y-auto">
                {wpSections.map((section) => {
                  const isOpen = expandedSections.has(section.num);
                  return (
                    <div key={section.num} className="border-b border-border last:border-b-0">
                      <button
                        onClick={() => toggleSection(section.num)}
                        className="w-full text-left px-4 sm:px-6 py-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors group"
                      >
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                        )}
                        <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary font-medium w-6 flex-shrink-0">
                          {section.num}.
                        </span>
                        <span className={`font-serif text-base sm:text-lg font-semibold transition-colors ${isOpen ? "text-foreground" : "text-foreground/70"}`}>
                          {section.title}
                        </span>
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3, ease }}
                          className="px-4 sm:px-6 pb-6 pl-8 sm:pl-14"
                        >
                          {section.highlight && (
                            <div className="callout-gold mb-5">
                              <p className="font-serif text-sm text-foreground/85 leading-[1.8] italic">{section.highlight}</p>
                            </div>
                          )}
                          {section.content.map((p, i) => (
                            <p key={i} className="font-sans text-sm text-muted-foreground leading-[1.85] mb-3 last:mb-0">
                              {p}
                            </p>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Doc footer */}
              <div className="bg-secondary/40 px-4 sm:px-6 py-3 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-mono text-[0.5rem] tracking-[0.1em] text-muted-foreground">
                  © 2026 IVANILDO MICHEL MONTEIRO FERNANDES · CONFIDENTIAL
                </span>
                <span className="font-mono text-[0.5rem] text-destructive tracking-[0.08em]">
                  ALL DOWNLOADS LOGGED · IP PROTECTED
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Download box */}
            <div className="border border-primary/20 bg-card p-5 doc-border">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-mono text-[0.6rem] tracking-[0.15em] text-primary uppercase font-medium">
                  DOWNLOAD PDF
                </span>
              </div>
              <WhitepaperDownload projectId={projectId} documentName={documentName} />
            </div>

            {/* Key metrics */}
            <div className="border border-border bg-card p-5">
              <span className="font-mono text-[0.55rem] tracking-[0.18em] text-primary uppercase block mb-4 font-medium">KEY METRICS</span>
              {[
                ["Piloto (4 km)", "€180–240M"],
                ["Payback", "8–12 anos"],
                ["Redução N canais", "15–25%"],
                ["Recuperação energética", "65–75%"],
                ["Velocidade cruzeiro", "140 km/h"],
                ["AMS ↔ RTD", "26–30 min"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-baseline py-2 border-b border-border/50 last:border-b-0">
                  <span className="font-mono text-[0.58rem] text-muted-foreground">{k}</span>
                  <span className="font-mono text-[0.65rem] text-teal-light font-medium">{v}</span>
                </div>
              ))}
            </div>

            {/* Classification */}
            <div className="border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-destructive" />
                <span className="font-mono text-[0.55rem] tracking-[0.15em] text-destructive uppercase font-medium">CLASSIFICATION</span>
              </div>
              <p className="font-mono text-[0.56rem] text-destructive/80 leading-relaxed">
                CONFIDENTIAL · Unauthorized reproduction or distribution is prohibited and may result in legal action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhitepaperViewer;
