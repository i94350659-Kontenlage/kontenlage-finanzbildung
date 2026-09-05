import { useState } from "react";
import { Link } from "react-router";

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
    priceId: null,
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
      { text: "ELSTER Vorlagen & Steuerformulare", included: false },
      { text: "B2B Gehaltspaket-Analyse", included: false },
      { text: "Prioritäts-Support (48h)", included: false },
    ],
    cta: "Pro Digital wählen (9 € / Mo)",
    priceId: "price_1UCI6ELtxD96WAjMyCVb1q5Z",
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
    ],
    cta: "Executive wählen (29 € / Mo)",
    priceId: "price_1UCI6FLtxD96WAjMgNOgPwOz",
  },
];

const faqs = [
  { q: "Kann ich monatlich kündigen?", a: "Ja. Es gibt keine Mindestlaufzeit. Sie können jederzeit mit 1 Klick zum Ende des laufenden Monats kündigen." },
  { q: "Gibt es eine Testphase mit Abofalle?", a: "Nein — und das ist Firmenphilosophie. Die Basis-Version ist dauerhaft kostenlos. Kein versteckter Übergang in ein kostenpflichtiges Abo." },
  { q: "Wie werden Zahlungen verarbeitet?", a: "Zahlungen laufen verschlüsselt über Stripe. Kreditkartendaten oder Bankdaten berühren nie unsere Server (100% PCI-DSS konform)." },
  { q: "Erhalte ich eine ordnungsgemäße Rechnung mit USt?", a: "Ja. Sie erhalten automatisch eine formelle Rechnung mit ausgewiesener deutscher MwSt (19%) für Ihre Buchhaltung. B2B-Kunden können ihre USt-IdNr. für Reverse Charge angeben." },
  { q: "Was ist das Kabinett?", a: "Das Kabinett ist der geschützte Bereich für Pro- und Executive-Mitglieder mit vertieften Analysen, Excel-Modelldateien und Satzungsvorlagen." },
];

export default function Abo() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!plan.priceId) {
      window.location.href = "/rechner";
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan.priceId,
          successUrl: `${window.location.origin}/kabinett?session_id={CHECKOUT_SESSION_ID}&success=true`,
          cancelUrl: `${window.location.origin}/abo`
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Demo fallback to Kabinett login
        window.location.href = `/kabinett?plan=${plan.id}`;
      }
    } catch (err) {
      window.location.href = `/kabinett?plan=${plan.id}`;
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
            <span style={{ fontSize: 13, color: "#c9a84c" }}>✓ 100% BaFin- &amp; WpHG-konforme Bildung</span>
            <span style={{ fontSize: 13, color: "#a89f94" }}>·</span>
            <span style={{ fontSize: 13, color: "#e2c27d" }}>Sichere Stripe-Zahlung</span>
          </div>
        </div>
      </section>

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

                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 700, color: p.highlight ? "#c9a84c" : "#f0ece4" }}>
                      {p.price} €
                    </span>
                    <span style={{ fontSize: 13, color: "#a89f94" }}>{p.period}</span>
                  </div>

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
                  disabled={loadingPlan === p.id}
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
                  {loadingPlan === p.id ? "Verbinde mit Stripe..." : p.cta}
                </button>
              </div>
            ))}
          </div>

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
