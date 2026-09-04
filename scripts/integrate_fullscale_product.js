const fs = require('fs');
const path = require('path');

const rootDir = 'G:/Scratch´nTravel';
const appSrcDir = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src';

// 1. vercel.json
const vercelConfig = {
  version: 2,
  name: "scratch-n-travel",
  cleanUrls: true,
  trailingSlash: false,
  buildCommand: "cd \"AusbauÜberlegungen/Website analysis and badge creation\" && npm install && npm run build",
  outputDirectory: "AusbauÜberlegungen/Website analysis and badge creation/dist",
  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-XSS-Protection", value: "1; mode=block" }
      ]
    }
  ],
  functions: {
    "api/create-checkout-session.js": { maxDuration: 10 },
    "api/create-merch-checkout-session.js": { maxDuration: 10 },
    "api/stripe-webhook.js": { maxDuration: 30 },
    "api/hermes-concierge.js": { maxDuration: 20 },
    "api/pod-orders.js": { maxDuration: 15 }
  },
  rewrites: [
    { source: "/api/create-checkout-session", destination: "/api/create-checkout-session.js" },
    { source: "/api/create-merch-checkout-session", destination: "/api/create-merch-checkout-session.js" },
    { source: "/api/stripe-webhook", destination: "/api/stripe-webhook.js" },
    { source: "/api/hermes-concierge", destination: "/api/hermes-concierge.js" },
    { source: "/api/pod-orders", destination: "/api/pod-orders.js" },
    { source: "/(.*)", destination: "/index.html" }
  ]
};

fs.writeFileSync(path.join(rootDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2), 'utf8');
console.log('vercel.json updated successfully!');

// 2. Pricing.tsx
const pricingCode = `import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function Pricing() {
  const { user, triggerHaptic } = useTravel()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const plans = [
    {
      id: 'free',
      name: 'Explorer Free',
      badge: 'STARTER',
      price: '€0',
      period: 'dauerhaft kostenlos',
      desc: 'Perfekt für spontane Trips, um erste Geheimtipps freizurubbeln.',
      features: [
        '3 GPS-Secrets pro Monat freirubbeln',
        'Digitaler Reisepass mit Basis-Stempeln',
        'Zugriff auf Hazard & Scam Radar',
        '2 AI Concierge Anfragen pro Tag',
        '1-Klick Google Kalender & GPX Export',
      ],
      cta: 'Kostenlos starten',
      primary: false,
    },
    {
      id: 'pro',
      name: 'Explorer Pro',
      badge: 'BELIEBTESTE WAHL',
      price: billingCycle === 'yearly' ? '€7,50' : '€9,00',
      period: billingCycle === 'yearly' ? 'pro Monat (jährlich €90)' : 'pro Monat',
      priceId: 'price_1P_mock_pro_monthly',
      desc: 'Für passionierte Weltenbummler, die abseits ausgetretener Pfade reisen.',
      features: [
        'Unbegrenzt GPS-Secrets freirubbeln',
        'Alle 460+ Master-Badges & Sammlungen',
        '130-Hobby DNA Matching mit Locals',
        '25% Rabatt auf alle Merch-Bestellungen',
        'Unbegrenzter AI Travel Concierge',
        'City Quests & exklusive Belohnungen',
      ],
      cta: 'Pro Mitglied werden →',
      primary: true,
    },
    {
      id: 'family_pet',
      name: 'Family & Pet VIP',
      badge: 'FAMILIE & HUND',
      price: billingCycle === 'yearly' ? '€24,00' : '€29,00',
      period: billingCycle === 'yearly' ? 'pro Monat (jährlich €288)' : 'pro Monat',
      priceId: 'price_1P_mock_vip_monthly',
      desc: 'Komplettpaket für Familien und Reisende mit Hund.',
      features: [
        'Alles aus Pro inklusive',
        'Hundefreundliche Filter & Tierarzt-Notfallnetz',
        'Kinderwagen- und barrierefreie Routen',
        'Direkte B2B Tisch- & Platzreservierung (0% Fee)',
        'Monatliche limitierte Sammler-Badges frei Haus',
        'Prioritärer Concierge WhatsApp Support',
      ],
      cta: 'VIP Family & Pet starten →',
      primary: false,
    },
  ]

  const handleCheckout = async (plan: typeof plans[0]) => {
    triggerHaptic(20)
    if (plan.id === 'free') {
      alert('Du bist bereits auf dem Explorer Free Plan angemeldet!')
      return
    }

    setLoadingPlan(plan.id)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          customerEmail: 'maria@wanderer.eu',
          successUrl: window.location.origin + '/passport?checkout=success',
          cancelUrl: window.location.origin + '/pricing',
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Stripe Checkout für " + plan.name + " (" + plan.price + ") wird simuliert. Keine Plattformgebühren!")
      }
    } catch (e) {
      alert("Stripe Checkout für " + plan.name + " (" + plan.price + ") initialisiert (Test-Modus).")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Echte Erlebnisse · Transparente Preise · Keine versteckten Kosten</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Mitgliedschaften & Pläne</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">invest in your wanderlust</p>
      </div>

      <div className="p-6 space-y-8 pb-24 md:pb-8">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1 bg-[#152539] border border-[rgba(201,168,76,0.2)] rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={"btn text-xs py-1.5 px-4 rounded-full " + (billingCycle === 'monthly' ? 'btn-primary' : 'bg-transparent text-[#8A9AAA]')}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={"btn text-xs py-1.5 px-4 rounded-full " + (billingCycle === 'yearly' ? 'btn-primary' : 'bg-transparent text-[#8A9AAA]')}
            >
              Jährlich <span className="text-[0.62rem] text-emerald-900 bg-emerald-300 font-bold px-1.5 py-0.2 rounded-full ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map(p => (
            <div
              key={p.id}
              className={"card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.02] " + (
                p.primary
                  ? 'border-[#C9A84C] shadow-[0_0_35px_rgba(201,168,76,0.15)] bg-gradient-to-b from-[#1D3454] to-[#152539]'
                  : 'border-[rgba(201,168,76,0.2)]'
              )}
            >
              {p.badge && (
                <span
                  className={"absolute top-3 right-3 font-mono text-[0.58rem] font-bold px-2.5 py-0.5 rounded-full " + (
                    p.primary ? 'shimmer-anim text-[#0C1825]' : 'bg-[#0C1825] text-[#C9A84C] border border-[#C9A84C]/30'
                  )}
                >
                  {p.badge}
                </span>
              )}

              <div>
                <h3 className="font-display text-[#F4E4C1] text-xl font-bold mb-1">{p.name}</h3>
                <p className="font-body text-[#8A9AAA] text-xs mb-4 min-h-[32px]">{p.desc}</p>

                <div className="mb-6 pb-4 border-b border-[rgba(201,168,76,0.15)]">
                  <span className="font-display text-3xl font-black text-[#C9A84C]">{p.price}</span>
                  <span className="font-mono text-xs text-[#8A9AAA] ml-2">/ {p.period}</span>
                </div>

                <div className="space-y-2.5 mb-6">
                  {p.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs font-body text-[#F4E4C1]">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCheckout(p)}
                disabled={loadingPlan === p.id}
                className={"btn w-full py-3 text-xs " + (p.primary ? 'btn-primary font-bold shadow-lg' : 'btn-secondary')}
              >
                {loadingPlan === p.id ? 'Wird geladen…' : p.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="parchment rounded-xl p-6 max-w-4xl mx-auto text-center border border-[rgba(139,58,42,0.2)] shadow-md">
          <p className="font-script text-2xl text-[#8B3A2A] mb-1">100% BaFin- und DSGVO-konform</p>
          <p className="font-body text-[#2C1810] text-sm max-w-xl mx-auto">
            Keine Weitergabe deiner Reisedaten. Jederzeit monatlich kündbar mit einem Klick im Kundenportal. Sichere Verschlüsselung via Stripe & Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(appSrcDir, 'pages/Pricing.tsx'), pricingCode, 'utf8');
console.log('Pricing.tsx written successfully!');

// 3. Login.tsx
const loginCode = `import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function Login() {
  const navigate = useNavigate()
  const { user, triggerHaptic } = useTravel()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    triggerHaptic(15)
    setSent(true)
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    triggerHaptic([30, 60])
    navigate('/passport')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 pb-24 md:pb-8">
      <div className="card w-full max-w-md p-8 border-[rgba(201,168,76,0.3)] shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🧭</span>
          <h1 className="font-display text-2xl font-bold text-[#F4E4C1]">Explorer Login</h1>
          <p className="font-script text-[rgba(201,168,76,0.5)] text-base">access your digital travel passport</p>
        </div>

        {sent ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-[#0C1825] rounded-xl p-4 border border-emerald-500/30 text-center">
              <span className="text-2xl block mb-1">✉️</span>
              <p className="font-body text-emerald-400 text-sm font-semibold">Magic Link / Code gesendet!</p>
              <p className="font-mono text-[0.62rem] text-[#8A9AAA] mt-1">an {email}</p>
            </div>

            <div>
              <label className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                6-stelliger Bestätigungscode (Demo-Code: 123456)
              </label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                className="field text-center font-mono tracking-widest text-lg"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold">
              Bestätigen & Einloggen →
            </button>

            <button type="button" onClick={() => setSent(false)} className="btn btn-ghost w-full text-xs py-2">
              ← Andere E-Mail verwenden
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <label className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                Deine E-Mail Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="explorer@wanderer.eu"
                className="field"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold">
              Passwortlosen Login-Link senden →
            </button>

            <div className="section-divider my-4">
              <span className="font-mono text-[0.58rem] tracking-widest">ODER</span>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(10)
                navigate('/passport')
              }}
              className="btn btn-secondary w-full py-2.5 text-xs"
            >
              🚀 Als Gast ({user.name}) fortfahren
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(appSrcDir, 'pages/Login.tsx'), loginCode, 'utf8');
console.log('Login.tsx written successfully!');
