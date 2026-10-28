import { STEUERPOSTEN_TEIL1 } from './steuerposten-teil1';
import { STEUERPOSTEN_TEIL2 } from './steuerposten-teil2';
import { STEUERPOSTEN_TEIL3 } from './steuerposten-teil3';

export { STEUERPOSTEN_TEIL1, STEUERPOSTEN_TEIL2, STEUERPOSTEN_TEIL3 };
export type { Geschäftstyp, SteuerPosten } from './steuerposten-typen';

export const ALLE_STEUERPOSTEN = [
  ...STEUERPOSTEN_TEIL1,
  ...STEUERPOSTEN_TEIL2,
  ...STEUERPOSTEN_TEIL3,
];

export function suchePosten(query: string, zielgruppe?: string) {
  const q = query.toLowerCase();
  return ALLE_STEUERPOSTEN.filter(p => {
    const match = p.titel.toLowerCase().includes(q) ||
      p.kategorie.toLowerCase().includes(q) ||
      p.beschreibung.toLowerCase().includes(q);
    return match && (!zielgruppe || p.zielgruppe.includes(zielgruppe as any));
  });
}

export function postenNachKategorie(kategorie: string) {
  return ALLE_STEUERPOSTEN.filter(p => p.kategorie === kategorie);
}

export const KATEGORIEN_LISTE = [
  ...new Set(ALLE_STEUERPOSTEN.map(p => p.kategorie)),
];