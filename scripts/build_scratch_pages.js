const fs = require('fs');
const path = require('path');

const srcDir = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src';

// ─── 1. UPGRADE src/components/ScratchCard.tsx ───
const scratchCardContent = `import React, { useRef, useEffect, useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useTravel } from '../context/TravelContext'

interface ScratchCardProps {
  children: React.ReactNode
  width?: number
  height?: number
  onComplete?: () => void
  cardId?: number
  xpReward?: number
  locationName?: string
  gps?: string
  category?: string
}

export default function ScratchCard({
  children,
  width = 320,
  height = 200,
  onComplete,
  cardId,
  xpReward = 100,
  locationName = 'Secret Spot',
  gps = '38°47\\'29\\"N · 9°28\\'32\\"W',
  category = 'Nature',
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const [done, setDone] = useState(false)
  const [revealPct, setRevealPct] = useState(0)
  const completedRef = useRef(false)
  const { scratchSecret, triggerHaptic } = useTravel()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = \`\${width}px\`
    canvas.style.height = \`\${height}px\`
    ctx.scale(dpr, dpr)

    // Gold foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height)
    grad.addColorStop(0, '#8A6820')
    grad.addColorStop(0.25, '#C9A84C')
    grad.addColorStop(0.5, '#E8C460')
    grad.addColorStop(0.75, '#C9A84C')
    grad.addColorStop(1, '#A07830')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // Map grid pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    ctx.lineWidth = 0.5
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Compass rose hint
    const cx = width / 2
    const cy = height / 2 - 14
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.beginPath()
    ctx.moveTo(cx, cy - 18)
    ctx.lineTo(cx - 5, cy)
    ctx.lineTo(cx + 5, cy)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx, cy + 18)
    ctx.lineTo(cx - 5, cy)
    ctx.lineTo(cx + 5, cy)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx + 18, cy)
    ctx.lineTo(cx, cy - 5)
    ctx.lineTo(cx, cy + 5)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx - 18, cy)
    ctx.lineTo(cx, cy - 5)
    ctx.lineTo(cx, cy + 5)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx, cy, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.font = "bold 13px 'Cinzel', serif"
    ctx.textAlign = 'center'
    ctx.fillText('✦  SCRATCH TO REVEAL  ✦', width / 2, height / 2 + 16)
    ctx.font = "11px 'DM Mono', monospace"
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.fillText('mit Finger oder Maus rubbeln', width / 2, height / 2 + 34)
  }, [width, height])

  const calcRevealed = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return 0
    const ctx = canvas.getContext('2d')
    if (!ctx) return 0
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++
    }
    return (transparent / (data.length / 4)) * 100
  }, [])

  const scratch = useCallback(
    (x: number, y: number) => {
      if (done) return
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, 32, 0, Math.PI * 2)
      ctx.fill()

      const pct = calcRevealed()
      setRevealPct(Math.round(pct))

      if (pct > 55 && !completedRef.current) {
        completedRef.current = true
        setDone(true)

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C9A84C', '#E8C460', '#F4E4C1', '#2C1810'],
          })
        } catch (e) {}

        if (cardId) {
          scratchSecret(cardId, xpReward, locationName, gps, category)
        }
        onComplete?.()
      }
    },
    [done, calcRevealed, onComplete, cardId, xpReward, locationName, gps, category, scratchSecret]
  )

  const getPos = (canvas: HTMLCanvasElement, cx: number, cy: number) => {
    const rect = canvas.getBoundingClientRect()
    return { x: cx - rect.left, y: cy - rect.top }
  }

  return (
    <div className="relative select-none max-w-full" style={{ width, height }}>
      {/* Reveal content underneath */}
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#152539] border border-[rgba(201,168,76,0.25)] flex items-center justify-center">
        {children}
      </div>

      {/* Canvas overlay */}
      {!done && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-xl cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
          onMouseDown={e => {
            isDrawing.current = true
            const p = getPos(e.currentTarget, e.clientX, e.clientY)
            scratch(p.x, p.y)
            triggerHaptic(10)
          }}
          onMouseMove={e => {
            if (!isDrawing.current) return
            const p = getPos(e.currentTarget, e.clientX, e.clientY)
            scratch(p.x, p.y)
          }}
          onMouseUp={() => {
            isDrawing.current = false
          }}
          onMouseLeave={() => {
            isDrawing.current = false
          }}
          onTouchStart={e => {
            isDrawing.current = true
            const p = getPos(e.currentTarget, e.touches[0].clientX, e.touches[0].clientY)
            scratch(p.x, p.y)
            triggerHaptic(15)
          }}
          onTouchMove={e => {
            e.preventDefault()
            const p = getPos(e.currentTarget, e.touches[0].clientX, e.touches[0].clientY)
            scratch(p.x, p.y)
          }}
          onTouchEnd={() => {
            isDrawing.current = false
          }}
        />
      )}

      {!done && revealPct > 5 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[rgba(12,24,37,0.85)] rounded-full px-3 py-0.5 font-mono text-[0.6rem] text-[#C9A84C] pointer-events-none">
          {revealPct}% freigerubbelt
        </div>
      )}
      {done && (
        <div className="absolute top-2 right-2 bg-emerald-500/90 text-white font-mono text-[0.6rem] font-bold px-2.5 py-1 rounded-full pointer-events-none shadow-md">
          +{xpReward} XP ✓
        </div>
      )}
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/ScratchCard.tsx'), scratchCardContent, 'utf8');
console.log('Updated ScratchCard.tsx');

// ─── 2. UPGRADE src/pages/BadgesPage.tsx ───
const badgesPageContent = `import React, { useState, useMemo } from 'react'
import { useTravel } from '../context/TravelContext'
import { tierGradient, tierBorder, BadgeItem } from '../data/allBadges'
import { productBadges } from '../data/data'

type CategoryFilter = 'Alle' | 'Land' | 'Region' | 'Meilenstein' | 'Aktivitaet' | 'Spezial' | 'Hilfe & Rettung' | 'Scam-Alarm' | 'Hobby-Matcher' | 'Orte mit Seele' | 'Tools & Engagement' | 'Merch'

export default function BadgesPage() {
  const { badges, triggerHaptic } = useTravel()
  const [category, setCategory] = useState<CategoryFilter>('Alle')
  const [tierFilter, setTierFilter] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic'>('all')
  const [search, setSearch] = useState('')
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null)

  const categories: CategoryFilter[] = [
    'Alle',
    'Land',
    'Region',
    'Meilenstein',
    'Aktivitaet',
    'Spezial',
    'Hilfe & Rettung',
    'Scam-Alarm',
    'Hobby-Matcher',
    'Orte mit Seele',
    'Tools & Engagement',
    'Merch',
  ]

  const filteredBadges = useMemo(() => {
    return badges.filter(b => {
      if (category !== 'Alle' && category !== 'Merch' && b.category !== category) return false
      if (tierFilter !== 'all' && b.tier !== tierFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return b.name.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q) || b.motif.toLowerCase().includes(q)
      }
      return true
    })
  }, [badges, category, tierFilter, search])

  const unlockedCount = badges.filter(b => b.unlocked).length

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <p className="coord mb-1">Authentic Collector System · 460+ Master Designs · 300 DPI Vector Ready</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Badges & Print-on-Demand Merch</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">collect your journey as a luxury artefact</p>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* Progress Strip */}
        <div className="parchment rounded-xl p-5 flex flex-wrap gap-6 items-center shadow-lg border border-[rgba(139,58,42,0.2)]">
          <div className="flex-1 min-w-[240px]">
            <div className="flex justify-between mb-1">
              <span className="font-display text-[#2C1810] font-bold text-sm">Gesamtfortschritt</span>
              <span className="font-mono text-[0.65rem] text-[#8B3A2A]">
                {unlockedCount} / {badges.length} freigeschaltet ({Math.round((unlockedCount / badges.length) * 100)}%)
              </span>
            </div>
            <div className="h-3 bg-[rgba(44,24,16,0.12)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: \`\${Math.round((unlockedCount / badges.length) * 100)}%\`,
                  background: 'linear-gradient(90deg, #8B3A2A, #C9A84C)',
                }}
              />
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4">
            {(['bronze', 'silver', 'gold', 'platinum', 'mythic'] as const).map(tier => {
              const count = badges.filter(b => b.tier === tier && b.unlocked).length
              return (
                <div key={tier} className="text-center">
                  <div className="w-7 h-7 rounded-full mx-auto mb-1 shadow-sm" style={{ background: tierGradient[tier] }} />
                  <p className="font-mono text-[0.55rem] text-[#2C1810] capitalize">{tier}</p>
                  <p className="font-display text-[#2C1810] font-bold text-xs">{count}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Suche nach Land, Meilenstein, Motiv oder Begriff…"
              className="field flex-1"
            />
            <div className="flex gap-1.5 p-1 bg-[#152539] border border-[rgba(201,168,76,0.15)] rounded-xl overflow-x-auto">
              {(['all', 'bronze', 'silver', 'gold', 'platinum', 'mythic'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    triggerHaptic(10)
                    setTierFilter(t)
                  }}
                  className={\`btn text-[0.62rem] py-1 px-3 capitalize \${
                    tierFilter === t ? 'btn-primary font-bold' : 'btn-ghost border-transparent'
                  }\`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => {
                  triggerHaptic(10)
                  setCategory(c)
                }}
                className={\`btn text-[0.65rem] py-1 px-3 whitespace-nowrap flex-shrink-0 \${
                  category === c ? 'btn-primary' : 'btn-ghost'
                }\`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* MERCH TAB VIEW */}
        {category === 'Merch' ? (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productBadges.map(b => (
                <div key={b.id} className="card overflow-hidden group">
                  <div className="relative h-52 bg-[#0C1825]">
                    <img
                      src={b.image}
                      alt={b.name}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    {b.bestseller && (
                      <span className="absolute top-3 left-3 font-mono text-[0.62rem] font-bold text-[#0C1825] px-2.5 py-1 rounded-full shimmer-anim">
                        BESTSELLER
                      </span>
                    )}
                    <span className="absolute top-3 right-3 font-mono text-[0.6rem] bg-[rgba(12,24,37,0.85)] border border-[rgba(201,168,76,0.25)] text-[rgba(201,168,76,0.85)] px-2 py-0.5 rounded-full">
                      {b.type}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[#F4E4C1] font-bold mb-1">{b.name}</h3>
                    <p className="font-body text-[#8A9AAA] text-sm leading-relaxed mb-3">{b.desc}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[0.65rem] text-[#8A9AAA]">{b.size}</span>
                      <span className="font-display text-[#C9A84C] text-xl font-bold">{b.price}</span>
                    </div>
                    <button
                      onClick={() => alert(\`In den Warenkorb gelegt: \${b.name}\`)}
                      className="btn btn-secondary w-full text-xs"
                    >
                      🛍️ Jetzt bestellen (Gelato Sync)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* BADGES GRID */
          <div>
            <p className="font-mono text-[0.65rem] text-[#8A9AAA] mb-3">
              Zeige {filteredBadges.length} Badges (Klicke auf ein Badge für 300 DPI Merch-Vorschau)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredBadges.map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    triggerHaptic(15)
                    setSelectedBadge(b)
                  }}
                  className={\`card rounded-xl p-3.5 flex flex-col cursor-pointer transition-all duration-200 hover:scale-[1.03] \${
                    b.unlocked ? 'border-opacity-100 shadow-md' : 'opacity-60 border-opacity-30'
                  }\`}
                  style={{ borderColor: b.unlocked ? tierBorder[b.tier] : 'rgba(201,168,76,0.1)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-md flex-shrink-0"
                      style={{ background: tierGradient[b.tier], filter: b.unlocked ? 'none' : 'grayscale(0.9)' }}
                    >
                      {b.emoji}
                    </div>
                    <span
                      className="font-mono text-[0.55rem] font-bold text-[#0C1825] rounded px-1.5 py-0.5 uppercase"
                      style={{ background: tierGradient[b.tier] }}
                    >
                      {b.tier}
                    </span>
                  </div>
                  <p className="font-display text-[#F4E4C1] text-xs font-bold mb-1 leading-tight line-clamp-1">{b.name}</p>
                  <p className="font-body text-[#8A9AAA] text-[0.75rem] leading-snug line-clamp-2 mb-2 flex-1">{b.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-1 border-t border-[rgba(201,168,76,0.1)]">
                    <span className="font-mono text-[#C9A84C] text-[0.6rem]">+{b.xp} XP</span>
                    {b.unlocked ? (
                      <span className="font-mono text-emerald-400 text-[0.58rem] font-bold">✓ Erreicht</span>
                    ) : (
                      <span className="font-mono text-[#8A9AAA] text-[0.58rem]">🔒 Gesperrt</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BADGE DETAIL & POD MERCH MODAL */}
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-md p-6 relative">
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 text-[#8A9AAA] hover:text-[#F4E4C1] text-lg font-bold"
              >
                ✕
              </button>

              <div className="text-center mb-5">
                <div
                  className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-4xl shadow-2xl border-2 border-[#F4E4C1]"
                  style={{ background: tierGradient[selectedBadge.tier] }}
                >
                  {selectedBadge.emoji}
                </div>
                <h3 className="font-display text-[#F4E4C1] text-xl font-bold">{selectedBadge.name}</h3>
                <p className="font-mono text-[0.65rem] text-[#C9A84C] uppercase tracking-wider mt-0.5">
                  ID: {selectedBadge.id} · Kategorie: {selectedBadge.category} · {selectedBadge.tier.toUpperCase()} TIER
                </p>
              </div>

              <div className="parchment rounded-xl p-4 mb-4 text-[#2C1810] space-y-2">
                <div>
                  <p className="font-mono text-[0.6rem] text-[#8B3A2A] uppercase font-bold">Freischaltbedingung:</p>
                  <p className="font-body text-sm font-semibold">{selectedBadge.desc}</p>
                </div>
                <div>
                  <p className="font-mono text-[0.6rem] text-[#8B3A2A] uppercase font-bold">Motiv & Gravur:</p>
                  <p className="font-body text-sm">{selectedBadge.motif}</p>
                </div>
                {selectedBadge.locations && (
                  <div>
                    <p className="font-mono text-[0.6rem] text-[#8B3A2A] uppercase font-bold">Einsatzorte:</p>
                    <p className="font-mono text-xs">{selectedBadge.locations}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => alert(\`300 DPI Vektorgrafik für "\${selectedBadge.name}" wird generiert und an Printful/Gelato übermittelt.\`)}
                  className="btn btn-primary w-full text-xs py-2.5"
                >
                  🛍️ Als gestickten Aufnäher / Gravur bestellen (€ 14,90)
                </button>
                <button onClick={() => setSelectedBadge(null)} className="btn btn-ghost w-full text-xs py-2">
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/BadgesPage.tsx'), badgesPageContent, 'utf8');
console.log('Updated BadgesPage.tsx');

// ─── 3. UPGRADE src/pages/Explore.tsx ───
const explorePageContent = `import React, { useState } from 'react'
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

fs.writeFileSync(path.join(srcDir, 'pages/Explore.tsx'), explorePageContent, 'utf8');
console.log('Updated Explore.tsx');

// ─── 4. UPGRADE src/pages/Tours.tsx ───
const toursPageContent = `import React, { useState } from 'react'
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
<gpx version="1.1" creator="Scratch\\'n\\'Travel - https://scratchntravel.com">
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
                      gps: '38°47\\'24\\"N · 9°23\\'21\\"W',
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

        {/* Modal */}
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

fs.writeFileSync(path.join(srcDir, 'pages/Tours.tsx'), toursPageContent, 'utf8');
console.log('Updated Tours.tsx');

// ─── 5. UPGRADE src/pages/Host.tsx ───
const hostPageContent = `import React, { useState } from 'react'
import { cities, businessCategories } from '../data/data'
import { useTravel } from '../context/TravelContext'

export default function Host() {
  const { reservations, triggerHaptic } = useTravel()
  const [step, setStep] = useState(1)
  const [applied, setApplied] = useState(false)
  const [form, setForm] = useState({
    business: '',
    category: businessCategories[0],
    city: 'Lisbon',
    website: '',
    name: '',
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
                Keine Abhängigkeit von Zwischenhändlern.
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

        {/* CITY AVAILABILITY */}
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
                    Kurzbeschreibung & Besonderheiten
                  </label>
                  <textarea
                    value={form.desc}
                    onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                    className="field h-24 resize-none"
                    placeholder="Was macht dein Angebot für authentische Reisende unverzichtbar?"
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

fs.writeFileSync(path.join(srcDir, 'pages/Host.tsx'), hostPageContent, 'utf8');
console.log('Updated Host.tsx');

// ─── 6. UPGRADE src/pages/Profile.tsx ───
const profilePageContent = `import React from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { tierGradient } from '../data/allBadges'
import { storyPins } from '../data/data'

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

fs.writeFileSync(path.join(srcDir, 'pages/Profile.tsx'), profilePageContent, 'utf8');
console.log('Updated Profile.tsx');
`;

fs.writeFileSync('g:/B2B steuer Business Ideee 6.8.2026/scripts/build_scratch_pages.js', CodeContent, 'utf8');
console.log('Saved build_scratch_pages.js correctly');
