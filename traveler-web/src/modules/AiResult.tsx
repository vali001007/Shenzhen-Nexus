import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'
import { useAppStore } from '../stores/useAppStore'
import { getLocaleText } from '../utils/locale'
import type { ItineraryStop, LocaleText } from '../data/types'
import { useState } from 'react'

interface ItineraryResult {
  title?: LocaleText | string
  duration?: string
  stops?: ItineraryStop[]
}

const themeColors: Record<string, { dot: string; border: string }> = {
  tech: { dot: 'bg-sky-500 shadow-[0_0_10px_#38bdf8]', border: 'border-sky-500/30' },
  food: { dot: 'bg-rose-500 shadow-[0_0_10px_#f43f5e]', border: 'border-rose-500/30' },
  culture: { dot: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]', border: 'border-amber-500/30' },
  city: { dot: 'bg-emerald-500 shadow-[0_0_10px_#10b981]', border: 'border-emerald-500/30' },
}
const defaultTheme = { dot: 'bg-slate-500', border: 'border-slate-700' }

export function AiResult() {
  const { t } = useTranslation()
  const modulePayload = useUIStore((s) => s.modulePayload)
  const openModule = useUIStore((s) => s.openModule)
  const closeModule = useUIStore((s) => s.closeModule)
  const switchTab = useUIStore((s) => s.switchTab)
  const showToast = useUIStore((s) => s.showToast)
  const saveItinerary = useAppStore((s) => s.saveItinerary)

  const result = modulePayload?.result as ItineraryResult | undefined
  const [savedItineraryId, setSavedItineraryId] = useState<string | null>(null)

  if (!result) {
    return (
      <div className="glass-panel rounded-2xl border border-slate-700 p-5 text-center">
        <p className="text-sm text-slate-400">{t('ai-result-empty')}</p>
      </div>
    )
  }

  const handleSave = () => {
    if (!result.title || !result.stops?.length) return
    const title = typeof result.title === 'string' ? { en: result.title, zh: result.title } : result.title
    const id = saveItinerary({
      title,
      duration: result.duration,
      stops: result.stops,
    })
    setSavedItineraryId(id)
    showToast(t('route-saved'))
    closeModule()
    switchTab('route')
  }

  return (
    <div className="space-y-5">
      {result.title && (
        <div className="glass-panel rounded-2xl border border-sky-500/30 p-5">
          <h3 className="font-bold text-white text-lg">{getLocaleText(result.title)}</h3>
          {result.duration && (
            <p className="text-xs text-sky-400 mt-1">⏱️ {result.duration}</p>
          )}
        </div>
      )}

      <div className="relative pl-4 border-l-2 border-slate-700 space-y-4 ml-2">
        {result.stops?.map((stop, i) => {
          const theme = themeColors[stop.theme || ''] || defaultTheme
          return (
            <div key={i} className={`relative glass-panel rounded-2xl border ${theme.border} p-4 fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`absolute -left-[25px] top-4 w-3 h-3 rounded-full border-2 border-slate-900 ${theme.dot}`} />
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-sky-400 shrink-0">{stop.time}</span>
                <h4 className="font-bold text-white text-sm">{getLocaleText(stop.title)}</h4>
              </div>
              {stop.locationName && (
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 mb-2">
                  📍 {getLocaleText(stop.locationName)}
                </span>
              )}
              <p className="text-xs text-slate-400 leading-relaxed">{getLocaleText(stop.description)}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-2 pt-2">
        <button
          className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition"
          onClick={handleSave}
        >
          {t('save-route')}
        </button>
        <button
          className="w-full py-3 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold text-sm transition"
          onClick={() => openModule('booking-service', { ctx: { source: 'ai-result', ctaType: 'guide', ...(savedItineraryId ? { itineraryId: savedItineraryId } : {}) } })}
        >
          {t('hire-guide')}
        </button>
      </div>
    </div>
  )
}
