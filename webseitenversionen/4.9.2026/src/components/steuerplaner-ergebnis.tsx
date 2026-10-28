// Steuerplaner — Ergebnisanzeige
import type { PlanerErgebnis, PlanerEingabe } from '../lib/steuerplaner-pro';

const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');

export default function SteuerplanerErgebnis({ ergebnis }: { ergebnis: PlanerErgebnis; eingabe: PlanerEingabe }) {
  const diff = ergebnis.vergleich.differenz;
  const isGmbhBetter = diff > 0;

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(20,30,50,0.7), rgba(15,22,38,0.85))',
      borderRadius: 14,
      border: '1px solid rgba(201,168,76,0.2)',
      padding: 24,
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#f0ece4', margin: 0 }}>
          Berechnete Steuerbilanz &amp; Liquiditätseffekt
        </h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '3px 10px', borderRadius: 12 }}>
          EStG 2026 + GewStG + KStG
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Vorher */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Steuerlast ohne Maßnahmen
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: '#a89f94' }}>
            {fmt(ergebnis.gesamtsteuerOhneMassnahmen)} €
          </div>
          <div style={{ fontSize: 11, color: '#7d766d', marginTop: 4 }}>Standardbesteuerung</div>
        </div>

        {/* Nachher */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Steuerlast mit Maßnahmen
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: '#86efac' }}>
            {fmt(ergebnis.gesamtsteuerMitMassnahmen)} €
          </div>
          <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>Inkl. abgesetzter Posten</div>
        </div>

        {/* Effektive Ersparnis */}
        <div style={{ background: 'rgba(201,168,76,0.08)', borderRadius: 10, padding: 18, border: '1px solid rgba(201,168,76,0.25)' }}>
          <div style={{ fontSize: 11, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 600 }}>
            Ihre Netto-Steuerersparnis
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 800, color: '#e2c27d' }}>
            +{fmt(ergebnis.steuerersparnis)} €
          </div>
          <div style={{ fontSize: 11, color: '#e2c27d', marginTop: 4 }}>Reines Mehrkapital im Jahr</div>
        </div>

        {/* Netto-Liquidität */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Verbleibende Netto-Liquidität
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: '#f0ece4' }}>
            {fmt(ergebnis.nettoGewinn)} €
          </div>
          <div style={{ fontSize: 11, color: '#a89f94', marginTop: 4 }}>Nach allen Steuern &amp; Posten</div>
        </div>
      </div>

      {/* Rechtsform-Vergleich Box */}
      <div style={{
        background: 'rgba(10,15,30,0.6)',
        borderRadius: 10,
        padding: '16px 20px',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
      }}>
        <div style={{ fontSize: 13, color: '#cdc6be', lineHeight: 1.6 }}>
          <strong style={{ color: '#e2c27d' }}>Rechtsform-Vergleich bei diesem Gewinn:</strong> Einzelunternehmen ({fmt(ergebnis.vergleich.einzelunternehmen)} € Steuer) vs. GmbH-Struktur ({fmt(ergebnis.vergleich.gmbh)} € Steuer).
        </div>
        <div style={{
          padding: '6px 14px',
          borderRadius: 6,
          background: isGmbhBetter ? 'rgba(74,222,128,0.12)' : 'rgba(201,168,76,0.12)',
          border: `1px solid ${isGmbhBetter ? 'rgba(74,222,128,0.3)' : 'rgba(201,168,76,0.3)'}`,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 700,
          color: isGmbhBetter ? '#86efac' : '#e2c27d',
        }}>
          {isGmbhBetter
            ? `GmbH spart ca. ${fmt(diff)} € Steuer p.a.`
            : `Einzelunternehmen zzt. ca. ${fmt(Math.abs(diff))} € günstiger`}
        </div>
      </div>
    </div>
  );
}