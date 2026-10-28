// Steuerplaner — Formular-Komponente
import { useState } from 'react';
import type { SteuerplanerInput } from '../lib/steuerplaner-calc';
export default function SteuerplanerForm({ input, onChange }: { input: SteuerplanerInput; onChange: (v: SteuerplanerInput) => void }) {
  const inp = (k: keyof SteuerplanerInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target.type === 'number' ? Number(e.target.value) || 0 : e.target.value;
    onChange({ ...input, [k]: v as any });
  };
  return (
    <div style={{ background: '#0f172a', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
      <h3 style={{ marginTop: 0, color: '#c9a84c', fontSize: 14 }}>Ihre Situation</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#cdc6be', marginBottom: 6 }}>Familienstand</label>
          <select style={{ width: '100%', padding: 8, background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4' }}
            onChange={inp('familienstand') as any} value={input.familienstand}>
            <option value="ledig">Ledig</option>
            <option value="verheiratet">Verheiratet</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#cdc6be', marginBottom: 6 }}>Jahresgewinn vor Steuern (€)</label>
          <input type="number" style={{ width: '100%', padding: 8, background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4' }}
            onChange={inp('gewinnVorSteuern')} value={input.gewinnVorSteuern} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#cdc6be', marginBottom: 6 }}>Rürup-Einzahlung (€)</label>
          <input type="number" style={{ width: '100%', padding: 8, background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4' }}
            onChange={inp('ruerupEinzahlung')} value={input.ruerupEinzahlung} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#cdc6be', marginBottom: 6 }}>IT-Anschaffung (€)</label>
          <input type="number" style={{ width: '100%', padding: 8, background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4' }}
            onChange={inp('itAnschaffung')} value={input.itAnschaffung} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#cdc6be', marginBottom: 6 }}>Solarstation (€)</label>
          <input type="number" style={{ width: '100%', padding: 8, background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4' }}
            onChange={inp('solarAnschaffung')} value={input.solarAnschaffung} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#cdc6be', marginBottom: 6 }}>Kapitalerträge (€)</label>
          <input type="number" style={{ width: '100%', padding: 8, background: '#0b1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#f0ece4' }}
            onChange={inp('kapitalErtraege')} value={input.kapitalErtraege} />
        </div>
      </div>
    </div>
  );
}