// ── Single Source of Truth für Tarife und Preise (P0-05, § 1 PAngV) ───────────
// Zentrales Pricing-Modul für kontolage.de.
//
// STRIPE & STEUER-ARCHITEKTUR:
// - Stripe erwartet Nettobeträge (`tax_behavior: "exclusive"`): 4,90 €, 9,00 €, 29,00 €.
// - Gemäß § 1 Abs. 1 PAngV (Preisangabenverordnung) und § 3 UStG müssen gegenüber
//   Verbrauchern im DACH-Raum stets die ENDPREISE (inkl. gesetzl. MwSt.) ausgewiesen werden.
// - Bei 19 % MwSt. ergeben sich folgende Endpreise:
//     * Starter:       5,83 € / Monat brutto (4,90 € netto zzgl. 0,93 € MwSt.)
//     * Pro Digital:  10,71 € / Monat brutto (9,00 € netto zzgl. 1,71 € MwSt.)
//     * Executive:    34,51 € / Monat brutto (29,00 € netto zzgl. 5,51 € MwSt.)
//     * Basis:         0,00 € (dauerhaft kostenlos)
//
// Alle Seiten (Abo, AGB, Datenschutz, Transparenz, Account, Rechner) greifen auf diese
// Daten zu, um Preisdiskrepanzen dauerhaft auszuschließen.

export const VAT_RATE = 0.19;
export const VAT_EXEMPT = false; // Bei Kleinunternehmerregelung (§ 19 UStG) auf true setzen

export const formatGross = (net: number): string =>
  (net * (1 + (VAT_EXEMPT ? 0 : VAT_RATE))).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatNet = (net: number): string =>
  net.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const vatLabel = (): string =>
  VAT_EXEMPT ? "zzgl. MwSt. gem. § 19 UStG" : "inkl. 19 % MwSt.";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: "basis" | "starter" | "pro" | "executive";
  planKey: "starter" | "pro" | "executive" | null;
  name: string;
  price: number; // Net price for Stripe integration
  netPrice: number;
  grossPrice: string; // Formatted gross string (e.g. "5,83 €")
  grossPriceFormatted: string;
  netPriceFormatted: string;
  period: string;
  highlight: boolean;
  desc: string;
  tagline: string;
  legalText: string;
  features: PlanFeature[];
  cta: string;
}

export const PRICING_PLANS: Record<"basis" | "starter" | "pro" | "executive", PricingPlan> = {
  basis: {
    id: "basis",
    planKey: null,
    name: "Basis",
    price: 0,
    netPrice: 0,
    grossPrice: "0,00 €",
    grossPriceFormatted: "0,00 €",
    netPriceFormatted: "0,00 €",
    period: "/ Monat",
    highlight: false,
    desc: "Freier Einblick in grundlegende Steuerrechner & Wochenartikel.",
    tagline: "Kostenloser Einblick in Rechner und Wochenartikel.",
    legalText: "Basis: kostenlos (0,00 € pro Monat)",
    features: [
      { text: "1 Bildungsartikel pro Woche", included: true },
      { text: "Basis-Rechner (Rürup §10, Sparerpauschbetrag §20)", included: true },
      { text: "PDF-Checkliste Steuerjahr 2026", included: true },
      { text: "100% Kostenlos ohne Registrierung", included: true },
      { text: "Holding-Strukturierungsrechner", included: false },
      { text: "Excel-Modelle & ELSTER-Vorlagen", included: false },
      { text: "Kabinett Exklusivbereich", included: false },
      { text: "Prioritäts-Support", included: false },
    ],
    cta: "Kostenlos starten",
  },
  starter: {
    id: "starter",
    planKey: "starter",
    name: "Starter",
    price: 4.9,
    netPrice: 4.9,
    grossPrice: `${formatGross(4.9)} €`,
    grossPriceFormatted: `${formatGross(4.9)} €`,
    netPriceFormatted: `${formatNet(4.9)} €`,
    period: "/ Monat",
    highlight: false,
    desc: "Für Einsteiger: erweiterte Rechner & alle Wochenartikel ohne Limit.",
    tagline: "Erweiterte Rechner und alle Artikel ohne Limit.",
    legalText: `Starter: ${formatGross(4.9)} € pro Monat brutto inkl. 19 % MwSt. (${formatNet(4.9)} € netto)`,
    features: [
      { text: "Unbegrenzter Artikel-Zugang", included: true },
      { text: "Alle Basis-Rechner + Sparplan-Rechner", included: true },
      { text: "PDF-Checkliste & Steuer-Kalender 2026", included: true },
      { text: "Kabinett Lesebereich (ohne Download)", included: true },
      { text: "Holding-Strukturierungsrechner", included: false },
      { text: "Excel-Rechenmodelle (Holding, Fünftel)", included: false },
      { text: "ELSTER-Vorlagen & Steuerformulare", included: false },
      { text: "Prioritäts-Support", included: false },
    ],
    cta: "Starter wählen",
  },
  pro: {
    id: "pro",
    planKey: "pro",
    name: "Pro Digital",
    price: 9.0,
    netPrice: 9.0,
    grossPrice: `${formatGross(9.0)} €`,
    grossPriceFormatted: `${formatGross(9.0)} €`,
    netPriceFormatted: `${formatNet(9.0)} €`,
    period: "/ Monat",
    highlight: true,
    desc: "Vollständiger Zugang für Privatanleger & Vermögensaufbau.",
    tagline: "Vollständiger Zugang für Privatanleger.",
    legalText: `Pro Digital: ${formatGross(9.0)} € pro Monat brutto inkl. 19 % MwSt. (${formatNet(9.0)} € netto)`,
    features: [
      { text: "Unbegrenzter Artikel- & Analysenzugang", included: true },
      { text: "Alle Rechner & Szenarien (AfA, Tilgung)", included: true },
      { text: "Druckfertige Steuer-Dossiers (PDF-Export)", included: true },
      { text: "Excel-Rechenmodelle (Holding, Fünftel)", included: true },
      { text: "Kabinett Zugang (Exklusiv-Analysen)", included: true },
      { text: "Pro-Ausgaben im Kabinett (nur hier, nicht öffentlich)", included: true },
      { text: "ELSTER Vorlagen & Steuerformulare", included: false },
      { text: "B2B Gehaltspaket-Analyse", included: false },
      { text: "Prioritäts-Support (48h)", included: false },
    ],
    cta: "Pro Digital wählen",
  },
  executive: {
    id: "executive",
    planKey: "executive",
    name: "Executive B2B",
    price: 29.0,
    netPrice: 29.0,
    grossPrice: `${formatGross(29.0)} €`,
    grossPriceFormatted: `${formatGross(29.0)} €`,
    netPriceFormatted: `${formatNet(29.0)} €`,
    period: "/ Monat",
    highlight: false,
    desc: "Für Selbständige, Freiberufler, Geschäftsführer & Holdings.",
    tagline: "Für Selbständige, Freiberufler und Holdings.",
    legalText: `Executive B2B: ${formatGross(29.0)} € pro Monat brutto inkl. 19 % MwSt. (${formatNet(29.0)} € netto)`,
    features: [
      { text: "Alles aus Pro Digital enthalten", included: true },
      { text: "Holding-Strukturierungsmodell (§8b KStG)", included: true },
      { text: "VV-GmbH Excel-Rechenmodell & Satzungsvorlage", included: true },
      { text: "Fünftelregelung Abfindungs-Planer (§34 EStG)", included: true },
      { text: "ELSTER-Vorlagen (ESt, USt, GewSt)", included: true },
      { text: "B2B Gehaltspaket-Analyse (GGF-Gehalt)", included: true },
      { text: "Prioritäts-Support (Antwort in < 24h)", included: true },
      { text: "Early Access zu neuen Steuer-Features", included: true },
      { text: "Executive-Ausgaben: B2B-Deep-Dives mit Quellen", included: true },
    ],
    cta: "Executive wählen",
  },
};

export const PRICING_PLANS_LIST: PricingPlan[] = [
  PRICING_PLANS.basis,
  PRICING_PLANS.starter,
  PRICING_PLANS.pro,
  PRICING_PLANS.executive,
];

/**
 * Textbaustein für Rechtsdokumente (AGB, Datenschutz, Impressum)
 */
export const LEGAL_PRICING_SUMMARY = {
  starter: PRICING_PLANS.starter.legalText,
  pro: PRICING_PLANS.pro.legalText,
  executive: PRICING_PLANS.executive.legalText,
  combined: `Starter (${PRICING_PLANS.starter.grossPriceFormatted}/Monat [${PRICING_PLANS.starter.netPriceFormatted} netto], Pro Digital ${PRICING_PLANS.pro.grossPriceFormatted}/Monat [${PRICING_PLANS.pro.netPriceFormatted} netto], Executive B2B ${PRICING_PLANS.executive.grossPriceFormatted}/Monat [${PRICING_PLANS.executive.netPriceFormatted} netto] inkl. 19 % MwSt.)`,
};
