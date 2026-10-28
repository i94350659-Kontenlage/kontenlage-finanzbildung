// Steuerplaner — Ergebnisvergleich
import type { VergleichResult } from '../lib/steuerplaner-calc';
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');
export default function SteuerplanerErgebnis({ vergleich }: { vergleich: VergleichResult }) {
  const farbe = (d: number) => d > 0 ? '#86efac' : d < 0 ? '#fca5a5' : '#cdc6be';
  return (
    <div style={{ background: '#0f172a', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
      <h3 style={{ marginTop: 0, color: '#c9a84c', fontSize: 14 }}>Ergebnisvergleich: Einzelunternehmen vs. GmbH</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#a89f94', marginBottom: 4 }}>
        <span>Einzelunternehmen</span>
        <span>{fmt(vergleich.einzelunternehmen.gesamtsteuer)} € Gesamtsteuer</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#a89f94', marginBottom: 4 }}>
        <span>GmbH</span>
        <span>{fmt(vergleich.gmbh.gesamtsteuer)} € Gesamtsteuer</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: farbe(vergleich.differenz), marginTop: 8 }}>
        <span>Steuer-Differenz</span>
        <span>{fmt(Math.abs(vergleich.differenz))} €</span>
      </div>
      <div style={{ background: 'rgba(201,168,76,0.1)', borderRadius: 8, padding: 14, fontSize: 13, color: '#f0ece4', marginTop: 12 }}>
        {vergleich.empfehlung}
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: '#a89f94', lineHeight: 1.6 }}>
        <strong>Einzelunternehmen:</strong> {vergleich.einzelunternehmen.detail.join(' · ')}<br />
        <strong>GmbH:</strong> {vergleich.gmbh.detail.join(' · ')}
      </div>
    </div>
  );
}