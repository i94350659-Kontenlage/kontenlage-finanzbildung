import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")
explore_file = src / "pages" / "Explore.tsx"
explore_content = explore_file.read_text(encoding="utf-8")

old_block = """                      {unlocked ? (
                        <div className="bg-[#0C1825] rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
                          <span className="text-emerald-400 text-xs">📍</span>
                          <span className="coord text-emerald-400 font-bold">{pin.gps}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => scratchSecret(pin.id, pin.xp, pin.location, pin.gps, pin.category)}
                          className="btn btn-secondary w-full text-xs py-2 mb-3 font-bold"
                        >
                          🪙 GPS freischalten
                        </button>
                      )}"""

new_block = """                      {unlocked ? (
                        <div className="space-y-2 mb-3">
                          <div className="bg-[#0C1825] rounded-lg px-3 py-2 flex items-center justify-between border border-emerald-500/30">
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
                      ) : (
                        <button
                          onClick={() => scratchSecret(pin.id, pin.xp, pin.location, pin.gps, pin.category)}
                          className="btn btn-secondary w-full text-xs py-2 mb-3 font-bold"
                        >
                          🪙 GPS freischalten
                        </button>
                      )}"""

if old_block in explore_content:
    explore_content = explore_content.replace(old_block, new_block)
    explore_file.write_text(explore_content, encoding="utf-8")
    print("Explore.tsx updated successfully!")
