import pathlib

base = pathlib.Path(r"g:\B2B steuer Business Ideee 6.8.2026\webseitenversionen\4.9.2026\src\pages")

# 1. Update Holding.tsx
holding_file = base / "Holding.tsx"
content = holding_file.read_text(encoding="utf-8")

old_disclaimer = """          <div style={{ marginTop: 48, padding: "24px", background: "rgba(6,9,18,0.6)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.8 }}>
              <strong style={{ color: "#cdc6be" }}>Haftungsausschluss:</strong> Alle Inhalte sind allgemeine steuerrechtliche Informationen ohne Anspruch auf Vollständigkeit."""

new_executive_box = """          {/* Executive & Pro Membership Feature Gate */}
          <div style={{ background: "linear-gradient(145deg, rgba(30,55,105,0.9), rgba(15,25,48,0.95))", border: "2px solid #c9a84c", borderRadius: 12, padding: "36px 32px", marginTop: 40, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#0C1825", background: "linear-gradient(135deg, #c9a84c, #e2c27d)", padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" }}>
                  👑 Executive B2B Modell
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#f0ece4", marginTop: 12, marginBottom: 8 }}>
                  Holding-Vertragswerk &amp; Vollständiges Excel-Berechnungsmodell
                </h3>
                <p style={{ fontSize: 14, color: "#a89f94", maxWidth: 640, lineHeight: 1.7 }}>
                  Schalten Sie das vollständige Modell frei: Inklusive notarieller Mustersatzung für die VV-GmbH,
                  Holding-Mustervertrag nach §8b KStG, Gewinnausschüttungs-Beschluss und dynamischer Excel-Kalkulation
                  für Steuerberater und Holding-Gründer.
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 13, color: "#cdc6be" }}>
                  <span>✓ Sofortiger Excel-Download</span>
                  <span>·</span>
                  <span>✓ Satzung &amp; Notar-Muster</span>
                  <span>·</span>
                  <span>✓ Monatlich kündbar</span>
                </div>
              </div>
              <div style={{ textAlign: "center", minWidth: 200 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "#c9a84c" }}>29 €</div>
                <div style={{ fontSize: 12, color: "#a89f94", marginBottom: 14 }}>/ Monat (ohne Bindung)</div>
                <Link to="/abo" style={{ display: "inline-block", width: "100%", padding: "12px 24px", borderRadius: 6, background: "linear-gradient(135deg, #c9a84c, #e2c27d)", color: "#0C1825", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 15px rgba(201,168,76,0.3)" }}>
                  Executive freischalten →
                </Link>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, padding: "24px", background: "rgba(6,9,18,0.6)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.8 }}>
              <strong style={{ color: "#cdc6be" }}>Haftungsausschluss:</strong> Alle Inhalte sind allgemeine steuerrechtliche Informationen ohne Anspruch auf Vollständigkeit."""

if old_disclaimer in content:
    content = content.replace(old_disclaimer, new_executive_box)
    holding_file.write_text(content, encoding="utf-8")
    print("Holding.tsx updated with Executive B2B paywall box!")

# 2. Update Rechner.tsx to include Lead Magnet & Pro PDF Export
rechner_file = base / "Rechner.tsx"
r_content = rechner_file.read_text(encoding="utf-8")

old_bottom = """      <style>{`@media(max-width:700px){.calc-inner-grid{grid-template-columns:1fr !important;gap:24px !important;}}`}</style>
    </div>
  );
}

export default function Rechner() {"""

new_bottom = """      {/* Lead Magnet & Pro Dossier Box */}
      <div style={{ marginTop: 32, padding: "24px", background: "linear-gradient(145deg, rgba(20,32,58,0.9), rgba(12,20,38,0.95))", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>📄</span>
            <strong style={{ fontFamily: "var(--font-display)", color: "#f0ece4", fontSize: 16 }}>
              Druckfertiges Steuer-Dossier &amp; Checkliste 2026 (PDF)
            </strong>
          </div>
          <p style={{ fontSize: 13, color: "#a89f94", margin: 0, lineHeight: 1.6 }}>
            Enthält alle Berechnungsparameter, Rechtsgrundlagen (§10, §20 EStG) und Schritt-für-Schritt-Anleitungen für Ihre Steuererklärung.
          </p>
        </div>
        <Link to="/abo" style={{ padding: "10px 20px", borderRadius: 6, background: "linear-gradient(135deg, #c9a84c, #e2c27d)", color: "#0C1825", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
          In Pro Digital enthalten (9 €/Mo) →
        </Link>
      </div>

      <style>{`@media(max-width:700px){.calc-inner-grid{grid-template-columns:1fr !important;gap:24px !important;}}`}</style>
    </div>
  );
}

export default function Rechner() {"""

if old_bottom in r_content:
    r_content = r_content.replace(old_bottom, new_bottom)
    rechner_file.write_text(r_content, encoding="utf-8")
    print("Rechner.tsx updated with Pro PDF Dossier lead box!")
