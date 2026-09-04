import pathlib

target_dir = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src\pages")

home_content = r"""import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ScratchCard from '../components/ScratchCard'
import { storyPins, tours, cities, hobbiesList } from '../data/data'
import { useTravel } from '../context/TravelContext'

// ─── DECORATIVE SVG HELPERS ──────────────────────────────────────
function DottedPath() {
  return (
    <div className="hidden lg:flex items-center justify-center gap-0 absolute top-1/2 -translate-y-1/2 left-[12%] right-[12%] z-0 pointer-events-none">
      <svg width="100%" height="30" viewBox="0 0 600 30" preserveAspectRatio="none">
        <path
          d="M0,15 Q150,5 300,15 Q450,25 600,15"
          stroke="rgba(201,168,76,0.3)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          fill="none"
        />
        <circle cx="0" cy="15" r="4" fill="#C9A84C" opacity="0.6" />
        <circle cx="200" cy="11" r="3" fill="#C9A84C" opacity="0.4" />
        <circle cx="400" cy="19" r="3" fill="#C9A84C" opacity="0.4" />
        <circle cx="600" cy="15" r="4" fill="#C9A84C" opacity="0.6" />
      </svg>
    </div>
  )
}

function TerrainDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''}`} style={{ height: 32 }}>
      <svg viewBox="0 0 1440 32" className="w-full h-full" preserveAspectRatio="none">
        <path
          d="M0,16 C240,4 480,28 720,16 C960,4 1200,28 1440,16 L1440,32 L0,32 Z"
          fill="rgba(201,168,76,0.04)"
        />
        <path
          d="M0,20 C360,8 720,28 1080,14 C1260,7 1380,22 1440,20"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  )
}

export default function Home() {
  const [scratched, setScratched] = useState(false)
  const { user } = useTravel()
  const [copiedInvite, setCopiedInvite] = useState(false)

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/login?invite=${user.name.replace(/\s+/g, '_').toLowerCase()}`
    navigator.clipboard.writeText(inviteLink)
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 2500)
  }

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO: 100% KOSTENFREIE COMMUNITY & HOME SHARING
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-6 sm:px-8 py-16 overflow-hidden">
        {/* Atmosphere layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(26,46,90,0.7),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_60%,rgba(201,168,76,0.06),transparent)]" />
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5 bg-[radial-gradient(circle,#F4E4C1_0%,transparent_70%)]" />

        {/* Map grid */}
        <div className="absolute inset-0 opacity-30 map-grid" />

        {/* Compass Watermark */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.035] hidden xl:block pointer-events-none">
          <svg width="340" height="340" viewBox="0 0 100 100">
            <polygon points="50,2 44,50 56,50" fill="#C9A84C" />
            <polygon points="50,98 44,50 56,50" fill="#C9A84C" />
            <polygon points="98,50 50,44 50,56" fill="#C9A84C" />
            <polygon points="2,50 50,44 50,56" fill="#C9A84C" />
            <circle cx="50" cy="50" r="8" fill="#C9A84C" />
            <circle cx="50" cy="50" r="4" fill="#0C1825" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

            {/* Left Copy */}
            <div className="max-w-xl">
              {/* Community Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 mb-6 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[0.68rem] text-emerald-300 font-bold uppercase tracking-wider">
                  100% Kostenfreie Community · Echtes Home Sharing
                </span>
              </div>

              <p className="font-script text-[rgba(201,168,76,0.65)] text-2xl mb-2 -ml-0.5">
                — Freunde fürs Leben &amp; lokale Gastfreundschaft
              </p>
              
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] text-[#F4E4C1] mb-5">
                Teile deine Heimat.<br />
                <span className="gold-text">Werde weltweit</span><br />
                kostenlos eingeladen.
              </h1>
              
              <p className="font-body text-[1.1rem] text-[#8A9AAA] leading-relaxed mb-6">
                Schluss mit 20% Airbnb-Gebühren und anonymem Massentourismus. Bei uns öffnen Locals
                ihre Türen, teilen ihre echten Lieblingsplätze und schließen Freundschaften. 
                <strong className="text-[#F4E4C1]"> Beherberge Reisende oder teile deine Spots — und werde im Gegenzug von Locals überall auf der Welt mit offenen Armen empfangen.</strong>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/host" className="btn btn-primary pulse-gold text-xs sm:text-sm px-6 py-3 font-bold shadow-xl">
                  🏡 Als Local Host mitmachen (0 € Kosten)
                </Link>
                <Link to="/explore" className="btn btn-secondary text-xs sm:text-sm px-6 py-3">
                  🗺️ Karte &amp; Hosts erkunden
                </Link>
              </div>

              {/* Trust & Community Stats */}
              <div className="flex gap-8 pt-6 border-t border-[rgba(201,168,76,0.15)]">
                {[
                  ['0 €', 'Gebühren', 'Für immer kostenlos'],
                  ['1.400+', 'Offene Türen', 'Gästezimmer & Camp'],
                  ['100%', 'Familiär', 'Wahre Freundschaften']
                ].map(([val, label, sub]) => (
                  <div key={label}>
                    <p className="font-display text-[#C9A84C] font-bold text-2xl leading-none">{val}</p>
                    <p className="font-display text-[#F4E4C1] text-xs font-semibold mt-1">{label}</p>
                    <p className="font-mono text-[0.58rem] text-[#8A9AAA]">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Interactive Scratch Card */}
            <div className="flex flex-col items-center gap-5 lg:pr-4">
              <div className="text-center">
                <p className="font-mono text-[0.65rem] text-[#C9A84C] tracking-[0.2em] uppercase mb-1 font-bold">
                  ✨ Live Entdecker-Karte
                </p>
                <p className="font-script text-[rgba(201,168,76,0.5)] text-base">
                  Kratz den Geheimtipp von Local Miguel frei…
                </p>
              </div>

              <div className="float-anim">
                <ScratchCard cardId={101} width={320} height={200} onComplete={() => setScratched(true)}>
                  <div className="text-center px-6 py-4 w-full h-full flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[0.6rem] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block mb-1">
                        🏠 Local Home &amp; Secret Spot
                      </span>
                      <p className="font-display text-[#F4E4C1] text-lg font-bold">
                        Miguels Klippen-Refugium &amp; O Galo
                      </p>
                      <p className="font-mono text-xs text-[#C9A84C]">Alfama · 38°42'44"N · 9°07'59"W</p>
                    </div>
                    <div className="bg-[#0C1825]/90 rounded-lg p-2 border border-[rgba(201,168,76,0.2)]">
                      <p className="font-body text-xs text-[#F4E4C1] italic">
                        „Kommt als Fremde, bleibt zum Abendessen und geht als Freunde!“
                      </p>
                      <p className="font-mono text-[0.58rem] text-emerald-400 mt-1">
                        ✓ Gastfreundschaft: Kostenlos · Hundefreundlich · Echter Bacalhau
                      </p>
                    </div>
                  </div>
                </ScratchCard>
              </div>

              {scratched ? (
                <div className="text-center fade-up">
                  <p className="font-script text-emerald-400 text-lg">Miguels Geheimnis enthüllt! 🎉</p>
                  <Link to="/explore" className="btn btn-secondary text-xs mt-2">
                    Alle Local Hosts auf der Karte sehen →
                  </Link>
                </div>
              ) : (
                <p className="font-body text-[rgba(201,168,76,0.4)] text-xs italic">
                  Tippe oder ziehe mit der Maus, um die Folie wegzurubbeln
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      <TerrainDivider />

      {/* ══════════════════════════════════════════════════════
          DAS HOSPITALITY- & GEGENSEITIGKEITS-PRINZIP
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 sm:px-8 bg-[#0E1F33]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-mono text-xs text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Das Open-Door Karma Prinzip
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#F4E4C1] font-bold mt-3 mb-3">
              Wie kostenloses Home-Sharing &amp; echte Freundschaft funktionieren
            </h2>
            <p className="font-body text-[#8A9AAA] text-base max-w-xl mx-auto">
              Kein anonymes Buchen, keine versteckten Servicegebühren. Wir glauben daran, dass die besten
              Reisen aus echten Begegnungen entstehen.
            </p>
          </div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DottedPath />
            {[
              {
                step: '01',
                icon: '📍',
                title: 'Lieblingsort teilen',
                desc: 'Teile deinen geheimen Aussichtspunkt, dein Lieblingscafé oder eine gemütliche Schlafecke für Reisende in deiner Heimatstadt.',
                tag: 'Heimatliebe',
                badge: '+100 Karma XP'
              },
              {
                step: '02',
                icon: '🗝️',
                title: 'Golden Key erhalten',
                desc: 'Wer gibt, empfängt: Durch deine Tipps schaltest du den "Open Door Explorer Pass" frei und wirst Teil des weltweiten Gastfreundschafts-Rings.',
                tag: 'Gegenseitigkeit',
                badge: 'Open Door Pass'
              },
              {
                step: '03',
                icon: '💌',
                title: 'Eingeladen werden',
                desc: 'Reise nach Lissabon, Rom oder in die Alpen. Locals mit deinen Hobbys (WanderBond) laden dich zu sich nach Hause, zum Kochen oder auf Touren ein.',
                tag: 'Einladungen',
                badge: '0 € Übernachtung'
              },
              {
                step: '04',
                icon: '🤝',
                title: 'Freunde fürs Leben',
                desc: 'Du siehst die Welt mit den Augen der Menschen, die dort leben. Aus Gastgebern werden Freunde, die du jederzeit wiedersehen kannst.',
                tag: 'Familiär',
                badge: 'Echte Verbindung'
              }
            ].map((col, idx) => (
              <div key={idx} className="relative z-10 flex flex-col card p-5 group hover:border-[#C9A84C] transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{col.icon}</span>
                  <span className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.4)] font-bold">{col.step}</span>
                </div>
                <span className="font-mono text-[0.58rem] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] px-2 py-0.5 rounded-full mb-2 inline-block w-fit">
                  {col.tag}
                </span>
                <h3 className="font-display text-[#F4E4C1] font-bold text-base mb-1.5 group-hover:text-[#C9A84C] transition-colors">
                  {col.title}
                </h3>
                <p className="font-body text-[#8A9AAA] text-xs leading-relaxed flex-1 mb-3">
                  {col.desc}
                </p>
                <span className="font-mono text-[0.62rem] text-emerald-400 font-bold border-t border-[rgba(201,168,76,0.1)] pt-2">
                  ✓ {col.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Golden Friendship Ticket Box */}
          <div className="mt-12 bg-gradient-to-r from-[#152539] via-[#1a2f47] to-[#152539] p-6 rounded-2xl border border-[rgba(201,168,76,0.35)] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl block">🎫</span>
              <div>
                <p className="font-display text-[#F4E4C1] text-lg font-bold">
                  Dein Golden Friendship Invite Ticket
                </p>
                <p className="font-body text-[#8A9AAA] text-xs">
                  Lade einen Freund in die Community ein. Sobald er beitritt, schaltet ihr beide 
                  <strong className="text-[#C9A84C]"> 3 geheime Local-Spots frei + erhaltet das Golden Host Wappen</strong>!
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyInvite}
              className="btn btn-primary text-xs px-5 py-2.5 font-bold whitespace-nowrap shadow-lg"
            >
              {copiedInvite ? '✓ Einladungslink kopiert!' : '🔗 Persönlichen Einladungslink kopieren'}
            </button>
          </div>
        </div>
      </section>

      <TerrainDivider flip />

      {/* ══════════════════════════════════════════════════════
          ECHTE GASTGEBER & FREUNDSCHAFTS-STORIES
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-script text-[rgba(201,168,76,0.6)] text-xl mb-1">familiäre Community</p>
            <h2 className="font-display text-3xl text-[#F4E4C1] font-bold">
              Von Locals empfohlen. Von Herzen geteilt.
            </h2>
            <p className="font-body text-[#8A9AAA] text-sm max-w-lg mx-auto mt-2">
              Jeder Pin steht für einen echten Menschen. Keine Agenturen, keine bezahlten Rezensionen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {storyPins.slice(0, 3).map(p => (
              <div key={p.id} className="card p-5 flex flex-col justify-between group hover:border-[rgba(201,168,76,0.5)] transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B3A2A] flex items-center justify-center font-display font-bold text-[#0C1825] text-sm shadow-md">
                      {p.avatar}
                    </div>
                    <div>
                      <p className="font-display text-[#F4E4C1] font-bold text-sm">{p.local}</p>
                      <p className="font-mono text-[0.62rem] text-[#C9A84C]">{p.location}</p>
                    </div>
                  </div>
                  <p className="font-body text-[#8A9AAA] text-xs italic leading-relaxed mb-4">
                    „{p.story}“
                  </p>
                </div>
                <div className="pt-3 border-t border-[rgba(201,168,76,0.1)] flex items-center justify-between">
                  <span className="font-mono text-[0.62rem] text-emerald-400">
                    ★ {p.rating} ({p.reviews} Freunde bewirtet)
                  </span>
                  <Link to="/stories" className="text-[0.65rem] font-mono text-[#C9A84C] hover:underline">
                    Story lesen →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/host" className="btn btn-secondary text-xs px-6 py-2.5">
              🏡 Möchtest auch du Gastgeber werden? Hier kostenlos eintragen →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HERMES TRAVEL DNA MATCHMAKING (130 HOBBYS)
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 sm:px-8 bg-[#0E1F33]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-[0.65rem] text-[#C9A84C] uppercase tracking-widest font-bold">
                WanderBond™ Algorithmus
              </span>
              <h2 className="font-display text-3xl font-bold text-[#F4E4C1] mt-2 mb-4">
                Finde Locals, die deine Leidenschaften teilen
              </h2>
              <p className="font-body text-[#8A9AAA] text-base leading-relaxed mb-6">
                Egal ob Klippen-Klettern, veganes Sauerteig-Backen, Dog-Trekking oder Sonnenuntergangs-Surfen: 
                Aus 130 Hobbys ermitteln wir die perfekten Gastgeber und Reise-Buddies für dich. 
                Gleiche Wellenlänge garantiert.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {hobbiesList.slice(0, 14).map(h => (
                  <span
                    key={h}
                    className="font-mono text-[0.65rem] bg-[#0C1825] border border-[rgba(201,168,76,0.25)] text-[#C9A84C] px-2.5 py-1 rounded-full"
                  >
                    {h}
                  </span>
                ))}
                <span className="font-mono text-[0.65rem] text-[#8A9AAA] px-2 py-1">
                  + 116 weitere Hobbys...
                </span>
              </div>

              <Link to="/wanderbond" className="btn btn-primary text-xs font-bold py-3 px-6 shadow-xl">
                🧬 Deine 130-Hobby-DNA jetzt erstellen →
              </Link>
            </div>

            {/* Visual Parchment Card */}
            <div className="parchment rounded-2xl p-7 text-[#2C1810] shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(139,58,42,0.2)]">
                <div>
                  <p className="font-display font-bold text-sm text-[#8B3A2A]">WanderBond Match Report</p>
                  <p className="font-mono text-[0.6rem] text-[#2C1810]">Lissabon &amp; Ericeira Coast</p>
                </div>
                <span className="font-mono text-xs font-black bg-[#8B3A2A] text-[#F4E4C1] px-2.5 py-1 rounded-full">
                  96% Match
                </span>
              </div>
              <div className="space-y-3 font-body text-sm">
                <p>
                  <strong>Gemeinsame DNA:</strong> Surfen · Hundewandern · Craft Beer · Fotografie
                </p>
                <p className="text-xs text-[rgba(44,24,16,0.8)] leading-relaxed">
                  Local Host João bietet: „Gästezimmer mit Kamin 10 Min. vom Strand. Ein Zelt im Garten für den Hund ist auch da. Freue mich auf gemeinsame Surf-Sessions!“
                </p>
                <div className="pt-3 flex items-center justify-between font-mono text-[0.65rem] text-[#8B3A2A] font-bold">
                  <span>Kosten: 0 € (Einladung)</span>
                  <span>Status: Gastfreundlich &amp; Verifiziert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER CALL TO ACTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 sm:px-8 text-center relative">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-5xl block animate-bounce">🧭</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#F4E4C1] font-bold">
            Werde Teil der herzlichsten Reise-Familie der Welt
          </h2>
          <p className="font-body text-[#8A9AAA] text-base leading-relaxed max-w-xl mx-auto">
            Keine versteckten Gebühren. Keine Algorithmus-Fallen. Nur echte Menschen, geheime Orte
            und offene Türen.
          </p>
          <div className="flex justify-center gap-4 flex-wrap pt-2">
            <Link to="/login" className="btn btn-primary text-sm px-8 py-3.5 font-bold shadow-2xl">
              ✨ Kostenlosen Explorer Pass erstellen →
            </Link>
            <Link to="/host" className="btn btn-secondary text-sm px-8 py-3.5">
              🏡 Gastgeber werden &amp; Freunde empfangen
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
"""

(target_dir / "Home.tsx").write_text(home_content, encoding="utf-8")
print("Home.tsx successfully updated with 100% free community, home sharing & friendship features!")

# 2. Upgrade Host.tsx to feature free home sharing & local invitations prominently
host_content = r"""import React, { useState } from 'react'
import { cities, businessCategories } from '../data/data'
import { Link } from 'react-router-dom'

export default function Host() {
  const [tab, setTab] = useState<'community' | 'business'>('community')
  const [applied, setApplied] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: 'Lisbon',
    type: 'Gästezimmer (Home Sharing)',
    hobbies: 'Wandern, Kochen, Surfen',
    desc: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApplied(true)
  }

  return (
    <div>
      <div className="page-header text-center">
        <p className="coord mb-1 uppercase tracking-widest text-xs">
          Open-Door Community · Zero Platform Fees · Pure Hospitality
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[#F4E4C1] font-bold">
          Host &amp; Community Portal
        </h1>
        <p className="font-script text-[rgba(201,168,76,0.6)] text-lg mt-1">
          Öffne deine Tür, teile deine Heimat &amp; werde weltweit eingeladen
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setTab('community')}
            className={`px-5 py-2 rounded-full text-xs font-display font-bold transition-all ${
              tab === 'community'
                ? 'bg-[#C9A84C] text-[#0C1825] shadow-lg scale-105'
                : 'bg-[#152539] text-[#8A9AAA] hover:text-[#F4E4C1]'
            }`}
          >
            🏡 Privater Local Host &amp; Home Sharing (0 € Kostenlos)
          </button>
          <button
            onClick={() => setTab('business')}
            className={`px-5 py-2 rounded-full text-xs font-display font-bold transition-all ${
              tab === 'business'
                ? 'bg-[#C9A84C] text-[#0C1825] shadow-lg scale-105'
                : 'bg-[#152539] text-[#8A9AAA] hover:text-[#F4E4C1]'
            }`}
          >
            ☕ Lokale Manufakturen &amp; Partner
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-10 max-w-5xl mx-auto pb-24 md:pb-8">

        {/* ─── TAB 1: COMMUNITY HOME SHARING ─── */}
        {tab === 'community' && (
          <>
            {/* Parchment Value Prop */}
            <div className="parchment rounded-2xl p-7 relative overflow-hidden shadow-2xl text-[#2C1810]">
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <div className="md:col-span-2 space-y-3">
                  <span className="font-mono text-xs font-bold text-[#8B3A2A] bg-[rgba(139,58,42,0.15)] px-3 py-1 rounded-full uppercase">
                    Kostenlose Gastfreundschaft
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black leading-tight text-[#2C1810]">
                    Teile dein Zuhause oder deine Geheimorte — und reise selbst umsonst.
                  </h2>
                  <p className="font-body text-sm sm:text-base leading-relaxed">
                    Egal ob du ein freies Gästezimmer hast, einen Stellplatz im Garten für Van-Reisende anbietest
                    oder einfach sonntags mit Reisenden wandern gehst: Du zahlst keinen Cent und verlangst kein Geld.
                    Als Gegenleistung wirst du Teil unseres weltweiten Gastfreundschafts-Netzwerks und wirst
                    von anderen Locals rund um den Globus eingeladen.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['0 €', 'Gebühren', '100% werbefrei'],
                    ['🗝️ Key', 'Open Doors', 'Weltweit eingeladen'],
                    ['❤️', 'Familiär', 'Wahre Freundschaft'],
                    ['🐕', 'Pet Friendly', 'Hunde willkommen']
                  ].map(([v, l, s]) => (
                    <div key={l} className="bg-[rgba(44,24,16,0.08)] rounded-xl p-3 text-center border border-[rgba(139,58,42,0.15)]">
                      <p className="font-display text-[#8B3A2A] text-xl font-black">{v}</p>
                      <p className="font-display text-[#2C1810] text-xs font-bold">{l}</p>
                      <p className="font-mono text-[0.55rem] text-[#8B3A2A]">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="card p-6 sm:p-8 max-w-2xl mx-auto border-[rgba(201,168,76,0.3)] shadow-2xl">
              {applied ? (
                <div className="text-center py-8 space-y-3">
                  <span className="text-5xl block">🎉</span>
                  <h3 className="font-display text-[#F4E4C1] text-2xl font-bold">
                    Willkommen im Gastgeber-Zirkel!
                  </h3>
                  <p className="font-body text-[#8A9AAA] text-sm max-w-md mx-auto">
                    Dein Profil als Local Host wurde eingereicht. Du erhältst in Kürze dein digitales
                    <strong> Golden Host Key Wappen</strong> für deinen Reisepass!
                  </p>
                  <Link to="/passport" className="btn btn-primary text-xs px-6 py-2.5 mt-4">
                    Zum digitalen Reisepass →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center mb-6">
                    <span className="text-3xl block mb-1">🏡</span>
                    <h3 className="font-display text-[#F4E4C1] text-xl font-bold">
                      Als Local Host registrieren
                    </h3>
                    <p className="font-body text-[#8A9AAA] text-xs">
                      Dauert nur 2 Minuten · Keine Kosten · Jederzeit pausierbar
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Dein Vorname / Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="z. B. Miguel &amp; Sarah"
                        className="field text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Deine E-Mail</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="host@gmail.com"
                        className="field text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Deine Stadt / Region</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        placeholder="z. B. Sintra, Portugal"
                        className="field text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Was möchtest du anbieten?</label>
                      <select
                        value={form.type}
                        onChange={e => setForm({ ...form, type: e.target.value })}
                        className="field text-sm"
                      >
                        <option>Gästezimmer (Kostenlos)</option>
                        <option>Couch / Gästesofa</option>
                        <option>Garten-Camp / Van-Stellplatz</option>
                        <option>Gemeinsam Kochen &amp; Stadtführung</option>
                        <option>Nur geheime Insidertipps teilen</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Deine Hobbys &amp; Interessen (für Matchmaking)</label>
                    <input
                      type="text"
                      value={form.hobbies}
                      onChange={e => setForm({ ...form, hobbies: e.target.value })}
                      placeholder="z. B. Surfen, Wandern mit Hund, Wein, Kochen"
                      className="field text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Kurze persönliche Vorstellung</label>
                    <textarea
                      rows={3}
                      value={form.desc}
                      onChange={e => setForm({ ...form, desc: e.target.value })}
                      placeholder="Erzähl ein paar Sätze über dich und warum du gerne Reisende empfängst..."
                      className="field text-sm"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold shadow-xl">
                    ✨ Gastgeber-Profil kostenlos aktivieren →
                  </button>
                </form>
              )}
            </div>
          </>
        )}

        {/* ─── TAB 2: BUSINESS / CAFES / EXPERIENCES ─── */}
        {tab === 'business' && (
          <div className="space-y-8">
            <div className="parchment rounded-xl p-6 text-[#2C1810]">
              <h3 className="font-display text-xl font-bold mb-2">B2B Partner-Programm (Zero Commission)</h3>
              <p className="font-body text-sm leading-relaxed mb-4">
                Du führst eine kleine traditionelle Tasca, ein Surf-Camp oder einen Verleih? 
                Bei uns zahlst du keine 15–20% Buchungsgebühren. Echte Reisende finden dich direkt.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map(c => (
                <div key={c.name} className="card p-4 flex items-center gap-4">
                  <span className="text-3xl">{c.flag}</span>
                  <div className="flex-1">
                    <p className="font-display text-[#F4E4C1] font-bold text-sm">{c.name}</p>
                    <p className="font-mono text-[0.62rem] text-emerald-400">
                      {c.total - c.taken} freie Partner-Plätze
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
"""

(target_dir / "Host.tsx").write_text(host_content, encoding="utf-8")
print("Host.tsx successfully updated with Home Sharing tabs and free host portal!")
