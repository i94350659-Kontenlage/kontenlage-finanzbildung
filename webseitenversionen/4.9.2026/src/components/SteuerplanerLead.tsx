// Steuerplaner — Lead-Magnet Box für Pro/Executive
export default function SteuerplanerLead() {
  return (
    <div style={{ background: 'rgba(201,168,76,0.08)', borderRadius: 12, padding: 20, border: '1px solid rgba(201,168,76,0.2)', marginBottom: 24 }}>
      <h3 style={{ marginTop: 0, color: '#c9a84c', fontSize: 14 }}>Lead-Magnet: Pro &amp; Executive</h3>
      <p style={{ fontSize: 13, color: '#a89f94', marginBottom: 12 }}>
        Diese Vorschau ist kostenlos. Als <strong>Pro (9 €/Monat)</strong> oder <strong>Executive (29 €/Monat)</strong> Mitglied schaltest du frei:
      </p>
      <ul style={{ fontSize: 13, color: '#f0ece4', margin: 0, paddingLeft: 20 }}>
        <li>PDF-Export deiner individuellen Steuerplanung</li>
        <li>Mehrere Szenarien speichern und vergleichen</li>
        <li>Excel-Export für deinen Steuerberater</li>
        <li>ELSTER-Vorlagen &amp; EÜR-Vorlage</li>
        <li>Persönliche Steuer-Szenarien mit Fristen-Erinnerung</li>
      </ul>
      <button style={{ marginTop: 12, padding: '10px 20px', background: 'linear-gradient(135deg, #c9a84c, #e2c27d)', border: 'none', borderRadius: 6, color: '#0c1825', fontWeight: 700, cursor: 'pointer' }}>
        Jetzt auf Pro/Executive upgraden → /abo
      </button>
    </div>
  );
}