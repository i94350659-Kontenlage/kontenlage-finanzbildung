const fs = require('fs');
const target = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src/pages/Explore.tsx';

const code = `import React, { useState } from 'react'
import TravelMap from '../components/TravelMap'
import StoryGeneratorModal from '../components/StoryGeneratorModal'
import ReservationModal from '../components/ReservationModal'
import { createGoogleCalendarUrl } from '../utils/calendarExport'
import { storyPins, activities } from '../data/data'
import { useTravel } from '../context/TravelContext'

const cats = ['All', 'Nature', 'Food', 'Surf', 'History', 'Night']
const actCats = ['All', 'Family', 'Extreme', 'Culture', 'Pets']

export default function Explore() {
  const { revealedPins, scratchSecret, triggerHaptic } = useTravel()
  const [storyFilter, setStoryFilter] = useState('All')
  const [actFilter, setActFilter] = useState('All')
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

  const filteredPins = storyFilter === 'All' ? storyPins : storyPins.filter(p => p.category === storyFilter)
  const filteredActs = actFilter === 'All' ? activities : activities.filter(a => a.cat === actFilter)

  // Pins for Leaflet Map
  const mapPinCoords: Record<number, { lat: number; lng: number }> = {
    1: { lat: 38.7914, lng: -9.4756 },
    2: { lat: 38.7122, lng: -9.1331 },
    3: { lat: 39.6022, lng: -9.0703 },
    4: { lat: 38.7900, lng: -9.3892 },
    5: { lat: 38.9639, lng: -9.4175 },
    6: { lat: 41.1539, lng: -7.7928 },
  }

  const mapPins = storyPins.map(p => ({
    id: p.id,
    title: p.location,
    location: p.tag,
    lat: mapPinCoords[p.id]?.lat || 38.75,
    lng: mapPinCoords[p.id]?.lng || -9.2,
    category: p.category,
    rating: p.rating,
    xp: p.xp,
    isUnlocked: revealedPins.includes(p.id),
  }))

  const handleCalendarExport = (pin: typeof storyPins[0]) => {
    triggerHaptic(15)
    const calUrl = createGoogleCalendarUrl({
      title: \`Expedition: \${pin.location}\`,
      description: \`\${pin.story}\\n\\nGPS: \${pin.gps}\\nKategorie: \${pin.tag}\`,
      location: pin.location,
    })
    window.open(calUrl, '_blank')
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">38°42'N · 9°08'W — Lisboa & Atlantic Coast</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Explore Map & Secrets</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">discover what regular maps don't show</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0C1825] border border-[rgba(201,168,76,0.2)] rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)]">
              {revealedPins.length}/{storyPins.length} Secrets freigeschaltet
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-10 pb-24 md:pb-8">
        {/* INTERACTIVE OBSIDIAN LEAFLET MAP */}
        <div>
          <TravelMap pins={mapPins} height="380px" />
        </div>

        {/* GOLDEN STORY PINS */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="font-display text-[#F4E4C1] text-lg font-bold">Golden Story Pins</h2>
              <p className="font-mono text-[0.62rem] text-[#8A9AAA]">Verifizierte GPS-Geheimnisse von Einheimischen</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setStoryFilter(c)}
                  className={\`btn text-[0.65rem] py-1 px-3 \${storyFilter === c ? 'btn-primary' : 'btn-ghost'}\`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPins.map(pin => {
              const isUnlocked = revealedPins.includes(pin.id)
              return (
                <div key={pin.id} className="card overflow-hidden group flex flex-col justify-between">
                  <div>
                    <div className="relative h-40">
                      <img
                        src={pin.image}
                        alt={pin.location}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                      <span className="absolute top-2 left-2 font-mono text-[0.6rem] bg-[rgba(12,24,37,0.85)] border border-[rgba(201,168,76,0.3)] text-[rgba(201,168,76,0.9)] px-2 py-0.5 rounded-full">
                        {pin.tag}
                      </span>
                      <span className="absolute top-2 right-2 font-mono text-[0.6rem] text-emerald-400/90 font-bold bg-[#0C1825]/80 px-2 py-0.5 rounded-full">
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
                          className="btn btn-secondary w-full text-xs py-2 mb-3"
                        >
                          🪙 Rubbeln um GPS freizuschalten
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="px-4 pb-4 pt-1 border-t border-[rgba(201,168,76,0.1)] flex gap-2">
                    <button
                      onClick={() => handleCalendarExport(pin)}
                      className="btn btn-ghost flex-1 text-[0.62rem] py-1.5"
                      title="Zu Google Kalender hinzufügen"
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
                      title="9:16 Social Story generieren"
                    >
                      📲 Als Story
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ACTIVITIES & B2B DIRECT RESERVATIONS */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="font-display text-[#F4E4C1] text-lg font-bold">Aktivitäten & Host Reservierungen</h2>
              <p className="font-mono text-[0.62rem] text-[#8A9AAA]">0% Provision · Direkt beim lokalen Anbieter reservieren</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {actCats.map(c => (
                <button
                  key={c}
                  onClick={() => setActFilter(c)}
                  className={\`btn text-[0.65rem] py-1 px-3 \${actFilter === c ? 'btn-primary' : 'btn-ghost'}\`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActs.map(a => (
              <div key={a.id} className="card p-4 flex flex-col justify-between hover:border-[rgba(201,168,76,0.4)] transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[#F4E4C1] text-sm font-bold leading-tight mb-0.5">{a.name}</p>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[#C9A84C] text-[0.65rem]">★ {a.rating}</span>
                      <span className="font-mono text-[#8A9AAA] text-[0.62rem]">{a.participants}</span>
                    </div>
                  </div>
                  <span className="font-display text-[#C9A84C] font-bold text-sm flex-shrink-0">{a.price}</span>
                </div>

                <button
                  onClick={() =>
                    setReservationModal({
                      isOpen: true,
                      hostName: a.name,
                      city: 'Lisboa & Atlantic Coast',
                      category: a.cat,
                    })
                  }
                  className="btn btn-secondary w-full text-xs py-2"
                >
                  Platz / Tour anfragen (0% Fee) →
                </button>
              </div>
            ))}
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
      </div>
    </div>
  )
}
`;

fs.writeFileSync(target, code, 'utf8');
console.log('Explore.tsx written successfully!');
