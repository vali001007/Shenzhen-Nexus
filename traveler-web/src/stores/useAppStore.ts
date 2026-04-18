import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, Pass, Redemption, EventPayload, Itinerary } from '../data/types'
import { generateId } from '../utils/id'

interface AppState {
  sessionId: string
  selectedMerchantBySpot: Record<string, string>
  leaderboardPageByCategory: Record<string, number>
  orders: Order[]
  passes: Pass[]
  redemptions: Redemption[]
  paymentCallbackLedger: string[]
  events: EventPayload[]
  itineraries: Itinerary[]

  chooseMerchant: (spotId: string, merchantId: string) => void
  setLeaderboardPage: (category: string, page: number) => void
  createOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  claimPass: (pass: Pass) => void
  redeemPass: (passId: string, merchantId: string) => Redemption | null
  addEvent: (event: EventPayload) => void
  addPaymentCallback: (paymentIntentId: string) => void
  saveItinerary: (data: Omit<Itinerary, 'id' | 'savedAt'>) => string
  deleteItinerary: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sessionId: generateId('SNX'),
      selectedMerchantBySpot: {},
      leaderboardPageByCategory: { all: 1, landmark: 1, tech: 1, culture: 1, food: 1 },
      orders: [],
      passes: [],
      redemptions: [],
      paymentCallbackLedger: [],
      events: [],
      itineraries: [],

      chooseMerchant: (spotId, merchantId) =>
        set((s) => ({
          selectedMerchantBySpot: { ...s.selectedMerchantBySpot, [spotId]: merchantId },
        })),

      setLeaderboardPage: (category, page) =>
        set((s) => ({
          leaderboardPageByCategory: { ...s.leaderboardPageByCategory, [category]: page },
        })),

      createOrder: (order) =>
        set((s) => ({ orders: [...s.orders, order] })),

      updateOrderStatus: (orderId, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.orderId === orderId ? { ...o, status } : o)),
        })),

      claimPass: (pass) =>
        set((s) => ({ passes: [...s.passes, pass] })),

      redeemPass: (passId, merchantId) => {
        const state = get()
        const pass = state.passes.find((p) => p.passId === passId)
        if (!pass) return null
        if (new Date(pass.expiresAt) < new Date()) return null
        if (state.redemptions.some((r) => r.passId === passId)) return null

        const redemption: Redemption = {
          redemptionId: generateId('RDM'),
          passId,
          merchantId,
          redeemedAt: new Date().toISOString(),
        }
        set((s) => ({ redemptions: [...s.redemptions, redemption] }))
        return redemption
      },

      addEvent: (event) =>
        set((s) => ({ events: [...s.events, event] })),

      addPaymentCallback: (paymentIntentId) =>
        set((s) => ({ paymentCallbackLedger: [...s.paymentCallbackLedger, paymentIntentId] })),

      saveItinerary: (data) => {
        const id = generateId('ITN')
        const itinerary: Itinerary = { ...data, id, savedAt: new Date().toISOString() }
        set((s) => ({ itineraries: [itinerary, ...s.itineraries] }))
        return id
      },

      deleteItinerary: (id) =>
        set((s) => ({ itineraries: s.itineraries.filter((it) => it.id !== id) })),
    }),
    { name: 'snx-app-state' },
  ),
)
