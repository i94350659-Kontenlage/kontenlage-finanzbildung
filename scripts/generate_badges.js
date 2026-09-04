const fs = require('fs');
const path = require('path');

const inputPath = 'G:/Scratch´nTravel/AusbauÜberlegungen/Badges base.txt';
const targetDir = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src';

if (!fs.existsSync(inputPath)) {
  console.error('Input file not found:', inputPath);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
console.log('Total badge lines found:', lines.length);

const categoryEmojiMap = {
  'Land': '🌍',
  'Region': '🗺️',
  'Meilenstein': '🏆',
  'Aktivitaet': '🤝',
  'Saison/Event': '✨',
  'Spezial': '⭐',
  'Hilfe & Rettung': '🪽',
  'Unterkunft': '🏡',
  'Scam-Alarm': '🛡️',
  'Vielreisende': '✈️',
  'Merch & Shop': '🛍️',
  'Community & Gruppen': '👥',
  'VIP & Treue': '💎',
  'Hobby-Matcher': '🧬',
  'Orte mit Seele': '🔑',
  'Tools & Engagement': '🤖'
};

const countryEmojiMap = {
  'Albanien': '🇦🇱', 'Andorra': '🇦🇩', 'Armenien': '🇦🇲', 'Aserbaidschan': '🇦🇿',
  'Bosnien und Herzegowina': '🇧🇦', 'Bulgarien': '🇧🇬', 'Daenemark': '🇩🇰', 'Estland': '🇪🇪',
  'Frankreich': '🇫🇷', 'Deutschland': '🇩🇪', 'Griechenland': '🇬🇷', 'Island': '🇮🇸',
  'Irland': '🇮🇪', 'Italien': '🇮🇹', 'Kosovo': '🇽🇰', 'Kroatien': '🇭🇷',
  'Lettland': '🇱🇻', 'Liechtenstein': '🇱🇮', 'Litauen': '🇱🇹', 'Luxemburg': '🇱🇺',
  'Malta': '🇲🇹', 'Moldau': '🇲🇩', 'Monaco': '🇲🇨', 'Montenegro': '🇲🇪',
  'Niederlande': '🇳🇱', 'Nordmazedonien': '🇲🇰', 'Norwegen': '🇳🇴', 'Oesterreich': '🇦🇹',
  'Polen': '🇵🇱', 'Portugal': '🇵🇹', 'Rumaenien': '🇷🇴', 'San Marino': '🇸🇲',
  'Schweden': '🇸🇪', 'Schweiz': '🇨🇭', 'Serbien': '🇷🇸', 'Slowakei': '🇸🇰',
  'Slowenien': '🇸🇮', 'Spanien': '🇪🇸', 'Tschechien': '🇨🇿', 'Ukraine': '🇺🇦',
  'Ungarn': '🇭🇺', 'Vereinigtes Koenigreich': '🇬🇧', 'Zypern': '🇨🇾',
  'China': '🇨🇳', 'Indien': '🇮🇳', 'Indonesien': '🇮🇩', 'Japan': '🇯🇵',
  'Thailand': '🇹🇭', 'Aegypten': '🇪🇬', 'Suedafrika': '🇿🇦', 'USA': '🇺🇸',
  'Kanada': '🇨🇦', 'Brasilien': '🇧🇷', 'Australien': '🇦🇺', 'Neuseeland': '🇳🇿'
};

const badges = [];

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(';');
  if (parts.length < 5) continue;
  const id = parts[0].trim();
  const category = parts[1].trim();
  const name = parts[2].trim();
  const desc = parts[3].trim();
  const motif = parts[4].trim();
  const rawTier = (parts[5] || '').toLowerCase();
  const locations = (parts[6] || '').trim();

  let tier = 'bronze';
  if (rawTier.includes('platin') || rawTier.includes('myth') || id === 'B237' || id === 'B233') {
    tier = (id === 'B237' || id === 'B233') ? 'mythic' : 'platinum';
  } else if (rawTier.includes('gold') || rawTier.includes('hoch')) {
    tier = 'gold';
  } else if (rawTier.includes('silber')) {
    tier = 'silver';
  } else if (category === 'Region') {
    tier = 'silver';
  } else if (category === 'Spezial') {
    tier = 'gold';
  }

  let xp = 100;
  if (tier === 'mythic') xp = 2500;
  else if (tier === 'platinum') xp = 500;
  else if (tier === 'gold') xp = 300;
  else if (tier === 'silver') xp = 200;
  else xp = 100;

  let emoji = categoryEmojiMap[category] || '🏷️';
  if (category === 'Land') {
    for (const [cName, cFlag] of Object.entries(countryEmojiMap)) {
      if (name.includes(cName)) {
        emoji = cFlag;
        break;
      }
    }
  }

  const unlockedIds = ['B009','B010','B014','B025','B028','B030','B034','B038','B042','B052','B055','B195','B206','B221','B223','B224','B245','B276','B280','B296','B364','B418','B446','B449','B450','B454','B457'];
  const isUnlocked = unlockedIds.includes(id);

  badges.push({
    id,
    category,
    name,
    desc,
    motif,
    tier,
    xp,
    emoji,
    unlocked: isUnlocked,
    dateUnlocked: isUnlocked ? '2026-04-12' : undefined,
    merchReady: true,
    locations
  });
}

console.log('Processed badges count:', badges.length);

const outBadgesTs = `// AUTO-GENERATED FROM BADGES BASE.TXT - 460+ AUTHENTIC BADGES
export interface BadgeItem {
  id: string
  category: string
  name: string
  desc: string
  motif: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic'
  xp: number
  emoji: string
  unlocked?: boolean
  dateUnlocked?: string
  merchReady?: boolean
  locations?: string
}

export const tierGradient: Record<string, string> = {
  bronze: 'linear-gradient(135deg, #8B5A1A 0%, #CD7F32 100%)',
  silver: 'linear-gradient(135deg, #7A8B99 0%, #B8C7D4 100%)',
  gold: 'linear-gradient(135deg, #C9A84C 0%, #E8C460 50%, #A07830 100%)',
  platinum: 'linear-gradient(135deg, #6A8FAF 0%, #C0D8EE 50%, #8B6BAE 100%)',
  mythic: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)',
}

export const tierBorder: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#B8C7D4',
  gold: '#C9A84C',
  platinum: '#8B6BAE',
  mythic: '#FF6B6B',
}

export const allBadges: BadgeItem[] = ${JSON.stringify(badges, null, 2)};
`;

fs.writeFileSync(path.join(targetDir, 'data/allBadges.ts'), outBadgesTs, 'utf8');
console.log('Successfully written to allBadges.ts');
