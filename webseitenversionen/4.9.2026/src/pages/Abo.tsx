import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

// ── Preisquelle (P0-05, § 1 PAngV) ────────────────────────────────────────────
// Single Source of Truth: Preise werden zuerst als NETTO geführt (so, wie Stripe
// `tax_behavior: "exclusive"` sie erwartet) und für die Anzeige inkl. 19 % MwSt.
// berechnet. Endpreise müssen immer mit Steuerausweis angezeigt werden (§ 1 Abs. 1
// PAngV, § 3 UStG) — deshalb formatieren wir hier einmal zentral statt im Template.
//
// Achtung Betreiber: Die tatsächliche Umsatzsteuerpflicht (Regelbetrieb vs.
// Kleinunternehmerregelung § 19 UStG) ist eine unternehmerische Entscheidung und
// liegt im Repo nicht fest. Siehe TODOperHAND.md → P0-05. Bei § 19 UStG ist die
// Angabe „inkl. MwSt." zu entfernen und VAT_EXEMPT auf true zu setzen.
export const VAT_RATE = 0.19;
export const VAT_EXEMPT = false;

export const formatGross = (net: number): string =>
  (net * (1 + (VAT_EXEMPT ? 0 : VAT_RATE))).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const vatLabel = (): string =>
  VAT_EXEMPT ? "zzgl. MwSt. gem. § 19 UStG" : "inkl. 19 % MwSt.";

const plans = [
  {
    id: "basis",
    name: "Basis",
    price: 0,
    period: "/ Monat",
    highlight: false,
    desc: "Freier Einblick in grundlegende Steuerrechner & Wochenartikel.",
    features: [
      { text: "1 Bildungsartikel pro Woche", included: true },
      { text: "Basis-Rechner (Rürup §10, Sparerpauschbetrag §20)", included: true },
      { text: "PDF-Checkliste Steuerjahr 2026", included: true },
      { text: "100% Kostenlos ohne Registrierung", included: true },
      { text: "Holding-Strukturierungsrechner", included: false },
      { text: "Excel-Modelle & ELSTER-Vorlagen", included: false },
      { text: "Kabinett Exklusivbereich", included: false },
      { text: "Prioritäts-Support", included: false },
    ],
    cta: "Kostenlos starten",
    planKey: null,
  },
  {
    id: "starter",
    name: "Starter",
    price: 4.9,
    period: "/ Monat",
    highlight: false,
    desc: "Für Einsteiger: erweiterte Rechner & alle Wochenartikel ohne Limit.",
    features: [
      { text: "Unbegrenzter Artikel-Zugang", included: true },
      { text: "Alle Basis-Rechner + Sparplan-Rechner", included: true },
      { text: "PDF-Checkliste & Steuer-Kalender 2026", included: true },
      { text: "Kabinett Lesebereich (ohne Download)", included: true },
      { text: "Holding-Strukturierungsrechner", included: false },
      { text: "Excel-Rechenmodelle (Holding, Fünftel)", included: false },
      { text: "ELSTER-Vorlagen & Steuerformulare", included: false },
      { text: "Prioritäts-Support", included: false },
    ],
    cta: "Starter wählen",
    planKey: "starter",
  },
  {
    id: "pro",
    name: "Pro Digital",
    price: 9,
    period: "/ Monat",
    highlight: true,
    desc: "Vollständiger Zugang für Privatanleger & Vermögensaufbau.",
    features: [
      { text: "Unbegrenzter Artikel- & Analysenzugang", included: true },
      { text: "Alle Rechner & Szenarien (AfA, Tilgung)", included: true },
      { text: "Druckfertige Steuer-Dossiers (PDF-Export)", included: true },
      { text: "Excel-Rechenmodelle (Holding, Fünftel)", included: true },
      { text: "Kabinett Zugang (Exklusiv-Analysen)", included: true },
      { text: "Pro-Ausgaben im Kabinett (nur hier, nicht öffentlich)", included: true },
      { text: "ELSTER Vorlagen & Steuerformulare", included: false },
      { text: "B2B Gehaltspaket-Analyse", included: false },
      { text: "Prioritäts-Support (48h)", included: false },
    ],
    cta: "Pro Digital wählen",
    planKey: "pro",
  },
  {
    id: "executive",
    name: "Executive B2B",
    price: 29,
    period: "/ Monat",
    highlight: false,
    desc: "Für Selbständige, Freiberufler, Geschäftsführer & Holdings.",
    features: [
      { text: "Alles aus Pro Digital enthalten", included: true },
      { text: "Holding-Strukturierungsmodell (§8b KStG)", included: true },
      { text: "VV-GmbH Excel-Rechenmodell & Satzungsvorlage", included: true },
      { text: "Fünftelregelung Abfindungs-Planer (§34 EStG)", included: true },
      { text: "ELSTER-Vorlagen (ESt, USt, GewSt)", included: true },
      { text: "B2B Gehaltspaket-Analyse (GGF-Gehalt)", included: true },
      { text: "Prioritäts-Support (Antwort in < 24h)", included: true },
      { text: "Early Access zu neuen Steuer-Features", included: true },
      { text: "Executive-Ausgaben: B2B-Deep-Dives mit Quellen", included: true },
    ],
    cta: "Executive wählen",
    planKey: "executive",
  },
];


const faqs = [
  { q: "Kann ich monatlich kündigen?", a: "Ja. Es gibt keine Mindestlaufzeit. Sie können jederzeit mit 1 Klick zum Ende des laufenden Monats kündigen." },
  { q: "Gibt es eine Testphase mit Abofalle?", a: "Nein — und das ist Firmenphilosophie. Die Basis-Version ist dauerhaft kostenlos. Kein versteckter Übergang in ein kostenpflichtiges Abo." },
  { q: "Wie werden Zahlungen verarbeitet?", a: "Die Zahlungsabwicklung erfolgt über Stripe Checkout. Zahlungsdaten werden nicht in Kontolage-Rechnern gespeichert. Im Sandbox-Modus werden keine echten Zahlungen ausgeführt." },
  { q: "Erhalte ich eine ordnungsgemäße Rechnung mit USt?", a: "Rechnungsstellung, USt-Ausweis und gegebenenfalls Reverse-Charge-Angaben werden vor dem produktiven Abo-Freischalten steuerlich geprüft und im Checkout transparent ausgewiesen." },
  { q: "Was ist das Kabinett?", a: "Das Kabinett ist der geschützte Bereich für Pro- und Executive-Mitglieder mit vertieften Analysen, Excel-Modelldateien, Satzungsvorlagen und den exklusiven Kontolage-Ausgaben. Geschützte Ausgaben werden technisch nur nach Prüfung der Mitgliedschaft ausgeliefert und stehen nicht im öffentlichen Seiteninhalt." },
  { q: "Erhalte ich die Ausgaben per E-Mail?", a: "Nein. Die Kontolage-Ausgaben erscheinen direkt auf kontolage.de unter „Ausgaben“ und — soweit sie Ihrem Tarif vorbehalten sind — in Ihrem Kabinett unter /konto. Es werden keine Ausgaben per E-Mail versendet, und für die Anmeldung wird keine E-Mail-Adresse zu Werbezwecken gespeichert." },
];

export default function Abo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "cancelled") setCancelled(true);
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void supabase.functions
      .invoke<{ subscription?: { plan?: string | null; status?: string | null } | null }>("account")
      .then(({ data }) => {
        if (!active || !data?.subscription?.plan) return;
        const status = data.subscription.status ?? "";
        if (["active", "trialing", "canceling", "past_due"].includes(status)) setActivePlan(data.subscription.plan);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [user]);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!plan.planKey) {
      window.location.href = "/rechner";
      return;
    }
    if (activePlan === plan.planKey) {
      setCheckoutError("Dieser Tarif ist bereits aktiv. Rechnungen und Kündigung verwalten Sie im Kabinett.");
      return;
    }
    if (!user) {
      navigate("/kabinett", { replace: true, state: { from: "/abo" } });
      return;
    }

    setCheckoutError(null);
    setLoadingPlan(plan.id);
    try {
      const { data, error } = await supabase.functions.invoke<{ url?: string }>("create-checkout-session", {
        body: { plan: plan.planKey },
      });
      if (error || !data?.url) throw new Error(error?.message || "Checkout ist vorübergehend nicht verfügbar.");
      window.location.assign(data.url);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout ist vorübergehend nicht verfügbar.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <section style={{ paddingTop: 120, paddingBottom: 56, padding: "120px 20px 56px", background: "linear-gradient(180deg, rgba(48,68,104,0.15) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Mitgliedschaft</span>
            <div style={{ width: 22, height: 1, background: "#c9a84c" }}/>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, color: "#f0ece4", marginBottom: 18, letterSpacing: "-0.025em" }}>
            Transparent. Ohne Abo-Falle.
          </h1>
          <p style={{ fontSize: 16, color: "#a89f94", lineHeight: 1.75, marginBottom: 20 }}>
            Monatlich kündbar. Keine versteckten Kosten. Keine Berater-Provisionen.
          </p>
          <div style={{ display: "inline-flex", gap: 12, padding: "8px 16px", borderRadius: 8, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <span style={{ fontSize: 13, color: "#c9a84c" }}>✓ Allgemeine Finanzbildung, keine individuelle Beratung</span>
            <span style={{ fontSize: 13, color: "#a89f94" }}>·</span>
            <span style={{ fontSize: 13, color: "#e2c27d" }}>Sichere Stripe-Zahlung</span>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
      {cancelled && (
        <div role="status" style={{ maxWidth: 700, margin: "0 auto 28px", padding: "14px 18px", border: "1px solid rgba(245,158,11,.45)", borderRadius: 8, background: "rgba(120,53,15,.22)", color: "#fcd34d", textAlign: "center" }}>
          Der Zahlungsvorgang wurde abgebrochen. Es wurde nichts berechnet – Sie können Ihren Tarif jederzeit erneut wählen.
        </div>
      )}
      {activePlan && (
        <div role="status" style={{ maxWidth: 700, margin: "0 auto 28px", padding: "14px 18px", border: "1px solid rgba(201,168,76,.35)", borderRadius: 8, background: "rgba(201,168,76,.08)", color: "#e2c27d", textAlign: "center" }}>
          Ihr Tarif ist aktiv. Rechnungen und Kündigung verwalten Sie im <Link to="/konto" style={{ color: "#e2c27d", textDecoration: "underline" }}>Kabinett</Link>.
        </div>
      )}
      {!user && (
        <div role="status" style={{ maxWidth: 700, margin: "0 auto 28px", padding: "14px 18px", border: "1px solid rgba(255,255,255,.14)", borderRadius: 8, background: "rgba(15,22,38,.7)", color: "#cdc6be", textAlign: "center" }}>
          Für eine Buchung ist ein Konto nötig. <Link to="/kabinett" style={{ color: "#e2c27d", textDecoration: "underline" }}>Anmelden oder registrieren</Link> – danach kehren Sie automatisch hierher zurück.
        </div>
      )}
      </div>

      {/* Pricing Cards */}
      <section style={{ padding: "64px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, alignItems: "stretch" }}>
            {plans.map(p => (
              <div
                key={p.id}
                style={{
                  background: p.highlight
                    ? "linear-gradient(145deg, rgba(30,55,105,0.85), rgba(20,32,58,0.95))"
                    : "linear-gradient(145deg, rgba(20,30,50,0.65), rgba(15,22,38,0.8))",
                  border: p.highlight ? "2px solid #c9a84c" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: 36,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  boxShadow: p.highlight ? "0 20px 40px rgba(0,0,0,0.4)" : "none"
                }}
              >
                {p.highlight && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #c9a84c, #e2c27d)", color: "#0C1825", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Meistgewählt
                  </div>
                )}

                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#f0ece4", marginBottom: 8 }}>
                    {p.name}
                  </div>
                  <p style={{ fontSize: 13, color: "#a89f94", minHeight: 40, lineHeight: 1.6, marginBottom: 20 }}>
                    {p.desc}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 700, color: p.highlight ? "#c9a84c" : "#f0ece4" }}>
                      {p.price === 0 ? "0,00" : formatGross(p.price)} €
                    </span>
                    <span style={{ fontSize: 13, color: "#a89f94" }}>{p.period}</span>
                  </div>
                  {p.price > 0 && (
                    <p style={{ fontSize: 11, color: "#7d766d", margin: "-10px 0 28px", lineHeight: 1.5 }}>
                      {vatLabel()}
                      {VAT_EXEMPT ? "" : <> · zzgl. {formatGross(p.price)} € netto</>}
                    </p>
                  )}

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 14 }}>
                    {p.features.map(f => (
                      <li key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: f.included ? "#cdc6be" : "#556075" }}>
                        <span style={{ color: f.included ? "#c9a84c" : "#445068", fontSize: 14, fontWeight: 700 }}>
                          {f.included ? "✓" : "–"}
                        </span>
                        <span style={{ textDecoration: f.included ? "none" : "line-through" }}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(p)}
                  disabled={loadingPlan === p.id || activePlan === p.planKey}
                  // § 312j BGB: Der Bestellbutton muss die zahlungspflichtige
                  // Handlung und den Endpreis eindeutig ausweisen.
                  aria-label={
                    p.price > 0
                      ? `${p.cta} — zahlungspflichtig, ${formatGross(p.price)} € pro Monat ${vatLabel()}`
                      : `${p.cta} — kostenlos`
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 8,
                    border: "none",
                    background: p.highlight ? "linear-gradient(135deg, #c9a84c, #e2c27d)" : "rgba(201,168,76,0.15)",
                    color: p.highlight ? "#0C1825" : "#e2c27d",
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: p.highlight ? "0 4px 15px rgba(201,168,76,0.3)" : "none"
                  }}
                >
                  {activePlan === p.planKey ? "Aktueller Tarif" : loadingPlan === p.id ? "Verbinde mit Stripe..." : p.cta}
                </button>

                {p.price > 0 && (
                  <p style={{ fontSize: 11, color: "#7d766d", marginTop: 10, lineHeight: 1.6, textAlign: "center" }}>
                    Zahlungspflichtig: {formatGross(p.price)} € / Monat {vatLabel()}. Abonnement mit
                    monatlicher Kündigung zum Ende der Laufzeit, keine Mindestlaufzeit.
                    <br />
                    <Link to="/agb" style={{ color: "#a89f94" }}>AGB</Link>
                    {" · "}
                    <Link to="/widerruf" style={{ color: "#a89f94" }}>Widerrufshinweise</Link>
                    {" · "}
                    <a href="mailto:service@kontolage.de?subject=K%C3%BCndigung" style={{ color: "#a89f94" }}>
                      Vertrag kündigen
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>

          {checkoutError && (
            <div role="alert" style={{ maxWidth: 700, margin: "0 auto 28px", padding: "14px 18px", border: "1px solid rgba(239,68,68,.45)", borderRadius: 8, background: "rgba(127,29,29,.2)", color: "#fecaca", textAlign: "center" }}>
              {checkoutError} Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.
            </div>
          )}

          {/* FAQ Section */}
          <div style={{ marginTop: 80, maxWidth: 800, margin: "80px auto 0" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#f0ece4", textAlign: "center", marginBottom: 32 }}>
              Häufige Fragen zur Mitgliedschaft
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map((f, i) => (
                <div key={f.q} style={{ background: "rgba(15,22,38,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: "#f0ece4", fontSize: 15, fontWeight: 600, textAlign: "left", cursor: "pointer" }}
                  >
                    <span>{f.q}</span>
                    <span style={{ color: "#c9a84c", fontSize: 18 }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 24px 20px", color: "#a89f94", fontSize: 14, lineHeight: 1.7 }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
