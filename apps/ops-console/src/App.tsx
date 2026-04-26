import { useEffect, useMemo, useState } from 'react'
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './lib/api'

interface Order {
  orderId: string
  spotId: string
  merchantId: string
  merchantName: string
  serviceType: string
  amount: number
  status: string
  createdAt: string
}

interface Pass {
  passId: string
  spotId: string
  merchantId: string
  merchantName: string
  status: string
  claimedAt: string
  expiresAt: string
}

interface Spot {
  id: string
  category: string
  rank: string
  title: { en: string; zh: string }
  subtitle: { en: string; zh: string }
  merchants?: Merchant[]
}

interface Merchant {
  merchantId: string
  spotId: string
  name: { en: string; zh: string }
  distance: { en: string; zh: string }
  reason: { en: string; zh: string }
  tags: Array<{ en: string; zh: string }>
  status: 'available' | 'paused'
  weight?: number
  sortOrder?: number
}

interface PassConfig {
  spotId: string
  merchantId: string
  enabled: boolean
  quota: number
  expiresHours: number
  note?: string
  updatedAt: string
}

interface AiLogSummary {
  total: number
  success: number
  failed: number
  successRate: number
  avgLatencyMs: number
}

interface AiLog {
  id: string
  kind: 'chat' | 'plan' | 'vision'
  ok: boolean
  latencyMs: number
  model: string
  errorCode: string | null
  createdAt: string
}

type Tab = 'dashboard' | 'spots' | 'relations' | 'orders' | 'passes' | 'ai'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    pending_payment: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    failed: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    cancelled: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    refunded: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    redeemed: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    available: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    paused: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${map[status] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
      {status}
    </span>
  )
}

function Dashboard({ orders, passes, aiSummary }: { orders: Order[]; passes: Pass[]; aiSummary: AiLogSummary }) {
  const paid = orders.filter((o) => o.status === 'paid').length
  const pending = orders.filter((o) => o.status === 'pending_payment').length
  const revenue = orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.amount, 0)
  const redeemed = passes.filter((p) => p.status === 'redeemed').length
  const active = passes.filter((p) => p.status === 'active').length

  const stats = [
    { label: '总订单', value: orders.length, sub: `${paid} 已支付 · ${pending} 待支付` },
    { label: '总收入 (¥)', value: revenue.toLocaleString(), sub: '已支付订单合计' },
    { label: 'Pass 总量', value: passes.length, sub: `${active} 有效 · ${redeemed} 已核销` },
    { label: 'AI 成功率', value: `${aiSummary.successRate}%`, sub: `近 ${aiSummary.total} 次 · 平均 ${aiSummary.avgLatencyMs}ms` },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">运营看板</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
            <p className="text-[10px] text-slate-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpotsView({ spots, onReload }: { spots: Spot[]; onReload: () => Promise<void> }) {
  const [form, setForm] = useState({ id: '', category: 'landmark', rank: '#99', zh: '', en: '', subZh: '', subEn: '' })
  const [submitting, setSubmitting] = useState(false)

  const createSpot = async () => {
    if (!form.id.trim() || !form.zh.trim() || !form.en.trim()) return
    setSubmitting(true)
    try {
      await apiPost('/spots', {
        id: form.id.trim(),
        category: form.category,
        rank: form.rank,
        title: { zh: form.zh.trim(), en: form.en.trim() },
        subtitle: { zh: form.subZh.trim() || form.zh.trim(), en: form.subEn.trim() || form.en.trim() },
      })
      setForm({ id: '', category: 'landmark', rank: '#99', zh: '', en: '', subZh: '', subEn: '' })
      await onReload()
    } finally {
      setSubmitting(false)
    }
  }

  const deleteSpot = async (id: string) => {
    await apiDelete(`/spots/${id}`)
    await onReload()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Spot CRUD</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold">新建 Spot</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="id" value={form.id} onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))} />
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="rank" value={form.rank} onChange={(e) => setForm((f) => ({ ...f, rank: e.target.value }))} />
          <select className="bg-slate-800 border border-slate-700 rounded-lg p-2" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            <option value="landmark">landmark</option>
            <option value="tech">tech</option>
            <option value="culture">culture</option>
            <option value="food">food</option>
          </select>
          <div />
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="中文标题" value={form.zh} onChange={(e) => setForm((f) => ({ ...f, zh: e.target.value }))} />
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="English title" value={form.en} onChange={(e) => setForm((f) => ({ ...f, en: e.target.value }))} />
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="中文副标题" value={form.subZh} onChange={(e) => setForm((f) => ({ ...f, subZh: e.target.value }))} />
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="English subtitle" value={form.subEn} onChange={(e) => setForm((f) => ({ ...f, subEn: e.target.value }))} />
        </div>
        <button className="text-xs bg-sky-500 hover:bg-sky-400 px-3 py-2 rounded-lg font-bold disabled:opacity-50" disabled={submitting} onClick={createSpot}>创建</button>
      </div>

      <div className="space-y-2">
        {spots.map((s) => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{s.title?.zh || s.id} <span className="text-xs text-slate-500">({s.id})</span></p>
              <p className="text-xs text-slate-400">{s.category} · {s.rank} · {s.merchants?.length ?? 0} 家商户</p>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300" onClick={() => deleteSpot(s.id)}>删除</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function RelationsView({ spots, merchants, onReload }: { spots: Spot[]; merchants: Merchant[]; onReload: () => Promise<void> }) {
  const [selected, setSelected] = useState<Merchant | null>(null)
  const [newMerchant, setNewMerchant] = useState({ merchantId: '', spotId: spots[0]?.id || '', zh: '', en: '' })

  const createMerchant = async () => {
    if (!newMerchant.merchantId.trim() || !newMerchant.spotId || !newMerchant.zh.trim() || !newMerchant.en.trim()) return
    await apiPost('/spots/merchants', {
      merchantId: newMerchant.merchantId.trim(),
      spotId: newMerchant.spotId,
      name: { zh: newMerchant.zh.trim(), en: newMerchant.en.trim() },
      distance: { zh: '步行 5 分钟', en: '5 min walk' },
      reason: { zh: '运营后台创建', en: 'Created from ops console' },
      tags: [],
      status: 'available',
      weight: 50,
      sortOrder: 100,
    })
    setNewMerchant({ merchantId: '', spotId: spots[0]?.id || '', zh: '', en: '' })
    await onReload()
  }

  const saveMerchant = async () => {
    if (!selected) return
    await apiPatch(`/spots/merchants/${selected.merchantId}`, selected)
    await onReload()
  }

  const removeMerchant = async (merchantId: string) => {
    await apiDelete(`/spots/merchants/${merchantId}`)
    setSelected((s) => (s?.merchantId === merchantId ? null : s))
    await onReload()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Spot-商户关系配置</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold">新增商户</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="merchantId" value={newMerchant.merchantId} onChange={(e) => setNewMerchant((m) => ({ ...m, merchantId: e.target.value }))} />
          <select className="bg-slate-800 border border-slate-700 rounded-lg p-2" value={newMerchant.spotId} onChange={(e) => setNewMerchant((m) => ({ ...m, spotId: e.target.value }))}>
            {spots.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
          </select>
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="商户中文名" value={newMerchant.zh} onChange={(e) => setNewMerchant((m) => ({ ...m, zh: e.target.value }))} />
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="merchant name(en)" value={newMerchant.en} onChange={(e) => setNewMerchant((m) => ({ ...m, en: e.target.value }))} />
        </div>
        <button className="text-xs bg-sky-500 hover:bg-sky-400 px-3 py-2 rounded-lg font-bold" onClick={createMerchant}>创建商户</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {merchants.map((m) => (
            <div key={m.merchantId} className={`bg-slate-900 border rounded-xl p-3 ${selected?.merchantId === m.merchantId ? 'border-sky-500' : 'border-slate-800'}`}>
              <button className="w-full text-left" onClick={() => setSelected(m)}>
                <p className="text-sm font-semibold text-white">{m.name?.zh || m.merchantId}</p>
                <p className="text-[10px] text-slate-400">{m.merchantId} · spot: {m.spotId}</p>
                <p className="text-[10px] text-slate-500">weight {m.weight ?? 50} · sort {m.sortOrder ?? 100}</p>
              </button>
              <div className="mt-2"><StatusBadge status={m.status || 'available'} /></div>
              <button className="mt-2 text-[10px] px-2 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300" onClick={() => removeMerchant(m.merchantId)}>删除</button>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-semibold">编辑关系</p>
          {!selected && <p className="text-xs text-slate-500">请先选择左侧商户</p>}
          {selected && (
            <>
              <input className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs" value={selected.name?.zh || ''} onChange={(e) => setSelected((m) => m ? ({ ...m, name: { ...m.name, zh: e.target.value } }) : m)} />
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs" value={selected.spotId} onChange={(e) => setSelected((m) => m ? ({ ...m, spotId: e.target.value }) : m)}>
                {spots.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs" value={selected.weight ?? 50} onChange={(e) => setSelected((m) => m ? ({ ...m, weight: Number(e.target.value) }) : m)} />
                <input type="number" className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs" value={selected.sortOrder ?? 100} onChange={(e) => setSelected((m) => m ? ({ ...m, sortOrder: Number(e.target.value) }) : m)} />
              </div>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs" value={selected.status || 'available'} onChange={(e) => setSelected((m) => m ? ({ ...m, status: e.target.value as 'available' | 'paused' }) : m)}>
                <option value="available">available</option>
                <option value="paused">paused</option>
              </select>
              <button className="w-full text-xs bg-emerald-500 hover:bg-emerald-400 px-3 py-2 rounded-lg font-bold" onClick={saveMerchant}>保存关系配置</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function PassesView({ passes, spots, merchants, passConfigs, onReload }: { passes: Pass[]; spots: Spot[]; merchants: Merchant[]; passConfigs: PassConfig[]; onReload: () => Promise<void> }) {
  const [cfg, setCfg] = useState({ spotId: spots[0]?.id || '', merchantId: merchants[0]?.merchantId || '', enabled: true, quota: 100, expiresHours: 72, note: '' })

  const saveConfig = async () => {
    if (!cfg.spotId || !cfg.merchantId) return
    await apiPut('/pass-configs', cfg)
    await onReload()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Pass 管理与活动配置</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold">配置 Pass 活动</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <select className="bg-slate-800 border border-slate-700 rounded-lg p-2" value={cfg.spotId} onChange={(e) => setCfg((c) => ({ ...c, spotId: e.target.value }))}>
            {spots.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg p-2" value={cfg.merchantId} onChange={(e) => setCfg((c) => ({ ...c, merchantId: e.target.value }))}>
            {merchants.map((m) => <option key={m.merchantId} value={m.merchantId}>{m.merchantId}</option>)}
          </select>
          <input type="number" className="bg-slate-800 border border-slate-700 rounded-lg p-2" value={cfg.quota} onChange={(e) => setCfg((c) => ({ ...c, quota: Number(e.target.value) }))} />
          <input type="number" className="bg-slate-800 border border-slate-700 rounded-lg p-2" value={cfg.expiresHours} onChange={(e) => setCfg((c) => ({ ...c, expiresHours: Number(e.target.value) }))} />
          <input className="bg-slate-800 border border-slate-700 rounded-lg p-2 col-span-2" placeholder="备注" value={cfg.note} onChange={(e) => setCfg((c) => ({ ...c, note: e.target.value }))} />
        </div>
        <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={cfg.enabled} onChange={(e) => setCfg((c) => ({ ...c, enabled: e.target.checked }))} /> enabled</label>
        <button className="text-xs bg-sky-500 hover:bg-sky-400 px-3 py-2 rounded-lg font-bold" onClick={saveConfig}>保存配置</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Pass 列表 ({passes.length})</p>
          {passes.slice(0, 20).map((p) => (
            <div key={p.passId} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{p.passId}</span>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-[10px] text-slate-400">{p.merchantName} · {p.spotId}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">活动配置 ({passConfigs.length})</p>
          {passConfigs.map((c) => (
            <div key={`${c.spotId}-${c.merchantId}`} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
              <p className="text-xs text-white font-semibold">{c.spotId} · {c.merchantId}</p>
              <p className="text-[10px] text-slate-400">quota {c.quota} · {c.expiresHours}h · {c.enabled ? 'enabled' : 'disabled'}</p>
              <p className="text-[10px] text-slate-500">{new Date(c.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrdersView({ orders }: { orders: Order[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">订单管理</h2>
      <div className="space-y-2">
        {orders.length === 0 && <p className="text-sm text-slate-500 text-center py-8">暂无订单</p>}
        {orders.map((o) => (
          <div key={o.orderId} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">{o.orderId}</span>
              <StatusBadge status={o.status} />
            </div>
            <p className="text-[10px] text-slate-400">{o.merchantName} · {o.serviceType} · ¥{o.amount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AiLogsView({ summary, logs }: { summary: AiLogSummary; logs: AiLog[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">AI 请求日志与监控</h2>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-[10px] text-slate-400">总请求</p><p className="text-xl font-bold">{summary.total}</p></div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-[10px] text-slate-400">成功</p><p className="text-xl font-bold text-emerald-300">{summary.success}</p></div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-[10px] text-slate-400">失败</p><p className="text-xl font-bold text-rose-300">{summary.failed}</p></div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-[10px] text-slate-400">平均耗时</p><p className="text-xl font-bold text-sky-300">{summary.avgLatencyMs}ms</p></div>
      </div>

      <div className="space-y-2">
        {logs.map((l) => (
          <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">{l.kind} · {l.model}</p>
              <p className="text-[10px] text-slate-400">{new Date(l.createdAt).toLocaleString()} · {l.latencyMs}ms</p>
            </div>
            <StatusBadge status={l.ok ? 'available' : 'failed'} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [spots, setSpots] = useState<Spot[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [passes, setPasses] = useState<Pass[]>([])
  const [passConfigs, setPassConfigs] = useState<PassConfig[]>([])
  const [aiSummary, setAiSummary] = useState<AiLogSummary>({ total: 0, success: 0, failed: 0, successRate: 0, avgLatencyMs: 0 })
  const [aiLogs, setAiLogs] = useState<AiLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const merchants = useMemo(() => spots.flatMap((s) => s.merchants || []), [spots])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [spotsRes, ordersRes, passesRes, passCfgRes, aiLogsRes] = await Promise.all([
        apiGet<{ items: Spot[] }>('/spots?pageSize=100'),
        apiGet<Order[]>('/orders'),
        apiGet<Pass[]>('/passes'),
        apiGet<PassConfig[]>('/pass-configs'),
        apiGet<{ summary: AiLogSummary; items: AiLog[] }>('/ai/logs'),
      ])
      setSpots(spotsRes.items || [])
      setOrders(Array.isArray(ordersRes) ? ordersRes : [])
      setPasses(Array.isArray(passesRes) ? passesRes : [])
      setPassConfigs(Array.isArray(passCfgRes) ? passCfgRes : [])
      setAiSummary(aiLogsRes.summary)
      setAiLogs(aiLogsRes.items || [])
    } catch (e: any) {
      setError(e.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: '看板' },
    { id: 'spots', label: 'Spot CRUD' },
    { id: 'relations', label: '关系配置' },
    { id: 'orders', label: '订单' },
    { id: 'passes', label: 'Pass 配置' },
    { id: 'ai', label: 'AI 日志' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-bold">Shenzhen Nexus — 运营后台</h1>
        <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800" onClick={() => void load()}>刷新</button>
      </header>

      <nav className="bg-slate-900 border-b border-slate-800 px-4 flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
              tab === t.id ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="max-w-5xl mx-auto p-4">
        {loading && <p className="text-sm text-slate-400 text-center py-12">加载中...</p>}
        {error && <p className="text-sm text-rose-400 text-center py-12">{error}</p>}
        {!loading && !error && (
          <>
            {tab === 'dashboard' && <Dashboard orders={orders} passes={passes} aiSummary={aiSummary} />}
            {tab === 'spots' && <SpotsView spots={spots} onReload={load} />}
            {tab === 'relations' && <RelationsView spots={spots} merchants={merchants} onReload={load} />}
            {tab === 'orders' && <OrdersView orders={orders} />}
            {tab === 'passes' && <PassesView passes={passes} spots={spots} merchants={merchants} passConfigs={passConfigs} onReload={load} />}
            {tab === 'ai' && <AiLogsView summary={aiSummary} logs={aiLogs} />}
          </>
        )}
      </main>
    </div>
  )
}
