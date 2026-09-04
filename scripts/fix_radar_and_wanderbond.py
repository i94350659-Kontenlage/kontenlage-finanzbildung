import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")

# 1. Update data.ts with rich hazards and scams
data_path = src / "data" / "data.ts"
data_content = data_path.read_text(encoding="utf-8")

rich_hazards_and_scams = """
export interface Hazard {
  id: number
  title: string
  desc: string
  level: 'high' | 'medium' | 'low'
  area: string
  time: string
  category: string
  icon: string
}

export interface Scam {
  id: number
  title: string
  location: string
  desc: string
  reports: number
  icon: string
}

export const hazards: Hazard[] = [
  {
    id: 1,
    title: 'Klippenabbruch-Warnung Praia do Magoito',
    desc: 'Nach starken Regenfällen ist der südliche Abstiegspfad instabil. Bitte nur den befestigten Holzsteg nutzen.',
    level: 'high',
    area: 'Sintra & Cascais',
    time: 'vor 2 Std.',
    category: 'Naturgefahr',
    icon: '⚠️',
  },
  {
    id: 2,
    title: 'Starke Unterströmung (Rip Currents) an Praia Grande',
    desc: 'Rote Flagge aktiv. Nur im abgegrenzten Rettungsschwimmer-Bereich ins Wasser gehen.',
    level: 'high',
    area: 'Sintra & Cascais',
    time: 'vor 4 Std.',
    category: 'Surf & Meer',
    icon: '🌊',
  },
  {
    id: 3,
    title: 'Bauarbeiten & Sperrung Holzsteg Ponta da Piedade',
    desc: 'Teilstrecke des Klippenwanderwegs wegen Sanierung bis Freitag gesperrt. Umleitung über den Leuchtturmpfad.',
    level: 'medium',
    area: 'Algarve',
    time: 'vor 1 Tag',
    category: 'Infrastruktur',
    icon: '🚧',
  },
  {
    id: 4,
    title: 'Quallenvorkommen (Portugiesische Galeere) bei Carvoeiro',
    desc: 'Einzelne Sichtungen am Strand. Hundebesitzer und Barfußläufer sollten vorsichtig sein.',
    level: 'low',
    area: 'Algarve',
    time: 'vor 2 Tagen',
    category: 'Fauna',
    icon: '🪼',
  },
]

export const scams: Scam[] = [
  {
    id: 1,
    title: 'Fake Tram 28 Tickets am Praça da Figueira',
    location: 'Lissabon Baixa',
    desc: 'Personen im gelben Warnwesten-Look verkaufen ungültige Papiertickets. Nur am Schalter oder im Viva-Viagem-Automaten kaufen.',
    reports: 89,
    icon: '🚋',
  },
  {
    id: 2,
    title: 'Überteuerte Gewürzkräuter-Verkäufer im Bairro Alto',
    location: 'Lissabon Bairro Alto',
    desc: 'Aufdringliche Verkäufer bieten scheinbare Kräuter/Gewürze zu Wucherpreisen an. Ignorieren und weitergehen.',
    reports: 44,
    icon: '🌿',
  },
  {
    id: 3,
    title: 'Inoffizielle Parkplatzeinweiser (Arrumadores) bei Belém',
    location: 'Belém Monumente',
    desc: 'Männer verlangen 5–10 € für kostenfreie Parkflächen. Kein offizieller Tarif – legal ist der Automat.',
    reports: 112,
    icon: '🚗',
  },
]
"""

# Replace the tail end alias section or append
if "export interface Hazard" not in data_content:
    # remove previous temporary aliases if any
    data_content = data_content.replace("""// ── Aliases for legacy page imports ──────────────────────────────────────
export const hazards = hazardReports.filter(r => r.type === 'hazard')
export const scams   = hazardReports.filter(r => r.type === 'scam')
export type Tour = CommunityTour""", "")
    data_content += "\n" + rich_hazards_and_scams + "\nexport type Tour = CommunityTour\n"
    data_path.write_text(data_content, encoding="utf-8")
    print("data.ts updated with rich hazards and scams")

# 2. Fix WanderBond.tsx imports
wb_path = src / "pages" / "WanderBond.tsx"
wb_content = wb_path.read_text(encoding="utf-8")
if "hobbiesList" not in wb_content[:200]:
    wb_content = wb_content.replace(
        "import { hobbyCategories, matchBuddies, tours, storyPins, MatchBuddy } from '../data/data'",
        "import { hobbyCategories, hobbiesList, matchBuddies, tours, storyPins, MatchBuddy } from '../data/data'"
    )
    wb_path.write_text(wb_content, encoding="utf-8")
    print("WanderBond.tsx import updated with hobbiesList")
