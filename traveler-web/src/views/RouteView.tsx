import { useTranslation } from 'react-i18next'
import { Trash2, Sparkles } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import { useUIStore } from '../stores/useUIStore'
import { getLocaleText } from '../utils/locale'

const themeColors: Record<string, string> = {
  tech: 'bg-sky-500 shadow-[0_0_10px_#38bdf8]',
  food: 'bg-rose-500 shadow-[0_0_10px_#f43f5e]',
  culture: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]',
  city: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
}

export function RouteView() {
  const { t } = useTranslation()
  const itineraries = useAppStore((s) => s.itineraries)
  const deleteItinerary = useAppStore((s) => s.deleteItinerary)
  const openModule = useUIStore((s) => s.openModule)

  if (itineraries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 fade-in">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-slate-600" />
        </div>
        <p className="text-sm text-slate-400 font-semibold">{t('route-empty')}</p>
        <p className="text-xs text-slate-600 text-center px-8">{t('route-empty-hint')}</p>
        <button
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-sm hover:from-sky-400 hover:to-indigo-400 transition"
          onClick={() => openModule('ai-planner')}
        >
          {t('route-go-plan')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {itineraries.map((itn, idx) => (
        <div key={itn.id} className="glass-panel p-5 rounded-2xl border border-sky-500/30 relative overflow-hidden fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
          <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-sky-600/10 to-transparent" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="font-bold text-lg text-white">{getLocaleText(itn.title)}</h3>
              {itn.duration && <p className="text-xs text-slate-400 mt-1">⏱️ {itn.duration}</p>}
            </div>
            <button
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500/20 transition shrink-0"
              onClick={() => deleteItinerary(itn.id)}
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-400" />
            </button>
          </div>
          <div className="relative pl-4 border-l-2 border-slate-700 space-y-4 ml-2 relative z-10">
            {itn.stops.map((stop, i) => {
              const dotClass = themeColors[stop.theme || ''] || 'bg-slate-500'
              return (
                <div key={i} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-slate-900 ${dotClass}`} />
                  <p className="text-sm text-white font-semibold">{stop.time} - {getLocaleText(stop.title)}</p>
                  {stop.locationName && (
                    <p className="text-[10px] text-slate-500 mt-0.5">📍 {getLocaleText(stop.locationName)}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">{getLocaleText(stop.description)}</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="text-center pt-2 fade-in" style={{ animationDelay: '0.1s' }}>
        <p className="text-[10px] text-slate-600">{t('tab-route-desc')}</p>
      </div>
    </div>
  )
}
