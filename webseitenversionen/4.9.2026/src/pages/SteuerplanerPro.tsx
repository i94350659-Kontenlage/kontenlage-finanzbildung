// Steuerplaner Pro — Hauptseite (Shell)
import { useState } from 'react';
import { ALLE_STEUERPOSTEN, KATEGORIEN_LISTE } from '../lib/steuerposten-index';
import { berechnePlaner, type PlanerEingabe } from '../lib/steuerplaner-pro';
import SteuerplanerPostenEingabe from '../components/steuerplaner-posten-eingabe';
import SteuerplanerErgebnis from '../components/steuerplaner-ergebnis';
import SteuerplanerSmart from '../components/steuerplaner-smart';
import SteuerplanerLead from '../components/steuerplaner-lead';
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');

const INITIAL: PlanerEingabe = {
  geschäftstyp: 'einzelunternehmen',
  familienstand: 'ledig',
  gewinnGewerblich: 60000,
  gmbhGewinn: 60000,
  gggGehalt: 45000,
  privatEinkommen: 0,
  ausgaben: [],
  ruerup: 0,
  kvBeiträge: 0,
  kapitalerträge: 0,
};

export default function SteuerplanerPro() {
  const [eingabe, setEingabe] = useState<PlanerEingabe>(INITIAL);
  const [activeTab, setActiveTab] = useState<string>('immobilien');
  const ergebnis = berechnePlaner(eingabe);

  return (
    <section style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: '#f0ece4' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#c9a84c', margin: 0, fontSize: 24 }}>Steuerplaner Pro — Umfassendes Was-wäre-wenn</h1>
        <p style={{ color: '#a89f94', fontSize: 13, margin: '4px 0 0' }}>
          Alle absetzbaren Posten · Privat + Gewerblich · Deutschland 2026 · § 2 Abs. 8 Nr. 10 WpHG
        </p>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto' }}>
        {KATEGORIEN_LISTE.map(k => (
          <button
            key={k}
            onClick={() => setActiveTab(k)}
            style={{
              padding: '8px 14px', borderRadius: 6, border: '1px solid',
              borderColor: activeTab === k ? '#c9a84c' : 'rgba(255,255,255,0.1)',
              background: activeTab === k ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: activeTab === k ? '#e2c27d' : '#a89f94',
              fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {k}
          </button>
        ))}
      </div>

      <SteuerplanerPostenEingabe eingabe={eingabe} setEingabe={setEingabe} activeTab={activeTab} />
      <SteuerplanerErgebnis ergebnis={ergebnis} eingabe={eingabe} />
      <SteuerplanerSmart eingabe={eingabe} ergebnis={ergebnis} />
      <SteuerplanerLead />

      <p style={{ fontSize: 11, color: '#64748B', marginTop: 24, lineHeight: 1.5 }}>
        Hinweis: Reine Finanzbildung gemäß § 2 Abs. 8 Nr. 10 WpHG. Keine Steuerberatung i.S.d. StBerG. Werte sind Näherungswerte.
      </p>
    </section>
  );
}