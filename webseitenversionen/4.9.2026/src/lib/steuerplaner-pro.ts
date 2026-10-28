// Steuerplaner Pro — Berechnungs-Engine für umfassendes Was-wäre-wenn
import { ALLE_STEUERPOSTEN, SteuerPosten, Geschäftstyp } from './steuerposten-index';

export interface PlanerEingabe {
  geschäftstyp: Geschäftstyp;
  familienstand: 'ledig' | 'verheiratet';
  gewinnGewerblich: number;
  gmbhGewinn: number;
  gggGehalt: number;
  privatEinkommen: number;
  // Ausgaben (nutzerdefiniert)
  ausgaben: { postenId: string; betrag: number; anteilProzent?: number }[];
  itAnschaffung?: number;
  solarAnschaffung?: number;
  // Vorsorge
  ruerup: number;
  kvBeiträge: number;
  // Kapital
  kapitalerträge: number;
}

export interface PostenErgebnis {
  id: string;
  titel: string;
  betrag: number;
  absetzbarerBetrag: number;
  steuerersparnis: number;
  smartTipp: string;
}

export interface PlanerErgebnis {
  gesamtsteuerOhneMassnahmen: number;
  gesamtsteuerMitMassnahmen: number;
  steuerersparnis: number;
  nettoGewinn: number;
  postenErgebnisse: PostenErgebnis[];
  vergleich: {
    einzelunternehmen: number;
    gmbh: number;
    differenz: number;
  };
  smartEmpfehlungen: string[];
}

// ─── Einkommensteuer 2026 (vereinfacht) ────────────────────────────────────
function eStLedig(zve: number): number {
  if (zve <= 11604) return 0;
  if (zve <= 17005) { const y = (zve - 11604) / 10000; return (994.48 * y + 1400) * y; }
  if (zve <= 66760) { const y = (zve - 17005) / 10000; return (220.27 * y + 2397) * y + 937.38; }
  if (zve <= 277825) return 0.42 * zve - 10672.53;
  return 0.45 * zve - 18706.87;
}
function eStVerheiratet(zve: number): number { return 2 * eStLedig(zve / 2); }
function soli(eSt: number): number { return eSt > 17543 ? 0.055 * eSt : 0; }

// ─── Kernberechnung ────────────────────────────────────────────────────────
export function berechnePlaner(eingabe: PlanerEingabe): PlanerErgebnis {
  const postenMap = new Map(ALLE_STEUERPOSTEN.map(p => [p.id, p]));
  const grenzsteuersatz = eingabe.gewinnGewerblich > 66760 ? 0.42 : eingabe.gewinnGewerblich > 17005 ? 0.30 : 0.14;

  const postenErgebnisse: PostenErgebnis[] = [];
  let gesamtAbsetzbar = 0;

  for (const a of eingabe.ausgaben) {
    const p = postenMap.get(a.postenId);
    if (!p) continue;

    let absetzbar = a.betrag;
    if (a.anteilProzent !== undefined) {
      absetzbar = a.betrag * (a.anteilProzent / 100);
    }

    // GWG-Prüfung: ≤ 800 € sofort, sonst über Nutzungsdauer
    let sofortAbsetzbar = absetzbar;
    if (p.gwgGrenze && absetzbar > p.gwgGrenze && p.nutzungsdauerJahre) {
      sofortAbsetzbar = absetzbar / p.nutzungsdauerJahre;
    }

    // Max pro Jahr prüfen
    if (p.maxProJahr) {
      sofortAbsetzbar = Math.min(sofortAbsetzbar, p.maxProJahr);
    }

    // Steuerersparnis = absetzbarer Betrag × Grenzsteuersatz (vereinfacht)
    const ersparnis = sofortAbsetzbar * grenzsteuersatz;
    gesamtAbsetzbar += sofortAbsetzbar;

    postenErgebnisse.push({
      id: p.id,
      titel: p.titel,
      betrag: a.betrag,
      absetzbarerBetrag: sofortAbsetzbar,
      steuerersparnis: ersparnis,
      smartTipp: p.smartTipp,
    });
  }

  // Rürup
  const ruerupMax = eingabe.familienstand === 'verheiratet' ? 55132 : 27566;
  const ruerupWirksam = Math.min(eingabe.ruerup, ruerupMax);
  const ruerupErsparnis = ruerupWirksam * grenzsteuersatz;

  // KV-Beiträge (vereinfacht)
  const kvErsparnis = eingabe.kvBeiträge * grenzsteuersatz;

  // ─── Szenario-Berechnung ───────────────────────────────────────────────
  // Ohne Maßnahmen
  const steuerOhne = eingabe.familienstand === 'verheiratet'
    ? eStVerheiratet(eingabe.gewinnGewerblich + eingabe.privatEinkommen)
    : eStLedig(eingabe.gewinnGewerblich + eingabe.privatEinkommen);
  const steuerOhneMitSoli = steuerOhne + soli(steuerOhne);

  // Mit Maßnahmen
  const zuVersteuerndMit = Math.max(0, eingabe.gewinnGewerblich - gesamtAbsetzbar - ruerupWirksam - eingabe.kvBeiträge + eingabe.privatEinkommen);
  const steuerMit = eingabe.familienstand === 'verheiratet'
    ? eStVerheiratet(zuVersteuerndMit)
    : eStLedig(zuVersteuerndMit);
  const steuerMitSoli = steuerMit + soli(steuerMit);

  const gesamtErsparnis = steuerOhneMitSoli - steuerMitSoli + ruerupErsparnis + kvErsparnis;

  // GmbH-Vergleich (vereinfacht)
  const gmbhSteuer = eingabe.gmbhGewinn * 0.15825; // KSt + Soli
  const gggPrivat = eingabe.gggGehalt > 0
    ? (eingabe.familienstand === 'verheiratet' ? eStVerheiratet(eingabe.gggGehalt) : eStLedig(eingabe.gggGehalt))
    : 0;
  const gmbhGesamt = gmbhSteuer + soli(gmbhSteuer) + gggPrivat + soli(gggPrivat);
  const euGesamt = steuerMitSoli;

  const smartEmpfehlungen: string[] = [];
  if (eingabe.gewinnGewerblich > 66760) {
    smartEmpfehlungen.push('Rürup-Einzahlung maximieren (besonders ab 42 % Grenzsteuersatz).');
  }
  if (eingabe.itAnschaffung && eingabe.itAnschaffung <= 800) {
    smartEmpfehlungen.push('IT-Hardware ≤ 800 € sofort als GWG absetzen – Kauf vor Jahresende.');
  }
  if (eingabe.solarAnschaffung && eingabe.solarAnschaffung <= 800) {
    smartEmpfehlungen.push('Solarstation ≤ 800 € sofort als GWG absetzbar (Homeoffice-Anteil prüfen).');
  }
  if (eingabe.gewinnGewerblich > 100000) {
    smartEmpfehlungen.push('GmbH-Struktur prüfen – ab ca. 100.000 € Gewinn oft steuerlich vorteilhaft.');
  }

  return {
    gesamtsteuerOhneMassnahmen: Math.round(steuerOhneMitSoli),
    gesamtsteuerMitMassnahmen: Math.round(steuerMitSoli),
    steuerersparnis: Math.round(gesamtErsparnis),
    nettoGewinn: Math.round(eingabe.gewinnGewerblich - gesamtAbsetzbar - steuerMitSoli),
    postenErgebnisse,
    vergleich: {
      einzelunternehmen: Math.round(euGesamt),
      gmbh: Math.round(gmbhGesamt),
      differenz: Math.round(euGesamt - gmbhGesamt),
    },
    smartEmpfehlungen,
  };
}