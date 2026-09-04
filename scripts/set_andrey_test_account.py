import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")

# 1. Update TravelContext.tsx
ctx_file = src / "context" / "TravelContext.tsx"
ctx_content = ctx_file.read_text(encoding="utf-8")

old_user_str = """    return {
      name: 'Maria Santos',
      handle: '@mariatravels',
      initials: 'MS',
      rank: 'Explorer Rang 3 · Pathfinder',
      level: 3,
      xp: 2680,
      xpNext: 3500,
      joinDate: 'Mai 2025',
      bio: 'Ocean enthusiast, surf lover & seeker of unmarked dirt roads across Europe.',
      hobbies: ['Surfing', 'Astrophotography', 'Foraging', 'Fado', 'Cold Plunge', 'Vanlife', 'Wine Tasting'],
      countriesCount: 14,
      secretsCount: 28,
      badgesCount: 27,
      storiesCount: 9,
    }"""

new_user_str = """    return {
      name: 'Andrey Test',
      handle: '@andrey.test',
      initials: 'AT',
      rank: 'Grandmaster Explorer & Founder',
      level: 25,
      xp: 24850,
      xpNext: 25000,
      joinDate: 'Januar 2024',
      bio: 'Gründer & Master Explorer. Vollzugriff auf alle 460+ Badges, weltweite Secret Spots, GPX-Routen und B2B Host-Tools.',
      hobbies: [
        'Surfing',
        'Hundewandern',
        'Kinderwagen-Klippenpfade',
        'Drone Photography & Film',
        'Wine Tasting & Weingut-Hopping',
        'Vanlife & Camper-Ausbau',
        'Sportklettern',
        'Thermalquellen & Hot Springs'
      ],
      countriesCount: 48,
      secretsCount: 120,
      badgesCount: 184,
      storiesCount: 24,
    }"""

if old_user_str in ctx_content:
    ctx_content = ctx_content.replace(old_user_str, new_user_str)

# Pre-reveal several pins & scratched IDs for Andrey Test
ctx_content = ctx_content.replace(
    "const [scratchedIds, setScratchedIds] = useState<number[]>(() => {\n    const saved = localStorage.getItem('snt_scratched')\n    return saved ? JSON.parse(saved) : []\n  })",
    "const [scratchedIds, setScratchedIds] = useState<number[]>(() => {\n    const saved = localStorage.getItem('snt_scratched')\n    return saved ? JSON.parse(saved) : [1, 2, 4, 6, 9, 10, 14, 16, 19, 21, 22]\n  })"
)

ctx_content = ctx_content.replace(
    "const [revealedPins, setRevealedPins] = useState<number[]>(() => {\n    const saved = localStorage.getItem('snt_revealed')\n    return saved ? JSON.parse(saved) : [1, 2]\n  })",
    "const [revealedPins, setRevealedPins] = useState<number[]>(() => {\n    const saved = localStorage.getItem('snt_revealed')\n    return saved ? JSON.parse(saved) : [1, 2, 4, 6, 9, 10, 14, 16, 19, 21, 22]\n  })"
)

ctx_file.write_text(ctx_content, encoding="utf-8")
print("TravelContext.tsx updated with Andrey Test Full Access profile!")

# 2. Update data.ts
data_file = src / "data" / "data.ts"
data_content = data_file.read_text(encoding="utf-8")

data_content = data_content.replace(
    """export const user = {
  name: 'Alex Vance',
  handle: '@alex.vance',
  initials: 'AV',
  rank: 'Journeyman Explorer',
  level: 7,
  xp: 3420,
  xpNext: 5000,
  joinDate: 'März 2025',
  bio: 'Auf der Jagd nach Secret Spots, authentischem Essen & handgefertigten Badges.',
  hobbies: ['Surfing', 'Klettern & Bouldern', 'Drone Photography & Film', 'Streetfood & Märkte', 'Vanlife & Camping', 'Hundewandern'],
  countriesCount: 18,
  secretsCount: 42,
  badgesCount: 17,
  storiesCount: 9,
}""",
    """export const user = {
  name: 'Andrey Test',
  handle: '@andrey.test',
  initials: 'AT',
  rank: 'Grandmaster Explorer & Founder',
  level: 25,
  xp: 24850,
  xpNext: 25000,
  joinDate: 'Januar 2024',
  bio: 'Gründer & Master Explorer. Vollzugriff auf alle 460+ Badges, weltweite Secret Spots, GPX-Routen und B2B Host-Tools.',
  hobbies: ['Surfing', 'Hundewandern', 'Kinderwagen-Klippenpfade', 'Drone Photography & Film', 'Wine Tasting & Weingut-Hopping', 'Vanlife & Camper-Ausbau', 'Sportklettern', 'Thermalquellen & Hot Springs'],
  countriesCount: 48,
  secretsCount: 120,
  badgesCount: 184,
  storiesCount: 24,
}"""
)

data_file.write_text(data_content, encoding="utf-8")
print("data.ts updated with Andrey Test user profile!")
