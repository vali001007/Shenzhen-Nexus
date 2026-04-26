import { useTranslation } from 'react-i18next'
import { MapPin, Zap, DollarSign, Map, Moon, Lightbulb, HelpCircle } from 'lucide-react'

const PARK_STATIONS = [
  { nameKey: 'drone-park-sz-bay', subKey: 'drone-park-sz-bay-sub', addr: '深圳市南山区深圳湾公园' },
  { nameKey: 'drone-park-talent', subKey: 'drone-park-talent-sub', addr: '深圳市南山区人才公园' },
  { nameKey: 'drone-park-central', subKey: 'drone-park-central-sub', addr: '深圳市福田区中心公园C2区' },
  { nameKey: 'drone-park-bjshan', subKey: 'drone-park-bjshan-sub', addr: '深圳市福田区笔架山体育公园' },
  { nameKey: 'drone-park-bsl', subKey: 'drone-park-bsl-sub', addr: '深圳市龙华区白石龙音乐公园' },
  { nameKey: 'drone-park-lhs', subKey: 'drone-park-lhs-sub', addr: '深圳市福田区莲花山公园' },
  { nameKey: 'drone-park-north', subKey: 'drone-park-north-sub', addr: '深圳市龙华区北站中心公园' },
  { nameKey: 'drone-park-lc', subKey: 'drone-park-lc-sub', addr: '深圳市龙岗区龙城公园' },
]

const MALL_STATIONS = [
  { nameKey: 'drone-mall-xinghe', addr: '深圳市龙岗区星河WORLD' },
  { nameKey: 'drone-mall-tianhong', addr: '深圳市龙华区民治天虹商场' },
  { nameKey: 'drone-mall-wow', addr: '深圳市南山区世界之窗' },
  { nameKey: 'drone-mall-lib', addr: '深圳市龙岗区深圳图书馆北馆' },
]

function openMaps(addr: string) {
  window.open(`https://maps.apple.com/?q=${encodeURIComponent(addr)}`, '_blank', 'noopener,noreferrer')
}

export function DroneDelivery() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img
          src="https://aka.doubaocdn.com/s/iyJ81wGtEd"
          alt="Shenzhen Drone Delivery"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-lg font-bold text-white">{t('drone-title')}</h3>
          <p className="text-xs text-slate-300">{t('drone-hero-sub')}</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Zap className="w-4 h-4 text-sky-400" />, label: 'drone-hl-speed', sub: 'drone-hl-speed-sub', bg: 'bg-sky-500/10' },
          { icon: <DollarSign className="w-4 h-4 text-orange-400" />, label: 'drone-hl-price', sub: 'drone-hl-price-sub', bg: 'bg-orange-500/10' },
          { icon: <Map className="w-4 h-4 text-emerald-400" />, label: 'drone-hl-coverage', sub: 'drone-hl-coverage-sub', bg: 'bg-emerald-500/10' },
        ].map((h) => (
          <div key={h.label} className="glass-panel rounded-xl p-3 text-center border border-slate-700">
            <div className={`w-8 h-8 ${h.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>{h.icon}</div>
            <p className="text-xs font-semibold text-white">{t(h.label)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{t(h.sub)}</p>
          </div>
        ))}
      </div>

      {/* Stations */}
      <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-4">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />{t('drone-stations-title')}
        </h3>

        {/* Park stations */}
        <div>
          <p className="text-[10px] text-emerald-400 font-semibold mb-2">{t('drone-park-stations')}</p>
          <div className="grid grid-cols-2 gap-2">
            {PARK_STATIONS.map((s) => (
              <div key={s.nameKey} className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white">{t(s.nameKey)}</p>
                  <button
                    onClick={() => openMaps(s.addr)}
                    className="text-sky-400 text-[10px] flex items-center gap-0.5 shrink-0"
                  >
                    <MapPin className="w-3 h-3" />{t('drone-navi')}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{t(s.subKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mall stations */}
        <div>
          <p className="text-[10px] text-orange-400 font-semibold mb-2">{t('drone-mall-stations')}</p>
          <div className="space-y-2">
            {MALL_STATIONS.map((s) => (
              <div key={s.nameKey} className="flex items-center justify-between bg-slate-800/50 rounded-xl px-3 py-2">
                <p className="text-xs text-slate-300">{t(s.nameKey)}</p>
                <button
                  onClick={() => openMaps(s.addr)}
                  className="text-sky-400 text-[10px] flex items-center gap-0.5 shrink-0 ml-2"
                >
                  <MapPin className="w-3 h-3" />{t('drone-navi')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order guide */}
      <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-3">
        <h3 className="font-bold text-sky-400 text-sm">{t('drone-guide-title')}</h3>
        <p className="text-[10px] text-slate-400">{t('drone-guide-sub')}</p>
        {[
          { n: '1', q: 'drone-guide-s1', a: 'drone-guide-s1-sub' },
          { n: '2', q: 'drone-guide-s2', a: 'drone-guide-s2-sub' },
          { n: '3', q: 'drone-guide-s3', a: 'drone-guide-s3-sub' },
          { n: '4', q: 'drone-guide-s4', a: 'drone-guide-s4-sub' },
        ].map((s) => (
          <div key={s.n} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {s.n}
            </div>
            <div>
              <p className="text-xs font-medium text-white">{t(s.q)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{t(s.a)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Night delivery */}
      <div className="glass-panel rounded-2xl border border-sky-500/30 p-4 space-y-2">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <Moon className="w-4 h-4" />{t('drone-night-title')}
        </h3>
        <p className="text-xs text-slate-300">{t('drone-night-desc')}</p>
        <div className="flex flex-wrap gap-2">
          {['Talent Park', 'Haifeng Park', 'Bijiaoshan Park', 'Baishilong Park'].map((p) => (
            <span key={p} className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full text-[10px]">{p}</span>
          ))}
        </div>
        <p className="text-[10px] text-slate-400">{t('drone-night-hours')}</p>
      </div>

      {/* Tips */}
      <div className="glass-panel rounded-2xl border border-yellow-500/20 p-4 space-y-2">
        <h3 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />{t('drone-tips-title')}
        </h3>
        {(['drone-tip-1', 'drone-tip-2', 'drone-tip-3'] as const).map((k) => (
          <div key={k} className="flex items-start gap-2">
            <span className="text-yellow-400 text-xs mt-0.5">✓</span>
            <p className="text-xs text-slate-300">{t(k)}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-4">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />{t('drone-faq-title')}
        </h3>
        {[
          { q: 'drone-faq-q1', a: 'drone-faq-a1' },
          { q: 'drone-faq-q2', a: 'drone-faq-a2' },
          { q: 'drone-faq-q3', a: 'drone-faq-a3' },
        ].map((f) => (
          <div key={f.q}>
            <p className="text-xs font-medium text-white flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />{t(f.q)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 pl-5">{t(f.a)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
