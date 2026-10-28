// Steuerplaner — Lead-Magnet für Pro/Executive
export default function SteuerplanerLead() {
  return (
    <div style={{ background: 'rgba(201,168,76,0.08)', borderRadius: 12, padding: 20, border: '1px solid rgba(201,168,76,0.2)', marginBottom: 24 }}>
      <h3 style={{ marginTop: 0, color: '#c9a84c', fontSize: 14 }}>Pro &amp; Executive — Vollzugriff</h3>
      <p style={{ fontSize: 13, color: '#a89f94', marginBottom: 10 }}>
        Diese Vorschau ist kostenlos. Als <strong>Pro (10,71 €/Monat)</strong> oder <strong>Executive (34,51 €/Monat)</strong> Mitglied schalten Sie frei:
      </p>
      <ul style={{ fontSize: 13, color: '#f0ece4', margin: 0, paddingLeft: 18 }}>
        <li>PDF-Export der individuellen Steuerplanung</li>
        <li>Mehrere Szenarien speichern &amp; vergleichen</li>
        <li>Excel-Export für den Steuerberater</li>
        <li>ELSTER- &amp; EÜR-Vorlagen</li>
        <li>Persönliche Steuer-Szenarien mit Fristen-Erinnerung</li>
      </ul>
      <button style={{ marginTop: 10, padding: '10px 20px', background: 'linear-gradient(135deg, #c9a84c, #e2c27d)', border: 'none', borderRadius: 6, color: '#0c1825', fontWeight: 700, cursor: 'pointer' }}>
        Jetzt auf Pro/Executive upgraden → /abo
      </button>
    </div>
  );
}