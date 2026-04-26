import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js'
import { useUIStore } from '../stores/useUIStore'
import { useAppStore } from '../stores/useAppStore'
import { apiGet, apiPost } from '../services/api'
import { getLocaleText } from '../utils/locale'
import type { Order } from '../data/types'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim()
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

interface PaymentElementFormProps {
  confirmLabel: string
  disabled: boolean
  onSubmit: (stripe: Stripe, elements: StripeElements) => Promise<void>
}

function PaymentElementForm({ confirmLabel, disabled, onSubmit }: PaymentElementFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements || disabled) return
    await onSubmit(stripe, elements)
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
        <PaymentElement />
      </div>
      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        disabled={!stripe || !elements || disabled}
      >
        {confirmLabel}
      </button>
    </form>
  )
}

export function BookingService() {
  const { t } = useTranslation()
  const modulePayload = useUIStore((s) => s.modulePayload)
  const showToast = useUIStore((s) => s.showToast)
  const openModule = useUIStore((s) => s.openModule)
  const { orders, itineraries, createOrder, updateOrderStatus } = useAppStore()

  const ctx = (modulePayload?.ctx as any) || {}

  const linkedItinerary = ctx.itineraryId
    ? itineraries.find((itn) => itn.id === ctx.itineraryId) ?? null
    : null

  const [serviceType, setServiceType] = useState('concierge')
  const [timeSlot, setTimeSlot] = useState('18:00')
  const [partySize, setPartySize] = useState(2)
  const [langPref, setLangPref] = useState('en')
  const [creating, setCreating] = useState(false)
  const [initializingPayment, setInitializingPayment] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [paymentOrderId, setPaymentOrderId] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const pollTimeoutRef = useRef<number | null>(null)

  const contextOrders = orders.filter((o) => o.spotId === ctx.spotId)
  const latestOrder = contextOrders[contextOrders.length - 1] || null

  const clearPaymentState = useCallback(() => {
    setClientSecret('')
    setPaymentIntentId('')
    setPaymentOrderId('')
    setShowPaymentForm(false)
    setInitializingPayment(false)
    setIsConfirming(false)
  }, [])

  const clearPolling = useCallback(() => {
    if (pollTimeoutRef.current) {
      window.clearTimeout(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
  }, [])

  const markPaymentHandled = useCallback((intentId: string) => {
    if (!intentId) return
    const state = useAppStore.getState()
    if (!state.paymentCallbackLedger.includes(intentId)) {
      state.addPaymentCallback(intentId)
    }
  }, [])

  const pollOrderStatus = useCallback(
    (orderId: string, intentId?: string) => {
      clearPolling()
      let attempts = 0

      const checkStatus = async () => {
        attempts += 1
        try {
          const order = await apiGet<{ status: string }>(`/orders/${orderId}`)

          if (order.status === 'paid' || order.status === 'failed') {
            updateOrderStatus(orderId, order.status)
            if (intentId) markPaymentHandled(intentId)
            clearPaymentState()
            openModule('payment-result', {
              status: order.status,
              orderId,
              ctx,
            })
            return
          }

          if (attempts >= 30) {
            showToast(t('order-pay-timeout'))
            setInitializingPayment(false)
            setIsConfirming(false)
            openModule('payment-result', {
              status: 'timeout',
              orderId,
              ctx,
            })
            return
          }

          pollTimeoutRef.current = window.setTimeout(() => {
            void checkStatus()
          }, 2000)
        } catch (error) {
          showToast(error instanceof Error ? error.message : t('order-pay-generic-error'))
          setInitializingPayment(false)
          setIsConfirming(false)
        }
      }

      pollTimeoutRef.current = window.setTimeout(() => {
        void checkStatus()
      }, 1500)
    },
    [clearPaymentState, clearPolling, markPaymentHandled, openModule, showToast, t, updateOrderStatus],
  )

  useEffect(() => clearPolling, [clearPolling])

  useEffect(() => {
    if (!latestOrder || latestOrder.orderId !== paymentOrderId) return
    if (latestOrder.status === 'paid' || latestOrder.status === 'failed' || latestOrder.status === 'cancelled') {
      clearPolling()
      clearPaymentState()
    }
  }, [clearPaymentState, clearPolling, latestOrder, paymentOrderId])

  const handleCreateOrder = async () => {
    setCreating(true)
    try {
      const result = await apiPost<{ orderId: string; status: string; amount: number; createdAt: string }>('/orders', {
        spotId: ctx.spotId || '',
        merchantId: ctx.merchantId || '',
        merchantName: ctx.merchantName || '',
        serviceType,
        language: langPref,
        guests: partySize,
        date: new Date().toISOString().split('T')[0],
        time: timeSlot,
        amount: partySize * 299,
      })

      const order: Order = {
        orderId: result.orderId,
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
        createdAt: result.createdAt,
        ...(ctx.itineraryId ? { itineraryId: ctx.itineraryId } : {}),
      }

      clearPolling()
      clearPaymentState()
      createOrder(order)
      showToast(t('order-create'))
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('order-create-failed'))
    } finally {
      setCreating(false)
    }
  }

  const handlePay = async (orderId: string) => {
    if (!stripePromise) {
      showToast(t('order-pay-unavailable'))
      return
    }

    setInitializingPayment(true)
    setIsConfirming(false)
    try {
      const result = await apiPost<{ clientSecret: string; paymentIntentId: string }>('/payments/create-intent', { orderId })
      setClientSecret(result.clientSecret)
      setPaymentIntentId(result.paymentIntentId)
      setPaymentOrderId(orderId)
      setShowPaymentForm(true)
      showToast(t('order-pay-processing'))
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('order-pay-init-failed'))
      setShowPaymentForm(false)
      setClientSecret('')
      setPaymentIntentId('')
      setPaymentOrderId('')
    } finally {
      setInitializingPayment(false)
    }
  }

  const handleConfirmPayment = async (stripe: Stripe, elements: StripeElements) => {
    if (!paymentOrderId) return

    setIsConfirming(true)
    try {
      const result = await stripe.confirmPayment({ elements, redirect: 'if_required' })

      if (result.error) {
        showToast(result.error.message || t('order-pay-generic-error'))
        setIsConfirming(false)
        return
      }

      const confirmedIntentId = result.paymentIntent?.id || paymentIntentId
      showToast(t('order-pay-processing'))
      pollOrderStatus(paymentOrderId, confirmedIntentId)
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('order-pay-generic-error'))
      setIsConfirming(false)
    }
  }

  const handleCancel = (orderId: string) => {
    clearPolling()
    clearPaymentState()
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
        <p className="text-[10px] uppercase tracking-[0.18em] text-fuchsia-300 font-bold">
          {linkedItinerary ? t('booking-context-itinerary') : t('pass-context')}
        </p>
        <h3 className="text-white font-bold mt-2 text-base">
          {linkedItinerary ? getLocaleText(linkedItinerary.title) : (ctx.spotTitle || t('pass-spot-empty'))}
        </h3>
        {!linkedItinerary && (
          <p className="text-xs text-slate-400 mt-1">{ctx.merchantName || t('pass-merchant-empty')}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-slate-400">
          {t('order-field-service')}
          <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            <option value="concierge">{t('order-service-concierge')}</option>
            <option value="guide">{t('order-service-guide')}</option>
            <option value="business-dining">{t('order-service-dining')}</option>
            <option value="photo">{t('order-service-photo')}</option>
          </select>
        </label>
        <label className="text-xs text-slate-400">
          {t('order-field-timeslot')}
          <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
            <option value="18:00">18:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
          </select>
        </label>
        <label className="text-xs text-slate-400">
          {t('order-field-partysize')}
          <input type="number" min={1} max={12} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
        </label>
        <label className="text-xs text-slate-400">
          {t('order-field-language')}
          <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white" value={langPref} onChange={(e) => setLangPref(e.target.value)}>
            <option value="en">English</option>
            <option value="zh">简体中文</option>
            <option value="ja">日本語</option>
          </select>
        </label>
      </div>

      <button
        className="w-full bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        onClick={handleCreateOrder}
        disabled={creating}
      >
        {creating ? '...' : t('order-create')}
      </button>

      {latestOrder && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white font-semibold">{t('order-snapshot')}</p>
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
            <div className="space-y-3">
              {!showPaymentForm && (
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded-xl transition text-sm disabled:opacity-50"
                    onClick={() => handlePay(latestOrder.orderId)}
                    disabled={initializingPayment || !stripePromise}
                  >
                    {initializingPayment ? '...' : t('order-pay')}
                  </button>
                  <button
                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2 rounded-xl transition text-sm"
                    onClick={() => handleCancel(latestOrder.orderId)}
                  >
                    {t('order-cancel')}
                  </button>
                </div>
              )}

              {!stripePromise && (
                <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
                  {t('order-pay-unavailable')}
                </p>
              )}

              {showPaymentForm && clientSecret && stripePromise && paymentOrderId === latestOrder.orderId && (
                <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-xs font-semibold text-emerald-300">{t('order-pay-form-title')}</p>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: {
                          colorPrimary: '#38bdf8',
                          colorBackground: '#020617',
                          colorText: '#f8fafc',
                          colorDanger: '#fb7185',
                        },
                      },
                    }}
                  >
                    <PaymentElementForm
                      confirmLabel={isConfirming ? t('order-pay-confirming') : t('order-pay-confirm')}
                      disabled={isConfirming}
                      onSubmit={handleConfirmPayment}
                    />
                  </Elements>
                  <button
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2 rounded-xl transition text-sm disabled:opacity-50"
                    onClick={() => handleCancel(latestOrder.orderId)}
                    disabled={isConfirming}
                  >
                    {t('order-cancel')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {contextOrders.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('order-history')}</p>
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
