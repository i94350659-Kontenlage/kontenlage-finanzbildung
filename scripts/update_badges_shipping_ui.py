import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")
badges_page = src / "pages" / "BadgesPage.tsx"
content = badges_page.read_text(encoding="utf-8")

# In the Badge detail modal:
old_modal_action = """                  <div className="space-y-2">
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
                  </div>"""

new_modal_action = """                  {/* Shipping & Promo Breakdown */}
                  <div className="bg-[#0C1825] p-3 rounded-xl border border-[rgba(201,168,76,0.2)] mb-3 space-y-1 text-[0.68rem] font-mono">
                    <div className="flex items-center justify-between text-[#F4E4C1]">
                      <span>📦 Standardversand (DE/EU):</span>
                      <span className="text-[#C9A84C] font-bold">€ 3,90</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8A9AAA]">
                      <span>⚡ Express-Kurier (1-2 Tage):</span>
                      <span>€ 7,90</span>
                    </div>
                    <div className="text-emerald-400 font-bold pt-1 border-t border-[rgba(201,168,76,0.1)]">
                      ✓ Kostenloser Versand ab € 60,- Bestellwert
                    </div>
                    <div className="text-[#C9A84C] text-[0.62rem] pt-0.5">
                      🎁 Inklusive 10% eSIM-Rabattcode <strong>SCRATCH10</strong> auf der Rechnung
                    </div>
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
                      {orderSubmitting ? 'Verbinde mit Stripe...' : '🛍️ Jetzt bestellen (€ 14,90 + Versand)'}
                    </button>
                    <button onClick={() => setSelectedBadge(null)} className="btn btn-ghost w-full text-xs py-2">
                      Schließen
                    </button>
                  </div>"""

if old_modal_action in content:
    content = content.replace(old_modal_action, new_modal_action)

# Also in the Physical Product modal:
old_prod_modal = """                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleCheckoutMerch(
                          selectedProduct.name,
                          selectedProduct.price,
                          selectedProduct.priceId
                        )
                      }
                      disabled={orderSubmitting}
                      className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg"
                    >
                      {orderSubmitting ? 'Verbinde mit Stripe...' : `🛍️ Jetzt bestellen (${selectedProduct.price})`}
                    </button>
                    <button onClick={() => setSelectedProduct(null)} className="btn btn-ghost w-full text-xs py-2">
                      Schließen
                    </button>
                  </div>"""

new_prod_modal = """                  {/* Shipping & Promo Breakdown */}
                  <div className="bg-[#0C1825] p-3 rounded-xl border border-[rgba(201,168,76,0.2)] mb-3 space-y-1 text-[0.68rem] font-mono">
                    <div className="flex items-center justify-between text-[#F4E4C1]">
                      <span>📦 Standardversand (DE/EU):</span>
                      <span className="text-[#C9A84C] font-bold">€ 3,90</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8A9AAA]">
                      <span>⚡ Express-Kurier (1-2 Tage):</span>
                      <span>€ 7,90</span>
                    </div>
                    <div className="text-emerald-400 font-bold pt-1 border-t border-[rgba(201,168,76,0.1)]">
                      ✓ Kostenloser Versand ab € 60,- Bestellwert
                    </div>
                    <div className="text-[#C9A84C] text-[0.62rem] pt-0.5">
                      🎁 Inklusive 10% eSIM-Rabattcode <strong>SCRATCH10</strong> auf der Rechnung
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleCheckoutMerch(
                          selectedProduct.name,
                          selectedProduct.price,
                          selectedProduct.priceId
                        )
                      }
                      disabled={orderSubmitting}
                      className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg"
                    >
                      {orderSubmitting ? 'Verbinde mit Stripe...' : `🛍️ Jetzt bestellen (${selectedProduct.price} + Versand)`}
                    </button>
                    <button onClick={() => setSelectedProduct(null)} className="btn btn-ghost w-full text-xs py-2">
                      Schließen
                    </button>
                  </div>"""

if old_prod_modal in content:
    content = content.replace(old_prod_modal, new_prod_modal)

# Also add a welcome promo bar at the top of BadgesPage:
old_header = """      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* STATS BAR */}"""

new_header = """      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* WELCOME PROMO & SHIPPING INFO BANNER */}
        <div className="bg-gradient-to-r from-[#152539] via-[#1a2f47] to-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.3)] shadow-lg flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <p className="font-display text-[#F4E4C1] text-sm font-bold">
                Neukunden-Vorteil: 10% Merch-Bonus &amp; weltweite eSIM
              </p>
              <p className="font-body text-[#8A9AAA] text-xs">
                Versand: € 3,90 Standard (DE/EU) · Kostenfrei ab € 60,- · Inklusive 10% eSIM-Code <strong className="text-[#C9A84C]">SCRATCH10</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.62rem] bg-[#0C1825] border border-emerald-500/40 text-emerald-400 px-2.5 py-1 rounded-full">
              🎨 3 Custom-Design-Credits frei
            </span>
          </div>
        </div>

        {/* STATS BAR */}"""

if old_header in content:
    content = content.replace(old_header, new_header)

badges_page.write_text(content, encoding="utf-8")
print("BadgesPage.tsx updated with shipping breakdown and welcome banner!")
