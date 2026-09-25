import { isRouteErrorResponse, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message =
    status === 404
      ? "Diese Seite existiert nicht oder wurde verschoben."
      : "Es ist ein unerwarteter Fehler aufgetreten. Der Fehler wurde protokolliert.";

  return (
    <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center", background: "#111827" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(48px, 12vw, 96px)", fontWeight: 700, color: "rgba(201,168,76,0.15)", lineHeight: 1, marginBottom: 12 }}>
        {status}
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 700, color: "#f0ece4", marginBottom: 14, letterSpacing: "-0.02em" }}>
        {status === 404 ? "Seite nicht gefunden" : "Die Seite konnte nicht geladen werden"}
      </h1>
      <p style={{ fontSize: 16, color: "#a89f94", maxWidth: 460, lineHeight: 1.75, marginBottom: 36 }}>{message}</p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <a href="/" style={{ padding: "13px 28px", borderRadius: 5, background: "linear-gradient(135deg, #c9a84c, #a8873a)", color: "#111827", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
          Zur Startseite
        </a>
        <a href="/rechner" style={{ padding: "13px 28px", borderRadius: 5, border: "1px solid rgba(201,168,76,0.3)", color: "#e2c27d", fontWeight: 500, fontSize: 15, textDecoration: "none" }}>
          Zum Steuerrechner
        </a>
        {status !== 404 && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ padding: "13px 28px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.16)", background: "transparent", color: "#e8e2da", fontWeight: 500, fontSize: 15, cursor: "pointer" }}
          >
            Neu laden
          </button>
        )}
      </div>
    </section>
  );
}
