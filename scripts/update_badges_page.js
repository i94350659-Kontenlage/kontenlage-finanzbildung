const fs = require('fs');
const target = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src/pages/BadgesPage.tsx';

const code = `import React, { useState, useMemo } from 'react'
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

fs.writeFileSync(target, code, 'utf8');
console.log('BadgesPage.tsx written successfully!');
