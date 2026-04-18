import { create } from 'zustand'
import i18n from '../i18n'

interface LangState {
  currentLang: 'en' | 'zh'
  changeLang: (lang: 'en' | 'zh') => void
}

export const useLangStore = create<LangState>((set) => ({
  currentLang: 'en',
  changeLang: (lang) => {
    i18n.changeLanguage(lang)
    set({ currentLang: lang })
  },
}))
