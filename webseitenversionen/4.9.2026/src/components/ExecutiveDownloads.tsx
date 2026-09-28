import { useState } from "react";

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

export default function ExecutiveDownloads({ isUnlocked = true }: { isUnlocked?: boolean }) {
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const downloadTextFile = (filename: string, content: string, isCsv = false) => {
    const mimeType = isCsv ? "text/csv;charset=utf-8;" : "text/plain;charset=utf-8;";
    const prefix = isCsv ? "\uFEFF" : "";
    const blob = new Blob([prefix + content], { type: mimeType });
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
      // Fallback
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
      content: `MUSTERSATZUNG EINER VERMÖGENSVERWALTENDEN GMBH (HOLDING)
(Rechtlich geprüft nach GmbHG, § 8b KStG und § 9 Nr. 1 Satz 2 GewStG)
Dokumentenstand: 2026 · Kontolage Executive B2B

URKUNDENROLLE-NR. [________] / 2026

GESELLSCHAFTSVERTRAG
der „[Firma] Vermögensverwaltung GmbH“

§ 1 Firma, Sitz und Geschäftsjahr
(1) Die Firma der Gesellschaft lautet:
    [Wunschname] Vermögensverwaltung GmbH
(2) Der Sitz der Gesellschaft ist [Stadt/Gemeinde].
(3) Das Geschäftsjahr ist das Kalenderjahr. Das erste Geschäftsjahr ist ein Rumpfgeschäftsjahr, das mit der Eintragung in das Handelsregister beginnt und am 31. Dezember des laufenden Jahres endet.

§ 2 Gegenstand des Unternehmens (Kernelement der erweiterten Gewerbesteuerkürzung)
(1) Gegenstand des Unternehmens ist ausschließlich die Verwaltung und Nutzung eigenen Vermögens, insbesondere das Halten und Verwalten von Beteiligungen an anderen Kapitalgesellschaften im In- und Ausland, Wertpapieren, Festgeldern, Edelmetallen sowie von eigenem Grundbesitz.
(2) Die Gesellschaft ist nicht berechtigt, gewerblich tätig zu werden, gewerblichen Wertpapier- oder Grundstückshandel zu betreiben oder Tätigkeiten auszuüben, die einer Erlaubnis nach § 32 KWG, § 34c GewO oder dem KAGB bedürfen.
(3) Die Gesellschaft darf Zweigniederlassungen im In- und Ausland errichten, soweit dadurch die Voraussetzungen der steuerlichen Vermögensverwaltung nicht beeinträchtigt werden.

§ 3 Stammkapital und Geschäftsanteile
(1) Das Stammkapital der Gesellschaft beträgt EUR 25.000,00 (in Worten: Euro fünfundzwanzigtausend).
(2) Auf das Stammkapital übernimmt:
    Herr/Frau [Vorname Name], geboren am [Datum], wohnhaft in [Adresse],
    einen Geschäftsanteil mit dem Nennbetrag von EUR 25.000,00 (Geschäftsanteil Nr. 1).
(3) Die Stammeinlage ist in Geld zu erbringen und in voller Höhe sofort nach Errichtung der Gesellschaft auf das Gesellschaftskonto einzuzahlen.

§ 4 Geschäftsführung und Vertretung
(1) Die Gesellschaft hat einen oder mehrere Geschäftsführer.
(2) Ist nur ein Geschäftsführer bestellt, so vertritt er die Gesellschaft allein. Sind mehrere Geschäftsführer bestellt, wird die Gesellschaft durch zwei Geschäftsführer gemeinschaftlich oder durch einen Geschäftsführer zusammen mit einem Prokuristen vertreten.
(3) Durch Beschluss der Gesellschafterversammlung kann Geschäftsführern Einzelvertretungsbefugnis und/oder Befreiung von den Beschränkungen des § 181 BGB (Selbstkontrahierungsverbot) erteilt werden.
(4) Herr/Frau [Vorname Name] wird zum ersten Geschäftsführer bestellt. Er/Sie ist stets einzelvertretungsberechtigt und von den Beschränkungen des § 181 BGB vollumfänglich befreit.

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
Unterschrift des Gründers: ________________________
Notarielle Beglaubigung:`
    },
    {
      id: "beschluss",
      title: "Musterbeschluss: Holding-Gewinnausschüttung",
      badge: "§8b Abs. 1 & 5 KStG",
      format: "Gesellschafterbeschluss (.doc / .txt)",
      filename: "kontolage-holding-gewinnausschuettung-beschluss.doc",
      description: "Formeller Gesellschafterbeschluss der Tochtergesellschaft zur Ausschüttung an die Holding (95 % steuerfrei, 5 % Schachtelstrafe, KapESt-Freistellung).",
      content: `GESELLSCHAFTERBESCHLUSS ÜBER GEWINNAUSSCHÜTTUNG AN DIE HOLDING-GMBH
(Nach § 8b Abs. 1 und Abs. 5 KStG i.V.m. § 44a Abs. 4b EStG)
Stand: 2026 · Kontolage Executive B2B

PROTOKOLL DER AUSSERORDENTLICHEN GESELLSCHAFTERVERSAMMLUNG
der [Operative Tochtergesellschaft] GmbH
mit Sitz in [Ort], eingetragen im Handelsregister des AG [Ort] unter HRB [Nummer]

Am heutigen Tag versammelte sich die Gesellschafterin der Gesellschaft:
Muttergesellschaft: [Name der Holding] Vermögensverwaltung GmbH
vertreten durch den Geschäftsführer: [Vorname Name]
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
   EUR [Betrag, z.B. 100.000,00]
   ausweist, wird vollumfänglich festgestellt und genehmigt.

2. Der Bilanzgewinn in Höhe von EUR [Betrag] wird wie folgt verwendet:
   a) Ein Betrag von EUR [Ausschüttungsbetrag, z.B. 100.000,00] wird als offene Gewinnausschüttung an die Alleingesellschafterin, die [Name Holding] GmbH, ausgeschüttet.
   b) Der Restbetrag in Höhe von EUR [Rest, z.B. 0,00] wird auf neue Rechnung vorgetragen.
   c) Der Ausschüttungsbetrag ist am [Datum, z.B. 31. März 2026] zur Zahlung auf das Bankkonto der Holding fällig.

3. Steuerliche Einordnung und Hinweis für das Finanzamt:
   - Die empfangende Muttergesellschaft hält zum Zeitpunkt der Beschlussfassung 100 % der Anteile an der ausschüttenden Gesellschaft (Beteiligung > 10 % gem. § 8b Abs. 4 KStG).
   - Die Gewinnausschüttung ist bei der Muttergesellschaft gemäß § 8b Abs. 1 KStG zu 100 % von der Körperschaftsteuer und Gewerbesteuer befreit.
   - Gemäß § 8b Abs. 5 KStG gelten 5 % der Bezüge als nicht abzugsfähige Betriebsausgaben, sodass eine effektive Steuerbelastung von lediglich ca. 1,54 % (KSt 15 % + SolZ 5,5 % auf 5 %) anfällt.
   - Gemäß § 44a Abs. 4b / 5 EStG bzw. bestehender Dauer-Freistellungsbescheinigung des Bundeszentralamts für Steuern (BZSt) wird vom Steuerabzug der Kapitalertragsteuer Abstand genommen bzw. erfolgt die direkte Verrechnung im Rahmen der Körperschaftsteuererklärung.

Ort, Datum: ________________________
Unterschrift Geschäftsführer Tochter-GmbH: ________________________
Unterschrift Vertreter Holding-Mutter: ________________________`
    },
    {
      id: "rechenmodell",
      title: "Dynamisches Excel-Rechenmodell: 20-Jahres-Bilanz",
      badge: "CSV / Excel-Modell mit Formeln",
      format: "Excel-kompatibles CSV (.csv)",
      filename: "kontolage-holding-rechenmodell-20-jahre.csv",
      isCsv: true,
      description: "Vollständige Jahresbilanz (Jahr 1–20) im direkten Vergleich: Privatdepot (26,375 % Abgeltungsteuer) vs. Holding GmbH (1,54 % KSt + SolZ). Inklusive IHK und Steuerberater.",
      content: `Jahr;Holding_Start;Holding_Rendite_7pct;Holding_KSt_SolZ_1.54pct;Holding_Kosten_StB_IHK;Holding_Endbestand;Privat_Start;Privat_Rendite_7pct;Privat_Abgeltung_26.375pct;Privat_Endbestand;Netto_Vorteil_Holding_pa;Kumulierter_Vorteil_Holding
1;250000;17500;270;1800;265430;250000;17500;4616;262884;2546;2546
2;265430;18580;286;1800;281924;262884;18402;4854;276433;5491;8037
3;281924;19735;304;1800;299555;276433;19350;5104;290680;8875;16912
4;299555;20969;323;1800;318401;290680;20348;5367;305661;12740;29652
5;318401;22288;343;1800;338545;305661;21396;5643;321414;17131;46783
6;338545;23698;365;1800;360079;321414;22499;5934;337979;22099;68882
7;360079;25206;388;1800;383096;337979;23659;6240;355397;27699;96581
8;383096;26817;413;1800;407700;355397;24878;6562;373714;33986;130567
9;407700;28539;439;1800;434000;373714;26160;6900;392974;41026;171593
10;434000;30380;468;1800;462112;392974;27508;7255;413227;48885;220478
11;462112;32348;498;1800;492161;413227;28926;7629;434524;57637;278115
12;492161;34451;531;1800;524282;434524;30417;8022;456918;67364;345479
13;524282;36700;565;1800;558617;456918;31984;8436;480467;78150;423629
14;558617;39103;602;1800;595318;480467;33633;8871;505229;90089;513718
15;595318;41672;642;1800;634549;505229;35366;9328;531267;103282;617000
16;634549;44418;684;1800;676483;531267;37189;9809;558647;117836;734836
17;676483;47354;729;1800;721307;558647;39105;10314;587438;133869;868705
18;721307;50492;778;1800;769221;587438;41121;10846;617713;151508;1020213
19;769221;53845;829;1800;820437;617713;43240;11405;649549;170889;1191101
20;820437;57431;884;1800;875183;649549;45468;11992;683025;192158;1383259`
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
                  {activePreview === item.id ? "Schließen" : "Vorschau"}
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
                      onClick={() => downloadTextFile(item.filename, item.content, item.isCsv)}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#c9a84c" }}>
                    Vollständiger Dokumenttext ({item.filename})
                  </span>
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
                </div>
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
