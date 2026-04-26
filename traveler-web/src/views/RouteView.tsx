import { useTranslation } from 'react-i18next'
import { Trash2, Sparkles, CalendarCheck, X } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import { useUIStore } from '../stores/useUIStore'
import { getLocaleText } from '../utils/locale'
import type { Order } from '../data/types'

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
  const orders = useAppStore((s) => s.orders)
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus)
  const openModule = useUIStore((s) => s.openModule)
  const showToast = useUIStore((s) => s.showToast)

  const activeOrders = orders.filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')

  const statusClass = (status: string) => {
    if (status === 'paid') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    if (status === 'failed') return 'bg-rose-500/20 text-rose-200 border-rose-500/40'
    return 'bg-sky-500/20 text-sky-200 border-sky-500/40'
  }

  const statusLabel = (status: string) =>
    t(`order-status-${status === 'pending_payment' ? 'pending' : status}`)

  const serviceLabel = (type: string) => {
    const map: Record<string, string> = {
      concierge: t('order-service-concierge'),
      guide: t('order-service-guide'),
      'business-dining': t('order-service-dining'),
      photo: t('order-service-photo'),
    }
    return map[type] ?? type
  }

  const handleCancel = (o: Order) => {
    updateOrderStatus(o.orderId, 'cancelled')
    showToast(t('order-status-cancelled'))
  }

  const renderOrderCard = (o: Order) => (
    <div key={o.orderId} className="bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-xl p-3 flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <CalendarCheck className="w-3 h-3 text-fuchsia-400 shrink-0" />
          <span className="text-xs font-semibold text-white">{serviceLabel(o.serviceType)}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${statusClass(o.status)}`}>
            {statusLabel(o.status)}
          </span>
        </div>
        {o.merchantName && <p className="text-[10px] text-slate-400">{o.merchantName}</p>}
        <p className="text-[10px] text-slate-500">{o.date} {o.time} · {o.guests}{t('route-booking-guests')} · ¥{o.amount}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {o.status === 'pending_payment' && (
          <button
            className="text-[10px] font-bold text-sky-300 bg-sky-500/10 border border-sky-500/30 px-2 py-1 rounded-lg hover:bg-sky-500/20 transition"
            onClick={() => openModule('booking-service', { ctx: { spotId: o.spotId, merchantId: o.merchantId, merchantName: o.merchantName, itineraryId: o.itineraryId } })}
          >
            {t('order-pay')}
          </button>
        )}
        {(o.status === 'pending_payment' || o.status === 'paid') && (
          <button
            className="w-6 h-6 rounded-full bg-slate-700 hover:bg-rose-500/20 flex items-center justify-center transition"
            onClick={() => handleCancel(o)}
          >
            <X className="w-3 h-3 text-slate-400 hover:text-rose-400" />
          </button>
        )}
      </div>
    </div>
  )

  const unlinkedOrders = activeOrders.filter((o) => !o.itineraryId)

  if (itineraries.length === 0) {
    return (
      <div className="space-y-4">
        {unlinkedOrders.length > 0 && (
          <div className="glass-panel rounded-2xl border border-fuchsia-500/30 overflow-hidden fade-in">
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <CalendarCheck className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm font-bold text-white">{t('route-bookings-title')}</span>
            </div>
            <div className="px-4 pb-4 space-y-2">
              {unlinkedOrders.map(renderOrderCard)}
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-12 space-y-4 fade-in">
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
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {itineraries.map((itn, idx) => {
        const itnOrders = activeOrders.filter((o) => o.itineraryId === itn.id)
        return (
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

            {/* 该行程关联的预约 */}
            {itnOrders.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700/60 relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider">{t('route-bookings-title')}</span>
                  </div>
                  <button
                    className="text-[10px] font-bold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/30 px-2 py-0.5 rounded-lg hover:bg-fuchsia-500/20 transition"
                    onClick={() => openModule('booking-service', { ctx: { itineraryId: itn.id } })}
                  >
                    + {t('route-booking-new')}
                  </button>
                </div>
                {itnOrders.map(renderOrderCard)}
              </div>
            )}

            {itnOrders.length === 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700/60 relative z-10 flex items-center justify-between">
                <p className="text-[10px] text-slate-600">{t('route-bookings-empty')}</p>
                <button
                  className="text-[10px] font-bold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/30 px-2 py-0.5 rounded-lg hover:bg-fuchsia-500/20 transition"
                  onClick={() => openModule('booking-service', { ctx: { itineraryId: itn.id } })}
                >
                  + {t('route-booking-new')}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* 未关联行程的订单 */}
      {unlinkedOrders.length > 0 && (
        <div className="glass-panel rounded-2xl border border-fuchsia-500/30 overflow-hidden fade-in">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3">
            <CalendarCheck className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-bold text-white">{t('route-bookings-title')}</span>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {unlinkedOrders.map(renderOrderCard)}
          </div>
        </div>
      )}

      <div className="text-center pt-2 fade-in" style={{ animationDelay: '0.1s' }}>
        <p className="text-[10px] text-slate-600">{t('tab-route-desc')}</p>
      </div>
    </div>
  )
}
