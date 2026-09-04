import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";

const links = [
  { to: "/rechner", label: "Rechner" },
  { to: "/holding", label: "Holding & Steuern" },
  { to: "/anlageformen", label: "Anlageformen" },
  { to: "/artikel", label: "Artikel" },
  { to: "/transparenz", label: "Transparenz" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navBg =
    scrolled ? "rgba(10,15,30,0.97)"
    : menuOpen ? "rgba(10,15,30,0.99)"
    : "transparent";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "background 0.3s",
      backgroundColor: navBg,
      borderBottom: scrolled || menuOpen ? "1px solid rgba(201,168,76,0.15)" : "none",
      backdropFilter: scrolled ? "blur(14px)" : "none",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          {/* Logo */}
          <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6,
              background: "linear-gradient(135deg, #c9a84c, #e2c27d)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 12L6 6L10 9L14 3" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "#f0ece4", letterSpacing: "-0.02em" }}>
              Konto<span style={{ color: "#c9a84c" }}>lage</span>
            </span>
          </NavLink>

          {/* Desktop */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: 26 }}>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} style={({ isActive }) => ({
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                letterSpacing: "0.04em", textTransform: "uppercase",
                color: isActive ? "#c9a84c" : "#cdc6be", textDecoration: "none",
                transition: "color 0.2s",
                borderBottom: isActive ? "1px solid rgba(201,168,76,0.5)" : "1px solid transparent",
                paddingBottom: 2,
              })}>{l.label}</NavLink>
            ))}
            <NavLink to="/abo" style={{ padding: "8px 18px", borderRadius: 4, background: "linear-gradient(135deg, #c9a84c, #a8873a)", color: "#111827", fontWeight: 700, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >Abo</NavLink>
          </div>

          {/* Burger */}
          <button className="nav-burger" onClick={() => setMenuOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#c9a84c", padding: 6, alignItems: "center", justifyContent: "center" }}
            aria-label="Menü öffnen"
          >
            {menuOpen
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            }
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{ paddingBottom: 20 }}>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} style={({ isActive }) => ({
                display: "block", padding: "15px 0",
                fontSize: 16, fontWeight: 500,
                color: isActive ? "#c9a84c" : "#e8e2da",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              })}>{l.label}</NavLink>
            ))}
            <NavLink to="/abo" style={{
              display: "block", marginTop: 20, padding: "14px 20px",
              borderRadius: 6, textAlign: "center",
              background: "linear-gradient(135deg, #c9a84c, #a8873a)",
              color: "#111827", fontWeight: 700, fontSize: 15, textDecoration: "none",
            }}>Abo wählen</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
