import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'
import { useAppStore } from '../stores/useAppStore'
import { generateId } from '../utils/id'
import { computeSignature } from '../utils/signature'
import type { Order } from '../data/types'

export function BookingService() {
  const { t } = useTranslation()
  const modulePayload = useUIStore((s) => s.modulePayload)
  const showToast = useUIStore((s) => s.showToast)
  const { orders, createOrder, updateOrderStatus, addPaymentCallback } = useAppStore()

  const ctx = (modulePayload?.ctx as any) || {}

  const [serviceType, setServiceType] = useState('concierge')
  const [timeSlot, setTimeSlot] = useState('18:00')
  const [partySize, setPartySize] = useState(2)
  const [langPref, setLangPref] = useState('en')
  const [paying, setPaying] = useState(false)

  const contextOrders = orders.filter((o) => o.spotId === ctx.spotId)
  const latestOrder = contextOrders[contextOrders.length - 1] || null

  const handleCreateOrder = () => {
    const order: Order = {
      orderId: generateId('ORD'),
      spotId: ctx.spotId || '',
      merchantId: ctx.merchantId || '',
      merchantName: ctx.merchantName || '',
      serviceType,
      language: langPref,
      guests: partySize,
      date: new Date().toISOString().split('T')[0],
      time: timeSlot,
      amount: partySize * 299,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
    }
    createOrder(order)
    showToast(t('order-create'))
  }

  const handlePay = async (orderId: string) => {
    setPaying(true)
    const paymentIntentId = generateId('PAY')

    await new Promise((r) => setTimeout(r, 900))

    const signature = computeSignature({ orderId, paymentIntentId, status: 'paid' })
    const ledger = useAppStore.getState().paymentCallbackLedger
    if (ledger.includes(paymentIntentId)) {
      setPaying(false)
      return
    }

    const expectedSig = computeSignature({ orderId, paymentIntentId, status: 'paid' })
    if (signature === expectedSig) {
      updateOrderStatus(orderId, 'paid')
      addPaymentCallback(paymentIntentId)
      showToast(t('order-status-paid'))
    } else {
      updateOrderStatus(orderId, 'failed')
      showToast(t('order-status-failed'))
    }
    setPaying(false)
  }

  const handleCancel = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled')
    showToast(t('order-status-cancelled'))
  }

  const statusClass = (status: string) => {
    if (status === 'paid') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    if (status === 'failed') return 'bg-rose-500/20 text-rose-200 border-rose-500/40'
    if (status === 'cancelled') return 'bg-amber-500/20 text-amber-200 border-amber-500/40'
    return 'bg-sky-500/20 text-sky-200 border-sky-500/40'
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="glass-panel p-4 rounded-2xl border border-fuchsia-500/30">
        <p className="text-[10px] uppercase tracking-[0.18em] text-fuchsia-300 font-bold">Context</p>
        <h3 className="text-white font-bold mt-2 text-base">{ctx.spotTitle || 'Spot not selected'}</h3>
        <p className="text-xs text-slate-400 mt-1">{ctx.merchantName || 'No merchant selected'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-slate-400">
          Service
          <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            <option value="concierge">Concierge</option>
            <option value="guide">Bilingual Guide</option>
            <option value="business-dining">Business Dining</option>
          </select>
        </label>
        <label className="text-xs text-slate-400">
          Time Slot
          <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
            <option value="18:00">18:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
          </select>
        </label>
        <label className="text-xs text-slate-400">
          Party Size
          <input type="number" min={1} max={12} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
        </label>
        <label className="text-xs text-slate-400">
          Language
          <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white" value={langPref} onChange={(e) => setLangPref(e.target.value)}>
            <option value="en">English</option>
            <option value="zh">简体中文</option>
            <option value="ja">日本語</option>
          </select>
        </label>
      </div>

      <button className="w-full bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold py-3 rounded-xl transition" onClick={handleCreateOrder}>
        {t('order-create')}
      </button>

      {latestOrder && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white font-semibold">Order Snapshot</p>
            <span className={`text-[10px] px-2 py-1 rounded-full border ${statusClass(latestOrder.status)}`}>
              {t(`order-status-${latestOrder.status === 'pending_payment' ? 'pending' : latestOrder.status}`)}
            </span>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <p>orderId: {latestOrder.orderId}</p>
            <p>amount: ¥{latestOrder.amount}</p>
            <p>service: {latestOrder.serviceType}</p>
          </div>
          {latestOrder.status === 'pending_payment' && (
            <div className="flex gap-2">
              <button
                className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded-xl transition text-sm"
                onClick={() => handlePay(latestOrder.orderId)}
                disabled={paying}
              >
                {paying ? '...' : t('order-pay')}
              </button>
              <button
                className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2 rounded-xl transition text-sm"
                onClick={() => handleCancel(latestOrder.orderId)}
              >
                {t('order-cancel')}
              </button>
            </div>
          )}
        </div>
      )}

      {contextOrders.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Order History</p>
          {contextOrders.slice(0, -1).reverse().map((o) => (
            <div key={o.orderId} className="glass-panel p-3 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">{o.orderId}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusClass(o.status)}`}>
                {t(`order-status-${o.status === 'pending_payment' ? 'pending' : o.status}`)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
