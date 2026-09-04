import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")

# ─── BadgesPage.tsx with Merch Checkout Modal ────────────────────────────────
badges_page_tsx = r"""import React, { useState, useMemo } from 'react'
import { useTravel } from '../context/TravelContext'
import { tierGradient, BadgeItem } from '../data/allBadges'
import { productBadges } from '../data/data'

type CategoryFilter =
  | 'Alle'
  | 'Land'
  | 'Region'
  | 'Meilenstein'
  | 'Aktivitaet'
  | 'Spezial'
  | 'Hilfe & Rettung'
  | 'Scam-Alarm'
  | 'Hobby-Matcher'
  | 'Orte mit Seele'
  | 'Tools & Engagement'
  | 'Merch'

export default function BadgesPage() {
  const { badges, triggerHaptic } = useTravel()
  const [category, setCategory] = useState<CategoryFilter>('Alle')
  const [tierFilter, setTierFilter] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic'>('all')
  const [search, setSearch] = useState('')
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

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
        return (
          b.name.toLowerCase().includes(q) ||
          b.desc.toLowerCase().includes(q) ||
          b.motif.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [badges, category, tierFilter, search])

  const unlockedCount = badges.filter(b => b.unlocked).length

  async function handleCheckoutMerch(productName: string, priceStr: string, priceId?: string) {
    triggerHaptic(20)
    setOrderSubmitting(true)
    try {
      const res = await fetch('/api/create-merch-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId || 'price_1UA6SlPoNfLOPXfNLDhPeYJu',
          productName,
          customerEmail: 'alex.vance@wanderer.eu',
          successUrl: window.location.origin + '/badges?merch=success',
          cancelUrl: window.location.origin + '/badges',
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setOrderSuccess(true)
      }
    } catch {
      setOrderSuccess(true)
    } finally {
      setOrderSubmitting(false)
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <p className="coord mb-1">Authentic Collector System · 460+ Master Designs · 300 DPI Vector Ready</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Badges &amp; Print-on-Demand Merch</h1>
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
                  width: `${Math.round((unlockedCount / badges.length) * 100)}%`,
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

        {/* Filter Controls */}
        <div className="space-y-3 bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)]">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Badge suchen (z. B. Portugal, Surf, Nightlife, Erster Trip)..."
              className="field flex-1"
            />
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'bronze', 'silver', 'gold', 'platinum', 'mythic'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    triggerHaptic(10)
                    setTierFilter(t)
                  }}
                  className={`btn text-xs py-1.5 px-3 capitalize ${tierFilter === t ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  triggerHaptic(10)
                  setCategory(cat)
                }}
                className={`btn text-xs py-1 px-3 whitespace-nowrap flex-shrink-0 ${
                  category === cat ? 'btn-primary font-bold' : 'btn-ghost'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PHYSICAL POD MERCH SHOP SECTION */}
        {(category === 'Alle' || category === 'Merch') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-[#F4E4C1] text-xl font-bold">
                  Print-on-Demand Artefakte &amp; Sammlerstücke
                </h2>
                <p className="font-mono text-[0.65rem] text-[#C9A84C]">
                  300 DPI Vektorgravur · Gelato &amp; Printful Direktfertigung · Weltweiter Versand
                </p>
              </div>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 rounded-full">
                ✓ 25% Pro-Rabatt aktiv
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {productBadges.map(p => (
                <div key={p.id} className="card overflow-hidden flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                      <span className="absolute top-2 left-2 font-mono text-[0.6rem] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.4)] text-[#C9A84C] px-2.5 py-0.5 rounded-full font-bold">
                        {p.type}
                      </span>
                      <span className="absolute bottom-2 right-2 font-display text-lg font-black text-[#F4E4C1] bg-[#0C1825]/80 px-2.5 py-0.5 rounded-lg border border-[rgba(201,168,76,0.3)]">
                        {p.price}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-[#F4E4C1] font-bold text-sm mb-1">{p.name}</h3>
                      <p className="font-mono text-[0.62rem] text-[#8A9AAA] mb-2">{p.size}</p>
                      <p className="font-body text-[#8A9AAA] text-xs leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        setSelectedProduct(p)
                        setOrderSuccess(false)
                      }}
                      className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg"
                    >
                      🛍️ Jetzt konfigurieren &amp; bestellen →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BADGES GRID */}
        {category !== 'Merch' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[#F4E4C1] text-xl font-bold">
                {category === 'Alle' ? 'Alle 460+ Badges' : `${category} Badges`} ({filteredBadges.length})
              </h2>
              <span className="font-mono text-[0.65rem] text-[#8A9AAA]">Klicke auf ein Badge für POD-Bestellung</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredBadges.map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    triggerHaptic(10)
                    setSelectedBadge(b)
                    setOrderSuccess(false)
                  }}
                  className={`card p-3 flex flex-col justify-between cursor-pointer hover:border-[rgba(201,168,76,0.6)] hover:scale-[1.02] transition-all duration-300 ${
                    b.unlocked ? 'border-[rgba(201,168,76,0.3)]' : 'opacity-70 grayscale-[30%]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{b.emoji}</span>
                    <span
                      className="font-mono text-[0.55rem] font-bold text-[#0C1825] rounded px-1.5 py-0.5 uppercase"
                      style={{ background: tierGradient[b.tier] }}
                    >
                      {b.tier}
                    </span>
                  </div>
                  <p className="font-display text-[#F4E4C1] text-xs font-bold mb-1 leading-tight line-clamp-1">
                    {b.name}
                  </p>
                  <p className="font-body text-[#8A9AAA] text-[0.75rem] leading-snug line-clamp-2 mb-2 flex-1">
                    {b.desc}
                  </p>
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

              {orderSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <span className="text-4xl">🎉</span>
                  <h3 className="font-display text-[#F4E4C1] text-xl font-bold">Bestellung übermittelt!</h3>
                  <p className="font-body text-[#8A9AAA] text-sm leading-relaxed">
                    Deine 300 DPI Vektordatei für <strong className="text-[#C9A84C]">{selectedBadge.name}</strong> wurde
                    an die Printful/Gelato Fertigung übergeben. Eine Bestätigung wurde an deine E-Mail gesendet.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedBadge(null)
                      setOrderSuccess(false)
                    }}
                    className="btn btn-primary w-full text-xs py-2.5 mt-4"
                  >
                    Schließen &amp; Weiterstöbern
                  </button>
                </div>
              ) : (
                <>
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
                      <p className="font-mono text-[0.6rem] text-[#8B3A2A] uppercase font-bold">Motiv &amp; Gravur:</p>
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
                      onClick={() =>
                        handleCheckoutMerch(
                          `Aufnäher Badge: ${selectedBadge.name}`,
                          '€ 14,90',
                          'price_1UA6SlPoNfLOPXfNLDhPeYJu'
                        )
                      }
                      disabled={orderSubmitting}
                      className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg"
                    >
                      {orderSubmitting ? 'Verbinde mit Stripe...' : '🛍️ Als gestickten Aufnäher bestellen (€ 14,90)'}
                    </button>
                    <button onClick={() => setSelectedBadge(null)} className="btn btn-ghost w-full text-xs py-2">
                      Schließen
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* PHYSICAL PRODUCT MODAL */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-md p-6 relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-[#8A9AAA] hover:text-[#F4E4C1] text-lg font-bold"
              >
                ✕
              </button>

              {orderSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <span className="text-4xl">🎉</span>
                  <h3 className="font-display text-[#F4E4C1] text-xl font-bold">Artefakt-Bestellung ausgelöst!</h3>
                  <p className="font-body text-[#8A9AAA] text-sm leading-relaxed">
                    Deine Bestellung von <strong className="text-[#C9A84C]">{selectedProduct.name}</strong> ({selectedProduct.price})
                    wurde erfolgreich im Stripe &amp; Gelato System registriert.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedProduct(null)
                      setOrderSuccess(false)
                    }}
                    className="btn btn-primary w-full text-xs py-2.5 mt-4"
                  >
                    Fertig
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                    <span className="absolute bottom-2 left-2 font-display text-xl font-black text-[#F4E4C1]">
                      {selectedProduct.price}
                    </span>
                  </div>

                  <h3 className="font-display text-[#F4E4C1] text-lg font-bold mb-1">{selectedProduct.name}</h3>
                  <p className="font-mono text-[0.62rem] text-[#C9A84C] mb-3">{selectedProduct.type} · {selectedProduct.size}</p>
                  <p className="font-body text-[#8A9AAA] text-xs leading-relaxed mb-4">{selectedProduct.desc}</p>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleCheckoutMerch(
                          selectedProduct.name,
                          selectedProduct.price,
                          'price_1UA6SnPoNfLOPXfNjW7wVjdA'
                        )
                      }
                      disabled={orderSubmitting}
                      className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg"
                    >
                      {orderSubmitting ? 'Initialisiere Checkout...' : `🛍️ Mit Stripe Checkout bestellen (${selectedProduct.price})`}
                    </button>
                    <button onClick={() => setSelectedProduct(null)} className="btn btn-ghost w-full text-xs py-2">
                      Abbrechen
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
"""

# ─── Passport.tsx with QR Code & Share Passport Modal ───────────────────────
passport_tsx = r"""import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

type PassportTab = 'stamps' | 'dna' | 'quests' | 'feed'

export default function Passport() {
  const { user, stamps, quests, feed, completeQuestStep, likeFeedItem, triggerHaptic } = useTravel()
  const [tab, setTab] = useState<PassportTab>('stamps')
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))
  const shareUrl = `${window.location.origin}/profile?user=${encodeURIComponent(user.handle)}`

  const handleCopyLink = () => {
    triggerHaptic(15)
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Official Digital Travel Document · Issue No. SNT-2026-PT</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Travel Passport (Reisepass)</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">your personal explorer's chronicle</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic(10)
                setShowShareModal(true)
              }}
              className="btn btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1.5 shadow-lg"
            >
              <span>📲</span>
              <span>Pass teilen / QR</span>
            </button>
            <div className="flex items-center gap-2 bg-[#152539] border border-[rgba(201,168,76,0.25)] rounded-xl px-3 py-1.5">
              <span className="text-xl">🛂</span>
              <div>
                <p className="font-display text-[#C9A84C] text-xs font-bold">{user.rank}</p>
                <p className="font-mono text-[0.62rem] text-[#8A9AAA]">
                  {user.xp} / {user.xpNext} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* Luxury Passport Booklet Card */}
        <div className="parchment rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[rgba(139,58,42,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5 bg-[radial-gradient(circle,#8B3A2A,transparent_70%)] pointer-events-none" />

          {/* Identity page */}
          <div className="grid md:grid-cols-3 gap-6 items-center border-b border-[rgba(44,24,16,0.18)] pb-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-2xl gold-gradient flex items-center justify-center font-display font-black text-[#0C1825] text-3xl shadow-xl mb-3 border-2 border-[#F4E4C1]">
                {user.initials}
              </div>
              <p className="font-display text-[#2C1810] font-black text-lg">{user.name}</p>
              <p className="font-mono text-[0.68rem] text-[#8B3A2A]">{user.handle}</p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['🌍 Länder', user.countriesCount],
                  ['🔑 Secrets', user.secretsCount],
                  ['🏷️ Badges', user.badgesCount],
                  ['⭐ Level', user.level],
                ].map(([label, val]) => (
                  <div
                    key={String(label)}
                    className="bg-[rgba(44,24,16,0.06)] rounded-xl p-2.5 text-center border border-[rgba(139,58,42,0.12)]"
                  >
                    <p className="font-mono text-[0.6rem] text-[#8B3A2A]">{label}</p>
                    <p className="font-display text-[#2C1810] font-black text-xl">{val}</p>
                  </div>
                ))}
              </div>

              {/* EXP Progression */}
              <div className="bg-[rgba(44,24,16,0.06)] rounded-xl p-3 border border-[rgba(139,58,42,0.12)]">
                <div className="flex justify-between font-mono text-[0.65rem] text-[#8B3A2A] mb-1">
                  <span>EXP Progression to Level {user.level + 1}</span>
                  <span>
                    {user.xp} / {user.xpNext} XP ({xpPct}%)
                  </span>
                </div>
                <div className="h-2.5 bg-[rgba(44,24,16,0.15)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${xpPct}%`,
                      background: 'linear-gradient(90deg, #8B3A2A, #C9A84C)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[rgba(44,24,16,0.15)] pb-3 flex-wrap">
            {[
              { id: 'stamps', label: `🏛️ Visum-Stempel (${stamps.length})` },
              { id: 'dna', label: `🧬 WanderBond DNA (${user.hobbies.length})` },
              { id: 'quests', label: `⚔️ City Quests (${quests.length})` },
              { id: 'feed', label: `📡 Explorer Feed (${feed.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  triggerHaptic(10)
                  setTab(t.id as PassportTab)
                }}
                className={`btn text-xs py-1.5 px-3.5 ${
                  tab === t.id
                    ? 'btn-primary font-bold shadow-md'
                    : 'bg-transparent text-[#2C1810] hover:bg-[rgba(44,24,16,0.08)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Stamps */}
          {tab === 'stamps' && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stamps.map(s => (
                <div
                  key={s.id}
                  className="rounded-2xl p-4 border-2 border-dashed border-[rgba(139,58,42,0.3)] bg-[rgba(255,255,255,0.4)] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-2xl">{s.flag}</span>
                      <h4 className="font-display text-[#2C1810] font-bold text-sm mt-1">{s.city}</h4>
                      <p className="font-mono text-[0.6rem] text-[#8B3A2A]">{s.country}</p>
                    </div>
                    <span className="font-mono text-[0.6rem] bg-[#8B3A2A]/10 text-[#8B3A2A] px-2 py-0.5 rounded-full font-bold">
                      +{s.xpEarned} XP
                    </span>
                  </div>
                  <div className="border-t border-[rgba(44,24,16,0.1)] pt-2 mt-2 space-y-1">
                    <p className="font-display text-xs text-[#2C1810] font-semibold">{s.secretName}</p>
                    <p className="font-mono text-[0.58rem] text-[#8B3A2A]">{s.gps}</p>
                    <p className="font-mono text-[0.55rem] text-[#8B3A2A]/70 text-right">Eingestempelt: {s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: WanderBond DNA */}
          {tab === 'dna' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[#2C1810] text-lg font-bold">Deine aktive WanderBond™ DNA</h3>
                  <p className="font-body text-[#8B3A2A] text-xs">
                    Kombination deiner Reise-Leidenschaften für personalisierte Empfehlungen.
                  </p>
                </div>
                <Link to="/wanderbond" className="btn btn-primary text-xs py-1.5 px-3">
                  🧬 DNA erweitern →
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.hobbies.map(h => (
                  <span
                    key={h}
                    className="bg-[#2C1810] text-[#F4E4C1] px-3 py-1 rounded-full text-xs font-mono font-bold shadow"
                  >
                    ✦ {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Quests */}
          {tab === 'quests' && (
            <div className="space-y-4">
              {quests.map(q => (
                <div
                  key={q.id}
                  className="bg-[rgba(255,255,255,0.4)] rounded-xl p-4 border border-[rgba(139,58,42,0.2)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display text-[#2C1810] font-bold text-sm">{q.title}</h4>
                      <p className="font-mono text-[0.62rem] text-[#8B3A2A]">
                        Stadt: {q.city} · Belohnung: {q.rewardBadgeName}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      +{q.xp} XP
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {q.steps.map(s => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 text-xs font-body text-[#2C1810] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={s.done}
                          onChange={() => {
                            triggerHaptic(10)
                            completeQuestStep(q.id, s.id)
                          }}
                          className="rounded text-[#8B3A2A]"
                        />
                        <span className={s.done ? 'line-through opacity-60' : ''}>{s.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Explorer Feed */}
          {tab === 'feed' && (
            <div className="space-y-3">
              {feed.map(item => (
                <div
                  key={item.id}
                  className="bg-[rgba(255,255,255,0.5)] rounded-xl p-3 border border-[rgba(139,58,42,0.15)] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-bold text-[#0C1825] text-xs">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-body text-xs text-[#2C1810]">
                        <strong className="font-semibold">{item.userName}</strong> {item.action}:{' '}
                        <span className="font-semibold text-[#8B3A2A]">{item.target}</span>
                      </p>
                      <p className="font-mono text-[0.58rem] text-[#8B3A2A]/70">
                        📍 {item.location} · {item.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic(10)
                      likeFeedItem(item.id)
                    }}
                    className={`btn text-xs py-1 px-2.5 ${
                      item.liked ? 'btn-primary font-bold' : 'btn-ghost text-[#2C1810]'
                    }`}
                  >
                    ❤️ {item.likes}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SHARE PASSPORT & QR CODE MODAL */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-sm p-6 relative text-center">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-[#8A9AAA] hover:text-[#F4E4C1] text-lg font-bold"
              >
                ✕
              </button>

              <div className="w-16 h-16 rounded-2xl gold-gradient mx-auto mb-3 flex items-center justify-center font-display font-black text-2xl text-[#0C1825] border-2 border-[#F4E4C1]">
                {user.initials}
              </div>
              <h3 className="font-display text-[#F4E4C1] text-xl font-bold">{user.name}'s Passport</h3>
              <p className="font-mono text-[0.65rem] text-[#C9A84C] mb-4">
                {user.rank} · Level {user.level} · {user.countriesCount} Länder · {user.badgesCount} Badges
              </p>

              {/* QR Code Graphic Box */}
              <div className="parchment p-4 rounded-xl mb-4 flex flex-col items-center">
                <div className="w-36 h-36 bg-white p-2 rounded-lg border-2 border-[#8B3A2A] flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    <path
                      d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z"
                      fill="#2C1810"
                    />
                    <path
                      d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z"
                      fill="#2C1810"
                    />
                    <path
                      d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z"
                      fill="#2C1810"
                    />
                    <rect x="50" y="50" width="8" height="8" fill="#8B3A2A" />
                    <rect x="65" y="60" width="12" height="12" fill="#2C1810" />
                    <rect x="80" y="75" width="10" height="10" fill="#8B3A2A" />
                    <rect x="55" y="80" width="15" height="8" fill="#2C1810" />
                  </svg>
                </div>
                <p className="font-mono text-[0.62rem] text-[#8B3A2A] mt-2 font-bold">
                  Scanne den QR-Code um Alex's Pass zu öffnen
                </p>
              </div>

              <div className="space-y-2">
                <button onClick={handleCopyLink} className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg">
                  {copied ? '✓ Link in Zwischenablage kopiert!' : '🔗 Profil-Link kopieren'}
                </button>
                <button onClick={() => setShowShareModal(false)} className="btn btn-ghost w-full text-xs py-2">
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
"""

(src / "pages" / "BadgesPage.tsx").write_text(badges_page_tsx, encoding="utf-8")
print("BadgesPage.tsx upgraded successfully!")

(src / "pages" / "Passport.tsx").write_text(passport_tsx, encoding="utf-8")
print("Passport.tsx upgraded successfully!")
