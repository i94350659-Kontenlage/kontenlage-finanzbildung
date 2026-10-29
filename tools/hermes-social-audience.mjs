/**
 * Hermes Social Audience & Thought-Leadership Playbook Engine v1.0
 *
 * Generiert zielgruppenspezifische Suchoperatoren, Lead-Filter und
 * fachlich fundierte Kommentar-Hooks für LinkedIn und X/Twitter, um
 * Kontolage bei High-Net-Worth-Zielgruppen (Einkommen 60k-200k €, GmbH-Chefs)
 * organisch in den Algorithmus ("Empfohlene Konten / Für dich") zu heben.
 *
 * Usage: node tools/hermes-social-audience.mjs [category]
 */

const TARGET_PERSONAS = [
  {
    name: "GmbH-Geschäftsführer & Holding-Gründer (Executive B2B Zielgruppe)",
    idealAbo: "Executive B2B (34,51 €/Monat inkl. MwSt., 29 € netto)",
    painPoints: ["Gewerbesteuer-Kürzung", "Verdeckte Gewinnausschüttung (vGA)", "1,54 % Schachtelprivileg § 8b KStG", "Thesaurierung"],
    linkedInSearchQueries: [
      'title:("Geschäftsführer" OR "Managing Director" OR "Inhaber") AND ("GmbH" OR "Holding") AND location:"Deutschland"',
      '"Holding" AND ("Steuern sparen" OR "Thesaurierung" OR "§ 8b KStG")',
    ],
    xTwitterSearchQueries: [
      '("Holding GmbH" OR "Spardosen GmbH" OR "8b KStG") lang:de',
      '("GmbH Geschäftsführer" OR "GGF Gehalt") lang:de',
    ],
    authorityCommentHook:
      "Spannender Punkt! Was in der Praxis häufig übersehen wird: Das Schachtelprivileg nach § 8b KStG greift zwar mit rechnerisch 1,54 % Ertragssteuer auf Aktiengewinne, die laufenden Fixkosten (E-Bilanz, Offenlegung, IHK) von ca. 2.500 € p.a. erfordern jedoch einen mathematischen Break-Even ab ca. 120.000 € Depotvolumen. Wir haben das 20-Jahres-Modell neutral durchgerechnet: https://kontolage.de/holding",
  },
  {
    name: "Besserverdiener & Freiberufler 60k–200k € (Pro Digital Zielgruppe)",
    idealAbo: "Pro Digital (10,71 €/Monat inkl. MwSt., 9 € netto)",
    painPoints: ["Grenzsteuersatz 42 %", "Kalte Progression", "Altersvorsorge-Sonderausgaben § 10 EStG", "Sparerpauschbetrag"],
    linkedInSearchQueries: [
      'title:("Senior Consultant" OR "Software Architect" OR "Rechtsanwalt" OR "Notar" OR "Arzt") AND location:"Deutschland"',
      '"Rürup" OR "Basisrente" OR "Sonderausgabenabzug" OR "Grenzsteuersatz"',
    ],
    xTwitterSearchQueries: [
      '("Rürup" OR "Basisrente" OR "30825") lang:de',
      '("Grenzsteuersatz" OR "Spitzensteuersatz" OR "42%") lang:de',
    ],
    authorityCommentHook:
      "Wichtige Ergänzung zum Sonderausgabenabzug 2026: Nach § 10 Abs. 1 Nr. 2 EStG sind Beiträge zur Basisrente mittlerweile zu 100 % absetzbar (Höchstbetrag 30.825 € pro Person, 61.650 € für Verheiratete). Bei 42 % Grenzsteuersatz federt das Finanzamt fast die Hälfte der Einzahlung ab. Neutraler Szenarien-Rechner ohne Vermittlungsprovision: https://kontolage.de/rechner",
  },
  {
    name: "Krypto-Investoren & Web3-Founders (Digital Assets Zielgruppe)",
    idealAbo: "Pro Digital & Executive B2B",
    painPoints: ["§ 23 EStG 1-Jahr-Haltefrist", "FIFO-Dokumentation", "Staking-Besteuerung", "MiCA-Regeln"],
    linkedInSearchQueries: [
      '"Krypto Steuern" OR "Bitcoin Haltefrist" OR "BMF Krypto"',
      'title:("Web3" OR "Blockchain" OR "Crypto") AND location:"Deutschland"',
    ],
    xTwitterSearchQueries: [
      '("Krypto Steuern" OR "Bitcoin Haltefrist" OR "§ 23 EStG") lang:de',
      '("BMF Schreiben Krypto" OR "FIFO Krypto") lang:de',
    ],
    authorityCommentHook:
      "Entscheidend für die Praxis: Die Jahresfrist nach § 23 Abs. 1 Satz 1 Nr. 2 EStG gilt weiterhin strikt wallet-bezogen nach der First-In-First-Out-Methode (FIFO). Wer nach 365 Tagen realisiert, zahlt 0,00 % Steuern. Wer innerhalb des Jahres verkauft, versteuert zum persönlichen Tarif (bis 45 %). Alle Details und BMF-Grundsätze im Überblick: https://kontolage.de/newsletter/krypto-haltefrist-23-estg-bmf-schreiben-2026",
  },
  {
    name: "Arbeitnehmer vor Kündigung / Aufhebungsvertrag (Steuerplaner)",
    idealAbo: "Executive B2B / Steuerplaner Pro",
    painPoints: ["Fünftelregelung § 34 EStG", "Zusammenballung von Einkünften", "Ausgleichszahlung § 187a SGB VI"],
    linkedInSearchQueries: [
      '"Abfindung" AND ("Fünftelregelung" OR "Aufhebungsvertrag" OR "Steuern")',
      'title:("Head of HR" OR "Betriebsrat" OR "Outplacement") AND location:"Deutschland"',
    ],
    xTwitterSearchQueries: [
      '("Abfindung" OR "Fünftelregelung" OR "Aufhebungsvertrag") lang:de',
    ],
    authorityCommentHook:
      "Wichtiger Steuertrick bei Abfindungen: Über die Auszahlung im Januar des Folgejahres (sofern das Folge-Einkommen geringer ist) oder eine direkte steuerfreie Einzahlung in die gesetzliche Rentenversicherung nach § 187a SGB VI lässt sich die Progression massiv brechen. Rechner und mathematische Progressionstabelle: https://kontolage.de/steuerplaner",
  },
];

console.log("══════════════════════════════════════════════════════════════════════");
console.log("🎯 Hermes Social Audience & Thought-Leadership Playbook");
console.log("══════════════════════════════════════════════════════════════════════\n");

console.log("💡 WIE SIE MIT DIESEM PLAYBOOK DEM ALGORITHMUS VORGESCHLAGEN WERDEN:");
console.log("   Statt Bot-Following (das zu Accountsperren führt): Nutzen Sie die");
console.log("   5-Minuten-Thought-Leadership-Methode. Posten Sie fundierte Kommentare");
console.log("   unter viralen Beiträgen von Handelsblatt, FAZ, Finanztip oder B2B-Influencern.");
console.log("   Der Algorithmus platziert Ihren Kommentar ganz oben, und Dutzende Geschäftsführer");
console.log("   besuchen Ihr Profil und abonnieren Kontolage.\n");

TARGET_PERSONAS.forEach((p, idx) => {
  console.log(`──────────────────────────────────────────────────────────────────────`);
  console.log(`📌 Zielgruppe ${idx + 1}: ${p.name}`);
  console.log(`   Empfohlenes Kontolage-Produkt: ${p.idealAbo}`);
  console.log(`   Kern-Pain-Points: ${p.painPoints.join(" · ")}`);
  console.log(`\n   🔍 LinkedIn-Suchoperatoren (in LinkedIn-Suchleiste eingeben):`);
  p.linkedInSearchQueries.forEach(q => console.log(`      → ${q}`));
  console.log(`\n   🐦 X/Twitter-Suchoperatoren (in X-Suchleiste eingeben):`);
  p.xTwitterSearchQueries.forEach(q => console.log(`      → ${q}`));
  console.log(`\n   💬 Fertiger Experten-Kommentar (zum Kopieren & Einfügen):`);
  console.log(`      "${p.authorityCommentHook}"\n`);
});

console.log("══════════════════════════════════════════════════════════════════════");
console.log("✅ Playbook bereit. Täglich 1-2 Kommentare genügen für organischen B2B-Traffic.");
console.log("══════════════════════════════════════════════════════════════════════");
