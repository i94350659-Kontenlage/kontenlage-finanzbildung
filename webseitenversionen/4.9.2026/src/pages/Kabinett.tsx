import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "register";
type LocationState = { from?: string } | null;

const benefits = [
  "Alle Steuerrechner & Szenarien in voller Tiefe",
  "Wochenanalysen und Steuer-Dossiers als PDF",
  "Abo monatlich kündbar, Zahlung über Stripe",
  "Keine Provisionen, keine Anlageberatung",
];

function translateAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "E-Mail-Adresse oder Passwort ist nicht korrekt.";
  if (normalized.includes("email not confirmed")) return "Bitte bestätigen Sie zuerst die E-Mail-Adresse in Ihrem Postfach.";
  if (normalized.includes("user already registered")) return "Für diese E-Mail-Adresse existiert bereits ein Konto. Bitte melden Sie sich an.";
  if (normalized.includes("password should be at least")) return "Das Passwort muss mindestens 12 Zeichen lang sein.";
  if (normalized.includes("weak password")) return "Das Passwort ist zu schwach. Bitte nutzen Sie mindestens 12 Zeichen mit Buchstaben und Zahlen.";
  if (normalized.includes("rate limit") || normalized.includes("too many")) return "Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.";
  if (normalized.includes("invalid format") || normalized.includes("unable to validate email")) return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  if (normalized.includes("signups not allowed") || normalized.includes("signup is disabled")) return "Die Registrierung ist derzeit deaktiviert. Bitte kontaktieren Sie den Support.";
  return message;
}

export default function Kabinett() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState)?.from ?? "/konto";
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorNeedsConfirmation, setErrorNeedsConfirmation] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeEmail, setNoticeEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate(redirectTo, { replace: true });
  }, [loading, navigate, redirectTo, user]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
    setNoticeEmail(null);
    setErrorNeedsConfirmation(false);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    setNoticeEmail(null);
    setErrorNeedsConfirmation(false);
    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        navigate(redirectTo, { replace: true });
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/konto` },
        });
        if (authError) throw authError;
        if (data.session) {
          navigate("/konto", { replace: true });
        } else {
          setNotice("Ihr Konto wurde angelegt.");
          setNoticeEmail(email.trim());
        }
      }
    } catch (authError) {
      const raw = authError instanceof Error ? authError.message : "Anmeldung fehlgeschlagen.";
      setError(translateAuthError(raw));
      setErrorNeedsConfirmation(raw.toLowerCase().includes("email not confirmed"));
    } finally {
      setBusy(false);
    }
  };

  const resendConfirmation = async () => {
    if (!email) {
      setError("Bitte geben Sie zuerst Ihre E-Mail-Adresse ein.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/konto` },
    });
    if (resendError) setError(translateAuthError(resendError.message));
    else {
      setNotice("Bestätigungs-E-Mail erneut versendet.");
      setNoticeEmail(email.trim());
      setErrorNeedsConfirmation(false);
    }
    setBusy(false);
  };

  const resetPassword = async () => {
    if (!email) {
      setError("Bitte geben Sie zuerst Ihre E-Mail-Adresse ein.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/konto`,
    });
    if (resetError) setError(translateAuthError(resetError.message));
    else {
      setNotice("Wenn ein Konto existiert, ist der Link zum Zurücksetzen unterwegs.");
      setNoticeEmail(email.trim());
    }
    setBusy(false);
  };

  const passwordValid = password.length >= 12 && /[A-Za-z]/.test(password) && /\d/.test(password);

  if (loading || user) {
    return (
      <section style={sectionStyle}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <p style={{ color: "#a89f94", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>Kabinett wird geladen…</p>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 15% 10%, rgba(201,168,76,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 85% 90%, rgba(48,68,104,0.35) 0%, transparent 65%)" }} />
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", width: "100%" }}>
        <div className="auth-grid">
          <div>
            <div style={eyebrowStyle}>
              <div style={eyebrowLineStyle} />
              <span>Kabinett · Geschützter Bereich</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.025em", color: "#f0ece4", marginBottom: 20 }}>
              Ihr Zugang zu<br />Rechnern, Dossiers<br />und <em style={{ color: "#c9a84c", fontStyle: "italic" }}>Analysen</em>.
            </h1>
            <p style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.85, maxWidth: 440, marginBottom: 32 }}>
              Ein Konto genügt: Sie verwalten Tarif, Zahlungsdaten und Downloads an einem Ort.
              Bestätigung und Zahlung laufen über geprüfte Sicherheitsdienste.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
              {benefits.map((item) => (
                <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14, color: "#cdc6be", lineHeight: 1.6 }}>
                  <span style={{ color: "#c9a84c", fontWeight: 700 }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 34, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 26, flexWrap: "wrap" }}>
              {[
                { value: "TLS", label: "Verschlüsselte Übertragung" },
                { value: "Stripe", label: "Zahlungsabwicklung" },
                { value: "DSGVO", label: "Datenminimierung" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "#e2c27d" }}>{item.value}</div>
                  <div style={{ fontSize: 11, color: "#a89f94", letterSpacing: "0.04em", marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <div role="tablist" aria-label="Anmeldung oder Registrierung" style={tabListStyle}>
              {(["login", "register"] as Mode[]).map((item) => (
                <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => switchMode(item)} style={tabStyle(mode === item)}>
                  {item === "login" ? "Anmelden" : "Registrieren"}
                </button>
              ))}
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#f0ece4", margin: "26px 0 6px" }}>
              {mode === "login" ? "Willkommen zurück" : "Konto erstellen"}
            </h2>
            <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7, marginBottom: 24 }}>
              {mode === "login"
                ? "Melden Sie sich an, um Tarif, Rechnungen und Zugänge zu verwalten."
                : "Vergeben Sie ein sicheres Passwort. Anschließend bestätigen Sie Ihre E-Mail-Adresse."}
            </p>

            <form onSubmit={submit} noValidate>
              <label style={labelStyle} htmlFor="auth-email">E-Mail-Adresse</label>
              <input
                id="auth-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@unternehmen.de"
                style={inputStyle}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, margin: "18px 0 6px" }}>
                <label style={{ ...labelStyle, margin: 0 }} htmlFor="auth-password">Passwort</label>
                {mode === "register" && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: !password || passwordValid ? "#a89f94" : "#fca5a5", letterSpacing: "0.06em" }}>
                    MIN. 12 ZEICHEN · BUCHSTABEN + ZAHLEN
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={12}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  style={{ ...inputStyle, paddingRight: 84 }}
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} style={toggleStyle}>
                  {showPassword ? "Verbergen" : "Zeigen"}
                </button>
              </div>
              {error && (
                <div role="alert" style={alertStyle}>
                  <span>{error}</span>
                  {errorNeedsConfirmation && (
                    <button type="button" onClick={resendConfirmation} disabled={busy} style={inlineLinkStyle}>
                      Bestätigungs-E-Mail erneut senden
                    </button>
                  )}
                </div>
              )}

              {notice && (
                <div role="status" style={successStyle}>
                  <strong style={{ display: "block", color: "#86efac", marginBottom: 4 }}>{notice}</strong>
                  {noticeEmail && (
                    <span>
                      Bitte prüfen Sie das Postfach von <strong>{noticeEmail}</strong> (auch den Spam-Ordner) und klicken Sie dort auf den Bestätigungslink.
                    </span>
                  )}
                </div>
              )}

              <button type="submit" disabled={busy || (mode === "register" && !passwordValid)} style={{ ...submitStyle, opacity: busy || (mode === "register" && !passwordValid) ? 0.6 : 1 }}>
                {busy ? "Bitte warten…" : mode === "login" ? "Sicher anmelden" : "Konto erstellen"}
              </button>
            </form>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
              {mode === "login" ? (
                <button type="button" disabled={busy} onClick={resetPassword} style={textButtonStyle}>Passwort vergessen?</button>
              ) : (
                <span style={{ fontSize: 12, color: "#a89f94" }}>Sie erhalten eine Bestätigungs-E-Mail.</span>
              )}
              <Link to="/datenschutz" style={{ fontSize: 12, color: "#a89f94", textDecoration: "none" }}>Datenschutz</Link>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 12, color: "#a89f94", lineHeight: 1.8 }}>
              Mit der Registrierung stimmen Sie der <Link to="/datenschutz" style={{ color: "#e2c27d" }}>Datenschutzerklärung</Link> zu.
              Kontolage bietet neutrale Finanzbildung und keine individuelle Steuer- oder Anlageberatung.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const sectionStyle = { position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", padding: "130px 20px 90px", background: "#111827", overflow: "hidden" } as const;
const eyebrowStyle = { display: "flex", alignItems: "center", gap: 10, marginBottom: 22, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a84c" } as const;
const eyebrowLineStyle = { width: 26, height: 1, background: "#c9a84c" } as const;
const cardStyle = { width: "100%", maxWidth: 470, justifySelf: "end", padding: 34, borderRadius: 16, background: "linear-gradient(150deg, rgba(30,41,59,0.96), rgba(17,24,39,0.98))", border: "1px solid rgba(201,168,76,0.22)", boxShadow: "0 30px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(201,168,76,0.14)" } as const;
const tabListStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: 6, borderRadius: 10, background: "rgba(15,22,38,0.9)", border: "1px solid rgba(255,255,255,0.07)" } as const;
const tabStyle = (active: boolean) => ({
  padding: "10px 12px",
  borderRadius: 7,
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.02em",
  color: active ? "#111827" : "#cdc6be",
  background: active ? "linear-gradient(135deg, #c9a84c, #e2c27d)" : "transparent",
  transition: "background 0.2s, color 0.2s",
}) as const;
const labelStyle = { display: "block", color: "#cdc6be", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 } as const;
const inputStyle = { width: "100%", boxSizing: "border-box" as const, padding: "13px 14px", color: "#f0ece4", background: "#0f172a", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, fontSize: 14, outline: "none" };
const toggleStyle = { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#c9a84c", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-mono)" } as const;
const submitStyle = { width: "100%", marginTop: 24, padding: "14px 18px", border: 0, borderRadius: 8, color: "#111827", background: "linear-gradient(135deg, #c9a84c, #e2c27d)", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 24px rgba(201,168,76,0.25)" } as const;
const alertStyle = { marginTop: 18, padding: "12px 14px", borderRadius: 8, background: "rgba(127,29,29,0.22)", border: "1px solid rgba(239,68,68,0.4)", color: "#fecaca", fontSize: 13, lineHeight: 1.65, display: "grid", gap: 8 } as const;
const successStyle = { marginTop: 18, padding: "12px 14px", borderRadius: 8, background: "rgba(6,78,59,0.28)", border: "1px solid rgba(16,185,129,0.35)", color: "#bbf7d0", fontSize: 13, lineHeight: 1.65 } as const;
const inlineLinkStyle = { justifySelf: "start", background: "none", border: "none", padding: 0, color: "#e2c27d", fontSize: 13, fontWeight: 600, textDecoration: "underline", cursor: "pointer" } as const;
const textButtonStyle = { background: "none", border: "none", padding: 0, color: "#e2c27d", fontSize: 13, cursor: "pointer" } as const;
