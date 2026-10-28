// ============================================================================
// KONTOLAGE — STEUERABSETZUNGEN: HAUPT-EXPORT
// Alle Steuerabsetzungen für Selbständige & Arbeitnehmer
// ============================================================================

export { SELBSTSTAENDIG } from './steuerabsetzungen-selbststaendig.js';
export { ARBEITNEHMER } from './steuerabsetzungen-arbeitnehmer.js';
export { FAQ, STRATEGIE_TIPPS, KATEGORIEN } from './steuerabsetzungen-faq.js';

export const ALLE_ABSETZUNGEN = [
  ...SELBSTSTAENDIG.map(i => ({ ...i, zielgruppe: 'selbststaendig' })),
  ...ARBEITNEHMER.map(i => ({ ...i, zielgruppe: 'arbeitnehmer' })),
];

export function sucheAbsetzungen(query, zielgruppe = null) {
  const q = query.toLowerCase();
  return ALLE_ABSETZUNGEN.filter(item => {
    const match = item.titel.toLowerCase().includes(q) ||
      item.beschreibung?.toLowerCase().includes(q) ||
      item.kategorie.toLowerCase().includes(q);
    return match && (zielgruppe === null || item.zielgruppe === zielgruppe);
  });
}

export function getNachKategorie(kategorie) {
  return ALLE_ABSETZUNGEN.filter(item => item.kategorie === kategorie);
}

export const KATEGORIEN_LISTE = [
  'IT & Hardware',
  'Büro & Einrichtung',
  'Homeoffice',
  'Software & Abos',
  'Weiterbildung',
  'Kommunikation',
  'Versicherungen',
  'Reisen',
  'Bürobedarf',
  'Beratung',
  'Bank',
  'Marketing',
  'Vorsorge',
  'Pauschale',
  'Arbeitsmittel',
  'Mobilität',
  'Dienstreise',
  'Umzug',
  'Doppelhaushalt',
  'Kleidung',
  'Bewerbung',
  'Strategie',
];