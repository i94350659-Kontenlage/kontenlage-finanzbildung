import pathlib, textwrap

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")

explore_tsx = r"""import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import TravelMap from '../components/TravelMap'
import StoryGeneratorModal from '../components/StoryGeneratorModal'
import ReservationModal from '../components/ReservationModal'
import SubmitSpotModal from '../components/SubmitSpotModal'
import { createGoogleCalendarUrl } from '../utils/calendarExport'
import { storyPins, activities, StoryPin } from '../data/data'
import { useTravel } from '../context/TravelContext'

const cats = ['All', 'Nature', 'Food', 'Surf']
const diffLabels: Record<number, string> = {
  1: 'Sehr leicht', 2: 'Leicht', 3: 'Moderat', 4: 'Anspruchsvoll', 5: 'Alpin/Extrem',
}

type DiffFilter = number | 'all'

export default function Explore() {
  const { revealedPins, scratchSecret, triggerHaptic } = useTravel()
  const [catFilter, setCatFilter] = useState('All')
  const [filterDog, setFilterDog] = useState(false)
  const [filterStroller, setFilterStroller] = useState(false)
  const [filterDiff, setFilterDiff] = useState<DiffFilter>('all')
  const [searchQ, setSearchQ] = useState('')
  const [extraSpots, setExtraSpots] = useState<StoryPin[]>([])
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [storyModal, setStoryModal] = useState({ isOpen: false, title: '', location: '', gps: '', xp: 100, image: '' })
  const [resModal, setResModal] = useState({ isOpen: false, hostName: '', city: '', category: '' })

  const allPins = useMemo(() => [...extraSpots, ...storyPins], [extraSpots])

  const filtered = useMemo(() => allPins.filter(p => {
    if (catFilter !== 'All' && p.category !== catFilter) return false
    if (filterDog && !p.dogFriendly) return false
    if (filterStroller && !p.strollerFriendly) return false
    if (filterDiff !== 'all' && p.difficulty !== filterDiff) return false
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase()
      return p.location.toLowerCase().includes(q) || p.story.toLowerCase().includes(q)
    }
    return true
  }), [allPins, catFilter, filterDog, filterStroller, filterDiff, searchQ])

  const mapPins = filtered.map((p, i) => ({
    id: p.id, title: p.location, location: p.tag,
    lat: 38.75 + i * 0.05, lng: -9.2 - i * 0.04,
    category: p.category, rating: p.rating, xp: p.xp,
    isUnlocked: revealedPins.includes(p.id),
  }))

  const diffOptions: DiffFilter[] = ['all', 1, 2, 3, 4, 5]

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Dog &amp; Stroller Verified · 1–5 Difficulty · Insider Secrets</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Explore Map &amp; Secret Spots</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg">gems shared by passionate locals</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { triggerHaptic(15); setIsSubmitOpen(true) }}
              className="btn btn-primary text-xs py-2 px-3 font-bold shadow-lg"
            >+ Spot einstellen (+150 XP)</button>
            <Link to="/wanderbond" className="btn btn-secondary text-xs py-2 px-3">🧬 DNA anpassen</Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-24 md:pb-8">
        <TravelMap pins={mapPins} height="360px" />

        {/* ── FILTERS ────────────────────────────────────────────────────── */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Suche nach Bucht, Wald, Taverne..."
              className="field flex-1"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => { triggerHaptic(10); setFilterDog(!filterDog) }}
                className={`btn text-xs py-2 px-3 ${filterDog ? 'btn-primary font-bold' : 'btn-ghost'}`}
              >🐕 Hundefreundlich</button>
              <button
                onClick={() => { triggerHaptic(10); setFilterStroller(!filterStroller) }}
                className={`btn text-xs py-2 px-3 ${filterStroller ? 'btn-primary font-bold' : 'btn-ghost'}`}
              >👶 Kinderwagen</button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap pt-2 border-t border-[rgba(201,168,76,0.1)]">
            <span className="font-mono text-[0.62rem] text-[#8A9AAA] self-center">Schwierigkeit:</span>
            {diffOptions.map(d => (
              <button key={String(d)} onClick={() => { triggerHaptic(10); setFilterDiff(d) }}
                className={`btn text-[0.62rem] py-1 px-2.5 ${filterDiff === d ? 'btn-primary' : 'btn-ghost'}`}>
                {d === 'all' ? 'Alle' : `Stufe ${d} (${diffLabels[d as number]})`}
              </button>
            ))}
            <span className="ml-2 font-mono text-[0.62rem] text-[#8A9AAA] self-center">Kategorie:</span>
            {cats.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`btn text-[0.62rem] py-1 px-2.5 ${catFilter === c ? 'btn-primary' : 'btn-ghost'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── PINS GRID ─────────────────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-[#F4E4C1] text-xl font-bold mb-4">
            Verifizierte Secret Spots ({filtered.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(pin => {
              const unlocked = revealedPins.includes(pin.id)
              return (
                <div key={pin.id} className="card overflow-hidden group flex flex-col justify-between">
                  <div>
                    <div className="relative h-44">
                      <img src={pin.image} alt={pin.location}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-[75%]">
                        {pin.dogFriendly && (
                          <span className="font-mono text-[0.58rem] bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-2 py-0.5 rounded-full font-bold">🐕 Hund</span>
                        )}
                        {pin.strollerFriendly && (
                          <span className="font-mono text-[0.58rem] bg-blue-950/90 border border-blue-500/60 text-blue-300 px-2 py-0.5 rounded-full font-bold">👶 Kinderwagen</span>
                        )}
                        <span className="font-mono text-[0.58rem] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.3)] text-[#C9A84C] px-2 py-0.5 rounded-full">Stufe {pin.difficulty}/5</span>
                      </div>
                      <span className="absolute top-2 right-2 font-mono text-[0.6rem] text-emerald-400 font-bold bg-[#0C1825]/85 px-2 py-0.5 rounded-full">+{pin.xp} XP</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-[0.65rem] flex-shrink-0">{pin.avatar}</div>
                        <div>
                          <p className="font-display text-[#F4E4C1] text-sm font-semibold">{pin.local}</p>
                          <p className="font-mono text-[0.6rem] text-[#8A9AAA]">{pin.location}</p>
                        </div>
                      </div>
                      <p className="font-body text-[#8A9AAA] text-sm mb-3 line-clamp-3">{pin.story}</p>
                      {(pin.dogDetails || pin.strollerDetails) && (
                        <div className="bg-[#0C1825] rounded-lg p-2.5 mb-3 text-[0.68rem] font-mono space-y-1">
                          {pin.dogDetails && <p className="text-emerald-400/90">🐕 {pin.dogDetails}</p>}
                          {pin.strollerDetails && <p className="text-blue-400/90">👶 {pin.strollerDetails}</p>}
                        </div>
                      )}
                      <div className="flex justify-between mb-3">
                        <span className="text-[#C9A84C] text-sm">
                          {'★'.repeat(Math.floor(pin.rating))}
                          <span className="text-[#8A9AAA] text-xs ml-1">{pin.rating}</span>
                        </span>
                        <span className="font-mono text-[0.62rem] text-[#8A9AAA]">{pin.reviews} Reviews</span>
                      </div>
                      {unlocked
                        ? <div className="bg-[#0C1825] rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
                            <span className="text-emerald-400 text-xs">📍</span>
                            <span className="coord text-emerald-400 font-bold">{pin.gps}</span>
                          </div>
                        : <button
                            onClick={() => scratchSecret(pin.id, pin.xp, pin.location, pin.gps, pin.category)}
                            className="btn btn-secondary w-full text-xs py-2 mb-3 font-bold"
                          >🪙 GPS freischalten</button>
                      }
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-1 border-t border-[rgba(201,168,76,0.1)] flex gap-2">
                    <button
                      onClick={() => { triggerHaptic(10); window.open(createGoogleCalendarUrl({ title: pin.location, description: pin.story, location: pin.location }), '_blank') }}
                      className="btn btn-ghost flex-1 text-[0.62rem] py-1.5"
                    >📅 Kalender</button>
                    <button
                      onClick={() => setStoryModal({ isOpen: true, title: pin.location, location: pin.tag, gps: pin.gps, xp: pin.xp, image: pin.image })}
                      className="btn btn-ghost flex-1 text-[0.62rem] py-1.5"
                    >📲 Story</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── ACTIVITIES ────────────────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-[#F4E4C1] text-lg font-bold mb-4">Aktivitäten &amp; Reservierungen (0% Fee)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map(a => (
              <div key={a.id} className="card p-4 flex flex-col justify-between">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[#F4E4C1] text-sm font-bold">{a.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="font-mono text-[#C9A84C] text-[0.65rem]">★ {a.rating}</span>
                      <span className="font-mono text-[#8A9AAA] text-[0.62rem]">{a.participants}</span>
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      {a.dogFriendly && <span className="font-mono text-[0.55rem] bg-emerald-950 border border-emerald-500/40 text-emerald-400 px-1.5 rounded-full">🐕</span>}
                      {a.strollerFriendly && <span className="font-mono text-[0.55rem] bg-blue-950 border border-blue-500/40 text-blue-400 px-1.5 rounded-full">👶</span>}
                      <span className="font-mono text-[0.55rem] bg-[#0C1825] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] px-1.5 rounded-full">Stufe {a.difficulty}/5</span>
                    </div>
                  </div>
                  <span className="font-display text-[#C9A84C] font-bold text-sm flex-shrink-0">{a.price}</span>
                </div>
                <button
                  onClick={() => setResModal({ isOpen: true, hostName: a.name, city: 'Portugal', category: a.cat })}
                  className="btn btn-secondary w-full text-xs py-2"
                >Anfragen (0% Fee) →</button>
              </div>
            ))}
          </div>
        </div>

        <StoryGeneratorModal
          isOpen={storyModal.isOpen}
          onClose={() => setStoryModal(p => ({ ...p, isOpen: false }))}
          data={storyModal}
        />
        <ReservationModal
          isOpen={resModal.isOpen}
          onClose={() => setResModal(p => ({ ...p, isOpen: false }))}
          hostName={resModal.hostName}
          city={resModal.city}
          category={resModal.category}
        />
        <SubmitSpotModal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          onSuccess={spot => {
            const newPin: StoryPin = {
              id: Date.now(),
              local: 'Du (Community)',
              avatar: 'YOU',
              location: `${spot.location} — ${spot.title}`,
              story: spot.insiderStory,
              rating: 5.0,
              reviews: 1,
              gps: 'GPS ausstehend',
              locked: false,
              tag: `${spot.category} Secret`,
              image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format',
              category: spot.category,
              xp: 150,
              difficulty: spot.difficulty,
              dogFriendly: spot.dogFriendly,
              dogDetails: spot.dogNotes,
              strollerFriendly: spot.strollerFriendly,
              strollerDetails: spot.strollerNotes,
              familyKidsFriendly: spot.familyFriendly,
            }
            setExtraSpots(prev => [newPin, ...prev])
          }}
        />
      </div>
    </div>
  )
}
"""

tours_tsx = r"""import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SubmitSpotModal from '../components/SubmitSpotModal'
import { tours, Tour } from '../data/data'
import { useTravel } from '../context/TravelContext'

const diffLabel: Record<number, string> = {
  1: 'Sehr leicht', 2: 'Leicht', 3: 'Moderat', 4: 'Anspruchsvoll', 5: 'Alpin/Extrem',
}
const diffColor: Record<number, string> = {
  1: 'text-emerald-400 border-emerald-500/50',
  2: 'text-green-400 border-green-500/50',
  3: 'text-yellow-400 border-yellow-500/50',
  4: 'text-orange-400 border-orange-500/50',
  5: 'text-red-400 border-red-500/50',
}

type DiffFilter = number | 'all'

export default function Tours() {
  const { triggerHaptic } = useTravel()
  const [filterDog, setFilterDog] = useState(false)
  const [filterStroller, setFilterStroller] = useState(false)
  const [filterDiff, setFilterDiff] = useState<DiffFilter>('all')
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [extraTours, setExtraTours] = useState<Tour[]>([])
  const allTours = useMemo(() => [...extraTours, ...tours], [extraTours])

  const filtered = useMemo(() => allTours.filter(t => {
    if (filterDog && !t.dogFriendly) return false
    if (filterStroller && !t.strollerFriendly) return false
    if (filterDiff !== 'all' && t.difficulty !== filterDiff) return false
    return true
  }), [allTours, filterDog, filterStroller, filterDiff])

  function handleDownload(t: Tour) {
    triggerHaptic(20)
    const diff = diffLabel[t.difficulty] ?? 'Moderat'
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Scratch'nTravel" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${t.name}</name>
    <desc>${t.description} - ${diff}${t.dogFriendly ? ' - Hundefreundlich' : ''}${t.strollerFriendly ? ' - Kinderwagen' : ''}</desc>
  </metadata>
  <trk><name>${t.name}</name><trkseg>
    <trkpt lat="38.7169" lon="-9.1395"><ele>0</ele></trkpt>
    <trkpt lat="38.7200" lon="-9.1400"><ele>10</ele></trkpt>
    <trkpt lat="38.7250" lon="-9.1450"><ele>25</ele></trkpt>
  </trkseg></trk>
</gpx>`
    const blob = new Blob([gpx], { type: 'application/gpx+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${t.name.replace(/\s+/g, '-')}.gpx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const diffOptions: DiffFilter[] = ['all', 1, 2, 3, 4, 5]

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">GPS + GPX · Dog &amp; Stroller Verified · Hike/Bike/Surf</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Tours &amp; GPX-Routen</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg">von Locals verifiziert</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { triggerHaptic(15); setIsSubmitOpen(true) }}
              className="btn btn-primary text-xs py-2 px-3 font-bold"
            >+ Route einstellen (+200 XP)</button>
            <Link to="/wanderbond" className="btn btn-secondary text-xs py-2 px-3">🧬 DNA</Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* ── FILTERS ────────────────────────────────────────────────────── */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] flex gap-3 flex-wrap items-center">
          <button onClick={() => { triggerHaptic(10); setFilterDog(!filterDog) }}
            className={`btn text-xs py-2 px-3 ${filterDog ? 'btn-primary font-bold' : 'btn-ghost'}`}
          >🐕 Hundefreundlich</button>
          <button onClick={() => { triggerHaptic(10); setFilterStroller(!filterStroller) }}
            className={`btn text-xs py-2 px-3 ${filterStroller ? 'btn-primary font-bold' : 'btn-ghost'}`}
          >👶 Kinderwagen</button>
          <div className="border-l border-[rgba(201,168,76,0.15)] pl-3 flex gap-2 flex-wrap">
            <span className="font-mono text-[0.62rem] text-[#8A9AAA] self-center">Schwierigkeit:</span>
            {diffOptions.map(d => (
              <button key={String(d)} onClick={() => { triggerHaptic(8); setFilterDiff(d) }}
                className={`btn text-[0.62rem] py-1 px-2.5 ${filterDiff === d ? 'btn-primary' : 'btn-ghost'}`}>
                {d === 'all' ? 'Alle' : `${d} — ${diffLabel[d as number]}`}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-[0.65rem] text-[#8A9AAA]">{filtered.length} Routen</span>
        </div>

        {/* ── TOUR CARDS ─────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <div key={t.id} className="card overflow-hidden flex flex-col">
              <div className="relative h-44">
                <img src={t.image} alt={t.name}
                  className="w-full h-full object-cover opacity-80 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap max-w-[80%]">
                  {t.dogFriendly && (
                    <span className="font-mono text-[0.58rem] bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-2 py-0.5 rounded-full font-bold">🐕 Hund</span>
                  )}
                  {t.strollerFriendly && (
                    <span className="font-mono text-[0.58rem] bg-blue-950/90 border border-blue-500/60 text-blue-300 px-2 py-0.5 rounded-full font-bold">👶 Wagen</span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`font-mono text-[0.62rem] font-bold bg-[#0C1825]/90 border px-2 py-0.5 rounded-full ${diffColor[t.difficulty]}`}>
                    Stufe {t.difficulty}/5
                  </span>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className="font-mono text-[0.62rem] text-emerald-400 font-bold bg-[#0C1825]/85 px-2 py-0.5 rounded-full">+{t.xp} XP</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-display text-[#F4E4C1] font-bold text-sm">{t.name}</h3>
                    <p className="font-mono text-[0.62rem] text-[#C9A84C] mt-0.5">{t.distance} · {t.duration} · {t.elevation}</p>
                  </div>
                  <span className="font-mono text-[0.62rem] text-[#8A9AAA] text-right flex-shrink-0">{t.type}</span>
                </div>
                <p className="font-body text-[#8A9AAA] text-xs mb-3 flex-1 line-clamp-3">{t.description}</p>
                {(t.dogNotes || t.strollerNotes) && (
                  <div className="bg-[#0C1825] rounded-lg p-2.5 mb-3 text-[0.65rem] font-mono space-y-1">
                    {t.dogNotes && <p className="text-emerald-400/90">🐕 {t.dogNotes}</p>}
                    {t.strollerNotes && <p className="text-blue-400/90">👶 {t.strollerNotes}</p>}
                  </div>
                )}
                <button onClick={() => handleDownload(t)} className="btn btn-primary w-full text-xs py-2 font-bold mt-auto">
                  📥 GPX herunterladen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SubmitSpotModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={spot => {
          const t: Tour = {
            id: Date.now(),
            name: spot.title,
            type: spot.category,
            distance: 'variabel',
            duration: 'variabel',
            elevation: 'variabel',
            difficulty: spot.difficulty,
            dogFriendly: spot.dogFriendly,
            dogNotes: spot.dogNotes,
            strollerFriendly: spot.strollerFriendly,
            strollerNotes: spot.strollerNotes,
            familyKidsFriendly: spot.familyFriendly,
            description: spot.insiderStory,
            xp: 200,
            image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop&auto=format',
          }
          setExtraTours(prev => [t, ...prev])
        }}
      />
    </div>
  )
}
"""

(src / "pages" / "Explore.tsx").write_text(explore_tsx, encoding="utf-8")
print("Explore.tsx done")
(src / "pages" / "Tours.tsx").write_text(tours_tsx, encoding="utf-8")
print("Tours.tsx done")
