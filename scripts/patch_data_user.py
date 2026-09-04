import pathlib

ts_file = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src\data\data.ts")
content = ts_file.read_text(encoding="utf-8")

extra_exports = """
export const user = {
  name: 'Alex Vance',
  handle: '@alex.vance',
  initials: 'AV',
  rank: 'Journeyman Explorer',
  level: 7,
  xp: 3420,
  xpNext: 5000,
  joinDate: 'März 2025',
  bio: 'Auf der Jagd nach Secret Spots, authentischem Essen & handgefertigten Badges.',
  hobbies: ['Surfen', 'Klettern & Bouldern', 'Fotografie & Drohnenflug', 'Streetfood & Märkte', 'Vanlife & Camping'],
  countriesCount: 18,
  secretsCount: 42,
  badgesCount: 17,
  storiesCount: 9,
}
"""

if "export const user =" not in content:
    content += extra_exports
    ts_file.write_text(content, encoding="utf-8")
    print("Export user added to data.ts")
else:
    print("user already exported in data.ts")
