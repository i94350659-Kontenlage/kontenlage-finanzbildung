// P1-15: Deep-Links + teilbarer Direktlink im Rechner.
// Ersetzt den Export-Block von Rechner.tsx und ergänzt den useEffect-Import.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const target = path.join(root, 'webseitenversionen', '4.9.2026', 'src', 'pages', 'Rechner.tsx')

const tail = `export default function Rechner() {
  const [activeCalc, setActiveCalc] = useState(0);
  const [copied, setCopied] = useState(false);

  const calcs = [
    { label: "Rürup §10 EStG", slug: "rurup", component: <RurupRechner /> },
    { label: "Sparerpauschbetrag", slug: "sparerpauschbetrag", component: <SparerRechner /> },
    { label: "Immobilien-AfA §7", slug: "immobilien", component: <ImmobilienRechner /> },
    { label: "Depot- & CSV-Analyse", slug: "depot", component: <DepotImporter /> },
  ];

  // Deep-Link-Sync: /rechner#sparerpauschbetrag öffnet den passenden Rechner direkt.
  // Wirkt fuer geteilte Links, interne Verweise und den Browser-Verlauf.
  useEffect(() => {
    const applyFromLocation = () => {
      const slug = window.location.hash.replace(/^#/, "").trim().toLowerCase();
      if (!slug) return;
      const index = calcs.findIndex((c) => c.slug === slug);
      if (index >= 0) setActiveCalc(index);
    };

    applyFromLocation();
    window.addEventListener("hashchange", applyFromLocation);
    window.addEventListener("popstate", applyFromLocation);
    return () => {
      window.removeEventListener("hashchange", applyFromLocation);
      window.removeEventListener("popstate", applyFromLocation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCalc = (index: number) => {
    setActiveCalc(index);
    setCopied(false);
    const next = "#" + calcs[index].slug;
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", window.location.pathname + next);
    }
  };

  const shareLink = async () => {
    const url = window.location.origin + window.location.pathname + "#" + calcs[activeCalc].slug;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Link kopieren:", url);
    }
  };

  return (
    <>
      <PageHeader />

      <section style={{ padding: "56px 20px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Selector */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            {calcs.map((c, i) => (
              <button
                key={c.label}
                onClick={() => selectCalc(i)}
                aria-pressed={activeCalc === i}
                aria-controls="rechner-ergebnis"
                id={"rechner-tab-" + c.slug}
                style={{
                  padding: "10px 20px", borderRadius: 6, border: "1px solid",
                  borderColor: activeCalc === i ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
                  background: activeCalc === i ? "rgba(201,168,76,0.1)" : "transparent",
                  color: activeCalc === i ? "#e2c27d" : "#a89f94",
                  fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                }}>{c.label}</button>
            ))}

            <button
              onClick={shareLink}
              aria-label="Direktlink zu diesem Rechner kopieren"
              style={{
                marginLeft: "auto", padding: "9px 16px", borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
                color: copied ? "#e2c27d" : "#a89f94", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{copied ? "✓ Link kopiert" : "↗ Direktlink teilen"}</button>
          </div>

          <p style={{ fontSize: 12, color: "#7d766d", margin: "0 0 32px", lineHeight: 1.6 }}>
            Jeder Rechner hat einen eigenen Direktlink (z. B. <code>/rechner#{calcs[activeCalc].slug}</code>) — damit lässt sich
            eine bestimmte Berechnung teilen oder bookmarken. Eingaben bleiben im Browser, es werden keine Daten übertragen.
          </p>

          <div id="rechner-ergebnis" role="tabpanel" aria-labelledby={"rechner-tab-" + calcs[activeCalc].slug}>
            {calcs[activeCalc].component}
          </div>
        </div>
      </section>

      <Disclaimer />
    </>
  );
}
`

const original = fs.readFileSync(target, 'utf8')
const marker = 'export default function Rechner() {'
const index = original.indexOf(marker)
if (index < 0) {
  console.error('FEHLER: Export-Block nicht gefunden')
  process.exit(1)
}

let head = original.slice(0, index)
const headLf = head.replace(/\r\n/g, '\n')
const updatedHead = headLf.startsWith('import { useState } from "react";')
  ? headLf.replace('import { useState } from "react";', 'import { useEffect, useState } from "react";')
  : headLf

const output = (updatedHead + tail).replace(/\r?\n/g, '\r\n')
fs.writeFileSync(target, output, 'utf8')
console.log(`OK: Rechner.tsx aktualisiert (${output.length} Bytes, useEffect-Import: ${updatedHead.includes('useEffect, useState')})`)