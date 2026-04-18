import { useAppStore } from '../stores/useAppStore'

export function AnalyticsFunnel() {
  const events = useAppStore((s) => s.events)

  const count = (prefix: string) => events.filter((e) => e.eventName.startsWith(prefix)).length

  const stages = [
    { label: 'Exposure', key: 'leaderboard_exposure', color: 'bg-sky-500' },
    { label: 'Card Click', key: 'spot_card_click', color: 'bg-indigo-500' },
    { label: 'CTA Click', key: 'fusion_cta_click', color: 'bg-fuchsia-500' },
    { label: 'Payment', key: 'payment_success', color: 'bg-emerald-500' },
    { label: 'Redeem', key: 'redeem_success', color: 'bg-amber-500' },
  ]

  const maxCount = Math.max(...stages.map((s) => count(s.key)), 1)

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl border border-slate-700 p-5 space-y-4">
        {stages.map((stage) => {
          const c = count(stage.key)
          const pct = Math.round((c / maxCount) * 100)
          return (
            <div key={stage.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">{stage.label}</span>
                <span className="text-xs text-slate-500">{c}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${stage.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass-panel rounded-2xl border border-slate-700 p-4">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Raw Events ({events.length})</p>
        <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
          {[...events].reverse().slice(0, 50).map((e, i) => (
            <div key={i} className="text-[10px] text-slate-400 flex items-center justify-between py-1 border-b border-slate-800/50">
              <span className="text-sky-400 font-mono">{e.eventName}</span>
              <span className="text-slate-600">{new Date(e.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
