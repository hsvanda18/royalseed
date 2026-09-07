/**
 * Every figure and claim below comes from the client's "Perfil Institucional
 * da Empresa". Nothing here is invented. Values marked `derived` are simple
 * arithmetic on two stated figures and are labelled as derivations on screen;
 * values marked `estimate` carry that word wherever they appear.
 */

export type Lang = "pt" | "en";

export const LANGS: Lang[] = ["pt", "en"];

/* ── Facts. Language-independent. ───────────────────────────────────────── */

export const FACTS = {
  landBaseHa: 2120,
  phaseOneHa: 500,
  plants: 231000,
  tonnesEstimate: 23000,
  workersPermanent: 350,
  workersSeasonal: 360,
  workersHarvest: 710,
  /** derived: 231 000 ÷ 500 */
  plantsPerHa: 462,
  /** derived: 10 000 ÷ 462 */
  m2PerPlant: 21.6,
  /** derived: 23 000 ÷ 500 */
  tonnesPerHa: 46,
  /** derived: 500 ÷ 2 120 */
  phaseOneShare: 23.6,
  founded: "02.2025",
  sheet: "01",
} as const;

export const CONTACT = {
  office: "Tecno Túnel nº20, Vila Estoril, Nova Vida, Luanda, Angola",
  site: "Lonhe, Quibala, Cuanza Sul, Angola",
  emails: ["general@royalseed.com", "royalseedstore@gmail.com"],
  phones: ["923 576 824", "923 101 887"],
  domain: "royalseed.com",
  /** Planned, not yet created. Reserved on the sheet, never linked. */
  socialPlanned: ["Facebook", "WhatsApp Business", "Instagram"],
} as const;

/* ── Copy ───────────────────────────────────────────────────────────────── */

type Phase = { key: string; label: string; value: string; unit: string; note: string };
type Pillar = { key: string; title: string; body: string };

export interface Copy {
  htmlLang: string;
  meta: { title: string; description: string; ogAlt: string };
  nav: { plan: string; charter: string; product: string; method: string; origin: string; people: string; contact: string };
  skipToContent: string;
  langLabel: string;
  langSwitchTo: string;

  hero: {
    sheetTitle: string;
    sheetSub: string;
    headline: string;
    standfirst: string;
    company: string;
    scaleNote: string;
    schematicNote: string;
    cta: string;
    ctaSub: string;
    axisLabel: string;
    axisHelp: string;
    phases: Phase[];
    legend: { parcel: string; block: string; lattice: string; watercourse: string };
    north: string;
  };

  schedule: {
    title: string;
    intro: string;
    rows: { label: string; value: string; unit: string; note: string }[];
    derivedTitle: string;
    derived: { label: string; value: string; note: string }[];
    estimateFlag: string;
    estimateReveal: string;
    estimateBody: string;
  };

  charter: {
    missionTitle: string;
    mission: string;
    visionTitle: string;
    vision: string;
    valuesTitle: string;
    values: { name: string; gloss: string }[];
  };

  product: {
    title: string;
    lede: string;
    why: string;
    whyBody: string;
    figureCaption: string;
    parts: { key: string; label: string }[];
    variety: string;
    varietyNote: string;
    place: string;
    placeNote: string;
  };

  method: {
    title: string;
    lede: string;
    pillars: Pillar[];
    closing: string;
  };

  origin: {
    title: string;
    body: string;
    quote: string;
    stops: { place: string; note: string }[];
    photoSlot: string;
    photoSlotNote: string;
  };

  people: {
    title: string;
    lede: string;
    permanent: string;
    seasonal: string;
    harvest: string;
    body: string;
    keyPermanent: string;
    keySeasonal: string;
  };

  contact: {
    title: string;
    lede: string;
    officeLabel: string;
    siteLabel: string;
    emailLabel: string;
    phoneLabel: string;
    socialLabel: string;
    socialNote: string;
    cta: string;
  };

  colophon: {
    company: string;
    sheetLine: string;
    rights: string;
    pendingTitle: string;
    pending: string[];
  };
}

const pt: Copy = {
  htmlLang: "pt-PT",
  meta: {
    title: "Royalseed Agro — Abacate Hass. Lonhe, Quibala, Cuanza Sul.",
    description:
      "Royalseed Agro, Lda desenvolve produção sustentável de abacate Hass em Lonhe, Quibala, Cuanza Sul. Base fundiária de 2.120 hectares; primeira fase de 500 hectares e 231.000 plantas, orientada para exportação.",
    ogAlt: "Planta cadastral da base fundiária da Royalseed Agro em Lonhe, Quibala.",
  },
  nav: {
    plan: "A planta",
    charter: "Missão",
    product: "O produto",
    method: "Produção",
    origin: "História",
    people: "Pessoas",
    contact: "Contacto",
  },
  skipToContent: "Saltar para o conteúdo",
  langLabel: "Idioma",
  langSwitchTo: "Read this page in English",

  hero: {
    sheetTitle: "Base fundiária e primeira fase",
    sheetSub: "Lonhe · Quibala · Cuanza Sul · Angola",
    headline: "500 hectares de abacate Hass, plantados em Lonhe.",
    standfirst:
      "São os primeiros de uma base fundiária de 2.120 hectares no Quibala, orientada para exportação. Nenhuma colheita foi ainda realizada.",
    company: "Royalseed Agro, Lda",
    scaleNote: "Áreas desenhadas à proporção real",
    schematicNote:
      "Esquema. O contorno é ilustrativo; as áreas relativas correspondem aos valores declarados.",
    cta: "Falar connosco",
    ctaSub: "general@royalseed.com",
    axisLabel: "Fase do projecto",
    axisHelp: "Percorra as fases do projecto para ver a planta a construir-se.",
    phases: [
      {
        key: "land",
        label: "Base fundiária",
        value: "2.120",
        unit: "hectares",
        note: "A totalidade do terreno detido pela empresa em Lonhe.",
      },
      {
        key: "phase",
        label: "Primeira fase",
        value: "500",
        unit: "hectares",
        note: "O bloco em desenvolvimento — 23,6% da base fundiária.",
      },
      {
        key: "density",
        label: "Densidade",
        value: "231.000",
        unit: "plantas",
        note: "462 plantas por hectare, aproximadamente 21,6 m² por planta.",
      },
      {
        key: "yield",
        label: "Produção estimada",
        value: "23.000",
        unit: "toneladas",
        note: "Estimativa média para a primeira fase em plena produção.",
      },
    ],
    legend: {
      parcel: "Limite da base fundiária — 2.120 ha",
      block: "Bloco da primeira fase — 500 ha",
      lattice: "Trama de plantação — 231.000 plantas",
      watercourse: "Linha de água",
    },
    north: "N",
  },

  schedule: {
    title: "Quadro de áreas",
    intro:
      "Uma empresa com um ano de vida não tem histórico. Tem terreno medido. É por aqui que começamos.",
    rows: [
      { label: "Base fundiária", value: "2.120", unit: "hectares", note: "Terreno detido, Lonhe, Quibala" },
      { label: "Área de cultivo — 1.ª fase", value: "500", unit: "hectares", note: "23,6% da base fundiária" },
      { label: "Densidade de plantação", value: "231.000", unit: "plantas", note: "Abacate Hass" },
      { label: "Força de trabalho na colheita", value: "710", unit: "colaboradores", note: "350 permanentes · 360 sazonais" },
    ],
    derivedTitle: "Valores derivados",
    derived: [
      { label: "Plantas por hectare", value: "462", note: "231.000 ÷ 500" },
      { label: "Área por planta", value: "21,6 m²", note: "10.000 ÷ 462" },
    ],
    estimateFlag: "Estimativa",
    estimateReveal: "Ver a produção estimada",
    estimateBody:
      "23.000 toneladas é a produção média estimada para os 500 hectares da primeira fase em plena produção. Nenhuma colheita foi ainda realizada. Mantemos este número atrás da palavra «estimativa» porque é isso que ele é.",
  },

  charter: {
    missionTitle: "Missão",
    mission:
      "Desenvolver produção sustentável de abacate em Angola, criando uma plataforma agrícola moderna, orientada para exportação.",
    visionTitle: "Visão",
    vision:
      "Tornar-se referência nacional e regional na produção e exportação, com capacidade de integrar produção, logística e futuro processamento.",
    valuesTitle: "Valores",
    values: [
      { name: "Sustentabilidade", gloss: "O solo e a água de Lonhe têm de servir a quem vier depois." },
      { name: "Inovação", gloss: "Fertirrigação, material vegetal certificado, gestão técnica." },
      { name: "Qualidade", gloss: "O mercado que queremos não aceita fruta média." },
      { name: "Integridade", gloss: "Dizemos a fase em que estamos, não a que queríamos ter." },
    ],
  },

  product: {
    title: "Abacate Hass",
    lede: "",
    why: "Porquê o abacate",
    whyBody:
      "Escolhemos o abacate por acreditarmos no enorme potencial deste produto no mercado internacional, especialmente considerando o crescimento global da procura por alimentos saudáveis e produtos agrícolas de exportação.",
    figureCaption:
      "Fig. 1 — Persea americana cv. Hass, secção longitudinal. Epiderme rugosa e espessa, que escurece na maturação: é ela que permite ao fruto viajar.",
    parts: [
      { key: "skin", label: "Epiderme" },
      { key: "flesh", label: "Polpa" },
      { key: "stone", label: "Caroço" },
      { key: "stem", label: "Pedúnculo" },
    ],
    variety: "Variedade",
    varietyNote:
      "Hass. É a variedade que o mercado de exportação conhece, transporta e pede pelo nome.",
    place: "Lugar",
    placeNote:
      "Lonhe, no município do Quibala, província do Cuanza Sul. Uma origem, uma cultura, um bloco.",
  },

  method: {
    title: "Estratégia de produção",
    lede: "O nosso modelo de produção baseia-se em seis pontos. Nenhum deles é novo. Todos são exigidos por quem compra.",
    pillars: [
      {
        key: "fertigation",
        title: "Fertirrigação eficiente",
        body: "Água e nutrição entregues à planta na mesma linha, doseadas ao que a árvore precisa.",
      },
      {
        key: "seedlings",
        title: "Mudas seleccionadas e certificadas",
        body: "Cada uma das 231.000 plantas começa com material vegetal de origem conhecida.",
      },
      {
        key: "practice",
        title: "Boas práticas agrícolas",
        body: "Poda, sanidade, colheita e pós-colheita conduzidas segundo protocolo.",
      },
      {
        key: "management",
        title: "Gestão técnica profissional",
        body: "Decisões agronómicas tomadas por quem tem formação para as tomar.",
      },
      {
        key: "sustainability",
        title: "Sustentabilidade ambiental",
        body: "Uso de água, solo e cobertura vegetal geridos como activos, não como consumíveis.",
      },
      {
        key: "certification",
        title: "Organização orientada para certificação",
        body: "Registos, rastreabilidade e procedimentos montados desde já para uma auditoria futura.",
      },
    ],
    closing:
      "Desenvolver operações agrícolas modernas, preparadas para responder às exigências do mercado exportador.",
  },

  origin: {
    title: "A nossa história",
    body: "A Royalseed Agro foi constituída em Fevereiro de 2025. O projecto começou antes disso.",
    quote:
      "Antes de avançarmos para a implementação do projecto, investimos tempo na aprendizagem prática, no estudo técnico e na compreensão da cadeia de valor do abacate, tanto em Angola como em referências internacionais como o Quénia.",
    stops: [
      { place: "Luanda", note: "Constituição da empresa · Fevereiro de 2025" },
      { place: "Quibala, Cuanza Sul", note: "Reconhecimento do terreno em Lonhe" },
      { place: "Quénia", note: "Estudo da cadeia de valor do abacate" },
    ],
    photoSlot: "Foto a fornecer pelo cliente",
    photoSlotNote:
      "Este espaço está construído para receber fotografia real de campo e da viagem de estudo. Nada foi preenchido com imagem genérica.",
  },

  people: {
    title: "Força de trabalho",
    lede: "710 pessoas na época de colheita. Cada marca abaixo é uma delas.",
    permanent: "Permanentes",
    seasonal: "Sazonais",
    harvest: "Total na colheita",
    body:
      "350 pessoas mantêm o bloco durante todo o ano. Na colheita juntam-se-lhes mais 360, quase todas das comunidades do Quibala. Uma plantação desta dimensão é, antes de tudo, um empregador — e é por isso que a integridade está na nossa lista de valores e não apenas na nossa apresentação.",
    keyPermanent: "Colaborador permanente",
    keySeasonal: "Colaborador sazonal",
  },

  contact: {
    title: "Contacto",
    lede: "Compradores, instituições e parceiros: escreva para o endereço geral. Respondemos.",
    officeLabel: "Sede",
    siteLabel: "Projecto",
    emailLabel: "Correio electrónico",
    phoneLabel: "Telefone",
    socialLabel: "Redes sociais",
    socialNote: "Contas em preparação sob o nome Royalseed Agro. Ainda não existem.",
    cta: "general@royalseed.com",
  },

  colophon: {
    company: "Royalseed Agro, Lda",
    sheetLine: "Folha 01 · Base fundiária e primeira fase · Lonhe, Quibala, Cuanza Sul",
    rights: "Todos os direitos reservados.",
    pendingTitle: "Material em falta",
    pending: [
      "Fotografia de campo, de equipa e da viagem de estudo",
      "Contas de Facebook, WhatsApp Business e Instagram",
    ],
  },
};

const en: Copy = {
  htmlLang: "en",
  meta: {
    title: "Royalseed Agro — Hass avocado. Lonhe, Quibala, Cuanza Sul.",
    description:
      "Royalseed Agro, Lda is developing sustainable Hass avocado production at Lonhe, Quibala, Cuanza Sul, Angola. A 2,120-hectare land base; a first phase of 500 hectares and 231,000 plants, oriented toward export.",
    ogAlt: "Cadastral plan of Royalseed Agro's land base at Lonhe, Quibala.",
  },
  nav: {
    plan: "The plan",
    charter: "Mission",
    product: "The crop",
    method: "Production",
    origin: "History",
    people: "People",
    contact: "Contact",
  },
  skipToContent: "Skip to content",
  langLabel: "Language",
  langSwitchTo: "Ler esta página em português",

  hero: {
    sheetTitle: "Land base and first phase",
    sheetSub: "Lonhe · Quibala · Cuanza Sul · Angola",
    headline: "500 hectares of Hass avocado, planted at Lonhe.",
    standfirst:
      "They are the first of a 2,120-hectare land base in Quibala, oriented toward export. No harvest has yet been taken.",
    company: "Royalseed Agro, Lda",
    scaleNote: "Areas drawn to true proportion",
    schematicNote:
      "Schematic. The outline is illustrative; the relative areas match the stated figures.",
    cta: "Talk to us",
    ctaSub: "general@royalseed.com",
    axisLabel: "Project phase",
    axisHelp: "Step through the project phases to watch the plan build itself.",
    phases: [
      {
        key: "land",
        label: "Land base",
        value: "2,120",
        unit: "hectares",
        note: "The full extent of the company's land at Lonhe.",
      },
      {
        key: "phase",
        label: "First phase",
        value: "500",
        unit: "hectares",
        note: "The block under development — 23.6% of the land base.",
      },
      {
        key: "density",
        label: "Density",
        value: "231,000",
        unit: "plants",
        note: "462 plants per hectare, roughly 21.6 m² each.",
      },
      {
        key: "yield",
        label: "Estimated production",
        value: "23,000",
        unit: "tonnes",
        note: "Average estimate for the first phase at full production.",
      },
    ],
    legend: {
      parcel: "Land base boundary — 2,120 ha",
      block: "First-phase block — 500 ha",
      lattice: "Planting lattice — 231,000 plants",
      watercourse: "Watercourse",
    },
    north: "N",
  },

  schedule: {
    title: "Schedule of areas",
    intro:
      "A one-year-old company has no track record. It has measured ground. That is where we start.",
    rows: [
      { label: "Land base", value: "2,120", unit: "hectares", note: "Land held, Lonhe, Quibala" },
      { label: "Planted area — phase one", value: "500", unit: "hectares", note: "23.6% of the land base" },
      { label: "Planting density", value: "231,000", unit: "plants", note: "Hass avocado" },
      { label: "Harvest workforce", value: "710", unit: "people", note: "350 permanent · 360 seasonal" },
    ],
    derivedTitle: "Derived figures",
    derived: [
      { label: "Plants per hectare", value: "462", note: "231,000 ÷ 500" },
      { label: "Area per plant", value: "21.6 m²", note: "10,000 ÷ 462" },
    ],
    estimateFlag: "Estimate",
    estimateReveal: "Show the estimated production",
    estimateBody:
      "23,000 tonnes is the average production estimated for the 500 hectares of phase one at full production. No harvest has yet been taken. We keep this figure behind the word “estimate” because that is what it is.",
  },

  charter: {
    missionTitle: "Mission",
    mission:
      "To develop sustainable avocado production in Angola, building a modern agricultural platform oriented toward export.",
    visionTitle: "Vision",
    vision:
      "To become a national and regional reference in production and export, with the capacity to integrate production, logistics and future processing.",
    valuesTitle: "Values",
    values: [
      { name: "Sustainability", gloss: "The soil and water at Lonhe have to serve whoever comes next." },
      { name: "Innovation", gloss: "Fertigation, certified plant material, technical management." },
      { name: "Quality", gloss: "The market we want does not accept average fruit." },
      { name: "Integrity", gloss: "We state the phase we are in, not the one we would like to be in." },
    ],
  },

  product: {
    title: "Hass avocado",
    lede: "",
    why: "Why avocado",
    whyBody:
      "We chose avocado because we believe in this product's enormous potential in the international market, particularly given the global growth in demand for healthy food and export agricultural produce.",
    figureCaption:
      "Fig. 1 — Persea americana cv. Hass, longitudinal section. Thick pebbled skin that darkens as it ripens: it is what lets the fruit travel.",
    parts: [
      { key: "skin", label: "Skin" },
      { key: "flesh", label: "Flesh" },
      { key: "stone", label: "Stone" },
      { key: "stem", label: "Stem" },
    ],
    variety: "Variety",
    varietyNote:
      "Hass. The variety the export market already knows, ships, and asks for by name.",
    place: "Place",
    placeNote:
      "Lonhe, in the municipality of Quibala, Cuanza Sul province. One origin, one crop, one block.",
  },

  method: {
    title: "Production strategy",
    lede: "Our production model rests on six points. None of them is novel. All of them are required by the people who buy.",
    pillars: [
      {
        key: "fertigation",
        title: "Efficient fertigation",
        body: "Water and nutrition delivered to the tree on the same line, dosed to what it needs.",
      },
      {
        key: "seedlings",
        title: "Selected, certified seedlings",
        body: "Every one of the 231,000 plants starts from plant material of known origin.",
      },
      {
        key: "practice",
        title: "Good agricultural practice",
        body: "Pruning, plant health, harvest and post-harvest run to protocol.",
      },
      {
        key: "management",
        title: "Professional technical management",
        body: "Agronomic decisions made by people trained to make them.",
      },
      {
        key: "sustainability",
        title: "Environmental sustainability",
        body: "Water, soil and ground cover managed as assets, not consumables.",
      },
      {
        key: "certification",
        title: "Organised for certification",
        body: "Records, traceability and procedure set up now for an audit later.",
      },
    ],
    closing:
      "To develop modern agricultural operations, prepared to meet the demands of the export market.",
  },

  origin: {
    title: "Our history",
    body: "Royalseed Agro was incorporated in February 2025. The project began before that.",
    quote:
      "Before moving to implementation, we invested time in practical learning, technical study and understanding the avocado value chain, both in Angola and at international references such as Kenya.",
    stops: [
      { place: "Luanda", note: "Company incorporated · February 2025" },
      { place: "Quibala, Cuanza Sul", note: "Ground survey at Lonhe" },
      { place: "Kenya", note: "Study of the avocado value chain" },
    ],
    photoSlot: "Photograph to be supplied by the client",
    photoSlotNote:
      "This space is built to receive real field and study-trip photography. Nothing has been filled with generic imagery.",
  },

  people: {
    title: "Workforce",
    lede: "710 people at harvest. Every mark below is one of them.",
    permanent: "Permanent",
    seasonal: "Seasonal",
    harvest: "Total at harvest",
    body:
      "350 people hold the block through the year. At harvest another 360 join them, nearly all from communities around Quibala. A plantation this size is, before anything else, an employer — which is why integrity sits in our list of values and not only in our introduction.",
    keyPermanent: "Permanent employee",
    keySeasonal: "Seasonal employee",
  },

  contact: {
    title: "Contact",
    lede: "Buyers, institutions and partners: write to the general address. We answer.",
    officeLabel: "Head office",
    siteLabel: "Project site",
    emailLabel: "Email",
    phoneLabel: "Telephone",
    socialLabel: "Social",
    socialNote: "Accounts in preparation under the name Royalseed Agro. They do not exist yet.",
    cta: "general@royalseed.com",
  },

  colophon: {
    company: "Royalseed Agro, Lda",
    sheetLine: "Sheet 01 · Land base and first phase · Lonhe, Quibala, Cuanza Sul",
    rights: "All rights reserved.",
    pendingTitle: "Material still outstanding",
    pending: [
      "Field, team and study-trip photography",
      "Facebook, WhatsApp Business and Instagram accounts",
    ],
  },
};

export const COPY: Record<Lang, Copy> = { pt, en };
