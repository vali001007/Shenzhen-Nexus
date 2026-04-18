import { Compass, Trophy, Map, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUIStore, type TabId } from '../stores/useUIStore'

const tabs: { id: TabId; icon: typeof Compass; labelKey: string }[] = [
  { id: 'explore', icon: Compass, labelKey: 'nav-explore' },
  { id: 'leaderboard', icon: Trophy, labelKey: 'nav-leaderboard' },
  { id: 'route', icon: Map, labelKey: 'nav-route' },
  { id: 'profile', icon: User, labelKey: 'nav-profile' },
]

export function TabBar() {
  const { t } = useTranslation()
  const currentTab = useUIStore((s) => s.currentTab)
  const switchTab = useUIStore((s) => s.switchTab)

  return (
    <nav className="absolute bottom-0 w-full glass-panel border-t border-slate-800 z-50">
      <div className="flex justify-around items-center h-16 px-1">
        {tabs.map(({ id, icon: Icon, labelKey }) => (
          <button
            key={id}
            className={`flex flex-col items-center justify-center w-full h-full transition ${
              currentTab === id ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            onClick={() => switchTab(id)}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{t(labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
