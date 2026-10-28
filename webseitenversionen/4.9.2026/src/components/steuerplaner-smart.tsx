// Steuerplaner — Smart-Empfehlungen für Anschaffungen
import type { PlanerErgebnis } from '../lib/steuerplaner-pro';
export default function SteuerplanerSmart({ eingabe }: { eingabe: any; ergebnis: PlanerErgebnis }) {
  const empfehlungen: string[] = [];
  if (eingabe.gewinnGewerblich > 66760) {
    empfehlungen.push('Rürup-Einzahlung maximieren (besonders ab 42 % Grenzsteuersatz).');
  }
  if (eingabe.itAnschaffung && eingabe.itAnschaffung <= 800) {
    empfehlungen.push('IT-Hardware ≤ 800 € sofort als GWG absetzen – Kauf vor Jahresende.');
  }
  if (eingabe.solarAnschaffung && eingabe.solarAnschaffung <= 800) {
    empfehlungen.push('Solarstation ≤ 800 € sofort als GWG absetzbar (Homeoffice-Anteil prüfen).');
  }
  if (eingabe.gewinnGewerblich > 100000) {
    empfehlungen.push('GmbH-Struktur prüfen – ab ca. 100.000 € Gewinn oft steuerlich vorteilhaft.');
  }
  if (empfehlungen.length === 0) return null;
  return (
    <div style={{ background: 'rgba(201,168,76,0.1)', borderRadius: 12, padding: 16, border: '1px solid rgba(201,168,76,0.2)', marginBottom: 24 }}>
      <h3 style={{ marginTop: 0, color: '#c9a84c', fontSize: 14 }}>Smart-Empfehlungen</h3>
      <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: '#f0ece4', fontSize: 13 }}>
        {empfehlungen.map((e, i) => <li key={i} style={{ marginBottom: 6 }}>{e}</li>)}
      </ul>
    </div>
  );
}