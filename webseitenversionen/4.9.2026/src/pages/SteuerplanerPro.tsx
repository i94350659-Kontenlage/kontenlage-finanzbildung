// Steuerplaner Pro — Interaktiver Was-wäre-wenn-Rechner & Absetzungs-Datenbank
import { useState } from 'react';
import { Link } from 'react-router';
import { ALLE_STEUERPOSTEN, KATEGORIEN_LISTE, type SteuerPosten } from '../lib/steuerposten-index';
import { berechnePlaner, type PlanerEingabe } from '../lib/steuerplaner-pro';
import { useSubscription } from '../hooks/useSubscription';
import { triggerCsvDownload } from '../lib/excelModelGenerator';
import SteuerplanerPostenEingabe from '../components/steuerplaner-posten-eingabe';
import SteuerplanerErgebnis from '../components/steuerplaner-ergebnis';
import SteuerplanerSmart from '../components/steuerplaner-smart';

const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');

// Kategorien, die in Starter (5,83 €) bzw. Vorschau zugänglich sind
const STARTER_KATEGORIEN = new Set([
  'IT & Technik',
  'Büro & Verwaltung',
  'Mobilität',
  'Vorsorge',
  'Privat: Werbungskosten',
  'Privat: Vorsorge',
  'Privat: Immobilien',
]);

const FREE_PREVIEW_KATEGORIEN = new Set([
  'IT & Technik',
  'Privat: Werbungskosten',
]);

const INITIAL: PlanerEingabe = {
  geschäftstyp: 'einzelunternehmen',
  familienstand: 'ledig',
  gewinnGewerblich: 65000,
  gmbhGewinn: 65000,
  gggGehalt: 48000,
  privatEinkommen: 0,
  ausgaben: [
    { postenId: 'it_hardware', betrag: 799 },
    { postenId: 'homeoffice_pauschale', betrag: 1260 },
  ],
  ruerup: 6000,
  kvBeiträge: 4800,
  kapitalerträge: 2500,
  itAnschaffung: 799,
  solarAnschaffung: 0,
};

export default function SteuerplanerPro() {
  const { isStarter, isPro, isExecutive, loading } = useSubscription();
  const [eingabe, setEingabe] = useState<PlanerEingabe>(INITIAL);
  const [activeTab, setActiveTab] = useState<string>(KATEGORIEN_LISTE[0] || 'IT & Technik');

  const isUnlocked = isStarter || isPro || isExecutive;
  const ergebnis = berechnePlaner(eingabe);

  // Kategorie-Berechtigung prüfen
  const canAccessCategory = (cat: string) => {
    if (isExecutive || isPro) return true;
    if (isStarter && STARTER_KATEGORIEN.has(cat)) return true;
    if (!isUnlocked && FREE_PREVIEW_KATEGORIEN.has(cat)) return true;
    return false;
  };

  const isCurrentTabLocked = !canAccessCategory(activeTab);

  // CSV-Export für Executive
  const handleExportCsv = () => {
    if (!isExecutive) return;
    const activeExpenses = eingabe.ausgaben.map(a => {
      const p = ALLE_STEUERPOSTEN.find(sp => sp.id === a.postenId);
      return {
        titel: p?.titel || a.postenId,
        kategorie: p?.kategorie || 'Allgemein',
        betrag: a.betrag,
        rechtsgrundlage: p?.rechtsgrundlage || 'EStG',
      };
    });

    const lines = [
      `"KONTOLAGE.DE — STEUERPLANUNG & ABSETZUNGS-DOSSIER 2026"`,
      `"Rechtliche Grundlage: EStG, KStG, GewStG — Stand 2026"`,
      `"Erstellt am";"${new Date().toLocaleDateString('de-DE')}"`,
      ``,
      `"ERGEBNIS-ÜBERSICHT"`,
      `"Gesamtsteuer ohne Maßnahmen";"${fmt(ergebnis.gesamtsteuerOhneMassnahmen)} €"`,
      `"Gesamtsteuer mit Maßnahmen";"${fmt(ergebnis.gesamtsteuerMitMassnahmen)} €"`,
      `"Berechnete Steuerersparnis";"${fmt(ergebnis.steuerersparnis)} €"`,
      `"Netto nach Steuern";"${fmt(ergebnis.nettoGewinn)} €"`,
      ``,
      `"GEPLANTE ABSETZBARE POSTEN";"KATEGORIE";"BETRAG (EUR)";"RECHTSGRUNDLAGE"`,
      ...activeExpenses.map(p => `"${p.titel}";"${p.kategorie}";"${p.betrag}";"${p.rechtsgrundlage}"`),
    ];

    triggerCsvDownload(`Kontolage_Steuerplanung_2026_${Date.now()}.csv`, lines.join('\r\n'));
  };

  return (
    <>
      {/* ── Page Header / Hero mit ausreichendem Abstand zur Navbar (P1-03) ── */}
      <section style={{
        paddingTop: 120,
        paddingBottom: 56,
        padding: '120px 20px 56px',
        background: 'linear-gradient(180deg, rgba(48,68,104,0.18) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 1, background: '#c9a84c' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a84c' }}>
                Was-wäre-wenn-Simulation 2026
              </span>
            </div>

            {/* Status-Badge je nach Mitgliedschaft */}
            <div>
              {loading ? (
                <span style={{ fontSize: 12, color: '#a89f94' }}>Prüfe Mitgliedschaft…</span>
              ) : isExecutive ? (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#0C1825', background: 'linear-gradient(135deg, #c9a84c, #e2c27d)', padding: '4px 12px', borderRadius: 20, letterSpacing: '0.04em' }}>
                  👑 Executive B2B · Vollzugriff Aktiv
                </span>
              ) : isPro ? (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#e2c27d', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)', padding: '4px 12px', borderRadius: 20 }}>
                  ⚡ Pro Digital · Alle 34+ Posten Aktiv
                </span>
              ) : isStarter ? (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: '#86efac', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 12px', borderRadius: 20 }}>
                  ✨ Starter-Mitglied · Privatbereich Aktiv
                </span>
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: '#e2c27d', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', padding: '4px 12px', borderRadius: 20 }}>
                  🔒 Vorschau-Modus · Freischalten ab 5,83 €/Monat
                </span>
              )}
            </div>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, color: '#f0ece4', marginBottom: 16, letterSpacing: '-0.025em' }}>
            Steuerplaner Pro — Interaktive Absetzungs-Datenbank
          </h1>
          <p style={{ fontSize: 16, color: '#a89f94', maxWidth: 760, lineHeight: 1.75 }}>
            Simulieren Sie geplante Anschaffungen, Betriebsausgaben, GWG-Sofortabschreibungen bis 800 €, Homeoffice-Pauschale und Altersvorsorgeaufwendungen in Deutschland 2026. Berechnen Sie direkt Ihre effektive Steuerersparnis nach EStG, KStG und GewStG.
          </p>
        </div>
      </section>

      {/* ── Hauptbereich mit Filtern, Rechner & Paywall-Gating ── */}
      <section style={{ padding: '48px 20px 88px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Basis-Eingaben (Gewinn / Gehalt) */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(20,30,50,0.65), rgba(15,22,38,0.8))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: 24,
            marginBottom: 32,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#f0ece4', margin: 0 }}>
                1. Ihre wirtschaftlichen Basis-Parameter (2026)
              </h2>
              <span style={{ fontSize: 12, color: '#c9a84c' }}>Alle Daten bleiben 100% lokal in Ihrem Browser</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Familienstand</span>
                <select
                  value={eingabe.familienstand}
                  onChange={e => setEingabe({ ...eingabe, familienstand: e.target.value as any })}
                  style={{ width: '100%', padding: '10px 12px', background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4', fontSize: 13 }}
                >
                  <option value="ledig">Ledig / Grundtabelle</option>
                  <option value="verheiratet">Verheiratet / Splitting</option>
                </select>
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Gewinn vor Steuern / Einkommen (€)</span>
                <input
                  type="number"
                  step={1000}
                  value={eingabe.gewinnGewerblich || ''}
                  onChange={e => setEingabe({ ...eingabe, gewinnGewerblich: Number(e.target.value) || 0, gmbhGewinn: Number(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px 12px', background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4', fontSize: 13 }}
                />
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Rürup / Basisrente p.a. (€)</span>
                <input
                  type="number"
                  step={500}
                  value={eingabe.ruerup || ''}
                  onChange={e => setEingabe({ ...eingabe, ruerup: Number(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px 12px', background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4', fontSize: 13 }}
                />
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', fontSize: 11, color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Kapitalerträge p.a. (€)</span>
                <input
                  type="number"
                  step={500}
                  value={eingabe.kapitalerträge || ''}
                  onChange={e => setEingabe({ ...eingabe, kapitalerträge: Number(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px 12px', background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4', fontSize: 13 }}
                />
              </label>
            </div>
          </div>

          {/* Banner für Nicht-Abonnenten */}
          {!isUnlocked && (
            <div style={{
              background: 'linear-gradient(145deg, rgba(30,55,105,0.85), rgba(20,32,58,0.95))',
              border: '2px solid #c9a84c',
              borderRadius: 12,
              padding: '24px 28px',
              marginBottom: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
              boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
            }}>
              <div style={{ maxWidth: 720 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Vorschau-Modus aktiv
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#f0ece4', margin: '0 0 8px 0' }}>
                  Schalten Sie alle 34+ Posten, Szenarien &amp; Exporte frei
                </h3>
                <p style={{ fontSize: 13, color: '#cdc6be', lineHeight: 1.6, margin: 0 }}>
                  In dieser Vorschau können Sie die Posten aus IT &amp; Werbungskosten testen. Für den vollen Zugriff auf Gewerbe, Mobilität, Büro und den PDF/CSV-Export wählen Sie eine flexible Mitgliedschaft — monatlich kündbar, ohne Provisionen.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  to="/abo"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #c9a84c, #e2c27d)',
                    color: '#0C1825',
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Tarif wählen (ab 5,83 €) →
                </Link>
                <Link
                  to="/kabinett"
                  style={{
                    padding: '12px 20px',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#f0ece4',
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  Anmelden
                </Link>
              </div>
            </div>
          )}

          {/* Kategorien-Auswahl Tabs */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#f0ece4', margin: 0 }}>
                2. Absetzbare Posten nach Lebensbereich wählen
              </h2>
              <span style={{ fontSize: 12, color: '#a89f94' }}>
                {ALLE_STEUERPOSTEN.length} erfasste Steuerposten (EStG/GewStG/KStG)
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10 }}>
              {KATEGORIEN_LISTE.map(k => {
                const accessible = canAccessCategory(k);
                const isCurrent = activeTab === k;
                return (
                  <button
                    key={k}
                    onClick={() => setActiveTab(k)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: '1px solid',
                      borderColor: isCurrent ? '#c9a84c' : 'rgba(255,255,255,0.08)',
                      background: isCurrent ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.02)',
                      color: isCurrent ? '#e2c27d' : accessible ? '#cdc6be' : '#6b7280',
                      fontSize: 13,
                      fontWeight: isCurrent ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {!accessible && <span style={{ fontSize: 12 }}>🔒</span>}
                    {k}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posten-Eingabe ODER Paywall-Lock */}
          {isCurrentTabLocked ? (
            <div style={{
              background: 'linear-gradient(145deg, rgba(20,30,50,0.7), rgba(15,22,38,0.85))',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 14,
              padding: '48px 24px',
              textAlign: 'center',
              marginBottom: 32,
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Kategorie „{activeTab}“ gesperrt
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#f0ece4', marginBottom: 12 }}>
                Dieser Bereich erfordert ein aktives Abonnement
              </h3>
              <p style={{ fontSize: 14, color: '#a89f94', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.7 }}>
                Erhalten Sie uneingeschränkten Zugriff auf alle detaillierten Abzugsposten, amtliche AfA-Tabellen, GWG-Freibeträge und Steuerberater-Exporte.
              </p>
              <Link
                to="/abo"
                style={{
                  padding: '12px 28px',
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #c9a84c, #e2c27d)',
                  color: '#0C1825',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Jetzt freischalten (ab 5,83 €/Monat) →
              </Link>
            </div>
          ) : (
            <SteuerplanerPostenEingabe eingabe={eingabe} setEingabe={setEingabe} activeTab={activeTab} />
          )}

          {/* Ergebnis-Sektion */}
          <div style={{ marginTop: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#f0ece4', margin: 0 }}>
                3. Steuerliche Auswertung &amp; Ersparnis (2026)
              </h2>

              <div style={{ display: 'flex', gap: 10 }}>
                {/* PDF Drucken (Pro & Executive) */}
                {isPro || isExecutive ? (
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#f0ece4',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🖨️ PDF-Dossier drucken
                  </button>
                ) : null}

                {/* CSV Export (Executive B2B) */}
                {isExecutive ? (
                  <button
                    onClick={handleExportCsv}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: '1px solid rgba(201,168,76,0.3)',
                      background: 'rgba(201,168,76,0.12)',
                      color: '#e2c27d',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    📊 CSV für Steuerberater
                  </button>
                ) : (
                  <Link
                    to="/abo"
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#8d857a',
                      fontSize: 12,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    👑 CSV-Export (Executive 34,51 €)
                  </Link>
                )}
              </div>
            </div>

            <SteuerplanerErgebnis ergebnis={ergebnis} eingabe={eingabe} />
          </div>

          {/* Smart-Empfehlungen */}
          <div style={{ marginTop: 24 }}>
            <SteuerplanerSmart eingabe={eingabe} ergebnis={ergebnis} />
          </div>

          {/* B2B / Holding Vergleichs-Teaser für Nicht-Executive */}
          {!isExecutive && (
            <div style={{
              background: 'linear-gradient(145deg, rgba(20,30,50,0.6), rgba(15,22,38,0.75))',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 12,
              padding: 24,
              marginTop: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', marginBottom: 4 }}>
                  👑 Executive B2B Simulator &amp; ELSTER
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#f0ece4', marginBottom: 4 }}>
                  Holding-Rechner (§ 8b KStG), Mustersatzungen &amp; Vorlagen für den Steuerberater
                </div>
                <p style={{ fontSize: 13, color: '#a89f94', margin: 0, maxWidth: 640 }}>
                  Im Tarif Executive B2B (34,51 €/Monat inkl. 19 % MwSt., 29 € netto) erhalten Sie zusätzlich das 20-Jahres-Holding-Thesaurierungsmodell und fertige ELSTER-Muster.
                </p>
              </div>
              <Link
                to="/abo"
                style={{
                  padding: '10px 20px',
                  borderRadius: 6,
                  background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: '#e2c27d',
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Executive ansehen →
              </Link>
            </div>
          )}

          {/* Rechtlicher Hinweis (WpHG & StBerG) */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 48, paddingTop: 24, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
            <strong>Rechtlicher Hinweis (§ 2 Abs. 8 Nr. 10 WpHG):</strong> Die bereitgestellten Berechnungen, Tabellen und Simulationen dienen ausschließlich der neutralen Finanzbildung und veranschaulichen das deutsche Steuerrecht 2026. Sie stellen keine individuelle steuerliche Beratung i.S.d. Steuerberatungsgesetzes (StBerG) und keine Anlageberatung dar. Für verbindliche steuerliche Erklärungen und Abschlüsse wenden Sie sich bitte an eine Steuerberaterin oder einen Steuerberater.
          </div>

        </div>
      </section>
    </>
  );
}