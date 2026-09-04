const fs = require('fs');
const path = require('path');
const srcDir = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src';

// ─── 1. Tours.tsx ───
const toursCode = `import React, { useState } from 'react'
import { tours } from '../data/data'
import { createGoogleCalendarUrl } from '../utils/calendarExport'
import StoryGeneratorModal from '../components/StoryGeneratorModal'
import { useTravel } from '../context/TravelContext'

export default function Tours() {
  const { triggerHaptic } = useTravel()
  const [storyModal, setStoryModal] = useState<{
    isOpen: boolean
    title: string
    location: string
    gps: string
    xp: number
    image?: string
  }>({
    isOpen: false,
    title: '',
    location: '',
    gps: '',
    xp: 200,
  })

  const handleExportGPX = (t: typeof tours[0]) => {
    triggerHaptic(20)
    const gpxData = \`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Scratch'n'Travel - https://scratchntravel.com">
  <metadata>
    <name>\${t.title}</name>
    <desc>Created by \${t.creator} - Duration: \${t.duration}, Distance: \${t.distance}</desc>
  </metadata>
  <trk>
    <name>\${t.title}</name>
    <trkseg>
      <trkpt lat="38.7223" lon="-9.1393"><ele>50</ele><name>Start: Lisboa</name></trkpt>
      <trkpt lat="38.7950" lon="-9.4200"><ele>120</ele><name>Stop 2: Secret Viewpoint</name></trkpt>
      <trkpt lat="38.7900" lon="-9.4750"><ele>30</ele><name>Finish: Coastal Trail</name></trkpt>
    </trkseg>
  </trk>
</gpx>\`
    const blob = new Blob([gpxData], { type: 'application/gpx+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`scratchntravel-\${t.title.toLowerCase().replace(/\\s+/g, '-')}.gpx\`
    a.click()
  }

  const handleGoogleCalendar = (t: typeof tours[0]) => {
    triggerHaptic(15)
    const calUrl = createGoogleCalendarUrl({
      title: t.title,
      description: \`Wanderung / Tour: \${t.title}\\nErsteller: \${t.creator}\\nDistanz: \${t.distance} · Dauer: \${t.duration} · Beste Zeit: \${t.bestTime}\`,
      location: 'Portugal (Lisboa / Sintra / Ericeira)',
      durationHours: 3,
    })
    window.open(calUrl, '_blank')
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Walking Routes · 1-Click GPX for Komoot & Maps.me</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Community Tours & Routes</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">routes crafted by passionate local walkers</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {tours.map(tour => (
            <div key={tour.id} className="card overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-48">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                    {tour.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-[0.6rem] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.3)] text-[#C9A84C] px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="absolute top-3 right-3 font-mono text-[0.62rem] font-bold bg-emerald-500/90 text-white px-2.5 py-1 rounded-full shadow-md">
                    ★ {tour.rating} ({tour.reviews})
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-[#F4E4C1] text-lg font-bold mb-1">{tour.title}</h3>
                  <p className="font-body text-[#8A9AAA] text-sm mb-4">Erstellt von {tour.creator} · {tour.stops} Geheim-Stopps</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      ['📏 Distanz', tour.distance],
                      ['⏱ Dauer', tour.duration],
                      ['🏃 Niveau', tour.difficulty],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-[#0C1825] rounded-lg p-2.5 text-center border border-[rgba(201,168,76,0.15)]">
                        <p className="font-mono text-[0.58rem] text-[#8A9AAA]">{l}</p>
                        <p className="font-display text-[#F4E4C1] font-bold text-xs">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex flex-wrap gap-2">
                <button onClick={() => handleExportGPX(tour)} className="btn btn-primary flex-1 text-xs py-2">
                  🗺️ GPX Export (Komoot)
                </button>
                <button onClick={() => handleGoogleCalendar(tour)} className="btn btn-secondary flex-1 text-xs py-2">
                  📅 In Google Kalender
                </button>
                <button
                  onClick={() =>
                    setStoryModal({
                      isOpen: true,
                      title: tour.title,
                      location: \`\${tour.distance} · \${tour.duration}\`,
                      gps: "38°47'24\\"N · 9°23'21\\"W",
                      xp: 250,
                      image: tour.image,
                    })
                  }
                  className="btn btn-ghost text-xs py-2"
                >
                  📲 Story Card
                </button>
              </div>
            </div>
          ))}
        </div>

        <StoryGeneratorModal
          isOpen={storyModal.isOpen}
          onClose={() => setStoryModal(p => ({ ...p, isOpen: false }))}
          data={storyModal}
        />
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Tours.tsx'), toursCode, 'utf8');
console.log('Tours.tsx updated');

// ─── 2. Host.tsx ───
const hostCode = `import React, { useState } from 'react'
import { cities, businessCategories } from '../data/data'
import { useTravel } from '../context/TravelContext'

export default function Host() {
  const { reservations, triggerHaptic } = useTravel()
  const [applied, setApplied] = useState(false)
  const [form, setForm] = useState({
    business: '',
    category: businessCategories[0],
    city: 'Lisbon',
    email: '',
    desc: '',
  })

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">B2B Partner Programme · Flat Fee · 0% Commission</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">B2B Host Portal</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">list your business — keep 100% of your revenue</p>
      </div>

      <div className="p-6 space-y-8 pb-24 md:pb-8">
        {/* INBOUND RESERVATIONS MANAGER */}
        <div className="card p-6 border-[rgba(201,168,76,0.3)] shadow-2xl">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <span className="font-mono text-[0.62rem] text-emerald-400 font-bold uppercase tracking-widest">
                ● Live Host Dashboard
              </span>
              <h2 className="font-display text-[#F4E4C1] text-xl font-bold">Eingehende Reservierungen & Anfragen</h2>
            </div>
            <span className="font-mono text-[0.65rem] bg-[rgba(201,168,76,0.15)] text-[#C9A84C] px-3 py-1 rounded-full border border-[rgba(201,168,76,0.3)]">
              {reservations.length} Buchungen aktiv
            </span>
          </div>

          <div className="space-y-3">
            {reservations.map(res => (
              <div
                key={res.id}
                className="bg-[#0C1825] rounded-xl p-4 border border-[rgba(201,168,76,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-[#C9A84C] font-bold text-sm">{res.guestName}</span>
                    <span className="font-mono text-[0.6rem] text-[#8A9AAA]">({res.email})</span>
                    <span
                      className={\`font-mono text-[0.58rem] font-bold px-2 py-0.5 rounded-full \${
                        res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                      }\`}
                    >
                      {res.status === 'confirmed' ? 'BESTÄTIGT' : 'OFFEN'}
                    </span>
                  </div>
                  <p className="font-body text-[#F4E4C1] text-sm">
                    <strong>{res.guests} Plätze</strong> für <em>{res.hostBusiness}</em> am{' '}
                    <strong>{res.date} um {res.time} Uhr</strong>
                  </p>
                  {res.notes && <p className="font-body text-xs text-[#8A9AAA] mt-1">Notiz: "{res.notes}"</p>}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      triggerHaptic(15)
                      alert(\`Buchung \${res.id} für \${res.guestName} bestätigt!\`)
                    }}
                    className="btn btn-primary text-xs py-1.5 px-3"
                  >
                    ✓ Bestätigen
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10)
                      alert(\`E-Mail an \${res.email} wird geöffnet.\`)
                    }}
                    className="btn btn-ghost text-xs py-1.5 px-3"
                  >
                    ✉️ Kontakt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HERO VALUE PROP */}
        <div className="parchment rounded-xl p-7 relative overflow-hidden shadow-xl border border-[rgba(139,58,42,0.2)]">
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            <div className="md:col-span-2">
              <p className="font-script text-2xl text-[#8B3A2A] mb-1">Nie wieder 15–20% Buchungsgebühren</p>
              <h2 className="font-display text-2xl text-[#2C1810] font-black mb-3">
                Monatliche Flat. 0% Provision. Deine Gäste, dein Gewinn.
              </h2>
              <p className="font-body text-[#2C1810] leading-relaxed mb-4">
                Scratch'n'Travel verbindet dich direkt mit qualitätsbewussten Reisenden, die authentische Erlebnisse suchen.
              </p>
              <button
                onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-parchment font-bold border-2 border-[#8B3A2A]"
              >
                Jetzt als Partner bewerben →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['€0', 'Provision', '0 % auf alle Buchungen'],
                ['Gold', 'Verified Badge', 'auf deinem Eintrag'],
                ['25%', 'Merch Rabatt', 'für deine Gäste'],
                ['100%', 'Gästekontakt', 'Direkte E-Mail & Chat'],
              ].map(([v, l, sub]) => (
                <div key={l} className="bg-[rgba(44,24,16,0.07)] rounded-xl p-3 text-center border border-[rgba(139,58,42,0.15)]">
                  <p className="font-display text-[#C9A84C] text-xl font-black">{v}</p>
                  <p className="font-display text-[#2C1810] text-xs font-bold">{l}</p>
                  <p className="font-mono text-[0.55rem] text-[#8B3A2A]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CITY SLOTS */}
        <div>
          <div className="section-divider mb-5">
            <span className="font-mono text-[0.68rem] tracking-widest">Verfügbare Städte-Slots</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map(c => (
              <div key={c.name} className="card p-4 flex items-center gap-4">
                <span className="text-2xl">{c.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-display text-[#F4E4C1] font-bold">{c.name}</p>
                    <span className="font-mono text-[0.58rem] border px-1.5 py-0.5 rounded-full text-[#C9A84C] border-[#C9A84C]/40">
                      {c.tier}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: c.total }).map((_, i) => (
                      <div
                        key={i}
                        className={\`h-2 flex-1 rounded-sm \${
                          i < c.taken ? 'bg-[rgba(201,168,76,0.2)]' : 'gold-gradient'
                        }\`}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-[0.62rem] text-[#8A9AAA]">
                    {c.total - c.taken > 0 ? (
                      <span className="text-emerald-400">{c.total - c.taken} freie Slots</span>
                    ) : (
                      <span className="text-red-400">Vollbelegt — Warteliste</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="apply-form" className="card p-6 border-[rgba(201,168,76,0.25)]">
          <h2 className="font-display text-[#C9A84C] text-xl font-bold mb-1">Als Host-Partner bewerben</h2>
          <p className="font-body text-[#8A9AAA] mb-6">Prüfung innerhalb von 48h. Begrenzte Städte-Kontingente.</p>

          {applied ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-4">🎉</p>
              <p className="font-display text-[#F4E4C1] text-2xl font-bold mb-2">Bewerbung eingegangen!</p>
              <p className="font-body text-[#8A9AAA] max-w-md mx-auto">
                Wir prüfen deine Angaben für <strong className="text-[#C9A84C]">{form.business}</strong> und melden uns unter{' '}
                <span className="text-[#C9A84C]">{form.email || 'deiner E-Mail'}</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Unternehmensname
                  </label>
                  <input
                    value={form.business}
                    onChange={e => setForm(p => ({ ...p, business: e.target.value }))}
                    className="field"
                    placeholder="z. B. Surf School Ericeira"
                  />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Kategorie
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="field"
                  >
                    {businessCategories.map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Stadt / Region
                  </label>
                  <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="field">
                    {cities.map(c => (
                      <option key={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Kontakt E-Mail
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="field"
                    placeholder="partner@business.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Kurzbeschreibung
                  </label>
                  <textarea
                    value={form.desc}
                    onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                    className="field h-24 resize-none"
                    placeholder="Was macht dein Angebot für authentische Reisende besonders?"
                  />
                </div>
              </div>

              <button onClick={() => setApplied(true)} className="btn btn-primary w-full py-3">
                Bewerbung jetzt einreichen ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Host.tsx'), hostCode, 'utf8');
console.log('Host.tsx updated');

// ─── 3. Profile.tsx ───
const profileCode = `import React from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { tierGradient } from '../data/allBadges'

export default function Profile() {
  const { user, badges, stamps, reservations } = useTravel()
  const unlockedBadges = badges.filter(b => b.unlocked)
  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Explorer since {user.joinDate}</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">My Profile & Legend</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">your journey, your luxury artefact</p>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* HERO PROFILE CARD */}
        <div className="card p-6 border-[rgba(201,168,76,0.25)] shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl gold-gradient flex items-center justify-center font-display font-black text-[#0C1825] text-3xl pulse-gold border-2 border-[#F4E4C1]">
                {user.initials}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#152539] flex items-center justify-center text-xs text-white font-bold">
                {user.level}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-display text-[#F4E4C1] text-2xl font-bold">{user.name}</h2>
                <span className="font-mono text-xs text-[#C9A84C] bg-[rgba(201,168,76,0.1)] px-2.5 py-0.5 rounded-full border border-[rgba(201,168,76,0.3)]">
                  {user.handle}
                </span>
              </div>
              <p className="font-mono text-[#C9A84C] text-sm mb-2">{user.rank}</p>
              <p className="font-body text-[#8A9AAA] text-sm mb-3 max-w-xl">{user.bio}</p>

              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[0.65rem] text-[#8A9AAA]">Progress to Rang {user.level + 1}</span>
                <span className="font-mono text-[0.65rem] text-[#C9A84C]">
                  {user.xp} / {user.xpNext} XP ({xpPct}%)
                </span>
              </div>
              <div className="xp-bar mb-4">
                <div className="xp-fill" style={{ width: \`\${xpPct}%\` }} />
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link to="/passport" className="btn btn-primary text-xs py-2">
                  🛂 Digitalen Reisepass öffnen
                </Link>
                <Link to="/scratch" className="btn btn-secondary text-xs py-2">
                  🪙 Rubbelkarten
                </Link>
                <Link to="/badges" className="btn btn-ghost text-xs py-2">
                  🏷️ 460+ Badges ({unlockedBadges.length} freigeschaltet)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* JOURNEY STATS GRID */}
        <div>
          <div className="section-divider mb-4">
            <span className="font-mono text-[0.68rem] tracking-widest">Reise-Statistiken</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'Länder', value: user.countriesCount, icon: '🌍' },
              { label: 'Stempel', value: stamps.length, icon: '🪙' },
              { label: 'Secrets', value: user.secretsCount, icon: '🔑' },
              { label: 'Badges', value: unlockedBadges.length, icon: '🏷️' },
              { label: 'Buchungen', value: reservations.length, icon: '🏢' },
              { label: 'Level', value: user.level, icon: '⭐' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="font-display text-[#C9A84C] text-2xl font-black">{s.value}</p>
                <p className="font-mono text-[0.6rem] text-[#8A9AAA] uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* EARNED BADGES PREVIEW */}
        <div>
          <div className="section-divider mb-4">
            <span className="font-mono text-[0.68rem] tracking-widest">Zuletzt errungene Badges ({unlockedBadges.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {unlockedBadges.slice(0, 12).map(b => (
              <div key={b.id} className="card p-3 text-center hover:scale-105 transition-transform" title={b.name}>
                <div
                  className="w-11 h-11 rounded-xl mx-auto mb-2 flex items-center justify-center text-2xl shadow-md"
                  style={{ background: tierGradient[b.tier] }}
                >
                  {b.emoji}
                </div>
                <p className="font-display text-[#F4E4C1] text-xs font-bold leading-tight truncate">{b.name}</p>
                <p className="font-mono text-[0.55rem] text-[#C9A84C]">+{b.xp} XP</p>
              </div>
            ))}
          </div>
          <Link to="/badges" className="btn btn-ghost w-full mt-3 text-xs py-2">
            Alle 460+ Badges ansehen →
          </Link>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Profile.tsx'), profileCode, 'utf8');
console.log('Profile.tsx updated');

// ─── 4. ScratchPage.tsx ───
const scratchPageCode = `import React from 'react'
import ScratchCard from '../components/ScratchCard'
import { storyPins } from '../data/data'
import { useTravel } from '../context/TravelContext'

export default function ScratchPage() {
  const { user, scratchedIds } = useTravel()
  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Explorer Progress · Season I · Scratch & Reveal</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Interactive Scratch Cards</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">reveal what the earth hides beneath gold foil</p>
      </div>

      <div className="p-6 pb-24 md:pb-8">
        {/* XP Dashboard */}
        <div className="parchment rounded-xl p-5 mb-8 shadow-xl border border-[rgba(139,58,42,0.2)]">
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <p className="font-display text-[#2C1810] font-bold text-sm">{user.rank}</p>
                <p className="font-mono text-[0.65rem] text-[#8B3A2A]">
                  {user.xp} / {user.xpNext} XP
                </p>
              </div>
              <div className="h-3 bg-[rgba(44,24,16,0.15)] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: \`\${xpPct}%\`, background: 'linear-gradient(90deg, #8B3A2A, #C9A84C)' }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['🔓 Enthüllt', scratchedIds.length],
                  ['🌍 Länder', user.countriesCount],
                  ['🏷️ Badges', user.badgesCount],
                ].map(([label, val]) => (
                  <div key={String(label)} className="text-center bg-[rgba(44,24,16,0.07)] rounded-lg py-2.5">
                    <p className="font-display text-[#2C1810] font-black text-xl">{val}</p>
                    <p className="font-mono text-[0.58rem] text-[#8B3A2A] uppercase">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center text-center border-t sm:border-t-0 sm:border-l border-[rgba(44,24,16,0.15)] pt-4 sm:pt-0 sm:pl-4">
              <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mb-1.5 shadow-lg">
                <p className="font-display font-black text-[#0C1825] text-xl">Lvl {user.level}</p>
              </div>
              <p className="font-display text-[#2C1810] text-xs font-bold">Pathfinder Voyager</p>
              <p className="font-mono text-[0.58rem] text-[#8B3A2A]">Noch {user.xpNext - user.xp} XP bis Level {user.level + 1}</p>
            </div>
          </div>
        </div>

        {/* SCRATCH CARDS PORTFOLIO */}
        <div className="mb-8">
          <div className="section-divider mb-6">
            <span className="font-mono text-[0.68rem] tracking-widest">Verfügbare Rubbelkarten (Touch-Optimiert)</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storyPins.map(pin => {
              const isScratched = scratchedIds.includes(pin.id)
              return (
                <div key={pin.id} className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-between w-full px-1">
                    <span className="font-mono text-[0.6rem] border border-[rgba(201,168,76,0.25)] text-[rgba(201,168,76,0.85)] px-2 py-0.5 rounded-full">
                      {pin.tag}
                    </span>
                    <span className="font-mono text-emerald-400 text-[0.62rem] font-bold">+{pin.xp} XP</span>
                  </div>

                  {isScratched ? (
                    <div className="w-full h-[180px] card rounded-xl p-4 flex flex-col items-center justify-center gap-1 border-[rgba(201,168,76,0.4)] shadow-lg text-center">
                      <span className="text-2xl mb-1">📍</span>
                      <p className="font-display text-[#C9A84C] text-base font-bold">{pin.location}</p>
                      <p className="coord">{pin.gps}</p>
                      <span className="text-emerald-400 font-mono text-xs font-bold mt-1">✓ Vollständig enthüllt (+{pin.xp} XP)</span>
                    </div>
                  ) : (
                    <ScratchCard
                      width={320}
                      height={180}
                      cardId={pin.id}
                      xpReward={pin.xp}
                      locationName={pin.location}
                      gps={pin.gps}
                      category={pin.category}
                    >
                      <div className="text-center px-4">
                        <p className="font-display text-[#F4E4C1] font-bold text-base mb-1">{pin.location}</p>
                        <p className="font-mono text-[#8A9AAA] text-[0.62rem] mb-1">{pin.tag}</p>
                        <p className="coord text-emerald-400 font-bold">{pin.gps}</p>
                      </div>
                    </ScratchCard>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/ScratchPage.tsx'), scratchPageCode, 'utf8');
console.log('ScratchPage.tsx updated');
console.log('All pages batch updated successfully!');
