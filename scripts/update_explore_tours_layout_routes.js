const fs = require('fs');
const path = require('path');

const srcDir = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src';

// ─── 1. routes.ts ───
const routesCode = `import Home from './pages/Home'
import Explore from './pages/Explore'
import ScratchPage from './pages/ScratchPage'
import BadgesPage from './pages/BadgesPage'
import Tours from './pages/Tours'
import Host from './pages/Host'
import Radar from './pages/Radar'
import AIConcierge from './pages/AIConcierge'
import Checklists from './pages/Checklists'
import Pricing from './pages/Pricing'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Passport from './pages/Passport'
import WanderBond from './pages/WanderBond'

export const routes = [
  { path: '/', component: Home },
  { path: '/explore', component: Explore },
  { path: '/scratch', component: ScratchPage },
  { path: '/badges', component: BadgesPage },
  { path: '/tours', component: Tours },
  { path: '/host', component: Host },
  { path: '/radar', component: Radar },
  { path: '/ai', component: AIConcierge },
  { path: '/checklists', component: Checklists },
  { path: '/pricing', component: Pricing },
  { path: '/profile', component: Profile },
  { path: '/login', component: Login },
  { path: '/passport', component: Passport },
  { path: '/wanderbond', component: WanderBond },
]
`;

fs.writeFileSync(path.join(srcDir, 'routes.ts'), routesCode, 'utf8');
console.log('routes.ts updated with /wanderbond');

// ─── 2. Layout.tsx ───
const layoutCode = `import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import MobileBottomNav from './MobileBottomNav'
import { useTravel } from '../context/TravelContext'

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/explore', label: 'Explore & Map', icon: '🧭' },
  { path: '/scratch', label: 'Scratch Cards', icon: '🪙' },
  { path: '/passport', label: 'Digital Passport', icon: '🛂' },
  { path: '/wanderbond', label: 'WanderBond™ DNA', icon: '🧬' },
  { path: '/badges', label: '460+ Badges & Merch', icon: '🏷️' },
  { path: '/tours', label: 'Community Tours', icon: '🗺️' },
  { path: '/radar', label: 'Hazard & Scams', icon: '⚠️' },
  { path: '/ai', label: 'AI Concierge', icon: '✨' },
  { path: '/host', label: 'Host Portal', icon: '🏢' },
  { path: '/pricing', label: 'Pricing & Plans', icon: '💳' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user } = useTravel()

  return (
    <div className="min-h-screen bg-[#0C1825] flex flex-col md:flex-row text-[#F4E4C1]">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[rgba(201,168,76,0.15)] bg-[#0C1825] p-5 justify-between flex-shrink-0 min-h-screen sticky top-0">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-xl shadow-lg border border-[#F4E4C1]">
              🧭
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-wider text-[#F4E4C1] block leading-none">
                Scratch'n'Travel
              </span>
              <span className="font-mono text-[0.58rem] text-[#C9A84C] tracking-widest uppercase">
                WanderBond Engine
              </span>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={\`flex items-center gap-3 px-3 py-2.5 rounded-xl font-display text-xs transition-all duration-150 \${
                    active
                      ? 'bg-gradient-to-r from-[#C9A84C] to-[#E8C460] text-[#0C1825] font-bold shadow-md'
                      : 'text-[#8A9AAA] hover:text-[#F4E4C1] hover:bg-[#152539]'
                  }\`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Mini Card */}
        <div className="pt-4 border-t border-[rgba(201,168,76,0.15)]">
          <Link to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#152539] transition-colors">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-xs flex-shrink-0">
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs font-bold text-[#F4E4C1] truncate">{user.name}</p>
              <p className="font-mono text-[0.6rem] text-[#C9A84C] truncate">Lvl {user.level} · {user.xp} XP</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-[rgba(201,168,76,0.15)] bg-[#0C1825] sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🧭</span>
          <span className="font-display font-bold text-sm text-[#F4E4C1]">Scratch'n'Travel</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/wanderbond" className="btn btn-ghost text-[0.65rem] py-1 px-2.5">
            🧬 DNA
          </Link>
          <Link to="/profile" className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-[#0C1825] font-bold text-xs">
            {user.initials}
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav />
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/Layout.tsx'), layoutCode, 'utf8');
console.log('Layout.tsx updated');

// ─── 3. Explore.tsx (with Dog, Stroller & Difficulty Filters + Submit Spot) ───
const exploreCode = `import React, { useState, useMemo } from 'react'
import TravelMap from '../components/TravelMap'
import StoryGeneratorModal from '../components/StoryGeneratorModal'
import ReservationModal from '../components/ReservationModal'
import SubmitSpotModal from '../components/SubmitSpotModal'
import { createGoogleCalendarUrl } from '../utils/calendarExport'
import { storyPins, activities, StoryPin } from '../data/data'
import { useTravel } from '../context/TravelContext'
import { Link } from 'react-router-dom'

const cats = ['All', 'Nature', 'Food', 'Surf']

export default function Explore() {
  const { revealedPins, scratchSecret, triggerHaptic } = useTravel()
  const [storyFilter, setStoryFilter] = useState('All')
  const [filterDog, setFilterDog] = useState(false)
  const [filterStroller, setFilterStroller] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [customSpots, setCustomSpots] = useState<StoryPin[]>([])

  const [storyModalData, setStoryModalData] = useState<{
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
    xp: 100,
  })

  const [reservationModal, setReservationModal] = useState<{
    isOpen: boolean
    hostName: string
    city: string
    category: string
  }>({
    isOpen: false,
    hostName: '',
    city: '',
    category: '',
  })

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  const allPins = useMemo(() => [...customSpots, ...storyPins], [customSpots])

  const filteredPins = useMemo(() => {
    return allPins.filter(pin => {
      if (storyFilter !== 'All' && pin.category !== storyFilter) return false
      if (filterDog && !pin.dogFriendly) return false
      if (filterStroller && !pin.strollerFriendly) return false
      if (filterDifficulty !== 'all' && pin.difficulty !== filterDifficulty) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return pin.location.toLowerCase().includes(q) || pin.story.toLowerCase().includes(q) || pin.tag.toLowerCase().includes(q)
      }
      return true
    })
  }, [allPins, storyFilter, filterDog, filterStroller, filterDifficulty, searchQuery])

  // Pins for Leaflet Map
  const mapPins = filteredPins.map(p => ({
    id: p.id,
    title: p.location,
    location: p.tag,
    lat: p.gps.includes('°') ? 38.75 + (p.id * 0.04) : 38.75,
    lng: p.gps.includes('°') ? -9.2 - (p.id * 0.03) : -9.2,
    category: p.category,
    rating: p.rating,
    xp: p.xp,
    isUnlocked: revealedPins.includes(p.id),
  }))

  const handleCalendarExport = (pin: StoryPin) => {
    triggerHaptic(15)
    const calUrl = createGoogleCalendarUrl({
      title: \`Expedition: \${pin.location}\`,
      description: \`\${pin.story}\\n\\nGPS: \${pin.gps}\\nSchwierigkeit: \${pin.difficulty}/5\\nHundefreundlich: \${pin.dogFriendly ? 'Ja' : 'Nein'}\\nKinderwagen: \${pin.strollerFriendly ? 'Ja' : 'Nein'}\`,
      location: pin.location,
    })
    window.open(calUrl, '_blank')
  }

  const difficultyNames = ['', 'Sehr leicht', 'Leicht', 'Moderat', 'Anspruchsvoll', 'Alpin/Extrem']

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Local Secrets · Dog & Stroller Friendly · 1–5 Difficulty Ratings</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Explore Map & Secret Spots</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">insider gems shared by passionate locals</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                triggerHaptic(15)
                setIsSubmitModalOpen(true)
              }}
              className="btn btn-primary text-xs py-2 px-3 shadow-lg font-bold"
            >
              ➕ Secret Spot einstellen (+150 XP)
            </button>
            <Link to="/wanderbond" className="btn btn-secondary text-xs py-2 px-3">
              🧬 Hobby-DNA anpassen
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-24 md:pb-8">
        {/* INTERACTIVE OBSIDIAN LEAFLET MAP */}
        <div>
          <TravelMap pins={mapPins} height="380px" />
        </div>

        {/* SEARCH & FILTERS STRIP */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Suche nach Bucht, Klippe, Taverne, Wald oder Ort…"
              className="field flex-1"
            />
            {/* Dog & Stroller Toggles */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  triggerHaptic(10)
                  setFilterDog(!filterDog)
                }}
                className={\`btn text-xs py-2 px-3.5 flex items-center gap-1.5 \${
                  filterDog ? 'btn-primary font-bold' : 'btn-ghost'
                }\`}
              >
                🐕 Hundefreundlich
              </button>
              <button
                onClick={() => {
                  triggerHaptic(10)
                  setFilterStroller(!filterStroller)
                }}
                className={\`btn text-xs py-2 px-3.5 flex items-center gap-1.5 \${
                  filterStroller ? 'btn-primary font-bold' : 'btn-ghost'
                }\`}
              >
                👶 Kinderwagen
              </button>
            </div>
          </div>

          {/* Difficulty and Category filters */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-[rgba(201,168,76,0.1)]">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="font-mono text-[0.62rem] text-[#8A9AAA] mr-1">Schwierigkeit:</span>
              <button
                onClick={() => setFilterDifficulty('all')}
                className={\`btn text-[0.62rem] py-1 px-2.5 \${filterDifficulty === 'all' ? 'btn-primary' : 'btn-ghost'}\`}
              >
                Alle
              </button>
              {[1, 2, 3, 4, 5].map(d => (
                <button
                  key={d}
                  onClick={() => {
                    triggerHaptic(10)
                    setFilterDifficulty(d)
                  }}
                  className={\`btn text-[0.62rem] py-1 px-2.5 \${filterDifficulty === d ? 'btn-primary' : 'btn-ghost'}\`}
                >
                  Stufe {d} ({difficultyNames[d]})
                </button>
              ))}
            </div>

            <div className="flex gap-1.5">
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setStoryFilter(c)}
                  className={\`btn text-[0.62rem] py-1 px-3 \${storyFilter === c ? 'btn-primary' : 'btn-ghost'}\`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECRET SPOTS GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[#F4E4C1] text-xl font-bold">
              Verifizierte Secret Spots ({filteredPins.length})
            </h2>
            <span className="font-mono text-[0.65rem] text-[#8A9AAA]">
              {revealedPins.length} freigeschaltet
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPins.map(pin => {
              const isUnlocked = revealedPins.includes(pin.id)
              return (
                <div key={pin.id} className="card overflow-hidden group flex flex-col justify-between">
                  <div>
                    <div className="relative h-44">
                      <img
                        src={pin.image}
                        alt={pin.location}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                      
                      {/* Tags Bar */}
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-[80%]">
                        {pin.dogFriendly && (
                          <span className="font-mono text-[0.58rem] bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-2 py-0.5 rounded-full font-bold shadow">
                            🐕 Hund
                          </span>
                        )}
                        {pin.strollerFriendly && (
                          <span className="font-mono text-[0.58rem] bg-blue-950/90 border border-blue-500/60 text-blue-300 px-2 py-0.5 rounded-full font-bold shadow">
                            👶 Kinderwagen
                          </span>
                        )}
                        <span className="font-mono text-[0.58rem] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.3)] text-[#C9A84C] px-2 py-0.5 rounded-full">
                          Stufe {pin.difficulty}/5
                        </span>
                      </div>

                      <span className="absolute top-2 right-2 font-mono text-[0.6rem] text-emerald-400 font-bold bg-[#0C1825]/85 px-2.5 py-0.5 rounded-full">
                        +{pin.xp} XP
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-[0.65rem] flex-shrink-0">
                          {pin.avatar}
                        </div>
                        <div>
                          <p className="font-display text-[#F4E4C1] text-sm font-semibold leading-tight">{pin.local}</p>
                          <p className="font-mono text-[0.6rem] text-[#8A9AAA]">{pin.location}</p>
                        </div>
                      </div>

                      <p className="font-body text-[#8A9AAA] text-sm leading-relaxed mb-3 line-clamp-3">{pin.story}</p>

                      {/* Attribute Info Boxes */}
                      {(pin.dogDetails || pin.strollerDetails) && (
                        <div className="bg-[#0C1825] rounded-lg p-2.5 mb-3 text-[0.68rem] font-mono text-[#8A9AAA] space-y-1">
                          {pin.dogDetails && (
                            <p className="text-emerald-400/90">🐕 {pin.dogDetails}</p>
                          )}
                          {pin.strollerDetails && (
                            <p className="text-blue-400/90">👶 {pin.strollerDetails}</p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[#C9A84C] text-sm">
                          {'★'.repeat(Math.floor(pin.rating))}
                          <span className="text-[#8A9AAA] text-xs ml-1">{pin.rating}</span>
                        </span>
                        <span className="font-mono text-[0.62rem] text-[#8A9AAA]">{pin.reviews} Reviews</span>
                      </div>

                      {isUnlocked ? (
                        <div className="bg-[#0C1825] rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
                          <span className="text-emerald-400 text-xs">📍</span>
                          <span className="coord text-emerald-400 font-bold">{pin.gps}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => scratchSecret(pin.id, pin.xp, pin.location, pin.gps, pin.category)}
                          className="btn btn-secondary w-full text-xs py-2 mb-3 font-bold"
                        >
                          🪙 GPS-Koordinaten freirubbeln
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="px-4 pb-4 pt-1 border-t border-[rgba(201,168,76,0.1)] flex gap-2">
                    <button
                      onClick={() => handleCalendarExport(pin)}
                      className="btn btn-ghost flex-1 text-[0.62rem] py-1.5"
                    >
                      📅 In Kalender
                    </button>
                    <button
                      onClick={() =>
                        setStoryModalData({
                          isOpen: true,
                          title: pin.location,
                          location: pin.tag,
                          gps: pin.gps,
                          xp: pin.xp,
                          image: pin.image,
                        })
                      }
                      className="btn btn-ghost flex-1 text-[0.62rem] py-1.5"
                    >
                      📲 Als Story
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* MODALS */}
        <StoryGeneratorModal
          isOpen={storyModalData.isOpen}
          onClose={() => setStoryModalData(p => ({ ...p, isOpen: false }))}
          data={storyModalData}
        />

        <ReservationModal
          isOpen={reservationModal.isOpen}
          onClose={() => setReservationModal(p => ({ ...p, isOpen: false }))}
          hostName={reservationModal.hostName}
          city={reservationModal.city}
          category={reservationModal.category}
        />

        <SubmitSpotModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSuccess={(spot) => {
            const newPin: StoryPin = {
              id: Date.now(),
              local: 'Du (Community)',
              avatar: 'YOU',
              location: spot.location + ' (' + spot.title + ')',
              story: spot.insiderStory,
              rating: 5.0,
              reviews: 1,
              gps: '38°45\\'00\\"N · 9°15\\'00\\"W',
              locked: false,
              tag: spot.category + ' Secret',
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
            setCustomSpots(prev => [newPin, ...prev])
          }}
        />
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Explore.tsx'), exploreCode, 'utf8');
console.log('Explore.tsx updated');

// ─── 4. Tours.tsx (with Dog, Stroller & Difficulty Badges) ───
const toursCode = `import React, { useState, useMemo } from 'react'
import { tours, CommunityTour } from '../data/data'
import { createGoogleCalendarUrl } from '../utils/calendarExport'
import StoryGeneratorModal from '../components/StoryGeneratorModal'
import SubmitSpotModal from '../components/SubmitSpotModal'
import { useTravel } from '../context/TravelContext'

export default function Tours() {
  const { triggerHaptic } = useTravel()
  const [filterDog, setFilterDog] = useState(false)
  const [filterStroller, setFilterStroller] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState<number | 'all'>('all')
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [customTours, setCustomTours] = useState<CommunityTour[]>([])

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

  const allTours = useMemo(() => [...customTours, ...tours], [customTours])

  const filteredTours = useMemo(() => {
    return allTours.filter(t => {
      if (filterDog && !t.dogFriendly) return false
      if (filterStroller && !t.strollerFriendly) return false
      if (filterDifficulty !== 'all' && t.difficulty !== filterDifficulty) return false
      return true
    })
  }, [allTours, filterDog, filterStroller, filterDifficulty])

  const handleExportGPX = (t: CommunityTour) => {
    triggerHaptic(20)
    const gpxData = \`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Scratch\\'n\\'Travel - https://scratchntravel.com">
  <metadata>
    <name>\${t.title}</name>
    <desc>Created by \${t.creator} - Duration: \${t.duration}, Distance: \${t.distance}</desc>
  </metadata>
  <trk>
    <name>\${t.title}</name>
    <trkseg>
      <trkpt lat="38.7223" lon="-9.1393"><ele>50</ele><name>Start</name></trkpt>
      <trkpt lat="38.7950" lon="-9.4200"><ele>120</ele><name>Stop</name></trkpt>
      <trkpt lat="38.7900" lon="-9.4750"><ele>30</ele><name>Finish</name></trkpt>
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

  const handleGoogleCalendar = (t: CommunityTour) => {
    triggerHaptic(15)
    const calUrl = createGoogleCalendarUrl({
      title: t.title,
      description: \`Wanderung / Tour: \${t.title}\\nErsteller: \${t.creator}\\nDistanz: \${t.distance} · Dauer: \${t.duration} · Schwierigkeit: \${t.difficulty}/5\`,
      location: 'Portugal & Alpen',
      durationHours: 3,
    })
    window.open(calUrl, '_blank')
  }

  const difficultyNames = ['', 'Sehr leicht', 'Leicht', 'Moderat', 'Anspruchsvoll', 'Alpin/Extrem']

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Walking Routes · 1-Click GPX for Komoot · Dog & Stroller Verified</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Community Tours & Routes</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">routes crafted by passionate local walkers</p>
          </div>
          <button
            onClick={() => {
              triggerHaptic(15)
              setIsSubmitModalOpen(true)
            }}
            className="btn btn-primary text-xs py-2 px-4 shadow-lg font-bold"
          >
            ➕ Eigene Tour einstellen (+150 XP)
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* FILTER STRIP */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                triggerHaptic(10)
                setFilterDog(!filterDog)
              }}
              className={\`btn text-xs py-1.5 px-3.5 \${filterDog ? 'btn-primary font-bold' : 'btn-ghost'}\`}
            >
              🐕 Hundefreundlich
            </button>
            <button
              onClick={() => {
                triggerHaptic(10)
                setFilterStroller(!filterStroller)
              }}
              className={\`btn text-xs py-1.5 px-3.5 \${filterStroller ? 'btn-primary font-bold' : 'btn-ghost'}\`}
            >
              👶 Kinderwagentauglich
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-mono text-[0.62rem] text-[#8A9AAA]">Schwierigkeit:</span>
            <button
              onClick={() => setFilterDifficulty('all')}
              className={\`btn text-[0.62rem] py-1 px-2.5 \${filterDifficulty === 'all' ? 'btn-primary' : 'btn-ghost'}\`}
            >
              Alle
            </button>
            {[1, 2, 3, 4, 5].map(d => (
              <button
                key={d}
                onClick={() => {
                  triggerHaptic(10)
                  setFilterDifficulty(d)
                }}
                className={\`btn text-[0.62rem] py-1 px-2.5 \${filterDifficulty === d ? 'btn-primary' : 'btn-ghost'}\`}
              >
                Stufe {d} ({difficultyNames[d]})
              </button>
            ))}
          </div>
        </div>

        {/* TOURS GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTours.map(tour => (
            <div key={tour.id} className="card overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-48">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {tour.dogFriendly && (
                      <span className="font-mono text-[0.6rem] bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        🐕 Hund
                      </span>
                    )}
                    {tour.strollerFriendly && (
                      <span className="font-mono text-[0.6rem] bg-blue-950/90 border border-blue-500/60 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                        👶 Kinderwagen
                      </span>
                    )}
                    <span className="font-mono text-[0.6rem] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.3)] text-[#C9A84C] px-2 py-0.5 rounded-full">
                      Stufe {tour.difficulty}/5
                    </span>
                  </div>

                  <span className="absolute top-3 right-3 font-mono text-[0.62rem] font-bold bg-emerald-500/90 text-white px-2.5 py-1 rounded-full shadow-md">
                    ★ {tour.rating} ({tour.reviews})
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-[#F4E4C1] text-lg font-bold mb-1">{tour.title}</h3>
                  <p className="font-body text-[#8A9AAA] text-sm mb-3">Erstellt von {tour.creator} · {tour.stops} Geheim-Stopps</p>

                  {/* Accessibility details */}
                  {(tour.dogDetails || tour.strollerDetails) && (
                    <div className="bg-[#0C1825] rounded-lg p-2.5 mb-3 text-[0.68rem] font-mono text-[#8A9AAA] space-y-1">
                      {tour.dogDetails && <p className="text-emerald-400/90">🐕 {tour.dogDetails}</p>}
                      {tour.strollerDetails && <p className="text-blue-400/90">👶 {tour.strollerDetails}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      ['📏 Distanz', tour.distance],
                      ['⏱ Dauer', tour.duration],
                      ['🧗 Höhenmeter', tour.elevation],
                      ['🏃 Niveau', \`Stufe \${tour.difficulty}/5\`],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-[#0C1825] rounded-lg p-2 text-center border border-[rgba(201,168,76,0.15)]">
                        <p className="font-mono text-[0.55rem] text-[#8A9AAA] truncate">{l}</p>
                        <p className="font-display text-[#F4E4C1] font-bold text-[0.72rem] truncate">{v}</p>
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
                  📅 In Kalender
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
                  className="btn btn-ghost text-xs py-2 px-3"
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

        <SubmitSpotModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSuccess={(spot) => {
            const newTour: CommunityTour = {
              id: Date.now(),
              title: spot.title,
              creator: 'Du (Community)',
              avatar: 'YOU',
              distance: '5.5 km',
              duration: '2h 15m',
              difficulty: spot.difficulty,
              bestTime: 'Ganzjährig',
              stops: 4,
              likes: 1,
              category: spot.category,
              tags: ['Community', spot.category],
              image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&auto=format',
              rating: 5.0,
              reviews: 1,
              dogFriendly: spot.dogFriendly,
              dogDetails: spot.dogNotes,
              strollerFriendly: spot.strollerFriendly,
              strollerDetails: spot.strollerNotes,
              familyKidsFriendly: spot.familyFriendly,
              elevation: '80 m',
            }
            setCustomTours(prev => [newTour, ...prev])
          }}
        />
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Tours.tsx'), toursCode, 'utf8');
console.log('Tours.tsx updated');
`;

fs.writeFileSync('g:/B2B steuer Business Ideee 6.8.2026/scripts/update_explore_tours_layout_routes.js', CodeContent, 'utf8');
console.log('Saved update_explore_tours_layout_routes.js');
