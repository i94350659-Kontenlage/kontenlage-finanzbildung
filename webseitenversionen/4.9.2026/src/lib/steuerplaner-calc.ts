// Steuerplaner Logik — Teil 2: Berechnungen
import { eStLedig, eStVerheiratet, soli, gewSt, kSt, gwg, solar, abgeltung, ruerupMax, SteuerplanerInput, SteuerplanerResult, VergleichResult } from './steuerplaner-logic';
export function berechneSzenario(input: SteuerplanerInput, szenario: 'einzelunternehmen' | 'gmbh'): SteuerplanerResult {
  const detail: string[] = [];
  let betrieblicheAusgaben = input.sonstigeBetriebsausgaben;
  betrieblicheAusgaben += gwg(input.itAnschaffung);
  betrieblicheAusgaben += gwg(input.bueroMoebel);
  betrieblicheAusgaben += solar(input.solarAnschaffung);
  const ruerupWirksam = Math.min(input.ruerupEinzahlung, ruerupMax(input.familienstand));
  let gesamtsteuer = 0;
  let steuerlicheMinderung = ruerupWirksam * 0.42;
  if (szenario === 'einzelunternehmen') {
    const gewinnNachAusgaben = Math.max(0, input.gewinnVorSteuern - betrieblicheAusgaben);
    const zuVersteuernd = Math.max(0, gewinnNachAusgaben - ruerupWirksam);
    const est = input.familienstand === 'verheiratet' ? eStVerheiratet(zuVersteuernd) : eStLedig(zuVersteuernd);
    const gwStBetrag = gewSt(gewinnNachAusgaben);
    const estSoli = soli(est);
    gesamtsteuer = est + gwStBetrag + estSoli;
    detail.push(`Gewinn nach Betriebsausgaben: ${Math.round(gewinnNachAusgaben).toLocaleString('de-DE')} €`);
    detail.push(`Rürup wirksam: ${Math.round(ruerupWirksam).toLocaleString('de-DE')} €`);
    detail.push(`Einkommensteuer: ${Math.round(est).toLocaleString('de-DE')} €`);
    detail.push(`Gewerbesteuer: ${Math.round(gwStBetrag).toLocaleString('de-DE')} €`);
    detail.push(`Soli: ${Math.round(estSoli).toLocaleString('de-DE')} €`);
  } else {
    const gmbhSteuer = kSt(input.gmbhGewinnVorSteuern);
    const personenEinkommen = Math.max(0, input.gggGehalt - ruerupWirksam);
    const est = input.familienstand === 'verheiratet' ? eStVerheiratet(personenEinkommen) : eStLedig(personenEinkommen);
    const estSoli = soli(est);
    gesamtsteuer = gmbhSteuer + est + estSoli;
    detail.push(`GmbH-Gewinn: ${input.gmbhGewinnVorSteuern.toLocaleString('de-DE')} €`);
    detail.push(`KSt + Soli: ${Math.round(gmbhSteuer).toLocaleString('de-DE')} €`);
    detail.push(`GGG-Gehalt: ${Math.round(personenEinkommen).toLocaleString('de-DE')} €`);
    detail.push(`Persönliche ESt: ${Math.round(est).toLocaleString('de-DE')} €`);
    detail.push(`Soli: ${Math.round(estSoli).toLocaleString('de-DE')} €`);
  }
  const kapSt = abgeltung(input.kapitalErtraege);
  gesamtsteuer += kapSt;
  detail.push(`Abgeltungsteuer: ${Math.round(kapSt).toLocaleString('de-DE')} €`);
  const basisGewinn = szenario === 'einzelunternehmen' ? input.gewinnVorSteuern : input.gmbhGewinnVorSteuern;
  const nettoGewinn = Math.max(0, basisGewinn - betrieblicheAusgaben - gesamtsteuer + kapSt);
  return { szenario, gesamtsteuer: Math.round(gesamtsteuer), nettogewinn: Math.round(nettoGewinn), steuerersparnisMassnahmen: Math.round(steuerlicheMinderung), detail };
}
export function vergleicheSzenarien(input: SteuerplanerInput): VergleichResult {
  const eu = berechneSzenario(input, 'einzelunternehmen');
  const gmbh = berechneSzenario(input, 'gmbh');
  const diff = eu.gesamtsteuer - gmbh.gesamtsteuer;
  let empfehlung = diff > 5000 ? 'GmbH scheint steuerlich vorteilhaft (prüfe Gründungskosten).' : diff < -5000 ? 'Einzelunternehmen ist vermutlich günstiger.' : 'Beide Modelle liegen nah beieinander.';
  return { einzelunternehmen: eu, gmbh, differenz: Math.round(diff), empfehlung };
}
export function planeAnschaffungen(input: SteuerplanerInput) {
  const grenz = input.gewinnVorSteuern > 66760 ? 0.42 : input.gewinnVorSteuern > 17005 ? 0.30 : 0.14;
  const r = Math.min(input.ruerupEinzahlung, ruerupMax(input.familienstand));
  const aus: { titel: string; betrag: number; sofort: boolean; jahre: number; ersparnis: number; text: string }[] = [];
  if (input.itAnschaffung > 0) {
    const so = input.itAnschaffung <= 800;
    aus.push({ titel: 'IT-Hardware', betrag: input.itAnschaffung, sofort: so, jahre: so ? 1 : 3, ersparnis: Math.round((so ? input.itAnschaffung : input.itAnschaffung / 3) * grenz), text: so ? 'Kauf vor Jahresende: GWG ≤ 800 € sofort absetzbar.' : 'Über 3 Jahre abschreiben. Dezember-Kauf maximiert erstes Jahr.' });
  }
  if (input.solarAnschaffung > 0) {
    const so = input.solarAnschaffung <= 800;
    aus.push({ titel: 'Solarstation Homeoffice', betrag: input.solarAnschaffung, sofort: so, jahre: so ? 1 : 20, ersparnis: Math.round(solar(input.solarAnschaffung) * grenz), text: 'Nur betriebliche Nutzungsanteile. ≤ 800 € sofort absetzbar (GWG).' });
  }
  if (input.ruerupEinzahlung > 0) {
    aus.push({ titel: 'Rürup-Einzahlung', betrag: input.ruerupEinzahlung, sofort: true, jahre: 1, ersparnis: Math.round(r * grenz), text: `Besonders smart ab 42 % Grenzsteuersatz. Maximal wirksam: ${ruerupMax(input.familienstand).toLocaleString('de-DE')} €/Jahr.` });
  }
  return aus;
}