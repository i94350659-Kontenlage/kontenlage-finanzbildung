import { useParams, Link } from "react-router";

interface Section {
  heading: string;
  body: string;
}

interface ArticleData {
  tag: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  intro: string;
  sections: Section[];
  fazit: string;
  disclaimer: string;
}

const articles: Record<string, ArticleData> = {
  "defi-lending-staking-liquidity-pools-guide": {
    tag: "DeFi & Web3",
    title: "DeFi-Guide 2026: Lending, Staking & Liquidity Pools – Chancen, Risiken & Steuerpraxis",
    date: "12. September 2026",
    readTime: "11 Min.",
    author: "Hermes Autonomous Engine & Redaktion Kontolage",
    intro: "Decentralized Finance (DeFi) transformiert das traditionelle Bankwesen durch autonome, auf Blockchains ausgeführte Smart Contracts. Ohne menschliche Intermediäre können Anleger Kapital verleihen (Lending), Erträge durch Validierung erzielen (Staking) oder Handelsliquidität bereitstellen (Liquidity Mining). Doch hohe nominelle Renditen (APY) bergen substantielle technologische und ökonomische Risiken.",
    sections: [
      {
        heading: "1. Was ist DeFi und wie funktioniert es ohne Banken?",
        body: "Traditionelle Finanzinstitute agieren als zentraler Clearing-Partner, verlangen Gebühren und verwalten Kontobücher auf proprietären Servern. Im DeFi-Bereich (Decentralized Finance) übernehmen quelloffene Smart Contracts (primär auf Ethereum, Arbitrum, Optimism und Base) diese Aufgabe. Transaktionen, Sicherheitenquoten und Zinsmechanismen sind mathematisch im Code determiniert. Nutzer behalten die uneingeschränkte Verwahrung über ihre privaten Schlüssel (Non-Custodial / Self-Custody) via Hard- oder Web3-Wallets."
      },
      {
        heading: "2. Die drei Kernmechanismen: Lending, Staking und Liquidity Pools",
        body: "1. Lending (z.B. Aave, Compound): Einzahlung von Krypto-Assets oder Euro-/Dollar-Stablecoins in Liquiditätspools. Kreditnehmer hinterlegen Überbesicherungen (Overcollateralization, z.B. 130-150%), um Darlehen aufzunehmen. Der Einleger erhält variable Zinsen aus den Kreditgebühren.\n2. Liquiditätsbereitstellung (z.B. Uniswap v3, Curve): Anleger stellen Paare von Tokens in Automated Market Maker (AMM) Pools bereit und verdienen anteilige Transaktionsgebühren. Bei Kursdivergenzen entsteht jedoch 'Impermanent Loss'.\n3. Proof-of-Stake Staking (z.B. Ethereum Validator, Lido, Rocket Pool): Sperrung von nativen Coins zur Netzwerksicherung mit laufender Ertragsausschüttung (ca. 3-4% p.a.)."
      },
      {
        heading: "3. Die elementaren Risiken: Smart Contract Bugs, De-Pegging & Exploits",
        body: "DeFi-Renditen sind Risikoprämien. Die größten Verlustquellen resultieren aus:\n- Smart-Contract-Schwachstellen: Trotz renommierter Audits (z.B. OpenZeppelin, CertiK) können Code-Fehler zu Totalverlusten führen.\n- Stablecoin-De-Pegging: Weicht ein algorithmischer oder unzureichend gedeckter Stablecoin von der 1:1 Parität zur Fiat-Währung ab, drohen Kettenreaktionen.\n- Oracle Manipulation & Flash Loan Attacks: Manipulation von Preis-Feeds führt zur unberechtigten Liquidation gesunder Positionen.\n- Phishing & Approval-Exploits: Das Signieren schädlicher Smart Contract Approvals kann das gesamte Wallet leerräumen (Revoke.cash nutzen!)."
      },
      {
        heading: "4. Steuerliche Behandlung in Deutschland (§ 23 EStG vs. § 22 Nr. 3 EStG)",
        body: "Die steuerliche Einstufung nach deutschem Recht erfordert strikte Differenzierung:\n- Private Veräußerungsgeschäfte (§ 23 Abs. 1 Nr. 2 EStG): Kursgewinne aus dem Halten und Tauschen von Tokens sind nach einer Mindesthaltedauer von einem vollen Jahr (12 Monate) komplett steuerfrei. Die ehemalige Verlängerung der Haltefrist auf 10 Jahre bei Erzielung von Einkünften wurde vom Gesetzgeber ausdrücklich gestrichen!\n- Lending & Staking Erträge: Laufende Zuflüsse von Rewards gelten nach Ansicht der Finanzverwaltung i.d.R. als sonstige Einkünfte gemäß § 22 Nr. 3 EStG. Hier gilt eine jährliche Freigrenze von 256 € (ab 256 € voll steuerpflichtig zum persönlichen Einkommensteuersatz bis 45%).\n- Sorgfältige Dokumentation: Jeder Swap, Claim und Fee-Zufluss muss mit Zeitstempel und Euro-Umrechnungskurs nachgewiesen werden (Krypto-Steuersoftware dringend empfohlen)."
      }
    ],
    fazit: "DeFi bietet bahnbrechende finanzielle Autonomie und attraktive Cashflow-Chancen, verlangt jedoch tiefes technisches Verständnis und absolute Disziplin beim Risikomanagement. Im Portfolio sollte DeFi, wenn überhaupt, nur als spekulative Beimischung (1 bis maximal 5 %) mit Hardware-Wallet-Absicherung und bewährten Blue-Chip-Protokollen genutzt werden.",
    disclaimer: "Rein neutrale Finanzbildung und steuerrechtliche Strukturierungshinweise nach § 2 Abs. 8 Nr. 10 WpHG. Keine Anlageberatung, keine Aufforderung zum Handel und keine individuelle Steuerberatung."
  },

  "ezb-zinssenkungen-anleihen-tagesgeld": {
    tag: "Makroökonomie & EZB",
    title: "EZB-Zinssenkungen: Was die Zinswende für Tagesgeld, Festgeld und Anleihen bedeutet",
    date: "12. September 2026",
    readTime: "9 Min.",
    author: "Redaktion Kontolage",
    intro: "Nach der Phase historisch rapider Zinserhöhungen zur Bekämpfung des Inflationsschocks hat die Europäische Zentralbank (EZB) ihren Lockerungszyklus eingeleitet. Sinkende Leitzinsen verschieben die Renditestruktur im Euro-Raum fundamental. Für Sparer und Investoren erfordert dies eine Neujustierung ihrer Liquiditäts- und Rentenallokation.",
    sections: [
      {
        heading: "1. Das veränderte Zinsumfeld: Einlagefazilität und Realzins",
        body: "Mit den Zinsschritten der EZB sinkt die Verzinsung der Einlagefazilität (Deposit Facility Rate) sukzessive ab. Banken geben diesen Rückgang mit minimaler Verzögerung an Endkunden weiter: Spitzenzinsen auf Tagesgeldkonten von ehemals 3,75% bis 4,00% schrumpfen zügig in Richtung 2,50% bis 2,00%. Nach Abzug der Kerninflation von rund 2,2% bis 2,6% fällt der Realzins auf Sichteinlagen wieder gefährlich nahe an die Nulllinie oder in den negativen Bereich. Reines Liegenlassen von Notgroschen übersteigender Liquidität verbrennt Kaufkraft."
      },
      {
        heading: "2. Tagesgeld vs. Festgeld: Das Wiederanlagerisiko (Reinvestment Risk)",
        body: "Wer hohe Summen auf Tagesgeldkonten parkt, unterliegt dem Wiederanlagerisiko: Bei jeder Zinsrunde der EZB passt die Depotbank den variablen Zins nach unten an. Festgeldverträge (12 bis 36 Monate) boten in der Spätphase des Zinsgipfels die Chance, attraktive Renditen festzuschreiben. Anleger müssen sich bewusst sein: In einem Zinssenkungsszenario schließt sich das Fenster für überdurchschnittliche Festgeld-Konditionen schnell. Eine Festgeld-Treppe (z.B. Aufteilung in 6, 12, 18 und 24 Monate) glättet dieses Risiko."
      },
      {
        heading: "3. Euro-Staatsanleihen: Kursgewinne durch Duration-Effekt",
        body: "Die mathematische Beziehung zwischen Zins und Anleihekursen ist eindeutig: Sinken die Marktzinsen, steigen die Kurse bereits emittierter Anleihen (Duration-Effekt). Langlaufende Bundesanleihen (7 bis 10 Jahre Duration) profitieren bei fallenden Renditen von zweistelligen Kurschancen. Wer in breit diversifizierte Euro-Staatsanleihen-ETFs investiert ist, partizipiert an dieser Kursaufwertung, während Geldmarktfonds (Overnight Return) lediglich den schrumpfenden Tagesgeldsatz nachbilden."
      },
      {
        heading: "4. Immobilien & Baufinanzierung: Keine Rückkehr zur Nullzins-Ära",
        body: "Bauzinsen für 10-jährige Zinsbindungen orientieren sich nicht primär am kurzfristigen EZB-Leitzins, sondern an der Rendite der 10-jährigen Bundesanleihe sowie dem Pfandbriefmarkt. Zwar sinken die Hypothekenzinsen leicht von ihren Höchstständen (ca. 4,2%) auf ein Korridorniveau um 3,2% bis 3,6%, eine Rückkehr zur 1%-Ära gilt unter Ökonomen jedoch als ausgeschlossen. Für Immobilienkäufer bedeutet dies: Tragfähige Cashflows und realistische Eigenkapitalquoten (mind. 20%) bleiben Pflicht."
      }
    ],
    fazit: "Der EZB-Zinssenkungszyklus beendet das 'risikolose Schlaraffenland' auf dem Tagesgeldkonto. Anleger sollten überschüssige Barliquidität strategisch in reale Produktivwerte (Aktien/ETFs) sowie festverzinsliche Anleihen mit definierter Restlaufzeit umschichten, um ihr Vermögen vor dem schleichenden Kaufkraftverlust zu schützen.",
    disclaimer: "Allgemeine volkswirtschaftliche Bildungsanalyse nach § 2 Abs. 8 Nr. 10 WpHG. Keine Anlageberatung oder individuelle Kauf-/Verkaufsempfehlung."
  },

  "us-schulden-dollar-gold-portfolio": {
    tag: "Weltwirtschaft & Geopolitik",
    title: "US-Schuldenberg & BRICS-Dynamik: Warum Gold und Realwerte als Absicherung unverzichtbar sind",
    date: "8. September 2026",
    readTime: "10 Min.",
    author: "Redaktion Kontolage",
    intro: "Die Verschuldung der Vereinigten Staaten hat die Marke von 35 Billionen US-Dollar überschritten. Gleichzeitig forciert die BRICS-Allianz bilaterale Handelsabwicklungen abseits des US-Dollars. Zentralbanken weltweit reagieren mit rekordhohen Goldkäufen. Welche strategische Funktion erfüllt Gold im modernen Vermögensportfolio?",
    sections: [
      {
        heading: "1. Schuldendynamik und Zinslast des US-Bundeshaushalts",
        body: "Die jährlichen Zinsausgaben der US-Regierung übersteigen mittlerweile das reguläre Verteidigungsbudget und nähern sich der Marke von 1 Billion Dollar p.a. Bei einer Staatsverschuldung von über 120% des BIP existieren historisch betrachtet nur zwei Wege zum Schuldenabbau: Massives reales Wirtschaftswachstum oder 'finanzielle Repression' – also eine gezielte Inflationierung bei künstlich gedrückten Realzinsen. Zweiteres entwertet ungedeckte Fiat-Währungen systematisch."
      },
      {
        heading: "2. Zentralbank-Akkumulation und Entdollarisierung",
        body: "Seit dem Einfrieren von Währungsreserven im Jahr 2022 haben Zentralbanken des globalen Südens (insb. China, Indien, Singapur, Türkei) ihre Dollar- und US-Treasury-Bestände reduziert und physisches Gold in beispielloser Größenordnung gekauft. Gold ist das einzige Reserve-Asset, das kein Kontrahentenrisiko (Counterparty Risk) und kein Sanktionsrisiko aufweist. Dieser strukturelle Nachfragesockel stützt das Edelmetall fundamental ab."
      },
      {
        heading: "3. Gold im Portfolio: Portfoliotheorie und Korrelation",
        body: "Entgegen landläufiger Meinung dient Gold im Depot nicht der Maximierung von Spitzenrenditen, sondern der Absicherung des Gesamtsystems. In Phasen geopolitischer Schocks, Währungskrisen oder stagflationärer Phasen weist Gold eine historisch niedrige bis negative Korrelation zu Aktien und nominalen Anleihen auf. Ein Allokationsanteil von 5% bis 15% physischem Gold (oder mit physischem Gold hinterlegten ETCs wie Xetra-Gold oder Euwax Gold II) reduziert die maximale Portfolio-Volatilität (Drawdown) signifikant."
      },
      {
        heading: "4. Deutsche Steuerprivilegien bei Gold (§ 23 EStG)",
        body: "In Deutschland genießt physisches Anlagegold (Münzen und Barren) sowie mit Lieferanspruch hinterlegtes Wertpapier-Gold (BMF-Schreiben vom 10.05.2022) eine einzigartige steuerliche Sonderstellung: Nach einer Haltedauer von mehr als 12 Monaten sind sämtliche Kursgewinne vollständig steuerfrei nach § 23 Abs. 1 Nr. 2 EStG. Es fällt weder Abgeltungsteuer noch Solidaritätszuschlag an."
      }
    ],
    fazit: "In einer Welt eskalierender Staatsverschuldung und währungspolitischer Fragmentierung ist Gold der ultimative Anker für reale Kaufkraft. Eine Allokation von 5–10% im Portfolio fungiert als systemische Versicherung gegen Währungsabwertung.",
    disclaimer: "Bildungsanalyse nach § 2 Abs. 8 Nr. 10 WpHG. Keine Empfehlung zum Erwerb spezifischer Edelmetalle oder Finanzderivate."
  },

  "etf-vorabpauschale-2026-steuern": {
    tag: "Kapitalerträge",
    title: "Vorabpauschale 2026: Berechnung, Basiszins und Steuerabzug bei thesaurierenden ETFs",
    date: "1. September 2026",
    readTime: "7 Min.",
    author: "Redaktion Kontolage",
    intro: "Durch das Investmentsteuerreformgesetz (InvStG) werden auch thesaurierende Fonds und ETFs jährlich fiktiv besteuert. Mit der Rückkehr positiver Basiszinsen durch die Bundesbank zieht die Depotbank Anfang jeden Jahres Steuern ein. So funktioniert die Formel und so schützen Sie Ihr Verrechnungskonto vor Minusbeträgen.",
    sections: [
      {
        heading: "1. Die gesetzliche Berechnungsgrundlage (§ 18 InvStG)",
        body: "Der Basiszins wird von der Deutschen Bundesbank jeweils zum ersten Börsentag des Jahres auf Basis der Zinsstrukturkurve für Bundeswertpapiere mit 15-jähriger Laufzeit ermittelt. Der Basisertrag errechnet sich aus: Wert des Fondsanteils zu Jahresbeginn × Basiszins × 0,7 (gesetzlicher Kürzungsfaktor). Beispiel: Bei 10.000 € Depotwert und 2,29% Basiszins beträgt der Basisertrag: 10.000 € × 0,0229 × 0,7 = 160,30 €."
      },
      {
        heading: "2. Die Deckelung auf den tatsächlichen Wertzuwachs",
        body: "Die Vorabpauschale ist stets auf den tatsächlichen Wertzuwachs des ETFs im Kalenderjahr zuzüglich der Ausschüttungen begrenzt. Hat ein ETF im abgelaufenen Jahr Kursverluste erlitten (Endwert < Anfangswert), wird keine Vorabpauschale erhoben. Anleger zahlen niemals Steuern auf Buchverluste."
      },
      {
        heading: "3. Die Teilfreistellung (TFS) nach § 20 InvStG",
        body: "Für Privatanleger greift die Teilfreistellung, die steuerliche Belastungen auf Fondsebene kompensiert: Bei Aktienfonds (mindestens 51% Aktienquote) sind 30% des Ertrags steuerfrei. Bei Mischfonds (mind. 25% Aktien) sind 15% steuerfrei. Bei Immobilienfonds liegt die Quote bei 60% bzw. 80%. Beim Aktien-ETF werden somit nur 70% der ermittelten Vorabpauschale mit der Abgeltungsteuer (25% + Soli + ggf. KiSt = ca. 26,375%) belegt."
      },
      {
        heading: "4. Freistellungsauftrag und Liquidität auf dem Verrechnungskonto",
        body: "Depotbanken buchen die anfallende Steuer vollautomatisch in den ersten Wochen des Folgejahres vom Verrechnungskonto ab. Reicht der erteilte Freistellungsauftrag (Sparerpauschbetrag 1.000 € / 2.000 €) aus, erfolgt kein Mittelabzug. Ist kein Freistellungsauftrag hinterlegt und das Konto nicht gedeckt, kann das Verrechnungskonto ins Minus rutschen (Dispozinsen) oder die Bank meldet den Steuerbetrag an das Betriebsstättenfinanzamt."
      }
    ],
    fazit: "Die Vorabpauschale besteuert künftige Kursgewinne vorab – beim späteren Verkauf des ETFs wird die bereits gezahlte Vorabpauschale vollumfänglich vom Veräußerungsgewinn abgezogen. Eine Doppelbesteuerung ist gesetzlich ausgeschlossen.",
    disclaimer: "Steuerliche Informationsübersicht nach deutschem InvStG. Keine individuelle Steuerberatung i.S.d. StBerG."
  },

  "bitcoin-steuer-holding-privat-2026": {
    tag: "Krypto & Digital Assets",
    title: "Krypto-Besteuerung in Deutschland: 1-Jahres-Haltefrist nach § 23 EStG vs. Holding",
    date: "25. August 2026",
    readTime: "8 Min.",
    author: "Redaktion Kontolage",
    intro: "Deutschland gilt international als eine der attraktivsten Jurisdiktionen für Krypto-Langzeitanleger. Das BMF-Schreiben vom 10. Mai 2022 hat für Rechtssicherheit gesorgt. Dennoch unterliegen viele Krypto-Investoren gravierenden Irrtümern, insbesondere bei Staking, Trading und der Überlegung einer vermögensverwaltenden GmbH.",
    sections: [
      {
        heading: "1. Das private Veräußerungsgeschäft nach § 23 Abs. 1 Nr. 2 EStG",
        body: "Kryptowährungen (wie Bitcoin, Ethereum, Solana) gelten steuerrechtlich nicht als Kapitalvermögen, sondern als sonstige Wirtschaftsgüter. Gewinne aus dem Verkauf werden daher nicht mit der pauschalen Abgeltungsteuer (25%), sondern mit dem individuellen Einkommensteuersatz (bis zu 45% zzgl. Soli) versteuert – ALLERDINGS NUR, wenn die Haltedauer zwischen Anschaffung und Veräußerung weniger als 12 Monate beträgt. Nach Ablauf von exakt 365 Tagen ist der gesamte Gewinn zu 100% steuerfrei."
      },
      {
        heading: "2. Freigrenze vs. Freibetrag bei unterjährigem Trading",
        body: "Wird innerhalb der 1-Jahres-Frist mit Gewinn verkauft, gilt eine jährliche Freigrenze von 1.000 € (angehoben ab Veranlagungszeitraum 2024, § 23 Abs. 3 EStG). Wichtig: Eine Freigrenze ist kein Freibetrag! Beträgt der Veräußerungsgewinn 1.001 €, muss der gesamte Betrag ab dem ersten Euro voll versteuert werden."
      },
      {
        heading: "3. Staking und Lending: Keine Verlängerung auf 10 Jahre mehr",
        body: "Über Jahre herrschte Rechtsunsicherheit, ob Staking die Haltefrist auf 10 Jahre verlängert (§ 23 Abs. 1 Nr. 2 Satz 4 EStG a.F.). Das BMF hat 2022 klargestellt: Auch beim Einsatz von Krypto-Assets für Proof-of-Stake oder Lending bleibt die Spekulationsfrist bei exakt 1 Jahr. Die generierten Staking-Rewards selbst stellen jedoch Einkünfte aus Leistungen nach § 22 Nr. 3 EStG dar und sind im Zuflusszeitpunkt mit dem Marktpreis zu versteuern (Freigrenze 256 € p.a.)."
      },
      {
        heading: "4. Holding-GmbH für Krypto: Fast immer ein schwerer Steuerfehler",
        body: "Viele Anleger glauben fälschlicherweise, eine vermögensverwaltende GmbH sei auch für Krypto vorteilhaft. Das Gegenteil ist der Fall: Kapitalgesellschaften unterliegen dem Trennungsprinzip und kennen keine private 1-Jahres-Haltefrist. Jeder Krypto-Verkaufsgewinn in der GmbH wird stets mit ca. 30% (Körperschaftsteuer + Gewerbesteuer) besteuert. Zudem greift die 95%-Steuerbefreiung nach § 8b KStG NUR für Aktien, NICHT für Krypto-Werte. Langfristiges Halten gehört zwingend ins steuerfreie Privatvermögen."
      }
    ],
    fazit: "Für Buy-and-Hold-Investoren ist das deutsche Privatvermögen für Krypto steuerlich unschlagbar. Wer länger als ein Jahr hält, realisiert millionenschwere Kursgewinne legal vollkommen abgabenfrei.",
    disclaimer: "Steuerrechtliche Erläuterung nach BMF-Verwaltungsgrundsätzen. Keine steuerliche Einzelfallberatung."
  },

  "holding-gruendung-kosten": {
    tag: "Holding & GmbH",
    title: "VV-GmbH gründen: Kosten, Nutzen, Zeitpunkt",
    date: "22. März 2026",
    readTime: "9 Min.",
    author: "Redaktion Kontolage",
    intro: "Die vermögensverwaltende GmbH (VV-GmbH) wird in sozialen Medien oft als Allheilmittel zur Steuervermeidung gepriesen. Die reale Gesetzeslage nach § 8b KStG und § 9 Nr. 1 GewStG zeigt jedoch: Erst ab einem signifikanten Anlagevolumen übersteigen die Steuerstundungsvorteile die fixen Verwaltungs- und Prüfungskosten.",
    sections: [
      {
        heading: "1. Das Kernprivileg: § 8b KStG bei Aktienveräußerungen",
        body: "Veräußert eine GmbH Anteile an anderen Kapitalgesellschaften (Aktien), sind 95% des Gewinns steuerfrei. Lediglich 5% gelten als nicht abzugsfähige Betriebsausgabe und werden mit ca. 30% besteuert. Daraus resultiert eine effektive Steuerbelastung von lediglich ca. 1,5% auf Aktiengewinne. Dieser Zinseszinseffekt ermöglicht das reinvestieren von 98,5% des Bruttogewinns."
      },
      {
        heading: "2. Die Krux mit Dividenden und ETFs",
        body: "Wesentlicher Fallstrick: Das 1,5%-Privileg gilt NICHT für Dividenden (außer bei Schachtelbeteiligungen ab 10% bzw. 15% Beteiligungshöhe) und NICHT für ETFs. Bei gewöhnlichen Aktien-ETFs greift in der GmbH das Teilfreistellungssystem des InvStG (80% Freistellung), was zu einer effektiven Steuerlast von ca. 12% bis 15% führt – kaum besser als im Privatvermögen."
      },
      {
        heading: "3. Fixkostenstruktur: Notar, IHK, Jahresabschluss und Bundesanzeiger",
        body: "Eine GmbH verursacht Fixkosten: Gründung (Notar, Handelsregister, Stammkapital 25.000 €) schlägt mit ca. 1.500 € bis 2.500 € zu Buche. Laufend fallen an: Steuerberater für Buchhaltung und Jahresabschluss (ca. 2.000 € – 4.000 € p.a.), IHK-Beitrag (ca. 200–400 € p.a.), Offenlegung im Bundesanzeiger (ca. 60–100 €) und LEI-Nummer für Wertpapierdepots (ca. 60 € p.a.). Fixkosten p.a.: ca. 2.500 € bis 5.000 €."
      },
      {
        heading: "4. Mathematischer Break-Even-Point",
        body: "Um laufende Kosten von 3.000 € allein durch die Steuerdifferenz zwischen 26,375% (Privat) und 1,5% (GmbH) bei aktiven Aktien-Umschichtungen zu kompensieren, müssen jährlich mindestens 12.000 € an realisierten Kursgewinnen anfallen. Wer passiv 'Buy & Hold' betreibt, erzielt in der GmbH keinen Vorteil, sondern zahlt bei Gewinnausschüttung an sich selbst erneut 25% Kapitalertragsteuer (Abgeltungsteuer) oder Teileinkünfteverfahren."
      }
    ],
    fazit: "Eine vermögensverwaltende GmbH lohnt sich primär für aktive Aktien-Trader, Immobilien-Bestandshalter (unter Nutzung der erweiterten Gewerbesteuerkürzung) oder operative Unternehmer mit thesaurierten Gewinnen ab einem Investitionsvolumen von mindestens 300.000 € bis 500.000 €.",
    disclaimer: "Gesellschafts- und steuerrechtliche Bildungsanalyse. Vor Gründung ist zwingend ein Steuerberater hinzuzuziehen."
  },

  "steuersparmodelle-immobilien": {
    tag: "Immobilien",
    title: "Steuersparmodelle im Immobilienmarkt: Was davon legal ist",
    date: "15. Juni 2026",
    readTime: "8 Min.",
    author: "Redaktion Kontolage",
    intro: "Immobilien gelten in Deutschland traditionell als steuerlich begünstigte Anlageklasse. Zwischen legaler Steueroptimierung durch Gebäude-AfA und aggressiven Gestaltungsmodellen an der Grenze zur Steuerhinterziehung liegt jedoch ein schmaler Grat.",
    sections: [
      {
        heading: "Lineare vs. Degressive AfA (§ 7 Abs. 5a EStG)",
        body: "Für Neubauten greift die degressive AfA von bis zu 5% auf den Restbuchwert (Wachstumschancengesetz). Bei Bestandsimmobilien gilt die reguläre lineare Gebäude-Abschreibung von 2,0% bzw. 2,5% oder 3,0% (ab Baujahr 2023). Wichtig: Der Grund- und Bodenanteil kann niemals abgeschrieben werden – Finanzämter prüfen Kaufpreisaufteilungen akribisch."
      },
      {
        heading: "Die 15%-Grenze für anschaffungsnahe Herstellungskosten (§ 6b EStG / § 6 EStG)",
        body: "Wer innerhalb von 3 Jahren nach Anschaffung mehr als 15% der Anschaffungskosten des Gebäudes für Instandsetzungen ausgibt, verliert den sofortigen Werbungskostenabzug. Die Ausgaben werden den Anschaffungskosten zugeschlagen und müssen über 33 bis 50 Jahre abgeschrieben werden."
      },
      {
        heading: "Die 10-Jahres-Frist für den steuerfreien Verkauf (§ 23 EStG)",
        body: "Im Privatvermögen gehaltene Vermietungsobjekte können nach 10 Jahren ab Kaufvertragsdatum vollständig steuerfrei veräußert werden. Bei Eigennutzung (im Jahr des Verkaufs und den beiden vorangegangenen Jahren) entfällt die Spekulationssteuer sogar bereits nach 3 Jahren."
      }
    ],
    fazit: "Legale Steueroptimierung bei Immobilien gelingt durch saubere Kaufpreisaufteilung, strikte Beachtung der 15%-Grenze und Disziplin bei der 10-jährigen Haltefrist.",
    disclaimer: "Keine Steuerberatung i.S.d. StBerG. Alle Informationen ohne Gewähr."
  },

  "ruerup-angestellte": {
    tag: "Altersvorsorge",
    title: "Rürup für Angestellte: Rechnet sich das wirklich?",
    date: "28. Mai 2026",
    readTime: "11 Min.",
    author: "Redaktion Kontolage",
    intro: "Die Basisrente (Rürup) wird oft als reines Selbstständigen-Produkt wahrgenommen. Doch auch für gut verdienende Angestellte mit Grenzsteuersätzen über 42% kann sich der Sonderausgabenabzug rechnen.",
    sections: [
      {
        heading: "Steuerlicher Sonderausgabenabzug nach § 10 EStG",
        body: "Altersvorsorgeaufwendungen sind bis zum Höchstbetrag von über 30.000 € zu 100% steuerlich abzugsfähig. Bei einem Grenzsteuersatz von 42% erstattet das Finanzamt 42 Cent je eingezahltem Euro im Rahmen der Einkommensteuererklärung."
      },
      {
        heading: "Vergleich mit ungefördertem ETF-Sparplan",
        body: "Während das private ETF-Depot volle Flexibilität bietet, punktet Rürup durch den sofortigen Steuerhebel. Allerdings muss die Rente im Alter nach dem Kohortenprinzip (§ 22 EStG) versteuert werden. Das Modell rechnet sich vor allem, wenn die Steuerlast im Ruhestand deutlich unter der Erwerbsphase liegt."
      }
    ],
    fazit: "Rürup ist ein wirkungsvolles Werkzeug zur Spitzensteuersatz-Senkung, fordert jedoch den Verzicht auf Liquidität (keine Kapitalabfindung möglich).",
    disclaimer: "Keine Anlageberatung. Steuerliche Situationen sind individuell."
  },

  "sparerpauschbetrag-2026": {
    tag: "Kapitalerträge",
    title: "Sparerpauschbetrag optimal ausschöpfen & Verlustverrechnung",
    date: "10. April 2026",
    readTime: "6 Min.",
    author: "Redaktion Kontolage",
    intro: "1.000 € Freibetrag für Alleinstehende und 2.000 € für Verheiratete: So strukturieren Sie Freistellungsaufträge und Verlusttöpfe bei mehreren Depotbanken optimal.",
    sections: [
      {
        heading: "Verteilung auf mehrere Broker",
        body: "Hinterlegen Sie Freistellungsaufträge primär dort, wo regelmäßige Ausschüttungen, Zinsen oder Vorabpauschalen anfallen. Nicht genutzte Freibeträge verfallen am 31. Dezember unwiederbringlich."
      },
      {
        heading: "Verlustverrechnungstopf Aktien vs. Sonstige",
        body: "Verluste aus Aktienverkäufen dürfen nach § 20 Abs. 6 EStG nur mit Aktiengewinnen verrechnet werden. Verluste aus Fonds/ETFs oder Zinsen landen im 'Allgemeinen Verlusttopf'. Eine bankübergreifende Verrechnung erfordert eine Verlustbescheinigung bis zum 15. Dezember."
      }
    ],
    fazit: "Aktives Monitoring der Freistellungsaufträge spart jedes Jahr bis zu 263,75 € (Single) bzw. 527,50 € (Ehepaar) an direkter Steuerzahlung.",
    disclaimer: "Allgemeine Information nach § 20 EStG."
  },

  "etf-kosten-vergleich": {
    tag: "ETF & Indexfonds",
    title: "TER, Trackingdifferenz, Spread: Was ETFs wirklich kosten",
    date: "8. März 2026",
    readTime: "7 Min.",
    author: "Redaktion Kontolage",
    intro: "Viele Anleger blicken ausschließlich auf die Total Expense Ratio (TER). Warum die Trackingdifferenz (TD) und Handelsspreads für den langfristigen Anlageerfolg viel entscheidender sind.",
    sections: [
      {
        heading: "TER vs. Trackingdifferenz",
        body: "Die TER beziffert nur die internen Verwaltungskosten. Die Trackingdifferenz misst die reale Abweichung der Fondsrendite von der Indexrendite. Durch Wertpapierleihe und steuerliche Optimierungen schaffen viele synthetische oder physische ETFs eine negative Trackingdifferenz – sie schneiden besser ab als ihr Vergleichsindex!"
      },
      {
        heading: "Handelszeiten und Spread-Fallen",
        body: "Kaufen Sie ETFs stets während der Haupthandelszeiten der Leitbörsen (Xetra: 09:00 bis 17:30 Uhr; US-Märkte: ab 15:30 Uhr). Zu Randzeiten (abends oder am Wochenende) weiten Market Maker die Spreads (Geld-/Brief-Spanne) drastisch aus."
      }
    ],
    fazit: "Ein ETF mit 0,20% TER und -0,10% Trackingdifferenz ist für den Anleger günstiger als ein ETF mit 0,07% TER und +0,15% Trackingdifferenz.",
    disclaimer: "Neutraler Bildungsvergleich ohne Wertpapierempfehlung."
  },

  "home-office-pauschale-2026": {
    tag: "Arbeitnehmer",
    title: "Home-Office-Pauschale: 6 € pro Tag richtig nutzen",
    date: "1. Februar 2026",
    readTime: "5 Min.",
    author: "Redaktion Kontolage",
    intro: "Bis zu 1.260 € Werbungskosten ohne separates Arbeitszimmer: Wie Arbeitnehmer und Selbstständige die Home-Office-Pauschale nach § 4 Abs. 5 Nr. 6b EStG steuerlich optimal ansetzen.",
    sections: [
      {
        heading: "Voraussetzungen und Höchstgrenzen",
        body: "Für jeden Kalendertag, an dem die berufliche Tätigkeit überwiegend in der häuslichen Wohnung ausgeübt wird, können 6 € steuerlich geltend gemacht werden – maximal für 210 Tage im Jahr (Höchstbetrag: 1.260 €)."
      },
      {
        heading: "Konkurrenz zur Entfernungspauschale",
        body: "Für Tage, an denen die Home-Office-Pauschale geltend gemacht wird, kann grundsätzlich keine Pendlerpauschale für Fahrten zur ersten Tätigkeitsstätte angesetzt werden. Erst wenn die gesamten Werbungskosten den Arbeitnehmer-Pauschbetrag (1.230 €) übersteigen, wirkt sich jeder weitere Euro steuermindernd aus."
      }
    ],
    fazit: "Die Pauschale ist der unkomplizierteste Weg für Angestellte ohne eigenes Büro, ihre Steuerlast um mehrere hundert Euro zu senken.",
    disclaimer: "Steuerlicher Praxishinweis ohne Beratungsanspruch."
  },

  "fuenftelregelung-abfindung": {
    tag: "Abfindung",
    title: "Fünftelregelung: Abfindung steueroptimiert erhalten",
    date: "15. Januar 2026",
    readTime: "8 Min.",
    author: "Redaktion Kontolage",
    intro: "Wer eine betriebliche Abfindung erhält, droht durch die Steuerprogression bis zu 45% an den Fiskus zu verlieren. Die Fünftelregelung nach § 34 EStG mildert diesen Progressionseffekt spürbar.",
    sections: [
      {
        heading: "Die Funktionsweise der Fünftelregelung",
        body: "Das Finanzamt berechnet die Steuer auf das reguläre Einkommen, addiert dann rechnerisch ein Fünftel der Abfindung hinzu, ermittelt die Differenzsteuer und multipliziert diese mit fünf. Dadurch wird verhindert, dass die gesamte Abfindung mit dem Spitzensteuersatz belegt wird."
      },
      {
        heading: "Gestaltung: Auszahlung ins Folgejahr verschieben",
        body: "Besonders wirksam ist die Fünftelregelung, wenn im Jahr des Zuflusses der Abfindung kaum sonstige Einkünfte vorliegen (z.B. durch Sabbatical, Elternzeit oder Arbeitslosigkeit). Ein Verschieben des Auszahlungstermins auf den 2. Januar des Folgejahres kann tausende Euro an Steuern sparen."
      }
    ],
    fazit: "Verhandeln Sie im Aufhebungsvertrag stets über den genauen Auszahlungszeitpunkt und prüfen Sie Vorauszahlungen in die gesetzliche Rentenversicherung (§ 187a SGB VI).",
    disclaimer: "Arbeits- und steuerrechtliche Informationsdarstellung."
  },

  "kirchensteuer-optimierung": {
    tag: "Kirchensteuer",
    title: "Kirchensteuerpflicht bei Kapitalerträgen: Sperrvermerk setzen",
    date: "5. Januar 2026",
    readTime: "4 Min.",
    author: "Redaktion Kontolage",
    intro: "Banken rufen die Religionszugehörigkeit ihrer Kunden automatisch beim Bundeszentralamt für Steuern (BZSt) ab. Wer einen Sperrvermerk setzt, verhindert den automatischen Einzug.",
    sections: [
      {
        heading: "Automatischer Kirchensteuerabzug",
        body: "Sofern Kapitalerträge den Sparerpauschbetrag übersteigen, führen Banken neben 25% Abgeltungsteuer und 5,5% Solidaritätszuschlag auch 8% bzw. 9% Kirchensteuer ab. Durch den Sonderausgabenabzug sinkt der Abgeltungsteuersatz dabei rechnerisch auf 24,45% bzw. 24,51%."
      },
      {
        heading: "Der Sperrvermerk beim BZSt",
        body: "Mit einem Sperrvermerk (Einreichung bis 30. Juni eines Jahres beim BZSt) untersagen Sie die Weitergabe Ihres Religionsmerkmals an die Bank. Achtung: Die Steuerpflicht erlischt dadurch nicht – Sie sind gesetzlich verpflichtet, die Kapitalerträge in der Anlage KAP nachzudeklarieren."
      }
    ],
    fazit: "Der Sperrvermerk schützt die Privatsphäre gegenüber der Bank, entbindet aber nicht von der Steuerpflicht in der Einkommensteuererklärung.",
    disclaimer: "Allgemeiner Hinweis zum Kirchensteuerabzugsverfahren."
  }
};

const defaultArticle: ArticleData = {
  tag: "Allgemein",
  title: "Artikel in Bearbeitung",
  date: "",
  readTime: "",
  author: "Kontolage Redaktion",
  intro: "Dieser Fachartikel wird aktuell redaktionell finalisiert und steht in Kürze zur Verfügung.",
  sections: [],
  fazit: "",
  disclaimer: "Alle Inhalte nach WpHG § 2 Abs. 8 Nr. 10 rein zu Bildungszwecken."
};

export default function ArtikelDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? (articles[slug] || defaultArticle) : defaultArticle;

  return (
    <>
      <section style={{ paddingTop: 120, padding: "120px 20px 48px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Link to="/artikel" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#a89f94", textDecoration: "none", marginBottom: 28, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={e => (e.currentTarget.style.color = "#a89f94")}
          >← Alle Artikel</Link>

          <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, color: "#c9a84c", padding: "4px 12px", borderRadius: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 20 }}>{article.tag}</span>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, color: "#f0ece4", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.025em" }}>
            {article.title}
          </h1>

          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#a89f94", marginBottom: 16, flexWrap: "wrap" }}>
            <span>📅 {article.date}</span>
            {article.readTime && <span>⏱ {article.readTime} Lesezeit</span>}
            {article.author && <span>✍️ {article.author}</span>}
          </div>

          {/* E-E-A-T: Redaktion, Prüfstand und Reichweite der Information offenlegen
              (P1-06). Ohne benannte Redaktion und klaren Prüfhinweis ist
              Steuer-Content für Suchmaschinen und Nutzer nicht einordenbar. */}
          <p
            style={{
              display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12, lineHeight: 1.7,
              color: "#8d857a", background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
              padding: "10px 14px", margin: "0 0 28px",
            }}
          >
            <span>Stand: {article.date}</span>
            <span>Redaktion: {article.author}</span>
            <span>
              Allgemeine Information, redaktionell geprüft – keine individuelle Steuer- oder Anlageberatung.{" "}
              <Link to="/transparenz" style={{ color: "#c9a84c" }}>Quellen und Methodik</Link>
            </span>
          </p>

          {article.intro && (
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#cdc6be", lineHeight: 1.8, fontStyle: "italic", borderLeft: "3px solid #c9a84c", paddingLeft: 20 }}>
              {article.intro}
            </p>
          )}
        </div>
      </section>

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {article.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 44 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, color: "#f0ece4", marginBottom: 16, lineHeight: 1.3 }}>{s.heading}</h2>
              <p style={{ fontSize: 16, color: "#a89f94", lineHeight: 1.9 }}>{s.body}</p>
            </div>
          ))}

          {article.fazit && (
            <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.65), rgba(30,41,59,0.8))", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: 28, marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#c9a84c", marginBottom: 10 }}>Fazit & Einordnung</div>
              <p style={{ fontSize: 15, color: "#e2c27d", lineHeight: 1.8, margin: 0 }}>{article.fazit}</p>
            </div>
          )}

          {article.disclaimer && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
              <strong>Rechtlicher Hinweis:</strong> {article.disclaimer}
            </div>
          )}
        </div>
      </section>
    </>
  );
}