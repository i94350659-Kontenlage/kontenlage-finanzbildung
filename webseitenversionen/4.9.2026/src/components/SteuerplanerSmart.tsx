// Steuerplaner — Smart-Planer Anschaffungs-Empfehlungen
import type { SteuerplanerInput } from '../lib/steuerplaner-calc';
import { planeAnschaffungen } from '../lib/steuerplaner-calc';
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');
export default function SteuerplanerSmart({ input }: { input: SteuerplanerInput }) {
  const empfehlungen = planeAnschaffungen(input);
  if (empfehlungen.length === 0) return null;
  return (
    <div style={{ background: '#0f172a', padding: 20, borderRadius: 12, border: '1px solid rgba(201,168,76,0.2)', marginBottom: 24 }}>
      <h3 style={{ marginTop: 0, color: '#c9a84c', fontSize: 14 }}>Smart-Planer: Wann lohnt sich welche Anschaffung?</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {empfehlungen.map((e, i) => (
          <li key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#f0ece4', marginBottom: 4 }}>
              <span>{e.titel}</span>
              <span>{fmt(e.ersparnis)} € Ersparnis Jahr 1</span>
            </div>
            <div style={{ fontSize: 12, color: '#a89f94' }}>{e.text}</div>
            <div style={{ fontSize: 11, color: '#c9a84c', marginTop: 4 }}>{e.betrag.toLocaleString('de-DE')} € · sofort: {e.sofort ? 'ja (GWG)' : 'nein'} · {e.jahre} Jahre</div>
          </li>
        ))}
      </ul>
    </div>
  );
}