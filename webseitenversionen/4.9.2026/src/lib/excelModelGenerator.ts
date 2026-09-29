export interface ModelParameters {
  startkapital: number;
  rendite: number; // e.g. 7 for 7%
  fixkosten: number; // e.g. 1800
  steuersatzGmbH?: number; // default 1.54%
  steuersatzPrivat?: number; // default 26.375%
}

/**
 * Generates an Excel-compatible CSV file (German format: semicolon-separated, UTF-8 BOM)
 * containing full live Excel formulas so the user can change any input parameter
 * in Excel and watch all 20 years recalculate dynamically.
 */
export function generateHoldingExcelCsv(params: ModelParameters): string {
  const {
    startkapital,
    rendite,
    fixkosten,
    steuersatzGmbH = 0.0154,
    steuersatzPrivat = 0.26375,
  } = params;

  const renditeDec = rendite > 1 ? rendite / 100 : rendite;

  // Format numbers for German Excel (comma as decimal separator)
  const formatNum = (n: number) => n.toString().replace(".", ",");

  const lines: string[] = [];

  // Title & Header Information
  lines.push(`"KONTOLAGE.DE — B2B DYNAMISCHES EXCEL-RECHENMODELL: HOLDING VS. PRIVATDEPOT"`);
  lines.push(`"Rechtliche Grundlage: § 8b KStG (95% Steuerfreistellung) vs. § 20 / § 32d EStG (Abgeltungsteuer)"`);
  lines.push(`"Hinweis: Sie können die Parameter in den Zeilen 6 bis 10 in Excel frei anpassen. Alle 20 Jahre und Zinseszinsen rechnen sich durch hinterlegte Zellformeln automatisch neu!"`);
  lines.push(``);

  // Parameter block (Rows 5 to 10)
  lines.push(`"STEUER- & INVESTITIONSPARAMETER";"WERT";"EINHEIT";"HINWEIS"`);
  lines.push(`"Startkapital";${startkapital};"EUR";"Einzubringendes Depot-/Anlagevermögen"`);
  lines.push(`"Angenommene Brutto-Rendite p.a.";${formatNum(renditeDec)};"Prozent";"Erwarteter Wertzuwachs / Kursgewinne vor Steuern"`);
  lines.push(`"Laufende Fixkosten Holding p.a.";${fixkosten};"EUR";"Steuerberater, Jahresabschluss, Bundesanzeiger, IHK"`);
  lines.push(`"Steuersatz Holding (§ 8b KStG)";${formatNum(steuersatzGmbH)};"Prozent";"KSt (15%) + SolZ (5,5%) auf 5% nicht abzugsfähige BA gem. § 8b KStG"`);
  lines.push(`"Steuersatz Privat (Kapitalerträge)";${formatNum(steuersatzPrivat)};"Prozent";"Abgeltungsteuer (25%) + Solidaritätszuschlag (5,5%)"`);
  lines.push(``);

  // Table header (Row 12 & 13)
  lines.push(`"20-JAHRES-VERMÖGENSBILANZ IM DIREKTEN VERGLEICH"`);
  lines.push(`"Jahr";"Holding Start (€)";"Holding Ertrag (€)";"Holding KSt/SolZ (€)";"Holding Fixkosten (€)";"Holding Endbestand (€)";"Privat Start (€)";"Privat Ertrag (€)";"Privat Abgeltungsteuer (€)";"Privat Endbestand (€)";"Vorteil Holding p.a. (€)";"Kumulierter Vermögensvorteil (€)"`);

  // Generate 20 rows with live Excel formulas (Rows 14 to 33)
  for (let yr = 1; yr <= 20; yr++) {
    const rowNum = 13 + yr; // Year 1 is row 14
    const prevRowNum = rowNum - 1;

    let holdingStartFormula: string;
    let privatStartFormula: string;
    let kumulierterVorteilFormula: string;

    if (yr === 1) {
      holdingStartFormula = `=B6`;
      privatStartFormula = `=B6`;
      kumulierterVorteilFormula = `=K${rowNum}`;
    } else {
      holdingStartFormula = `=F${prevRowNum}`;
      privatStartFormula = `=J${prevRowNum}`;
      kumulierterVorteilFormula = `=L${prevRowNum}+K${rowNum}`;
    }

    const holdingErtragFormula = `=B${rowNum}*$B$7`;
    const holdingSteuerFormula = `=C${rowNum}*$B$9`;
    const holdingFixkostenFormula = `=$B$8`;
    const holdingEndFormula = `=B${rowNum}+C${rowNum}-D${rowNum}-E${rowNum}`;

    const privatErtragFormula = `=G${rowNum}*$B$7`;
    const privatSteuerFormula = `=H${rowNum}*$B$10`;
    const privatEndFormula = `=G${rowNum}+H${rowNum}-I${rowNum}`;

    const vorteilPaFormula = `=F${rowNum}-J${rowNum}`;

    lines.push(
      `${yr};${holdingStartFormula};${holdingErtragFormula};${holdingSteuerFormula};${holdingFixkostenFormula};${holdingEndFormula};${privatStartFormula};${privatErtragFormula};${privatSteuerFormula};${privatEndFormula};${vorteilPaFormula};${kumulierterVorteilFormula}`
    );
  }

  // Summary & Break-Even Evaluation
  lines.push(``);
  lines.push(`"ZUSAMMENFASSUNG & ERGEBNIS NACH 20 JAHREN"`);
  lines.push(`"Holding Endbestand nach 20 Jahren:";=F33;"EUR"`);
  lines.push(`"Privat Endbestand nach 20 Jahren:";=J33;"EUR"`);
  lines.push(`"Gesamter Vermögensvorteil Holding:";=F33-J33;"EUR"`);
  lines.push(`"Durchschnittlicher Mehrwert pro Jahr:";=(F33-J33)/20;"EUR / Jahr"`);

  return lines.join("\r\n");
}

/**
 * Helper to trigger immediate browser download of the generated CSV file
 */
export function triggerCsvDownload(filename: string, content: string): void {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
