// Steuerplaner Logik Deutschland 2026 — Teil 1: Interfaces & Hilfen
export interface SteuerplanerInput {
  familienstand: 'ledig' | 'verheiratet';
  kinder: number;
  gewinnVorSteuern: number;
  gmbhGewinnVorSteuern: number;
  gggGehalt: number;
  itAnschaffung: number;
  solarAnschaffung: number;
  bueroMoebel: number;
  sonstigeBetriebsausgaben: number;
  ruerupEinzahlung: number;
  kapitalErtraege: number;
}
export interface SteuerplanerResult {
  szenario: string;
  gesamtsteuer: number;
  nettogewinn: number;
  steuerersparnisMassnahmen: number;
  detail: string[];
}
export interface VergleichResult {
  einzelunternehmen: SteuerplanerResult;
  gmbh: SteuerplanerResult;
  differenz: number;
  empfehlung: string;
}
export function eStLedig(zve: number): number {
  if (zve <= 11604) return 0;
  if (zve <= 17005) { const y=(zve-11604)/10000; return (994.48*y+1400)*y; }
  if (zve <= 66760) { const y=(zve-17005)/10000; return (220.27*y+2397)*y+937.38; }
  if (zve <= 277825) return 0.42*zve-10672.53;
  return 0.45*zve-18706.87;
}
export function eStVerheiratet(zve: number): number { return 2*eStLedig(zve/2); }
export function soli(eSt: number): number { return eSt<=0||eSt<=17543?0:0.055*eSt; }
export function gewSt(gewinn: number, h=400): number { return Math.max(0,gewinn-24500)*0.035*(h/100); }
export function kSt(gewinn: number): number { return gewinn*0.15825; }
export function gwg(betrag: number): number { return betrag<=800?betrag:betrag/3; }
export function solar(betrag: number): number { return betrag<=800?betrag:betrag/20; }
export function abgeltung(ertrag: number): number { return Math.max(0,ertrag-1000)*0.26375; }
export function ruerupMax(fs: string): number { return fs==='verheiratet'?55132:27566; }