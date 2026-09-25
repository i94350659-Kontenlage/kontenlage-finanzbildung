import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

type AccountResponse = {
  user: { id: string; email: string | null };
  profile: { id: string; email: string | null; display_name: string | null; created_at: string | null } | null;
  subscription: { plan?: string | null; status?: string | null; current_period_end?: string | null; updated_at?: string | null } | null;
  billing?: { has_customer: boolean; has_subscription: boolean };
};

const catalog = {
  basis: { name: "Basis", price: 0, tagline: "Kostenloser Einblick in Rechner und Wochenartikel.", features: ["1 Bildungsartikel pro Woche", "Basis-Rechner (Rürup, Sparerpauschbetrag)", "PDF-Checkliste Steuerjahr 2026"] },
  starter: { name: "Starter", price: 4.9, tagline: "Erweiterte Rechner und alle Artikel ohne Limit.", features: ["Unbegrenzter Artikelzugang", "Sparplan- und Basis-Rechner", "Steuer-Kalender 2026"] },
  pro: { name: "Pro Digital", price: 9, tagline: "Vollständiger Zugang für Privatanleger.", features: ["Alle Rechner und Szenarien", "Druckfertige Steuer-Dossiers (PDF)", "Excel-Rechenmodelle (Holding, Fünftel)"] },
  executive: { name: "Executive B2B", price: 29, tagline: "Für Selbständige, Freiberufler und Holdings.", features: ["Holding-Strukturierungsmodell (§8b KStG)", "ELSTER-Vorlagen (ESt, USt, GewSt)", "Prioritäts-Support innerhalb von 24 h"] },
} as const;
type PlanKey = keyof typeof catalog;

const statusCatalog: Record<string, { label: string; tone: "ok" | "warn" | "err" | "info"; hint?: string }> = {
  active: { label: "Aktiv", tone: "ok", hint: "Ihr Abonnement ist bezahlt und aktiv." },
  trialing: { label: "Testphase", tone: "info", hint: "Ihre Testphase läuft." },
  canceling: { label: "Kündigung läuft", tone: "warn", hint: "Ihr Abonnement endet zum Ende der aktuellen Periode." },
  past_due: { label: "Zahlung offen", tone: "err", hint: "Die letzte Zahlung konnte nicht verarbeitet werden." },
  pending: { label: "Zahlung wird verarbeitet", tone: "info", hint: "Stripe bestätigt die Zahlung in der Regel innerhalb weniger Sekunden." },
  canceled: { label: "Gekündigt", tone: "err", hint: "Das Abonnement ist beendet." },
  inactive: { label: "Kein Abo", tone: "info", hint: "Es besteht aktuell kein kostenpflichtiges Abonnement." },
};

const tonePalette = {
  ok: { color: "#86efac", border: "rgba(16,185,129,0.4)", background: "rgba(6,78,59,0.28)" },
  warn: { color: "#fcd34d", border: "rgba(245,158,11,0.4)", background: "rgba(120,53,15,0.25)" },
  err: { color: "#fca5a5", border: "rgba(239,68,68,0.4)", background: "rgba(127,29,29,0.25)" },
  info: { color: "#cdc6be", border: "rgba(255,255,255,0.14)", background: "rgba(15,22,38,0.7)" },
} as const;

function planInfo(plan?: string | null) {
  if (plan && plan in catalog) return catalog[plan as PlanKey];
  return catalog.basis;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function initials(email?: string | null) {
  return email ? email.slice(0, 2).toUpperCase() : "K";
}

export default function Account() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recovery, setRecovery] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [lastEmailChange, setLastEmailChange] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [checkoutState, setCheckoutState] = useState<"success" | "cancelled" | null>(null);

  const fetchAccount = useCallback(async () => {
    const { data, error: invokeError } = await supabase.functions.invoke<AccountResponse>("account");
    if (invokeError) throw new Error(invokeError.message);
    if (!data) throw new Error("Konto konnte nicht geladen werden.");
    return data;
  }, []);

  const load = useCallback(async () => {
    setLoadingAccount(true);
    setLoadError(null);
    try {
      const data = await fetchAccount();
      setAccount(data);
      setDisplayName(data.profile?.display_name ?? "");
      return data;
    } catch (loadFailure) {
      setLoadError(loadFailure instanceof Error ? loadFailure.message : "Konto konnte nicht geladen werden.");
      return null;
    } finally {
      setLoadingAccount(false);
    }
  }, [fetchAccount]);

  useEffect(() => {
    if (!user) return;
    void load();
  }, [load, user]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const state = searchParams.get("checkout");
    if (state === "success" || state === "cancelled") {
      setCheckoutState(state);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (checkoutState !== "success") return;
    let attempts = 0;
    let stopped = false;
    let timer: number | undefined;
    const tick = async () => {
      if (stopped) return;
      attempts += 1;
      try {
        const data = await fetchAccount();
        setAccount(data);
        const status = data.subscription?.status;
        if (status && ["active", "trialing", "canceling"].includes(status)) return;
      } catch { /* Webhook braucht ggf. noch einen Moment */ }
      if (!stopped && attempts < 12) timer = window.setTimeout(tick, 2500);
    };
    void tick();
    return () => { stopped = true; if (timer) window.clearTimeout(timer); };
  }, [checkoutState, fetchAccount]);

  useEffect(() => {
    if (!loading && !user) navigate("/kabinett", { replace: true, state: { from: "/konto" } });
  }, [loading, navigate, user]);

  const invokeBilling = async (name: "billing-portal" | "cancel-subscription") => {
    setBusy(name);
    setError(null);
    setNotice(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke<{ url?: string; status?: string }>(name);
      if (invokeError) throw new Error(invokeError.message);
      if (data?.url) {
        window.location.assign(data.url);
        return;
      }
      setNotice(name === "cancel-subscription" ? "Kündigung vorgemerkt. Das Abo endet zum Periodenende." : "Aktion ausgeführt.");
      await load();
    } catch (invokeFailure) {
      setError(invokeFailure instanceof Error ? invokeFailure.message : "Aktion fehlgeschlagen.");
    } finally {
      setBusy(null);
    }
  };

  const saveDisplayName = async () => {
    if (!user) return;
    setBusy("display-name");
    setError(null);
    setNotice(null);
    const trimmed = displayName.trim();
    const { error: updateError } = await supabase.from("profiles").update({ display_name: trimmed || null }).eq("id", user.id);
    if (updateError) setError("Der Name konnte nicht gespeichert werden.");
    else {
      setNotice("Name gespeichert.");
      setAccount((current) => current ? { ...current, profile: current.profile ? { ...current.profile, display_name: trimmed || null } : current.profile } : current);
    }
    setBusy(null);
  };

  const sendPasswordReset = async () => {
    if (!user?.email) return;
    setBusy("password");
    setError(null);
    setNotice(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: `${window.location.origin}/konto` });
    if (resetError) setError("Der Link konnte nicht versendet werden. Bitte später erneut versuchen.");
    else setNotice("Wir haben Ihnen einen Link zum Ändern des Passworts gesendet.");
    setBusy(null);
  };

  const saveRecoveryPassword = async () => {
    setBusy("recovery");
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password: recoveryPassword });
    if (updateError) setError(updateError.message);
    else {
      setRecovery(false);
      setRecoveryPassword("");
      setNotice("Passwort aktualisiert.");
    }
    setBusy(null);
  };

  // Passwortwechsel ohne E-Mail-Link: aktuelles Passwort wird per Re-Login verifiziert,
  // danach setzt updateUser das neue Passwort. So bleibt das Konto auch dann bedienbar,
  // wenn der Reset-Mailversand noch auf dem Supabase-Free-Tier begrenzt ist.
  const changePassword = async () => {
    setBusy("change-password");
    setError(null);
    setNotice(null);
    if (nextPassword.length < 12) {
      setError("Das neue Passwort muss mindestens 12 Zeichen haben.");
      setBusy(null);
      return;
    }
    if (!user?.email) {
      setError("Für dieses Konto ist keine E-Mail-Adresse hinterlegt.");
      setBusy(null);
      return;
    }
    const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
    if (verifyError) {
      setError("Das aktuelle Passwort stimmt nicht überein.");
      setBusy(null);
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: nextPassword });
    if (updateError) setError(updateError.message);
    else {
      setCurrentPassword("");
      setNextPassword("");
      setNotice("Passwort geändert. Andere Geräte bleiben angemeldet — bei Verdacht melden Sie das Konto ab.");
    }
    setBusy(null);
  };

  const changeEmail = async () => {
    setBusy("change-email");
    setError(null);
    setNotice(null);
    const trimmed = newEmail.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(trimmed)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse an.");
      setBusy(null);
      return;
    }
    if (trimmed === user?.email?.toLowerCase()) {
      setError("Das ist bereits Ihre aktuelle E-Mail-Adresse.");
      setBusy(null);
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ email: trimmed });
    if (updateError) setError(updateError.message);
    else {
      setNewEmail("");
      setShowEmailForm(false);
      setLastEmailChange(new Date().toISOString());
      setNotice(`Wir haben eine Bestätigung an ${trimmed} gesendet. Der Wechsel wird erst nach dem Klick in der E-Mail aktiv.`);
    }
    setBusy(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const plan = planInfo(account?.subscription?.plan);
  const status = account?.subscription?.status ?? "inactive";
  const statusMeta = statusCatalog[status] ?? statusCatalog.inactive;
  const tone = tonePalette[statusMeta.tone];
  const periodEnd = formatDate(account?.subscription?.current_period_end);
  const memberSince = formatDate(account?.profile?.created_at);
  const activePaid = ["active", "trialing", "canceling", "past_due"].includes(status);
  const billing = account?.billing ?? { has_customer: false, has_subscription: false };

  if (recovery) {
    return (
      <section style={sectionStyle}>
        <div style={{ ...cardStyle, maxWidth: 460 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#f0ece4", marginBottom: 8 }}>Neues Passwort festlegen</h1>
          <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7, marginBottom: 20 }}>Wählen Sie ein Passwort mit mindestens 12 Zeichen, Buchstaben und Zahlen.</p>
          <input type="password" minLength={12} value={recoveryPassword} onChange={(event) => setRecoveryPassword(event.target.value)} style={inputStyle} placeholder="••••••••••••" />
          {error && <div role="alert" style={alertStyle}>{error}</div>}
          <button onClick={() => void saveRecoveryPassword()} disabled={busy === "recovery" || recoveryPassword.length < 12} style={{ ...primaryButtonStyle, marginTop: 20, opacity: busy === "recovery" || recoveryPassword.length < 12 ? 0.6 : 1 }}>
            {busy === "recovery" ? "Wird gespeichert…" : "Passwort speichern"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
          <div>
            <div style={eyebrowStyle}>
              <div style={eyebrowLineStyle} />
              <span>Kabinett · Mein Konto</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#f0ece4", letterSpacing: "-0.025em", marginBottom: 10 }}>
              {account?.profile?.display_name ? `Guten Tag, ${account.profile.display_name}` : "Ihr Konto"}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #a8873a)", color: "#111827", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{initials(user?.email ?? "")}</div>
              <span style={{ color: "#cdc6be", fontSize: 14 }}>{user?.email}</span>
              {memberSince && <span style={{ color: "#a89f94", fontSize: 12 }}>· Mitglied seit {memberSince}</span>}
            </div>
          </div>
          <button onClick={() => void handleSignOut()} style={ghostButtonStyle}>Abmelden</button>
        </div>

        {checkoutState === "success" && (
          <div role="status" style={{ ...bannerStyle, ...(status === "active" || status === "trialing" ? tonePalette.ok : tonePalette.info) }}>
            {status === "active" || status === "trialing"
              ? "Zahlung bestätigt. Ihr Abonnement ist aktiv."
              : "Zahlung erhalten. Stripe bestätigt das Abonnement in wenigen Sekunden…"}
          </div>
        )}
        {checkoutState === "cancelled" && (
          <div role="status" style={{ ...bannerStyle, ...tonePalette.warn }}>Der Zahlungsvorgang wurde abgebrochen. Es wurde nichts berechnet.</div>
        )}
        {notice && <div role="status" style={{ ...bannerStyle, ...tonePalette.ok }}>{notice}</div>}
        {error && <div role="alert" style={{ ...bannerStyle, ...tonePalette.err }}>{error}</div>}

        {loadingAccount && !account && (
          <div style={cardStyle}>
            <p style={mutedMonoStyle}>Kontodaten werden geladen…</p>
          </div>
        )}

        {loadError && !loadingAccount && (
          <div style={{ ...cardStyle, borderColor: "rgba(239,68,68,0.4)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#f0ece4", marginBottom: 8 }}>Kontodaten nicht erreichbar</h2>
            <p style={{ fontSize: 13, color: "#cdc6be", lineHeight: 1.7, marginBottom: 18 }}>{loadError}</p>
            <button onClick={() => void load()} style={primaryButtonStyle}>Erneut versuchen</button>
          </div>
        )}

        {account && (
          <div className="account-grid">
            <div style={{ display: "grid", gap: 20 }}>
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={mutedMonoStyle}>Mitgliedschaft</div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#f0ece4", margin: "8px 0 4px" }}>{plan.name}</h2>
                    <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7, maxWidth: 380 }}>{plan.tagline}</p>
                  </div>
                  <span style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: tone.color, border: `1px solid ${tone.border}`, background: tone.background }}>{statusMeta.label}</span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "22px 0 6px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "#e2c27d" }}>{formatEuro(plan.price)}</span>
                  <span style={{ fontSize: 13, color: "#a89f94" }}>/ Monat{plan.price === 0 ? " · kostenlos" : ""}</span>
                </div>
                {statusMeta.hint && <p style={{ fontSize: 12, color: "#a89f94", marginBottom: 0 }}>{statusMeta.hint}{periodEnd ? ` Nächste Abrechnung: ${periodEnd}.` : ""}</p>}

                <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "grid", gap: 10 }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#cdc6be", lineHeight: 1.6 }}>
                      <span style={{ color: "#c9a84c", fontWeight: 700 }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
                  {!activePaid && <Link to="/abo" style={primaryButtonStyle}>Tarif wählen</Link>}
                  {activePaid && <Link to="/abo" style={ghostButtonStyle}>Tarif vergleichen</Link>}
                  {billing.has_customer && (
                    <button onClick={() => void invokeBilling("billing-portal")} disabled={busy === "billing-portal"} style={ghostButtonStyle}>
                      {busy === "billing-portal" ? "Wird geöffnet…" : "Zahlungsdaten & Rechnungen"}
                    </button>
                  )}
                  {["active", "trialing", "past_due"].includes(status) && (
                    <button
                      onClick={() => { if (window.confirm("Möchten Sie Ihr Abonnement wirklich kündigen? Der Zugang bleibt bis zum Ende der bezahlten Periode bestehen.")) void invokeBilling("cancel-subscription"); }}
                      disabled={busy === "cancel-subscription"}
                      style={dangerButtonStyle}
                    >
                      {busy === "cancel-subscription" ? "Wird gekündigt…" : "Abo kündigen"}
                    </button>
                  )}
                </div>
              </div>

              <div style={cardStyle}>
                <div style={mutedMonoStyle}>Profil</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#f0ece4", margin: "8px 0 6px" }}>Ihre Angaben</h2>
                <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7, marginBottom: 20 }}>Der Anzeigename erscheint im Kabinett. Ihre E-Mail-Adresse ist Ihr Login.</p>
                <label style={labelStyle} htmlFor="display-name">Anzeigename</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="z. B. Familie Weber" style={{ ...inputStyle, flex: "1 1 240px" }} />
                  <button onClick={() => void saveDisplayName()} disabled={busy === "display-name"} style={{ ...ghostButtonStyle, padding: "12px 20px" }}>{busy === "display-name" ? "Speichert…" : "Speichern"}</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 22, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#cdc6be" }}>{user?.email}</div>
                    <div style={{ fontSize: 11, color: "#a89f94", marginTop: 3 }}>E-Mail-Adresse · Login</div>
                    {lastEmailChange && (
                      <div style={{ fontSize: 11, color: "#a89f94", marginTop: 3 }}>
                        E-Mail-Wechsel angefordert am {formatDate(lastEmailChange)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <button onClick={() => setShowEmailForm((open) => !open)} style={textButtonStyle} aria-expanded={showEmailForm}>
                      {showEmailForm ? "Abbrechen" : "E-Mail ändern"}
                    </button>
                    <button onClick={() => void sendPasswordReset()} disabled={busy === "password"} style={textButtonStyle}>{busy === "password" ? "Wird gesendet…" : "Passwort per E-Mail zurücksetzen"}</button>
                  </div>
                </div>

                {showEmailForm && (
                  <div style={{ marginTop: 18, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <label style={labelStyle} htmlFor="new-email">Neue E-Mail-Adresse</label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <input
                        id="new-email"
                        type="email"
                        autoComplete="email"
                        value={newEmail}
                        onChange={(event) => setNewEmail(event.target.value)}
                        placeholder="name@beispiel.de"
                        style={{ ...inputStyle, flex: "1 1 240px" }}
                      />
                      <button onClick={() => void changeEmail()} disabled={busy === "change-email"} style={{ ...ghostButtonStyle, padding: "12px 20px" }}>
                        {busy === "change-email" ? "Wird gesendet…" : "Bestätigung anfordern"}
                      </button>
                    </div>
                    <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.6, marginTop: 10 }}>
                      Der Wechsel wird erst aktiv, sobald Sie den Link in der neuen Adresse bestätigen. Ihr Abonnement bleibt davon unberührt.
                    </p>
                  </div>
                )}

                <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <label style={labelStyle} htmlFor="current-password">Passwort direkt ändern</label>
                  <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.6, marginBottom: 12 }}>
                    Ohne E-Mail-Link: Sie bestätigen Ihr aktuelles Passwort, danach wird sofort ein neues gesetzt.
                  </p>
                  <div style={{ display: "grid", gap: 10 }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 11 }} htmlFor="current-password">Aktuelles Passwort</label>
                      <input
                        id="current-password"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        style={inputStyle}
                        placeholder="••••••••••••"
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 11 }} htmlFor="next-password">Neues Passwort (mind. 12 Zeichen)</label>
                      <input
                        id="next-password"
                        type="password"
                        autoComplete="new-password"
                        minLength={12}
                        value={nextPassword}
                        onChange={(event) => setNextPassword(event.target.value)}
                        style={inputStyle}
                        placeholder="mindestens 12 Zeichen"
                      />
                    </div>
                    <div>
                      <button
                        onClick={() => void changePassword()}
                        disabled={busy === "change-password" || !currentPassword || nextPassword.length < 12}
                        style={{ ...ghostButtonStyle, padding: "12px 20px", opacity: busy === "change-password" || !currentPassword || nextPassword.length < 12 ? 0.6 : 1 }}
                      >
                        {busy === "change-password" ? "Wird geändert…" : "Passwort ändern"}
                      </button>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#a89f94", cursor: "pointer" }}>
                      <input type="checkbox" checked={rememberDevice} onChange={(event) => setRememberDevice(event.target.checked)} style={{ width: 16, height: 16 }} />
                      Dieses Gerät angemeldet lassen
                    </label>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ display: "grid", gap: 20 }}>
              <div style={cardStyle}>
                <div style={mutedMonoStyle}>Abrechnung</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#f0ece4", margin: "8px 0 6px" }}>Zahlung & Rechnungen</h2>
                <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.7, marginBottom: 18 }}>
                  Zahlungen laufen über Stripe. Rechnungen, Zahlungsmethoden und Belege verwalten Sie im sicheren Kundenportal.
                </p>
                <div style={{ display: "grid", gap: 12, fontSize: 13 }}>
                  {[
                    { label: "Zahlungsanbieter", value: "Stripe" },
                    { label: "Kundenkonto", value: billing.has_customer ? "verknüpft" : "noch nicht verknüpft" },
                    { label: "Abonnement", value: billing.has_subscription ? "hinterlegt" : "keines" },
                    { label: "Letzte Änderung", value: formatDate(account.subscription?.updated_at) ?? "–" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ color: "#a89f94" }}>{row.label}</span>
                      <span style={{ color: "#f0ece4", fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                {billing.has_customer ? (
                  <button onClick={() => void invokeBilling("billing-portal")} disabled={busy === "billing-portal"} style={{ ...primaryButtonStyle, width: "100%", marginTop: 20 }}>
                    {busy === "billing-portal" ? "Portal wird geöffnet…" : "Kundenportal öffnen"}
                  </button>
                ) : (
                  <p style={{ fontSize: 12, color: "#a89f94", lineHeight: 1.7, marginTop: 18, marginBottom: 0 }}>
                    Sobald Sie einen Tarif buchen, erscheint hier Ihr Stripe-Kundenkonto mit Rechnungen und Zahlungsmethoden.
                  </p>
                )}
              </div>

              <div style={cardStyle}>
                <div style={mutedMonoStyle}>Service</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#f0ece4", margin: "8px 0 6px" }}>Hilfe & Rechtliches</h2>
                <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.75, marginBottom: 18 }}>
                  Fragen zu Abrechnung oder Zugang? Schreiben Sie an <a href="mailto:kontakt@kontolage.de" style={{ color: "#e2c27d" }}>kontakt@kontolage.de</a>.
                  Wir antworten in der Regel innerhalb eines Werktags.
                </p>
                <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
                  <Link to="/abo" style={listLinkStyle}>Tarife vergleichen</Link>
                  <Link to="/transparenz" style={listLinkStyle}>Transparenz & Finanzierung</Link>
                  <Link to="/datenschutz" style={listLinkStyle}>Datenschutzerklärung</Link>
                  <Link to="/impressum" style={listLinkStyle}>Impressum</Link>
                </div>
                <p style={{ fontSize: 11, color: "#a89f94", lineHeight: 1.7, marginTop: 20, marginBottom: 0, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  Kontolage bietet neutrale Finanzbildung und keine individuelle Steuer-, Rechts- oder Anlageberatung im Sinne des WpHG.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const sectionStyle = { minHeight: "100svh", padding: "130px 20px 96px", background: "#111827" } as const;
const cardStyle = { padding: 28, borderRadius: 14, background: "linear-gradient(150deg, rgba(30,41,59,0.92), rgba(17,24,39,0.96))", border: "1px solid rgba(201,168,76,0.18)", boxShadow: "0 20px 50px rgba(0,0,0,0.35)" } as const;
const mutedMonoStyle = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a84c" } as const;
const eyebrowStyle = { display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a84c" } as const;
const eyebrowLineStyle = { width: 26, height: 1, background: "#c9a84c" } as const;
const labelStyle = { display: "block", color: "#cdc6be", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 } as const;
const inputStyle = { boxSizing: "border-box" as const, padding: "13px 14px", color: "#f0ece4", background: "#0f172a", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, fontSize: 14, outline: "none" };
const primaryButtonStyle = { display: "inline-block", padding: "12px 22px", borderRadius: 8, border: 0, background: "linear-gradient(135deg, #c9a84c, #e2c27d)", color: "#111827", fontWeight: 700, fontSize: 14, textDecoration: "none", cursor: "pointer" } as const;
const ghostButtonStyle = { display: "inline-block", padding: "12px 20px", borderRadius: 8, border: "1px solid rgba(201,168,76,0.35)", background: "transparent", color: "#e2c27d", fontWeight: 600, fontSize: 14, textDecoration: "none", cursor: "pointer" } as const;
const dangerButtonStyle = { display: "inline-block", padding: "12px 20px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.45)", background: "transparent", color: "#fca5a5", fontWeight: 600, fontSize: 14, cursor: "pointer" } as const;
const textButtonStyle = { background: "none", border: "none", padding: 0, color: "#e2c27d", fontSize: 13, fontWeight: 600, cursor: "pointer" } as const;
const alertStyle = { marginTop: 16, padding: "12px 14px", borderRadius: 8, background: "rgba(127,29,29,0.22)", border: "1px solid rgba(239,68,68,0.4)", color: "#fecaca", fontSize: 13, lineHeight: 1.65 } as const;
const bannerStyle = { marginBottom: 20, padding: "14px 18px", borderRadius: 10, border: "1px solid", fontSize: 13, lineHeight: 1.6 } as const;
const listLinkStyle = { color: "#e2c27d", textDecoration: "none" } as const;
