// Steuerplaner — Ergebnisanzeige
import type { PlanerErgebnis, PlanerEingabe } from '../lib/steuerplaner-pro';
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');
export default function SteuerplanerErgebnis({ ergebnis, eingabe }: { ergebnis: PlanerErgebnis; eingabe: PlanerEingabe }) {
  const farbe = (d: number) => d > 0 ? '#86efac' : d < 0 ? '#fca5a5' : '#cdc6be';
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 20, marginBottom: 24 }}>
      <h2 style={{ marginTop: 0, color: '#c9a84c', fontSize: 16 }}>Ergebnis Ihrer Steuerplanung</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Gesamtsteuer ohne Maßnahmen</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#a89f94' }}>{fmt(ergebnis.gesamtsteuerOhneMassnahmen)} €</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Gesamtsteuer mit Maßnahmen</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#86efac' }}>{fmt(ergebnis.gesamtsteuerMitMassnahmen)} €</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Steuerersparnis</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#4ade80' }}>{fmt(ergebnis.steuerersparnis)} €</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Netto nach Steuern</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#e2c27d' }}>{fmt(ergebnis.nettoGewinn)} €</div>
        </div>
      </div>
      <div style={{ background: 'rgba(201,168,76,0.1)', borderRadius: 8, padding: 14, marginTop: 12 }}>
        <strong style={{ color: '#c9a84c' }}>Einzelunternehmen:</strong> {fmt(ergebnis.vergleich.einzelunternehmen)} € &nbsp;|&nbsp;
        <strong style={{ color: '#c9a84c' }}>GmbH:</strong> {fmt(ergebnis.vergleich.gmbh)} € &nbsp;|&nbsp;
        <strong>Differenz:</strong> <span style={{ color: farbe(ergebnis.vergleich.differenz) }}>{fmt(Math.abs(ergebnis.vergleich.differenz))} €</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: '#a89f94', lineHeight: 1.6 }}>
        <strong>Einzelunternehmen:</strong> {ergebnis.vergleich.einzelunternehmen > 0 ? 'gerechnet' : '—'}<br />
        <strong>GmbH:</strong> {ergebnis.vergleich.gmbh > 0 ? 'gerechnet' : '—'}
      </div>
    </div>
  );
}