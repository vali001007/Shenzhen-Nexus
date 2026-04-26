import { useTranslation } from 'react-i18next'
import { MapPin, Lightbulb, HelpCircle } from 'lucide-react'

const MUSEUM_STATIONS = [
  { nameKey: 'robot-mu-sz', subKey: 'robot-mu-sz-sub', addr: '深圳市光明区深圳科技馆新馆' },
  { nameKey: 'robot-mu-lg', subKey: 'robot-mu-lg-sub', addr: '深圳市龙岗区红立方科技馆' },
  { nameKey: 'robot-mu-ba', subKey: 'robot-mu-ba-sub', addr: '深圳市宝安区宝安青少年宫' },
  { nameKey: 'robot-mu-ft', subKey: 'robot-mu-ft-sub', addr: '深圳市福田区上步中路1003号' },
]

const STORE_STATIONS = [
  { nameKey: 'robot-st-sc', subKey: 'robot-st-sc-sub', addr: '深圳市福田区深业上城' },
  { nameKey: 'robot-st-ai6s', subKey: 'robot-st-ai6s-sub', addr: '深圳市南山区科技园' },
  { nameKey: 'robot-st-sj', subKey: 'robot-st-sj-sub', addr: '深圳市龙岗区尚景社区' },
]

function openMaps(addr: string) {
  window.open(`https://maps.apple.com/?q=${encodeURIComponent(addr)}`, '_blank', 'noopener,noreferrer')
}

export function RobotExperience() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img
          src="https://aka.doubaocdn.com/s/bDy41wGujv"
          alt="Shenzhen Robot Experience"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-lg font-bold text-white">{t('robot-mod-title')}</h3>
          <p className="text-xs text-slate-300">{t('robot-hero-sub')}</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '🤖', label: 'robot-hl-ai', sub: 'robot-hl-ai-sub', bg: 'bg-sky-500/10' },
          { emoji: '🐕', label: 'robot-hl-dog', sub: 'robot-hl-dog-sub', bg: 'bg-orange-500/10' },
          { emoji: '☕', label: 'robot-hl-svc', sub: 'robot-hl-svc-sub', bg: 'bg-emerald-500/10' },
        ].map((h) => (
          <div key={h.label} className="glass-panel rounded-xl p-3 text-center border border-slate-700">
            <div className={`w-8 h-8 ${h.bg} rounded-full flex items-center justify-center mx-auto mb-2 text-base`}>{h.emoji}</div>
            <p className="text-xs font-semibold text-white">{t(h.label)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{t(h.sub)}</p>
          </div>
        ))}
      </div>

      {/* Stations */}
      <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-4">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />{t('robot-stations-title')}
        </h3>
        <div>
          <p className="text-[10px] text-sky-400 font-semibold mb-2">{t('robot-museum-stations')}</p>
          <div className="grid grid-cols-2 gap-2">
            {MUSEUM_STATIONS.map((s) => (
              <div key={s.nameKey} className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white">{t(s.nameKey)}</p>
                  <button onClick={() => openMaps(s.addr)} className="text-sky-400 text-[10px] flex items-center gap-0.5 shrink-0">
                    <MapPin className="w-3 h-3" />{t('robot-navi')}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{t(s.subKey)}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-fuchsia-400 font-semibold mb-2">{t('robot-store-stations')}</p>
          <div className="grid grid-cols-2 gap-2">
            {STORE_STATIONS.map((s) => (
              <div key={s.nameKey} className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white">{t(s.nameKey)}</p>
                  <button onClick={() => openMaps(s.addr)} className="text-fuchsia-400 text-[10px] flex items-center gap-0.5 shrink-0">
                    <MapPin className="w-3 h-3" />{t('robot-navi')}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{t(s.subKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guide */}
      <div className="space-y-3">
        <h3 className="font-bold text-sky-400 text-sm">{t('robot-guide-title')}</h3>
        <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-3">
          <p className="text-[10px] text-sky-400 font-semibold">{t('robot-museum-guide')}</p>
          {[
            { q: 'robot-mu-s1', a: 'robot-mu-s1-sub' },
            { q: 'robot-mu-s2', a: 'robot-mu-s2-sub' },
            { q: 'robot-mu-s3', a: 'robot-mu-s3-sub' },
            { q: 'robot-mu-s4', a: 'robot-mu-s4-sub' },
          ].map((s, i) => (
            <div key={s.q} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{i + 1}</div>
              <div>
                <p className="text-xs font-medium text-white">{t(s.q)}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t(s.a)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-3">
          <p className="text-[10px] text-fuchsia-400 font-semibold">{t('robot-store-guide')}</p>
          {[
            { q: 'robot-st-s1', a: 'robot-st-s1-sub' },
            { q: 'robot-st-s2', a: 'robot-st-s2-sub' },
            { q: 'robot-st-s3', a: 'robot-st-s3-sub' },
          ].map((s, i) => (
            <div key={s.q} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-fuchsia-500 flex items-center justify-center text-white font-bold text-xs shrink-0">{i + 1}</div>
              <div>
                <p className="text-xs font-medium text-white">{t(s.q)}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t(s.a)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="glass-panel rounded-2xl border border-yellow-500/20 p-4 space-y-2">
        <h3 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />{t('robot-tips-title')}
        </h3>
        {['robot-tip-1', 'robot-tip-2', 'robot-tip-3', 'robot-tip-4'].map((k) => (
          <div key={k} className="flex items-start gap-2">
            <span className="text-yellow-400 mt-0.5 shrink-0">✓</span>
            <p className="text-xs text-slate-300">{t(k)}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-4">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />{t('robot-faq-title')}
        </h3>
        {[
          { q: 'robot-faq-q1', a: 'robot-faq-a1' },
          { q: 'robot-faq-q2', a: 'robot-faq-a2' },
          { q: 'robot-faq-q3', a: 'robot-faq-a3' },
          { q: 'robot-faq-q4', a: 'robot-faq-a4' },
        ].map((f) => (
          <div key={f.q}>
            <p className="text-xs font-semibold text-white flex items-center gap-1">
              <span className="text-sky-400">Q</span> {t(f.q)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 ml-4">{t(f.a)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
