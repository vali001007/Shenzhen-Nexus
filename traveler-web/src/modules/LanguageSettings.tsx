import { useTranslation } from 'react-i18next'
import { useLangStore } from '../stores/useLangStore'
import { useUIStore } from '../stores/useUIStore'

const languages = [
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
  { code: 'zh' as const, label: '简体中文', flag: '🇨🇳' },
]

export function LanguageSettings() {
  const { t } = useTranslation()
  const currentLang = useLangStore((s) => s.currentLang)
  const changeLang = useLangStore((s) => s.changeLang)
  const closeModule = useUIStore((s) => s.closeModule)

  const handleSelect = (code: 'en' | 'zh') => {
    changeLang(code)
    closeModule()
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-400 leading-relaxed">{t('lang-prompt')}</p>
      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition ${
              currentLang === lang.code
                ? 'glass-panel border border-sky-500/50 bg-sky-500/10'
                : 'glass-panel border border-slate-700 hover:bg-slate-800'
            }`}
            onClick={() => handleSelect(lang.code)}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="text-sm font-semibold text-white">{lang.label}</span>
            {currentLang === lang.code && (
              <span className="ml-auto text-sky-400 text-sm">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
