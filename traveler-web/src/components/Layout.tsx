import { Header } from './Header'
import { TabBar } from './TabBar'
import { Overlay } from './Overlay'
import { Toast } from './Toast'
import { useUIStore } from '../stores/useUIStore'
import { ExploreView } from '../views/ExploreView'
import { LeaderboardView } from '../views/LeaderboardView'
import { RouteView } from '../views/RouteView'
import { ProfileView } from '../views/ProfileView'

const viewMap = {
  explore: ExploreView,
  leaderboard: LeaderboardView,
  route: RouteView,
  profile: ProfileView,
} as const

export function Layout() {
  const currentTab = useUIStore((s) => s.currentTab)
  const ActiveView = viewMap[currentTab]

  return (
    <div id="app-container" className="w-full min-h-screen sm:min-h-0 bg-slate-900 relative flex flex-col">
      <Header />
      <main className="flex-1 px-4 pb-24 relative overflow-y-auto no-scrollbar">
        <ActiveView />
      </main>
      <TabBar />
      <Overlay />
      <Toast />
    </div>
  )
}
