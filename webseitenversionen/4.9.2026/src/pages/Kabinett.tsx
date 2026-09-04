import { useState } from "react";
import { Link } from "react-router";

export default function Kabinett() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px 20px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(48,68,104,0.25) 0%, transparent 70%), #111827" }}/>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 420, margin: "0 auto", width: "100%" }}>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 28 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #c9a84c, #e2c27d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12L6 6L10 9L14 3" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "#f0ece4" }}>Konto<span style={{ color: "#c9a84c" }}>lage</span></span>
            </Link>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "#f0ece4", marginBottom: 10, letterSpacing: "-0.02em" }}>
              {mode === "login" ? "Kabinett" : "Mitglied werden"}
            </h1>
            <p style={{ fontSize: 14, color: "#a89f94" }}>
              {mode === "login" ? "Melden Sie sich in Ihrem Pro- oder Executive-Bereich an." : "Erstellen Sie Ihren Kontolage-Account."}
            </p>
          </div>

          {submitted ? (
            <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.75), rgba(30,41,59,0.9))", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 14, padding: 36, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#c9a84c", marginBottom: 12 }}>
                {mode === "login" ? "Anmeldung eingegangen" : "Registrierung eingegangen"}
              </div>
              <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.7, marginBottom: 24 }}>
                Dies ist eine Demo-Implementierung. Im Produktionssystem würden Sie hier Zugang zu Ihrem Mitgliederbereich erhalten.
              </p>
              <button onClick={() => setSubmitted(false)} style={{ padding: "10px 22px", borderRadius: 6, border: "1px solid rgba(201,168,76,0.3)", background: "transparent", color: "#e2c27d", fontSize: 14, cursor: "pointer" }}>
                Zurück
              </button>
            </div>
          ) : (
            <div style={{ background: "linear-gradient(145deg, rgba(30,50,90,0.75), rgba(30,41,59,0.9))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 36 }}>
              {/* Mode toggle */}
              <div style={{ display: "flex", background: "rgba(10,15,30,0.5)", borderRadius: 8, padding: 4, marginBottom: 28 }}>
                {[{ k: "login" as const, l: "Anmelden" }, { k: "register" as const, l: "Registrieren" }].map(t => (
                  <button key={t.k} onClick={() => setMode(t.k)} style={{ flex: 1, padding: "9px", borderRadius: 6, border: "none", cursor: "pointer", background: mode === t.k ? "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(168,135,58,0.15))" : "transparent", color: mode === t.k ? "#e2c27d" : "#a89f94", fontWeight: mode === t.k ? 600 : 400, fontSize: 14, transition: "all 0.2s", borderBottom: mode === t.k ? "1px solid rgba(201,168,76,0.4)" : "1px solid transparent" }}>
                    {t.l}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 12, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>E-Mail</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@beispiel.de"
                    style={{ width: "100%", background: "rgba(10,15,30,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "12px 14px", color: "#f0ece4", fontSize: 15, outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(201,168,76,0.4)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 12, color: "#a89f94", letterSpacing: "0.08em", textTransform: "uppercase" }}>Passwort</label>
                    {mode === "login" && <a href="#" style={{ fontSize: 12, color: "#c9a84c", textDecoration: "none" }}>Vergessen?</a>}
                  </div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    style={{ width: "100%", background: "rgba(10,15,30,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "12px 14px", color: "#f0ece4", fontSize: 15, outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(201,168,76,0.4)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 6, background: "linear-gradient(135deg, #c9a84c, #a8873a)", color: "#111827", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {mode === "login" ? "Anmelden" : "Account erstellen"}
                </button>
              </form>

              {mode === "register" && (
                <p style={{ fontSize: 11, color: "#a89f94", lineHeight: 1.7, marginTop: 16, textAlign: "center" }}>
                  Mit der Registrierung stimmen Sie unseren{" "}
                  <Link to="/datenschutz" style={{ color: "#c9a84c", textDecoration: "none" }}>Datenschutzbestimmungen</Link> zu.
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#a89f94" }}>
              Noch kein Mitglied?{" "}
              <Link to="/abo" style={{ color: "#c9a84c", textDecoration: "none", fontWeight: 600 }}>Mitgliedschaft ansehen →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
