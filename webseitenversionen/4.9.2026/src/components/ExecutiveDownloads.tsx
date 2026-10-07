import { useState } from "react";
import { generateHoldingExcelCsv, triggerCsvDownload } from "../lib/excelModelGenerator";

interface DownloadItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  format: string;
  content: string;
  filename: string;
  isCsv?: boolean;
}

export default function ExecutiveDownloads({ isUnlocked = false }: { isUnlocked?: boolean }) {
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic parameters for the Excel calculation model
  const [modelKapital, setModelKapital] = useState(250000);
  const [modelRendite, setModelRendite] = useState(7.0);
  const [modelFixkosten, setModelFixkosten] = useState(1800);

  // Dynamic parameters for legal templates (Stammdaten)
  const [firmaHolding, setFirmaHolding] = useState("Alpha Beteiligungen");
  const [sitzHolding, setSitzHolding] = useState("Frankfurt am Main");
  const [gruenderName, setGruenderName] = useState("Max Mustermann");
  const [stammkapital, setStammkapital] = useState(25000);
  const [tochterFirma, setTochterFirma] = useState("Alpha Digital Operations");
  const [ausschuettung, setAusschuettung] = useState(100000);
  const [showConfig, setShowConfig] = useState(false);

  // Generate dynamic CSV content with live Excel formulas
  const dynamicCsvContent = generateHoldingExcelCsv({
    startkapital: modelKapital,
    rendite: modelRendite,
    fixkosten: modelFixkosten,
  });
  const dynamicCsvFilename = `kontolage-holding-rechenmodell-${modelKapital}eur-${modelRendite}pct.csv`;

  // 20-Year Preview Metrics
  const nettoRenditePrivat = (modelRendite * (1 - 0.26375)) / 100;
  const previewPrivat20 = Math.round(modelKapital * Math.pow(1 + nettoRenditePrivat, 20));
  let previewHolding20 = modelKapital;
  for (let i = 0; i < 20; i++) {
    const ertrag = previewHolding20 * (modelRendite / 100);
    const steuer = ertrag * 0.0154;
    previewHolding20 = previewHolding20 + ertrag - steuer - modelFixkosten;
  }
  previewHolding20 = Math.round(previewHolding20);
  const vorteil20 = previewHolding20 - previewPrivat20;

  const downloadFile = (filename: string, content: string, isCsv = false) => {
    if (isCsv) {
      triggerCsvDownload(filename, content);
      return;
    }
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const items: DownloadItem[] = [
    {
      id: "satzung",
      title: "Notarielle Mustersatzung: VV-GmbH & Holding",
      badge: "GmbHG · §8b KStG · §9 GewStG",
      format: "Notarentwurf (.doc / .txt)",
      filename: "kontolage-vv-gmbh-mustersatzung.doc",
      description: "Rechtssicherer Gesellschaftsvertrag für die vermögensverwaltende Holding mit Schutzklauseln für die erweiterte Gewerbesteuerkürzung und Vinkulierung.",
      content: `================================================================================
RECHTLICHER HINWEIS GEMÄSS § 2 ABS. 1 RDG & § 1 STBERG:
Dieses Dokument ist ein redaktionelles, standardisiertes Muster und eine
Formulierungshilfe der Kontolage-Redaktion zur Information und Vorbereitung auf
Beratungs- und Notartermine. Es stellt ausdrücklich KEINE Rechtsberatung im Sinne
des Rechtsdienstleistungsgesetzes (RDG) und KEINE Steuerberatung im Sinne des
Steuerberatungsgesetzes (StBerG) dar. Es begründet kein Mandats- oder
Beratungsverhältnis. Die Nutzung erfolgt eigenverantwortlich.
Vor notarieller Beurkundung (§ 2 Abs. 1 GmbHG) oder formeller Beschlussfassung
ist zwingend die Prüfung durch einen zugelassenen Notar, Steuerberater oder
Rechtsanwalt erforderlich.
================================================================================

MUSTERSATZUNG EINER VERMÖGENSVERWALTENDEN GMBH (HOLDING)
(Formulierungshilfe nach GmbHG, § 8b KStG und § 9 Nr. 1 Satz 2 GewStG)
Dokumentenstand: 2026 · Kontolage Executive B2B

URKUNDENROLLE-NR. [________] / 2026

GESELLSCHAFTSVERTRAG
der „${firmaHolding.trim() || "[Wunschname]"} Vermögensverwaltung GmbH“

§ 1 Firma, Sitz und Geschäftsjahr
(1) Die Firma der Gesellschaft lautet:
    ${firmaHolding.trim() || "[Wunschname]"} Vermögensverwaltung GmbH
(2) Der Sitz der Gesellschaft ist ${sitzHolding.trim() || "[Stadt/Gemeinde]"}.
(3) Das Geschäftsjahr ist das Kalenderjahr. Das erste Geschäftsjahr ist ein Rumpfgeschäftsjahr, das mit der Eintragung in das Handelsregister beginnt und am 31. Dezember des laufenden Jahres endet.

§ 2 Gegenstand des Unternehmens (Kernelement der erweiterten Gewerbesteuerkürzung)
(1) Gegenstand des Unternehmens ist ausschließlich die Verwaltung und Nutzung eigenen Vermögens, insbesondere das Halten und Verwalten von Beteiligungen an anderen Kapitalgesellschaften im In- und Ausland, Wertpapieren, Festgeldern, Edelmetallen sowie von eigenem Grundbesitz.
(2) Die Gesellschaft ist nicht berechtigt, gewerblich tätig zu werden, gewerblichen Wertpapier- oder Grundstückshandel zu betreiben oder Tätigkeiten auszuüben, die einer Erlaubnis nach § 32 KWG, § 34c GewO oder dem KAGB bedürfen.
(3) Die Gesellschaft darf Zweigniederlassungen im In- und Ausland errichten, soweit dadurch die Voraussetzungen der steuerlichen Vermögensverwaltung nicht beeinträchtigt werden.

§ 3 Stammkapital und Geschäftsanteile
(1) Das Stammkapital der Gesellschaft beträgt EUR ${stammkapital.toLocaleString("de-DE")},00 (in Worten: Euro ${stammkapital === 25000 ? "fünfundzwanzigtausend" : stammkapital.toLocaleString("de-DE")}).
(2) Auf das Stammkapital übernimmt:
    Herr/Frau ${gruenderName.trim() || "[Vorname Name]"}, geboren am [Datum], wohnhaft in [Adresse],
    einen Geschäftsanteil mit dem Nennbetrag von EUR ${stammkapital.toLocaleString("de-DE")},00 (Geschäftsanteil Nr. 1).
(3) Die Stammeinlage ist in Geld zu erbringen und in voller Höhe sofort nach Errichtung der Gesellschaft auf das Gesellschaftskonto einzuzahlen.

§ 4 Geschäftsführung und Vertretung
(1) Die Gesellschaft hat einen oder mehrere Geschäftsführer.
(2) Ist nur ein Geschäftsführer bestellt, so vertritt er die Gesellschaft allein. Sind mehrere Geschäftsführer bestellt, wird die Gesellschaft durch zwei Geschäftsführer gemeinschaftlich oder durch einen Geschäftsführer zusammen mit einem Prokuristen vertreten.
(3) Durch Beschluss der Gesellschafterversammlung kann Geschäftsführern Einzelvertretungsbefugnis und/oder Befreiung von den Beschränkungen des § 181 BGB (Selbstkontrahierungsverbot) erteilt werden.
(4) Herr/Frau ${gruenderName.trim() || "[Vorname Name]"} wird zum ersten Geschäftsführer bestellt. Er/Sie ist stets einzelvertretungsberechtigt und von den Beschränkungen des § 181 BGB vollumfänglich befreit.

§ 5 Gesellschafterbeschlüsse
(1) Gesellschafterbeschlüsse werden mit einfacher Mehrheit der abgegebenen Stimmen gefasst, soweit das Gesetz oder dieser Vertrag nicht zwingend eine größere Mehrheit vorschreibt.
(2) Je EUR 1,00 eines Geschäftsanteils gewährt eine Stimme.
(3) Beschlüsse können auch schriftlich, per E-Mail oder im Wege von Videokonferenzen gefasst werden, wenn kein Gesellschafter widerspricht.

§ 6 Verfügung über Geschäftsanteile (Vinkulierung)
(1) Die Abtretung, Verpfändung oder sonstige Belastung von Geschäftsanteilen oder Teilen von Geschäftsanteilen bedarf zu ihrer Wirksamkeit der vorherigen schriftlichen Zustimmung der Gesellschafterversammlung.
(2) Die Zustimmung ist mit einer Mehrheit von 75 % der abgegebenen Stimmen zu fassen.

§ 7 Gewinnverwendung und Thesaurierung
(1) Die Gesellschafterversammlung beschließt über die Verwendung des Jahresergebnisses.
(2) Zur Wahrung des Zwecks des langfristigen steueroptimierten Vermögensaufbaus sollen Gewinne vorrangig in die Gewinnrücklage eingestellt und thesauriert werden (Reinvestitionsprinzip).
(3) Vorabausschüttungen sind zulässig, sofern die Liquidität der Gesellschaft nicht gefährdet wird.

§ 8 Kündigung, Einziehung und Abfindung
(1) Jeder Gesellschafter kann die Gesellschaft mit einer Frist von 6 Monaten zum Ende eines Geschäftsjahres kündigen.
(2) Scheidet ein Gesellschafter aus der Gesellschaft aus, steht ihm eine Abfindung zu. Als Abfindung gilt der nach dem vereinfachten Ertragswertverfahren ermittelte Wert, maximal jedoch das anteilige Eigenkapital gemäß Handelsbilanz (Buchwert zzgl. 20 %).
(3) Zur Vermeidung von Liquiditätsengpässen ist die Abfindung in fünf gleichen Jahresraten, beginnend ein Jahr nach dem Wirksamwerden des Ausscheidens, fällig. Die Raten sind mit 2 % p.a. über dem jeweiligen Basiszinssatz der EZB zu verzinsen.

§ 9 Salvatorische Klausel
Sollten einzelne Bestimmungen dieses Vertrages ganz oder teilweise unwirksam oder undurchführbar sein oder werden, so wird hierdurch die Gültigkeit der übrigen Bestimmungen nicht berührt. Anstelle der unwirksamen Bestimmung gilt diejenige Regelung als vereinbart, die dem wirtschaftlichen Zweck am nächsten kommt.

Ort, Datum: ________________________
Unterschrift des Gründers (${gruenderName.trim() || "[Vorname Name]"}): ________________________
Notarielle Beglaubigung:`
    },
    {
      id: "beschluss",
      title: "Musterbeschluss: Holding-Gewinnausschüttung",
      badge: "§8b Abs. 1 & 5 KStG",
      format: "Gesellschafterbeschluss (.doc / .txt)",
      filename: "kontolage-holding-gewinnausschuettung-beschluss.doc",
      description: "Formeller Gesellschafterbeschluss der Tochtergesellschaft zur Ausschüttung an die Holding (95 % steuerfrei, 5 % Schachtelstrafe, KapESt-Freistellung).",
      content: `================================================================================
RECHTLICHER HINWEIS GEMÄSS § 2 ABS. 1 RDG & § 1 STBERG:
Dieses Dokument ist ein redaktionelles, standardisiertes Muster und eine
Formulierungshilfe der Kontolage-Redaktion zur Information und Vorbereitung auf
Beratungs- und Notartermine. Es stellt ausdrücklich KEINE Rechtsberatung im Sinne
des Rechtsdienstleistungsgesetzes (RDG) und KEINE Steuerberatung im Sinne des
Steuerberatungsgesetzes (StBerG) dar. Es begründet kein Mandats- oder
Beratungsverhältnis. Die Nutzung erfolgt eigenverantwortlich.
Vor notarieller Beurkundung (§ 2 Abs. 1 GmbHG) oder formeller Beschlussfassung
ist zwingend die Prüfung durch einen zugelassenen Notar, Steuerberater oder
Rechtsanwalt erforderlich.
================================================================================

GESELLSCHAFTERBESCHLUSS ÜBER GEWINNAUSSCHÜTTUNG AN DIE HOLDING-GMBH
(Nach § 8b Abs. 1 und Abs. 5 KStG i.V.m. § 44a Abs. 4b EStG)
Stand: 2026 · Kontolage Executive B2B

PROTOKOLL DER AUSSERORDENTLICHEN GESELLSCHAFTERVERSAMMLUNG
der ${tochterFirma.trim() || "[Operative Tochtergesellschaft]"} GmbH
mit Sitz in [Ort], eingetragen im Handelsregister des AG [Ort] unter HRB [Nummer]

Am heutigen Tag versammelte sich die Gesellschafterin der Gesellschaft:
Muttergesellschaft: ${firmaHolding.trim() || "[Name der Holding]"} Vermögensverwaltung GmbH
vertreten durch den Geschäftsführer: ${gruenderName.trim() || "[Vorname Name]"}
– Inhaberin von 100 % der Geschäftsanteile –

Der Geschäftsführer stellt fest:
1. Die Gesellschafterin ist vollzählig vertreten.
2. Auf alle Formen und Fristen der Einberufung der Gesellschafterversammlung wird einstimmig verzichtet.
3. Die Versammlung ist beschlussfähig.

TAGESORDNUNG:
1. Feststellung des geprüften Jahresabschlusses für das Geschäftsjahr 2025/2026.
2. Beschlussfassung über die Verwendung des Bilanzgewinns (Ausschüttung an Muttergesellschaft).
3. Steuerliche Deklaration nach § 8b KStG und Abführung / Abstandnahme der Kapitalertragsteuer.

BESCHLUSS:
1. Der von der Geschäftsführung aufgestellte Jahresabschluss für das abgelaufene Geschäftsjahr, der einen Bilanzgewinn in Höhe von
   EUR ${ausschuettung.toLocaleString("de-DE")},00
   ausweist, wird vollumfänglich festgestellt und genehmigt.

2. Der Bilanzgewinn in Höhe von EUR ${ausschuettung.toLocaleString("de-DE")},00 wird wie folgt verwendet:
   a) Ein Betrag von EUR ${ausschuettung.toLocaleString("de-DE")},00 wird als offene Gewinnausschüttung an die Alleingesellschafterin, die ${firmaHolding.trim() || "[Name Holding]"} GmbH, ausgeschüttet.
   b) Ein etwaiger Restbetrag wird auf neue Rechnung vorgetragen.
   c) Der Ausschüttungsbetrag ist zur Zahlung auf das Bankkonto der Holding fällig.

3. Steuerliche Einordnung und Hinweis für das Finanzamt:
   - Die empfangende Muttergesellschaft hält zum Zeitpunkt der Beschlussfassung 100 % der Anteile an der ausschüttenden Gesellschaft (Beteiligung > 10 % gem. § 8b Abs. 4 KStG).
   - Die Gewinnausschüttung ist bei der Muttergesellschaft gemäß § 8b Abs. 1 KStG zu 100 % von der Körperschaftsteuer und Gewerbesteuer befreit.
   - Gemäß § 8b Abs. 5 KStG gelten 5 % der Bezüge als nicht abzugsfähige Betriebsausgaben, sodass eine effektive Steuerbelastung von lediglich ca. 1,54 % (KSt 15 % + SolZ 5,5 % auf 5 %) anfällt.
   - Gemäß § 44a Abs. 4b / 5 EStG bzw. bestehender Dauer-Freistellungsbescheinigung des Bundeszentralamts für Steuern (BZSt) wird vom Steuerabzug der Kapitalertragsteuer Abstand genommen bzw. erfolgt die direkte Verrechnung im Rahmen der Körperschaftsteuererklärung.

Ort, Datum: ________________________
Unterschrift Geschäftsführer Tochter-GmbH: ________________________
Unterschrift Vertreter Holding-Mutter (${gruenderName.trim() || "[Vorname Name]"}): ________________________`
    },
    {
      id: "rechenmodell",
      title: "Dynamisches Excel-Rechenmodell: 20-Jahres-Bilanz",
      badge: "Mit Live-Excel-Formeln",
      format: "Excel-kompatibles CSV (.csv)",
      filename: dynamicCsvFilename,
      isCsv: true,
      description: "Vollständige Jahresbilanz (Jahr 1–20) im direkten Vergleich: Privatdepot (26,375 % Abgeltungsteuer) vs. Holding GmbH (1,54 % KSt + SolZ). Mit dynamischen Excel-Formeln zum Selbstrechnen.",
      content: dynamicCsvContent,
    },
    {
      id: "elster",
      title: "ELSTER-Ausfüllhilfe & Kennzahlen-Leitfaden 2026",
      badge: "KSt 1 · Anlage GK · GewSt 1 A",
      format: "Ausfüll-Leitfaden (.txt / .doc)",
      filename: "kontolage-elster-ausfuellhilfe-2026.doc",
      description: "Zeilen-für-Zeilen-Anleitung für die Steuererklärung: Beteiligungserträge, 5% Schachtel-Korrektur und erweiterte Gewerbesteuerkürzung.",
      content: `ELSTER-LEITFADEN FÜR VERMÖGENSVERWALTENDE KAPITALGESELLSCHAFTEN 2026
Praxisanleitung für KSt 1, Anlage GK, Anlage KSt 1 F und GewSt 1 A
Stand: Steuerjahr 2026 · Kontolage Executive B2B

1. HAUPTVORDRUCK KST 1 (KÖRPERSCHAFTSTEUER)
- Zeilen 1–15: Allgemeine Angaben zur Holding (Steuernummer, Wirtschaftsjahr 01.01.–31.12., Rechtsform GmbH).
- Zeile 25: Feststellungserklärung nach § 27 Abs. 2 KStG (Steuerliches Einlagekonto) — Haken bei „JA“ zwingend setzen!

2. ANLAGE GK (GEWINNKORREKTUR — DAS KERNSTÜCK)
Hier wird der handelsrechtliche Jahresüberschuss steuerlich korrigiert:
- Zeile 41 (Erträge nach § 8b Abs. 1 KStG):
  Eintragen der vollen Brutto-Ausschüttungen der Tochter-GmbHs (z. B. 100.000 €).
  -> Dieser Betrag mindert das zu versteuernde Einkommen (100% steuerfrei).
- Zeile 43 (Nicht abzugsfähige Betriebsausgaben nach § 8b Abs. 5 KStG):
  Eintragen von genau 5 % des Betrags aus Zeile 41 (z. B. 5.000 €).
  -> Dieser Betrag wird dem Gewinn wieder hinzugerechnet.
- Zeile 50 (Veräußerungsgewinne nach § 8b Abs. 2 KStG):
  Eintragen von Gewinnen aus dem Verkauf von Aktien oder GmbH-Anteilen.
  -> Steuerfrei gemindert.
- Zeile 52 (Hinzurechnung § 8b Abs. 3 KStG):
  Eintragen von 5 % des Veräußerungsgewinns als pauschale Betriebsausgabe.

3. ANLAGE KST 1 F (STEUERLICHES EINLAGEKONTO § 27 KSTG)
- Zeile 4: Endbestand des Vorjahres (aus dem letzten Feststellungsbescheid).
- Zeile 7: Einlagen im laufenden Wirtschaftsjahr (z. B. Bareinzahlung Stammkapital oder Gesellschafterdarlehen, die als Eigenkapital gewidmet wurden).
- Zeile 10: Rückzahlungen / Einlagenrückgewähr (bleibt für Gesellschafter gem. § 20 Abs. 1 Nr. 1 Satz 3 EStG steuerfrei!).

4. FORMULAR GEWST 1 A (GEWERBESTEUER)
- Zeile 35: Maßgebender Gewerbeertrag (handelsrechtlicher Gewinn vor Steuern).
- Zeile 46 (Erweiterte Kürzung bei reinem Grundbesitz § 9 Nr. 1 Satz 2 GewStG):
  Falls die Holding ausschließlich Grundbesitz verwaltet: Hier wird der gesamte Grundstücksertrag gekürzt -> Gewerbesteuer = 0 €!
- Zeile 51 (Kürzung nach § 9 Nr. 2a GewStG):
  Kürzung der Gewinnanteile an einer inländischen Kapitalgesellschaft, sofern die Beteiligung zu Beginn des Erhebungszeitraums mindestens 15 % betrug.

5. EINKOMMENSTEUER (PRIVAT: FÜNFTELREGELUNG § 34 ABS. 1 ESTG)
- Formular Anlage N:
  - Zeile 17: Ermäßigt besteuerter Arbeitslohn für mehrere Jahre (Abfindungen, Vergütungen für mehrjährige Tätigkeiten).
  - Zeile 18: Einbehaltene Lohnsteuer auf ermäßigt besteuerte Abfindungen.
- Wichtig: Nachweis der Zusammenballung von Einkünften (Prüfung: Einkünfte im Abfindungsjahr übersteigen die regulären Vorjahreseinkünfte).`
    },
    {
      id: "ggf",
      title: "GGF-Gehaltspaket & BFH-Checkliste",
      badge: "BFH-Prüfmatrix · vGA-Vermeidung",
      format: "Checkliste & Leitfaden (.doc / .txt)",
      filename: "kontolage-ggf-gehaltspaket-analyse.doc",
      description: "Prüfkriterien zur Angemessenheit von Geschäftsführerbezügen, Tantieme-Deckelung, Vermeidung verdeckter Gewinnausschüttungen (vGA) und steuerfreien Benefits.",
      content: `GGF-GEHALTSPAKET & BFH-ANGEMESSENHEITSPRÜFUNG
Leitfaden zur Vermeidung verdeckter Gewinnausschüttungen (vGA) gem. § 8 Abs. 3 Satz 2 KStG
Stand: 2026 · Kontolage Executive B2B

1. DIE 5 KARDINALTUGENDEN DES GESELLSCHAFTER-GESCHÄFTSFÜHRERS
Ein Gesellschafter-Geschäftsführer (GGF) unterliegt strengeren Maßstäben als ein Fremdgeschäftsführer:
1. Zivilrechtliche Wirksamkeit: Beschluss der Gesellschafterversammlung (§ 46 Nr. 5 GmbHG) zwingend vorab erforderlich.
2. Strenges Rückwirkungsverbot: Vereinbarungen für die Vergangenheit führen automatisch zur vGA! Jede Gehaltserhöhung gilt frühestens ab Folgemonat.
3. Klare, eindeutige und schriftliche Vereinbarung im Voraus.
4. Tatsächliche Durchführung wie vereinbart (Gehalt muss termingerecht überwiesen werden).
5. Angemessenheit der Gesamtausstattung im Fremdvergleich.

2. ANGEMESSENHEIT IM FREMDVERGLEICH (KARLSRUHER TABELLE & BFH)
Die Gesamtausstattung umfasst: Grundgehalt + Tantieme + Sachbezüge (PKW, Handy) + Altersversorgung.
- Branchenvergleich: Liegt das Gesamtgehalt im Rahmen dessen, was fremde Geschäftsführer bei vergleichbarer Umsatzgröße und Mitarbeiterzahl erhalten?
- Faustformel Umsatzrendite: Nach Abzug des GGF-Gehalts muss der GmbH eine angemessene Eigenkapitalverzinsung bzw. ein angemessener Jahresüberschuss verbleiben (mindestens 10–15 % Vorsteuer-Rendite).

3. TANTIEME-GRENZEN NACH BFH-RECHTSPRECHUNG
- 50%-Regel: Die Gesamttantieme aller Geschäftsführer darf maximal 50 % des handelsrechtlichen Jahresüberschusses (vor Tantieme und Steuern) betragen.
- 25%-Regel: Der variable Anteil (Tantieme) darf im Regelfall nicht mehr als 25 % bis 30 % der gesamten Jahresvergütung ausmachen. Reine Gewinntantiemen ohne Verlustverrechnung sind risikobehaftet.

4. STEUERFREIE BENEFITS & OPTIMIERUNGEN (§ 8 ABS. 2 ESTG)
Folgende Gehaltsbestandteile mindern als Betriebsausgabe den GmbH-Gewinn, sind aber beim GGF steuer- und sozialabgabenfrei:
- 50 € Sachbezugsfreigrenze pro Monat (§ 8 Abs. 2 Satz 11 EStG) via steuerfreier Sachbezugskarte.
- 60 € Aufmerksamkeiten zu persönlichen Anlässen (§ 19.6 LStR, z. B. Geburtstag, Hochzeit, Geburt).
- Jobrad / E-Bike zur privaten Nutzung (§ 3 Nr. 37 EStG): 100 % steuerfrei, sofern zusätzlich zum ohnehin geschuldeten Arbeitslohn.
- Kindergartenzuschuss (§ 3 Nr. 33 EStG): Unbegrenzt steuerfrei für nicht schulpflichtige Kinder.
- Betriebliche Altersversorgung (Direktversicherung nach § 3 Nr. 63 EStG): Bis zu 8 % der Beitragsbemessungsgrenze steuerfrei.`
    }
  ];

  return (
    <div style={{ marginTop: 24 }}>
      {/* Rechtliche Absicherung & Stammdaten-Konfigurator */}
      <div style={{ marginBottom: 20, padding: "16px 20px", background: "rgba(10,18,34,0.75)", borderRadius: 10, border: "1px solid rgba(201,168,76,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#86efac" }}>🛡️</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#e2c27d", textTransform: "uppercase" }}>
                Rechtliche Absicherung (§ 2 RDG · § 1 StBerG · § 2 Abs. 8 Nr. 10 WpHG)
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.6, margin: 0 }}>
              Alle Dokumente, Satzungsmuster und Rechenmodelle sind standardisierte Formulierungshilfen und Bildungsinhalte zur Information und Vorbereitung auf Beratungs- und Notartermine. Sie stellen keine Rechts- oder Steuerberatung dar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              background: showConfig ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.4)",
              color: "#e2c27d",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {showConfig ? "▲ Eingabemaske schließen" : "⚙️ Vorlagen mit eigenen Stammdaten vorausfüllen"}
          </button>
        </div>

        {showConfig && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#cdc6be", marginBottom: 12 }}>
              Eigene Unternehmens- &amp; Personendaten (ersetzen Platzhalter in Mustersatzung &amp; Beschluss):
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#a89f94", marginBottom: 4 }}>Holding-Firmenname</label>
                <input
                  type="text"
                  value={firmaHolding}
                  onChange={(e) => setFirmaHolding(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", background: "rgba(10,14,24,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#f0ece4", fontSize: 12 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#a89f94", marginBottom: 4 }}>Sitz der Holding</label>
                <input
                  type="text"
                  value={sitzHolding}
                  onChange={(e) => setSitzHolding(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", background: "rgba(10,14,24,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#f0ece4", fontSize: 12 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#a89f94", marginBottom: 4 }}>Name Gründer / Geschäftsführer</label>
                <input
                  type="text"
                  value={gruenderName}
                  onChange={(e) => setGruenderName(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", background: "rgba(10,14,24,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#f0ece4", fontSize: 12 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#a89f94", marginBottom: 4 }}>Stammkapital (€)</label>
                <input
                  type="number"
                  step="5000"
                  value={stammkapital}
                  onChange={(e) => setStammkapital(Number(e.target.value))}
                  style={{ width: "100%", padding: "7px 10px", background: "rgba(10,14,24,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#f0ece4", fontSize: 12 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#a89f94", marginBottom: 4 }}>Operative Tochtergesellschaft</label>
                <input
                  type="text"
                  value={tochterFirma}
                  onChange={(e) => setTochterFirma(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", background: "rgba(10,14,24,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#f0ece4", fontSize: 12 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#a89f94", marginBottom: 4 }}>Gewinnausschüttung (€)</label>
                <input
                  type="number"
                  step="10000"
                  value={ausschuettung}
                  onChange={(e) => setAusschuettung(Number(e.target.value))}
                  style={{ width: "100%", padding: "7px 10px", background: "rgba(10,14,24,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#f0ece4", fontSize: 12 }}
                />
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#86efac", marginTop: 10 }}>
              ✓ Live-Aktualisierung: Alle Dokumente &amp; Downloads enthalten sofort Ihre individualisierten Stammdaten samt rechtlichem Schutzhinweis.
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "linear-gradient(145deg, rgba(20,32,60,0.85), rgba(15,22,40,0.95))",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 10,
              padding: "20px 24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 320px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#0C1825",
                    background: "linear-gradient(135deg, #c9a84c, #e2c27d)",
                    padding: "3px 8px",
                    borderRadius: 4,
                    textTransform: "uppercase"
                  }}>
                    {item.badge}
                  </span>
                  <span style={{ fontSize: 11, color: "#a89f94", fontFamily: "var(--font-mono)" }}>
                    {item.format}
                  </span>
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "#f0ece4", margin: "4px 0 6px" }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.6, margin: 0 }}>
                  {item.description}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setActivePreview(activePreview === item.id ? null : item.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: activePreview === item.id ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
                    color: activePreview === item.id ? "#e2c27d" : "#cdc6be",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {activePreview === item.id ? "Schließen" : item.id === "rechenmodell" ? "⚙️ Werte anpassen & Vorschau" : "Vorschau"}
                </button>

                {isUnlocked && (
                  <>
                    <button
                      type="button"
                      onClick={() => void copyToClipboard(item.id, item.content)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.04)",
                        color: copiedId === item.id ? "#4ade80" : "#cdc6be",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {copiedId === item.id ? "✓ Kopiert!" : "Kopieren"}
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadFile(item.filename, item.content, item.isCsv)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        background: "linear-gradient(135deg, #c9a84c, #e2c27d)",
                        border: "none",
                        color: "#0C1825",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(201,168,76,0.25)",
                      }}
                    >
                      ↓ Download ({item.isCsv ? ".csv" : ".doc"})
                    </button>
                  </>
                )}
              </div>
            </div>

            {activePreview === item.id && (
              <div style={{ marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                {item.id === "rechenmodell" && isUnlocked && (
                  <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f0ece4" }}>
                        ⚙️ Individuelle Parameter für den Excel-Export einstellen:
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#86efac", background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(16,185,129,0.3)" }}>
                        ✓ Echte Excel-Formeln hinterlegt
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.6, marginBottom: 16 }}>
                      Ihre Werte fließen direkt in den Download ein. <strong>Wichtig:</strong> Die heruntergeladene Datei enthält dynamische Excel-Zellformeln (z.B. <code>=B14*$B$7</code>). Sie können die Parameter später auch direkt in Microsoft Excel oder Google Sheets beliebig verändern — alle 20 Jahre und Zinseszinsen passen sich automatisch an!
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 18 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
                          <span>Startkapital</span>
                          <span style={{ fontFamily: "var(--font-mono)", color: "#e2c27d", fontWeight: 600 }}>{modelKapital.toLocaleString("de-DE")} €</span>
                        </div>
                        <input
                          type="range"
                          min={25000}
                          max={2000000}
                          step={25000}
                          value={modelKapital}
                          onChange={e => setModelKapital(Number(e.target.value))}
                          style={{ width: "100%", accentColor: "#c9a84c" }}
                        />
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
                          <span>Brutto-Rendite p.a.</span>
                          <span style={{ fontFamily: "var(--font-mono)", color: "#e2c27d", fontWeight: 600 }}>{modelRendite.toFixed(1)} %</span>
                        </div>
                        <input
                          type="range"
                          min={3}
                          max={15}
                          step={0.5}
                          value={modelRendite}
                          onChange={e => setModelRendite(Number(e.target.value))}
                          style={{ width: "100%", accentColor: "#c9a84c" }}
                        />
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cdc6be", marginBottom: 4 }}>
                          <span>Fixkosten Holding p.a.</span>
                          <span style={{ fontFamily: "var(--font-mono)", color: "#e2c27d", fontWeight: 600 }}>{modelFixkosten.toLocaleString("de-DE")} €</span>
                        </div>
                        <input
                          type="range"
                          min={500}
                          max={5000}
                          step={100}
                          value={modelFixkosten}
                          onChange={e => setModelFixkosten(Number(e.target.value))}
                          style={{ width: "100%", accentColor: "#c9a84c" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, padding: "14px 16px", background: "rgba(10,15,30,0.7)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#a89f94" }}>Endstand Holding (20 Jahre)</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: "#e2c27d", marginTop: 2 }}>{previewHolding20.toLocaleString("de-DE")} €</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#a89f94" }}>Endstand Privat (20 Jahre)</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: "#a89f94", marginTop: 2 }}>{previewPrivat20.toLocaleString("de-DE")} €</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#a89f94" }}>Vorteil Holding vs. Privat</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: vorteil20 > 0 ? "#4ade80" : "#fca5a5", marginTop: 2 }}>
                          {vorteil20 > 0 ? "+" : ""}{vorteil20.toLocaleString("de-DE")} €
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#c9a84c" }}>
                    {isUnlocked ? `Vollständiger Dokumenttext (${item.filename})` : "Vorschau — Volltext nur mit Executive B2B"}
                  </span>
                  {isUnlocked && (
                  <button
                    type="button"
                    onClick={() => void copyToClipboard(item.id, item.content)}
                    style={{
                      background: "none",
                      border: "none",
                      color: copiedId === item.id ? "#4ade80" : "#a89f94",
                      fontSize: 12,
                      cursor: "pointer",
                      textDecoration: "underline"
                    }}
                  >
                    {copiedId === item.id ? "✓ In Zwischenablage kopiert" : "In Zwischenablage kopieren"}
                  </button>
                  )}
                </div>
                {isUnlocked ? (
                <pre style={{
                  background: "rgba(10,14,24,0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  padding: 16,
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  color: "#cdc6be",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: 380,
                  overflowY: "auto",
                  lineHeight: 1.6,
                }}>
                  {item.content}
                </pre>
                ) : (
                  <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7, margin: 0 }}>
                    {item.description} Der vollständige Dokumenttext, die Stammdaten-Personalisierung und der Download sind im Tarif Executive B2B (29&nbsp;€/Monat netto, zzgl. 19&nbsp;% MwSt.) enthalten.{" "}
                    <a href="/abo" style={{ color: "#e2c27d", fontWeight: 600 }}>Tarife vergleichen →</a>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
