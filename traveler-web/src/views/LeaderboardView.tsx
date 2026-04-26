import { useTranslation } from 'react-i18next'
import { useState, useEffect, useCallback } from 'react'
import type { SpotRuntime } from '../data/types'
import { SpotCard } from '../components/SpotCard'
import { useUIStore } from '../stores/useUIStore'
import { fetchLeaderboardPage } from '../services/api'

const categories = [
  { id: 'all', key: 'tab-all' },
  { id: 'landmark', key: 'tab-landmark' },
  { id: 'tech', key: 'tab-tech' },
  { id: 'culture', key: 'tab-culture' },
  { id: 'food', key: 'tab-food' },
]

export function LeaderboardView() {
  const { t } = useTranslation()
  const openSpotDetail = useUIStore((s) => s.openSpotDetail)

  const [activeCategory, setActiveCategory] = useState('all')
  const [spots, setSpots] = useState<SpotRuntime[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadSpots = useCallback(async (category: string, pageNum: number, append = false) => {
    setLoading(true)
    try {
      const res = await fetchLeaderboardPage(category, pageNum, 3)
      setSpots((prev) => append ? [...prev, ...res.items] : res.items)
      setHasMore(res.hasMore)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    loadSpots(activeCategory, 1)
  }, [activeCategory, loadSpots])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadSpots(activeCategory, nextPage, true)
  }

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId)
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-2xl border border-sky-500/30 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/30">{t('leader-fusion-badge')}</span>
        </div>
        <h3 className="font-bold text-white text-sm">{t('leader-fusion-title')}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{t('leader-fusion-desc')}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
            }`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {t(cat.key)}
          </button>
        ))}
      </div>

      <div className="space-y-4" data-testid="leaderboard-list">
        {spots.map((spot) => (
          <div key={spot.id} data-testid="spot-card" onClick={() => openSpotDetail(spot.id)}>
            <SpotCard spot={spot} onClick={() => openSpotDetail(spot.id)} />
          </div>
        ))}

        {loading && (
          <div className="glass-panel rounded-2xl border border-slate-700 p-4 animate-pulse text-sm text-slate-300 text-center">
            {t('leader-loading')}
          </div>
        )}

        {hasMore && !loading && (
          <div className="pt-1 text-center">
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
              onClick={handleLoadMore}
            >
              {t('leader-load-more')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
