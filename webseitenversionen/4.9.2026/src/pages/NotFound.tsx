import { Link } from "react-router";

export default function NotFound() {
  return (
    <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(48,68,104,0.2) 0%, transparent 70%), #111827" }}/>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(60px, 15vw, 120px)", fontWeight: 700, color: "rgba(201,168,76,0.15)", lineHeight: 1, marginBottom: 16 }}>404</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, color: "#f0ece4", marginBottom: 16, letterSpacing: "-0.02em" }}>
          Seite nicht gefunden
        </div>
        <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 400, lineHeight: 1.75, marginBottom: 40 }}>
          Diese Seite existiert nicht oder wurde verschoben.
          Möglicherweise ist die URL veraltet.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" style={{ padding: "13px 28px", borderRadius: 5, background: "linear-gradient(135deg, #c9a84c, #a8873a)", color: "#111827", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Zur Startseite
          </Link>
          <Link to="/artikel" style={{ padding: "13px 28px", borderRadius: 5, border: "1px solid rgba(201,168,76,0.3)", color: "#e2c27d", fontWeight: 500, fontSize: 15, textDecoration: "none" }}>
            Artikel lesen
          </Link>
        </div>
      </div>
    </section>
  );
}
