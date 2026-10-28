// Steuerplaner — Posten-Eingabe für eine Kategorie
import { ALLE_STEUERPOSTEN, type SteuerPosten } from '../lib/steuerposten-index';
import type { PlanerEingabe } from '../lib/steuerplaner-pro';

export default function SteuerplanerPostenEingabe({
  eingabe,
  setEingabe,
  activeTab,
}: {
  eingabe: PlanerEingabe;
  setEingabe: (v: PlanerEingabe) => void;
  activeTab: string;
}) {
  const posten = ALLE_STEUERPOSTEN.filter(p => p.kategorie === activeTab);

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(20,30,50,0.65), rgba(15,22,38,0.8))',
      borderRadius: 14,
      border: '1px solid rgba(255,255,255,0.08)',
      padding: 24,
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#f0ece4', margin: 0 }}>
          Kategorie: {activeTab}
        </h3>
        <span style={{ fontSize: 12, color: '#a89f94' }}>
          {posten.length} Posten verfügbar · Betrag eintragen um Ersparnis live zu berechnen
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {posten.map(p => (
          <PostenBlock key={p.id} p={p} eingabe={eingabe} setEingabe={setEingabe} />
        ))}
      </div>
    </div>
  );
}

function PostenBlock({ p, eingabe, setEingabe }: { p: SteuerPosten; eingabe: PlanerEingabe; setEingabe: (v: PlanerEingabe) => void }) {
  const existing = eingabe.ausgaben.find((a: any) => a.postenId === p.id);
  const betrag = existing?.betrag || 0;
  const anteil = existing?.anteilProzent;
  const showAnteil = p.anteilsschätzungErlaubt;

  const setBetrag = (val: number) => {
    setEingabe({
      ...eingabe,
      ausgaben: eingabe.ausgaben.filter((a: any) => a.postenId !== p.id).concat({ postenId: p.id, betrag: val, anteilProzent: anteil }),
    });
  };

  const setAnteil = (val: number) => {
    setEingabe({
      ...eingabe,
      ausgaben: eingabe.ausgaben.filter((a: any) => a.postenId !== p.id).concat({ postenId: p.id, betrag: existing?.betrag || 0, anteilProzent: val }),
    });
  };

  const badgeColor =
    p.betragsTyp === 'nach_nutzungsdauer' ? '#93c5fd'
    : p.betragsTyp === 'pauschale_pro_tag' ? '#86efac'
    : '#e2c27d';

  return (
    <div style={{
      background: betrag > 0 ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
      borderRadius: 10,
      padding: 16,
      border: betrag > 0 ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'border-color 0.2s',
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f0ece4', lineHeight: 1.35 }}>
            {p.titel}
          </div>
          <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: badgeColor,
            background: 'rgba(255,255,255,0.06)',
            padding: '2px 7px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
          }}>
            {p.betragsTyp === 'nach_nutzungsdauer' ? 'AfA' : p.betragsTyp === 'pauschale_pro_tag' ? 'Pauschale' : 'Sofort-GWG'}
          </span>
        </div>

        <p style={{ fontSize: 12, color: '#a89f94', lineHeight: 1.55, margin: '0 0 8px 0' }}>
          {p.beschreibung}
        </p>

        <div style={{ fontSize: 11, color: '#c9a84c', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
          {p.rechtsgrundlage}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 10, color: '#a89f94', marginBottom: 4, textTransform: 'uppercase' }}>
              Geplanter Betrag (€)
            </label>
            <input
              type="number"
              placeholder="0 €"
              value={betrag || ''}
              onChange={e => setBetrag(Number(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '8px 10px',
                background: '#0b1220',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                color: '#f0ece4',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>

          {showAnteil && (
            <div style={{ width: 110 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#a89f94', marginBottom: 4, textTransform: 'uppercase' }}>
                Betrieblich %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="100%"
                value={anteil || ''}
                onChange={e => setAnteil(Number(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: '#0b1220',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  color: '#f0ece4',
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
          )}
        </div>

        {p.smartTipp && (
          <div style={{ marginTop: 10, fontSize: 11, color: '#e2c27d', background: 'rgba(201,168,76,0.08)', padding: '6px 10px', borderRadius: 4, lineHeight: 1.45 }}>
            💡 {p.smartTipp}
          </div>
        )}
      </div>
    </div>
  );
}