import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")

# 1. Update Explore.tsx
explore_file = src / "pages" / "Explore.tsx"
explore_content = explore_file.read_text(encoding="utf-8")

old_unlocked_block = """                      {isUnlocked ? (
                        <div className="bg-[#0C1825] rounded-lg p-2 mb-3 flex items-center justify-between border border-emerald-500/30">
                          <span className="text-emerald-400 text-xs">📍</span>
                          <span className="coord text-emerald-400 font-bold">{pin.gps}</span>
                        </div>
                      ) : ("""

new_unlocked_block = """                      {isUnlocked ? (
                        <div className="space-y-2 mb-3">
                          <div className="bg-[#0C1825] rounded-lg p-2 flex items-center justify-between border border-emerald-500/30">
                            <span className="text-emerald-400 text-xs">📍</span>
                            <span className="coord text-emerald-400 font-bold">{pin.gps}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                `${pin.location}, ${pin.city}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary text-[0.62rem] py-1.5 px-2 text-center font-bold flex items-center justify-center gap-1 shadow"
                            >
                              <span>🗺️</span>
                              <span>Google Maps</span>
                            </a>
                            <a
                              href={`https://maps.apple.com/?daddr=${encodeURIComponent(
                                `${pin.location}, ${pin.city}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost text-[0.62rem] py-1.5 px-2 text-center font-bold flex items-center justify-center gap-1 border border-[rgba(201,168,76,0.3)]"
                            >
                              <span>🍎</span>
                              <span>Apple Maps</span>
                            </a>
                          </div>
                        </div>
                      ) : ("""

if old_unlocked_block in explore_content:
    explore_content = explore_content.replace(old_unlocked_block, new_unlocked_block)
    explore_file.write_text(explore_content, encoding="utf-8")
    print("Explore.tsx updated with 1-click Google & Apple Maps navigation!")

# 2. Update Tours.tsx
tours_file = src / "pages" / "Tours.tsx"
tours_content = tours_file.read_text(encoding="utf-8")

old_tour_buttons = """                <div className="flex gap-1.5 mt-auto">
                  <button onClick={() => handleDownload(t)} className="btn btn-primary flex-1 text-xs py-2 font-bold">
                    📥 GPX
                  </button>
                  <button className="btn btn-ghost flex-1 text-xs py-2">
                    ❤️ {t.likes}
                  </button>
                </div>"""

new_tour_buttons = """                <div className="flex gap-1.5 mt-auto flex-wrap">
                  <button onClick={() => handleDownload(t)} className="btn btn-primary flex-1 text-xs py-2 font-bold">
                    📥 GPX (Komoot)
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${t.title}, ${t.location}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary flex-1 text-xs py-2 font-bold text-center flex items-center justify-center gap-1"
                  >
                    <span>🗺️</span>
                    <span>Maps</span>
                  </a>
                  <button className="btn btn-ghost text-xs py-2 px-3">
                    ❤️ {t.likes}
                  </button>
                </div>"""

if old_tour_buttons in tours_content:
    tours_content = tours_content.replace(old_tour_buttons, new_tour_buttons)
    tours_file.write_text(tours_content, encoding="utf-8")
    print("Tours.tsx updated with 1-click Google Maps turn-by-turn route link!")
