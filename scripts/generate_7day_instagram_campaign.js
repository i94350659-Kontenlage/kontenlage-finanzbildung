const fs = require('fs');
const path = require('path');

const targetDir = path.join('G:', 'Scratch´nTravel', 'social_drafts');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const outputMdPath = path.join(targetDir, '7_tage_instagram_kampagne_scratch_n_travel.md');
const outputJsonPath = path.join(targetDir, '7_tage_instagram_kampagne.json');

const campaignDays = [
  {
    day: 1,
    theme: "Secret Spot Portugal — Sintra & Praia da Ursa",
    type: "Carousel (5 Slides)",
    hook: "Der geheime Klippenpfad in Portugal, den 99% der Touristen übersehen 🌊",
    visual_prompt: "Moody dramatic golden hour photography of rugged sea cliffs at Praia da Ursa Portugal, Atlantic ocean mist, solitary hiker with backpack and dog, photorealistic cinematic 8k, warm gold and deep navy tones",
    slides: [
      {
        slide: 1,
        headline: "Der geheime Klippenpfad in Sintra 🌊",
        subline: "Kein Reisebus. Keine Souvenir-Stände. Nur wilde Natur."
      },
      {
        slide: 2,
        headline: "Der Pfad: Praia da Ursa",
        body: "• Abstieg: ca. 25 Min. über schmale Naturstufen (Schwierigkeit 3/5)\n• Fester Schotter & Klippenblick\n• Nur mit festem Schuhwerk begehbar!"
      },
      {
        slide: 3,
        headline: "Hunde- & Familien-Check 🐕👶",
        body: "• Hunde: Erlaubt & liebend gern gesehen (Wasserquelle 300m oberhalb)\n• Kinderwagen: Nicht befahrbar — Kraxe oder Babytrage zwingend erforderlich!"
      },
      {
        slide: 4,
        headline: "Exakte GPS-Geokoordinaten",
        body: "📍 38°47'24\"N · 9°25'03\"W\nKostenlos freischaltbar auf der Scratch'n'Travel Map mit 1-Klick Google Maps Routenführung."
      },
      {
        slide: 5,
        headline: "Bereit für dein nächstes Abenteuer?",
        body: "🎁 Sichere dir den gestickten Sintra-Patch + 10% Rabatt auf deine weltweite Reise-eSIM mit Code SCRATCH10.\n👉 Link in Bio!"
      }
    ],
    caption: `Du willst Orte sehen, die sich anfühlen wie das Ende der Welt? 🌊

Vergiss überfüllte Aussichtspunkte. Die Praia da Ursa an der portugiesischen Atlantikküste ist über einen unmarkierten Klippenpfad erreichbar. Wilder Fels, tosendes Meer und null Massentourismus.

📊 Spot-Fakten:
• Schwierigkeit: Stufe 3/5 (Trittsicherheit nötig)
• Hunde: 🐕 Sehr gut machbar (ausreichend Trinkwasser mitnehmen!)
• Kinderwagen: 👶 Nicht tauglich (nur Babytrage)
• GPS: 38°47'24"N · 9°25'03"W

🗺️ Die genaue Route & Turn-by-Turn Navi gibt es in unserem interaktiven Reisepass.
🎁 Code 'SCRATCH10' im Reisepass eingeben für 10% Rabatt auf deine Reise-eSIM!

👉 Link in der Bio: @scratchntravel

#scratchntravel #secretspotsportugal #sintralovers #wandernmithund #offbeatplaces #travelhacks2026 #portugaltravel`,
    hashtags: ["#scratchntravel", "#secretspots", "#sintra", "#portugaltravel", "#wandernmithund", "#travelsecrets", "#hiddengems"]
  },
  {
    day: 2,
    theme: "Physischer Merch — Der gestickte Entdecker-Patch",
    type: "Reel / Foto-Post",
    hook: "Digitale Fotos verstauben auf der Festplatte. Echte Abenteuer gehören auf deinen Rucksack 🎒",
    visual_prompt: "Close-up macro shot of a luxury embroidered travel patch on a rugged cordura tactical travel backpack, metallic gold thread embroidery showing a compass rose and cliff silhouette, luxury obsidian aesthetic, depth of field",
    slides: [
      {
        slide: 1,
        headline: "Warum ein virtueller Like nicht reicht 🪙",
        subline: "Deine Reise-Erinnerungen zum Anfassen."
      },
      {
        slide: 2,
        headline: "300 DPI Handwerkskunst",
        body: "• Hochwertiger Kettelrand (Merrowed Border)\n• Klett-Rückseite (Velcro Hook & Loop) oder zum Aufbügeln\n• Gold- und Obsidian-Farbfäden, extrem wetterfest"
      },
      {
        slide: 3,
        headline: "Nur für echte Entdecker",
        body: "Jeder Patch repräsentiert einen freigeschalteten Meilenstein oder ein reales Reiseziel aus deiner WanderBond-DNA."
      },
      {
        slide: 4,
        headline: "Hol dir dein erstes Artefakt",
        body: "📦 Klimaneutraler Versand (€ 3,90 / frei ab € 60,-)\n🎁 10% Neukunden-Vorteil auf deinen ersten Patch!"
      }
    ],
    caption: `Wie oft schaust du dir die 4.000 Fotos auf deinem Smartphone wirklich an? 📱❌

Wir finden: Echte Abenteuer verdienen ein physisches Symbol.
Unsere gestickten Scratch'n'Travel Patches werden aus wetterfestem Garn mit goldenem Kettelrand gefertigt. Perfekt für deinen Rucksack, deine Van-Verkleidung oder deine Jacke.

Jedes Mal, wenn du deinen Rucksack packst, siehst du, wo du schon warst.

🎒 460+ limitierte Badges verfügbar
🚚 Versand in 3–5 Werktagen
🎁 10% Rabatt für neue Explorer

👉 Hol dir dein Artefakt im Shop — Link in Bio!

#scratchntravel #travelmerch #backpackinglife #travelgear #wanderlust #explorerpatch #outdoorcommunity`,
    hashtags: ["#scratchntravel", "#travelpatch", "#backpacking", "#travelgear", "#patches", "#outdoorstyle"]
  },
  {
    day: 3,
    theme: "Reise-Hack: Roaming-Fallen & Notfall-eSIM",
    type: "Carousel (4 Slides)",
    hook: "300 € Handyrechnung nach dem Urlaub? Wie du Roaming-Gebühren ein für alle Mal beendest 📶",
    visual_prompt: "Modern iPhone displaying an active eSIM connectivity screen with green bars, beautiful mountain cliff landscape in background, clean crisp tech travel aesthetic",
    slides: [
      {
        slide: 1,
        headline: "Der teuerste Fehler auf Reisen 💸",
        subline: "Einmal im Nicht-EU-Ausland Datenroaming angelassen..."
      },
      {
        slide: 2,
        headline: "Kein SIM-Karten-Gefummel mehr",
        body: "• Früher: Am Flughafen Plastikkarten kaufen und Büroklammer suchen\n• Heute: Digitale eSIM vor Abflug per QR-Code einscannen\n• Sofort online in 190+ Ländern!"
      },
      {
        slide: 3,
        headline: "Sicherheit auf unmarkierten Trails",
        body: "Gerade auf Secret Spots und Klippenpfaden brauchst du stabiles GPS und Netz für Notfall-Karten. Offline-Karten allein reichen im Notfall nicht."
      },
      {
        slide: 4,
        headline: "Exklusiv für unsere Community",
        body: "Sichere dir 10% Rabatt auf dein Datenpaket mit Code: SCRATCH10\nIn 60 Sekunden auf deinem iPhone oder Android aktiv."
      }
    ],
    caption: `Wer kennt es? Kaum landet man in der Schweiz, in England oder Asien, ploppt die SMS auf: 'Willkommen! 1 MB kostet 1,49 €...' 😱

Mit einer Reise-eSIM gehört das der Vergangenheit an:
1. QR-Code scannen
2. Lokales Datenpaket aktivieren
3. Entspannt navigieren, Trail-Tracks laden und Bilder posten — ohne Roaming-Kosten!

💡 Unser Community-Vorteil für dich:
Gib im Checkout einfach den Gutscheincode **SCRATCH10** ein und spare 10% auf deine globale Reise-eSIM!

👉 Link in Bio → Reiter 'Safety Radar & eSIM'

#travelhacks #esim #nomadlife #travelsmart #digitalnomad #reisetagebuch #scratchntravel`,
    hashtags: ["#travelhacks", "#esim", "#digitalnomad", "#traveltips", "#smarttravel", "#scratchntravel"]
  },
  {
    day: 4,
    theme: "Familien & Kinderwagen — Seiser Alm Panoramaweg",
    type: "Carousel (5 Slides)",
    hook: "Alpen-Panorama auf 2.000m — und 100% kinderwagentauglich? Ja, das gibt es! 👶🏔️",
    visual_prompt: "A young family with an all-terrain stroller walking along a scenic wooden boardwalk path on the Seiser Alm Dolomites, jagged mountain peaks in background, sunny alpine day",
    slides: [
      {
        slide: 1,
        headline: "Dolomiten mit Kinderwagen? 👶🏔️",
        subline: "Die meisten Bergwege scheiden mit Buggy aus. Aber nicht dieser."
      },
      {
        slide: 2,
        headline: "Spot-Highlight: Seiser Alm Holzsteg",
        body: "• Höhenlage: ca. 1.950m über dem Meer\n• Wegbeschaffenheit: Breiter, ebener Holz- und Schotterweg\n• Schwierigkeitsgrad: 1/5 (sehr leicht, keine Steilstufen)"
      },
      {
        slide: 3,
        headline: "Infrastruktur für Eltern & Kids",
        body: "• Einkehrhütten mit Wickeltisch & Kinderstühlen alle 45 Min.\n• Seilbahn-Auffahrt von Seis am Schlern ist stufenfrei\n• Perfekt für Kleinkinder & Großeltern"
      },
      {
        slide: 4,
        headline: "Vierbeiner willkommen 🐕",
        body: "Hunde sind in der Bergbahn und auf den Almen gern gesehene Gäste (Leinenpflicht auf den Wiesen beachten!)."
      },
      {
        slide: 5,
        headline: "Route & GPX-Track downloaden",
        body: "Finde alle 100% kinderwagengeprüften Touren in ganz Europa auf Scratch'n'Travel!\n👉 Link in Bio!"
      }
    ],
    caption: `Viele frischgebackene Eltern glauben, mit Baby oder Kleinkind sind die Alpen erst mal gestrichen. Falsch gedacht! 🏔️👶

Auf der Seiser Alm in Südtirol gibt es Panorama-Rundwege, die vollständig barrierefrei und mit jedem gewöhnlichen Kinderwagen befahrbar sind — ganz ohne mühsames Schleppen über Felsstufen.

📊 Tour-Daten:
• Schwierigkeit: Stufe 1/5 (Absolut buggatauglich)
• Dauer: 2,5 Std. gemütlich
• Highlights: Schlern-Massiv im Blick, stufenfreie Almhütten
• Hunde: 🐕 Willkommen!

Speichere diesen Beitrag für deinen nächsten Sommerurlaub in den Bergen! 📌

👉 Alle geprüften Familien- & Hundetrails findest du mit 1 Klick auf unserer Explore-Map (Link in Bio)!

#reisenmitkindern #dolomiten #seiseralm #familienurlaub #wandernmitkinderwagen #kinderwagenwanderung #scratchntravel`,
    hashtags: ["#reisenmitkindern", "#dolomiten", "#wandernmitkinderwagen", "#familienurlaub", "#outdoorfamily", "#scratchntravel"]
  },
  {
    day: 5,
    theme: "WanderBond™ Hobby-DNA — Finde deinen Travel-Buddy",
    type: "Reel / Carousel",
    hook: "Hör auf, mit Leuten zu verreisen, die nicht zu deinem Reisestil passen! 🧬",
    visual_prompt: "Two outdoor enthusiasts comparing trail maps and surfboards by a vintage van at sunset, warm cinematic glow, genuine friendship and adventure vibes",
    slides: [
      {
        slide: 1,
        headline: "Der heimliche Urlaubskiller: Falsche Buddies 🤦",
        subline: "Du willst um 6 Uhr surfen, dein Mitreisender will bis 12 Uhr schlafen."
      },
      {
        slide: 2,
        headline: "Das Prinzip: WanderBond™ DNA",
        body: "Wähle aus über 130 Hobbys & Leidenschaften:\n🏄 Surfen · 🚐 Vanlife · 🐕 Dog Trails · 🍷 Wine Tasting · 🧗 Klettern · 📸 Fotografie"
      },
      {
        slide: 3,
        headline: "Echtzeit-Matchmaking",
        body: "Unser Algorithmus berechnet den DNA-Match mit anderen Reisenden und verifiziert geteilte Routen und Spots."
      },
      {
        slide: 4,
        headline: "Finde deine Crew",
        body: "Erstelle deine eigene Hobby-DNA kostenlos in 60 Sekunden und vernetze dich mit echten Locals & Gleichgesinnten!"
      }
    ],
    caption: `Der größte Urlaubskiller ist nicht schlechtes Wetter — es sind unterschiedliche Erwartungen an den Tag. 🤷‍♂️

Wer die eigenen Leidenschaften vor der Reise abgleicht, hat mehr vom Trip. Genau dafür haben wir die **WanderBond™ DNA** entwickelt:
Wähle aus 130+ Hobbys aus, definiere dein Reisetempo und entdecke geheime Spots, die exakt zu deinen Interessen passen.

Egal ob Surfen in Portugal, Vanlife in Norwegen oder Genusswandern in der Toskana.

👉 Erstelle deine persönliche Reise-DNA jetzt kostenlos auf Scratch'n'Travel (Link in Bio)!

#travelbuddy #wanderbond #reisestil #solotraveler #vanlifegermany #surftrip #scratchntravel`,
    hashtags: ["#travelbuddy", "#wanderbond", "#reisestil", "#solotraveler", "#vanlifegermany", "#surftrip", "#scratchntravel"]
  },
  {
    day: 6,
    theme: "Mallorca abseits des Massentourismus — Cala Tuent",
    type: "Carousel (5 Slides)",
    hook: "Mallorca ohne Touristenbusse? Fahr an diesen Strand! 🏖️⛰️",
    visual_prompt: "Crystal clear turquoise water cove flanked by colossal rocky limestone cliffs in Mallorca, solitary fishing boat, no hotels or resorts in sight, sunny Mediterranean paradise",
    slides: [
      {
        slide: 1,
        headline: "Mallorca wie vor 50 Jahren 🌊",
        subline: "Kein Hotel. Keine Partymeile. Nur Klippen & smaragdgrünes Wasser."
      },
      {
        slide: 2,
        headline: "Spot-Name: Cala Tuent",
        body: "• Lage: An der wilden Nordwestküste (Serra de Tramuntana)\n• Anfahrt: Atemberaubende Serpentinenstraße vorbei an Sa Calobra\n• Untergrund: Runder Kies & glasklares Meer"
      },
      {
        slide: 3,
        headline: "Echtes Insider-Wissen",
        body: "• Parken: Kleiner unbefestigter Parkplatz oberhalb der Bucht\n• Gastronomie: Nur ein einziges traditionelles Berg-Restaurant (Es Vergeret) mit Panoramaterrasse\n• Badeschuhe empfohlen!"
      },
      {
        slide: 4,
        headline: "Hunde- & Familien-Check 🐕👶",
        body: "• Hunde: In der Nebensaison (Oktober–Mai) toleriert und entspannt\n• Kinderwagen: Der Weg von Parkplatz zum Ufer ist kurz, aber etwas holprig (Schwierigkeit 2/5)"
      },
      {
        slide: 5,
        headline: "GPS & Turn-by-Turn Navi",
        body: "Schalte den Spot in deiner Scratch'n'Travel App frei und erhalte sofortige Google Maps Navigation!\n👉 Link in Bio!"
      }
    ],
    caption: `Mallorca hat einen schlechten Ruf für Massentourismus — aber nur, wenn man an den falschen Orten sucht! 🤫

An der Nordwestküste, eingebettet in die schroffen Felswände der Tramuntana, liegt die **Cala Tuent**. Keine Liegestuhlreihen, keine Hotelbauten, sondern nur türkisfarbenes Wasser und majestätische Felswände.

📊 Spot-Fakten:
• Anfahrt: Abenteuerliche Serpentinen (Fahrspaß pur)
• Bucht: Kiesstrand mit Schatten spendenden Pinien
• Ruhe-Faktor: 10/10

🗺️ Die GPS-Daten & Offline-Tour findest du in unserer App.
🎁 10% eSIM-Rabatt mit Code 'SCRATCH10' für stabiles Netz auf der Insel!

👉 Link in Bio: @scratchntravel

#mallorcainsider #calatuent #mallorcatravel #secretbeaches #mallorcagram #scratchntravel #hiddengemsmallorca`,
    hashtags: ["#mallorcainsider", "#calatuent", "#mallorcatravel", "#secretbeaches", "#scratchntravel", "#hiddengems"]
  },
  {
    day: 7,
    theme: "Community-Showcase: Der digitale Reisepass & Quest-System",
    type: "Reel / Carousel",
    hook: "Level 1 bis Rang 25: Wie weit kommst du auf deiner Weltreise? 🛂⭐",
    visual_prompt: "Close up of an open vintage-luxury digital travel passport booklet, gold foil stamps with coordinates, elegant typography on cream paper, glowing golden quest progress bar",
    slides: [
      {
        slide: 1,
        headline: "Dein Abenteuer als visuelle Legende 🛂",
        subline: "Der digitale Reisepass von Scratch'n'Travel."
      },
      {
        slide: 2,
        headline: "Sammle echte Visum-Stempel",
        body: "Für jeden besuchten Secret Spot und jede absolvierte Tour erhältst du einen kryptografisch verifizierten Stempel mit Datum und Koordinaten."
      },
      {
        slide: 3,
        headline: "XP-Level & Sammler-Ränge",
        body: "Steige vom 'Pathfinder' zum 'Grandmaster Explorer' auf. Schalte geheime Quests und exklusive Merch-Vorteile frei!"
      },
      {
        slide: 4,
        headline: "1-Klick QR-Code zum Teilen",
        body: "Zeige deinen Freunden und deiner Community deinen echten Reisepass per scanbarem QR-Code oder Instagram Story Canvas."
      },
      {
        slide: 5,
        headline: "Starte deine Reise heute",
        body: "Kostenlos anmelden in 30 Sekunden.\n👉 Link in Bio & losrubbeln!"
      }
    ],
    caption: `Reisen ist mehr als nur Konsumieren — es ist ein Sammeln von Erinnerungen, Geschichten und Meilensteinen. 🛂✨

Mit dem digitalen Reisepass von Scratch'n'Travel wird jede deiner Reisen dokumentiert:
• Sammle Visum-Stempel mit echten GPS-Daten
• Meistere Entdecker-Quests in deiner Lieblingsregion
• Schalte über 460 einzigartige Badges frei
• Teile deine Chronik mit Freunden per individuellem QR-Code

Egal ob Wochenend-Trip oder Weltreise: Starte dein Abenteuer noch heute!

👉 Link in der Bio: Kostenlosen Pass anlegen auf @scratchntravel

#reisetagebuch #digitalerpass #travelgamification #wanderlust #scratchntravel #reiseliebe #bucketlist2026`,
    hashtags: ["#reisetagebuch", "#digitalerpass", "#travelgamification", "#wanderlust", "#scratchntravel", "#bucketlist"]
  }
];

// 1. Generate Markdown Report
let mdContent = `# 📸 7-Tage Instagram Content-Kampagne — Scratch'n'Travel
> **Autonom generiert von Hermes v2.4**
> Strikte Trennung: 100% Scratch'n'Travel Travel- & Merch-Content (Kein Kontenlage-Content!)
> Fokus: Secret Spots, Hund & Kind, 300 DPI Gestickte Badges, eSIM Rabatt (\`SCRATCH10\`)

---

`;

campaignDays.forEach(d => {
  mdContent += `## 🗓️ Tag ${d.day}: ${d.theme}\n`;
  mdContent += `* **Format:** ${d.type}\n`;
  mdContent += `* **Hook:** *„${d.hook}“*\n`;
  mdContent += `* **Bild-/Visual-Prompt:** \`${d.visual_prompt}\`\n\n`;
  
  mdContent += `### 📱 Carousel Slides / Grafik-Text:\n`;
  d.slides.forEach(s => {
    mdContent += `**[Slide ${s.slide}] ${s.headline}**\n`;
    if (s.subline) mdContent += `_${s.subline}_\n`;
    if (s.body) mdContent += `${s.body}\n`;
    mdContent += `\n`;
  });

  mdContent += `### ✍️ Caption (Beitragstext für Instagram):\n\`\`\`text\n${d.caption}\n\`\`\`\n\n`;
  mdContent += `### 🏷️ Hashtags:\n${d.hashtags.join(' ')}\n\n`;
  mdContent += `---\n\n`;
});

fs.writeFileSync(outputMdPath, mdContent, 'utf-8');
fs.writeFileSync(outputJsonPath, JSON.stringify(campaignDays, null, 2), 'utf-8');

console.log('✅ 7-Tage Instagram Kampagne erfolgreich generiert!');
console.log('📄 Markdown:', outputMdPath);
console.log('📊 JSON:', outputJsonPath);
