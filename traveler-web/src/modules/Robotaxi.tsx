import { useTranslation } from 'react-i18next'
import { Car, Gift, MapPin, Moon, Lightbulb, HelpCircle } from 'lucide-react'

const APOLLO_STATIONS = [
  { nameKey: 'robo-ap-pingshan', subKey: 'robo-ap-pingshan-sub', addr: '深圳市坪山区坪山高铁站' },
  { nameKey: 'robo-ap-yanzi', subKey: 'robo-ap-yanzi-sub', addr: '深圳市坪山区燕子湖会展中心' },
  { nameKey: 'robo-ap-culture', subKey: 'robo-ap-culture-sub', addr: '深圳市坪山区坪山文化聚落' },
  { nameKey: 'robo-ap-airport', subKey: 'robo-ap-airport-sub', addr: '深圳市宝安区宝安国际机场' },
  { nameKey: 'robo-ap-universiade', subKey: 'robo-ap-universiade-sub', addr: '深圳市龙岗区大运中心' },
  { nameKey: 'robo-ap-admin', subKey: 'robo-ap-admin-sub', addr: '深圳市坪山区行政服务中心' },
]

const PONY_STATIONS = [
  { nameKey: 'robo-po-bay', subKey: 'robo-po-bay-sub', addr: '深圳市南山区深圳湾体育中心' },
  { nameKey: 'robo-po-houhai', subKey: 'robo-po-houhai-sub', addr: '深圳市南山区后海地铁站' },
  { nameKey: 'robo-po-coastal', subKey: 'robo-po-coastal-sub', addr: '深圳市南山区海岸城购物中心' },
  { nameKey: 'robo-po-techpark', subKey: 'robo-po-techpark-sub', addr: '深圳市南山区科技园南区' },
  { nameKey: 'robo-po-futian', subKey: 'robo-po-futian-sub', addr: '深圳市福田区福田高铁站' },
  { nameKey: 'robo-po-chegong', subKey: 'robo-po-chegong-sub', addr: '深圳市福田区车公庙地铁站' },
]

function openMaps(addr: string) {
  window.open(`https://maps.apple.com/?q=${encodeURIComponent(addr)}`, '_blank', 'noopener,noreferrer')
}

function StationGrid({ stations, color }: { stations: typeof APOLLO_STATIONS; color: string }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-2">
      {stations.map((s) => (
        <div key={s.nameKey} className="bg-slate-800/50 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-white">{t(s.nameKey)}</p>
            <button onClick={() => openMaps(s.addr)} className={`${color} text-[10px] flex items-center gap-0.5 shrink-0`}>
              <MapPin className="w-3 h-3" />{t('robo-navi')}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{t(s.subKey)}</p>
        </div>
      ))}
    </div>
  )
}

function GuideSteps({ steps, color }: { steps: { q: string; a: string }[]; color: string }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div key={s.q} className="flex gap-3">
          <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
            {i + 1}
          </div>
          <div>
            <p className="text-xs font-medium text-white">{t(s.q)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{t(s.a)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Robotaxi() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img src="/images/top-spots/robotaxi-hero.jpg" alt="Pony.ai Robotaxi Shenzhen" className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <h3 className="text-lg font-bold text-white">{t('robo-title')}</h3>
          <p className="text-xs text-slate-300">{t('robo-hero-sub')}</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Car className="w-4 h-4 text-sky-400" />, label: 'robo-hl-l4', sub: 'robo-hl-l4-sub', bg: 'bg-sky-500/10' },
          { icon: <Gift className="w-4 h-4 text-orange-400" />, label: 'robo-hl-free', sub: 'robo-hl-free-sub', bg: 'bg-orange-500/10' },
          { icon: <MapPin className="w-4 h-4 text-emerald-400" />, label: 'robo-hl-dual', sub: 'robo-hl-dual-sub', bg: 'bg-emerald-500/10' },
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
          <MapPin className="w-4 h-4" />{t('robo-stations-title')}
        </h3>
        <div>
          <p className="text-[10px] text-sky-400 font-semibold mb-2">{t('robo-apollo-stations')}</p>
          <StationGrid stations={APOLLO_STATIONS} color="text-sky-400" />
        </div>
        <div>
          <p className="text-[10px] text-fuchsia-400 font-semibold mb-2">{t('robo-pony-stations')}</p>
          <StationGrid stations={PONY_STATIONS} color="text-fuchsia-400" />
        </div>
      </div>

      {/* Guide */}
      <div className="space-y-3">
        <h3 className="font-bold text-sky-400 text-sm">{t('robo-guide-title')}</h3>
        <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-3">
          <p className="text-[10px] text-sky-400 font-semibold">{t('robo-apollo-guide')}</p>
          <GuideSteps
            color="bg-sky-500"
            steps={[
              { q: 'robo-ap-s1', a: 'robo-ap-s1-sub' },
              { q: 'robo-ap-s2', a: 'robo-ap-s2-sub' },
              { q: 'robo-ap-s3', a: 'robo-ap-s3-sub' },
              { q: 'robo-ap-s4', a: 'robo-ap-s4-sub' },
            ]}
          />
        </div>
        <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-3">
          <p className="text-[10px] text-fuchsia-400 font-semibold">{t('robo-pony-guide')}</p>
          <GuideSteps
            color="bg-fuchsia-500"
            steps={[
              { q: 'robo-po-s1', a: 'robo-po-s1-sub' },
              { q: 'robo-po-s2', a: 'robo-po-s2-sub' },
              { q: 'robo-po-s3', a: 'robo-po-s3-sub' },
              { q: 'robo-po-s4', a: 'robo-po-s4-sub' },
            ]}
          />
        </div>
      </div>

      {/* Night operation */}
      <div className="glass-panel rounded-2xl border border-sky-500/30 p-4 space-y-2">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <Moon className="w-4 h-4" />{t('robo-night-title')}
        </h3>
        <p className="text-xs text-slate-300">{t('robo-night-desc')}</p>
        <div className="flex flex-wrap gap-2">
          {['Pingshan', 'Nanshan', 'Futian'].map((z) => (
            <span key={z} className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full text-[10px]">{z}</span>
          ))}
        </div>
        <p className="text-[10px] text-slate-400">{t('robo-night-hours')}</p>
      </div>

      {/* Tips */}
      <div className="glass-panel rounded-2xl border border-yellow-500/20 p-4 space-y-2">
        <h3 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />{t('robo-tips-title')}
        </h3>
        <ul className="space-y-2">
          {(['robo-tip-1', 'robo-tip-2', 'robo-tip-3', 'robo-tip-4'] as const).map((k) => (
            <li key={k} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="text-yellow-400 mt-0.5">✓</span>{t(k)}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div className="glass-panel rounded-2xl border border-slate-700 p-4 space-y-4">
        <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />{t('robo-faq-title')}
        </h3>
        {[
          { q: 'robo-faq-q1', a: 'robo-faq-a1' },
          { q: 'robo-faq-q2', a: 'robo-faq-a2' },
          { q: 'robo-faq-q3', a: 'robo-faq-a3' },
        ].map((item) => (
          <div key={item.q}>
            <p className="text-xs font-medium text-white flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />{t(item.q)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 pl-5">{t(item.a)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
