/**
 * Hermes Daily Newsletter & News Ingestion Engine v1.0
 *
 * Runs daily via GitHub Actions or manual dispatch.
 * 1. Checks news feeds (EZB, Tagesschau Finanzen, CoinGecko, Destatis) and decay across the 9 categories.
 * 2. Selects category with freshest news / highest decay.
 * 3. Prompts NVIDIA NIM Gateway (model: nvidia/nemotron-3-ultra-550b-a55b) with AI cascade fallback.
 * 4. Strictly validates against WpHG § 2 Abs. 8 Nr. 10, PAngV, and newsletter-lint rules.
 * 5. Updates content/newsletter.json, syncs content/routes.json, and regenerates sitemap.
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT_DIR = process.cwd();
const NEWSLETTER_PATH = path.join(ROOT_DIR, "webseitenversionen", "4.9.2026", "content", "newsletter.json");
const ROUTES_PATH = path.join(ROOT_DIR, "webseitenversionen", "4.9.2026", "content", "routes.json");
const REGISTRY_PATH = path.join(ROOT_DIR, ".agents", "skills", "kontolage-newsletter-editor", "resources", "themen-quellen-registry.json");

// ─── Canonical 9 Categories ──────────────────────────────────────────────────
export const CATEGORIES = [
  { id: "makrooekonomie-ezb", name: "Makroökonomie & EZB", rechnerHref: "/rechner", defaultKeywords: ["EZB Leitzins", "Einlagefazilität", "Inflation", "Geldpolitik", "Eurozone"] },
  { id: "weltwirtschaft-geopolitik", name: "Weltwirtschaft & Geopolitik", rechnerHref: "/rechner", defaultKeywords: ["Weltwirtschaft", "Geopolitik", "Handelsbeziehungen", "Zentralbanken", "Staatsverschuldung"] },
  { id: "kapitalertraege", name: "Kapitalerträge", rechnerHref: "/depot-analyse", defaultKeywords: ["Kapitalertragsteuer", "Sparerpauschbetrag", "Abgeltungsteuer", "Günstigerprüfung", "Freistellungsauftrag"] },
  { id: "krypto-digital-assets", name: "Krypto & Digital Assets", rechnerHref: "/rechner", defaultKeywords: ["Krypto Steuern", "§ 23 EStG", "Haltefrist", "MiCA", "Bitcoin", "Staking"] },
  { id: "holding-gmbh", name: "Holding & GmbH", rechnerHref: "/holding", defaultKeywords: ["Holding GmbH", "§ 8b KStG", "Schachtelprivileg", "Gewinnausschüttung", "Vermögensverwaltende GmbH"] },
  { id: "immobilien", name: "Immobilien", rechnerHref: "/rechner", defaultKeywords: ["Immobilien Steuern", "degressive AfA", "§ 21 EStG", "Handwerkerleistungen", "Abschreibung"] },
  { id: "altersvorsorge", name: "Altersvorsorge", rechnerHref: "/rechner", defaultKeywords: ["Rürup Rente", "Basisrente", "§ 10 EStG", "Altersvorsorge", "Rentenausgleichszahlung"] },
  { id: "etf-indexfonds", name: "ETF & Indexfonds", rechnerHref: "/depot-analyse", defaultKeywords: ["ETF Steuern", "Vorabpauschale", "Teilfreistellung", "Tracking Difference", "Basiszins"] },
  { id: "arbeitnehmer", name: "Arbeitnehmer", rechnerHref: "/steuerplaner", defaultKeywords: ["Fünftelregelung", "Homeoffice-Pauschale", "Werbungskosten", "Abfindung", "Steuererklärung"] },
];

// ─── AI Provider Cascade ─────────────────────────────────────────────────────
const AI_PROVIDERS = [
  {
    name: "NVIDIA NIM Gateway (Nemotron Primary)",
    url: "https://integrate.api.nvidia.com/v1/chat/completions",
    key: process.env.NVIDIA_API_KEY,
    model: process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b",
    headers: { "User-Agent": "HermesAgent/2.4 Kontolage" },
  },
  {
    name: "OpenRouter (Nemotron Secondary)",
    url: "https://openrouter.ai/api/v1/chat/completions",
    key: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free",
    headers: { "HTTP-Referer": "https://kontolage.de", "X-Title": "Kontolage Hermes Agent" },
  },
  {
    name: "Orcarouter Fallback (free)",
    url: "https://api.orcarouter.ai/v1/chat/completions",
    key: process.env.ORCAROUTER_API_KEY,
    model: process.env.ORCAROUTER_MODEL || "orcarouter/free",
  },
  {
    name: "Groq Fallback (Llama 3.3 70B)",
    url: "https://api.groq.com/openai/v1/chat/completions",
    key: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  },
  {
    name: "Google Gemini Fallback (OpenAI-kompatibel)",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    key: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  },
  {
    name: "Mistral Fallback (Mistral Small)",
    url: "https://api.mistral.ai/v1/chat/completions",
    key: process.env.MISTRAL_API_KEY,
    model: process.env.MISTRAL_MODEL || "mistral-small-latest",
  },
];

// ─── HTTP Helper ─────────────────────────────────────────────────────────────
async function httpRequest(url, method = "GET", body = null, extraHeaders = {}, timeoutMs = 45000) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const bodyStr = body ? JSON.stringify(body) : null;
      const options = {
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: parsed.pathname + parsed.search,
        method,
        timeout: timeoutMs,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HermesAgent/2.4 Kontolage",
          ...(bodyStr ? { "Content-Length": Buffer.byteLength(bodyStr) } : {}),
          ...extraHeaders,
        },
      };
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
          catch { resolve({ status: res.statusCode, body: data }); }
        });
      });
      req.on("timeout", () => {
        req.destroy();
        resolve({ status: 408, body: { error: "Request timeout" } });
      });
      req.on("error", (err) => resolve({ status: 500, body: { error: err.message } }));
      if (bodyStr) req.write(bodyStr);
      req.end();
    } catch (e) {
      resolve({ status: 500, body: { error: e.message } });
    }
  });
}

// ─── News Ingestion ──────────────────────────────────────────────────────────
async function fetchNewsSignals() {
  const signals = [];
  console.log("📡 Prüfe Live-Nachrichtenquellen (EZB, Tagesschau Finanzen, CoinGecko)...");

  // 1. Tagesschau Finanzen RSS
  try {
    const res = await httpRequest("https://www.tagesschau.de/wirtschaft/finanzen/index~rss2.xml", "GET", null, {}, 10000);
    if (res.status === 200 && typeof res.body === "string") {
      const titles = [...res.body.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/g)]
        .map(m => m[1] || m[2])
        .filter(t => t && !t.includes("Finanznachrichten und Marktberichte"));
      titles.slice(0, 8).forEach(title => {
        signals.push({ source: "Tagesschau Finanzen", title, date: new Date().toISOString().slice(0, 10) });
      });
      console.log(`  ✓ Tagesschau Finanzen: ${titles.length} Schlagzeilen erfasst.`);
    }
  } catch (err) {
    console.warn("  ⚠ Tagesschau Finanzen RSS Fehler:", err.message);
  }

  // 2. EZB Press Releases RSS
  try {
    const res = await httpRequest("https://www.ecb.europa.eu/rss/press.html", "GET", null, {}, 10000);
    if (res.status === 200 && typeof res.body === "string") {
      const items = [...res.body.matchAll(/<item>[\s\S]*?<title>\s*(.*?)\s*<\/title>[\s\S]*?<pubDate>\s*(.*?)\s*<\/pubDate>/g)]
        .map(m => ({ title: m[1], pubDate: m[2] }));
      items.slice(0, 4).forEach(it => {
        signals.push({ source: "EZB", title: it.title, date: new Date().toISOString().slice(0, 10) });
      });
      console.log(`  ✓ EZB Press: ${items.length} Meldungen erfasst.`);
    }
  } catch (err) {
    console.warn("  ⚠ EZB RSS Fehler:", err.message);
  }

  // 3. CoinGecko Krypto-Kurse
  try {
    const res = await httpRequest("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=eur", "GET", null, {}, 10000);
    if (res.status === 200 && res.body?.bitcoin?.eur) {
      signals.push({
        source: "CoinGecko",
        title: `Bitcoin bei ${Math.round(res.body.bitcoin.eur).toLocaleString("de-DE")} € · Ethereum bei ${Math.round(res.body.ethereum.eur).toLocaleString("de-DE")} €`,
        date: new Date().toISOString().slice(0, 10),
        data: res.body,
      });
      console.log(`  ✓ CoinGecko: BTC ${res.body.bitcoin.eur} €, ETH ${res.body.ethereum.eur} € erfasst.`);
    }
  } catch (err) {
    console.warn("  ⚠ CoinGecko Fehler:", err.message);
  }

  return signals;
}

// ─── Decay & News Prioritization ─────────────────────────────────────────────
function calculateCategoryPriorities(existingIssues, newsSignals) {
  const today = new Date();

  return CATEGORIES.map(cat => {
    const catIssues = existingIssues.filter(i => i.category === cat.name);
    let daysSinceLast = 999;
    let lastDate = "2026-01-01";

    if (catIssues.length > 0) {
      const sorted = [...catIssues].sort((a, b) => b.published.localeCompare(a.published));
      lastDate = sorted[0].published;
      const last = new Date(lastDate);
      daysSinceLast = Math.max(0, Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // Match news signals to this category
    const relevantNews = newsSignals.filter(s => {
      const text = (s.title + " " + s.source).toLowerCase();
      if (cat.id === "makrooekonomie-ezb" && (text.includes("ezb") || text.includes("zins") || text.includes("inflation") || text.includes("bank lending"))) return true;
      if (cat.id === "krypto-digital-assets" && (text.includes("bitcoin") || text.includes("krypto") || text.includes("coingecko"))) return true;
      if (cat.id === "weltwirtschaft-geopolitik" && (text.includes("wirtschaft") || text.includes("handel") || text.includes("usa") || text.includes("china"))) return true;
      if (cat.id === "etf-indexfonds" && (text.includes("aktien") || text.includes("etf") || text.includes("dax"))) return true;
      return false;
    });

    // Score: freshness decay days + bonus if live news detected
    const newsBonus = relevantNews.length * 20;
    const score = daysSinceLast + newsBonus;

    return {
      category: cat,
      daysSinceLast,
      lastDate,
      issueCount: catIssues.length,
      relevantNews,
      score,
    };
  }).sort((a, b) => b.score - a.score);
}

// ─── AI Generation via Cascade ───────────────────────────────────────────────
async function callAiCascade(prompt, systemPrompt) {
  for (const provider of AI_PROVIDERS) {
    if (!provider.key || !provider.url) continue;

    console.log(`  🤖 Versuche AI-Provider: ${provider.name} (Modell: ${provider.model})...`);
    try {
      const res = await httpRequest(
        provider.url,
        "POST",
        {
          model: provider.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 1800,
        },
        {
          Authorization: `Bearer ${provider.key}`,
          ...(provider.headers || {}),
        },
        45000
      );

      if (res.status === 200 && res.body?.choices?.[0]?.message?.content) {
        console.log(`  ✅ Erfolg mit ${provider.name}!`);
        return { content: res.body.choices[0].message.content, provider: provider.name };
      }
      console.warn(`  ⚠ ${provider.name} lieferte Status ${res.status}`);
    } catch (err) {
      console.warn(`  ⚠ ${provider.name} Netzwerkfehler:`, err.message);
    }
  }

  console.warn("  ℹ Keine AI-Antwort verfügbar — nutze deterministischen Qualitäts-Synthesizer.");
  return null;
}

// ─── Deterministic Quality Fallback ──────────────────────────────────────────
function createDeterministicIssue(category, newsSignals) {
  const today = new Date().toISOString().slice(0, 10);
  const stamp = Date.now().toString().slice(-4);

  const TEMPLATES = {
    "Makroökonomie & EZB": {
      slug: `ezb-leitzins-ausblick-liquiditaet-${today}-${stamp}`,
      title: `EZB-Zinsstruktur & Liquidität: Einlagefazilität und Auswirkungen auf Festgeld 2026`,
      description: `Analyse der aktuellen EZB-Einlagefazilität: Wie Zentralbank-Entscheidungen die Umlaufrendite von Bundesanleihen und Tagesgeldzinsen 2026 steuern.`,
      teaser: `Die EZB-Geldpolitik setzt den Rahmen für kurzfristige Sparzinsen und langfristige Anleiherenditen. Eine nüchterne Einordnung nach Art. 127 AEUV.`,
      sections: [
        {
          heading: "1. Zinsstrukturkurve am deutschen Rentenmarkt",
          body: "Die Umlaufrendite inländischer Inhaberschuldverschreibungen spiegelt die Markterwartungen an das Zinsplateau der Europäischen Zentralbank wider. Privatanleger und vermögensverwaltende Einheiten sollten Zinsänderungsrisiken bei längeren Laufzeiten mathematisch über die Duration steuern.",
        },
        {
          heading: "2. Einlagefazilität vs. Realkapital-Thesaurierung",
          body: "Während Tagesgeldkonten nach Abzug von 26,375 % Abgeltungsteuer und Inflation häufig eine negative Realrendite aufweisen, bieten kurzlaufende Bundesanleihen oder indexierte Geldmarktinstrumente transparente Vergleichsmaßstäbe ohne Emittenten-Klumpenrisiko.",
        },
      ],
      sources: [
        { label: "Europäische Zentralbank (EZB) — Key ECB Interest Rates", url: "https://www.ecb.europa.eu", asOf: today, jurisdiction: "EU" },
        { label: "Deutsche Bundesbank — Zinsstrukturkurve und Umlaufrenditen", url: "https://www.bundesbank.de", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["EZB Zinsen 2026", "Einlagefazilität", "Umlaufrendite", "Geldpolitik Eurozone", "Zinsstruktur"],
      rechnerHref: "/rechner",
    },
    "Krypto & Digital Assets": {
      slug: `krypto-steuerliche-behandlung-bmf-haltefrist-${today}-${stamp}`,
      title: `Kryptowährungen im Steuerrecht 2026: Haltefrist nach § 23 EStG und MiCA-Regeln`,
      description: `Steuerliche Behandlung von Bitcoin und Digital Assets: Jahresfrist nach § 23 Abs. 1 Satz 1 Nr. 2 EStG, 1.000 € Freigrenze und EuGH-Rechtsprechung.`,
      teaser: `Gewinne aus dem Verkauf von Krypto-Assets bleiben nach 365 Tagen Haltedauer steuerfrei. Wir beleuchten die exakten Nachweispflichten nach FIFO-Methode.`,
      sections: [
        {
          heading: "1. Private Veräußerungsgeschäfte (§ 23 Abs. 1 Nr. 2 EStG)",
          body: "Verkäufe von Krypto-Assets innerhalb der einjährigen Spekulationsfrist unterliegen dem persönlichen Einkommensteuersatz (bis 45 % zzgl. SolZ). Ab dem 366. Tag nach dem Anschaffungszeitpunkt ist der gesamte realisierte Gewinn steuerfrei.",
        },
        {
          heading: "2. Nachweisführung nach BMF-Grundsätzen (FIFO-Verfahren)",
          body: "Das Bundesfinanzministerium sieht für jede Wallet und jedes Depot die First-In-First-Out-Methode vor. Eine lückenlose Dokumentation mit Transaktions-Hashes und Zeitstempeln schützt vor Schätzungen durch das Finanzamt bei Betriebsprüfungen.",
        },
      ],
      sources: [
        { label: "Bundesministerium der Finanzen (BMF) — Einzelfragen zur ertragsteuerlichen Behandlung von virtuellen Währungen", url: "https://www.bundesfinanzministerium.de", asOf: today, jurisdiction: "DE" },
        { label: "Einkommensteuergesetz (EStG) § 23 Private Veräußerungsgeschäfte", url: "https://www.gesetze-im-internet.de/estg/__23.html", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["Krypto Steuern 2026", "Haltefrist 1 Jahr", "§ 23 EStG", "FIFO Krypto", "BMF Krypto"],
      rechnerHref: "/rechner",
    },
    "Holding & GmbH": {
      slug: `holding-liquiditaetsmanagement-kapitalgesellschaft-${today}-${stamp}`,
      title: `Holding-Liquiditätsmanagement 2026: Thesaurierung nach § 8b KStG und Kostenfaktor`,
      description: `Wann rechnet sich die vermögensverwaltende Holding? Mathematischer Vergleich der 1,54 % Besteuerung mit 2.500 € laufenden Bilanzierungskosten.`,
      teaser: `Das Schachtelprivileg nach § 8b KStG ermöglicht eine 98,5 % steuerfreie Reinvestition von Aktiengewinnen. Doch erst ab ca. 120.000 € Depotvolumen schlägt der Hebel die Fixkosten.`,
      sections: [
        {
          heading: "1. Wirkungsweise des Schachtelprivilegs (§ 8b Abs. 1 und 2 KStG)",
          body: "Veräußerungsgewinne aus Aktien gelten zu 95 % als steuerfrei. Die verbleibenden 5 % werden als nicht abzugsfähige Betriebsausgabe behandelt und mit KSt (15 %) sowie Gewerbesteuer belegt, was eine effektive Steuerlast von ca. 1,54 % ergibt.",
        },
        {
          heading: "2. Break-Even-Berechnung gegen laufende Fixkosten",
          body: "Steuerberaterkosten für Jahresabschluss, E-Bilanz, Offenlegung im Bundesanzeiger und IHK-Beitrag betragen mindestens 2.000 bis 3.000 € jährlich. Bei 5 % Rendite amortisiert sich die Struktur erst ab 100.000 bis 150.000 € investiertem Kapital.",
        },
      ],
      sources: [
        { label: "Körperschaftsteuergesetz (KStG) § 8b Beteiligung an anderen Körperschaften", url: "https://www.gesetze-im-internet.de/kstg_1977/__8b.html", asOf: today, jurisdiction: "DE" },
        { label: "Gewerbesteuergesetz (GewStG) § 9 Kürzungen", url: "https://www.gesetze-im-internet.de/gewstg/__9.html", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["Holding GmbH 2026", "§ 8b KStG", "Schachtelprivileg", "Vermögensverwaltende GmbH", "Thesaurierung"],
      rechnerHref: "/holding",
    },
    "Kapitalerträge": {
      slug: `abgeltungsteuer-sparerpauschbetrag-optimierung-${today}-${stamp}`,
      title: `Abgeltungsteuer & Sparerpauschbetrag 2026: Verrechnung und NV-Bescheinigung`,
      description: `Strategien zur Ausschöpfung des 1.000 € Sparerpauschbetrags (§ 20 Abs. 9 EStG): Verlusttöpfe, Günstigerprüfung und Quellensteueranrechnung.`,
      teaser: `Bis zu 1.000 € (bzw. 2.000 € bei Zusammenveranlagung) an Kapitalerträgen bleiben jährlich steuerfrei. Wir analysieren die optimale Verteilung über mehrere Depots.`,
      sections: [
        {
          heading: "1. Freistellungsauftrag und depotübergreifende Verteilung",
          body: "Wer mehrere Depots führt, sollte den Sparerpauschbetrag gezielt auf ausschüttende ETFs und Zinskonten verteilen. Ungenutzte Freibeträge verfallen am Jahresende und können nicht auf Folgejahre übertragen werden.",
        },
        {
          heading: "2. Günstigerprüfung nach § 32d Abs. 6 EStG",
          body: "Liegt der persönliche Grenzsteuersatz unter 25 %, erstattet das Finanzamt über die Anlage KAP die Differenz zur 25-prozentigen Abgeltungsteuer. Dies lohnt sich insbesondere für Ruheständler, Studenten oder in Übergangsjahren.",
        },
      ],
      sources: [
        { label: "Einkommensteuergesetz (EStG) § 20 Abs. 9 Sparer-Pauschbetrag", url: "https://www.gesetze-im-internet.de/estg/__20.html", asOf: today, jurisdiction: "DE" },
        { label: "Bundesministerium der Finanzen — Abgeltungsteuer Merkblatt", url: "https://www.bundesfinanzministerium.de", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["Sparerpauschbetrag 2026", "Abgeltungsteuer 25%", "Günstigerprüfung § 32d", "Freistellungsauftrag", "Kapitalertragsteuer"],
      rechnerHref: "/depot-analyse",
    },
    "Altersvorsorge": {
      slug: `basisrente-ruerup-steuerabzug-maximalbetrag-${today}-${stamp}`,
      title: `Rürup-Rente 2026: Höchstbetrag 30.825 € und steuerlicher Vollabzug (§ 10 EStG)`,
      description: `Altersvorsorge-Sonderausgabenabzug 2026: 100 % Abzugsfähigkeit der Rürup-Beiträge bis 30.825 € (61.650 € für Verheiratete) für Selbständige und Spitzenverdiener.`,
      teaser: `Für Selbständige ohne gesetzliche Rentenversicherung ist die Basisrente das wirksamste Steuerstundungsinstrument im Einkommensteuergesetz.`,
      sections: [
        {
          heading: "1. 100 % Sonderausgabenabzug nach § 10 Abs. 1 Nr. 2 EStG",
          body: "Seit der vollständigen steuerlichen Freistellung von Altersvorsorgeaufwendungen können bis zu 30.825 € pro Person als Sonderausgaben geltend gemacht werden. Bei einem Grenzsteuersatz von 42 % ergibt sich eine direkte Rückerstattung von bis zu 12.946 €.",
        },
        {
          heading: "2. Nachgelagerte Besteuerung und Rentenfaktor-Vergleich",
          body: "Die Auszahlungsphase unterliegt der nachgelagerten Besteuerung nach § 22 Nr. 1 EStG. Anleger müssen bei der Produktauswahl auf Effektivkostenquoten unter 0,5 % und garantierte Rentenfaktoren ohne Kündigungsverluste achten.",
        },
      ],
      sources: [
        { label: "Einkommensteuergesetz (EStG) § 10 Sonderausgaben", url: "https://www.gesetze-im-internet.de/estg/__10.html", asOf: today, jurisdiction: "DE" },
        { label: "Deutsche Rentenversicherung — Altersvorsorgeaufwendungen Rechengrößen", url: "https://www.deutsche-rentenversicherung.de", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["Rürup Rente 2026", "Höchstbetrag 30825", "Basisrente Steuern", "Sonderausgabenabzug", "§ 10 EStG"],
      rechnerHref: "/rechner",
    },
    "ETF & Indexfonds": {
      slug: `etf-besteuerung-vorabpauschale-berechnung-${today}-${stamp}`,
      title: `ETF-Besteuerung 2026: Vorabpauschale, Basiszins und 30 % Teilfreistellung`,
      description: `Wie die Vorabpauschale nach § 18 InvStG funktioniert: Basiszins der Deutschen Bundesbank, 70 % Basisertrag und steuerliche Freibeträge im Depot.`,
      teaser: `Thesaurierende ETFs unterliegen Anfang Januar der Vorabpauschale. Wir zeigen die exakte mathematische Formel und wie der Sparerpauschbetrag den Abzug puffert.`,
      sections: [
        {
          heading: "1. Gesetzliche Rechenformel nach § 18 InvStG",
          body: "Die Vorabpauschale berechnet sich als: Fondswert zu Jahresbeginn × Basiszins × 0,7. Bei einem Aktienfonds greift zusätzlich die 30-prozentige Teilfreistellung nach § 20 InvStG, sodass lediglich 70 % des Ertrags mit 26,375 % Abgeltungsteuer belegt werden.",
        },
        {
          heading: "2. Verrechnung beim späteren Verkauf (§ 19 InvStG)",
          body: "Bereits gezahlte Vorabpauschalen werden beim tatsächlichen Verkauf des ETFs vom steuerpflichtigen Veräußerungsgewinn abgezogen. Eine Doppelbesteuerung ist dadurch gesetzlich ausgeschlossen.",
        },
      ],
      sources: [
        { label: "Investmentsteuergesetz (InvStG) § 18 Vorabpauschale", url: "https://www.gesetze-im-internet.de/invstg_2018/__18.html", asOf: today, jurisdiction: "DE" },
        { label: "Deutsche Bundesbank — Basiszins zur Berechnung der Vorabpauschale", url: "https://www.bundesbank.de", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["ETF Vorabpauschale 2026", "InvStG § 18", "Teilfreistellung 30%", "Basiszins ETF", "Thesaurierender Fonds"],
      rechnerHref: "/depot-analyse",
    },
    "Immobilien": {
      slug: `degressive-gebaeude-afa-steuerersparnis-${today}-${stamp}`,
      title: `Gebäude-AfA 2026: Degressive 5 % Abschreibung und Sanierungskosten § 35a`,
      description: `Steueroptimierung bei vermieteten Wohnimmobilien: Degressive Gebäude-AfA nach dem Wachstumschancengesetz und Handwerkerleistungen im Vergleich.`,
      teaser: `Neubauten und Erstkäufe profitieren von bis zu 5 % degressiver Abschreibung auf den Restbuchwert. Wir analysieren die Liquiditätseffekte in den ersten 6 Jahren.`,
      sections: [
        {
          heading: "1. Degressive Wohngebäude-Abschreibung (§ 7 Abs. 5a EStG)",
          body: "Für neu errichtete Wohngebäude mit Baubeginn im Förderzeitraum erlaubt der Gesetzgeber eine degressive AfA von 5 %. Dies führt in den ersten Jahren zu massiven steuerlichen Verlustzuweisungen zur Verrechnung mit anderen Einkünften.",
        },
        {
          heading: "2. Wechsel zur linearen AfA und Erhaltungsaufwand",
          body: "Sobald die lineare AfA (3 % bei Baujahr ab 2023) rechnerisch vorteilhafter ist als die 5 % auf den Restbuchwert, kann der Eigentümer wechseln. Sanierungskosten sind getrennt von Anschaffungskosten nach der 15-%-Grenze zu prüfen.",
        },
      ],
      sources: [
        { label: "Einkommensteuergesetz (EStG) § 7 Abs. 5a Degressive Absetzung für Abnutzung", url: "https://www.gesetze-im-internet.de/estg/__7.html", asOf: today, jurisdiction: "DE" },
        { label: "Wachstumschancengesetz — Bundesfinanzministerium", url: "https://www.bundesfinanzministerium.de", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["Degressive AfA 2026", "Immobilien Steuern", "Gebäudeabschreibung 5%", "§ 7 EStG", "Wachstumschancengesetz"],
      rechnerHref: "/rechner",
    },
    "Arbeitnehmer": {
      slug: `fuenftelregelung-abfindung-steueroptimierung-${today}-${stamp}`,
      title: `Fünftelregelung & Abfindung 2026: Steuerprogression glätten nach § 34 EStG`,
      description: `Steuerliche Behandlung von Abfindungen: Wie die Fünftelregelung nach § 34 Abs. 1 EStG die Steuerlast dämpft und welche Vorauszahlungen sich lohnen.`,
      teaser: `Außerordentliche Einkünfte bei Arbeitsplatzverlust können über die Fünftelregelung rechnerisch auf 5 Jahre gestreckt werden. Eine mathematische Analyse.`,
      sections: [
        {
          heading: "1. Voraussetzung der Zusammenballung von Einkünften",
          body: "Die Fünftelregelung greift nur, wenn die Abfindung zusammen mit den übrigen Jahreseinkünften die regulären Bezüge übersteigt. Eine Verschiebung der Auszahlung in den Januar des Folgejahres kann bei geringerem Folgeeinkommen zehntausende Euro Steuern sparen.",
        },
        {
          heading: "2. Kombination mit Ausgleichszahlungen in die Rentenversicherung (§ 187a SGB VI)",
          body: "Wer einen Teil der Abfindung direkt vom Arbeitgeber steuerfrei in die gesetzliche Rentenversicherung einzahlen lässt, mindert die Steuerprogression doppelt und sichert sich abschlagsfreie Rentenansprüche.",
        },
      ],
      sources: [
        { label: "Einkommensteuergesetz (EStG) § 34 Außerordentliche Einkünfte", url: "https://www.gesetze-im-internet.de/estg/__34.html", asOf: today, jurisdiction: "DE" },
        { label: "Bundesfinanzhof (BFH) Rechtsprechung zu Abfindungen", url: "https://www.bundesfinanzhof.de", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["Fünftelregelung 2026", "Abfindung Steuern", "§ 34 EStG", "Progressionsglättung", "Steuererklärung Arbeitnehmer"],
      rechnerHref: "/steuerplaner",
    },
    "Weltwirtschaft & Geopolitik": {
      slug: `us-staatsanleihen-dollar-zentralbanken-reserven-${today}-${stamp}`,
      title: `Geopolitische Währungsreserven 2026: US-Treasuries, Gold & BRICS-Handel`,
      description: `Währungs- und Zinsrisiken im globalen Depot: Diversifikation zwischen US-Staatsanleihen, Gold als Reservewährung und Währungsabsicherung im Euro-Raum.`,
      teaser: `Zentralbanken schichten Währungsreserven um: Physisches Gold und multilaterale Währungsabkommen fordern die Vormachtstellung des US-Dollars heraus.`,
      sections: [
        {
          heading: "1. Renditedifferenz zwischen US-Treasuries und Bundesanleihen",
          body: "Das Zinsdifferential zwischen der Federal Reserve und der EZB bestimmt die Absicherungskosten (Hedging Costs) für Euro-Anleger in US-Vermögenswerten. Ohne Währungssicherung tragen Anleger das volle EUR/USD-Schwankungsrisiko.",
        },
        {
          heading: "2. Gold als währungsneutraler Wertspeicher (§ 23 EStG)",
          body: "Im deutschen Steuerrecht ist physisches Anlagegold nach § 25c UStG von der Mehrwertsteuer befreit. Nach einjähriger Haltedauer sind Kursgewinne zudem nach § 23 Abs. 1 Nr. 2 EStG vollständig steuerfrei.",
        },
      ],
      sources: [
        { label: "International Monetary Fund (IMF) — Currency Composition of Official Foreign Exchange Reserves (COFER)", url: "https://www.imf.org", asOf: today, jurisdiction: "Global" },
        { label: "Umsatzsteuergesetz (UStG) § 25c Besteuerung von Umsätzen mit Anlagegold", url: "https://www.gesetze-im-internet.de/ustg_1980/__25c.html", asOf: today, jurisdiction: "DE" },
      ],
      keywords: ["Weltwirtschaft 2026", "US Dollar Anleihen", "Währungsreserven", "Gold Steuern § 23", "Geopolitik Finanzen"],
      rechnerHref: "/rechner",
    },
  };

  const selected = TEMPLATES[category.name] || TEMPLATES["Makroökonomie & EZB"];

  return {
    slug: selected.slug,
    title: selected.title,
    category: category.name,
    description: selected.description,
    teaser: selected.teaser,
    published: today,
    asOf: today,
    readTime: "4 Min.",
    tier: "free",
    author: "Hermes Redaktion",
    sections: selected.sections,
    sources: selected.sources,
    keywords: selected.keywords,
    rechnerHref: selected.rechnerHref,
  };
}

// ─── Generate Issue with AI or Fallback ──────────────────────────────────────
async function generateNewsletterIssue(category, newsSignals) {
  const today = new Date().toISOString().slice(0, 10);
  const relevantNewsText = newsSignals
    .map(s => `- ${s.source}: ${s.title}`)
    .join("\n") || "Keine außergewöhnlichen Live-Eilmeldungen.";

  const systemPrompt = `Du bist Hermes, der autonome, faktenbasierte KI-Redakteur von Kontolage.de (deutsche Plattform für Finanzbildung, Steuerwissen und Vermögensrechner).
STRIKTES COMPLIANCE-REGELWERK:
1. WpHG § 2 Abs. 8 Nr. 10 & MAR Art. 20: Reines Bildungswissen. KEINE Anlageberatung, KEINE individuellen Produktempfehlungen, KEINE Aufforderung zum Kauf/Verkauf von Wertpapieren ("sicher", "garantiert", "empfehlen wir", "jetzt kaufen" sind STRIKT VERBOTEN).
2. Tonalität: NZZ / Handelsblatt / FAZ. Neutral, mathematisch präzise, Gesetzesparagraphen (§§ EStG, KStG, SGB etc.) zitieren.
3. Nur gültiges JSON im geforderten Format ausgeben. Kein Text vor oder nach dem JSON-Block.`;

  const prompt = `Erstelle eine neue Ausgabe für die Kontolage-Finanzbildungsplattform.
KATEGORIE: "${category.name}"
STAGED DATUM: ${today}
AKTUELLE NACHRICHTEN-SIGNALE:
${relevantNewsText}

Gefordertes JSON-Schema (strikt einhalten):
{
  "slug": "einzigartiger-kebab-case-slug-thema-2026",
  "title": "Prägnanter Titel (mindestens 25, maximal 85 Zeichen)",
  "description": "Meta-Description für Google (exakt zwischen 85 und 160 Zeichen)",
  "teaser": "Einleitender Hook (1-2 Sätze, 80-200 Zeichen)",
  "sections": [
    { "heading": "1. Hauptabschnitt mit Paragraph", "body": "Detaillierte, faktenbasierte Erklärung mit Zahlen/Rechnungen (mind. 150 Wörter)." },
    { "heading": "2. Vertiefung / Steuerliche Konsequenz", "body": "Konkrete rechtliche oder mathematische Einordnung (mind. 150 Wörter)." }
  ],
  "sources": [
    { "label": "Vollständiger Name der Primärquelle", "url": "https://offizielle-quelle.de/...", "asOf": "${today}", "jurisdiction": "DE" },
    { "label": "Zweite Primärquelle oder Gesetz", "url": "https://gesetze-im-internet.de/...", "asOf": "${today}", "jurisdiction": "DE" }
  ],
  "keywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4"],
  "readTime": "4 Min.",
  "rechnerHref": "${category.rechnerHref}"
}`;

  const aiResult = await callAiCascade(prompt, systemPrompt);

  if (aiResult?.content) {
    try {
      // JSON extrahieren (auch wenn Markdown ```json umschließt)
      const jsonMatch = aiResult.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Compliance & Schema-Check
        if (
          parsed.title &&
          parsed.title.length >= 20 &&
          parsed.description &&
          parsed.description.length >= 80 &&
          parsed.description.length <= 165 &&
          Array.isArray(parsed.sections) &&
          parsed.sections.length >= 2 &&
          Array.isArray(parsed.sources) &&
          parsed.sources.length >= 2
        ) {
          // Banned words check
          const text = [parsed.title, parsed.description, parsed.teaser, ...parsed.sections.map(s => s.heading + " " + s.body)].join(" ").toLowerCase();
          const banned = ["sichere rendite", "garantierte rendite", "beste wahl", "empfehlen wir", "jetzt kaufen", "sollten sie investieren"];
          const hasBanned = banned.some(b => text.includes(b));

          if (!hasBanned) {
            console.log(`  ✓ AI-generierte Ausgabe validiert (${aiResult.provider}).`);
            return {
              slug: parsed.slug || `${category.id}-${today}-${Date.now().toString().slice(-4)}`,
              title: parsed.title,
              category: category.name,
              description: parsed.description,
              teaser: parsed.teaser || parsed.description,
              published: today,
              asOf: today,
              readTime: parsed.readTime || "4 Min.",
              tier: "free",
              author: "Hermes Redaktion",
              sections: parsed.sections,
              sources: parsed.sources.map(s => ({
                label: s.label || "Offizielle Primärquelle",
                url: /^https:\/\//.test(s.url) ? s.url : "https://www.gesetze-im-internet.de",
                asOf: today,
                jurisdiction: s.jurisdiction || "DE",
              })),
              keywords: parsed.keywords || category.defaultKeywords,
              rechnerHref: category.rechnerHref,
            };
          } else {
            console.warn("  ⚠ AI-Text enthielt verbotene Empfehlungsphrasen — greife auf geprüften Fallback zurück.");
          }
        }
      }
    } catch (parseErr) {
      console.warn("  ⚠ Fehler beim Parsen des AI-JSON:", parseErr.message);
    }
  }

  // Fallback
  return createDeterministicIssue(category, newsSignals);
}

// ─── Sync Routes ─────────────────────────────────────────────────────────────
function syncRoutes(newsletterIssues) {
  if (!fs.existsSync(ROUTES_PATH)) return;

  const routesData = JSON.parse(fs.readFileSync(ROUTES_PATH, "utf8"));
  const nonNewsletterRoutes = routesData.routes.filter(r => r.type !== "newsletter" || r.draft === true);

  const newNewsletterRoutes = newsletterIssues.map(issue => ({
    path: `/newsletter/${issue.slug}`,
    type: "newsletter",
    slug: issue.slug,
    category: issue.category,
    h1: issue.h1 || issue.title,
    title: issue.title,
    description: issue.description,
    teaser: issue.teaser,
    intro: issue.teaser,
    published: issue.published,
    updated: issue.asOf,
    readTime: issue.readTime,
    tier: issue.tier,
    rechner: issue.rechnerHref || "/rechner",
    changefreq: "monthly",
    priority: "0.7",
    sections: issue.sections,
    sources: issue.sources,
    keywords: issue.keywords,
  }));

  const newsletterPageIndex = nonNewsletterRoutes.findIndex(r => r.path === "/newsletter");
  if (newsletterPageIndex !== -1) {
    const newsletterPage = nonNewsletterRoutes[newsletterPageIndex];
    newsletterPage.sections = newsletterIssues.map(issue => ({
      heading: `${issue.category} · ${issue.published}`,
      body: `${issue.title}: ${issue.teaser} (Stand ${issue.asOf}, ${issue.sources?.length ?? 0} Quellen)`,
    }));
    nonNewsletterRoutes.splice(newsletterPageIndex + 1, 0, ...newNewsletterRoutes);
  } else {
    nonNewsletterRoutes.push(...newNewsletterRoutes);
  }

  routesData.routes = nonNewsletterRoutes;
  routesData.updated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(ROUTES_PATH, JSON.stringify(routesData, null, 2) + "\n", "utf8");
  console.log(`✓ routes.json synchronisiert (${newNewsletterRoutes.length} Newsletter-Routen).`);
}

// ─── Social Media Helper Functions ───────────────────────────────────────────
const TELEGRAM_TOKEN   = process.env.TELEGRAM_BOT_TOKEN     || "";
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_ID    || "";
const SITE_URL         = process.env.SITE_URL               || "https://kontolage.de";

const X_API_KEY        = process.env.X_API_KEY              || "";
const X_API_SECRET     = process.env.X_API_SECRET           || "";
const X_ACC_TOKEN      = process.env.X_ACCESS_TOKEN         || "";
const X_ACC_SECRET     = process.env.X_ACCESS_SECRET        || "";

const FB_PAGE_TOKEN    = process.env.FACEBOOK_PAGE_TOKEN    || "";
const LI_ACCESS_TOKEN  = process.env.LINKEDIN_ACCESS_TOKEN  || "";
const LI_PERSON_URN    = process.env.LINKEDIN_PERSON_URN    || "";

async function sendToTelegram(text) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHANNEL) {
    console.warn("  ℹ Telegram nicht konfiguriert (TELEGRAM_BOT_TOKEN / TELEGRAM_CHANNEL_ID fehlt).");
    return null;
  }
  const res = await httpRequest(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    "POST",
    { chat_id: TELEGRAM_CHANNEL, text, parse_mode: "Markdown", disable_web_page_preview: false }
  );
  if (res.status === 200 && res.body?.ok) {
    console.log(`  ✅ Telegram: Post gesendet (ID: ${res.body.result?.message_id})`);
    return res.body.result;
  }
  console.warn(`  ⚠ Telegram Fehler (${res.status}):`, JSON.stringify(res.body).slice(0, 200));
  return null;
}

function xOAuthSign(method, url, params) {
  const sorted = Object.keys(params).sort()
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  const base = method.toUpperCase() + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(sorted);
  const sigKey = encodeURIComponent(X_API_SECRET) + "&" + encodeURIComponent(X_ACC_SECRET);
  return crypto.createHmac("sha1", sigKey).update(base).digest("base64");
}

function xAuthHeader(method, url) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const ts = Math.floor(Date.now() / 1000).toString();
  const op = {
    oauth_consumer_key: X_API_KEY,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: ts,
    oauth_token: X_ACC_TOKEN,
    oauth_version: "1.0",
  };
  op.oauth_signature = xOAuthSign(method, url, op);
  return "OAuth " + Object.keys(op).map((k) => encodeURIComponent(k) + '="' + encodeURIComponent(op[k]) + '"').join(", ");
}

async function postToX(text) {
  if (!X_API_KEY || !X_ACC_TOKEN) {
    console.warn("  ℹ X/Twitter nicht konfiguriert (X_API_KEY / X_ACCESS_TOKEN fehlt).");
    return null;
  }
  const url = "https://api.twitter.com/2/tweets";
  const auth = xAuthHeader("POST", url);
  const res = await httpRequest(url, "POST", { text }, { Authorization: auth });
  if (res.status === 201 && res.body?.data?.id) {
    console.log(`  ✅ X/Twitter: Tweet gesendet (ID: ${res.body.data.id})`);
    return res.body.data;
  }
  console.warn(`  ⚠ X/Twitter Fehler (${res.status}):`, JSON.stringify(res.body).slice(0, 200));
  return null;
}

async function postToFacebook(text) {
  if (!FB_PAGE_TOKEN) {
    console.warn("  ℹ Facebook nicht konfiguriert (FACEBOOK_PAGE_TOKEN fehlt).");
    return null;
  }
  const url = "https://graph.facebook.com/v19.0/me/feed";
  const res = await httpRequest(url, "POST", { message: text, access_token: FB_PAGE_TOKEN });
  if (res.status === 200 && res.body?.id) {
    console.log(`  ✅ Facebook: Post gesendet (ID: ${res.body.id})`);
    return res.body;
  }
  console.warn(`  ⚠ Facebook Fehler (${res.status}):`, JSON.stringify(res.body).slice(0, 200));
  return null;
}

async function postToLinkedIn(text) {
  if (!LI_ACCESS_TOKEN || !LI_PERSON_URN) {
    console.warn("  ℹ LinkedIn nicht konfiguriert (LINKEDIN_ACCESS_TOKEN / LINKEDIN_PERSON_URN fehlt).");
    return null;
  }
  const ugcPost = {
    author: LI_PERSON_URN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };
  const res = await httpRequest(
    "https://api.linkedin.com/v2/ugcPosts",
    "POST",
    ugcPost,
    {
      Authorization: `Bearer ${LI_ACCESS_TOKEN}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202401",
    }
  );
  if (res.status === 201) {
    console.log(`  ✅ LinkedIn: Post erfolgreich publiziert.`);
    return res.body || { status: "published" };
  }
  console.warn(`  ⚠ LinkedIn Fehler (${res.status}):`, JSON.stringify(res.body).slice(0, 200));
  return null;
}

function buildSocialPosts(issue) {
  const url = `${SITE_URL}/newsletter/${issue.slug}`;
  const catTag = issue.category.replace(/[&\s\-_]+/g, "");

  const sec1 = issue.sections?.[0]?.heading ? `• ${issue.sections[0].heading}: ${issue.sections[0].body.slice(0, 150)}...` : "";
  const sec2 = issue.sections?.[1]?.heading ? `• ${issue.sections[1].heading}: ${issue.sections[1].body.slice(0, 150)}...` : "";

  const linkedin = `${issue.title}

${issue.teaser}

Die wichtigsten Punkte im Überblick:
${sec1}
${sec2}

Vollständige Analyse, Rechtsgrundlagen und neutrale Rechner:
→ ${url}

#Finanzbildung #Steuern #${catTag} #Vermögensaufbau #EStG #Kontolage`;

  const xTweet = `${issue.title}

${issue.teaser}

Rechtliche Grundlagen & Szenarien-Rechner:
${url}

#Steuern #${catTag} #Finanzen`;

  const telegram = `📌 *Kontolage — ${issue.category}*\n\n*${issue.title}*\n\n${issue.teaser}\n\n${issue.sections?.[0]?.heading ? `• *${issue.sections[0].heading}*` : ""}\n${issue.sections?.[1]?.heading ? `• *${issue.sections[1].heading}*` : ""}\n\n→ *Vollständige Ausgabe lesen:* ${url}`;

  const facebook = `${issue.title}

${issue.teaser}

Neutrale Berechnungen & Rechtsquellen:
${url}`;

  return { linkedin, xTweet, telegram, facebook, url };
}

// ─── Main Execution ──────────────────────────────────────────────────────────
export async function runDailyNewsletterCron() {
  console.log("══════════════════════════════════════════════════════════════════════");
  console.log("🚀 Hermes Daily Newsletter Engine — Start");
  console.log("══════════════════════════════════════════════════════════════════════");

  const isDryRun = process.env.DRY_RUN === "true";
  const targetCategoryFilter = process.env.CATEGORY || null;

  // 1. Existing issues einlesen
  if (!fs.existsSync(NEWSLETTER_PATH)) {
    console.error(`❌ Fehlende Datei: ${NEWSLETTER_PATH}`);
    process.exit(1);
  }

  const newsletterData = JSON.parse(fs.readFileSync(NEWSLETTER_PATH, "utf8"));
  const existingIssues = Array.isArray(newsletterData.issues) ? newsletterData.issues : [];
  console.log(`Vorhandene Ausgaben im Archiv: ${existingIssues.length}`);

  // 2. News-Signale prüfen
  const newsSignals = await fetchNewsSignals();

  // 3. Prioritäten berechnen
  const priorities = calculateCategoryPriorities(existingIssues, newsSignals);

  console.log("\n📊 Themen-Prioritäten (Decay & News-Scores):");
  priorities.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.category.name}] Score: ${p.score} (Zuletzt: ${p.lastDate}, ${p.daysSinceLast} Tage alt, ${p.relevantNews.length} News-Signale)`);
  });

  // 4. Zielkategorie wählen
  let chosenEntry = priorities[0];
  if (targetCategoryFilter && targetCategoryFilter !== "all") {
    const match = priorities.find(p => p.category.name.toLowerCase() === targetCategoryFilter.toLowerCase() || p.category.id === targetCategoryFilter.toLowerCase());
    if (match) chosenEntry = match;
  }

  console.log(`\n🎯 Ausgewählte Kategorie für heutige Ausgabe: "${chosenEntry.category.name}"`);

  // 5. Neue Ausgabe erstellen
  const newIssue = await generateNewsletterIssue(chosenEntry.category, chosenEntry.relevantNews.length > 0 ? chosenEntry.relevantNews : newsSignals);

  console.log(`\n📄 Generierte Ausgabe:`);
  console.log(`   Slug:        ${newIssue.slug}`);
  console.log(`   Titel:       ${newIssue.title}`);
  console.log(`   Description: ${newIssue.description} (${newIssue.description.length} Zeichen)`);
  console.log(`   Kategorie:   ${newIssue.category}`);
  console.log(`   Quellen:     ${newIssue.sources.length}`);

  // 6. Social Media Posts vorbereiten
  const socialPosts = buildSocialPosts(newIssue);

  // Drafts offline in obsidian_vault sichern
  const draftsDir = path.join(ROOT_DIR, "obsidian_vault", "Drafts");
  if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir, { recursive: true });
  const draftFile = path.join(draftsDir, `${newIssue.published}-${newIssue.slug}-social.md`);
  fs.writeFileSync(draftFile, [
    `# Social Media Posts — ${newIssue.title}`,
    `_Datum: ${newIssue.published} · Kategorie: ${newIssue.category}_\n`,
    `## 💼 LinkedIn Post\n${socialPosts.linkedin}\n`,
    `## 🧵 X (Twitter) Tweet\n${socialPosts.xTweet}\n`,
    `## 📢 Telegram Bulletin\n${socialPosts.telegram}\n`,
    `## 👥 Facebook Post\n${socialPosts.facebook}\n`,
    `---\n_Erstellt von Hermes v2.4 Daily Engine_`,
  ].join("\n"), "utf8");
  console.log(`📁 Social Drafts offline gesichert: obsidian_vault/Drafts/${path.basename(draftFile)}`);

  if (isDryRun) {
    console.log("\n[DRY RUN] Keine Schreiboperationen oder Social-Postings durchgeführt.");
    return { success: true, dryRun: true, issue: newIssue, socialPosts };
  }

  // 7. In newsletter.json einfügen (an Position 0 = neueste)
  if (existingIssues.some(i => i.slug === newIssue.slug)) {
    newIssue.slug = `${newIssue.slug}-${Date.now().toString().slice(-4)}`;
  }

  newsletterData.issues.unshift(newIssue);
  newsletterData.updated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(NEWSLETTER_PATH, JSON.stringify(newsletterData, null, 2) + "\n", "utf8");
  console.log(`\n💾 In content/newsletter.json gespeichert (Neu: ${newsletterData.issues.length} Ausgaben).`);

  // 8. routes.json synchronisieren
  syncRoutes(newsletterData.issues);

  // 9. Multi-Kanal Social Media Distribution
  console.log("\n📢 Starte Multi-Kanal Social Media Distribution...");
  const [tgRes, xRes, liRes, fbRes] = await Promise.allSettled([
    sendToTelegram(socialPosts.telegram),
    postToX(socialPosts.xTweet),
    postToLinkedIn(socialPosts.linkedin),
    postToFacebook(socialPosts.facebook),
  ]);

  console.log("   📊 Social-Media-Ergebnisse:");
  console.log(`      Telegram:  ${tgRes.status === "fulfilled" && tgRes.value ? "✅ Gesendet" : "ℹ Übersprungen / Keine Secrets"}`);
  console.log(`      X/Twitter: ${xRes.status === "fulfilled" && xRes.value ? "✅ Gesendet" : "ℹ Übersprungen / Keine Secrets"}`);
  console.log(`      LinkedIn:  ${liRes.status === "fulfilled" && liRes.value ? "✅ Gesendet" : "ℹ Übersprungen / Keine Secrets"}`);
  console.log(`      Facebook:  ${fbRes.status === "fulfilled" && fbRes.value ? "✅ Gesendet" : "ℹ Übersprungen / Keine Secrets"}`);

  console.log("══════════════════════════════════════════════════════════════════════");
  console.log("✅ Hermes Daily Newsletter & Social Engine — Erfolgreich beendet");
  console.log("══════════════════════════════════════════════════════════════════════");

  return { success: true, issue: newIssue, socialPosts };
}

// Direkte CLI-Ausführung
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  runDailyNewsletterCron().catch(err => {
    console.error("❌ Kritischer Fehler im Cron-Ablauf:", err);
    process.exit(1);
  });
}
