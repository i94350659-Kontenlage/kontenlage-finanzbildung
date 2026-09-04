const fs = require('fs');
const path = require('path');

const srcDir = 'G:/Scratch´nTravel/AusbauÜberlegungen/Website analysis and badge creation/src';

// Ensure directories exist
fs.mkdirSync(path.join(srcDir, 'context'), { recursive: true });
fs.mkdirSync(path.join(srcDir, 'utils'), { recursive: true });
fs.mkdirSync(path.join(srcDir, 'components'), { recursive: true });
fs.mkdirSync(path.join(srcDir, 'pages'), { recursive: true });

// ─── 1. CREATE src/context/TravelContext.tsx ───
const travelContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react'
import { allBadges, BadgeItem } from '../data/allBadges'

export interface PassportStamp {
  id: string
  city: string
  country: string
  flag: string
  date: string
  secretName: string
  gps: string
  xpEarned: number
  category: string
  color: string
}

export interface Quest {
  id: string
  title: string
  city: string
  rewardBadgeId: string
  rewardBadgeName: string
  xp: number
  steps: { id: number; text: string; done: boolean }[]
  completed: boolean
}

export interface HostReservation {
  id: string
  hostBusiness: string
  city: string
  guestName: string
  email: string
  date: string
  time: string
  guests: number
  category: string
  notes: string
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
}

export interface FeedItem {
  id: string
  userName: string
  avatar: string
  action: string
  target: string
  location: string
  time: string
  likes: number
  liked?: boolean
}

export interface UserProfile {
  name: string
  handle: string
  initials: string
  rank: string
  level: number
  xp: number
  xpNext: number
  joinDate: string
  bio: string
  hobbies: string[]
  countriesCount: number
  secretsCount: number
  badgesCount: number
  storiesCount: number
}

interface TravelContextType {
  user: UserProfile
  badges: BadgeItem[]
  stamps: PassportStamp[]
  quests: Quest[]
  reservations: HostReservation[]
  feed: FeedItem[]
  scratchedIds: number[]
  revealedPins: number[]
  triggerHaptic: (pattern?: number | number[]) => void
  scratchSecret: (id: number, xpReward: number, locationName: string, gps: string, category: string) => void
  unlockBadge: (badgeId: string) => void
  completeQuestStep: (questId: string, stepId: number) => void
  createReservation: (res: Omit<HostReservation, 'id' | 'status' | 'createdAt'>) => void
  likeFeedItem: (id: string) => void
}

const initialStamps: PassportStamp[] = [
  { id: 'S01', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', date: '12.09.2025', secretName: 'Alfama Hidden Bacalhau', gps: "38°42'44\\"N · 9°07'59\\"W", xpEarned: 120, category: 'Food', color: '#C9A84C' },
  { id: 'S02', city: 'Sintra', country: 'Portugal', flag: '🇵🇹', date: '15.09.2025', secretName: 'Pena Secret Forest Chapel', gps: "38°47'24\\"N · 9°23'21\\"W", xpEarned: 150, category: 'Nature', color: '#3A6B4A' },
  { id: 'S03', city: 'Kyoto', country: 'Japan', flag: '🇯🇵', date: '15.07.2025', secretName: 'Bamboo Grove Moon Gate', gps: "35°00'58\\"N · 135°40'30\\"E", xpEarned: 250, category: 'Culture', color: '#8B3A2A' },
  { id: 'S04', city: 'Ubud', country: 'Indonesia', flag: '🇮🇩', date: '28.06.2025', secretName: 'Hidden Waterfall Gorge', gps: "8°30'22\\"S · 115°15'44\\"E", xpEarned: 200, category: 'Nature', color: '#2A7B9B' },
  { id: 'S05', city: 'Ericeira', country: 'Portugal', flag: '🇵🇹', date: '10.04.2026', secretName: 'Praia do Peixe Natural Pool', gps: "38°57'50\\"N · 9°25'03\\"W", xpEarned: 110, category: 'Surf', color: '#C9A84C' },
]

const initialQuests: Quest[] = [
  {
    id: 'Q01',
    title: 'Lisbon Secret Hunter Quest',
    city: 'Lisboa, Portugal',
    rewardBadgeId: 'B449',
    rewardBadgeName: 'Geheimtipp-Entdecker',
    xp: 350,
    completed: false,
    steps: [
      { id: 1, text: 'Enthülle das Bacalhau-Geheimnis in der Alfama', done: true },
      { id: 2, text: 'Finde die Klippenquelle bei Praia da Ursa', done: true },
      { id: 3, text: 'Besuche die geheime Waldkapelle in Sintra', done: false },
      { id: 4, text: 'Genieße den Sonnenuntergang am Miradouro de Santa Catarina', done: false },
    ],
  },
  {
    id: 'Q02',
    title: 'Atlantic Surf Pioneer',
    city: 'Ericeira & Nazaré',
    rewardBadgeId: 'B450',
    rewardBadgeName: 'Monsterwellen-Zeuge',
    xp: 400,
    completed: false,
    steps: [
      { id: 1, text: 'Checke den Nazaré Cliff-Viewpoint bei Flut', done: true },
      { id: 2, text: 'Schwimme im Devil’s Pool von Ericeira', done: false },
      { id: 3, text: 'Tausche Wellen-Tipps mit einem Local Surfer aus', done: false },
    ],
  },
  {
    id: 'Q03',
    title: 'Pet & Family Trail Master',
    city: 'Sintra & Cascais',
    rewardBadgeId: 'B460',
    rewardBadgeName: 'Tierfreundlicher Begleiter',
    xp: 250,
    completed: true,
    steps: [
      { id: 1, text: 'Wandere den hundefreundlichen Monsanto Trail', done: true },
      { id: 2, text: 'Mache Pause an einer schattigen Trinkquelle', done: true },
    ],
  },
]

const initialFeed: FeedItem[] = [
  { id: 'f1', userName: 'Maria Santos', avatar: 'MS', action: 'hat einen neuen Stempel gesammelt', target: 'Praia da Ursa Klippenquelle', location: 'Sintra, PT', time: 'vor 12 Min.', likes: 14 },
  { id: 'f2', userName: 'Igor Becker', avatar: 'IB', action: 'hat den Meilenstein freigeschaltet', target: 'Zehnfach-Reisender 🏆', location: 'Global', time: 'vor 45 Min.', likes: 38 },
  { id: 'f3', userName: 'Ana & Pedro', avatar: 'AP', action: 'haben eine neue Tour erstellt', target: 'Ericeira Sunrise Coast Walk', location: 'Ericeira, PT', time: 'vor 2 Std.', likes: 21 },
  { id: 'f4', userName: 'Sofia Chen', avatar: 'SC', action: 'meldete eine Strömungswarnung', target: 'Guincho Beach Riptide ⚠️', location: 'Cascais, PT', time: 'vor 4 Std.', likes: 52 },
]

const TravelContext = createContext<TravelContextType | undefined>(undefined)

export function TravelProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('snt_user')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return {
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
    }
  })

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem('snt_badges')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return allBadges
  })

  const [stamps, setStamps] = useState<PassportStamp[]>(() => {
    const saved = localStorage.getItem('snt_stamps')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return initialStamps
  })

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('snt_quests')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return initialQuests
  })

  const [reservations, setReservations] = useState<HostReservation[]>(() => {
    const saved = localStorage.getItem('snt_reservations')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return [
      {
        id: 'RES-101',
        hostBusiness: 'Surf School Ericeira',
        city: 'Ericeira',
        guestName: 'Maria Santos',
        email: 'maria@wanderer.eu',
        date: '2026-09-18',
        time: '10:00',
        guests: 2,
        category: 'Surf Coaching & Board Rental',
        notes: 'Intermediate level, require 7ft hardboards.',
        status: 'confirmed',
        createdAt: '2026-09-01',
      },
    ]
  })

  const [feed, setFeed] = useState<FeedItem[]>(initialFeed)
  const [scratchedIds, setScratchedIds] = useState<number[]>([1, 5, 6])
  const [revealedPins, setRevealedPins] = useState<number[]>([1, 3, 5])

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('snt_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('snt_badges', JSON.stringify(badges))
  }, [badges])

  useEffect(() => {
    localStorage.setItem('snt_stamps', JSON.stringify(stamps))
  }, [stamps])

  useEffect(() => {
    localStorage.setItem('snt_quests', JSON.stringify(quests))
  }, [quests])

  useEffect(() => {
    localStorage.setItem('snt_reservations', JSON.stringify(reservations))
  }, [reservations])

  const triggerHaptic = (pattern: number | number[] = 20) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(pattern) } catch (e) {}
    }
  }

  const scratchSecret = (id: number, xpReward: number, locationName: string, gps: string, category: string) => {
    if (scratchedIds.includes(id)) return
    triggerHaptic([30, 40, 50])
    setScratchedIds(prev => [...prev, id])
    setRevealedPins(prev => [...prev, id])

    // Update user XP & stats
    setUser(prev => {
      const newXp = prev.xp + xpReward
      let newLvl = prev.level
      let newNext = prev.xpNext
      let newRank = prev.rank

      if (newXp >= prev.xpNext) {
        newLvl += 1
        newNext = Math.round(prev.xpNext * 1.5)
        newRank = \`Explorer Rang \${newLvl} · Master Voyager\`
        triggerHaptic([50, 100, 50, 100])
      }

      return {
        ...prev,
        xp: newXp,
        level: newLvl,
        xpNext: newNext,
        rank: newRank,
        secretsCount: prev.secretsCount + 1,
      }
    })

    // Mint new passport stamp
    const newStamp: PassportStamp = {
      id: \`S\${Date.now()}\`,
      city: locationName.split(',')[0] || 'Portugal',
      country: 'Portugal',
      flag: '🇵🇹',
      date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      secretName: locationName,
      gps,
      xpEarned: xpReward,
      category,
      color: '#C9A84C',
    }
    setStamps(prev => [newStamp, ...prev])

    // Push to activity feed
    setFeed(prev => [
      {
        id: \`f\${Date.now()}\`,
        userName: user.name,
        avatar: user.initials,
        action: 'hat ein neues Geheimnis freigerubbelt',
        target: \`\${locationName} (+\${xpReward} XP)\`,
        location: 'Portugal',
        time: 'Gerade eben',
        likes: 1,
      },
      ...prev,
    ])
  }

  const unlockBadge = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b => (b.id === badgeId ? { ...b, unlocked: true, dateUnlocked: new Date().toISOString().split('T')[0] } : b))
    )
    setUser(prev => ({ ...prev, badgesCount: prev.badgesCount + 1 }))
    triggerHaptic([40, 60, 80])
  }

  const completeQuestStep = (questId: string, stepId: number) => {
    triggerHaptic(25)
    setQuests(prev =>
      prev.map(q => {
        if (q.id !== questId) return q
        const updatedSteps = q.steps.map(s => (s.id === stepId ? { ...s, done: !s.done } : s))
        const allDone = updatedSteps.every(s => s.done)
        if (allDone && !q.completed) {
          unlockBadge(q.rewardBadgeId)
          setUser(u => ({ ...u, xp: u.xp + q.xp }))
        }
        return { ...q, steps: updatedSteps, completed: allDone }
      })
    )
  }

  const createReservation = (res: Omit<HostReservation, 'id' | 'status' | 'createdAt'>) => {
    const newRes: HostReservation = {
      ...res,
      id: \`RES-\${Math.floor(100 + Math.random() * 900)}\`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setReservations(prev => [newRes, ...prev])
    triggerHaptic([30, 60])
  }

  const likeFeedItem = (id: string) => {
    triggerHaptic(15)
    setFeed(prev =>
      prev.map(f => {
        if (f.id !== id) return f
        const isLiked = f.liked
        return { ...f, liked: !isLiked, likes: isLiked ? f.likes - 1 : f.likes + 1 }
      })
    )
  }

  return (
    <TravelContext.Provider
      value={{
        user,
        badges,
        stamps,
        quests,
        reservations,
        feed,
        scratchedIds,
        revealedPins,
        triggerHaptic,
        scratchSecret,
        unlockBadge,
        completeQuestStep,
        createReservation,
        likeFeedItem,
      }}
    >
      {children}
    </TravelContext.Provider>
  )
}

export function useTravel() {
  const ctx = useContext(TravelContext)
  if (!ctx) throw new Error('useTravel must be used within a TravelProvider')
  return ctx
}
`;

fs.writeFileSync(path.join(srcDir, 'context/TravelContext.tsx'), travelContextContent, 'utf8');
console.log('Created TravelContext.tsx');

// ─── 2. CREATE src/utils/calendarExport.ts ───
const calendarExportContent = `export interface CalendarEventParams {
  title: string
  description: string
  location: string
  startDate?: Date
  endDate?: Date
  durationHours?: number
}

export function formatGoogleCalendarDate(date: Date): string {
  return date.toISOString().replace(/-|:|\.\\d+/g, '')
}

export function createGoogleCalendarUrl(params: CalendarEventParams): string {
  const start = params.startDate || new Date(Date.now() + 24 * 60 * 60 * 1000)
  const duration = params.durationHours || 3
  const end = params.endDate || new Date(start.getTime() + duration * 60 * 60 * 1000)

  const startStr = formatGoogleCalendarDate(start)
  const endStr = formatGoogleCalendarDate(end)

  const details = \`\${params.description}\\n\\n📍 Coordinates & Route via Scratch'n'Travel\\n🔗 https://scratchntravel.com\`

  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', \`🧭 Scratch'n'Travel: \${params.title}\`)
  url.searchParams.set('dates', \`\${startStr}/\${endStr}\`)
  url.searchParams.set('details', details)
  url.searchParams.set('location', params.location)

  return url.toString()
}

export function downloadIcsFile(params: CalendarEventParams) {
  const start = params.startDate || new Date(Date.now() + 24 * 60 * 60 * 1000)
  const duration = params.durationHours || 3
  const end = params.endDate || new Date(start.getTime() + duration * 60 * 60 * 1000)

  const pad = (n: number) => (n < 10 ? '0' + n : n)
  const toIcsDate = (d: Date) =>
    \`\${d.getUTCFullYear()}\${pad(d.getUTCMonth() + 1)}\${pad(d.getUTCDate())}T\${pad(d.getUTCHours())}\${pad(d.getUTCMinutes())}\${pad(d.getUTCSeconds())}Z\`

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Scratch n Travel//Trip Planner//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    \`UID:snt-\${Date.now()}@scratchntravel.com\`,
    \`DTSTAMP:\${toIcsDate(new Date())}\`,
    \`DTSTART:\${toIcsDate(start)}\`,
    \`DTEND:\${toIcsDate(end)}\`,
    \`SUMMARY:🧭 Scratch'n'Travel: \${params.title}\`,
    \`DESCRIPTION:\${params.description.replace(/\\n/g, '\\\\n')}\`,
    \`LOCATION:\${params.location}\`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\\r\\n')

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', \`scratchntravel-\${params.title.toLowerCase().replace(/\\s+/g, '-')}.ics\`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
`;

fs.writeFileSync(path.join(srcDir, 'utils/calendarExport.ts'), calendarExportContent, 'utf8');
console.log('Created calendarExport.ts');

// ─── 3. CREATE src/components/StoryGeneratorModal.tsx ───
const storyModalContent = `import React, { useRef, useEffect, useState } from 'react'

interface StoryGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  data: {
    title: string
    location: string
    gps: string
    xp: number
    image?: string
    badgeName?: string
    userName?: string
  }
}

export default function StoryGeneratorModal({ isOpen, onClose, data }: StoryGeneratorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [generating, setGenerating] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    setGenerating(true)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Standard 9:16 Instagram Story Resolution
    canvas.width = 1080
    canvas.height = 1920

    // Background base
    ctx.fillStyle = '#0C1825'
    ctx.fillRect(0, 0, 1080, 1920)

    // Load background image or luxury gradient
    const bgImg = new Image()
    bgImg.crossOrigin = 'anonymous'
    bgImg.src = data.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1920&fit=crop'

    const drawCard = () => {
      // Draw image cover with dark gradient overlay
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, 1080, 1920)
      }
      const grad = ctx.createLinearGradient(0, 0, 0, 1920)
      grad.addColorStop(0, 'rgba(12,24,37,0.85)')
      grad.addColorStop(0.3, 'rgba(12,24,37,0.4)')
      grad.addColorStop(0.7, 'rgba(12,24,37,0.7)')
      grad.addColorStop(1, 'rgba(12,24,37,0.98)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1080, 1920)

      // Gold Decorative Luxury Border
      ctx.strokeStyle = 'rgba(201,168,76,0.4)'
      ctx.lineWidth = 4
      ctx.strokeRect(60, 60, 960, 1800)

      ctx.strokeStyle = 'rgba(201,168,76,0.2)'
      ctx.lineWidth = 2
      ctx.strokeRect(76, 76, 928, 1768)

      // Compass Rose at Top
      ctx.fillStyle = '#C9A84C'
      ctx.font = 'bold 38px Cinzel, serif'
      ctx.textAlign = 'center'
      ctx.fillText('✦  SCRATCH \\'N\\' TRAVEL  ✦', 540, 160)

      ctx.font = '30px DM Mono, monospace'
      ctx.fillStyle = 'rgba(201,168,76,0.7)'
      ctx.fillText('OFFICIAL EXPEDITION LOG', 540, 210)

      // Center Cartouche Badge Box
      ctx.fillStyle = 'rgba(21,37,57,0.88)'
      ctx.strokeStyle = '#C9A84C'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(140, 480, 800, 860, 36)
      ctx.fill()
      ctx.stroke()

      // Large Circular Gold Passport Stamp
      ctx.strokeStyle = 'rgba(201,168,76,0.8)'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(540, 720, 160, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(201,168,76,0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(540, 720, 140, 0, Math.PI * 2)
      ctx.stroke()

      ctx.font = 'bold 80px Cinzel, serif'
      ctx.fillStyle = '#E8C460'
      ctx.fillText('★ GPS ★', 540, 710)

      ctx.font = 'bold 36px DM Mono, monospace'
      ctx.fillStyle = '#C9A84C'
      ctx.fillText('VERIFIED SECRET', 540, 770)

      // Secret Name & Location
      ctx.font = 'bold 64px Cinzel, serif'
      ctx.fillStyle = '#F4E4C1'
      ctx.fillText(data.title.length > 22 ? data.title.slice(0, 20) + '…' : data.title, 540, 980)

      ctx.font = '40px DM Mono, monospace'
      ctx.fillStyle = 'rgba(201,168,76,0.9)'
      ctx.fillText(data.location, 540, 1050)

      ctx.font = '36px DM Mono, monospace'
      ctx.fillStyle = '#38EF7D'
      ctx.fillText(\`GPS: \${data.gps}\`, 540, 1120)

      // XP Reward Badge
      ctx.fillStyle = 'rgba(201,168,76,0.2)'
      ctx.beginPath()
      ctx.roundRect(360, 1180, 360, 90, 45)
      ctx.fill()

      ctx.font = 'bold 44px DM Mono, monospace'
      ctx.fillStyle = '#E8C460'
      ctx.fillText(\`+\${data.xp} EXP EARNED\`, 540, 1242)

      // Footer: Traveler Info & Social Tag
      ctx.font = '36px DM Mono, monospace'
      ctx.fillStyle = '#8A9AAA'
      ctx.fillText(\`Explorer: \${data.userName || 'Maria Santos'}\`, 540, 1540)

      ctx.font = 'bold 42px Cinzel, serif'
      ctx.fillStyle = '#C9A84C'
      ctx.fillText('Tag @scratchntravel to get featured!', 540, 1620)

      ctx.font = '30px DM Mono, monospace'
      ctx.fillStyle = 'rgba(201,168,76,0.6)'
      ctx.fillText('scratchntravel.com · Unlocking Earth\\'s Secrets', 540, 1680)

      setGenerating(false)
    }

    bgImg.onload = drawCard
    bgImg.onerror = drawCard
  }, [isOpen, data])

  if (!isOpen) return null

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = \`scratchntravel-story-\${data.title.toLowerCase().replace(/\\s+/g, '-')}.png\`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleShare = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.toBlob(async blob => {
        if (!blob) return
        const file = new File([blob], 'scratchntravel-story.png', { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: \`Scratch'n'Travel: \${data.title}\`,
            text: \`Ich habe gerade "\${data.title}" auf Scratch'n'Travel freigeschaltet! 🧭✨ #scratchntravel\`,
            files: [file],
          })
        } else {
          handleDownload()
        }
      })
    } catch (err) {
      handleDownload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="card w-full max-w-md p-6 max-h-[90vh] flex flex-col items-center overflow-y-auto">
        <div className="flex items-center justify-between w-full mb-4">
          <div>
            <h3 className="font-display text-[#F4E4C1] text-lg font-bold">9:16 Social Story Card</h3>
            <p className="font-mono text-[0.62rem] text-[#C9A84C]">Ready for Instagram, TikTok & WhatsApp</p>
          </div>
          <button onClick={onClose} className="text-[#8A9AAA] hover:text-[#F4E4C1] text-xl font-bold">
            ✕
          </button>
        </div>

        {/* Canvas preview */}
        <div className="w-full max-w-[260px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border border-[rgba(201,168,76,0.3)] mb-5 bg-[#0C1825] relative">
          {generating && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-[#C9A84C]">
              Generating 9:16 story…
            </div>
          )}
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>

        <div className="flex gap-3 w-full">
          <button onClick={handleShare} className="btn btn-primary flex-1 text-xs py-2.5">
            📲 Share to Story
          </button>
          <button onClick={handleDownload} className="btn btn-secondary flex-1 text-xs py-2.5">
            💾 Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/StoryGeneratorModal.tsx'), storyModalContent, 'utf8');
console.log('Created StoryGeneratorModal.tsx');

// ─── 4. CREATE src/components/ReservationModal.tsx ───
const resModalContent = `import React, { useState } from 'react'
import { useTravel } from '../context/TravelContext'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  hostName: string
  city: string
  category: string
}

export default function ReservationModal({ isOpen, onClose, hostName, city, category }: ReservationModalProps) {
  const { user, createReservation } = useTravel()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '12:30',
    guests: 2,
    notes: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createReservation({
      hostBusiness: hostName,
      city,
      guestName: user.name,
      email: 'maria@wanderer.eu',
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      category,
      notes: form.notes,
    })
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="card w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8A9AAA] hover:text-[#F4E4C1] text-lg font-bold">
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">🎉</span>
            <h3 className="font-display text-[#F4E4C1] text-xl font-bold mb-2">Reservierungsanfrage gesendet!</h3>
            <p className="font-body text-[#8A9AAA] text-sm max-w-md mx-auto mb-5">
              Deine direkte Reservierung bei <strong className="text-[#C9A84C]">{hostName}</strong> für{' '}
              <strong className="text-[#F4E4C1]">{form.guests} Personen</strong> am{' '}
              <strong className="text-[#F4E4C1]">{form.date} um {form.time} Uhr</strong> wurde erfolgreich übermittelt.
              0 % Plattformgebühr für dich und den Partner.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Zurück zur Übersicht
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider">
                0% Provision · Direkter Host-Kontakt
              </span>
              <h3 className="font-display text-[#F4E4C1] text-xl font-bold">Platz / Tisch anfragen</h3>
              <p className="font-body text-[#8A9AAA] text-sm">
                Host: <span className="text-[#C9A84C] font-semibold">{hostName}</span> ({city} · {category})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase tracking-wider block mb-1">Datum</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="field"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase tracking-wider block mb-1">Uhrzeit</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase tracking-wider block mb-1">
                Anzahl Personen / Plätze
              </label>
              <select
                value={form.guests}
                onChange={e => setForm(p => ({ ...p, guests: Number(e.target.value) }))}
                className="field"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(n => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Person' : 'Personen'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase tracking-wider block mb-1">
                Spezielle Wünsche / Notizen (Hund dabei, Surfniveau, Diät)
              </label>
              <textarea
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="field h-20 resize-none text-sm"
                placeholder="z. B. Wir reisen mit Hund, bitte einen Tisch im Außenbereich reservieren…"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
                Abbrechen
              </button>
              <button type="submit" className="btn btn-primary flex-1">
                Anfrage jetzt absenden →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/ReservationModal.tsx'), resModalContent, 'utf8');
console.log('Created ReservationModal.tsx');

// ─── 5. CREATE src/components/TravelMap.tsx ───
const travelMapContent = `import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PinData {
  id: number
  title: string
  location: string
  lat: number
  lng: number
  category: string
  rating: number
  xp: number
  isUnlocked: boolean
  onUnlock?: () => void
}

interface TravelMapProps {
  pins: PinData[]
  height?: string
}

export default function TravelMap({ pins, height = '420px' }: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    // Center on Portugal / Iberian Atlantic by default
    const map = L.map(mapContainerRef.current, {
      center: [38.75, -9.2],
      zoom: 9,
      zoomControl: false,
    })

    // Custom Obsidian Dark Tiles from CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear previous markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer)
      }
    })

    // Add luxury gold compass markers
    pins.forEach(pin => {
      const customHtml = \`
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: \${pin.isUnlocked ? 'linear-gradient(135deg, #C9A84C, #E8C460)' : '#152539'};
          border: 2px solid \${pin.isUnlocked ? '#F4E4C1' : 'rgba(201,168,76,0.5)'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 0 12px \${pin.isUnlocked ? 'rgba(201,168,76,0.6)' : 'rgba(0,0,0,0.5)'};
          cursor: pointer;
        ">
          \${pin.isUnlocked ? '📍' : '🔒'}
        </div>
      \`

      const icon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: customHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const popupContent = \`
        <div style="font-family: 'Cinzel', serif; color: #0C1825; padding: 4px; min-width: 160px;">
          <h4 style="font-weight: 700; margin: 0 0 4px 0; font-size: 13px; color: #2C1810;">\${pin.title}</h4>
          <p style="font-family: 'DM Mono', monospace; font-size: 10px; margin: 0 0 6px 0; color: #8B3A2A;">\${pin.location}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; border-top: 1px solid rgba(44,24,16,0.2); padding-top: 4px;">
            <span>★ \${pin.rating}</span>
            <span style="color: #2e7d32;">+\${pin.xp} XP</span>
          </div>
        </div>
      \`

      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map)
      marker.bindPopup(popupContent)
    })
  }, [pins])

  return (
    <div className="relative rounded-xl overflow-hidden border border-[rgba(201,168,76,0.25)] shadow-2xl">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute top-3 left-3 z-[1000] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.3)] rounded-lg px-3 py-1.5 backdrop-blur-sm pointer-events-none">
        <span className="font-mono text-[0.62rem] text-[#C9A84C] tracking-widest uppercase">
          ✦ Obsidian Live Map · Portugal
        </span>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/TravelMap.tsx'), travelMapContent, 'utf8');
console.log('Created TravelMap.tsx');

// ─── 6. CREATE src/components/MobileBottomNav.tsx ───
const mobileNavContent = `import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function MobileBottomNav() {
  const { triggerHaptic } = useTravel()

  const items = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/explore', label: 'Map', icon: '🗺️' },
    { path: '/scratch', label: 'Scratch', icon: '🪙' },
    { path: '/passport', label: 'Passport', icon: '🛂' },
    { path: '/radar', label: 'Radar', icon: '🛡️' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C1825]/95 backdrop-blur-lg border-t border-[rgba(201,168,76,0.18)] px-2 py-1.5 flex justify-around items-center">
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => triggerHaptic(10)}
          className={({ isActive }) =>
            \`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all \${
              isActive
                ? 'text-[#C9A84C] font-bold scale-105'
                : 'text-[#8A9AAA] hover:text-[#F4E4C1]'
            }\`
          }
        >
          <span className="text-xl leading-none mb-0.5">{item.icon}</span>
          <span className="font-display text-[0.62rem] tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/MobileBottomNav.tsx'), mobileNavContent, 'utf8');
console.log('Created MobileBottomNav.tsx');

// ─── 7. CREATE src/pages/Passport.tsx ───
const passportPageContent = `import React, { useState } from 'react'
import { useTravel } from '../context/TravelContext'

type PassportTab = 'stamps' | 'dna' | 'quests' | 'feed'

export default function Passport() {
  const { user, stamps, quests, feed, completeQuestStep, likeFeedItem, triggerHaptic } = useTravel()
  const [tab, setTab] = useState<PassportTab>('stamps')

  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

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
          <div className="flex items-center gap-2 bg-[#152539] border border-[rgba(201,168,76,0.25)] rounded-xl px-4 py-2">
            <span className="text-xl">🛂</span>
            <div>
              <p className="font-display text-[#C9A84C] text-xs font-bold">{user.rank}</p>
              <p className="font-mono text-[0.62rem] text-[#8A9AAA]">{user.xp} / {user.xpNext} XP</p>
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
                  <div key={String(label)} className="bg-[rgba(44,24,16,0.06)] rounded-xl p-2.5 text-center border border-[rgba(139,58,42,0.12)]">
                    <p className="font-mono text-[0.6rem] text-[#8B3A2A]">{label}</p>
                    <p className="font-display text-[#2C1810] font-black text-xl">{val}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between font-mono text-[0.65rem] text-[#8B3A2A] mb-1">
                  <span>EXP Progression to Level {user.level + 1}</span>
                  <span>{user.xp} / {user.xpNext} XP ({xpPct}%)</span>
                </div>
                <div className="h-3 bg-[rgba(44,24,16,0.15)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: \`\${xpPct}%\`, background: 'linear-gradient(90deg, #8B3A2A, #C9A84C)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation tabs inside Passport */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {([
              ['stamps', '🪙 Meine Stempel (' + stamps.length + ')'],
              ['dna', '🧬 130-Hobby DNA'],
              ['quests', '🏆 Quests & Challenges (' + quests.filter(q => !q.completed).length + ')'],
              ['feed', '🌐 Passport Social Feed'],
            ] as const).map(([t, label]) => (
              <button
                key={t}
                onClick={() => {
                  triggerHaptic(10)
                  setTab(t)
                }}
                className={\`btn text-[0.68rem] py-1.5 px-4 \${
                  tab === t
                    ? 'btn-parchment font-bold border-2 border-[#8B3A2A] shadow-md'
                    : 'bg-transparent text-[#2C1810] border border-[rgba(44,24,16,0.2)]'
                }\`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* TAB 1: STAMPS BOOK */}
          {tab === 'stamps' && (
            <div>
              <p className="font-script text-xl text-[#8B3A2A] mb-4">Official Visa & Explorer Seals</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stamps.map(stamp => (
                  <div
                    key={stamp.id}
                    className="bg-[rgba(44,24,16,0.04)] border-2 border-dashed border-[rgba(139,58,42,0.35)] rounded-2xl p-4 flex flex-col justify-between hover:bg-[rgba(44,24,16,0.08)] transition-all relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{stamp.flag}</span>
                        <div>
                          <p className="font-display text-[#2C1810] font-black text-sm">{stamp.city}</p>
                          <p className="font-mono text-[0.6rem] text-[#8B3A2A]">{stamp.date}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[0.58rem] font-bold px-2 py-0.5 rounded-full border border-[rgba(139,58,42,0.3)] text-[#8B3A2A]">
                        {stamp.category}
                      </span>
                    </div>

                    <div className="my-2">
                      <p className="font-body text-[#2C1810] text-sm font-semibold">{stamp.secretName}</p>
                      <p className="font-mono text-[0.62rem] text-[#8B3A2A] mt-0.5">{stamp.gps}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[rgba(44,24,16,0.1)]">
                      <span className="font-mono text-[0.65rem] font-bold text-emerald-700">+{stamp.xpEarned} XP</span>
                      <span className="font-mono text-[0.6rem] text-[#8B3A2A]">✓ Verified Seal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 130-HOBBY DNA */}
          {tab === 'dna' && (
            <div className="space-y-4">
              <div>
                <p className="font-script text-xl text-[#8B3A2A] mb-1">Your Personal Travel DNA Profile</p>
                <p className="font-body text-[#2C1810] text-sm leading-relaxed">
                  Our matching algorithm connects your soul with destinations and verified locals through 130 distinct interests.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {user.hobbies.map(hobby => (
                  <span
                    key={hobby}
                    className="bg-[#2C1810] text-[#F4E4C1] font-display text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm"
                  >
                    ✦ {hobby}
                  </span>
                ))}
                {['Rock Climbing', 'Sailing', 'Scuba Diving', 'Paella Cooking', 'Drone Photography'].map(extra => (
                  <span
                    key={extra}
                    className="border border-[rgba(44,24,16,0.25)] text-[#2C1810] font-body text-xs px-3 py-1.5 rounded-full opacity-60"
                  >
                    + {extra}
                  </span>
                ))}
              </div>

              <div className="bg-[rgba(44,24,16,0.06)] rounded-xl p-4 mt-4 border border-[rgba(139,58,42,0.15)]">
                <p className="font-display text-[#2C1810] font-bold text-sm mb-1">Top Match Synergy</p>
                <p className="font-body text-[#2C1810] text-sm">
                  94% Match mit Ericeira Surf & Foraging Community · 89% Match mit Sintra Trail Walkers
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: QUESTS */}
          {tab === 'quests' && (
            <div className="space-y-4">
              <p className="font-script text-xl text-[#8B3A2A] mb-2">City Quests & Secret Scavenger Hunts</p>
              <div className="space-y-4">
                {quests.map(quest => (
                  <div
                    key={quest.id}
                    className={\`card-parchment p-5 rounded-xl border \${
                      quest.completed ? 'border-emerald-700 bg-emerald-50/20' : 'border-[rgba(139,58,42,0.3)]'
                    }\`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-[#2C1810] font-bold text-base">{quest.title}</h4>
                          {quest.completed && (
                            <span className="bg-emerald-700 text-white font-mono text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
                              ABGESCHLOSSEN ✓
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[0.62rem] text-[#8B3A2A]">{quest.city} · Belohnung: {quest.rewardBadgeName} (+{quest.xp} XP)</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {quest.steps.map(step => (
                        <label
                          key={step.id}
                          className="flex items-center gap-3 text-sm font-body text-[#2C1810] cursor-pointer hover:opacity-80"
                        >
                          <input
                            type="checkbox"
                            checked={step.done}
                            onChange={() => completeQuestStep(quest.id, step.id)}
                            className="w-4 h-4 rounded border-gray-400 accent-[#8B3A2A]"
                          />
                          <span className={step.done ? 'line-through opacity-60' : ''}>{step.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL FEED */}
          {tab === 'feed' && (
            <div className="space-y-3">
              <p className="font-script text-xl text-[#8B3A2A] mb-2">Live Passport Feed from Friends</p>
              {feed.map(item => (
                <div key={item.id} className="bg-[rgba(44,24,16,0.05)] rounded-xl p-4 flex items-center justify-between border border-[rgba(139,58,42,0.12)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2C1810] text-[#F4E4C1] font-display font-bold flex items-center justify-center text-xs">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-body text-[#2C1810] text-sm">
                        <strong>{item.userName}</strong> {item.action}: <span className="font-semibold">{item.target}</span>
                      </p>
                      <p className="font-mono text-[0.6rem] text-[#8B3A2A]">{item.location} · {item.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => likeFeedItem(item.id)}
                    className={\`btn text-xs py-1 px-3 \${
                      item.liked ? 'bg-red-500 text-white' : 'bg-[rgba(44,24,16,0.1)] text-[#2C1810]'
                    }\`}
                  >
                    ❤️ {item.likes}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Passport.tsx'), passportPageContent, 'utf8');
console.log('Created Passport.tsx');

// ─── 8. UPDATE src/components/Layout.tsx ───
const layoutContent = `import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import MobileBottomNav from './MobileBottomNav'

function CompassRose({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Compass rose">
      <polygon points="50,6 44,50 56,50" fill="#C9A84C" />
      <polygon points="50,94 44,50 56,50" fill="#8A7040" />
      <polygon points="94,50 50,44 50,56" fill="#8A7040" />
      <polygon points="6,50 50,44 50,56" fill="#8A7040" />
      <polygon points="50,6 72,28 50,50" fill="rgba(201,168,76,0.18)" />
      <polygon points="50,6 28,28 50,50" fill="rgba(201,168,76,0.1)" />
      <circle cx="50" cy="50" r="9" fill="#C9A84C" />
      <circle cx="50" cy="50" r="4" fill="#0C1825" />
      <text x="50" y="4" textAnchor="middle" fill="#C9A84C" fontSize="9" fontFamily="Cinzel,serif" fontWeight="700">N</text>
      <text x="50" y="99" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">S</text>
      <text x="97" y="54" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">E</text>
      <text x="3" y="54" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">W</text>
    </svg>
  )
}

const navGroups = [
  {
    label: 'Navigation',
    items: [
      { path: '/', icon: '🏠', label: 'Home' },
      { path: '/explore', icon: '🗺️', label: 'Explore Map' },
      { path: '/scratch', icon: '🪙', label: 'Scratch Cards' },
      { path: '/passport', icon: '🛂', label: 'Reisepass' },
      { path: '/stories', icon: '📍', label: 'Story Pins' },
      { path: '/tours', icon: '👟', label: 'Tours & GPX' },
      { path: '/badges', icon: '🏷️', label: '460+ Badges' },
      { path: '/radar', icon: '🛡️', label: 'Safety Radar' },
      { path: '/ai', icon: '🤖', label: 'AI Concierge' },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/profile', icon: '👤', label: 'Profile' },
      { path: '/checklists', icon: '✅', label: 'Checklists' },
    ],
  },
  {
    label: 'Business',
    items: [
      { path: '/host', icon: '🏢', label: 'Host Portal' },
      { path: '/pricing', icon: '💎', label: 'Pricing' },
      { path: '/login', icon: '🔑', label: 'Sign In' },
    ],
  },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation()
  const { user } = useTravel()
  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  return (
    <aside className="flex flex-col h-full bg-[#0C1825] border-r border-[rgba(201,168,76,0.12)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[rgba(201,168,76,0.1)]">
        <div className="spin-slow flex-shrink-0">
          <CompassRose size={38} />
        </div>
        <div>
          <p className="font-display text-[#C9A84C] text-[0.85rem] font-bold leading-tight tracking-wider">Scratch'n'Travel</p>
          <p className="font-script text-[#8A9AAA] text-[0.72rem]">chart your course</p>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.4)] uppercase tracking-[0.2em] px-2 mb-2">
              · {group.label} ·
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={\`nav-item \${isActive ? 'active' : ''}\`}
                  >
                    <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && <span className="ml-auto text-[#C9A84C] text-[10px]">◀</span>}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* XP bar */}
      <div className="px-4 py-4 border-t border-[rgba(201,168,76,0.1)]">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-xs flex-shrink-0">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="font-display text-[#F4E4C1] text-[0.72rem] truncate">{user.name}</p>
            <p className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.65)] truncate">{user.rank}</p>
          </div>
        </div>
        <div className="xp-bar mb-1">
          <div className="xp-fill" style={{ width: \`\${xpPct}%\` }} />
        </div>
        <div className="flex justify-between">
          <span className="font-mono text-[0.6rem] text-[rgba(138,154,170,0.7)]">{user.xp} XP</span>
          <span className="font-mono text-[0.6rem] text-[rgba(201,168,76,0.5)]">{user.xpNext} XP</span>
        </div>
      </div>
    </aside>
  )
}

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useTravel()

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-[220px] lg:w-[240px] flex-shrink-0 flex-col h-full">
        <Sidebar />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setDrawerOpen(false)} />
      )}
      {/* Mobile drawer */}
      <div
        className={\`fixed inset-y-0 left-0 z-50 w-[240px] md:hidden transition-transform duration-300 \${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }\`}
      >
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[rgba(201,168,76,0.12)] bg-[#0C1825] flex-shrink-0">
          <button onClick={() => setDrawerOpen(true)} className="text-[#C9A84C] text-xl">
            ☰
          </button>
          <div className="flex items-center gap-2">
            <CompassRose size={24} />
            <span className="font-display text-[#C9A84C] text-sm font-bold tracking-wider">Scratch'n'Travel</span>
          </div>
          <NavLink
            to="/passport"
            className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center font-display text-[#0C1825] text-xs font-bold"
          >
            {user.initials}
          </NavLink>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0C1825] map-grid pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/Layout.tsx'), layoutContent, 'utf8');
console.log('Updated Layout.tsx');

// ─── 9. UPDATE src/routes.ts ───
const routesContent = `import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ScratchPage from './pages/ScratchPage'
import Passport from './pages/Passport'
import Stories from './pages/Stories'
import Tours from './pages/Tours'
import BadgesPage from './pages/BadgesPage'
import Profile from './pages/Profile'
import Checklists from './pages/Checklists'
import Radar from './pages/Radar'
import AIConcierge from './pages/AIConcierge'
import Host from './pages/Host'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'explore', Component: Explore },
      { path: 'scratch', Component: ScratchPage },
      { path: 'passport', Component: Passport },
      { path: 'stories', Component: Stories },
      { path: 'tours', Component: Tours },
      { path: 'badges', Component: BadgesPage },
      { path: 'profile', Component: Profile },
      { path: 'checklists', Component: Checklists },
      { path: 'radar', Component: Radar },
      { path: 'ai', Component: AIConcierge },
      { path: 'host', Component: Host },
      { path: 'pricing', Component: Pricing },
      { path: 'login', Component: Login },
      { path: '*', Component: NotFound },
    ],
  },
])
`;

fs.writeFileSync(path.join(srcDir, 'routes.ts'), routesContent, 'utf8');
console.log('Updated routes.ts');

// ─── 10. UPDATE src/main.tsx with TravelProvider ───
const mainContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { TravelProvider } from './context/TravelContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TravelProvider>
      <RouterProvider router={router} />
    </TravelProvider>
  </StrictMode>
)
`;

fs.writeFileSync(path.join(srcDir, 'main.tsx'), mainContent, 'utf8');
console.log('Updated main.tsx');
console.log('All core modules created successfully!');
