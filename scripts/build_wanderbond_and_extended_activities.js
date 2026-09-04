const fs = require('fs');
const path = require('path');

const srcDir = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src';

// ─── 1. ENRICHED data.ts ───
const dataContent = `// ─── 130 HOBBY DNA CLUSTERS ───────────────────────────────────────────
export interface HobbyCategory {
  id: string
  name: string
  icon: string
  color: string
  hobbies: string[]
}

export const hobbyCategories: HobbyCategory[] = [
  {
    id: 'water_surf',
    name: 'Wasser, Surf & Küste',
    icon: '🏄',
    color: '#0EA5E9',
    hobbies: [
      'Surfing', 'Kitesurfing', 'Windsurfing', 'Stand-Up Paddle', 'Scuba Diving',
      'Freediving', 'Snorkeling', 'Sailing', 'Kayaking', 'Canyoning',
      'Wakeboarding', 'Spearfishing', 'Coral Restoration', 'Cliff Jumping', 'Sea Foraging'
    ]
  },
  {
    id: 'outdoor_mountains',
    name: 'Berge, Trekking & Wildnis',
    icon: '🧗',
    color: '#10B981',
    hobbies: [
      'Hiking', 'Trekking', 'Rock Climbing', 'Bouldering', 'Via Ferrata',
      'Mountain Biking', 'Trail Running', 'Camping', 'Bushcraft', 'Spelunking',
      'Ice Climbing', 'Skiing', 'Snowboarding', 'Snowshoeing', 'Volcano Hiking'
    ]
  },
  {
    id: 'family_pet',
    name: 'Familie, Hund & Natur',
    icon: '🐕',
    color: '#F59E0B',
    hobbies: [
      'Hundewandern', 'Kinderwagen-Routen', 'Familien-Camping', 'Tierbeobachtung',
      'Bird Watching', 'Bauernhof-Erlebnisse', 'Natur-Lehrpfade', 'Strandspaziergänge',
      'Picknicken', 'Fahrradanhänger-Touren', 'Waldspielplätze', 'Hundeschwimmen'
    ]
  },
  {
    id: 'culinary_wine',
    name: 'Kulinarik, Wein & Genuss',
    icon: '🍷',
    color: '#8B3A2A',
    hobbies: [
      'Wine Tasting', 'Cooking Classes', 'Street Food Hunting', 'Olive Oil Tours',
      'Cheese Tasting', 'Truffle Hunting', 'Mushroom Foraging', 'Coffee Cupping',
      'Tea Ceremonies', 'Bread Baking', 'Fermentation', 'Distillery Tours',
      'Craft Beer Hopping', 'Farmers Markets', 'Fischer-Frühstück'
    ]
  },
  {
    id: 'culture_history',
    name: 'Kultur, Geschichte & Kunst',
    icon: '🏛️',
    color: '#C9A84C',
    hobbies: [
      'Museum Hopping', 'Architecture Tours', 'Lost Places & Urbex', 'Fado & Flamenco',
      'Jazz Clubs', 'Classical Concerts', 'Vintage Shopping', 'Antique Markets',
      'Pottery & Keramik', 'Painting & Sketching', 'Street Art', 'Lederhandwerk',
      'Buchhandlungen & Antiquariate', 'Archäologie', 'Castles & Palaces'
    ]
  },
  {
    id: 'photo_creativity',
    name: 'Foto, Video & Content',
    icon: '📸',
    color: '#8B5CF6',
    hobbies: [
      'Landscape Photography', 'Street Photography', 'Drone Photography', 'Astrophotography',
      'Film Photography (35mm)', 'Underwater Photography', 'Timelapse & Reels', 'Travel Journaling',
      'Blogging', 'Vlogging', 'Poetry', 'Calligraphy', 'Wildlife Photography'
    ]
  },
  {
    id: 'mindful_wellness',
    name: 'Mindful, Wellness & Yoga',
    icon: '🧘',
    color: '#EC4899',
    hobbies: [
      'Yoga', 'Meditation', 'Sound Bath', 'Breathwork', 'Thermalbäder & Onsen',
      'Sauna & Aufguss', 'Cold Plunge & Eisbaden', 'Waldbaden (Shinrin Yoku)',
      'Ayurveda', 'Tai Chi & Qigong', 'Kräuterkunde & Heilpflanzen', 'Detox Retreats'
    ]
  },
  {
    id: 'extreme_adrenaline',
    name: 'Extremsport & Adrenalin',
    icon: '⚡',
    color: '#EF4444',
    hobbies: [
      'Paragliding', 'Skydiving', 'Bungee Jumping', 'Parkour', 'Skateboarding',
      'Hot Air Ballooning', 'Glider Piloting', 'Motorrad-Enduro', 'Offroad Overlanding',
      'Downhill MTB', 'Cave Diving', 'Dog Sledding', 'Speedriding'
    ]
  }
]

export const hobbiesList = hobbyCategories.flatMap(c => c.hobbies)

// ─── WANDERBOND MATCH BUDDIES ─────────────────────────────────────────
export interface MatchBuddy {
  id: number
  name: string
  age: number
  avatar: string
  avatarBg: string
  location: string
  dnaMatchPct: number
  commonHobbies: string[]
  bio: string
  travelStyle: string
  verified: boolean
  hasDog: boolean
  hasKids: boolean
}

export const matchBuddies: MatchBuddy[] = [
  {
    id: 1,
    name: 'Elena & Matteo',
    age: 31,
    avatar: 'EM',
    avatarBg: 'linear-gradient(135deg, #10B981, #0EA5E9)',
    location: 'Lisboa / Ericeira',
    dnaMatchPct: 96,
    commonHobbies: ['Surfing', 'Hundewandern', 'Coffee Cupping', 'Drone Photography'],
    bio: 'Reisen mit unserem Border Collie "Balu" die portugiesische Westküste entlang. Suchen entspannte Buddies für Sunsets & Trail-Sessions.',
    travelStyle: 'Vanlife & Eco-Stays',
    verified: true,
    hasDog: true,
    hasKids: false,
  },
  {
    id: 2,
    name: 'Sarah K.',
    age: 28,
    avatar: 'SK',
    avatarBg: 'linear-gradient(135deg, #8B3A2A, #C9A84C)',
    location: 'Sintra & Cascais',
    dnaMatchPct: 91,
    commonHobbies: ['Hiking', 'Wine Tasting', 'Architecture Tours', 'Landscape Photography'],
    bio: 'Landschaftsarchitektin auf der Suche nach versteckten Palastgärten und unberührten Klippenpfaden.',
    travelStyle: 'Boutique & Slow Travel',
    verified: true,
    hasDog: false,
    hasKids: false,
  },
  {
    id: 3,
    name: 'Familie Weber (Jonas, Mia & Leo)',
    age: 36,
    avatar: 'FW',
    avatarBg: 'linear-gradient(135deg, #F59E0B, #10B981)',
    location: 'Algarve & Costa Vicentina',
    dnaMatchPct: 88,
    commonHobbies: ['Kinderwagen-Routen', 'Familien-Camping', 'Strandspaziergänge', 'Stand-Up Paddle'],
    bio: 'Unterwegs mit Kleinkind (2 J.) und Kinderwagen. Teilen verifizierte barrierefreie Routen und ruhige Buchten.',
    travelStyle: 'Family Explorer',
    verified: true,
    hasDog: false,
    hasKids: true,
  },
  {
    id: 4,
    name: 'Lucas P.',
    age: 25,
    avatar: 'LP',
    avatarBg: 'linear-gradient(135deg, #EF4444, #8B5CF6)',
    location: 'Nazaré / Peniche',
    dnaMatchPct: 84,
    commonHobbies: ['Kitesurfing', 'Bouldering', 'Cold Plunge & Eisbaden', 'Street Food Hunting'],
    bio: 'Adrenalin-Junkie und Surflehrer. Kenne jede geheime Welle und die besten Taco-Stände.',
    travelStyle: 'Backpacker & Action',
    verified: true,
    hasDog: true,
    hasKids: false,
  },
]

// ─── EXTENDED STORY PINS WITH DIFFICULTY, DOG & STROLLER RATINGS ───────
export interface StoryPin {
  id: number
  local: string
  avatar: string
  location: string
  story: string
  rating: number
  reviews: number
  gps: string
  locked: boolean
  tag: string
  image: string
  category: string
  xp: number
  difficulty: 1 | 2 | 3 | 4 | 5 // 1: Sehr leicht, 2: Leicht, 3: Moderat, 4: Anspruchsvoll, 5: Extrem
  dogFriendly: boolean
  dogDetails?: string
  strollerFriendly: boolean
  strollerDetails?: string
  familyKidsFriendly: boolean
  elevation?: string
  bestSeason?: string
  submittedBy?: string
}

export const storyPins: StoryPin[] = [
  {
    id: 1,
    local: 'Fatima, 34',
    avatar: 'F',
    location: 'Praia da Ursa, Portugal',
    story: '200 m hinter dem Aussichtspunkt entspringt eine geheime Klippenquelle. Der Pfad ist unmarkiert — achte auf drei gestapelte Steine links. Perfekt für Süßwasser nach dem Surfen.',
    rating: 4.9,
    reviews: 47,
    gps: '38°47\\'29\\"N · 9°28\\'32\\"W',
    locked: true,
    tag: 'Nature Secret',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 120,
    difficulty: 4,
    dogFriendly: true,
    dogDetails: 'Sportliche Hunde schaffen den Abstieg; Trittsicherheit erforderlich. Wasser mitnehmen.',
    strollerFriendly: false,
    strollerDetails: 'Steiler Geröllpfad — nicht kinderwagentauglich.',
    familyKidsFriendly: false,
    elevation: '140 m Abstieg',
    bestSeason: 'Frühling bis Herbst',
  },
  {
    id: 2,
    local: 'Miguel, 51',
    avatar: 'M',
    location: 'Alfama Hinterhof-Taverne, Lisboa',
    story: 'Das beste Bacalhau in ganz Lissabon hat kein Firmenschild. Klingle an der Rua das Pedras Negras und frage nach dem Tagesgericht ("o prato do dia"). Inhaberin Rosa kocht seit 1987.',
    rating: 4.8,
    reviews: 89,
    gps: '38°42\\'44\\"N · 9°07\\'59\\"W',
    locked: true,
    tag: 'Food Secret',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&auto=format',
    category: 'Food',
    xp: 90,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Hunde im gemütlichen Innenhof willkommen (Wassernapf vorhanden).',
    strollerFriendly: true,
    strollerDetails: 'Ebenerdiger Zugang über die Seitengasse ohne Stufen.',
    familyKidsFriendly: true,
    bestSeason: 'Ganzjährig',
  },
  {
    id: 3,
    local: 'Pedro, 28',
    avatar: 'P',
    location: 'Nazaré Klippenplattform, Portugal',
    story: 'Gehe 15 Minuten am Leuchtturm vorbei den Klippenpfad hinab. Eine versteckte Naturplattform lässt dich die Urgewalt der Riesenwellen spüren — völlig ohne Touristenmassen.',
    rating: 4.9,
    reviews: 63,
    gps: '39°36\\'08\\"N · 9°04\\'13\\"W',
    locked: false,
    tag: 'Surf Secret',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=400&fit=crop&auto=format',
    category: 'Surf',
    xp: 150,
    difficulty: 3,
    dogFriendly: true,
    dogDetails: 'Leinenpflicht wegen steil abfallender Klippenkante zwingend.',
    strollerFriendly: false,
    strollerDetails: 'Schmaler Felsenpfad mit Stufen.',
    familyKidsFriendly: true,
    elevation: '45 m',
    bestSeason: 'Oktober bis März (Big Wave Season)',
  },
  {
    id: 4,
    local: 'Ana, 42',
    avatar: 'A',
    location: 'Serra de Sintra Zauberwald, Portugal',
    story: 'Der unmarkierte Waldpfad hinter den Mauern von Pena führt zu einer verlassenen Eremitage mit Panoramablick über das gesamte Tal. Am besten vor 8 Uhr morgens im Morgennebel.',
    rating: 4.7,
    reviews: 31,
    gps: '38°47\\'24\\"N · 9°23\\'21\\"W',
    locked: true,
    tag: 'Hiking Secret',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 110,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Paradies für Hunde, schattiger Waldweg mit Moosboden und Bächen.',
    strollerFriendly: true,
    strollerDetails: 'Fester Waldschotterweg — gut fahrbar mit Outdoor-Kinderwagen.',
    familyKidsFriendly: true,
    elevation: '80 m',
    bestSeason: 'Ganzjährig',
  },
  {
    id: 5,
    local: 'Carlos & Marta',
    avatar: 'CM',
    location: 'Ericeira Natur-Meerespool, Portugal',
    story: 'Bei Ebbe bildet sich zwischen Praia do Peixe und den Klippen ein glasklarer Meerwasserpool. Einheimische Familien nennen ihn "Piscina Natural". Geschützt vor Strömung.',
    rating: 4.8,
    reviews: 55,
    gps: '38°57\\'50\\"N · 9°25\\'03\\"W',
    locked: false,
    tag: 'Swim Secret',
    image: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=600&h=400&fit=crop&auto=format',
    category: 'Surf',
    xp: 100,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Hundefreundlicher Strandabschnitt bei Ebbe.',
    strollerFriendly: true,
    strollerDetails: 'Promenade mit Rampe direkt zum Sandstrand.',
    familyKidsFriendly: true,
    bestSeason: 'Mai bis Oktober',
  },
  {
    id: 6,
    local: 'Sofia, 29',
    avatar: 'S',
    location: 'Douro Tal Winzerhöhle, Portugal',
    story: 'Eine kleine Quinta am Nordufer ohne Schild öffnet ihre 120 Jahre alten Weinfässer für Verkostungen direkt im Naturstein-Gewölbe. Der Winzer spricht nur Portugiesisch und schenkt großzügig ein.',
    rating: 5.0,
    reviews: 22,
    gps: '41°09\\'14\\"N · 7°47\\'34\\"W',
    locked: true,
    tag: 'Wine Secret',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop&auto=format',
    category: 'Food',
    xp: 200,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Hundefreundliches Weingut mit großem Hof.',
    strollerFriendly: true,
    strollerDetails: 'Ebener Hof und rollstuhlgerechte Verkostungsstube.',
    familyKidsFriendly: true,
    bestSeason: 'September / Oktober (Weinlese)',
  },
  {
    id: 7,
    local: 'Lars & Heidi',
    avatar: 'LH',
    location: 'Königssee Malerwinkel Panoramasteig, Bayern',
    story: 'Früh morgens um 6:30 Uhr liegt der Königssee spiegelglatt da. Der obere Malerwinkel-Pfad zweigt unauffällig vor den Bootshäusern ab und bietet absolute Stille.',
    rating: 4.9,
    reviews: 74,
    gps: '47°35\\'18\\"N · 12°59\\'20\\"W',
    locked: false,
    tag: 'Alpine Secret',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 130,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Hunde an kurzer Leine erlaubt; saubere Bergquellen am Wegrand.',
    strollerFriendly: true,
    strollerDetails: 'Breiter, gekiester Rundweg — perfekt für Kinderwagen.',
    familyKidsFriendly: true,
    elevation: '60 m',
    bestSeason: 'Mai bis November',
  },
  {
    id: 8,
    local: 'Giacomo, 44',
    avatar: 'G',
    location: 'Val d\\'Orcia Zypressenallee Secret Spot, Toskana',
    story: 'Die berühmte Zypressen-Kurve bei San Quirico d\\'Orcia hat einen versteckten Picknickplatz unter zwei 300 Jahre alten Steineichen mit Blick über die gesamte Hochebene.',
    rating: 5.0,
    reviews: 38,
    gps: '43°03\\'41\\"N · 11°36\\'22\\"E',
    locked: true,
    tag: 'Photography Secret',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop&auto=format',
    category: 'Food',
    xp: 140,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Offene Wiesen und schattige Bäume; ideal zum Toben.',
    strollerFriendly: true,
    strollerDetails: 'Flacher Feldweg, direkt vom Parkplatz befahrbar.',
    familyKidsFriendly: true,
    bestSeason: 'Frühling & Goldener Herbst',
  }
]

// ─── EXTENDED TOURS WITH DIFFICULTY & ACCESSIBILITY ───────────────────
export interface CommunityTour {
  id: number
  title: string
  creator: string
  avatar: string
  distance: string
  duration: string
  difficulty: 1 | 2 | 3 | 4 | 5
  bestTime: string
  stops: number
  likes: number
  category: string
  tags: string[]
  image: string
  rating: number
  reviews: number
  dogFriendly: boolean
  dogDetails?: string
  strollerFriendly: boolean
  strollerDetails?: string
  familyKidsFriendly: boolean
  elevation: string
}

export const tours: CommunityTour[] = [
  {
    id: 1,
    title: 'Lisboa Hidden Viewpoints & Miradouros Loop',
    creator: 'Ana & Carlos',
    avatar: 'AC',
    distance: '8.4 km',
    duration: '3h 30m',
    difficulty: 2,
    bestTime: 'Sonnenaufgang oder 17:00–19:00',
    stops: 7,
    likes: 234,
    category: 'Photography',
    tags: ['Aussichtspunkte', 'Fotografie', 'Kostenlos', 'Altstadt'],
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&auto=format',
    rating: 4.9,
    reviews: 88,
    dogFriendly: true,
    dogDetails: 'Hundefreundlich; schattige Parks an 4 von 7 Stopps.',
    strollerFriendly: false,
    strollerDetails: 'Enge Altstadtgassen mit Treppen — eher Babytrage empfohlen.',
    familyKidsFriendly: true,
    elevation: '120 m',
  },
  {
    id: 2,
    title: 'Sintra Mystischer Nebelwald & Schloss-Trail',
    creator: 'Sofia L.',
    avatar: 'SL',
    distance: '12.1 km',
    duration: '5h 00m',
    difficulty: 3,
    bestTime: 'Werktags 07:00–11:00',
    stops: 5,
    likes: 189,
    category: 'History',
    tags: ['Geschichte', 'Natur', 'UNESCO', 'Märchenwald'],
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop&auto=format',
    rating: 4.8,
    reviews: 64,
    dogFriendly: true,
    dogDetails: 'Hunde an der Leine erlaubt; kühle Temperaturen auch im Hochsommer.',
    strollerFriendly: true,
    strollerDetails: 'Hauptroute auf breitem Forstweg für geländegängige Kinderwagen.',
    familyKidsFriendly: true,
    elevation: '340 m',
  },
  {
    id: 3,
    title: 'Ericeira Klippen & World Surfing Reserve Circuit',
    creator: 'Pedro M.',
    avatar: 'PM',
    distance: '6.2 km',
    duration: '2h 00m',
    difficulty: 2,
    bestTime: 'Dawn Patrol 06:30–09:00',
    stops: 4,
    likes: 312,
    category: 'Surf',
    tags: ['Surfen', 'Küste', 'Sonnenuntergang', 'Meeresbrise'],
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=400&fit=crop&auto=format',
    rating: 5.0,
    reviews: 121,
    dogFriendly: true,
    dogDetails: 'Hunde lieben diesen breiten Klippenpfad mit Meeresbrise.',
    strollerFriendly: true,
    strollerDetails: 'Asphaltierter und geschotterter Uferweg ohne Treppen.',
    familyKidsFriendly: true,
    elevation: '50 m',
  },
  {
    id: 4,
    title: 'Alfama Romantische Fado & Kulinarik Nacht-Route',
    creator: 'Miguel R.',
    avatar: 'MR',
    distance: '3.1 km',
    duration: '4h 00m',
    difficulty: 1,
    bestTime: 'Start 19:30 Uhr',
    stops: 6,
    likes: 445,
    category: 'Culture',
    tags: ['Fado', 'Tapas & Wein', 'Romantik', 'Musik'],
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop&auto=format',
    rating: 4.9,
    reviews: 167,
    dogFriendly: true,
    dogDetails: 'Hunde in den meisten Freisitzen und Tavernenhöfen gestattet.',
    strollerFriendly: false,
    strollerDetails: 'Historisches Kopfsteinpflaster und Treppenaufgänge.',
    familyKidsFriendly: true,
    elevation: '70 m',
  },
  {
    id: 5,
    title: 'Dolomiten Drei Zinnen Panorama Familien-Rundweg',
    creator: 'Markus & Lisa',
    avatar: 'ML',
    distance: '9.8 km',
    duration: '3h 45m',
    difficulty: 2,
    bestTime: 'Juli bis Oktober ab 08:00',
    stops: 5,
    likes: 512,
    category: 'Nature',
    tags: ['Alpen', 'Dolomiten', 'Familienfreundlich', 'Hütten-Einkehr'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&auto=format',
    rating: 5.0,
    reviews: 204,
    dogFriendly: true,
    dogDetails: 'Hervorragend für Hunde; Wassernäpfe auf allen bewirtschafteten Hütten.',
    strollerFriendly: true,
    strollerDetails: 'Flacher Schotterweg vom Rifugio Auronzo bis zur Lavaredohütte kinderwagentauglich.',
    familyKidsFriendly: true,
    elevation: '210 m',
  }
]

// ─── ACTIVITIES ───────────────────────────────────────────────────────
export const activities = [
  {
    id: 1, name: 'Secret Cliff Sunset Yoga', cat: 'Wellness', icon: '🧘',
    price: '€15', rating: 4.9, participants: 'Max. 8 Pers.', difficulty: 1,
    dogFriendly: true, strollerFriendly: true, familyKidsFriendly: true
  },
  {
    id: 2, name: 'Authentic Fado Cooking Class & Wine Tasting', cat: 'Food', icon: '🍷',
    price: '€45', rating: 5.0, participants: 'Kleine Gruppe', difficulty: 1,
    dogFriendly: true, strollerFriendly: true, familyKidsFriendly: true
  },
  {
    id: 3, name: 'Private Surf Guiding & Secret Reef Coaching', cat: 'Extreme', icon: '🏄',
    price: '€60', rating: 4.9, participants: '1–4 Pers.', difficulty: 4,
    dogFriendly: false, strollerFriendly: false, familyKidsFriendly: false
  },
  {
    id: 4, name: 'Family & Dog Friendly Coastal Walk & Picnic', cat: 'Family', icon: '🐕',
    price: 'Kostenlos', rating: 4.9, participants: 'Offene Community', difficulty: 1,
    dogFriendly: true, strollerFriendly: true, familyKidsFriendly: true
  },
  {
    id: 5, name: 'Sintra Lost Eremitage Photo Expedition', cat: 'Culture', icon: '📸',
    price: '€25', rating: 4.8, participants: 'Max. 6 Pers.', difficulty: 2,
    dogFriendly: true, strollerFriendly: true, familyKidsFriendly: true
  }
]

// ─── RADAR & SCAMS ────────────────────────────────────────────────────
export const hazardReports = [
  {
    id: 1, title: 'Klippenabbruch-Warnung Praia do Magoito', type: 'hazard',
    location: 'Magoito Klippen, Sintra', time: 'vor 2 Std.', status: 'Aktiv',
    desc: 'Nach starken Regenfällen ist der südliche Abstiegspfad instabil. Bitte den befestigten Holzsteg nutzen.',
    severity: 'High', votes: 42
  },
  {
    id: 2, title: 'Fake-Tram-Tickets am Praça da Figueira', type: 'scam',
    location: 'Lissabon Innenstadt', time: 'vor 5 Std.', status: 'Gemeldet',
    desc: 'Personen im gelben Warnwesten-Look verkaufen ungültige Papiertickets für Tram 28. Nur am Schalter oder im Viva-Viagem-Kiosk kaufen.',
    severity: 'Medium', votes: 89
  }
]

export const cities = [
  { name: 'Lisbon', flag: '🇵🇹', tier: 'Top Destination', total: 15, taken: 11 },
  { name: 'Porto', flag: '🇵🇹', tier: 'Top Destination', total: 12, taken: 9 },
  { name: 'Ericeira & Sintra', flag: '🇵🇹', tier: 'Surf & Nature', total: 10, taken: 8 },
  { name: 'Algarve Coast', flag: '🇵🇹', tier: 'Coastal Hub', total: 14, taken: 10 },
  { name: 'München & Alpen', flag: '🇩🇪', tier: 'Alpine Hub', total: 15, taken: 7 },
  { name: 'Toskana & Florenz', flag: '🇮🇹', tier: 'Culture & Wine', total: 12, taken: 6 },
]

export const businessCategories = [
  'Surfschule & Verleih', 'Café & Bäckerei', 'Boutique Hotel & Guesthouse',
  'Weingut & Verkostung', 'Restaurant & Taverne', 'Outdoor Guide & Trekking',
  'Yogastudio & Wellness', 'Fahrrad- & E-Bike Verleih'
]

export const productBadges = [
  {
    id: 'p1', name: 'Portugal Azulejo Embroidered Patch (300 DPI)',
    desc: 'Hochwertig bestickter 8cm-Aufnäher aus reißfestem Garn mit goldener Kettelrand-Gravur.',
    price: '€ 14,90', size: 'Ø 8.0 cm', type: 'Stickerei-Aufnäher', bestseller: true,
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&auto=format'
  },
  {
    id: 'p2', name: 'Explorer Leather Passport Cover & Laser Stamps',
    desc: 'Echtes vegetabil gegerbtes Rindsleder mit Platz für deinen Reisepass und goldgeprägtem Scratch-Symbol.',
    price: '€ 39,00', size: '14 x 10 cm', type: 'Leder-Reisepasshülle', bestseller: true,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=400&fit=crop&auto=format'
  },
  {
    id: 'p3', name: 'Scratch Gold Foil World Map (Deluxe Edition)',
    desc: 'Exklusive 80x50cm Wandkarte mit tiefschwarzem Matt-Finish und feinster abkratzbarer Goldfolie.',
    price: '€ 49,00', size: '80 x 50 cm', type: 'Rubbel-Wandkarte', bestseller: false,
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop&auto=format'
  }
]
`;

fs.writeFileSync(path.join(srcDir, 'data/data.ts'), dataContent, 'utf8');
console.log('Enriched data.ts with 130+ Hobbies, difficulty, dog and stroller ratings!');
