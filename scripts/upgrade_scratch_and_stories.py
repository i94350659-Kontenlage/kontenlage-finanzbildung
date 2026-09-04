import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")

# ─── ScratchPage.tsx with Regional Country Filters ───────────────────────────
scratch_tsx = r"""import React, { useState, useMemo } from 'react'
import ScratchCard from '../components/ScratchCard'
import { storyPins } from '../data/data'
import { useTravel } from '../context/TravelContext'

const countriesList = [
  'Alle',
  '🇵🇹 Portugal',
  '🇪🇸 Spanien',
  '🇮🇹 Italien',
  '🇬🇷 Griechenland',
  '🇩🇪 DACH',
  '🇫🇷 Frankreich',
  '🇳🇴 Norwegen',
  '🇮🇸 Island',
  '🇯🇵 Japan',
  '🇮🇩 Bali',
]

export default function ScratchPage() {
  const { user, scratchedIds, triggerHaptic } = useTravel()
  const [selectedCountry, setSelectedCountry] = useState('Alle')
  const [filterScratched, setFilterScratched] = useState<'all' | 'locked' | 'revealed'>('all')

  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  const filteredPins = useMemo(() => {
    return storyPins.filter(pin => {
      if (selectedCountry !== 'Alle') {
        const flag = selectedCountry.slice(0, 2)
        if (!pin.countryFlag.includes(flag) && !pin.country.toLowerCase().includes(selectedCountry.toLowerCase())) {
          return false
        }
      }
      const isScratched = scratchedIds.includes(pin.id)
      if (filterScratched === 'locked' && isScratched) return false
      if (filterScratched === 'revealed' && !isScratched) return false
      return true
    })
  }, [selectedCountry, filterScratched, scratchedIds])

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Explorer Progress · Season I · Scratch &amp; Reveal Engine</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Interaktive Rubbelkarten</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">
          enthülle die geheimnisse unter der goldenen rubbelfolie
        </p>
      </div>

      <div className="p-6 pb-24 md:pb-8 space-y-6">
        {/* XP Dashboard */}
        <div className="parchment rounded-xl p-5 shadow-xl border border-[rgba(139,58,42,0.2)]">
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
                  style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, #8B3A2A, #C9A84C)' }}
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
              <p className="font-mono text-[0.58rem] text-[#8B3A2A]">
                Noch {user.xpNext - user.xp} XP bis Level {user.level + 1}
              </p>
            </div>
          </div>
        </div>

        {/* REGIONAL FILTER CONTROLS */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] space-y-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {countriesList.map(c => (
              <button
                key={c}
                onClick={() => {
                  triggerHaptic(10)
                  setSelectedCountry(c)
                }}
                className={`btn text-xs py-1.5 px-3 whitespace-nowrap flex-shrink-0 ${
                  selectedCountry === c ? 'btn-primary font-bold shadow-md' : 'btn-ghost'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center justify-between border-t border-[rgba(201,168,76,0.1)] pt-2 flex-wrap">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Alle Karten' },
                { id: 'locked', label: '🔒 Nur Gesperrte' },
                { id: 'revealed', label: '✓ Bereits Freigerubbelt' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    triggerHaptic(8)
                    setFilterScratched(opt.id as any)
                  }}
                  className={`btn text-[0.65rem] py-1 px-2.5 ${
                    filterScratched === opt.id ? 'btn-secondary font-bold' : 'btn-ghost'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="font-mono text-xs text-[#C9A84C]">
              {filteredPins.length} Rubbelkarten verfügbar
            </span>
          </div>
        </div>

        {/* SCRATCH CARDS PORTFOLIO */}
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPins.map(pin => {
              const isScratched = scratchedIds.includes(pin.id)
              return (
                <div key={pin.id} className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-between w-full px-1">
                    <span className="font-mono text-[0.6rem] border border-[rgba(201,168,76,0.25)] text-[#F4E4C1] px-2 py-0.5 rounded-full bg-[#152539]">
                      {pin.countryFlag} {pin.city} · {pin.tag}
                    </span>
                    <span className="font-mono text-emerald-400 text-[0.62rem] font-bold">+{pin.xp} XP</span>
                  </div>

                  {isScratched ? (
                    <div className="w-full h-[180px] card rounded-xl p-4 flex flex-col items-center justify-center gap-1 border-[rgba(201,168,76,0.4)] shadow-lg text-center bg-gradient-to-b from-[#152539] to-[#0C1825]">
                      <span className="text-3xl mb-1">📍</span>
                      <p className="font-display text-[#C9A84C] text-base font-bold">{pin.location}</p>
                      <p className="coord text-emerald-400 font-bold">{pin.gps}</p>
                      <span className="text-emerald-400 font-mono text-xs font-bold mt-1">
                        ✓ Vollständig enthüllt (+{pin.xp} XP)
                      </span>
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
"""

# ─── Stories.tsx with Audio / Voice Narrations & Upgraded Submission ─────────
stories_tsx = r"""import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { storyPins, StoryPin } from '../data/data'
import { useTravel } from '../context/TravelContext'
import SubmitSpotModal from '../components/SubmitSpotModal'

const cats = ['All', 'Nature', 'Food', 'Surf', 'Culture']

export default function Stories() {
  const { revealedPins, scratchSecret, triggerHaptic } = useTravel()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [extraStories, setExtraStories] = useState<StoryPin[]>([])
  const [activeVoiceStory, setActiveVoiceStory] = useState<number | null>(null)

  const allStories = useMemo(() => [...extraStories, ...storyPins], [extraStories])

  const filtered = useMemo(() => {
    return allStories.filter(p => {
      if (filter !== 'All' && p.category !== filter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          p.location.toLowerCase().includes(q) ||
          p.story.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.local.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [allStories, filter, search])

  const playVoiceNarration = (id: number) => {
    triggerHaptic(15)
    if (activeVoiceStory === id) {
      setActiveVoiceStory(null)
    } else {
      setActiveVoiceStory(id)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Authentic Local Oral History · Verified GPS Narratives</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Golden Story Pins &amp; Berichte</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">geschichten, die nur einheimische kennen</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                triggerHaptic(15)
                setIsSubmitOpen(true)
              }}
              className="btn btn-primary text-xs py-2 px-3 font-bold shadow-lg"
            >
              + Eigene Story einreichen (+150 XP)
            </button>
            <Link to="/explore" className="btn btn-secondary text-xs py-2 px-3">
              🗺️ Auf Karte ansehen
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* FILTER BAR */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] flex gap-3 flex-wrap items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Storys durchsuchen (z. B. Fatima, Bacalhau, Fado, Balos, Dolomiten)..."
            className="field flex-1 min-w-[200px]"
          />
          <div className="flex gap-1.5 flex-wrap">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => {
                  triggerHaptic(10)
                  setFilter(c)
                }}
                className={`btn text-xs py-1.5 px-3 ${filter === c ? 'btn-primary font-bold' : 'btn-ghost'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-[#C9A84C] ml-auto">
            {filtered.length} Berichte
          </span>
        </div>

        {/* STORIES GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(story => {
            const isUnlocked = revealedPins.includes(story.id)
            const isPlaying = activeVoiceStory === story.id
            return (
              <div key={story.id} className="card p-6 border-[rgba(201,168,76,0.25)] flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-sm shadow">
                        {story.avatar}
                      </div>
                      <div>
                        <p className="font-display text-[#F4E4C1] text-base font-bold">{story.local}</p>
                        <p className="font-mono text-xs text-[#8A9AAA]">
                          {story.countryFlag} {story.city} · {story.region}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[#C9A84C] bg-[#0C1825] border border-[rgba(201,168,76,0.3)] px-2.5 py-1 rounded-full font-bold">
                      +{story.xp} XP
                    </span>
                  </div>

                  <h3 className="font-display text-[#F4E4C1] text-lg font-bold mb-2">{story.location}</h3>
                  <div className="parchment p-4 rounded-xl text-[#2C1810] font-body text-sm leading-relaxed mb-4">
                    "{story.story}"
                  </div>

                  {isPlaying && (
                    <div className="bg-[#0C1825] p-3 rounded-xl border border-emerald-500/40 mb-4 flex items-center gap-3">
                      <span className="animate-pulse text-emerald-400 text-lg">🔊</span>
                      <div className="flex-1">
                        <p className="font-mono text-xs text-emerald-400 font-bold">Audio-Narration aktiv</p>
                        <p className="text-[0.65rem] text-[#8A9AAA]">Gelesen mit authentischem Akzent von {story.local}...</p>
                      </div>
                      <button onClick={() => setActiveVoiceStory(null)} className="btn btn-ghost text-xs py-1 px-2">
                        Stopp
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-mono text-[#8A9AAA] mb-3">
                    <span>★ {story.rating} ({story.reviews} Bewertungen)</span>
                    <span>Stufe {story.difficulty}/5</span>
                    {story.dogFriendly && <span className="text-emerald-400">🐕 Hundefreundlich</span>}
                  </div>
                </div>

                <div className="pt-3 border-t border-[rgba(201,168,76,0.15)] flex gap-2">
                  <button
                    onClick={() => playVoiceNarration(story.id)}
                    className={`btn text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5 font-bold ${
                      isPlaying ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    <span>{isPlaying ? '⏸️' : '🎙️'}</span>
                    <span>{isPlaying ? 'Pause' : 'Audio-Guide hören'}</span>
                  </button>
                  {isUnlocked ? (
                    <div className="bg-[#0C1825] border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                      <span>📍</span>
                      <span>{story.gps}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => scratchSecret(story.id, story.xp, story.location, story.gps, story.category)}
                      className="btn btn-primary text-xs py-2 px-3 font-bold"
                    >
                      🪙 GPS enthüllen
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <SubmitSpotModal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          onSuccess={spot => {
            const newStory: StoryPin = {
              id: Date.now(),
              local: 'Du (Community)',
              avatar: 'YOU',
              location: `${spot.location} — ${spot.title}`,
              city: spot.location,
              country: 'Global',
              countryFlag: '🌍',
              region: 'Community',
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
            setExtraStories(prev => [newStory, ...prev])
          }}
        />
      </div>
    </div>
  )
}
"""

(src / "pages" / "ScratchPage.tsx").write_text(scratch_tsx, encoding="utf-8")
print("ScratchPage.tsx upgraded successfully!")

(src / "pages" / "Stories.tsx").write_text(stories_tsx, encoding="utf-8")
print("Stories.tsx upgraded successfully!")
