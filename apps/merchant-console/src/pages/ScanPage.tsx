import { useState, useRef, useCallback, useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { apiPost } from '../lib/api'
import type { MerchantProfile } from '../App'

interface RedeemRecord {
  redemptionId: string
  passId: string
  merchantId: string
  redeemedAt: string
}

interface RedeemResult {
  success: boolean
  message: string
  record?: RedeemRecord
}

interface ScanPageProps {
  merchantId: string
  onLogout: () => void
  profile: MerchantProfile
  onProfileChange: (next: MerchantProfile) => void
}

export function ScanPage({ merchantId, onLogout, profile, onProfileChange }: ScanPageProps) {
  const [passIdInput, setPassIdInput] = useState('')
  const [hmacInput, setHmacInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RedeemResult | null>(null)
  const [records, setRecords] = useState<RedeemRecord[]>([])
  const [scanning, setScanning] = useState(false)
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem(`snx-merchant-open-${merchantId}`)
    return saved !== null ? saved === 'true' : true
  })

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerDivId = 'qr-reader'

  const toggleOpen = () => {
    const next = !isOpen
    setIsOpen(next)
    localStorage.setItem(`snx-merchant-open-${merchantId}`, String(next))
  }

  const updateService = (key: keyof MerchantProfile['services'], value: boolean) => {
    onProfileChange({
      ...profile,
      services: {
        ...profile.services,
        [key]: value,
      },
    })
  }

  const redeem = useCallback(async (passId: string, hmac: string) => {
    setLoading(true)
    setResult(null)
    try {
      const data = await apiPost<RedeemRecord>(`/passes/${passId}/redeem`, { merchantId, hmac })
      const success: RedeemResult = { success: true, message: `核销成功！ID: ${data.redemptionId}`, record: data }
      setResult(success)
      setRecords((prev) => [data, ...prev])
      setPassIdInput('')
      setHmacInput('')
    } catch (e: any) {
      setResult({ success: false, message: e.message || '核销失败' })
    } finally {
      setLoading(false)
    }
  }, [merchantId])

  const handleManualRedeem = () => {
    if (!passIdInput.trim() || !hmacInput.trim()) return
    redeem(passIdInput.trim(), hmacInput.trim())
  }

  const handleQrScan = useCallback(async (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText)
      if (data.passId && data.hmac) {
        if (scannerRef.current) {
          await scannerRef.current.stop()
          setScanning(false)
        }
        redeem(data.passId, data.hmac)
      }
    } catch {
      // ignore
    }
  }, [redeem])

  const startScan = async () => {
    setResult(null)
    const scanner = new Html5Qrcode(scannerDivId)
    scannerRef.current = scanner
    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleQrScan,
        () => {},
      )
      setScanning(true)
    } catch (err: any) {
      setResult({ success: false, message: `摄像头启动失败: ${err.message || err}` })
    }
  }

  const stopScan = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch {
        // ignore
      }
      setScanning(false)
    }
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold">商户核销</h1>
          <p className="text-xs text-slate-400">{merchantId}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleOpen}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
              isOpen
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {isOpen ? '● 营业中' : '○ 已打烊'}
          </button>
          <button className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition" onClick={onLogout}>
            登出
          </button>
        </div>
      </header>

      {!isOpen && (
        <div className="max-w-md mx-auto mt-4 px-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-amber-300">当前状态：已打烊</p>
            <p className="text-xs text-slate-400 mt-1">点击右上角切换为"营业中"以开始核销</p>
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto p-4 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-bold">服务能力与优惠配置</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['englishService', '英文服务'],
              ['foreignCard', '外卡支付'],
              ['privateRoom', '包厢可订'],
              ['conciergeSupport', '礼宾支持'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.services[key as keyof MerchantProfile['services']]}
                  onChange={(e) => updateService(key as keyof MerchantProfile['services'], e.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            placeholder="优惠信息，例如：APEC 代表 9 折"
            value={profile.discountText}
            onChange={(e) => onProfileChange({ ...profile, discountText: e.target.value })}
          />
          <p className="text-[10px] text-slate-500">配置将保存在本地浏览器，供运营后台后续接入。</p>
        </div>

        <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 ${!isOpen ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">扫码核销</p>
            {!scanning ? (
              <button className="text-xs bg-sky-500 hover:bg-sky-400 px-3 py-1.5 rounded-lg font-bold transition" onClick={startScan}>
                启动摄像头
              </button>
            ) : (
              <button className="text-xs bg-rose-500 hover:bg-rose-400 px-3 py-1.5 rounded-lg font-bold transition" onClick={stopScan}>
                停止扫描
              </button>
            )}
          </div>
          <div id={scannerDivId} className="rounded-xl overflow-hidden" style={{ minHeight: scanning ? 280 : 0 }} />
        </div>

        <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 ${!isOpen ? 'opacity-50 pointer-events-none' : ''}`}>
          <p className="text-sm font-bold">手动输入</p>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            placeholder="Pass ID (PASS-...)"
            value={passIdInput}
            onChange={(e) => setPassIdInput(e.target.value)}
          />
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            placeholder="HMAC 签名"
            value={hmacInput}
            onChange={(e) => setHmacInput(e.target.value)}
          />
          <button
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition"
            disabled={loading || !passIdInput.trim() || !hmacInput.trim()}
            onClick={handleManualRedeem}
          >
            {loading ? '核销中...' : '确认核销'}
          </button>
        </div>

        {result && (
          <div className={`rounded-2xl p-4 border ${result.success ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
            <p className={`text-sm font-bold ${result.success ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.success ? '✓ ' : '✗ '}{result.message}
            </p>
          </div>
        )}

        {records.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">今日核销记录 ({records.length})</p>
            {records.map((r) => (
              <div key={r.redemptionId} className="bg-slate-900 border border-emerald-500/20 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white font-semibold">{r.redemptionId}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">已核销</span>
                </div>
                <p className="text-[10px] text-slate-400">passId: {r.passId}</p>
                <p className="text-[10px] text-slate-400">{new Date(r.redeemedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
