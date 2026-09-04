import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="footer-pad" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "56px 20px 36px", background: "#111827" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <NavLink to="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 18 }}>
              <div style={{ width: 26, height: 26, borderRadius: 5, background: "linear-gradient(135deg, #c9a84c, #e2c27d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 12L6 6L10 9L14 3" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "#f0ece4" }}>Konto<span style={{ color: "#c9a84c" }}>lage</span></span>
            </NavLink>
            <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.85, maxWidth: 260, marginBottom: 16 }}>
              Keine Provision. Keine Anlageberatung. Nur Mathematik und Paragraphen — damit Sie selbst entscheiden können.
            </p>
            <div style={{ fontSize: 11, color: "#a89f94", lineHeight: 1.9 }}>
              BaFin-konform · WpHG §2 Abs. 8 Nr. 10<br/>
              MAR Art. 20 · 100 % ohne Tracking-Cookies
            </div>
          </div>

          {/* Links */}
          {[
            { label: "Themen", items: [
              { to: "/rechner", label: "Rechner" },
              { to: "/holding", label: "Holding & Steuern" },
              { to: "/anlageformen", label: "Anlageformen" },
              { to: "/artikel", label: "Artikel" },
            ]},
            { label: "Mitgliedschaft", items: [
              { to: "/abo", label: "Basis (kostenlos)" },
              { to: "/abo", label: "Pro Digital" },
              { to: "/abo", label: "Executive" },
              { to: "/kabinett", label: "Kabinett Login" },
            ]},
            { label: "Rechtliches", items: [
              { to: "/impressum", label: "Impressum" },
              { to: "/datenschutz", label: "Datenschutz" },
              { to: "/transparenz", label: "Transparenz" },
              { to: "/impressum", label: "Disclaimer" },
            ]},
          ].map(col => (
            <div key={col.label}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#a89f94", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>{col.label}</div>
              {col.items.map(item => (
                <NavLink key={item.label} to={item.to} style={{ display: "block", fontSize: 13, color: "#a89f94", textDecoration: "none", marginBottom: 11, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
                onMouseLeave={e => (e.currentTarget.style.color = "#a89f94")}
                >{item.label}</NavLink>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom" style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#a89f94" }}>© 2026 Kontolage · Alle Rechte vorbehalten</div>
          <div style={{ fontSize: 11, color: "#a89f94" }}>Kein Angebot einer Anlageberatung i.S.d. WpHG</div>
        </div>
      </div>
    </footer>
  );
}
