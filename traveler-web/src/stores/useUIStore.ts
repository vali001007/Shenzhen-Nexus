import { create } from 'zustand'

export type TabId = 'explore' | 'leaderboard' | 'route' | 'profile'

interface UIState {
  currentTab: TabId
  currentModule: string | null
  modulePayload: Record<string, unknown>
  moduleOriginSpotId: string | null
  currentSpotId: string | null
  toast: { message: string; visible: boolean }

  switchTab: (tab: TabId) => void
  openModule: (moduleId: string, payload?: Record<string, unknown>) => void
  closeModule: () => void
  goBackToSpot: () => void
  openSpotDetail: (spotId: string) => void
  showToast: (message: string) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  currentTab: 'explore',
  currentModule: null,
  modulePayload: {},
  moduleOriginSpotId: null,
  currentSpotId: null,
  toast: { message: '', visible: false },

  switchTab: (tab) => set({ currentTab: tab }),

  openModule: (moduleId, payload = {}) => {
    const { currentSpotId, moduleOriginSpotId } = get()
    set({
      currentModule: moduleId,
      modulePayload: payload,
      moduleOriginSpotId: currentSpotId && !moduleOriginSpotId ? currentSpotId : moduleOriginSpotId,
    })
  },

  closeModule: () => set({
    currentModule: null,
    modulePayload: {},
    moduleOriginSpotId: null,
    currentSpotId: null,
  }),

  goBackToSpot: () => {
    const { moduleOriginSpotId } = get()
    if (moduleOriginSpotId) {
      set({
        currentModule: null,
        modulePayload: {},
        moduleOriginSpotId: null,
        currentSpotId: moduleOriginSpotId,
      })
    } else {
      get().closeModule()
    }
  },

  openSpotDetail: (spotId) => set({
    currentSpotId: spotId,
    currentModule: null,
    modulePayload: {},
    moduleOriginSpotId: null,
  }),

  showToast: (message) => {
    set({ toast: { message, visible: true } })
    setTimeout(() => set({ toast: { message: '', visible: false } }), 2500)
  },
}))
