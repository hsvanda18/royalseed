/**
 * Every figure and claim in the locales comes from the client's "Perfil
 * Institucional da Empresa". Nothing is invented. Values marked `derived`
 * are simple arithmetic on two stated figures and are labelled as
 * derivations on screen; values marked `estimate` carry that word wherever
 * they appear.
 *
 * Photo captions describe what is visible and never name a place or a
 * person: the client has not said where each photograph was taken or who
 * appears in it.
 */

import { ar } from "./locales/ar";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { pt } from "./locales/pt";
import { zh } from "./locales/zh";

export type Lang = "pt" | "en" | "fr" | "es" | "ar" | "zh";

export const LANGS: Lang[] = ["pt", "en", "fr", "es", "ar", "zh"];

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
  founded: "02.2025",
} as const;

export const CONTACT = {
  office: "Tecno Túnel nº20, Vila Estoril, Nova Vida, Luanda, Angola",
  site: "Lonhe, Quibala, Cuanza Sul, Angola",
  emails: ["general@royalseedagro.com", "royalseedstore@gmail.com"],
  phones: ["923 576 824", "923 101 887"],
  domain: "royalseedagro.com",
  /** Planned, not yet created. Reserved on the sheet, never linked. */
  socialPlanned: ["Facebook", "WhatsApp Business", "Instagram"],
  /**
   * The message form posts here and FormSubmit relays it by email to the
   * company's main address. The first submission sends an activation email
   * to that address; nothing is delivered until it is confirmed.
   */
  formEndpoint: "https://formsubmit.co/ajax/general@royalseedagro.com",
} as const;

/* ── Photographs supplied by the client. See tools/prepare-assets.py. ───── */

export const PHOTOS = {
  overview: { src: "/photos/pomar-aereo.webp", width: 1536, height: 1152 },
  mission: { src: "/photos/pomar-missao.webp", width: 1200, height: 1066 },
  product: { src: "/photos/abacate-hass.webp", width: 675, height: 1200 },
  method: [
    { src: "/photos/viveiro-corredor.webp", width: 900, height: 1200 },
    { src: "/photos/viveiro-mudas.webp", width: 900, height: 1200 },
    { src: "/photos/pomar-linha.webp", width: 1200, height: 900 },
  ],
} as const;

/* ── Copy ───────────────────────────────────────────────────────────────── */

type Pillar = { key: string; title: string; body: string };
type PhotoCopy = { alt: string; caption: string };

export interface Copy {
  htmlLang: string;
  dir: "ltr" | "rtl";
  ogLocale: string;
  /** The language's own name for itself, as listed in the selector. */
  langName: string;
  meta: { title: string; description: string; ogAlt: string };
  nav: { plan: string; charter: string; product: string; method: string; origin: string; people: string; contact: string };

  ui: {
    skipToContent: string;
    langLabel: string;
    homeLabel: string;
    navLabel: string;
    menuLabel: string;
  };

  hero: {
    headline: string;
    cta: string;
    ctaSub: string;
    photo: PhotoCopy;
  };

  schedule: {
    title: string;
    rows: { label: string; value: string; unit: string }[];
    derivedTitle: string;
    derived: { label: string; value: string }[];
    estimateFlag: string;
    estimateReveal: string;
    estimateValue: string;
    estimateUnit: string;
    estimateBody: string;
  };

  charter: {
    missionTitle: string;
    mission: string;
    photo: PhotoCopy;
    visionTitle: string;
    vision: string;
    valuesTitle: string;
    values: { name: string; gloss: string }[];
  };

  product: {
    title: string;
    why: string;
    whyBody: string;
    photo: PhotoCopy;
    variety: string;
    varietyNote: string;
    place: string;
    placeNote: string;
  };

  method: {
    title: string;
    lede: string;
    pillars: Pillar[];
    photos: [PhotoCopy, PhotoCopy, PhotoCopy];
    closing: string;
  };

  origin: {
    title: string;
    body: string;
    quote: string;
    galleryTitle: string;
    folders: { angola: string; kenya: string };
    /** Accessible name for each photograph: {folder}, {n}, {total}. */
    photoAlt: string;
    prev: string;
    next: string;
    close: string;
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
    form: {
      title: string;
      name: string;
      email: string;
      message: string;
      send: string;
      sending: string;
      sent: string;
      error: string;
      subject: string;
    };
  };

  colophon: {
    company: string;
    sheetLine: string;
    rights: string;
    pendingTitle: string;
    pending: string[];
  };
}

export const COPY: Record<Lang, Copy> = { pt, en, fr, es, ar, zh };
