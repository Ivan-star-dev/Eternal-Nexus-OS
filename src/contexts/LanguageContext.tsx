import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "en" | "pt" | "nl" | "fr" | "de" | "es";

export const languageLabels: Record<Language, string> = {
  en: "English",
  pt: "Português",
  nl: "Nederlands",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
};

export const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  pt: "🇵🇹",
  nl: "🇳🇱",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
};

type TranslationKeys = {
  // Nav
  nav_dossier: string;
  nav_projects: string;
  nav_about: string;
  nav_legal: string;
  nav_login: string;
  nav_secure: string;
  // Banner
  banner_confidential: string;
  banner_division: string;
  banner_restricted: string;
  // Hero
  hero_classified: string;
  hero_portfolio: string;
  hero_description: string;
  hero_rights: string;
  // Stats
  stat_active: string;
  stat_region: string;
  stat_inception: string;
  stat_clearance: string;
  // Sections
  section_01: string;
  active_dossiers: string;
  next_project: string;
  in_development: string;
  pending_classification: string;
  section_02: string;
  methodology: string;
  approach: string;
  // Methodology cards
  conceptual_design: string;
  conceptual_design_desc: string;
  technical_viability: string;
  technical_viability_desc: string;
  institutional_delivery: string;
  institutional_delivery_desc: string;
  // About
  about_personnel: string;
  about_dossier: string;
  about_nationality: string;
  about_age: string;
  about_role: string;
  about_founder: string;
  about_vision: string;
  about_mission: string;
  about_bio_1: string;
  about_bio_2: string;
  about_bio_3: string;
  about_ip: string;
  about_ip_protection: string;
  about_copyright_title: string;
  about_copyright_desc: string;
  about_tracked_title: string;
  about_tracked_desc: string;
  about_international_title: string;
  about_international_desc: string;
  about_prior_art_title: string;
  about_prior_art_desc: string;
  about_warning_title: string;
  about_warning_desc: string;
  // Auth
  auth_title: string;
  auth_subtitle: string;
  auth_register: string;
  auth_login: string;
  auth_email: string;
  auth_password: string;
  auth_full_name: string;
  auth_institution: string;
  auth_country: string;
  auth_position: string;
  auth_department: string;
  auth_submit_register: string;
  auth_submit_login: string;
  auth_switch_login: string;
  auth_switch_register: string;
  // Project notes
  notes_title: string;
  notes_subtitle: string;
  notes_placeholder: string;
  notes_submit: string;
  notes_type_general: string;
  notes_type_interest: string;
  notes_type_feedback: string;
  notes_type_question: string;
  // Download
  download_whitepaper: string;
  download_requires_auth: string;
  download_logged: string;
  // Footer
  footer_navigation: string;
  footer_classification: string;
  footer_legal: string;
  footer_rights: string;
  footer_ip: string;
  // Legal
  privacy_title: string;
  terms_title: string;
  legal_doc: string;
  legal_updated: string;
  // Project page
  back_to_dossier: string;
  executive_summary: string;
  system_architecture: string;
  five_pillars: string;
  end_of_dossier: string;
  return_portfolio: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    nav_dossier: "DOSSIER",
    nav_projects: "PROJECTS",
    nav_about: "ABOUT",
    nav_legal: "LEGAL",
    nav_login: "ACCESS",
    nav_secure: "SECURE",
    banner_confidential: "● CONFIDENTIAL",
    banner_division: "STRATEGIC INFRASTRUCTURE DIVISION",
    banner_restricted: "RESTRICTED ACCESS ●",
    hero_classified: "CLASSIFIED · STRATEGIC INFRASTRUCTURE",
    hero_portfolio: "MEGA-INFRASTRUCTURE DEVELOPMENT PORTFOLIO",
    hero_description: "Conceptual development of national-scale infrastructure systems. Whitepapers, technical dossiers, and strategic proposals for governmental and institutional evaluation.",
    hero_rights: "BY IVANILDO MICHEL MONTEIRO FERNANDES · ALL RIGHTS RESERVED",
    stat_active: "ACTIVE PROJECTS",
    stat_region: "OPERATING REGION",
    stat_inception: "INCEPTION YEAR",
    stat_clearance: "CLEARANCE LEVEL",
    section_01: "SECTION 01",
    active_dossiers: "Active",
    next_project: "NEXT PROJECT",
    in_development: "In Development",
    pending_classification: "PRJ-002 · PENDING CLASSIFICATION",
    section_02: "SECTION 02",
    methodology: "Methodology",
    approach: "& Approach",
    conceptual_design: "Conceptual Design",
    conceptual_design_desc: "Systems-level thinking applied to national infrastructure challenges. Each project begins as a comprehensive whitepaper.",
    technical_viability: "Technical Viability",
    technical_viability_desc: "Rigorous feasibility analysis with real engineering constraints, cost modeling, and environmental impact assessment.",
    institutional_delivery: "Institutional Delivery",
    institutional_delivery_desc: "Professional dossiers formatted for governmental review, complete with visual simulations and investor briefings.",
    about_personnel: "AUTHORIZED PERSONNEL ONLY",
    about_dossier: "DOSSIER · PRINCIPAL",
    about_nationality: "NATIONALITY",
    about_age: "AGE",
    about_role: "ROLE",
    about_founder: "FOUNDER & PRINCIPAL ARCHITECT",
    about_vision: "Vision",
    about_mission: "& Mission",
    about_bio_1: "Ivanildo Michel Monteiro Fernandes is a visionary infrastructure strategist and conceptual architect from Cape Verde, dedicated to developing transformative national-scale infrastructure systems that address the most critical challenges of modern civilization.",
    about_bio_2: "Through NEXT PATH INFRA, he creates comprehensive whitepapers, technical dossiers, and strategic proposals designed for evaluation by governmental bodies, institutional investors, and sovereign development funds worldwide.",
    about_bio_3: "Each concept undergoes rigorous feasibility analysis with real engineering constraints, cost modeling, environmental impact assessment, and phased deployment strategies — delivering institutional-grade documentation ready for governmental review.",
    about_ip: "Intellectual Property",
    about_ip_protection: "Protection",
    about_copyright_title: "Full Copyright Protection",
    about_copyright_desc: "All conceptual designs, whitepapers, technical specifications, and strategic proposals are fully copyrighted and registered under the name of Ivanildo Michel Monteiro Fernandes. Any unauthorized use, reproduction, or implementation is strictly prohibited and subject to legal action.",
    about_tracked_title: "Tracked & Traceable",
    about_tracked_desc: "Every document download, access, and interaction within this platform is monitored, logged, and timestamped. Digital fingerprinting ensures full traceability of all distributed materials, creating an unbreakable chain of custody.",
    about_international_title: "International Protection",
    about_international_desc: "Intellectual property rights are enforced under international copyright law, including the Berne Convention and WIPO treaties. Protection extends across all jurisdictions where these concepts may be implemented.",
    about_prior_art_title: "Prior Art Establishment",
    about_prior_art_desc: "All published materials on this platform serve as timestamped evidence of prior art, establishing undisputable authorship and creation dates. This ensures that any future implementation without authorization can be legally challenged.",
    about_warning_title: "⚠ WARNING — INTELLECTUAL PROPERTY NOTICE",
    about_warning_desc: "All infrastructure concepts, designs, and documentation presented on this platform are the exclusive intellectual property of Ivanildo Michel Monteiro Fernandes. Any attempt to implement, reproduce, distribute, or derive work from these materials without explicit written authorization will be met with full legal prosecution under applicable national and international law. All access is logged and traceable.",
    auth_title: "Government",
    auth_subtitle: "Access Portal",
    auth_register: "Register",
    auth_login: "Login",
    auth_email: "Official Email",
    auth_password: "Password",
    auth_full_name: "Full Name",
    auth_institution: "Government Institution",
    auth_country: "Country",
    auth_position: "Position / Title",
    auth_department: "Department (optional)",
    auth_submit_register: "REQUEST ACCESS",
    auth_submit_login: "AUTHENTICATE",
    auth_switch_login: "Already have access? Login",
    auth_switch_register: "Request government access",
    notes_title: "Government",
    notes_subtitle: "Notes & Feedback",
    notes_placeholder: "Leave your institutional feedback, interest, or questions about this project...",
    notes_submit: "SUBMIT NOTE",
    notes_type_general: "General",
    notes_type_interest: "Interest",
    notes_type_feedback: "Feedback",
    notes_type_question: "Question",
    download_whitepaper: "DOWNLOAD WHITEPAPER",
    download_requires_auth: "Government authentication required to download classified documents.",
    download_logged: "Download registered and tracked.",
    footer_navigation: "Navigation",
    footer_classification: "Classification",
    footer_legal: "Legal",
    footer_rights: "ALL RIGHTS RESERVED",
    footer_ip: "IP PROTECTED",
    privacy_title: "Privacy",
    terms_title: "Terms",
    legal_doc: "LEGAL DOCUMENTATION",
    legal_updated: "LAST UPDATED: MARCH 2026 · NEXT PATH INFRA · ALL RIGHTS RESERVED",
    back_to_dossier: "← BACK TO DOSSIER",
    executive_summary: "Executive",
    system_architecture: "SYSTEM ARCHITECTURE",
    five_pillars: "Five",
    end_of_dossier: "END OF DOSSIER",
    return_portfolio: "← RETURN TO PORTFOLIO",
  },
  pt: {
    nav_dossier: "DOSSIÊ",
    nav_projects: "PROJETOS",
    nav_about: "SOBRE",
    nav_legal: "LEGAL",
    nav_login: "ACESSO",
    nav_secure: "SEGURO",
    banner_confidential: "● CONFIDENCIAL",
    banner_division: "DIVISÃO DE INFRAESTRUTURA ESTRATÉGICA",
    banner_restricted: "ACESSO RESTRITO ●",
    hero_classified: "CLASSIFICADO · INFRAESTRUTURA ESTRATÉGICA",
    hero_portfolio: "PORTFÓLIO DE DESENVOLVIMENTO DE MEGA-INFRAESTRUTURAS",
    hero_description: "Desenvolvimento conceitual de sistemas de infraestrutura à escala nacional. Whitepapers, dossiês técnicos e propostas estratégicas para avaliação governamental e institucional.",
    hero_rights: "POR IVANILDO MICHEL MONTEIRO FERNANDES · TODOS OS DIREITOS RESERVADOS",
    stat_active: "PROJETOS ATIVOS",
    stat_region: "REGIÃO OPERACIONAL",
    stat_inception: "ANO DE INÍCIO",
    stat_clearance: "NÍVEL DE ACESSO",
    section_01: "SECÇÃO 01",
    active_dossiers: "Dossiês",
    next_project: "PRÓXIMO PROJETO",
    in_development: "Em Desenvolvimento",
    pending_classification: "PRJ-002 · CLASSIFICAÇÃO PENDENTE",
    section_02: "SECÇÃO 02",
    methodology: "Metodologia",
    approach: "& Abordagem",
    conceptual_design: "Design Conceitual",
    conceptual_design_desc: "Pensamento sistêmico aplicado a desafios de infraestrutura nacional. Cada projeto começa como um whitepaper abrangente.",
    technical_viability: "Viabilidade Técnica",
    technical_viability_desc: "Análise rigorosa de viabilidade com restrições reais de engenharia, modelagem de custos e avaliação de impacto ambiental.",
    institutional_delivery: "Entrega Institucional",
    institutional_delivery_desc: "Dossiês profissionais formatados para revisão governamental, com simulações visuais e briefings para investidores.",
    about_personnel: "APENAS PESSOAL AUTORIZADO",
    about_dossier: "DOSSIÊ · PRINCIPAL",
    about_nationality: "NACIONALIDADE",
    about_age: "IDADE",
    about_role: "FUNÇÃO",
    about_founder: "FUNDADOR E ARQUITETO PRINCIPAL",
    about_vision: "Visão",
    about_mission: "& Missão",
    about_bio_1: "Ivanildo Michel Monteiro Fernandes é um estrategista visionário de infraestruturas e arquiteto conceitual de Cabo Verde, dedicado a desenvolver sistemas de infraestrutura transformadores à escala nacional que abordam os desafios mais críticos da civilização moderna.",
    about_bio_2: "Através da NEXT PATH INFRA, cria whitepapers abrangentes, dossiês técnicos e propostas estratégicas concebidas para avaliação por órgãos governamentais, investidores institucionais e fundos soberanos de desenvolvimento em todo o mundo.",
    about_bio_3: "Cada conceito passa por uma análise rigorosa de viabilidade com restrições reais de engenharia, modelagem de custos, avaliação de impacto ambiental e estratégias de implantação faseada — entregando documentação de nível institucional pronta para revisão governamental.",
    about_ip: "Propriedade Intelectual",
    about_ip_protection: "Proteção",
    about_copyright_title: "Proteção Total de Direitos Autorais",
    about_copyright_desc: "Todos os designs conceituais, whitepapers, especificações técnicas e propostas estratégicas estão totalmente protegidos por direitos autorais e registrados em nome de Ivanildo Michel Monteiro Fernandes. Qualquer uso, reprodução ou implementação não autorizada é estritamente proibida e sujeita a ação legal.",
    about_tracked_title: "Rastreado e Rastreável",
    about_tracked_desc: "Cada download de documento, acesso e interação dentro desta plataforma é monitorado, registrado e com carimbo de data/hora. A impressão digital garante total rastreabilidade de todos os materiais distribuídos.",
    about_international_title: "Proteção Internacional",
    about_international_desc: "Os direitos de propriedade intelectual são aplicados sob a lei internacional de direitos autorais, incluindo a Convenção de Berna e os tratados da OMPI. A proteção se estende a todas as jurisdições onde esses conceitos possam ser implementados.",
    about_prior_art_title: "Estabelecimento de Arte Prévia",
    about_prior_art_desc: "Todos os materiais publicados nesta plataforma servem como evidência com carimbo de data/hora de arte prévia, estabelecendo autoria e datas de criação indiscutíveis.",
    about_warning_title: "⚠ AVISO — NOTIFICAÇÃO DE PROPRIEDADE INTELECTUAL",
    about_warning_desc: "Todos os conceitos de infraestrutura, designs e documentação apresentados nesta plataforma são propriedade intelectual exclusiva de Ivanildo Michel Monteiro Fernandes. Qualquer tentativa de implementar, reproduzir, distribuir ou derivar trabalho destes materiais sem autorização explícita por escrito será enfrentada com processo legal completo. Todo o acesso é registrado e rastreável.",
    auth_title: "Portal de",
    auth_subtitle: "Acesso Governamental",
    auth_register: "Registar",
    auth_login: "Entrar",
    auth_email: "Email Oficial",
    auth_password: "Palavra-passe",
    auth_full_name: "Nome Completo",
    auth_institution: "Instituição Governamental",
    auth_country: "País",
    auth_position: "Cargo / Título",
    auth_department: "Departamento (opcional)",
    auth_submit_register: "SOLICITAR ACESSO",
    auth_submit_login: "AUTENTICAR",
    auth_switch_login: "Já tem acesso? Entrar",
    auth_switch_register: "Solicitar acesso governamental",
    notes_title: "Notas",
    notes_subtitle: "& Feedback Governamental",
    notes_placeholder: "Deixe o seu feedback institucional, interesse ou perguntas sobre este projeto...",
    notes_submit: "ENVIAR NOTA",
    notes_type_general: "Geral",
    notes_type_interest: "Interesse",
    notes_type_feedback: "Feedback",
    notes_type_question: "Pergunta",
    download_whitepaper: "DESCARREGAR WHITEPAPER",
    download_requires_auth: "Autenticação governamental necessária para descarregar documentos classificados.",
    download_logged: "Download registado e rastreado.",
    footer_navigation: "Navegação",
    footer_classification: "Classificação",
    footer_legal: "Legal",
    footer_rights: "TODOS OS DIREITOS RESERVADOS",
    footer_ip: "PI PROTEGIDA",
    privacy_title: "Privacidade",
    terms_title: "Termos",
    legal_doc: "DOCUMENTAÇÃO LEGAL",
    legal_updated: "ÚLTIMA ATUALIZAÇÃO: MARÇO 2026 · NEXT PATH INFRA · TODOS OS DIREITOS RESERVADOS",
    back_to_dossier: "← VOLTAR AO DOSSIÊ",
    executive_summary: "Resumo",
    system_architecture: "ARQUITETURA DO SISTEMA",
    five_pillars: "Cinco",
    end_of_dossier: "FIM DO DOSSIÊ",
    return_portfolio: "← VOLTAR AO PORTFÓLIO",
  },
  nl: {
    nav_dossier: "DOSSIER",
    nav_projects: "PROJECTEN",
    nav_about: "OVER",
    nav_legal: "JURIDISCH",
    nav_login: "TOEGANG",
    nav_secure: "BEVEILIGD",
    banner_confidential: "● VERTROUWELIJK",
    banner_division: "STRATEGISCHE INFRASTRUCTUUR DIVISIE",
    banner_restricted: "BEPERKTE TOEGANG ●",
    hero_classified: "GECLASSIFICEERD · STRATEGISCHE INFRASTRUCTUUR",
    hero_portfolio: "MEGA-INFRASTRUCTUUR ONTWIKKELINGSPORTFOLIO",
    hero_description: "Conceptuele ontwikkeling van nationale infrastructuursystemen. Whitepapers, technische dossiers en strategische voorstellen voor overheids- en institutionele evaluatie.",
    hero_rights: "DOOR IVANILDO MICHEL MONTEIRO FERNANDES · ALLE RECHTEN VOORBEHOUDEN",
    stat_active: "ACTIEVE PROJECTEN",
    stat_region: "OPERATIONELE REGIO",
    stat_inception: "STARTJAAR",
    stat_clearance: "TOEGANGSNIVEAU",
    section_01: "SECTIE 01",
    active_dossiers: "Actieve",
    next_project: "VOLGEND PROJECT",
    in_development: "In Ontwikkeling",
    pending_classification: "PRJ-002 · CLASSIFICATIE LOPEND",
    section_02: "SECTIE 02",
    methodology: "Methodologie",
    approach: "& Aanpak",
    conceptual_design: "Conceptueel Ontwerp",
    conceptual_design_desc: "Systeemdenken toegepast op nationale infrastructuuruitdagingen. Elk project begint als een uitgebreid whitepaper.",
    technical_viability: "Technische Haalbaarheid",
    technical_viability_desc: "Rigoureuze haalbaarheidsanalyse met echte technische beperkingen, kostenmodellering en milieueffectbeoordeling.",
    institutional_delivery: "Institutionele Oplevering",
    institutional_delivery_desc: "Professionele dossiers opgemaakt voor overheidsbeoordeling, compleet met visuele simulaties en investeerdersbriefings.",
    about_personnel: "ALLEEN BEVOEGD PERSONEEL",
    about_dossier: "DOSSIER · PRINCIPAAL",
    about_nationality: "NATIONALITEIT",
    about_age: "LEEFTIJD",
    about_role: "ROL",
    about_founder: "OPRICHTER & HOOFDARCHITECT",
    about_vision: "Visie",
    about_mission: "& Missie",
    about_bio_1: "Ivanildo Michel Monteiro Fernandes is een visionair infrastructuurstrateeg en conceptueel architect uit Kaapverdië, toegewijd aan het ontwikkelen van transformatieve infrastructuursystemen op nationale schaal.",
    about_bio_2: "Via NEXT PATH INFRA creëert hij uitgebreide whitepapers, technische dossiers en strategische voorstellen ontworpen voor evaluatie door overheidsorganen en soevereine ontwikkelingsfondsen wereldwijd.",
    about_bio_3: "Elk concept ondergaat rigoureuze haalbaarheidsanalyse met echte technische beperkingen, kostenmodellering en milieueffectbeoordeling.",
    about_ip: "Intellectueel Eigendom",
    about_ip_protection: "Bescherming",
    about_copyright_title: "Volledige Auteursrechtbescherming",
    about_copyright_desc: "Alle conceptuele ontwerpen en whitepapers zijn volledig auteursrechtelijk beschermd en geregistreerd op naam van Ivanildo Michel Monteiro Fernandes.",
    about_tracked_title: "Gevolgd & Traceerbaar",
    about_tracked_desc: "Elke documentdownload en interactie wordt gemonitord, gelogd en voorzien van tijdstempel.",
    about_international_title: "Internationale Bescherming",
    about_international_desc: "Intellectuele eigendomsrechten worden gehandhaafd onder internationaal auteursrecht, inclusief de Conventie van Bern.",
    about_prior_art_title: "Prior Art Vaststelling",
    about_prior_art_desc: "Alle gepubliceerde materialen dienen als bewijs met tijdstempel van prior art.",
    about_warning_title: "⚠ WAARSCHUWING — INTELLECTUEEL EIGENDOM",
    about_warning_desc: "Alle infrastructuurconcepten zijn exclusief eigendom van Ivanildo Michel Monteiro Fernandes. Ongeautoriseerd gebruik wordt juridisch vervolgd.",
    auth_title: "Overheids",
    auth_subtitle: "Toegangsportaal",
    auth_register: "Registreren",
    auth_login: "Inloggen",
    auth_email: "Officieel E-mail",
    auth_password: "Wachtwoord",
    auth_full_name: "Volledige Naam",
    auth_institution: "Overheidsinstelling",
    auth_country: "Land",
    auth_position: "Positie / Titel",
    auth_department: "Afdeling (optioneel)",
    auth_submit_register: "TOEGANG AANVRAGEN",
    auth_submit_login: "AUTHENTICEREN",
    auth_switch_login: "Al toegang? Inloggen",
    auth_switch_register: "Overheidstoegang aanvragen",
    notes_title: "Overheids",
    notes_subtitle: "Notities & Feedback",
    notes_placeholder: "Laat uw institutionele feedback of vragen achter...",
    notes_submit: "NOTITIE INDIENEN",
    notes_type_general: "Algemeen",
    notes_type_interest: "Interesse",
    notes_type_feedback: "Feedback",
    notes_type_question: "Vraag",
    download_whitepaper: "WHITEPAPER DOWNLOADEN",
    download_requires_auth: "Overheidsauthenticatie vereist voor geclassificeerde documenten.",
    download_logged: "Download geregistreerd en gevolgd.",
    footer_navigation: "Navigatie",
    footer_classification: "Classificatie",
    footer_legal: "Juridisch",
    footer_rights: "ALLE RECHTEN VOORBEHOUDEN",
    footer_ip: "IE BESCHERMD",
    privacy_title: "Privacy",
    terms_title: "Voorwaarden",
    legal_doc: "JURIDISCHE DOCUMENTATIE",
    legal_updated: "LAATST BIJGEWERKT: MAART 2026 · NEXT PATH INFRA · ALLE RECHTEN VOORBEHOUDEN",
    back_to_dossier: "← TERUG NAAR DOSSIER",
    executive_summary: "Samenvatting",
    system_architecture: "SYSTEEMARCHITECTUUR",
    five_pillars: "Vijf",
    end_of_dossier: "EINDE DOSSIER",
    return_portfolio: "← TERUG NAAR PORTFOLIO",
  },
  fr: {
    nav_dossier: "DOSSIER",
    nav_projects: "PROJETS",
    nav_about: "À PROPOS",
    nav_legal: "JURIDIQUE",
    nav_login: "ACCÈS",
    nav_secure: "SÉCURISÉ",
    banner_confidential: "● CONFIDENTIEL",
    banner_division: "DIVISION INFRASTRUCTURE STRATÉGIQUE",
    banner_restricted: "ACCÈS RESTREINT ●",
    hero_classified: "CLASSIFIÉ · INFRASTRUCTURE STRATÉGIQUE",
    hero_portfolio: "PORTFOLIO DE DÉVELOPPEMENT DE MÉGA-INFRASTRUCTURES",
    hero_description: "Développement conceptuel de systèmes d'infrastructure à l'échelle nationale. Livres blancs, dossiers techniques et propositions stratégiques pour évaluation gouvernementale.",
    hero_rights: "PAR IVANILDO MICHEL MONTEIRO FERNANDES · TOUS DROITS RÉSERVÉS",
    stat_active: "PROJETS ACTIFS",
    stat_region: "RÉGION OPÉRATIONNELLE",
    stat_inception: "ANNÉE DE CRÉATION",
    stat_clearance: "NIVEAU D'ACCÈS",
    section_01: "SECTION 01",
    active_dossiers: "Dossiers",
    next_project: "PROCHAIN PROJET",
    in_development: "En Développement",
    pending_classification: "PRJ-002 · CLASSIFICATION EN COURS",
    section_02: "SECTION 02",
    methodology: "Méthodologie",
    approach: "& Approche",
    conceptual_design: "Conception Conceptuelle",
    conceptual_design_desc: "Pensée systémique appliquée aux défis d'infrastructure nationale. Chaque projet commence par un livre blanc complet.",
    technical_viability: "Viabilité Technique",
    technical_viability_desc: "Analyse de faisabilité rigoureuse avec contraintes d'ingénierie réelles, modélisation des coûts et évaluation d'impact environnemental.",
    institutional_delivery: "Livraison Institutionnelle",
    institutional_delivery_desc: "Dossiers professionnels formatés pour examen gouvernemental, avec simulations visuelles et briefings investisseurs.",
    about_personnel: "PERSONNEL AUTORISÉ UNIQUEMENT",
    about_dossier: "DOSSIER · PRINCIPAL",
    about_nationality: "NATIONALITÉ",
    about_age: "ÂGE",
    about_role: "RÔLE",
    about_founder: "FONDATEUR & ARCHITECTE PRINCIPAL",
    about_vision: "Vision",
    about_mission: "& Mission",
    about_bio_1: "Ivanildo Michel Monteiro Fernandes est un stratège visionnaire en infrastructure et architecte conceptuel du Cap-Vert, dédié au développement de systèmes d'infrastructure transformateurs à l'échelle nationale.",
    about_bio_2: "À travers NEXT PATH INFRA, il crée des livres blancs complets, des dossiers techniques et des propositions stratégiques conçues pour évaluation par les organismes gouvernementaux.",
    about_bio_3: "Chaque concept fait l'objet d'une analyse de faisabilité rigoureuse avec des contraintes d'ingénierie réelles.",
    about_ip: "Propriété Intellectuelle",
    about_ip_protection: "Protection",
    about_copyright_title: "Protection Totale du Droit d'Auteur",
    about_copyright_desc: "Tous les designs conceptuels et livres blancs sont entièrement protégés par le droit d'auteur au nom d'Ivanildo Michel Monteiro Fernandes.",
    about_tracked_title: "Suivi & Traçable",
    about_tracked_desc: "Chaque téléchargement et interaction est surveillé, enregistré et horodaté.",
    about_international_title: "Protection Internationale",
    about_international_desc: "Les droits de propriété intellectuelle sont appliqués en vertu du droit d'auteur international, y compris la Convention de Berne.",
    about_prior_art_title: "Établissement d'Antériorité",
    about_prior_art_desc: "Tous les matériaux publiés servent de preuve horodatée d'antériorité.",
    about_warning_title: "⚠ AVERTISSEMENT — PROPRIÉTÉ INTELLECTUELLE",
    about_warning_desc: "Tous les concepts d'infrastructure sont la propriété exclusive d'Ivanildo Michel Monteiro Fernandes. Tout usage non autorisé fera l'objet de poursuites judiciaires.",
    auth_title: "Portail d'",
    auth_subtitle: "Accès Gouvernemental",
    auth_register: "S'inscrire",
    auth_login: "Connexion",
    auth_email: "Email Officiel",
    auth_password: "Mot de passe",
    auth_full_name: "Nom Complet",
    auth_institution: "Institution Gouvernementale",
    auth_country: "Pays",
    auth_position: "Poste / Titre",
    auth_department: "Département (optionnel)",
    auth_submit_register: "DEMANDER L'ACCÈS",
    auth_submit_login: "S'AUTHENTIFIER",
    auth_switch_login: "Déjà accès? Connexion",
    auth_switch_register: "Demander l'accès gouvernemental",
    notes_title: "Notes",
    notes_subtitle: "& Retours Gouvernementaux",
    notes_placeholder: "Laissez vos retours institutionnels ou questions sur ce projet...",
    notes_submit: "SOUMETTRE NOTE",
    notes_type_general: "Général",
    notes_type_interest: "Intérêt",
    notes_type_feedback: "Retour",
    notes_type_question: "Question",
    download_whitepaper: "TÉLÉCHARGER LE LIVRE BLANC",
    download_requires_auth: "Authentification gouvernementale requise pour télécharger les documents classifiés.",
    download_logged: "Téléchargement enregistré et suivi.",
    footer_navigation: "Navigation",
    footer_classification: "Classification",
    footer_legal: "Juridique",
    footer_rights: "TOUS DROITS RÉSERVÉS",
    footer_ip: "PI PROTÉGÉE",
    privacy_title: "Confidentialité",
    terms_title: "Conditions",
    legal_doc: "DOCUMENTATION JURIDIQUE",
    legal_updated: "DERNIÈRE MISE À JOUR: MARS 2026 · NEXT PATH INFRA · TOUS DROITS RÉSERVÉS",
    back_to_dossier: "← RETOUR AU DOSSIER",
    executive_summary: "Résumé",
    system_architecture: "ARCHITECTURE SYSTÈME",
    five_pillars: "Cinq",
    end_of_dossier: "FIN DU DOSSIER",
    return_portfolio: "← RETOUR AU PORTFOLIO",
  },
  de: {
    nav_dossier: "DOSSIER",
    nav_projects: "PROJEKTE",
    nav_about: "ÜBER UNS",
    nav_legal: "RECHTLICHES",
    nav_login: "ZUGANG",
    nav_secure: "SICHER",
    banner_confidential: "● VERTRAULICH",
    banner_division: "STRATEGISCHE INFRASTRUKTUR ABTEILUNG",
    banner_restricted: "EINGESCHRÄNKTER ZUGANG ●",
    hero_classified: "EINGESTUFT · STRATEGISCHE INFRASTRUKTUR",
    hero_portfolio: "MEGA-INFRASTRUKTUR ENTWICKLUNGSPORTFOLIO",
    hero_description: "Konzeptentwicklung nationaler Infrastruktursysteme. Whitepaper, technische Dossiers und strategische Vorschläge zur Bewertung durch Regierung und Institutionen.",
    hero_rights: "VON IVANILDO MICHEL MONTEIRO FERNANDES · ALLE RECHTE VORBEHALTEN",
    stat_active: "AKTIVE PROJEKTE",
    stat_region: "EINSATZREGION",
    stat_inception: "GRÜNDUNGSJAHR",
    stat_clearance: "ZUGANGSSTUFE",
    section_01: "ABSCHNITT 01",
    active_dossiers: "Aktive",
    next_project: "NÄCHSTES PROJEKT",
    in_development: "In Entwicklung",
    pending_classification: "PRJ-002 · KLASSIFIZIERUNG AUSSTEHEND",
    section_02: "ABSCHNITT 02",
    methodology: "Methodik",
    approach: "& Ansatz",
    conceptual_design: "Konzeptionelles Design",
    conceptual_design_desc: "Systemdenken angewandt auf nationale Infrastrukturherausforderungen.",
    technical_viability: "Technische Machbarkeit",
    technical_viability_desc: "Rigorose Machbarkeitsanalyse mit realen Ingenieursbeschränkungen und Kostenmodellierung.",
    institutional_delivery: "Institutionelle Lieferung",
    institutional_delivery_desc: "Professionelle Dossiers für die Regierungsprüfung, mit visuellen Simulationen.",
    about_personnel: "NUR BEFUGTES PERSONAL",
    about_dossier: "DOSSIER · PRINZIPAL",
    about_nationality: "STAATSANGEHÖRIGKEIT",
    about_age: "ALTER",
    about_role: "ROLLE",
    about_founder: "GRÜNDER & HAUPTARCHITEKT",
    about_vision: "Vision",
    about_mission: "& Mission",
    about_bio_1: "Ivanildo Michel Monteiro Fernandes ist ein visionärer Infrastrukturstratege und konzeptioneller Architekt aus Kap Verde.",
    about_bio_2: "Durch NEXT PATH INFRA erstellt er umfassende Whitepaper, technische Dossiers und strategische Vorschläge.",
    about_bio_3: "Jedes Konzept durchläuft eine rigorose Machbarkeitsanalyse.",
    about_ip: "Geistiges Eigentum",
    about_ip_protection: "Schutz",
    about_copyright_title: "Vollständiger Urheberrechtsschutz",
    about_copyright_desc: "Alle Entwürfe sind urheberrechtlich geschützt und auf den Namen Ivanildo Michel Monteiro Fernandes registriert.",
    about_tracked_title: "Verfolgt & Nachverfolgbar",
    about_tracked_desc: "Jeder Download und jede Interaktion wird überwacht und protokolliert.",
    about_international_title: "Internationaler Schutz",
    about_international_desc: "Geistige Eigentumsrechte gemäß internationalem Urheberrecht geschützt.",
    about_prior_art_title: "Stand der Technik Etablierung",
    about_prior_art_desc: "Alle veröffentlichten Materialien dienen als zeitgestempelter Nachweis.",
    about_warning_title: "⚠ WARNUNG — GEISTIGES EIGENTUM",
    about_warning_desc: "Alle Infrastrukturkonzepte sind exklusives Eigentum von Ivanildo Michel Monteiro Fernandes. Unbefugte Nutzung wird strafrechtlich verfolgt.",
    auth_title: "Regierungs",
    auth_subtitle: "Zugangsportal",
    auth_register: "Registrieren",
    auth_login: "Anmelden",
    auth_email: "Offizielle E-Mail",
    auth_password: "Passwort",
    auth_full_name: "Vollständiger Name",
    auth_institution: "Regierungsinstitution",
    auth_country: "Land",
    auth_position: "Position / Titel",
    auth_department: "Abteilung (optional)",
    auth_submit_register: "ZUGANG BEANTRAGEN",
    auth_submit_login: "AUTHENTIFIZIEREN",
    auth_switch_login: "Bereits Zugang? Anmelden",
    auth_switch_register: "Regierungszugang beantragen",
    notes_title: "Regierungs",
    notes_subtitle: "Notizen & Feedback",
    notes_placeholder: "Hinterlassen Sie Ihr institutionelles Feedback...",
    notes_submit: "NOTIZ EINREICHEN",
    notes_type_general: "Allgemein",
    notes_type_interest: "Interesse",
    notes_type_feedback: "Feedback",
    notes_type_question: "Frage",
    download_whitepaper: "WHITEPAPER HERUNTERLADEN",
    download_requires_auth: "Regierungsauthentifizierung erforderlich.",
    download_logged: "Download registriert und verfolgt.",
    footer_navigation: "Navigation",
    footer_classification: "Klassifizierung",
    footer_legal: "Rechtliches",
    footer_rights: "ALLE RECHTE VORBEHALTEN",
    footer_ip: "IP GESCHÜTZT",
    privacy_title: "Datenschutz",
    terms_title: "Nutzungsbedingungen",
    legal_doc: "RECHTLICHE DOKUMENTATION",
    legal_updated: "LETZTE AKTUALISIERUNG: MÄRZ 2026 · NEXT PATH INFRA · ALLE RECHTE VORBEHALTEN",
    back_to_dossier: "← ZURÜCK ZUM DOSSIER",
    executive_summary: "Zusammenfassung",
    system_architecture: "SYSTEMARCHITEKTUR",
    five_pillars: "Fünf",
    end_of_dossier: "ENDE DES DOSSIERS",
    return_portfolio: "← ZURÜCK ZUM PORTFOLIO",
  },
  es: {
    nav_dossier: "DOSIER",
    nav_projects: "PROYECTOS",
    nav_about: "ACERCA DE",
    nav_legal: "LEGAL",
    nav_login: "ACCESO",
    nav_secure: "SEGURO",
    banner_confidential: "● CONFIDENCIAL",
    banner_division: "DIVISIÓN DE INFRAESTRUCTURA ESTRATÉGICA",
    banner_restricted: "ACCESO RESTRINGIDO ●",
    hero_classified: "CLASIFICADO · INFRAESTRUCTURA ESTRATÉGICA",
    hero_portfolio: "PORTAFOLIO DE DESARROLLO DE MEGA-INFRAESTRUCTURAS",
    hero_description: "Desarrollo conceptual de sistemas de infraestructura a escala nacional. Libros blancos, dossieres técnicos y propuestas estratégicas para evaluación gubernamental.",
    hero_rights: "POR IVANILDO MICHEL MONTEIRO FERNANDES · TODOS LOS DERECHOS RESERVADOS",
    stat_active: "PROYECTOS ACTIVOS",
    stat_region: "REGIÓN OPERATIVA",
    stat_inception: "AÑO DE INICIO",
    stat_clearance: "NIVEL DE ACCESO",
    section_01: "SECCIÓN 01",
    active_dossiers: "Dosieres",
    next_project: "PRÓXIMO PROYECTO",
    in_development: "En Desarrollo",
    pending_classification: "PRJ-002 · CLASIFICACIÓN PENDIENTE",
    section_02: "SECCIÓN 02",
    methodology: "Metodología",
    approach: "& Enfoque",
    conceptual_design: "Diseño Conceptual",
    conceptual_design_desc: "Pensamiento sistémico aplicado a desafíos de infraestructura nacional.",
    technical_viability: "Viabilidad Técnica",
    technical_viability_desc: "Análisis riguroso de viabilidad con restricciones de ingeniería reales y modelado de costos.",
    institutional_delivery: "Entrega Institucional",
    institutional_delivery_desc: "Dossieres profesionales formateados para revisión gubernamental.",
    about_personnel: "SOLO PERSONAL AUTORIZADO",
    about_dossier: "DOSIER · PRINCIPAL",
    about_nationality: "NACIONALIDAD",
    about_age: "EDAD",
    about_role: "ROL",
    about_founder: "FUNDADOR Y ARQUITECTO PRINCIPAL",
    about_vision: "Visión",
    about_mission: "& Misión",
    about_bio_1: "Ivanildo Michel Monteiro Fernandes es un estratega visionario de infraestructura y arquitecto conceptual de Cabo Verde.",
    about_bio_2: "A través de NEXT PATH INFRA, crea libros blancos integrales, dossieres técnicos y propuestas estratégicas.",
    about_bio_3: "Cada concepto pasa por un análisis riguroso de viabilidad.",
    about_ip: "Propiedad Intelectual",
    about_ip_protection: "Protección",
    about_copyright_title: "Protección Total de Derechos de Autor",
    about_copyright_desc: "Todos los diseños conceptuales están protegidos por derechos de autor a nombre de Ivanildo Michel Monteiro Fernandes.",
    about_tracked_title: "Rastreado y Trazable",
    about_tracked_desc: "Cada descarga e interacción es monitoreada y registrada.",
    about_international_title: "Protección Internacional",
    about_international_desc: "Derechos de propiedad intelectual aplicados bajo ley internacional de derechos de autor.",
    about_prior_art_title: "Establecimiento de Arte Previo",
    about_prior_art_desc: "Todos los materiales publicados sirven como evidencia con marca de tiempo.",
    about_warning_title: "⚠ ADVERTENCIA — PROPIEDAD INTELECTUAL",
    about_warning_desc: "Todos los conceptos de infraestructura son propiedad exclusiva de Ivanildo Michel Monteiro Fernandes. El uso no autorizado será procesado legalmente.",
    auth_title: "Portal de",
    auth_subtitle: "Acceso Gubernamental",
    auth_register: "Registrarse",
    auth_login: "Iniciar Sesión",
    auth_email: "Correo Oficial",
    auth_password: "Contraseña",
    auth_full_name: "Nombre Completo",
    auth_institution: "Institución Gubernamental",
    auth_country: "País",
    auth_position: "Cargo / Título",
    auth_department: "Departamento (opcional)",
    auth_submit_register: "SOLICITAR ACCESO",
    auth_submit_login: "AUTENTICAR",
    auth_switch_login: "¿Ya tiene acceso? Iniciar sesión",
    auth_switch_register: "Solicitar acceso gubernamental",
    notes_title: "Notas",
    notes_subtitle: "& Retroalimentación Gubernamental",
    notes_placeholder: "Deje su retroalimentación institucional o preguntas...",
    notes_submit: "ENVIAR NOTA",
    notes_type_general: "General",
    notes_type_interest: "Interés",
    notes_type_feedback: "Retroalimentación",
    notes_type_question: "Pregunta",
    download_whitepaper: "DESCARGAR LIBRO BLANCO",
    download_requires_auth: "Autenticación gubernamental requerida.",
    download_logged: "Descarga registrada y rastreada.",
    footer_navigation: "Navegación",
    footer_classification: "Clasificación",
    footer_legal: "Legal",
    footer_rights: "TODOS LOS DERECHOS RESERVADOS",
    footer_ip: "PI PROTEGIDA",
    privacy_title: "Privacidad",
    terms_title: "Términos",
    legal_doc: "DOCUMENTACIÓN LEGAL",
    legal_updated: "ÚLTIMA ACTUALIZACIÓN: MARZO 2026 · NEXT PATH INFRA · TODOS LOS DERECHOS RESERVADOS",
    back_to_dossier: "← VOLVER AL DOSIER",
    executive_summary: "Resumen",
    system_architecture: "ARQUITECTURA DEL SISTEMA",
    five_pillars: "Cinco",
    end_of_dossier: "FIN DEL DOSIER",
    return_portfolio: "← VOLVER AL PORTAFOLIO",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("nextpath-lang");
    return (saved as Language) || "en";
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("nextpath-lang", lang);
  }, []);

  const t = useCallback(
    (key: keyof TranslationKeys) => translations[language][key] || translations.en[key] || key,
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
