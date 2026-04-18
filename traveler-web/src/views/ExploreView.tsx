import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/useUIStore'

export function ExploreView() {
  const { t } = useTranslation()
  const openModule = useUIStore((s) => s.openModule)

  return (
    <div className="space-y-6">
      <section className="fade-in" style={{ animationDelay: '0s' }}>
        <div
          className="glass-panel p-5 rounded-3xl bg-gradient-to-br from-sky-900/80 to-indigo-900/80 border border-sky-500/50 cursor-pointer hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition relative overflow-hidden group"
          onClick={() => openModule('ai-planner')}
        >
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-sky-500/30 blur-3xl rounded-full group-hover:bg-sky-400/40 transition" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <span className="text-sky-400">✦</span>
                {t('ai-planner-title')}
              </h3>
              <p className="text-xs text-sky-100/70 mt-1 max-w-[200px]">{t('ai-planner-desc')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)] group-hover:scale-110 transition-transform">
              <span className="text-white text-lg">→</span>
            </div>
          </div>
        </div>
      </section>

      <section className="fade-in" style={{ animationDelay: '0.05s' }}>
        <div
          className="glass-panel p-4 rounded-2xl cursor-pointer hover:bg-slate-800 transition group neon-border flex items-center justify-between"
          onClick={() => openModule('ai-concierge')}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center group-hover:bg-fuchsia-500/30 transition">
              <span className="text-fuchsia-400 text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-0.5 text-white">{t('ai-concierge')}</h3>
              <p className="text-xs text-slate-400">{t('ai-concierge-desc')}</p>
            </div>
          </div>
          <span className="text-slate-500">›</span>
        </div>
      </section>

      <section className="fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">{t('essential-toolkit')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'ar-decoder', icon: '📷', colorClass: 'bg-sky-500/20 group-hover:bg-sky-500/30', titleKey: 'ar-decoder', descKey: 'ar-decoder-desc', neon: true },
            { id: 'payment-setup', icon: '💳', colorClass: 'bg-emerald-500/20 group-hover:bg-emerald-500/30', titleKey: 'pay-local', descKey: 'pay-local-desc', neon: false },
            { id: 'mobility', icon: '🚕', colorClass: 'bg-amber-500/20 group-hover:bg-amber-500/30', titleKey: 'mobility', descKey: 'mobility-desc', neon: false },
            { id: 'connectivity', icon: '📶', colorClass: 'bg-purple-500/20 group-hover:bg-purple-500/30', titleKey: 'connected', descKey: 'connected-desc', neon: false },
          ].map((item) => (
            <div
              key={item.id}
              className={`glass-panel p-4 rounded-2xl cursor-pointer hover:bg-slate-800 transition group ${item.neon ? 'neon-border' : ''}`}
              onClick={() => openModule(item.id)}
            >
              <div className={`w-10 h-10 rounded-xl ${item.colorClass} flex items-center justify-center mb-3 transition`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{t(item.titleKey)}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">{t('tech-safari')}</h2>
        <div className="space-y-3">
          {[
            { id: 'drone-delivery', icon: '🚁', titleKey: 'drone', descKey: 'drone-desc', colorClass: 'bg-sky-500/20' },
            { id: 'robotaxi', icon: '🚗', titleKey: 'robotaxi', descKey: 'robotaxi-desc', colorClass: 'bg-fuchsia-500/20' },
          ].map((item) => (
            <div
              key={item.id}
              className="glass-panel p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition"
              onClick={() => openModule(item.id)}
            >
              <div className={`w-12 h-12 rounded-xl ${item.colorClass} flex items-center justify-center shrink-0`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">{t(item.titleKey)}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
