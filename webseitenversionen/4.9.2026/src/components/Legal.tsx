import { Link } from "react-router";
import type { ReactNode } from "react";

/** Layout für Rechtstexte. Bewusst schlank gehalten, damit Impressum/Datenschutz
 *  und die neuen Pflichtseiten visuell konsistent bleiben. */
export function LegalSection({ children }: { children: ReactNode }) {
  return (
    <section style={{ padding: "56px 20px 88px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

export function LegalHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section style={{ paddingTop: 120, padding: "120px 20px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 22, height: 1, background: "#c9a84c" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>{eyebrow}</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 700, color: "#f0ece4", letterSpacing: "-0.025em", marginBottom: 18 }}>{title}</h1>
        <p style={{ fontSize: 15, color: "#a89f94", lineHeight: 1.75, maxWidth: 680 }}>{intro}</p>
      </div>
    </section>
  );
}

export function LegalClause({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#f0ece4", marginBottom: 12 }}>{heading}</h2>
      {children}
    </div>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 14, color: "#a89f94", lineHeight: 1.85, marginBottom: 12 }}>{children}</p>;
}

/** Markiert Passagen, die vor dem Livegang juristisch freizugeben sind. */
export function ReviewNotice({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 40, padding: "18px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8 }}>
      <p style={{ fontSize: 12, color: "#cdc6be", lineHeight: 1.7, margin: 0 }}>
        <strong style={{ color: "#e2c27d" }}>Hinweis für den Betreiber:</strong> {text}
      </p>
    </div>
  );
}

export function LegalFooterNote({ updated }: { updated: string }) {
  return (
    <p style={{ fontSize: 12, color: "#7d766d", lineHeight: 1.7, marginTop: 28 }}>
      Stand: {updated} · Betreiberangaben siehe <Link to="/impressum" style={{ color: "#a89f94" }}>Impressum</Link> ·{" "}
      <Link to="/datenschutz" style={{ color: "#a89f94" }}>Datenschutz</Link> ·{" "}
      <Link to="/widerruf" style={{ color: "#a89f94" }}>Widerrufshinweise</Link>
    </p>
  );
}
