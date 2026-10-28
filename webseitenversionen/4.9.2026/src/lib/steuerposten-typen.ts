// Steuerposten — Typen & Grundstruktur (Teil 1)
export type Geschäftstyp = 
  | 'einzelunternehmen'
  | 'freiberufler'
  | 'gmbh'
  | 'ug'
  | 'personengesellschaft'
  | 'arbeitnehmer'
  | 'rentner'
  | 'student';

export type SteuerPosten = {
  id: string;
  kategorie: string;
  titel: string;
  beschreibung: string;
  rechtsgrundlage: string;
  zielgruppe: Geschäftstyp[];
  betragsTyp: 'fest' | 'prozent' | 'pauschale_pro_tag' | 'pro_km' | 'pro_qm' | 'nach_nutzungsdauer';
  wert?: number;
  prozent?: number;
  pauschale?: number;
  proKm?: number;
  proQm?: number;
  nutzungsdauerJahre?: number;
  gwgGrenze?: number;
  maxProJahr?: number;
  nurBetrieblicheNutzung?: boolean;
  anteilsschätzungErlaubt: boolean;
  smartTipp: string;
  besteAnschaffungszeit: string;
  beispielBetrag: number;
  beispielErsparnis: number;
};