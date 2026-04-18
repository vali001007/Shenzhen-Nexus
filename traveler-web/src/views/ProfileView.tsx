import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'
import { useLangStore } from '../stores/useLangStore'

export function ProfileView() {
  const { t } = useTranslation()
  const openModule = useUIStore((s) => s.openModule)
  const showToast = useUIStore((s) => s.showToast)
  const currentLang = useLangStore((s) => s.currentLang)

  return (
    <div className="space-y-6">
      <section className="fade-in">
        <div className="flex items-center gap-5 glass-panel p-5 rounded-3xl border border-slate-700">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 p-0.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-900">
                <span className="text-xl font-bold text-white tracking-widest">AG</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Alex Global</h2>
            <p className="text-sm text-sky-400 flex items-center gap-1 mt-1">
              ✓ {t('delegate')}
            </p>
          </div>
        </div>
      </section>

      <section className="fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3">{t('pref')}</h3>
        <div className="glass-panel rounded-2xl border border-slate-700 overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-800 transition border-b border-slate-700/50" onClick={() => openModule('language-settings')}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">🌐</div>
              <span className="text-sm font-semibold text-slate-200">{t('lang-setting')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-xs">{currentLang === 'en' ? 'English' : '中文'}</span>
              <span>›</span>
            </div>
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-800 transition border-b border-slate-700/50" onClick={() => openModule('payment-setup')}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">💳</div>
              <span className="text-sm font-semibold text-slate-200">{t('pay-local')}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded">Linked</span>
              <span className="text-slate-500">›</span>
            </div>
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-800 transition" onClick={() => showToast(currentLang === 'zh' ? '正在下载离线地图 (450MB)' : 'Offline maps downloaded (450MB)')}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">🗺️</div>
              <span className="text-sm font-semibold text-slate-200">{t('offline-maps')}</span>
            </div>
            <span className="text-slate-500">›</span>
          </button>
        </div>
      </section>

      <section className="fade-in" style={{ animationDelay: '0.15s' }}>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3">{t('support-safety')}</h3>
        <div className="glass-panel rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">🚨</div>
              <span className="text-sm font-semibold text-slate-200">{t('emergency')}</span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">🏛️</div>
              <span className="text-sm font-semibold text-slate-200">{t('embassy')}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pt-6 pb-2 fade-in" style={{ animationDelay: '0.25s' }}>
        <p className="text-[10px] text-slate-600 font-semibold tracking-widest uppercase">Shenzhen Nexus v1.0.0</p>
      </div>
    </div>
  )
}
