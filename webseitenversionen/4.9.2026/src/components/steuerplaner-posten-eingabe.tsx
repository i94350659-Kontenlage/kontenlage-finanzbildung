// Steuerplaner — Posten-Eingabe für eine Kategorie
import { useState } from 'react';
import { ALLE_STEUERPOSTEN, SteuerPosten } from '../lib/steuerposten-index';
import type { PlanerEingabe } from '../lib/steuerplaner-pro';
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');

export default function SteuerplanerPostenEingabe({ eingabe, setEingabe, activeTab }: { eingabe: PlanerEingabe; setEingabe: (v: PlanerEingabe) => void; activeTab: string }) {
  const posten = ALLE_STEUERPOSTEN.filter(p => p.kategorie === activeTab);
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 20, marginBottom: 24 }}>
      <h2 style={{ marginTop: 0, color: '#c9a84c', fontSize: 16 }}>{activeTab}</h2>
      <p style={{ color: '#a89f94', fontSize: 12, marginBottom: 14 }}>Wählen Sie die Posten aus, die Sie planen oder getätigt haben.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {posten.map(p => <PostenBlock key={p.id} p={p} eingabe={eingabe} setEingabe={setEingabe} />)}
      </div>
    </div>
  );
}

function PostenBlock({ p, eingabe, setEingabe }: { p: SteuerPosten; eingabe: any; setEingabe: any }) {
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

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece4' }}>{p.titel}</div>
        <div style={{ fontSize: 10, color: '#c9a84c', background: 'rgba(201,168,76,0.1)', padding: '2px 6px', borderRadius: 4 }}>
          {p.betragsTyp === 'nach_nutzungsdauer' ? 'AfA' : p.betragsTyp === 'pauschale_pro_tag' ? 'Pauschale' : 'Sofort'}
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#a89f94', marginBottom: 8 }}>{p.beschreibung}</div>
      <div style={{ fontSize: 11, color: '#a89f94', marginBottom: 8 }}>{p.rechtsgrundlage}</div>
      <input
        type="number"
        placeholder="Betrag €"
        value={betrag || ''}
        onChange={e => setBetrag(Number(e.target.value) || 0)}
        style={{ width: '100%', padding: '6px 8px', background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: '#f0ece4', fontSize: 12 }}
      />
      {showAnteil && (
        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: 10, color: '#a89f94', display: 'block', marginBottom: 4 }}>Betriebliche Nutzung (%)</label>
          <input
            type="number" min="0" max="100"
            value={anteil || ''}
            onChange={e => setAnteil(Number(e.target.value) || 0)}
            style={{ width: '100%', padding: '6px 8px', background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: '#f0ece4', fontSize: 12 }}
          />
        </div>
      )}
      <div style={{ marginTop: 6, fontSize: 10, color: '#c9a84c' }}>{p.smartTipp}</div>
      <div style={{ marginTop: 4, fontSize: 9, color: '#64748b' }}>{p.besteAnschaffungszeit}</div>
    </div>
  );
}