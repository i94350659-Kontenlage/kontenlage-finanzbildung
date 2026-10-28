// Steuerplaner — Was-wäre-wenn-Rechner (Lead-Magnet Pro/Executive)
import { useState } from 'react';
import { vergleicheSzenarien, type SteuerplanerInput } from '../lib/steuerplaner-calc';
import SteuerplanerForm from '../components/SteuerplanerForm';
import SteuerplanerErgebnis from '../components/SteuerplanerErgebnis';
import SteuerplanerSmart from '../components/SteuerplanerSmart';
import SteuerplanerLead from '../components/SteuerplanerLead';

export default function Steuerplaner() {
  const [input, setInput] = useState<SteuerplanerInput>({
    familienstand: 'ledig',
    kinder: 0,
    gewinnVorSteuern: 60000,
    gmbhGewinnVorSteuern: 60000,
    gggGehalt: 45000,
    itAnschaffung: 1200,
    solarAnschaffung: 0,
    bueroMoebel: 0,
    sonstigeBetriebsausgaben: 5000,
    ruerupEinzahlung: 0,
    kapitalErtraege: 0,
  });
  const vergleich = vergleicheSzenarien(input);
  return (
    <section style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#c9a84c' }}>Steuerplaner — Was-wäre-wenn-Rechner</h1>
      <p style={{ color: '#a89f94', fontSize: 14 }}>
        Finanzbildung gemäß § 2 Abs. 8 Nr. 10 WpHG. Keine Steuerberatung. Werte sind Näherungswerte für Deutschland 2026.
      </p>
      <SteuerplanerForm input={input} onChange={setInput} />
      <SteuerplanerErgebnis vergleich={vergleich} />
      <SteuerplanerSmart input={input} />
      <SteuerplanerLead />
      <p style={{ fontSize: 11, color: '#64748B', marginTop: 24, lineHeight: 1.5 }}>
        § 2 Abs. 8 Nr. 10 WpHG: Dies ist reine Finanzbildung ohne individuelle Empfehlung. Für verbindliche Steuerentscheidungen konsultiere einen Steuerberater.
      </p>
    </section>
  );
}