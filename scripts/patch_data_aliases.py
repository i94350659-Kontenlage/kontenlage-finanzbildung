import pathlib

ts_file = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src\data\data.ts")

content = ts_file.read_text(encoding="utf-8")

# Add aliases at the end if not already there
aliases = """
// ── Aliases for legacy page imports ──────────────────────────────────────
export const hazards = hazardReports.filter(r => r.type === 'hazard')
export const scams   = hazardReports.filter(r => r.type === 'scam')
export type Tour = CommunityTour
"""

if "hazards = hazardReports" not in content:
    content += aliases
    ts_file.write_text(content, encoding="utf-8")
    print("Aliases added to data.ts")
else:
    print("Already has aliases")
