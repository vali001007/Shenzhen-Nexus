import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUIStore, type TabId } from '../stores/useUIStore'
import { useLangStore } from '../stores/useLangStore'

const headerKeys: Record<TabId, { title: string; subtitle: string; desc: string }> = {
  explore: { title: 'NEXUS', subtitle: 'Shenzhen 2026', desc: 'header-desc' },
  leaderboard: { title: 'tab-leader-title', subtitle: 'tab-leader-sub', desc: 'tab-leader-desc' },
  route: { title: 'tab-route-title', subtitle: 'tab-route-sub', desc: 'tab-route-desc' },
  profile: { title: 'tab-profile-title', subtitle: 'tab-profile-sub', desc: 'tab-profile-desc' },
}

export function Header() {
  const { t } = useTranslation()
  const currentTab = useUIStore((s) => s.currentTab)
  const currentLang = useLangStore((s) => s.currentLang)
  const changeLang = useLangStore((s) => s.changeLang)
  const keys = headerKeys[currentTab]

  const title = currentTab === 'explore' ? keys.title : t(keys.title)
  const subtitle = currentTab === 'explore' ? keys.subtitle : t(keys.subtitle)
  const desc = keys.desc ? t(keys.desc) : ''

  const handleLangToggle = () => {
    changeLang(currentLang === 'en' ? 'zh' : 'en')
  }

  return (
    <header className="pt-12 pb-6 px-6 relative z-10 transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-sky-900/40 to-transparent -z-10" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white neon-text">{title}</h1>
          <p className="text-sky-400 text-xs font-semibold tracking-widest mt-1 uppercase transition-opacity duration-300">{subtitle}</p>
        </div>
        <button
          className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition"
          onClick={handleLangToggle}
          title={currentLang === 'en' ? '切换中文' : 'Switch to English'}
        >
          <Globe className="w-5 h-5 text-slate-300" />
        </button>
      </div>
      {desc && (
        <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] transition-opacity duration-300">{desc}</p>
      )}
    </header>
  )
}
