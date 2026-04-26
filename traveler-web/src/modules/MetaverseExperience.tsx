import { useTranslation } from 'react-i18next'
import { MapPin, Clock, Lightbulb, HelpCircle } from 'lucide-react'

const PUBLIC_STATIONS = [
  { nameKey: 'meta-pu-sz', subKey: 'meta-pu-sz-sub', addr: '深圳市光明区深圳科技馆新馆' },
  { nameKey: 'meta-pu-lib', subKey: 'meta-pu-lib-sub', addr: '深圳市福田区深圳图书馆' },
  { nameKey: 'meta-pu-ns', subKey: 'meta-pu-ns-sub', addr: '深圳市南山区南山安全教育体验馆' },
  { nameKey: 'meta-pu-lg', subKey: 'meta-pu-lg-sub', addr: '深圳市龙岗区龙城广场地铁站' },
  { nameKey: 'meta-pu-gx', subKey: 'meta-pu-gx-sub', addr: '深圳市福田区岗厦北站' },
]

const STORE_STATIONS = [
  { nameKey: 'meta-st-yz', subKey: 'meta-st-yz-sub', addr: '深圳市南山区深圳湾睿印RAIL IN' },
  { nameKey: 'meta-st-sm', subKey: 'meta-st-sm-sub', addr: '深圳市龙华区红山6979商业中心' },
  { nameKey: 'meta-st-xm', subKey: 'meta-st-xm-sub', addr: '深圳市南山区欢乐海岸' },
]

function openMaps(addr: string) {
  window.open(`https://maps.apple.com/?q=${encodeURIComponent(addr)}`, '_blank', 'noopener,noreferrer')
}

export function MetaverseExperience() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img
          src="https://aka.doubaocdn.com/s/oVbt1wGv3b"
          alt="Shenzhen VR/AR Experience"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-lg font-bold text-white">{t('meta-mod-title')}</h3>
          <p className="text-xs text-slate-300">{t('meta-hero-sub')}</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '🥽', label: 'meta-hl-vr', sub: 'meta-hl-vr-sub', bg: 'bg-sky-500/10' },
          { emoji: '📷', label: 'meta-hl-ar', sub: 'meta-hl-ar-sub', bg: 'bg-orange-500/10' },
          { emoji: '🌐', label: 'meta-hl-xr', sub: 'meta-hl-xr-sub', bg: 'bg-fuchsia-500/10' },
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
          <MapPin className="w-4 h-4" />{t('meta-stations-title')}
        </h3>
        <div>
          <p className="text-[10px] text-sky-400 font-semibold mb-2">{t('meta-public-stations')}</p>
          <div className="grid grid-cols-2 gap-2">
            {PUBLIC_STATIONS.map((s) => (
              <div key={s.nameKey} className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white">{t(s.nameKey)}</p>
                  <button onClick={() => openMaps(s.addr)} className="text-sky-400 text-[10px] flex items-center gap-0.5 shrink-0">
                    <MapPin className="w-3 h-3" />{t('meta-navi')}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{t(s.subKey)}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-fuchsia-400 font-semibold mb-2">{t('meta-store-stations')}</p>
          <div className="grid grid-cols-2 gap-2">
            {STORE_STATIONS.map((s) => (
              <div key={s.nameKey} className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white">{t(s.nameKey)}</p>
                  <button onClick={() => openMaps(s.addr)} className="text-fuchsia-400 text-[10px] flex items-center gap-0.5 shrink-0">
                    <MapPin className="w-3 h-3" />{t('meta-navi')}
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
        <h3 className="font-bold text-sky-400 text-sm">{t('meta-guide-title')}</h3>
        <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-3">
          <p className="text-[10px] text-sky-400 font-semibold">{t('meta-public-guide')}</p>
          {[
            { q: 'meta-pu-s1', a: 'meta-pu-s1-sub' },
            { q: 'meta-pu-s2', a: 'meta-pu-s2-sub' },
            { q: 'meta-pu-s3', a: 'meta-pu-s3-sub' },
            { q: 'meta-pu-s4', a: 'meta-pu-s4-sub' },
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
          <p className="text-[10px] text-fuchsia-400 font-semibold">{t('meta-store-guide')}</p>
          {[
            { q: 'meta-st-s1', a: 'meta-st-s1-sub' },
            { q: 'meta-st-s2', a: 'meta-st-s2-sub' },
            { q: 'meta-st-s3', a: 'meta-st-s3-sub' },
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

      {/* Opening hours */}
      <div className="glass-panel rounded-2xl border border-sky-500/30 p-4 space-y-2">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />{t('meta-hours-title')}
        </h3>
        <p className="text-xs text-slate-300">{t('meta-hours-desc')}</p>
        <div className="flex flex-wrap gap-2">
          {['科技馆 10:00-18:00', '图书馆 09:00-17:00', '门店 10:00-22:00'].map((h) => (
            <span key={h} className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full text-[10px]">{h}</span>
          ))}
        </div>
        <p className="text-[10px] text-slate-400">{t('meta-hours-note')}</p>
      </div>

      {/* Tips */}
      <div className="glass-panel rounded-2xl border border-yellow-500/20 p-4 space-y-2">
        <h3 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />{t('meta-tips-title')}
        </h3>
        <ul className="space-y-2">
          {['meta-tip-1', 'meta-tip-2', 'meta-tip-3', 'meta-tip-4'].map((k) => (
            <li key={k} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="text-yellow-400 mt-0.5 shrink-0">✓</span>{t(k)}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-4">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />{t('meta-faq-title')}
        </h3>
        {[
          { q: 'meta-faq-q1', a: 'meta-faq-a1' },
          { q: 'meta-faq-q2', a: 'meta-faq-a2' },
          { q: 'meta-faq-q3', a: 'meta-faq-a3' },
          { q: 'meta-faq-q4', a: 'meta-faq-a4' },
        ].map((f) => (
          <div key={f.q}>
            <p className="text-xs font-semibold text-white">{t(f.q)}</p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{t(f.a)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
