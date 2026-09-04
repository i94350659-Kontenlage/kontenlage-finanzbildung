import pathlib

src = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\Website analysis and badge creation\src")

# 1. TravelContext.tsx
ctx_file = src / "context" / "TravelContext.tsx"
ctx_content = ctx_file.read_text(encoding="utf-8")

old_user_block = """  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('snt_user')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return {
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
    }
  })"""

new_user_block = """  const [user, setUser] = useState<UserProfile>(() => {
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
  })"""

ctx_content = ctx_content.replace(old_user_block, new_user_block)

# Add loginAsTester & resetToStandardUser to TravelContextType
if "loginAsTester: () => void" not in ctx_content:
    ctx_content = ctx_content.replace(
        "likeFeedItem: (id: string) => void\n}",
        "likeFeedItem: (id: string) => void\n  loginAsTester: () => void\n  resetToStandardUser: () => void\n}"
    )

# Add helper functions in TravelProvider
tester_funcs = """  const loginAsTester = () => {
    const andreyUser: UserProfile = {
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
        'Thermalquellen & Hot Springs',
      ],
      countriesCount: 48,
      secretsCount: 120,
      badgesCount: 184,
      storiesCount: 24,
    }
    setUser(andreyUser)
    setScratchedIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])
    setRevealedPins([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])
    setBadges(prev => prev.map((b, idx) => (idx < 50 ? { ...b, unlocked: true } : b)))
  }

  const resetToStandardUser = () => {
    const stdUser: UserProfile = {
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
    setUser(stdUser)
    setScratchedIds([1, 5, 6])
    setRevealedPins([1, 3, 5])
    setBadges(allBadges)
  }
"""

if "const loginAsTester" not in ctx_content:
    ctx_content = ctx_content.replace(
        "return (\n    <TravelContext.Provider",
        f"{tester_funcs}\n  return (\n    <TravelContext.Provider"
    )
    ctx_content = ctx_content.replace(
        "likeFeedItem,\n      }}",
        "likeFeedItem,\n        loginAsTester,\n        resetToStandardUser,\n      }}"
    )

ctx_file.write_text(ctx_content, encoding="utf-8")
print("TravelContext.tsx updated with clean default user + private tester switcher!")

# 2. Login.tsx with discrete tester login and URL detection
login_tsx = r"""import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, loginAsTester, triggerHaptic } = useTravel()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [testerTriggered, setTesterTriggered] = useState(false)

  // Auto-detect private tester link: /login?test_account=andrey or /login?tester=andrey
  useEffect(() => {
    const testerParam = searchParams.get('test_account') || searchParams.get('tester')
    if (testerParam && testerParam.toLowerCase().includes('andrey')) {
      loginAsTester()
      setTesterTriggered(true)
      setTimeout(() => {
        navigate('/passport')
      }, 1200)
    }
  }, [searchParams, loginAsTester, navigate])

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    triggerHaptic(15)

    if (email.toLowerCase().includes('andrey')) {
      loginAsTester()
      setTesterTriggered(true)
      setTimeout(() => {
        navigate('/passport')
      }, 1000)
      return
    }

    setSent(true)
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    triggerHaptic([30, 60])
    navigate('/passport')
  }

  const handleManualTesterLogin = () => {
    triggerHaptic([20, 50, 80])
    loginAsTester()
    setTesterTriggered(true)
    setTimeout(() => {
      navigate('/passport')
    }, 1000)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 pb-24 md:pb-8">
      <div className="card w-full max-w-md p-8 border-[rgba(201,168,76,0.3)] shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🧭</span>
          <h1 className="font-display text-2xl font-bold text-[#F4E4C1]">Explorer Login</h1>
          <p className="font-script text-[rgba(201,168,76,0.5)] text-base">access your digital travel passport</p>
        </div>

        {testerTriggered ? (
          <div className="bg-[#0C1825] rounded-xl p-5 border border-amber-500/40 text-center space-y-2">
            <span className="text-3xl block">👑</span>
            <p className="font-display text-[#F4E4C1] text-base font-bold">Andrey Test (Master Access) geladen!</p>
            <p className="font-mono text-xs text-[#C9A84C]">Level 25 · 460+ Badges · Alle Secret Spots freigeschaltet</p>
            <p className="text-[0.65rem] text-[#8A9AAA]">Weiterleitung zum Reisepass...</p>
          </div>
        ) : sent ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-[#0C1825] rounded-xl p-4 border border-emerald-500/30 text-center">
              <span className="text-2xl block mb-1">✉️</span>
              <p className="font-body text-emerald-400 text-sm font-semibold">Magic Link / Code gesendet!</p>
              <p className="font-mono text-[0.62rem] text-[#8A9AAA] mt-1">an {email}</p>
            </div>

            <div>
              <label className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                6-stelliger Bestätigungscode (Demo-Code: 123456)
              </label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                className="field text-center font-mono tracking-widest text-lg"
                maxLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold">
              Bestätigen &amp; Einloggen →
            </button>

            <button type="button" onClick={() => setSent(false)} className="btn btn-ghost w-full text-xs py-2">
              ← Andere E-Mail verwenden
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <label className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                Deine E-Mail Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@explorer.eu"
                className="field"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold shadow-lg">
              Magic Link senden →
            </button>

            <div className="pt-4 border-t border-[rgba(201,168,76,0.1)] text-center">
              <p className="font-body text-[0.72rem] text-[#8A9AAA] mb-3">
                Noch kein Konto? Melde dich mit deiner E-Mail an und dein Pass wird automatisch erstellt.
              </p>
              <button
                type="button"
                onClick={handleManualTesterLogin}
                className="text-[0.65rem] font-mono text-[rgba(201,168,76,0.5)] hover:text-[#C9A84C] transition-colors"
                title="Privater Zugang für Tester"
              >
                🔒 Privater Tester-Zugang (Andrey Test)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
"""
(src / "pages" / "Login.tsx").write_text(login_tsx, encoding="utf-8")
print("Login.tsx updated with tester login switch!")
